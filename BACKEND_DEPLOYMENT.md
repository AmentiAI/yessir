# 🚀 Deploy Backend to Vercel

## Quick Setup

### Step 1: Create New Vercel Project for Backend

1. Go to: https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** `server`
   - **Build Command:** (leave empty or `npm install`)
   - **Output Directory:** (leave empty)
   - **Install Command:** `npm install`
5. Click **Deploy**

### Step 2: Add Environment Variables

In your backend project settings → **Environment Variables**, add:

```
DATABASE_URL=your-neon-database-url
JWT_SECRET=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key
PORT=5000
```

### Step 3: Update Vercel.json for Server

Create `server/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.js"
    }
  ]
}
```

### Step 4: Get Backend URL

After deployment, you'll get a URL like:
- `https://yessir-api.vercel.app`

Use this for `NEXT_PUBLIC_API_URL` in your frontend project!

## Alternative: Use Vercel Serverless Functions

Vercel can run Express apps as serverless functions. The setup above should work, but if you get errors, you might need to adjust the routing.