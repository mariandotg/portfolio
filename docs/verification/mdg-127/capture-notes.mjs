#!/usr/bin/env node
/** One-off capture for MDG-127 — sets localStorage theme (class-based dark). */
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const slugs = [
  "four-short-loops",
  "the-cache-break",
  "the-quadratic-loop",
  "what-the-summary-forgot",
  "shipping-without-a-safety-net",
];
const base = process.argv[2] ?? "http://localhost:4327/notes";
const root = join(import.meta.dirname);
const chromeBin = process.env.CHROME_BIN ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const WIDTHS = [1280, 390];
const SCHEMES = ["light", "dark"];
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

for (const slug of slugs) {
  const outDir = join(root, slug);
  mkdirSync(outDir, { recursive: true });
  const profile = mkdtempSync(join(tmpdir(), "mdg127-cap-"));
  const chrome = spawn(
    chromeBin,
    ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--user-data-dir=${profile}`, "--remote-debugging-port=0", "about:blank"],
    { stdio: ["ignore", "ignore", "pipe"] },
  );
  const wsUrl = await new Promise((resolve, reject) => {
    let buf = "";
    const t = setTimeout(() => reject(new Error("Chrome timeout")), 15000);
    chrome.stderr.on("data", (c) => {
      buf += c;
      const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
      if (m) {
        clearTimeout(t);
        resolve(m[1]);
      }
    });
  });
  const ws = new WebSocket(wsUrl);
  await new Promise((r) => (ws.onopen = r));
  let nextId = 0;
  const pending = new Map();
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id !== undefined) {
      const c = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) c.reject(new Error(msg.error.message));
      else c.resolve(msg.result);
    }
  };
  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const id = ++nextId;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params, sessionId }));
    });

  try {
    for (const width of WIDTHS) {
      for (const scheme of SCHEMES) {
        const { targetId } = await send("Target.createTarget", { url: "about:blank" });
        const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
        await send("Page.enable", {}, sessionId);
        await send(
          "Page.addScriptToEvaluateOnNewDocument",
          { source: `localStorage.setItem("theme", "${scheme}");` },
          sessionId,
        );
        await send(
          "Emulation.setDeviceMetricsOverride",
          { width, height: 900, deviceScaleFactor: 1, mobile: width < 640 },
          sessionId,
        );
        await send("Page.navigate", { url: `${base}/${slug}` }, sessionId);
        await delay(3000);
        await send("Runtime.evaluate", { expression: "document.querySelector('astro-dev-toolbar')?.remove()" }, sessionId);
        const { result } = await send(
          "Runtime.evaluate",
          {
            expression: `JSON.stringify({
              h: document.documentElement.scrollHeight,
              sw: document.documentElement.scrollWidth,
              iw: innerWidth,
              dark: document.documentElement.classList.contains('dark'),
              bodyPx: getComputedStyle(document.querySelector('.note')||document.body).fontSize,
              textW: document.querySelector('.note > p')?.getBoundingClientRect().width
            })`,
            returnByValue: true,
          },
          sessionId,
        );
        const metrics = JSON.parse(result.value);
        const height = Math.min(metrics.h, 12000);
        const { data } = await send(
          "Page.captureScreenshot",
          { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width: metrics.iw, height, scale: 1 } },
          sessionId,
        );
        const file = join(outDir, `shot-${width}-${scheme}.png`);
        writeFileSync(file, Buffer.from(data, "base64"));
        console.log(file);
        if (metrics.sw > metrics.iw) console.warn(`  WARN overflow ${slug} ${width} ${scheme}: ${metrics.sw}px`);
        if (metrics.dark !== (scheme === "dark")) console.warn(`  WARN theme ${slug} ${scheme}`);
        if (width === 1280 && scheme === "light" && metrics.textW) {
          console.log(`  measure text column: ${Math.round(metrics.textW)}px, note font: ${metrics.bodyPx}`);
        }
        await send("Target.closeTarget", { targetId });
      }
    }
  } finally {
    ws.close();
    chrome.kill();
    await delay(500);
    rmSync(profile, { recursive: true, force: true });
  }
}
