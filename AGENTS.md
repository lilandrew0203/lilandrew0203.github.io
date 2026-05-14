# AGENTS.md

> 給 AI agent（Antigravity / Cursor / Claude Code / Codex / 任何 LLM 助手）的工作說明。
> 跨工具共通格式 — 任何 agent 進到這個 repo 都應該先讀這份。

---

## 0. 一句話定位

這是一個**內容驅動**的個人作品集網站（Astro 5 + Tailwind v4，靜態輸出到 GitHub Pages）。
**99% 的修改請求都是改內容，不是改程式**。

---

## 1. Project map（每個檔案在做什麼）

```
portfolio/
├── astro.config.ts                  # ⚠️ site / base（部署網址）唯一定義點
├── package.json                     # scripts: dev / build / preview
├── tsconfig.json                    # Astro strict 預設
├── public/
│   ├── favicon.svg
│   └── images/                      # ✏️ 所有圖片放這（works / partners）
├── src/
│   ├── content.config.ts            # ⚠️ works collection 的 Zod schema（改欄位前先改這）
│   ├── content/works/*.md           # ✏️ 作品案例（每篇一個檔，frontmatter 帶 KPI）
│   ├── data/profile.json            # ✏️ 姓名 / tagline / email / 社群 / hero stats
│   ├── data/experience.json         # ✏️ 工作經歷時間軸
│   ├── data/skills.json             # ✏️ 技能分組
│   ├── data/partners.json           # ✏️ 品牌 logo 牆
│   ├── components/                  # 🔒 共用元件（Header / Footer / WorkCard / KpiCard / PartnerWall / FilterChips）
│   ├── layouts/BaseLayout.astro     # 🔒 全站 layout（head / fonts / header / footer）
│   ├── pages/
│   │   ├── index.astro              # 🔒 首頁
│   │   ├── about.astro              # 🔒 關於
│   │   ├── contact.astro            # 🔒 聯絡（內含 FORMSPREE_ENDPOINT 常數）
│   │   └── works/
│   │       ├── index.astro          # 🔒 作品列表 + 篩選
│   │       └── [slug].astro         # 🔒 作品詳頁（Bento KPI）
│   ├── scripts/countup.ts           # 🔒 KPI count-up 動畫（唯一一支 JS）
│   └── styles/global.css            # ⚠️ 主題 token（@theme）— 改色 / 字型來這
├── .github/workflows/deploy.yml     # 🔒 部署 workflow
├── CONTENT_GUIDE.md                 # 📖 給人類看的內容編輯指南（細節版）
├── DEPLOY.md                        # 📖 部署步驟（給人類看）
└── AGENTS.md                        # 📖 本檔（給 agent 看）
```

**圖例**
- ✏️ = 內容檔，可放心修改
- ⚠️ = 設定檔，改之前先理解一下副作用
- 🔒 = 程式碼／視覺實作，**沒被明確要求改版型時不要動**
- 📖 = 文件

---

## 2. 你 95% 會被指派的工作（→ 對應動作）

| 使用者請求 | 你要做的事 |
|---|---|
| 「新增一個作品 X」 | 新增 `src/content/works/<slug>.md`，用 §4 範本填，跑 `npm run build` 確認過 |
| 「改 KPI 數字」 | 改對應 `.md` 的 `kpis:`；**不要動** `[slug].astro` 的 Bento 排版 |
| 「換 hero 標語」 | 改 `src/data/profile.json` 的 `tagline`；**不要直接編** `pages/index.astro` 的字串 |
| 「加一個品牌 logo」 | 圖檔放 `public/images/partners/`，再在 `src/data/partners.json` push 一筆 |
| 「換 accent 色」 | 改 `src/styles/global.css` 的 `@theme { --color-accent: ... }`，**只此一處** |
| 「新增工作經歷」 | 改 `src/data/experience.json`，**最新的擺最上** |
| 「新增一個技能群組」 | 改 `src/data/skills.json` 新增一筆 `{ group, items }` |
| 「篩選類別加一個 X」 | **不用改程式**，只要任何作品的 `category:` 出現 `X`，篩選列會自動長出來 |

---

## 3. 做完任何修改後必須執行

```bash
npm run build
```

`build` 會跑兩件事：
1. `astro check` — TypeScript + Astro 型別檢查
2. `astro build` — 加上 content collection 的 Zod schema 驗證

**只要 build 過、0 errors，就可以 commit**。
build fail 不要 `--no-verify` 或刪 schema 來繞過，請看 §6 troubleshooting。

---

## 4. 新增一個作品的標準範本

檔案：`src/content/works/<slug>.md`（檔名 = 網址 slug，請用小寫 + 連字號）

```markdown
---
title: "專案名稱"
client: "品牌名稱"
category: ["品牌活動", "社群經營"]        # 至少 1 個；會自動進篩選列
period: "2024.03 – 2024.06"
role: "策略規劃、執行"
featured: true                            # 想上首頁精選才填 true
order: 1                                  # 排序，數字越小越前面
coverImage: "/images/works/<slug>/cover.jpg"   # 留空字串顯示佔位
summary: "卡片描述，最多兩行"
kpis:                                     # 0–N 個都可以
  - label: "觸及人數"
    value: "120萬"
    growth: "+340%"                       # 選填
  - label: "互動率"
    value: "8.2%"
    growth: "+2.1x"
tools: ["Meta Ads", "GA4"]
partners: ["品牌A", "KOL @xxx"]
media:                                    # 選填，作品詳頁底部
  - type: youtube
    src: "https://www.youtube.com/embed/VIDEO_ID"
    caption: "說明文字"
---

## 背景與挑戰
（這段以下是 markdown 本文，顯示在詳頁中段）

## 執行策略
- 條列重點
- 條列重點

## 成果回顧
…
```

**count-up 動畫對 `value` 的格式要求**：`prefix + 數字 + suffix`，例如 `"120萬"`、`"8.2%"`、`"+340%"`、`"580%"`、`"2.1x"` 都 OK；純文字（例 `"很高"`）不會 count，但會正常顯示。

---

## 5. 風格與行為規範（讀過再動手）

### 5.1 做這些事

- **YAGNI**：使用者要求改 A，就只改 A，不要順手「優化」B、C、D
- **改內容前先看 schema**：`src/content.config.ts` 是作品 frontmatter 的合約
- **保持深色 + 螢光黃 accent 的視覺一致**：所有新元件請用 `var(--color-*)` token，不要寫死 hex
- **新加的 component 放 `src/components/`**，新加的 page 放 `src/pages/`
- **commit message 用祈使句**（例：`Add 2024 spring campaign work`，不是 `added`）

### 5.2 不要做這些事

- ❌ **不要**為了讓 build 過而刪 schema 欄位或加 `// @ts-ignore`
- ❌ **不要**在 page 裡直接寫死姓名 / email / 社群連結 — 一律從 `src/data/profile.json` 讀
- ❌ **不要**重複 component（例如又寫一個新的 WorkCard）— 改現有的或加 props
- ❌ **不要**安裝新 npm 套件來解可以用原生 CSS 解的問題（這個專案刻意只有一支 JS）
- ❌ **不要**改 `astro.config.ts` 的 `site` / `base` — 那是部署用的，要改請先問使用者
- ❌ **不要**為了「看起來更乾淨」就把 markdown 本文改寫 — 本文是內容，不是程式碼

### 5.3 需要先問使用者的決定

- 大改視覺（換配色、換字型、改 layout 結構）
- 新增 / 刪除頁面
- 升級 Astro 主版本（5.x → 6.x）
- 串第三方服務（GA / Plausible / GTM / Sentry）

---

## 6. Troubleshooting（常見 build error）

| 錯誤訊息 | 原因 / 解法 |
|---|---|
| `Could not parse frontmatter` | YAML 縮排錯 / 冒號後忘了空格 / 引號沒收 |
| `Expected string, received undefined` | 必填欄位漏寫，對照 §4 範本 |
| `Expected array, received string` | `category` / `tools` 等需是陣列，寫成 `category: "A"` 要改成 `category: ["A"]` |
| `Type 'X' is not assignable to type 'boolean'` | `featured` 寫成字串 `"true"`，要改成不加引號的 `true` |
| 篩選列沒出現新分類 | 至少要有一個作品的 `category` 包含該分類；hard reload 一下瀏覽器 |
| 圖片載不到 | 路徑必須是 `/images/...`（絕對路徑，從 `public/` 起算），不是 `./images/...` |

---

## 7. 部署相關

- 部署目標：GitHub Pages（靜態）
- 觸發：push 到 `main`，由 `.github/workflows/deploy.yml` 自動部署
- 部署網址在 `astro.config.ts` 的 `site` + `base` 控制 — **不要 agent 自己改**，由使用者決定
- 詳細部署流程：請看 `DEPLOY.md`

---

## 8. 常用指令速查

```bash
npm run dev       # 本機開發（http://localhost:4321）
npm run build     # 全量檢查 + 靜態輸出到 dist/
npm run preview   # 預覽 build 結果
```

---

## 9. 如果你（agent）卡住了

1. 先讀 `CONTENT_GUIDE.md` — 那是給人類看的詳細版，可能有你需要的細節
2. 再讀 `src/content.config.ts` — 是 frontmatter 的權威定義
3. 跑一次 `npm run build` 看完整錯誤訊息，**不要猜**
4. 如果還是不確定，**停下來問使用者**，不要硬 commit
