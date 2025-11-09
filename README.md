# Next.js Portfolio Starter

A modern portfolio template with an interactive 3D hero section and Sanity CMS integration.

## ✨ Features

- 🎨 Interactive 3D hero section with Three.js
- 📝 Sanity CMS for content management
- ⚡ Next.js 15 with App Router
- 💅 Tailwind CSS for styling
- 📱 Fully responsive design
- 🚀 TypeScript for type safety

## 🚀 Quick Setup

### 1. Install Dependencies

Dependencies are already installed. If needed, run:

```bash
npm install
```

### 2. Set Up Sanity

#### Create a Sanity Project

1. Go to [sanity.io](https://www.sanity.io/) and sign up/login
2. Create a new project
3. Note your Project ID and Dataset name

#### Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp env.example .env.local
```

Update the values:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token
```

To get your API token:
1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Select your project
3. Go to API → Tokens
4. Create a new token with Editor permissions

### 3. Start Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your portfolio.

### 4. Access Sanity Studio

The Sanity Studio is embedded in your Next.js app:

```
http://localhost:3000/studio
```

## 📁 Project Structure

```
portfolio/
├── app/
│   ├── page.tsx           # Homepage with 3D hero
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── studio/            # Embedded Sanity Studio
├── components/
│   ├── Hero3D.tsx         # 3D hero section
│   ├── ProjectCard.tsx    # Project card component
│   └── ProjectsGrid.tsx   # Projects grid with Sanity data
├── sanity/
│   ├── lib/
│   │   ├── client.ts      # Sanity client config
│   │   └── image.ts       # Image URL builder
│   └── schemas/
│       ├── index.ts       # Schema exports
│       └── project.ts     # Project schema
└── sanity.config.ts       # Sanity configuration
```

## 📝 Adding Projects

1. Navigate to `http://localhost:3000/studio`
2. Click "Project" in the sidebar
3. Add your project details:
   - Title
   - Slug (auto-generated from title)
   - Technologies (array of strings)
   - Description
   - Project image
   - Optional: 3D model (.glb file)
   - Project URL
   - GitHub URL
   - Featured status
   - Display order

## 🎨 Customization

### Change Hero Text

Edit `components/Hero3D.tsx`:

```tsx
<h1>Your Name</h1>
<p>Your tagline</p>
```

### Add More 3D Shapes

In `components/Hero3D.tsx`, add more `FloatingShape` components:

```tsx
<FloatingShape position={[x, y, z]} color="#yourcolor" />
```

### Customize Colors

Update Tailwind colors in `tailwind.config.ts` or use inline classes.

### Add More Schemas

Create new schema files in `sanity/schemas/` and import them in `sanity/schemas/index.ts`.

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_API_TOKEN`
5. Deploy!

### Deploy Sanity Studio

The studio is already embedded at `/studio`. To deploy a separate studio:

```bash
npx sanity deploy
```

## 📦 Technologies

- **Next.js 15** - React framework
- **React Three Fiber** - React renderer for Three.js
- **Three.js** - 3D graphics library
- **Sanity CMS** - Headless CMS
- **Tailwind CSS** - Utility-first CSS
- **TypeScript** - Type safety

## 🔧 Development Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

Feel free to fork this template and customize it for your needs!

## 📄 License

MIT License - feel free to use this template for your portfolio.
