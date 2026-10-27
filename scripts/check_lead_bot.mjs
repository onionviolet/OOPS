#!/usr/bin/env node
// Lint scripted-lead bot route modules (PL-B1, PLAN.md section 5): a route may
// import only the headless runner, the bot driver and its own fixture, and may
// not reach into game state, the clock, the seed or the hero's location.
//   node scripts/check_lead_bot.mjs scripts/headless/lead_runs/lotm_v1.mjs
// Not a lint of lead-run tables (scripts/lead_run/lint_lead_run.mjs).
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const TELEPORTS = ['change_location', 'set_location', 'teleport', 'saveProgress', 'load_progress', 'save_to_file'];
const GAME_HANDLES = /\.\s*(game|internals|module|storage|window|document|dom|css|realm|stats|calls)\b|\bsimulationTestHooks\b|\bglobalThis\b|\bwindow\b|\bprocess\b/;
const CLOCK = /\badvanceWall\b|\bwallStart\b(?!\s*:)|\bcurrent_game_time\b|\bDate\s*\.\s*(?:now|UTC)\s*=|\bsetSystemTime\b|\bmock\s*\.\s*timers\b|\bMath\s*\.\s*random\s*=|\bcrypto\b|\badvanceTicks\b|\.\s*ticks\s*\(/;

/** Blank comments and string contents so patterns only match code; keeps offsets and newlines. */
export function mask(text) {
    let out = '', i = 0;
    const blank = s => s.replace(/[^\n]/g, ' ');
    while(i < text.length) {
        const c = text[i], n = text[i + 1];
        if(c === '/' && n === '/') {const e = text.indexOf('\n', i); const j = e < 0 ? text.length : e; out += blank(text.slice(i, j)); i = j;}
        else if(c === '/' && n === '*') {const e = text.indexOf('*/', i + 2); const j = e < 0 ? text.length : e + 2; out += blank(text.slice(i, j)); i = j;}
        else if(c === '"' || c === "'" || c === '`') {
            let j = i + 1;
            while(j < text.length && text[j] !== c) j += text[j] === '\\' ? 2 : 1;
            out += c + blank(text.slice(i + 1, j)) + c; i = j + 1;
        } else {out += c; i++;}
    }
    return out;
}

const lineOf = (text, index) => text.slice(0, index).split('\n').length;

function allowedSpecifier(spec, allowFixtures) {
    if(/^(?:\.\/|\.\.\/(?:headless\/)?)?(?:runner|lead_bot)\.mjs$/.test(spec)) return true;
    if(/^(?:\.\.\/)*(?:scripts\/)?headless\/(?:runner|lead_bot)\.mjs$/.test(spec)) return true;
    // Own fixture: a relative file named *fixture* or under a fixtures/ folder, never into src/.
    if(/^\.\.?\//.test(spec) && !/(^|\/)src\//.test(spec) && /(fixture|(^|\/)fixtures\/)/.test(spec)) return true;
    return allowFixtures.includes(spec);
}

/**
 * Lint one route module's source. Returns [{file, line, code, reason}].
 * Codes: import, write, clock, seed, teleport, dynamic.
 */
export function lintLeadBot(file, source, {allowFixtures = []} = {}) {
    const failures = [];
    const add = (index, code, reason) => failures.push({file, line:lineOf(source, index), code, reason});
    const code = mask(source);

    // Imports and requires: find the keyword in masked code, read the specifier from the source.
    const specAt = index => /^(["'`])(.*?)\1/.exec(source.slice(index))?.[2] ?? '';
    for(const m of code.matchAll(/\b(?:from|import|require\s*\(|import\s*\()\s*(?=["'`])/g)) {
        const spec = specAt(m.index + m[0].length);
        if(!allowedSpecifier(spec, allowFixtures)) add(m.index, 'import', `import of ${spec}: a route may import only the runner, the bot driver and its own fixture`);
    }
    for(const m of code.matchAll(/\b(?:import|require)\s*\(\s*(?!["'`])/g)) add(m.index, 'dynamic', 'import or require with a computed specifier');
    for(const m of code.matchAll(/\b(?:eval|Function)\s*\(|\bnew\s+Function\b/g)) add(m.index, 'dynamic', 'eval or Function builds code the lint cannot read');

    // Game handles: the route talks only to the bot.
    for(const m of code.matchAll(new RegExp(GAME_HANDLES.source, 'g'))) add(m.index, 'write', `direct handle on game state (${m[0].trim()}); use the bot's verbs`);

    // Writes: any assignment to a property or index, delete, or Object.assign/defineProperty/setPrototypeOf.
    for(const m of code.matchAll(/(?:\.\s*[\w$]+|\])\s*(?:\+\+|--|(?:[-+*\/%&|^]|\*\*|<<|>>>?|&&|\|\||\?\?)?=(?![=>]))/g)) add(m.index, 'write', `assignment to a property or index (${m[0].trim()}); a route builds no save or state`);
    for(const m of code.matchAll(/\bdelete\s+[\w$.[\]]+|\bObject\s*\.\s*(?:assign|defineProperty|defineProperties|setPrototypeOf)\b|\bReflect\s*\.\s*(?:set|defineProperty)\b/g)) add(m.index, 'write', `${m[0]}: mutation of an object a route does not own`);
    for(const m of code.matchAll(/\bsetItem\s*\(|\bremoveItem\s*\(|\blocalStorage\b|\bsessionStorage\b/g)) add(m.index, 'write', 'storage write');

    // Clock and seed: only boot's documented seed option, as `seed: <literal>` in a leadBot/boot call.
    for(const m of code.matchAll(new RegExp(CLOCK.source, 'g'))) add(m.index, 'clock', `clock or time control (${m[0].trim()}); game time passes only through bot.step`);
    for(const m of code.matchAll(/\bseed\b(?!\s*:)/g)) {
        if(/^\s*(?:,|\}|\))/.test(code.slice(m.index + 4)) && /[{,]\s*$/.test(code.slice(0, m.index))) continue; // shorthand {seed}
        add(m.index, 'seed', 'seed use outside the boot options object');
    }
    for(const m of code.matchAll(/\bseed\s*:/g)) {
        const before = code.slice(Math.max(0, m.index - 200), m.index);
        if(!/\b(?:leadBot|boot)\s*\([^()]*\{[^{}]*$/.test(before)) add(m.index, 'seed', 'seed set outside a leadBot/boot options object');
    }
    for(const m of code.matchAll(/\bMath\s*\.\s*random\b/g)) add(m.index, 'seed', 'Math.random: a route is deterministic');

    // Teleports and non-markup calls, read from the unmasked call argument.
    for(const m of code.matchAll(/\.\s*call\s*\(\s*(["'`])/g)) {
        const name = /^(["'`])([\w$]+)\1/.exec(source.slice(m.index + m[0].length - 1))?.[2];
        if(name && TELEPORTS.includes(name)) add(m.index, 'teleport', `call('${name}') moves the hero or writes state without play`);
    }
    for(const m of code.matchAll(/\.\s*call\s*\(\s*(?!["'`])/g)) add(m.index, 'dynamic', 'call with a computed entry-point name');
    for(const name of TELEPORTS) {
        const re = new RegExp(`\\b${name}\\b`, 'g');
        for(const m of source.matchAll(re)) if(code.slice(m.index, m.index + name.length) === name) add(m.index, 'teleport', `${name} referenced as code`);
    }
    return failures;
}

export function lintLeadBotFile(path, options) {return lintLeadBot(path, readFileSync(path, 'utf8'), options);}

if(import.meta.url === `file://${process.argv[1]}`) {
    const files = process.argv.slice(2);
    if(!files.length) {console.error('usage: node scripts/check_lead_bot.mjs <route.mjs> ...'); process.exit(2);}
    let bad = 0;
    for(const f of files) {
        const path = resolve(f), failures = lintLeadBotFile(path);
        for(const x of failures) console.error(`${f}:${x.line}: [${x.code}] ${x.reason}`);
        bad += failures.length;
    }
    console.log(bad ? `lead bot lint: ${bad} problem(s)` : `lead bot lint: ${files.length} file(s) clean`);
    process.exit(bad ? 1 : 0);
}
