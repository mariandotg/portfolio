#!/usr/bin/env node
/** MDG-128 — inject prose fixtures into a published note for visual verification. */
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const url = process.argv[2] ?? "http://localhost:4328/notes/idempotency-distributed-payments";
const outDir = join(import.meta.dirname, "prose-fixture");
const chromeBin = process.env.CHROME_BIN ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const WIDTHS = [1280, 390];
const SCHEMES = ["light", "dark"];
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const inject = `
(() => {
  const note = document.querySelector(".note.prose");
  if (!note) return "no .note.prose";
  const el = document.createElement("div");
  el.id = "mdg-128-fixture";
  el.innerHTML = \`
<blockquote><p>Measured beats assumed when the bill is on the line.</p></blockquote>
<hr />
<ul>
  <li>First level
    <ul><li>Second level nested</li></ul>
  </li>
</ul>
<p>Inline code in prose: <code>cache_control</code> next to a figure table.</p>
<table>
  <thead><tr><th>What changed</th><th>Tools cache</th><th>System cache</th><th>Messages cache</th></tr></thead>
  <tbody>
    <tr><td>Tool definitions</td><td>invalidated</td><td>invalidated</td><td>invalidated</td></tr>
    <tr><td>Web search toggle</td><td>valid</td><td>invalidated</td><td>invalidated</td></tr>
    <tr><td>tool_choice</td><td>valid</td><td>valid</td><td>invalidated</td></tr>
  </tbody>
</table>
<figure>
  <p style="margin:0;padding:1rem;background:hsl(var(--muted));border-radius:8px;">Figure placeholder</p>
  <figcaption>Caption with mono meta voice — cache-break style.</figcaption>
</figure>
\`;
  note.prepend(el);
  el.scrollIntoView();
  return "ok";
})()
`;

mkdirSync(outDir, { recursive: true });
const profile = mkdtempSync(join(tmpdir(), "mdg128-cap-"));
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
await new Promise((resolve, reject) => {
  ws.onopen = resolve;
  ws.onerror = reject;
});

let nextId = 0;
const pending = new Map();
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id === undefined) return;
  const call = pending.get(msg.id);
  pending.delete(msg.id);
  if (msg.error) call.reject(new Error(msg.error.message));
  else call.resolve(msg.result);
};

function send(method, params = {}, sessionId) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });
}

let exitCode = 0;
try {
  for (const width of WIDTHS) {
    for (const scheme of SCHEMES) {
      const { targetId } = await send("Target.createTarget", { url: "about:blank" });
      const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
      await send("Page.enable", {}, sessionId);
      await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 640 }, sessionId);
      await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: scheme }] }, sessionId);
      await send("Page.navigate", { url }, sessionId);
      await delay(2000);
      await send("Runtime.evaluate", { expression: "document.querySelector('astro-dev-toolbar')?.remove()" }, sessionId);
      const inj = await send("Runtime.evaluate", { expression: inject, returnByValue: true }, sessionId);
      if (inj.result?.value !== "ok") {
        console.warn(`  WARN inject: ${inj.result?.value}`);
        exitCode = 1;
      }
      await delay(300);
      const { result } = await send(
        "Runtime.evaluate",
        {
          expression:
            "JSON.stringify({ h: document.documentElement.scrollHeight, sw: document.documentElement.scrollWidth, iw: innerWidth, dark: document.documentElement.classList.contains('dark') })",
          returnByValue: true,
        },
        sessionId,
      );
      const { h, sw, iw, dark } = JSON.parse(result.value);
      const { data } = await send(
        "Page.captureScreenshot",
        { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width: iw, height: Math.min(h, 8000), scale: 1 } },
        sessionId,
      );
      const file = join(outDir, `shot-${width}-${scheme}.png`);
      writeFileSync(file, Buffer.from(data, "base64"));
      console.log(file);
      if (dark !== (scheme === "dark")) console.warn(`  WARN theme mismatch ${scheme}`);
      if (sw > iw) {
        console.warn(`  WARN horizontal overflow: scrollWidth ${sw}px > viewport ${iw}px`);
        exitCode = 1;
      }
      await send("Target.closeTarget", { targetId });
    }
  }
} finally {
  ws.close();
  chrome.kill();
  rmSync(profile, { recursive: true, force: true });
}
process.exit(exitCode);
