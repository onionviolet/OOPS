import {validateExposure,createExposure,setHazardousMode,exposureEffects,gustTerms,FAMINE} from './exposure.js';
export function exposureStatus(raw, context={}, knownSkills=[]) {
    const state=validateExposure(raw)??createExposure(), effects=exposureEffects(state,context);
    const famine=knownSkills.includes(FAMINE.skillId)
        ? `Famine: ${FAMINE.xpPerMinute} XP per eligible underfed played minute; ${state.famineRemainder.toFixed(4)} XP pending.`
        : 'Underfed played time can develop an adaptation. No activity is required.';
    const terms=gustTerms(context),cost=Number(terms.staminaPerMinute.toFixed(4));
    const protection=context.coldHardened===true?' Weathered skin is active on this body.':'';
    const current=effects.exposed?` Current gust: ${effects.temperatureOffset}°C; ${cost} stamina/minute.`:' No gust cost is applying now.';
    return `${famine} Hazardous storm/gust profile ${state.hazardousEnabled?'on':'off'}. ${effects.active?`${state.phase}, ${state.remaining.toFixed(1)} played minutes remaining; ${effects.exposed?'outside exposure':'sheltered or resting'}`:'paused'}. Risk: outdoor gusts cost up to ${cost} stamina/minute and add ${terms.temperatureOffset}°C; shelter blocks exposure.${protection}${current} No health damage or hunger death.`;
}
// Uses text only; no VFX, so Effects-off and reduced-motion need no exception.
export function mountExposurePanel({host,getState,getContext,getKnownSkills=()=>[],onChange}) {
    if(!host || typeof getState!=='function' || typeof getContext!=='function' || typeof onChange!=='function')
        throw new Error('Exposure panel requires native host callbacks');
    const doc=host.ownerDocument, panel=doc.createElement('section');panel.dataset.exposurePanel='true';
    const label=doc.createElement('label'), input=doc.createElement('input');input.type='checkbox';input.dataset.exposureHazardous='true';
    label.append(input,doc.createTextNode('Hazardous storm/gust profile (proposal, off by default)'));
    const status=doc.createElement('p');status.dataset.exposureStatus='true';panel.append(label,status);host.append(panel);
    function render() {input.checked=(validateExposure(getState())??createExposure()).hazardousEnabled;status.textContent=exposureStatus(getState(),getContext(),getKnownSkills());}
    input.addEventListener('change',()=>{try{onChange(setHazardousMode(getState(),input.checked));render();}catch(error){render();status.textContent=error.message;}});
    render();return {render,destroy:()=>panel.remove()};
}
