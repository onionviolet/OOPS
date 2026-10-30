// Scene card (SUI2, SUI5-SUI10, SUI13): a scene kind supplies a plain data object and this
// module draws the slots, so a new kind costs data, not DOM. Draws only into the node it is
// given and creates elements through that node's document, so pop-out windows work (MDL13).
//
// scene = {
//   kind, id,                                   // data-scene-kind / data-scene-id
//   attrs: {camelName: value},                  // extra data-* on the card (game-owned hooks)
//   header: {lead, place, title, time},         // parts joined with " · ", empty parts skipped
//   stakes: 'one sentence',                     // first body line (SUI9)
//   people: [{id, name}],                       // chips; click calls hooks.onPerson(id) (SUI10)
//   options: [{id, label, time, cost, affects, attrs, blocked, disabled, onChoose}],
//   result: 'text',
//   onward: [{label, time, onGo}],              // what is next, with the quoted travel time (SUI13)
// }
// blocked is the reason text naming what is missing (SUI5); it prints beside the row, not only in a title.
// disabled greys a row with no reason to give (the whole surface is paused).
const joinParts=(parts)=>parts.filter(Boolean).join(' · ');
export function sceneHeaderText(header={}) {
    return joinParts([header.lead,header.place,header.title,header.time]);
}
// SUI6: time, cost and who is affected quoted before the click.
export function sceneQuoteText(option={}) {
    return joinParts([option.time,option.cost,option.affects]);
}
// SUI8: one card at a time; the rest wait in the upcoming strip in time order.
export function pickCurrentScene(scenes=[]) {
    const ordered=scenes.map((scene,index)=>({scene,index})).sort((a,b)=>(a.scene.at??Infinity)-(b.scene.at??Infinity)||a.index-b.index).map(v=>v.scene);
    return {current:ordered[0]||null,upcoming:ordered.slice(1)};
}
export function renderSceneCard(host,scene,hooks={}) {
    const doc=host.ownerDocument||globalThis.document;
    const make=(tag,className,text)=>{const n=doc.createElement(tag);if(className)n.className=className;if(text)n.textContent=text;return n;};
    const card=make('section','scene-card');
    if(scene.kind)card.dataset.sceneKind=scene.kind;
    if(scene.id)card.dataset.sceneId=scene.id;
    Object.assign(card.dataset,scene.attrs||{});
    const header=sceneHeaderText(scene.header);
    if(header)card.append(make('p','scene-card-header',header));
    if(scene.stakes)card.append(make('p','scene-card-stakes',scene.stakes));
    if(scene.people?.length) {
        const people=make('div','scene-card-people');
        for(const person of scene.people) {
            const chip=make('button','scene-card-person',person.name);chip.type='button';chip.dataset.personId=person.id;
            chip.addEventListener('click',()=>hooks.onPerson?.(person.id));people.append(chip);
        }
        card.append(people);
    }
    for(const option of scene.options||[]) {
        const row=make('div','scene-card-option');
        const button=make('button','',option.label);button.type='button';
        Object.assign(button.dataset,option.attrs||{});
        const quote=sceneQuoteText(option);
        row.append(button);
        if(quote)row.append(make('small','scene-card-quote',quote));
        if(option.blocked) {
            button.disabled=true;button.title=option.blocked;
            const reason=make('small','scene-card-blocked',option.blocked);
            reason.dataset.sceneBlocked='';row.append(reason);
        } else if(option.disabled)button.disabled=true;
        else button.addEventListener('click',()=>option.onChoose?.(option));
        card.append(row);
    }
    if(scene.result)card.append(make('p','scene-card-result',scene.result));
    if(scene.onward?.length) {
        const onward=make('div','scene-card-onward');
        for(const step of scene.onward) {
            const go=make('button','',joinParts([step.label,step.time]));go.type='button';
            go.addEventListener('click',()=>step.onGo?.(step));onward.append(go);
        }
        card.append(onward);
    }
    host.append(card);
    return card;
}
