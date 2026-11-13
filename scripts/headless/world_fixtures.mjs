// DEV/TEST ONLY. Named world fixtures (FRC74, FRC76): the states browser proofs and the game MCP keep needing, built once and
// cached instead of walked again by every lane. Nothing here is imported by src/ or shipped in the player UI.
//
// Each fixture is built from a brand-new game by the same controls a player presses and the engine's own stepper. Where a walk would
// take hours (HP exam week sits 321 game days into the lead life), the fixture composes the state on a begun life and saves it through
// the game's own save path; the summary says COMPOSED and names what was set. Either way the saved text is then booted again through
// the real load path, the built-in invariants run (no page error, no expansion error, no loading error, money finite, clock forward),
// and the fixture's own `proves` check reads the loaded state. A fixture that does not load and prove is never cached or handed out.
//
//   node scripts/headless/scenarios.mjs build lotm-tingen-day3 --out /tmp/f.json     (script route; scenarios.mjs lists them)
//   node scripts/fixture_browser.cjs lotm-tingen-day3                              (headless Chrome 1920x1080, fresh origin)
//   game MCP: game_new({scenario: "lotm-tingen-day3"})
//
// A fixture is setup, not proof: lanes still play the changed behaviour from it and still save, reload and import from a fresh
// origin. It never stands in for the floor's fresh-origin line when the feature is the start of a life (docs/RULES_INDEX.md, AD36).
import {boot} from './runner.mjs';

const PANEL = '#workspace_navigation select[aria-label="Other known panels"]';
const say = (...a) => process.env.YAIRPG_FIXTURE_QUIET ? undefined : process.stderr.write(`[fixture] ${a.join(' ')}\n`);
const must = (ok, msg) => {if(!ok) throw new Error(msg);};
const at = (obj, path) => path.split('.').reduce((v, k) => v?.[k], obj);

/** Begin a structured life through the Beginning panel, as a player does. */
async function beginLife(game, life) {
    await game.fill(PANEL, 'beginning');
    await game.fill(game.$('select[data-structured-choice="life"]'), life);
    await game.click('[data-structured-begin]');
    await game.settle(400);
}
/** Open every disclosure inside a panel (a player clicking each summary); re-run after a re-render. */
const openAll = (game, sel) => {for(const d of game.$$(`${sel} details`)) d.open = true;};
const panelText = (game, sel) => (game.$(sel)?.textContent || '').replace(/\s+/g, ' ');

const HP = 'book.hp.lead', KEEPER = 'book.ri.keeper';

export const WORLD_FIXTURES = Object.freeze({
    'lotm-tingen-day3': {
        world: 'lotm', route: 'played', view: {panel: 'lotm', sel: '#lotm_panel', text: /Klein|Tingen/}, needs: ['private_packs/lotm-cast'],
        summary: 'DEV FIXTURE, played: Be Klein Moretti started through the Tingen panel (the developer start), then stepped to day 3.',
        async build(game) {
            await game.fill(PANEL, 'lotm');
            await game.click('[data-lotm="pick_be"]');
            await game.click('[data-lotm="enroll_be"]'); // the page reloads into the independent life; the runner follows
            await game.step(1);
            const day = () => game.snapshot()['current time'].day_count;
            await game.step(Math.max(0, (3 - day()) * 1440));
        },
        proves(save) {
            must(save.expansion?.lotm, 'no Tingen life in the save');
            must(save['current time'].day_count >= 3, `day ${save['current time'].day_count}, wanted 3`);
        },
    },
    'hp-exam-week': {
        world: 'hp', route: 'composed', view: {panel: 'hp', sel: '#hp_panel', text: /Exam week/}, needs: ['private_packs/hp-cast (optional: the lead runs without it)'],
        summary: 'DEV FIXTURE, COMPOSED: Harry\'s lead life begun through the Beginning panel, then the Arrival, Sorting (Gryffindor) and first week marked done, in the Great Hall, clocks moved to 17 June 09:00 (exam day 321). Seven papers are open.',
        async build(game) {
            await beginLife(game, HP);
            // The walk to day 321 is hours of headless play (about 40 s per lead day), so this sets what the Arrival and the Sorting set
            // and moves the engine's own clocks, as scripts/headless/hp_exam_fixture.mjs did for the exams lane. No new save field.
            const {expansionState: s, current_game_time: t} = game.internals, a = s.actors.player, day = 321;
            a.facts['hp.lead.atSchool'] = true; a.facts['hp.lead.house'] = 'gryffindor';
            for(const id of ['arrive_school', 'sorting', 'w6.return']) a.completed[`${HP}.${id}`] = 1;
            s.simulation.people.player.location = `${HP}.school_hall`;
            s.clock = day * 1440 + 60; // 09:00 on lead day 321 (lead clock anchor 08:00)
            t.day_count = day + 1; t.hour = 9; t.minute = 0;
            const m = 3 + Math.floor(day / 30); t.year = 999 + Math.floor(m / 12); t.month = 1 + m % 12; t.day = 1 + day % 30;
            const save = structuredClone(await game.save());
            save['current location'] = `${HP}.school_hall`;
            return save; // a returned save is written through game.load (the real load path) before the snapshot is taken
        },
        async proves(save, game) {
            must(save.expansion?.actors?.player?.facts?.['hp.lead.atSchool'], 'not at school');
            await game.fill('#workspace_navigation select', 'hp').catch(() => {});
            await game.settle(200);
            must(/Exam week/.test(panelText(game, '#hp_panel')), 'the HP panel does not show Exam week');
            must(game.$('[data-hp-paper] button:not([disabled])'), 'no paper to sit');
        },
    },
    'gu-fed-second': {
        world: 'gu', route: 'played', view: {panel: 'beginning', sel: '#structured_pack_panel', text: /Liquor Worm|worm/i}, needs: [],
        summary: 'DEV FIXTURE, played: the Gu keeper life (book.ri.keeper) begun from Beginning; Moonlight Gu taken, two bundles of petals bought and three meals fed; three chores for stones; the Liquor Worm taken as the second Gu.',
        async build(game) {
            const act = async n => {await game.fill(PANEL, 'beginning'); await game.click(`[data-structured-action="${KEEPER}.${n}"]`); await game.settle(100);};
            await beginLife(game, KEEPER);
            for(const n of ['take_moon', 'buy_petals', 'buy_petals', 'feed_moon', 'feed_moon', 'feed_moon']) await act(n);
            for(let i = 0; i < 3; i++) {await act('chores'); await game.step(120);} // stones 1 -> 4, the worm's price
            await act('take_worm');
        },
        proves(save) {
            const people = save.expansion?.simulation?.people || {}, held = ['moon', 'worm'].filter(g => people[`${KEEPER}.${g}`]?.body?.controllerId === 'player');
            must(held.length === 2, `the keeper holds ${held.join(', ') || 'no Gu'}, wanted moon and worm`);
            const petals = save.expansion.simulation.owners?.[`${KEEPER}.moon`]?.[JSON.stringify({id: `${KEEPER}.petals`})];
            must(petals > 0, 'the Moonlight Gu has no petals in its keep');
        },
    },
    'mol-loop2': {
        world: 'mol', route: 'composed', view: {panel: 'notebook', tab: '[data-notebook-view="here"]', sel: '#message_log_div', text: /as they have\s+before/}, needs: [],
        summary: 'DEV FIXTURE, COMPOSED clock: Zorian begun from the Village by play (elder talk, Chart, Begin as Zorian), then the clock and scheduled due times moved to one minute before the month ends (as scripts/playtest/mol-restart-memory.mjs does), and the engine\'s own stepper fires the date restart. Run 2 with the first loop\'s foreknowledge.',
        async build(game) {
            const B = 'book.mol.', ex = () => game.snapshot().expansion;
            const card = id => `[data-action-legibility-key="action:${id}"] button.action-legibility__button`;
            await game.step(3);
            await game.click(game.$$('[data-native-choice="location"]').find(e => /Talk to someone/.test(e.textContent)));
            await game.settle(100);
            await game.click('[data-dialogue="villageElder"]');
            for(const k of ['hello', 'what happened', 'ask to leave 1', 'need to']) await game.click(`.talk-view [data-topic-id="${k}"]`);
            await game.click('#center_mode_back');
            await game.step(3);
            await game.fill('#workspace_navigation select', 'notebook');
            await game.click('[data-notebook-view="here"]');
            if(!game.$('#feature_expansion_panel').open) await game.click('#feature_expansion_panel > summary');
            for(const d of game.$$('#feature_expansion_panel > div > details'))
                if(/Mother of Learning/.test(d.querySelector('summary')?.textContent || '') && !d.open) await game.click(d.querySelector('summary'));
            await game.click(card(B + 'chart')); await game.settle(100);   // a timed job
            for(let i = 0; i < 250 && ex().simulation.jobs.some(j => j.commandId === B + 'chart'); i++) await game.ticks(100);
            await game.click(card(B + 'begin_zorian'));
            for(let i = 0; i < 20; i++) {
                await game.settle(300);
                const c = game.snapshot().continuation;
                if(c?.lives?.[c.active]?.initial?.expansion?.motherOfLearning?.entryProfile === 'book.mol.zorian@1') break;
            }
            // A month of play is about 90 minutes of headless stepping, so move the clocks to 1 minute before the month ends (17:00 on
            // day 30 of the run) through the save, reload it, and let the engine's own stepper fire the restart.
            const near = structuredClone(await game.save()), m = near.expansion.motherOfLearning;
            const delta = (m.runStartedAt ?? m.initializedAt) + 29 * 1440 + 17 * 60 - 1 - near.expansion.clock;
            for(const fam of ['checks', 'controllers']) for(const sc of Object.values(near.expansion.simulation[fam])) sc.due += delta;
            near.expansion.clock += delta;
            const t = near['current time'], tt = t.hour * 60 + t.minute + delta;
            let days = Math.floor(tt / 1440);
            t.day_count += days; t.hour = Math.floor(tt % 1440 / 60); t.minute = tt % 60;
            while(days-- > 0) if(++t.day > 30) {t.day = 1; if(++t.month > 12) {t.month = 1; t.year++;}}
            await game.load(near);
            for(let i = 0; i < 12 && ex().motherOfLearning.runs !== 2; i++) {await game.step(2); await game.settle(500);}
        },
        proves(save) {
            const m = save.expansion?.motherOfLearning;
            must(m?.runs === 2 && m.entryProfile === 'book.mol.zorian@1', `not Zorian's second run: ${JSON.stringify({runs: m?.runs, profile: m?.entryProfile})}`);
            must(save.continuation?.deaths?.at(-1)?.trigger === 'date', 'the restart was not the month\'s end');
        },
    },
    'frontier-hunt-ready': {
        world: 'frontier', route: 'played', view: {panel: 'notebook', tab: '#notebook_tab_people', sel: '#tempo_fight_panel', open: true, text: /Hunt the boar/}, needs: [],
        summary: 'DEV FIXTURE, played with a DEV SEEDED kit: craftsman story access (the village-craftsman patch) plus a Hunter\'s bow and 6 Hunter\'s arrows, then the elder and craftsman met, the frontier inspected and the field survey joined by clicks. Notebook > People > fight panel: "Hunt the boar at the meadow edge" is enabled.',
        async build(game) {
            await game.step(60);
            // DEV SEEDED: the bow's real route is Butchering 10 sinew plus a woodworking chain (hours); story access as village-craftsman.
            const save = structuredClone(typeof game.snapshot() === 'string' ? JSON.parse(game.snapshot()) : game.snapshot());
            save.availabilities.dialogue.oldCraftsman = 1;
            const inv = save.inventories.person.main_character;
            inv[JSON.stringify({id: 'Hunter\'s bow'})] = {count: 1};
            inv[JSON.stringify({id: 'Hunter\'s arrow'})] = {count: 6};
            await game.load(save); // through the real load path
            for(const who of ['villageElder', 'oldCraftsman']) {
                await game.clickText(who === 'villageElder' ? /village elder\s*Village neighbor$/ : /old craftsman\s*Village neighbor$/);
                await game.click(`[data-focus-action="talk:${who}"]`);
                await game.click('[data-textline="hello"]');
                await game.click('#center_mode_back');
            }
            await game.step(1); // the Notebook appears
            await game.fill(PANEL, 'notebook');
            await game.click('#notebook_tab_here');
            await game.click('#expedition_panel > summary');
            await game.click('[data-expedition-action="frontier.inspect"]');
            await game.step(3);
            await game.click('#field_panel > summary');
            await game.click('[data-field-command="field.begin"]');
            await game.click('[data-field-command="field.join_survey"]'); // enrolls the local simulation the hunt openers quote from
            await game.step(2);
        },
        async proves(save, game) {
            await game.fill(PANEL, 'notebook').catch(() => {});
            await game.click('#notebook_tab_people');
            if(!game.$('#tempo_fight_panel')?.open) await game.click('#tempo_fight_panel > summary');
            const b = game.$('#tempo_fight_panel [data-tempo="open:frontier.hunt.arrow"]');
            must(b && !b.disabled, 'the hunt opener is missing or disabled');
        },
    },
    'household-cat': {
        world: 'home', route: 'played', view: {panel: 'homes', sel: '#home_panel', open: 'Hearth and companion', text: /Moss/}, needs: [],
        summary: 'DEV FIXTURE, played: Village hero takes the homeowner start in Homes, meets Moss the cat and pets her twice; Moss is adopted (bond 30). Homes > Hearth and companion.',
        async build(game) {
            await game.fill(PANEL, 'homes'); await game.settle(200);
            openAll(game, '#home_panel');
            await game.click('[data-home-action="start:homeowner"]'); await game.settle(300);
            openAll(game, '#home_panel');
            await game.click('[data-home-action="meet:cottage"]'); await game.settle(300);
            for(let i = 0; i < 2; i++) { // each pet adds bond 10 and wants a 5-minute gap; adopted at 30
                await game.step(5); openAll(game, '#home_panel');
                await game.click('[data-home-action="household:cottage:pet"]'); await game.settle(100);
            }
        },
        proves(save) {
            const cat = at(save, 'homes.properties.cottage.household.animal');
            must(cat?.adopted && cat.id === 'household.moss', `Moss not adopted: ${JSON.stringify(cat)}`);
        },
    },
});

/** Build a fixture from a brand-new game. Returns the save text (not yet verified). */
export async function buildWorldFixture(name, {seed = 1} = {}) {
    const def = WORLD_FIXTURES[name];
    if(!def) throw new Error(`Unknown world fixture ${name}. Known: ${Object.keys(WORLD_FIXTURES).join(', ')}.`);
    const t0 = performance.now(), game = await boot(null, {seed});
    try {
        say(name, 'booted', ms(t0));
        const composed = await def.build(game);
        if(composed) await game.load(composed);
        const text = JSON.stringify(game.snapshot());
        say(name, 'built', ms(t0));
        return text;
    } finally {game.close();}
}

/** Boot the save text through the real load path, run the invariants and the fixture's proof. Throws on failure. */
export async function verifyWorldFixture(name, text, {seed = 1, roundTrip = false} = {}) {
    const def = WORLD_FIXTURES[name], t0 = performance.now();
    let game = await boot(text, {seed});
    try {
        game.check();
        const loaded = game.snapshot();
        await def.proves(typeof loaded === 'string' ? JSON.parse(loaded) : loaded, game);
        if(roundTrip) { // the Options-menu export and import (preflight, storage write, reload), then the proof again
            await game.importFile(await game.exportFile());
            game.check();
            const again = game.snapshot();
            await def.proves(typeof again === 'string' ? JSON.parse(again) : again, game);
        }
        say(name, 'verified', ms(t0));
        return {name, ms: Math.round(performance.now() - t0)};
    } finally {game.close();}
}
const ms = t0 => `${((performance.now() - t0) / 1000).toFixed(1)}s`;
