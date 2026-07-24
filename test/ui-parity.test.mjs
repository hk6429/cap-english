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
