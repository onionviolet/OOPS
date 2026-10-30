// Owns native clock dispatch, not time state or durable publication (AR3).
// Grouped ports retain live bindings; all existing boundary/clipping decisions
// and transaction ordering are preserved by the structural extraction (AR9).
// Module export for side-by-side fixtures; no UI or persisted setting.
let stepSpansForTests = false;
import {TEMPO_SCHEMA,TEMPO_FACT_HELD,recordTempoHold} from './tempo_fight_contract.js';
export function setClockSpanModeForTests(mode) {
    if(!['span', 'stepped'].includes(mode)) throw new Error('Unknown clock fixture mode.');
    stepSpansForTests = mode === 'stepped';
}
export function createClockOwner({clock, save, body, world, ui}) {
    //update game time
    function update_timer(time_in_minutes, source = null) {
        if(stepSpansForTests && time_in_minutes > 1) time_in_minutes = 1;
        if(clock.authorityOperationBusy||clock.authorityBootError)return 0;
        if(body.nativeLifeEnded())return 0;
        if(world.optionalPackState.pendingStructured&&!world.optionalPackState.structured)return 0;
        if(Object.values(world.optionalPackState.packs).some(r=>r.active)) {
            if(save.importProbeToken||!save.ownsSave||save.foundationSaveBlocked||save.is_loading_error||save.lifeStorageFailure)return 0;
            const minutes=time_in_minutes??1;
            try {
                // Use the same joined clock and durable boundary as native played
                // time. World-scoped consumers retain their existing absence policy.
                const plan=clock.advanceChroniclePlan({state:clock.expansionState,external:{money:body.character.money},gameplay:save.gameplaySnapshot()},minutes);
                const consumed=plan.state.clock-clock.expansionState.clock;
                if(!consumed)return 0;
                const {state:next,pay,settled}=world.advancePackSettlement(world.optionalPackState,world.optionalPacks,consumed);
                plan.external.money+=pay;
                plan.nativePatch={...plan.nativePatch,content_packs:world.packSaveState(next,world.optionalPacks)};
                save.persistExpansion(plan);
                world.optionalPackState=next;ui.optionalPackPanel?.render();ui.update_displayed_time();
                for(const s of settled)ui.log_message(`${s.label} finished${s.pay?`; earned ${s.pay} wood coins`:''}.`,'notification');
                return consumed;
            }catch(error){ui.log_message('Optional work paused: '+error.message,'notification');return 0;}
        }
        if(world.backlogNativeClockPaused(clock.expansionState)){ui.backlogPanel?.render();ui.replacementRecognitionPanel?.render();ui.backlogOpeningPanel?.render();ui.knownRoutesPanel?.render();ui.adventureNotebook?.render();ui.livingGearPanel?.render();ui.combatOptionsPanel?.render();return 0;}
        const was_night = clock.is_night(clock.current_game_time);
        let minutes = time_in_minutes ?? (clock.expansionState.p23Reading?.current?.kind==='rest' ? clock.longRestClockRequest(clock.expansionState.p23Reading,clock.studyContext()) : body.is_sleeping ? world.config.time_speedup_when_sleeping : 1);
        if(world.p23Leisure?.pending&&world.p23Leisure.pending.due>clock.expansionState.clock)minutes=Math.min(minutes,world.p23Leisure.pending.due-clock.expansionState.clock);
        if(world.p23Leisure?.pending&&world.p23Leisure.pending.due<=clock.expansionState.clock){try{save.persistExpansion(clock.p23Plan());}catch(error){ui.log_message(error.message,'notification');return 0;}}
        minutes=clock.mistglassNextBoundary(clock.expansionState,clock.expansionState.clock+minutes)-clock.expansionState.clock;
        if(minutes === 0) return 0;
        const heldNow=time_in_minutes==null?clock.expansionState.actors?.player?.facts?.[TEMPO_FACT_HELD]||0:0,heldStep=Math.min(heldNow,60);
        minutes+=heldStep;
        if(clock.usesJoinedClock()) {
            if(save.importProbeToken || !save.ownsSave || clock.expansionError || save.foundationSaveBlocked || save.is_loading_error || body.nativeLifeEnded()) return 0;
            // An open tempo fight waits indefinitely; its away minutes are kept for after (LSD315, LSD317).
            if(clock.expansionState.simulation?.sessions.player?.nativeBattle?.schema===TEMPO_SCHEMA)recordTempoHold(time_in_minutes??1);
            if(clock.expansionState.simulation?.sessions.player || clock.waitingSimulationChoice(clock.expansionState)) {ui.frontierCampaignPanel?.render();ui.featureExpansionPanel?.render();ui.foundationInteractionPanel?.render();ui.causalStoryPanel?.render();ui.simulationPanel?.render(); ui.pursuitPanel?.render(); ui.fieldPanel?.render(); ui.promisePanel?.render(); ui.crushSocialPanel?.render(); ui.managementPanel?.render(); ui.knownRoutesPanel?.render();ui.adventureNotebook?.render();ui.livingGearPanel?.render();ui.combatOptionsPanel?.render(); return 0;}
            if(clock.expansionState.chronicle?.session?.policy === "manual") {ui.chroniclePanel?.render(); return 0;}
            try {
                const response = clock.expansionState.chronicle && clock.automaticResponse(clock.expansionState.chronicle);
                const pendingJourney=clock.expansionState.actors.player.facts['original_frontier.travel.remaining']>0;
                const readFrame=clock.stepperRenderSuppressed&&!response&&!pendingJourney?clock.createPlanningReadFrame():null;
                const plan = response ? clock.makeChroniclePlan({type: "respond", action: response}) : pendingJourney ? clock.advanceFrontierJourney({state:clock.expansionState,external:{money:body.character.money},gameplay:save.gameplaySnapshot()},minutes) : clock.advanceChroniclePlan({state: clock.expansionState, external: {money: body.character.money}, gameplay: save.gameplaySnapshot()}, minutes, source === "travel",readFrame);
                const consumed = plan.state.clock - clock.expansionState.clock;
                if(heldStep&&!response){const left=heldNow-Math.min(heldStep,consumed),facts=plan.state.actors.player.facts;if(left>0)facts[TEMPO_FACT_HELD]=left;else delete facts[TEMPO_FACT_HELD];}
                save.persistExpansion(plan,{}, {},readFrame);
                world.domainRegistry.tick(consumed);
                if(was_night !== clock.is_night(clock.current_game_time)) body.character.updateStatsAndDisplay();
                if(body.nativeLifeEnded()) {if(body.current_combat) body.end_combat(); body.character.is_alive = false;}
                if(!ui.deferWhileHidden(ui.renderClockPanels,ui.renderClockPanels))ui.renderClockPanels();
                return consumed;
            } catch(error) {
                console.error("Joined clock paused:", error); ui.log_message(`Progress paused: ${error.message}`, "notification");
                if(clock.expansionState.chronicle?.session && !save.foundationSaveBlocked) {
                    save.persistExpansion(clock.makeChroniclePlan({type: "policy", policy: "manual"}));
                    clock.chroniclePauseReason = `Prepared plan stopped: ${error.message} Withdraw or choose a supported response.`;
                } else clock.expansionError ||= error.message;
                ui.chroniclePanel?.render(true); return 0;
            }
        }
        if(save.importProbeToken||!save.ownsSave||save.foundationSaveBlocked||clock.expansionError||save.is_loading_error)return 0;
        const readFrame=clock.stepperRenderSuppressed?clock.createPlanningReadFrame():null;
        try{save.persistExpansion(clock.advanceChroniclePlan({state:clock.expansionState,external:{money:body.character.money},gameplay:save.gameplaySnapshot()},minutes,source==='travel',readFrame),{}, {},readFrame);}
        catch(error){console.error('Native clock paused:',error);ui.log_message(error.message,'notification');return 0;}
        ui.refreshCustomization();

        //character.updateStatsAndDisplay(); //done every second, probably only used for day-night cycle at this point
        const daynight_change = was_night !== clock.is_night(clock.current_game_time);
        if(daynight_change) {
            body.character.updateStatsAndDisplay();
        }

        ui.update_displayed_time();
        ui.awakenOptionalStart();
        return minutes;
    }

    return update_timer;
}
