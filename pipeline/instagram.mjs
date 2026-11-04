// Instagram Reel publishing from a public video URL, with the token made in the Meta App Dashboard.
// Works with both token kinds the dashboard hands out:
//   - "EAA..." system-user token (Instagram API with Unified login, never expires) -> graph.facebook.com,
//     needs the Instagram account ID (igUserId in the queue manifest)
//   - "IGAA..." Instagram Login token (expires after 60 days) -> graph.instagram.com, renewed automatically
//     when TOKEN_KEY is set (the renewed token is saved encrypted in state/)
//
// Env: IG_ACCESS_TOKEN, optional TOKEN_KEY, optional IG_GRAPH_VERSION (default: the app's own version).
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { log, readJson, ROOT, writeJson } from "./lib.mjs";

const VERSION = process.env.IG_GRAPH_VERSION ? `/${process.env.IG_GRAPH_VERSION}` : "";
const hostFor = (token) =>
  process.env.IG_GRAPH_BASE_URL || (token.startsWith("EAA") ? "https://graph.facebook.com" : "https://graph.instagram.com");
let BASE = `https://graph.instagram.com${VERSION}`;
const isFacebookHost = () => BASE.includes("graph.facebook.com") || process.env.IG_TOKEN_KIND === "facebook";
const TOKEN_FILE = path.join(ROOT, "state", "ig-token.enc.json");
const REFRESH_EVERY_DAYS = 7;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sha = (s) => crypto.createHash("sha256").update(s).digest();

// ---- token store -------------------------------------------------------------------------------
const encrypt = (text, key) => {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", sha(key), iv);
  const data = Buffer.concat([c.update(text, "utf8"), c.final()]);
  return { iv: iv.toString("base64"), tag: c.getAuthTag().toString("base64"), data: data.toString("base64") };
};
const decrypt = (box, key) => {
  const d = crypto.createDecipheriv("aes-256-gcm", sha(key), Buffer.from(box.iv, "base64"));
  d.setAuthTag(Buffer.from(box.tag, "base64"));
  return Buffer.concat([d.update(Buffer.from(box.data, "base64")), d.final()]).toString("utf8");
};

// The saved (renewed) token wins, unless the GitHub secret was replaced since it was saved.
export const loadToken = () => {
  const secret = process.env.IG_ACCESS_TOKEN?.trim();
  const key = process.env.TOKEN_KEY;
  if (!secret) throw new Error("IG_ACCESS_TOKEN is not set (add it as a GitHub repository secret)");
  const saved = readJson(TOKEN_FILE, null);
  const secretId = sha(secret).toString("hex").slice(0, 16);
  BASE = `${hostFor(secret)}${VERSION}`;
  if (saved && key && saved.secretId === secretId) {
    try {
      return { token: decrypt(saved.box, key), refreshedAt: saved.refreshedAt, secretId };
    } catch {
      log("saved token could not be unlocked (TOKEN_KEY changed?), using the secret");
    }
  }
  return { token: secret, refreshedAt: null, secretId };
};

// Renews a 60-day Instagram Login token every few days (needs it to be at least 24 h old; failures
// are only logged). System-user tokens never expire, so there is nothing to renew.
export const refreshTokenIfDue = async (t) => {
  if (isFacebookHost()) return t;
  const key = process.env.TOKEN_KEY;
  if (!key) {
    log("TOKEN_KEY not set: token will not be renewed automatically (it expires 60 days after it was made)");
    return t;
  }
  const ageDays = t.refreshedAt ? (Date.now() - Date.parse(t.refreshedAt)) / 864e5 : Infinity;
  if (ageDays < REFRESH_EVERY_DAYS) return t;
  try {
    const r = await call("GET", `${BASE.replace(/\/v[\d.]+$/, "")}/refresh_access_token?grant_type=ig_refresh_token`, t.token);
    if (!r.access_token) throw new Error("no token in the reply");
    const refreshedAt = new Date().toISOString();
    writeJson(TOKEN_FILE, { secretId: t.secretId, refreshedAt, expiresInDays: Math.round((r.expires_in ?? 0) / 86400), box: encrypt(r.access_token, key) });
    log(`token renewed, valid for ${Math.round((r.expires_in ?? 0) / 86400)} more days`);
    return { ...t, token: r.access_token, refreshedAt };
  } catch (e) {
    log(`token not renewed this time (${e.message.slice(0, 160)})`);
    return t;
  }
};

// ---- API calls ---------------------------------------------------------------------------------
const call = async (method, url, token, form) => {
  for (let attempt = 1; attempt <= 3; attempt++) {
    let res, json;
    try {
      // The token travels as the access_token parameter (query for GET, form body for POST).
      const fullUrl = method === "GET" ? `${url}${url.includes("?") ? "&" : "?"}access_token=${encodeURIComponent(token)}` : url;
      res = await fetch(fullUrl, {
        method,
        headers: method === "GET" ? {} : { "Content-Type": "application/x-www-form-urlencoded" },
        body: method === "GET" ? undefined : new URLSearchParams({ ...(form ?? {}), access_token: token }),
      });
      json = await res.json().catch(() => ({}));
    } catch (e) {
      if (attempt === 3) throw e;
      log(`  network error, retrying: ${e.message}`);
      await sleep(5000 * attempt);
      continue;
    }
    if (res.ok && !json.error) return json;
    const err = json.error ?? json;
    const msg = `${method} ${url.split("?")[0].replace(/^https:\/\/[^/]+/, "")} -> ${res.status}: ${err.message ?? JSON.stringify(err)}${err.error_user_msg ? ` (${err.error_user_msg})` : ""}`;
    if (!(res.status >= 500 || err.is_transient) || attempt === 3) throw new Error(msg);
    log(`  temporary error, retrying: ${msg}`);
    await sleep(5000 * attempt);
  }
};

// The Instagram account the token posts to. Facebook-host tokens need the account ID (igUserId).
export const account = async (token, igUserId) => {
  if (!isFacebookHost()) return call("GET", `${BASE}/me?fields=user_id,username,account_type,media_count`, token);
  if (!igUserId) throw new Error("This token needs the Instagram account ID: set igUserId in the queue manifest");
  const a = await call("GET", `${BASE}/${igUserId}?fields=id,username,media_count`, token);
  return { user_id: a.id, username: a.username, account_type: "professional", media_count: a.media_count };
};
export const publishingQuota = (token, userId) =>
  call("GET", `${BASE}/${userId}/content_publishing_limit?fields=quota_usage,config`, token).then((r) => r.data?.[0] ?? null);
export const recentMedia = (token, userId) =>
  call("GET", `${BASE}/${userId}/media?fields=id,caption,timestamp,permalink&limit=10`, token).then((r) => r.data ?? []);

// Direct (resumable) upload is available with Facebook-host tokens (Unified login / Facebook Login
// for Business): the file goes straight to Instagram, no public link needed.
export const canUploadDirectly = () => isFacebookHost();

const containerForm = ({ caption, shareToFeed = true, thumbOffsetMs, audioName, trialGraduation }) => {
  const form = { media_type: "REELS", caption };
  if (trialGraduation) form.trial_params = JSON.stringify({ graduation_strategy: trialGraduation });
  else form.share_to_feed = String(shareToFeed);
  if (thumbOffsetMs != null) form.thumb_offset = String(thumbOffsetMs);
  if (audioName) form.audio_name = audioName;
  return form;
};

// Sends the file bytes to Instagram's upload server for a resumable container.
const uploadBytes = async (uri, token, videoPath) => {
  const size = fs.statSync(videoPath).size;
  log(`instagram: uploading ${(size / 1e6).toFixed(1)} MB directly`);
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(uri, {
        method: "POST",
        headers: { Authorization: `OAuth ${token}`, offset: "0", file_size: String(size), "Content-Type": "application/octet-stream" },
        body: fs.readFileSync(videoPath),
        signal: AbortSignal.timeout(10 * 60 * 1000),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success !== false && !json.error) return;
      const msg = `upload -> ${res.status}: ${JSON.stringify(json.debug_info ?? json.error ?? json).slice(0, 300)}`;
      if (res.status < 500 || attempt === 3) throw new Error(msg);
      log(`  temporary upload error, retrying: ${msg}`);
    } catch (e) {
      if (attempt === 3 || /-> [1-4]\d\d:/.test(e.message)) throw e;
      log(`  upload interrupted, retrying: ${e.message.slice(0, 160)}`);
    }
    await sleep(5000 * attempt);
  }
};

// Waits until Instagram has processed the container's video.
const waitUntilReady = async (token, containerId) => {
  log("instagram: waiting while Instagram processes the video");
  const deadline = Date.now() + 20 * 60 * 1000;
  let status;
  while (Date.now() < deadline) {
    await sleep(15000);
    status = await call("GET", `${BASE}/${containerId}?fields=status_code,status`, token);
    log(`  status: ${status.status_code}`);
    if (status.status_code === "FINISHED") return;
    if (status.status_code === "ERROR" || status.status_code === "EXPIRED")
      throw new Error(`Instagram could not process the video: ${status.status ?? status.status_code}`);
  }
  throw new Error("Timed out waiting for Instagram to process the video");
};

// Makes a processed Reel container, either from a local file (videoPath, direct upload) or from a
// public link (videoUrl). Returns the container ID; nothing is published yet.
// trialGraduation: "SS_PERFORMANCE" (auto-share to followers if it does well) or "MANUAL" makes it a trial reel.
export const prepareReel = async ({ token, userId, videoPath, videoUrl, ...opts }) => {
  const form = containerForm(opts);
  log(`instagram: creating the ${opts.trialGraduation ? "trial " : ""}reel container (${videoUrl ? "from a link" : "direct upload"})`);
  let container;
  if (videoUrl) container = await call("POST", `${BASE}/${userId}/media`, token, { ...form, video_url: videoUrl });
  else {
    container = await call("POST", `${BASE}/${userId}/media`, token, { ...form, upload_type: "resumable" });
    const version = /\/v[\d.]+$/.exec(BASE)?.[0] ?? "";
    await uploadBytes(container.uri ?? `https://rupload.facebook.com/ig-api-upload${version}/${container.id}`, token, videoPath);
  }
  await waitUntilReady(token, container.id);
  return container.id;
};

export const publishContainer = async ({ token, userId, containerId }) => {
  log("instagram: publishing");
  const published = await call("POST", `${BASE}/${userId}/media_publish`, token, { creation_id: containerId });
  const media = await call("GET", `${BASE}/${published.id}?fields=permalink,timestamp`, token).catch(() => ({}));
  return { mediaId: published.id, permalink: media.permalink ?? null, containerId };
};

export const tokenFileExists = () => fs.existsSync(TOKEN_FILE);
