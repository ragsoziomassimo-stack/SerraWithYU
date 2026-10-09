import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

// Proxy per l'immagine della maschera VEGA — bypassa CORS del CDN
http.route({
  path: "/proxy-image",
  method: "GET",
  handler: httpAction(async (_ctx, request) => {
    const url = new URL(request.url);
    const src = url.searchParams.get("src");
    if (!src) {
      return new Response("Missing src param", { status: 400 });
    }
    // Permetti solo immagini dal nostro CDN
    if (!src.startsWith("https://hercules-cdn.com/")) {
      return new Response("Forbidden", { status: 403 });
    }
    const upstream = await fetch(src);
    if (!upstream.ok) {
      return new Response("Upstream error", { status: 502 });
    }
    const blob = await upstream.blob();
    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") ?? "image/jpeg",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }),
});

export default http;
