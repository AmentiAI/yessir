# 🔧 Environment Variables Setup for Vercel

## The Problem
Your site is loading but API calls are failing with:
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
localhost:5000/api/auth/signup
```

This means `NEXT_PUBLIC_API_URL` is not set in Vercel!

## ✅ THE FIX

### Step 1: Get Your Backend URL

First, you need your backend deployed. If you haven't deployed the backend yet:
1. Deploy your `server` folder to Vercel (separate project)
2. Or deploy to another service (Railway, Render, etc.)
3. Get the URL (e.g., `https://yessir-api.vercel.app`)

### Step 2: Add Environment Variable in Vercel

1. Go to: https://vercel.com/dashboard
2. Click your **frontend project** (the Next.js one)
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://your-backend-url.vercel.app/api` (replace with your actual backend URL)
   - **Environment:** Select all (Production, Preview, Development)
6. Click **Save**

### Step 3: Redeploy

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **Redeploy**
4. Wait for build to complete

### Step 4: Verify

After redeploy, check browser console:
- ✅ Should NOT see `ERR_CONNECTION_REFUSED` errors
- ✅ API calls should go to your backend URL (not localhost)
- ✅ Sign up/login should work

## 📝 Example

If your backend is at `https://yessir-api.vercel.app`, then:

**Environment Variable:**
```
NEXT_PUBLIC_API_URL = https://yessir-api.vercel.app/api
```

## ⚠️ Important Notes

1. **Must start with `NEXT_PUBLIC_`** - This prefix makes it available in the browser
2. **Include `/api` at the end** - Your backend routes are under `/api`
3. **No trailing slash** - Should be `https://example.com/api` not `https://example.com/api/`
4. **Redeploy after adding** - Environment variables require a new deployment

## 🔍 Check if It's Set

After redeploying, open browser console and check:
```javascript
console.log(process.env.NEXT_PUBLIC_API_URL)
```

If it shows `undefined`, the environment variable is not set correctly.

## 🚀 Deploy Backend Too

If you haven't deployed the backend yet:

1. Create a new Vercel project
2. Point it to the same GitHub repo
3. Set **Root Directory** to: `server`
4. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `OPENAI_API_KEY`
   - `PORT` (optional, defaults to 5000)
5. Deploy
6. Use that URL for `NEXT_PUBLIC_API_URL` in your frontend project