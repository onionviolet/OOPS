import {getPacingState,pacingEffects,setPacingOption,nourishmentFor} from './pacing.js';
export function pacingStatus(raw, context={}) {
    const e=pacingEffects(raw,context);
    const fullness=raw.fullness.toFixed(1);
    const scope=e.active?'Home-world pacing':'Home-world pacing paused outside the home world';
    return `${scope}. Hunger ${raw.hungerEnabled?`${fullness}/100, XP ×${e.hungerEfficiency.toFixed(3)}`:'off (native pacing)'}. Weather ${raw.weatherEnabled?`${e.weatherLabel}, ${Math.ceil(e.remaining)} played minutes remaining${context.outdoors?'':'; sheltered'}`:'off (native weather)'}. Total XP ×${e.efficiency.toFixed(3)}. Temperature ${e.temperatureOffset>=0?'+':''}${e.temperatureOffset}°C over native temperature. Native rain is retained.`;
}
export function foodPacingDescription(item) {
    const gain=nourishmentFor(item);
    return gain?`Optional hunger: restores up to ${Number(gain.toFixed(1))}/100 fullness.`:'';
}
// Integrator owns persistence and calls onChange only after its save guard succeeds.
export function mountPacingPanel({host, getState=getPacingState, getContext=()=>({}), onChange}) {
    if(!host || typeof onChange!=='function') throw new Error('Pacing panel requires host and change action');
    const doc=host.ownerDocument;
    const panel=doc.createElement('section');panel.dataset.homePacing='true';
    const title=doc.createElement('strong');title.textContent='Optional home-world pacing';panel.append(title);
    const status=doc.createElement('p');status.dataset.pacingStatus='true';panel.append(status);
    const controls=[];
    for(const [option,label] of [['hungerEnabled','Hunger'],['weatherEnabled','Weather']]) {
        const row=doc.createElement('label');const input=doc.createElement('input');input.type='checkbox';input.dataset.pacingOption=option;
        input.addEventListener('change',()=>{try{onChange(setPacingOption(getState(),option,input.checked));render();}catch(error){render();status.textContent=error.message;}});
        row.append(input,doc.createTextNode(label));panel.append(row);controls.push([input,option]);
    }
    const help=doc.createElement('p');help.textContent='Both start off to preserve existing pacing. Hunger drains over eight played hours and changes earned XP from 80% to 100%; native food refills it. Weather adds small outdoor temperature changes and fog gives 95% earned XP. Home world only; no offline drain. Turning an option off freezes its meter or duration.';panel.append(help);host.append(panel);
    function render() {const state=getState();status.textContent=pacingStatus(state,getContext());for(const [input,option] of controls)input.checked=state[option];}
    render();return {render,destroy:()=>panel.remove()};
}
