# 🧪 NourishConnect Authentication - Complete Testing Guide

## ✅ Current Status

**Backend**: ✓ Running on http://localhost:8080  
**Frontend**: ✓ Running on http://127.0.0.1:5173  
**Database**: ✓ H2 (Auto-initialized)  
**Authentication**: ✓ JWT System Ready

---

## 📝 STEP-BY-STEP TESTING INSTRUCTIONS

### **STEP 1: Open Frontend in Browser**

1. Open your web browser
2. Go to: **http://127.0.0.1:5173**
3. You should see the NourishConnect landing page

---

### **STEP 2: Test Donor Registration**

**Path**: http://127.0.0.1:5173/donor/signup

1. Click "Sign Up" button or go to `/donor/signup`
2. Fill in the form:
   - **Name**: `John Donor`
   - **Email**: `john@example.com`
   - **Password**: `Password@123`
   - **Confirm Password**: `Password@123`
3. Click **"Create Account"**
4. **Expected Result**: 
   - ✅ Redirects to `/donor/dashboard`
   - ✅ Shows welcome message: "Welcome, John Donor!"
   - ✅ Token stored in browser localStorage

**To verify token was saved**:
- Open Browser DevTools (F12)
- Go to **Console** tab
- Type: `localStorage.getItem('nc_token')`
- Should return a long JWT token like: `eyJhbGciOiJIUzI1NiJ9...`

---

### **STEP 3: Test Donor Login**

**Path**: http://127.0.0.1:5173/donor/login

1. First, **logout** (click your profile → Logout)
2. Go to `/donor/login`
3. Fill in:
   - **Email**: `john@example.com`
   - **Password**: `Password@123`
4. Click **"Sign In"**
5. **Expected Result**:
   - ✅ Redirects to `/donor/dashboard`
   - ✅ Same token retrieved from localStorage
   - ✅ Shows "Welcome back!" message

---

### **STEP 4: Test Admin Login**

**Path**: http://127.0.0.1:5173/admin/login

1. Logout if logged in
2. Go to `/admin/login`
3. Fill in:
   - **Email**: `admin@nourishconnect.org`
   - **Password**: `Admin@12345`
4. Click **"Sign In"**
5. **Expected Result**:
   - ✅ Redirects to `/admin/dashboard`
   - ✅ Shows admin interface with special features
   - ✅ Different UI than donor dashboard

---

### **STEP 5: Test Profile Update**

**Path**: http://127.0.0.1:5173/donor/profile (or admin/profile)

1. Login as any user (donor or admin)
2. Go to Profile page
3. Change your name to: `John Updated`
4. Change email to: `john.updated@example.com`
5. Click **"Save Changes"**
6. **Expected Result**:
   - ✅ Shows success message
   - ✅ Profile updates immediately
   - ✅ Logout and login with new email works

---

### **STEP 6: Test Protected Routes**

**Verify role-based access control**:

#### Test 1: Donor can't access admin pages
1. Login as donor (`john@example.com`)
2. Try to access: `http://127.0.0.1:5173/admin/dashboard`
3. **Expected**: ❌ Redirected to `/donor/login` or shows unauthorized message

#### Test 2: Admin can access admin pages
1. Logout and login as admin (`admin@nourishconnect.org`)
2. Access: `http://127.0.0.1:5173/admin/dashboard`
3. **Expected**: ✅ Access granted, admin dashboard visible

#### Test 3: Unauthenticated users can't access protected pages
1. Logout (clear token)
2. Try to access: `http://127.0.0.1:5173/donor/dashboard`
3. **Expected**: ❌ Redirected to `/donor/login`

---

### **STEP 7: Test Logout**

1. Click your profile menu (top right)
2. Click **"Logout"**
3. **Expected Result**:
   - ✅ Redirects to home page or login page
   - ✅ localStorage.getItem('nc_token') returns `null`
   - ✅ Verify in DevTools Console (F12)

---

### **STEP 8: Test Token Expiration (Advanced)**

Tokens expire after 24 hours by default.

To test immediately:
1. In `application.properties` (backend):
   ```properties
   nourishconnect.jwt.expiration-ms=10000  # 10 seconds
   ```
2. Restart backend
3. Login and wait 10 seconds
4. Make any API request (refresh page, click a button)
5. **Expected**: ❌ Token expired, redirects to login

---

## 🔍 Debugging Checklist

### If registration fails:

- [ ] Check browser console (F12) for errors
- [ ] Check backend logs for error messages
- [ ] Verify email is not already registered (try different email)
- [ ] Check password is at least 6 characters
- [ ] Verify backend is running: `curl http://localhost:8080/api/auth/login -v`

### If login fails:

- [ ] Verify email is correct (check case sensitivity)
- [ ] Verify password is correct
- [ ] Check if account exists (try registering first)
- [ ] Clear browser cache: `localStorage.clear()`
- [ ] Refresh page and try again

### If redirect doesn't work:

- [ ] Check browser console for errors (F12 → Console)
- [ ] Verify token is being stored: `localStorage.getItem('nc_token')`
- [ ] Check network requests (F12 → Network tab)
- [ ] Verify backend is responding: Open `http://localhost:8080/api/auth/me` with token in header

### If "CORS Error" appears:

- [ ] Backend must be on `http://localhost:8080`
- [ ] Frontend must be on `http://127.0.0.1:5173`
- [ ] Never use `localhost:5173` - use `127.0.0.1:5173`
- [ ] Restart both services if URLs changed

---

## 🛠️ Testing via Terminal/API

### Test Registration

```powershell
$response = Invoke-WebRequest -Uri 'http://localhost:8080/api/auth/register' `
  -Method POST `
  -Body (@{name="Test User"; email="testuser@example.com"; password="Test@12345"} | ConvertTo-Json) `
  -ContentType 'application/json'

$response.Content | ConvertFrom-Json
```

**Expected Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "testuser@example.com",
  "name": "Test User",
  "role": "donor"
}
```

### Test Login

```powershell
$response = Invoke-WebRequest -Uri 'http://localhost:8080/api/auth/login' `
  -Method POST `
  -Body (@{email="john@example.com"; password="Password@123"} | ConvertTo-Json) `
  -ContentType 'application/json'

$response.Content | ConvertFrom-Json
```

### Test Get Current User (Authenticated)

```powershell
$token = "YOUR_TOKEN_HERE"
$headers = @{"Authorization" = "Bearer $token"}

$response = Invoke-WebRequest -Uri 'http://localhost:8080/api/auth/me' `
  -Headers $headers

$response.Content | ConvertFrom-Json
```

---

## 📊 Common Test Scenarios

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| **New User Registration** | Go to /donor/signup → Fill form → Submit | Redirects to dashboard, token saved |
| **Login with Correct Credentials** | Go to /donor/login → Enter email/password → Submit | Redirects to dashboard, same token |
| **Login with Wrong Password** | Go to /donor/login → Enter wrong password | Error message: "Invalid email or password" |
| **Login with Non-existent Email** | Go to /donor/login → Enter unknown email | Error message: "Invalid email or password" |
| **Access Admin Page as Donor** | Login as donor → Go to /admin/dashboard | Redirected to /donor/login |
| **Access Donor Page as Admin** | Login as admin → Go to /donor/dashboard | Works (admin has all access) |
| **Access Protected Page Without Token** | Clear localStorage → Go to /donor/dashboard | Redirected to /donor/login |
| **Update Profile** | Login → Go to profile → Change name/email → Save | Success message, changes persist |
| **Logout** | Click logout | Token removed, redirected to home |

---

## 🔐 Security Verification

Check these security features are working:

- [ ] **Passwords are hashed** - Never see plain password in database
  - Check: Backend logs should NOT print passwords
  
- [ ] **Tokens work** - Only authenticated users can access protected endpoints
  - Check: Can't access `/donor/dashboard` without token
  
- [ ] **Role-based access** - Donors can't access admin features
  - Check: Donor can't POST to `/api/admin/**` endpoints
  
- [ ] **CORS works** - Frontend can talk to backend
  - Check: Network requests don't show CORS errors (F12 → Network)
  
- [ ] **Token expires** - Should auto-logout after 24 hours (or configured time)
  - Check: After 24 hours, API calls should fail with 401 Unauthorized

---

## 📱 Mobile Testing

Test on different devices:

1. **Same machine, different browser**
   - Chrome, Firefox, Edge should all work
   
2. **Different machine on same network**
   - Replace `127.0.0.1` with your computer's IP
   - Example: `http://192.168.1.100:5173`
   - Update CORS settings in backend if needed

3. **Mobile device**
   - Connect to same WiFi
   - Go to `http://YOUR_IP:5173`
   - Test registration, login, profile update

---

## ✅ Final Verification Checklist

- [ ] Backend running on http://localhost:8080
- [ ] Frontend running on http://127.0.0.1:5173
- [ ] Can register new donor account
- [ ] Can login with registered account
- [ ] Can login as admin
- [ ] Can update profile
- [ ] Token visible in localStorage
- [ ] Logout clears token
- [ ] Role-based access working
- [ ] Error messages display properly
- [ ] No CORS errors in console
- [ ] No 500 errors in backend logs

**If all checks pass, your authentication system is working correctly! ✅**

---

## 🆘 Still Having Issues?

### Backend Logs
Check `backend/nourishconnect/target/classes/` for any error logs

### Frontend Errors
Open DevTools (F12):
- **Console** tab - JavaScript errors
- **Network** tab - API call failures
- **Application** tab - Check localStorage and cookies

### Common Errors

**"Port 8080 already in use"**
```powershell
netstat -ano | findstr :8080
taskkill /PID [PID_NUMBER] /F
```

**"CORS Error"**
- Check frontend URL is exactly `http://127.0.0.1:5173`
- Backend CORS must have this URL

**"Invalid token"**
- Clear localStorage: `localStorage.clear()`
- Re-login
- Check token hasn't expired (F12 → Console)

---

## 🚀 Next Steps

Once testing is complete:

1. **Add more test users** - Create different donor accounts
2. **Test API endpoints** - Make donations, track donations
3. **Test admin features** - View all donations, manage homes
4. **Deploy to production** - Change JWT_SECRET to secure value
5. **Monitor logs** - Check backend logs for errors regularly

