import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function load(sourcePath, context) {
  vm.runInContext(
    fs.readFileSync(path.join(root, sourcePath), "utf8"),
    context,
    { filename: sourcePath },
  );
}

test("114 年 43 題均匯入官方試題分析的鑑別度", () => {
  const context = vm.createContext({ window: { BANK: [] } });
  load("data/q114.js", context);
  load("data/discriminations.js", context);

  const questions = context.window.BANK[0].questions;
  assert.equal(questions.length, 43);
  assert.equal(questions.filter(question => Number.isFinite(question.disc)).length, 43);
  assert.equal(questions[0].disc, 0.55);
  assert.equal(questions[13].disc, 0.31);
  assert.equal(questions[42].disc, 0.60);
  assert.match(questions[0].discSource.label, /114P英語（閱讀）試題分析/);
});
