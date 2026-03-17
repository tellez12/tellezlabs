# Tellez Labs - Personal Portfolio Website

A modern, responsive portfolio website built with Static HTML, CSS, Tailwind, and JavaScript. Features include your resume, bio, and useful developer tools.

## 🚀 Features

- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Dark Theme**: Eye-friendly dark UI with Tailwind CSS
- **Interactive Tools**:
  - 🍅 Pomodoro Timer with customizable work/break durations
  - 🔐 JWT Decoder - Decode and inspect JWT tokens
  - 🔗 URL Encoder/Decoder - Encode/decode URLs and text
  - 🔀 Base64 Encoder/Decoder - Encode/decode Base64 strings
- **Mobile Optimized**: Fast loading, SEO friendly
- **No Build Process**: Pure static HTML/CSS/JS - ready to deploy instantly

## 📁 File Structure

```
.
├── index.html          # Home/About page
├── resume.html         # Resume page (printable)
├── tools.html          # Interactive tools page
├── tools.js            # Tools functionality
├── wrangler.toml       # Cloudflare Pages config (optional)
└── README.md           # This file
```

## 🔧 Customization

### Update Your Information

1. **index.html**: Update hero section and about section with your info
2. **resume.html**: Replace placeholder content with your actual resume
3. **Color scheme**: Change `text-blue-400` to another Tailwind color (e.g., `text-purple-400`)

### Add/Remove Tools

Edit `tools.html` to add more tools:

1. Add button to the selector grid
2. Add corresponding `<div id="tool-name">` with content
3. Add JavaScript function in `tools.js`

## 🌐 Hosting with Cloudflare Pages

### Option 1: Deploy from GitHub (Recommended)

**Step 1: Prepare Your Repository**

```bash
# Initialize git in your project folder
git init
git add .
git commit -m "Initial commit: portfolio website"
```

**Step 2: Push to GitHub**

- Create a new repository at https://github.com/new
- Follow GitHub's instructions to push your code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/tellezlabs.git
git branch -M main
git push -u origin main
```

**Step 3: Connect to Cloudflare Pages**

1. Go to https://dash.cloudflare.com
2. Select your account and domain `tellezlabs.com`
3. Go to **Workers & Pages** → **Pages** → **Create application**
4. Select **Connect to Git**
5. Authorize GitHub and select your `tellezlabs` repository
6. Configure build settings:
   - **Framework**: None
   - **Build command**: (leave empty)
   - **Build output directory**: `/` (root)
7. Click **Save and Deploy**

Cloudflare will automatically deploy on each git push!

### Option 2: Direct Upload to Cloudflare Pages

1. Go to https://dash.cloudflare.com → **Workers & Pages** → **Pages**
2. Click **Create application** → **Upload assets**
3. Select all your project files (index.html, resume.html, tools.html, tools.js)
4. Click **Deploy**

### Step 4: Connect Your Domain

1. In Cloudflare Pages dashboard, go to your project
2. Click **Settings** → **Domains**
3. Click **Add domain**
4. Enter `tellezlabs.com`
5. Cloudflare will verify your domain ownership (DNS record already configured)
6. Done! Your site is live at https://tellezlabs.com

### (Optional) Set Up Custom Domain Management

If you want to manage DNS through Cloudflare:

1. Go to Cloudflare dashboard → **Websites** → **tellezlabs.com**
2. Go to **Settings** → **Name servers**
3. Change name servers to Cloudflare's DNS (if not already done)
4. Your Pages deployment will be the default HTTPS route

## 📊 Local Testing

### Live Server (VS Code)

1. Install "Live Server" extension in VS Code
2. Right-click `index.html` → **Open with Live Server**
3. Your site opens at `http://localhost:5500`

### Alternative: Python HTTP Server

```bash
cd path/to/tellezlabs
python -m http.server 8000
```

Then visit `http://localhost:8000`

## 🎨 Customization Tips

### Change Colors

Tailwind Color Classes:

- Blue: `blue-400`, `blue-600`, `blue-700`
- Replace with: `purple-400`, `green-400`, `red-400`, `emerald-400`, etc.

Example: Change theme from blue to purple:

```html
<!-- Find all instances of bg-blue-600 and replace with: -->
<button class="bg-purple-600 hover:bg-purple-700 ..."></button>
```

### Add Your Social Links

In `index.html`, add before footer:

```html
<div class="flex justify-center gap-4 mb-8">
  <a
    href="https://github.com/yourprofile"
    target="_blank"
    class="text-2xl hover:text-blue-400"
  >
    GitHub
  </a>
  <a
    href="https://linkedin.com/in/yourprofile"
    target="_blank"
    class="text-2xl hover:text-blue-400"
  >
    LinkedIn
  </a>
  <a
    href="https://twitter.com/yourprofile"
    target="_blank"
    class="text-2xl hover:text-blue-400"
  >
    Twitter
  </a>
</div>
```

## 🔒 Security Notes

- All tools run in your browser (client-side) - nothing is sent to a server
- JWT tokens are decoded locally and not stored anywhere
- Keep sensitive data out of your source code

## 📈 SEO Optimization

Add meta tags to each HTML file for better search results:

```html
<meta name="description" content="Backend Software Engineer - Portfolio" />
<meta name="keywords" content="backend, engineer, portfolio, api, nodejs" />
<meta name="author" content="Your Name" />
```

## 🚀 Performance

- **CDN**: Cloudflare Pages automatically caches everything on edge servers
- **HTTPS**: Automatic SSL/TLS certificate (enabled by default)
- **Compression**: Cloudflare automatically compresses assets
- **Speed Score**: Check at https://pagespeed.web.dev

## 📝 Next Steps

1. **Update your info on all 3 pages**
2. **Upload resume PDF** (optional: create a `/resume.pdf` with your actual resume)
3. **Deploy to Cloudflare Pages**
4. **Test on mobile** - use browser DevTools (F12 → toggle device toolbar)
5. **Share your website!**

## 💡 Future Enhancements

- Add more tools: JSON formatter, Regex tester, UUID generator
- Add blog section for technical posts
- Add project showcase with case studies
- Add comment section or contact form
- Dark/Light theme toggle
- Integrate with GitHub API to show real projects

## 📞 Support

For Cloudflare Pages documentation: https://developers.cloudflare.com/pages/

---

Built with ❤️ for developers, by developers.
