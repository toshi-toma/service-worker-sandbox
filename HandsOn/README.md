# Service Workerハンズオン

## 作るもの

- キャッシュの活用
  - HTMLとCSS, JS, 画像を用意
  - 各リソースをキャッシュしてオフラインでも動作可能にする
- PWAとしてインストール

## 用意するもの

- エディタ
  - デモではVSCodeを利用
- ローカルサーバー
  - デモではVSCode拡張の「Live Server」を利用
    - https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer
  - 他にはWeb Server for Chromeも簡単
    - https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb?hl=ja

## 1. HTML/CSS/JSを用意

- index.htmlを作成して以下を用意。`icon.png`を利用しているが、好きなもので良い。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Service Workerハンズオン</title>
  <link rel="stylesheet" href="index.css">
</head>
<body>
  <h1>Service Workerハンズオン</h1>
  <img src="./icon.png" width="300px" height="100px">
  <img src="./icon.png" width="300px" height="100px">
  <img src="./icon.png" width="300px" height="100px">
  <img src="./icon.png" width="300px" height="100px">
  <script src="index.js"></script>
</body>
</html>
```

- index.cssを作成して以下を用意

```css
body {
  background-color: black;
  color: white;
}
```

- index.jsを作成して以下を用意

```js
console.log("index.js");
```

## 2. SWスクリプトの用意

- sw.jsを作成して以下を用意

```js
console.log("sw.js");
```

## 3. SWを登録

- index.jsで以下のように`navigator.serviceWorker.register(“sw.js”);`と書くとService Workerが登録できる

```js
console.log("index.js");

window.addEventListener("load", async () => {
  const serviceWorkerRegistration = await navigator.serviceWorker.register(
    "sw.js"
  );
  console.log("Service Workerが登録されました");
  console.log("ServiceWorkerRegistration", serviceWorkerRegistration);
});
```

## 4. キャッシュを登録する

- sw.jsで`install`イベントが発火するタイミングでリソースをキャッシュする
- caches.open()でCacheインスタンスを取得して、cache.addAll()でリソースをキャッシュに追加
- installイベントのコールバックで取得できるevent.waitUntil()でキャッシュが完了するまで待つようにする

```js
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
```

## 5. キャッシュから返す

- sw.jsでfetchイベントが発火するタイミングでリクエストをキャッシュから返す
- caches.match()でCache済みのオブジェクトを取得。Cacheされてないリクエストであれば、undefinedが返ってくる
- Cacheオブジェクトがあれば、そのまま返す。無ければfetchする
- fetchイベントのコールバックで取得できるevent.waitUntil()でfetchイベントの終了を待つようにする

```js
console.log("sw.js");

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

```

## リソースをキャッシュしてSWから返すようにしたのでオフラインでも動作するようになった🎉

## 6. manifest.jsonを用意する

- PWAとしてインストールできるように、mafifest.jsonを用意
- short_name, name, display, start_url, iconsを適当に設定する

```json
{
  "short_name": "SW",
  "name": "SW sample app",
  "display": "standalone",
  "start_url": "index.html",
  "icons": [
      {
          "src": "icon.png",
          "sizes": "256x256",
          "type": "image/png"
      }
  ]
}
```

## 7. manifest.jsonをHTMLで読み込む

- SWがインストールされていれば、HTMLでmanifest.jsonを読み込めばPWAとしてインストール可能

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Service Workerハンズオン</title>
  <link rel="stylesheet" href="index.css">
  <link rel="manifest" href="manifest.json">
</head>
<body>
  <h1>Service Workerハンズオン</h1>
  <img src="./icon.png" width="300px" height="100px">
  <img src="./icon.png" width="300px" height="100px">
  <img src="./icon.png" width="300px" height="100px">
  <img src="./icon.png" width="300px" height="100px">
  <script src="index.js"></script>
</body>
</html>
```

## PWAとしてインストールできるようになった！🎉

# 最終的な状態

`index.html`

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Service Workerハンズオン</title>
  <link rel="stylesheet" href="index.css">
  <link rel="manifest" href="manifest.json">
</head>
<body>
  <h1>Service Workerハンズオン</h1>
  <img src="./icon.png" width="300px" height="100px">
  <img src="./icon.png" width="300px" height="100px">
  <img src="./icon.png" width="300px" height="100px">
  <img src="./icon.png" width="300px" height="100px">
  <script src="index.js"></script>
</body>
</html>
```

`index.css`

```css
body {
  background-color: black;
  color: white;
}
```

`index.js`

```js
console.log("index.js");

window.addEventListener("load", async () => {
  const serviceWorkerRegistration = await navigator.serviceWorker.register(
    "sw.js"
  );
  console.log("Service Workerが登録されました");
  console.log("ServiceWorkerRegistration", serviceWorkerRegistration);
});

```

`sw.js`

```js
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

```

`manifest.json`

```json
{
  "short_name": "SW",
  "name": "SW sample app",
  "display": "standalone",
  "start_url": "index.html",
  "icons": [
      {
          "src": "icon.png",
          "sizes": "256x256",
          "type": "image/png"
      }
  ]
}
```