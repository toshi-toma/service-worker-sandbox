const applicationServerPublicKey = "";

const urlB64ToUint8Array = base64String => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const updateSubscriptionOnServer = swRegistration => {
  console.log(swRegistration);
  const infoEl = document.getElementById("sw-info");
  if (swRegistration) {
    infoEl.innerHTML = JSON.stringify(swRegistration);
  } else {
    infoEl.innerHTML = "";
  }
};

const subscribeUser = swRegistration => {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(function(subscription) {
      console.log("User is subscribed:");
      updateSubscriptionOnServer(subscription);
      updateBtn(swRegistration, true);
    })
    .catch(function(err) {
      console.log("Failed to subscribe the user: ", err);
      updateBtn(swRegistration, false);
    });
};

const unsubscribeUser = swRegistration => {
  swRegistration.pushManager
    .getSubscription()
    .then(function(subscription) {
      if (subscription) {
        return subscription.unsubscribe();
      }
    })
    .catch(function(error) {
      console.log("Error unsubscribing", error);
    })
    .then(function() {
      updateSubscriptionOnServer(null);

      console.log("User is unsubscribed.");
      isSubscribed = false;

      updateBtn(swRegistration, false);
    });
};

const updateBtn = (swRegistration, isSubscribed) => {
  const infoEl = document.getElementById("info");
  const enablePushMsgBtn = document.getElementById("enablePushMsgBtn");
  if (isSubscribed) {
    infoEl.innerHTML = "Push Messagingが有効です";
    enablePushMsgBtn.innerHTML = "Disenable push Messaging";
  } else {
    infoEl.innerHTML = "Push Messagingは無効です";
    enablePushMsgBtn.innerHTML = "Enable push Messaging";
  }
  if (Notification.permission === "denied") {
    enablePushMsgBtn.disabled = true;
    infoEl.innerHTML = "通知が許可されていません";
  } else {
    enablePushMsgBtn.disabled = false;
    enablePushMsgBtn.addEventListener("click", () => {
      enablePushMsgBtn.disabled = true;
      if (isSubscribed) {
        unsubscribeUser(swRegistration);
      } else {
        subscribeUser(swRegistration);
      }
    });
  }
};

const initialiseUI = swRegistration => {
  swRegistration.pushManager.getSubscription().then(subscription => {
    const isSubscribed = !(subscription === null);

    updateSubscriptionOnServer(subscription);

    if (isSubscribed) {
      console.log("User IS subscribed.");
    } else {
      console.log("User is NOT subscribed.");
    }
    updateBtn(swRegistration, isSubscribed);
  });
};

if ("serviceWorker" in navigator && "PushManager" in window) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").then(
      registration => {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
        const infoEl = document.getElementById("info");
        infoEl.innerHTML = "ServiceWorkerの登録が成功しました";
        initialiseUI(registration);
      },
      err => {
        console.log("ServiceWorker registration failed: ", err);
        const infoEl = document.getElementById("info");
        infoEl.innerHTML = "ServiceWorkerの登録が失敗しました";
      }
    );
  });
}
