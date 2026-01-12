# Deployment Guide

## Vercel Deployment

### Frontend Deployment

1. **Connect your repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set the root directory to `client`

2. **Configure Build Settings**
   - Framework Preset: `Create React App`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

3. **Environment Variables**
   Add these in Vercel dashboard:
   ```
   REACT_APP_API_URL=https://your-backend-url.vercel.app/api
   ```

4. **Deploy**
   - Vercel will automatically deploy on every push
   - The `vercel.json` file handles routing for the SPA

### Backend Deployment

1. **Deploy to Vercel (or Railway/Render)**
   - Create a new Vercel project for the backend
   - Set root directory to `server`
   - Build Command: (leave empty or `echo "No build needed"`)
   - Output Directory: (leave empty)
   - Install Command: `npm install`

2. **Environment Variables**
   Add these in Vercel dashboard:
   ```
   DATABASE_URL=your-neon-database-url
   OPENAI_API_KEY=your-openai-api-key
   JWT_SECRET=your-secret-key
   PORT=5000
   ```

3. **Update Frontend API URL**
   - After backend is deployed, update `REACT_APP_API_URL` in frontend
   - Or update `client/src/api.js` with the backend URL

### Alternative: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repository
4. Set root directory to `server`
5. Add environment variables
6. Deploy

### Database Setup

The database tables are already created. Make sure your `DATABASE_URL` in production matches your Neon database.

## Troubleshooting

### 404 Errors on Vercel

- Make sure `vercel.json` is in the root or `client` directory
- Check that the build output is `build` directory
- Verify rewrites are configured correctly

### API Connection Issues

- Check `REACT_APP_API_URL` is set correctly
- Verify CORS is enabled on backend
- Check backend is deployed and running

### Build Failures

- Make sure all dependencies are in `package.json`
- Check Node.js version (should be 18+)
- Review build logs in Vercel dashboard