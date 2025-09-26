# eFinder Frontend Testing Guide

## Overview
This guide provides comprehensive instructions for testing the eFinder frontend application. The frontend is a venue booking platform built with vanilla HTML, CSS, JavaScript, and Bootstrap 5.

## Prerequisites

### Required Software
- **Node.js** (v14 or higher)
- **Web Browser** (Chrome, Firefox, Safari, or Edge)
- **Backend API** (must be running on port 3000)

### Backend Dependencies
Before testing the frontend, ensure the backend API is running:
```bash
cd ../backend
npm install
npm start
```
The backend should be accessible at `http://localhost:3000`

## Project Structure

```
frontend/
├── pages/                    # HTML pages
│   ├── index.html           # Homepage
│   ├── login.html           # User login
│   ├── SignUp.html          # User registration
│   ├── organizer-dashboard.html  # Event organizer dashboard
│   └── owner-dashboard.html      # Venue owner dashboard
├── scripts/                 # JavaScript files
│   └── homepage_script.js   # Homepage functionality
├── styles/                  # CSS files
│   ├── custom.css          # Custom styles
│   └── homepage.css        # Homepage specific styles
├── asset/                   # Static assets
│   ├── efinder_logo_black.png
│   └── favcon.ico
├── uploads/                 # User uploaded images
├── server.js               # Frontend development server
└── README.md               # This file
```

## Starting the Frontend Server

### Method 1: Using the Built-in Server
```bash
cd frontend
node server.js
```
The frontend will be available at: `http://localhost:8000`

### Method 2: Using a Local Web Server
If you prefer using a different server:
```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js http-server (install globally first)
npm install -g http-server
http-server -p 8000
```

## Testing Scenarios

### 1. Homepage Testing (`index.html`)

**URL:** `http://localhost:8000/pages/index.html`

#### Test Cases:
1. **Page Load**
   - [ ] Page loads without errors
   - [ ] All images display correctly
   - [ ] Navigation menu is responsive
   - [ ] Hero section displays properly

2. **Search Functionality**
   - [ ] Search input accepts text
   - [ ] Location dropdown works
   - [ ] Event type dropdown works
   - [ ] Search button triggers search
   - [ ] Enter key triggers search

3. **Category Cards**
   - [ ] All 6 category cards display
   - [ ] Cards are clickable
   - [ ] Clicking redirects to organizer dashboard

4. **Venue Display**
   - [ ] Venues load from API (if backend running)
   - [ ] Fallback message shows if no venues
   - [ ] Venue cards display correctly
   - [ ] Book Now buttons work

5. **Navigation**
   - [ ] All navigation links work
   - [ ] Sign In button redirects to login
   - [ ] List Your Venue button redirects to signup
   - [ ] Mobile menu toggles correctly

6. **Responsive Design**
   - [ ] Page works on desktop (1200px+)
   - [ ] Page works on tablet (768px-1199px)
   - [ ] Page works on mobile (<768px)

### 2. User Registration Testing (`SignUp.html`)

**URL:** `http://localhost:8000/pages/SignUp.html`

#### Test Cases:
1. **Form Validation**
   - [ ] All required fields are marked
   - [ ] Email validation works
   - [ ] Password minimum length (8 characters)
   - [ ] Terms agreement required

2. **Role Selection**
   - [ ] Event Organizer option selectable
   - [ ] Venue Owner option selectable
   - [ ] Visual feedback on selection
   - [ ] Default selection is Event Organizer

3. **API Integration**
   - [ ] Form submits to backend API
   - [ ] Success message on account creation
   - [ ] User data stored in localStorage
   - [ ] Redirect based on role (organizer → organizer-dashboard, owner → owner-dashboard)

4. **Error Handling**
   - [ ] Network error handling
   - [ ] Duplicate email handling
   - [ ] Invalid data handling

### 3. User Login Testing (`login.html`)

**URL:** `http://localhost:8000/pages/login.html`

#### Test Cases:
1. **Form Validation**
   - [ ] Email field required
   - [ ] Password field required
   - [ ] Email format validation

2. **Authentication**
   - [ ] Valid credentials login successfully
   - [ ] Invalid credentials show error
   - [ ] User data stored in localStorage
   - [ ] Redirect based on user role

3. **Remember Me**
   - [ ] Checkbox functionality
   - [ ] Data persistence (if implemented)

4. **Navigation**
   - [ ] Back to Home link works
   - [ ] Sign up link works
   - [ ] Forgot password link (placeholder)

### 4. Organizer Dashboard Testing (`organizer-dashboard.html`)

**URL:** `http://localhost:8000/pages/organizer-dashboard.html`

#### Prerequisites:
- Must be logged in as an organizer
- Backend API must be running

#### Test Cases:
1. **Authentication**
   - [ ] Redirects to login if not authenticated
   - [ ] Displays user name correctly
   - [ ] Logout functionality works

2. **Venue Browsing**
   - [ ] Venues load from API
   - [ ] Venue cards display correctly
   - [ ] Filter by location works
   - [ ] Filter by category works
   - [ ] No venues message displays when empty

3. **Booking Functionality**
   - [ ] Book Now button opens modal
   - [ ] Booking form validation
   - [ ] Event name required
   - [ ] Event date required
   - [ ] Start/end time required
   - [ ] Form submission works
   - [ ] Success message on booking

4. **My Bookings Tab**
   - [ ] Bookings load from API
   - [ ] Booking details display correctly
   - [ ] Status badges show correct colors
   - [ ] No bookings message when empty

5. **Navigation**
   - [ ] Tab switching works
   - [ ] Sidebar navigation works
   - [ ] Home link works

### 5. Owner Dashboard Testing (`owner-dashboard.html`)

**URL:** `http://localhost:8000/pages/owner-dashboard.html`

#### Prerequisites:
- Must be logged in as a venue owner
- Backend API must be running

#### Test Cases:
1. **Authentication**
   - [ ] Redirects to login if not authenticated
   - [ ] Displays user name correctly
   - [ ] Logout functionality works

2. **Dashboard Overview**
   - [ ] Stats cards display correctly
   - [ ] Total venues count updates
   - [ ] Recent activity shows

3. **Venue Management**
   - [ ] My Venues tab shows owned venues
   - [ ] Add New Venue button opens modal
   - [ ] Venue form validation
   - [ ] Required fields marked
   - [ ] File upload for venue photo
   - [ ] Form submission creates venue
   - [ ] Edit venue functionality
   - [ ] Delete venue functionality

4. **Venue Form Fields**
   - [ ] Venue name (required)
   - [ ] Location (required)
   - [ ] Description
   - [ ] Capacity (required, number)
   - [ ] Price (required, number)
   - [ ] Contact email
   - [ ] Contact phone
   - [ ] Photo upload

5. **Navigation**
   - [ ] Tab switching works
   - [ ] Sidebar navigation works
   - [ ] Home link works

## API Integration Testing

### Backend Endpoints Used:
- `GET /api/venues` - Fetch all venues
- `GET /api/venues/search` - Search venues with filters
- `GET /api/venues/owner/:id` - Fetch venues by owner
- `POST /api/venues` - Create new venue
- `PUT /api/venues/:id` - Update venue
- `DELETE /api/venues/:id` - Delete venue
- `GET /api/users` - Fetch all users (for login)
- `POST /api/users` - Create new user
- `GET /api/bookings/organizer/:id` - Fetch organizer bookings
- `POST /api/bookings` - Create new booking

### Testing API Connectivity:
1. **With Backend Running:**
   - [ ] All API calls succeed
   - [ ] Data displays correctly
   - [ ] Error handling works

2. **Without Backend Running:**
   - [ ] Graceful fallback messages
   - [ ] No JavaScript errors
   - [ ] Static content still works

## Browser Compatibility Testing

### Desktop Browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers:
- [ ] Chrome Mobile
- [ ] Safari Mobile
- [ ] Firefox Mobile

### Responsive Breakpoints:
- [ ] Mobile: < 768px
- [ ] Tablet: 768px - 1199px
- [ ] Desktop: ≥ 1200px

## Performance Testing

### Load Time:
- [ ] Homepage loads in < 3 seconds
- [ ] Images load properly
- [ ] No broken resources

### JavaScript Performance:
- [ ] No console errors
- [ ] Smooth animations
- [ ] Responsive interactions

## Security Testing

### Client-Side Security:
- [ ] No sensitive data in localStorage (except user session)
- [ ] Input validation on forms
- [ ] XSS prevention in user inputs

### Authentication:
- [ ] Protected routes redirect to login
- [ ] Session persistence works
- [ ] Logout clears session data

## Common Issues and Solutions

### Issue: "Network error" messages
**Solution:** Ensure backend API is running on port 3000

### Issue: Images not loading
**Solution:** Check file paths and ensure images exist in uploads folder

### Issue: Forms not submitting
**Solution:** Check browser console for JavaScript errors

### Issue: Styling issues
**Solution:** Clear browser cache and ensure CSS files are loading

### Issue: Mobile responsiveness problems
**Solution:** Test on actual devices or use browser dev tools

## Testing Checklist

### Pre-Testing Setup:
- [ ] Backend API is running
- [ ] Frontend server is running
- [ ] Browser cache is cleared
- [ ] Test data is available in backend

### Core Functionality:
- [ ] User registration works
- [ ] User login works
- [ ] Venue browsing works
- [ ] Venue booking works
- [ ] Venue creation works (for owners)
- [ ] Navigation works between pages

### Edge Cases:
- [ ] Empty data states
- [ ] Network failures
- [ ] Invalid form inputs
- [ ] Large file uploads
- [ ] Long text inputs

### User Experience:
- [ ] Loading states show
- [ ] Error messages are clear
- [ ] Success messages appear
- [ ] Forms reset after submission
- [ ] Navigation is intuitive

## Automated Testing (Optional)

For more comprehensive testing, consider implementing:

1. **Unit Tests** for JavaScript functions
2. **Integration Tests** for API calls
3. **E2E Tests** using tools like Cypress or Playwright
4. **Visual Regression Tests** for UI consistency

## Reporting Issues

When reporting issues, include:
1. Browser and version
2. Operating system
3. Steps to reproduce
4. Expected vs actual behavior
5. Console error messages
6. Screenshots if applicable

## Development Notes

- The frontend uses vanilla JavaScript (no frameworks)
- Bootstrap 5 is used for styling and components
- Font Awesome is used for icons
- LocalStorage is used for session management
- The app is designed to work offline with graceful degradation

---

**Last Updated:** December 2024
**Version:** 1.0.0
