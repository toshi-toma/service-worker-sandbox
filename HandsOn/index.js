console.log("index.js");

window.addEventListener("load", async () => {
  const serviceWorkerRegistration = await navigator.serviceWorker.register(
    "sw.js"
  );
  console.log("Service Workerが登録されました");
  console.log("ServiceWorkerRegistration", serviceWorkerRegistration);
});
