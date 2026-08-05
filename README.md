# 🚀 Astro + Cloudflare Pages Branch Preview Test

This repository demonstrates **Cloudflare Pages Per-Branch Preview Deployments** with an **Astro** application.

---

## ⚙️ How Cloudflare Branch Previews Work

Cloudflare Pages supports automatic preview deployments for every branch pushed to GitHub:

- **`main` Branch**: Deployed as the **Production** site (e.g. `https://astro-cloudflare-branch-preview.pages.dev`).
- **Feature Branches**: Every non-main branch (e.g., `feature/test-preview`) generates a unique preview URL (e.g. `https://<branch>.astro-cloudflare-branch-preview.pages.dev`).

---

## 🛠️ Step 1: Connecting Cloudflare Pages to GitHub

You can set up deployment using either option below:

### Option A: Cloudflare Git Integration (Recommended - Zero Config)
1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) -> **Workers & Pages** -> **Create Application** -> **Pages**.
2. Click **Connect to Git** and select your GitHub account and repository: `morshedgit/astro-cloudflare-branch-preview`.
3. Configure build settings:
   - **Framework preset**: `Astro`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Click **Save and Deploy**.
5. Under **Settings** -> **Builds & deployments**:
   - Production branch: `main`
   - Preview deployments: **Enabled for all branches** (default).

### Option B: GitHub Actions Workflow
If you prefer running builds via GitHub Actions:
1. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` to repository secrets on GitHub (`Settings -> Secrets and variables -> Actions`).
2. The included `.github/workflows/deploy.yml` will automatically build and publish to Cloudflare Pages on every branch push & pull request.

---

## 🧪 Step 2: Testing Branch Previews

1. Create and switch to a new branch:
   ```bash
   git checkout -b feature/test-preview
   ```
2. Modify `src/pages/index.astro` (e.g., update the header, add a message, or change colors).
3. Commit and push your branch:
   ```bash
   git add .
   git commit -m "feat: testing branch preview URL"
   git push -u origin feature/test-preview
   ```
4. Open your GitHub Repository PR / Commits or Cloudflare Pages Dashboard to view the live preview URL!

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build for production
npm run build
```
