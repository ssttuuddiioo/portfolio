# 🚀 Quick Start

Get your portfolio running in 5 minutes!

## 1. Set Up Sanity (First Time Only)

### Create Sanity Account & Project
```bash
# This will open your browser to create/login to Sanity
npx sanity init --project-plan free
```

Follow the prompts:
- Login/create account
- Create new project
- Choose "Y" to use existing schema
- Dataset: `production`

This will automatically update your project with the correct Sanity credentials.

**Alternative**: Manual setup at [sanity.io/manage](https://www.sanity.io/manage)

## 2. Configure Environment

After Sanity init, create `.env.local`:

```bash
cp env.example .env.local
```

Then edit `.env.local` with your Sanity credentials (you'll see them in the terminal after running `sanity init`).

## 3. Start Development

```bash
npm run dev
```

Open these URLs:
- **Portfolio**: [http://localhost:3000](http://localhost:3000)
- **Sanity Studio**: [http://localhost:3000/studio](http://localhost:3000/studio)

## 4. Add Your First Project

1. Go to [http://localhost:3000/studio](http://localhost:3000/studio)
2. Login with your Sanity account
3. Click **"Project"** → **"+ Create"**
4. Fill in:
   - Title: "My Awesome Project"
   - Click "Generate" next to Slug
   - Technologies: "React", "Next.js", "TypeScript"
   - Description: "A cool project I built"
   - Upload an image
   - Add project URL
5. Click **"Publish"**

## 5. See It Live!

Go back to [http://localhost:3000](http://localhost:3000) and your project will appear!

---

## 🎨 Customization

### Change Hero Text
Edit `components/Hero3D.tsx` - Lines 32-37

### Change Email
Edit `app/page.tsx` - Line 53

### Add More 3D Shapes
Edit `components/Hero3D.tsx` - Add more `<FloatingShape>` components

---

## 📝 Common Commands

```bash
npm run dev      # Start development
npm run build    # Build for production
npm run lint     # Check code quality
```

---

## 🔧 Troubleshooting

**"No projects" showing?**
- Make sure you published the project in Sanity Studio
- Check `.env.local` has correct credentials
- Restart dev server: Stop (Ctrl+C) and run `npm run dev` again

**3D scene not loading?**
- Refresh the page
- Try Chrome/Firefox
- Check console for errors (F12)

**Can't login to Studio?**
- Clear browser cache
- Try incognito mode
- Re-run `npx sanity init`

---

## 🚀 Deploy

Ready to go live?

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

Full deployment guide in `README.md`

---

Need more help? Check `SETUP.md` for detailed instructions.







