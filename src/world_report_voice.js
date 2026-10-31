// Per-world report voice (DESIGN.md DSG13, PLAN M4). A Reports line keeps its own text as the
// receipt; a row here adds the world's flavour and the useful part (what it means, what next).
// Three grains, most specific first: a place row (one locality), the world's general row (any
// other arrival or newly opened place there, drawn by place, time of day and day), then nothing,
// which keeps today's generic line. Titles get the world's own line everywhere; frontier unlocks
// say where the new thing is used. Rules: RPT1-RPT14. Flavour states only what the player could see or was told on arrival; it
// carries no sealed truth, no canon label and nothing of the future (RPT2, RPT7). Useful text
// names controls the player can find, in the game's own words. Wording is fixed per place and
// moment, so a reload reads the same (RPT12). Pure and save-neutral: Reports lines are not saved, and the
// voice is chosen once when the line is written.

const freeze = Object.freeze;
const row = (flavour, useful) => freeze({flavour, useful});

// FNV-1a over a key (place, band, day): the same moment always draws the same line (RPT12).
function pick(lines, key) {
    let h = 2166136261;
    for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619);
    return lines[(h >>> 0) % lines.length];
}

// Each world: which player world ids it covers, its places, and its general row.
// `match` reads the world id, so generic families (feature, reference, nested) never voice a
// world they were not written for.
const WORLDS = freeze([
    freeze({
        key: 'frontier', match: id => id === 'base.frontier',
        title: 'A name earned out here on the frontier.',
        places: freeze({
            'Village': row('Rooftops at the foot of the mountains, rocks closing off the north.', 'Talk to someone, Find work and Move somewhere else are in the Actions list here.'),
            'Shack': row('The only spare building in the village, and a roof of your own.', 'Sleep here to recover; it is the short walk back from the Village.'),
            'Eastern mill': row('Flour dust in the corners of a tidy mill run by a young pair.', 'Ask the millers through Talk to someone; work offered here shows under Find work.'),
            'Forest road': row('Trees close in around the road out of the village.', 'Wolves hunt this road: a fight starts on arrival and shows under Combat; moving away ends it.'),
            'Nearby cave': row('Glowing mushrooms light a cave full of rats.', 'A fight starts on arrival and shows under Combat; moving away ends it.'),
            'Riverbank': row('Crabs as far along the shoreline as you can see.', 'A fight starts on arrival and shows under Combat; moving away ends it.'),
        }),
        general: freeze({
            day: freeze(['Mountain air and the village road behind you.', 'Wind off the northern rocks.', 'Village rooftops below the mountains.', 'Dust on the path and birds in the hedges.']),
            night: freeze(['Stars over the mountains and a lamp or two in the village.', 'Cold air off the rocks and owls in the trees.']),
            useful: 'Move somewhere else in Actions lists every route from here, the way back included.',
        }),
    }),
    freeze({
        key: 'lotm', match: id => id.startsWith('book.lotm.tingen'),
        title: 'Something to keep to yourself in Tingen.',
        // Districts as the Nighthawks' captain states them on arrival.
        places: freeze({
            'Tingen supervised workroom': row('Gaslight, ink and the duty book open on the desk.', 'Orders and paid errands are in the Tingen workroom panel; walks start under Places and walks.'),
            'Tingen probationer lodging': row('A narrow room two minutes from the office, quiet after the fog.', 'Your lodging is the short walk back from the workroom; Places and walks shows the way.'),
            'Tingen docks': row('Salt, tar and the Storm church\'s bells over the water.', 'The docks are the Mandated Punishers\' district; what you can do here is in the Tingen workroom panel.'),
            'Tingen university area': row('Lecture-hall steps and the hiss of the Machinery team\'s engines.', 'The university area is the Machinery team\'s district; what you can do here is in the Tingen workroom panel.'),
        }),
        general: freeze({
            day: freeze(['Cab wheels on wet cobbles.', 'Coal smoke and river damp.', 'Newsboys calling the morning papers.']),
            night: freeze(['Fog on the gas lamps.', 'A late cab and footsteps somewhere behind you.']),
            useful: 'Places and walks shows where you can go from here.',
        }),
    }),
    freeze({
        key: 'mol', match: id => id === 'book.mol.cyoria',
        title: 'An earned name in a city that keeps careful records.',
        places: freeze({
            'Cyoria visitor arrival': row('A city of mages, and your guest papers checked at the arrival hall.', 'Your Cyoria guest life in Notebook holds the walks, the work and the way home.'),
            'Cyoria academy guest desk': row('Students hurry past the guest desk with satchels of notes.', 'Guest permissions and academy work are listed in your Cyoria guest life in Notebook.'),
            'Cyoria academy guest library': row('Quiet stacks, and a librarian who notices loud visitors.', 'Reading here is in your Cyoria guest life in Notebook.'),
            'Cyoria formula workshop': row('Chalk lines and the smell of lamp oil on the benches.', 'Formula work and lamp charge are in your Cyoria guest life in Notebook.'),
        }),
        general: freeze({
            day: freeze(['Academy bells over the rooftops.', 'Students and traders crowding a busy street.']),
            night: freeze(['Spell lamps along a quiet street.', 'Lit windows in the academy towers.']),
            useful: 'Walk on or go home from your Cyoria guest life in Notebook.',
        }),
    }),
    freeze({
        key: 'paradise', match: id => id === 'book.paradise.hub' || id === 'book.paradise.goa',
        title: 'A name that goes with you from contract to contract.',
        places: freeze({
            'Paradise independent-contractor desk': row('A service counter, a queue and a clerk who has seen every kind of visitor.', 'Contracts and the way out are in your independent Goa branch in Notebook.'),
            'Paradise paid training booth': row('A booth with a price board and a worn practice floor.', 'Paid training is listed in your independent Goa branch in Notebook.'),
            'Goa Gray Terminal': row('Smoke and scrap heaps outside the city wall.', 'Walks, work and the way back are in your independent Goa branch in Notebook.'),
            'Goa provision pier': row('Gulls, crates and a porter counting barrels.', 'Provisions and pier work are listed in your independent Goa branch in Notebook.'),
        }),
        general: freeze({
            day: freeze(['Sea wind over a walled kingdom.', 'Bells from the city above the docks.']),
            night: freeze(['Torches on the city wall and surf below.']),
            useful: 'Walk on or return from your independent Goa branch in Notebook.',
        }),
    }),
    freeze({
        key: 'nested', match: id => ['nested.paradise_hub', 'nested.saltworks', 'nested.archive'].includes(id),
        title: 'A name for the district\'s ledgers.',
        places: freeze({
            'Paradise service street': row('A service desk beside an assignment counter, and staff changing shifts.', 'Roles, terms and the walk to the workroom go through the service-district passage in Notebook.'),
            'Paradise workroom': row('Counted tools beside a pressure bench.', 'Body care and refits here use actual stock; the service-district passage in Notebook walks you back.'),
            'Saltworks landing': row('A drinking-water schedule posted beside the landing.', 'Supplies here are finite and remembered between visits; the service-district passage in Notebook walks on.'),
            'Saltworks enginehouse': row('One engine shared by the export line and the drinking water.', 'Braces and pressure change the pump; the service-district passage in Notebook walks back.'),
            'Archive reception': row('A register and a claim waiting at the reception counter.', 'The archive keeps what you decide; the service-district passage in Notebook walks to the records room.'),
            'Archive records room': row('A small press and one surviving witness sheet.', 'Inspect, preserve or correct it with real evidence; the archive keeps the result.'),
        }),
        general: freeze({
            day: freeze(['Footsteps and counters in a working district.']),
            night: freeze(['A district between shifts, its counters lit low.']),
            useful: 'Use the service-district passage in Notebook to walk or return.',
        }),
    }),
    freeze({
        key: 'proto23', match: id => id === 'reference.proto23.village',
        title: 'A name earned as a visitor.',
        places: freeze({
            'Proto23 Village Center': row('A visitor\'s first look at another village\'s square.', 'Your Proto23 visitor controls in Notebook move you and bring you home.'),
            'Proto23 Dojo lobby': row('Mats, a rack of practice gear and someone already training.', 'Practice here is in your Proto23 visitor controls in Notebook.'),
            'Proto23 visitor cottage': row('A plain bed and a cold hearth waiting for use.', 'Furnish and rest here through your Proto23 visitor controls in Notebook.'),
        }),
        general: freeze({
            day: freeze(['Another village\'s paths, not quite your own.']),
            night: freeze(['Another village asleep, its paths unfamiliar in the dark.']),
            useful: 'Use your Proto23 visitor controls in Notebook to move or return.',
        }),
    }),
    freeze({
        key: 'tidemark', match: id => id === 'feature.tidemark',
        title: 'A name earned by the tide.',
        places: freeze({
            'Tidemark landing': row('A return marker above the tide, and linked floats in the water.', 'Negotiate, work, buy or return through the harbor passage in Notebook.'),
            'Tidemark terraces': row('Counterweight terraces and washed-up timber below the harbor wall.', 'The tide only changes with time spent here; the harbor passage in Notebook walks back to the landing.'),
        }),
        general: freeze({
            day: freeze(['Salt spray over the harbor wall.']),
            night: freeze(['The tide loud against the harbor wall in the dark.']),
            useful: 'Use the harbor passage in Notebook to walk or return.',
        }),
    }),
    freeze({
        key: 'glasshouse', match: id => id === 'pocket.folded_glasshouse',
        title: 'A name earned behind the folded panes.',
        places: freeze({
            'Folded Glasshouse': row('Warm panes fold around a small garden and a workbench.', 'Speak with the caretaker, work or return through the folded doorway in Notebook.'),
        }),
        general: null,
    }),
    freeze({
        key: 'hp', match: id => id.startsWith('book.hp.'),
        title: 'Something earned in your first term.',
        places: freeze({
            'Hogwarts study room': row('Practice desks and a lesson notice posted by the door.', 'Your school term\'s jobs and supplies are in the Your beginning panel.'),
        }),
        general: null,
    }),
]);

// Frontier unlocks (upstream activity and action lines): where the new thing is used.
const FRONTIER_UNLOCKS = freeze([
    [/Unlocked (?:activity|action) "(.+)" in location "(.+)"$/, (thing, place) => `${thing} is in Local actions while you are at ${place}.`],
    [/Unlocked action "(.+)" with "(.+)"$/, (thing, who) => `Find ${who} through Talk to someone to use ${thing}.`],
    [/Gained the ability of "(.+)"$/, thing => `${thing} shows in Local actions wherever it can be done.`],
]);
const FRONTIER_UNLOCK_FLAVOUR = freeze(['Something new to try in the village\'s round.', 'One more thing you know how to do out here.']);

// The place a line is about, for the kinds that are about a place.
const placeFor = {
    message_travel: text => /^\[ Entering (.+) \]$/.exec(text)?.[1],
    location_unlocked: text => /^Unlocked location "(.+)"$/.exec(text)?.[1],
};

function worldFor(worldId, family) {
    if (typeof worldId === 'string' && worldId) return WORLDS.find(w => w.match(worldId)) || null;
    return WORLDS.find(w => w.key === family) || null; // callers without a world id (tests, census)
}

// Families with any voice row, for the kit census and tests.
export const VOICED_FAMILIES = freeze(WORLDS.map(w => w.key));
// Every voiced place, by world, for the name guard in tests.
export const VOICED_PLACES = freeze(Object.fromEntries(WORLDS.map(w => [w.key, freeze(Object.keys(w.places))])));
// Every line a world can draw, for the wording lint in tests.
export const VOICE_TEXTS = freeze(Object.fromEntries(WORLDS.map(w => [w.key, freeze([w.title,
    ...Object.values(w.places).flatMap(r => [r.flavour, r.useful]),
    ...(w.general ? [...w.general.day, ...w.general.night, w.general.useful] : []),
    ...(w.key === 'frontier' ? FRONTIER_UNLOCK_FLAVOUR : [])])])));

// {flavour, useful} for a line about to be written, or null for the generic line.
// `band` ('day' or 'night') and `day` (a calendar key) vary the general line (RPT12); both optional.
export function reportVoice({family, worldId, kind, text, band = 'day', day = ''}) {
    if (typeof text !== 'string') return null;
    const world = worldFor(worldId, family);
    if (!world) return null;
    if (kind === 'level_up' && /^Titles? (earned|recognized from your past)/.test(text))
        return row(world.title, 'Titles you hold, and what each one gives, are in Names and achievements.');
    if (kind === 'activity_unlocked') {
        if (world.key !== 'frontier') return null; // other worlds list unlocks in their own panels
        for (const [pattern, useful] of FRONTIER_UNLOCKS) {
            const m = pattern.exec(text);
            if (m) return row(pick(FRONTIER_UNLOCK_FLAVOUR, m[1]), useful(...m.slice(1)));
        }
        return null;
    }
    const place = placeFor[kind]?.(text);
    if (!place) return null;
    // An arrival at a known place gets its own row; a newly opened place only learns the route.
    const local = kind === 'message_travel' ? world.places[place] : null;
    if (local) return local;
    if (!world.general) return null;
    const pool = band === 'night' ? world.general.night : world.general.day;
    return row(pick(pool, `${place}|${band}|${day}`), world.general.useful);
}
