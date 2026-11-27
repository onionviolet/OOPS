// Mechanic-first projection (O3). Mechanic ids come from existing owners, never a new taxonomy:
//   missing mechanisms = canonical blocked slugs (docs/coverage/blocked_slugs.json, PWC59), per world from worlds.jsonl;
//   running laws       = named mechanism owners on coverage rows whose state runs or is expressed.
// Counts and ids only.
import {readFileSync, readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';

const root = fileURLToPath(new URL('../../', import.meta.url));
const read = p => readFileSync(root + p, 'utf8');
const parseJsonl = raw => raw.split('\n').filter(l => l.trim()).flatMap(l => {try {return [JSON.parse(l)];} catch {return [];}});
const jsonl = p => parseJsonl(read(p));
const CORPORA = ['powers', 'artifacts', 'potions_and_recipes', 'materials', 'creatures', 'places', 'institutions', 'people', 'jobs_and_roles', 'rules'];
const family = state => state.startsWith('runs') ? 'runs' : state.startsWith('expressed') ? 'expressed' : state.startsWith('blocked') ? 'blocked' : state.startsWith('not-a-thing') ? 'other' : 'catalogued';

// Exact ids only. Two ledger rows for an id remain two evidence claims.
export function coverageFor(ids, dir = join(root, 'docs/coverage')) {
    const matches = new Map();
    if (!ids.size) return matches;
    for (const file of readdirSync(dir).filter(f => f.endsWith('.jsonl') && f !== 'worlds.jsonl')) {
        for (const row of parseJsonl(readFileSync(join(dir, file), 'utf8'))) {
            if (!ids.has(row.id) || typeof row.state !== 'string') continue;
            const entries = matches.get(row.id) ?? [];
            entries.push({ledger: file, state: row.state, test: typeof row.test === 'string' ? row.test : null});
            matches.set(row.id, entries);
        }
    }
    return matches;
}

export function readMechanics() {
    const worlds = jsonl('docs/coverage/worlds.jsonl');
    const canon = new Set(JSON.parse(read('docs/coverage/blocked_slugs.json')).canonical || []);
    const ledgerWorld = new Map();
    for (const w of worlds) for (const c of CORPORA) if (w.cells?.[c]?.ledger) ledgerWorld.set(w.cells[c].ledger, w.id);
    const mech = new Map();
    const at = (id, kind) => mech.get(id) || mech.set(id, {id, kind, worlds: new Map(), corpora: new Map(), tests: new Set()}).get(id);
    const bump = (m, world, corpus, fam, n = 1) => {
        const w = m.worlds.get(world) || m.worlds.set(world, {runs: 0, expressed: 0, blocked: 0, catalogued: 0, other: 0}).get(world);
        w[fam] += n;
        m.corpora.set(corpus, (m.corpora.get(corpus) || 0) + n);
    };
    for (const file of readdirSync(root + 'docs/coverage').filter(f => f.endsWith('.jsonl') && f !== 'worlds.jsonl')) {
        const ledger = file.slice(0, -6), world = ledgerWorld.get(ledger) || ledger.replace(/_(powers|artifacts|potions|materials|creatures|places|institutions|people|jobs|rules|spells|recipes).*$/, '');
        for (const r of jsonl('docs/coverage/' + file)) {
            if (typeof r.state !== 'string') continue;
            const fam = family(r.state);
            if (fam === 'blocked') {
                const slug = r.state.slice(8);
                bump(at(slug, canon.has(slug) ? 'missing' : 'missing-unlisted'), world, ledger, 'blocked');
            }
            if (fam === 'runs' || fam === 'expressed') for (const owner of r.mechanisms || []) {
                if (owner.length < 3) continue; // chat letters (T, G, P) are lane names, not mechanisms
                const m = at(owner, 'law');
                bump(m, world, ledger, fam);
                if (r.test) m.tests.add(r.test);
            }
        }
    }
    const names = Object.fromEntries(worlds.map(w => [w.id, w.name]));
    return {
        source: {blockedSlugs: 'docs/coverage/blocked_slugs.json', worlds: 'docs/coverage/worlds.jsonl', ledgers: 'docs/coverage/*.jsonl'},
        worldNames: names,
        mechanics: [...mech.values()].map(m => ({id: m.id, kind: m.kind, tests: [...m.tests].slice(0, 12),
            total: [...m.worlds.values()].reduce((a, w) => a + w.runs + w.expressed + w.blocked, 0),
            worlds: [...m.worlds].map(([id, c]) => ({id, ...c})).sort((a, b) => (b.runs + b.expressed + b.blocked) - (a.runs + a.expressed + a.blocked)),
            ledgers: [...m.corpora].sort((a, b) => b[1] - a[1]).slice(0, 12)}))
            .sort((a, b) => b.total - a.total),
    };
}

if (import.meta.main) process.stdout.write(JSON.stringify(readMechanics()));
