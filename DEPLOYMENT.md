# Deployment Guide

## Deploy to Vercel (Recommended)

1. **Push your code to GitHub** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure environment variables:
     - `MONGODB_URI`: `mongodb+srv://HawaMahal:Ashish2005@cluster0.uudjq57.mongodb.net/mithai_mahal?retryWrites=true&w=majority&appName=Cluster0`
   - Click "Deploy"

3. **MongoDB Atlas Network Access**
   - Go to MongoDB Atlas Dashboard
   - Navigate to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add Vercel's IP ranges (recommended for production)

4. **Access Your App**
   - After deployment, Vercel will provide a URL like: `https://your-app.vercel.app`
   - You can access this URL from any device

## Deploy to Netlify

1. **Push your code to GitHub** (same as above)

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Environment variables:
     - `MONGODB_URI`: Your MongoDB connection string
   - Click "Deploy"

## Important Notes

- ✅ All API routes use relative URLs (`/api/...`) - works on any domain
- ✅ No localhost URLs in the code
- ✅ MongoDB connection is properly configured
- ⚠️ Make sure MongoDB Atlas allows connections from your deployment platform's IP addresses
- ⚠️ Never commit `.env.local` or `.env` files to Git (already in .gitignore)

## Testing Deployment

After deployment, test these features:
1. Browse sweets on homepage
2. Register a new user
3. Add items to cart
4. Place an order
5. Admin login at `/admin/login` (email: `admin@mithai.com`, password: `admin123`)
