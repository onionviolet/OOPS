// Re:Zero power denominator, stage 2 (PWC3): merges the names the Luna pass collected from the deep dives and
// reader digests into one row per power. The merge table below is a hand-checked alias map (2026-11-16): each
// key is a normalised name the pass produced, each value says where it lands. Anything not listed becomes its own
// row, so no extracted name is lost. LN and WN renderings of one power merge here and the row keeps both
// editions (SKR1). Every row records the chunk locators its names came from.
export const norm = s => String(s).toLowerCase().replace(/[’']s\b/g, '').replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

// target: [class, slug, display name] merges the raw name into that row; {not: 'reason'} makes a not-a-thing row of
// the raw name; a string 'slug' keeps the extracted class with a normalised slug.
const to = (cls, slug, name) => ({cls, slug, name});
const not = reason => ({not: reason});
export const MERGE = {
    // The nine Factors (one row per sin) and the generic words that point at them.
    'sloth': to('witch_factor', 'sloth', 'Sloth'), 'greed': to('witch_factor', 'greed', 'Greed'),
    'gluttony': to('witch_factor', 'gluttony', 'Gluttony'), 'wrath': to('witch_factor', 'wrath', 'Wrath'),
    'lust': to('witch_factor', 'lust', 'Lust'), 'pride': to('witch_factor', 'pride', 'Pride'), 'envy': to('witch_factor', 'envy', 'Envy'),
    'vainglory': to('witch_factor', 'vainglory', 'Vainglory'),
    'melancholy': to('witch_factor', 'melancholy', 'Melancholy'), 'tristitia': to('witch_factor', 'melancholy', 'Melancholy'),
    'gluttony authority': to('witch_factor', 'gluttony', 'Gluttony'), 'greed authority regulus': to('witch_factor', 'greed', 'Greed'),
    'witch factor': not('generic-term'), 'witch factors': not('generic-term'), 'divine protection': not('generic-term'),
    'spirit contracts': not('generic-term'), 'spirit arts': not('generic-term'), 'spirit pact': not('generic-term'), 'makeshift': not('generic-term'),
    'sixhue magic': not('generic-term'), 'roswaal magic': not('generic-term'),
    // Authorities: one row per named manifestation; the holder-free names are what the text calls the working.
    'invisible providence': to('authority', 'invisible-providence', 'Invisible Providence (Unseen Hand)'),
    'unseen hand': to('authority', 'invisible-providence', 'Invisible Providence (Unseen Hand)'),
    'unseen hands': to('authority', 'invisible-providence', 'Invisible Providence (Unseen Hand)'),
    'cor leonis': to('authority', 'cor-leonis', "Cor Leonis (Lion's Heart, Subaru's use)"),
    'als territory': to('authority', 'territory', "Territory (Al's Domain, Matrix)"), 'territory': to('authority', 'territory', "Territory (Al's Domain, Matrix)"),
    'envy shadow': to('authority', 'envy-shadow', 'Envy shadow'),
    // A shroud excitation is Cor Leonis's shared-burden working in round 1, listed twice under two classes.
    'shroud excitation': to('authority', 'shroud-excitation', 'Shroud Excitation'),
    'possession': to('authority', 'possession', 'Possession (spirit possessing a body)'),
    'minerva healing': to('authority', 'minerva-healing', 'Minerva healing'),
    'tea pact and memory edit': to('other_art', 'tea-party-memory-edit', "Echidna's tea-party memory edit"),
    // Spells. Tier prefixes El, Ul, Al; the readers' spellings of one root merge.
    'algoa': to('spell', 'al-goa', 'Al Goa'), 'ulgoa': to('spell', 'ul-goa', 'Ul Goa'),
    'el hyuma': to('spell', 'el-huma', 'El Huma'), 'ul hyuma': to('spell', 'ul-huma', 'Ul Huma'), 'al hyuma': to('spell', 'al-huma', 'Al Huma'),
    'hyuma': to('spell', 'huma', 'Huma'),
    'el fulla': to('spell', 'el-fula', 'El Fula'), 'blade of wind': to('spell', 'el-fula', 'El Fula'), 'fura': to('spell', 'fula', 'Fula (Fura)'), 'fula': to('spell', 'fula', 'Fula (Fura)'),
    'ul doona': to('spell', 'ul-dona', 'Ul Dona'), 'doona': to('spell', 'dona', 'Dona'),
    'shamac': to('spell', 'shamak', 'Shamak'), 'shamaak': to('spell', 'shamak', 'Shamak'),
    'al shamac': to('spell', 'al-shamak', 'Al Shamak'), 'ul shamac': to('spell', 'ul-shamak', 'Ul Shamak'),
    'meenya': to('spell', 'minya', 'Minya'),
    'spell:el': not('tier-prefix'), 'spell:ul': not('tier-prefix'), 'spell:al': not('tier-prefix'),
    'spell:fire': not('attribute-word'), 'spell:water': not('attribute-word'), 'spell:wind': not('attribute-word'), 'spell:earth': not('attribute-word'),
    'spell:yin': not('attribute-word'), 'spell:yang': not('attribute-word'), 'spell:true yin': not('attribute-word'), 'spell:blue': not('attribute-word'),
    'spell:dark': not('attribute-word'), 'spell:light': not('attribute-word'),
    'healing': to('spell', 'healing-magic', 'Healing magic'), 'healing magic': to('spell', 'healing-magic', 'Healing magic'),
    'time magic': to('spell', 'time-magic', 'Time magic'),
    'passage': to('other_art', 'gate-crossing', 'Gate Crossing (Passage)'), 'gate crossing': to('other_art', 'gate-crossing', 'Gate Crossing (Passage)'),
    'original spell part 2': to('spell', 'original-spell-part-2', 'Original Spell Part 2'),
    'clairvoyance': to('other_art', 'clairvoyance', 'Clairvoyance'),
    // Curses.
    'beastbite curse': to('curse', 'beast-curse', 'Beast curse (beastbite)'), 'beastcurse': to('curse', 'beast-curse', 'Beast curse (beastbite)'),
    'curse shaman rite': to('curse', 'curse-shaman-rite', 'Curse shaman rite'), 'shaman curses': to('curse', 'curse-shaman-rite', 'Curse shaman rite'),
    'witchs hand': to('curse', 'witchs-hand', "Witch's Hand (Black Hand)"),
    'gluttony nameandmemory curse': to('curse', 'name-and-memory-curse', 'Name and memory curse'),
    // Divine Protections: the LN and WN renderings of one blessing merge here.
    'earth soul': to('divine_protection', 'earth-spirits', "Earth Spirits (Earthsoul, Garfiel's)"), 'earthsoul': to('divine_protection', 'earth-spirits', "Earth Spirits (Earthsoul, Garfiel's)"),
    'earth spirits': to('divine_protection', 'earth-spirits', "Earth Spirits (Earthsoul, Garfiel's)"),
    'blessing of xenoglossy': to('divine_protection', 'soul-of-language', "Soul of Language (Xenoglossy, Otto's)"), 'xenoglossy': to('divine_protection', 'soul-of-language', "Soul of Language (Xenoglossy, Otto's)"),
    'soul of language': to('divine_protection', 'soul-of-language', "Soul of Language (Xenoglossy, Otto's)"), 'otto language blessing': to('divine_protection', 'soul-of-language', "Soul of Language (Xenoglossy, Otto's)"),
    'windbreaker blessing': to('divine_protection', 'wind-evasion', 'Wind Evasion (Windbreaker)'), 'windbreaker': to('divine_protection', 'wind-evasion', 'Wind Evasion (Windbreaker)'),
    'land dragon windrepel': to('divine_protection', 'wind-evasion', 'Wind Evasion (Windbreaker)'), 'wind evasion': to('divine_protection', 'wind-evasion', 'Wind Evasion (Windbreaker)'),
    'reaper blessing': to('divine_protection', 'death-god', 'Death God (reaper blessing)'), 'death god': to('divine_protection', 'death-god', 'Death God (reaper blessing)'),
    'cruschs wind reading and blade': to('divine_protection', 'wind-reading', 'Wind Reading'),
    'armor durability': to('divine_protection', 'durability', 'Durability'),
    'phoenix': to('divine_protection', 'phoenix', 'Phoenix (next Phoenix)'),
    'far sight': to('divine_protection', 'farsight', 'Farsight'),
    'sorcery': not('non-canon'),
    // Other arts and books.
    'deathsight': not('fan-invented'),
    'gospels': to('other_art', 'gospel', 'Gospel'), 'gospel': to('other_art', 'gospel', 'Gospel'), 'imperfect cult gospel': to('other_art', 'gospel', 'Gospel'), 'perfected gospel': to('other_art', 'gospel', 'Gospel'),
    'noh masks': to('other_art', 'chisha-noh', 'Noh masks (Chisha)'), 'chisha noh': to('other_art', 'chisha-noh', 'Noh masks (Chisha)'),
    'od lagna': to('other_art', 'od-lagna', 'Od Lagna (Od Laguna)'),
    'od': not('resource-stock'), 'odflow method': to('other_art', 'flow-method', 'Flow Method'),
    'book of wisdom': to('other_art', 'book-of-wisdom', 'Book of Wisdom'),
    'hall of memories': to('other_art', 'hall-of-memories', 'Hall of Memories'),
    'books of the dead': to('other_art', 'books-of-the-dead', 'Books of the Dead'),
    // Return by Death and its rule.
    'rbd': to('return_by_death', 'return-by-death', 'Return by Death'), 'return by death': to('return_by_death', 'return-by-death', 'Return by Death'),
    'taboo on telling': to('return_by_death', 'telling-penalty', 'Telling penalty (taboo on telling)'),
    // Spirit contract kinds.
    "Beatrice's contract": to('spirit_contract', 'beatrice-subaru', 'Beatrice and Subaru contract'), 'beatrice subaru spirit contract': to('spirit_contract', 'beatrice-subaru', 'Beatrice and Subaru contract'),
    'puckemilia contract': to('spirit_contract', 'puck-emilia', 'Puck and Emilia contract'), 'puck great spirit emilias contract': to('spirit_contract', 'puck-emilia', 'Puck and Emilia contract'),
    'formal spirit contract': to('spirit_contract', 'formal-contract', 'Formal spirit contract'), 'provisional spirit contract': to('spirit_contract', 'provisional-contract', 'Provisional spirit contract'),
    'julius quasispirits': to('spirit_contract', 'quasi-spirits', "Quasi-spirits (Julius's)"),
    'neverending pact': to('spirit_contract', 'neverending-pact', 'Neverending pact'),
    'ramroswaal vassalage contract': to('spirit_contract', 'ram-roswaal', 'Ram and Roswaal vassalage contract'),
    'soulcarved contract': to('spirit_contract', 'soul-carved-contract', 'Soul-carved contract'),
    'spirit on loan': to('spirit_contract', 'spirit-on-loan', 'Spirit on loan'),
    'sanctuary contract': to('spirit_contract', 'sanctuary-contract', 'Sanctuary contract'),
    'fredericas contract': to('spirit_contract', 'frederica-contract', "Frederica's contract"),
};


// Spellings the first merge pass missed (found when the table was checked against the 159 merged rows).
Object.assign(MERGE, {
    'beast bite curse': to('curse', 'beast-curse', 'Beast curse (beastbite)'), 'witch hand': to('curse', 'witchs-hand', "Witch's Hand (Black Hand)"),
    'crusch wind reading and blade': to('divine_protection', 'wind-reading', 'Wind Reading'),
    'land dragon wind repel': to('divine_protection', 'wind-evasion', 'Wind Evasion (Windbreaker)'),
    'puck great spirit emilia contract': to('spirit_contract', 'puck-emilia', 'Puck and Emilia contract'),
    'puck emilia contract': to('spirit_contract', 'puck-emilia', 'Puck and Emilia contract'),
    'beatrice contract': to('spirit_contract', 'beatrice-subaru', 'Beatrice and Subaru contract'),
    'julius quasi spirits': to('spirit_contract', 'quasi-spirits', "Quasi-spirits (Julius's)"),
    'ram roswaal vassalage contract': to('spirit_contract', 'ram-roswaal', 'Ram and Roswaal vassalage contract'),
    'never ending pact': to('spirit_contract', 'neverending-pact', 'Neverending pact'),
    'soul carved contract': to('spirit_contract', 'soul-carved-contract', 'Soul-carved contract'),
    'od flow method': to('other_art', 'flow-method', 'Flow Method'),
    'hundred man slash': to('other_art', 'hundred-man-slash', 'Hundred-Man Slash'),
    'tiger den': to('divine_protection', 'tigers-den', "Tiger's Den"),
    'beatrice amethyst spears': to('spell', 'amethyst-spears', "Beatrice's amethyst spears"),
});

Object.assign(MERGE, {
    'little king': to('authority', 'little-king', "Little King (Regulus's Greed Authority)"),
    'substitute heart wives': to('authority', 'little-king', "Little King (Regulus's Greed Authority)"),
    'compression': to('authority', 'compression', 'Compression (Melancholy)'),
    // Names the free scan of the WN capture found: translation variants merge into the row the digests use.
    'fiend manipulation': to('divine_protection', 'demon-manipulation', 'Demon Manipulation (Fiend Manipulation)'),
    'soul language': to('divine_protection', 'soul-of-language', "Soul of Language (Xenoglossy, Otto's)"),
    'gathering sprits': to('divine_protection', 'gathering-spirits', 'Gathering Spirits'),
    'ambush': to('divine_protection', 'ambushing', 'Ambushing (Ambush, Concealing Cloud)'), 'concealing cloud': to('divine_protection', 'ambushing', 'Ambushing (Ambush, Concealing Cloud)'),
    'ambushing': to('divine_protection', 'ambushing', 'Ambushing (Ambush, Concealing Cloud)'),
    'divine_protection:earth': to('divine_protection', 'earth-spirits', "Earth Spirits (Earthsoul, Garfiel's)"),
    'divine_protection:lakes': not('sentence-fragment'),
    'divine_protection:yang sword': not('oath-phrase'),
    'tigers den': to('divine_protection', 'tigers-den', "Tiger's Den"),
    'al shamac': to('spell', 'al-shamak', 'Al Shamak'),
    'divine_protection:water': to('divine_protection', 'water', 'Water (Ferris)'),
});

// Powers the sources name in a table row or sentence that the pass did not list as such; each cites the line.
export const SUPPLEMENT = [
    {cls: 'authority', slug: 'time-stop', name: "Regulus's time stop", edition: 'WN', locator: 'DD1:74', aliases: ['time stop']},
    // WN Arc 5 ch52 and ch56 give Little King as the Authority title and the substitute-heart wives as its working.
    {cls: 'authority', slug: 'little-king', name: "Little King (Regulus's Greed Authority)", edition: 'WN', locator: 'DD1:74', aliases: ['Little King', 'substitute-heart wives']},
];

// Keys are written in readable form and normalised once, so "Beatrice's contract" and "beatrices contract" both land.
const TABLE = Object.fromEntries(Object.entries(MERGE).map(([k, v]) => [k.includes(':') ? `${k.split(':')[0]}:${norm(k.split(':')[1])}` : norm(k), v]));
const lookup = (cls, name) => TABLE[`${cls}:${norm(name)}`] ?? TABLE[norm(name)];

const EDITION_RANK = ['LN', 'WN'];
const mergeEdition = (a, b) => {
    const s = new Set(`${a},${b}`.split(/[,+/ ]+/).filter(x => EDITION_RANK.includes(x)));
    return s.size ? [...s].sort().join('+') : 'unknown';
};

// names: the private pass file ({chunkLocator: {reply: {powers}, edition}}). Returns [{id, cls, name, aliases, editions,
// nameSources, notAThing?}] sorted by id. A row's id is rz.<class>.<slug>.
export function canonicalise(names, scan = {}) {
    const rows = new Map();
    const row = (cls, slug, name) => {
        const id = `rz.${cls}.${slug}`;
        if (!rows.has(id)) rows.set(id, {id, cls, name, aliases: new Set(), editions: '', nameSources: new Set(), mentions: 0});
        return rows.get(id);
    };
    for (const [chunk, r] of Object.entries(names)) {
        if (!r.reply) continue;
        for (const p of r.reply.powers) {
            const key = norm(p.name);
            const hit = lookup(p.class, p.name) ?? p.aliases.map(a => lookup(p.class, a)).find(Boolean);
            const slug = key.replace(/ /g, '-');
            const target = hit?.not ? row(p.class, slug, p.name) : hit ? row(hit.cls, hit.slug, hit.name) : row(p.class, slug, p.name);
            if (hit?.not) target.notAThing = hit.not;
            target.aliases.add(p.name);
            for (const a of p.aliases) target.aliases.add(a);
            const tag = p.edition_note === 'both' ? 'LN+WN' : (p.edition_note || r.edition);
            target.editions = mergeEdition(target.editions, tag);
            target.nameSources.add(`${chunk}@l.${p.line}`);
            target.mentions++;
        }
    }
    // The free WN and IF scan (scripts/rezero_power_wn_scan.py): a name seen in the captures is a row, with its locators.
    for (const [key, e] of Object.entries(scan)) {
        const name = key.slice(key.indexOf('|') + 1);
        const hit = lookup(e.cls, name);
        const slug = norm(name).replace(/ /g, '-');
        const target = hit?.not ? row(e.cls, slug, name) : hit ? row(hit.cls, hit.slug, hit.name) : row(e.cls, slug, name);
        if (hit?.not) target.notAThing = hit.not;
        target.aliases.add(name);
        target.editions = mergeEdition(target.editions, 'WN');
        target.nameSources.add(`scan:${e.locators.join(',')}`);
        target.mentions += e.count;
    }
    for (const s of SUPPLEMENT) {
        const t = row(s.cls, s.slug, s.name);
        s.aliases.forEach(a => t.aliases.add(a));
        t.editions = mergeEdition(t.editions, s.edition);
        t.nameSources.add(`${s.locator}@supplement`);
    }
    return [...rows.values()].map(r => ({...r, aliases: [...r.aliases].sort(), nameSources: [...r.nameSources].sort()}))
        .sort((a, b) => a.id.localeCompare(b.id));
}
