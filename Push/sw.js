self.addEventListener("install", event => {
  console.log(event);
});

self.addEventListener("push", event => {
  console.log("[Service Worker] Push Received.");
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  const title = "Hello Push";
  const options = {
    body: "this is body",
    icon: "../assets/ehimejs-logo.png"
  };
  const notificationPromise = self.registration.showNotification(title, options);
  event.waitUntil(notificationPromise);
});

self.addEventListener("notificationclick", event => {
  console.log('[Service Worker] Notification click Received.');
  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://ehimejs.connpass.com/')
  );
})
