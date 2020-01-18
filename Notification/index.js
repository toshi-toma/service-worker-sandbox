const getNotificationPermission = () => {
  if (!("Notification" in window)) {
    return "unsupported";
  } else if (Notification.permission === "granted") {
    return "granted";
  } else if (Notification.permission === "denied") {
    return "denied";
  } else {
    return "default";
  }
};

const updatePermissionStatus = () => {
  const statusEl = document.getElementById("status");
  const status = getNotificationPermission();
  if (status === "unsupported") {
    statusEl.innerHTML = "Notification APIがサポートされていません";
  } else if (status === "granted") {
    statusEl.innerHTML = "通知が許可されています";
  } else {
    statusEl.innerHTML = "通知が許可されていません";
  }
};

const updateInfo = info => {
  const statusEl = document.getElementById("info");
  statusEl.innerHTML = info;
};

const notify = () => {
  const n = new Notification("Hello!", {
    body: "This is Body",
    icon: "../assets/ehimejs-logo.png"
  });
  n.onclick = function() {
    updateInfo("通知がクリックされました");
  };
  updatePermissionStatus();
  updateInfo("通知を送信しました");
  return n;
};

const notifyMe = () => {
  const status = getNotificationPermission();
  if (status === "unsupported") {
    alert("This browser does not support desktop notification");
  } else if (status === "granted") {
    notify();
  } else if (status !== "denied") {
    Notification.requestPermission(permission => {
      if (permission === "granted") {
        notify();
      }
    });
    updateInfo("ブラウザが通知をリクエストしました");
  }
};

const notifyMeEvery = () => {
  const status = getNotificationPermission();
  if (status === "unsupported") {
    alert("This browser does not support desktop notification");
  } else if (status === "granted") {
    setInterval(notify, 5000);
  } else if (status !== "denied") {
    Notification.requestPermission(permission => {
      if (permission === "granted") {
        setInterval(notify, 5000);
      }
    });
    updateInfo("ブラウザが通知をリクエストしました");
  }
};

window.notifyMe = notifyMe;
window.notifyMeEvery = notifyMeEvery;

updatePermissionStatus();
