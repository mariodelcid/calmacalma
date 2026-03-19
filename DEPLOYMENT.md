# Deployment Guide

Your Ember journal app is ready to deploy! Here's how to get it live.

## Current Setup

Your app now includes:
- Supabase database for storing journal entries and user settings
- User authentication ready to implement
- Production build configuration

## Database

The Supabase database is already configured with:
- `users_settings` table for user preferences (theme, character, lens, PIN)
- `journal_entries` table for journal entries with tags, mood, and AI responses
- Row Level Security (RLS) policies to protect user data

## Deployment Options

### Option 1: Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project" and select your repository
4. Vercel will auto-detect it's a React app
5. Deploy!

### Option 2: Railway

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables (see below)
6. Railway will auto-detect settings
7. Deploy!

### Option 3: Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Select your repository
5. Build command: `npm run build`
6. Publish directory: `build`
7. Deploy!

### Option 4: Static Hosting

Run `npm run build` to create a production build in the `build` folder, then upload to any static host:
- AWS S3 + CloudFront
- Firebase Hosting
- GitHub Pages
- Any web server

## Next Steps

### Add Authentication

To enable user login and protect data:

1. Users can sign up and log in
2. Each user gets their own private journal entries
3. Settings are saved per user

Let me know if you want to add authentication!

### Connect AI for Lens Responses

Currently the app shows sample entries. To enable real AI responses:
- Set up an OpenAI API key
- Create a Supabase Edge Function to generate AI responses
- Connect it to the journal entry flow

### Enable Real Payments (Shop)

The shop feature is ready - just needs:
- Stripe account
- Payment integration
- Product inventory

## Environment Variables

For production deployment, set these in your hosting platform:
- `REACT_APP_SUPABASE_URL` - Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY` - Your Supabase anonymous key

These are already in your `.env` file for local development.
