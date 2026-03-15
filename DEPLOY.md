# Deploying KhetSe to Git and Netlify

## What to upload to Git

Commit and push **all project files except** those ignored by `.gitignore`:

### Include (upload to Git)

- **Source code:** `src/` (all React, TypeScript, CSS, data, i18n)
- **Config:** `index.html`, `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig*.json`, `tailwind.config.js`, `postcss.config.js`, `eslint.config.js`
- **Public assets:** `public/` folder and its contents:
  - **`public/images/QR-Code For Payment.jpeg`** — your UPI/PhonePe QR code image (required for online payment when customer selects Online Payment)
  - `public/favicon.svg`, `public/manifest.json`, `public/icons.svg` (if present)
- **Docs:** `README.md`, `DEPLOY.md`
- **Netlify:** `netlify.toml`

### Do not upload to Git

- `node_modules/` (install with `npm install` on Netlify)
- `dist/` (built by Netlify)
- `.env`, `*.local`, editor/OS files (see `.gitignore`)

### One-time Git setup

```bash
git init
git add .
git status   # confirm no node_modules or dist
git commit -m "Initial KhetSe app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

## Deploying on Netlify

### Option A: Connect Git repo (recommended)

1. Log in to [Netlify](https://app.netlify.com).
2. **Add new site** → **Import an existing project** → choose **Git** (GitHub/GitLab/Bitbucket).
3. Select your KhetSe repository.
4. Netlify will read **`netlify.toml`** and use:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Deploy site**. Netlify will run `npm install` and `npm run build`, then serve the `dist/` folder.

### Option B: Manual deploy (drag & drop)

1. Locally run: `npm run build`
2. In Netlify: **Add new site** → **Deploy manually**.
3. Drag and drop the **`dist`** folder as the publish directory.

---

## Checklist before deploy

- [ ] **QR code:** Add your UPI/PhonePe QR image as **`public/images/QR-Code For Payment.jpeg`** so online payment shows the QR and number (9140189586).
- [ ] **Admin key:** Set your admin password in the app (Admin → Settings) or leave default.
- [ ] **HTTPS:** Netlify provides HTTPS by default; required for PWA “Add to Home Screen”.

After deploy, your site will be at `https://your-site-name.netlify.app`. Orders go to WhatsApp **9140189586** when the user taps **Place Order**.
