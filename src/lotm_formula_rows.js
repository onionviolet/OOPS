// Lord of the Mysteries potion formulas as shared-envelope process rows (DWF102). Source: docs/gm/dispatch/potion-pathways-2026-10-24/PATHWAY_POTION_TABLE.md
// (43 known rows; 23 name every main and auxiliary and are brewable here, the rest are inspect-only). Evidence tags are the table's: S shown, T stated, W wiki, I inferred.
// Canon names, materials and rites are source-tagged. EVERY price, minute count, stock count and acquisition tier below is an authored proposal (WPR5), set by the dials
// under "Dials" so one edit moves the whole ladder. Canon prices stay beside the scaled pence (DWF129).
import {LOTM_PENCE as P} from './book_world_lotm_ids.js';
import {defineProcess} from './dose_process.js';

export const LOTM_WORLD = 'book.lotm.tingen';
export const FORMULA_ROWS_REVISION = 1;
// RAW: [pathway, seq, name, main[[item, qty, evidence]], aux[...], auxStatus, ritual, price note, source, notes, full, [mainTag, auxTag, ritualTag, priceTag, hasAlternates]]
const RAW=[
["Fool",9,"Seer",[["Lavatan octopus blood","10 ml","S 0031 (qty W game guide, medium)"],["star crystal","50 g","S 0031 (qty W game guide, medium)"]],[["purified water",null,"S 0031"],["night-vanilla juice",null,"S 0031"],["golden mint leaves",null,"S 0031"],["poison hemlock juice",null,"S 0031"],["dragonblood grass powder",null,"S 0031"]],"known","none",null,"Nighthawks issue it; Old Neil brews","whispers and urge to destroy right after drinking",1,["S 0031, W game guide, medium","S 0031","","S 0031",0]],
["Fool",8,"Clown",[["adult Honagis grey-goat horn crystal",null,"S 0170"],["intact human-face rose",null,"S 0170"]],[],"missing","none",null,"church after merit check; recipe from Aurora Order case","whispers again at promotion",0,["S 0170","","","S 0106 to 0170",0]],
["Fool",7,"Magician",[["true Mist Treant rhizome","1","S 0254"],["spinal fluid of an evil-stripe black panther","all","S 0254"]],[["pure water","60 ml","S 0254"],["treant sap","30 ml","S 0254"],["water-gem powder","3 g","S 0254"],["hallucination-herb oil","4 drops","S 0254"]],"known","none",null,"via killed agent",null,1,["S 0254","S 0254","","S 0254",0]],
["Fool",6,"Faceless",[["mutated pituitary of a thousand-face hunter",null,"S 0254"],["skin-shadow characteristic",null,"S 0254"]],[["hunter blood","80 ml","S 0254"],["black mandrake juice","5 drops","S 0254"],["dragonblood grass powder","10 g","S 0254"],["hairs of a deep-sea naga","3","S 0254"]],"known","none","main plus blood about 1450; characteristic sold 3825",null,"lose self and become a monster",1,["S 0254","S 0254","I","S 0444, S 0543",0]],
["Fool",5,"Marionettist",[["dust of an ancient wraith",null,"S 0254"],["core crystal of a six-winged gargoyle",null,"S 0254"]],[["Sunia-island golden spring water","80 ml","S 0254"],["dragon-pattern bark","10 g","S 0254"],["wraith's residual spirituality",null,"S 0254"],["gargoyle eyes","pair","S 0254"]],"known","drink while a mermaid sings at sea",null,null,"contaminated characteristic poisoned a user",1,["S 0254","S 0254","S 0254, 0685","",0]],
["Fool",4,"Bizarro Sorcerer",[["eye of a trick-evil-monster",null,"S 0871"],["true soul body of a spirit-world plunderer",null,"S 0871"]],[["trick-monster blood","200 ml","S 0871"],["plunderer dust","30 g","S 0871"],["red-hair birch bark","10 g","S 0871"],["golden grapevine",null,"S 0871"],["homemade rubber mask",null,"S 0871"]],"known","stage a grand play that kills a demigod",null,null,"six Fool-line abilities fuse here",1,["S 0871","S 0871","S 0871","",0]],
["Fool",3,"Scholar of Yore",[["eyes of a Fugen hound",null,"S 1086"],["flocculated heart of a mist-wolf",null,"S 1086"]],[["hound blood","100 ml","S 1086"],["mist-wolf frost crystal","30 g","S 1086"],["true ancient historical records","a large amount","S 1086"]],"known","stay out of reality at least 300 years",null,null,null,1,["S 1086","S 1086","S 1086","",0]],
["Fool",2,"Miracle Invoker",[["heart of the Black Wolf of Wishes (a god)",null,"S 1204"]],[["wolf blood","300 ml","S 1204"],["Time Worm","1","S 1204"],["Star Worm","1","S 1204"]],"known","bring a lost piece of history into the present era",null,null,"Zarathustra lost control at Seq 1 promotion [T 0733]",1,["S 1204","S 1204","S 1204","",1]],
["Fool",1,"Attendant of Mysteries",[["Attendant characteristic","1","S 1330"]],[["spirit-world specialty","9","S 1330"]],"known","found a town of puppets with designed fates",null,null,"only 3 Attendant characteristics exist",1,["S 1330","S 1330","S 1330","",0]],
["Fool",0,"Fool",[["Fool uniqueness",null,"S 1330"],["Attendant characteristic","2","S 1330"]],[["control of at least a quarter of the history fog",null,"S 1330"]],"known","fool time, history or fate once",null,null,null,1,["S 1330","S 1330","S 1330","",0]],
["Door",9,"Apprentice",[["dead Beyonder's characteristic",null,"T 0341, S 0411"]],[],"missing","none",null,null,"Fors used Anelisa's; full-moon whispers (I 0341)",0,["T 0341, S 0411","M","","",0]],
["Door",8,"Trickmaster",[["spirit-eater stomach",null,"S 0350"],["deep-sea marlin blood","20 ml","S 0350"]],[["hornbeam oil","5 ml","S 0350"],["thread-ball grass powder","10 g","S 0350"],["red chestnut flower","1","S 0350"],["pure water","80 ml","S 0350"]],"known","none","formula 450","Tarot Club",null,1,["S 0350","S 0350","","S 0350",0]],
["Door",7,"Astrologer",[["meteoric crystal","60 g","T Fors 0700"],["Lavatan octopus blood crystal",null,"T Fors 0700"]],[],"missing","none","600 each","Tarot Club","'slightly like a stronger Seer recipe'; Lavatan octopus also in Seer 9",0,["T Fors 0700","","","T 0700",0]],
["Door",6,"Scribe",[["ancient-wraith curse item",null,"T 1228"]],[],"missing","missing",null,null,"plus a dream-related material (unnamed)",0,["T 1228","","","",0]],
["Door",5,"Traveler",[["Traveler characteristic",null,"T 1108"]],[],"missing","missing",null,null,"replaces main; aux cell says only 'in a Traveler's pack'; digest within about half a year or lose spirituality",0,["T 1108","T 1108","T 1221","",0]],
["Visionary",9,"Spectator",[["adult Manhar-fish eyes","pair","T Alger 0034"],["horn-black-fish blood","35 ml","T Alger 0034"]],[["purified water","80 ml","T 0034"],["meadow-saffron essence","5 drops","T 0034"],["ox-tooth peony powder","13 g","T 0034"],["elf flowers","7","T 0034"]],"known","none",null,"Alger asked 100 ml ghost shark blood as fee","emotional involvement skews perception",1,["T Alger 0034","T 0034","","T 0006",0]],
["Visionary",8,"Telepathist",[["complete pituitary of an adult rainbow-lizard dragon",null,"S 0157"],["Farsman rabbit spinal fluid","10 ml","S 0157"]],[["chestnut buds","5 g","S 0157"],["dragonblood grass powder","8 g","S 0157"],["pure-white elf flowers","3","S 0157"],["pure water","100 ml","S 0157"]],"known","none",null,null,null,1,["S 0157","S 0157","","",0]],
["Visionary",7,"Psychiatrist",[["Elder Tree fruit",null,"I 0706"]],[],"missing","none","char 1200 to 1500","Audrey offers a formula as fee",null,0,["I 0706, I 0188","","","T 0582, T 0270",1]],
["Visionary",6,"Hypnotist",[["young mind dragon pituitary",null,"T 0700"]],[],"missing","none","1500 to 2000",null,"wiki lists Mind Dragon blood 100 ml or Dream Catcher blood 90 ml as aux (W, low)",0,["T 0700","W, low","","T 0700",1]],
["Visionary",5,"Dreamwalker",[["dream-catcher heart plus mind-phantom crystal",null,"S 1045"]],[],"missing","contract a spirit-world harpy; drink with its tail feather in intense joy or anger",null,null,"so an outside pull prevents sleeping forever",0,["S 1045","","S 1045","",1]],
["Visionary",4,"Manipulator",[["whole brain of an old mind dragon",null,"T 1085"]],[["old mind-dragon blood","80 ml","T 1085"],["golden treant leaves","3","T 1085"],["tear from each of seven humanoids in strong emotion","one each","T 1085"]],"known","drink within a gathering of at least 10,000 amid their resonance",null,null,null,1,["T 1085","T 1085","T 1085","",1]],
["Sun",9,"Bard",[["crystal sunflower",null,"S 0146, 0142"]],[["midsummer grass","1","S 0146"],["July-wine juice","5 drops","S 0146"],["elf dark leaf","1","S 0146"]],"known","none",null,"Alger could source Seq 9",null,1,["S 0146, 0142","S 0146","","T 0146",1]],
["Sun",8,"Light Supplicant",[["radiant stone",null,"S 0142"]],[["gold-edge sunflower","1","S 0142"],["aconite juice","3 drops","S 0142"]],"known","none",null,null,null,1,["S 0142","S 0142","","",1]],
["Sun",7,"Solar High Priest",[["red crown of a dawn rooster",null,"S 0527"],["fruit of a radiant covenant tree",null,"S 0527"]],[["rooster blood","100 ml","S 0527"],["Sun oil","10 drops","S 0527"],["golden bergamot powder","8 g","S 0527"],["solidified lava","5 g","S 0527"]],"known","none","main about 2000",null,null,1,["S 0527","S 0527","","S 0527",0]],
["Sun",6,"Notary",[["crystal rhizome of an Elder Tree",null,"S 0706"],["tail feathers of a covenant bird","5","S 0706"]],[["radiant covenant tree sap","100 ml","S 0706"],["gold-edge sunflower","1","S 0706"],["white-edge sunflower","1","S 0706"],["water-fern juice","5 drops","S 0706"]],"known","none",null,null,"Elder Tree also in Spectator 7 (I 0706)",1,["S 0706","S 0706","","",0]],
["Sun",5,"Priest of Light",[["red crown of the dawn rooster king",null,"S 0706"],["pure-white radiant stone","1","S 0706"]],[["rosemary","5 g","S 0706"],["golden bergamot juice","7 drops","S 0706"],["rock water","10 ml","S 0706"],["rooster-king blood","60 ml","S 0706"]],"known","bury the whole body in non-melting ice in pure darkness, then drink",null,null,"Klein: demigod formulas are issued with the rite (I 0706)",1,["S 0706","S 0706","S 0706","",0]],
["Sun",4,"Unshadowed",[["one drop of Sun god blood","1 drop","S 1064"]],[["sun-bird blood","60 ml","S 1064"],["holy radiant-stone fluid","30 ml","S 1064"],["mutated golden bergamot juice","7 drops","S 1064"],["magma-heart powder","10 g","S 1064"]],"known","extract the strongest emotion you refuse to give up, drink, pour it back during the process",null,"church supplies directly; Klein sold a partial formula",null,1,["S 1064","S 1064","S 1064","T 0161, S 0294",1]],
["Tyrant",9,"Sailor",[["merfolk parts",null,"I 0504"]],[],"missing","none",null,"black market and Storm Church",null,0,["I 0504","","","T",0]],
["Tyrant",6,"Wind-blessed",[["crystal feathers of a blue-shadow falcon","6","S 0460"],["dragon-eye sea eagle eyes","pair","S 0460"]],[],"missing","none","about 2500 plus a golden mask",null,null,0,["S 0460","","","S 0460",0]],
["Tyrant",5,"Ocean Songster",[["siren characteristic",null,"T Klein 0723"]],[],"missing","drink inside an Obnis (ancient three-headed sea monster), mostly tamed by the Storm Church",null,"killed-for-characteristic route","characteristic leaves residual spirit",0,["T Klein 0723","","S 0740","S 0723",0]],
["Death",9,"Corpse Collector",[["dried adult black-spotted frog",null,"T Neil 0033"]],[],"missing","none","formula 230; frog 170",null,"needs courage to drink; Dai got special approval after 1 year",0,["T Neil 0033","","","S 0128, T 0278",0]],
["Red Priest",9,"Hunter",[["crimson 'jelly' characteristic substitute","two","I Klein 0243"]],[],"missing","none","each main 50 to 200, about 400 total","Becklan supplied it to gang boss Morse","Morse missed the essence by not setting traps",0,["I Klein 0243","","","S 0237",0]],
["Demoness",7,"Witch",[["whole blood of a black-abyss fish",null,"S 0202"],["peacock-agate egg",null,"S 0202"]],[["pure water","80 ml","S 0202"],["golden mandrake juice","5 drops","S 0202"],["shadow lizard scales","3","S 0202"],["narcissus juice","10 drops","S 0202"]],"known","none",null,"Witch Cult supplies","gender switch (men become women) is a body effect, not a rite",1,["S 0202","S 0202","S 0202","S 0202",0]],
["Demoness",6,"Pleasure Witch",[["pair of succubus-siren eyes","pair","S 0202"],["adult widow-spider silk gland","1","S 0202"]],[["pure water","100 ml","S 0202"],["black mandrake juice","5 drops","S 0202"],["residual siren hair","all","S 0202"],["Fenebot fly powder","10 g","S 0202"],["true mummy ash","5 g","S 0202"]],"known","none",null,null,null,1,["S 0202","S 0202","","",0]],
["Hermit",1,"Knowledge Emperor",[["purified 0-grade artifact characteristic",null,"S 1137"]],[],"missing","refine a grade-0 artifact into a Seq 1 characteristic, ritual smooth",null,null,"Seq 1 seat probably empty because the Seq 0 was a concept (I 0734)",0,["S 1137","","S 1137","",0]],
["Moon",8,"Beast Trainer",[["elf-spring marrow crystal",null,"I Dakewell story 0259, 0306"]],[],"missing","none","300 (Klein sale); 300 to 400 listed elsewhere","Klein sold the crystal for 300 plus a formula clue",null,0,["I Dakewell story 0259, 0306","","","S 0306, S 0295",0]],
["Moon",7,"Vampire",[["vampire blood essence",null,"T Emlyn 0430"]],[],"missing","none",null,null,"natural vampires hate artificial ones because of the blood essence; Baron needs an inheritance rite or the aux materials [T 0607]",0,["T Emlyn 0430","","T 0607","",0]],
["Black Emperor",8,"Barbarian",[["mad-grass plant","1","S 0339"],["earth-rhino solid horn crystal","1","S 0339"]],[["deep-pattern walnut","1","S 0339"],["lemon balm","1","S 0339"],["poplar-bark hydrosol","10 ml","S 0339"],["strong liquor","100 ml","S 0339"]],"known","none","weapons 450 to 520 or one formula","formula as currency",null,1,["S 0339","S 0339","","S 0243, 0278",0]],
["Black Emperor",7,"Briber",[["weeping-baby flower","1","S 0350"],["odd-face cannabis crystal","1","S 0350"]],[["golden mandrake juice","5 drops","S 0350"],["black mandrake juice","5 drops","S 0350"],["hallucination-herb oil","4 drops","S 0350"],["red wine","80 ml","S 0350"]],"known","none","about 800; Klein got 900",null,null,1,["S 0350","S 0350","","S 0350",0]],
["Black Emperor",0,"Black Emperor",[["characteristics of two other living Seq 1 Princes","two","S 0412"]],[],"missing","own a kingdom, make 'emperor' common knowledge, set a strict deliberately abnormal rule set, populace builds nine pyramid-like tombs, drink inside one tomb during simultaneous mass sacrificial rites",null,null,"cannot truly die until all nine tombs fall; King George III shown mid-ritual, collapsed when one tomb was destroyed [S 1179 to 1189]",0,["S 0412","","T card 0327","",0]],
["Justiciar",8,"Sheriff",[["fear-worm eyes",null,"T masked man 0235"],["silver-white war-bear right palm",null,"T masked man 0235"]],[],"missing","none","formula 450 (board); char 600; non-standard materials about 300 each",null,null,0,["T masked man 0235","","","S 0132, T 0403, 0414, T 0403",0]],
["Justiciar",7,"Interrogator",[["flash-pattern black snake horn",null,"T 0462"],["lake-spirit dust",null,"T 0462"]],[],"missing","none","char 1000",null,null,0,["T 0462","","","T 0816",0]],
["Justiciar",6,"Judge",[["Judge sealed item, shattered and recombined",null,"T 1067"]],[],"missing","missing",null,"Gardelia offers one","the item becomes the main",0,["T 1067","","","",0]]
];

// Dials (proposals). The canon ladder is table 0.2; ingredient and Seq 9 formula figures are authored where the notes give none.
export const LOTM_PRICE_SCALE = Object.freeze({canonPounds: 230, scaledPounds: 5, reason: 'The Corpse Collector formula is 230 pounds in canon and 5 in this slice; the same ratio scales every row so a clerk can reach the lowest ones.'});
export const scalePence = pounds => Math.round(pounds * LOTM_PRICE_SCALE.scaledPounds / LOTM_PRICE_SCALE.canonPounds * P.pound);
const FORMULA_CANON = {9: [230, 'proposal; Corpse Collector reference T 0128'], 8: [450, 'T 0132, 0243'], 7: [800, 'T 0350'], 6: [2000, 'T 0459 (asked 3000)'], 5: [5000, 'T 1121 (Druid)']};
const MAIN_CANON = {9: 100, 8: 300, 7: 600, 6: 1500, 5: 4000};
const AUX_CANON = {9: 10, 8: 30, 7: 60, 6: 150, 5: 400};
const MINUTES = {9: 120, 8: 180, 7: 360, 6: 720, 5: 1440, 4: 2880, 3: 4320, 2: 7200, 1: 10080, 0: 14400};
// Acquisition by Sequence tier: default, dial and reason. Seq 9 and 8 materials are ordinary trade goods; Seq 7 to 5 need a special order at a premium and run short;
// Seq 4 and above come as a finished potion plus a rite from a church, so Tingen sells neither formula nor materials (table 0.1 "Church supply").
export const LOTM_TIERS = Object.freeze({
    supplier: Object.freeze({minSeq: 8, stock: 4, markupPercent: 0, reason: 'Sequence 9 and 8 materials are ordinary herbs, powders and fresh organs that a Tingen supplier keeps (table 0.2: main materials 50 to 200 and about 300 pounds).'}),
    order: Object.freeze({minSeq: 5, stock: 2, markupPercent: 25, reason: 'Sequence 7 to 5 materials are rare enough that the broker takes a special order, at a premium, and has only a little stock (table 0.2: 500 to 4000 pounds each).'}),
    none: Object.freeze({minSeq: 0, stock: 0, markupPercent: 0, reason: 'Sequence 4 and above come as a finished potion plus a rite from a church; no Tingen route sells the formula or its materials (table 0.1).'})});
export const tierOf = seq => seq >= LOTM_TIERS.supplier.minSeq ? 'supplier' : seq >= LOTM_TIERS.order.minSeq ? 'order' : 'none';
export const DOSE_MARGIN_PERCENT = 120;

const RITUALS = {
    'Fool.5': ['creature', ['a mermaid (siren) that sings at sea']], 'Fool.4': ['crowd', ['a demigod target', 'a staged play']], 'Fool.3': ['solitary', []],
    'Fool.2': ['territory', ['a lost piece of history']], 'Fool.1': ['territory', ['designed fates', 'a town of puppets']], 'Fool.0': ['territory', ['the history fog']],
    'Sun.5': ['solitary', ['non-melting ice', 'pure darkness']], 'Sun.4': ['solitary', ['the strongest emotion you refuse to give up']],
    'Visionary.5': ['creature', ['a spirit-world harpy tail feather']], 'Visionary.4': ['crowd', ['a gathering of at least 10,000']],
    'Tyrant.5': ['creature', ['an Obnis sea monster']], 'Hermit.1': ['solitary', ['a grade-0 artifact']],
    'Black Emperor.0': ['war', ['a kingdom', 'nine pyramid-like tombs', 'mass sacrificial rites']]};
// Canon routes where the notes give one (row data for a later route mechanism); evidence is the table's tag.
function routeOf(r) {
    const [pathway, seq, , main, , , , price, source] = r, text = `${price ?? ''} ${source ?? ''}`;
    const ev = r[11][3] || r[11][0] || 'table 0.1';
    if(/Tarot Club/.test(text)) return {id: 'tarot_club', text: `Traded through the Tarot Club. ${price ?? ''} ${source ?? ''}`.trim(), evidence: ev};
    if(pathway === 'Visionary' && seq === 9) return {id: 'psychology_alchemists_barter', text: 'The Psychology Alchemists hold many Spectator formulas; Alger traded one for 100 ml of ghost shark blood as the fee.', evidence: 'T Alger 0006, 0060'};
    if(/killed agent/.test(source ?? '')) return {id: 'killed_agent', text: 'A formula taken from a killed agent.', evidence: ev};
    if(/Witch Cult/.test(source ?? '')) return {id: 'cult_supply', text: 'The Witch Cult supplies it to its members.', evidence: ev};
    if(/black market/.test(source ?? '')) return {id: 'black_market', text: `Black market and the Storm Church. ${source}`, evidence: ev};
    if(/formula as currency/.test(source ?? '')) return {id: 'formula_as_currency', text: 'Traded as currency; weapons worth 450 to 520 pounds or one formula buy a Barbarian formula.', evidence: ev};
    if(seq <= 4) return {id: 'church_potion_rite', text: `Sequence 4 and above come as a finished potion plus a rite, issued by the church${source ? ` (${source})` : ''}.`, evidence: 'I Klein 0161, 0706'};
    if(main.some(m => /characteristic/.test(m[0]))) return {id: 'characteristic_hunt', text: "The main material is a dead Beyonder's characteristic: hunt one, or buy one at a church or market price.", evidence: ev};
    return {id: 'church_issue', text: `Low and mid Sequences: the church hands over recipe and materials after the waiting period${source ? ` (${source})` : ''}.`, evidence: 'I Klein 0161, 0706'};
}
const ALIAS = {'pure water': 'purified water'};
const cap = s => s[0].toUpperCase() + s.slice(1);
export const itemName = canon => cap(ALIAS[canon] ?? canon);
export const itemKey = name => JSON.stringify({id: name});
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
export const ingredientSlug = name => slug(name);
const rowId = r => `${slug(r[0])}_${r[1]}`;

// Ingredient registry (full rows only): one runtime item each, priced and tiered by the lowest Sequence using it.
const ing = new Map();
for(const r of RAW) if(r[10]) for(const [role, list] of [['main', r[3]], ['aux', r[4]]]) for(const [canon] of list) {
    const name = itemName(canon), e = ing.get(name) ?? ing.set(name, {name, key: itemKey(name), slug: slug(name), role, seq: r[1], rows: []}).get(name);
    if(r[1] > e.seq) { e.seq = r[1]; e.role = role; }
    e.rows.push(rowId(r));
}
export const LOTM_INGREDIENTS = Object.freeze([...ing.values()].map(e => {
    const tier = tierOf(e.seq), table = e.role === 'main' ? MAIN_CANON : AUX_CANON, canon = table[e.seq] ?? null;
    const base = canon == null ? null : scalePence(canon), pence = base == null ? null : Math.round(base * (100 + LOTM_TIERS[tier].markupPercent) / 100);
    return Object.freeze({name: e.name, key: e.key, slug: e.slug, role: e.role, seq: e.seq, tier, stock: LOTM_TIERS[tier].stock, pence: tier === 'none' ? null : pence, canonPounds: canon, rows: Object.freeze([...new Set(e.rows)])});
}));
const INGREDIENT = Object.fromEntries(LOTM_INGREDIENTS.map(i => [i.name, i]));

function build(r) {
    const [pathway, seq, name, main, aux, auxStatus, ritual, , source, notes, full, tags] = r, id = rowId(r), key = `${pathway}.${seq}`;
    const slotOf = (role, n) => ([canon, qty, evidence], i) => ({id: `${n}${i + 1}`, role, select: {material: itemName(canon)}, qty: 1, ...(qty ? {amount: qty} : {}),
        ...(full ? {key: itemKey(itemName(canon))} : {}), evidence: evidence || (role === 'main' ? tags[0] : tags[1]) || null});
    const slots = [...main.map(slotOf('main', 'm')), ...aux.map(slotOf('aux', 'a'))];
    const gaps = [];
    if(auxStatus === 'missing') gaps.push('Auxiliary materials are not in the notes (M).');
    if(tags[4]) gaps.push('The table lists alternate main materials (an OR line); only the first listed is used here.');
    if(full && [...main, ...aux].some(m => !m[1])) gaps.push('Some amounts are not stated; one lot of each material is assumed.');
    if(ritual === 'missing') gaps.push('The rite is not in the notes (M).');
    if(!full) gaps.push('Inspect-only: the notes do not name every material, so no brew is offered.');
    const row = {id, world: LOTM_WORLD, name, pathway, seq, status: full ? 'brewable' : 'inspect-only', slots, minutes: MINUTES[seq], bench: 'Tingen supervised workroom', route: routeOf(r),
        evidence: [`Potion table row ${key}`, source ? `source: ${source}` : null, notes ? `note: ${notes}` : null].filter(Boolean), gaps};
    if(ritual !== 'missing') row.ritual = ritual === 'none' ? {needed: false, text: 'No rite is needed (table 0.1: low Sequences).', scale: 'solitary', materials: [], evidence: tags[2] || 'table 0.1'}
        : {needed: true, text: ritual, scale: RITUALS[key]?.[0] ?? 'solitary', materials: RITUALS[key]?.[1] ?? [], evidence: tags[2] || 'table'};
    if(full) {
        const total = [...main, ...aux].reduce((n, m) => n + (INGREDIENT[itemName(m[0])].pence ?? 0), 0);
        row.product = {key: itemKey(`Brewed ${name} dose (Sequence ${seq})`), kind: 'dose', name: `Brewed ${name} dose (Sequence ${seq})`, sellPence: total ? Math.round(total * DOSE_MARGIN_PERCENT / 100 / P.soli) * P.soli : null};
        if(FORMULA_CANON[seq]) {
            const [pounds, evidence] = FORMULA_CANON[seq];
            row.price = {pence: scalePence(pounds), canon: {pounds, evidence}, proposal: true, scale: 'canon price scaled by LOTM_PRICE_SCALE'};
        } else gaps.push('No formula price in the notes and no Tingen route sells it.');
    }
    return defineProcess(row);
}
export const LOTM_FORMULA_ROWS = Object.freeze(RAW.map(build));
export const LOTM_BREWABLE_ROWS = Object.freeze(LOTM_FORMULA_ROWS.filter(r => r.status === 'brewable'));
export const rowById = id => LOTM_FORMULA_ROWS.find(r => r.id === id);
// Item specifications for the runtime (content.js appends these): one per ingredient and one dose per brewable row.
export const LOTM_BENCH_ITEMS = Object.freeze([
    ...LOTM_INGREDIENTS.map(i => [i.name, `${cap(i.role)} material for ${i.rows.length > 1 ? 'several Beyonder potion formulas' : 'a Beyonder potion formula'}. Sold in Tingen only where the sequence tier allows.`]),
    ...LOTM_BREWABLE_ROWS.map(r => [r.product.name, `A brewed dose of the Sequence ${r.seq} ${r.name} potion. Holding it grants nothing; whether it can be drunk yet depends on whether this pathway's ingestion is written.`])]);
