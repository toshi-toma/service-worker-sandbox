self.addEventListener("activate", e => {
  console.log("activate", e);
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", e => {
  console.log("onfetch")
  let path = new URL(e.request.url).pathname;
  console.log(path);
  if (path === "/test") {
    e.respondWith(new Response("test"));
  }
  // fallback
  return;
});
