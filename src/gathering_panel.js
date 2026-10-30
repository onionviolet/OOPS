import {definePanel} from './panel_kit.js';
import {renderGatheringView} from './ui/gathering_view.js';
import {gatheringModel} from './gathering_model.js';
import {readGatherSites} from './gathering_read.js';
import {villageSources} from './crafting_frontier_runtime.js';

// The one place a world is named: this adapter wires the frontier village's source table to the generic view.
// Default: the village verge keeps no season map, no hour gate and no weather gate, so the view shows no season
// band and says that weather does not change the verge (reason: the owner has no such rule; a world that has one
// supplies it as data, never as a claim made here).
const VERGE = ['village-herbs'];
export function villageGatherView({owner, context, quote, observer}) {
    const here = context.world === 'base.frontier' && context.location === 'Village';
    if (!here) return {visible: false, sites: []};
    const q = quote({type: 'harvest'});
    return {visible: true, place: 'Village common', observer,
        sites: readGatherSites(villageSources, {sourceIds: VERGE, nodes: owner?.sources?.nodes ?? {}, world: context.world, location: context.location, clock: context.clock, actor: {skill: context.skill ?? 0}}),
        now: {can: q.eligible, reason: q.eligible ? '' : q.reason}, season: null, insight: false,
        weather: {words: 'Weather does not change what this verge gives.'}, larder: []};
}

// Gathering at a glance: a site table, a season band when the world has seasons, what each site gives. Acts on nothing;
// the Village experiments panel owns the gather button and its quote (UIV4).
export function createGatheringPanel({read, openWorkshop}) {
    const panel = document.createElement('section');
    panel.id = 'gathering_panel'; panel.className = 'expedition_panel gathering-panel';
    const heading = document.createElement('h2'); heading.textContent = 'Gathering at a glance';
    const body = document.createElement('div');
    panel.append(heading, body);
    let signature = '';
    function render() {
        if (!panel.isConnected) return;
        const model = gatheringModel(read());
        const sig = JSON.stringify(model);
        if (sig === signature) return;
        signature = sig;
        renderGatheringView(body, model, {onOpen: openWorkshop});
    }
    definePanel({id: 'gathering', title: 'Gathering at a glance', role: 'records', node: panel, home: document.getElementById('main_content'), defaultDock: 'center', after: 'herbal-experiments',
        discovered: () => read().visible, eligible: () => read().visible});
    render();
    return {render};
}
