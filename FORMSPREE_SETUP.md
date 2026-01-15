# Formspree Setup Guide

## What is Formspree?

Formspree is a form backend service that handles form submissions and sends them to your email (or other destinations). It's perfect for static sites and Next.js apps because you don't need a backend server.

## Step-by-Step Setup

### 1. Create a Formspree Account

1. Go to [https://formspree.io](https://formspree.io)
2. Click **"Sign Up"** (free account available)
3. Verify your email address

### 2. Create a New Form

1. Once logged in, click the **"+ New Form"** button
2. Give it a name like "Portfolio Contact Form"
3. Enter the email address where you want to receive submissions (e.g., `hello@pablognecco.com`)
4. Click **"Create Form"**

### 3. Get Your Form Endpoint

After creating the form, you'll see your form endpoint URL. It will look like:
```
https://formspree.io/f/xkgeovgy
```

**Important:** Copy this entire URL - you'll need it in the next steps.

### 4. Configure Local Development

1. Create a `.env.local` file in your project root (if it doesn't exist):
   ```bash
   touch .env.local
   ```

2. Add your Formspree endpoint to `.env.local`:
   ```
   NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID_HERE
   ```

   Replace `YOUR_FORM_ID_HERE` with your actual form ID from step 3.

3. **Important:** Make sure `.env.local` is in your `.gitignore` file (it should be by default in Next.js)

### 5. Configure Vercel Production

1. Go to your Vercel dashboard: [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **portfolio** project
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"**
5. Add:
   - **Name:** `NEXT_PUBLIC_FORMSPREE_ENDPOINT`
   - **Value:** `https://formspree.io/f/YOUR_FORM_ID_HERE` (your actual endpoint)
   - **Environment:** Select all (Production, Preview, Development)
6. Click **"Save"**
7. **Redeploy** your site for the changes to take effect

### 6. Test Your Form

1. **Local Testing:**
   - Start your dev server: `npm run dev`
   - Go to `http://localhost:3334`
   - Open the Contact section
   - Fill out and submit the form
   - Check your email for the submission

2. **Production Testing:**
   - After deploying with the environment variable set
   - Visit your live site
   - Submit a test form
   - Check your email

## Form Configuration

Your form is already set up correctly! It sends:
- **name** - The sender's name
- **email** - The sender's email address
- **message** - The message content

Formspree will automatically:
- Send you an email with the submission
- Include the sender's email so you can reply directly
- Handle spam protection (on paid plans)

## Free Plan Limitations

The free Formspree plan includes:
- ✅ 50 submissions per month
- ✅ Email notifications
- ✅ Basic spam protection
- ❌ No custom redirects
- ❌ No webhooks

If you need more submissions, consider upgrading to a paid plan.

## Troubleshooting

### Form not submitting?

1. **Check the browser console** for errors
2. **Verify the environment variable** is set correctly:
   - In local dev: Check `.env.local` file
   - In production: Check Vercel environment variables
3. **Check Formspree dashboard** for any errors or blocked submissions
4. **Verify the endpoint URL** is correct (should start with `https://formspree.io/f/`)

### Getting spam?

- Formspree's free plan includes basic spam protection
- Consider upgrading to a paid plan for advanced spam filtering
- You can also add a CAPTCHA (requires code changes)

### Not receiving emails?

1. Check your spam folder
2. Verify the email address in Formspree dashboard
3. Check Formspree's email logs in the dashboard
4. Make sure your email provider isn't blocking Formspree emails

## Additional Resources

- [Formspree Documentation](https://help.formspree.io/)
- [Formspree Dashboard](https://formspree.io/forms)
- [Next.js Environment Variables Guide](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
