# 🔐 NourishConnect Authentication System Guide

## Overview

Your NourishConnect project uses **JWT (JSON Web Tokens)** for secure authentication. This guide explains how it works and how to use it.

---

## 📋 How Authentication Works

### 1. **User Roles**
- **DONOR**: Regular users who donate food
- **ADMIN**: Administrators who manage the system

### 2. **Authentication Flow**

```
User (Frontend) → Login/Register → Backend (Spring Boot)
                                     ↓
                           Database Check (User exists?)
                                     ↓
                           Password Validation (BCrypt)
                                     ↓
                           JWT Token Generated
                                     ↓
                           Token Sent to Frontend
                                     ↓
Frontend Stores Token → Every API Request Includes Token
                                     ↓
Backend Validates Token → Allows/Denies Request
```

### 3. **Technology Stack**

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Backend** | Spring Boot 3.3.5 | REST API + Security |
| **Database** | H2 (Development) | Store users, donations |
| **Auth Method** | JWT Tokens | Stateless authentication |
| **Password Encoding** | BCrypt | Secure password storage |
| **Frontend** | React + Context API | Store token, manage auth state |

---

## 🔧 System Components

### Backend Components

#### 1. **JwtService.java** - Token Management
```
Creates JWT tokens with:
- User email (subject)
- User role (claim)
- Expiration time (24 hours default)
- Secret key (must be changed in production)
```

#### 2. **JwtAuthenticationFilter.java** - Token Validation
```
For every request:
1. Checks for "Authorization: Bearer <token>" header
2. Validates token signature
3. Extracts user email and role
4. Sets authentication in security context
5. Allows/denies request based on role
```

#### 3. **SecurityConfig.java** - Security Rules
```
Public endpoints (no auth needed):
- POST /api/auth/register (new user signup)
- POST /api/auth/login (user login)

Protected endpoints (token required):
- GET /api/homes (list homes)
- GET /api/auth/me (current user info)
- PUT /api/auth/me (update profile)
- POST /api/donations (create donation)

Admin endpoints (admin token required):
- GET /api/admin/** (all admin routes)
```

#### 4. **AuthController.java** - Login/Register
```
Endpoints:
- POST /api/auth/register - Create new account
- POST /api/auth/login - Login with email/password
- GET /api/auth/me - Get current user info
- PUT /api/auth/me - Update profile
```

### Frontend Components

#### 1. **AuthContext.jsx** - State Management
```
Provides:
- login() - Authenticate user
- register() - Create account
- logout() - Clear session
- updateProfile() - Update user info
- user - Current user state
```

#### 2. **api.js** - HTTP Client
```
Automatically:
- Adds "Authorization: Bearer <token>" to all requests
- Gets token from localStorage
- Handles errors
```

#### 3. **ProtectedRoute.jsx** - Route Protection
```
Prevents:
- Unauthenticated users from accessing protected pages
- Donors accessing admin pages
- Admins accessing donor pages
```

---

## 🚀 Step-by-Step Setup & Running

### Prerequisites
- Java 21 installed
- Node.js 16+ installed
- Maven 3.9+ installed

### Step 1: Set Environment Variables (Backend)

Create a `.env` file in the backend directory or set these system variables:

```bash
# Database
DB_URL=jdbc:h2:file:./data/nourishconnect;MODE=MySQL;AUTO_SERVER=TRUE
DB_USERNAME=sa
DB_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-this-in-production-min-32-chars
JWT_EXPIRATION_MS=86400000  # 24 hours

# Admin Default Account
ADMIN_EMAIL=admin@nourishconnect.org
ADMIN_PASSWORD=Admin@12345
```

**⚠️ Important**: Change the JWT_SECRET to a strong random value for production!

### Step 2: Start Backend

```bash
cd backend/nourishconnect

# Option 1: Using Maven wrapper (recommended)
.\mvnw.cmd spring-boot:run

# Option 2: Build and run JAR
.\mvnw.cmd clean package
java -jar target/nourishconnect-0.0.1-SNAPSHOT.jar
```

**Wait for message**: `NourishconnectApplication : Started NourishconnectApplication`

Backend runs at: **http://localhost:8080**

### Step 3: Start Frontend

In a new terminal:

```bash
cd "frontend/React project"

# Install dependencies (first time only)
npm install

# Start development server
npm run dev -- --host 127.0.0.1
```

Frontend runs at: **http://127.0.0.1:5173**

### Step 4: Test Authentication

#### **Test 1: Register as Donor**
1. Open http://127.0.0.1:5173
2. Click "Sign Up" (or go to `/donor/signup`)
3. Enter:
   - Name: `John Donor`
   - Email: `john@example.com`
   - Password: `Password123!`
4. Click "Sign Up"
5. ✅ Should see dashboard with welcome message

#### **Test 2: Login as Donor**
1. Logout (if logged in)
2. Go to `/donor/login`
3. Enter:
   - Email: `john@example.com`
   - Password: `Password123!`
4. Click "Sign In"
5. ✅ Should see donor dashboard

#### **Test 3: Login as Admin**
1. Go to `/admin/login`
2. Enter:
   - Email: `admin@nourishconnect.org`
   - Password: `Admin@12345`
3. Click "Sign In"
4. ✅ Should see admin dashboard

#### **Test 4: Update Profile**
1. Login as any user
2. Go to Profile page
3. Change name or email
4. Click "Save"
5. ✅ Changes should persist after logout/login

---

## 🔍 Debugging Authentication Issues

### Issue 1: "Invalid email or password"
**Solutions**:
- Check email is correct (lowercase, no spaces)
- Check password is correct
- If new account, make sure you registered first
- Check database connection (see logs)

### Issue 2: Token Validation Failed
**Solutions**:
- Clear browser localStorage: `localStorage.clear()`
- Refresh page
- Check JWT_SECRET matches between requests
- Check token expiration (24 hours)

### Issue 3: CORS Error
**Solutions**:
- Backend CORS is configured for `http://127.0.0.1:5173`
- Check frontend URL matches exactly
- Check Authorization header is being sent

### Issue 4: Can't access Admin panel as Admin
**Solutions**:
- Ensure you logged in with admin account
- Check role is "admin" not "donor"
- Clear token: `localStorage.removeItem('nc_token')`
- Re-login

---

## 📊 Testing Endpoints with cURL

### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123!"}'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "test@example.com",
  "name": "Test User",
  "role": "donor"
}
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

### Get Current User (requires token)
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Profile (requires token)
```bash
curl -X PUT http://localhost:8080/api/auth/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"New Name","email":"newemail@example.com"}'
```

---

## 🔐 Security Features Implemented

✅ **BCrypt Password Hashing** - Passwords not stored in plain text
✅ **JWT Tokens** - Stateless authentication
✅ **CORS Protection** - Only allowed origins
✅ **CSRF Disabled** - Stateless API (not needed)
✅ **Role-Based Access Control** - Different permissions per role
✅ **Token Expiration** - Automatic logout after 24 hours
✅ **Input Validation** - Email format, password length, etc.
✅ **Session Persistence** - Token stored in localStorage

---

## 🛠️ Advanced Configuration

### Change Token Expiration

In `application.properties`:
```properties
nourishconnect.jwt.expiration-ms=3600000  # 1 hour
nourishconnect.jwt.expiration-ms=604800000  # 7 days
```

### Change JWT Secret (Production)

In `application.properties`:
```properties
nourishconnect.jwt.secret=your-very-long-random-secret-with-minimum-32-characters
```

Generate secure secret:
```bash
# On Linux/Mac
openssl rand -hex 32

# On Windows PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes(32))
```

### Add More Admin Accounts

Edit `DataInitializer.java` or add through database:
```sql
INSERT INTO users VALUES (
  '...uuid...',
  'newadmin@example.com',
  '$2a$10$...(bcrypt hash)',
  'Admin Name',
  'ADMIN'
);
```

---

## 📱 Frontend Implementation Details

### Using Authentication in Components

```javascript
import { useAuth } from '../context/AuthContext'

export function MyComponent() {
  const { user, login, logout } = useAuth()
  
  // Check if logged in
  if (!user) return <p>Please login</p>
  
  return (
    <div>
      <p>Welcome {user.name}!</p>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Making Authenticated API Calls

```javascript
import { api, post, put } from '../api.js'

// GET request (token auto-added)
const homes = await api('/homes')

// POST request (token auto-added)
const result = await post('/donations', { 
  food: 'Rice',
  quantity: 10 
})

// PUT request (token auto-added)
const updated = await put('/auth/me', { 
  name: 'New Name' 
})
```

---

## ✅ Quick Checklist

- [ ] Set JWT_SECRET environment variable
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can register new donor account
- [ ] Can login as donor
- [ ] Can login as admin
- [ ] Can update profile
- [ ] Token persists after page refresh
- [ ] Token clears on logout
- [ ] Admin can't access donor pages
- [ ] Donor can't access admin pages
- [ ] All endpoints return proper error messages

---

## 🎯 Next Steps

1. **Test everything** using steps in "Test Authentication" section
2. **Review your code** - understand each component
3. **Check logs** - both backend and browser console
4. **Monitor network** - use DevTools Network tab to see requests
5. **Handle edge cases** - expired tokens, network errors, etc.

For production deployment, see Security section and change JWT_SECRET!
