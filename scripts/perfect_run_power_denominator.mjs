// Perfect Run power denominator (docs/research/power-catalogues-2026-11-16, PWC3): names from data, never from memory.
// Reads the private deep-dive digests (A, B) and the paid claims run 2026-11-01-pr, and returns one entity per named
// power: a Genome by named holder, an Elixir colour or condition, a Psycho variant, a device or product, the time-stop
// and Quicksave. Bad Runs what-ifs (book 2 and 3 locators) get their own namespace and never join a main row.
// Private paths are absolute (the worktree lacks the gitignored folders). The committed outputs carry names,
// locators and speakers only; packets with evidence text stay under docs/research/power-catalogues-2026-11-16/private/.
import {readFileSync, readdirSync, existsSync} from 'node:fs';

const PRIMARY = '/Users/weiwei/code/yet-another-idle-rpg/';
const PR = `${PRIMARY}docs/research/novels/perfect-run/`;
export const PRIVATE = `${PRIMARY}docs/research/power-catalogues-2026-11-16/private/`;
const CLAIMS = `${PR}private/lead-run-2026-10-29/`;
const slug = s => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Real merges (one person under two ids), each recorded. Aliases are never fed through a lookup that could cross people.
export const MERGES = {
    'pr.person.livia-augusti': 'pr.person.livia', 'pr.person.mob-zeus': 'pr.person.augustus', 'pr.person.fallout': 'pr.person.alphonse-manada',
    'pr.person.timmy': 'pr.person.the-panda', 'pr.person.greta': 'pr.person.cancel', 'pr.person.mathias-martel': 'pr.person.shroud',
    'pr.person.mathias': 'pr.person.shroud', 'pr.person.narcinia-veran': 'pr.person.narcinia', 'pr.person.ryan': 'pr.person.ryan-romano'};
const WORDS = {Ryan: 'pr.person.ryan-romano', 'Ryan Romano': 'pr.person.ryan-romano', Livia: 'pr.person.livia', Augustus: 'pr.person.augustus',
    'the Panda': 'pr.person.the-panda', Panda: 'pr.person.the-panda', Adam: 'pr.person.adam', Sarin: 'pr.person.sarin', Ghoul: 'pr.person.ghoul',
    Wyvern: 'pr.person.wyvern', Psyshock: 'pr.person.psyshock', Geist: 'pr.person.geist', Mosquito: 'pr.person.mosquito', Bacchus: 'pr.person.bacchus',
    Mortimer: 'pr.person.mortimer', Fortuna: 'pr.person.fortuna', Venus: 'pr.person.venus', Neptune: 'pr.person.neptune', Vulcan: 'pr.person.vulcan',
    Pluto: 'pr.person.pluto', Shroud: 'pr.person.shroud', Wardrobe: 'pr.person.wardrobe', Cancel: 'pr.person.cancel', Len: 'pr.person.len',
    Luigi: 'pr.person.luigi', 'Mr. Wave': 'pr.person.mr-wave', 'Leo Hargraves': 'pr.person.leo-hargraves', Alchemo: 'pr.person.alchemo', Darkling: 'pr.creature.darkling'};
const person = id => MERGES[id] ?? id;
const COLOURS = ['green', 'blue', 'violet', 'red', 'orange', 'yellow', 'white', 'black'];

const lines = path => readFileSync(path, 'utf8').split('\n').filter(Boolean).flatMap(l => { try { return [JSON.parse(l)]; } catch { return []; } });

function digestRows(file, tag) {
    const rows = [];
    for (const l of readFileSync(file, 'utf8').split('\n')) {
        const c = l.split('|').slice(1, -1).map(s => s.trim());
        if (c.length !== 8 || c[0] === 'Item' || /^-+$/.test(c[0])) continue;
        rows.push({digest: tag, item: c[0], kind: c[1], effect: c[2], cost: c[3], limits: c[4], holder: c[5], label: c[6], locator: c[7]});
    }
    return rows;
}

// Who a digest row is about: a person only when the item or the holder names one (word table, by the claims' own labels).
function holderOf(row, labelToId) {
    const hit = s => {
        const bare = s.replace(/\s*\(.*?\)/g, '').trim();
        return WORDS[bare] ?? labelToId.get(bare.toLowerCase()) ?? null;
    };
    return person(hit(row.item) ?? hit(row.holder) ?? '') || null;
}

export function loadDenominator() {
    const reg = lines(`${PR}private/wb8-merged-2026-10-30/registry.jsonl`);
    const labelToId = new Map(reg.filter(r => r.kind === 'person' && r.label).map(r => [r.label.toLowerCase(), r.id]));
    const labelOf = new Map(reg.map(r => [r.id, r.label]));
    const digests = [...digestRows(`${PR}digests/PR_A_DIGEST.md`, 'A'), ...digestRows(`${PR}digests/PR_B_DIGEST.md`, 'B')];

    // Paid claims, deduplicated by id, locator and first result text.
    const claims = [];
    const seen = new Set();
    for (const f of readdirSync(CLAIMS).filter(f => /^pr[a-z]*c\d+m?_rules\.jsonl$/.test(f))) for (const r of lines(`${CLAIMS}${f}`)) {
        if (!['ability', 'potion', 'reset'].includes(r.kind)) continue;
        const key = `${r.id}|${r.locator}|${r.results?.[0]?.what ?? r.steps?.[0]?.what ?? ''}`;
        if (seen.has(key)) continue; seen.add(key);
        const book = /^en b(\d)/.exec(r.locator ?? '')?.[1] ?? '1';
        claims.push({...r, who: (r.who ?? []).map(w => WORDS[w] ?? person(w)), book});
    }
    return {digests, claims, labelToId, labelOf, holderOf: row => holderOf(row, labelToId), slug, COLOURS};
}


// ---- Entities -------------------------------------------------------------------------------------------------------
// A digest row becomes a device, Elixir, condition or loop entity when its item names one of these things; otherwise it is
// a Genome row for the person or persons it names. Rows listing several holders split by name.
const THING = [
    [/^time stop$|^violet time-stop$/i, 'time-stop', 'time-stop'], [/save point and reload|^quicksave/i, 'quicksave', 'loop'],
    [/save-point phantom/i, 'save-point-phantom', 'loop'], [/^black power|black flux/i, 'black-flux', 'elixir-adjacent'],
    [/^black elixir/i, 'black-elixir', 'elixir'], [/^elixir \(genuine\)|^true elixirs/i, 'true-elixirs', 'elixir'],
    [/hercules elixir/i, 'hercules-knockoff', 'knockoff'], [/invisibility elixir/i, 'invisibility-knockoff', 'knockoff'],
    [/firebrand/i, 'firebrand-knockoff', 'knockoff'], [/^knockoff elixir/i, 'knockoff-elixir', 'knockoff'],
    [/mongrel'?s cocktail/i, 'mongrel-cocktail', 'psycho'], [/^dual elixir/i, 'dual-elixir-bond', 'elixir'], [/^psycho condition/i, 'psycho-condition', 'psycho'],
    [/^chronoradio/i, 'chronoradio', 'device'], [/memory map/i, 'memory-map-snapshot', 'device'], [/saturn armor/i, 'saturn-armor', 'device'],
    [/gravity gun/i, 'gravity-gun-opis-armor', 'device'], [/fisty/i, 'fisty-gauntlets', 'device'], [/a-bomb/i, 'a-bomb', 'device'],
    [/resonators/i, 'resonators', 'device'], [/mechron tech/i, 'mechron-legacy-tech', 'device'], [/rabbit plushie|^plushie/i, 'rabbit-plushie', 'device'],
    [/^rampage/i, 'rampage-drug', 'drug'], [/^bliss/i, 'bliss', 'drug'], [/monaco effect/i, 'monaco-effect', 'site'],
    [/eugene-henry/i, 'eugene-henry', 'entity'], [/e\.t\. soldier/i, 'et-soldier', 'entity'], [/eva clones/i, 'eva-clones', 'entity'],
    [/clockstopper/i, 'badrun-clockstopper', 'bad-run']];
// Group rows: the holders named in a list, split by name.
const GROUPS = {
    'Mosquito, Mongrel, Rakshasa and others': ['pr.person.mosquito', 'pr.person.mongrel', 'pr.person.rakshasa'],
    'Mars, Venus, Mercury, Bacchus': ['pr.person.mars', 'pr.person.venus', 'pr.person.mercury', 'pr.person.bacchus'],
    'Ace, Stitch, Origami': ['pr.person.ace', 'pr.person.dr-stitch', 'pr.person.origami'],
    'Julie, Bruno Costa': ['pr.person.julie-costa', 'pr.person.bruno-costa'],
    'Other Genomes (brief)': ['pr.person.sarin', 'pr.person.shroud', 'pr.person.mr-wave', 'pr.person.sunshine', 'pr.person.acid-rain', 'pr.person.mortimer',
        'pr.person.night-terror', 'pr.person.vamp', 'pr.person.sparrow', 'pr.person.ghoul', 'pr.person.frank', 'pr.person.gemini', 'pr.person.ink-machine', 'pr.person.adam']};
const ALIASES = {'pr.person.land': 'pr.person.the-land', 'pr.person.chitter': 'pr.person.ki-jung', 'pr.person.bloodstream': 'pr.person.freddie-sabino',
    'pr.person.plushie': null, 'pr.person.quicksave': null, 'pr.person.meta': null, 'pr.creature.et': null, 'pr.creature.plushie': null,
    'pr.creature.eugene-henry': null, 'pr.creature.biomechanical-dragon': null};
const COLLECTIVE = /^pr\.(organization|deity)\./;
const claimThing = c => {
    const id = c.id.replace(/^pr\.[a-z]+\./, '');
    if (c.book !== '1') return null;
    if (/^reset\./.test(c.id) || /(^|-)(save|quicksave)(-|$)|immortality|time-loop|alternate-reality|purple-world|observer/.test(id)) return 'quicksave';
    if (/time-?stop|time-freeze|stop-time|time-halt|stopped-time|lead-time|chronokinesis|za-warudo|time-anomaly|ryan-power|violet-power|shockwave/.test(id)) return 'time-stop';
    if (/black/.test(id)) return 'black-flux';
    if (/bliss|endorphin/.test(id)) return 'bliss';
    if (/rampage/.test(id)) return 'rampage-drug';
    if (/knockoff|tempest/.test(id)) return 'knockoff-elixir';
    if (/firebrand/.test(id)) return 'firebrand-knockoff';
    if (/elixir/.test(id)) return `elixir:${/(green|blue|violet|red|orange|yellow|white|black)/.exec(id)?.[1] ?? 'general'}`;
    return null;
};

export function entities() {
    const d = loadDenominator();
    const out = new Map();
    const add = (key, name, category, layer = 'main') => {
        const e = out.get(key) ?? {key, name, category, layer, holders: [], digest: [], claims: [], nameSource: new Set()};
        out.set(key, e); return e;
    };
    for (const r of d.digests) {
        const bare = r.item.replace(/\s*\(.*?\)/g, '').trim();
        const thing = THING.find(([re]) => re.test(r.item));
        if (thing) {
            const e = add(thing[1], bare, thing[2], thing[2] === 'bad-run' ? 'bad-run' : 'main');
            e.digest.push(r); e.nameSource.add(`digest-${r.digest}`); continue;
        }
        for (let id of GROUPS[r.item] ?? [d.holderOf(r)]) {
            id = id in ALIASES ? ALIASES[id] : id;
            if (!id) { console.error('unassigned digest row', r.item); continue; }
            const e = add(id, d.labelOf.get(id) ?? bare, 'genome');
            e.holders.push(id); e.digest.push(r); e.nameSource.add(`digest-${r.digest}`);
        }
    }
    for (const c of d.COLOURS) add(`elixir:${c}`, `${c[0].toUpperCase()}${c.slice(1)} Elixir`, 'elixir-colour').nameSource.add('digest-A-1.1');
    for (const [k, n] of [['badrun-len-violet', 'Len takes Violet (Bad Run)'], ['badrun-ryan-blue-stat-screen', 'Ryan takes Blue, stat screen (Bad Run)'],
        ['badrun-plushie-game-master', 'Plushie as Game Master (Bad Run)']]) add(k, n, 'bad-run', 'bad-run').nameSource.add('digest-B-8');
    for (const c of d.claims) {
        let key = null;
        if (c.book !== '1') {
            const ch = /^en b\d c(\d+)/.exec(c.locator)?.[1];
            key = ch === '3' ? 'badrun-plushie-game-master' : ch === '1' ? 'badrun-clockstopper'
                : /stat|blue|check|perception|genius|roll|level/i.test(c.id + c.name) ? 'badrun-ryan-blue-stat-screen' : 'badrun-len-violet';
        } else if (c.who.includes('pr.person.ryan-romano') || /^pr\.(reset|potion|item)\./.test(c.id) || !c.who.length) key = claimThing(c);
        if (key?.startsWith('elixir:') && !out.has(key)) key = 'true-elixirs';
        if (key) { const e = out.get(key) ?? add(key, key, 'claims-only'); e.claims.push(c); e.nameSource.add('claims'); continue; }
        for (let w of c.who) {
            w = person(w); w = w in ALIASES ? ALIASES[w] : w;
            if (!w || COLLECTIVE.test(w) || !/^pr\.(person|creature)\./.test(w) || w === 'pr.person.ryan-romano') continue;
            const e = out.get(w) ?? add(w, d.labelOf.get(w) ?? w, 'genome');
            e.claims.push(c); e.nameSource.add('claims'); if (!e.holders.includes(w)) e.holders.push(w);
        }
    }
    return {entities: [...out.values()], d};
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
    const {entities: es} = entities();
    for (const e of es) console.log(`${e.layer === 'bad-run' ? 'B ' : '  '}${e.key.padEnd(34)} ${e.category.padEnd(15)} dig=${e.digest.length} cl=${e.claims.length} ${[...e.nameSource].join('+')}`);
    console.log(es.length, 'entities');
}
