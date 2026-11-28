import {registerDomain} from './domain_registry.js';
import {activityTitles,emptyActivity,readActivity,scoreActivity,dominantTitle} from './activity_title.js';
let ports,state=emptyActivity();
export function configureActivityTitle(context,report) {ports={context,report};}
function title(context,saved) {
    const rule=activityTitles[context.world];
    return rule && saved.life===context.life ? dominantTitle(rule,saved) : undefined;
}
export function showActivityTitle() {
    const el=globalThis.document?.getElementById('activity_title');
    if(!el||!ports)return;
    const current=title(ports.context(),state);
    el.hidden=!current;
    if(current)el.textContent=`Life title: ${current}`;
}
export function publishActivity(plan) {
    const next=plan.nativePatch?.activity_title;
    if(!next||!ports)return;
    const context=ports.context(), before=title(context,state);
    state=readActivity(next);
    const current=title(context,state);
    if(current&&current!==before)ports.report(`Your recent activity earned the life title ${current}.`);
    if(current!==before)showActivityTitle();
}
registerDomain({id:'activity_title',initialState:emptyActivity,validate:readActivity,
    load:raw=>{state=readActivity(raw);showActivityTitle();},
    save:()=>Object.keys(state.scores).length?readActivity(state):undefined,
    stage:plan=>{
        if(!ports||plan.replacementEnvelope)return;
        const context=ports.context(),rule=activityTitles[context.world], minutes=plan.state.clock-context.clock;
        if(!rule||minutes<=0||plan.state.actors.player.worldId!==context.world)return;
        const kind=plan.nativeLocation&&plan.nativeLocation!==context.place?'travel':context.kind;
        if(!kind&&!Object.keys(state.scores).length)return;
        plan.nativePatch={...plan.nativePatch,activity_title:scoreActivity(rule,state,context.life,kind,minutes)};
    }});
