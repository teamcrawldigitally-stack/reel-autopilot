// Instagram API with Instagram Login (host graph.instagram.com): token handling and Reel publishing
// from a public video URL. Free; needs a token with instagram_business_basic +
// instagram_business_content_publish, generated once in the Meta App Dashboard.
//
// Env: IG_ACCESS_TOKEN (the token from the dashboard), TOKEN_KEY (any long random sentence; used to
// encrypt the renewed token that gets saved in state/, because Instagram tokens expire after 60 days).
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { log, readJson, ROOT, writeJson } from "./lib.mjs";

const VERSION = process.env.IG_GRAPH_VERSION || "v26.0";
const BASE = `${process.env.IG_GRAPH_BASE_URL || "https://graph.instagram.com"}/${VERSION}`;
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
  if (saved && key && saved.secretId === secretId) {
    try {
      return { token: decrypt(saved.box, key), refreshedAt: saved.refreshedAt, secretId };
    } catch {
      log("saved token could not be unlocked (TOKEN_KEY changed?), using the secret");
    }
  }
  return { token: secret, refreshedAt: null, secretId };
};

// Renews the 60-day token every few days. Needs the token to be at least 24 h old; failures are only logged.
export const refreshTokenIfDue = async (t) => {
  const key = process.env.TOKEN_KEY;
  if (!key) {
    log("TOKEN_KEY not set: token will not be renewed automatically (it expires 60 days after it was made)");
    return t;
  }
  const ageDays = t.refreshedAt ? (Date.now() - Date.parse(t.refreshedAt)) / 864e5 : Infinity;
  if (ageDays < REFRESH_EVERY_DAYS) return t;
  try {
    const r = await call("GET", `${BASE.replace(/\/v[\d.]+$/, "")}/refresh_access_token?grant_type=ig_refresh_token`, t.token);
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

export const account = (token) => call("GET", `${BASE}/me?fields=user_id,username,account_type,media_count`, token);
export const publishingQuota = (token, userId) =>
  call("GET", `${BASE}/${userId}/content_publishing_limit?fields=quota_usage,config`, token).then((r) => r.data?.[0] ?? null);
export const recentMedia = (token, userId) =>
  call("GET", `${BASE}/${userId}/media?fields=id,caption,timestamp,permalink&limit=10`, token).then((r) => r.data ?? []);

// Creates the Reel container from a public URL, waits for Instagram to fetch + process it, publishes.
export const publishReelFromUrl = async ({ token, userId, videoUrl, caption, shareToFeed = true, thumbOffsetMs, audioName }) => {
  log("instagram: creating the reel container");
  const form = { media_type: "REELS", video_url: videoUrl, caption, share_to_feed: String(shareToFeed) };
  if (thumbOffsetMs != null) form.thumb_offset = String(thumbOffsetMs);
  if (audioName) form.audio_name = audioName;
  const container = await call("POST", `${BASE}/${userId}/media`, token, form);

  log("instagram: waiting while Instagram downloads and processes the video");
  const deadline = Date.now() + 20 * 60 * 1000;
  let status;
  while (Date.now() < deadline) {
    await sleep(15000);
    status = await call("GET", `${BASE}/${container.id}?fields=status_code,status`, token);
    log(`  status: ${status.status_code}`);
    if (status.status_code === "FINISHED") break;
    if (status.status_code === "ERROR" || status.status_code === "EXPIRED")
      throw new Error(`Instagram could not process the video: ${status.status ?? status.status_code}`);
  }
  if (status?.status_code !== "FINISHED") throw new Error("Timed out waiting for Instagram to process the video");

  log("instagram: publishing");
  const published = await call("POST", `${BASE}/${userId}/media_publish`, token, { creation_id: container.id });
  const media = await call("GET", `${BASE}/${published.id}?fields=permalink,timestamp`, token).catch(() => ({}));
  return { mediaId: published.id, permalink: media.permalink ?? null, containerId: container.id };
};

export const tokenFileExists = () => fs.existsSync(TOKEN_FILE);
