# Troubleshooting 404 NOT_FOUND Error

## Common Causes

### 1. Neon Database Connection Issues

If you're getting a 404 from Neon:
- **Check your connection string** in `server/.env`
- Make sure `DATABASE_URL` is set correctly
- Verify the database exists in your Neon dashboard
- Check if the database is paused (Neon pauses inactive databases)

### 2. API Route Not Found

If the frontend can't find an API endpoint:
- Make sure the server is running on port 5000
- Check that the route exists in the server routes
- Verify the API URL in `client/src/api.js`

### 3. Database Tables Not Created

If queries fail:
- Run the table creation script: `cd server && node create_tables.js`
- Or run the SQL in `database_schema.sql` in Neon's SQL editor

## Quick Fixes

### Test Database Connection
```bash
cd server
node create_tables.js
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Root endpoint
curl http://localhost:5000/
```

### Check Server Logs
Look for errors in the server console when starting:
```bash
npm run dev
```

## Available API Endpoints

- `GET /` - API info
- `GET /api/health` - Health check
- `POST /api/auth/signup` - Sign up
- `POST /api/auth/login` - Login
- `POST /api/business/setup` - Setup business
- `GET /api/business/my-business` - Get business
- `POST /api/site/generate` - Generate site
- `GET /api/site/content` - Get site content
- `GET /api/admin/dashboard` - Get dashboard
- `PUT /api/admin/content` - Update content
- `POST /api/admin/publish` - Publish site

## If Error Persists

1. Check server console for detailed error messages
2. Verify `.env` file has all required variables
3. Test database connection separately
4. Check browser console for frontend errors