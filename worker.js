const ORIGIN = "https://codex-textbook-mochimochi.mochilabo2026.chatgpt.site";
export default {
  async fetch(request) {
    const incoming = new URL(request.url);
    const target = new URL(incoming.pathname + incoming.search, ORIGIN);
    const headers = new Headers(request.headers);
    headers.set("host", target.host);
    const response = await fetch(new Request(target, {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
      redirect: "manual"
    }));
    const outgoing = new Headers(response.headers);
    const location = outgoing.get("location");
    if (location && location.startsWith(ORIGIN)) {
      outgoing.set("location", location.slice(ORIGIN.length) || "/");
    }
    return new Response(response.body, { status: response.status, headers: outgoing });
  }
};
