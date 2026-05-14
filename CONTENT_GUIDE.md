# Content Guide

這份指南說明：**未來要修改網站內容時，只需要動哪些檔案**。所有頁面都吃這些檔案輸出，請勿手改 `src/pages/` 或 `src/components/`，除非你要改版型。

> 開發者 / AI agent 修改完內容後，本機跑 `npm run build`，若沒有錯誤就可以 commit & push，GitHub Actions 會自動部署。

---

## 1. 個人資料：`src/data/profile.json`

控制：首頁 Hero、Header logo、Footer、About 頁、Contact 頁的個人資訊。

```json
{
  "name": "陳彥竹",                // 中文姓名（Header / Footer / Hero）
  "nameEn": "Andrew Chen",         // 英文名（目前未顯示，預留）
  "role": "行銷企劃 / Brand & Growth Planner",
  "tagline": "一句話定位（會顯示在 Hero 與 Footer）",
  "location": "Taipei, Taiwan",
  "email": "hello@example.com",
  "available": true,
  "availabilityNote": "目前開放的接案類型，會顯示在 Hero 綠點旁",
  "stats": [
    { "label": "年資", "value": "4+", "suffix": "yrs" }
  ],
  "social": [
    { "label": "LinkedIn", "url": "https://www.linkedin.com/in/..." }
  ]
}
```

**規則**：

- `stats` 陣列固定顯示 3 個，超過會跑版（首頁 grid-cols-3）
- `stats[].value` 會吃 count-up 動畫，所以請保持「數字 + 後綴」格式（例：`"120"`、`"4+"`、`"82%"`）
- `social[].label` 會直接顯示為按鈕文字，不需要 icon

---

## 2. 工作經歷：`src/data/experience.json`

控制：`/about` 的時間軸。陣列順序＝顯示順序（**最新在最上**）。

```json
[
  {
    "company": "公司名稱",
    "title": "職稱",
    "period": "2021.04 – Present",
    "current": true,            // 是否為目前職務（時間軸點會變螢光黃）
    "highlights": [
      "重點 1",
      "重點 2"
    ]
  }
]
```

---

## 3. 技能：`src/data/skills.json`

控制：`/about` 的技能區塊。以「分類」為單位，每個分類是一張卡。

```json
[
  {
    "group": "策略 / Strategy",
    "items": ["品牌定位", "市場與競品分析"]
  }
]
```

---

## 4. 合作品牌：`src/data/partners.json`

控制：首頁的品牌 logo 牆。陣列順序＝顯示順序。

```json
[
  { "name": "品牌名稱", "logo": "/images/partners/brand.svg" },
  { "name": "純文字品牌", "logo": "" }
]
```

**規則**：

- 若 `logo` 留空字串，會顯示成「灰階文字」logo（hover 時恢復白色）
- 若提供圖檔，請放到 `public/images/partners/`，並以 `/images/partners/xxx.svg` 的絕對路徑引用（SVG 最佳，PNG 請去背）
- 預設 grid 為 `5 欄 × N 列`，項目數最好是 5 的倍數視覺最整齊

---

## 5. 作品集（最常修改）

### 5.1 新增一個作品

在 `src/content/works/` 底下建立一個新的 `.md` 檔，**檔名就是網址 slug**：

```
src/content/works/2024-spring-campaign.md   →  /works/2024-spring-campaign
```

完整 frontmatter 範本（複製這個就可以）：

```markdown
---
title: "專案名稱"
client: "品牌名稱"
category: ["品牌活動", "社群經營"]      # 任意多個，會自動成為篩選選項
period: "2024.03 – 2024.06"
role: "策略規劃、執行"
featured: true                          # 是否要在首頁精選區出現
order: 1                                # 排序，數字越小越前面（首頁、列表都吃）
coverImage: "/images/works/spring/cover.jpg"  # 留空字串會顯示佔位文字
summary: "卡片上的一句話描述，最多兩行就會被截斷"
kpis:
  - label: "觸及人數"
    value: "120萬"
    growth: "+340%"                     # 選填；有的話會顯示徽章
  - label: "互動率"
    value: "8.2%"
    growth: "+2.1x"
  - label: "轉換率"
    value: "3.4%"
  - label: "ROI"
    value: "580%"
tools: ["Meta Ads", "Google Analytics", "Canva", "Notion"]
partners: ["品牌A", "KOL @xxx"]
media:
  - type: youtube
    src: "https://www.youtube.com/embed/VIDEO_ID"
    caption: "選填說明"
  - type: image
    src: "/images/works/spring/hero.jpg"
    caption: "選填說明"
---

## 背景與挑戰

這裡開始是 markdown 本文，會顯示在案例詳頁的中段。

## 執行策略

- 條列重點 1
- 條列重點 2

## 成果回顧

數字摘要 + 個人反思。可以用 **粗體** 或 > 引言。
```

### 5.2 欄位規則

| 欄位 | 必填 | 說明 |
|---|---|---|
| `title` | ✅ | 專案名稱，會出現在 `<h1>` 與卡片標題 |
| `client` | ✅ | 客戶 / 品牌，會出現在卡片小字與詳頁 meta |
| `category` | ✅ | 至少一個。所有作品的 category 自動聚合成 `/works` 的篩選 chip |
| `period` | ✅ | 自由文字，例如 `"2024.03 – 2024.06"` 或 `"2024 Q2"` |
| `role` | ✅ | 我的角色，自由文字 |
| `featured` | 選填 | 預設 `false`。`true` 才會進首頁精選區（首頁取前 3 個） |
| `order` | 選填 | 預設 `99`。數字越小越前面 |
| `coverImage` | 選填 | 留空會顯示灰色佔位。路徑請放 `public/images/works/<slug>/cover.jpg` |
| `summary` | 選填 | 卡片描述。沒填則卡片不顯示描述 |
| `kpis` | 選填 | 0–N 個。第一個會在卡片上顯示為主數字，全部會出現在詳頁 KPI Bento |
| `kpis[].growth` | 選填 | 例 `"+340%"`、`"+2.1x"`。沒填就不顯示徽章 |
| `tools` | 選填 | 字串陣列，顯示為 chip |
| `partners` | 選填 | 字串陣列，會出現在詳頁 meta 列 |
| `media` | 選填 | 影片或圖片陣列，顯示在詳頁底部 |

### 5.3 修改 / 刪除作品

- **修改內容**：直接編輯對應 `.md`，內容存檔即可
- **暫時下架**：把檔名改成 `_xxx.md`（底線開頭會被 `glob` 排除），或刪掉 `featured: true`
- **永久刪除**：刪除整個 `.md` 檔

### 5.4 新增圖片

1. 把圖檔放到 `public/images/works/<slug>/`
2. 在 frontmatter 用絕對路徑引用：`/images/works/<slug>/xxx.jpg`
3. SVG / WebP / 壓縮過的 JPG 為佳，單張建議 < 500KB

---

## 6. 修改後檢查

```bash
npm run dev      # 本機預覽，HMR 即時更新
npm run build    # 確保沒有 schema 錯誤（content collection 會做型別驗證）
```

最常見的錯誤訊息：

- `Could not parse frontmatter` → YAML 縮排或冒號後缺空格
- `Expected string, received undefined` → 必填欄位漏寫
- `Type 'X' is not assignable to type` → 欄位型別錯（例如 `featured` 寫成字串而非布林）

---

## 7. 啟用 Formspree 表單

預設 contact 頁的表單指向一個假 endpoint。要啟用：

1. 去 https://formspree.io/ 註冊、建立新表單，取得 `https://formspree.io/f/<id>`
2. 編輯 `src/pages/contact.astro`，把常數 `FORMSPREE_ENDPOINT` 換成你的網址

---

## 8. 部署

1. push 到 GitHub 的 `main` 分支
2. 第一次部署前，到 GitHub repo → **Settings → Pages**，把 *Source* 切成 **GitHub Actions**
3. 修改 `astro.config.ts` 的 `site` / `base`：
   - 部署到 `<username>.github.io`（user/org root）：`site: "https://<user>.github.io"`, `base: "/"`
   - 部署到 `<username>.github.io/<repo>`：`site: "https://<user>.github.io"`, `base: "/<repo>"`
4. 之後每次 push 到 `main`，Actions 會自動 build + deploy

---

## 速查：要改 X，動哪個檔？

| 想改的內容 | 檔案 |
|---|---|
| 姓名 / tagline / email / 社群連結 | `src/data/profile.json` |
| 首頁 Hero 旁的 3 個數字 | `src/data/profile.json` → `stats` |
| 首頁精選作品 | 在對應 `.md` 改 `featured: true` 與 `order` |
| 品牌 logo 牆 | `src/data/partners.json` |
| 工作經歷時間軸 | `src/data/experience.json` |
| 技能標籤 | `src/data/skills.json` |
| 新增一個作品 | 新增 `src/content/works/<slug>.md` |
| 作品的 KPI 數字 | 對應 `.md` 的 `kpis:` |
| 作品的篩選分類 | 對應 `.md` 的 `category:`（會自動同步到篩選列） |
| Formspree endpoint | `src/pages/contact.astro` 的 `FORMSPREE_ENDPOINT` |
| 配色 / 字型 | `src/styles/global.css` 的 `@theme` 區塊 |
