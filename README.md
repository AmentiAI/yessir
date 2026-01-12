# SiteForge Pro - AI-Powered Website Builder

A full-stack AI-powered website builder that generates professional websites using OpenAI, with Neon DB for data persistence.

## Features

- 🔐 User authentication (signup/login)
- 🏢 12 business type templates
- 🎨 Brand customization (logo, colors, details)
- 🤖 AI-powered content generation using OpenAI
- 📊 Admin dashboard for content management
- 👁️ Live preview of generated websites
- 💾 Persistent data storage with Neon DB

## Tech Stack

- **Frontend**: React, Axios
- **Backend**: Node.js, Express
- **Database**: Neon PostgreSQL
- **AI**: OpenAI GPT-4
- **Authentication**: JWT

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Neon DB account (get a free database at [neon.tech](https://neon.tech))
- OpenAI API key (get one at [openai.com](https://openai.com))

### Installation

1. **Clone and install dependencies**:
   ```bash
   npm run install-all
   ```

2. **Set up environment variables**:

   Create `server/.env`:
   ```env
   DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   OPENAI_API_KEY=sk-your-openai-api-key
   PORT=5000
   ```

   Create `client/.env` (optional):
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Start the development servers**:
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend app on `http://localhost:3000`

### Getting Your Neon DB Connection String

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string from your project dashboard
4. Add it to `server/.env` as `DATABASE_URL`

### First Run

The database tables will be automatically created when you start the server for the first time.

## Project Structure

```
├── client/              # React frontend
│   ├── src/
│   │   ├── App.js      # Main app component
│   │   ├── api.js      # API client
│   │   └── index.js    # Entry point
│   └── package.json
├── server/              # Express backend
│   ├── db/
│   │   └── init.js     # Database initialization
│   ├── routes/
│   │   ├── auth.js     # Authentication routes
│   │   ├── business.js # Business setup routes
│   │   ├── site.js     # Site generation routes
│   │   └── admin.js    # Admin routes
│   ├── index.js        # Server entry point
│   └── package.json
└── package.json         # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user

### Business
- `POST /api/business/setup` - Create/update business
- `GET /api/business/my-business` - Get user's business

### Site Generation
- `POST /api/site/generate` - Generate site content with AI
- `GET /api/site/content` - Get site content

### Admin
- `GET /api/admin/dashboard` - Get dashboard data
- `PUT /api/admin/content` - Update site content
- `POST /api/admin/publish` - Publish site
- `POST /api/admin/unpublish` - Unpublish site

## Usage Flow

1. User signs up/logs in
2. Selects business type
3. Uploads logo and enters business details
4. AI generates website content
5. User can edit content in admin dashboard
6. Preview and publish website

## Development

- Backend uses ES modules (`type: "module"`)
- Database migrations run automatically on startup
- JWT tokens are stored in localStorage
- Logo uploads are stored as base64 (can be upgraded to S3/Cloudinary)

## Production Deployment

1. Set production environment variables
2. Build frontend: `cd client && npm run build`
3. Serve built files (or use Vercel/Netlify)
4. Deploy backend (Railway, Render, etc.)
5. Update frontend API URL

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.