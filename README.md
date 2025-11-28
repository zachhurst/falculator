# Fal-culator

A simple utility that extracts pricing information from fal.ai screenshots using Google's Gemini AI. Born from a Twitter conversation about confusing fal.ai pricing, built in 16 hours over Thanksgiving weekend.

> "Not everyone wants to do equations to know price" - @atwilkinson_  
> "Maybe a Thanksgiving project? 🤔" - @zachhurst

## Features

### Core Functionality
- **Screenshot Analysis** - Upload any fal.ai pricing screenshot for instant parsing
- **Multi-Model Support** - Works with image generation, video processing, GPU time, and free tier pricing
- **Structured Output** - Clean breakdowns showing cost per image, runs per dollar, and resolution-specific pricing
- **Real-time Processing** - Get results in seconds with visual loading states

### User Experience
- **Dual BYOK Architecture** - Choose between Google Gemini or Fal.ai API keys
- **No Data Collection** - We don't store your images, API keys, or usage data
- **API Key Masking** - Your API key is masked by default with reveal toggle
- **Provider Selection** - Switch between Gemini and Fal.ai with one click
- **Examples Gallery** - See sample inputs and results before trying
- **Responsive Design** - Works perfectly on desktop and mobile devices

### Security & Privacy
- **Local Storage Only** - API keys stored in browser localStorage
- **Direct to Google** - Keys transmitted directly to Google's servers
- **No Server Storage** - Images processed but never saved
- **Open Source** - Fully transparent codebase you can inspect

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS v4
- **Backend**: Supabase Edge Functions (Deno runtime)
- **AI**: Google Gemini 2.0 Flash API + Fal.ai OpenRouter Vision (Gemini 2.5 Flash)
- **Hosting**: Netlify (frontend) + Supabase (functions)
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm package manager
- Google Gemini API key OR Fal.ai API key
- Supabase account (free tier works)

### 1. Clone and Install

```bash
git clone https://github.com/zachhurst/falculator.git
cd falculator
pnpm install
```

### 2. Environment Setup

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Supabase Setup

Deploy the Edge Function and set your Gemini API key:

```bash
# Deploy the function
npx supabase functions deploy image-parser

# Set your Gemini API key
npx supabase secrets set GEMINI_API_KEY=your-gemini-api-key
```

### 4. Run Locally

```bash
pnpm dev
```

Visit `http://localhost:5173` and start using Fal-culator!

## How It Works

1. **Choose Provider** - Select Google Gemini or Fal.ai as your AI provider
2. **Upload Screenshot** - Drag & drop or select any fal.ai pricing image
3. **AI Processing** - Image is sent to your chosen provider via Supabase Edge Function
4. **Structured Output** - Get clean pricing breakdowns for all models/resolutions
5. **Cost Calculations** - See cost per image, runs per $10, and total estimates

### Supported Pricing Models
- **Per Megapixel** - Image generation with resolution-based scaling
- **Per Second Video** - Video processing with duration-based pricing  
- **Per Image** - Flat rate per image regardless of resolution
- **GPU Time** - Hourly GPU rental costs
- **Free Tiers** - Usage limits and quota information

## Architecture

### BYOK (Bring Your Own Key) Design
- Users provide their own Gemini or Fal.ai API key
- Keys never touch our servers
- Direct browser → Provider API communication
- Users stay on their own pricing quotas

### Multi-Provider Architecture
- **Google Gemini**: Direct API integration with Gemini 2.0 Flash
- **Fal.ai**: OpenRouter Vision endpoint with Gemini 2.5 Flash
- Provider auto-detection and seamless switching
- Consistent output format regardless of provider

### Privacy-First Approach
- No cookies or tracking
- No analytics or data collection
- Images processed but never stored
- API keys stored locally in browser only

## Deployment

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

### Manual Build
```bash
pnpm build
# Deploy dist/ folder to your hosting provider
```

## Contributing

This is an open source project! Contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this code for your own projects.

## Support

- 🐛 **Bug Reports**: Open an issue on GitHub
- 💡 **Feature Requests**: Open an issue with the "enhancement" label
- 📧 **Security Issues**: Please report privately

## Acknowledgments

- **@atwilkinson_** - For calling out confusing fal.ai pricing
- **@GiusMarci** - For agreeing that per-second image pricing is weird
- **Google** - For the Gemini 2.0 Flash API
- **Fal.ai** - For OpenRouter Vision and Gemini 2.5 Flash access
- **Supabase** - For excellent Edge Functions
- **fal.ai** - For the complex pricing that inspired this tool

---

**Built with ❤️ in 16 hours over Thanksgiving weekend**
