#!/usr/bin/env node
// Scores the Hogwarts ingredient label pass (scripts/label_pass.mjs hp_ingredients, and the Haiku second read in
// private/hp_ingredients_haiku.json) and prints counts only; the replies stay private.
// Two comparison sets, both frozen before the first call (2026-11-16):
//   AUTHORED  the 20 runs-authored rows, mapped from their owner code onto the pass vocabulary (axes, roles, form,
//             potions). Axis and role numbers are authored dials, so this scores presence, not level.
//   NOVEL     the catalogue's linked observations (docs/research/hogwarts-potion-evidence-2026-11-11), joined through
//             each catalogue row's observation_ids: membership, use and admission rows score potions, preparation
//             rows score forms, exposure and outcome rows score hazards.
// The held-out split is the wiki-tier one (GKM429): sha1(id)[0] < 0x33. No comparison row is a prompt example.
// Usage: node scripts/hp_ingredient_labels_check.mjs [--json]
import {readFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';

const root = new URL('..', import.meta.url).pathname;
const priv = `${root}docs/research/advancement-aspects-2026-11-16/private/`;
const EV = `${root}docs/research/hogwarts-potion-evidence-2026-11-11/`;
export const heldOut = id => createHash('sha1').update(id).digest()[0] < 0x33;
const slug = s => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

// Owner code mapped onto the pass vocabulary. form null = the owner names no form.
const PJ = ['polyjuice_potion'], CB = ['cure_for_boils'], LOVE = ['love_potion', 'amortentia'];  // any one listed potion counts
export const AUTHORED = {
    'hp.ingredient.lacewing_fly': {forms: ['stewed'], potions: PJ, at: 'src/world_packs/book_hp_pack.js formula slot lacewing'},
    'hp.ingredient.leech': {forms: ['raw'], potions: PJ, at: 'book_hp_pack.js slot leeches'},
    'hp.ingredient.fluxweed': {forms: ['raw'], potions: PJ, at: 'book_hp_pack.js slot fluxweed (full moon)'},
    'hp.ingredient.knotgrass': {forms: ['raw'], potions: PJ, at: 'book_hp_pack.js slot knotgrass'},
    'hp.ingredient.horn_of_bicorn': {forms: ['powdered'], potions: PJ, at: 'book_hp_pack.js slot bicorn'},
    'hp.ingredient.boomslang_skin': {forms: ['shredded'], potions: PJ, at: 'book_hp_pack.js slot boomslang'},
    'hp.ingredient.human_hair': {roles: ['identity'], potions: PJ, at: 'book_hp_pack.js book.hp.cat.donor_sample'},
    'hp.ingredient.cat_hair': {roles: ['identity'], potions: PJ, at: 'book_hp_pack.js donor sample'},
    'hp.ingredient.bone_meal': {roles: ['abrasive'], forms: ['powdered'], at: 'src/hp_ingredient_substitution.js native-bonemeal work 1'},
    'hp.ingredient.nettle': {axes: ['mend'], forms: ['dried'], potions: CB, at: 'src/hp_lead_making.js Dried nettles cure 300'},
    'hp.ingredient.snake_fang': {axes: ['mend'], forms: ['crushed'], potions: CB, at: 'hp_lead_making.js Crushed snake fangs cure 250'},
    'hp.ingredient.horned_slug': {axes: ['mend'], forms: ['stewed'], potions: CB, at: 'hp_lead_making.js Stewed horned slugs cure 200'},
    'hp.ingredient.porcupine_quill': {axes: ['bite'], roles: ['heat-reactive'], potions: CB, at: 'hp_lead_making.js Porcupine quills sting 500, function.heat_reactive'},
    'hp.ingredient.sopophorous_bean': {axes: ['calm'], forms: ['crushed'], potions: ['draught_of_living_death'], at: 'src/hp_potion_reactions.js crush or slice'},
    'hp.ingredient.ashwinder_egg': {axes: ['mind'], roles: ['fixative'], forms: ['frozen'], potions: LOVE, at: 'src/potion_working_rules.js frozen_egg sealed_egg 600, bind-fixative'},
    'hp.ingredient.rose_petal': {axes: ['mind'], roles: ['fixative'], potions: LOVE, at: 'potion_working_rules.js rose rose_oil 400, bind-fixative'},
    'hp.ingredient.flobberworm_mucus': {roles: ['thickener'], at: 'potion_working_rules.js mucus thickener 700'},
    'hp.ingredient.glumbumble_treacle': {axes: ['calm'], potions: ['alihotsy_draught'], at: 'potion_working_rules.js treacle 800, relieves hysteria'},
    'hp.ingredient.alihotsy': {axes: ['mind'], potions: ['alihotsy_draught'], at: 'potion_working_rules.js alihotsy 500, hysteria'},
    'hp.ingredient.water': {roles: ['carrier'], at: 'potion_working_rules.js water'},
};

export const FORM_WORDS = ['sliced', 'crushed', 'powdered', 'dried', 'stewed', 'shredded', 'juiced', 'chopped', 'pickled', 'diced', 'grated',
    'ground', 'minced', 'infused', 'infusion', 'boiled', 'frozen', 'whole', 'raw', 'squeezed', 'peeled', 'weighed'];
const formOf = text => FORM_WORDS.filter(w => new RegExp(`\\b${w}\\b|\\b${w.replace(/ed$/, '')}`, 'i').test(text))
    .map(w => w === 'infusion' ? 'infused' : w);
export const normForm = f => { const w = f.toLowerCase(); return FORM_WORDS.find(x => w.includes(x.replace(/ed$/, '')))?.replace(/^infusion$/, 'infused') ?? w; };
// Potion names resolve to potion-ledger ids through the wiki's own redirects (private/hp_redirects.json, titles only,
// extracted from the same dump), then by slug, then singular. Unresolved names stay unresolved.
const potionIds = new Set(readFileSync(`${root}docs/coverage/hp_potions.jsonl`, 'utf8').trim().split('\n').map(l => JSON.parse(l).id));
let redirects;
const redirectOf = t => (redirects ??= (() => { const f = `${priv}hp_redirects.json`;
    const raw = existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : {};
    return new Map(Object.entries(raw).map(([a, b]) => [a.toLowerCase(), b])); })()).get(t.toLowerCase());
export function resolvePotion(name) {
    const base = name.replace(/\s*\(.*?\)\s*/g, ' ').replace(/^the\s+/i, '').trim();
    for (const t of [base, base.replace(/s$/, ''), base.replace(/s\b/g, '')]) {
        for (const title of [redirectOf(t), t]) if (title && potionIds.has(`hp.potion.${slug(title)}`)) return `hp.potion.${slug(title)}`;
    }
    return null;
}
const potionMatch = (got, want) => got.some(g => resolvePotion(g) === `hp.potion.${want}`);

export function novelSet() {
    const lines = file => readFileSync(file, 'utf8').trim().split('\n').map(l => JSON.parse(l));
    const obs = new Map(lines(`${EV}observations.jsonl`).map(o => [o.id, o]));
    const out = {};
    for (const c of lines(`${EV}catalogue.jsonl`).filter(c => c.kinds.includes('ingredient_related') && c.observation_ids.length)) {
        const rows = c.observation_ids.map(id => obs.get(id)).filter(Boolean);
        const potions = [...new Set(rows.filter(o => ['membership', 'use', 'admission', 'preparation', 'identity_binding', 'quantity', 'operation'].includes(o.field)
            && potionIds.has(`hp.potion.${o.subject}`)).map(o => o.subject))];
        const forms = [...new Set(rows.filter(o => o.field === 'preparation').flatMap(o => formOf(o.observation)))];
        const hazard = rows.some(o => ['exposure', 'outcome'].includes(o.field) && o.ingredient);
        out[`hp.ingredient.${slug(c.title)}`] = {potions, forms, hazard};
    }
    return out;
}

function load(file) {
    if (!existsSync(file)) return {};
    return Object.fromEntries(Object.entries(JSON.parse(readFileSync(file, 'utf8'))).filter(([, r]) => r.reply).map(([id, r]) => [id, r.reply]));
}

export function score(rows, ids = Object.keys(rows)) {
    const r = {};
    const auth = ids.filter(id => AUTHORED[id] && rows[id]);
    const has = (id, key, list) => list.every(v => (rows[id][key] ?? []).some(x => x[key === 'axes' ? 'axis' : 'role'] === v));
    const axisRows = auth.filter(id => AUTHORED[id].axes), roleRows = auth.filter(id => AUTHORED[id].roles);
    const formRows = auth.filter(id => AUTHORED[id].forms), potRows = auth.filter(id => AUTHORED[id].potions);
    r.authored = {rows: auth.length,
        axes: `${axisRows.filter(id => has(id, 'axes', AUTHORED[id].axes)).length} of ${axisRows.length}`,
        roles: `${roleRows.filter(id => has(id, 'roles', AUTHORED[id].roles)).length} of ${roleRows.length}`,
        forms: `${formRows.filter(id => AUTHORED[id].forms.some(f => rows[id].preparation.some(p => normForm(p.form) === f))).length} of ${formRows.length}`,
        potions: `${potRows.filter(id => AUTHORED[id].potions.some(p => potionMatch(rows[id].potions.map(x => x.potion), p))).length} of ${potRows.length}`,
        extraAxes: auth.reduce((n, id) => n + rows[id].axes.filter(a => !(AUTHORED[id].axes ?? []).includes(a.axis)).length, 0)};
    const novel = novelSet();
    const nv = ids.filter(id => novel[id] && rows[id]);
    const pot = nv.filter(id => novel[id].potions.length), frm = nv.filter(id => novel[id].forms.length), hz = nv.filter(id => novel[id].hazard);
    const potionPairs = pot.flatMap(id => novel[id].potions.map(p => potionMatch(rows[id].potions.map(x => x.potion), p)));
    r.novel = {rows: nv.length,
        potionsAnyHit: `${pot.filter(id => novel[id].potions.some(p => potionMatch(rows[id].potions.map(x => x.potion), p))).length} of ${pot.length}`,
        potionPairs: `${potionPairs.filter(Boolean).length} of ${potionPairs.length}`,
        formsAnyHit: `${frm.filter(id => novel[id].forms.some(f => rows[id].preparation.some(p => normForm(p.form) === f))).length} of ${frm.length}`,
        hazardStated: `${hz.filter(id => rows[id].hazards.value).length} of ${hz.length}`};
    return r;
}

export function agreement(a, b, ids) {
    const both = ids.filter(id => a[id] && b[id]);
    const set = (r, key, k) => new Set((r[key] ?? []).map(x => x[k]));
    let axisSame = 0, axisA = 0, axisB = 0, axisBoth = 0, kindSame = 0;
    for (const id of both) {
        const x = set(a[id], 'axes', 'axis'), y = set(b[id], 'axes', 'axis');
        if ([...x].sort().join() === [...y].sort().join()) axisSame++;
        for (const v of x) y.has(v) ? axisBoth++ : axisA++;
        for (const v of y) if (!x.has(v)) axisB++;
        if (a[id].kind.value === b[id].kind.value) kindSame++;
    }
    return {rows: both.length, kindSame, axisSetsSame: axisSame, axisBoth, axisLunaOnly: axisA, axisHaikuOnly: axisB};
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
    const luna = load(`${priv}hp_ingredients_luna.json`), haiku = load(`${priv}hp_ingredients_haiku.json`);
    const ids = Object.keys(luna);
    const tally = vs => vs.reduce((m, v) => ({...m, [v]: (m[v] ?? 0) + 1}), {});
    const report = {rows: ids.length, heldOut: ids.filter(heldOut).length,
        kinds: tally(ids.map(id => luna[id].kind.value)), axes: tally(ids.flatMap(id => luna[id].axes.map(a => a.axis))),
        roles: tally(ids.flatMap(id => luna[id].roles.map(a => a.role))),
        withAxis: ids.filter(id => luna[id].axes.length).length, withPotion: ids.filter(id => luna[id].potions.length).length,
        withForm: ids.filter(id => luna[id].preparation.length).length, withHazard: ids.filter(id => luna[id].hazards.value).length,
        luna: score(luna), lunaHeldOut: score(luna, ids.filter(heldOut))};
    if (Object.keys(haiku).length) Object.assign(report, {haiku: score(haiku, Object.keys(haiku)),
        agreement: agreement(luna, haiku, Object.keys(haiku)), agreementHeldOut: agreement(luna, haiku, Object.keys(haiku).filter(heldOut))});
    console.log(JSON.stringify(report, null, 1));
}
