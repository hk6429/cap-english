import assert from "node:assert/strict";
import test from "node:test";

await import("../js/report-client.js");
const report = globalThis.CAP_ENGLISH_REPORT;
const { formatMessage } = await import("../api/report.js");

test("回報用戶端只送出允許欄位並限制文字長度", () => {
  const payload = report.buildPayload({
    questionId: "CAP114-1",
    year: 114,
    sitting: "",
    era: "CAP",
    no: 1,
    category: "Bc",
    stem: "題幹".repeat(300),
    answer: "A",
    picked: "B",
    issueType: "解析不清楚",
    note: "說明".repeat(400),
    url: "https://cap-english.pages.dev/",
    unexpected: "不應送出"
  });

  assert.equal(payload.questionId, "CAP114-1");
  assert.equal(payload.stem.length, 500);
  assert.equal(payload.note.length, 800);
  assert.equal("unexpected" in payload, false);
});

test("跨網域版本統一送往 Vercel 回報 API", () => {
  assert.equal(report.endpoint({ hostname: "cap-english-chi.vercel.app" }), "/api/report");
  assert.equal(
    report.endpoint({ hostname: "cap-english.pages.dev" }),
    "https://cap-english-chi.vercel.app/api/report"
  );
});

test("Telegram 訊息包含可定位題目的必要欄位", () => {
  const message = formatMessage({
    questionId: "CAP114-1",
    year: "114",
    sitting: "",
    era: "CAP",
    no: "1",
    category: "Bc",
    stem: "What does it mean?",
    answer: "A",
    picked: "B",
    issueType: "解析不清楚",
    note: "請補充 B 為何錯。",
    url: "https://cap-english.pages.dev/"
  });

  assert.match(message, /CAP114-1/);
  assert.match(message, /114 年/);
  assert.match(message, /學生選擇：B/);
  assert.match(message, /請補充 B 為何錯/);
});
