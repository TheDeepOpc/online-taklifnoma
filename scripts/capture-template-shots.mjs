/**
 * Bosh sahifadagi shablon namunalari uchun skrinshot oluvchi skript.
 *
 * Ishlatish:
 *   1) `npm run build && npm run start`  (yoki `npm run dev`, PORT=3000)
 *   2) `npm run shots`
 *
 * Har bir shablon `/templates/<id>?bare=1` manzilida 430x900 mobil oynada
 * ochiladi va WebP skrinshot `public/template-shots/<id>.webp` ga yoziladi.
 * Shu sabab bosh sahifa jonli render qilmaydi — faqat rasm ko'rsatadi.
 */
import { spawn } from "node:child_process";
import { writeFile, mkdir } from "node:fs/promises";
import { setTimeout as sleep } from "node:timers/promises";

const PORT = 9333;
const OUT = process.argv[2] || "public/template-shots";
const { readFile } = await import("node:fs/promises");
// Mavzu ID'larini to'g'ridan-to'g'ri lib/themes.ts dan o'qiymiz.
const themesSrc = await readFile("lib/themes.ts", "utf8");
const IDS_LIST = [...themesSrc.matchAll(/^\s{4}id: "([a-z0-9-]+)",/gm)].map((m) => m[1]);
if (IDS_LIST.length === 0) throw new Error("lib/themes.ts dan mavzu ID'lari topilmadi");
const W = 430, H = 900, DPR = 2;

await mkdir(OUT, { recursive: true });

const chrome = spawn("google-chrome", [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  "--hide-scrollbars",
  "--mute-audio",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=/tmp/oila-uchun-shots-profile`,
  "about:blank",
], { stdio: "ignore" });

async function versionUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      const j = await r.json();
      return j.webSocketDebuggerUrl;
    } catch { await sleep(300); }
  }
  throw new Error("Chrome CDP ishga tushmadi");
}

const wsUrl = await versionUrl();
const ws = new WebSocket(wsUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

let id = 0;
const pending = new Map();
const listeners = new Map();
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { res, rej } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) rej(new Error(msg.error.message));
    else res(msg.result);
  } else if (msg.method) {
    (listeners.get(msg.method) || []).forEach((fn) => fn(msg.params));
  }
};
function send(method, params = {}, sessionId) {
  const mid = ++id;
  ws.send(JSON.stringify({ id: mid, method, params, sessionId }));
  return new Promise((res, rej) => pending.set(mid, { res, rej }));
}
function on(method, fn) {
  if (!listeners.has(method)) listeners.set(method, []);
  listeners.get(method).push(fn);
}

const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });

await send("Page.enable", {}, sessionId);
await send("Emulation.setDeviceMetricsOverride", {
  width: W, height: H, deviceScaleFactor: DPR, mobile: true,
}, sessionId);

for (const themeId of IDS_LIST) {
  let loaded = false;
  const onLoad = () => { loaded = true; };
  on("Page.loadEventFired", onLoad);
  await send("Page.navigate", { url: `http://localhost:3000/templates/${themeId}?bare=1` }, sessionId);
  for (let i = 0; i < 90 && !loaded; i++) await sleep(100);
  // shrift + rasm + animatsiyalar joyiga tushishi uchun
  await sleep(2600);
  const { data } = await send("Page.captureScreenshot", { format: "webp", quality: 82, captureBeyondViewport: false }, sessionId);
  await writeFile(`${OUT}/${themeId}.webp`, Buffer.from(data, "base64"));
  console.log("ok", themeId);
  listeners.set("Page.loadEventFired", (listeners.get("Page.loadEventFired") || []).filter((f) => f !== onLoad));
}

ws.close();
chrome.kill();
