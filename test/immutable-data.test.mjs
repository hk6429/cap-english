import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baseCommit = "88359d9";
const dataFiles = fs.readdirSync(path.join(root, "data"))
  .filter(name => /^q\d+(?:-\d)?\.js$/.test(name))
  .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

function loadBank(source, filename) {
  const context = vm.createContext({ window: { BANK: [] } });
  vm.runInContext(source, context, { filename });
  return structuredClone(context.window.BANK[0]);
}

function withoutExplanations(bank) {
  return {
    ...bank,
    questions: bank.questions.map(({ explain: _explain, ...question }) => question),
  };
}

test("題庫內容除 explain 外均與修改前完全一致", () => {
  for (const name of dataFiles) {
    const relativePath = `data/${name}`;
    const before = loadBank(
      execFileSync("git", ["show", `${baseCommit}:${relativePath}`], {
        cwd: root,
        encoding: "utf8",
      }),
      `${name}@${baseCommit}`,
    );
    const after = loadBank(
      fs.readFileSync(path.join(root, relativePath), "utf8"),
      name,
    );
    assert.deepEqual(
      withoutExplanations(after),
      withoutExplanations(before),
      `${relativePath} 有 explain 以外的資料變動`,
    );
  }
});
