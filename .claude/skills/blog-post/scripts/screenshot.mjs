#!/usr/bin/env node
// Usage: node screenshot.mjs <url> [outDir] [maxHeight]
// Captures <url> at 1280px and 390px, light and dark, through the Chrome
// DevTools Protocol. CLI flags are not enough: headless Chrome clamps the
// window to 500px and follows the OS color scheme. Warns on horizontal overflow.
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [url, outDir = join(tmpdir(), "blog-post-shots"), maxHeightArg = "6000"] = process.argv.slice(2);
if (!url) {
  console.error("usage: node screenshot.mjs <url> [outDir] [maxHeight]");
  process.exit(1);
}
const maxHeight = Number(maxHeightArg);
const chromeBin = process.env.CHROME_BIN ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const WIDTHS = [1280, 390];
const SCHEMES = ["light", "dark"];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

mkdirSync(outDir, { recursive: true });
const profile = mkdtempSync(join(tmpdir(), "blog-post-chrome-"));
const chrome = spawn(
  chromeBin,
  ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--user-data-dir=${profile}`, "--remote-debugging-port=0", "about:blank"],
  { stdio: ["ignore", "ignore", "pipe"] },
);

async function stopChrome() {
  if (chrome.exitCode === null) {
    const exited = new Promise((resolve) => chrome.once("exit", resolve));
    chrome.kill();
    await Promise.race([exited, delay(5000)]);
  }
  rmSync(profile, { recursive: true, force: true });
}

const wsUrl = await new Promise((resolve, reject) => {
  let buffer = "";
  const timer = setTimeout(() => reject(new Error("Chrome did not start in 15s")), 15000);
  chrome.stderr.on("data", (chunk) => {
    buffer += chunk;
    const match = buffer.match(/DevTools listening on (ws:\/\/\S+)/);
    if (match) {
      clearTimeout(timer);
      resolve(match[1]);
    }
  });
  chrome.on("exit", () => reject(new Error("Chrome exited before DevTools was ready")));
}).catch(async (error) => {
  console.error(error.message);
  await stopChrome();
  process.exit(1);
});

const ws = new WebSocket(wsUrl);
await new Promise((resolve, reject) => {
  ws.onopen = resolve;
  ws.onerror = reject;
});

let nextId = 0;
const pending = new Map();
const listeners = new Set();

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id !== undefined) {
    const call = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) call.reject(new Error(`${call.method}: ${msg.error.message}`));
    else call.resolve(msg.result);
    return;
  }
  for (const listener of listeners) listener(msg);
};

function send(method, params = {}, sessionId) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject, method });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });
}

function waitForEvent(method, sessionId, timeoutMs) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      listeners.delete(listener);
      resolve(null);
    }, timeoutMs);
    const listener = (msg) => {
      if (msg.method === method && msg.sessionId === sessionId) {
        clearTimeout(timer);
        listeners.delete(listener);
        resolve(msg.params);
      }
    };
    listeners.add(listener);
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

      const loaded = waitForEvent("Page.loadEventFired", sessionId, 20000);
      await send("Page.navigate", { url }, sessionId);
      if (!(await loaded)) console.warn(`  WARN load event not fired in 20s (${width}px ${scheme})`);
      await delay(1500); // let client:visible islands hydrate
      await send("Runtime.evaluate", { expression: "document.querySelector('astro-dev-toolbar')?.remove()" }, sessionId);

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
      const height = Math.min(h, maxHeight);

      const { data } = await send(
        "Page.captureScreenshot",
        { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width: iw, height, scale: 1 } },
        sessionId,
      );
      const file = join(outDir, `shot-${width}-${scheme}.png`);
      writeFileSync(file, Buffer.from(data, "base64"));
      console.log(file);

      if (iw !== width) {
        console.warn(`  WARN viewport is ${iw}px, expected ${width}px`);
        exitCode = 1;
      }
      if (dark !== (scheme === "dark")) {
        console.warn(`  WARN page theme does not match ${scheme} (html.dark=${dark})`);
        exitCode = 1;
      }
      if (sw > iw) console.warn(`  WARN horizontal overflow: scrollWidth ${sw}px > viewport ${iw}px`);

      await send("Target.closeTarget", { targetId });
    }
  }
} catch (error) {
  console.error(error.message);
  exitCode = 1;
} finally {
  ws.close();
  await stopChrome();
}
process.exit(exitCode);
