// Scripted-lead bot driver over the headless runner (PL-B1, PLAN.md section 5).
// The bot owns no game state. It presses the same controls a player does and
// writes every action to an audit log: {verb, target, cost, worldMinute}.
//   import {leadBot} from './lead_bot.mjs';
//   const bot = await leadBot(null, {seed: 7});
//   await bot.click('.choice_dialogue'); await bot.step(15); bot.log;
// Route modules are linted by scripts/check_lead_bot.mjs: they may import only
// the runner and this driver. The driver is the one place that touches the game.
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {boot, ROOT} from './runner.mjs';

/** Window functions index.html itself names in inline handlers: the only `call` targets. */
export function markupEntryPoints(html = readFileSync(join(ROOT, 'index.html'), 'utf8')) {
    const names = new Set();
    for(const m of html.matchAll(/\bon(?:click|change|input|submit|keydown)\s*=\s*["']\s*([A-Za-z_$][\w$]*)\s*\(/g)) names.add(m[1]);
    return names;
}

/** Entry points that move the hero or write state without play; never callable. */
export const TELEPORT_CALLS = new Set(['change_location', 'set_location', 'teleport', 'saveProgress', 'load_progress', 'save_to_file']);

export class LeadBot {
    constructor(game, {entryPoints = markupEntryPoints()} = {}) {
        this.game = game; this.log = []; this.saves = new Map(); this.entryPoints = entryPoints;
    }
    /** Game clock in minutes (day * 1440 + hour * 60 + minute). */
    minute() {return this.game.minutes();}
    money() {return this.game.internals.character?.money ?? null;}
    async _do(verb, target, run, extra = {}) {
        const m0 = this.minute(), g0 = this.money();
        const entry = {verb, target, cost:null, worldMinute:m0, ...extra};
        this.log.push(entry);
        try {return await run();}
        catch(error) {entry.error = String(error.message ?? error).split('\n')[0]; throw error;}
        finally {entry.cost = {minutes:this.minute() - m0, money:(this.money() ?? 0) - (g0 ?? 0)};}
    }
    click(selector) {return this._do('click', selector, () => this.game.click(selector));}
    clickText(text, scope) {return this._do('clickText', String(text), () => this.game.clickText(text, scope));}
    fill(selector, value) {return this._do('fill', selector, () => this.game.fill(selector, value), {value});}
    key(key, init) {return this._do('key', key, () => this.game.key(key, init));}
    step(minutes, options) {return this._do('step', `${minutes}m`, () => this.game.step(minutes, options), {minutes});}
    /** Manual save through the game's own path; kept under `name` for a later `load`. */
    save(name) {return this._do('save', name, async () => {const data = await this.game.save(); this.saves.set(name, data); return data;});}
    /** Reboot from a save this bot took earlier (a harness restore, e.g. a chance-loss retry), never a built object. */
    load(name) {
        return this._do('load', name, async () => {
            if(!this.saves.has(name)) throw new Error(`No bot save named ${name}`);
            this.game.storage.clear(); return this.game.load(structuredClone(this.saves.get(name)));
        });
    }
    /** A window entry point the markup exposes; anything else, and any teleport, is refused. */
    call(name, ...args) {
        if(TELEPORT_CALLS.has(name) || !this.entryPoints.has(name)) return Promise.reject(new Error(`Entry point ${name} is not a markup control`));
        return this._do('call', name, () => this.game.call(name, ...args), {args});
    }
    /** Read-only menu for choosing the next action. */
    menu() {return this.game.clickables().map(({key, text}) => ({key, text}));}
    close() {this.game.close();}
}

/** Boot the real game and wrap it. Seed and wallStart are boot's documented options. */
export async function leadBot(save = null, options = {}) {
    const {entryPoints, ...bootOptions} = options;
    return new LeadBot(await boot(save, {heroName:null, ...bootOptions}), {entryPoints});
}
