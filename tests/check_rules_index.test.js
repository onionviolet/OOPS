import test from "node:test";
import assert from "node:assert/strict";
import {mkdirSync, mkdtempSync, writeFileSync, rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {spawnSync} from "node:child_process";

const script = new URL("../scripts/check_rules_index.mjs", import.meta.url).pathname;

function runCheck(index, files = {}) {
    const root = mkdtempSync(join(tmpdir(), "rules-index-"));
    mkdirSync(join(root, "docs/gm/dispatch"), {recursive: true});
    writeFileSync(join(root, "docs/RULES_INDEX.md"), index);
    writeFileSync(join(root, "docs/OWNED.md"), "# Owned\n" + ["ZA", "QQ", "ZC"].flatMap(p => [1, 2, 3].map(n => `${p}${n}. Fixture definition`)).join("\n"));
    writeFileSync(join(root, "docs/gm/dispatch/WORKING.md"), "# Working\n" + [1, 2, 3].map(n => `ZB${n}. Fixture definition`).join("\n"));
    for (const [file, body] of Object.entries(files)) writeFileSync(join(root, "docs", file), body);
    const r = spawnSync("node", [script], {env: {...process.env, RULES_INDEX_ROOT: root}, encoding: "utf8"});
    rmSync(root, {recursive: true, force: true});
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

const mixed = (citation = 'UR1–UR3, BHR1–BHR2') => fixture(
    '| UI | UR1–UR3 (UR1–UR2 standing; UR3 proposed) | s | c | [Owned](OWNED.md) |\n| Health | BHR1–BHR2 | s | c | [Owned](OWNED.md) |',
    `| task | ${citation} | [Owned](OWNED.md) |`);
const definitions = '# Owned\n\n| UR1 | first |\n| UR2 | second |\n| UR3 | proposed |\nBHR1. First\nBHR2. Second\n';

test('mixed standing/proposed and three-letter families validate successfully', () => {
    assert.equal(runCheck(mixed(), {'OWNED.md': definitions}).status, 0);
});
test('a nonexistent UI citation fails even with a mixed register cell', () => {
    const r = runCheck(mixed('UR999999'), {'OWNED.md': definitions});
    assert.equal(r.status, 1);
    assert.match(r.out, /cites UR999999, which is not defined/);
});
test('three-letter family range drift fails', () => {
    const r = runCheck(mixed(), {'OWNED.md': definitions.replace('BHR2. Second', 'BHR3. Third')});
    assert.equal(r.status, 1);
    assert.match(r.out, /highest in owner is BHR3/);
});
test('registered owner links resolve relative to that owner and detect missing anchors', () => {
    const good = definitions + '\n[Self](OWNED.md#owned)\n';
    assert.equal(runCheck(mixed(), {'OWNED.md': good}).status, 0);
    const r = runCheck(mixed(), {'OWNED.md': good.replace('#owned)', '#missing)')});
    assert.equal(r.status, 1);
    assert.match(r.out, /OWNED.md: broken anchor/);
});


test('a dated proposal source requires explicit classification, a proposal header and stable routing', () => {
    const make = (status = 'Proposal', label = 'proposal source: ') => fixture(
        `| Proposal set | ZB1–ZB3 | ${status} | c | [Route](OWNED.md); ${label}[Source](gm/dispatch/WORKING.md) |`,
        '| task | ZB1–ZB3 | [Route](OWNED.md) |');
    const source = '# Design\n\n**Status: proposal.**\nZB1. One\nZB2. Two\nZB3. Three\n';
    const r = runCheck(make(), {'gm/dispatch/WORKING.md': source});
    assert.equal(r.status, 0, r.out);
    assert.doesNotMatch(r.out, /a dated working document/);
    for (const index of [make('Standing'), make('Proposal; accepted'), make('Proposal', '')]) {
        assert.match(runCheck(index, {'gm/dispatch/WORKING.md': source}).out, /a dated working document/);
    }
    assert.match(runCheck(make()).out, /a dated working document/);
    const noRoute = make().replace('[Route](OWNED.md); ', '');
    assert.match(runCheck(noRoute, {'gm/dispatch/WORKING.md': source}).out, /a dated working document/);
});

test('a registered range without definitions fails instead of silently skipping citation validation', () => {
    const r = runCheck(mixed(), {'OWNED.md': '# Owned\n'});
    assert.equal(r.status, 1);
    assert.match(r.out, /UR: no definitions found/);
});

test('reversed registered ranges fail', () => {
    const r = runCheck(mixed().replace('BHR1–BHR2', 'BHR2–BHR1'), {'OWNED.md': definitions});
    assert.equal(r.status, 1);
    assert.match(r.out, /reversed range/);
});
