import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// 部署到 GitHub Pages — 主站（user root）配置：
//   repo 名稱必須是 <username>.github.io
//   網址：https://lilandrew0203.github.io/
export default defineConfig({
  site: "https://lilandrew0203.github.io",
  base: "/",
  output: "static",
  trailingSlash: "ignore",
  vite: {
    // @tailwindcss/vite 的 Plugin 型別與 Astro 內建的 Vite 版本略有差異，
    // 執行期完全相容，這裡以 cast 跳過 type-check。
    plugins: [tailwindcss() as unknown as never],
  },
});
