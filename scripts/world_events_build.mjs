// Private source stays in private output; this builder copies metadata, never prose.
import {readFile, writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {check} from '../src/basics.js';
import {loadEventPack} from '../src/world_events_pack.js';

const privateDir = new URL('../docs/research/novels/lord-of-mysteries/private/l14-2026-10-30/', import.meta.url);
const tally = (rows, key) => rows.reduce((counts, row) => {
    counts[row[key]] = (counts[row[key]] ?? 0) + 1;
    return counts;
}, {});

// newsRows includes the source's id/chapter/scope metadata joined by the CLI.
// Return the pack separately from facts so facts cannot enter the calendar.
export function buildPack(sceneRows, newsRows) {
    const events = [], privateFacts = [];
    let leftOut = 0;
    for (const scene of sceneRows) {
        const root = scene.beat === scene.frame;
        if (!root && scene.frameDay == null) {leftOut++; continue;}
        const event = {
            id: `ev.${scene.beat}`, key: `lotm.v1.${scene.beat}`, kind: 'canon_beat',
            placement: root ? 'ordinal' : 'anchored', scope: 'private', evidence: scene.label,
            spread: [],
        };
        if (scene.place != null) event.place = scene.place;
        if (root) event.ordinal = {beat: scene.frame};
        else event.anchor = {eventId: `ev.${scene.frame}`, offsetDays: scene.frameDay};
        events.push(event);
    }
    for (const row of newsRows) {
        const spread = row.route === 'none' ? [] : [{route: row.route, delayDays: row.delayDays,
            ...(row.via ? {via: row.via, audience: row.audience} : {})}];
        const event = {
            id: row.id, key: `lotm.v1.${row.id}`, lineKey: `news.${row.id}`,
            kind: row.kind, placement: row.placement, scope: row.scope, evidence: row.evidence, spread,
        };
        if (row.chapter !== undefined) event.chapter = row.chapter;
        if (row.kind === 'private_fact') {
            privateFacts.push({...event, frame: row.frame, offsetDays: row.offsetDays, durationDays: row.durationDays});
            continue;
        }
        check(['anchored', 'ordinal', 'unplaced'].includes(row.placement), 'Invalid news placement.');
        if (row.placement === 'anchored') {
            event.anchor = {eventId: `ev.${row.frame}`, offsetDays: row.offsetDays};
            if (row.durationDays != null) event.anchor.durationDays = row.durationDays;
        } else if (row.placement === 'ordinal') {
            check(typeof row.frame === 'string' && sceneRows.some(scene => scene.beat === row.frame && scene.frame === row.frame), 'Unknown news frame.');
            event.ordinal = {beat: row.frame};
        }
        events.push(event);
    }
    const pack = {schema: 1, world: 'lotm', events};
    loadEventPack(pack);
    return {pack, privateFacts, counts: {
        kind: tally([...events, ...privateFacts], 'kind'),
        placement: tally(events, 'placement'), route: tally(newsRows, 'route'), leftOut,
    }};
}

// Volumes 2-8 have no scene frames: a placed row runs at its chapter, bound by the host as beat `lotm.v<N>.ch<chapter>`.
export function buildLaterPack(volume, newsRows) {
    const events = [], privateFacts = [];
    for (const row of newsRows) {
        // A route with no stated delay (a diary, say) has no delivery day, so it spreads nowhere.
        const spread = row.route === 'none' || !Number.isSafeInteger(row.delayDays) ? [] : [{route: row.route, delayDays: row.delayDays,
            ...(row.via ? {via: row.via, audience: row.audience} : {})}];
        const event = {id: row.id, key: `lotm.v${volume}.${row.id}`, lineKey: `news.${row.id}`, kind: row.kind,
            placement: row.placement === 'ordinal' && Number.isSafeInteger(row.chapter) ? 'ordinal' : 'unplaced',
            scope: row.scope, evidence: row.evidence, spread};
        if (row.chapter != null) event.chapter = row.chapter;
        if (row.kind === 'private_fact') {privateFacts.push({...event, durationDays: row.durationDays}); continue;}
        if (event.placement === 'ordinal') event.ordinal = {beat: `lotm.v${volume}.ch${row.chapter}`};
        events.push(event);
    }
    const pack = {schema: 1, world: 'lotm', events};
    loadEventPack(pack);
    return {pack, privateFacts, counts: {kind: tally([...events, ...privateFacts], 'kind'), placement: tally(events, 'placement'), route: tally(newsRows, 'route')}};
}

const readRows = async name => (await readFile(new URL(name, privateDir), 'utf8')).split(/\r?\n/).filter(line => line.trim()).map(JSON.parse);

async function mainLater() {
    for (const volume of [2, 3, 4, 5, 6, 7, 8]) {
        const parts = [''].concat(['a', 'b']).map(x => `v${volume}${x}`);
        const rows = [];
        for (const part of parts) {
            let source, classified;
            try {[source, classified] = await Promise.all([`news_in_${part}.jsonl`, `news_class_${part}.jsonl`].map(readRows));} catch {continue;}
            const metadata = new Map(source.map(row => [row.id, row]));
            for (const row of classified) {
                const input = metadata.get(row.id);
                check(input, 'Missing news metadata.');
                rows.push({...row, chapter: input.chapter, scope: input.scope});
            }
        }
        if (!rows.length) continue;
        const {pack, privateFacts, counts} = buildLaterPack(volume, rows);
        await writeFile(new URL(`world_events_v${volume}.json`, privateDir), JSON.stringify(pack, null, 2) + '\n');
        await writeFile(new URL(`private_facts_v${volume}.json`, privateDir), JSON.stringify(privateFacts, null, 2) + '\n');
        console.log(JSON.stringify({volume, events: pack.events.length, privateFacts: privateFacts.length, ...counts}));
    }
}

async function main() {
    if (process.argv.includes('--later')) return mainLater();
    const [scenes, classified, source] = await Promise.all(['scene_days.jsonl', 'news_class.jsonl', 'news_in.jsonl'].map(readRows));
    const metadata = new Map(source.map(row => [row.id, row]));
    const rows = classified.map(row => {
        const input = metadata.get(row.id);
        check(input, 'Missing news metadata.');
        return {...row, chapter: input.chapter, scope: input.scope};
    });
    const {pack, privateFacts, counts} = buildPack(scenes, rows);
    await writeFile(new URL('world_events_v1.json', privateDir), JSON.stringify(pack, null, 2) + '\n');
    await writeFile(new URL('private_facts.json', privateDir), JSON.stringify(privateFacts, null, 2) + '\n');
    console.log(JSON.stringify({events: pack.events.length, privateFacts: privateFacts.length, ...counts}, null, 2));
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
    main().catch(e => {if (process.env.DEBUG_BUILD) console.error(e); console.error('World event pack build failed; inspect the private input metadata.'); process.exitCode = 1;});
}
