// KPI 數字 count-up：唯一使用 JS 的視覺效果
// 用 Intersection Observer 觸發，從 0 動畫到目標值。
// 支援數字 + 中文 / 英文後綴（例如 "120萬" / "8.2%" / "+340%" / "580%" / "2.1x"）。

type ParsedValue = {
  prefix: string;
  num: number;
  suffix: string;
  decimals: number;
};

function parse(value: string): ParsedValue | null {
  const match = value.match(/^([^\d\-+.]*)(-?\+?\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const [, prefix, numStr, suffix] = match;
  const decimals = (numStr.split(".")[1] ?? "").length;
  return { prefix: prefix ?? "", num: parseFloat(numStr), suffix, decimals };
}

function ease(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function animate(el: HTMLElement, parsed: ParsedValue, duration = 1400) {
  const start = performance.now();
  const { prefix, num, suffix, decimals } = parsed;
  function frame(now: number) {
    const progress = Math.min(1, (now - start) / duration);
    const current = num * ease(progress);
    el.textContent = `${prefix}${current.toFixed(decimals)}${suffix}`;
    if (progress < 1) requestAnimationFrame(frame);
    else el.textContent = `${prefix}${num.toFixed(decimals)}${suffix}`;
  }
  requestAnimationFrame(frame);
}

function init() {
  const targets = document.querySelectorAll<HTMLElement>("[data-countup]");
  if (!targets.length) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        io.unobserve(el);
        const raw = el.getAttribute("data-countup") ?? el.textContent ?? "";
        const parsed = parse(raw.trim());
        if (!parsed) continue;
        if (reduce) {
          el.textContent = raw;
        } else {
          animate(el, parsed);
        }
      }
    },
    { threshold: 0.3 },
  );
  targets.forEach((el) => io.observe(el));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
