// Thin local adapter (prototype): binds the place clock to the existing home, inventory and plan/commit path.
// Needs one main.js release by the home owners: import this file and call hostPlaceClock({...}) once.
import {applyGameplayEffect} from './gameplay_transactions.js';
import {configurePlaceClock,quotePlaceClock,executePlaceClock,projectPlaceClock,placeClockState} from './owned_place_clock.js';
import {createPlaceClockPanel} from './owned_place_clock_panel.js';
export function hostPlaceClock({homes,expansion,character,locationId,inventory,gameplaySnapshot,assertSpend,commit,log}) {
    const read=()=>({clock:expansion().clock,money:character().money,location:locationId(),inventory:inventory(),
        owned:Object.entries(homes()?.properties||{}).filter(([,h])=>h.tenure==='owned').map(([id])=>id),observerMeans:[]});
    let panel;
    configurePlaceClock({read,log,refresh:()=>panel?.render(),
        settle:({money,items,state})=>{
            const plan={state:structuredClone(expansion()),external:{money:character().money+money},gameplay:gameplaySnapshot()};
            for(const row of items){if(row.delta<0)assertSpend(row.key);applyGameplayEffect(plan.gameplay,{type:'item',key:row.key,amount:Math.abs(row.delta)},'player',row.delta<0);}
            plan.nativePatch={...plan.nativePatch,placeClocks:structuredClone(state)}; // same durable write: createSave runs before the module slice is published
            commit(plan);
        },
        mountPanel:()=>{panel=createPlaceClockPanel({read,state:placeClockState,quote:quotePlaceClock,execute:r=>{const out=executePlaceClock(r);panel?.render();return out;},project:projectPlaceClock});}});
    return {render:()=>panel?.render()};
}
