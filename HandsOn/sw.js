console.log("sw.js");
const urlsToCache = [
  "./index.html",
  "./index.css",
  "./index.js",
  "./icon.png",
];
self.addEventListener("install", (event) => {
  console.log("Service Workerがインストールされた(oninstall)");
  console.log("CacheStorage APIでリソースをキャッシュします");
  event.waitUntil(
    caches.open("v1").then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", () => {
  console.log("Service Workerがアクティブになった(onactive)");
});

self.addEventListener("fetch", (event) => {
  console.log("FetchEvent、つまりリクエストが発行された(onfetch)");
  event.respondWith(
    caches.match(event.request).then((response) => {
      console.log(
        "Cache済みであればCacheオブジェクト、無ければundefinedが入る",
        response
      );
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
