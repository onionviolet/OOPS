// Workbench drafts (G4): one gap row -> a draft brief in the owner's shape -> back to proof on the same row.
// ROUTE CONTRACT
//   GET  /codex/<ledger>/draft?id=<id>   {key, meta{key, ledger, id, baseHash, stateAtDraft, kind, gated}, text}  preview only, writes nothing
//   POST /drafts  body {ledger, id}      saves the server-built draft to docs/gm/dispatch/atlas-drafts/<file>.md
//                                         201 {saved, path, meta} | 409 {conflict, path} when a draft for the row exists | 404 unknown row
//   GET  /drafts                          {drafts:[{path, meta, status, current{state, baseHash}|null}]}
//     status: open (row unchanged since the draft) | row-changed (state or row bytes moved: check for proof) | row-gone.
// What this never does (audit OOPS_DIRECTION section 3, B1-B3): run the draft, launch a lane, edit code or ledgers, commit,
// spend on reading, or mark anything proven. The brief text is built on the server from the ledger row, so a request
// cannot write arbitrary text to disk. A draft is a proposal (AD32); adoption stays with the owner and the session's authority.
import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {blockerOf, familyOf, nextAction, projectRow} from './codex.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
export const DRAFT_DIR = 'docs/gm/dispatch/atlas-drafts';
const META = /^<!-- atlas-draft (\{.*\}) -->$/m;

export const rowHash = row => createHash('sha1').update(JSON.stringify(row)).digest('hex').slice(0, 12);
export const draftFile = key => key.replace(/[^\w.-]+/g, '_').slice(0, 150) + '.md';

/** What the next step is for a row, by state family. Pointers to existing owners only. */
export function stepFor(row, canonical = []) {
    const state = typeof row.state === 'string' ? row.state : '', fam = familyOf(state), slug = blockerOf(state);
    if (slug) return nextAction(slug, canonical);
    if (fam === 'expressed') return {kind: 'draft-consumer', gated: false, owner: 'docs/coverage/CASE_SHAPE.md (runs needs the case module reachable from src/main.js and called by a consumer)',
        text: 'Expressed, not runs: draft a consumer (action entry, means and costs, result, save effects, test scenario).'};
    if (fam === 'runs') return {kind: 'prove', gated: false, owner: 'a play test with a ladder manifest (scripts/ladder_receipts.mjs play), then a browser receipt',
        text: 'Runs: add the missing proof rungs. A play test proves player action in its scope; save/reload, export/import and a browser receipt are separate checks.'};
    if (fam === 'notAThing') return {kind: 'none', gated: false, owner: 'the ledger owner', text: 'Marked not a thing. Reopen only with new source evidence.'};
    return {kind: 'case', gated: false, owner: 'docs/coverage/CASE_SHAPE.md and scripts/case_runner.mjs',
        text: 'Catalogued: write a case (mechanism, source basis, expected world change, normal input, a near miss) so the runner can express it.'};
}

/** Build the brief. Pure: the same row and inputs give the same text (createdAt is passed in). */
export function buildDraft(ledger, row, {canonical = [], createdAt = new Date().toISOString()} = {}) {
    const p = projectRow(ledger, row), step = stepFor(row, canonical), baseHash = rowHash(row);
    const meta = {key: p.key, ledger, id: p.id, baseHash, stateAtDraft: p.state, kind: step.kind, gated: !!step.gated, createdAt};
    const lane = p.key.replace(/[^\w]+/g, '-').slice(0, 60).toLowerCase();
    const L = [];
    L.push(`<!-- atlas-draft ${JSON.stringify(meta)} -->`, `# Draft: ${p.label ? p.label + ' · ' : ''}${p.key}`, '');
    L.push(`Proposal (AD32), drafted from the atlas on ${createdAt.slice(0, 10)}. Not accepted, not assigned, not run.`, '');
    L.push('## Row as drafted', '', `- State: \`${p.state || 'none'}\`${p.blocker ? ` (blocker \`${p.blocker}\`)` : ''}`, `- Row hash: \`${baseHash}\` (if the row changes, recheck before acting)`);
    L.push(`- Mechanisms: ${p.mechanisms.join(', ') || 'none recorded'}`, `- Test: ${p.test || 'none recorded'}`, `- Case: ${p.ladder.case ? `${p.ladder.case.module} · ${p.ladder.case.id}` : 'none'}`);
    if (p.locators.length) L.push(`- Sources: ${p.locators.join('; ')}`);
    if (p.note) L.push(`- Note: ${p.note}`);
    L.push('', '## Next step', '', `- Kind: ${step.kind}${step.gated ? ' (spends: needs Weibao\'s yes before any paid read)' : ''}`, `- Owner: ${step.owner}`, `- What: ${step.text}`);
    if (step.kind === 'targeted-read') L.push('- Before reading: use the atlas "Check this passage" on this row and the chapter/wiki tier labels; many rank and effect gaps are already answered in held text.');
    L.push('', '## Proof route (each rung separate; none implies another)', '');
    L.push('1. Case success: the row state after `scripts/case_runner.mjs` (expressed-* or runs-*).', '2. Module reachability: `scripts/ladder_receipts.mjs reach` records the import chain and whether anything on it calls the case.');
    L.push('3. Player action: a play test with a ladder manifest, scope named (workshop demo, headless, ordinary play, browser).', '4. Persistence: engine restore, save/reload, export/import and browser as separate checks.', '');
    L.push('## Never by inference (audit B1-B3)', '', '- The atlas does not accept a design, assign files, commit, push or authorize paid reads.', '- Matching names is not identity; a static import is not play; an old receipt does not certify new inputs.', '- No private book text or other people\'s messages in tracked files.', '');
    L.push('## If handed to a lane', '', 'Write the owned files and the forbidden list first (see docs/gm/dispatch/atlas-platform-2026-11-24/wave2/OWNERSHIP.md for the shape), then for example:', '', '```bash', `node scripts/codex_lane.mjs launch ${lane} ${DRAFT_DIR}/${draftFile(p.key)} --model gpt-6-luna --effort low`, '```', '');
    L.push('Shown as a suggestion only. The atlas never runs it.');
    return {key: p.key, meta, text: L.join('\n') + '\n'};
}

export function parseMeta(text) {
    const m = META.exec(text);
    try {return m ? JSON.parse(m[1]) : null;} catch {return null;}
}

/** Save a server-built draft. Never overwrites: an existing draft for the row is a conflict for its owner to resolve. */
export function saveDraft(draft, dir = join(root, DRAFT_DIR)) {
    const file = draftFile(draft.key), path = join(dir, file), rel = `${DRAFT_DIR}/${file}`;
    if (existsSync(path)) return {conflict: true, path: rel};
    mkdirSync(dir, {recursive: true});
    writeFileSync(path, draft.text, {flag: 'wx'});
    return {saved: true, path: rel, meta: draft.meta};
}

/** Saved drafts with their row's current status. `lookup(ledger, id)` returns the current raw row or null. */
export function listDrafts(lookup, dir = join(root, DRAFT_DIR)) {
    if (!existsSync(dir)) return [];
    const out = [];
    for (const f of readdirSync(dir).filter(f => f.endsWith('.md')).sort()) {
        const meta = parseMeta(readFileSync(join(dir, f), 'utf8'));
        if (!meta) continue;
        const row = lookup(meta.ledger, meta.id);
        const current = row ? {state: row.state ?? null, baseHash: rowHash(row)} : null;
        const status = !row ? 'row-gone' : current.baseHash === meta.baseHash ? 'open' : 'row-changed';
        out.push({path: `${DRAFT_DIR}/${f}`, meta, status, current});
    }
    return out;
}
