// LOTM derived potion formulas (PWC21, proposal; tier: derived, PWC20). Where the notes, wiki and chapters state no main material for a
// Sequence, the world's own law supplies one: the table's rule that a same-Sequence characteristic replaces the main with the auxiliaries
// still needed (PATHWAY_POTION_TABLE.md 0.1, T 0214, 0221; docs/coverage/lotm_rules.json). Seq 9 to 1: the main is a Beyonder characteristic of
// that pathway at that Sequence (a dead Beyonder's, or the creature part that carries it; the law of conservation of Beyonder
// characteristics keeps it the same stuff). Seq 0: the pathway's Uniqueness plus two Seq 1 characteristics (Fool 0 and Black Emperor 0 state
// this; two rows, so the Seq 0 branch is fitted, not predicted, and sits outside the score).
// Default: this is the characteristic route, not the pathway's natural-ingredient formula. Dial: slots are unnamed lots the economy fills
// (a lot or a quest), amounts are one portion per qty (the brew pack's default), and the supplementary slot is a themed placeholder.
// Reason: the novel states the replacement and the conserved characteristic, never a formula for these Sequences. A stated formula
// (chapter or wiki tier) replaces the derived row. No ritual is invented: the law does not read one, so it is a named gap.
import {LOTM_FORMULA_ROWS} from './lotm_formula_rows.js';
import {packRow} from './world_packs/lotm_brew_pack.js';

export const LOTM_DERIVE_RULES = Object.freeze({
    characteristic: 'lotm.rule.characteristic-replaces-main',
    uniqueness: 'lotm.rule.seq0-uniqueness-and-seq1-characteristics',
    supplementary: 'lotm.rule.supplementary-themed',
});

// Sequence names by pathway, index 0 = Sequence 9 down to index 9 = Sequence 0; null where the table gives none.
const NAMES = {
    "Fool": ["Seer", "Clown", "Magician", "Faceless", "Marionettist", "Bizarro Sorcerer", "Scholar of Yore", "Miracle Invoker", "Attendant of Mysteries", "Fool"],
    "Error": ["Marauder", "Swindler", "Cryptologist", "Prometheus", "Dream Stealer", "Parasite", null, "Trojan Horse of Destiny", "Worm of Time", "Error"],
    "Door": ["Apprentice", "Trickmaster", "Astrologer", "Scribe", "Traveler", "Secrets Sorcerer", "Wanderer", "Planeswalker", "Key of Stars", "Door"],
    "Visionary": ["Spectator", "Telepathist", "Psychiatrist", "Hypnotist", "Dreamwalker", "Manipulator", "Dream Weaver", "Discerner", "Author", "Visionary"],
    "Sun": ["Bard", "Light Supplicant", "Solar High Priest", "Notary", "Priest of Light", "Unshadowed", "Justice Mentor", "Lightseeker", "Pure White Angel", "Sun"],
    "Tyrant": ["Sailor", "Folk of Rage", "Navigator", "Wind-blessed", "Ocean Songster", "Cataclysmic Interrer", "Sea King", "Calamity", "Thunder God", "Tyrant"],
    "White Tower": ["Reader", null, "Detective/Knowledge Keeper", "Polymath", null, "Prophet", "Cognizer", null, "All-Knowing Eye", "White Tower"],
    "Hanged Man": ["Secrets Suppliant", "Listener", "Shadow Ascetic", "Rose Bishop", "Shepherd", "Black Knight", "Trinity Templar", null, "Dark Angel", "Hanged Man"],
    "Darkness": ["Sleepless", "Midnight Poet", "Nightmare", "Soul Assurer", "Spirit Warlock", "Nightwatcher", "Horror Bishop", "Servant of Concealment", "Knight of Misfortune", "Darkness"],
    "Death": ["Corpse Collector", "Gravedigger", "Spirit Medium", "Spirit Guide/Necromancer", "Gatekeeper", "Undying", "Ferryman", "Death Consul", "Pale Emperor", "Death"],
    "Twilight Giant": ["Warrior", "Pugilist", "Weapon Master", "Dawn Paladin", "Guardian", "Demon Hunter", "Silver Knight", null, "Hand of God", "Twilight Giant"],
    "Red Priest": ["Hunter", "Provoker", "Pyromaniac", "Conspirer", "Reaper", "Iron-Blooded Knight", "War Bishop", "Weather Warlock", "Conqueror", "Red Priest"],
    "Demoness": ["Assassin", "Instigator", "Witch", "Pleasure Witch", "Affliction Witch", "Despair Witch", "Unaging Witch", null, "Doomsday", "Demoness"],
    "Paragon": ["Savant", "Archaeologist", "Appraiser", "Artisan", null, "Alchemist", "Arcane Scholar", "Knowledge Magister", "Civilization Enlightener or Illuminator", "Paragon"],
    "Hermit": ["Mystery Pryer", null, "Warlock", "Scroll Professor", "Astrologer", "Occultist", "Prophecy Master", "Sage", "Knowledge Emperor", "Concealed Sage"],
    "Mother": ["Planter", "Doctor", "Harvest Priest", "Biologist", "Druid", "Classical Alchemist", "Pallbearer", "Desolate Matriarch", "Naturewalker", "Mother"],
    "Moon": ["Apothecary", "Beast Trainer", "Vampire", "Potions Professor", "Scarlet Scholar", "Witch-King", "Summoner Master", "Creator", "Beauty God", "Moon"],
    "Black Emperor": ["Lawyer", "Barbarian", "Briber", "Baron of Corruption", "Mentor of Disorder", "Earl of the Fallen", "Frenzied Mage", "Duke of Entropy", "Prince Who Slays Order", "Black Emperor"],
    "Justiciar": ["Arbiter", "Sheriff", "Interrogator", "Judge", "Disciplinary Paladin", "Imperative Mage", "Chaos Hunter", "Balancer", "Hand of Order", "Justiciar"],
    "Abyss": ["Criminal", "Unwinged Angel", "Serial Killer", "Devil", "Desire Apostle", "Demon", "Blatherer", "Bloody Archduke", "Filthy Monarch", "Abyss"],
    "Chained": ["Prisoner", "Lunatic", "Werewolf", "Zombie", "Wraith", "Puppet", "Disciple of Silence", null, "Abomination", "Chained"],
    "Wheel of Fortune": ["Monster", "Robot", "Lucky One", "Calamity Priest", "Winner", "Misfortune Mage", "Chaoswalker", "Soothsayer", "Snake of Mercury", "Wheel of Fortune"],
};
export const LOTM_PATHWAYS = Object.freeze(Object.keys(NAMES));
export const lotmSequenceName = (pathway, seq) => NAMES[pathway]?.[9 - seq] ?? null;
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
export const derivedRowId = (pathway, seq) => `${slug(pathway)}_${seq}`;
export function parseDerivedId(id) {
    const m = /^(.+)_(\d)$/.exec(id);
    const pathway = m && LOTM_PATHWAYS.find(p => slug(p) === m[1]);
    return pathway ? {pathway, seq: Number(m[2])} : null;
}

/** The characteristic main for a Sequence, named the way the brew pack names such mains. */
const characteristic = (pathway, seq) => {
    const name = lotmSequenceName(pathway, seq);
    return name ? `Sequence ${seq} ${name} characteristic` : `Sequence ${seq} ${pathway} pathway characteristic`;
};

/** Brew-pack spec (the shape ADDITIONAL_FORMULAS uses) derived for one Sequence, with the rule and inputs that produced it. */
export function derivedSpec(pathway, seq) {
    if (!LOTM_PATHWAYS.includes(pathway) || !Number.isInteger(seq) || seq < 0 || seq > 9) throw new Error(`No LOTM Sequence ${pathway} ${seq}.`);
    const name = lotmSequenceName(pathway, seq);
    const evidence = `derived (${seq === 0 ? LOTM_DERIVE_RULES.uniqueness : LOTM_DERIVE_RULES.characteristic})`;
    const mains = seq === 0
        ? [{id: 'm1', role: 'main', select: {material: `${pathway} Uniqueness`}, qty: 1, evidence},
            {id: 'm2', role: 'main', select: {material: characteristic(pathway, 1)}, qty: 2, evidence}]
        : [{id: 'm1', role: 'main', select: {material: characteristic(pathway, seq)}, qty: 1, evidence}];
    const theme = name ?? `Sequence ${seq} ${pathway}`;
    const aux = {id: 'a1', role: 'aux', select: {material: `supplementary items themed to ${theme}`}, qty: 1, evidence: `derived (${LOTM_DERIVE_RULES.supplementary})`};
    return {id: `${derivedRowId(pathway, seq)}`, pathway, seq, name: name ?? theme, status: 'inspect-only',
        minutes: LOTM_FORMULA_ROWS.find(r => r.seq === seq).minutes,
        slots: [...mains, aux],
        gaps: [evidence, 'Derived, not stated: main amounts follow the brew pack\'s one-portion default.',
            'Supplementary items are a themed placeholder; the ritual is not stated and the law does not read one.',
            'No bench offer: the formula is derived (PWC20).'],
        rules: seq === 0 ? [LOTM_DERIVE_RULES.uniqueness, LOTM_DERIVE_RULES.supplementary] : [LOTM_DERIVE_RULES.characteristic, LOTM_DERIVE_RULES.supplementary],
        inputs: [`pathway:${pathway}`, `seq:${seq}`, `name:${name ?? 'none'}`]};
}

/** The brew-pack row (method, reaction, slots as unnamed lots) for a derived Sequence. */
export function derivedBrewRow(pathway, seq) {
    const {rules, inputs, ...spec} = derivedSpec(pathway, seq);
    return packRow({...spec, status: 'inspect-only'});
}
