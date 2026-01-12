# Fixing 404 Error on Vercel

## The Problem
You're seeing a 404 error when accessing your Next.js app on Vercel.

## Possible Causes & Solutions

### 1. Root Directory Not Set (MOST LIKELY)
**Fix:** In Vercel Dashboard → Settings → General → Root Directory, set it to: `client`

### 2. Missing Environment Variables
**Fix:** Add in Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_API_URL` = Your backend API URL (e.g., `https://your-backend.vercel.app/api`)

### 3. API Endpoint Not Found
If the 404 is from an API call:
- Make sure your backend is deployed and accessible
- Check that `NEXT_PUBLIC_API_URL` is set correctly
- Verify the API endpoints exist in your backend

### 4. Next.js Routing Issue
I've created:
- `client/pages/404.js` - Custom 404 page
- `client/pages/_error.js` - Error handler

These will show proper error pages instead of generic 404s.

## Steps to Fix

1. **Set Root Directory in Vercel:**
   - Go to your Vercel project
   - Settings → General
   - Set Root Directory to: `client`
   - Save

2. **Add Environment Variables:**
   - Settings → Environment Variables
   - Add `NEXT_PUBLIC_API_URL` with your backend URL
   - Make sure to add it for Production, Preview, and Development

3. **Redeploy:**
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment

4. **Check Build Logs:**
   - Look for any errors during build
   - Verify Next.js is detected

## Testing Locally

To test if it works locally:
```bash
cd client
npm install
npm run dev
```

Then visit `http://localhost:3000`

## If Still Getting 404

1. Check the Vercel build logs for errors
2. Verify `client/package.json` has `next` in dependencies
3. Make sure all pages are in `client/pages/` directory
4. Check that `client/next.config.js` exists and is valid