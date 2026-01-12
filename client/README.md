# SiteForge Client - Next.js

This is the Next.js frontend for SiteForge Pro.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For production, set `NEXT_PUBLIC_API_URL` to your backend URL.

## Pages

- `/` - Landing page
- `/auth` - Authentication (signup/login)
- `/select-business` - Business type selection
- `/brand-setup` - Brand configuration
- `/generating` - AI site generation
- `/admin` - Admin dashboard
- `/preview` - Preview generated site

## Build

```bash
npm run build
npm start
```

## Deploy to Vercel

Just connect your GitHub repo to Vercel - it will auto-detect Next.js!