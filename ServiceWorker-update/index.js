if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then(
      registration => {
        registration.addEventListener("updatefound", e => {
          console.log("updatefound", e);
        });
        console.log("index.js", registration);
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
        const infoEl = document.getElementById("info");
        infoEl.innerHTML = "ServiceWorkerの登録が成功しました";
        return navigator.serviceWorker.ready;
      },
      err => {
        console.log("ServiceWorker registration failed: ", err);
        const infoEl = document.getElementById("info");
        infoEl.innerHTML = "ServiceWorkerの登録が失敗しました";
      }
    )
    .then(() => {});
}
