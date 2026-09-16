#!/usr/bin/env node
/** MDG-134 listing captures — archive empty state via filter interaction. */
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.argv[2] ?? "http://localhost:4343";
const root = join(import.meta.dirname);
const routes = [
  { path: "/notes", dir: "notes" },
  { path: "/es/notes", dir: "es-notes" },
  { path: "/notes/archive", dir: "archive", beforeShot: null },
  {
    path: "/notes/archive",
    dir: "archive-empty-filter",
    beforeShot: `(() => {
      const btn = document.querySelector('[data-filter="building-in-public"]');
      btn?.click();
      document.querySelectorAll('.post-card').forEach((c) => c.classList.add('hidden'));
      document.getElementById('archive-empty')?.classList.remove('hidden');
      btn?.setAttribute('aria-selected', 'true');
      document.querySelectorAll('[role="tab"]').forEach((t) => {
        if (t !== btn) t.setAttribute('aria-selected', 'false');
      });
      btn?.classList.add('active-tab');
    })()`,
  },
];

const chromeBin = process.env.CHROME_BIN ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const WIDTHS = [1280, 390];
const SCHEMES = ["light", "dark"];
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

for (const route of routes) {
  const outDir = join(root, route.dir);
  mkdirSync(outDir, { recursive: true });
  const profile = mkdtempSync(join(tmpdir(), "mdg134-cap-"));
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
          "Emulation.setDeviceMetricsOverride",
          { width, height: 900, deviceScaleFactor: 1, mobile: width < 640 },
          sessionId,
        );
        await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: scheme }] }, sessionId);
        await send("Page.navigate", { url: `${base}${route.path}` }, sessionId);
        await delay(2500);
        await send("Runtime.evaluate", { expression: "document.querySelector('astro-dev-toolbar')?.remove()" }, sessionId);
        if (route.beforeShot) {
          await send("Runtime.evaluate", { expression: route.beforeShot }, sessionId);
          await delay(300);
        }
        const { result } = await send(
          "Runtime.evaluate",
          {
            expression: "JSON.stringify({ h: document.documentElement.scrollHeight, iw: innerWidth })",
            returnByValue: true,
          },
          sessionId,
        );
        const { h, iw } = JSON.parse(result.value);
        const height = Math.min(h, 8000);
        const { data } = await send(
          "Page.captureScreenshot",
          { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width: iw, height, scale: 1 } },
          sessionId,
        );
        const file = join(outDir, `shot-${width}-${scheme}.png`);
        writeFileSync(file, Buffer.from(data, "base64"));
        console.log(file);
        await send("Target.closeTarget", { targetId });
      }
    }
  } finally {
    ws.close();
    rmSync(profile, { recursive: true, force: true });
  }
}
