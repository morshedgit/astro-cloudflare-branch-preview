# 🚀 Astro + Cloudflare Pages Branch Preview Test

This repository demonstrates **Cloudflare Pages Per-Branch Preview Deployments** with an **Astro** application.

---

## ⚙️ How Cloudflare Branch Previews Work

Cloudflare Pages supports automatic preview deployments for every branch pushed to GitHub:

- **`main` Branch**: Deployed as the **Production** site (e.g. `https://astro-cloudflare-branch-preview.pages.dev`).
- **Feature Branches**: Every non-main branch (e.g., `feature/analytics-dashboard`, `feature/ai-chat-interface`) generates a unique preview URL (e.g. `https://<branch>.astro-cloudflare-branch-preview.pages.dev`).

---

## 💻 Local Development

```bash
# Start local dev server
npm run dev

# Build for production
npm run build
```
