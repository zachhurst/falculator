import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { GoogleGenerativeAI, SchemaType } from "npm:@google/generative-ai@^0.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-gemini-key, x-falai-key",
};

const FalPricingSchema = {
  type: SchemaType.OBJECT,
  properties: {
    // Internal use only - not in PRD but helpful for versioning
    schema_version: {
      type: SchemaType.STRING,
      enum: ["v1", "v2"],
      description: "Schema version for backward compatibility",
      nullable: true
    },
    pricing_unit: {
      type: SchemaType.STRING,
      enum: ["PER_MEGAPIXEL","PER_IMAGE","PER_SECOND_VIDEO","PER_VIDEO","PER_SECOND_GPU","FREE","UNKNOWN"]
    },
    base_cost: { type: SchemaType.NUMBER },
    gpu_type: { type: SchemaType.STRING, nullable: true },
    resolutions: {
      type: SchemaType.ARRAY,
      nullable: true,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          width: { type: SchemaType.INTEGER },
          height: { type: SchemaType.INTEGER }
        },
        required: ["name","width","height"]
      }
    }
  },
  required: ["pricing_unit","base_cost"]
};

// Keep legacy schema for fallback
const LegacyPriceSchema = {
  type: SchemaType.OBJECT,
  properties: {
    cost_per_image: { 
      type: SchemaType.NUMBER,
      description: "The cost per image/run in dollars"
    },
    runs_per_dollar: { 
      type: SchemaType.INTEGER,
      description: "The number of runs/images you can generate for $1.00"
    },
  },
  required: ["cost_per_image", "runs_per_dollar"],
};

// Fal.ai handler using openrouter/router/vision endpoint with native image support
async function handleFalaiRequest(
  imageBase64: string, 
  apiKey: string, 
  corsHeaders: Record<string, string>
): Promise<Response> {
  console.log("Processing request with Fal.ai OpenRouter Vision endpoint");
  
  try {
    // OpenRouter Vision endpoint - supports native image_urls parameter
    // Using Gemini 2.5 Flash for best price/performance
    const falResponse = await fetch("https://fal.run/openrouter/router/vision", {
      method: "POST",
      headers: {
        "Authorization": `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-preview-05-20",
        prompt: `You are an expert data extraction agent. Analyze this screenshot from a fal.ai model page and extract pricing information.

Your Task:
1. Identify the pricing_unit: PER_MEGAPIXEL, PER_IMAGE, PER_SECOND_VIDEO, PER_VIDEO, PER_SECOND_GPU, FREE, or UNKNOWN
2. Extract the base_cost as a number
3. Find gpu_type if applicable (only for PER_SECOND_GPU)
4. List all resolutions if visible in dropdown menus

Return ONLY valid JSON in this exact format:
{
  "pricing_unit": "PER_MEGAPIXEL",
  "base_cost": 0.005,
  "gpu_type": null,
  "resolutions": [{"name": "1080p", "width": 1920, "height": 1080}],
  "schema_version": "v2"
}`,
        system_prompt: "You are a JSON extraction expert. Always respond with valid JSON only, no markdown or explanation.",
        image_urls: [`data:image/png;base64,${imageBase64}`],
      }),
    });

    if (!falResponse.ok) {
      const errorText = await falResponse.text();
      console.error("Fal.ai API error:", falResponse.status, errorText);
      
      // Check if it's an auth error
      if (falResponse.status === 401 || falResponse.status === 403) {
        return new Response(
          JSON.stringify({ error: "Invalid Fal.ai API key. Please check your key and try again." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          error: `Fal.ai OpenRouter Vision request failed (${falResponse.status}). Please check your API key or try Google Gemini provider.` 
        }),
        { status: falResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const falData = await falResponse.json();
    console.log("Fal.ai response:", JSON.stringify(falData).substring(0, 200));
    
    // Extract the text response from Fal.ai
    const responseText = falData.output || falData.text || falData.response || "";
    
    // Try to parse the JSON from the response
    let priceData;
    try {
      // Try to find JSON in the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        priceData = JSON.parse(jsonMatch[0]);
      } else {
        priceData = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error("Failed to parse Fal.ai response as JSON:", responseText);
      return new Response(
        JSON.stringify({ 
          error: "Could not extract pricing information from the image. Please ensure the screenshot shows fal.ai pricing details." 
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Ensure schema version is set
    priceData.schema_version = "v2";
    
    return new Response(
      JSON.stringify(priceData),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Fal.ai request failed:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Fal.ai request failed. Please try Google Gemini provider." 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { image } = await req.json();

    if (!image || typeof image !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'image' field. Expected base64 string." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract user API keys for BYOK support
    const geminiApiKey = req.headers.get("x-gemini-key");
    const falaiApiKey = req.headers.get("x-falai-key");
    
    // Determine which provider to use
    const provider = falaiApiKey ? "falai" : "gemini";
    const userApiKey = falaiApiKey || geminiApiKey;
    const apiKey = userApiKey || Deno.env.get("GEMINI_API_KEY");
    
    if (!apiKey) {
      console.error("No API key configured and no user key provided");
      return new Response(
        JSON.stringify({ 
          error: "No API key available. Please add your own API key in Advanced Settings to continue." 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Using provider: ${provider}, user key provided: ${!!userApiKey}`);

    // Handle Fal.ai provider
    if (provider === "falai") {
      return await handleFalaiRequest(image, apiKey, corsHeaders);
    }

    // Default to Gemini provider
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Rate limiting for default key usage (required per PRD)
    if (!userApiKey) {
      const clientIP = req.headers.get("x-forwarded-for") || 
                      req.headers.get("x-real-ip") || 
                      "unknown";
      
      // Simple in-memory rate limiting
      const now = Date.now();
      const hourWindow = 60 * 60 * 1000; // 1 hour in milliseconds
      
      // Initialize rate limit tracking if not exists
      if (!global.rateLimitMap) {
        global.rateLimitMap = new Map();
      }
      
      const ipData = global.rateLimitMap.get(clientIP);
      if (ipData && ipData.count >= 10 && (now - ipData.firstRequest) < hourWindow) {
        console.log(`Rate limit exceeded for IP: ${clientIP}`);
        return new Response(
          JSON.stringify({ 
            error: "Rate limit exceeded. Please add your own Gemini API key in Advanced Settings." 
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Update rate limit tracking
      if (ipData && (now - ipData.firstRequest) < hourWindow) {
        ipData.count++;
      } else {
        global.rateLimitMap.set(clientIP, {
          count: 1,
          firstRequest: now
        });
      }
      
      console.log(`Rate limit check passed for IP: ${clientIP}, requests: ${global.rateLimitMap.get(clientIP)?.count || 1}/10`);
    } else {
      console.log("User provided API key - skipping rate limit");
    }

    // Try v2 schema first, fallback to v1 if fails
    let priceData;
    let schemaVersion = "v2";

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: FalPricingSchema,
        },
      });

      const v2Prompt = `You are an expert data extraction agent. Analyze the provided screenshot from a fal.ai model page and populate the required tool schema with perfect accuracy.

Your Task:

1. Identify the pricing_unit:
   Look for keywords like 'per megapixel', 'per image', 'per second of video', or 'per second' on a specific GPU.
   If the text says 'Free', use the FREE unit.
   If the pricing unit is ambiguous but resolution options (width, height) are visible, you MUST assume the unit is PER_MEGAPIXEL.
   If no pricing information can be found, you MUST return UNKNOWN.

2. Extract the base_cost: Find the primary dollar amount associated with the pricing unit. This must be a number.

3. Find the gpu_type: If, and only if, the pricing_unit is PER_SECOND_GPU, identify the GPU model mentioned (e.g., 'A100', 'H100'). Otherwise, this MUST be null.

4. List all resolutions - THIS IS CRITICAL FOR ALL PRICING TYPES:
   IMPORTANT: Resolution dropdowns can appear for ANY pricing type, not just per-megapixel image models.
   
   For IMAGE models (PER_MEGAPIXEL, PER_IMAGE):
   - Look for "Image Size" or resolution dropdown menus
   - Extract options like: Default, Custom, Square HD (1024x1024), Square (1024x1024), Portrait 3:4 (768x1024), Portrait 9:16 (576x1024), Landscape 4:3 (1024x768), Landscape 16:9 (1024x576)
   
   For VIDEO models (PER_SECOND_GPU, PER_SECOND_VIDEO, PER_VIDEO):
   - Look for "Resolution" dropdown menus showing video resolutions
   - Extract options like: 1080p (1920x1080), 720p (1280x720), 480p (854x480), 1440p (2560x1440), 4K/2160p (3840x2160)
   - The dropdown may show values like "1080p", "720p" - you MUST infer the standard dimensions
   
   Standard video resolution mappings:
   - 480p = 854x480
   - 720p = 1280x720  
   - 1080p = 1920x1080
   - 1440p = 2560x1440
   - 2160p/4K = 3840x2160
   
   For each option, extract its name, width, and height.
   If NO resolution/size dropdown is visible or open in the screenshot, this MUST be null.

Adhere strictly to the provided schema. Do not guess or hallucinate data. If a field is not applicable, it must be null.`;

      const result = await model.generateContent([
        v2Prompt,
        {
          inlineData: {
            mimeType: "image/png",
            data: image,
          },
        },
      ]);

      const text = result.response.text();
      priceData = JSON.parse(text);
      priceData.schema_version = "v2";
      console.log("V2 schema extraction successful");
    } catch (v2Error) {
      // Check if this is a schema extraction failure vs network/API failure
      const errorMessage = v2Error instanceof Error ? v2Error.message : String(v2Error);
      
      if (errorMessage.includes("JSON") || errorMessage.includes("parse") || errorMessage.includes("schema")) {
        console.log("V2 schema extraction failed, trying V1 fallback:", v2Error);
        schemaVersion = "v1";
        
        // Execute v1 fallback
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash",
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: LegacyPriceSchema,
          },
        });

        const v1Prompt = `Analyze the attached image which contains pricing information from fal.ai.
Extract the following information:
1. cost_per_image: The cost per image/run in dollars (as a decimal number, e.g., 0.039)
2. runs_per_dollar: The number of runs/images you can generate for $1.00 (as an integer)

Look for text patterns like:
- "$X.XX per image" or "costs $X.XX"
- "For $1.00, you can run this model X times"
- Any pricing table or cost breakdown

Format your response according to the provided schema.`;

        const result = await model.generateContent([
          v1Prompt,
          {
            inlineData: {
              mimeType: "image/png",
              data: image,
            },
          },
        ]);

        const text = result.response.text();
        priceData = JSON.parse(text);
        priceData.schema_version = "v1";
        console.log("V1 schema extraction successful");
      } else {
        // Network/API failure - don't fallback, rethrow
        console.error("V2 network/API failure, not falling back:", v2Error);
        throw v2Error;
      }
    }

    // Ensure priceData is defined before proceeding
    if (!priceData) {
      throw new Error("Failed to extract pricing data with both v2 and v1 schemas");
    }

    // Validate based on schema version with strict PRD rules
    if (schemaVersion === "v2") {
      // Validate Enum
      if (!["PER_MEGAPIXEL","PER_IMAGE","PER_SECOND_VIDEO","PER_VIDEO","PER_SECOND_GPU","FREE","UNKNOWN"].includes(priceData.pricing_unit)) {
        throw new Error("Invalid pricing_unit in v2 schema");
      }
      
      // Enforce rules from PRD with detailed logging
      let correctionsMade = [];
      
      if (priceData.pricing_unit === "FREE" && priceData.base_cost !== 0) {
        const originalCost = priceData.base_cost;
        priceData.base_cost = 0;
        correctionsMade.push(`FREE pricing_unit: base_cost corrected from ${originalCost} to 0`);
      }
      
      if (priceData.pricing_unit !== "PER_SECOND_GPU" && priceData.gpu_type !== null) {
        const originalGpu = priceData.gpu_type;
        priceData.gpu_type = null;
        correctionsMade.push(`non-GPU pricing_unit: gpu_type corrected from "${originalGpu}" to null`);
      }

      if (typeof priceData.base_cost !== "number") {
        throw new Error("Invalid base_cost in v2 schema");
      }
      
      if (correctionsMade.length > 0) {
        console.log("PRD rule corrections applied:", correctionsMade.join("; "));
      } else {
        console.log("V2 schema: No PRD rule corrections needed - VLM complied perfectly");
      }
      
      console.log("V2 schema validation successful");
    } else {
      // V1 validation
      if (typeof priceData.cost_per_image !== "number" || typeof priceData.runs_per_dollar !== "number") {
        throw new Error("Invalid v1 schema fields");
      }
      console.log("V1 schema validation successful");
    }

    return new Response(
      JSON.stringify(priceData),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error processing request:", error);
    
    const message = error instanceof Error ? error.message : "Unknown error";
    const stack = error instanceof Error ? error.stack : "";
    console.error("Error details:", { message, stack });
    
    // Check if it's a JSON parsing error (VLM couldn't extract data)
    if (message.includes("JSON") || message.includes("parse")) {
      return new Response(
        JSON.stringify({ 
          error: "Could not find pricing information in the image. Please make sure your screenshot includes the cost details." 
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
