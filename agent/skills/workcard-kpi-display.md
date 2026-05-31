---
name: workcard-kpi-display
description: Use when 使用者要調整某個作品卡片（WorkCard）的 KPI 顯示方式，例如「隱藏 label」、「合併 label + value」、或「針對特定 slug 客製化 KPI 呈現」。本 skill 記錄 `src/components/WorkCard.astro` 裡的 billboard 特例邏輯，以及如何新增 / 調整作品到各分組。
applies_to:
  - Antigravity
  - Cursor
  - Claude Code
  - Codex
  - 任何 LLM coding agent
---

# workcard-kpi-display

## Overview

`WorkCard.astro` 預設顯示 `primaryKpi.label`（小字標籤）+ `primaryKpi.value`（大字數值）+ `primaryKpi.growth`（成長 badge）。

某些作品（目前是 billboard 系列）有不同的視覺需求，透過 **slug 白名單** 控制顯示行為，不修改 content collection schema、不影響其他作品。

## 分組定義（位於 `WorkCard.astro` 的 frontmatter script）

### `isBillboardSection`（Billboard 系列）

```ts
const isBillboardSection = [
  "billboard-5080",
  "billboard-ghost-month",
  "billboard-goddess",
  "billboard-april-fools",
  "single-dogs-food",
].includes(slug);
```

效果：`hideKpiLabel = true` → 隱藏 label 小字、隱藏 growth badge。

### `isCategoryA`（需顯示「label + value」合併字串的子集）

```ts
const isCategoryA = [
  "billboard-ghost-month",
  "single-dogs-food",
].includes(slug);
```

效果：`kpiText = \`${primaryKpi.label} ${primaryKpi.value}\``（把 label 合進大字顯示）。

### 預設（非 billboard）

`hideKpiLabel = false`，`kpiText = primaryKpi.value`，growth badge 正常顯示。

## 顯示邏輯對照表

| 分組 | label 小字 | 大字內容 | growth badge |
|---|---|---|---|
| 非 billboard | ✅ 顯示 | `value` | ✅ 顯示（若有） |
| billboard（非 categoryA） | ❌ 隱藏 | `value` | ❌ 隱藏 |
| billboard + categoryA | ❌ 隱藏 | `label value`（合併） | ❌ 隱藏 |

## When to Use

- 要把某個作品加入 billboard 系列（隱藏 label）
- 要把某個作品加入 categoryA（合併顯示 label + value）
- 要新增新的顯示分組（依相同模式擴充）
- 要把作品從某個分組移除（改回預設）

## Procedure

### 把作品加進 billboard 系列

1. 確認作品的 slug（`src/content/works/` 下的 md 檔名去掉 `.md`）
2. 在 `WorkCard.astro` 的 `isBillboardSection` 陣列裡加入該 slug
3. 如果這個作品同時需要「label + value」合併顯示 → 也加進 `isCategoryA`
4. `npm run dev` 看視覺確認
5. `npm run build` 過才 commit（照 `commit_push.md`）

### 新增一個顯示分組

1. 在 `isBillboardSection` 之後定義新的 `const isXxx = [...].includes(slug)`
2. 定義對應的 `hideXxxLabel` / `kpiTextXxx` 邏輯
3. 在 JSX 區塊裡用 `isXxx` 控制條件渲染
4. 更新本 skill 的對照表

## Common Mistakes

| 錯誤 | 修法 |
|---|---|
| 直接改 content collection schema 的 `kpis` 結構 | 改 schema 會影響所有作品的 frontmatter 驗證；用 slug 白名單控制顯示邏輯即可 |
| 用 `index` 硬取第幾個 kpi | 用 `data.kpis?.[0]` + optional chaining，slug 不在清單裡的作品 kpi 可能是 undefined |
| 改了顯示但忘記 `npm run build` | dev 不跑 schema 驗證，build 才是上線前的最後關卡 |
| 新增作品 slug 拼錯 | slug = md 檔名去掉 `.md`，到 `src/content/works/` 確認 |

## File Reference

- `src/components/WorkCard.astro` — 本 skill 描述的邏輯所在地
- `src/content/works/*.md` — 每個作品的 frontmatter（含 `kpis` 陣列）
- `agent/skills/commit_push.md` — 修改完成後的 commit + push 流程
