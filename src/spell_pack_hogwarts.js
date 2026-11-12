// Hogwarts spell world pack (chat S): canon spells as rows of parts with an
// authored truth sentence, from docs/research/HOGWARTS_SPELLBOOK_2026-11-11.md
// (omnibus locators, SHA-256 prefix 9db33901964c). PFP1: a canon spell costs a row.
// Evidence kinds (SKR1, SKR3): forms and outcomes are shown in the book; roots are
// a lexical reading (inference, after the vocabulary proposal V1); gesture and
// delivery are recorded only where the book shows them, else 'unrecorded'.
// Cost is stamina and carrier the wand for every row: an original game default
// (dial per world), since the books state no cost.

// truth: 'verb object target time [direction]'
const row = (id, family, forms, roots, intent, target, execution, locator, truth, extra = {}) => {
    const [verb, object, tTarget, time, direction = null] = truth.split(' ');
    return Object.freeze({id, family, forms, roots, intent, target, execution, locator,
        delivery: extra.delivery ?? 'spoken', gesture: extra.gesture ?? 'unrecorded',
        truth: Object.freeze({verb, object, target: tTarget, time, direction}), reserved: extra.reserved ?? null, note: extra.note ?? null});
};

// Held-out families for the canon test (PFP17): kept out of every fit that tests them.
export const HP_RESERVED_FAMILIES = Object.freeze({
    wandlight: 'Vocabulary proposal V2: the wand-light family was reserved before any rule was derived.',
    corpus: 'The -corpus family tests whether a body root carries across words.',
});

export const HP_SPELL_ROWS = Object.freeze([
    // Move, stop and position
    row('levitation', 'move', ['Wingardium Leviosa'], ['wing', 'lev'], 'raise', 'object', 'sustained', 'B1 pp137-138; B7 p3716', 'move position object sustained up', {gesture: 'swish_flick'}),
    row('summoning', 'move', ['Accio'], ['acci'], 'fetch', 'object', 'instant', 'B4 p1461; B7 p4162', 'move position object instant toward_caster'),
    row('locomotion', 'move', ['Locomotor'], ['loco', 'mot'], 'carry', 'object', 'sustained', 'B5 pp1903, 2519', 'move position object sustained along'),
    row('mobilicorpus', 'move', ['Mobilicorpus'], ['mobil', 'corpus'], 'carry', 'body', 'sustained', 'B3 p1039', 'move position body sustained along', {delivery: 'muttered', reserved: 'corpus'}),
    row('mobiliarbus', 'move', ['Mobiliarbus'], ['mobil', 'arbor'], 'carry', 'object', 'sustained', 'B3 p847', 'move position object sustained along'),
    row('dangling', 'move', ['Levicorpus'], ['lev', 'corpus'], 'raise', 'body', 'sustained', 'B6 p3132; B7 p4163', 'move position body sustained up', {delivery: 'mental', gesture: 'flick_up', reserved: 'corpus'}),
    row('dangling-release', 'move', ['Liberacorpus'], ['liber', 'corpus'], 'free', 'effect', 'instant', 'B6 p3132; B7 p4163', 'end effect effect instant', {delivery: 'mental', reserved: 'corpus'}),
    row('descend', 'move', ['Descendo'], ['descend'], 'lower', 'object', 'instant', 'B7 p4245', 'move position object instant down'),
    row('impediment', 'move', ['Impedimenta'], ['imped'], 'hold', 'creature', 'timed', 'B4 p1731', 'bind motion creature timed'),
    row('leg-lock', 'move', ['Locomotor Mortis'], ['loco', 'mot', 'mort'], 'hold', 'body', 'timed', 'B1 pp175, 178', 'bind motion body timed'),
    row('body-bind', 'move', ['Petrificus Totalus'], ['petr', 'total'], 'hold', 'body', 'lasting', 'B1 p219', 'bind motion body lasting'),
    row('portkey', 'move', ['Portus'], ['port'], 'travel', 'object', 'triggered', 'B5 p2773', 'move position object triggered to_place'),
    row('erecto', 'move', ['Erecto'], ['erect'], 'raise', 'object', 'lasting', 'B7 p3917', 'move position object lasting up', {note: 'Sets tent canvas up; the standing shape persists.'}),
    // Defend, interrupt and end
    row('shield', 'defend', ['Protego'], ['proteg'], 'shield', 'self', 'sustained', 'B6 pp3058-3059; B7 p4018', 'block harm self sustained'),
    row('perimeter', 'defend', ['Protego Totalum'], ['proteg', 'total'], 'ward', 'place', 'lasting', 'B7 pp3916, 4058', 'alter_law access place lasting'),
    row('muggle-repelling', 'defend', ['Repello Muggletum'], ['repell', 'muggle'], 'ward', 'place', 'lasting', 'B7 pp3916, 3936', 'alter_law access place lasting'),
    row('counter-spell', 'defend', ['Finite Incantatem', 'Finite'], ['fin', 'incant'], 'end', 'effect', 'instant', 'B2 p461; B7 p4245', 'end effect effect instant'),
    row('relash', 'defend', ['Relashio'], ['relash'], 'free', 'effect', 'instant', 'B7 p4165', 'end effect effect instant'),
    row('disarm', 'defend', ['Expelliarmus'], ['expell', 'arm'], 'disarm', 'creature', 'instant', 'B2 p459; B7 p3987', 'move custody creature instant away'),
    // Make, change and repair
    row('water', 'make', ['Aguamenti'], ['agua'], 'pour', 'place', 'instant', 'B7 p4247', 'add water place instant'),
    row('fire', 'make', ['Incendio'], ['incend'], 'kindle', 'object', 'instant', 'B6 p3615', 'add fire object instant'),
    row('light', 'make', ['Lumos'], ['lum'], 'light', 'implement', 'sustained', 'B5 p1862; B3 p992', 'add light implement sustained', {delivery: 'whispered', reserved: 'wandlight'}),
    row('extinguish', 'make', ['Nox'], ['nox'], 'darken', 'effect', 'instant', 'B3 p995; B7 p4265', 'remove light effect instant', {reserved: 'wandlight'}),
    row('mend', 'make', ['Reparo'], ['repar'], 'mend', 'object', 'instant', 'B7 pp3987, 4354', 'transform integrity object instant restore'),
    row('sever', 'make', ['Diffindo'], ['diffind'], 'sever', 'object', 'instant', 'B7 p4008', 'remove integrity object instant'),
    row('glisseo', 'make', ['Glisseo'], ['gliss'], 'reshape', 'object', 'lasting', 'B7 p4258', 'transform form object lasting'),
    row('duro', 'make', ['Duro'], ['dur'], 'harden', 'object', 'lasting', 'B7 p4258', 'transform material object lasting harder'),
    row('defodio', 'make', ['Defodio'], ['fod'], 'dig', 'place', 'instant', 'B7 p4166', 'remove material place instant carve'),
    row('deprimo', 'make', ['Deprimo'], ['deprim'], 'blast', 'place', 'instant', 'B7 p4057', 'remove integrity place instant burst'),
    row('reducto', 'make', ['Reducto'], ['reduc'], 'blast', 'object', 'instant', 'B5 p2736 (concordance lead)', 'remove integrity object instant burst'),
    row('blasting', 'make', ['Confringo'], ['confring'], 'blast', 'object', 'instant', 'B7 p3981', 'remove integrity object instant burst'),
    row('expulso', 'make', ['Expulso'], ['expuls'], 'blast', 'object', 'instant', 'B7 p3816', 'remove integrity object instant burst'),
    row('vanish', 'make', ['Evanesco'], ['evanesc'], 'vanish', 'object', 'instant', 'B5 pp2106, 2203', 'remove presence object instant'),
    row('duplicate', 'make', ['Geminio'], ['gemin'], 'duplicate', 'object', 'instant', 'B7 p3907', 'copy form object instant'),
    row('engorge', 'make', ['Engorgio'], ['engorg'], 'enlarge', 'object', 'lasting', 'B7 p4029', 'transform size object lasting up'),
    row('reduce', 'make', ['Reducio'], ['reduc'], 'shrink', 'object', 'lasting', 'B4 p1320; B7 p4029', 'transform size object lasting down'),
    row('clean', 'make', ['Scourgify'], ['scour'], 'clean', 'object', 'instant', 'B5 p2576', 'remove material object instant surface'),
    row('wipe', 'make', ['Tergeo'], ['terg'], 'clean', 'object', 'instant', 'B7 p3976', 'remove material object instant surface'),
    // See, know, signal and conceal
    row('person-reveal', 'see', ['Homenum Revelio'], ['homin', 'revel'], 'reveal', 'area', 'instant', 'B7 pp3822, 4056', 'sense presence area instant'),
    row('properties-reveal', 'see', ['Specialis Revelio'], ['special', 'revel'], 'read', 'object', 'instant', 'B6 pp3075, 3307-3309', 'sense mark object instant'),
    row('aparecium', 'see', ['Aparecium'], ['appar'], 'read', 'object', 'instant', 'B2 p506', 'sense mark object instant', {note: 'This cast shows no result; the attempt is canon, the reveal is not.'}),
    row('point', 'see', ['Point Me'], ['point'], 'guide', 'implement', 'instant', 'B4 pp1715, 1736', 'sense position implement instant'),
    row('mark', 'see', ['Flagrate'], ['flagr'], 'mark', 'place', 'lasting', 'B5 p2719', 'add mark place lasting'),
    row('amplify', 'see', ['Sonorus'], ['son'], 'amplify', 'self', 'sustained', 'B4 p1726', 'add voice self sustained'),
    row('quiet', 'see', ['Quietus'], ['quiet'], 'end', 'effect', 'instant', 'B4 p1223', 'end effect effect instant'),
    row('silence', 'see', ['Silencio'], ['silen'], 'silence', 'creature', 'timed', 'B5 p2742', 'block voice creature timed'),
    row('muffle', 'see', ['Muffliato'], ['muffl'], 'muffle', 'area', 'sustained', 'B6 p3131', 'block sound area sustained'),
    row('blind', 'see', ['Obscura'], ['obscur'], 'blind', 'creature', 'lasting', 'B7 p3943', 'block sight creature lasting'),
    // Change a creature, mind or ongoing condition
    row('stun', 'mind', ['Stupefy'], ['stupe'], 'stun', 'creature', 'timed', 'B4 p1433', 'bind mind creature timed'),
    row('revive', 'mind', ['Rennervate', 'Ennervate'], ['nerv'], 'revive', 'creature', 'instant', 'B4 p1788; B6 p3561', 'end effect creature instant mind'),
    row('episkey', 'mind', ['Episkey'], ['episk'], 'heal', 'body', 'instant', 'B6 p3192', 'transform vitality body instant restore'),
    row('sectum', 'mind', ['Sectumsempra'], ['sect', 'semper'], 'hurt', 'body', 'lasting', 'B6 pp3494-3495', 'remove vitality body lasting'),
    row('pain', 'mind', ['Crucio'], ['cruc'], 'torment', 'creature', 'sustained', 'B5 p2764; B7 p4212', 'add pain creature sustained'),
    row('control', 'mind', ['Imperio'], ['imper'], 'compel', 'creature', 'sustained', 'B4 p1318; B7 p4213', 'command mind creature sustained'),
    row('memory', 'mind', ['Obliviate'], ['obliv'], 'forget', 'creature', 'lasting', 'B2 p584; B4 p1184', 'transform memory creature lasting'),
    row('confuse', 'mind', ['Confundo'], ['confund'], 'confuse', 'creature', 'timed', 'B7 p4153', 'transform mind creature timed'),
    row('tickle', 'mind', ['Rictusempra'], ['rict', 'semper'], 'afflict', 'creature', 'timed', 'B2 pp460-461', 'transform form creature timed body'),
    row('dance', 'mind', ['Tarantallegra'], ['tarant', 'allegr'], 'afflict', 'body', 'timed', 'B2 p461; B5 p2754', 'transform form body timed body'),
    row('teeth', 'mind', ['Densaugeo'], ['dens', 'aug'], 'afflict', 'body', 'lasting', 'B4 p1404', 'transform form body lasting body'),
    row('tongue-lock', 'mind', ['Langlock'], ['lang', 'lock'], 'hold', 'body', 'timed', 'B6 p3367', 'bind motion body timed'),
    row('rope', 'mind', ['Incarcerous'], ['incarcer'], 'hold', 'body', 'lasting', 'B6 p3562', 'bind motion body lasting'),
    row('bird', 'mind', ['Avis'], ['avi'], 'summon_agent', 'place', 'instant', 'B4 p1416', 'add agent place instant'),
    row('serpent', 'mind', ['Serpensortia'], ['serpen'], 'summon_agent', 'place', 'instant', 'B2 p462', 'add agent place instant'),
    row('oppugno', 'mind', ['Oppugno'], ['oppugn'], 'direct', 'creature', 'instant', 'B6 p3213', 'command agent creature instant'),
    row('animate', 'mind', ['Piertotum Locomotor'], ['petr', 'total', 'loco', 'mot'], 'animate', 'object', 'sustained', 'B7 pp4220-4221', 'animate agent object sustained'),
    row('patronus', 'mind', ['Expecto Patronum'], ['expect', 'patron'], 'summon_agent', 'self', 'sustained', 'B3 pp884-887', 'add agent self sustained', {note: 'Focus on a happy memory is part of the technique (B3 pp885-887).'}),
    row('boggart', 'mind', ['Riddikulus'], ['ridic'], 'reshape', 'creature', 'instant', 'B3 pp772-778', 'transform form creature instant'),
    // Access and commitments
    row('unlock', 'access', ['Alohomora'], ['aloho'], 'open', 'object', 'instant', 'B1 pp128, 225', 'add access object instant'),
    row('lock', 'access', ['Colloportus'], ['coll', 'port'], 'seal', 'object', 'lasting', 'B5 p2737', 'remove access object lasting'),
]);

// What the pack sets for the grammar's world-fact slots (original defaults, dial per world).
export const HP_SPELL_WORLD = Object.freeze({world: 'hogwarts', carrier: 'wand', cost: 'stamina', access: 'taught'});

// Root glosses from Latin, Greek and English dictionaries (inference, SKR3; the
// vocabulary proposal V1 lists levis, levo and arduus as comparisons, not proof).
// A gloss names what the word means, mapped to intents a caster could will by it.
const gloss = (g, ...intents) => Object.freeze({gloss: g, intents});
export const HP_ROOT_LEXICON = Object.freeze({
    lev: gloss('Latin levo, to raise; levis, light in weight', 'raise'),
    lum: gloss('Latin lumen, light', 'light'),
    nox: gloss('Latin nox, night', 'darken'),
    liber: gloss('Latin liber, free', 'free'),
    corpus: gloss('Latin corpus, body'),
    mobil: gloss('Latin mobilis, movable', 'carry'),
    loco: gloss('Latin locus, place', 'carry', 'travel'),
    mot: gloss('Latin motus, motion', 'carry'),
    mort: gloss('Latin mors, death'),
    acci: gloss('Latin accio, to summon', 'fetch'),
    descend: gloss('Latin descendo, to come down', 'lower'),
    imped: gloss('Latin impedio, to hinder', 'hold'),
    petr: gloss('Greek petra, rock', 'hold', 'harden'),
    port: gloss('Latin porta, gate; porto, to carry', 'travel', 'open'),
    proteg: gloss('Latin protego, to cover, protect', 'shield'),
    repell: gloss('Latin repello, to drive back', 'ward', 'send'),
    fin: gloss('Latin finis, end', 'end'),
    expell: gloss('Latin expello, to drive out', 'disarm', 'send'),
    agua: gloss('Latin aqua, water', 'pour'),
    incend: gloss('Latin incendo, to set fire', 'kindle'),
    repar: gloss('Latin reparo, to restore', 'mend'),
    dur: gloss('Latin durus, hard', 'harden'),
    reduc: gloss('Latin reduco, to lead back, reduce', 'shrink'),
    evanesc: gloss('Latin evanesco, to vanish', 'vanish'),
    gemin: gloss('Latin geminus, twin', 'duplicate'),
    engorg: gloss('English engorge, to swell', 'enlarge'),
    scour: gloss('English scour, to scrub', 'clean'),
    terg: gloss('Latin tergeo, to wipe', 'clean'),
    revel: gloss('Latin revelo, to unveil', 'reveal', 'read'),
    homin: gloss('Latin homo, person'),
    appar: gloss('Latin appareo, to appear', 'read', 'reveal'),
    son: gloss('Latin sonus, sound', 'amplify'),
    quiet: gloss('Latin quietus, at rest', 'end'),
    silen: gloss('Latin silentium, silence', 'silence'),
    obscur: gloss('Latin obscurus, dark, hidden', 'blind', 'conceal'),
    stupe: gloss('Latin stupeo, to be stunned', 'stun'),
    nerv: gloss('Latin nervus, sinew, vigour', 'revive'),
    sect: gloss('Latin seco, to cut', 'hurt', 'sever'),
    cruc: gloss('Latin crucio, to torture', 'torment'),
    imper: gloss('Latin impero, to command', 'compel'),
    obliv: gloss('Latin oblivio, forgetting', 'forget'),
    confund: gloss('Latin confundo, to confuse', 'confuse'),
    avi: gloss('Latin avis, bird', 'summon_agent'),
    serpen: gloss('Latin serpens, snake', 'summon_agent'),
    oppugn: gloss('Latin oppugno, to attack', 'direct'),
    patron: gloss('Latin patronus, protector', 'summon_agent', 'shield'),
    ridic: gloss('Latin ridiculus, laughable', 'reshape'),
    aloho: gloss('unclear; no dictionary gloss'),
    coll: gloss('Latin colligo, to bind together', 'seal'),
    incarcer: gloss('Latin carcer, prison', 'hold'),
    flagr: gloss('Latin flagro, to blaze', 'mark', 'kindle'),
    erect: gloss('Latin erigo, to set upright', 'raise'),
    diffind: gloss('Latin diffindo, to split', 'sever'),
    gliss: gloss('French glisser, to slide', 'reshape'),
    fod: gloss('Latin fodio, to dig', 'dig'),
    deprim: gloss('Latin deprimo, to press down', 'blast', 'lower'),
    confring: gloss('Latin confringo, to shatter', 'blast'),
    expuls: gloss('Latin expulsus, driven out', 'blast', 'send'),
    episk: gloss('Greek episkeuazo, to repair', 'heal', 'mend'),
});
