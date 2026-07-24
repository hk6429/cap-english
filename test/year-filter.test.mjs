import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

const context = vm.createContext({ window: {} });
vm.runInContext(
  fs.readFileSync(new URL("../js/year-filter.js", import.meta.url), "utf8"),
  context,
);

test("年份／場次篩選會合併所有勾選項目", () => {
  const filter = context.window.CAP_YEAR_FILTER;
  const selected = filter.selectedValues([
    { value: "會考114", checked: true },
    { value: "基測100-2", checked: true },
    { value: "會考103", checked: false },
  ]);

  assert.deepEqual([...selected], ["會考114", "基測100-2"]);
  assert.equal(filter.matches("會考114", selected), true);
  assert.equal(filter.matches("基測100-2", selected), true);
  assert.equal(filter.matches("會考103", selected), false);
});

test("年份摘要能區分全部、未選與複選", () => {
  const filter = context.window.CAP_YEAR_FILTER;
  const labels = new Map([["114", "114 年"], ["103", "103 年"]]);

  assert.equal(filter.summary(new Set(["114", "103"]), 2, labels), "全部 2 個年份／場次");
  assert.equal(filter.summary(new Set(), 2, labels), "未選年份／場次");
  assert.equal(filter.summary(new Set(["114"]), 2, labels), "114 年");
});
