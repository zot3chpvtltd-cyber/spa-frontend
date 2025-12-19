# Frontend Deployment Instructions

## What Was Fixed

**Problem**: CORS error due to `http://` instead of `https://` in `.env.production`

**Fix Applied**: Changed to `https://api.thestoneedgespa.com/api`

## Step 1: Rebuild Frontend

```bash
cd f:\spa\spa\frontend
npm run build
```

This will create a new `build/` folder with the corrected API URL.

## Step 2: Deploy to Hostinger

### Option A: File Manager (Easiest)

1. Open **Hostinger File Manager**
2. Navigate to `public_html/`
3. **Backup** (optional): Download current files
4. **Delete** old frontend files:
   - `index.html`
   - `asset-manifest.json`
   - `manifest.json`
   - `robots.txt`
   - `static/` folder
   - `logo192.png`, `logo512.png`, `favicon.ico`
   - **DO NOT DELETE** `backend/` folder!
5. **Upload** all files from `f:\spa\spa\frontend\build\`

### Option B: FTP

Use FileZilla or any FTP client:
- **Host**: Your Hostinger FTP host
- **Upload from**: `f:\spa\spa\frontend\build\*`
- **Upload to**: `public_html/`
- **Overwrite**: Yes

## Step 3: Verify

1. **Clear browser cache**: `Ctrl + Shift + Delete`
2. Open `https://thestoneedgespa.com`
3. Open DevTools (F12) → Network tab
4. Try to book a service
5. Check:
   - ✅ No CORS errors
   - ✅ Requests go to `https://api.thestoneedgespa.com`
   - ✅ Services load successfully

## Quick Test

Open browser console and run:
```javascript
console.log('API URL:', process.env.REACT_APP_API_URL);
```

Should show: `https://api.thestoneedgespa.com/api` (not http://)

---

**Status**: Ready to rebuild and deploy!
