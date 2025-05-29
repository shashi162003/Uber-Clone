# 🚗 Uber Clone - Full Stack Ride Sharing Application

A comprehensive ride-sharing platform built with modern web technologies, featuring real-time communication, location services, and secure authentication. This application provides both user and driver (captain) interfaces with live ride tracking and management.

**📱 MOBILE-OPTIMIZED:** This application is designed and optimized for mobile devices. For the best experience, please view on mobile or use your browser's mobile view (F12 → Toggle Device Toolbar).

## 🌟 Live Demo

- **📱 Frontend (Mobile-Optimized):** [https://uber-clone-webapp-ten.vercel.app/](https://uber-clone-webapp-ten.vercel.app/)
- **⚡ Backend API:** [https://uber-clone-backend-3rbv.onrender.com](https://uber-clone-backend-3rbv.onrender.com)
- **📚 API Health Check:** [https://uber-clone-backend-3rbv.onrender.com/health](https://uber-clone-backend-3rbv.onrender.com/health)

> **💡 Best Experience:** Open the frontend link on your mobile device or use Chrome DevTools mobile view for optimal experience.

## 📱 Demo Video



https://github.com/user-attachments/assets/c67edec8-8364-4ec1-8c48-e01d6d7e03c4



---

## 🚀 Features

### 👥 User Features

- **User Registration & Authentication** - Secure signup/login with JWT tokens
- **Real-time Ride Booking** - Book rides with live driver tracking
- **Location Search** - Autocomplete address search with Google Maps integration
- **Multiple Vehicle Types** - Choose from car, motorcycle, or auto-rickshaw
- **Live Ride Tracking** - Real-time GPS tracking during rides
- **Fare Calculation** - Dynamic pricing based on distance and vehicle type
- **Ride History** - View past rides and receipts
- **Payment Integration** - Secure payment processing (simulated)

### 🚕 Captain (Driver) Features

- **Captain Registration** - Register with vehicle details and documentation
- **Real-time Location Updates** - Automatic location broadcasting to users
- **Ride Requests** - Receive and accept ride requests instantly
- **Ride Management** - Start, track, and complete rides with OTP verification
- **Earnings Dashboard** - Track daily/weekly earnings and ride statistics
- **Status Management** - Toggle between active/inactive status

### 🔧 Technical Features

- **Real-time Communication** - Socket.IO for instant updates and notifications
- **Geospatial Queries** - MongoDB geospatial indexing for location-based searches
- **Mobile-First Design** - Optimized for mobile devices with responsive Tailwind CSS
- **Progressive Web App** - PWA capabilities for mobile installation
- **Error Handling** - Comprehensive error handling and validation
- **Security** - JWT authentication, password hashing, and token blacklisting
- **Auto-reconnection** - Automatic socket reconnection and token mismatch handling

---

## 🛠️ Tech Stack

### Frontend Technologies

- **React 19.1.0** - Modern React with latest features and concurrent rendering
- **Vite 6.3.5** - Fast build tool and development server with HMR
- **React Router DOM 7.6.1** - Client-side routing with nested routes
- **Tailwind CSS 4.1.7** - Utility-first CSS framework for rapid UI development
- **Socket.IO Client 4.8.1** - Real-time bidirectional communication
- **Axios 1.9.0** - Promise-based HTTP client for API requests
- **GSAP 3.13.0** - High-performance animations and transitions
- **@react-google-maps/api 2.20.6** - Google Maps integration for React
- **Remix Icons 4.6.0** - Beautiful open-source icon library

### Backend Technologies

- **Node.js 18+** - JavaScript runtime built on Chrome's V8 engine
- **Express.js 5.1.0** - Fast, unopinionated web framework for Node.js
- **MongoDB** - NoSQL document database for flexible data storage
- **Mongoose 8.15.1** - Elegant MongoDB object modeling for Node.js
- **Socket.IO 4.8.1** - Real-time bidirectional event-based communication
- **JWT (jsonwebtoken 9.0.2)** - JSON Web Tokens for secure authentication
- **bcrypt 6.0.0** - Password hashing function for secure password storage
- **Express Validator 7.2.1** - Middleware for input validation and sanitization
- **CORS 2.8.5** - Cross-Origin Resource Sharing middleware
- **dotenv 16.5.0** - Environment variable management
- **cookie-parser 1.4.7** - Cookie parsing middleware

### Development & Build Tools

- **ESLint 9.25.0** - JavaScript linting utility for code quality
- **Nodemon 3.1.10** - Development server with automatic restart
- **Vite** - Frontend build tool with fast HMR and optimized builds
- **Git** - Distributed version control system
- **GitHub** - Code repository and collaboration platform

### Deployment & Hosting

- **Vercel** - Frontend hosting with automatic deployments from Git
- **Render** - Backend hosting with automatic deployments and scaling
- **MongoDB Atlas** - Cloud-hosted MongoDB database service

---

## 📁 Detailed Project Structure

```
uber-clone/
├── Backend/                           # Node.js/Express backend application
│   ├── config/
│   │   └── connectToDb.js            # MongoDB connection configuration
│   ├── controllers/                   # Request handlers and business logic
│   │   ├── user.controller.js        # User authentication, profile, logout
│   │   ├── captain.controller.js     # Captain auth, profile, location updates
│   │   ├── ride.controller.js        # Ride creation, confirmation, management
│   │   └── map.controller.js         # Maps, geocoding, distance calculation
│   ├── models/                       # Mongoose database schemas
│   │   ├── user.model.js            # User schema with authentication methods
│   │   ├── captain.model.js         # Captain schema with vehicle details
│   │   ├── ride.model.js            # Ride schema with status tracking
│   │   └── blacklistToken.model.js  # JWT token blacklist for logout
│   ├── routes/                       # Express route definitions
│   │   ├── user.routes.js           # User registration, login, profile routes
│   │   ├── captain.routes.js        # Captain registration, login, location routes
│   │   ├── ride.routes.js           # Ride creation, confirmation, status routes
│   │   └── maps.routes.js           # Maps, geocoding, autocomplete routes
│   ├── services/                     # Business logic and external API calls
│   │   ├── user.service.js          # User-related business operations
│   │   ├── captain.service.js       # Captain-related business operations
│   │   ├── ride.service.js          # Ride management and fare calculation
│   │   └── maps.service.js          # Google Maps API integration
│   ├── middlewares/                  # Custom Express middleware
│   │   └── auth.middlewares.js      # JWT authentication and authorization
│   ├── utils/                        # Utility functions and helpers
│   │   └── distanceCalculator.js    # Distance and fare calculation utilities
│   ├── app.js                       # Express application configuration
│   ├── server.js                    # Server entry point with Socket.IO setup
│   ├── package.json                 # Backend dependencies and scripts
│   └── render.yaml                  # Render deployment configuration
│
├── Frontend/                         # React frontend application
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   ├── CaptainDetails.jsx   # Captain profile and statistics display
│   │   │   ├── ConfirmRide.jsx      # Ride confirmation component
│   │   │   ├── ConfirmRidePanel.jsx # Ride confirmation panel with details
│   │   │   ├── ConfirmRidePopUp.jsx # Modal for ride confirmation
│   │   │   ├── FinishRide.jsx       # Ride completion interface
│   │   │   ├── LiveTracking.jsx     # Real-time location tracking map
│   │   │   ├── LocationSearchPanel.jsx # Location search with autocomplete
│   │   │   ├── LookingForDriver.jsx # Driver search loading animation
│   │   │   ├── MapFallback.jsx      # Fallback component when maps fail
│   │   │   ├── RideCompleted.jsx    # Ride completion success screen
│   │   │   ├── RidePopUp.jsx        # Ride request notification popup
│   │   │   ├── SocketStatus.jsx     # Real-time socket connection indicator
│   │   │   ├── SocketTester.jsx     # Socket connection testing component
│   │   │   ├── Spinner.jsx          # Loading spinner component
│   │   │   ├── Toast.jsx            # Toast notification system
│   │   │   ├── VehiclePanel.jsx     # Vehicle selection with pricing
│   │   │   └── WaitingForDriver.jsx # Driver arrival waiting screen
│   │   ├── pages/                   # Page components (route handlers)
│   │   │   ├── Start.jsx            # Landing page with app introduction
│   │   │   ├── UserLogin.jsx        # User authentication login form
│   │   │   ├── UserSignup.jsx       # User registration form
│   │   │   ├── UserLogout.jsx       # User logout handler
│   │   │   ├── UserProtectedWrapper.jsx # Protected route wrapper for users
│   │   │   ├── Home.jsx             # User dashboard with ride booking
│   │   │   ├── Riding.jsx           # Active ride tracking page
│   │   │   ├── CaptainLogin.jsx     # Captain authentication login form
│   │   │   ├── CaptainSignup.jsx    # Captain registration with vehicle details
│   │   │   ├── CaptainLogout.jsx    # Captain logout handler
│   │   │   ├── CaptainProtectedWrapper.jsx # Protected route wrapper for captains
│   │   │   ├── CaptainHome.jsx      # Captain dashboard with ride requests
│   │   │   └── CaptainRiding.jsx    # Captain active ride management
│   │   ├── context/                 # React Context API providers
│   │   │   ├── UserContext.jsx      # User state management and authentication
│   │   │   ├── CaptainContext.jsx   # Captain state management and authentication
│   │   │   └── SocketContext.jsx    # Socket.IO connection and event management
│   │   ├── hooks/                   # Custom React hooks
│   │   │   └── useToast.js         # Toast notification management hook
│   │   ├── utils/                   # Utility functions and helpers
│   │   │   ├── avatarGenerator.js   # Dynamic avatar generation utilities
│   │   │   └── authUtils.js        # Authentication helper functions
│   │   ├── assets/                  # Static assets and media files
│   │   │   ├── logo.png            # Application logo
│   │   │   ├── homepage-cover.jpg   # Homepage background image
│   │   │   ├── car.png             # Car vehicle icon
│   │   │   ├── bike.png            # Motorcycle vehicle icon
│   │   │   └── auto.png            # Auto-rickshaw vehicle icon
│   │   ├── App.jsx                 # Main application component with routing
│   │   ├── main.jsx                # Application entry point with providers
│   │   └── index.css               # Global styles and Tailwind imports
│   ├── public/                     # Public static assets
│   │   ├── index.html              # HTML template
│   │   └── favicon.ico             # Application favicon
│   ├── package.json                # Frontend dependencies and scripts
│   ├── vite.config.js              # Vite build tool configuration
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   └── eslint.config.js            # ESLint linting configuration
│
├── README.md                       # Comprehensive project documentation
├── .gitignore                      # Git ignore patterns
└── package.json                    # Root workspace package.json
```

---

## 🔧 Frontend Architecture

### Component Structure

The frontend follows a modular component architecture with clear separation of concerns:

#### Core Components

- **App.jsx** - Main application with routing configuration
- **main.jsx** - Application entry point with context providers

#### Page Components

- **Start.jsx** - Landing page with app introduction
- **UserLogin.jsx** - User authentication with form validation
- **UserSignup.jsx** - User registration with input validation
- **CaptainLogin.jsx** - Captain authentication interface
- **CaptainSignup.jsx** - Captain registration with vehicle details
- **Home.jsx** - User dashboard with ride booking functionality
- **CaptainHome.jsx** - Captain dashboard with ride request management
- **Riding.jsx** - Active ride tracking for users
- **CaptainRiding.jsx** - Active ride management for captains

#### Reusable Components

- **LocationSearchPanel.jsx** - Google Maps autocomplete integration
- **VehiclePanel.jsx** - Vehicle selection with dynamic pricing
- **LiveTracking.jsx** - Real-time GPS tracking with Socket.IO
- **RidePopUp.jsx** - Ride request notifications
- **ConfirmRidePopUp.jsx** - Ride confirmation modals
- **SocketStatus.jsx** - Real-time connection status indicator

### State Management

- **UserContext.jsx** - User authentication and profile state
- **CaptainContext.jsx** - Captain authentication and profile state
- **SocketContext.jsx** - Real-time communication management

### Routing Structure

```javascript
// Protected Routes
/home                    # User dashboard (protected)
/captain-home           # Captain dashboard (protected)
/riding                 # Active ride page (protected)
/captain-riding         # Captain ride management (protected)

// Authentication Routes
/login                  # User login
/signup                 # User registration
/captain-login          # Captain login
/captain-signup         # Captain registration

// Public Routes
/                       # Landing page
```

### Frontend Libraries & Dependencies

#### Core Dependencies

```json
{
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "react-router-dom": "^7.6.1",
  "vite": "^6.3.5"
}
```

#### UI & Styling

```json
{
  "tailwindcss": "^4.1.7",
  "@tailwindcss/vite": "^4.1.7",
  "remixicon": "^4.6.0",
  "gsap": "^3.13.0",
  "@gsap/react": "^2.1.2"
}
```

#### Communication & APIs

```json
{
  "axios": "^1.9.0",
  "socket.io-client": "^4.8.1",
  "@react-google-maps/api": "^2.20.6"
}
```

#### Development Tools

```json
{
  "eslint": "^9.25.0",
  "@vitejs/plugin-react": "^4.4.1",
  "globals": "^16.0.0"
}
```

---

## 📚 API Documentation

### Base URLs

- **Development:** `http://localhost:3000`
- **Production:** `https://uber-clone-backend-3rbv.onrender.com`

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## 👥 User API Endpoints

### 1. User Registration

**POST** `/users/register`

Register a new user account.

**Request Body:**

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response (201):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d5ecb74b24a1234567890a",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

### 2. User Login

**POST** `/users/login`

Authenticate user and get access token.

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d5ecb74b24a1234567890a",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

### 3. Get User Profile

**GET** `/users/profile`

Get authenticated user's profile information.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "user": {
    "_id": "60d5ecb74b24a1234567890a",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

### 4. User Logout

**GET** `/users/logout`

Logout user and blacklist the token.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

---

## 🚕 Captain API Endpoints

### 1. Captain Registration

**POST** `/captains/register`

Register a new captain with vehicle details.

**Request Body:**

```json
{
  "fullname": {
    "firstname": "Jane",
    "lastname": "Smith"
  },
  "email": "jane.smith@example.com",
  "password": "securePassword123",
  "vehicle": {
    "color": "Red",
    "plate": "ABC-1234",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

**Response (201):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "_id": "60d5ecb74b24a1234567890b",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane.smith@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC-1234",
      "capacity": 4,
      "vehicleType": "car"
    },
    "status": "inactive"
  }
}
```

### 2. Captain Login

**POST** `/captains/login`

Authenticate captain and get access token.

**Request Body:**

```json
{
  "email": "jane.smith@example.com",
  "password": "securePassword123"
}
```

**Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "_id": "60d5ecb74b24a1234567890b",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane.smith@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC-1234",
      "capacity": 4,
      "vehicleType": "car"
    },
    "status": "inactive"
  }
}
```

### 3. Get Captain Profile

**GET** `/captains/profile`

Get authenticated captain's profile information.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "captain": {
    "_id": "60d5ecb74b24a1234567890b",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane.smith@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC-1234",
      "capacity": 4,
      "vehicleType": "car"
    },
    "status": "active",
    "location": {
      "ltd": 19.076,
      "lng": 72.8777
    }
  }
}
```

### 4. Update Captain Location

**POST** `/captains/update-location`

Update captain's current location for real-time tracking.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "location": {
    "ltd": 19.076,
    "lng": 72.8777
  }
}
```

**Response (200):**

```json
{
  "message": "Location updated successfully",
  "location": {
    "ltd": 19.076,
    "lng": 72.8777
  },
  "status": "active"
}
```

### 5. Captain Logout

**GET** `/captains/logout`

Logout captain and blacklist the token.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

---

## 🚗 Ride API Endpoints

### 1. Get Fare Estimate

**GET** `/rides/get-fare`

Calculate fare for a trip between pickup and destination.

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

```
pickup=Mumbai Central Station
destination=Bandra West
```

**Response (200):**

```json
{
  "pickup": "Mumbai Central Station",
  "destination": "Bandra West",
  "fare": {
    "auto": 85.5,
    "car": 120.75,
    "motorcycle": 45.25
  },
  "distance": "8.5 km",
  "duration": "25 mins"
}
```

### 2. Create Ride

**POST** `/rides/create`

Create a new ride request.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "pickup": "Mumbai Central Station",
  "destination": "Bandra West",
  "vehicleType": "car"
}
```

**Response (201):**

```json
{
  "ride": {
    "_id": "60d5ecb74b24a1234567890c",
    "user": "60d5ecb74b24a1234567890a",
    "pickup": "Mumbai Central Station",
    "destination": "Bandra West",
    "fare": 120.75,
    "status": "pending",
    "otp": "123456",
    "createdAt": "2023-06-25T10:30:00.000Z"
  }
}
```

### 3. Confirm Ride (Captain)

**POST** `/rides/confirm`

Captain confirms and accepts a ride request.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "rideId": "60d5ecb74b24a1234567890c"
}
```

**Response (200):**

```json
{
  "ride": {
    "_id": "60d5ecb74b24a1234567890c",
    "user": {
      "_id": "60d5ecb74b24a1234567890a",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      }
    },
    "captain": {
      "_id": "60d5ecb74b24a1234567890b",
      "fullname": {
        "firstname": "Jane",
        "lastname": "Smith"
      },
      "vehicle": {
        "color": "Red",
        "plate": "ABC-1234",
        "vehicleType": "car"
      }
    },
    "pickup": "Mumbai Central Station",
    "destination": "Bandra West",
    "fare": 120.75,
    "status": "accepted",
    "otp": "123456"
  }
}
```

### 4. Start Ride

**GET** `/rides/start-ride`

Start the ride with OTP verification.

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

```
rideId=60d5ecb74b24a1234567890c
otp=123456
```

**Response (200):**

```json
{
  "ride": {
    "_id": "60d5ecb74b24a1234567890c",
    "status": "ongoing",
    "startTime": "2023-06-25T10:45:00.000Z"
  }
}
```

### 5. End Ride

**POST** `/rides/end-ride`

Complete the ride and calculate final fare.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "rideId": "60d5ecb74b24a1234567890c"
}
```

**Response (200):**

```json
{
  "ride": {
    "_id": "60d5ecb74b24a1234567890c",
    "status": "completed",
    "endTime": "2023-06-25T11:15:00.000Z",
    "duration": 1800,
    "finalFare": 120.75
  }
}
```

---

## 🗺️ Maps API Endpoints

### 1. Get Coordinates

**GET** `/maps/get-coordinates`

Get latitude and longitude for an address.

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

```
address=Mumbai Central Station
```

**Response (200):**

```json
{
  "ltd": 19.033,
  "lng": 72.8397
}
```

### 2. Get Distance and Time

**GET** `/maps/get-distance-time`

Calculate distance and travel time between two locations.

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

```
origin=Mumbai Central Station
destination=Bandra West
```

**Response (200):**

```json
{
  "distance": {
    "text": "8.5 km",
    "value": 8500
  },
  "duration": {
    "text": "25 mins",
    "value": 1500
  }
}
```

### 3. Get Address Suggestions

**GET** `/maps/get-suggestions`

Get autocomplete suggestions for address input.

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

```
input=Mumbai Central
```

**Response (200):**

```json
[
  "Mumbai Central Station, Mumbai, Maharashtra, India",
  "Mumbai Central Railway Station, Mumbai, Maharashtra, India",
  "Mumbai Central Bus Depot, Mumbai, Maharashtra, India",
  "Mumbai Central Post Office, Mumbai, Maharashtra, India"
]
```

---

## 🔌 Socket.IO Events

### Client to Server Events

#### 1. join-room

Join a specific room for real-time updates.

```javascript
socket.emit("join-room", { userId: "user123", userType: "user" });
```

#### 2. update-location-captain

Captain broadcasts location update.

```javascript
socket.emit("update-location-captain", {
  userId: "captain123",
  location: { ltd: 19.076, lng: 72.8777 },
});
```

#### 3. new-ride

User creates a new ride request.

```javascript
socket.emit("new-ride", {
  rideId: "ride123",
  pickup: "Mumbai Central",
  destination: "Bandra West",
});
```

### Server to Client Events

#### 1. location-receive

Receive location updates from captain.

```javascript
socket.on("location-receive", (data) => {
  console.log("Captain location:", data.location);
});
```

#### 2. ride-confirmed

Ride has been confirmed by a captain.

```javascript
socket.on("ride-confirmed", (ride) => {
  console.log("Ride confirmed:", ride);
});
```

#### 3. ride-started

Ride has been started.

```javascript
socket.on("ride-started", (ride) => {
  console.log("Ride started:", ride);
});
```

#### 4. ride-ended

Ride has been completed.

```javascript
socket.on("ride-ended", (ride) => {
  console.log("Ride completed:", ride);
});
```

---

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **MongoDB** - [Local installation](https://docs.mongodb.com/manual/installation/) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Google Maps API Key** - [Get API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)
- **Git** - [Download](https://git-scm.com/)

---

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/uber-clone.git
cd uber-clone
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Or start production server
npm start
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in new terminal)
cd Frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Build for production
npm run build
```

### 4. Environment Configuration

#### Backend (.env)

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URL=mongodb://localhost:27017/uber-clone
# For MongoDB Atlas:
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/uber-clone

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=24h

# Google Maps API (for location services)
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:3000

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

---

## 🚀 Deployment

### Backend Deployment (Render)

1. **Create Render Account** - [Sign up](https://render.com/)

2. **Create Web Service**

   - Connect your GitHub repository
   - Select the `Backend` directory as root
   - Use the following settings:
     ```
     Build Command: npm install
     Start Command: npm start
     ```

3. **Environment Variables**
   Set the following environment variables in Render dashboard:

   ```
   NODE_ENV=production
   PORT=3000
   MONGODB_URL=your-mongodb-atlas-connection-string
   JWT_SECRET=your-production-jwt-secret
   JWT_EXPIRES_IN=24h
   GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

4. **Deploy**
   - Render will automatically deploy when you push to main branch

### Frontend Deployment (Vercel)

1. **Create Vercel Account** - [Sign up](https://vercel.com/)

2. **Import Project**

   - Connect your GitHub repository
   - Select the `Frontend` directory as root
   - Vercel will auto-detect it's a Vite project

3. **Environment Variables**
   Set the following environment variables in Vercel dashboard:

   ```
   VITE_API_URL=https://your-backend-domain.onrender.com
   VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

4. **Deploy**
   - Vercel will automatically deploy when you push to main branch

---

## 📱 Mobile Usage Guide

This application is specifically designed for mobile devices. Here's how to get the best experience:

### 🔧 Desktop Testing (Mobile View)

1. **Open Chrome DevTools** (F12)
2. **Click the device toggle** (📱 icon) or press `Ctrl+Shift+M`
3. **Select a mobile device** (iPhone 12 Pro, Pixel 5, etc.)
4. **Visit your deployed frontend URL**

### 📱 Mobile Device (Recommended)

1. **Open your mobile browser** (Chrome, Safari, etc.)
2. **Visit your deployed frontend URL**
3. **Add to Home Screen** for app-like experience

### ✨ Features Optimized for Mobile

- **Touch-friendly interface** with large tap targets
- **Swipe gestures** for panel interactions
- **Mobile-optimized maps** with touch controls
- **Responsive layouts** that adapt to screen size
- **Fast loading** optimized for mobile networks

---

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd Backend
npm test

# Frontend tests
cd Frontend
npm test
```

### Manual Testing Checklist

#### User Flow

- [ ] User registration and login
- [ ] Location search and autocomplete
- [ ] Vehicle selection and fare calculation
- [ ] Ride booking and confirmation
- [ ] Real-time ride tracking
- [ ] Ride completion

#### Captain Flow

- [ ] Captain registration with vehicle details
- [ ] Captain login and profile
- [ ] Location updates and broadcasting
- [ ] Receiving and accepting ride requests
- [ ] Starting rides with OTP verification
- [ ] Completing rides

#### Real-time Features

- [ ] Socket.IO connection status
- [ ] Live location updates
- [ ] Ride status notifications
- [ ] Automatic reconnection

---

## 🔧 Development

### Project Scripts

#### Backend Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
npm run build      # No build step required for Node.js
```

#### Frontend Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Code Structure Guidelines

#### Backend

- **Controllers** - Handle HTTP requests and responses
- **Services** - Business logic and external API calls
- **Models** - Database schemas and methods
- **Routes** - API endpoint definitions
- **Middlewares** - Request processing and authentication
- **Utils** - Helper functions and utilities

#### Frontend

- **Pages** - Route components and main views
- **Components** - Reusable UI components
- **Context** - Global state management
- **Hooks** - Custom React hooks
- **Utils** - Helper functions and utilities

---

## 🔒 Security Features

### Authentication & Authorization

- **JWT Tokens** - Secure authentication with expiration
- **Password Hashing** - bcrypt for secure password storage
- **Token Blacklisting** - Secure logout implementation
- **Protected Routes** - Route-level authentication
- **CORS Configuration** - Cross-origin request security

### Data Validation

- **Input Validation** - express-validator for API endpoints
- **Schema Validation** - Mongoose schema validation
- **XSS Protection** - Input sanitization
- **SQL Injection Prevention** - NoSQL injection protection

### Production Security

- **Environment Variables** - Sensitive data protection
- **HTTPS Enforcement** - Secure communication
- **Rate Limiting** - API abuse prevention
- **Error Handling** - Secure error responses

---

## 🐛 Troubleshooting

### Common Issues

#### Backend Issues

**MongoDB Connection Error**

```bash
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:** Ensure MongoDB is running locally or check Atlas connection string

**JWT Secret Error**

```bash
Error: secretOrPrivateKey has a value of "undefined"
```

**Solution:** Set JWT_SECRET in your .env file

**Google Maps API Error**

```bash
Error: Google Maps API key is not configured
```

**Solution:** Set GOOGLE_MAPS_API_KEY in your .env file

#### Frontend Issues

**API Connection Error**

```bash
Error: Network Error
```

**Solution:** Check VITE_API_URL in .env and ensure backend is running

**Maps Not Loading**

```bash
Error: Google Maps JavaScript API error
```

**Solution:** Check VITE_GOOGLE_MAPS_API_KEY and enable required APIs

**Socket Connection Failed**

```bash
Error: WebSocket connection failed
```

**Solution:** Check backend Socket.IO configuration and CORS settings

### Debug Mode

Enable debug mode for detailed logging:

#### Backend Debug

```bash
DEBUG=* npm run dev
```

#### Frontend Debug

```bash
# Add to .env
VITE_DEBUG=true
```

---

## 🤝 Contributing

We welcome contributions to improve this Uber Clone project!

### How to Contribute

1. **Fork the Repository**

   ```bash
   git fork https://github.com/yourusername/uber-clone.git
   ```

2. **Create Feature Branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Changes**

   - Follow the existing code style
   - Add tests for new features
   - Update documentation

4. **Commit Changes**

   ```bash
   git commit -m "Add amazing feature"
   ```

5. **Push to Branch**

   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open Pull Request**
   - Describe your changes
   - Include screenshots for UI changes
   - Reference any related issues

### Development Guidelines

- **Code Style** - Follow ESLint configuration
- **Commit Messages** - Use conventional commit format
- **Testing** - Add tests for new features
- **Documentation** - Update README for significant changes

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Express.js** - For the robust backend framework
- **MongoDB** - For the flexible database solution
- **Socket.IO** - For real-time communication
- **Google Maps** - For location services
- **Tailwind CSS** - For the utility-first CSS framework
- **Vercel & Render** - For hosting and deployment services

---

## 📊 Project Stats

- **Total Lines of Code:** ~15,000+
- **Components:** 20+ React components
- **API Endpoints:** 15+ RESTful endpoints
- **Real-time Events:** 10+ Socket.IO events
- **Database Models:** 4 MongoDB schemas
- **Dependencies:** 30+ npm packages

---

**⭐ If you found this project helpful, please give it a star on GitHub!**

**🔗 Live Demo:** [https://uber-clone-webapp-ten.vercel.app/](https://uber-clone-webapp-ten.vercel.app/)
