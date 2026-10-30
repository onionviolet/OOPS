// Validate Luna coverage, then fold shared canonical names and explicitly reviewed
// cross-slice aliases. Never edits the source typed facts or claims runtime wiring.
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

export function validateSlice(input, rows, bySlug) {
    const own = new Set(input.map(x => x.slug)), covered = new Set();
    const groups = rows.slice(0, -1), last = rows.at(-1);
    const assert = (ok, message) => {if (!ok) throw Error(message);};
    assert(last && Object.keys(last).length === 1 && Array.isArray(last.unread), 'Final unread line required');
    const cover = slug => {
        assert(own.has(slug) && !covered.has(slug), `Foreign/duplicate slug: ${slug}`);
        covered.add(slug);
    };
    for (const row of groups) {
        assert(bySlug.has(row.canonical) && Array.isArray(row.members) && row.members.length && typeof row.reason === 'string' && row.reason.trim(), 'Invalid group');
        for (const member of row.members) {
            cover(member.slug);
            assert(Array.isArray(member.evidence) && member.evidence.length, `No read evidence: ${member.slug}`);
            for (const e of member.evidence) assert(typeof e.locator === 'string' && e.locator.trim()
                && bySlug.get(member.slug).occurrences.some(x => x.id === e.id && x.locator === e.locator), `Unmatched evidence: ${member.slug}`);
        }
    }
    last.unread.forEach(cover);
    assert(covered.size === own.size, `Missing slugs: ${[...own].filter(x => !covered.has(x)).join(',')}`);
    return {groups, unread: last.unread, covered};
}

// A repair replaces coverage in the unread set, never a resolved original row.
export function overlayRepairs(groups, unread, repairs, bySlug) {
    const remaining = new Set(unread), assigned = new Set(), merged = [...groups];
    let pending = 0;
    for (const {input, rows, lane} of repairs) {
        for (const {slug} of input) {
            if (!remaining.has(slug) || assigned.has(slug)) throw Error(`Foreign/duplicate repair slug: ${slug}`);
            assigned.add(slug);
        }
        if (rows === null) { pending++; continue; }
        const result = validateSlice(input, rows, bySlug);
        for (const group of result.groups) {
            group.members.forEach(m => remaining.delete(m.slug));
            merged.push({...group, lane});
        }
    }
    return {groups: merged, unread: [...remaining], pending};
}

async function main() {
const tracked = 'docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c1';
const base = 'docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l10';
const manifest = JSON.parse(readFileSync(`${base}/cost-infer/manifest.json`, 'utf8'));
execFileSync(process.execPath, [`${tracked}/prep.mjs`, '--check'], {stdio: 'pipe'});
const inventory = JSON.parse(readFileSync(`${base}/slug-cluster/inventory.json`, 'utf8'));
const bySlug = new Map(inventory.map(x => [x.slug, x]));
const args = process.argv.slice(2), value = flag => args[args.indexOf(flag) + 1];
const assert = (ok, message) => {if (!ok) throw Error(message);};
const selected = args.includes('--lane') ? manifest.slices.filter(x => x.lane === Number(value('--lane'))) : manifest.slices;
assert(selected.length > 0, 'Unknown lane');
assert(!args.includes('--lane') || args.includes('--validate-only'), 'Single-lane mode is validation only.');
let groups = [], unread = [];
const seen = new Set();
for (const lane of selected) {
    const input = JSON.parse(readFileSync(lane.input, 'utf8'));
    const rows = readFileSync(lane.output, 'utf8').trim().split('\n').map(JSON.parse);
    const result = validateSlice(input, rows, bySlug);
    for (const slug of result.covered) {assert(!seen.has(slug), `Duplicate across slices: ${slug}`); seen.add(slug);}
    groups.push(...result.groups.map(row => ({...row, lane: lane.lane})));
    unread.push(...result.unread);
}
let pendingRepairs = 0;
const repairPath = `${tracked}/../r3b/manifest.json`;
if (!args.includes('--lane') && existsSync(repairPath)) {
    const plan = JSON.parse(readFileSync(repairPath, 'utf8'));
    const repairs = plan.briefs.filter(b => b.family === 'c1').map(b => {
        const bytes = readFileSync(b.input);
        assert(createHash('sha256').update(bytes).digest('hex') === b.inputSha256, 'Repair input changed');
        return {input: JSON.parse(bytes), lane: b.brief, rows: existsSync(b.output)
            ? readFileSync(b.output, 'utf8').trim().split('\n').map(JSON.parse) : null};
    });
    const result = overlayRepairs(groups, unread, repairs, bySlug);
    ({groups, unread} = result); pendingRepairs = result.pending;
}
if (args.includes('--validate-only')) {
    console.log(JSON.stringify({lanes: selected.map(x => x.lane), covered: seen.size, groups: groups.length, unread: unread.length,
        pendingRepairs,
        gap: 'Locator matching does not verify paragraph reading or semantic equivalence.'}));
} else {
    const aliases = new Map();
    if (args.includes('--aliases')) {
        const path = resolve(value('--aliases'));
        assert(dirname(path) === resolve(`${base}/slug-cluster`), 'Alias review must stay in the owned private folder.');
        for (const a of JSON.parse(readFileSync(path, 'utf8'))) {
            assert(bySlug.has(a.from) && bySlug.has(a.to) && a.from !== a.to && !aliases.has(a.from)
                && typeof a.reason === 'string' && a.reason.trim() && Array.isArray(a.evidence) && a.evidence.length,
            'Invalid reviewed alias');
            for (const e of a.evidence) assert([a.from, a.to].some(s => bySlug.get(s).occurrences.some(x => x.id === e.id && x.locator === e.locator)), 'Unmatched alias evidence');
            aliases.set(a.from, a);
        }
    }
    const canonicalOf = slug => {
        const visited = new Set();
        while (aliases.has(slug)) {assert(!visited.has(slug), 'Alias cycle'); visited.add(slug); slug = aliases.get(slug).to;}
        return slug;
    };
    for (const slug of aliases.keys()) canonicalOf(slug);
    const merged = new Map();
    for (const group of groups) {
        const canonical = canonicalOf(group.canonical);
        const entry = merged.get(canonical) ?? {canonical, members: [], proposals: [], inferred: true};
        entry.members.push(...group.members);
        entry.proposals.push({lane: group.lane, reason: group.reason, canonical: group.canonical});
        merged.set(canonical, entry);
    }
    // A canonical name that is itself resolved to another group would otherwise
    // yield incompatible mappings. Require an explicit alias review to settle it.
    const assignment = new Map([...merged.values()].flatMap(g => g.members.map(m => [m.slug, g.canonical])));
    for (const g of merged.values()) assert(!assignment.has(g.canonical) || assignment.get(g.canonical) === g.canonical,
        `Canonical collision ${g.canonical}: review an alias before folding.`);
    const result = {schema: 1, status: 'proposal; semantic spot-check pending', groups: [...merged.values()], unread, pendingRepairs,
        aliasReviews: [...aliases.values()], sourceInputs: manifest.inputs,
        counts: {covered: seen.size, resolved: seen.size - unread.length, unread: unread.length, groups: merged.size},
        gaps: ['No runtime rewrites.', 'Unread canonical names require source review before promotion.',
            'Schema validates claimed evidence only; coordinator must perform the 15-row source spot-check.']};
    writeFileSync(`${base}/slug-cluster/folded.json`, JSON.stringify(result, null, 2) + '\n');
    console.log(JSON.stringify(result.counts));
}

}
if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
