// What the batch readers found, drawn: Progress › Reader findings (one row per read world, one column per row
// family), a world's Things (census entities, abilities, laws, services), and its Making tree (inputs → working →
// products, from reader rules or the game's recipe book). Read-only; digests come from /readers/<world>.
import {boxCanvas, element as el} from '/canvas.mjs';
import {personReaderDetailSections, peopleEvidenceLabel} from '/people-detail-views.mjs';
import {worldTitle} from '/library-views.mjs';
import {appendPlaceDetails} from './place-details-view.mjs';
import {lifePage, lifePrice, publicLifeRow} from './texture-life.mjs';
import {appendCensusDetails} from './census-details-view.mjs';
import {boundedCache} from './bounded-cache.mjs';
import {appendRecordHandoffs} from './record-handoffs-view.mjs';
import {activitiesForPlace,placeSearchText,nativeActivityPlaces,nativePlaceDigest} from './place-activities.mjs';

const MAX = 72;
// Same rule as game-making.mjs ruleState (that module imports game code, so the browser keeps its own copy).
const ruleState = links => !links?.length ? 'absent' : links.some(l => l.playable) ? 'playable' : links.some(l=>l.bound)?'bound':'recorded';
const MAKING = ['craft', 'potion', 'rite', 'spell'];
const isPower = r => r.kind === 'ability' || r.kind === 'spell';
const cache = boundedCache({maxEntries:2,maxWeight:32*1024*1024});
function sourceLink(world, view, id, label) {
    const a = el('a', label);
    a.href = `#world/${world}/${view}/${encodeURIComponent(id)}`;
    return a;
}

function activityHandoffs(world, activity) {
    const panel=el('details'), content=el('div');
    content.setAttribute('aria-live','polite');
    panel.append(el('summary','Find Workbench reports citing this gameplay receipt'),content);
    let loading=false;
    panel.ontoggle=async()=>{
        if(!panel.open||loading)return;
        loading=true; content.textContent='Checking the local Workbench…';
        try {
            const query=new URLSearchParams({world,activity:activity.id});
            const response=await fetch('/activity-handoffs?'+query,{cache:'no-store'});
            if(!response.ok)throw Error();
            const {entries,unreadable}=await response.json();
            content.replaceChildren();
            for(const entry of entries){
                const link=el('a',entry.origin+' · '+entry.label);
                link.href='#workbench/handoffs/'+entry.id;
                const row=el('p');row.append(link,' · ',el('small',entry.consumers.join(' · ')));content.append(row);
            }
            if(!entries.length)content.append(el('p','No readable Workbench report cites this receipt yet.'));
            if(unreadable)content.append(el('p','Some local Workbench files could not be read.'));
        } catch {content.textContent='Workbench unavailable. Close and reopen to retry.';}
        finally {loading=false;}
    };
    return panel;
}
export async function readerDigest(world) {
    const existing = cache.get(world);if(existing)return existing;
    const pending = fetch('/readers/' + world).then(async r => {
        if(!r.ok){cache.delete(world);return null;}
        const text = await r.text(),value = JSON.parse(text);
        cache.set(world,Promise.resolve(value),text.length*2);return value;
    }).catch(()=>{cache.delete(world);return null;});
    return cache.set(world,pending);
}
function grid(items, cols, dx = 210, dy = 80, y0 = 0) {
    return items.map((it, i) => ({...it, x: (i % cols) * dx, y: y0 + Math.floor(i / cols) * dy}));
}
const tabs = (main, options, current, pick, label = 'Kinds') => {
    const nav = el('nav', null, 'canvas-index');
    nav.setAttribute('aria-label', label);
    for (const [id, label] of options) {
        const b = el('button', label); b.type = 'button'; b.onclick = () => pick(id);
        b.setAttribute('aria-pressed', String(id === current)); nav.append(b);
    }
    main.append(nav);
};

const NOT_DRAWN = 'Things opens people, routines, ties and place affordances. Reader scenes opens collected scene records. The digests omit raw source text, census notes, scene knowledge prose and sealed details.';

export function findingsView({main, data, controls}) {
    main.replaceChildren();
    const f = data.findings, bar = controls();
    if (!f) {bar.append(el('p', 'No reader findings in the snapshot. Run node prototypes/world-atlas/build.mjs.')); return;}
    const read = f.worlds.filter(w => w.read), waiting = f.worlds.filter(w => !w.read);
    bar.append(el('small', `${read.length} read worlds with reader rows · ${waiting.length} planned with no rows yet (hatched) · counts are distinct after deduplication: one canonical file per shard and pass, then by id`));
    const article = el('article', null, 'sheet findings-sheet');
    article.append(el('h2', 'Reader findings'), el('p', 'Counts show distinct collected records. Green cells have an atlas view. Amber cells need a newer projection. Hatched rows have no collected records here.'));
    const table = el('table', null, 'findings-matrix'), head = el('tr');
    head.append(el('th', 'World'), el('th', 'Shards read'));
    for (const c of f.columns) head.append(el('th', c.label));
    const thead = el('thead'); thead.append(head); table.append(thead);
    const body = el('tbody');
    for (const w of [...read.sort((a, b) => b.read - a.read), ...waiting.sort((a, b) => b.planned - a.planned)]) {
        const tr = el('tr'); tr.dataset.state = w.read ? 'read' : 'none';
        const name = el('th'); name.scope = 'row';
        if (w.read) {const a = el('a', worldTitle(w.world)); a.href = '#world/' + w.world + '/things'; name.append(a);} else name.textContent = worldTitle(w.world);
        tr.append(name, el('td', w.read ? `${w.registryRead}${w.planned && w.registryRead < w.planned ? ' of ' + w.planned : ''}${w.extraSlices ? ' + ' + w.extraSlices + ' lead-run slices' : ''}` : `0 of ${w.planned}`));
        for (const c of f.columns) {
            const n = w.counts[c.id]?.distinct || 0, td = el('td', w.read ? String(n) : '');
            td.dataset.state = !w.read ? 'none' : !n ? 'empty' : c.id !== 'scenes' || w.sceneIndex ? 'drawn' : 'rows';
            if (c.id === 'scenes' && w.sceneIndex) {
                const a = el('a', String(n)); a.href = '#world/' + w.world + '/reader-scenes';
                a.setAttribute('aria-label', `${worldTitle(w.world)} reader scenes (${n})`);
                td.replaceChildren(a);
            }
            if (['people', 'creatures', 'places', 'abilities', 'groups'].includes(c.id) && n) {
                const a = sourceLink(w.world, 'things', c.id, String(n));
                a.setAttribute('aria-label', `${worldTitle(w.world)} ${c.id} (${n})`);
                td.replaceChildren(a);
            }
            td.title = `${c.label}: ${w.counts[c.id]?.rows || 0} rows, ${n} distinct`;
            tr.append(td);
        }
        body.append(tr);
    }
    table.append(body);
    const scroller = el('div', null, 'findings-scroll'); scroller.append(table);
    article.append(scroller, el('p', NOT_DRAWN));
    main.append(article);
}

export async function readerScenesView({main, data, controls, worldId, button, focus}) {
    main.replaceChildren();
    const bar = controls(), digest = await readerDigest(worldId);
    if (!bar.isConnected) return;
    if (!digest?.scenes) {
        bar.append(el('p', 'Rebuild the atlas where this world’s reader files are collected.'));
        return;
    }
    const places = new Map(digest.entities.filter(e => e.col === 'places').map(e => [e.id, e.label]));
    const names = new Map(digest.entities.map(e => [e.id, e.label]));
    for (const r of digest.rules || []) if (isPower(r) || r.kind === 'institution') names.set(r.id, r.name);
    const placeLabel = id => id ? places.get(id) ?? `Unmatched · ${id}` : 'Place unstated';
    const scenePlaces = [...new Set(digest.scenes.map(s => s.place))].sort((a, b) => placeLabel(a).localeCompare(placeLabel(b)));
    const sheet = el('section', null, 'sheet reader-scenes');
    const heading = el('div', null, 'reader-scenes-heading');
    heading.append(el('h2', worldTitle(worldId) + ' · Reader scenes'), el('span', 'Source records', 'reader-scene-source'));
    const matched = scenePlaces.filter(id => places.has(id)).length;
    const summary = [`${digest.scenes.length} ${digest.scenes.length === 1 ? 'scene' : 'scenes'}`, `${matched} matched ${matched === 1 ? 'place' : 'places'}`];
    if (digest.sealedScenes) summary.push(`${digest.sealedScenes} sealed`);
    sheet.append(heading, el('p', summary.join(' · ')), el('p', 'Open a locator to see the scene’s reader record.'));
    if (!digest.scenes.length) {main.append(sheet); return;}

    bar.classList.add('reader-scenes-controls');
    const search = el('input'), place = el('select');
    search.type = 'search'; search.placeholder = 'Search scenes or linked records'; search.setAttribute('aria-label', 'Search reader scenes');
    const shard = focus?.startsWith('shard:') ? focus.slice(6) : null;
    search.value = shard ? '' : focus || '';
    place.setAttribute('aria-label', 'Filter by place');
    place.append(el('option', 'All places'));
    for (const id of scenePlaces) place.append(el('option', placeLabel(id)));
    bar.append(search, place);
    const table = el('table'), head = el('thead'), header = el('tr'), body = el('tbody');
    for (const label of ['Scene / source locator', 'Place', 'Steps', 'Options', 'Outcomes']) {
        const th = el('th', label); th.scope = 'col'; header.append(th);
    }
    head.append(header); table.append(head, body);
    const scroll = el('div', null, 'reader-scenes-scroll'); scroll.append(table);
    const pager = el('nav', null, 'reader-scenes-pager'), status = el('output');
    const index = el('div'), sceneBody = el('div', null, 'reader-scenes-body');
    const selected = digest.scenes.find(row => row.id === focus);
    if (shard) bar.append(el('span', 'Reading range · ' + shard));
    if (selected || shard) bar.append(sourceLink(worldId, 'reader-scenes', '', 'All scenes'));
    index.append(scroll, pager);
    sceneBody.append(index);
    if (selected) sceneBody.append(sceneRecord(selected, digest, data, worldId));
    const size = 30;
    let offset = 0;
    const previous = button('Previous', () => {offset -= size; render();});
    const next = button('Next', () => {offset += size; render();});
    pager.setAttribute('aria-label', 'Scene pages'); pager.append(previous, status, next);
    function render() {
        const q = search.value.trim().toLowerCase();
        const rows = digest.scenes.filter(s => (!shard || s.shards?.includes(shard)) && (!place.selectedIndex || s.place === scenePlaces[place.selectedIndex - 1]) &&
            [s.id, ...(s.locators || [s.locator]), s.place, placeLabel(s.place), ...(s.people || []), ...(s.refs || []), ...(s.powers || []), ...(s.groups || [])]
                .some(value => value?.toLowerCase().includes(q) || names.get(value)?.toLowerCase().includes(q)));
        body.replaceChildren();
        for (const s of rows.slice(offset, offset + size)) {
            const row = el('tr'), label = el('th'); label.scope = 'row';
            const link = sourceLink(worldId, 'reader-scenes', s.id, s.locator || s.id);
            if (s.id === selected?.id) link.setAttribute('aria-current', 'true');
            label.append(link, el('small', s.id));
            const location = el('td', placeLabel(s.place));
            if (!places.has(s.place)) location.className = 'reader-scene-unmatched';
            row.append(label, location, ...[s.steps, s.options, s.outcomes].map(n => el('td', String(n))));
            body.append(row);
        }
        status.textContent = rows.length ? `${offset + 1}–${Math.min(offset + size, rows.length)} of ${rows.length}` : 'No matching scenes';
        previous.disabled = offset === 0; next.disabled = offset + size >= rows.length;
    }
    search.oninput = place.onchange = () => {offset = 0; render();};
    render(); sheet.append(sceneBody); main.append(sheet);
}

function sceneRecord(scene, digest, data, worldId) {
    const record = el('article', null, 'reader-scene-record making-item-record');
    const names = new Map(digest.entities.map(e => [e.id, e.label]));
    for (const rule of digest.rules) if (isPower(rule) || rule.kind === 'institution') names.set(rule.id, rule.name);
    const linked = id => names.has(id) ? sourceLink(worldId, 'things', id, names.get(id)) : id;
    const detail = scene.detail || {};
    const caption = row => recordCaption([SOURCE_LABEL[row.label], row.locator]);
    const stepFields = {requires:'Requires', inputs:'Inputs', using:'Uses', target:'Targets',
        outputs:'Produces', gains:'Gains', results:'Results', witnesses:'Witnesses'};
    function action(row) {
        const parts = [row.text, ...(row.actor ? [' · ', linked(row.actor)] : []),
            ...recordCaption([row.minutes != null ? `${row.minutes} min` : null, SOURCE_LABEL[row.label], row.locator])];
        const fields = Object.entries(row.means || {}).filter(([key]) => Object.hasOwn(stepFields, key));
        if (fields.length || row.kind || row.habit || row.class) {
            const details = el('details', null, 'reader-step-details');
            details.append(el('summary', 'How this step works'));
            const meta = [row.kind, row.class, row.habit].filter(Boolean);
            if (meta.length) details.append(el('p', meta.join(' · ')));
            for (const [field, values] of fields) {
                const line = el('p');
                line.append(el('strong', stepFields[field] + ' '));
                values.forEach((v, i) => line.append(...(i ? [', '] : []), linked(v)));
                details.append(line);
            }
            parts.push(details);
        }
        return parts;
    }
    const timePrecision = {day:'Day-level timing',band:'Broad part of day',hour:'Hour-level timing',minute:'Minute-level timing'}[scene.timePrecision];
    const when = [detail.date?.text, SOURCE_LABEL[detail.date?.label], scene.time, scene.time ? timePrecision : null].filter(Boolean).join(' · ');
    const scenesById = new Map(digest.scenes.map(s => [s.id, s]));
    record.append(el('h2', 'Scene at ' + (scene.locator || scene.id)));
    const context = el('p'); context.append(scene.place ? linked(scene.place) : 'Place unstated', when ? ` · ${when}` : ''); record.append(context);
    record.append(sourceRecordSection('What happened', (detail.actions || []).map(action),
    'No action summaries in this snapshot.'));
    if (detail.anchors?.length) record.append(sourceRecordSection('Quantities in the reading', detail.anchors.map(a => [
        a.fact + ' · ' + (a.approx ? 'about ' : '') + [a.value, a.unit].filter(v => v != null).join(' '),
        ...recordCaption([a.scope, a.locator])])));
    if (detail.choices?.length) record.append(sourceRecordSection('Choices taken', detail.choices.map(row => [row.text,
        ...recordCaption([row.alternatives.length ? 'Alternatives: ' + row.alternatives.join(', ') : null]), ...caption(row)])));
    if (detail.options?.length) record.append(sourceRecordSection('Options recorded', detail.options.map(row => [row.text,
        ...recordCaption([row.taken === true ? 'Taken' : row.taken === false ? 'Untaken' : null, row.needs.length ? 'Needs ' + row.needs.join(', ') : null]), ...caption(row)])));
    if (detail.outcomes?.length) record.append(sourceRecordSection('Outcomes', detail.outcomes.map(row => [row.value || row.fact,
        ...recordCaption([row.kind, row.value ? row.fact : null])])));
    if (scene.people?.length) record.append(sourceRecordSection('People', scene.people.map(id => [linked(id)])));
    const records = [...new Set([...(scene.refs || []), ...(scene.powers || []), ...(scene.groups || [])])];
    if (records.length) record.append(sourceRecordSection('Connected records', records.map(id => [linked(id)])));
    const related = (detail.related || []).filter(dep => scenesById.has(dep.id));
    if (related.length) record.append(sourceRecordSection('Related scenes', related.map(dep => [dep.kind === 'needs' ? 'Needs ' : 'After ',
        sourceLink(worldId, 'reader-scenes', dep.id, scenesById.get(dep.id).locator || dep.id)])));
    const cast = data.books?.[worldId]?.places.find(p => p.scenes?.some(s => s.kind === 'beat' && s.id === scene.id));
    record.append(el('p', 'In OOPS · ' + (cast ? 'Exact cast beat linked. Play is unverified here.' : 'No confirmed game scene link in this snapshot.'), 'making-item-status'));
    if (cast) record.append(sourceLink(worldId, 'places', cast.id, cast.name));
    const evidence = el('details'); evidence.append(el('summary', 'Source references'), el('p', scene.id),
        sourceRecordSection('Locators', (scene.locators || []).map(locator => [locator])));
    record.append(evidence);
    return record;
}

function rulesFor(d, kinds) {return d.rules.filter(r => kinds ? kinds.includes(r.kind) : true);}
// Item index over a set of workings: who makes it, who uses it.
function itemIndex(rules, entities = []) {
    const known = new Map(entities.map(e => [e.id, e])), items = new Map();
    const get = x => items.get(x.id) || items.set(x.id, {id: x.id, label: x.label, matched: x.matched !== false, kind: known.get(x.id)?.kind, madeBy: [], usedIn: []}).get(x.id);
    for (const r of rules) {for (const x of r.inputs) get(x).usedIn.push(r.id); for (const x of r.products) get(x).madeBy.push(r.id);}
    return items;
}
const role = it => it.madeBy.length && it.usedIn.length ? 'intermediate' : it.madeBy.length ? 'product' : 'raw';
const ROLE_GROUP = {raw: 'source', intermediate: 'partial', product: 'reached'};
const GAME_LINE = {playable: 'Playable in the game',bound:'Native binding exists; playable receipt pending', recorded: 'Recorded in a game source table, not playable yet', review: 'Possible game rows under older citations', absent: 'Not in the game'};
const GAME_TABS = [['@playable', 'Playable'],['@bound','Bound · proof pending'], ['@recorded', 'Recorded only'], ['@review', 'Citation review'], ['@absent', 'Not in the game']];
const ruleLine = r => [r.worldKind || r.kind, r.seen > 1 ? `seen in ${r.seen} slices` : null, r.locator].filter(Boolean).join(' · ');
function ruleFacts(r, list) {
    const amt = x => (x.qty != null ? x.qty + (x.unit ? ' ' + x.unit : '') + ' × ' : '') + x.label + (x.role && x.role !== 'main' ? ` (${x.role})` : '') + (x.matched === false ? ' · not in the census' : '') + (x.fill ? ` · filled from the readers' steps (${x.fill})` : '');
    return list([
        `Kind: ${r.kind}${r.worldKind ? ' · ' + r.worldKind : ''}${r.category ? ' · ' + r.category : ''}`,
        r.inputs.length ? 'Takes: ' + r.inputs.map(amt).join(', ') : 'Takes: nothing recorded',
        r.products.length ? 'Makes: ' + r.products.map(amt).join(', ') : 'Makes: nothing recorded',
        r.outcome ? 'Makes no item; outcome: ' + r.outcome : null,
        r.costs?.length ? 'Costs: ' + r.costs.map(c => c.amount + ' ' + c.unit).join(', ') : null,
        r.minutes ? `Takes ${r.minutes} minutes` : null, r.ritual ? 'Needs a ritual' : null,
        r.steps ? `${r.steps} recorded steps` : null, r.who ? `${r.who} people seen doing it` : null,
        r.state ? {absorbed: 'In upstream YAIR and OOPS', added: 'Added by OOPS', source: 'Upstream only'}[r.state] : null,
        r.gameState ? GAME_LINE[r.gameState] + (r.game?.length ? ': ' + r.game.map(g => `${g.label} (${g.table}${g.how === 'atlas link' ? ', atlas-authored link' : ''})`).join('; ') : '') : null,
        r.line ? `src/crafting_recipes.js line ${r.line}` : r.locator ? 'First locator: ' + r.locator : null,
    ].filter(Boolean));
}

const workingFocus = id => 'working:' + id;
const workingLink = (r, worldId) => MAKING.includes(r.kind) || r.state
    ? sourceLink(worldId, 'making', workingFocus(r.id), r.name) : sourceLink(worldId, 'things', r.id, r.name);
const SOURCE_LABEL = {S: 'Shown', T: 'Stated', I: 'Inferred', U: 'Unresolved'};
const recordCaption = values => values.filter(Boolean).length ? [el('small', values.filter(Boolean).join(' · '))] : [];
const materialEvidence = item => (item.sources?.length ? item.sources : item.locator ? [{locator: item.locator}] : [])
    .flatMap(source => recordCaption([SOURCE_LABEL[source.label], source.locator]));
const ruleEvidenceRows = rule => (rule.sources?.length ? rule.sources : rule.label || rule.locator ? [{label:rule.label,locator:rule.locator}] : [])
    .map(source => [SOURCE_LABEL[source.label] || 'Evidence label not recorded', ...recordCaption([source.locator])]);
function learningRows(acquisition, entity) {
    return (acquisition || []).flatMap(row => {
        const values = row.teacher ? [['Teacher ', entity(row.teacher), ...recordCaption([SOURCE_LABEL[row.label], row.locator])]] : [];
        for (const [key, label] of [['prerequisites', 'Prerequisites'], ['time', 'Learning time'], ['practice', 'Practice'], ['progressSign', 'Progress'], ['failure', 'Failure'], ['ceiling', 'Ceiling']]) {
            const entries = Array.isArray(row[key]) ? row[key] : row[key] ? [row[key]] : [];
            for (const entry of entries) values.push([entry, ...recordCaption([label, SOURCE_LABEL[row.label], row.locator])]);
        }
        return values;
    });
}
function appendResetRecord(record, resets) {
    if (!resets?.length) return;
    const rows = resets.flatMap(row => [
        [row.trigger, ...recordCaption(['Trigger', SOURCE_LABEL[row.label], row.locator])],
        ...(row.span ? [[row.span, el('small', 'Span')]] : []),
        ...(row.resets || []).map(text => [text, el('small', 'Resets')]),
        ...(row.keeps || []).map(text => [text, el('small', 'Kept')]),
        ...(row.ends ? [[row.ends, el('small', 'Ends')]] : []),
    ]);
    const section = sourceRecordSection('Reset and return', rows); section.dataset.readerReset = '';
    record.append(section);
}
const materialText = x => [x.qty, x.unit, x.label, x.role && x.role !== 'main' ? `(${x.role})` : null,
    x.fill ? `(${x.fill} fill)` : null].filter(value => value != null && value !== '').join(' ');

function itemRecord(side, item, {digest, rules, worldId, game, data}) {
    const entities = new Map((digest?.entities || []).map(e => [e.id, e]));
    const entity = entities.get(item.id), exactLink = id => entities.has(id) ? sourceLink(worldId, 'things', id, entities.get(id).label) : id;
    const makes = rules.filter(r => r.products.some(x => x.id === item.id));
    const uses = rules.filter(r => r.inputs.some(x => x.id === item.id));
    const workings = [...new Set([...makes, ...uses])];
    const scenes = (digest?.scenes || []).filter(s => s.refs?.includes(item.id));
    const people = [...new Set([...scenes.flatMap(s => s.people || []), ...workings.flatMap(r => r.people || [])])].filter(id => entities.get(id)?.col === 'people');
    const places = [...new Set([...(entity?.places || []), ...scenes.map(s => s.place), ...workings.map(r => r.place)])]
        .filter(id => id && !/^unstated$/i.test(id));
    const links = data.gameMaking?.worlds?.[worldId]?.byRule || {};
    const direct = workings.flatMap(r => (links[r.id] || []).filter(link => link.how === 'cited'));
    const proposed = workings.some(r => links[r.id]?.some(link => link.how === 'atlas link'));
    const gameStatus = game ? (workings.some(r => r.state === 'absorbed' || r.state === 'added') ? 'OOPS recipe records linked. Availability in a life is unverified here.' : 'Upstream recipe records only.')
        : direct.some(r => r.playable) ? 'A linked working has a bound game command. Item availability is unverified here.'
            : direct.length ? 'A linked working has game data. No bound command confirmed.'
                : proposed ? 'Possible atlas-authored game link. Item availability is unverified here.' : 'No confirmed game link in this snapshot.';
    const workingRows = (rows, field, label) => rows.map(r => {
        const result = r.results?.find(row => row.when === 'success' && (row.label === 'S' || row.label === 'T'));
        return [workingLink(r, worldId), ...recordCaption([
            r[field].length ? label + ' ' + r[field].map(materialText).join(', ') : null,
            field === 'products' && result ? 'On success: ' + result.what : null, r.locator,
        ])];
    });
    const record = el('section', null, 'reader-item-record making-item-record');
    record.append(el('h2', entity?.label || item.label));
    if (entity?.aliases?.length) record.append(el('p', 'Also called ' + entity.aliases.join(', ')));
    record.append(sourceRecordSection('What it is', (entity?.facts || []).map(f => [f.what, ...recordCaption([SOURCE_LABEL[f.label], f.locator])]),
        entity ? 'No sourced description linked yet.' : 'Named in a working or recipe.'));
    record.append(sourceRecordSection('Made by', workingRows(makes, 'inputs', 'Takes'), 'No maker linked here.'),
        sourceRecordSection('Used in', workingRows(uses, 'products', 'Makes'), 'No use linked here.'));
    if (people.length) record.append(sourceRecordSection('People', people.map(id => [exactLink(id)])));
    if (places.length) record.append(sourceRecordSection('Places', places.map(id => [exactLink(id)])));
    if (scenes.length) record.append(sourceRecordSection('Linked scenes', scenes.map(s => [sourceLink(worldId, 'reader-scenes', s.id, s.locator || s.id),
        ...recordCaption([entities.get(s.place)?.label, s.time])])));
    record.append(el('p', 'In OOPS · ' + gameStatus, 'making-item-status'));
    const evidence = el('details'); evidence.append(el('summary', 'Source references'), el('p', [item.id, entity?.first].filter(Boolean).join(' · ')));
    record.append(evidence); side.append(record);
}

function openWorking(main, r, worldId, list, entities = []) {
    const article = el('article', null, 'sheet making-item-sheet');
    const record = el('section', null, 'making-item-record');
    const items = xs => xs.map(x => [sourceLink(worldId, 'making', x.id, materialText(x)), ...materialEvidence(x)]);
    const statements = xs => (xs || []).map(x => [x.what, ...recordCaption([x.when, x.minutes != null ? `${x.minutes} min` : null, SOURCE_LABEL[x.label], x.locator])]);
    record.append(el('h2', r.name), el('p', ruleLine(r)),
        sourceRecordSection('Inputs', items(r.inputs), 'No inputs recorded.'),
        sourceRecordSection('Products', items(r.products), 'No item products recorded.'));
    if (isPower(r)) record.append(sourceLink(worldId, 'things', r.id, 'Open power record'));
    if (r.conditions?.length) record.append(sourceRecordSection('Conditions', r.conditions.map(x => [x])));
    if (r.procedure?.length) record.append(sourceRecordSection('Procedure', statements(r.procedure)));
    if (r.results?.length) record.append(sourceRecordSection('Results', statements(r.results)));
    if (r.limits?.length) record.append(sourceRecordSection('Limits and qualification', r.limits.map(text => [text])));
    const names = new Map(entities.map(entity => [entity.id, entity.label]));
    const learning = learningRows(r.acquisition, id => names.has(id) ? sourceLink(worldId, 'things', id, names.get(id)) : id);
    if (learning.length) record.append(sourceRecordSection('How it’s learned', learning));
    if (ruleEvidenceRows(r).length) record.append(sourceRecordSection('Source evidence', ruleEvidenceRows(r)));
    if (r.costs?.length || r.minutes || r.outcome) record.append(sourceRecordSection('Costs and outcome', [
        ...(r.costs || []).map(c => [`${c.amount} ${c.unit}`]), ...(r.minutes ? [[`${r.minutes} minutes`]] : []), ...(r.outcome ? [[r.outcome]] : []),
    ]));
    if (r.gameState) {
        const verifiedUpkeep=r.game?.find(link=>link.row==='lotm.craft.slumber-charm-upkeep'&&link.playable&&link.verification?.proof);
        const state = verifiedUpkeep ? 'Agent-verified upkeep for Slumber charms only, on a synthetic aged-charm workshop. The earned Klein route and other charm variants remain unverified.'
            : r.game?.length && r.game.every(link => link.how === 'atlas link') ? 'Possible atlas-authored game link.'
            : {playable: 'Bound game command.',bound:'Native upkeep binding for Slumber charms only. A playable receipt is pending.', recorded: 'Game source row only.', review: 'Earlier citations need review.', absent: 'No confirmed game link in this snapshot.'}[r.gameState];
        record.append(el('p', 'In OOPS · ' + state, 'making-item-status'));
        if(verifiedUpkeep){const reference=el('p');reference.append(sourceLink(worldId,'reading','tracked:RA21','Open upkeep source check and gameplay qualification'));record.append(reference);}
    }
    else if (r.state) record.append(list([{absorbed: 'Recipe in upstream and OOPS', added: 'Recipe in OOPS', source: 'Upstream recipe'}[r.state]]));
    article.append(record); main.append(article);
}

function candidateView({main, candidates, reader, treeHash, list}) {
    const sheet = el('section', null, 'sheet making-candidates');
    sheet.append(el('h2', 'LOTM charm candidates'));
    const exact = candidates.cards.filter(card => card.cites.includes(candidates.readerId));
    const linkStatus = exact.length ? `Direct citation on ${exact.length} of ${candidates.cards.length} craft rows.`
        : 'The craft rows use older citations. Confirm the proposed reader match against the source before changing any citations.';
    sheet.append(el('p', linkStatus), el('p', reader
        ? `${reader.name} · ${reader.id}${reader.locator ? ' · ' + reader.locator : ''}`
        : `Reader working unavailable in this snapshot · ${candidates.readerId}. Game-side locators are below.`));
    if (treeHash) {
        const tree = el('a', 'Open the silver-sheet making tree');
        tree.href = treeHash;
        sheet.append(tree);
    }
    const first = candidates.cards[0];
    sheet.append(el('h3', first.commands ? 'Verify first' : 'Implement first'),
        el('p', first.commands ? 'Walk from inscription to use in Tingen. Check the held item, its consumption and the effect in play.' : candidates.seam));
    const grid = el('div', null, 'making-candidate-grid');
    for (const card of candidates.cards) {
        const article = el('article', null, 'making-candidate');
        article.append(el('h3', card.label), el('p', card.action), el('h4', 'What’s missing'), el('p', card.commands
            ? `${card.commands} compiled steps. Reachability and play still need a receipt.`
            : card.reasons.join(' ') || 'No compiled steps in this act projection.'));
        article.append(el('h4', 'First use to check'), el('p', card.next));
        if (card.consumer) article.append(el('p', `${card.consumer.label} · ${card.consumer.commands ? 'compiled' : 'recorded, no compiled steps'}`));
        const evidence = el('details');
        evidence.append(el('summary', 'Game row and source locators'), list([
            `${card.id} · src/lotm_craft_rows.js`, ...card.cites, ...card.locators, card.consumer?.id,
            card.effects.length ? `Effects requested by the source row · ${card.effects.join(', ')}` : null,
        ].filter(Boolean)));
        article.append(evidence);
        grid.append(article);
    }
    sheet.append(grid, el('h3', 'What we can reuse'), list(candidates.reuse.map(r => `${r.file} · ${r.text}`)), el('p', candidates.boundary));
    main.append(sheet);
}

const slumberItem = (item, slumber) => !!slumber && (item.id === slumber.id || item.label?.trim().toLowerCase() === 'slumber charm');
function slumberRecord({parent, slumber, digest, worldId, books, list}) {
    const record = el('section', null, 'making-item-record');
    const entities = new Map((digest?.entities || []).map(e => [e.id, e]));
    const refs = new Set([...slumber.refs, ...[...entities.values()].filter(e => slumberItem(e, slumber)).map(e => e.id)]);
    const locators = new Set(slumber.locators);
    const citedLocator = s => (s.locators || [s.locator]).find(locator => locators.has(locator));
    const scenes = (digest?.scenes || []).filter(s => s.refs?.some(id => refs.has(id)) || citedLocator(s));
    const people = new Map(slumber.people.map(p => [p.id, p]));
    for (const s of scenes) for (const id of s.people || []) {
        const e = entities.get(id);
        if (e?.col === 'people' && !people.has(id)) people.set(id, {id, label: e.label, role: 'Present in a linked scene'});
    }
    const places = [...new Set(scenes.map(s => s.place).filter(Boolean))];
    const route = (label, view, id) => sourceLink(worldId, view, id, label);
    const group = (title, rows, makeRow) => {
        const section = el('section'); section.append(el('h3', title));
        const ul = el('ul');
        for (const row of rows) {const li = el('li'); li.append(...makeRow(row)); ul.append(li);}
        section.append(ul); return section;
    };
    const methods = el('div', null, 'making-item-methods');
    const make = el('section'), use = el('section');
    make.append(el('h3', 'How to make it'), el('p', slumber.ingredients.join(' · ')), list(slumber.make));
    use.append(el('h3', 'How to use it'), el('p', slumber.use));
    methods.append(make, use);
    const connections = el('div', null, 'making-item-connections');
    connections.append(group('People', [...people.values()], p => [entities.has(p.id) ? route(p.label, 'things', p.id) : p.label, ` · ${p.role}`]));
    const placeRecords = places.map(id => [entities.has(id) ? route(entities.get(id).label, 'things', id) : id, ' · linked scene']);
    if (slumber.workshop) {
        const known = books?.[worldId]?.places.some(p => p.id === slumber.workshop);
        placeRecords.push([known ? route('Tingen silver workshop', 'places', slumber.workshop) : 'Tingen silver workshop', ' · OOPS making route']);
    }
    const placeGroup = group('Places', placeRecords, row => row);
    if (!placeRecords.length) placeGroup.append(el('p', 'No linked scene place in this snapshot.'));
    connections.append(placeGroup);
    const sceneGroup = group('Scenes', scenes, s => [route(citedLocator(s) || s.locator || s.id, 'reader-scenes', s.id),
        s.place ? ` · ${entities.get(s.place)?.label || s.place}` : '']);
    if (!scenes.length) {
        const chapters = [...new Set(slumber.locators.map(locator => locator.replace(/ p\d+$/, '')))];
        sceneGroup.append(el('p', 'Source chapters · ' + chapters.join(', ')));
    }
    connections.append(sceneGroup);
    const {game} = slumber;
    const status = game.make && game.use ? (game.upkeep ? (game.upkeepPlayable?'Inscribe and throw are wired in Tingen. Slumber-only upkeep is agent-verified on a synthetic aged-charm workshop through save, reload, Export, Import and later use. The earned Klein route and other charm variants remain unverified.':'Inscribe and throw are wired in Tingen. Slumber-only upkeep has a native binding; its playable receipt is pending.') : 'Inscribe and throw are wired in Tingen. Recharge for unused charms is missing.')
        : game.make ? 'Inscription is wired. Throwing and its sleep effect are missing.' : 'The make-and-use route is missing.';
    const evidence = el('details', null, 'making-item-evidence');
    evidence.append(el('summary', 'Source references and upkeep'), el('p', slumber.upkeep), list(slumber.locators));
    if(game.upkeepVerification){const reference=el('p');reference.append(sourceLink(worldId,'reading','tracked:RA21','Open upkeep source check and gameplay qualification'));evidence.append(reference);}
    const effect = el('section'); effect.append(el('h3', 'What it does'), el('p', slumber.effect));
    record.append(el('h2', slumber.label), effect, methods, connections, el('p', 'In OOPS · ' + status, 'making-item-status'), evidence);
    parent.append(record);
}

// A world's Making tree. Overview: raw materials, intermediates and products ranked by how many workings touch them.
// Focus an item: workings that make it (left, with their inputs) and workings that use it (right, with their products).
export async function makingView(shared) {
    const {main, data, controls, finder, list, button, closeCanvas, worldId, game, focus, kind} = shared;
    main.replaceChildren();
    const bar = controls();
    const again = extra => makingView({...shared, ...extra});
    const gameWorld = data.gameMaking?.worlds?.[worldId], candidates = gameWorld?.candidates, slumber = gameWorld?.slumber;
    const candidateHash = '#world/' + worldId + '/making/candidates';
    const candidateTab = candidates ? [['candidates', 'Candidates · ' + candidates.cards.length]] : [];
    let rules, entities = [], title, kinds, digest;
    if (game) {
        if (!data.recipes) {bar.append(el('p', 'No recipe extract in the snapshot.')); return;}
        rules = data.recipes.recipes; title = game === 'yair' ? 'Upstream YAIR recipe book' : 'YAIR-format recipe book in OOPS (crafting_recipes.js)';
        if (game === 'yair') rules = rules.filter(r => r.state !== 'added');
        kinds = [...new Set(rules.map(r => r.kind))];
        bar.append(el('small', `${data.recipes.oops} OOPS recipes (component recipes count once per material) · ${data.recipes.upstream} upstream · ${data.recipes.recipes.filter(r => r.state === 'added').length} added by OOPS · read statically from ${data.recipes.source} · not drawn here: the making domain (craft_resolver, cast making), LOTM brewing and charms, HP brewing, Gu refinement, native material catalogues`));
    } else {
        const d = digest = await readerDigest(worldId);
        if (!bar.isConnected) return;
        const showSlumber = slumber && (focus === slumber.id || d?.entities.some(e => e.id === focus && slumberItem(e, slumber)));
        if (showSlumber || (slumber && !d?.rules.length && focus !== 'candidates')) {
            if (d?.rules.length) bar.append(button('Back to Making', () => {location.hash = `world/${worldId}/making`;}));
            const sheet = el('article', null, 'sheet making-item-sheet');
            slumberRecord({parent: sheet, slumber, digest, worldId, books: data.books, list});
            main.append(sheet); return;
        }
        if (!d?.rules.length) {
            bar.append(el('p', 'No reader workings in this snapshot. Rebuild after collecting the world’s reader files.'));
            if (candidates) candidateView({main, candidates, list});
            return;
        }
        if (slumber) {
            const open = el('a', slumber.label); open.href = `#world/${worldId}/making/${slumber.id}`; bar.append(open);
        }
        entities = d.entities; kinds = MAKING; title = worldTitle(worldId) + ' · making';
        const links = gameWorld?.byRule || {};
        rules = rulesFor(d, MAKING).map(r => ({...r, game: links[r.id] || [],
            gameState: r.id === candidates?.readerId && !links[r.id]?.length ? 'review' : ruleState(links[r.id])}));
        const ruleIds = new Set(d.rules.map(r => r.id)), entityIds = new Set(d.entities.map(e => e.id));
        const stale = Object.keys(links).filter(id => !ruleIds.has(id) && !entityIds.has(id));
        const n = st => rules.filter(r => r.gameState === st).length;
        bar.append(el('small', `In the game: ${n('playable')} playable, ${n('bound')} native bindings awaiting proof, ${n('recorded')} recorded in source tables only, ${n('absent')} not in the game` +
            (n('review') ? ` · ${n('review')} citation to review` : '') +
            (stale.length ? ` · ${stale.length} game citations are missing from this reader digest (${stale.slice(0, 4).join(', ')}${stale.length > 4 ? '…' : ''})` : '') +
            (data.gameMaking ? '' : ' · no game-making extract in the snapshot')));
        const refs = rules.flatMap(r => [...r.inputs, ...r.products]);
        bar.append(el('small', `${rules.length} workings the readers recorded (crafts, potions, rites, spells) · ${rules.filter(r => r.inputs.length && r.products.length).length} name both inputs and products · ${Math.round(100 * refs.filter(x => x.matched).length / Math.max(1, refs.length))}% of their items match a census entry; the rest are hatched`));
    }
    const selectedWorking = focus?.startsWith('working:') && rules.find(r => workingFocus(r.id) === focus);
    if (selectedWorking) {
        bar.append(sourceLink(worldId, 'making', '', 'Back to Making'));
        openWorking(main, selectedWorking, worldId, list, entities);
        return;
    }
    const showCandidates = !!candidates && (kind === 'candidates' || focus === 'candidates');
    tabs(main, [[null, 'All · ' + rules.length], ...candidateTab, ...kinds.map(k => [k, `${k} · ${rules.filter(r => r.kind === k).length}`]),
        ...(game ? [] : GAME_TABS.filter(([k]) => k !== '@review' || rules.some(r => r.gameState === 'review'))
            .map(([k, l]) => [k, `${l} · ${rules.filter(r => r.gameState === k.slice(1)).length}`]))],
        showCandidates ? 'candidates' : kind || null, k => {
            if (k === 'candidates') {location.hash = candidateHash; return;}
            if (focus === 'candidates') history.replaceState(null, '', '#world/' + worldId + '/making');
            again({kind: k, focus: null});
        });
    if (showCandidates) {
        const reader = rules.find(r => r.id === candidates.readerId);
        candidateView({main, candidates, reader, list, treeHash: reader?.inputs.some(x => x.id === candidates.materialId)
            ? '#world/' + worldId + '/making/' + encodeURIComponent(candidates.materialId) : null});
        return;
    }
    const shown = kind?.startsWith('@') ? rules.filter(r => r.gameState === kind.slice(1)) : kind ? rules.filter(r => r.kind === kind) : rules;
    const items = itemIndex(shown, entities), ruleById = new Map(shown.map(r => [r.id, r]));
    finder(bar, [...items.values()].map(it => ({...it, label: it.label})), it => again({focus: it.id}));
    const itemBox = (it, extra = {}) => ({id: 'i:' + it.id, label: `${it.label} · ${it.madeBy.length}↑ ${it.usedIn.length}↓`, w: 200, h: 50,
        group: it.matched ? ROLE_GROUP[role(it)] : 'unknown', marks: [], ...extra});
    const ruleBox = (r, extra = {}) => ({id: 'r:' + r.id, label: r.name, w: 200, h: 50,
        group: game ? r.state : {absent: 'law', review: 'partial'}[r.gameState] || r.gameState, marks: [], ...extra});
    const inspect = (id, side, select) => {
        if (id.startsWith('r:')) {
            const r = ruleById.get(id.slice(2));
            side.append(el('small', 'Working'), el('h2', r.name), ruleFacts(r, list));
            side.append(workingLink(r, worldId));
            if (r.id === candidates?.readerId) {
                const open = el('a', 'Review charm candidates');
                open.href = candidateHash;
                side.append(open);
            }
            for (const x of [...r.inputs, ...r.products]) side.append(button('Center on ' + x.label, () => again({focus: x.id})));
            return;
        }
        const it = items.get(id.slice(2));
        if (slumberItem(it, slumber)) {
            slumberRecord({parent: side, slumber, digest, worldId, books: data.books, list});
            return;
        }
        itemRecord(side, it, {digest, rules: digest?.rules || rules, worldId, game, data});
        if (focus !== it.id) side.append(button('Center the tree here', () => again({focus: it.id})));
        void select;
    };
    if (focus && items.has(focus)) {
        bar.append(button('All materials', () => again({focus: null})));
        const it = items.get(focus), nodes = [itemBox(it, {x: 0, y: 0, w: 240, h: 60})], edges = [], seen = new Set(['i:' + focus]);
        const add = n => {if (!seen.has(n.id)) {seen.add(n.id); nodes.push(n);}};
        const side = (ids, dir) => {
            const rs = ids.slice(0, 8).map(id => ruleById.get(id));
            let y = -((rs.length - 1) * 70) / 2;
            for (const r of rs) {
                add(ruleBox(r, {x: dir * 440, y}));
                edges.push(dir < 0 ? {from: 'r:' + r.id, to: 'i:' + focus} : {from: 'i:' + focus, to: 'r:' + r.id});
                const next = (dir < 0 ? r.inputs : r.products).filter(x => x.id !== focus).slice(0, 4);
                next.forEach((x, i) => {
                    add(itemBox(items.get(x.id), {x: dir * 880, y: y + (i - (next.length - 1) / 2) * 56, w: 190, h: 46}));
                    edges.push(dir < 0 ? {from: 'i:' + x.id, to: 'r:' + r.id} : {from: 'r:' + r.id, to: 'i:' + x.id});
                });
                y += Math.max(70, next.length * 56 + 14);
            }
            return rs.length < ids.length ? ids.length - rs.length : 0;
        };
        const moreL = side(it.madeBy, -1), moreR = side(it.usedIn, 1);
        const captions = [{label: 'What makes it, from what', x: -660, y: -60 - it.madeBy.slice(0, 8).length * 36}, {label: 'What it goes into, making what', x: 660, y: -60 - it.usedIn.slice(0, 8).length * 36}];
        if (moreL || moreR) captions.push({label: [moreL && `${moreL} more makers`, moreR && `${moreR} more uses`].filter(Boolean).join(' · ') + ' not drawn', x: 0, y: 90});
        boxCanvas({parent: main, title: it.label + ' · making tree', nodes, edges, captions, kind: 'library', initial: 'i:' + focus, close: () => again({focus: null}),
            marks: [{key: 'selected', label: 'Selected'}], select: inspect});
        return;
    }
    const all = [...items.values()];
    const rank = (r, key) => all.filter(it => role(it) === r).sort((a, b) => b[key].length - a[key].length || b.madeBy.length + b.usedIn.length - a.madeBy.length - a.usedIn.length);
    const raw = rank('raw', 'usedIn'), mid = rank('intermediate', 'usedIn'), prod = rank('product', 'madeBy');
    const per = 24, nodes = [
        ...grid(raw.slice(0, per).map(it => itemBox(it)), 6, 210, 70, 0),
        ...grid(mid.slice(0, per).map(it => itemBox(it)), 6, 210, 70, 360),
        ...grid(prod.slice(0, per).map(it => itemBox(it)), 6, 210, 70, 720)];
    const captions = [{label: `Raw materials · ${raw.length} (most used first)`, x: 0, y: -46}, {label: `Intermediates · ${mid.length}`, x: 0, y: 314}, {label: `Products · ${prod.length} (most often made first)`, x: 0, y: 674}];
    boxCanvas({parent: main, title, nodes, edges: [], captions, kind: 'library', close: closeCanvas,
        marks: [{key: 'selected', label: 'Selected'}], select: inspect});
}

// A world's Things: census entities by kind, rule families as lists, and services, customs and news.
const TAB_LABEL = {items: 'Items and materials', creatures: 'Creatures', groups: 'Groups and institutions', people: 'People', places: 'Places', documents: 'Documents',
    money: 'Prices and measures', time: 'Clocks and calendars', abilities: 'Powers', order: 'Laws and customs', life: 'Services, customs, news',
    notes: '"Other" rows', fills: 'Fills (proposals)'};
const THING_GROUPS = [
    ['Inhabitants', ['people', 'creatures', 'groups']],
    ['Places and daily life', ['places', 'life', 'money', 'time']],
    ['Things and knowledge', ['items', 'abilities', 'order', 'documents']],
    ['Reader evidence', ['notes', 'fills']],
];

export function readerCreatureShelf({main, data}) {
    const article = el('article', null, 'sheet');
    article.append(el('h2', 'Creatures from the readers'));
    const worlds = (data.findings?.worlds || []).filter(w => w.counts.creatures?.distinct)
        .sort((a, b) => worldTitle(a.world).localeCompare(worldTitle(b.world)));
    const ul = el('ul', null, 'reader-creature-worlds');
    for (const {world, counts} of worlds) {
        const li = el('li');
        const link = sourceLink(world, 'things', 'creatures', worldTitle(world));
        link.append(el('small', String(counts.creatures.distinct)));
        li.append(link); ul.append(li);
    }
    article.append(worlds.length ? ul : el('p', 'No collected creature rows in this snapshot. Rebuild where the reader files are available.'));
    main.append(article);
}

function inspectReaderCreature(side, creature, digest, worldId, library, names) {
    const record = el('section', null, 'reader-creature-record making-item-record');
    const entityLink = id => names.has(id) ? sourceLink(worldId, 'things', id, names.get(id).label) : id;
    const scenes = (digest.scenes || []).filter(s => s.refs?.includes(creature.id));
    const people = [...new Set(scenes.flatMap(s => s.people || []))].filter(id => names.get(id)?.col === 'people');
    const places = [...new Set([...scenes.map(s => s.place), ...(creature.sightings || []).map(s => s.place), ...(creature.places || [])])]
        .filter(id => id && !/^unstated$/i.test(id));
    const section = (title, rows) => {
        if (!rows.length) return;
        const ul = el('ul');
        for (const content of rows) {const li = el('li'); li.append(...content); ul.append(li);}
        record.append(el('h3', title), ul);
    };
    record.append(el('h2', creature.label));
    if (creature.aliases?.length) record.append(el('p', 'Also called ' + creature.aliases.join(', ')));
    const facts = creature.facts || [];
    if (facts.length) section('What the books say', facts.map(f => [f.what, el('small', `${f.label === 'S' ? 'Shown' : 'Stated'} · ${f.locator}`)]));
    else record.append(el('p', 'The readers named this creature. No description is linked here yet.'));
    section('Where it appears', places.map(id => {
        const sightings = (creature.sightings || []).filter(s => s.place === id);
        const evidence = sightings.map(s => [s.status, s.locator].filter(Boolean).join(' · ')).filter(Boolean);
        return [entityLink(id), ...(evidence.length ? [el('small', evidence.join(' / '))] : [])];
    }));
    section('People in linked scenes', people.map(id => [entityLink(id)]));
    section('Scenes', scenes.map(s => [sourceLink(worldId, 'reader-scenes', s.id, s.locator || s.id)]));
    section('Rules mentioning it', digest.rules.filter(r => r.creatures?.includes(creature.id)).map(r => [
        r.col === 'making' ? r.name : sourceLink(worldId, 'things', r.id, r.name),
        ...(r.locator ? [el('small', r.locator)] : []),
    ]));
    const runtime = library?.find(r => r.id === creature.id || r.id === 'kind:' + creature.id);
    record.append(el('p', 'In OOPS · ' + (runtime ? 'A matching game record exists. In-play use is unverified here.'
        : 'No confirmed game link in this snapshot.'), 'making-item-status'));
    const evidence = el('details');
    evidence.append(el('summary', 'Reader reference'), el('p', [creature.id, creature.first, `${creature.seen} reader slices`].filter(Boolean).join(' · ')));
    record.append(evidence); side.append(record);
}

function sourceRecordSection(title, rows, empty) {
    const group = el('section'); group.append(el('h3', title));
    if (rows.length) {
        const ul = el('ul');
        for (const content of rows) {const li = el('li'); li.append(...content); ul.append(li);}
        group.append(ul);
    } else if (empty) group.append(el('p', empty));
    return group;
}

function appendGameEvidence(record, subject, worldId, data) {
    const coverage = subject.coverage || [];
    const direct = (data.gameMaking?.worlds?.[worldId]?.byRule?.[subject.id] || []).filter(link => link.how === 'cited');
    const engine = coverage.some(row => /^(?:runs|expressed)/.test(row.state)), blocked = coverage.some(row => row.state.startsWith('blocked'));
    const status = direct.some(row => row.playable) ? 'A bound game command is linked. Play availability is unverified here.'
        : engine && blocked ? 'Coverage is mixed. See the linked ledger evidence.'
            : engine ? 'Engine support is recorded. Play availability is unverified here.'
                : blocked ? 'Coverage records a blocker. No bound command confirmed.'
                    : direct.length ? 'Game source row linked. No bound command confirmed.'
                        : coverage.length ? 'Coverage entry only. No bound command confirmed.' : 'No confirmed game link in this snapshot.';
    record.append(el('p', 'In OOPS · Snapshot bindings: ' + status, 'making-item-status'));
    const evidence = el('details');
    evidence.append(el('summary', 'Source and coverage references'), el('p', [subject.id, subject.locator || subject.first].filter(Boolean).join(' · ')));
    if ((subject.col === 'order' || isPower(subject)) && ruleEvidenceRows(subject).length) evidence.append(sourceRecordSection('Source evidence', ruleEvidenceRows(subject)));
    if (coverage.length) evidence.append(sourceRecordSection('Coverage ledger', coverage.map(row => [row.state, ...recordCaption([row.ledger, row.test])])));
    record.append(evidence);
}

function groupRecord(side, group, digest, worldId, data, names) {
    const record = el('section', null, 'reader-group-record making-item-record');
    const entity = id => names.has(id) ? sourceLink(worldId, 'things', id, names.get(id).label) : id;
    const own = group.institution;
    const rules = digest.rules.filter(r => r.id !== group.id && r.groups?.includes(group.id));
    const scenes = (digest.scenes || []).filter(s => s.groups?.includes(group.id));
    const places = [...new Set([...(group.places || []), own?.place, ...scenes.map(s => s.place), ...rules.map(r => r.place)])].filter(id => id && id !== 'unstated');
    const people = new Map();
    const add = (id, basis) => {
        if (names.get(id)?.col !== 'people') return;
        if (!people.has(id)) people.set(id, new Set());
        people.get(id).add(basis);
    };
    for (const e of names.values()) for (const tie of e.relations || []) if (tie.with === group.id) {
        add(e.id, [tie.kind || 'Recorded tie', SOURCE_LABEL[tie.label], tie.locator].filter(Boolean).join(' · '));
    }
    for (const r of [own, ...rules]) for (const id of r?.people || []) add(id, 'Named in ' + r.name);
    for (const scene of scenes) for (const id of scene.people || []) add(id, 'Present in a linked scene');
    record.append(el('h2', group.label), el('p', {org: 'Organization', organization: 'Organization', deity: 'Deity', institution: 'Institution'}[group.kind] || 'Group'));
    if (group.aliases?.length) record.append(el('p', 'Also called ' + group.aliases.join(', ')));
    const facts = [...new Map([...(group.facts || []), ...(own?.facts || [])].map(f => [JSON.stringify(f), f])).values()];
    record.append(sourceRecordSection('What it is', facts.map(f => [f.what, ...recordCaption([SOURCE_LABEL[f.label], f.locator])]), 'No sourced description linked here.'));
    record.append(sourceRecordSection('What it does', [...(own?.procedure || []), ...(own?.results || [])].map(r => [r.what,
        ...recordCaption([r.when, SOURCE_LABEL[r.label], r.locator])]), 'No institutional procedure linked here.'));
    if (own?.conditions?.length) record.append(sourceRecordSection('Conditions', own.conditions.map(text => [text])));
    if (people.size) record.append(sourceRecordSection('People and ties', [...people].map(([id, basis]) => [entity(id), ...recordCaption([...basis])])));
    if (places.length) record.append(sourceRecordSection('Places', places.map(id => [entity(id)])));
    if (rules.length) record.append(sourceRecordSection('Related rules and workings', rules.map(r => [workingLink(r, worldId), ...recordCaption([r.locator])])));
    if (scenes.length) record.append(sourceRecordSection('Linked scenes', scenes.map(s => [sourceLink(worldId, 'reader-scenes', s.id, s.locator || s.id),
        ...recordCaption([names.get(s.place)?.label, s.time])])));
    appendGameEvidence(record, group, worldId, data); side.append(record);
}

function lawRecord(side, rule, worldId, data, names) {
    const record = el('section', null, 'reader-law-record making-item-record');
    const entity = id => names.has(id) ? sourceLink(worldId, 'things', id, names.get(id).label) : id;
    const statement = row => [row.what, ...recordCaption([row.when, SOURCE_LABEL[row.label], row.locator])];
    record.append(el('h2', rule.name), el('p', rule.worldKind || rule.kind));
    record.append(sourceRecordSection('What it sets out', [
        ...(rule.conditions || []).map(text => [text, el('small', 'Condition')]),
        ...(rule.procedure || []).map(statement), ...(rule.results || []).map(statement),
        ...(rule.limits || []).map(text => [text, el('small', 'Limit')]),
    ], 'No rule details linked here.'));
    appendResetRecord(record, rule.resets);
    record.append(sourceRecordSection('Consequences and enforcement', [
        ...(rule.consequences || []).map(c => [c.response || c.trigger, ...(c.by ? [' · ', entity(c.by)] : []),
            ...recordCaption([c.response && c.trigger ? 'When ' + c.trigger : null, SOURCE_LABEL[c.label], c.locator])]),
        ...(rule.enforcement || []).map(e => [e.penalty || 'Enforcement', ...(e.enforcer ? [' · ', entity(e.enforcer)] : []),
            ...recordCaption([e.detection, SOURCE_LABEL[e.label], e.locator])]),
    ], 'No consequences or enforcement linked here.'));
    const linked = [...new Set([...(rule.people || []), ...(rule.groups || []), rule.place].filter(Boolean))];
    if (linked.length) record.append(sourceRecordSection('Connected records', linked.map(id => [entity(id)])));
    appendGameEvidence(record, rule, worldId, data); side.append(record);
}

function powerRecord(side, power, digest, worldId, data, names) {
    const record = el('section', null, 'reader-power-record making-item-record');
    const entity = id => names.has(id) ? sourceLink(worldId, 'things', id, names.get(id).label) : id;
    const events = (digest.scenes || []).filter(s => s.powers?.includes(power.id));
    const actors = [...new Set([...(power.people || []), ...(power.creatures || [])])];
    const places = [...new Set([power.place, ...events.map(s => s.place)].filter(Boolean))];
    const noteRows = rows => (rows || []).map(r => [r.what, ...recordCaption([r.when, SOURCE_LABEL[r.label], r.locator])]);
    record.append(el('h2', power.name), el('p', power.worldKind || (power.kind === 'spell' ? 'Spell' : 'Ability')));
    record.append(sourceRecordSection('What it does', noteRows(power.results), 'No outcome linked here yet.'));
    record.append(sourceRecordSection('How it’s used', [
        ...(power.conditions || []).map(condition => [condition, el('small', 'Condition')]),
        ...noteRows(power.procedure), ...power.inputs.map(x => [names.has(x.id) ? sourceLink(worldId, 'things', x.id, materialText(x)) : materialText(x), el('small', 'Input'), ...materialEvidence(x)]),
        ...(power.ritual ? [['Requires a ritual']] : []),
    ], 'No procedure linked here yet.'));
    const learning = learningRows(power.acquisition, entity);
    record.append(sourceRecordSection('How it’s learned', learning, 'No learning route linked here yet.'));
    const costs = (power.costs || []).map(c => [[c.amount, c.unit, c.what].filter(x => x != null && x !== '').join(' '),
        ...recordCaption([SOURCE_LABEL[c.label], c.locator])]);
    if (!costs.length && power.costStated === 'stated-free') costs.push(['The source states there is no cost.']);
    if (power.minutes != null) costs.push([`${power.minutes} min`]);
    record.append(sourceRecordSection('Costs and limits', [...costs, ...(power.limits || []).map(text => [text])], 'No costs or limits linked here yet.'));
    if (actors.length) record.append(sourceRecordSection('People and creatures', actors.map(id => [entity(id)])));
    if (places.length) record.append(sourceRecordSection('Places', places.map(id => [entity(id)])));
    if (events.length) record.append(sourceRecordSection('Linked scenes', events.map(s => [sourceLink(worldId, 'reader-scenes', s.id, s.locator || s.id),
        ...recordCaption([names.get(s.place)?.label, s.time])])));
    if (power.kind === 'spell') record.append(sourceLink(worldId, 'making', workingFocus(power.id), 'Open in Making'));
    appendGameEvidence(record, power, worldId, data); side.append(record);
}

function peopleWithCast(digest, pack) {
    if (!pack?.people?.length) return digest;
    const d = digest ?? {entities: [], counts: {}, rules: [], scenes: [], shards: 0, life: [], notes: [], fills: []};
    const entities = new Map(d.entities.map(p => [p.id, p]));
    for (const p of pack.people) {
        const reader = entities.get(p.indexId) ?? entities.get(p.id);
        const id = reader?.id ?? p.indexId ?? p.id;
        entities.set(id, {...reader, id, label: reader?.label || p.name, col: 'people', kind: 'person', seen: reader?.seen ?? 0, cast: p});
    }
    const distinct = [...entities.values()].filter(e => e.col === 'people').length;
    return {...d, entities: [...entities.values()], counts: {...d.counts, people: {...d.counts.people, distinct}}};
}

function inspectReaderPerson(side, person, digest, worldId, data, names) {
    const cast = person.cast, ids = new Set([person.id, cast?.id, cast?.indexId].filter(Boolean));
    const packPlaces = data.books?.[worldId]?.places || [];
    const byPlace = new Map(packPlaces.map(p => [p.id, p]));
    const link = id => names.has(id) ? sourceLink(worldId, 'things', id, names.get(id).label) : id;
    const placeLink = id => byPlace.has(id) ? sourceLink(worldId, 'places', id, byPlace.get(id).name) : link(id);
    const scenes = (digest.scenes || []).filter(s => s.people?.some(id => ids.has(id)));
    const annotate = details => details.filter(Boolean).length ? [el('small', details.filter(Boolean).join(' · '))] : [];
    const time = value => Number.isFinite(value) ? `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}` : value;
    const window = slot => [time(slot.from), time(slot.to)].filter(Boolean).join('–');
    const activities = [...new Set((person.routine || []).map(r => r.what).filter(Boolean))];
    const routines = (person.routine || []).filter(r => r.place || r.from || r.to || r.days || r.recurrence || r.until).map(r => [
        r.place ? placeLink(r.place) : 'Place unstated', ...annotate(['Reader routine', r.what, r.days || r.recurrence, window(r), r.until ? 'Until ' + r.until : null, peopleEvidenceLabel(r.label), r.locator]),
    ]);
    const castSlots = (cast?.meetings || []).map(r => [placeLink(r.place), ...annotate([
        r.kind === 'schedule' ? 'Game schedule' : `Cast ${r.kind}`, r.day != null ? `Day ${r.day}` : r.days, r.recurrence, window(r), r.locator,
    ])]);
    const seenPlaces = [...new Set([...(person.places || []), ...scenes.map(s => s.place)].filter(id => id && !/^unstated$/i.test(id)))];
    const sightings = seenPlaces.map(id => {
        const times = [...new Set(scenes.filter(s => s.place === id).map(s => s.time).filter(Boolean))];
        return [placeLink(id), ...annotate([times.length ? 'Seen at ' + times.join(', ') : 'Recorded here'])];
    });
    const ties = (person.relations || []).map(r => [link(r.with), ...annotate([r.kind, r.attitude, r.since, r.basis ? 'Basis: ' + r.basis : null, peopleEvidenceLabel(r.label), r.locator])]);
    const actionIndex = data.personActions?.[worldId] || {};
    const actions = new Map([...ids].flatMap(id => Object.hasOwn(actionIndex, id) ? actionIndex[id] : []).map(a => [a.id, a.label]));
    const registered = data.library?.some(p => p.group === 'Individuals' && ids.has(p.id));
    const status = [cast ? 'In the cast pack.' : registered ? 'Registered person.' : null,
        actions.size ? `${actions.size} bound ${actions.size === 1 ? 'interaction' : 'interactions'}.` : null,
        cast?.meetings?.some(r => r.kind === 'schedule') ? 'Game schedule recorded.' : 'In-play whereabouts unverified here.'];
    const record = el('section', null, 'reader-person-record making-item-record');
    record.append(el('h2', person.label));
    if (person.aliases?.length) record.append(el('p', 'Also called ' + person.aliases.join(', ')));
    record.append(sourceRecordSection('Who they are', (person.facts || []).map(f => [f.what, ...annotate([f.label === 'S' ? 'Shown' : 'Stated', f.locator])]),
        cast ? 'Named in the cast pack.' : 'No sourced description linked yet.'));
    record.append(sourceRecordSection('What they do', [
        ...activities.map(text => [text]),
        ...digest.rules.filter(r => r.people?.some(id => ids.has(id))).map(r => [r.col === 'making' ? r.name : sourceLink(worldId, 'things', r.id, r.name),
            ...annotate(['Rule mentions them', r.locator])]),
        ...[...actions.values()].map(label => [label, el('small', 'Bound interaction in OOPS')]),
    ], 'No activities linked yet.'));
    record.append(sourceRecordSection('Where and when', [...routines, ...castSlots, ...sightings], 'No place or time linked yet.'));
    record.append(sourceRecordSection('Ties', ties, 'No relationships linked yet.'));
    record.append(...personReaderDetailSections(person, {el, section: sourceRecordSection, link, matched: id => names.has(id)}));
    const castScenes = cast ? packPlaces.flatMap(p => (p.scenes || []).filter(s => s.actor === cast.id && ['beat', 'anchor'].includes(s.kind))
        .map(s => [placeLink(p.id), ...annotate(['Cast scene', s.locator, s.day != null ? `Day ${s.day}` : null])])) : [];
    const linked = sourceRecordSection('Linked scenes', [...scenes.slice(0, 8).map(s => [sourceLink(worldId, 'reader-scenes', s.id, s.locator || s.id),
        ...annotate([names.get(s.place)?.label, s.time])]), ...castScenes.slice(0, 8)], 'No scenes linked yet.');
    if (scenes.length) {
        const line = el('p'); line.append(sourceLink(worldId, 'reader-scenes', person.id, `Browse ${scenes.length} linked scene${scenes.length === 1 ? '' : 's'}`));
        linked.append(line);
    }
    record.append(linked, el('p', 'In OOPS · ' + (cast || registered || actions.size ? status.filter(Boolean).join(' ') : 'No confirmed game link in this snapshot.'), 'making-item-status'));
    const evidence = el('details');
    evidence.append(el('summary', 'Source references'), el('p', [person.id, person.first || cast?.locator].filter(Boolean).join(' · ')));
    record.append(evidence); side.append(record);
}

export function inspectReaderPlace(parent, place, digest, worldId, data, selectedCast) {
    const pack = data.books?.[worldId], cast = selectedCast ?? pack?.places.find(p => p.id === place.id || p.indexId === place.id);
    const ids = new Set([place.id, cast?.id, cast?.indexId, place.indexId].filter(Boolean));
    const names = new Map((digest?.entities || []).map(e => [e.id, e]));
    const entityLink = id => names.has(id) ? sourceLink(worldId, 'things', id, names.get(id).label) : id;
    const scenes = (digest?.scenes || []).filter(s => ids.has(s.place));
    const services = (digest?.life || []).filter(r => r.kind === 'services' && ids.has(r.at));
    const people = new Map();
    const addPerson = (id, detail, label = id) => {
        if (!people.has(id)) people.set(id, {id, label, details: new Set()});
        people.get(id).details.add(detail);
    };
    for (const e of names.values()) if (e.col === 'people') {
        for (const slot of e.routine || []) if (ids.has(slot.place)) {
            const time = [slot.days ?? slot.recurrence, [slot.from, slot.to].filter(Boolean).join('–')].filter(Boolean).join(' · ');
            addPerson(e.id, ['Routine', slot.what, time].filter(Boolean).join(' · '));
        }
        if (e.places?.some(id => ids.has(id))) addPerson(e.id, 'Recorded here');
    }
    for (const scene of scenes) for (const id of scene.people || []) if (names.get(id)?.col === 'people') addPerson(id, 'Seen in a linked scene');
    const castPeople = new Map((pack?.people || []).map(p => [p.id, p]));
    const castIds = new Set([...castPeople.values()].flatMap(p => [p.id, p.indexId]).filter(Boolean));
    for (const entry of cast?.people || []) {
        const person = castPeople.get(entry.id);
        addPerson(person?.indexId || entry.id, `Cast record · ${entry.how}`, person?.name || entry.id);
    }
    const actionIndex = data.placeActions?.[worldId] || {};
    const actions = new Map([...ids].flatMap(id => Object.hasOwn(actionIndex, id) ? actionIndex[id] : []).map(a => [a.id, a.label]));
    const native = data.others?.find(p => ids.has(p.id));
    const detailed=new Map(activitiesForPlace([...ids],worldId,data).map(action=>[action.id,action]));
    for(const action of detailed.values())actions.set(action.id,action.label);
    const registered = [...(native?.activities || []).map(label => [label, 'Registered activity']),
        ...(native?.stations || []).map(label => [label, 'Registered work station'])];
    const hasGame = !!(cast || native || actions.size);
    const where = cast?.district ? 'On the world walk.' : cast && pack?.places.some(p => p.district) ? 'A walk route is missing.'
        : cast ? 'In the cast pack.' : native ? 'Registered location.' : '';
    const game = hasGame ? [where, actions.size ? `${actions.size} bound local ${actions.size === 1 ? 'action' : 'actions'}.`
        : registered.length ? 'Local features are registered. Access is unverified.' : 'Local actions are unverified here.',
        actions.size && place.affordances?.length ? 'Book actions have no verified game match here.' : null].filter(Boolean).join(' ')
        : 'No matching game place or actions in this snapshot.';
    const formatPrice = amount => amount?.value != null ? [amount.value, amount.unit, amount.per].filter(x => x != null && x !== '').join(' ') : null;
    const prices = new Map(), shownPriceIds = new Set();
    for (const s of services) {
        if (s.priceStated === 'not-mentioned') continue;
        const value = s.priceStated === 'stated-free' ? 'Free' : formatPrice(s.amount) || s.price || formatPrice(names.get(s.priceId)?.amount);
        if (value) {
            prices.set(`${s.what} · ${value}`, s.locator || names.get(s.priceId)?.first);
            if (s.priceId) shownPriceIds.add(s.priceId);
        }
    }
    for (const e of names.values()) if (e.kind === 'price' && e.places?.some(id => ids.has(id)) && formatPrice(e.amount)) {
        if (!shownPriceIds.has(e.id)) prices.set(`${e.label} · ${formatPrice(e.amount)}`, e.first);
    }
    const record = el('section', null, 'reader-place-record making-item-record');
    const section = sourceRecordSection;
    const citation = locator => locator ? [el('small', locator)] : [];
    record.append(el('h2', place.label ?? cast?.name ?? place.id));
    if(place.nativeBindingOnly)record.append(el('p',place.locationNote+' '+(native?'This exact location ID is registered in the adopted map.':'This exact location ID is absent from the adopted registered map.')));
    if (place.within) {
        const within = el('p'); within.append('Inside ', entityLink(place.within)); record.append(within);
    }
    const localRows=[...actions].map(([id,label])=>{
        const action=detailed.get(id);
        if(!action)return [label,el('small','Bound in OOPS; access not checked here')];
        const context=action.sources.map(id=>digest?.rules.find(rule=>rule.id===id)).filter(Boolean);
        return [label,el('small','Bound native action · '+(action.minutes? action.minutes+' min':'Instant attempt')),action.description,
            el('small',action.costText),el('small',action.boundary),
            ...(action.conditions?.length?[el('small','Possible blockers: '+action.conditions.join(' '))]:[]),
            ...context.map(rule=>sourceLink(worldId,'things',rule.id,'Open source context: '+rule.name)),
            el('small',action.locators.join(' · '))];
    });
    const what = section('What you can do here',[...localRows,...registered.map(([label,state])=>[label,el('small',state)])],null);
    if(detailed.size){
        const summary=detailed.values().next().value;
        what.append(el('p',summary.verificationText),el('p',summary.geographyNote));
        for(const link of summary.related||[]){const a=el('a',link.label);a.href=link.href;const line=el('p');line.append(a);what.append(line);}
        const receipt=el('a',summary.verification.receiptLabel||'Read the native gameplay receipt');receipt.href=summary.verification.receiptHref;
        const line=el('p');line.append(receipt);what.append(line);
        if(summary.verification.handoffId){const handoff=el('a',summary.verification.handoffLabel||'Open reading handoff and reports');handoff.href='#workbench/handoffs/'+summary.verification.handoffId;what.append(handoff);}
        what.append(activityHandoffs(worldId,summary));
        if(!digest?.rules.length)what.append(el('p','No admitted source-reading records accompany these native actions. The gameplay receipt is implementation evidence, not novel-reading coverage.'));
    }
    if (place.affordances?.length) {
        const bookActions = section('In the books', place.affordances.map(a => [a.what,
            ...(a.needs?.length ? [el('small', 'Needs ' + a.needs.map(id => names.get(id)?.label || id).join(', '))] : []), ...citation(a.locator)]));
        bookActions.className = 'reader-place-source-actions'; what.append(bookActions);
    } else if (!actions.size && !registered.length) what.append(el('p', 'No actions linked here yet.'));
    record.append(what);
    record.append(section('Who’s around', [...people.values()].map(p => [names.has(p.id) ? entityLink(p.id)
        : castIds.has(p.id) ? sourceLink(worldId, 'people', p.id, p.label) : p.label,
        el('small', [...p.details].join(' / '))]), 'No people linked here yet.'));
    const hours = place.hourRecords?.length ? place.hourRecords.map(h => [h.hours, ...citation(h.locator)]) : place.hours ? [[place.hours]] : [];
    record.append(section(place.accessRecords?.length ? 'Hours' : 'Hours and access',
        [...hours, ...(place.accessRecords?.length ? [] : place.access || []).map(access => [access])],
        place.accessRecords?.length ? 'Hours are unstated here.' : 'Hours and access are unstated here.'));
    appendPlaceDetails(record, place, {el, section, entityLink});
    record.append(section('Services', services.map(s => [s.what, ...(s.hours ? [el('small', s.hours)] : []), ...citation(s.locator)]), 'No services linked here yet.'));
    record.append(section('Prices', [...prices].map(([price, locator]) => [price, ...citation(locator)]), 'No prices recorded for this place.'));
    record.append(section('Linked scenes', scenes.slice(0, 8).map(s => [sourceLink(worldId, 'reader-scenes', s.id, s.locator || s.id)]),
        cast?.scenes?.length ? `${cast.scenes.length} cast scene records below.` : 'No reader scenes linked here yet.'));
    const scenePlaces = Map.groupBy(scenes, s => s.place);
    for (const [id, rows] of scenePlaces) {
        const label = `Browse ${rows.length} linked scene${rows.length === 1 ? '' : 's'}` + (scenePlaces.size > 1 ? ` · ${names.get(id)?.label || id}` : '');
        const line = el('p'); line.append(sourceLink(worldId, 'reader-scenes', id, label)); record.append(line);
    }
    record.append(el('p', 'In OOPS · ' + game, 'making-item-status'));
    parent.append(record);
}

// Fill provenance stays a proposal even when its basis links to a sourced record.
function readerEvidenceRecord(row, tab, digest, worldId, names, focused, variant = false) {
    const safe = value => typeof value === 'string' && !/(?:file:\/\/|[a-z]:[\\/]|(?:^|\s)\/(?:Users|home|tmp|private|var|mnt)\/|https?:\/\/|(?:^|[\\/])private[\\/])/i.test(value) ? value : null;
    const ref = value => {
        const text = safe(value);
        if (!text) return 'Reference withheld';
        if (names.has(text)) return sourceLink(worldId, 'things', text, names.get(text).label);
        const rule = (digest.rules || []).find(r => r.id === text);
        if (rule) return workingLink(rule, worldId);
        const scene = (digest.scenes || []).find(r => r.id === text);
        if (scene) return sourceLink(worldId, 'reader-scenes', text, scene.locator || text);
        const fill = (digest.fills || []).find(r => r.id === text);
        if (fill) return sourceLink(worldId, 'things', text, safe(fill.what) || 'Authored proposal');
        return text;
    };
    const record = el('details', null, variant ? 'reader-fill-variant' : tab === 'fills' ? 'reader-fill-record' : 'reader-note-record');
    record.open = focused;
    record.append(el('summary', safe(row.what) || 'Reader record'));
    if (tab === 'notes') {
        record.append(sourceRecordSection('About', (row.about || []).filter(safe).map(id => [ref(id)]), 'No subject linked.'));
        const sources = row.sources?.length ? row.sources : [{pass: row.pass, label: row.label, locator: row.locator}];
        record.append(sourceRecordSection('Source references', sources.map(source => [
            [safe(source.pass) ? source.pass + ' pass' : null, SOURCE_LABEL[source.label], safe(source.locator), safe(source.shard)].filter(Boolean).join(' · ') || 'No source locator in this older digest.',
        ])));
    } else {
        record.append(el('p', 'Authored proposal. This fill is not a fact from the source.'));
        if (!variant && row.variants?.length > 1) {
            record.append(el('p', `${row.variants.length} distinct recorded variants share this fill ID. Each retains its own provenance and reader slices.`));
            for (const value of row.variants) record.append(readerEvidenceRecord(value, tab, digest, worldId, names, false, true));
            return record;
        }
        record.append(el('p', [safe(row.kind), safe(row.layer), safe(row.confidence) ? row.confidence + ' confidence' : null].filter(Boolean).join(' · ')));
        record.append(el('p', 'Recorded status: ' + (safe(row.status) || 'not retained in this older digest')));
        record.append(sourceRecordSection('Gap it fills', row.for && safe(row.for) ? [[ref(row.for)]] : [], 'The target was not retained in this older digest.'));
        record.append(sourceRecordSection('Basis for the proposal', (row.basis || []).filter(safe).map(value => [ref(value)]), 'No basis retained in this digest.'));
        record.append(sourceRecordSection('What it must respect', (row.respects || []).filter(safe).map(value => [ref(value)]), 'No constraints retained in this digest.'));
        record.append(sourceRecordSection('What could replace it', row.replaceableBy && safe(row.replaceableBy) ? [[ref(row.replaceableBy)]] : [], 'No replacement condition retained in this digest.'));
        if (row.shards?.length) record.append(el('small', 'Reader slices: ' + row.shards.filter(safe).join(', ')));
    }
    return record;
}

export async function thingsView(shared) {
    const {main, data, controls, finder, list, button, closeCanvas, worldId, focus} = shared;
    main.replaceChildren();
    const bar = controls();
    const loading = focus ? el('p', 'Loading the selected subject record…') : null;
    if (loading) {
        loading.setAttribute('role', 'status');
        loading.dataset.subjectLoading = '';
        bar.append(loading);
    }
    const d = nativePlaceDigest(peopleWithCast(await readerDigest(worldId), data.books?.[worldId]),worldId,data);
    // A different route owns main after navigation; the pending request stays detached.
    if (!bar.isConnected) return;
    loading?.remove();
    if (!d) {
        if (focus) bar.append(el('p', 'The selected subject record could not be loaded.'),
            button('Retry subject record', () => thingsView(shared)));
        else bar.append(el('p', 'No reader rows for this world yet. Its readers have not run, or the snapshot is older than the build.'));
        return;
    }
    if(d.nativeOnly)bar.append(el('p','No reader rows for this world are admitted in this snapshot. Native activity locations below come from the game definitions and do not add source-reading coverage.'));
    const names = new Map(d.entities.map(e => [e.id, e]));
    for (const r of d.rules) if (r.kind === 'institution') {
        const census = names.get(r.id);
        if (!census || census.col === 'groups') names.set(r.id, {...census, id: r.id, label: census?.label || r.name,
            kind: 'institution', col: 'groups', seen: Math.max(census?.seen || 0, r.seen || 0), institution: r,
            locator: r.locator, coverage: r.coverage || census?.coverage});
    }
    const institutions = [...names.values()].filter(e => e.col === 'groups');
    const powers = d.rules.filter(isPower);
    const order = d.rules.filter(r => r.col === 'order' && r.kind !== 'institution');
    const counts = {abilities: powers.length, groups: institutions.length, order: order.length};
    const count = key => counts[key] ?? d.counts[key]?.distinct ?? 0;
    const available = THING_GROUPS.flatMap(([, keys]) => keys).filter(key=>count(key)||(key==='places'&&(data.placeActivities?.[worldId]||[]).length));
    if (!available.length) {bar.append(el('p', 'No Things records in this snapshot.')); return;}
    const focusedRule = d.rules.find(r => r.id === focus && (isPower(r) || r.col === 'order'));
    const focusedFill = (d.fills || []).some(r => r.id === focus);
    const indexRef = /^(life|note):(ref-[a-f0-9]{64}|\d+)$/.exec(focus || '');
    const records = indexRef?.[1] === 'note' ? d.notes : d.life;
    const selectedRecord = indexRef && (indexRef[2].startsWith('ref-') ?
        records?.find(row => row.focusKey === focus) : records?.[Number(indexRef[2])]);
    const focusedNote = indexRef?.[1] === 'note' && selectedRecord;
    const dailyRecord = indexRef?.[1] === 'life' && selectedRecord;
    const focusedLife = dailyRecord && publicLifeRow(dailyRecord) ? dailyRecord : null;
    if (indexRef && !focusedNote && !focusedLife) {
        bar.append(el('p', 'This reading record is unavailable in the current snapshot.'),
            sourceLink(worldId, 'things', indexRef[1] === 'note' ? 'notes' : 'life', 'Browse related records'));
        return;
    }
    const tab = shared.tab ?? names.get(focus)?.col ?? (focusedRule && isPower(focusedRule) ? 'abilities' : focusedRule?.col) ??
        (focusedNote ? 'notes' : focusedLife ? 'life' : focusedFill ? 'fills' : available.includes(focus) ? focus : available.includes('items') ? 'items' : available[0]);
    const again = extra => thingsView({...shared, ...extra});
    const groups = el('div', null, 'atlas-thing-groups');
    for (const [label, kinds] of THING_GROUPS) {
        const options = kinds.filter(key => available.includes(key)).map(key => [key, `${TAB_LABEL[key]} · ${count(key)}`]);
        if (!options.length) continue;
        const section = el('section'); section.append(el('h2', label));
        tabs(section, options, tab, t => again({tab: t, focus: null}), label);
        groups.append(section);
    }
    main.append(groups);
    bar.append(el('small', `${d.shards} reader ${d.shards === 1 ? 'shard' : 'shards'}`));
    const making = rulesFor(d, MAKING), uses = itemIndex(making, d.entities);
    if (tab === 'life') {
        const article = el('section', null, 'sheet reader-life'), tools = el('nav'), search = el('input'), kind = el('select');
        if (focusedLife) bar.append(sourceLink(worldId, 'things', 'life', 'All daily life records'));
        search.type = 'search'; search.setAttribute('aria-label', 'Search daily life'); search.placeholder = 'Search services, customs, news or sources';
        kind.setAttribute('aria-label', 'Daily life kind');
        for (const [value, title] of [['', 'All daily life'], ['services', 'Services'], ['customs', 'Customs'], ['news', 'News']]) {
            const option = el('option', title); option.value = value; kind.append(option);
        }
        const rowsHost = el('div', null, 'reader-life-rows'), pager = el('nav'), status = el('output');
        pager.setAttribute('aria-label', 'Daily life pages');
        let offset = 0;
        const previous = button('Previous', () => {offset -= 30; render();}), next = button('Next', () => {offset += 30; render();});
        pager.append(previous, status, next); tools.append(search, kind); article.append(el('h2', 'Services, customs and news'), tools, rowsHost, pager); main.append(article);
        const named = id => names.has(id) ? sourceLink(worldId, 'things', id, names.get(id).label) : id;
        function render() {
            const page = lifePage(focusedLife ? [focusedLife] : d.life || [], {query: search.value, kind: kind.value, offset, names: new Map([...names].map(([id, row]) => [id, row.label]))});
            offset = page.offset; rowsHost.replaceChildren();
            for (const row of page.rows) {
                const record = el('article', null, 'reader-life-record'); record.dataset.lifeKind = row.kind;
                record.append(el('h3', row.what), el('small', {services: 'Service', customs: 'Custom', news: 'News'}[row.kind] || row.kind));
                if (row.at && !['private', 'public'].includes(row.at)) {const at = el('p'); at.append('At ', named(row.at)); record.append(at);}
                if (row.kind === 'services') {
                    record.append(el('p', [row.serviceKind ? 'Kind: ' + row.serviceKind : null, lifePrice(row), row.hours].filter(Boolean).join(' · ')));
                    if (row.priceId) {const price = el('p'); price.append('Price record: ', named(row.priceId)); record.append(price);}
                }
                if (row.kind === 'news') {
                    if (row.date) record.append(el('p', 'Date: ' + row.date));
                    if (row.carriedBy) {const carrier = el('p'); carrier.append('Carried by ', named(row.carriedBy)); record.append(carrier);}
                    record.append(el('small', row.scope === 'public' || row.at === 'public' ? 'Public news' : 'Scope not retained in this older digest'));
                }
                const sources = row.sources?.length ? row.sources : [{label: row.label, locator: row.locator}];
                const evidence = el('div', null, 'reader-life-sources');
                for (const source of sources) {
                    const line = el('p');
                    if (SOURCE_LABEL[source.label]) line.append(SOURCE_LABEL[source.label] + ' · ');
                    if (source.locator) line.append(sourceLink(worldId, 'reader-scenes', source.locator, source.locator));
                    else line.append('No locator retained in this older digest');
                    if (source.shard) line.append(' · ' + source.shard);
                    evidence.append(line);
                }
                record.append(evidence); rowsHost.append(record);
            }
            if (!page.total) rowsHost.append(el('p', 'No matching daily life records.'));
            status.textContent = page.total ? `${offset + 1}–${Math.min(offset + 30, page.total)} of ${page.total}` : '0 records';
            previous.disabled = offset === 0; next.disabled = offset + 30 >= page.total;
        }
        search.addEventListener('input', () => {offset = 0; render();}); kind.addEventListener('change', () => {offset = 0; render();}); render();
        return;
    }
    if (tab === 'notes' || tab === 'fills') {
        // Loose facts ("other" rows, grouped by the pass that wrote them) and fills (proposals, grouped by layer). Lists, not boxes: they have no shape to draw.
        const article = el('article', null, 'sheet');
        const rows = (tab === 'notes' ? d.notes : d.fills) || [], total = tab === 'notes' ? d.notesTotal : d.fillsTotal;
        article.append(el('p', tab === 'notes' ? 'Facts the readers kept that fit no row shape, tied to the things they are about. Deduplicated by wording.'
            : 'Fills are authored proposals the readers made to bridge a gap (invented or implied), not facts from the text. Each names what it must respect and what could replace it.'));
        const search = el('input'); search.type = 'search'; search.placeholder = 'Search ' + tab;
        search.setAttribute('aria-label', 'Search ' + tab); bar.append(search);
        const results = el('div'), navigation = el('nav'); navigation.setAttribute('aria-label', tab + ' pages');
        let page = Math.max(0, Math.floor(rows.findIndex(row => row === focusedNote || row.id === focus) / 100));
        const render = () => {
            const query = search.value.trim().toLocaleLowerCase();
            const filtered = query ? rows.filter(row => JSON.stringify(row).toLocaleLowerCase().includes(query)) : rows;
            const pages = Math.max(1, Math.ceil(filtered.length / 100)); page = Math.min(page, pages - 1);
            results.replaceChildren(); navigation.replaceChildren();
            for (const [k, group] of Map.groupBy(filtered.slice(page * 100, (page + 1) * 100), row => tab === 'notes' ? row.pass : row.layer || 'unstated')) {
                const det = el('details'); det.open = true;
                det.append(el('summary', `${tab === 'notes' ? k + ' pass' : k} · ${group.length} on this page`));
                for (const row of group) det.append(readerEvidenceRecord(row, tab, d, worldId, names, row === focusedNote || row.id === focus));
                results.append(det);
            }
            const previous = button('Previous page', () => {page--; render();}); previous.disabled = page === 0;
            const next = button('Next page', () => {page++; render();}); next.disabled = page === pages - 1;
            navigation.append(previous, el('span', `Page ${page + 1} of ${pages} · ${filtered.length} matching records`), next);
            if (!filtered.length) results.append(el('p', 'No matching records.'));
        };
        search.addEventListener('input', () => {page = 0; render();}); render();
        article.append(navigation, results);
        if (total > rows.length) article.append(el('small', `${total - rows.length} more kept out of the digest`));
        main.append(article);
        return;
    }
    if (tab === 'abilities' || tab === 'order') {
        const rows = tab === 'abilities' ? powers : order, byId = new Map(rows.map(r => [r.id, r]));
        finder(bar, rows.map(r => ({...r, label: r.name})), r => again({focus: r.id}));
        const shown = byId.has(focus) ? [byId.get(focus), ...rows.filter(r => r.id !== focus)] : rows;
        const nodes = grid(shown.slice(0, MAX).map(r => ({id: r.id, label: r.name, w: 200, h: 50, group: 'law', marks: []})), 6);
        boxCanvas({parent: main, title: worldTitle(worldId) + ' · ' + TAB_LABEL[tab], nodes, edges: [], kind: 'library', close: closeCanvas,
            captions: rows.length > MAX ? [{label: `${rows.length - MAX} more · search to reach them`, x: 0, y: -40}] : [],
            initial: byId.has(focus) ? focus : undefined,
            marks: [{key: 'selected', label: 'Selected'}],
            select(id, side) {
                const r = byId.get(id);
                if (tab === 'abilities') powerRecord(side, r, d, worldId, data, names);
                else lawRecord(side, r, worldId, data, names);
                appendRecordHandoffs(side,{world:worldId,focus:r.id,type:'rule'});
            }});
        return;
    }
    const sourceRows=tab === 'groups' ? institutions : d.entities.filter(e => e.col === tab);
    const rows=tab==='places'?[...sourceRows,...nativeActivityPlaces(worldId,data,sourceRows)]:sourceRows,byId = new Map(rows.map(e => [e.id, e]));
    if(tab==='places'&&rows.length>sourceRows.length)bar.append(el('small',`${sourceRows.length} source place records · ${rows.length-sourceRows.length} native activity location shown separately, without a sourced map placement.`));
    const pick = focus && byId.has(focus) ? [byId.get(focus), ...rows.filter(e => e.id !== focus)] : rows;
    if(tab==='places'){
        const search=el('input');search.type='search';search.placeholder='Find a place or local action';search.setAttribute('aria-label',search.placeholder);
        const found=el('div');bar.append(search,found,el('small','Book actions retain their evidence. Bound local actions are current definitions, not a check of your character’s access or a new map-placement claim.'));
        search.oninput=()=>{
            found.replaceChildren();const query=search.value.trim().toLocaleLowerCase();if(!query)return;
            const matches=rows.filter(place=>placeSearchText(place,worldId,data).includes(query));
            for(const place of matches.slice(0,16))found.append(button(place.label,()=>{location.hash=`world/${worldId}/places/${encodeURIComponent(place.id)}`;}));
            if(!matches.length)found.textContent='No matching places or linked actions.';
            else if(matches.length>16)found.append(el('small','Refine your search for more matches.'));
        };
    }else finder(bar, rows, e => again({focus: e.id}));
    const craftMark = {key: 'craft', icon: 'construction', label: 'Used or made in a working'}, leadMark = {key: 'lead', icon: 'person', label: 'The lead meets it'};
    const nodes = grid(pick.slice(0, MAX).map(e => ({id: e.id, label: e.nativeBindingOnly?e.label:`${e.label} · ${e.seen}`, w: 200, h: 50, group: e.nativeBindingOnly?'unplaced':e.lead ? 'reached' : 'registered',
        marks: [uses.has(e.id) && craftMark, e.lead && leadMark].filter(Boolean)})), 6);
    boxCanvas({parent: main, title: worldTitle(worldId) + ' · ' + TAB_LABEL[tab], nodes, edges: [], kind: 'library', initial: byId.has(focus) ? focus : undefined, close: closeCanvas,
        captions: rows.length > MAX ? [{label: `${rows.length - MAX} more · search to reach them`, x: 0, y: -40}] : [],
        marks: [craftMark, leadMark, {key: 'selected', label: 'Selected'}],
        select(id, side) {
            const e = byId.get(id), u = uses.get(id);
            const renderRecord = () => {
            if (tab === 'items') {
                const slumber = data.gameMaking?.worlds?.[worldId]?.slumber;
                if (slumberItem(e, slumber)) slumberRecord({parent: side, slumber, digest: d, worldId, books: data.books, list});
                else itemRecord(side, e, {digest: d, rules: d.rules, worldId, data});
                if (u) side.append(button('Open its making tree', () => {location.hash = `world/${worldId}/making/${encodeURIComponent(id)}`;}));
                return;
            }
            if (tab === 'creatures') {inspectReaderCreature(side, e, d, worldId, data.library, names); return;}
            if (tab === 'places') {inspectReaderPlace(side, e, d, worldId, data); return;}
            if (tab === 'people') {inspectReaderPerson(side, e, d, worldId, data, names); return;}
            if (tab === 'groups') {groupRecord(side, e, d, worldId, data, names); return;}
            side.append(el('small', `${e.kind}${e.lead ? ' · the lead meets it' : ''}`), el('h2', e.label),
                list([`Mentioned in ${e.seen} slices`, e.first ? 'First mention: ' + e.first : null, e.aliases?.length ? 'Also called: ' + e.aliases.join(', ') : null,
                    e.places?.length ? 'Seen at: ' + e.places.join(', ') : null, e.notes ? `${e.notes} "other" rows about it` : null, 'Id: ' + e.id].filter(Boolean)));
            if (u) {
                side.append(el('h3', 'In workings'), list([...u.madeBy.map(r => 'Made by ' + making.find(x => x.id === r)?.name), ...u.usedIn.map(r => 'Used in ' + making.find(x => x.id === r)?.name)].slice(0, 12)));
                side.append(button('Open its making tree', () => {location.hash = `world/${worldId}/making/${encodeURIComponent(id)}`;}));
            }
            };
            renderRecord();
            appendCensusDetails(side,e,{el,section:sourceRecordSection,entityLink:id=>sourceLink(worldId,'things',id,names.get(id)?.label||id)});
            if(d.entities.some(row=>row.id===e.id))appendRecordHandoffs(side,{world:worldId,focus:e.id,type:'entity'});
            if(e.institution)appendRecordHandoffs(side,{world:worldId,focus:e.id,type:'rule'});
        }});
}
