# FR002  Venue CREATION - Backend API

This is the backend API for the Event Venue Locator system, built with Express.js and MongoDB.

## Features Implemented (FR002 - Venue Profile Creation)

✅ **Venue Profile Creation**: Venue owners can create venues with all required details
✅ **Database Setup**: MongoDB database with Mongoose ODM
✅ **File Upload**: Photo upload functionality for venues
✅ **Input Validation**: Comprehensive validation for all venue data
✅ **CRUD Operations**: Full Create, Read, Update, Delete operations for venues
✅ **Search & Filter**: Advanced search and filtering capabilities

## Setup Instructions

### 1. Install Dependencies

```bash
cd FY-project/backend
npm install
```

### 2. MongoDB Setup

Make sure you have MongoDB installed and running on your system:

**Option A: Local MongoDB**
- Install MongoDB Community Edition
- Start MongoDB service: `mongod`

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Create a cluster and get your connection string

### 3. Environment Configuration

Copy the example environment file and configure it:

```bash
cp env.example .env
```

Edit `.env` file with your configuration:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/event-venue-locator
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

**For MongoDB Atlas, use your connection string:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-venue-locator
```

### 4. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Base URL: `http://localhost:3000/api`

### Users (for testing)

#### Create User
```http
POST /users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "role": "owner"
}
```

#### Get All Users
```http
GET /users
```

#### Get User by ID
```http
GET /users/:id
```

### Venues

#### Create Venue
```http
POST /venues
Content-Type: multipart/form-data

{
  "name": "Grand Ballroom",
  "description": "Elegant ballroom perfect for weddings and corporate events",
  "location": "123 Main Street, New York, NY",
  "capacity": 200,
  "price": 1500.00,
  "contact_email": "info@grandballroom.com",
  "contact_phone": "+1-555-0123",
  "owner_id": 1,
  "photo": [image file]
}
```

#### Get All Venues
```http
GET /venues?location=New York&min_capacity=100&max_price=2000&limit=10&offset=0
```

#### Search Venues
```http
GET /venues/search?search=ballroom&min_capacity=150&max_price=3000
```

#### Get Venue by ID
```http
GET /venues/:id
```

#### Update Venue
```http
PUT /venues/:id
Content-Type: multipart/form-data

{
  "name": "Updated Venue Name",
  "capacity": 250,
  "price": 1800.00,
  "photo": [new image file]
}
```

#### Delete Venue
```http
DELETE /venues/:id
```

#### Get Venues by Owner
```http
GET /venues/owner/:ownerId
```

#### Get Venue Statistics
```http
GET /venues/:id/stats
```

#### Check Venue Availability
```http
GET /venues/:id/availability?date=2024-12-25
```

### Bookings

#### Create Booking
```http
POST /bookings
Content-Type: application/json

{
  "venue_id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "organizer_id": "64f8a1b2c3d4e5f6a7b8c9d1",
  "event_name": "Annual Company Meeting",
  "event_date": "2024-12-25",
  "start_time": "09:00",
  "end_time": "17:00",
  "notes": "Need AV equipment and catering setup"
}
```

#### Get All Bookings
```http
GET /bookings?venue_id=64f8a1b2c3d4e5f6a7b8c9d0&status=confirmed&limit=10&offset=0
```

#### Get Booking by ID
```http
GET /bookings/:id
```

#### Update Booking
```http
PUT /bookings/:id
Content-Type: application/json

{
  "event_name": "Updated Event Name",
  "start_time": "10:00",
  "end_time": "18:00",
  "notes": "Updated requirements"
}
```

#### Update Booking Status
```http
PATCH /bookings/:id/status
Content-Type: application/json

{
  "status": "confirmed"
}
```

#### Delete Booking
```http
DELETE /bookings/:id
```

#### Get Bookings by Organizer
```http
GET /bookings/organizer/:organizerId
```

#### Get Bookings by Venue
```http
GET /bookings/venue/:venueId
```

#### Get Booking Statistics
```http
GET /bookings/:id/stats
```

#### Check Venue Availability for Booking
```http
GET /bookings/venue/:venueId/availability?date=2024-12-25&start_time=09:00&end_time=17:00
```

## Database Schema (MongoDB Collections)

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String (required, 2-50 chars),
  email: String (required, unique, lowercase),
  password: String (required, hashed with bcrypt),
  role: String (required, enum: ['owner', 'organizer']),
  createdAt: Date,
  updatedAt: Date
}
```

### Venues Collection
```javascript
{
  _id: ObjectId,
  name: String (required, 2-100 chars),
  description: String (optional, max 1000 chars),
  location: String (required, 5-200 chars),
  capacity: Number (required, 1-10000),
  price: Number (required, positive),
  contactEmail: String (optional, valid email),
  contactPhone: String (optional, valid phone),
  photoUrl: String (optional),
  owner: ObjectId (required, ref: 'User'),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Bookings Collection (for future use)
```javascript
{
  _id: ObjectId,
  venue: ObjectId (required, ref: 'Venue'),
  organizer: ObjectId (required, ref: 'User'),
  eventName: String (required, max 100 chars),
  eventDate: Date (required),
  startTime: String (required, HH:MM format),
  endTime: String (required, HH:MM format),
  totalCost: Number (required, positive),
  status: String (default: 'pending', enum: ['pending', 'confirmed', 'cancelled']),
  notes: String (optional, max 500 chars),
  createdAt: Date,
  updatedAt: Date
}
```

## File Upload

- Supported formats: All image types (JPEG, PNG, GIF, etc.)
- Maximum file size: 5MB (configurable)
- Upload directory: `./uploads/`
- Files are served at: `http://localhost:3000/uploads/filename`

## Validation Rules

### Venue Validation
- **name**: Required, 2-100 characters
- **description**: Optional, max 1000 characters
- **location**: Required, 5-200 characters
- **capacity**: Required, integer between 1-10,000
- **price**: Required, positive number
- **contact_email**: Optional, valid email format
- **contact_phone**: Optional, valid phone number
- **owner_id**: Required, valid MongoDB ObjectId

### User Validation
- **name**: Required, 2-50 characters
- **email**: Required, valid email format
- **password**: Required, min 6 characters, must contain uppercase, lowercase, and number
- **role**: Required, must be 'owner' or 'organizer'

### Booking Validation
- **venue_id**: Required, valid MongoDB ObjectId
- **organizer_id**: Required, valid MongoDB ObjectId
- **event_name**: Required, 2-100 characters
- **event_date**: Required, valid date in YYYY-MM-DD format, cannot be in the past
- **start_time**: Required, HH:MM format (24-hour)
- **end_time**: Required, HH:MM format (24-hour), must be after start time
- **notes**: Optional, max 500 characters
- **status**: Must be 'pending', 'confirmed', or 'cancelled'

## Testing the API

### 1. Create a Test User (Owner)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "role": "owner"
  }'
```

### 2. Create a Venue
```bash
curl -X POST http://localhost:3000/api/venues \
  -F "name=Grand Ballroom" \
  -F "description=Elegant ballroom for events" \
  -F "location=123 Main St, New York, NY" \
  -F "capacity=200" \
  -F "price=1500.00" \
  -F "contact_email=info@ballroom.com" \
  -F "contact_phone=+1-555-0123" \
  -F "owner_id=1" \
  -F "photo=@/path/to/image.jpg"
```

### 3. Get All Venues
```bash
curl http://localhost:3000/api/venues
```

### 4. Create a Test Booking
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "venue_id": "VENUE_ID_FROM_STEP_2",
    "organizer_id": "ORGANIZER_ID_FROM_STEP_1",
    "event_name": "Test Event",
    "event_date": "2024-12-25",
    "start_time": "09:00",
    "end_time": "17:00",
    "notes": "Test booking for API testing"
  }'
```

### 5. Get All Bookings
```bash
curl http://localhost:3000/api/bookings
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection configuration
│   ├── controllers/
│   │   ├── userController.js    # User operations
│   │   ├── venueController.js   # Venue operations
│   │   └── bookingController.js # Booking operations
│   ├── middleware/
│   │   ├── validation.js        # Input validation
│   │   └── upload.js           # File upload handling
│   ├── models/
│   │   ├── User.js             # User Mongoose model
│   │   ├── Venue.js            # Venue Mongoose model
│   │   └── Booking.js          # Booking Mongoose model
│   ├── routes/
│   │   ├── users.js            # User routes
│   │   ├── venues.js           # Venue routes
│   │   └── bookings.js         # Booking routes
│   └── server.js               # Main server file
├── uploads/                    # Uploaded images
├── package.json
├── env.example
└── README.md
```

## Next Steps

This implementation covers the **Venue Profile Creation (FR002)** requirement. The next steps would be:

1. **Authentication & Authorization** - Add JWT-based auth
2. **Booking System** - Implement venue booking functionality
3. **Frontend Integration** - Connect with the frontend
4. **Advanced Features** - Add more search filters, pagination, etc.

## Error Handling

The API includes comprehensive error handling:
- Input validation errors (400)
- Resource not found errors (404)
- Server errors (500)
- File upload errors
- Database errors

All errors return a consistent JSON format:
```json
{
  "message": "Error description",
  "error": "Detailed error message (in development)"
}
```
