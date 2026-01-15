# Quick Vercel Setup for Formspree

## Your Current Configuration

✅ **Local (.env.local):** Already configured with `https://formspree.io/f/xkgeovgy`

## Steps to Configure in Vercel

### Option 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your **portfolio** project

2. **Navigate to Environment Variables**
   - Click on **Settings** (gear icon)
   - Click **Environment Variables** in the left sidebar

3. **Add the Variable**
   - Click **"Add New"** button
   - Fill in:
     ```
     Name: NEXT_PUBLIC_FORMSPREE_ENDPOINT
     Value: https://formspree.io/f/xkgeovgy
     ```
   - Select all environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **"Save"**

4. **Redeploy**
   - Go to **Deployments** tab
   - Click the **"..."** menu on the latest deployment
   - Click **"Redeploy"**
   - Or push a new commit to trigger automatic deployment

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link your project (if not already linked)
vercel link

# Add the environment variable
vercel env add NEXT_PUBLIC_FORMSPREE_ENDPOINT

# When prompted, enter: https://formspree.io/f/xkgeovgy
# Select all environments (Production, Preview, Development)

# Redeploy
vercel --prod
```

## Verify It's Working

1. **Check Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables
   - You should see `NEXT_PUBLIC_FORMSPREE_ENDPOINT` listed

2. **Test the Form**
   - Visit your live site (yopablo.com or yopablo.studio)
   - Open the Contact section
   - Fill out and submit the form
   - Check your email for the submission

3. **Check Browser Console**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Submit the form
   - You should NOT see "Formspree endpoint not configured" error

## Troubleshooting

### Still seeing "Formspree endpoint not configured"?

1. **Verify the variable name** is exactly: `NEXT_PUBLIC_FORMSPREE_ENDPOINT`
   - Case-sensitive!
   - Must start with `NEXT_PUBLIC_` for client-side access

2. **Check it's set for the right environment**
   - Make sure Production is selected
   - Preview and Development are optional but recommended

3. **Redeploy after adding**
   - Environment variables only apply to new deployments
   - You MUST redeploy after adding/changing variables

4. **Check the endpoint URL**
   - Should be: `https://formspree.io/f/xkgeovgy`
   - No trailing slash
   - No extra spaces

### Form submits but no email received?

1. **Check Formspree Dashboard**
   - Go to https://formspree.io/forms
   - Check if submissions are appearing there
   - Verify your email address is correct

2. **Check Spam Folder**
   - Formspree emails sometimes go to spam initially

3. **Verify Formspree Account**
   - Make sure you've verified your email in Formspree
   - Check if you've hit the free plan limit (50/month)

### Need to test locally?

Your `.env.local` file already has the endpoint configured. Just run:
```bash
npm run dev
```

The form should work at `http://localhost:3334`
