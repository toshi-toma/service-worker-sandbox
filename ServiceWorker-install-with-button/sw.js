self.addEventListener("install", event => {
  console.log(event);
  console.log("install sw v1");
  event.waitUntil(self.skipWaiting());
});
