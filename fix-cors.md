# Fix Sanity Studio CORS Error

## The Problem
Sanity is blocking requests from `http://localhost:3000` because it's not in the allowed CORS origins.

## Quick Fix (2 minutes)

### Step 1: Open Sanity Dashboard
Go to: https://www.sanity.io/manage

### Step 2: Select Your Project
Click on your "Portfolio" project (or whatever you named it)

### Step 3: Go to API Settings
- Click **"API"** in the left sidebar
- Find the **"CORS Origins"** section

### Step 4: Add Localhost
Click **"Add CORS origin"** and add:

```
http://localhost:3000
```

**IMPORTANT:** 
- Use `http://` (not `https://`)
- No trailing slash
- Credentials: **Check "Allow credentials"**

### Step 5: Save
Click **"Add origin"** or **"Save"**

### Step 6: Reload Browser
Go back to: http://localhost:3000/studio
Press: **Cmd + Shift + R** (hard refresh)

## ✅ It Should Work Now!

You should see the Sanity Studio login screen without errors.

---

## For Production (Later)
When you deploy to Vercel, add your production URL too:
```
https://yourdomain.com
https://yourdomain.vercel.app
```







