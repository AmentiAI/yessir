# Fix: Vercel Deployment Not Building

## The Problem
- Deployment takes only 3 seconds (should take 1-2 minutes)
- No site shows up
- This means Vercel is NOT running the build

## Solution 1: Set Root Directory in Vercel (RECOMMENDED)

1. Go to Vercel Dashboard → Your Project
2. **Settings** → **General**
3. Scroll to **Root Directory**
4. Click **Edit**
5. Enter: `client`
6. Click **Save**
7. Go to **Deployments** → Click **Redeploy**

This tells Vercel: "The Next.js app is in the `client` folder"

## Solution 2: Use the Root vercel.json (Alternative)

I've created a `vercel.json` in the root that tells Vercel to:
- Install dependencies in `client` folder
- Build from `client` folder
- Output from `client/.next`

If Root Directory is set to root (not `client`), this will work.

## Verify Build is Running

After redeploying, check the build logs. You should see:
```
Installing dependencies...
added XXX packages in XXs

Building...
> next build
✓ Compiled successfully
✓ Generating static pages
```

If you see "Build completed in 3s" without any npm install or next build logs, it's not building.

## Environment Variables

Make sure to add in Vercel:
- `NEXT_PUBLIC_API_URL` = Your backend URL (e.g., `https://your-backend.vercel.app/api`)

## Test Locally First

```bash
cd client
npm install
npm run build
```

If this works locally, Vercel should work too once Root Directory is set correctly.