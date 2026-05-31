---
name: commit-push
description: Use when 使用者在這個 portfolio repo 明確指示「commit / push / 上線 / 部署」，且本輪修改已在 `npm run dev` 視覺確認過；本 skill 規範 build gate、commit message 風格、push 後的部署提醒，避免漏跑 `npm run build` 或繞過 schema 驗證。
applies_to:
  - Antigravity
  - Cursor
  - Claude Code
  - Codex
  - 任何 LLM coding agent
---

# commit-push

> 跨工具共用的 commit + push runbook。Antigravity / Cursor / Claude Code / Codex 都適用 —— 全部都是執行 shell 命令、不依賴特定工具的 API。

## Overview

本 repo 的 commit + push 不是單純 `git add . && git commit && git push`：

- push 到 `main` = **自動觸發 GitHub Actions 部署**（`.github/workflows/deploy.yml`），會直接上線
- `npm run dev` **不會**跑 `astro check` 也不會跑 content collection 的 Zod schema 驗證 → 視覺 OK ≠ build 會過
- 既有 commit log 用 **conventional commits**（`feat:` / `chore:` / `fix:`）+ 祈使句

所以這套流程必須有一道 build gate 在 dev 視覺確認之後、commit 之前。

## When to Use

- 使用者明確說：「commit」、「push」、「上線」、「部署一下」、「推上去」、「commit + push」
- 本輪修改已存在 working tree（`git status` 有 unstaged / staged 變更）
- 修改已在 `npm run dev` 開的瀏覽器看過、確認視覺與行為符合預期

**Do NOT trigger when:**
- 使用者只是在討論修改、還沒說要 commit → 系統 prompt 已寫死「never commit unless explicitly asked」
- working tree 是乾淨的（沒東西可 commit）
- build 沒過就硬 commit
- 使用者要求 `--no-verify` / force push / amend 已 push 出去的 commit → 先問清楚再動

## Procedure

照順序跑，**任一步失敗都停下來修，不要繞過**。

### 1. Build gate（必跑，不可省）

```bash
npm run build
```

看到 `[build] Complete!` 才繼續。

- ❌ `astro check` error → 修型別 / 修 frontmatter，**不要** `// @ts-ignore`、不要刪 schema 欄位
- ❌ Zod 驗證失敗（`Expected string, received undefined` 之類）→ 對照 AGENTS.md §4 範本補欄位
- ❌ 如果改的是視覺、build 過但結果看起來不對 → 回 `npm run dev` 再確認

### 2. 檢查要 commit 什麼

並行跑（這些是 read-only，安全）：

```bash
git status                # 看 untracked + modified
git diff                  # 看未 stage 的內容變更
git diff --staged         # 看已 stage 的
git log --oneline -5      # 看既有 commit message 風格，跟著走
```

**檢查清單：**
- [ ] 有沒有 `.env`、`*.key`、`credentials*` 之類意外要 commit 的（有 → 警告使用者，不要 stage）
- [ ] `dist/`、`node_modules/`、`.astro/` 應該都被 `.gitignore` 擋掉了；萬一出現在 status 裡，**不要 add**
- [ ] 大型二進位（>1MB 的圖片）→ 確認使用者真的要進 git

### 3. Stage + commit

優先 `git add <specific files>`，**避免** `git add -A` / `git add .`（容易掃到不該進的東西）。

Commit message 規則：

| 規則 | 範例 |
|---|---|
| Conventional commits prefix | `feat:` 新功能 / 新頁面、`fix:` 修 bug、`chore:` 內容更新 / 樣式微調 / 設定、`refactor:` 重構 |
| 祈使句、現在式（AGENTS.md §5.1） | ✅ `Add Q2 campaign work` / ❌ `Added Q2 campaign work` |
| 第一行 ≤ 72 字、聚焦 "why" 不是 "what" | ✅ `chore: update billboard titles, KPIs, influencer split` |
| 中文 OK，跟既有 log 風格保持一致 | 看 `git log --oneline -10` 決定 |

用 HEREDOC 傳 message 避免引號爆炸（多行 / 含特殊字元時）：

```bash
git commit -m "$(cat <<'EOF'
chore: update Q2 campaign KPIs and partner logos

<可選：詳細說明動機 / 影響範圍 / 相關 issue>
EOF
)"
```

**Co-Authored-By trailer（依工具決定）：**

| 工具 | 是否加 trailer |
|---|---|
| Claude Code | 系統 prompt 已要求加 `Co-Authored-By: Claude ...`，照系統 prompt 走 |
| Cursor / Antigravity / Codex / 其他 | **不要**自己捏一個 trailer；除非該工具的系統 prompt / 設定明確要求，否則保持單純 |
| 使用者自己手動 commit | 不要替使用者加 AI trailer |

原則：trailer 是「誰參與了這個 commit」的事實聲明，不要在工具沒指示時自行加。

如果 pre-commit hook 失敗：**不要** `--no-verify`，修了再開新 commit（**不要** `--amend`，hook 失敗 = commit 沒發生，amend 會改到上一個 commit）。

### 4. Push（會觸發部署）

push 前再確認一次 working tree 和當前 branch：

```bash
git status
git branch --show-current   # 確認在 main
```

確認沒問題後：

```bash
git push                    # 預設 push 到 origin/main
```

**push 出去 = 1–2 分鐘後上線。** 跟使用者說：
- 部署 URL（看 `astro.config.ts` 的 `site` + `base`，例：`https://lilandrew0203.github.io/<base>/`）
- 可到 GitHub repo → Actions tab 看 workflow 跑完沒
- 之後要回退只能用新 commit revert，**不要** `git push --force` 到 main

### 5. 回報

向使用者回報這三件事，**不要多**：

1. commit hash + message 第一行
2. 已 push 到 `origin/main`、Actions 約 1–2 分鐘部署完
3. 如果有任何被刻意略過 / 略過理由（例：某些檔案沒 add），明講

## Quick Reference

```bash
# 完整流程一條龍
npm run build && \
git status && \
git diff && \
git add <files> && \
git commit -m "feat: ..." && \
git push
```

但**不要**真的串成一行跑 —— 每一步看完輸出再決定下一步。`&&` 只是給你記順序用。

## Common Mistakes

| 錯誤 | 為什麼錯 / 怎麼修 |
|---|---|
| 只跑 `npm run dev` 沒跑 `npm run build` 就 commit | dev 不驗 schema 跟型別，CI build 會紅；先 `npm run build` |
| `git add -A` / `git add .` | 容易掃到 `.env`、IDE 暫存檔、`dist/` 殘渣；指名加檔 |
| `git commit --no-verify` 繞 hook | hook 紅是有理由的；修 root cause，不要繞 |
| `git commit --amend` 在 push 出去之後 | 改寫已推送的歷史，會逼自己或別人 force push；改用新 commit |
| `git push --force` / `--force-with-lease` to main | main 自動部署、別人可能基於它工作；**不要做**，要做先停下來問使用者 |
| 漏 stage 圖片檔（放在 `public/images/` 下的） | 之後上線會 404；`git status` 一定要看 untracked |
| commit message 寫成 `update` / `fix bug` 沒上下文 | log 變垃圾、之後查不到動機；對照 `git log --oneline -10` 風格 |

## Red Flags — STOP

看到以下任何一個，**停下來、不要繼續 push**，回問使用者：

- 使用者沒明確說「commit」/「push」/「上線」/「部署」（系統 prompt 已寫死：未經明示不可 commit）
- `npm run build` 紅了，且使用者要求「先 push 上去再修」
- 看到要 commit 的檔案裡有疑似 secret（`.env*`、`*token*`、`*secret*`、`*.pem`、`credentials*`）
- 當前 branch 不是 `main` 但使用者沒交代要 push 到哪
- working tree 還有未 stage 的相關變更，但只 commit 了一半
- 需要 force push / amend 已 push 的 commit / 刪 remote branch
