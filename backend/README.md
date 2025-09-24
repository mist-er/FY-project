# eFinder Backend API

This is the backend API for the eFinder venue booking platform.

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── config/         # Configuration files
│   ├── utils/          # Utility functions
│   └── app.js          # Main application file
├── package.json        # Dependencies and scripts
├── .env.example        # Environment variables template
└── README.md          # This file
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your configuration

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /` - API status and information
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/venues` - Get all venues
- `POST /api/venues` - Create new venue
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
