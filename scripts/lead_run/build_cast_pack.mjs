// Offline pack compiler. Address: book + locator slice + crosswalk ids.
// Budget: linear scans plus relation joins; zero draws, no game-day work.
// Existing host reads retained sections. Loose timing awaits coordinator integration.
import {readFileSync, writeFileSync, mkdirSync, realpathSync, existsSync} from 'node:fs';
import {resolve, dirname, relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import {buildCrosswalk, inSlice, hasTime, routineBand, relativeTiming, matchesRoleHours} from './build_crosswalk.mjs';
const list = v => Array.isArray(v) ? v : [];
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])])) : value;
const json = value => JSON.stringify(canonical(value));
const hash = value => createHash('sha256').update(typeof value === 'string' ? value : json(value)).digest('hex');
const sorted = rows => [...rows].sort((a,b) => json(a).localeCompare(json(b)));
const unique = rows => [...new Map(sorted(rows).map(r => [json(r), r])).values()];
const evidence = row => ({label: ['S','T','I','U','fill'].includes(row.label) ? row.label : 'U', locator: row.locator || row.firstMention});

export function buildCastPack({book, slice, registry, scenes, extras, crosswalk, base, placesOnly = false}) {
    inSlice({locator: slice.from}, slice); // Validate even empty inputs.
    if (crosswalk.world !== book || json(crosswalk.slice) !== json(slice)) throw new Error('Crosswalk world/slice mismatch; rebuild it for this slice');
    const pack = structuredClone(base), conflicts = [], gaps = [];
    const target = id => {
        const v = crosswalk.mapping[id];
        return v?.startsWith('skip:') ? null : v?.replace(/^new:/, '') || null;
    };
    const selectedScenes = scenes.filter(s => s.pov === 'lead' && inSlice(s, slice));
    const selectedExtras = extras.filter(r => inSlice(r, slice));
    const counts = new Map();
    for (const scene of selectedScenes) {
        const ids = new Set([...list(scene.present), ...list(scene.touched).filter(t => ['present','partial'].includes(t.status)).map(t => t.id)]);
        for (const id of ids) counts.set(id, (counts.get(id) || 0) + 1);
    }
    const peopleRows = placesOnly ? [] : extras.filter(r => ['people','people_other'].includes(r.extra) &&
        (inSlice(r,slice) || [...list(r.routine),...list(r.relations)].some(item=>inSlice({locator:item.locator || r.locator},slice))));
    const existing = [...list(base.people), ...list(base.references)];
    const byIndex = new Map(existing.filter(r => r.indexId).map(r => [r.indexId, r.id]));
    const byPlace = new Map(list(base.places).filter(r => r.indexId).map(r => [r.indexId,r.id]));
    for (const a of list(base.placeAliases)) byPlace.set(a.indexId,a.place);
    const personId = id => byIndex.get(id) || target(id) || id;
    const placeId = id => {
        if (byPlace.has(id)) return byPlace.get(id);
        const mapped = crosswalk.places?.[id];
        if (mapped) return byPlace.get(mapped) || target(mapped) || mapped;
        return registry.some(r=>r.id === id && r.kind === 'place') ? target(id) : null;
    };
    const idMap = {...base.idMap};
    for (const r of existing) if (r.indexId && target(r.indexId) && target(r.indexId) !== r.id) idMap[target(r.indexId)] = r.id;
    // Explicit reviewed identity redirects only; aliases/common names never imply a merge.
    for (const r of registry) if (typeof r.same_as === 'string' && target(r.same_as)) idMap[personId(r.id)] = personId(r.same_as);
    const allPersonIds = new Set(existing.map(r => r.id));
    const candidates = placesOnly ? [] : registry.filter(r => r.kind === 'person' && (inSlice(r,slice) || counts.has(r.id) || peopleRows.some(p=>p.id === r.id)));
    const relations = id => peopleRows.filter(r => r.id === id).flatMap(r => list(r.relations).filter(rel => inSlice({locator: rel.locator || r.locator}, slice)));
    const maxCount = Math.max(0,...registry.filter(r=>r.kind === 'person').map(r=>counts.get(r.id)||0));
    for (const row of sorted(candidates)) {
        const id = personId(row.id);
        if (crosswalk.mapping[row.id]?.startsWith('skip:')) continue;
        const n = counts.get(row.id) || 0, rels = relations(row.id);
        const tier = n === maxCount && n >= 10 ? 'principal' : n >= 3 || rels.length >= 2 && n >= 1 ? 'recurring' : n || rels.length || !(row.collective === true || /crowd|group|collective/i.test(row.rung || '')) ? 'role' : 'crowd';
        const generated = {id, indexId: row.id, name: row.label || row.id, tier, leadSceneCount: n, ...evidence(row), locator: row.firstMention || crosswalk.entities[row.id]?.locators?.[0]};
        const old = existing.find(p => p.id === id);
        if (old) {
            const dest = pack.people.find(p => p.id === id) || pack.references.find(p => p.id === id);
            for (const [k,v] of Object.entries(generated)) {
                if (dest[k] === undefined) {if (pack.people.some(p=>p.id === id)) dest[k] = v;}
                else if (json(dest[k]) !== json(v)) conflicts.push({id, field:k, kept:dest[k], proposed:v});
            }
        } else {pack.people.push(generated); allPersonIds.add(id);}
    }
    // Places spoken by lead scenes get exact-ID rows from M4's place worksheets.
    // The worksheets are authoritative for containment and routes; missing facts stay missing.
    const placeIds = new Set(pack.places.map(r => r.id));
    pack.placeAliases = list(pack.placeAliases);
    const normPlace = s => String(s ?? '').normalize('NFKC').trim().toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ');
    const selectedPlaceRows = selectedScenes.map(s => s.place).filter(v => typeof v === 'string' && v.trim());
    const registryPlaces = registry.filter(r => r.kind === 'place');
    const placeExtras = extras.filter(r => r.extra === 'places');
    const exactNames = new Map();
    const addName = (name,row) => { if (typeof name !== 'string' || !name.trim()) return; const key=normPlace(name), rows=exactNames.get(key)||[]; if(!rows.includes(row))rows.push(row);exactNames.set(key,rows); };
    for (const row of registryPlaces) for (const name of [row.id,row.label,row.zh,...list(row.aliases)]) addName(name,row);
    const referenced = new Set();
    for (const place of selectedPlaceRows) {
        const ids = new Set();
        const direct = registryPlaces.find(r => r.id === place);
        if (direct) ids.add(direct.id);
        const exact = exactNames.get(normPlace(place)) || [];
        for (const r of exact) ids.add(r.id);
        if (!ids.size) for (const part of place.split(/[,;，；]/).map(s=>s.trim()).filter(Boolean)) {
            const rows=exactNames.get(normPlace(part))||[]; if(rows.length===1) ids.add(rows[0].id);
        }
        for (const id of ids) referenced.add(id);
    }
    // Preserve the source container chain for selected locations, but don't turn rooms/desks into walks.
    const extrasById = new Map();
    for (const row of placeExtras) { const rows=extrasById.get(row.id)||[]; rows.push(row); extrasById.set(row.id,rows); }
    const selectedEvidence = new Map();
    for (const id of referenced) {
        const rows=(extrasById.get(id)||[]).filter(r=>inSlice(r,slice));
        if(rows.length) selectedEvidence.set(id,sorted(rows));
    }
    const addAncestors = id => {
        const row=selectedEvidence.get(id)?.find(r=>typeof r.within==='string' && r.within.startsWith('lotm.place.'));
        if(row && !referenced.has(row.within) && extrasById.has(row.within)) { referenced.add(row.within); selectedEvidence.set(row.within,(extrasById.get(row.within)||[]).filter(r=>inSlice(r,slice))); addAncestors(row.within); }
    };
    for(const id of [...referenced]) addAncestors(id);
    const registryById = new Map(registryPlaces.map(r=>[r.id,r]));
    const explicitDistricts = new Set(['evernight','storm','machinery','lotm.place.evernight','lotm.place.storm','lotm.place.machinery']);
    const isSubplace = row => /(^|[ ._-])(room|bedroom|bathroom|washroom|corridor|hallway|stairwell|desk|corner|interior|living-room|kitchen|office|chamber)([ ._-]|$)/i.test(`${row.id} ${row.label||''}`);
    const byParent = id => {
        const row=selectedEvidence.get(id)?.find(r=>typeof r.within==='string' && r.within.startsWith('lotm.place.'));
        return row?.within || null;
    };
    const districtFor = id => {
        const seen=new Set(); let at=id;
        while(at && !seen.has(at)){seen.add(at);if(explicitDistricts.has(at))return at.replace(/^lotm\.place\./,'');at=byParent(at);}
        return null;
    };
    for (const indexId of [...referenced].sort()) {
        const resolved=placeId(indexId) || target(indexId) || indexId;
        if(placeIds.has(resolved)) continue; // authored base rows win
        const meta=registryById.get(indexId), rows=selectedEvidence.get(indexId)||[];
        const source=rows[0]||null, parent=byParent(indexId), kind=isSubplace(meta||{id:indexId,label:''})?'sub-place':/street|road|lane|avenue|square|district/i.test(`${indexId} ${meta?.label||''}`)?'street':'building';
        const aliases=unique([meta?.label,meta?.zh,...list(meta?.aliases)].filter(v=>typeof v==='string'&&v.trim()).map(name=>({id:name,indexId,place:resolved,label:source?.label||'U',locator:source?.locator||meta?.firstMention||slice.from})));
        const routes=rows.flatMap(r=>list(r.routes)).filter(r=>Number.isFinite(r.minutes)&&r.minutes>0);
        const district=districtFor(indexId);
        const row={id:resolved,indexId,name:meta?.label||meta?.zh||indexId,openingHours:[],kind,...(parent?{parent}:{}),...(district?{district}:{}),...(aliases.length?{aliases}:{}),...evidence(source||meta||{label:'U',locator:slice.from}),locator:source?.locator||meta?.firstMention||slice.from,
            provenance:['S','T'].includes(source?.label)?'canon':source?.label==='I'?'canon-derived':'fill'};
        if(kind==='sub-place') row.anchorOnly=true;
        else if(district) {
            const route=routes[0];
            row.travel={district,...(route?{minutes:route.minutes,provenance:'canon',basis:`M4 route to ${route.to}`}:{minutes:2,provenance:'fill',basis:'same-district default; no source route stated'})};
        }
        pack.places.push(row);placeIds.add(resolved);
        for(const alias of aliases) if(!pack.placeAliases.some(a=>a.indexId===alias.indexId)) pack.placeAliases.push(alias);
    }
    const hoursRows = placesOnly ? [] : selectedExtras.filter(r => ['services','rules','rules_other'].includes(r.extra) && typeof r.hours === 'string' && r.hours.trim() && !/^(unknown|unstated|none|null|u|\?)$/i.test(r.hours.trim()));
    const worldHours = unique(hoursRows.map(r => ({id:`${book}.hours.${hash(r).slice(0,20)}`,place:placeId(r.place), indexPlace:r.place || null,role:r.role || null,hours:r.hours,...evidence(r)})));
    const routines = [], orderEdges = [];
    for (const row of peopleRows) for (const slot of list(row.routine)) {
        const locator = slot.locator || row.locator;
        if (!inSlice({locator},slice)) continue;
        if (!allPersonIds.has(personId(row.id))) {gaps.push({id:row.id,reason:'unresolved-routine-actor',locator});continue;}
        const id = `${book}.routine.${hash([row.id,slot]).slice(0,20)}`;
        const timing = relativeTiming(slot);
        let edge = null;
        if (timing) {
            // A referenced meal/event is a source constraint, not an invented hour.
            const ref = `${book}.time-reference.${hash([row.id,timing.target]).slice(0,20)}`;
            edge = {id:`${id}.order`,before:timing.relation === 'after' ? ref : id,after:timing.relation === 'after' ? id : ref,reference:{id:ref,text:timing.target},...evidence({...slot,locator})};
            if (timing.offsetDays) edge.offsetDays = timing.offsetDays;
            orderEdges.push(edge);
        }
        const hours = worldHours.filter(h => hoursRows.some(r => `${book}.hours.${hash(r).slice(0,20)}` === h.id && matchesRoleHours(slot,row,r))).map(h => h.id);
        routines.push({id,actor:personId(row.id),place:placeId(slot.place),indexPlace:slot.place || null,
            sourceTiming:Object.fromEntries(['days','time','timeOfDay','at','start','window','recurrence'].filter(k => slot[k] !== undefined).map(k => [k,slot[k]])),
            ...(typeof slot.what === 'string' && slot.what.length <= 200 ? {what:slot.what} : {}),
            ...(routineBand(slot) ? {band:routineBand(slot)} : {}), orderEdge:edge?.id || null,roleHours:hours,
            usable:!!placeId(slot.place) && (hasTime(slot) || !!routineBand(slot) || !!edge || hours.length > 0),...evidence({...slot,locator})});
    }
    for (const edge of orderEdges) {
        const owner = routines.find(r=>r.orderEdge === edge.id);
        const matches = routines.filter(r=>r.id !== owner.id && r.actor === owner.actor &&
            [r.what,r.sourceTiming.time,r.sourceTiming.timeOfDay].some(t=>typeof t === 'string' && t.toLowerCase() === edge.reference.text.toLowerCase()));
        if (matches.length === 1) {
            if (edge.before === edge.reference.id) edge.before = matches[0].id;
            else edge.after = matches[0].id;
        }
    }
    const mergeSection = (name, rows) => {
        const old = list(base[name]); const ids = new Set(old.map(r=>r.id));
        pack[name] = [...old,...unique(rows).filter(r=>!ids.has(r.id))];
    };
    mergeSection('worldHours',worldHours);mergeSection('routines',routines);mergeSection('orderEdges',orderEdges);
    // Link relations only when both exact identities are present. Unknown remains a gap.
    for (const row of candidates) {
        const p = pack.people.find(p => p.id === personId(row.id));
        if (!p || existing.some(o=>o.id === p.id)) continue;
        p.relations = unique(relations(row.id).filter(r => allPersonIds.has(personId(r.with))).map(r => ({withId:personId(r.with),kind:r.kind || 'unknown',...evidence(r)})));
    }
    for (const r of routines) if (!r.place) gaps.push({id:r.id,reason:'unresolved-place',locator:r.locator});
    pack.idMap = idMap;
    const oldRows = new Map(['people','places','routines','worldHours','orderEdges'].flatMap(k => list(base[k]).map(r => [r.id,r])));
    const newRows = new Map(['people','places','routines','worldHours','orderEdges'].flatMap(k => list(pack[k]).map(r => [r.id,r])));
    const added = [...newRows.keys()].filter(id=>!oldRows.has(id)).sort();
    const changed = [...newRows.keys()].filter(id=>oldRows.has(id) && json(oldRows.get(id)) !== json(newRows.get(id))).sort();
    const removed = [...oldRows.keys()].filter(id=>!newRows.has(id)).sort();
    pack.revision = `${base.revision || 'cast'}.${placesOnly?'r2-places':'r1'}-${hash({book,slice,registry:sorted(registry),scenes:sorted(scenes),extras:sorted(extras),crosswalk,base,placesOnly}).slice(0,16)}`;
    pack.revisionNote = {from:base.revision || null,to:pack.revision,added,changed,removed,conflicts:unique(conflicts),gaps:unique(gaps)};
    pack.buildSourceIdentity = {schema:'cast-pack-build/1', book, slice,
        inputs:Object.fromEntries(Object.entries({registry:sorted(registry),scenes:sorted(scenes),extras:sorted(extras),crosswalk,base}).map(([k,v])=>[k,hash(v)]))};
    const oldUsable = routines.filter(r => r.place && hasTime(r.sourceTiming)).length;
    return {pack:canonical(pack),report:{people:pack.people.length,tiers:pack.people.reduce((m,p)=>(m[p.tier]=(m[p.tier]||0)+1,m),{}),routines:{total:routines.length,oldUsable,newUsable:routines.filter(r=>r.usable).length},orderEdges:orderEdges.length,worldHours:worldHours.length,added:added.length,changed:changed.length,removed:removed.length,conflicts:conflicts.length,gaps:gaps.length}};
}

export function run(argv) {
    const book = argv[0], flag = k => argv[argv.indexOf(k)+1];
    for (const k of ['--from','--to','--merged','--base','--out']) if (!argv.includes(k) || !flag(k)) throw new Error(`Missing ${k}`);
    const out = resolve(flag('--out')), parent = dirname(out);
    mkdirSync(parent,{recursive:true});
    const actual = resolve(realpathSync(parent),out.split('/').at(-1));
    const root = realpathSync(resolve(fileURLToPath(new URL('../../',import.meta.url))));
    const rel = relative(root,actual);
    if (existsSync(out) && realpathSync(out) !== actual) throw new Error('Output symlink is not allowed');
    const tempRel = relative(realpathSync(tmpdir()),actual);
    if ((tempRel.startsWith('..') || tempRel === '' || tempRel.startsWith('/')) && !actual.startsWith('/private/tmp/') && !actual.startsWith('/tmp/') && !(rel.startsWith('private_packs/') && !rel.split('/').includes('..'))) throw new Error('Output must be private_packs or temporary storage');
    if (actual === resolve(realpathSync(dirname(flag('--base'))),resolve(flag('--base')).split('/').at(-1))) throw new Error('Output cannot overwrite base pack');
    const dir = resolve(flag('--merged'));
    const read = name => readFileSync(resolve(dir,name),'utf8').split('\n').filter(l=>l.trim()).map(JSON.parse);
    const registry=read('registry.jsonl'),scenes=read('scenes.jsonl'),extras=read('extras.jsonl');
    const slice={from:flag('--from'),to:flag('--to')};
    const crosswalk = existsSync(resolve(dir,'crosswalk.json')) ? JSON.parse(readFileSync(resolve(dir,'crosswalk.json'),'utf8')) : buildCrosswalk({registry,scenes,extras,world:book,slice}).crosswalk;
    const result=buildCastPack({book,slice,registry,scenes,extras,crosswalk,base:JSON.parse(readFileSync(flag('--base'),'utf8')),placesOnly:argv.includes('--places-only')});
    writeFileSync(out,JSON.stringify(result.pack,null,2)+'\n');
    writeFileSync(resolve(parent,'build-report.json'),JSON.stringify(result.report,null,2)+'\n');
    console.log(JSON.stringify(result.report));return result;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) run(process.argv.slice(2));
