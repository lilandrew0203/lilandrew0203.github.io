# Marketing Portfolio · Astro 5 + Tailwind v4

A dark, content-driven marketing planner portfolio. Markdown + JSON for content, native CSS scroll animations, Bento-style KPI grid, deployable to GitHub Pages.

## Stack

- **Astro 5** (`output: "static"`)
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **TypeScript** (Astro strict)
- **Google Fonts**: Inter + Noto Sans TC
- Native CSS `animation-timeline: view()` for scroll reveal (with graceful fallback)
- One JS file (`src/scripts/countup.ts`) for KPI count-up animation

## 🚀 Just cloned this? → Read [`SETUP.md`](./SETUP.md) first

它會帶你從「Node 怎麼裝」一路到「上線到 GitHub Pages」。

## Quick start（已熟悉的話）

```bash
nvm use         # 切到 Node 22（讀 .nvmrc）
npm install
npm run dev     # http://localhost:4321
npm run build   # 全量檢查 + 輸出 dist/
npm run preview
```

需要的環境：**Node 20 或 22**、npm ≥ 10、Git、GitHub 帳號。

## Project layout

```
.
├── astro.config.ts
├── public/
│   ├── favicon.svg
│   └── images/                  # works / partners 圖檔放這裡
├── src/
│   ├── components/              # Header / Footer / WorkCard / KpiCard / PartnerWall / FilterChips
│   ├── content/works/*.md       # 作品案例（content collection）
│   ├── content.config.ts        # collection schema
│   ├── data/                    # profile / experience / skills / partners JSON
│   ├── layouts/BaseLayout.astro
│   ├── pages/                   # / · /works · /works/[slug] · /about · /contact
│   ├── scripts/countup.ts
│   └── styles/global.css        # 主題 token、字型、動畫、components helpers
├── .github/workflows/deploy.yml # GitHub Pages 自動部署
└── CONTENT_GUIDE.md             # ⭐ 編輯內容請看這份
```

## Editing content

- 個人資料：`src/data/*.json`
- 作品：`src/content/works/<slug>.md`（用 frontmatter 帶 KPI、category、tools 等）
- 首頁精選 = 任意 3 個 `featured: true` 的作品，由 `order` 決定排序

## Docs

| 文件 | 給誰看 / 什麼時候看 |
|---|---|
| [`SETUP.md`](./SETUP.md) | **新人接手** — 從 clone 到上線一條龍，含 personalize checklist |
| [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md) | 人類編輯者 — 每個 JSON / frontmatter 欄位的完整規則 |
| [`DEPLOY.md`](./DEPLOY.md) | 部署到 GitHub Pages 的逐步指南（含 custom domain） |
| [`AGENTS.md`](./AGENTS.md) | **AI agent**（Antigravity / Cursor / Claude Code / Codex）— 工作守則、檔案地圖、可做 / 不可做 |
