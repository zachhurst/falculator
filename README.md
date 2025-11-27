# Fal-culator

A simple web application that extracts pricing information from fal.ai screenshots using Google's Gemini VLM.

## Features

- **Drag & drop image upload** - Support for PNG, JPG, JPEG, WebP
- **AI-powered extraction** - Uses Gemini 1.5 Pro with structured output
- **Clean pricing breakdown** - Shows cost per image and runs per dollar

## Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Supabase Edge Functions (Deno)
- **AI**: Google Gemini 1.5 Pro
- **Hosting**: Netlify

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

### 3. Set up Supabase secrets

Add your Gemini API key to Supabase:

```bash
npx supabase secrets set GEMINI_API_KEY=your-api-key
```

### 4. Deploy Edge Function

```bash
npx supabase functions deploy image-parser
```

### 5. Run development server

```bash
pnpm dev
```

## Deployment

The frontend is configured for Netlify deployment. Push to your connected Git repository to trigger a deploy.
