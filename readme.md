# pocket-random (demo)
隨機挑選出 [Pocket](https://getpocket.com/) 中的文章，不用再花時間自己挑。

技術的知識太廣太雜，或許持續的觀看相關知識，可以持續的激發腦內相關知識的網路，持續進步，甚至避免遺忘。一種**隨機練習**的概念。

## Feature
- 設定每日目標篇數
- 透過 **標籤 (tag)** 篩選出你要的文章

## 前端技術說明
- 使用 `Vue-router`、Single File Component
- 使用 `webpack` 打包，環境模擬 `Vue-cli`，可直接移植到 CLI 環境
- `SCSS` & BEM

`/src` : source 檔案目錄

`/dist/app.html`: 應用程式頁面，引入打包好的檔案

`/dist/public` : publicPath，同時是 express 的 staticPath。

## Future
- 一星期每天可設定不同閱讀規劃
- 閱讀成就圖表化