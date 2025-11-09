# Quick Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Sanity.io account

## Step-by-Step Setup

### 1. Set Up Sanity

1. **Create a Sanity project:**
   - Visit [https://www.sanity.io/manage](https://www.sanity.io/manage)
   - Click "Create project"
   - Name your project
   - Choose a dataset name (default: "production")

2. **Get your credentials:**
   - Project ID: Found in project settings
   - Dataset: The dataset name you chose
   - API Token: Create one in Settings → API → Tokens (choose "Editor" permissions)

### 2. Configure Environment

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_actual_token
```

### 3. Start Development

```bash
# Install dependencies (if not already installed)
npm install

# Start the dev server
npm run dev
```

### 4. Open Your Portfolio

- Portfolio: [http://localhost:3000](http://localhost:3000)
- Sanity Studio: [http://localhost:3000/studio](http://localhost:3000/studio)

### 5. Add Your First Project

1. Go to [http://localhost:3000/studio](http://localhost:3000/studio)
2. Click "Project" in the sidebar
3. Click "Create new document"
4. Fill in the project details:
   - **Title**: Your project name
   - **Slug**: Will auto-generate (click "Generate")
   - **Technologies**: Add tech stack items (press Enter after each)
   - **Description**: Short description
   - **Image**: Upload a project screenshot
   - **Project URL**: Link to live project
   - **GitHub URL**: Link to repository
   - **Featured**: Toggle to show on homepage
   - **Order**: Number for sorting (lower = first)
5. Click "Publish"

### 6. Customize Your Portfolio

#### Update Hero Section

Edit `components/Hero3D.tsx`:
- Change the title
- Update the tagline
- Modify button text/links

#### Update Contact Info

Edit `app/page.tsx`:
- Update email in `ContactSection`

#### Customize Colors

The portfolio uses a purple gradient theme. To change:
- Edit Tailwind classes in components
- Or update `tailwind.config.ts`

### 7. Deploy

#### Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables from `.env.local`
5. Deploy!

#### Environment Variables for Vercel

```
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
SANITY_API_TOKEN
```

## Troubleshooting

### "No projects yet" message

- Make sure you've published projects in Sanity Studio
- Check that environment variables are set correctly
- Restart the dev server after adding env vars

### 3D scene not rendering

- Make sure all Three.js dependencies are installed
- Check browser console for errors
- Try a different browser (Chrome/Firefox recommended)

### Sanity Studio won't load

- Verify your Project ID in `.env.local`
- Make sure you're logged into Sanity
- Check that `sanity.config.ts` has correct project ID

## Next Steps

- Add more schemas (blog posts, testimonials, etc.)
- Customize the 3D scene with your own models
- Add more sections (About, Skills, etc.)
- Implement blog functionality
- Add animations with Framer Motion

## Support

- [Next.js Docs](https://nextjs.org/docs)
- [Sanity Docs](https://www.sanity.io/docs)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)







