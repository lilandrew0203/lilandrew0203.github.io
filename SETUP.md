# Setup / Handoff

新接手這個 repo？跟著走一次，從 clone 到上線大約 30 分鐘。

> 已經跑過一次、只是來重新 setup 環境的話，直接看 §1–§3。
> 要把這份作品集**改成自己的**，看 §4 的 personalize checklist。

---

## 0. 需要先裝什麼

| 工具 | 版本 | 怎麼裝 |
|---|---|---|
| **Node.js** | 20 LTS 或 22 LTS（本專案 `.nvmrc` 鎖 22） | 推薦 [nvm](https://github.com/nvm-sh/nvm)：`nvm install` 會自動讀 `.nvmrc` |
| **npm** | 跟著 Node 一起裝（≥ 10） | — |
| **Git** | 任意現代版本 | macOS 內建 / `brew install git` |
| **GitHub 帳號** | — | https://github.com/join |
| 編輯器 | VS Code / Cursor / Antigravity 都行 | 推薦裝 Astro 官方 extension（語法高亮 + 型別） |

檢查：

```bash
node -v        # v20.x 或 v22.x
npm -v         # 10.x 以上
git --version  # 任意 2.x
```

---

## 1. Clone & 安裝

```bash
git clone https://github.com/<owner>/<repo>.git
cd <repo>

# 如果用 nvm，先切到正確 Node 版本
nvm use         # 會讀 .nvmrc → 22；沒裝過會提示你 nvm install

npm install     # 約 30–60 秒
```

裝完應該會有 `node_modules/` 和 `package-lock.json`（已被 `.gitignore` 排除的只有 `node_modules`，lock 檔請 commit）。

---

## 2. 本機跑起來

```bash
npm run dev
```

打開 http://localhost:4321 — 看到首頁深色 Hero + 螢光黃標題就 OK。

**HMR**：改 `.astro` / `.md` / `.json` / `.css` 任一檔案存檔，瀏覽器會即時更新，不用手動 reload。

要停掉就在 terminal 按 `Ctrl-C`。

---

## 3. 全量檢查（commit 前一定跑）

```bash
npm run build
```

這指令會跑：
1. `astro check` — TypeScript + Astro 型別檢查
2. `astro build` — 加上 content collection 的 Zod schema 驗證
3. 輸出靜態檔案到 `dist/`

看到 `[build] Complete!` 才算過。要在本機預覽 build 出來的版本：

```bash
npm run preview
```

---

## 4. Personalize Checklist（把網站變成你自己的）

照順序做，每一步存檔後在 `npm run dev` 開著的瀏覽器就能立刻看到變化。

### 4.1 個人資料（5 分鐘）

打開 `src/data/profile.json`：

- [ ] `name`：你的中文姓名
- [ ] `nameEn`：英文名
- [ ] `role`：職稱（會顯示在 header）
- [ ] `tagline`：一句話定位（會顯示在 hero 和 footer）
- [ ] `location`：城市
- [ ] `email`：聯絡信箱
- [ ] `available` / `availabilityNote`：是否接案 + 接案說明
- [ ] `stats`：首頁 3 個大數字（保持 3 個，多少都會跑版）
- [ ] `social`：LinkedIn / IG / GitHub 的真實連結

### 4.2 工作經歷（10 分鐘）

打開 `src/data/experience.json`：

- [ ] 把陣列裡的範例全刪掉，照同樣格式填自己的
- [ ] **最新的擺最上面**
- [ ] `current: true` 只給一筆（目前的工作）

### 4.3 技能（5 分鐘）

打開 `src/data/skills.json`，分組可以自由增減，每組 `items` 用 chip 顯示。

### 4.4 合作品牌 / 媒體（5 分鐘）

打開 `src/data/partners.json`：

- 沒有 logo 圖檔？直接填 `{ "name": "品牌名", "logo": "" }`，會顯示成灰階文字
- 有 logo 圖檔？放到 `public/images/partners/<brand>.svg`，然後 `"logo": "/images/partners/<brand>.svg"`（SVG 最佳，PNG 請去背）

### 4.5 作品案例（最花時間，每篇約 20 分鐘）

`src/content/works/` 裡有 3 個範例 `.md`，**先全部刪掉**，再照範本新增自己的。

完整 frontmatter 範本與每個欄位的說明請看 [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md) §5，或讓 AI agent 照著 [`AGENTS.md`](./AGENTS.md) §4 的範本幫你做。

### 4.6 視覺微調（選用）

只想改顏色 / 字型？只動 `src/styles/global.css` 最上面的 `@theme` 區塊就好：

```css
@theme {
  --color-bg: #0f0f0f;        /* 背景 */
  --color-accent: #e8ff4d;    /* 主色：螢光黃。橘紅可用 #ff6b35 */
  --font-tc: "Noto Sans TC", ...;
  --font-sans: "Inter", ...;
}
```

---

## 5. 表單功能（選用）

`/contact` 頁的表單預設指向假 endpoint。要啟用：

1. 註冊 https://formspree.io/（免費方案每月 50 封）
2. 建立新表單，拿到 `https://formspree.io/f/<id>`
3. 編輯 `src/pages/contact.astro`，替換 `FORMSPREE_ENDPOINT` 常數

如果不想做表單，可以直接刪掉 `<form>` 區塊，只留 email / 社群連結。

---

## 6. 部署到 GitHub Pages

詳細步驟看 [`DEPLOY.md`](./DEPLOY.md)。極簡版：

```bash
# 1. 在 GitHub 開一個 public repo（建議名稱：portfolio）
# 2. 編輯 astro.config.ts：
#    site: "https://<你的 username>.github.io"
#    base: "/portfolio"     ← 改成你的 repo 名

# 3. 第一次 push
git init
git add -A
git commit -m "Init my portfolio"
git branch -M main
git remote add origin git@github.com:<user>/<repo>.git
git push -u origin main

# 4. 到 repo Settings → Pages → Source 改成 "GitHub Actions"
# 5. 等 Actions 跑完（約 1–2 分鐘）→ 打開 https://<user>.github.io/<repo>/
```

之後**每次 `git push` 到 `main` 就會自動部署**。

---

## 7. 日常 workflow

```bash
# 開發
npm run dev

# 改完內容 / 程式
npm run build          # 確認沒錯
git add -A
git commit -m "Add 2024 spring campaign"
git push               # GitHub Actions 自動部署
```

---

## 8. 文件導覽

| 想做的事 | 看哪份文件 |
|---|---|
| 接手 / 從零跑起來 | **本檔 SETUP.md** |
| 增刪改內容（每個欄位的規則） | [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md) |
| 部署到 GitHub Pages | [`DEPLOY.md`](./DEPLOY.md) |
| 讓 AI agent（Antigravity / Cursor / Claude Code）幫你做 | [`AGENTS.md`](./AGENTS.md) |
| 全站架構速覽 | [`README.md`](./README.md) |

---

## 9. 常見「裝不起來」狀況

| 現象 | 原因 / 解法 |
|---|---|
| `npm install` 卡住 / 超慢 | 換 registry：`npm config set registry https://registry.npmmirror.com`（中國地區） |
| `npm install` 噴 `EACCES` | Node 用 sudo 裝的；改用 [nvm](https://github.com/nvm-sh/nvm) 重裝乾淨 |
| `npm run dev` 跑起來但 `localhost:4321` 連不上 | port 被佔了，改用 `npm run dev -- --port 4322` |
| `astro check` 抱怨找不到型別 | 跑過一次 `npm run dev` 或 `npm run build` 會生 `.astro/types.d.ts`，再試一次 |
| 改了 `.md` 但首頁沒更新 | 確認 `featured: true` 而且 `order` 在前三小；hard reload（⌘⇧R） |
| `git push` 被拒（403） | SSH key 還沒設定，看 https://docs.github.com/en/authentication/connecting-to-github-with-ssh |
