# eFinder - Event Venue Locator

A full-stack web application for discovering and booking event venues. Built with Node.js/Express backend and vanilla HTML/CSS/JavaScript frontend.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd FY-project
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env file with your configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/event-venue-locator

# For MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-venue-locator

# Start the backend server
npm start
```

Backend will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
# Open new terminal and navigate to frontend directory
cd frontend

# Start the frontend server
node server.js
```

Frontend will run on `http://localhost:8080`

## 📁 Project Structure

```
FY-project/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Validation & upload
│   │   └── config/         # Database config
│   ├── uploads/            # File uploads
│   └── package.json
├── frontend/               # HTML/CSS/JS frontend
│   ├── pages/             # HTML pages
│   ├── styles/            # CSS files
│   ├── scripts/           # JavaScript files
│   ├── uploads/           # Frontend images
│   └── server.js          # Frontend server
└── README.md
```

## 🔧 Environment Configuration

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/event-venue-locator
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

## 🎯 Features

### Frontend
- **Responsive Design**: Mobile-first approach with Bootstrap
- **Hero Section**: Dynamic background with optimized mobile positioning
- **Authentication**: Split-screen login/signup with image backgrounds
- **Search Functionality**: Venue search with filters
- **Dashboard**: Separate interfaces for venue owners and event organizers

### Backend
- **RESTful API**: Complete CRUD operations for venues, users, and bookings
- **File Upload**: Image upload for venue photos
- **Input Validation**: Comprehensive validation using express-validator
- **MongoDB Integration**: Mongoose ODM for database operations

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev  # Auto-restart on changes
```

### Frontend Development
```bash
cd frontend
node server.js  # Static file server
```

## 📱 Responsive Breakpoints

- **Desktop**: >768px - Full-screen hero section
- **Tablet**: ≤768px - 60vh hero height
- **Mobile**: ≤576px - 50vh hero height
- **Small Mobile**: ≤480px - 45vh hero height

## 🧪 Testing

### Backend API Testing
```bash
# Test user creation
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"Password123","role":"owner"}'

# Test venue creation
curl -X POST http://localhost:3000/api/venues \
  -F "name=Test Venue" \
  -F "location=123 Main St" \
  -F "capacity=100" \
  -F "price=500" \
  -F "owner_id=USER_ID"
```

### Frontend Testing
1. Open `http://localhost:8080` in browser
2. Test responsive design on different screen sizes
3. Verify authentication pages load correctly
4. Test search functionality
5. Check dashboard functionality

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Use PM2 or similar process manager
3. Configure reverse proxy (nginx)
4. Set up MongoDB Atlas for production

### Frontend Deployment
1. Build static files
2. Deploy to CDN or static hosting
3. Configure API endpoints for production

## 📚 API Endpoints

### Users
- `POST /api/users` - Create user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID

### Venues
- `POST /api/venues` - Create venue
- `GET /api/venues` - Get all venues
- `GET /api/venues/search` - Search venues
- `PUT /api/venues/:id` - Update venue
- `DELETE /api/venues/:id` - Delete venue

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get all bookings
- `PUT /api/bookings/:id` - Update booking
- `PATCH /api/bookings/:id/status` - Update booking status

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check MongoDB connection
- Verify environment variables
- Ensure port 3000 is available

**Frontend images not loading:**
- Check file paths in uploads folder
- Clear browser cache
- Verify server.js is running

**CSS changes not visible:**
- Clear browser cache
- Check cache-busting parameters in HTML
- Verify CSS file paths

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support, KINDLY HIT ME UP 

