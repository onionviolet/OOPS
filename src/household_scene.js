import {createMeterBar} from './meter_bar.js';
import {HOUSEHOLD, householdAnimalView} from './absorb_p23/household/model.js';
// A bounded illustration of the existing public household projection. Positions
// compose the drawing; they are not additional simulated locations or pathfinding.
export function projectHouseholdScene(state, context, name='Moss') {
    if(!context?.atHome||!context.homeOwned||!context.controlled||!context.alive)return null;
    const observed=householdAnimalView(state,context);
    return {subjectKey:context.homeId,hearth:context.hearthOwned?{fuel:state?.hearth?.fuelMinutes||0,capacity:HOUSEHOLD.burnMinutes,ventilated:state?.hearth?.ventilated!==false,smoke:state?.hearth?.smoke||0}:null,
        animal:observed?{...observed,name}:null};
}
export function createHouseholdScene(doc=document) {
    const node=doc.createElement('figure');node.className='household-scene';
    const hearth=doc.createElement('div'),animal=doc.createElement('div'),caption=doc.createElement('figcaption'),flame=doc.createElement('span'),hearthText=doc.createElement('span'),meter=createMeterBar(doc),fixtures=doc.createElement('div'),fixtureViews=new Map();
    const animalText=doc.createElement('p'),animalDetails=doc.createElement('details'),animalSummary=doc.createElement('summary'),animalHistory=doc.createElement('p'),animalPreference=doc.createElement('p');
    const cat=doc.createElement('span');cat.className='household-cat-face';cat.setAttribute('aria-hidden','true');animal.prepend(cat);
    animalDetails.dataset.householdAnimalHistory='';animalSummary.textContent='Moss · habits and history';animalDetails.append(animalSummary,animalHistory,animalPreference);animal.append(animalText,animalDetails);
    flame.className='household-scene-flame';flame.setAttribute('aria-hidden','true');flame.textContent='♨';hearth.append(flame,hearthText,meter.node);fixtures.className='household-scene-fixtures';
    hearth.className='household-scene-hearth';animal.className='household-scene-animal';node.append(hearth,animal,fixtures,caption);
    return {node,update(view){
        node.hidden=!view||(!view.hearth&&!view.animal&&!view.fixtures?.length);if(!view)return;
        hearth.hidden=!view.hearth;animal.hidden=!view.animal;
        if(view.hearth){hearth.dataset.lit=String(view.hearth.fuel>0);flame.textContent=view.hearth.fuel>0?'♨':'▱';hearthText.textContent=` Hearth · ${view.hearth.fuel} played minutes of fuel · ${view.hearth.ventilated?'vent open':'vent closed'}${view.hearth.smoke?' · smoke present':''}`;meter.update({id:'household-fuel',label:'Prepaid hearth fuel',kind:'pool',value:view.hearth.fuel,max:view.hearth.capacity,note:'Played minutes of prepaid hearth fuel. Light it with a carried log; an enabled stocked firewood pile can keep it burning while you are home. This is not a temperature or ambient-light reading.'});}
        if(view.animal){animal.dataset.mood=view.animal.mood;cat.textContent=view.animal.mood==='content'?'ฅ(=^･ω･^=)ฅ':'ฅ(=･ω･=)ฅ';animalText.textContent=`${view.animal.name} · ${view.animal.mood} · bond ${view.animal.bond}/100. ${view.animal.posture}`;
            animalHistory.textContent=`Met at journey minute ${view.animal.metAt} · known for ${view.animal.knownMinutes} played minutes · ${view.animal.playVisits} play visits.`;
            animalPreference.hidden=!view.animal.preference;animalPreference.textContent=view.animal.preference||'';}
        const live=new Set();for(const row of view.fixtures||[]){live.add(row.id);let entry=fixtureViews.get(row.id);if(!entry){const detail=doc.createElement('details'),summary=doc.createElement('summary'),text=doc.createElement('p');detail.append(summary,text);fixtures.append(detail);entry={detail,summary,text};fixtureViews.set(row.id,entry);}entry.summary.textContent=`${row.name} · ${row.active?'Active here':`Available at ${row.scope}`}`;entry.text.textContent=row.description;}
        for(const [id,entry]of fixtureViews)if(!live.has(id)){entry.detail.remove();fixtureViews.delete(id);}
        caption.textContent='Your known home. The picture follows the current hearth and animal state; its layout is illustrative.';
    }};
}
