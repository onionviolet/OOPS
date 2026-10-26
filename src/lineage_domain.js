import {drawCultivationRoot,retuneCultivationRoot} from './cultivation_root.js';
import {registerDomain,domainRegistry} from './domain_registry.js';
import {definePanel} from './panel_kit.js';
import {addPurse} from './economy_domain.js';
import {readPort, whenPortsReady} from './ui_ports.js';
import {node, visibleRenderer, plural} from './reference_kit.js';
import {foundLine, validateLineage, memberView, hiddenLoci, testMember, TEST_COST, LINEAGE_PROFILES, inheritedStatMultipliers} from './lineage_traits.js';

// W3 G24/G28 live wiring. Save slice `inherited_traits` = {schema: 1, seed, profile, selfId, members}
// (lineage_traits.js). Absent in older saves and until the panel is first read, so untouched saves
// are unchanged (AR6, no migration needed). The heir crossing lives in heir_inheritance.js.
// The player sees each person's phenotype and only the alleles it or a test makes known.
let line = null, panel = null, notice = '';
let applied='';
function bodyBinding() {
    const root=readPort('expansion'),hero=readPort('character'),b=root?.simulation?.people?.player?.body;
    if(!hero||!root?.actors?.player)return null;
    return JSON.stringify([b?.id??'native.player.body',b?.instanceId??null,b?.form??hero.getBioComponent?.()?.race??'human']);
}
function applyQualities() {
    const hero=readPort('character');if(!hero?.getLevelableComponent)return;
    const binding=bodyBinding();
    if(line&&!line.bodyBinding&&binding)line={...line,bodyBinding:binding};
    const effects=line&&binding===line.bodyBinding?inheritedStatMultipliers(line):{};
    const signature=JSON.stringify(effects);if(signature===applied)return;
    applied=signature;
    const full=hero.getFullStats(),health=full.health,stamina=full.stamina;
    hero.getLevelableComponent().stats.multiplier.inherited_qualities=effects;
    hero.updateStatsAndDisplay();
    const next=hero.getFullStats();next.health=Math.min(next.max_health,health);next.stamina=Math.min(next.max_stamina,stamina);
}
const seedNow = () => readPort('expansion')?.chronicle?.enrolledAt;
function ensure() {
    // The line is founded from the life chronicle's identity, so it waits for one (same life, same line).
    if (!line) { const seed = seedNow(); if (seed != null) line = foundLine(String(seed)); }
    if(line&&!line.cultivationRoot)line={...line,cultivationRoot:drawCultivationRoot(line)};
    return line;
}
export const lineageState = () => line;
export const setLineageState=value=>{validateLineage(value);line=value;applied='';};
export function testLineageMember(id) {
    const state = ensure();
    if (!state) throw new Error('Begin a life chronicle first.');
    const i = state.members.findIndex(m => m.id === id);
    if (i < 0) throw new Error('Unknown relative.');
    if (!hiddenLoci(state.members[i]).length) throw new Error('Everything about them is already known.');
    const hero = readPort('character');
    if (!hero || !(hero.money >= TEST_COST)) throw new Error(`A test costs ${TEST_COST} coins.`);
    const next = testMember(state.members[i]);
    addPurse(hero, -TEST_COST, 'lineage.test');
    line = {...state, members: state.members.map((m, k) => (k === i ? next : m))};
    panel?.render(true);
    return next;
}

registerDomain({id: 'inherited_traits', initialState: () => null,
    save: () => (line ? structuredClone(line) : undefined),
    validate: validateLineage, migrate: slice => (slice == null ? null : structuredClone(slice)),
    load: slice => { line = slice ?? null; applied=''; },
    refresh: () => {applyQualities();panel?.render(false);},
    commands:{planRootRetune:direction=>{const l=ensure();if(!l||l.bodyBinding!==bodyBinding())throw Error('Use this inherited body in its own current profile.');return {...structuredClone(l),cultivationRoot:retuneCultivationRoot(l.cultivationRoot,direction)};},cultivationAffinity:()=>{const l=ensure();return l&&l.bodyBinding===bodyBinding()?{...l.cultivationRoot}:null;},testRoot:()=>{const l=ensure();if(!l||l.bodyBinding!==bodyBinding())throw Error('Test this inherited body in its own life.');if(l.cultivationRoot.tested)throw Error('This body’s affinity is already tested.');const hero=readPort('character');if(!(hero?.money>=TEST_COST))throw Error(`A test costs ${TEST_COST} coins.`);addPurse(hero,-TEST_COST,'lineage.root-test');line={...l,cultivationRoot:{...l.cultivationRoot,tested:true}};panel?.render(true);}},
    projection: () => (line ? {root:line.cultivationRoot?.tested?{...line.cultivationRoot}:null,selfId: line.selfId, people: line.members.map(m => ({id: m.id, name: m.name, view: memberView(m)}))} : null),
    panels: [() => { panel = createPanel(); }]});

function createPanel() {
    const root = node('section', null, {id: 'inherited_traits_panel', class: 'reference-panel expedition_panel'});
    root.dataset.surfaceType = 'records';
    const intro = node('p', ''), status = node('p', '', {role: 'status', 'aria-live': 'polite'}), list = node('div');
    const rootTest=node('button','Test this body’s latent circulation affinity · 6 coins',{type:'button'});rootTest.dataset.lineageRootTest='';rootTest.onclick=()=>{try{domainRegistry.command('inherited_traits','testRoot')();notice='The paid test records this body’s actual latent affinity.';}catch(e){notice=e.message;}render(true);};
    root.append(node('h2', 'Family qualities'), intro, status, rootTest,list);
    const render = visibleRenderer(root, () => ({line: ensure(), notice, coins: readPort('character')?.money ?? 0}), view => {
        if (!view.line) { intro.textContent = 'Begin a life chronicle in the People notebook to learn what runs in your family.'; status.textContent = ''; list.replaceChildren(); return; }
        const profile = LINEAGE_PROFILES[view.line.profile];
        intro.textContent = `What shows in each of you is plain to see. Which alleles are carried is learned by a test (${TEST_COST} coins each) or from a child. ${profile.reason}`;
        rootTest.disabled=!!view.line.cultivationRoot?.tested||view.coins<TEST_COST||view.line.bodyBinding!==bodyBinding();
        const affinity=view.line.cultivationRoot;status.textContent=view.notice+(affinity?.tested?` Flow affinity ${affinity.flow}/4; still affinity ${affinity.still}/4. Each matching share adds 1% to that drill’s native intake, whether tested or not.`:' Latent circulation affinity has not been tested.');
        list.replaceChildren(...view.line.members.map(m => {
            const box = node('div', null, {class: 'lineage-member'}), hidden = hiddenLoci(m).length;
            box.append(node('h3', m.id === view.line.selfId ? `${m.name} (you)` : m.name));
            const ul = node('ul', null, {'aria-label': `${m.name}, qualities`});
            for (const v of memberView(m)) {
                const item=node('li'), details=node('details');
                item.append(node('strong',v.label),node('p',v.description));
                details.append(node('summary','Inheritance and effects'),node('p',`Known inheritance: ${v.alleles.join(' ')}${v.known ? '' : ' (unexamined shares marked ?)'}${v.effect ? ` · ${v.effect}` : ''}`));
                item.append(details);ul.append(item);
            }
            const b = node('button', hidden ? `Test one hidden quality (${TEST_COST} coins)` : 'All known', {type: 'button'});
            b.dataset.lineageTest = m.id; b.disabled = !hidden || view.coins < TEST_COST;
            b.addEventListener('click', () => {
                try { const done = testLineageMember(m.id); notice = `Tested ${m.name}: ${plural(hiddenLoci(done).length, 'quality', 'qualities')} still hidden.`; } catch (e) { notice = e.message; }
                render(true);
            });
            box.append(ul, b);
            return box;
        }));
    });
    whenPortsReady(() => {render(true);applyQualities();});
    definePanel({id: 'inherited_traits', title: 'Family qualities', role: 'records', node: root, home: document.getElementById('main_content'),
        discovered: () => true, eligible: () => true});
    return {render};
}
