# 部署到 GitHub Pages

兩種情境，先想清楚你要哪一種：

| 情境 | 部署網址 | repo 名稱 | `base` 要填 |
|---|---|---|---|
| **A. 主站**（每個帳號限一個） | `https://<user>.github.io/` | 必須是 `<user>.github.io` | `"/"` |
| **B. 子專案**（建議，可有多個） | `https://<user>.github.io/<repo>/` | 任意，例 `portfolio` | `"/<repo>"` |

> 沒概念的話**選 B**。彈性大，主站 slot 留給未來。下文以 B 為主，A 的差異會標出來。

---

## Step 0. 確認本機都 OK

```bash
cd /Users/jesseyou/Desktop/lang/20260514/portfolio
npm run build
```

看到 `Complete!` 才繼續。如果有 error 請先修。

---

## Step 1. 在 GitHub 開一個新 repo

1. 到 https://github.com/new
2. **Repository name**：
   - 情境 A：`<你的 username>.github.io`（例如 `jesseyou.github.io`）
   - 情境 B：`portfolio`（或任何你喜歡的名字，記下來）
3. **Public**（GitHub Pages 對 free plan 只支援 public repo；Pro 才可以 private）
4. **不要**勾 README / .gitignore / license（我們本機已經有了，初始化反而會撞 commit）
5. 按 **Create repository**

建完後 GitHub 會顯示一段「…or push an existing repository from the command line」的指令，把上面的 SSH/HTTPS URL 抄下來，下一步要用。

---

## Step 2. 修改 `astro.config.ts` 的網址

打開 `astro.config.ts`，找到這兩行：

```ts
site: "https://your-username.github.io",
base: "/",
```

換成你的：

**情境 A（主站）**
```ts
site: "https://<你的 username>.github.io",
base: "/",
```

**情境 B（子專案，例 repo 名叫 `portfolio`）**
```ts
site: "https://<你的 username>.github.io",
base: "/portfolio",
```

> ⚠️ `base` 開頭要有 `/`，結尾**不要**加 `/`。

存檔後跑一次 `npm run build` 確認沒爆。

---

## Step 3. 第一次 commit & push

在 `portfolio/` 目錄裡：

```bash
git init
git add -A
git commit -m "Init marketing portfolio"
git branch -M main
git remote add origin <剛剛抄到的 repo URL>
git push -u origin main
```

push 完到 GitHub repo 頁面重新整理，應該看得到所有檔案。

---

## Step 4. 開啟 GitHub Pages 並指定 Actions 來源

這一步很多人會漏，**不做的話 Action 跑了也不會上線**。

1. 到 repo 的 **Settings** tab
2. 左側欄點 **Pages**
3. **Source** 下拉選 → 改成 **GitHub Actions**（不是 "Deploy from a branch"！）
4. 不用按存檔，會自動套用

---

## Step 5. 等 Action 跑完

1. 到 repo 的 **Actions** tab
2. 應該看到一個 workflow run（名字是 "Deploy to GitHub Pages"）正在跑或剛跑完
3. 點進去等兩個 job（`build`、`deploy`）都變綠色勾勾（約 1–2 分鐘）
4. 跑完後 deploy job 的詳細頁面會有一個 **page_url**，那就是你的網站

也可以直接打：

- 情境 A：`https://<user>.github.io/`
- 情境 B：`https://<user>.github.io/<repo>/`

---

## Step 6. 之後每次更新內容

```bash
# 改完 src/content/works/*.md 或 src/data/*.json
npm run build              # 確認沒錯誤
git add -A
git commit -m "Add Q2 campaign work"
git push
```

push 後 GitHub Actions 會自動再跑一次，約 1–2 分鐘後新版本就上線。

---

## Troubleshooting

### 進到網站，看到 404 / 樣式跑掉 / 圖片連結都壞

幾乎一定是 **`base` 沒設對**。

- 情境 B 的 repo 叫 `portfolio`，`base` 必須是 `"/portfolio"`，少了或多了斜線都會壞
- 改完 `astro.config.ts` 後要 commit + push，光改本機沒用
- 重新整理時用 hard reload（⌘⇧R），CDN 會 cache 舊版

### Action 跑失敗（紅叉叉）

點進 Action 的詳細頁，看 `build` step 哪一行紅了：

- `Error: Process completed with exit code 1` 通常是 `astro check` 失敗 → 在本機跑一次 `npm run build` 一定會看到同樣錯誤，先修了再 push
- 第一次跑遇到 `Get Pages site failed` → 回 Step 4 確認 Source 是 **GitHub Actions**，不是 "Deploy from a branch"

### Settings → Pages 看不到 "GitHub Actions" 選項

repo 是 private 且不是 GitHub Pro 帳號。把 repo 改成 public，選項就會出現。

### 改了東西 push 之後網站還是舊的

- 先看 Actions tab，workflow 跑完沒？
- 跑完了還是舊的：hard reload（⌘⇧R）／開無痕視窗
- 都還是：CDN 通常 5–10 分鐘內會更新，再等一下

---

## 加 Custom Domain（選用）

如果你要綁自己的網域（例 `yan.dev`）：

1. 在 `public/` 加一個 `CNAME` 檔，內容只有一行：`yan.dev`
2. 到你的 DNS 服務商，把 A record 指到 GitHub Pages 的 IP：
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
   或 CNAME 指到 `<user>.github.io`
3. repo Settings → Pages → 在 **Custom domain** 填 `yan.dev`，勾 **Enforce HTTPS**
4. `astro.config.ts` 的 `site` 改成 `"https://yan.dev"`，`base` 改回 `"/"`，commit + push
