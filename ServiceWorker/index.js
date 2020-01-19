if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").then(
      registration => {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
        const infoEl = document.getElementById('info');
        infoEl.innerHTML = "ServiceWorkerの登録が成功しました"
      },
      err => {
        console.log("ServiceWorker registration failed: ", err);
        const infoEl = document.getElementById('info');
        infoEl.innerHTML = "ServiceWorkerの登録が失敗しました"
      }
    );
  });
}
