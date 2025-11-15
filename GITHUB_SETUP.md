# GitHub Setup & Netlify Deployment Guide

## Step 1: Initialize Git Repository

```powershell
cd d:\Chinmayi\hackathon\dEMENTIATIMER
git init
git add .
git commit -m "Initial commit - Dementia Timer app ready for Netlify"
```

## Step 2: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click **"New repository"**
3. Name it: `dementia-timer`
4. Make it **Public** (for Netlify access)
5. Click **Create repository**

## Step 3: Push to GitHub

```powershell
git remote add origin https://github.com/YOUR_USERNAME/dementia-timer.git
git branch -M main
git push -u origin main
```

## Step 4: Connect to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click **Sign up** → Choose **GitHub**
3. Authorize GitHub access
4. Click **New site from Git**
5. Select your repository
6. Build settings:
   - Build command: (leave empty)
   - Publish directory: `.`
7. Click **Deploy site**

## Your Site is Live! 🎉

Netlify will automatically:
- Give you a URL like `random-name-12345.netlify.app`
- Deploy every time you push to GitHub
- Provide SSL/HTTPS automatically
- Enable automatic builds

## Custom Domain (Optional)

1. Go to your Netlify site settings
2. Click **Domain settings**
3. Add your custom domain
4. Follow the DNS setup instructions

## Files Ready for Deployment

✅ `index.html` - Main entry point
✅ `app.js` - All quiz logic (runs in browser)
✅ `static/style.css` - Styling
✅ `netlify.toml` - Netlify config
✅ `package.json` - Project metadata

No backend needed - everything runs client-side!

## What the App Does

- 20-question cognitive assessment
- Memory tests, attention, daily functioning
- AI-powered risk prediction
- Hospital finder by Indian city
- Instant results & recommendations

## Troubleshooting

**Site shows 404?**
- Make sure `index.html` is in the root directory
- Check Netlify build logs

**Styles not loading?**
- Verify `static/style.css` path in index.html
- Files are referenced correctly

**Need to update the app?**
- Edit files locally
- Push to GitHub: `git add . && git commit -m "Update" && git push`
- Netlify auto-deploys!

Ready to deploy? Start with Step 1! 🚀
