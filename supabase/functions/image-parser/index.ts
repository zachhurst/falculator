import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { GoogleGenerativeAI, SchemaType } from "npm:@google/generative-ai@^0.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PriceSchema = {
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

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      console.error("GEMINI_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: PriceSchema,
      },
    });

    const prompt = `Analyze the attached image which contains pricing information from fal.ai.
Extract the following information:
1. cost_per_image: The cost per image/run in dollars (as a decimal number, e.g., 0.039)
2. runs_per_dollar: The number of runs/images you can generate for $1.00 (as an integer)

Look for text patterns like:
- "$X.XX per image" or "costs $X.XX"
- "For $1.00, you can run this model X times"
- Any pricing table or cost breakdown

Format your response according to the provided schema.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/png",
          data: image,
        },
      },
    ]);

    const response = result.response;
    const text = response.text();
    
    // Parse the JSON response
    const priceData = JSON.parse(text);

    // Validate the response has required fields
    if (typeof priceData.cost_per_image !== "number" || typeof priceData.runs_per_dollar !== "number") {
      return new Response(
        JSON.stringify({ 
          error: "Could not find pricing information in the image. Please make sure your screenshot includes the cost details." 
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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
