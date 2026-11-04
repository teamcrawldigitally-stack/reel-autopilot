// Backup route only: gives one local video a temporary public HTTPS link so Instagram can fetch it,
// then takes it down. Used when a direct (resumable) upload isn't possible. A tiny local server serves
// only this file under a random path, exposed through a Cloudflare quick tunnel (free, no account),
// tried twice. Reachability is also checked through 1.1.1.1, because a brand-new tunnel name is often
// cached as "not found" by the machine's own DNS for a while.
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

// Starts a tunnel command and waits for the public URL it prints.
const startTunnel = ({ name, cmd, args, pattern, timeoutMs = 60000 }) =>
  new Promise((resolve, reject) => {
    let p;
    try {
      p = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    } catch (e) {
      return reject(e);
    }
    let buf = "";
    let done = false;
    const finish = (fn, v) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      fn(v);
    };
    const timer = setTimeout(() => (p.kill(), finish(reject, new Error(`${name} gave no URL within ${timeoutMs / 1000} s`))), timeoutMs);
    const onData = (d) => {
      buf += d;
      const m = pattern.exec(buf);
      if (m) finish(resolve, { url: m[0], stop: () => p.kill() });
    };
    p.stdout.on("data", onData);
    p.stderr.on("data", onData);
    p.on("error", (e) => finish(reject, e));
    p.on("exit", (code) => finish(reject, new Error(`${name} exited (${code}): ${buf.slice(-300).replace(/\s+/g, " ")}`)));
  });

const tunnels = (port) =>
  ["Cloudflare tunnel", "Cloudflare tunnel (2nd try)"].map((name) => ({
    name,
    cmd: process.env.CLOUDFLARED || "cloudflared",
    args: ["tunnel", "--no-autoupdate", "--url", `http://127.0.0.1:${port}`],
    pattern: /https:\/\/[a-z0-9-]+\.trycloudflare\.com/,
  }));

// One check: do the first bytes look like an MP4? Tries the normal resolver, then 1.1.1.1 via curl.
const looksLikeMp4 = async (url) => {
  try {
    const r = await fetch(url, { headers: { Range: "bytes=0-31" }, signal: AbortSignal.timeout(10000) });
    const b = Buffer.from(await r.arrayBuffer());
    if ((r.status === 206 || r.status === 200) && b.subarray(4, 8).toString() === "ftyp") return true;
  } catch {}
  if (process.env.HOST_CHECK_NO_DOH) return false;
  return new Promise((resolve) => {
    let b = Buffer.alloc(0);
    const p = spawn("curl", ["-sS", "-m", "10", "--doh-url", "https://1.1.1.1/dns-query", "-r", "0-31", "-o", "-", url], { stdio: ["ignore", "pipe", "ignore"] });
    p.stdout.on("data", (d) => (b = Buffer.concat([b, d])));
    p.on("close", () => resolve(b.subarray(4, 8).toString() === "ftyp"));
    p.on("error", () => resolve(false));
  });
};

// Checks from the outside that the link really serves the video.
export const reachable = async (url, seconds = 90) => {
  const deadline = Date.now() + seconds * 1000;
  await sleep(3000);
  while (Date.now() < deadline) {
    if (await looksLikeMp4(url)) return true;
    await sleep(3000);
  }
  return false;
};

// Returns { url, how, close() }.
export const hostVideo = async (filePath, { port = 8787 } = {}) => {
  const { server, route, hits } = await serveOne(filePath, port);
  const tried = [];
  for (const t of tunnels(port)) {
    try {
      const tunnel = await startTunnel(t);
      const url = tunnel.url + route;
      log(`video link: ${t.name} (${tunnel.url.replace("https://", "")})`);
      if (await reachable(url)) {
        return { url, how: t.name, hits, close: () => (tunnel.stop(), server.closeAllConnections(), server.close()) };
      }
      log(`  ${t.name} link not reachable from outside, trying the next option`);
      tried.push(`${t.name}: not reachable`);
      tunnel.stop();
    } catch (e) {
      log(`  ${t.name} failed (${e.message.slice(0, 160)}), trying the next option`);
      tried.push(`${t.name}: ${e.message.slice(0, 80)}`);
    }
  }
  server.closeAllConnections();
  server.close();
  throw new Error(`Could not make a temporary video link (${tried.join("; ")})`);
};
