import test from "node:test";
import assert from "node:assert/strict";
import {mkdirSync, mkdtempSync, writeFileSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {spawnSync} from "node:child_process";

const script = new URL("../scripts/check_rules_index.mjs", import.meta.url).pathname;

function runCheck(index) {
    const root = mkdtempSync(join(tmpdir(), "rules-index-"));
    mkdirSync(join(root, "docs/gm/dispatch"), {recursive: true});
    writeFileSync(join(root, "docs/RULES_INDEX.md"), index);
    writeFileSync(join(root, "docs/OWNED.md"), "# Owned\n");
    writeFileSync(join(root, "docs/gm/dispatch/WORKING.md"), "# Working\n");
    const r = spawnSync("node", [script], {env: {...process.env, RULES_INDEX_ROOT: root}, encoding: "utf8"});
    return {status: r.status, out: r.stdout};
}

const fixture = (registerRows, routerRows) => `# Index

## Register of rule sets

| Rule set | Codes | Status | Covers | Owner |
|---|---|---|---|---|
${registerRows}

## Router: what applies to my task

| If the task touches | Apply | Then read |
|---|---|---|
${routerRows}
`;

test("a register code family absent from the router warns without failing", () => {
    const {status, out} = runCheck(fixture(
        "| Routed set | ZA1–ZA3 | s | c | [Owned](OWNED.md) |\n| Orphan set | QQ1–QQ3 | s | c | [Owned](OWNED.md) |",
        "| anything | ZA1–ZA3 | [Owned](OWNED.md) |"));
    assert.equal(status, 0);
    assert.match(out, /Orphan set: code family QQ appears in no router row/);
    assert.doesNotMatch(out, /Routed set: code family/);
});

test("a register owner link under docs/gm/dispatch warns without failing", () => {
    const {status, out} = runCheck(fixture(
        "| Dated set | ZB1–ZB3 | s | c | [Working](gm/dispatch/WORKING.md) |\n| Standing set | ZC1–ZC3 | s | c | [Owned](OWNED.md) |",
        "| anything | ZB1–ZB3, ZC1–ZC3 | [Owned](OWNED.md) |"));
    assert.equal(status, 0);
    assert.match(out, /Dated set: owner link gm\/dispatch\/WORKING\.md is under docs\/gm\/dispatch\//);
    assert.doesNotMatch(out, /Standing set: owner link/);
});
