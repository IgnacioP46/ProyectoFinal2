import { Router } from "express";
import ogs from "open-graph-scraper";
// Con Node 18+ ya tienes fetch global; si prefieres:
// import { fetch } from "undici";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const pageUrl = req.query.url;
    if (!pageUrl) return res.status(400).send("Missing url");

    const { result } = await ogs({ url: pageUrl, timeout: { request: 8000 } });
    const og = result?.ogImage;
    const imgUrl = Array.isArray(og) ? og[0]?.url : (og?.url || og);
    if (!imgUrl) return res.status(404).send("No og:image found");

    const r = await fetch(imgUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "image/*,*/*;q=0.8",
        "Referer": new URL(pageUrl).origin,
      },
    });
    if (!r.ok) return res.status(502).send("Failed to fetch image");

    res.setHeader("Content-Type", r.headers.get("content-type") || "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=86400");
    const ab = await r.arrayBuffer();
    res.end(Buffer.from(ab));
  } catch (e) {
    console.error("cover proxy error:", e);
    res.status(500).send("Internal Server Error");
  }
});

export default router; // 👈 FALTABA ESTO
