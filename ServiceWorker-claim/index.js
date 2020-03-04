document.getElementById("fetchBtn").addEventListener("click", () => {
  fetch("/test");
});

const controllerChangePromise = new Promise(resolve => {
  navigator.serviceWorker.addEventListener("controllerchange", e => {
    console.log("controllerchange", e);
    resolve(navigator.serviceWorker.controller);
  });
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then(
      registration => {
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
    .then(() => {
      if (navigator.serviceWorker.controller) {
        return navigator.serviceWorker.controller;
      }
      return controllerChangePromise;
    })
    .then(controller => {
      console.log("controller", controller);
      fetch("/test");
    });
}

setInterval(() => {
  const controller = navigator.serviceWorker.controller;
  const infoEl = document.getElementById("info");
  if (controller === null) {
    infoEl.innerHTML = `Controllerが存在しません`;
    console.log("controller:", controller);
  } else {
    infoEl.innerHTML = `Controllerが存在します`;
    console.log("controller:", controller);
  }
}, 5000);
