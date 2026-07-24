import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const context = vm.createContext({ window: { BANK: [] } });
const dataFiles = fs.readdirSync(path.join(root, "data"))
  .filter(name => /^q\d+(?:-\d)?\.js$/.test(name))
  .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

for (const name of dataFiles) {
  vm.runInContext(fs.readFileSync(path.join(root, "data", name), "utf8"), context, { filename: name });
}
vm.runInContext(
  fs.readFileSync(path.join(root, "data", "answer-distributions.js"), "utf8"),
  context,
  { filename: "answer-distributions.js" },
);

const questions = context.window.BANK.flatMap(bank =>
  bank.questions.map(question => ({ ...question, year: bank.year, sitting: bank.sitting })),
);

test("1620 題都有學生版解題關鍵與 A-D 四選項辨析", () => {
  const missing = questions.filter(question => {
    const explanation = String(question.explain || "");
    return !explanation.includes("解題關鍵")
      || ["A", "B", "C", "D"].some(key => !new RegExp(`[（(]${key}[）)]`).test(explanation));
  });
  assert.equal(missing.length, 0, `缺完整解析 ${missing.length} 題，例如：${missing.slice(0, 12).map(q => `${q.year}-${q.no}`).join("、")}`);
});

test("每題解析列出四個選項原文", () => {
  const incomplete = questions.filter(question => {
    const explanation = String(question.explain || "").replaceAll("&amp;", "&");
    return ["A", "B", "C", "D"].some(key =>
      !explanation.includes(String(question.options?.[key] || "")),
    );
  });
  assert.equal(
    incomplete.length,
    0,
    `仍有 ${incomplete.length} 題未列出完整選項原文，例如：${incomplete.slice(0, 12).map(q => `${q.year}-${q.no}`).join("、")}`,
  );
});

test("逐項解析不使用無法指出錯因或文本證據的通用退化句", () => {
  const banned = [
    "至少有一項無法成立",
    "僅是不符合題意",
    "其餘選項皆不正確",
    "題組圖表「",
    "把答案判斷為",
    "兩者在人物線索上不同",
    "兩者在時間線索上不同",
    "兩者在因果線索上不同",
    "兩者在細節線索上不同",
    "完整句須有與主詞一致的動詞，並依時間線索選正確時態或句型",
    "此形式與題幹句構不合",
    "無法回應題幹提供的具體情境",
    "能直接回應題幹提供的情境",
  ];
  const generic = questions.filter(question =>
    banned.some(phrase => String(question.explain || "").includes(phrase)),
  );
  assert.equal(
    generic.length,
    0,
    `仍有 ${generic.length} 題使用通用退化句，例如：${generic.slice(0, 12).map(q => `${q.year}-${q.no}`).join("、")}`,
  );
});

test("解析維持繁體中文與正常標點", () => {
  const badText = questions.filter(question =>
    /[价梦计错误]|，。|。。|；。/.test(String(question.explain || "")),
  );
  assert.equal(
    badText.length,
    0,
    `仍有 ${badText.length} 題含簡體字或異常標點，例如：${badText.slice(0, 12).map(q => `${q.year}-${q.no}`).join("、")}`,
  );
});

test("已匯入的四選項統計同時包含全體與待加強組", () => {
  const withAll = questions.filter(question => question.opt);
  const withLow = questions.filter(question => question.low?.opt);
  assert.equal(withAll.length, 294);
  assert.equal(withLow.length, 294);
  for (const question of withAll) {
    assert.deepEqual(Object.keys(question.opt).sort(), ["A", "B", "C", "D"]);
    assert.deepEqual(Object.keys(question.low.opt).sort(), ["A", "B", "C", "D"]);
  }
});
