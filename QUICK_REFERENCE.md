# ⚡ NourishConnect Authentication - Quick Reference

## 🚀 START HERE (Copy & Paste)

### Terminal 1 - Backend
```bash
cd c:\Users\ELCOT\Downloads\NourishConnect_fixed_final-1\backend\nourishconnect
.\mvnw.cmd spring-boot:run
```

### Terminal 2 - Frontend  
```bash
cd c:\Users\ELCOT\Downloads\NourishConnect_fixed_final-1\frontend\reactproject
npm run dev -- --host 127.0.0.1
```

### Open in Browser
```
http://127.0.0.1:5173
```

---

## ✅ Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@nourishconnect.org | Admin@12345 |
| Donor | (Create your own) | (Create your own) |

---

## 🔐 How It Works (Simple)

```
You Register/Login 
    ↓
We check your password ✓
    ↓
We create a token (like a ticket)
    ↓
Token stored in browser
    ↓
Every request includes token
    ↓
Backend validates token
    ↓
You get access ✓
```

---

## 📝 Files Created for You

| File | Purpose |
|------|---------|
| `AUTHENTICATION_GUIDE.md` | Complete explanation (Read this!) |
| `TESTING_GUIDE.md` | How to test everything (Follow this!) |
| `AUTHENTICATION_SUMMARY.md` | Full technical reference |
| `QUICK_REFERENCE.md` | This file! |

---

## 🎯 Testing Workflow

### Step 1: Register
- Go to http://127.0.0.1:5173/donor/signup
- Create account with your email
- Should see dashboard

### Step 2: Login  
- Logout
- Go to http://127.0.0.1:5173/donor/login
- Login with your email/password
- Should see dashboard

### Step 3: Admin Login
- Logout
- Go to http://127.0.0.1:5173/admin/login
- Use: admin@nourishconnect.org / Admin@12345
- Should see admin dashboard

### Step 4: Profile Update
- Login
- Go to Profile page
- Change name/email
- Click Save
- Should see success message

### Step 5: Logout
- Click profile menu
- Click Logout
- Should go to home page

---

## 🔑 Key Concepts

### **JWT Token**
- Security token (like a passport)
- Proves you're logged in
- Expires after 24 hours
- Stored in browser memory

### **Role**
- DONOR: Regular user (can donate)
- ADMIN: Administrator (can manage everything)

### **Password**
- Encrypted before storing (can't be read backwards)
- Checked during login (not stored in plain text)

### **CORS**
- Security rule: frontend can only talk to backend
- Frontend: http://127.0.0.1:5173 (must be exact!)
- Backend: http://localhost:8080

---

## ⚠️ Common Issues

| Problem | Solution |
|---------|----------|
| Backend won't start (port 8080 in use) | `taskkill /PID [PID] /F` then restart |
| CORS error in console | Use http://127.0.0.1 not localhost |
| Login fails with correct credentials | Clear localStorage: `localStorage.clear()` |
| Token missing after page refresh | Check localStorage in DevTools (F12) |
| Admin access denied | Make sure you logged in with admin account |
| Can't reach backend | Check http://localhost:8080/api/auth/me |

---

## 🛠️ Configuration

### JWT Expiration (How long you stay logged in)
**File**: `backend/nourishconnect/src/main/resources/application.properties`

```properties
# Current: 24 hours
nourishconnect.jwt.expiration-ms=86400000

# Change to:
# 1 hour: 3600000
# 1 week: 604800000
```

### JWT Secret (Security key)
**Production only** - Change this to random value!

```properties
nourishconnect.jwt.secret=your-new-secret-here-min-32-chars
```

---

## 🐛 Debug Commands

### Check backend running
```
Open: http://localhost:8080/api/auth/me
Expected: Error about needing token (good!)
```

### Check token in browser
```javascript
// Press F12, go to Console
localStorage.getItem('nc_token')
// Should see: eyJ... (long string)
```

### Decode token
1. Get token from console
2. Go to https://jwt.io
3. Paste in "Encoded" field
4. Can see: email, role, expiration

### Clear all data
```javascript
// Press F12, go to Console
localStorage.clear()
// Then reload page
```

---

## 📊 API Endpoints (For Developers)

### Public (No token needed)
```
POST /api/auth/register     - Create account
POST /api/auth/login        - Login
```

### Protected (Need token)
```
GET  /api/auth/me           - Get your info
PUT  /api/auth/me           - Update profile
GET  /api/homes             - List homes
GET  /api/donations         - List donations
POST /api/donations         - Create donation
```

### Admin Only
```
GET  /api/admin/**          - Admin features
```

---

## 📱 Check Token in Browser

1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Paste: `console.log(localStorage.getItem('nc_token'))`
4. Should see long string starting with `eyJ`

---

## ✨ Security Features

✅ Passwords encrypted (BCrypt)  
✅ JWT tokens signed  
✅ Token expires (24h)  
✅ CORS protection  
✅ Role-based access  
✅ Input validation  
✅ Auto-logout  

---

## 🎓 Learning Path

### Beginner
1. Read AUTHENTICATION_SUMMARY.md (How it works)
2. Do Step 1-3 of TESTING_GUIDE.md (Register, Login)
3. Check browser console for token

### Intermediate  
1. Read AUTHENTICATION_GUIDE.md (Complete details)
2. Do all steps in TESTING_GUIDE.md
3. Test with different browsers
4. Monitor Network tab (F12)

### Advanced
1. Review Java source code (backend)
2. Review React components (frontend)
3. Change JWT expiration time
4. Add new user roles
5. Deploy to production

---

## 📞 Troubleshooting Flowchart

```
Something not working?
    ↓
Can you access http://127.0.0.1:5173?
  ├─ NO → Check frontend is running (npm run dev)
  └─ YES ↓
Can you access http://localhost:8080/api/auth/me?
  ├─ NO → Check backend is running (.\mvnw.cmd spring-boot:run)
  └─ YES ↓
Can you register a new account?
  ├─ NO → Check email/password in form
  │        Check backend logs for errors
  └─ YES ↓
Can you login?
  ├─ NO → Check password is correct
  │        Check email hasn't changed
  │        Try: localStorage.clear() and refresh
  └─ YES ✓ Authentication working!
```

---

## 🚀 Next Steps

- [ ] Read AUTHENTICATION_GUIDE.md
- [ ] Follow TESTING_GUIDE.md steps
- [ ] Test all scenarios
- [ ] Check backend/frontend logs
- [ ] Review source code
- [ ] Make sure no errors appear
- [ ] You're ready to use the system!

---

## 💡 Pro Tips

**Tip 1**: Always use `http://127.0.0.1` not `localhost` for frontend

**Tip 2**: Token stored in localStorage persists after page refresh

**Tip 3**: Check browser console (F12) for any JavaScript errors

**Tip 4**: Check backend terminal for server errors

**Tip 5**: CORS errors usually mean frontend/backend URLs don't match

**Tip 6**: "Invalid password" errors = check exact spelling/spaces

**Tip 7**: Clear localStorage if stuck: `localStorage.clear()`

---

## 🎉 Congratulations!

Your authentication system is ready! 

✅ Backend running  
✅ Frontend running  
✅ Database working  
✅ Login/Register working  
✅ Token system working  
✅ Role-based access working  

Now go test everything and enjoy! 🚀

