"""Apply reviewed finite joins only after this role's explicit shared acquisition."""
from pathlib import Path
import hashlib, json, subprocess, difflib

BASE = Path(__file__).resolve().parent
ROOT = BASE.parents[2]
changes = {}

def once(s, old, new):
    assert s.count(old) == 1, f'Refresh exact integration anchor: {old[:100]}'
    return s.replace(old, new, 1)

def edit(path, fn):
    p = ROOT / path
    old = p.read_text()
    new = fn(old)
    assert new != old, path
    r = subprocess.run(['node','--check','--input-type=module'], input=new, text=True, capture_output=True)
    assert r.returncode == 0, (path, r.stderr)
    changes[path] = (old, new)

def imports(s, text): return text + '\n' + s

edit('src/simulation_content.js', lambda s: imports(s,
    "import {CONTEXTUAL_BALM_DEFINITIONS} from './contextual_balm_content.js';\n"
    "import {coolingRefinementDefinitions} from './cooling_refinement_content.js';\n"
    "import {agreedDutyDefinitions,agreedDutyFollowupDefinitions,agreedDutyController} from './agreed_duty_content.js';") +
    "\nsimulationDefinitions.commands.push(...CONTEXTUAL_BALM_DEFINITIONS.commands,...coolingRefinementDefinitions.commands,...agreedDutyDefinitions.commands,...agreedDutyFollowupDefinitions.commands);\n"
    "simulationDefinitions.controllers=simulationDefinitions.controllers.map(agreedDutyController);\n")
edit('src/simulation_effects.js', lambda s: once(imports(s,
    "import {contextualBalmFacts} from './contextual_balm_facts.js';\n"
    "import {coolingRefinementFacts} from './cooling_refinement_facts.js';\n"
    "import {agreedDutyFacts} from './agreed_duty_facts.js';"),
    '    for(const [key,count] of Object.entries(owned || {}))',
    '    Object.assign(facts,contextualBalmFacts(state,context),coolingRefinementFacts(state,context),agreedDutyFacts(state,context));\n    for(const [key,count] of Object.entries(owned || {}))'))
edit('src/expansion_engine.js', lambda s: once(imports(s,
    "import {validateContextualBalmState} from './contextual_balm_facts.js';\n"
    "import {validateCoolingRefinement} from './cooling_refinement_facts.js';\n"
    "import {validateAgreedDutyState} from './agreed_duty_facts.js';"),
    '    validateGameAbsorptionAssay(state,registry);',
    '    validateGameAbsorptionAssay(state,registry);\n    validateContextualBalmState(state,registry);\n    validateCoolingRefinement(state,registry);\n    validateAgreedDutyState(state);'))

def simulation(s):
    s=imports(s,"import {agreedDutyCompletionEffects,agreedDutyCancellationEffects,agreedDutyStoppedEffects,agreedDutyRefusalEffects} from './agreed_duty_host.js';\nimport {agreedDutySelectedCommand} from './agreed_duty_facts.js';")
    anchor="            ...(registry.simulation.commands.get(job.commandId)?.group === 'audit_lesson' ? {auditWorkshopReservation: job} : {}),"
    s=once(s,anchor,anchor+"\n            ...(job.commandId.startsWith('feature_society.duty.') ? {agreedDutyReservation:job} : {}),")
    s=once(s,'            log(s, state.clock, `${job.label} stopped:',
        '            applySimulationEffects(out,agreedDutyStoppedEffects(state,job),job.context,registry,failureCause);\n            log(s, state.clock, `${job.label} stopped:')
    s=once(s,'    if(job.siteId) delete s.sites[job.siteId].reservations[job.id];\n    log(s, state.clock, `${job.label} completed.',
        "    if(job.siteId) delete s.sites[job.siteId].reservations[job.id];\n    applySimulationEffects(out,agreedDutyCompletionEffects(state,job),job.context,registry,job.id);\n    if(job.commandId==='feature_society.stop_future'&&!s.jobs.some(j=>j.commandId===agreedDutySelectedCommand(state)))applySimulationEffects(out,agreedDutyRefusalEffects(state),job.context,registry,job.id);\n    log(s, state.clock, `${job.label} completed.")
    s=once(s,'    recordLorePracticeCancellation(out,job);',
        '    recordLorePracticeCancellation(out,job);\n    applySimulationEffects(out,agreedDutyCancellationEffects(out.state,job),job.context,registry,`cancel:${out.state.sequence}`);')
    return s
edit('src/simulation.js', simulation)

def wave(s):
    s=imports(s,"import {contextualBalmPresentation} from './contextual_balm_host.js';\nimport {coolingRefinementPresentation} from './cooling_refinement_host.js';\nimport {agreedDutyPresentation} from './agreed_duty_host.js';")
    s=once(s,'    sections.push(...worldCompletionPresentation(state,registry,context).sections);',
        "    sections.push(...contextualBalmPresentation(state,registry,context).sections);\n    sections.push(...coolingRefinementPresentation(state,registry,context).sections);\n    const duty=agreedDutyPresentation(state,registry,context);\n    if(duty.visible)sections.push({id:'agreed_duty',label:'A jointly agreed next duty',description:'An optional actual joint booking; original duties keep their finite stock, wages and participant consent.',actions:duty.actions.map(a=>({...a,command:{...a.command,type:'agreed_duty',sequence:state.sequence}})),records:[...(duty.agreement?[{id:'duty.agreement',text:duty.agreement.value}]:[]),...(duty.result?[{id:'duty.result',text:duty.result.note}]:[]),...(duty.paused?[{id:'duty.paused',text:duty.pauseReason}]:[])]});\n    sections.push(...worldCompletionPresentation(state,registry,context).sections);")
    return s
edit('src/feature_expansion_wave_host.js',wave)
def simulation_ui(s):
    anchor='!["home_furnishings",'
    assert s.count(anchor)==2
    return s.replace(anchor,'!["game_absorption_assay","contextual_balm","cooling_refinement","home_furnishings",')
edit('src/simulation_ui.js',simulation_ui)

def notebook(s):
    s=once(s,'    ["feature_expansion_panel","here"],','    ["feature_expansion_panel","here"], ["known_routes_panel","here"],')
    s=once(s,"'nethack_fieldcraft','game_absorption_assay'","'nethack_fieldcraft','contextual_balm','cooling_refinement','game_absorption_assay'")
    s=once(s,'&&id!=="pocket_realm_panel";', '&&id!=="pocket_realm_panel"&&id!=="known_routes_panel";')
    return s
edit('src/adventure_notebook.js',notebook)

def society(s):
    s=imports(s,"import {assertAgreedDutySocietyCommandAdmission,agreedDutySocietyCommandAdmission,agreedDutyFilterSocietyActions} from './agreed_duty_host.js';")
    s=once(s,"    const d = registry.simulation.commands.get(command.id);", "    assertAgreedDutySocietyCommandAdmission(state,command.id);\n    const d = registry.simulation.commands.get(command.id);")
    s=once(s,"            if(d.actorId !== 'player' ||", "            if(!agreedDutySocietyCommandAdmission(state,d.id).allowed)continue;\n            if(d.actorId !== 'player' ||")
    return s
edit('src/feature_expansion_society_host.js',society)

def hook(s):
    old="""        const receipt = state.simulation.knowledge.player?.['reference_gameplay.hook'];
        assert(natural(field.expiresAt) && field.expiresAt <= state.clock + 4 && field.intensity === 1 &&
            state.actors.player.completed['reference_gameplay.cool_hook'] > 0 && receipt?.cause === field.cause &&
            receipt.at + 4 === field.expiresAt && receipt.basis?.attributedTo === 'player', 'Unsupported cooling field lifetime, strength or paid attribution.');"""
    new="""        const ordinary = state.simulation.knowledge.player?.['reference_gameplay.hook'];
        const refined = state.simulation.knowledge.player?.['reference.coolingRefinement.steady_hook'];
        const supported=(receipt,command,duration)=>state.actors.player.completed[command]>0&&receipt?.cause===field.cause&&receipt.at+duration===field.expiresAt&&receipt.basis?.attributedTo==='player';
        assert(natural(field.expiresAt) && field.expiresAt <= state.clock + 5 && field.intensity === 1 &&
            (supported(ordinary,'reference_gameplay.cool_hook',4)||supported(refined,'reference_gameplay.steady_hook',5)), 'Unsupported cooling field lifetime, strength or paid attribution.');"""
    return once(s,old,new)
edit('src/reference_gameplay_host.js',hook)

def main(s):
    s=imports(s,"import {contextualBalmContext,commitContextualBalmCommand,stageContextualBalmEffectRequest} from './contextual_balm_host.js';\nimport {prepareContextualBalmNative} from './contextual_balm_native.js';\nimport {coolingRefinementContext,commitCoolingRefinementCommand} from './cooling_refinement_host.js';\nimport {commitAgreedDutyAction} from './agreed_duty_host.js';\nimport {createKnownRoutesPanel} from './known_routes_ui.js';\nimport {knownRoutesPresentation} from './known_routes_host.js';\nimport {pocketRealmView,pocketRealmActions,previewPocketRealmAction} from './pocket_realm_host.js';\nimport {proto23Presentation} from './proto23_world_host.js';")
    s=once(s,'let adventureNotebook;','let adventureNotebook;\nlet knownRoutesPanel;')
    s=once(s,"function actSimulation(command) {", "function actSimulation(command) {\n    const hostedId=id=>['game_absorption_assay','contextual_balm','cooling_refinement'].includes(expeditionRegistry.simulation.commands.get(id)?.group)||id?.startsWith('feature_society.duty.');\n    if(command.id&&hostedId(command.id))throw new Error('Choose this action in its current Here project controls.');\n    if(command.type==='cancel'&&expansionState.simulation?.jobs.some(j=>j.actorId==='player'&&hostedId(j.commandId)))throw new Error('Cancel this exact job through its Here project controls.');\n    if(['program','pause','resume'].includes(command.type)&&hostedId(expansionState.simulation?.programs.player?.commandId))throw new Error('No automatic program is registered for these project choices.');")
    # The previously acquired assay wrapper remains the outer existing facts reader.
    anchor='    return gameAbsorptionAssayContext(expansionState,expeditionRegistry,'
    line=next(l for l in s.splitlines() if l.startswith(anchor))
    s=once(s,line,'    return coolingRefinementContext(expansionState,expeditionRegistry,contextualBalmContext(expansionState,'+line[len('    return '):-1]+'));')
    s=once(s,"    if(command.type==='world_completion')plan=", "    if(command.type==='contextual_balm')plan=commitContextualBalmCommand(expansionState,expeditionRegistry,command,context,sequence);\n    else if(command.type==='cooling_refinement')plan=commitCoolingRefinementCommand(expansionState,expeditionRegistry,command,context,sequence);\n    else if(command.type==='agreed_duty')plan=commitAgreedDutyAction(expansionState,expeditionRegistry,context,command.id,sequence);\n    else if(command.type==='world_completion')plan=")
    s=once(s,"    reconcileFieldCareNative(expansionState,plan,expeditionContext());", "    reconcileFieldCareNative(expansionState,plan,expeditionContext());\n    stageContextualBalmEffectRequest(expansionState,plan,expeditionContext());")
    s=once(s,'causalNative.stage(plan)];', "causalNative.stage(plan),prepareContextualBalmNative(expansionState,plan,{activeEffects:active_effects,itemTemplates:item_templates,effectTemplates:effect_templates,ActiveEffect,refresh:()=>{update_displayed_effects();character.addActiveEffectBonus(active_effects);character.updateStatsAndDisplay();}})];")
    # Create beside existing native panels, then Notebook takes the element.
    anchor='    adventureNotebook = createAdventureNotebook({registry: expeditionRegistry,'
    block="""    knownRoutesPanel=createKnownRoutesPanel({container:document.getElementById('location_actions_div'),focusFallback:document.getElementById('journal_show_notebook'),
        read:()=>({...readProgression(),context:featureWaveContext(),inDialogue:!!current_dialogue,inCombat:!!current_combat,canWrite:ownsSave&&!foundationSaveBlocked&&!importProbeToken}),
        present:snapshot=>{
            if(snapshot.inDialogue||snapshot.inCombat)return {visible:false,section:null};
            const pocketView=pocketRealmView(snapshot.state),pocketCurrent=pocketContext(snapshot.state,snapshot.context);
            const pocketActions=pocketView.discovered?['pocket.open','pocket.enter','pocket.exit'].flatMap(id=>{
                const action=pocketRealmActions.find(a=>a.id===id),quote=previewPocketRealmAction(snapshot.state,expeditionRegistry,id,pocketCurrent);
                return quote.visible?[{...action,...quote,command:{id,sequence:snapshot.state.sequence}}]:[];
            }):[];
            return knownRoutesPresentation(snapshot,{refinement:refinementPresentation(snapshot,expeditionRegistry,{base:featureWavePresentation,relayHost,referenceDeskHost,replacementContext:backlogContext}),proto23:proto23Presentation(snapshot.state,expeditionRegistry,snapshot.context),pocket:{view:pocketView,actions:pocketActions}});
        },command:command=>command.type?actFeatureExpansion(command):actPocketRealm(command)});
"""
    s=once(s,anchor,block+anchor)
    s=s.replace('adventureNotebook?.render();','knownRoutesPanel?.render();adventureNotebook?.render();')
    return s
edit('src/main.js',main)

delta=[]
for path,(old,new) in changes.items():
    delta.extend(difflib.unified_diff(old.splitlines(True),new.splitlines(True),fromfile='a/'+path,tofile='b/'+path))
(BASE/'SHARED_JOINS.patch').write_text(''.join(delta))
(BASE/'SHARED_JOIN_INPUTS.json').write_text(json.dumps({p:hashlib.sha256(old.encode()).hexdigest() for p,(old,_) in changes.items()},indent=2)+'\n')
for path,(_,new) in changes.items(): (ROOT/path).write_text(new)
print(json.dumps({'applied':len(changes),'allStagedSyntaxPassed':True,'gameplayChecked':False}))
