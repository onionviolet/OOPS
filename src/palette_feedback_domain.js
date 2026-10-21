import {publishBodyExpression} from './body_expression.js';
import {createMeterBar} from './meter_bar.js';
import {registerDomain, domainRegistry} from './domain_registry.js';
import {definePanel} from './panel_kit.js';
import {readPort, whenPortsReady} from './ui_ports.js';
import {current_location} from './runtime_state.js';
import {current_game_time} from './game_time.js';
import {worldWeatherWords} from './world_weather_display.js';
import {is_raining} from './weather.js';
import {createPaletteFeedback, createPaletteFeedbackLedger} from './palette_feedback.js';
import {node} from './reference_kit.js';
import {nativeSkillDiscovery} from './skill_discovery_native.js';

// A display-only join over native projections. Snapshots are session memory and
// are deliberately cleared by load; historical save data is never called a cue.
let panel = null, feedback = null, currentPlace = null, priorSnapshot = null,priorObservedAt=null;
let lastScene = null, lastHarvest = null, readyAfterLoad = false, visitSequence = 0, sceneEventSequence = 0;
let suppressNextCue=false;
const visitedPlaces = new Set();
const observedAt = new Map(),observedReadings=new Map();
const ledger = createPaletteFeedbackLedger();
const keyForHarvest = last => last && `${last.key}:${last.clock}:${JSON.stringify(last.outputs)}`;

function publishCue(receipt, anchor) {
    if (!receipt || suppressNextCue) return;
    if(receipt.pose){publishBodyExpression(receipt);cueLine.textContent=receipt.text;return;}
    cueLine.textContent=receipt.text;
    if (!readPort('sceneCue',receipt) && panel.checkVisibility?.()) feedback?.presentReceipt(receipt,anchor);
}

function knownSkills(character) {
    if (!character) return [];
    const skills=readPort('records')?.skills||{};
    return Object.entries(character.getLevelableComponent?.().skill_progress || {}).flatMap(([id, row]) => {
        const known = skills[id] && nativeSkillDiscovery(skills[id], character);
        return known && Number.isFinite(row.current_level) ? [{id, label: known.label, level: row.current_level}] : [];
    });
}

function snapshot() {
    const character = readPort('character'), items = character?.getItems?.() || {};
    const toolView=domainRegistry.project('tools'),tools=toolView?.enabled?(toolView.rows||[]).filter(r=>r.bound):[];
    const inventory = Object.entries(items).map(([key, row]) => {
        return {id: `item:${key}`, label: row.item?.getName?.() || 'Carried item', value: row.count};
    }).filter(row => Number.isFinite(row.value) && row.value > 0);
    const toolRows = tools.map(row => ({id: `tool:${row.key}`, label: `${row.name} condition`, value: `${Math.round(row.condition)}/${Math.round(row.max)}`,meter:{subject:row.key,value:row.condition,max:row.max,label:row.name}}));
    const skillRows = knownSkills(character).map(row => ({id: `skill:${row.id}`, label: `${row.label} level`, value: row.level}));
    const body=character?.getLevelableComponent?.().stats?.full;const bodyRows=body&&body.max_health>0?[{id:'body:health',label:'Health',value:`${body.health}/${body.max_health}`,meter:{subject:`body:${character.id||'player'}`,value:body.health,max:body.max_health,label:'Health'}}]:[];
    return [...inventory, ...toolRows, ...skillRows,...bodyRows];
}

function harvestSummary() {
    const result = domainRegistry.project('harvest'), last = result?.state?.last;
    if (!last) return '';
    const records = readPort('records') || {};
    const output = (last.outputs || []).map(row => {
        let id = ''; try { id = JSON.parse(row.item_key).id || ''; } catch { /* unknown output stays unnamed */ }
        const name = records.item_templates?.[id]?.name || id;
        return name ? `${row.count} ${name}` : '';
    }).filter(Boolean);
    return output.length ? output.join(', ') : '';
}

function localFacts() {
    const expansion = readPort('expansion'), worldId = expansion?.actors?.player?.worldId;
    let weather = null;
    try {
        weather = worldId === 'base.frontier' && current_location
            ? (current_location.is_under_roof ? 'Sheltered' : is_raining() ? 'Rain' : 'Dry')
            : worldWeatherWords(worldId, current_game_time, current_location);
    } catch { /* no observer-safe weather projection */ }
    const lamp = domainRegistry.project('lamplight');
    const light = lamp?.held ? (lamp.lit ? 'Oil lamp lit' : 'Oil lamp carried, unlit') : '';
    const weatherText = typeof weather === 'string' ? weather : '';
    const weatherKind = /\bsnow\b/i.test(weatherText) ? 'snow' : /\brain\b/i.test(weatherText) ? 'rain' : /\bdry\b/i.test(weatherText) ? 'dry' : /\bsheltered\b/i.test(weatherText) ? 'sheltered' : 'unknown';
    return {weather: weatherText, weatherKind, light, lampLit: lamp?.shining === true,
        placeId: current_location?.id || '', placeName: current_location?.name || 'Current place'};
}

function render() {
    if (!panel) return;
    const initializing=!readyAfterLoad;
    const place = localFacts();
    const rows = snapshot();
    const currentId = place.placeId;
    const sceneAnchor = document.getElementById('quiet_place_detail') || document.getElementById('weather_div') || activityLine;
    if (currentId) {
        if (!readyAfterLoad) {
            currentPlace = currentId; priorSnapshot = rows;priorObservedAt=current_game_time.toString(); ledger.captureReturnBaseline(currentId, rows); visitedPlaces.add(currentId); readyAfterLoad = true;
        } else if (currentId !== currentPlace) {
            if (currentPlace && priorSnapshot) {ledger.captureReturnBaseline(currentPlace, priorSnapshot);observedAt.set(currentPlace,priorObservedAt);observedReadings.set(currentPlace,priorSnapshot.filter(r=>r.meter).map(r=>r.meter));}
            currentPlace = currentId;
            const hadVisited = visitedPlaces.has(currentId);
            const receipt = ledger.observeReturn({boundaryId: `visit:${currentId}:${++visitSequence}`, subjectId: currentId, entries: rows});
            if (receipt) {
                returnLine.textContent = `Session snapshot since your last visit: ${receipt.text}`;
                returnDetails.hidden=false;returnList.replaceChildren(...receipt.changes.map(change=>node('li',change)));
                returnContext.textContent=`Previous visit snapshot, observed ${observedAt.get(currentId)||'earlier this session'}. This is remembered information, not live tracking while away.`;
                if(panel.checkVisibility?.()) feedback?.presentReceipt(receipt);
            } else returnLine.textContent = hadVisited ? 'No known changes in the session snapshot since your last visit.' : 'First observed visit this session; no return summary yet.';
            if(!receipt){returnDetails.hidden=true;returnList.replaceChildren();returnContext.textContent='';}
            const remembered=observedReadings.get(currentId)||[];returnMeters.replaceChildren();
            for(const old of remembered){const bar=createMeterBar();bar.update({id:`remembered-observation:${old.subject}`,subject:old.subject,label:`${old.label} · last observed`,kind:'pool',value:old.value,max:old.max,observation:{stale:true,text:`Remembered during previous visit: ${observedAt.get(currentId)}. This is not its current condition.`},note:'An observation from the previous visit, retained in this session only.'});returnMeters.append(bar.node);}
            if(remembered.length)returnDetails.hidden=false;
            visitedPlaces.add(currentId);
            priorSnapshot = rows;priorObservedAt=current_game_time.toString();
        } else {
            priorSnapshot = rows;priorObservedAt=current_game_time.toString();
        }
    }

    if (!lastScene || !readyAfterLoad) lastScene = {placeId: currentId, weatherKind: place.weatherKind, lampLit: place.lampLit};
    else if (currentId && lastScene.placeId === currentId) {
        const eventId = `local-scene:${currentId}:${++sceneEventSequence}`;
        if (lastScene.weatherKind !== place.weatherKind && ['rain', 'snow'].includes(place.weatherKind) && !current_location?.is_under_roof)
            publishCue(ledger.observeScene({placeId: currentId, eventId, cue: place.weatherKind==='snow'?'snow-exposed':'rain-exposed', label: place.placeName}),sceneAnchor);
        if (!lastScene.lampLit && place.lampLit)
            publishCue(ledger.observeScene({placeId: currentId, eventId: `${eventId}:lamp`, cue: 'lamp-steady', label: place.placeName}),sceneAnchor);
        lastScene = {placeId: currentId, weatherKind: place.weatherKind, lampLit: place.lampLit};
    } else lastScene = {placeId: currentId, weatherKind: place.weatherKind, lampLit: place.lampLit};
    const toolProjection = domainRegistry.project('tools');
    for (const tool of toolProjection?.rows || []) publishCue(ledger.observeTool({subjectId: tool.key, label: tool.name, condition: tool.condition, maxCondition: tool.max,
        eventId: `condition:${tool.key}:${tool.condition}`}), sceneAnchor);

    const character = readPort('character'),body=character?.getLevelableComponent?.().stats?.full;
    if(body)publishCue(ledger.observeBody({subjectId:character.id||'player',health:body.health,maxHealth:body.max_health,stamina:body.stamina,maxStamina:body.max_stamina}),sceneAnchor);
    for (const row of knownSkills(character)) {
        publishCue(ledger.observeCompetence({subjectId: 'player', capabilityId: row.id, label: row.label, level: row.level, causeId: `skill-level:${row.id}:${row.level}`}), sceneAnchor);
    }

    const harvest = domainRegistry.project('harvest')?.state?.last, harvestKey = keyForHarvest(harvest);
    if(initializing)lastHarvest=harvestKey;
    if (harvestKey && harvestKey !== lastHarvest) {
        const baseline = readyAfterLoad;
        lastHarvest = harvestKey;
        if (baseline) {
            const destination = harvestSummary();
            const receipt = ledger.observeActivityBoundary({boundaryId: `harvest:${harvestKey}`, activityId: 'carcass-processing', outcome: `Processing complete: ${harvest.choice}`, destination: 'carried', summary: destination ? [destination] : []});
            activityLine.textContent = receipt?.text || destination;
            if (receipt && !suppressNextCue && panel.checkVisibility?.()) feedback?.presentReceipt(receipt, sceneAnchor);
        }
    }
    if (!activityLine.textContent && harvestKey) activityLine.textContent = harvestSummary();
    panel.dataset.place = currentId;
    suppressNextCue=false;
}

function createPanel() {
    const section = node('section', null, {id: 'palette_feedback_panel', class: 'reference-panel expedition_panel palette-feedback-host'});
    section.dataset.surfaceType = 'reference';
    const intro = node('p', 'Local conditions and session-only changes from observed native state.');
    const activity = node('p', ''), returned = node('p', '', {role: 'status', 'aria-live': 'polite'});
    cueLine=node('p','',{class:'palette-feedback-notes'});returnDetails=node('details');returnDetails.hidden=true;
    returnContext=node('p');returnList=node('ul');returnMeters=node('div');returnDetails.append(node('summary','Details of this return'),returnContext,returnList,returnMeters);
    activity.className = 'palette-feedback-activity'; returned.className = 'palette-feedback-return';
    intro.textContent = 'Return snapshots and completed local work, from observed native state. Comparisons last for this session only.';
    section.append(node('h2', 'Session notes'), intro, activity, cueLine, returned,returnDetails);
    activityLine = activity; returnLine = returned;
    feedback = createPaletteFeedback({container: section, ledger, readSettings: () => readPort('presentation', 'location') || {}});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)suppressNextCue=true;});
    section.render = render;
    definePanel({id: 'around-place', title: 'Around this place', role: 'records', node: section, home: document.getElementById('main_content'),
        discovered: () => !!current_location, eligible: () => !!current_location, emptyText: 'Travel somewhere to see local context.'});
    return section;
}
let activityLine = null, returnLine = null,cueLine=null,returnDetails=null,returnContext=null,returnList=null,returnMeters=null;
registerDomain({id: 'palette-feedback', deps: ['tools', 'harvest', 'lamplight'], initialState: () => null,
    // Reset all baselines on load. The first refresh seeds only current state.
    load: () => { publishBodyExpression();feedback?.clear();readPort('sceneCue'); currentPlace = null; priorSnapshot = null;priorObservedAt=null; lastScene = null; readyAfterLoad = false; lastHarvest = null; ledgerReset(); visitedPlaces.clear();observedAt.clear();observedReadings.clear();returnMeters?.replaceChildren(); activityLine?.replaceChildren(); returnLine?.replaceChildren();cueLine?.replaceChildren();if(returnDetails)returnDetails.hidden=true;returnList?.replaceChildren(); },
    refresh: () => panel?.render(), panels: [() => { panel = createPanel(); whenPortsReady(() => panel?.render()); }]});

function ledgerReset() {
    // The ledger has no disk state; replace its runtime maps by rebuilding the module's
    // single owner through its explicit reset contract (implemented below).
    ledger.reset(); visitSequence = 0; sceneEventSequence = 0;
}
