// Builds the PRIVATE Lord of the Mysteries ingredient pack (TSW11 importer).
// Reads the gitignored wiki and census files, writes private_packs/lotm-ingredients/ingredients.json.
// This script holds rules and tables only; no wiki or book text is committed here.
// Usage: node tools/build_lotm_ingredient_pack.mjs [--root <repo root with docs/research>] [--out <file>]
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = (name, fallback) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : fallback; };
const ROOT = opt('--root', '/Users/weiwei/code/yet-another-idle-rpg');
const OUT = opt('--out', path.join(ROOT, 'private_packs/lotm-ingredients/ingredients.json'));
const NOVELS = path.join(ROOT, 'docs/research/novels/lord-of-mysteries');
const WIKI = path.join(NOVELS, 'wiki-api-2026-10-25/lotm_wiki_api_2026-10-25.json');
const SCAN = path.join(NOVELS, 'census-2026-10-19/formula-scan-2026-10-24');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const readLines = file => fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line));
const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const uniq = list => [...new Set(list)];
const slug = text => text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

// ---- Rule tables (all tag layers are deterministic proposals) -------------------
// Physical tags: [id, parents]
const PHYSICAL = [['liquid', []], ['animal', []], ['plant', []], ['mineral', []], ['blood', ['liquid', 'animal']], ['fluid', ['liquid']],
    ['water', ['liquid']], ['juice', ['liquid', 'plant']], ['extract', ['liquid']], ['organ', ['animal']], ['body_part', ['animal']],
    ['feather', ['body_part']], ['scale', ['body_part']], ['bone', ['body_part']], ['hair', ['body_part']], ['horn', ['body_part']],
    ['eye', ['organ']], ['heart', ['organ']], ['brain', ['organ']], ['gland', ['organ']], ['herb', ['plant']], ['flower', ['plant']],
    ['leaf', ['plant']], ['fruit', ['plant']], ['bark', ['plant']], ['root', ['plant']], ['seed', ['plant']], ['fungus', ['plant']],
    ['crystal', ['mineral']], ['stone', ['mineral']], ['metal', ['mineral']], ['powder', []], ['remains', []], ['substance', []]];
// Ordered keyword rules on the lowercased name: first hit per group order wins for the leaf tag list (all hits kept).
const PHYSICAL_RULES = [[/\bblood\b/, 'blood'], [/\bwater\b|\bdew\b/, 'water'], [/\bjuice\b|\bnectar\b|\bsap\b/, 'juice'],
    [/essence|essential oil|hydrosol|\boil\b|extract|tincture/, 'extract'], [/\btears?\b|secretion|\bsaliva\b|spinal fluid|\bliquids?\b|\bfluid\b|\bmarrow\b|\bmilk\b|\bvenom\b|\bpoison\b(?! hemlock)/, 'fluid'],
    [/\beyes?\b|eyeball/, 'eye'], [/\bheart\b|\bcore\b/, 'heart'], [/\bbrain\b|pituitary/, 'brain'], [/\bgland\b/, 'gland'],
    [/\bfeathers?\b|\bplume\b/, 'feather'], [/\bscales?\b/, 'scale'], [/\bbones?\b|\bteeth\b|\btooth\b|\bfang\b|\bskull\b|\bspine\b/, 'bone'],
    [/\bhair\b|\bfur\b|\bwool\b|\bmane\b/, 'hair'], [/\bhorns?\b|\bantlers?\b|\bclaws?\b|\bnails?\b/, 'horn'],
    [/\bpalms?\b|\bcomb\b|\bbeak\b|\bstinger\b|\btail\b|\bwings?\b|\bskin\b|\bhide\b|\bcrest\b|\btongue\b|\bliver\b|\bstomach\b|\bkidney\b|\blungs?\b|\bflesh\b|\bmeat\b|\bfingers?\b|\bhands?\b|\bshell\b|\btentacles?\b|\bhead\b/, 'organ'],
    [/\bpowder\b|\bdust\b|\bash\b|\bashes\b|\bgrains?\b/, 'powder'], [/crystal|crystalline/, 'crystal'],
    [/\bstone\b|\brock\b|\bgem\b|\bgemstone\b|\bpearl\b|amethyst|celestine|\bopal\b|citrine|garnet|topaz|emerald|obsidian|turquoise|agate|onyx|moonstone|\bjade\b|\bquartz\b|\bamber\b|\bsapphire\b|\bruby\b|\bdiamond\b|\bmagma\b/, 'stone'],
    [/\bgold\b|\bsilver\b|\biron\b|\bcopper\b|\bsteel\b|\bmetal\b|\bmercury\b|\bplatinum\b|\bbronze\b|\bcoin\b/, 'metal'],
    [/\bpetals?\b|\bflowers?\b|\bblossom\b|\blotus\b|\brose\b|\blily\b|\borchid\b/, 'flower'], [/\bleaf\b|\bleaves\b/, 'leaf'],
    [/\bfruit\b|\bberry\b|\bberries\b|\bnut\b|\bapple\b|\bpeach\b|\blemon\b|\bcitron\b/, 'fruit'], [/\bbark\b/, 'bark'],
    [/\broots?\b|\btuber\b|\brhizome\b/, 'root'], [/\bseeds?\b|\bspores?\b|\bkernel\b/, 'seed'], [/mushroom|\bfungus\b|\bfungal\b|\bmold\b|\bmoss\b/, 'fungus'],
    [/\bgrass\b|\bherb\b|\bmint\b|\brosemary\b|\bsage\b|\bthyme\b|\bvanilla\b|\bvine\b|\bshrub\b|\bhemlock\b|basil|walnut|cinnamon|garlic|pepper|ginger|clove|onion|\boak\b|\bpine\b|cedar|cypress|peony|poppy|daisy|violet|jasmine|aloe|\bivy\b|\bcannabis\b|\bjimsonweed\b|\bwort\b|\bcrocus\b|\bfoxglove\b|\bbelladonna\b|\bhoneysuckle\b|\blavender\b|\btree\b|\bbranch\b|\bstem\b|\bwood\b/, 'herb']];
const FUNCTIONAL = ['main_ingredient', 'auxiliary', 'solvent', 'catalyst', 'complete_part'];
// Symbolic: pathway domains, then keyword rules on name and non-decay description sentences.
const PATHWAY_SYMBOLS = {fool: ['fate', 'secrets', 'illusion'], door: ['travel', 'secrets'], error: ['theft', 'deceit'], visionary: ['mind', 'dream'],
    hanged_man: ['sacrifice', 'sin'], sun: ['sun', 'light', 'holiness'], tyrant: ['storm', 'sea'], white_tower: ['knowledge'],
    darkness: ['night', 'silence', 'sleep'], twilight_giant: ['twilight', 'war'], death: ['death', 'undeath'], red_priest: ['fire', 'war'],
    demoness: ['beauty', 'disaster'], paragon: ['craft'], hermit: ['secrets', 'mysticism'], wheel_of_fortune: ['fortune', 'fate'],
    moon: ['moon', 'alchemy'], mother: ['life', 'earth'], chained: ['bondage', 'madness'], abyss: ['corruption', 'desire'],
    justiciar: ['law', 'order'], black_emperor: ['commerce', 'corruption']};
const SYMBOL_RULES = [[/\bsun\b|\bdawn\b|\bsolar\b|radian|\bgolden\b|sunlight/, 'sun'], [/\blight\b|brilliant|holy|\bsacred\b|\bbright\b/, 'light'],
    [/\bfire\b|flame|magma|\blava\b|volcan|\bburn|\bfiery\b|\bember\b|\bsulfur\b/, 'fire'], [/\bsong\b|\bsing|siren|\bchime\b|melod|\bvoice\b|\bhymn\b/, 'song'],
    [/\bnight\b|\bdark|\bshadow|\bmoon|\bsilent\b/, 'night'], [/\bdeath\b|corpse|postmortem|\bgrave\b|\bghost\b|undead|wraith|\bsoul\b|\bdead\b|\bdie[sd]?\b/, 'death'],
    [/\bsecret|mystery|mysteries|spirit world|\bhidden\b|spirit\b/, 'secrets'], [/\bfate\b|destiny|fortune|\bstar\b|\bstars\b|\btime\b|history|prophe|divin/, 'fate'],
    [/\bstorm|thunder|lightning|\bsea\b|\bwave|\bwind\b|tempest|\bocean\b/, 'storm'], [/\bdream|\bmind\b|illusion|\bmirror\b|\bmemory\b|\bthought/, 'dream'],
    [/\bfrost\b|\bice\b|\bcold\b|\bsnow\b|\bwinter\b/, 'ice'], [/\btoxic\b|\bpoison|\bvenom/, 'poison'], [/\bblood\b/, 'life'],
    [/\bheal|\bvital|\blife\b|\bgrowth\b|\bbirth\b/, 'life'], [/\bbeast\b|\bmonster\b|\bdragon\b|\bwolf\b|\bsnake\b|\bserpent\b/, 'beast']];
const DECAY_RULES = [[/sunlight|exposure to light|degrade|light-sensitive|opaque/, 'light_sensitive'], [/evaporat|volatil|dissipat|vanish|disperse/, 'volatile'],
    [/\brot\b|rots|spoil|perish|wither|decay|decompos|\bfresh\b|\bwilt/, 'perishable'], [/\bstor(e|ed|age)\b|preserv|container|\bsealed?\b|refriger|keep it|kept in|stable\b/, 'storage']];
// Book-over-wiki overrides (crosswalk CONFLICT rows, book wins).
const OVERRIDES = [
    {id: 'X1', formula: 'Priest of Light', ingredient: /rock\s*(water|liquid)/i, qty: {n: 10, unit: 'ml'}, tier: 'book', note: 'wiki states a drop count, the book row states ml'},
    {id: 'X2', formula: 'Unshadowed', ingredient: /(sun|divine).{0,12}bird.{0,6}blood|blood.{0,10}(sun|divine).{0,12}bird/i, qty: {n: 60, unit: 'ml'}, tier: 'book', note: 'wiki states a larger ml amount, the book row states 60 ml'}];

// ---- Parsing --------------------------------------------------------------------
const cleanWiki = text => text.replace(/<ref[^>]*\/>/g, '').replace(/<ref[^>]*>.*?<\/ref>/gs, '').replace(/\{\{(?:[^{}|]*\|)*?([^{}|]*)\}\}/g, '$1')
    .replace(/'''?/g, '').replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, '$1').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const luaString = (src, i) => { // reads a Lua quoted string starting at src[i] (quote char), returns [value, nextIndex]
    const q = src[i]; let out = ''; i++;
    while(i < src.length && src[i] !== q) { if(src[i] === '\\') { i++; } out += src[i]; i++; }
    return [out, i + 1];
};
export function parseIngredientLua(src) {
    const entries = [];
    const re = /^\s{4}\[(['"])/gm;
    let m;
    const starts = [];
    while((m = re.exec(src))) starts.push(m.index + m[0].length - 1);
    for(let s = 0; s < starts.length; s++) {
        const [key, afterKey] = luaString(src, starts[s]);
        const body = src.slice(afterKey, s + 1 < starts.length ? starts[s + 1] : src.length);
        const field = name => {
            const fm = new RegExp(`\\b${name}\\s*=\\s*(['"])`).exec(body);
            return fm ? luaString(body, fm.index + fm[0].length - 1)[0] : null;
        };
        const list = name => {
            const lm = new RegExp(`\\b${name}\\s*=\\s*\\{([^}]*)\\}`).exec(body);
            if(!lm) return [];
            const out = []; const inner = lm[1]; let i = 0;
            while(i < inner.length) { if(inner[i] === "'" || inner[i] === '"') { const [v, n] = luaString(inner, i); out.push(v); i = n; } else i++; }
            return out;
        };
        entries.push({key, name: field('name') ?? key, desc: field('desc'), main: list('main'), supp: list('supp'), category: list('category')});
    }
    return entries;
}
const STOP = new Set(['the', 'of', 'a', 'an', 's', 'and', 'or', 'with', 'in', 'to']);
const tokens = text => text.normalize('NFKD').toLowerCase().replace(/['’]s\b/g, '').split(/[^a-z]+/).filter(Boolean)
    .map(t => (t.length > 3 && t.endsWith('s') && !t.endsWith('ss') ? t.slice(0, -1) : t)).filter(t => !STOP.has(t));
const NUMBER_WORDS = {a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, twelve: 12, twenty: 20};
const UNITS = {milliliter: 'ml', milliliters: 'ml', millilitre: 'ml', millilitres: 'ml', ml: 'ml', gram: 'g', grams: 'g', g: 'g', drop: 'drop', drops: 'drop',
    petal: 'petal', petals: 'petal', piece: 'piece', pieces: 'piece', strand: 'strand', strands: 'strand', scale: 'scale', scales: 'scale', pair: 'pair', pairs: 'pair',
    slice: 'slice', slices: 'slice', sprig: 'sprig', sprigs: 'sprig', handful: 'handful', handfuls: 'handful', bottle: 'bottle', bottles: 'bottle', block: 'block', blocks: 'block'};
const QTY = new RegExp(`^\\(?(?:(\\d+(?:\\.\\d+)?)|(${Object.keys(NUMBER_WORDS).join('|')})\\b)(?:\\s*-\\s*|\\s+)?(?:(${Object.keys(UNITS).join('|')})\\b)?(?:\\s+of\\b)?\\s*`, 'i');
// Returns {qty, rest}; qty keeps the stated number and unit, no conversion (TSW9).
export function parseQuantity(item) {
    const text = item.trim();
    const big = /^(a (large|small|considerable|great) amount of|some|several|a bit of|plenty of)\s+/i.exec(text);
    if(big) return {qty: {n: null, unit: null, stated: big[0].trim().toLowerCase()}, rest: text.slice(big[0].length)};
    const m = QTY.exec(text);
    if(!m || (!m[1] && !m[2])) return {qty: null, rest: text};
    const word = m[2]?.toLowerCase();
    // "A Worm of Time" style: a lone article before a noun counts as one piece, no unit.
    return {qty: {n: m[1] ? Number(m[1]) : NUMBER_WORDS[word], unit: m[3] ? UNITS[m[3].toLowerCase()] : null}, rest: text.slice(m[0].length)};
}
const splitItems = text => {
    if(!text) return [];
    const sentences = text.replace(/‑/g, '-').replace(/'''Note:'''[^.]*\./g, '').split(/\.\s+|\.$/).map(s => s.trim()).filter(Boolean);
    return sentences.map(s => cleanWiki(s)).filter(Boolean);
};

// ---- Trait layers -----------------------------------------------------------------
const physicalTags = (name, desc) => {
    const lower = name.toLowerCase();
    const hits = uniq(PHYSICAL_RULES.filter(([re]) => re.test(lower)).map(([, tag]) => tag));
    if(!hits.length && desc) hits.push(...uniq(PHYSICAL_RULES.filter(([re]) => re.test(desc.toLowerCase())).map(([, tag]) => tag)).slice(0, 1));
    // Prefer the head noun: the rule that matches nearest the end of the name leads.
    const pos = tag => { const rule = PHYSICAL_RULES.find(([, t]) => t === tag)[0]; const mm = [...lower.matchAll(new RegExp(rule.source, 'g'))].pop(); return mm ? mm.index : -1; };
    hits.sort((a, b) => pos(b) - pos(a) || cmp(a, b));
    return hits.length ? hits : ['substance'];
};
const decaySentences = desc => (desc ? cleanWiki(desc).split(/(?<=[.!?])\s+/) : []).filter(s => DECAY_RULES.some(([re]) => re.test(s.toLowerCase())));
const symbolicTags = (pathways, name, desc, decayTexts) => {
    const text = `${name} ${(desc ? cleanWiki(desc).split(/(?<=[.!?])\s+/) : []).filter(s => !decayTexts.includes(s)).join(' ')}`.toLowerCase();
    const out = new Map();
    for(const p of pathways) for(const t of PATHWAY_SYMBOLS[p] ?? []) if(!out.has(t)) out.set(t, 'pathway');
    for(const [re, t] of SYMBOL_RULES) if(re.test(text)) out.set(t, out.get(t) === 'pathway' ? 'pathway+keyword' : 'keyword');
    return out;
};
const citesOf = desc => [...(desc ?? '').matchAll(/\{\{Cite Book\|(\d+)\|(\d+)\}\}/g)].map(m => `${m[1]}.${m[2]}`);

// ---- Main -------------------------------------------------------------------------
const wiki = readJson(WIKI);
const luaPage = wiki.pages.find(p => p.title === 'Module:Ingredient/data');
if(!luaPage) throw new Error('Module:Ingredient/data missing from the wiki dump.');
const lua = parseIngredientLua(luaPage.text);
const seqPage = readJson(path.join(SCAN, 'lotm_wiki_sequence_standard_r127043.json'));
const crosswalk = readLines(path.join(SCAN, 'crosswalk_judged.jsonl'));
const bookRows = readLines(path.join(SCAN, 'book_rows.jsonl')).filter(r => r.kind === 'formula');
const pathwayKey = name => slug(name.replace(/ Pathway$/, ''));
const rows = seqPage.rows.filter(r => r.seq >= 2 && r.seq <= 9 && (r.main_ingr || r.supp_ingr));

// Ingredient records, deduped by Lua key.
const ingredients = new Map();
for(const e of lua) {
    if(ingredients.has(e.key)) continue;
    const pathways = uniq(e.category.map(slug)).sort(cmp);
    const decay = decaySentences(e.desc);
    ingredients.set(e.key, {en: e.name, key: e.key, aliases: uniq([e.key, e.name]).filter(a => a !== e.name), pathways, desc: e.desc, decay,
        luaMain: e.main, luaSupp: e.supp});
}
const nameIndex = [...ingredients.values()].map(i => ({ing: i, toks: tokens(i.en)})).filter(x => x.toks.length);
const matchIngredient = text => {
    const toks = tokens(text), joined = ` ${toks.join(' ')} `;
    let best = null;
    for(const {ing, toks: it} of nameIndex) if(joined.includes(` ${it.join(' ')} `) && (!best || it.length > best.toks.length)) best = {ing, toks: it};
    if(best) return best.ing;
    let fuzzy = null, tie = false;
    for(const {ing, toks: it} of nameIndex) {
        if(it.length < 2) continue;
        const share = it.filter(t => toks.includes(t)).length / it.length;
        if(share >= 0.75 && (!fuzzy || share > fuzzy.share)) { fuzzy = {ing, share}; tie = false; } else if(fuzzy && share === fuzzy.share) tie = true;
    }
    return fuzzy && !tie ? fuzzy.ing : null;
};

// Formula rows, slots and quantity stating.
const tierOf = cites => (cites?.book?.length ? 'book' : cites?.wechat?.length ? 'author_post' : 'wiki');
const verdictsFor = new Map();
for(const c of crosswalk) { const k = c.wiki_name; verdictsFor.set(k, [...(verdictsFor.get(k) ?? []), c.verdict]); }
const formulas = [], overridesApplied = [], unmatched = [];
let loose = 0;
for(const row of rows) {
    const pk = pathwayKey(row.pathway), id = `${pk}.${row.seq}`;
    const slots = [];
    const addSlots = (text, role, cites) => {
        let prev = null, n = 0;
        for(const sentence of splitItems(text)) {
            const alt = /^or\s+/i.test(sentence);
            const {qty, rest} = parseQuantity(alt ? sentence.replace(/^or\s+/i, '') : sentence);
            const ing = matchIngredient(rest);
            if(alt && prev) { prev.alternates.push(ing?.key ?? null); if(!ing) unmatched.push({formula: id, text: rest}); continue; }
            const slot = {id: `${id}.${role === 'main' ? 'm' : 'a'}${++n}`, role, qty, ref: ing?.key ?? null, alternates: [], tier: tierOf(cites), text: rest};
            if(!ing) { unmatched.push({formula: id, text: rest}); loose++; }
            slots.push(slot); prev = slot;
        }
    };
    addSlots(row.main_ingr, 'main', row.main_ingr_cites);
    addSlots(row.supp_ingr, 'aux', row.supp_ingr_cites);
    for(const ov of OVERRIDES) {
        if(ov.formula !== row.name) continue;
        for(const slot of slots) {
            if(!ov.ingredient.test(slot.text) && !ov.ingredient.test(ingredients.get(slot.ref)?.en ?? '')) continue;
            overridesApplied.push({id: ov.id, formula: id, slot: slot.id, from: slot.qty, to: {n: ov.qty.n, unit: ov.qty.unit}, tier: ov.tier, note: ov.note});
            slot.qty = {n: ov.qty.n, unit: ov.qty.unit}; slot.tier = ov.tier; slot.override = ov.id;
        }
    }
    formulas.push({id, name: row.name, name_cn: row.name_cn ?? null, pathway: pk, seq: row.seq, tier: {main: tierOf(row.main_ingr_cites), aux: tierOf(row.supp_ingr_cites)},
        cites: {main: row.main_ingr_cites?.named ?? [], aux: row.supp_ingr_cites?.named ?? []}, crosswalk: uniq(verdictsFor.get(row.name) ?? []).sort(cmp), slots});
}
formulas.sort((a, b) => cmp(a.pathway, b.pathway) || b.seq - a.seq);

// Chinese names from the book rows: pair aligned en/zh item lists, match the English half to an ingredient.
const zhVotes = new Map();
const stripZh = zh => zh.replace(/\s*[(（][^)）]*[)）]/g, '').replace(/^[\d一二三四五六七八九十]+(毫升|克|滴|瓣|片|根|块|对|只|枚|颗|个|份|条|粒)?/, '')
    .replace(/[\d一二三四五六七八九十]+(毫升|克|滴|瓣|片|根|块|对|只|枚|颗|个|份|条|粒)?$/, '').trim();
for(const r of bookRows) for(const [en, zh] of [[r.main_en, r.main_zh], [r.aux_en, r.aux_zh]]) {
    if(!Array.isArray(en) || !Array.isArray(zh) || en.length !== zh.length) continue;
    en.forEach((e, i) => {
        const ing = matchIngredient(parseQuantity(e).rest), name = stripZh(zh[i]);
        if(!ing || !name || /^[a-z]/i.test(name)) return;
        const votes = zhVotes.get(ing.key) ?? new Map();
        votes.set(name, (votes.get(name) ?? 0) + 1); zhVotes.set(ing.key, votes);
    });
}

// Usage links (Lua main/supp lists plus parsed slots), quantities, ids, traits.
const rowByName = new Map(seqPage.rows.map(r => [r.name, r]));
const usesOf = new Map([...ingredients.keys()].map(k => [k, new Map()]));
for(const ing of ingredients.values()) {
    for(const [role, list] of [['main', ing.luaMain], ['aux', ing.luaSupp]]) for(const potion of list) {
        const r = rowByName.get(potion);
        usesOf.get(ing.key).set(`${r ? `${pathwayKey(r.pathway)}.${r.seq}` : `?.${slug(potion)}`}:${role}`,
            {formula: r ? `${pathwayKey(r.pathway)}.${r.seq}` : null, potion, seq: r?.seq ?? null, role, from: 'wiki_ingredient_table'});
    }
}
for(const f of formulas) for(const s of f.slots) if(s.ref) {
    const u = usesOf.get(s.ref), k = `${f.id}:${s.role}`;
    u.set(k, {...(u.get(k) ?? {formula: f.id, potion: f.name, seq: f.seq, role: s.role}), from: 'parsed_formula'});
}
const usedId = new Set(), idOf = new Map();
for(const ing of [...ingredients.values()].sort((a, b) => cmp(a.key, b.key))) {
    const votes = [...(zhVotes.get(ing.key) ?? [])].sort((a, b) => b[1] - a[1] || cmp(a[0], b[0]));
    const cn = votes.length ? votes[0][0] : null;
    let id = cn ? `zh.${cn}` : `en.${slug(ing.en)}`;
    if(usedId.has(id)) id = `en.${slug(ing.en)}`;
    if(usedId.has(id)) id += `_${usedId.size}`;
    usedId.add(id); idOf.set(ing.key, id); ing.cn = cn; ing.id = id; ing.idSource = id.startsWith('zh.') ? 'book_zh' : 'wiki_en';
}
const qtyOf = new Map();
for(const f of formulas) for(const s of f.slots) if(s.ref) {
    s.ref = idOf.get(s.ref); s.alternates = s.alternates.map(a => (a ? idOf.get(a) : null));
    const list = qtyOf.get(s.ref) ?? []; list.push({formula: f.id, role: s.role, slot: s.id, qty: s.qty, tier: s.tier, ...(s.override ? {override: s.override} : {})}); qtyOf.set(s.ref, list);
}
const byId = new Map([...ingredients.values()].map(i => [i.id, i]));
const traitsOf = ing => {
    const uses = [...usesOf.get(ing.key).values()];
    const physical = physicalTags(ing.en, ing.desc ? cleanWiki(ing.desc) : '');
    const quantities = qtyOf.get(ing.id) ?? [];
    const functional = [];
    if(uses.some(u => u.role === 'main')) functional.push('main_ingredient');
    if(uses.some(u => u.role === 'aux')) functional.push('auxiliary');
    if(physical.some(t => ['water', 'juice'].includes(t)) || quantities.some(q => q.role === 'aux' && q.qty?.unit === 'ml')) functional.push('solvent');
    if(quantities.some(q => q.role === 'aux' && ['drop', 'g'].includes(q.qty?.unit)) && !functional.includes('solvent')) functional.push('catalyst');
    if(quantities.some(q => q.qty?.unit === 'pair' || q.qty?.unit === 'block') || physical.includes('heart') || physical.includes('brain')) functional.push('complete_part');
    return {physical, functional: uniq(functional).sort(cmp), symbolic: symbolicTags(ing.pathways, ing.en, ing.desc, ing.decay)};
};
const out = [];
for(const ing of [...ingredients.values()].sort((a, b) => cmp(a.id, b.id))) {
    const traits = traitsOf(ing), uses = [...usesOf.get(ing.key).values()].sort((a, b) => cmp(a.potion, b.potion) || cmp(a.role, b.role));
    const cites = citesOf(ing.desc), desc = ing.desc ? cleanWiki(ing.desc) : null;
    out.push({id: ing.id, en: ing.en, cn: ing.cn, aliases: ing.aliases, idSource: ing.idSource, pathways: ing.pathways,
        pathwaysTier: 'wiki', uses, quantities: qtyOf.get(ing.id) ?? [],
        decay: ing.decay.map(text => ({kind: DECAY_RULES.find(([re]) => re.test(text.toLowerCase()))[1], text, tier: 'wiki', cites})),
        description: desc, descriptionTier: 'wiki', descriptionCites: cites,
        traits: {physical: traits.physical, functional: traits.functional, symbolic: [...traits.symbolic.keys()].sort(cmp)},
        traitSources: {physical: 'rule:name_keywords', functional: 'rule:usage', symbolic: Object.fromEntries([...traits.symbolic].sort((a, b) => cmp(a[0], b[0])))},
        traitStatus: 'proposal'});
}
// Slot traits: the canonical ingredient's layers when matched, else derived from the stated item text (the wiki table lacks many formula items).
const slotFunctional = (slot, physical) => uniq([slot.role === 'main' ? 'main_ingredient' : 'auxiliary',
    ...(slot.role === 'aux' && (physical.some(t => ['water', 'juice'].includes(t)) || slot.qty?.unit === 'ml') ? ['solvent'] : []),
    ...(slot.role === 'aux' && ['drop', 'g'].includes(slot.qty?.unit) && !physical.some(t => ['water', 'juice'].includes(t)) ? ['catalyst'] : []),
    ...(slot.qty?.unit === 'pair' || slot.qty?.unit === 'block' || physical.some(t => ['heart', 'brain'].includes(t)) ? ['complete_part'] : [])]).sort(cmp);
const outById = new Map(out.map(i => [i.id, i]));
let derivedSlots = 0;
for(const f of formulas) for(const s of f.slots) {
    const ref = s.ref ? outById.get(s.ref) : null;
    const physical = ref ? ref.traits.physical : physicalTags(s.text, '');
    const symbolic = ref ? ref.traits.symbolic : [...symbolicTags([f.pathway], s.text, '', []).keys()].sort(cmp);
    s.traits = {physical, functional: slotFunctional(s, physical), symbolic};
    s.traitsFrom = ref ? 'ingredient' : 'item_text';
    if(!ref) derivedSlots++;
}
const vocab = {
    physical: PHYSICAL.map(([id, parents]) => ({id, parents})), functional: FUNCTIONAL.map(id => ({id, parents: []})),
    symbolic: uniq([...Object.values(PATHWAY_SYMBOLS).flat(), ...SYMBOL_RULES.map(r => r[1])]).sort(cmp).map(id => ({id, parents: []}))};
const used = layer => uniq(out.flatMap(i => i.traits[layer])).sort(cmp);
const pack = {meta: {pack: 'lotm-ingredients', version: 1, status: 'private, uncommitted source data; trait layers are proposals', sources: {
        wikiRevision: seqPage.revid, ingredientTable: 'wiki Module:Ingredient/data', formulaTable: 'wiki Module:Sequence/standard', bookRows: 'census book_rows.jsonl'},
        tiers: ['book', 'author_post', 'wiki'], units: 'as stated (TSW9): ml, g, drop, piece, pair, petal, ...; never converted'},
    vocab, ingredients: out, formulas, overrides: overridesApplied};
fs.mkdirSync(path.dirname(OUT), {recursive: true});
fs.writeFileSync(OUT, JSON.stringify(pack, null, 1) + '\n');
const slotCount = formulas.reduce((n, f) => n + f.slots.length, 0);
console.log(JSON.stringify({out: OUT, ingredients: out.length, luaEntries: lua.length, withCn: out.filter(i => i.cn).length, formulas: formulas.length,
    slots: slotCount, mainSlots: formulas.reduce((n, f) => n + f.slots.filter(s => s.role === 'main').length, 0), unmatchedSlots: loose, derivedSlots,
    overrides: overridesApplied.map(o => `${o.id}:${o.formula}`), tagsUsed: {physical: used('physical').length, functional: used('functional').length, symbolic: used('symbolic').length},
    vocab: {physical: vocab.physical.length, functional: vocab.functional.length, symbolic: vocab.symbolic.length}, withDecay: out.filter(i => i.decay.length).length,
    unusedIngredients: out.filter(i => !i.uses.length).length, substanceFallback: out.filter(i => i.traits.physical[0] === 'substance').length}, null, 1));
if(process.env.LOTM_DEBUG) console.log(unmatched.slice(0, 60));
