# Event Venue Locator API - Postman Testing Guide

This guide provides comprehensive instructions for testing all API endpoints using Postman.

## 🚀 Setup Instructions

### 1. Environment Setup
Create a new environment in Postman with the following variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `base_url` | `http://localhost:3000/api` | Base API URL |
| `user_id` | `{{user_id}}` | Will be set after creating a user |
| `venue_id` | `{{venue_id}}` | Will be set after creating a venue |
| `booking_id` | `{{booking_id}}` | Will be set after creating a booking |
| `owner_id` | `{{owner_id}}` | Will be set after creating an owner |

### 2. Collection Structure
Create a collection named "Event Venue Locator API" with the following folders:
- **Users** (Authentication & User Management)
- **Venues** (Venue Management)
- **Bookings** (Booking Management)

---

## 👥 USERS ENDPOINTS

### 1. Create User (Owner)
**Method:** `POST`  
**URL:** `{{base_url}}/users`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "John Doe",
  "email": "john.owner@example.com",
  "password": "Password123",
  "role": "owner"
}
```

**Expected Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john.owner@example.com",
    "role": "owner",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Postman Test Script:**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("owner_id", response.user._id);
    console.log("Owner ID saved:", response.user._id);
}
```

### 2. Create User (Organizer)
**Method:** `POST`  
**URL:** `{{base_url}}/users`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Jane Smith",
  "email": "jane.organizer@example.com",
  "password": "Password123",
  "role": "organizer"
}
```

**Postman Test Script:**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("user_id", response.user._id);
    console.log("Organizer ID saved:", response.user._id);
}
```

### 3. Get All Users
**Method:** `GET`  
**URL:** `{{base_url}}/users`

**Expected Response (200):**
```json
{
  "message": "Users retrieved successfully",
  "users": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john.owner@example.com",
      "role": "owner",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

### 4. Get User by ID
**Method:** `GET`  
**URL:** `{{base_url}}/users/{{user_id}}`

### 5. Update User
**Method:** `PUT`  
**URL:** `{{base_url}}/users/{{user_id}}`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Jane Smith Updated",
  "email": "jane.updated@example.com",
  "role": "organizer"
}
```

### 6. Delete User
**Method:** `DELETE`  
**URL:** `{{base_url}}/users/{{user_id}}`

---

## 🏢 VENUES ENDPOINTS

### 1. Create Venue
**Method:** `POST`  
**URL:** `{{base_url}}/venues`  
**Headers:**
```
Content-Type: multipart/form-data
```

**Body (form-data):**
| Key | Type | Value |
|-----|------|-------|
| `name` | Text | `Grand Ballroom` |
| `description` | Text | `Elegant ballroom perfect for weddings and corporate events` |
| `location` | Text | `123 Main Street, New York, NY 10001` |
| `capacity` | Text | `200` |
| `price` | Text | `1500.00` |
| `contact_email` | Text | `info@grandballroom.com` |
| `contact_phone` | Text | `+1-555-0123` |
| `owner_id` | Text | `{{owner_id}}` |
| `photo` | File | `[Select an image file]` |

**Expected Response (201):**
```json
{
  "message": "Venue created successfully",
  "venue": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "name": "Grand Ballroom",
    "description": "Elegant ballroom perfect for weddings and corporate events",
    "location": "123 Main Street, New York, NY 10001",
    "capacity": 200,
    "price": 1500,
    "contactEmail": "info@grandballroom.com",
    "contactPhone": "+1-555-0123",
    "photoUrl": "/uploads/venue-1705312200000-123456789.jpg",
    "owner": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john.owner@example.com",
      "role": "owner"
    },
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Postman Test Script:**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("venue_id", response.venue._id);
    console.log("Venue ID saved:", response.venue._id);
}
```

### 2. Get All Venues
**Method:** `GET`  
**URL:** `{{base_url}}/venues`

**Query Parameters (optional):**
- `location`: Filter by location
- `min_capacity`: Minimum capacity
- `max_capacity`: Maximum capacity
- `min_price`: Minimum price
- `max_price`: Maximum price
- `owner_id`: Filter by owner
- `limit`: Number of results (default: 20)
- `offset`: Skip results (default: 0)

**Example with filters:**
```
{{base_url}}/venues?location=New York&min_capacity=100&max_price=2000&limit=10
```

### 3. Search Venues
**Method:** `GET`  
**URL:** `{{base_url}}/venues/search`

**Query Parameters:**
- `search`: Search term (required)
- `min_capacity`: Minimum capacity
- `max_price`: Maximum price
- `limit`: Number of results

**Example:**
```
{{base_url}}/venues/search?search=ballroom&min_capacity=150&max_price=3000
```

### 4. Get Venue by ID
**Method:** `GET`  
**URL:** `{{base_url}}/venues/{{venue_id}}`

### 5. Update Venue
**Method:** `PUT`  
**URL:** `{{base_url}}/venues/{{venue_id}}`  
**Headers:**
```
Content-Type: multipart/form-data
```

**Body (form-data):**
| Key | Type | Value |
|-----|------|-------|
| `name` | Text | `Updated Grand Ballroom` |
| `capacity` | Text | `250` |
| `price` | Text | `1800.00` |
| `photo` | File | `[Select new image file]` |

### 6. Delete Venue
**Method:** `DELETE`  
**URL:** `{{base_url}}/venues/{{venue_id}}`

### 7. Get Venues by Owner
**Method:** `GET`  
**URL:** `{{base_url}}/venues/owner/{{owner_id}}`

### 8. Get Venue Statistics
**Method:** `GET`  
**URL:** `{{base_url}}/venues/{{venue_id}}/stats`

### 9. Check Venue Availability
**Method:** `GET`  
**URL:** `{{base_url}}/venues/{{venue_id}}/availability`

**Query Parameters:**
- `date`: Date to check (YYYY-MM-DD format)

**Example:**
```
{{base_url}}/venues/{{venue_id}}/availability?date=2024-12-25
```

---

## 📅 BOOKINGS ENDPOINTS

### 1. Create Booking
**Method:** `POST`  
**URL:** `{{base_url}}/bookings`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "venue_id": "{{venue_id}}",
  "organizer_id": "{{user_id}}",
  "event_name": "Annual Company Meeting",
  "event_date": "2024-12-25",
  "start_time": "09:00",
  "end_time": "17:00",
  "notes": "Need AV equipment and catering setup"
}
```

**Expected Response (201):**
```json
{
  "message": "Booking created successfully",
  "booking": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "venue": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "Grand Ballroom",
      "location": "123 Main Street, New York, NY 10001",
      "capacity": 200,
      "price": 1500,
      "owner": "64f8a1b2c3d4e5f6a7b8c9d0"
    },
    "organizer": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Jane Smith",
      "email": "jane.organizer@example.com",
      "role": "organizer"
    },
    "eventName": "Annual Company Meeting",
    "eventDate": "2024-12-25T00:00:00.000Z",
    "startTime": "09:00",
    "endTime": "17:00",
    "totalCost": 1500,
    "status": "pending",
    "notes": "Need AV equipment and catering setup",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Postman Test Script:**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("booking_id", response.booking._id);
    console.log("Booking ID saved:", response.booking._id);
}
```

### 2. Get All Bookings
**Method:** `GET`  
**URL:** `{{base_url}}/bookings`

**Query Parameters (optional):**
- `venue_id`: Filter by venue
- `organizer_id`: Filter by organizer
- `status`: Filter by status (pending, confirmed, cancelled)
- `event_date`: Filter by event date
- `limit`: Number of results (default: 20)
- `offset`: Skip results (default: 0)

**Example with filters:**
```
{{base_url}}/bookings?status=confirmed&limit=10&offset=0
```

### 3. Get Booking by ID
**Method:** `GET`  
**URL:** `{{base_url}}/bookings/{{booking_id}}`

### 4. Update Booking
**Method:** `PUT`  
**URL:** `{{base_url}}/bookings/{{booking_id}}`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "event_name": "Updated Annual Company Meeting",
  "start_time": "10:00",
  "end_time": "18:00",
  "notes": "Updated requirements - need additional AV equipment"
}
```

### 5. Update Booking Status
**Method:** `PATCH`  
**URL:** `{{base_url}}/bookings/{{booking_id}}/status`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "status": "confirmed"
}
```

**Valid status values:**
- `pending` (default)
- `confirmed`
- `cancelled`

### 6. Delete Booking
**Method:** `DELETE`  
**URL:** `{{base_url}}/bookings/{{booking_id}}`

### 7. Get Bookings by Organizer
**Method:** `GET`  
**URL:** `{{base_url}}/bookings/organizer/{{user_id}}`

### 8. Get Bookings by Venue
**Method:** `GET`  
**URL:** `{{base_url}}/bookings/venue/{{venue_id}}`

### 9. Get Booking Statistics
**Method:** `GET`  
**URL:** `{{base_url}}/bookings/{{booking_id}}/stats`

**Expected Response (200):**
```json
{
  "message": "Booking statistics retrieved successfully",
  "statistics": {
    "booking": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "eventName": "Annual Company Meeting",
      "eventDate": "2024-12-25T00:00:00.000Z",
      "startTime": "09:00",
      "endTime": "17:00",
      "totalCost": 1500,
      "status": "confirmed"
    },
    "daysUntilEvent": 345,
    "isUpcoming": true,
    "isPast": false,
    "duration": "8h 0m"
  }
}
```

### 10. Check Venue Availability for Booking
**Method:** `GET`  
**URL:** `{{base_url}}/bookings/venue/{{venue_id}}/availability`

**Query Parameters:**
- `date`: Date to check (YYYY-MM-DD format)
- `start_time`: Start time (HH:MM format)
- `end_time`: End time (HH:MM format)

**Example:**
```
{{base_url}}/bookings/venue/{{venue_id}}/availability?date=2024-12-25&start_time=09:00&end_time=17:00
```

**Expected Response (200):**
```json
{
  "message": "Availability checked successfully",
  "venue_id": "64f8a1b2c3d4e5f6a7b8c9d1",
  "date": "2024-12-25",
  "available": true,
  "conflicting_bookings": [],
  "total_bookings_on_date": 0
}
```

---

## 🧪 TESTING SCENARIOS

### Scenario 1: Complete Booking Flow
1. Create an owner user
2. Create an organizer user
3. Create a venue (as owner)
4. Create a booking (as organizer)
5. Update booking status to confirmed
6. Check venue availability
7. Get booking statistics

### Scenario 2: Error Testing
1. Try to create booking with invalid venue ID
2. Try to create booking with past date
3. Try to create booking with invalid time format
4. Try to update non-existent booking
5. Try to delete confirmed booking

### Scenario 3: Search and Filter Testing
1. Create multiple venues with different locations
2. Search venues by location
3. Filter venues by capacity and price
4. Create multiple bookings
5. Filter bookings by status and date

---

## 📋 COMMON ERROR RESPONSES

### Validation Error (400)
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Event name is required",
      "param": "event_name",
      "location": "body"
    }
  ]
}
```

### Not Found Error (404)
```json
{
  "message": "Venue not found"
}
```

### Server Error (500)
```json
{
  "message": "Error creating booking",
  "error": "Detailed error message"
}
```

---

## 🔧 POSTMAN COLLECTION SETUP

### Pre-request Scripts
Add this to your collection's pre-request script to ensure base URL is set:

```javascript
if (!pm.environment.get("base_url")) {
    pm.environment.set("base_url", "http://localhost:3000/api");
}
```

### Collection Variables
Set these variables at the collection level:

| Variable | Value |
|----------|-------|
| `base_url` | `http://localhost:3000/api` |
| `content_type_json` | `application/json` |
| `content_type_form` | `multipart/form-data` |

### Environment Variables
Create these in your environment:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:3000/api` | `http://localhost:3000/api` |
| `user_id` | `` | `[Auto-set after user creation]` |
| `venue_id` | `` | `[Auto-set after venue creation]` |
| `booking_id` | `` | `[Auto-set after booking creation]` |
| `owner_id` | `` | `[Auto-set after owner creation]` |

---

## 🚀 QUICK START TESTING

1. **Import Collection**: Import this guide into Postman
2. **Set Environment**: Create and select your environment
3. **Start Server**: Run `npm run dev` in your backend directory
4. **Test Sequence**: Run requests in this order:
   - Create Owner → Create Organizer → Create Venue → Create Booking
5. **Verify**: Check that IDs are automatically saved in environment variables

---

## 📝 NOTES

- All timestamps are in ISO 8601 format
- File uploads use multipart/form-data
- JSON requests use application/json
- IDs are automatically saved to environment variables
- Test scripts validate responses and save IDs
- Error responses include detailed validation messages

This guide covers all endpoints with examples, expected responses, and testing scenarios. 
