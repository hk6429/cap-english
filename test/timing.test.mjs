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

test("計時依各年度實際題數換算每題作答時間", () => {
  const context = vm.createContext({ window: { BANK: [] } });
  for (const year of [103, 105, 114]) load(`data/q${year}.js`, context);
  load("data/timing.js", context);

  const all = context.window.BANK.flatMap(bank =>
    bank.questions.map(question => ({
      ...question,
      year: bank.year,
      era: bank.era,
      sitting: bank.sitting,
    })),
  );
  const timing = context.window.CAP_ENGLISH_TIMING;
  const question = year => all.find(item => item.year === year);

  assert.equal(timing.bankQuestionCount(question(103), all), 40);
  assert.equal(timing.secondsPerQuestion(question(103), all), 90);
  assert.equal(timing.bankQuestionCount(question(105), all), 41);
  assert.equal(timing.secondsPerQuestion(question(105), all).toFixed(1), "87.8");
  assert.equal(timing.bankQuestionCount(question(114), all), 43);
  assert.equal(timing.secondsPerQuestion(question(114), all).toFixed(1), "83.7");
  assert.equal(timing.totalSeconds([question(103), question(114)], all), 174);
});
