// Run with node tests/combat_situation_page.browser.mjs. The same page assertion
// runs in the WebKit replay before and after a move, a reload and an import.
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {build, launchChrome, openGame, prepareTree, readFixture, serve} from '../scripts/perf/lib.mjs';
import {fieldContext, joinField} from '../scripts/field_fixtures.mjs';
import {expeditionRegistry} from '../src/expedition_content.js';
import {beginTempoFight} from '../src/tempo_fight.js';
import {wolfKit} from '../src/tempo_lead_fights.js';
import {RI_DAY_ITEMS} from '../src/ri_lead_day_facts.js';

export function assertTempoHeroHpOnce() {
    const fight = document.querySelector('#fight_situation[data-fight-mode="tempo"]');
    const hero = document.getElementById('character_health_value');
    if (!fight?.checkVisibility() || !hero?.checkVisibility()) throw Error('Expected an open tempo fight and visible Hero HP.');
    const readout = hero.innerText.trim().replace(/\s+/g, ' ');
    const [current, max] = readout.match(/\d+(?:\.\d+)?/g) || [];
    if (!max || !/hp/i.test(readout)) throw Error(`Missing Hero HP in "${readout}".`);
    const applied = new RegExp(`\\b${current}\\s*\\/\\s*${max}\\s*(?:\\([^)]*\\)\\s*)?hp\\b`, 'gi');
    const count = [...document.body.innerText.matchAll(applied)].length;
    if (count !== 1 || fight.querySelector('[data-combat-subject="player"]')) {
        throw Error(`Expected Hero alone to draw ${readout}. Found ${count} visible HP readouts.`);
    }
}

const profile = {stats: {attack_points: 45, agility: 5, intuition: 5, defense: 1, attack_count: 1, crit_rate: 0, crit_multiplier: 1.5, stamina_efficiency: 1},
    attackPower: 8, shield: 0, shieldSkill: 0, emptyStaminaMultiplier: .5};
function fightSave(field, spec) {
    const plan = beginTempoFight(field.state, expeditionRegistry, fieldContext(field), spec);
    const save = JSON.parse(readFixture('fresh'));
    save.expansion = plan.state;
    const player = plan.state.simulation.sessions.player.nativeBattle.fighters.player;
    save.character.hp_to_full = player.maxHp - player.hp;
    return JSON.stringify(save);
}

// The default retains the legacy seven-rat fixture for existing replay scripts.
// Eight mixed opponents exercise the grow-before-scroll fallback.
export function packFightSave({count = 7, mixed = false} = {}) {
    const base = {speed: 100, hp: 30, stamina: 30, profile, perception: 6, stealth: 6};
    const fighters = [{...base, id: 'player', side: 'a', name: 'You', hp: 60, maxHp: 60},
        ...Array.from({length: count}, (_, i) => ({...base, id: `rat${i + 1}`, side: 'b', name: mixed ? ['Wolf rat', 'Cave bat', 'Cave lizard', 'Pale vole', 'Boar', 'Fox', 'Wild dog', 'Lynx'][i] : 'Wolf rat', tags: ['beast'],
            speed: 55, profile: {...profile, attackPower: 1}, moves: ['jab', 'guard'], hp: i === 6 ? 2 : 30, maxHp: 30}))];
    return fightSave(joinField(), {id: 'pack-layout', title: 'Cave depths',
        conditions: {place: 'Cave depths', light: 'dark', footing: 'firm'}, stakes: {preset: 'hunt', lethal: true}, terms: {beast: 'finish'}, fighters});
}

export function guardedFightSave() {
    const field = joinField();
    const kit = wolfKit(field.state, {gameplay: {player: {inventory: {[JSON.stringify({id: RI_DAY_ITEMS.whiteJade})]: 1}}}});
    const common = {speed: 40, hp: 60, maxHp: 60, stamina: 30, perception: 20, stealth: 0, profile};
    return fightSave(field, {id: 'guard-and-ward', title: 'Practice bout', conditions: {place: 'Training yard'},
        fighters: [
            {...common, id: 'player', name: 'You', side: 'a', speed: 200},
            {...common, id: 'rival', name: 'Injured rival', side: 'b', parts: {hands: 'maimed'}, moves: ['jab', 'guard']},
            {...common, id: 'adept', name: 'Jade adept', side: 'b', hp: 24, kit, means: {essence: 9}, moves: ['jab', 'jade_skin']},
        ]});
}

export function assertRaisedDefences() {
    for (const [id, word, cause] of [
        ['rival', 'Guarding', 'Injured rival braces.'],
        ['adept', 'Warded', 'Jade adept raises white jade skin.'],
    ]) {
        const row = document.querySelector(`[data-combat-subject="${id}"]`);
        const label = row?.querySelector('.fight-page-protection');
        if (label?.textContent !== 'Standing · ' + word || label.title !== cause) throw Error('Missing defence or cause for ' + id);
        const stats = row.querySelector('.fight-page-observations').getBoundingClientRect();
        if (label.scrollWidth > label.clientWidth + 1 || label.getBoundingClientRect().right > stats.left + 1) throw Error('Clipped or overlapping ' + word);
        if (id === 'rival') {
            const condition = row.querySelector('.fight-page-conditions');
            if (condition.innerText !== 'Hands: maimed' || condition.scrollWidth > condition.clientWidth + 1 || condition.getBoundingClientRect().right > stats.left + 1) {
                throw Error('The rival’s observed hand injury does not fit beside the stat slots.');
            }
            for (const [key, short, full] of [['Atk', 'Atk ~', 'looks about your match'], ['Spd', 'Spd', 'slower than you']]) {
                const slot = row.querySelector(`[data-observation="${key}"]`);
                if (!slot.title.includes(full) || slot.getAttribute('aria-label') !== slot.title || slot.scrollWidth > slot.clientWidth + 1 ||
                    (innerWidth === 1280 ? slot.innerText.trim() !== short : !slot.innerText.includes(full))) throw Error('Unreadable ' + key);
            }
        }
    }
}

// The pack and practice fixtures have only qualitative opponent HP.
export function assertCombatPolish() {
    const roster = document.querySelector('.fight-page-roster');
    for (const bar of roster.querySelectorAll('[data-track="health"]')) {
        if (bar.innerText.trim() || !/health · (all fresh|fresh|hurt|barely standing)/i.test(bar.title) ||
            bar.title !== bar.getAttribute('aria-label') || !bar.style.getPropertyValue('--fight-fill')) throw Error('Incorrect qualitative HP bar.');
    }
    if (roster.querySelector('[data-fold]')) {
        const strike = document.querySelector('[data-fight-option="jab"]');
        const target = roster.querySelector('[data-target="true"] [data-track="health"]');
        strike.blur();
        strike.dispatchEvent(new PointerEvent('pointerleave'));
        const resting = target.title;
        if (target.hasAttribute('data-harm-preview') || resting.includes('Likely') || resting !== target.getAttribute('aria-label')) throw Error('Preview did not clear.');
        strike.focus({preventScroll: true});
        if (!target.hasAttribute('data-harm-preview') || !target.title.startsWith(resting + ' · Likely ') || target.title !== target.getAttribute('aria-label') ||
            target.innerText.trim() || !getComputedStyle(target, '::before').backgroundImage.includes('repeating-linear-gradient')) throw Error('Missing graphic or accessible harm forecast.');
    }
    const terms = document.querySelector('[data-move-source="terms"] .fight-page-strip');
    const buttons = [...terms.querySelectorAll('button')];
    const first = buttons[0].getBoundingClientRect();
    if (terms.scrollWidth > terms.clientWidth + 1) throw Error('Terms overflow horizontally.');
    for (const button of buttons) {
        const bounds = button.getBoundingClientRect(), cell = button.parentElement;
        if (Math.abs(bounds.height - first.height) > 1 || (innerWidth === 1920 && Math.abs(bounds.top - first.top) > 1) ||
            Math.abs(cell.getBoundingClientRect().height - bounds.height) > 1) throw Error('Uneven Terms cells.');
        if (['withdraw', 'yield', 'plead', 'escalate'].includes(button.dataset.fightOption)) {
            const cost = button.querySelector('.scene-card-quote');
            const label = document.createRange();
            label.selectNodeContents(button.firstChild);
            if (!cost || !/\d+ beats?/.test(cost.innerText) || label.getClientRects().length !== 1 ||
                cost.getBoundingClientRect().left < label.getBoundingClientRect().right || bounds.right - cost.getBoundingClientRect().right > 12) throw Error('Misplaced Terms beat cost.');
        }
        if (button.disabled) {
            const reason = document.getElementById(button.getAttribute('aria-describedby'));
            if (!button.title || reason?.textContent !== button.title || !cell.title.includes(button.title) || reason.tabIndex !== 0) throw Error('Missing refusal reason.');
            const previous = document.activeElement;
            reason.focus({preventScroll: true});
            if (document.activeElement !== reason || getComputedStyle(reason).opacity !== '1') throw Error('Keyboard focus did not reveal the refusal.');
            previous.focus({preventScroll: true});
        }
    }
    const hero = document.querySelector('[data-region="player"]');
    for (const n of [hero, ...hero.querySelectorAll('*')]) {
        if (!n.clientHeight || !n.checkVisibility()) continue;
        const overflow = getComputedStyle(n).overflowY;
        if (overflow === 'scroll' || (overflow === 'auto' && n.scrollHeight > n.clientHeight + 1)) throw Error('Hero needs a scrollbar in ' + (n.id || n.className));
    }
    if (hero.querySelector('#shell_condition').getBoundingClientRect().bottom > hero.getBoundingClientRect().bottom) throw Error('Hero condition is below the card.');
}

// Also runs in the offscreen WebKit replay. Every sample follows a painted frame.
export async function measurePackStrikes() {
    const roster = document.querySelector('.fight-page-roster');
    const button = () => document.querySelector('[data-fight-option="jab"]');
    const painted = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const measure = () => ({
        stripY: document.querySelector('.fight-page-moves').getBoundingClientRect().top,
        strikeY: button().getBoundingClientRect().top,
        rosterHeight: roster.getBoundingClientRect().height,
        horizontalOverflow: roster.scrollWidth - roster.clientWidth,
        visibleEntries: roster.childElementCount,
        actions: window.simulationTestHooks.snapshot().expansion.simulation.sessions.player.nativeBattle.actions,
    });
    const samples = [measure()], opening = samples[0];
    let sawDamageTrail = false;
    const row = roster.querySelector('.fight-page-fighter').getBoundingClientRect().height;
    const reserved = Math.round(roster.clientHeight / row);
    if (reserved < 6 || reserved > 8 || (innerWidth === 1920 && reserved !== 8) || opening.visibleEntries !== 2 || opening.horizontalOverflow > 1) {
        throw Error('Expected two visible entries with whole opponent rows reserved: ' + JSON.stringify({reserved, opening}));
    }
    for (let i = 1; i <= 5; i++) {
        const group = roster.querySelector('[data-fight-fold]');
        if (i > 1 && group) {
            const prior = group.closest('[data-fold]');
            const oldTarget = roster.querySelector('[data-target="true"]');
            const scroll = roster.scrollTop;
            const target = group.dataset.fightInspect;
            const other = [...prior.querySelectorAll('[data-combat-member]')].find(tick => tick.dataset.combatMember !== target);
            group.focus({preventScroll: true});
            group.click();
            const selected = roster.querySelector('[data-target="true"]');
            if (selected?.dataset.combatSubject !== target || !selected.contains(document.activeElement)) throw Error('Target or focus lost on split.');
            const rest = roster.querySelector(`[data-combat-member="${other.dataset.combatMember}"]`);
            if (rest && rest.closest('[data-fold]') !== prior) throw Error('Replaced the remaining group row.');
            if (!roster.contains(oldTarget) || roster.scrollTop !== scroll) throw Error('Lost a fighter row or its scroll position.');
            if (measure().stripY !== opening.stripY) throw Error('Selecting a new pack member moved the strip.');
        }
        button().click();
        await painted();
        const trail = roster.querySelector('[data-track="health"][data-recent-hit]');
        if (trail && getComputedStyle(trail, '::after').content !== 'none') sawDamageTrail = true;
        const now = measure();
        if (now.actions <= samples.at(-1).actions) throw Error('Strike did not advance the fight.');
        if (now.stripY !== opening.stripY || now.strikeY !== opening.strikeY || now.rosterHeight !== opening.rosterHeight || now.horizontalOverflow > 1) {
            throw Error('Roster or move controls shifted: ' + JSON.stringify([...samples, now]));
        }
        if (i === 1 && !roster.querySelector('.fight-page-dead-fold')) throw Error('Missing fallen pack member.');
        samples.push(now);
    }
    if (samples.at(-1).visibleEntries <= opening.visibleEntries) throw Error('No pack members split.');
    if (!sawDamageTrail) throw Error('No recent damage segment appeared during the five strikes.');
    return {width: innerWidth, height: innerHeight, reserved, sawDamageTrail, samples};
}

async function run() {
    const dir = await mkdtemp(join(tmpdir(), 'tempo-page-test-'));
    const oldViewport = process.env.YAIRPG_PERF_VIEWPORT;
    let server, browser;
    try {
        await build(prepareTree('WORKTREE', dir));
        server = await serve(dir);
        browser = await launchChrome();
        for (const [width, height] of [[1920, 1080], [1280, 800]]) {
            process.env.YAIRPG_PERF_VIEWPORT = `${width}x${height}`;
            const {context, page} = await openGame(browser, server.url + '?test_hooks=1', packFightSave({count: 8}));
            const roster = page.locator('.fight-page-roster');
            const strike = page.locator('[data-fight-option="jab"]');
            await roster.waitFor();
            await page.waitForFunction(() => !!document.querySelector('.fight-page-roster').style.height);
            await page.evaluate(assertTempoHeroHpOnce);
            await strike.hover();
            await roster.locator('[data-target="true"] [data-harm-preview]').waitFor();
            await page.evaluate(assertCombatPolish);
            console.log(JSON.stringify(await page.evaluate(measurePackStrikes)));
            await page.locator('#fight_situation [data-fight-approach] > summary').click();
            await page.evaluate(assertTempoHeroHpOnce);
            await context.close();
            console.log(`${width}px: Hero HP appears once, and preview and pack splits keep move positions.`);
            const practice = await openGame(browser, server.url, guardedFightSave());
            await practice.page.locator('[data-fight-option="guard"]').click();
            await practice.page.evaluate(assertRaisedDefences);
            await practice.page.evaluate(assertCombatPolish);
            await practice.page.locator('[data-fight-option="jab"]').click();
            if ((await practice.page.locator('[data-combat-subject="adept"]').innerText()).includes('Warded')) throw Error('Broken ward remains on row.');
            await practice.context.close();
        }
    } finally {
        if (oldViewport === undefined) delete process.env.YAIRPG_PERF_VIEWPORT;
        else process.env.YAIRPG_PERF_VIEWPORT = oldViewport;
        await browser?.close();
        await server?.close();
        await rm(dir, {recursive: true, force: true});
    }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await run();
