# 英語閱讀練功房

國中基測與教育會考英語科（閱讀）歷屆試題分類練習網站。支援跨年份／場次複選、整回模考、難度與鑑別度篩選、逐題解析、四選項作答分布、錯題本及教師出卷。

## 本機執行

本站為靜態網站，可用任一靜態伺服器開啟專案根目錄。

```sh
npx serve .
```

## 測試

```sh
node --test test/*.test.mjs
```

## 題目問題回報

每題解析下方可由學生主動回報題目、圖片或解析問題。前端統一將回報送到 Vercel Function `api/report.js`，再由後端轉送 Telegram；Bot Token 不會出現在瀏覽器端。

Vercel 專案需設定：

- `TELEGRAM_BOT_TOKEN`：Telegram Bot Token。
- `TELEGRAM_CHAT_ID`：接收題目回報的聊天室 ID。
- `REPORT_ALLOWED_ORIGINS`：額外允許的來源網域，以逗號分隔；既有三個正式站已內建允許清單。

## 部署

正式站同步部署至 Vercel、Netlify 與 Cloudflare Pages。部署前須先通過完整測試，並從已推送至 GitHub 的同一個 commit 建立部署。

## 資料來源

題目與答案來自國中基測及國中教育會考公開試題；逐題統計以可核對的正式試題分析資料為準，缺少來源的年份不自行推算。
