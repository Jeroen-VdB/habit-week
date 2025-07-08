# Habit Week - Weekly Habit Tracker

A simple, beautiful habit tracker for planning your week. Built with Astro, Svelte, and shadcn-svelte.

## Features

- 📅 Weekly grid view with morning, afternoon, and evening slots
- 🎨 Color-coded habits with custom categories
- 💾 Local storage for offline use
- ☁️ Google Drive sync for data backup
- 📊 Privacy-focused analytics with Umami
- 🐛 Error tracking with Sentry
- 📱 Mobile responsive design

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and fill in your API keys:
   ```bash
   cp .env.example .env
   ```

4. Configure Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google Drive API
   - Create OAuth 2.0 credentials
   - Add authorized JavaScript origins (e.g., `http://localhost:4321`, your production URL)
   - Copy the Client ID to your `.env` file

5. (Optional) Set up Umami Analytics:
   - For Umami Cloud: Sign up at [umami.is](https://umami.is) and get your website ID
   - For self-hosted: Deploy Umami and set `PUBLIC_UMAMI_URL` to your instance URL
   - Add your website ID to `PUBLIC_UMAMI_WEBSITE_ID` in `.env`

6. Run development server:
   ```bash
   npm run dev
   ```

## Deployment to Render

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New +" and select "Static Site"
4. Connect your GitHub repository
5. Use these settings:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
6. Add environment variables:
   - `PUBLIC_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
   - `PUBLIC_REDIRECT_URI`: Your production URL
   - `PUBLIC_SENTRY_DSN`: (Optional) Your Sentry DSN
   - `PUBLIC_UMAMI_WEBSITE_ID`: (Optional) Your Umami website ID
   - `PUBLIC_UMAMI_URL`: (Optional) Your self-hosted Umami URL

The `render.yaml` file is already configured for automatic deployment.

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **Framework**: [Astro](https://astro.build) - Static site generator
- **UI Components**: [Svelte](https://svelte.dev) + [shadcn-svelte](https://www.shadcn-svelte.com)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Data Storage**: Google Drive API
- **Error Tracking**: [Sentry](https://sentry.io)
- **Analytics**: [Umami](https://umami.is)
- **Hosting**: [Render](https://render.com)

## License

MIT