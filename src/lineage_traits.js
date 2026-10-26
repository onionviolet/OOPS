// W3 G24/G28: inherited qualities from two parents. Pure: no storage, no DOM, no clock.
// A small allele model (Grim Brood, BATCH_COMPANIONS): each quality is one locus with two
// alleles per individual. The phenotype (what shows) is always visible; the genotype (which
// alleles are carried) is learned by testing, or deduced from a child. Every number here is
// a default with a reason, set per profile (AD1, AD38), not a rule for all worlds.
import {check} from './basics.js';

// mode: dominant = one strong allele shows it; recessive = two needed; incomplete = mild at
// one, full at two. fickle = the strong allele passes on only part of the time (the "odd gift").
// Frontier effects follow visible phenotype, whether its hidden allele was tested or not.
export const LOCI = Object.freeze({
    wind: Object.freeze({label: 'Long wind', mode: 'dominant', strong: 'W', plain: 'w', effect: 'An enduring frame holds 4% more stamina.'}),
    eye: Object.freeze({label: 'Keen eye', mode: 'recessive', strong: 'E', plain: 'e', effect: 'A watchful eye improves intuition by 4%.'}),
    nerve: Object.freeze({label: 'Steady nerve', mode: 'incomplete', strong: 'N', plain: 'n', effect: 'Steady movement improves agility by 2% per showing share.'}),
    knack: Object.freeze({label: 'Odd knack', mode: 'recessive', strong: 'K', plain: 'k', fickle: true, effect: 'A rare hand knack improves dexterity by 4%.'}),
});
const LOCUS_IDS = Object.freeze(Object.keys(LOCI));

// Dials per profile. `household` supplies ordinary people; `creature` supplies
// the kept Cloudseed brood. Both reuse the same actual two-parent allele model.
export const LINEAGE_PROFILES = Object.freeze({
    household: Object.freeze({id: 'household', mutation: 0.03, fickle: 0.5, inbreeding: 0.25, reason: 'Ordinary families: rare chance mixing, a mild cost for close kin.'}),
    creature: Object.freeze({id: 'creature', mutation: 0.08, fickle: 0.5, inbreeding: 0.55, reason: 'Kept beasts breed faster and show closer-kin costs sooner (Grim Brood numbers, a proposal).'}),
});
export const DEFAULT_PROFILE = 'household';
export const profile = (id = DEFAULT_PROFILE) => { check(Object.hasOwn(LINEAGE_PROFILES, id), 'Unknown lineage profile.'); return LINEAGE_PROFILES[id]; };
export const TEST_COST = 6;
export const MAX_MEMBERS = 64;

// Seeded random so the ended-life preview and the real heir save agree.
export function seeded(seed) {
    let h = 1779033703 ^ String(seed).length;
    for (const ch of String(seed)) { h = Math.imul(h ^ ch.charCodeAt(0), 3432918353); h = h << 13 | h >>> 19; }
    let a = h >>> 0;
    return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

const strongCount = (l, genes) => genes.filter(a => a === LOCI[l].strong).length;
// 0 = absent, 1 = mild, 2 = full. Dominant and recessive loci only show 0 or 2.
export function level(l, genes) {
    const n = strongCount(l, genes), mode = LOCI[l].mode;
    return mode === 'dominant' ? (n ? 2 : 0) : mode === 'recessive' ? (n === 2 ? 2 : 0) : n;
}
export const phenotype = genes => Object.fromEntries(LOCUS_IDS.map(l => [l, level(l, genes[l])]));
export function inheritedStatMultipliers(line) {
    const self=line?.members.find(m=>m.id===line.selfId);if(!self)return {};
    const result={},shown=phenotype(self.genes);
    for(const [locus,stat] of [['wind','max_stamina'],['eye','intuition'],['nerve','agility'],['knack','dexterity']])
        if(shown[locus])result[stat]=1+shown[locus]*0.02;
    return result;
}

export function foundingGenes(rng) {
    return Object.fromEntries(LOCUS_IDS.map(l => [l, [0, 1].map(() => rng() < 0.4 ? LOCI[l].strong : LOCI[l].plain)]));
}
export function member(id, name, sex, genes, extra = {}) {
    return {id, name, sex, genes, tested: [], sire: null, dam: null, bornAt: 0, ...extra};
}

// Pedigree kinship by the recursive method; the younger (later in the registry) is expanded.
export function kinship(members, a, b, depth = 6) {
    if (!a || !b || depth < 0) return 0;
    const order = id => members.findIndex(m => m.id === id), A = members[order(a)], B = members[order(b)];
    if (!A || !B) return 0;
    if (a === b) return 0.5 * (1 + kinship(members, A.sire, A.dam, depth - 1));
    const [y, o] = order(a) > order(b) ? [A, b] : [B, a];
    return 0.5 * (kinship(members, y.sire, o, depth - 1) + kinship(members, y.dam, o, depth - 1));
}

// One child. ctx: {rng, id, name, sex, bornAt, profile?, members?}. Returns the child and the
// coefficient used. Inbreeding drops a strong allele (never adds one), so close kin lose qualities.
export function breed(sire, dam, {rng, id, name, sex, bornAt = 0, profile: pid = DEFAULT_PROFILE, members = []}) {
    const p = profile(pid), coi = kinship([...members, sire, dam].filter((m, i, all) => all.findIndex(x => x.id === m.id) === i), sire.id, dam.id);
    const genes = {};
    for (const l of LOCUS_IDS) {
        const def = LOCI[l];
        genes[l] = [sire, dam].map(parent => {
            let allele = parent.genes[l][rng() < 0.5 ? 0 : 1];
            if (allele === def.strong && def.fickle && rng() >= p.fickle) allele = def.plain;
            if (allele === def.strong && rng() < coi * p.inbreeding) allele = def.plain;
            if (rng() < p.mutation) allele = allele === def.strong ? def.plain : def.strong;
            return allele;
        });
    }
    return {child: member(id, name, sex, genes, {sire: sire.id, dam: dam.id, bornAt}), coi};
}

// What the player may see of one locus: the phenotype, plus the alleles that the phenotype or
// a test makes known; a hidden allele is '?' and its letter is never in the view.
export function locusView(m, l) {
    const def = LOCI[l], g = m.genes[l], lv = level(l, g), tested = m.tested.includes(l);
    const shows = lv === 0 ? 'absent' : lv === 1 ? 'mild' : 'full';
    let alleles;
    if (tested || def.mode === 'incomplete') alleles = [...g].sort();
    else if (def.mode === 'recessive') alleles = lv === 2 ? [def.strong, def.strong] : [def.plain, '?'];
    else alleles = lv === 0 ? [def.plain, def.plain] : [def.strong, '?'];
    const known = !alleles.includes('?');
    return {locus: l, label: def.label, shows, level: lv, alleles, known, description: lv ? {wind:'An enduring constitution helps sustain physical effort.',eye:'A watchful eye picks out details that others miss.',nerve:lv===1?'Your movements show a little inherited steadiness.':'A steady nerve keeps your movements sure.',knack:'Fine control comes unusually naturally.'}[l] : 'This inherited quality does not visibly show.', effect: lv ? l === 'nerve' ? `Agility +${lv*2}%.` : def.effect : ''};
}
export const memberView = m => LOCUS_IDS.map(l => locusView(m, l));
export const hiddenLoci = m => LOCUS_IDS.filter(l => !locusView(m, l).known);

// A test reveals one locus (the first still hidden unless named). Returns a new member.
export function testMember(m, l = hiddenLoci(m)[0]) {
    check(l && LOCI[l], 'Nothing left to test.');
    check(!locusView(m, l).known, 'That quality is already known.');
    return {...m, tested: [...m.tested, l]};
}

// A child's phenotype teaches about its parents: a recessive that shows means both parents carry
// it; a dominant that is absent means neither does. Returns members with those loci marked known.
export function learnFromChild(parents, child) {
    return parents.map(p => {
        const learned = LOCUS_IDS.filter(l => {
            if (p.tested.includes(l)) return false;
            const def = LOCI[l], lv = level(l, child.genes[l]);
            return (def.mode === 'recessive' && lv === 2 && locusView(p, l).alleles.includes('?')) || (def.mode === 'dominant' && lv === 0 && locusView(p, l).alleles.includes('?'));
        });
        return learned.length ? {...p, tested: [...p.tested, ...learned]} : p;
    });
}

// ---- save slice: {schema:1, seed, profile, selfId, members:[...]} (namespaced `inherited_traits`) ----
const ID = /^[\w-]{1,32}$/;
export function validateLineage(s) {
    if (s == null) return;
    const bad = r => { throw new Error(`Invalid inherited traits: ${r}`); };
    if (typeof s !== 'object' || s.schema !== 1 || typeof s.seed !== 'string' || !Object.hasOwn(LINEAGE_PROFILES, s.profile) || !Array.isArray(s.members) || s.members.length > MAX_MEMBERS) bad('shape');
    if (s.selfId != null && !s.members.some(m => m.id === s.selfId)) bad('self');
    if(s.cultivationRoot!=null){const r=s.cultivationRoot;if(Object.keys(r).sort().join(',')!=='flow,still,tested'||!['flow','still'].every(k=>Number.isSafeInteger(r[k])&&r[k]>=0&&r[k]<=4)||typeof r.tested!=='boolean')bad('cultivation root');}
    if(s.bodyBinding!=null&&(typeof s.bodyBinding!=='string'||s.bodyBinding.length>240))bad('body binding');
    for (const m of s.members) {
        if (!ID.test(m?.id) || typeof m.name !== 'string' || m.name.length > 40 || !['m', 'f'].includes(m.sex) || !Number.isFinite(m.bornAt)) bad('member');
        if (!m.genes || LOCUS_IDS.some(l => !Array.isArray(m.genes[l]) || m.genes[l].length !== 2 || m.genes[l].some(a => a !== LOCI[l].strong && a !== LOCI[l].plain))) bad('genes');
        if (!Array.isArray(m.tested) || m.tested.some(l => !LOCI[l]) || new Set(m.tested).size !== m.tested.length) bad('tested');
        for (const k of ['sire', 'dam']) if (m[k] != null && !ID.test(m[k])) bad(k);
    }
    if (new Set(s.members.map(m => m.id)).size !== s.members.length) bad('duplicate ids');
}

// First founding: the player and the two parents. Names are neutral placeholders; the seed is
// the chronicle identity so the same life always draws the same line.
export function foundLine(seed, selfName = 'You', pid = DEFAULT_PROFILE) {
    const rng = seeded(`${seed}:found`);
    const sire = member('father', 'Your father', 'm', foundingGenes(rng), {bornAt: -40 * 360 * 1440}),
        dam = member('mother', 'Your mother', 'f', foundingGenes(rng), {bornAt: -38 * 360 * 1440});
    const {child} = breed(sire, dam, {rng, id: 'self', name: selfName, sex: rng() < 0.5 ? 'm' : 'f', bornAt: -18 * 360 * 1440, profile: pid});
    return {schema: 1, seed: String(seed), profile: pid, selfId: 'self', members: [sire, dam, child]};
}

// The heir at life end: the recorded kin member if named, otherwise a seeded cross of the self
// and the other parent (the recorded partner, else an unrecorded one drawn from the seed: a
// dial, reason: most lives leave a partner nobody tracked). Returns a re-rooted slice. Pure.
export function heirLine(slice, {heirId = null, at = 0, tag = ''} = {}) {
    validateLineage(slice);
    const members = structuredClone(slice.members), self = members.find(m => m.id === slice.selfId);
    let heir = heirId ? members.find(m => m.id === heirId) : null;
    if (!heir && self) {
        const rng = seeded(`${slice.seed}:${tag}:heir`), partner = members.find(m => m.id === slice.partnerId)
            ?? member(`p${members.length}`, 'Their partner', self.sex === 'm' ? 'f' : 'm', foundingGenes(rng), {bornAt: self.bornAt});
        if (!members.some(m => m.id === partner.id)) members.push(partner);
        const sex = rng() < 0.5 ? 'm' : 'f', id = `h${members.length}`;
        const made = breed(self, partner, {rng, id, name: `Heir ${members.length}`, sex, bornAt: at - 18 * 360 * 1440, profile: slice.profile, members});
        const [s2, p2] = learnFromChild([self, partner], made.child);
        members[members.findIndex(m => m.id === s2.id)] = s2; members[members.findIndex(m => m.id === p2.id)] = p2;
        heir = made.child; members.push(heir);
    }
    while (members.length > MAX_MEMBERS) { const i = members.findIndex(m => m.id !== heir?.id && m.id !== slice.selfId); if (i < 0) break; members.splice(i, 1); }
    return {schema: 1, seed: slice.seed, profile: slice.profile, selfId: heir?.id ?? null, members};
}
export const heirQualityLines = (slice, id) => {
    const m = slice?.members.find(x => x.id === id);
    return m ? memberView(m).filter(v => v.level).map(v => `${v.label}${v.shows === 'mild' ? ' (mild)' : ''}`) : [];
};
