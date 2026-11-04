// Publishes a local MP4 as an Instagram Reel through the official Instagram Graph API
// (Instagram API with Facebook Login, resumable upload — no public video hosting needed).
//
// Needs env: IG_USER_ID (Instagram professional account ID), IG_ACCESS_TOKEN
// (token with instagram_basic + instagram_content_publish + pages_show_list +
// pages_read_engagement). Optional IG_GRAPH_VERSION (default v26.0).
//
// CLI: node pipeline/publish.mjs path/to/reel.mp4 "caption text"
import fs from "node:fs";
import path from "node:path";
import { log, ROOT } from "./lib.mjs";

const VERSION = () => process.env.IG_GRAPH_VERSION || "v26.0";
const GRAPH = () => `${process.env.IG_GRAPH_BASE_URL || "https://graph.facebook.com"}/${VERSION()}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const env = () => {
  const userId = process.env.IG_USER_ID;
  const token = process.env.IG_ACCESS_TOKEN;
  if (!userId || !token) throw new Error("IG_USER_ID and IG_ACCESS_TOKEN must be set");
  return { userId, token };
};

const graph = async (method, url, { token, form, headers, body } = {}) => {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `OAuth ${token}`, ...(form ? { "Content-Type": "application/x-www-form-urlencoded" } : {}), ...headers },
        body: form ? new URLSearchParams(form) : body,
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && !json.error) return json;
      const err = json.error ?? json.debug_info ?? json;
      const transient = res.status >= 500 || err?.is_transient || err?.retriable;
      const msg = `${method} ${url.replace(/access_token=[^&]+/, "")} -> ${res.status}: ${JSON.stringify(err)}`;
      if (!transient || attempt === 3) throw new Error(msg);
      log(`  transient error, retrying: ${msg}`);
    } catch (e) {
      if (attempt === 3 || !(e instanceof TypeError)) throw e; // TypeError = network failure
      log(`  network error, retrying: ${e.message}`);
    }
    await sleep(5000 * attempt);
  }
};

export const publishingQuota = async () => {
  const { userId, token } = env();
  const r = await graph("GET", `${GRAPH()}/${userId}/content_publishing_limit?fields=quota_usage,config`, { token });
  return r.data?.[0];
};

export const publishReel = async ({ videoPath, caption, aiLabel = true, thumbOffsetMs = 1500 }) => {
  const { userId, token } = env();
  const size = fs.statSync(videoPath).size;

  // 1. Create a resumable upload container.
  log("instagram: creating container");
  const container = await graph("POST", `${GRAPH()}/${userId}/media`, {
    token,
    form: {
      media_type: "REELS",
      upload_type: "resumable",
      caption,
      thumb_offset: String(thumbOffsetMs),
    },
  });
  const uploadUri = container.uri ?? `https://rupload.facebook.com/ig-api-upload/${VERSION()}/${container.id}`;

  // 2. Upload the file bytes.
  log(`instagram: uploading ${(size / 1024 / 1024).toFixed(1)} MB`);
  await graph("POST", uploadUri, {
    token,
    headers: { offset: "0", file_size: String(size) },
    body: fs.readFileSync(videoPath),
  });

  // 3. Wait for Instagram to finish processing.
  const deadline = Date.now() + 15 * 60 * 1000;
  let status;
  while (Date.now() < deadline) {
    status = await graph("GET", `${GRAPH()}/${container.id}?fields=status_code,status`, { token });
    if (status.status_code === "FINISHED") break;
    if (status.status_code === "ERROR" || status.status_code === "EXPIRED") {
      throw new Error(`Instagram could not process the video: ${status.status ?? status.status_code}`);
    }
    await sleep(8000);
  }
  if (status?.status_code !== "FINISHED") throw new Error("Timed out waiting for Instagram to process the video");

  // 4. Publish.
  log("instagram: publishing");
  const published = await graph("POST", `${GRAPH()}/${userId}/media_publish`, { token, form: { creation_id: container.id } });
  const media = await graph("GET", `${GRAPH()}/${published.id}?fields=permalink,shortcode,timestamp`, { token }).catch(() => ({}));
  return { mediaId: published.id, permalink: media.permalink ?? null, containerId: container.id };
};

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    process.loadEnvFile(path.join(ROOT, ".env"));
  } catch {}
  const [video, caption = ""] = process.argv.slice(2);
  if (!video) {
    console.log("usage: node pipeline/publish.mjs reel.mp4 \"caption\"");
    process.exit(1);
  }
  console.log(await publishReel({ videoPath: video, caption }));
}
