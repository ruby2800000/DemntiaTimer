# Dementia Timer - Netlify Deployment

Your app has been converted to a static site ready for Netlify deployment!

## What Changed

1. **Frontend-only architecture**: Converted Flask backend to vanilla JavaScript
2. **All logic runs in the browser**: No server needed
3. **Netlify-compatible files created**:
   - `netlify.toml` - Netlify configuration
   - `package.json` - Project metadata
   - `index.html` - Main HTML file
   - `app.js` - JavaScript logic
   - `.gitignore` - Git ignore rules

## How to Deploy to Netlify

### Option 1: Drag & Drop (Fastest)
1. Go to [netlify.com](https://netlify.com)
2. Sign up/login with GitHub or email
3. Drag and drop your project folder onto the Netlify interface
4. Your site goes live instantly!

### Option 2: GitHub Integration (Recommended)
1. Push your code to GitHub:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/dementia-timer.git
   git branch -M main
   git push -u origin main
   ```

2. Go to [netlify.com](https://netlify.com) and connect your GitHub repo
3. Netlify automatically deploys on every push!

### Option 3: Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy
```

## Features Included

✅ Landing page with navigation
✅ 20-question cognitive quiz
✅ Memory tests and daily functioning assessment
✅ AI-powered risk prediction
✅ Results page with recommendations
✅ Hospital finder by city
✅ Fully responsive design
✅ No backend required
✅ Instant deployment

## Files to Keep

- `index.html` - Main page
- `app.js` - JavaScript logic
- `static/style.css` - Styling
- `netlify.toml` - Configuration
- `package.json` - Metadata
- `.gitignore` - Git settings

## Can Delete

- `app.py` - No longer needed (was Flask)
- `templates/` - No longer needed
- `__pycache__/` - Can delete

## After Deployment

Your site will be live at: `https://your-site-name.netlify.app`

You can:
- Update the domain in Netlify settings
- Add SSL (automatic)
- Set up form handling if needed
- Enable analytics

**Ready to deploy? Push to GitHub and connect to Netlify!**
