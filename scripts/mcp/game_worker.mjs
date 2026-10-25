// Owns one headless game (scripts/headless/runner.mjs) for the game MCP server.
// It runs in its own process because the headless realm replaces Node's timers,
// Date and console; the MCP server keeps a clean realm and talks over IPC.
// Replies carry what a player could see, plus hashes. Raw saves never leave:
// export writes a file under the private temp folder and returns only its path.
import {boot, canonicalSave} from '../headless/runner.mjs';
import {createHash, randomUUID} from 'node:crypto';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';

export const EXPORT_DIR = join(tmpdir(), 'yairpg-mcp');
const send = process.send.bind(process);
let game = null, last = [];

const need = () => {if(!game) throw new Error('No game yet. Call game_new first.'); return game;};
const text = id => game.document.getElementById(id)?.textContent.trim() ?? '';
const clock = () => {const t = game.snapshot()['current time']; return {day: t.day_count, hour: t.hour, minute: t.minute};};
const sha = s => createHash('sha256').update(s).digest('hex').slice(0, 16);

// The DOM shim's innerText includes hidden descendants. Walk visible text instead.
function visibleText(root) {
    const parts = [];
    const visit = node => {
        if(node.nodeType === 3) {parts.push(node.textContent); return;}
        if(node.nodeType !== 1 || /^(SCRIPT|STYLE|TEMPLATE)$/.test(node.tagName) || game.css.hiddenReason(node)) return;
        for(const child of node.childNodes) visit(child);
        parts.push('\n');
    };
    game.css.reset();
    visit(root);
    return parts.join(' ').replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

// Native travel/resource dropdowns use addEventListener on a div, without role,
// tabindex or inline onclick. Include that known player-control seam explicitly.
function controls(g) {
    const rows = g.clickables();
    for(const el of g.document.querySelectorAll('.location_choice_dropdown')) {
        if(!rows.some(c => c.el === el) && !el.disabled && !el.closest('[aria-disabled="true"]') && !g.css.hiddenReason(el)) {
            rows.push({el, key: '.location_choice_dropdown', text: el.textContent.trim().slice(0, 60)});
        }
    }
    return rows;
}

function look({scope, offset = 0} = {}) {
    const g = need();
    const root = scope ? g.document.querySelector(scope) : g.document.body;
    if(!root) throw new Error(`No view for ${scope}`);
    last = controls(g).filter(c => root === c.el || root.contains(c.el));
    offset = Math.max(0, Math.floor(Number(offset) || 0));
    return {
        time: clock(), location: text('location_name_span'),
        started: !!g.hiddenReason(g.document.getElementById('loading_screen')) && g.document.documentElement.dataset.startScreen === 'closed',
        screen: visibleText(root).slice(0, 12000),
        actions: last.slice(offset, offset + 80).map((c, index) => ({index: index + offset, key: c.key, text: c.text})),
        actionCount: last.length, pageErrors: g.errors.length,
    };
}

// Choose an actual visible native select option. This dispatches the same
// input/change path as a player and cannot introduce an unavailable option.
async function selectOption(selector, value) {
    const g = need(), select = g.document.querySelector(selector);
    if(!select || select.tagName !== 'SELECT') throw new Error('Choose a native select control.');
    if(select.disabled || g.hiddenReason(select)) throw new Error('Select control is not actionable.');
    const option = [...select.querySelectorAll('option')].find(o => o.value === String(value));
    if(!option || option.disabled) throw new Error(`No available player option ${value}.`);
    await g.fill(select, String(value));
}

async function openPanel(id) {
    await selectOption('#workspace_navigation select[aria-label="Other known panels"]', id);
}

const ops = {
    async new({seed = 1, heroName = 'Agent', path, panel, url = 'http://localhost/?test_hooks=1'} = {}) {
        const target = new URL(url);
        if(!['localhost', '127.0.0.1'].includes(target.hostname) || target.protocol !== 'http:') throw new Error('Only a localhost test origin is supported.');
        target.searchParams.set('test_hooks', '1');
        if(game) game.close();
        const encoded = path ? readFileSync(safePath(path), 'utf8') : null;
        game = await boot(null, {seed, heroName, url: target.href});
        if(encoded) await game.importFile(encoded);
        if(panel) await openPanel(panel);
        return look();
    },
    look: args => look(args),
    async click({index, key, text: label, panel, value}) {
        const g = need();
        if(panel) await openPanel(panel);
        else if(value !== undefined) await selectOption(key, value);
        else if(index !== undefined) {
            const hit = last[index];
            if(!hit) throw new Error(`No action ${index}; call game_look first.`);
            await g.click(hit.el);
        } else if(key) await g.click(key);
        else if(label) {
            const hit = controls(g).find(c => c.el.textContent.trim() === label || c.text === label);
            if(!hit) throw new Error(`No clickable element with text ${label}`);
            await g.click(hit.el);
        }
        else throw new Error('Give index, key, text or panel.');
        return look();
    },
    async step({minutes}) {
        const g = need();
        if(!(minutes > 0 && minutes <= 10080)) throw new Error('minutes must be 1 to 10080.');
        await g.step(minutes);
        return look();
    },
    status() {
        const g = need();
        return {time: clock(), location: text('location_name_span'), boots: g.boots, stats: g.stats,
            errors: g.errors.slice(-5).map(e => String(e.message ?? e).slice(0, 300))};
    },
    async save() {
        const saved = await need().save();
        return {hash: sha(canonicalSave(saved)), bytes: JSON.stringify(saved).length, heroCreated: !!saved.global_flags?.is_hero_created};
    },
    async export() {
        const encoded = await need().exportFile();
        mkdirSync(EXPORT_DIR, {recursive: true});
        const path = join(EXPORT_DIR, `save-${randomUUID()}.txt`);
        writeFileSync(path, encoded);
        return {path, bytes: encoded.length};
    },
    async load({path}) {
        await need().importFile(readFileSync(safePath(path), 'utf8'));
        return look();
    },
};

function safePath(p) {
    const full = resolve(String(p));
    if(!full.startsWith(EXPORT_DIR + '/')) throw new Error(`Only files under ${EXPORT_DIR} can be loaded.`);
    return full;
}

process.on('message', async ({id, op, args}) => {
    try {send({id, ok: true, result: await ops[op](args ?? {})});}
    catch(error) {send({id, ok: false, error: String(error?.message ?? error)});}
});
send({ready: true});
