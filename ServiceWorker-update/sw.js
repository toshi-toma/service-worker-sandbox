const ver = 2;
self.addEventListener("install", e => {
  console.log("install", ver, e);
  e.waitUntil(skipWaiting());
});
self.addEventListener("activate", e => {
  console.log("activate", ver, e);
  console.log("sw.js", self.registration);
  e.waitUntil(self.clients.claim());
});
self.addEventListener("push", e => {
  self.registration.update();
});
