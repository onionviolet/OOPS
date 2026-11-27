// Which book workings reached the game. Game rows cite reader rule ids (`sourceIds`); a row the host compiles into a
// command is bound, a row that only sits in a source table is recorded. Makers that cite nothing get one
// atlas-authored link below, named as such, so the map never passes a guess off as a citation.
//   node prototypes/world-atlas/game-making.mjs
import {LOTM_ACT_ROWS, defineActs} from '../../src/book_world_lotm_acts_host.js';
import {LOTM_POTION_RULES} from '../../src/lotm_potion_rule_rows.js';
import {LOTM_SUMMONS_ROWS} from '../../src/lotm_summons_rows.js';
import {amuletTrialCommands} from '../../src/lotm_amulet_crafting.js';
import {hpLeadMakingCommands} from '../../src/hp_lead_making.js';
import {SLUMBER_UPKEEP} from '../../src/lotm_silver_charms.js';
import {fileURLToPath} from 'node:url';
import {playStatus} from './play-status.mjs';
import {readPinnedPlayReceipt} from './pinned-play-receipt.mjs';

const root=fileURLToPath(new URL('../../',import.meta.url));
const RECHARGE_RULE='lotm.craft.charm-recharge';
const UPKEEP_PROOF={state:'agent-verified, not human-reviewed',route:'synthetic aged Slumber workshop',
    receipt:'docs/gm/dispatch/procedural-crafting-2026-11-11/LOTM_CHARM_UPKEEP_2026-11-25.md',
    proof:'docs/representations/evidence/lotm-charm-upkeep-2026-11-25/proof.json',
    bundleSha256:'d2ba7f143317736ecc2e49deb200c0949c81bc945583ce78be5047bd82fa28cd'};
export const upkeepReceiptSpec={
    path:UPKEEP_PROOF.proof,fingerprint:'82a117835f105037bbfd17eabb1e2ddec21b813d80f1f35f6d530111320ec63c',
    life:'Tingen aged Slumber workshop fixture',action:'Renew a fading held Slumber charm',
    playedBuild:r=>r.route?.includes('normal native controls')&&r.fadedMinutes===2&&r.renewedMinutes===5&&
        r.upkeepMinutes===10&&r.bundleHash===UPKEEP_PROOF.bundleSha256&&r.bundleHash,
};
export const citesMakingCapability=(row,rule)=>row.cites.includes(rule)&&(rule!==RECHARGE_RULE||row.id===SLUMBER_UPKEEP);

// Playable makers with no sourceIds of their own. `cites` is the atlas's reading, not the row's.
const ATLAS_LINKS = [
    {world: 'lotm', id: 'lotm.seer-brew', label: 'Brew the Seer potion (lotm_seer_brew.js)', file: 'src/lotm_seer_brew.js', cites: ['lotm.potion.seer', 'lotm.potion.seer-sequence']},
    {world: 'hp', id: 'hp.lead.cure-boils', label: 'Brew the Cure for Boils (hp_lead_making.js)', file: 'src/hp_lead_making.js', cites: ['hp.potion.boil-cure'], probe: () => hpLeadMakingCommands.length},
    {world: 'lotm', id: 'lotm.amulet-trial', label: 'Engrave the silver amulet (lotm_amulet_crafting.js)', file: 'src/lotm_amulet_crafting.js', cites: [], probe: () => amuletTrialCommands('atlas').length},
];

function charmCandidates(acts, unbound, commands) {
    const readerId = 'lotm.rule.charm-crafting';
    const dreamConsumer = 'lotm.rite.dream-entry';
    const cards = [
        ['slumber-charm', 'Make a slumber charm, then use it on a small area.',
            'Start here in Tingen. Check exposure, who falls asleep, and that burning spends the charm.'],
        ['soothing-charm', 'Make a soothing charm, then use it to calm someone.',
            'Reuse the Slumber route. Check that the target calms while the cause of distress persists.'],
        ['dream-charm', 'Make a dream charm, then use it to approach a sleeping subject’s dream.',
            'Wire dream entry. Check that it requires a sleeping subject and meditation, and can yield no answer.'],
    ];
    return {
        readerId, materialId: 'lotm.item.silver-sheet',
        reuse: [
            {file: 'src/lotm_act_engine.js', text: 'Step bindings and held output. See the ritual oil and bath.'},
            {file: 'src/lotm_amulet_crafting.js', text: 'Silver stock, tool and spirituality checks.'},
        ],
        seam: 'Bind a Tingen recipe that leaves a held charm at inscription. Give activation its own command to spend the charm and apply its effect.',
        boundary: 'Exact amounts, ritual details and effect duration are unstated. Upkeep applies to unused charms.',
        cards: cards.map(([slug, action, next]) => {
            const id = 'lotm.craft.' + slug;
            const row = acts.get(id);
            return {
                id, label: row.label, action, next, cites: row.sourceIds, locators: row.locators,
                commands: commands.get(id) ?? 0, reasons: unbound.get(id) ?? [],
                effects: row.effects.filter(e => e.type === 'owner-needed').map(e => e.owner),
                consumer: slug === 'dream-charm' && acts.has(dreamConsumer) ? {
                    id: dreamConsumer, label: acts.get(dreamConsumer).label, commands: commands.get(dreamConsumer) ?? 0,
                } : null,
            };
        }),
    };
}

export function gameMaking() {
    const {commands, unbound} = defineActs();
    const commandCounts = new Map();
    for (const c of commands) {
        const id = c.lotmAct.rowId;
        commandCounts.set(id, (commandCounts.get(id) ?? 0) + 1);
    }
    const rows = [
        ...LOTM_ACT_ROWS.map(r => ({world: 'lotm', id: r.id, label: r.label, table: 'LOTM rite, craft and aid rows', cites: r.sourceIds || [], bound: commandCounts.has(r.id), how: 'cited'})),
        ...LOTM_POTION_RULES.rows.map(r => ({world: 'lotm', id: r.id, label: r.label, table: 'LOTM potion rules', cites: r.sourceIds || [], playable: false, how: 'cited'})),
        ...LOTM_SUMMONS_ROWS.rows.map(r => ({world: 'lotm', id: r.id, label: r.label, table: 'LOTM summons', cites: r.sourceIds || [], playable: false, how: 'cited'})),
        ...ATLAS_LINKS.map(({probe, ...l}) => ({...l, table: 'Maker binding', bound: probe ? probe() > 0 : true, how: 'atlas link'})),
    ];
    // Inscription rows cite upkeep as source context; those citations do not
    // implement the maintenance operation. This exact Slumber command does.
    const upkeep=commands.find(command=>command.id===SLUMBER_UPKEEP+'.renew');
    const upkeepReceipt=upkeep&&readPinnedPlayReceipt(root,upkeepReceiptSpec);
    if(upkeep)rows.push({world:'lotm',id:SLUMBER_UPKEEP,label:'Slumber charm upkeep',table:'Slumber upkeep binding',
        cites:[RECHARGE_RULE],bound:true,playReceipt:upkeepReceipt,how:'cited',scope:'Slumber charms only',verification:upkeepReceipt?UPKEEP_PROOF:undefined});
    // Per world: rule id -> the game rows citing it, best state first.
    const byWorld = {};
    for (const r of rows) {
        Object.assign(r,playStatus({receipt:r.playReceipt,gap:r.bound?'A native replay of '+r.label+' on a named build is needed.':undefined}));
        r.playable=Boolean(r.playReceipt);
        const w = byWorld[r.world] ??= {rows: 0, playable: 0, byRule: {}};
        w.rows++; if (r.playable) w.playable++;
        for (const id of r.cites.filter(id=>citesMakingCapability(r,id))) (w.byRule[id] ??= []).push({row: r.id, label: r.label, playable: r.playable, playGap:r.playGap, how: r.how, table: r.table,
            ...(r.bound?{bound:true,scope:r.scope,verification:r.verification}:{})});
    }
    byWorld.lotm.candidates = charmCandidates(new Map(LOTM_ACT_ROWS.map(r => [r.id, r])),
        new Map(unbound.map(r => [r.id, r.reasons])), commandCounts);
    const slumber = LOTM_ACT_ROWS.find(r => r.id === 'lotm.craft.slumber-charm');
    const make = commands.find(c => c.lotmAct.rowId === slumber.id);
    const use = commands.find(c => c.lotmAct.rowId === slumber.id + '-use');
    byWorld.lotm.slumber = {
        id: 'lotm.item.slumber-charm', label: slumber.label,
        refs: ['lotm.item.slumber-charm', slumber.id], locators: slumber.locators,
        effect: 'The burning charm spreads a sleep-inducing calm where it lands. People nearby can fall asleep, including allies and the thrower. Throwing it away from yourself reduces exposure.',
        ingredients: slumber.inputs.map(x => x.name),
        make: slumber.steps.slice(0, -1).map(x => x.text), use: slumber.steps.at(-1).text,
        upkeep: slumber.recharge.mechanism,
        people: [
            {id: 'lotm.person.klein', label: 'Klein Moretti', role: 'Learns the method, makes and throws the charm'},
            {id: 'lotm.person.old-neil', label: 'Old Neil', role: 'Recharges unused charms'},
        ],
        workshop: make?.location || null,
        game: {make: !!make, use: !!use, upkeep: !!upkeep,upkeepPlayable:!!upkeepReceipt,upkeepScope:'Slumber charms only',upkeepVerification:upkeepReceipt?UPKEEP_PROOF:null},
    };
    return {rows, worlds: byWorld};
}

// A reader working's game state: playable beats recorded beats absent.
export const ruleState = links => !links?.length ? 'absent' : links.some(l => l.playable) ? 'playable' : links.some(l=>l.bound)?'bound':'recorded';

if (import.meta.main) process.stdout.write(JSON.stringify(gameMaking()));
