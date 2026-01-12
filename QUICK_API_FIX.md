# ⚡ QUICK FIX: API Connection Errors

## The Problem
You're seeing:
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
localhost:5000/api/auth/signup
```

## ✅ THE FIX (2 Steps)

### Step 1: Deploy Your Backend (If Not Done)

1. Create a **new Vercel project** for your backend
2. Set **Root Directory** to: `server`
3. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `OPENAI_API_KEY`
4. Deploy and get the URL (e.g., `https://yessir-api.vercel.app`)

### Step 2: Set Frontend Environment Variable

1. Go to your **frontend Vercel project**
2. **Settings** → **Environment Variables**
3. Add:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://your-backend-url.vercel.app/api`
   - **Environment:** All (Production, Preview, Development)
4. **Save**
5. **Redeploy** your frontend

## ✅ That's It!

After redeploy, your API calls will work!

## 📝 Example

If backend is: `https://yessir-api.vercel.app`

Then set:
```
NEXT_PUBLIC_API_URL = https://yessir-api.vercel.app/api
```

## 🔍 Verify

After redeploy, open browser console. You should see API calls going to your backend URL, not localhost!