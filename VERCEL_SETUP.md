# Vercel Deployment Setup

## Important: Root Directory Configuration

In your Vercel project settings:

1. Go to **Settings** → **General**
2. Find **Root Directory**
3. Set it to: `client`
4. Save

This tells Vercel that your Next.js app is in the `client` folder, not the root.

## Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
```

## Alternative: Deploy Client Separately

If you want to deploy the client as a separate Vercel project:

1. Create a new Vercel project
2. Point it to the same GitHub repo
3. Set Root Directory to `client`
4. Deploy

This way you can have:
- Frontend: `yessir-weld.vercel.app` (Next.js)
- Backend: `yessir-api.vercel.app` (Express) - separate project