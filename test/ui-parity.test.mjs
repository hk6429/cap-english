import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("首頁提供與國文、社會題庫一致的十題練習入口", () => {
  assert.match(html, /id="numInput"[^>]*value="10"/);
});

test("首頁提供計時、難度排序與排行榜操作", () => {
  for (const id of ["timedChk", "diffSortChk", "rankBtn", "rankPanel"]) {
    assert.match(html, new RegExp(`id="${id}"`), `缺少 #${id}`);
  }
  assert.match(html, /id="timingHint"/);
  assert.match(html, /CAP_ENGLISH_TIMING\.totalSeconds\(current, ALL\)/);
});

test("一般練習可複選年份／場次，整回模考保留單選", () => {
  for (const id of ["bankPicker", "bankOptions", "mockBankSel"]) {
    assert.match(html, new RegExp(`id="${id}"`), `缺少 #${id}`);
  }
  assert.match(html, /className = "bankChk"/);
  assert.match(html, /data-bank-preset="cap"/);
  assert.match(html, /data-bank-preset="bctest"/);
  assert.doesNotMatch(html, /id="bankSel"/);
});

test("首頁與排行榜均提供鑑別度篩選及排序", () => {
  for (const id of ["discSel", "rankDiscSel"]) {
    assert.match(html, new RegExp(`id="${id}"`), `缺少 #${id}`);
  }
  assert.match(html, /value="disc10"/);
  assert.match(html, /value="discLow10"/);
  assert.match(html, /鑑別度 \$\{q\.disc\.toFixed\(2\)\}/);
});

test("難度排行榜可依通過率與待加強組誘答差選題", () => {
  assert.match(html, /value="hard10"/);
  assert.match(html, /value="easy10"/);
  assert.match(html, /value="lowLure"/);
  assert.match(html, /id="rankPracticeBtn"/);
});

test("解析區可切換全體與待加強組，並顯示最大誘答差", () => {
  assert.match(html, /data-opt-group="all"/);
  assert.match(html, /data-opt-group="low"/);
  assert.match(html, /待加強組有 \$\{lure\.low\.toFixed\(1\)\}%/);
  assert.match(html, /這題的關鍵迷思在/);
});

test("每題解析提供 Telegram 教師回報表單", () => {
  assert.match(html, /class="report-toggle"/);
  assert.match(html, /data-report-qid="\$\{q\.id\}"/);
  assert.match(html, /class="report-form"/);
  assert.match(html, /js\/report-client\.js/);
  assert.match(html, /CAP_ENGLISH_REPORT\.submit/);
});

test("題庫資料帶版本參數，避免部署後仍讀到舊解析快取", () => {
  assert.match(html, /data\/q90-1\.js\?v=40029c2/);
  assert.match(html, /data\/q114\.js\?v=40029c2/);
  assert.match(html, /data\/answer-distributions\.js\?v=40029c2/);
});
