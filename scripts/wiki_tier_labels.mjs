#!/usr/bin/env node
// Wiki-tier labels (GKM445): normalises the private Luna label passes (scripts/label_pass.mjs) into
// docs/coverage/wiki_tier_labels.json, which the Gu and potion ledger builds read. Only normalised values,
// locators and speakers are committed; the paraphrases stay in the gitignored private folder. The held-out
// split (GKM429) is fixed by hash: a row whose sha1(id) starts below 0x33 (about a fifth) is held out, and
// any later rule fitted to these labels (function words, diet defaults, route words) fits on the rest and
// reports held-out agreement apart. The ledgers fold every row because their tables were not fitted here.
// Usage: node scripts/wiki_tier_labels.mjs [--gu-kinds-only]
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {HP_POTION_EFFECTS, assemblePotionEffect} from '../src/world_packs/brew_effects_pack.js';
import {createHash} from 'node:crypto';
import {kindWordFunction, keywordFunction} from './gu_function_words.mjs';
import {potionFamily} from './b_coverage_ledgers.mjs';
import {resolvePotion, normForm, FORM_WORDS} from './hp_ingredient_labels_check.mjs';

const root = new URL('..', import.meta.url).pathname;
// LABEL_SOURCE_ROOT: a checkout holding the gitignored private folders, for a worktree that lacks them.
const src = process.env.LABEL_SOURCE_ROOT ? `${process.env.LABEL_SOURCE_ROOT.replace(/\/$/, '')}/` : root;
const priv = `${src}docs/research/advancement-aspects-2026-11-16/private/`;
const index = JSON.parse(readFileSync(`${src}docs/research/novels/reverend-insanity/private/rule-derivation-2026-11-11/gu-identities.json`, 'utf8'));
const read = name => JSON.parse(readFileSync(`${priv}${name}_luna.json`, 'utf8'));
// Follow-up passes (scripts/label_followups.mjs), scored by scripts/label_followups_check.mjs on 2026-11-16.
const followup = name => existsSync(`${priv}${name}_followup.json`) ? Object.fromEntries(Object.entries(JSON.parse(
    readFileSync(`${priv}${name}_followup.json`, 'utf8'))).filter(([, r]) => r.reply).map(([id, r]) => [id, r.reply])) : {};
const famPass = followup('gu_family'), dietPass = followup('gu_diet'), movePass = followup('move_check'), sentencePass = followup('hp_sentence');
const heldOut = id => createHash('sha1').update(id).digest()[0] < 0x33;
const at = f => f?.value ? {locator: f.locator.replace(/^\[|\]$/g, ''), speaker: f.speaker} : null;
const sorted = obj => Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)));

// Rank: the lowest stated rank, the ledger's existing meaning. "At least N" is a lower bound; a value with
// "?" or "unknown" in it gives no rank, since its numbers may be upper bounds.
export function normaliseRank(text) {
    const t = (text ?? '').trim();
    if (!t) return null;
    const lower = /\bat least (?:rank )?([1-9])\b/i.exec(t);
    if (lower) return {rank: Number(lower[1]), basis: 'wiki-tier-lower-bound'};
    if (/\?|unknown|uncertain|unclear/i.test(t)) return null;
    const nums = [...t.matchAll(/(?<![\d.])([1-9])(?![\d.])/g)].map(m => Number(m[1]));
    if (!nums.length) return null;
    return {rank: Math.min(...nums), basis: nums.length > 1 ? 'wiki-tier-lowest' : 'wiki-tier-stated'};
}

// Reviewed wiki effects for the 2026-11-24 Gu blockers (PC7). Map the stated operation, not the name.
// A gap names the missing operation and its likely owner. It supplies no executable function.
const guEffectFamilies = {'fierce-wind': 'amplify'};
const guEffectGaps = [
    ["K", "No standalone effect stated. The source names a formation, recipe or killer-move role.", [
        'permanence', 'fight', 'candidate:crescent-moon-gu',
        'candidate:derivation-gu', 'candidate:formation-heart-gu', 'candidate:profound-ice-gu',
        'candidate:qi-flow-gu', 'candidate:star-shoot-gu', 'fandom:Careful_Gu',
        'fandom:Tortoise_Head_Gu', 'fandom:Sun_and_Moon_Temple', 'fandom:Fire_Crow_Gu',
        'fandom:Effect_Gu', 'fandom:Heaven_Qi_Gu', 'fandom:Sweat',
    ]],
    ["K", "Bind or release a durable restraint or confinement with its own exit conditions.", [
        'reputation-restriction', 'fandom:Ghost_Hitting_Wall',
    ]],
    ["W", "Transfer multiple holders to a sealed space and release them on an outcome or timeout.", [
        'candidate:battle-space-gu',
    ]],
    ["A/L", "Bind a living creature’s obedience to the controller through its soul and handle its death.", [
        'candidate:bear-enslavement-gu', 'candidate:bull-enslavement-gu', 'candidate:dog-enslavement-gu',
        'candidate:fox-enslavement-gu', 'candidate:tiger-enslavement-gu', 'candidate:wolf-enslavement-gu',
    ]],
    ["L", "Change a holder’s body or appearance without substituting physical strength or healing.", [
        'candidate:black-hair-gu', 'candidate:blue-face-gu', 'candidate:demon-ferret-blood',
        'candidate:demon-ferret-bone', 'fandom:Big_Immortal_Gu',
    ]],
    ["K/L", "Repair a damaged Gu through a composed working.", [
        'candidate:bone-bamboo-gu',
    ]],
    ["F", "Store time and debit it to shorten a refinement.", [
        'candidate:day-gu',
    ]],
    ["A", "Create and manage typed thoughts, wills or intents with their own persistence and behavior.", [
        'candidate:deliberate-will-gu', 'candidate:malicious-thought-gu', 'candidate:malicious-will-gu',
        'candidate:play-will-gu', 'fandom:Flash_Inspiration_Gu', 'fandom:Evil_Intent_Gu',
        'fandom:Reckless_Intent_Gu', 'fandom:Changing_Intent_Gu', 'fandom:Cold_Intent_Gu',
        'fandom:Chaotic_Intent_Gu', 'fandom:Keep_Will_Gu', 'fandom:New_Will_Gu',
        'fandom:Kind_Thought_Gu', 'fandom:Longing_Thought_Gu', 'fandom:Evil_Thought_Gu',
        'fandom:Obsessed_Thought_Gu', 'fandom:Affection_Gu',
    ]],
    ["A", "Modify thought generation and collision in a field that drains lifespan.", [
        'wisdom',
    ]],
    ["A", "Modify or store a holder’s emotion, intent, focus or mental capacity.", [
        'candidate:djinn-heart-gu', 'candidate:emotion-poetry-gu', 'candidate:harmony-gu',
        'candidate:self-love-immortal-gu', 'fandom:Four_Tasks_At_Once_Gu',
    ]],
    ["G/L", "Store and retrieve inventory, essence or a living Gu from a container with capacity and custody.", [
        'candidate:earth-treasury-flower-gu', 'candidate:earth-treasury-flower-king-gu', 'candidate:fish-bubble-gu',
        'candidate:flowerbud-gu', 'candidate:primeval-elder-gu', 'candidate:tusita-flower',
    ]],
    ["N", "Write, persist and recall information through a storage carrier.", [
        'candidate:east-window-gu', 'candidate:vine-information-gu', 'candidate:bookworm',
    ]],
    ["L", "Convert consumed qi into nourishment or change reproductive state.", [
        'candidate:eat-fragrance-immortal-gu', 'candidate:estrus-gu',
    ]],
    ["L", "Change lifespan or stop aging.", [
        'candidate:eternal-gu',
    ]],
    ["W/K", "Create an autonomous formation operator that can modify its working.", [
        'candidate:formation-spirit-immortal-gu',
    ]],
    ["W/L", "Produce a material or food as an output of the Gu’s conversion or growth.", [
        'candidate:fuel-oil-gu', 'candidate:rice-bag-grass-gu', 'fandom:Wine_Sack_Flower_Gu',
        // fandom:Heavenly_Essence_Treasure_Monarch_Lotus removed 2026-11-24: it produces primeval essence (ri:ch463:p2),
        // which the Gu grammar's add-essence sentence already runs (B3 pilot case src/world_packs/gu_lotus_essence_case.js).
    ]],
    ["W", "Assemble matter into a durable structure, terrain feature or puppet.", [
        'candidate:giant-mountain-puppet-gu', 'candidate:large-lizard-house-gu', 'candidate:mush-room-gu',
        'candidate:pine-island-gu', 'candidate:small-swamp-gu', 'fandom:House_Type_Gu',
    ]],
    ["W/K", "Modify a tribulation already in progress.", [
        'candidate:heavens-envy-gu',
    ]],
    ["K/G", "Copy another Gu’s identity and executable ability with an explicit strength difference.", [
        'candidate:imitation-gu',
    ]],
    ["N", "Route a message to recipients through a carrier with travel or reply rules.", [
        'candidate:longevity-edict', 'candidate:star-letter-gu', 'fandom:Messenger_Dove_Gu',
    ]],
    ["N/L", "Let the user communicate in the target species’ language.", [
        'candidate:monkey-language-gu',
    ]],
    ["W/G", "Sever a wild Gu’s connection to its governing essence supply.", [
        'candidate:primeval-break-gu',
    ]],
    ["W", "Identify and resize the target’s quantity while retaining the target’s identity.", [
        'candidate:quantity-change-gu',
    ]],
    ["A/L", "Bind, fuse or contain souls and represent the resulting custody or survival state.", [
        'candidate:soul-chain-gu', 'candidate:soul-combination-gu', 'candidate:spirit-incubating-flea',
    ]],
    ["A/L", "Create a body duplicate with its own agency and a defined share of the source’s power.", [
        'candidate:split-shadow-immortal-gu', 'fandom:Perfect_Pair',
    ]],
    ["W", "Install a delayed, persistent resource-producing site.", [
        'candidate:spring-egg-gu',
    ]],
    ["W", "Manifest a sit-on support surface with its own lifetime.", [
        'candidate:star-cloud-bed-gu',
    ]],
    ["G/L", "Open an additional aperture and represent its cultivation state.", [
        'candidate:third-aperture-gu',
    ]],
    ["F", "Refine one or more Gu from an existing Gu or reverse an earlier refinement.", [
        'candidate:zombie-heart-gu', 'fandom:Revert_Gu', 'fandom:Prodigal_Son_Gu',
    ]],
    ["W/A", "Add luck or sever a luck relationship and have the change affect later draws.", [
        'candidate:break-luck', 'fandom:Dog_Shit_Luck_Immortal_Gu',
    ]],
    ["G/L", "Convert essence and advance a cultivation rank by changing the aperture wall.", [
        'fandom:Man-Beast_Life_Burial_Gu',
    ]],
    ["Evidence", "The source explicitly gives the form no active ability.", [
        'fandom:White_Chrysalis',
    ]],
    ["W/K", "Exempt a specific Gu operation from the local heavenly restriction.", [
        'fandom:One%27s_Own_Way_Gu',
    ]],
    ["W", "Materialize new objects or turn a dream object into a real one.", [
        'fandom:Iron_Bone_Broad_Axe', 'fandom:Become_Real',
    ]],
    ["W", "Anchor a moment for a compatible working or change the local rate of time.", [
        'fandom:Time_Anchor_Gu', 'fandom:Months_Pass_Like_Years',
    ]],
    ["A/K", "Create or resolve a durable alliance agreement with its own terms and expiry.", [
        'fandom:Hundred_Years_Harmony', 'fandom:Care_Immortal_Gu',
    ]],
    ["W/L", "Rewind the state of an individual Gu, including a destroyed Gu.", [
        'fandom:Gu_as_Before_Gu',
    ]],
    ["N/W", "Record a formation and later replay its layout or wiring.", [
        'fandom:Formation_Chart_Immortal_Gu',
    ]],
    ["F/W", "Convert dao marks into refinement material and apply that material to a Gu or formation.", [
        'fandom:Water_Refinement_Immortal_Gu',
    ]],
    ["G/N", "Keep information and seal higher-ranked living Gu in a common carrier.", [
        'fandom:Letter_Seal_Gu',
    ]],
    ["G/L", "Install water-path dao marks and project them into species-specific aptitude.", [
        'fandom:Water_Source_Gu',
    ]],
].flatMap(([owner, rule, ids]) => ids.map(id => [id, {owner, rule}]));
const guEffectGapById = new Map(guEffectGaps);

const gu = {};
for (const [id, row] of Object.entries(read('gu_kinds'))) {
    const r = row.reply;
    if (!r) continue;
    const rank = normaliseRank(r.rank.value);
    const byKind = kindWordFunction(r.kind.value);
    const byEffect = byKind ? null : keywordFunction(r.effect.value);
    const label = {heldOut: heldOut(id)};
    if (rank) Object.assign(label, {rank: rank.rank, rankBasis: rank.basis, rankAt: at(r.rank)});
    // The name keywords agree with the kind word on 32 of 58 kinds where both fire (2026-11-16), too weak to run a
    // row on, so an effect-keyword family is kept as a guess for a later mapping pass and never runs.
    if (byKind) Object.assign(label, {function: byKind, functionBasis: 'wiki-tier-kind-word', functionAt: at(r.kind)});
    else if (byEffect) Object.assign(label, {functionGuess: byEffect, functionGuessBasis: 'wiki-tier-effect-keyword (32 of 58 agree with kind words)'});
    // Luna's family for the stated effect (examples from non-held-out rows, kind field hidden): 27 of 32
    // held-out kinds with a kind-word family agree, 3 answer none.
    const fam = famPass[id]?.family;
    if (!byKind && fam && fam !== 'none') Object.assign(label, {effectFamily: fam,
        effectFamilyBasis: 'wiki-tier-effect-luna (held-out 27 of 32 agree with kind words)'});
    // GKM440 diet default, labelled authored: the category matches a stated food for 12 of 44 kinds.
    if (dietPass[id]) label.dietDefault = {category: dietPass[id].category, food: dietPass[id].food,
        basis: 'authored default (GKM440, Luna; 12 of 44 stated foods share its category)'};
    for (const key of ['effect', 'food', 'feeding_interval', 'starving', 'activation_cost', 'refinement']) if (at(r[key])) label[`${key}At`] = at(r[key]);
    if (label.effectAt && guEffectFamilies[id]) Object.assign(label, {effectFamily: guEffectFamilies[id],
        effectFamilyBasis: 'wiki-tier-effect-reviewed'});
    const gap = guEffectGapById.get(id);
    if (label.effectAt && gap) {
        delete label.effectFamily;
        delete label.effectFamilyBasis;
        label.effectFamilyGap = gap;
    }
    gu[id] = label;
}
const file = `${root}docs/coverage/wiki_tier_labels.json`;
const writeLabels = labels => writeFileSync(file, JSON.stringify(labels).replace(/},"/g, '},\n"') + '\n');
if (process.argv.includes('--gu-kinds-only')) {
    const prior = JSON.parse(readFileSync(file, 'utf8'));
    prior.gu_kinds = sorted(gu);
    writeLabels(prior);
    console.log(`wiki tier: ${Object.keys(gu).length} Gu kind labels`);
    process.exit(0);
}

const norm = s => (s ?? '').toLowerCase().replace(/[’']/g, "'").replace(/\s+(immortal\s+)?gu\.?$/, '').trim();
const kindIds = new Map(index.records.map(rec => [norm(rec.saga?.name ?? rec.fandom?.name ?? rec.id), rec.id]));
const role = text => /\bcore\b/i.test(text) ? 'core' : /\bsupport/i.test(text) ? 'support'
    : /\b(refin|product|result|form(s|ed)? into|becomes)\b/i.test(text) ? 'product' : 'other';
const moves = {};
for (const [id, row] of Object.entries(read('ri_moves'))) {
    const r = row.reply;
    if (!r) continue;
    const components = r.components.filter(c => /\bgu\.?$/i.test(c.gu.trim())).map(c => ({
        kind: kindIds.get(norm(c.gu)) ?? null, ...(kindIds.has(norm(c.gu)) ? {} : {name: c.gu.trim()}),
        role: role(c.role), locator: c.locator.replace(/^\[|\]$/g, ''), speaker: c.speaker}));
    const label = {heldOut: heldOut(id)};
    // Haiku's second read: a component it calls not part of the move is dropped; unclear marks the lead partial.
    const second = movePass[id]?.components ?? [];
    const verdictOf = c => second.find(v => norm(v.gu) === norm(c.name ?? [...kindIds].find(([, k]) => k === c.kind)?.[0]))?.verdict;
    if (second.length) for (const c of components) c.second = verdictOf(c) ?? 'unclear';
    const parts = components.filter(c => c.role !== 'product' && c.second !== 'not-part');
    if (second.length) label.secondRead = parts.length && parts.every(c => c.second === 'core' || c.second === 'support') ? 'agree' : 'partial';
    if (parts.length) label.components = parts;
    for (const key of ['cost', 'conditions', 'effect', 'counters', 'path', 'rank']) if (at(r[key])) label[`${key}At`] = at(r[key]);
    moves[id] = label;
}

// Route words: drinking first, so "swallowed" in a drinking scene stays drunk.
const ROUTES = [['drunk', /\b(drunk|drink\w*|oral\w*|by mouth|quaff\w*|sip\w*|imbib\w*|swallow\w*|spoon\w*|mouthwash|consumed)\b/i],
    ['eaten', /\b(eat\w*|eaten|chew\w*|food|cake|sweet)\b/i],
    ['topical', /\b(skin|hair|scalp|wound|burn|bruise|rub\w*|topical\w*|smear\w*|massag\w*|ointment|paste|dab\w*|drops?|eye|bath\w*)\b/i],
    ['inhaled', /\b(inhal\w*|fumes?|vapou?r\w*|smell\w*|sniff\w*)\b/i], ['sprayed', /\b(spray\w*)\b/i],
    ['object', /\b(varnish|polish\w*|wood\w*|surface|object|photograph\w*|plants?|soil)\b/i]];
const TARGETS = [['plant', /\b(plants?|crops?|seeds?|garden|weeds?)\b/i], ['creature', /\b(creatures?|birds?|beasts?|animals?|pets?|doxies|doxy|owls?|toads?|rats?|dragons?|beaks?)\b/i],
    ['object', /\b(objects?|wood\w*|brooms?|surfaces?|furniture|photographs?)\b/i]];
const SENTENCE_FAMILY = {conceal: 'conceal-or-sense', sense: 'conceal-or-sense', release: 'place-release', block: 'protection-field'};
const OBJECT_FAMILY = {vitality: 'body-door', mind: 'mind-state', memory: 'mind-state', form: 'body-form', thing: 'object-surface', luck: 'luck-field'};
const sentenceFamily = p => SENTENCE_FAMILY[p.verb] ?? (p.target !== 'self' && p.object === 'vitality' ? null : OBJECT_FAMILY[p.object]) ?? null;
const potions = {};
for (const [id, row] of Object.entries(read('hp_potions'))) {
    const r = row.reply;
    if (!r) continue;
    const routes = ROUTES.filter(([, p]) => p.test(r.route.value)).map(([k]) => k);
    const target = TARGETS.find(([, p]) => p.test(r.target.value))?.[0] ?? (r.target.value ? 'person' : null);
    const byTarget = target === 'plant' || target === 'creature' ? 'plant-or-creature-target' : target === 'object' ? 'object-surface' : null;
    const byEffect = r.effect.value ? potionFamily(r.effect.value) : null;
    const words = byTarget ?? (byEffect && byEffect !== 'effect-sentence' ? byEffect : null);
    // Luna's effect sentence (tuned examples only): the object is right for 16 of 17 held-out evidence
    // sentences, the verb for 10, so the family comes from the object, or from a verb-led family's verb.
    const sentence = sentencePass[id];
    const validSentence = sentence && sentence.verb !== 'none' && sentence.object !== 'none'
        && assemblePotionEffect(HP_POTION_EFFECTS, {...sentence, cost: 'ingredients'}).ok;
    const bySentence = validSentence ? sentenceFamily(sentence) : null;
    // A hand check of the five rows only the sentence would family found three wrong, so the sentence family
    // is recorded for a later scored pass and does not move a ledger row.
    const family = words;
    const label = {heldOut: heldOut(id)};
    if (routes.length) Object.assign(label, {routes, routeAt: at(r.route)});
    if (target) Object.assign(label, {target, targetAt: at(r.target)});
    if (family) Object.assign(label, {family, familyBasis: byTarget ? 'wiki-tier-target' : 'wiki-tier-effect-words', familyAt: at(byTarget ? r.target : r.effect)});
    if (bySentence) Object.assign(label, {sentenceFamily: bySentence, sentenceBasis: 'wiki-tier-sentence-luna (held-out object 16 of 17, verb 10 of 17)'});
    if (validSentence) label.sentence = Object.fromEntries(['verb', 'object', 'target', 'time', 'carrier', 'limits'].map(k => [k, sentence[k]]));
    for (const key of ['effect', 'ingredients', 'brewing', 'onset_and_duration', 'side_effects', 'antidote', 'appearance', 'users']) if (at(r[key])) label[`${key}At`] = at(r[key]);
    potions[id] = label;
}

// Lord of the Mysteries potions (2026-11-16). Luna lists each Sequence's ingredients from wiki paragraphs that tag
// the Sequence; Haiku checks each one (scripts/label_followups.mjs lotm_check). Rule set before scoring: an
// ingredient folds as a main only when Luna lists it and Haiku calls it main. On the 46 brew-pack rows that
// gives 11 of 13 right by hand, held-out 3 of 3; Luna alone was 15 of 22. Names are short ingredient names, not
// prose. Rows with no wiki main carry the GKM433 authored default.
const lotmCheck = followup('lotm_check');
const short = name => name.trim().split(/\s+/).length <= 8 && !/^\(|^$/.test(name.trim());
const lotmPackets = new Map(JSON.parse(readFileSync(`${priv}lotm_potions_packets.json`, 'utf8')).map(p => [p.id, p]));
const LOTM_FIELDS = ['do', 'settle', 'go_wrong', 'change', 'who_may', 'where_from', 'how_long', 'others_notice', 'left_behind',
    'who_controls', 'mind', 'can_be_false', 'combines'];
const lotm = {};
for (const [id, row] of Object.entries(read('lotm_potions'))) {
    const r = row.reply;
    if (!r) continue;
    const packet = lotmPackets.get(id);
    const verdicts = new Map((lotmCheck[id]?.ingredients ?? []).map(v => [v.name.trim(), v.verdict]));
    const item = m => ({name: m.name.trim(), locator: m.locator.replace(/^\[|\]$/g, ''), speaker: m.speaker, ...(m.cite ? {cite: m.cite} : {}),
        ...(packet.evidence.some(e => e.includes(`[ingr:${m.name.trim()}]`)) ? {canonical: true} : {})});
    const label = {heldOut: heldOut(id)};
    const mains = r.mains.filter(m => short(m.name) && verdicts.get(m.name.trim()) === 'main').map(item);
    const unstated = [...r.mains, ...r.aux].filter(m => short(m.name) && verdicts.get(m.name.trim()) === 'role-unstated').map(item);
    const supplementary = r.aux.filter(m => short(m.name) && verdicts.get(m.name.trim()) === 'supplementary').map(item);
    if (mains.length) Object.assign(label, {mains, mainsBasis: 'wiki-tier-luna-haiku-main (brew-pack rows 11 of 13, held-out 3 of 3)'});
    if (supplementary.length) label.supplementary = supplementary;
    if (unstated.length) label.roleUnstated = unstated;
    // Haiku's misses are for review only: two of the three on blocked rows a hand look found are artifacts, not ingredients.
    const missed = (lotmCheck[id]?.missed ?? []).filter(m => m.role === 'main' && short(m.name)).map(m => ({name: m.name.trim(),
        locator: m.locator.replace(/^\[|\]$/g, ''), speaker: m.speaker}));
    if (missed.length) label.reviewMains = missed;
    if (!mains.length && packet.state === 'blocked:formula-in-notes') label.authoredDefault = {mains: `a Sequence ${packet.seq} ${packet.wikiName.replace(/\s*\(.*$/, '')} Beyonder characteristic`,
        supplementary: 'open', basis: 'authored default (GKM433): the table rule that a same-Sequence characteristic replaces the mains (T 0214), not canon',
        cost: 'a dead Beyonder of this Sequence; a polluted characteristic carries its residue (T 0209, 0403)'};
    // An aspect locator is kept only when each of its ';'-joined parts starts a packet line (616 of 618 did).
    const inPacket = loc => loc && loc.split(';').every(part => packet.evidence.some(e => e.startsWith(`[${part.trim().replace(/^\[|\]$/g, '')}]`)));
    for (const key of LOTM_FIELDS) if (at(r[key]) && inPacket(at(r[key]).locator)) label[`${key}At`] = at(r[key]);
    lotm[id] = label;
}

const out = {meta: {pass: 'docs/research/advancement-aspects-2026-11-16/README.md#full-luna-passes', model: 'gpt-6-luna (low effort)',
    date: '2026-11-16', tier: 'wiki (GKM445), unchecked against chapters', split: 'held out when sha1(id)[0] < 0x33 (GKM429)'},
    gu_kinds: sorted(gu), gu_moves: sorted(moves), hp_potions: sorted(potions), lotm_potions: sorted(lotm)};
// Hogwarts ingredients (2026-11-16, scored by scripts/hp_ingredient_labels_check.mjs): kind, stated property axes,
// roles, potions resolved to potion-ledger ids through the wiki's redirects, preparation forms in a closed word set,
// and where hazards and direct effects are stated. Stated axes: Haiku confirms 25 of Luna's 26 on the held-out rows and
// a hand check of 16 rows found 18 of 19 right. axisCandidates come from the families of the potions that use it
// (the book-one sheet's recipe rule, an inference) and are recorded, never folded as properties.
const FAMILY_AXIS = {'body-door': 'mend', 'mind-state': 'mind', 'body-form': 'form', 'luck-field': 'luck', 'conceal-or-sense': 'conceal-or-sense', 'protection-field': 'ward'};
const potionTitle = new Map(readFileSync(`${root}docs/research/hogwarts-potion-evidence-2026-11-11/catalogue.jsonl`, 'utf8').trim().split('\n')
    .map(l => JSON.parse(l)).filter(c => c.kinds.includes('potion_related')).map(c => [`hp.potion.${c.title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')}`, c.title]));
const second = existsSync(`${priv}hp_ingredients_haiku.json`) ? JSON.parse(readFileSync(`${priv}hp_ingredients_haiku.json`, 'utf8')) : {};
// Hand check (2026-11-16, 16 rows): 18 of 19 stated axes right; the miss is dropped here and recorded.
const AXIS_DROPS = {'hp.ingredient.chinese_chomping_cabbage': ['bite', 'read from the plant biting, not an irritant property']};
const ingredients = {};
for (const [id, row] of Object.entries(existsSync(`${priv}hp_ingredients_luna.json`) ? read('hp_ingredients') : {})) {
    const r = row.reply;
    if (!r) continue;
    const loc = l => l.replace(/^\[|\]$/g, '');
    const label = {heldOut: heldOut(id), kind: r.kind.value, ...(at(r.kind) ? {kindAt: at(r.kind)} : {})};
    const drop = AXIS_DROPS[id];
    const axes = r.axes.filter(a => a.axis !== drop?.[0]);
    if (drop) label.axisDropped = {axis: drop[0], reason: `hand check: ${drop[1]}`};
    if (axes.length) label.axes = axes.map(a => ({axis: a.axis, level: a.level, locator: loc(a.locator), speaker: a.speaker}));
    const h = second[id]?.reply;
    if (h && axes.length) label.axesSecond = axes.every(a => h.axes.some(b => b.axis === a.axis)) ? 'agree' : 'partial';
    if (r.roles.length) label.roles = r.roles.map(a => ({role: a.role, locator: loc(a.locator), speaker: a.speaker}));
    const potions = [...new Map(r.potions.map(p => [resolvePotion(p.potion), loc(p.locator)])).entries()].filter(([pid]) => pid);
    if (potions.length) label.potions = potions.map(([potion, locator]) => ({potion, locator}));
    const unresolved = r.potions.filter(p => !resolvePotion(p.potion)).length;
    if (unresolved) label.potionsUnresolved = unresolved;
    const forms = [...new Set(r.preparation.map(p => normForm(p.form)).filter(f => FORM_WORDS.includes(f) && f !== 'weighed'))];
    if (forms.length) Object.assign(label, {forms, formsAt: loc(r.preparation[0].locator)});
    const candidates = [...new Set(potions.map(([pid]) => FAMILY_AXIS[potionFamily(potionTitle.get(pid) ?? '')]).filter(Boolean))].sort();
    if (candidates.length) Object.assign(label, {axisCandidates: candidates, axisCandidatesBasis: 'inference from the families of the potions that use it'});
    for (const key of ['source', 'hazards', 'direct_effect']) if (at(r[key])) label[`${key}At`] = at(r[key]);
    ingredients[id] = label;
}
out.hp_ingredients = sorted(ingredients);
writeLabels(out);
const count = (obj, f) => Object.values(obj).filter(f).length;
console.log(JSON.stringify({gu: Object.keys(gu).length, guRank: count(gu, l => l.rank), guFunction: count(gu, l => l.function), guFunctionGuess: count(gu, l => l.functionGuess), guEffectFamily: count(gu, l => l.effectFamily), guDiet: count(gu, l => l.dietDefault), movesAgree: count(moves, l => l.secondRead === 'agree'),
    moves: Object.keys(moves).length, movesWithComponents: count(moves, l => l.components), movesAllMatched: count(moves, l => l.components?.every(c => c.kind)),
    potions: Object.keys(potions).length, potionRoute: count(potions, l => l.routes), potionFamily: count(potions, l => l.family),
    lotm: Object.keys(lotm).length, lotmMains: count(lotm, l => l.mains), lotmRoleUnstated: count(lotm, l => l.roleUnstated && !l.mains),
    heldOut: count(gu, l => l.heldOut) + count(moves, l => l.heldOut) + count(potions, l => l.heldOut)}));
console.log(JSON.stringify({ingredients: Object.keys(ingredients).length, ingredientAxes: count(ingredients, l => l.axes), ingredientPotions: count(ingredients, l => l.potions),
    ingredientForms: count(ingredients, l => l.forms), ingredientHazard: count(ingredients, l => l.hazardsAt), ingredientHeldOut: count(ingredients, l => l.heldOut)}));
