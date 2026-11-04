// Gives one local video a temporary public HTTPS link so Instagram can fetch it, then takes it down.
// 1st choice: a Cloudflare quick tunnel (free, no account) to a tiny local server that serves only
// this file under a random path. Fallback: Litterbox (free temporary file host, link expires in 1 h).
import { spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { log } from "./lib.mjs";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const serveOne = (filePath, port) => {
  const secret = crypto.randomBytes(12).toString("hex");
  const route = `/${secret}/${path.basename(filePath)}`;
  const size = fs.statSync(filePath).size;
  let hits = 0;
  const server = http.createServer((req, res) => {
    if (decodeURIComponent(new URL(req.url, "http://x").pathname) !== route || !["GET", "HEAD"].includes(req.method)) {
      res.writeHead(404).end();
      return;
    }
    hits++;
    const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? "");
    let start = 0;
    let end = size - 1;
    if (m) {
      if (m[1] === "") start = Math.max(0, size - Number(m[2]));
      else {
        start = Number(m[1]);
        if (m[2] !== "") end = Math.min(Number(m[2]), size - 1);
      }
      if (start > end || start >= size) {
        res.writeHead(416, { "Content-Range": `bytes */${size}` }).end();
        return;
      }
    }
    const headers = { "Content-Type": "video/mp4", "Accept-Ranges": "bytes", "Content-Length": end - start + 1, "Cache-Control": "no-store" };
    if (m) headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
    res.writeHead(m ? 206 : 200, headers);
    if (req.method === "HEAD") return res.end();
    fs.createReadStream(filePath, { start, end }).pipe(res);
  });
  return new Promise((resolve) => server.listen(port, "127.0.0.1", () => resolve({ server, route, hits: () => hits })));
};

const startTunnel = (port) =>
  new Promise((resolve, reject) => {
    const p = spawn(process.env.CLOUDFLARED || "cloudflared", ["tunnel", "--no-autoupdate", "--url", `http://127.0.0.1:${port}`], { stdio: ["ignore", "pipe", "pipe"] });
    let buf = "";
    const timer = setTimeout(() => {
      p.kill();
      reject(new Error("cloudflared did not give a URL within 60 s"));
    }, 60000);
    const onData = (d) => {
      buf += d;
      const m = /https:\/\/[a-z0-9-]+\.trycloudflare\.com/.exec(buf);
      if (m) {
        clearTimeout(timer);
        resolve({ url: m[0], stop: () => p.kill() });
      }
    };
    p.stdout.on("data", onData);
    p.stderr.on("data", onData);
    p.on("error", (e) => {
      clearTimeout(timer);
      reject(e);
    });
    p.on("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`cloudflared exited (${code}): ${buf.slice(-400)}`));
    });
  });

// Checks from the outside that the link really serves the video (first bytes must be an MP4 header).
export const reachable = async (url, tries = 30) => {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { Range: "bytes=0-31" } });
      const b = Buffer.from(await r.arrayBuffer());
      if ((r.status === 206 || r.status === 200) && b.subarray(4, 8).toString() === "ftyp") return true;
    } catch {}
    await sleep(2000);
  }
  return false;
};

const uploadLitterbox = async (filePath) => {
  const form = new FormData();
  form.append("reqtype", "fileupload");
  form.append("time", "1h");
  form.append("fileToUpload", await fs.openAsBlob(filePath, { type: "video/mp4" }), path.basename(filePath));
  const r = await fetch("https://litterbox.catbox.moe/resources/internals/api.php", { method: "POST", body: form });
  const text = (await r.text()).trim();
  if (!r.ok || !/^https:\/\//.test(text)) throw new Error(`litterbox upload failed: ${r.status} ${text.slice(0, 200)}`);
  return text;
};

// Returns { url, how, close() }.
export const hostVideo = async (filePath, { port = 8787 } = {}) => {
  const { server, route, hits } = await serveOne(filePath, port);
  try {
    const tunnel = await startTunnel(port);
    const url = tunnel.url + route;
    log(`video link: Cloudflare tunnel (${tunnel.url.replace("https://", "")})`);
    if (await reachable(url)) {
      return { url, how: "tunnel", hits, close: () => (tunnel.stop(), server.closeAllConnections(), server.close()) };
    }
    log("tunnel link not reachable from outside, trying the fallback");
    tunnel.stop();
  } catch (e) {
    log(`tunnel failed (${e.message.slice(0, 200)}), trying the fallback`);
  }
  server.close();
  const url = await uploadLitterbox(filePath);
  if (!(await reachable(url, 10))) throw new Error("fallback link is not reachable either");
  log("video link: Litterbox temporary file (expires in 1 h)");
  return { url, how: "litterbox", hits: () => null, close: () => {} };
};
