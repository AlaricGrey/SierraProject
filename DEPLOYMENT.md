# Deployment Guide

## Issues Fixed

### 1. Missing Environment Variable
- **Problem**: The Discord webhook URL was not configured in the deployed environment
- **Solution**: Added `.env` file with placeholder for Discord webhook URL

### 2. Error Handling Improvements  
- **Problem**: Generic error messages didn't help users understand what went wrong
- **Solution**: Added more specific error messages and better logging

## Deployment Steps

### For Local Development:
1. Copy `.env.example` to `.env`
2. Replace `YOUR_WEBHOOK_ID` and `YOUR_WEBHOOK_TOKEN` with your actual Discord webhook credentials
3. Run `npm run dev` or `bun run dev`

### For Production Deployment:

#### Option 1: Netlify
1. In your Netlify dashboard, go to Site Settings > Environment Variables
2. Add `VITE_DISCORD_WEBHOOK_URL` with your Discord webhook URL as the value
3. Redeploy your site

#### Option 2: Vercel
1. In your Vercel dashboard, go to Project Settings > Environment Variables
2. Add `VITE_DISCORD_WEBHOOK_URL` with your Discord webhook URL as the value
3. Redeploy your site

#### Option 3: Other Platforms
- Set the environment variable `VITE_DISCORD_WEBHOOK_URL` in your hosting platform's environment variables section

## Setting Up Discord Webhook

1. Go to your Discord server
2. Click on Server Settings (gear icon)
3. Navigate to Integrations > Webhooks
4. Click "New Webhook"
5. Configure the webhook:
   - Set a name (e.g., "Sierra Project Submissions")
   - Choose the channel where submissions should be posted
   - Copy the webhook URL
6. Use this URL as the value for `VITE_DISCORD_WEBHOOK_URL`

## Testing the Fix

After deploying with the environment variable:
1. Navigate to your deployed site
2. Fill out the info collection form
3. Submit your entries on the submission page
4. Check your Discord channel for the submission

## Common Issues

- **"Discord webhook URL not configured"**: Environment variable not set
- **"Discord API error: 404"**: Invalid webhook URL
- **"Discord API error: 401"**: Webhook was deleted or regenerated
- **Network errors**: Check internet connection or Discord API status

## Support

If you continue to experience issues:
1. Check the browser console for error messages
2. Verify the webhook URL is correct and active
3. Test the webhook URL directly with a tool like Postman
4. Ensure the environment variable is properly set in your deployment platform
