// Synthetic owned-home setup, never a personal save or natural acquisition claim.
export const WOOD_KEY=JSON.stringify({id:'Rough wood log'});
export const QUALITY_WOOD_KEY=JSON.stringify({id:'Rough wood log',quality:75});
export function firewoodFixture(raw) {
    const save=structuredClone(raw);
    save['current location']='Shack';save.availabilities.location.Shack=1;
    save.locations.Shack={...save.locations.Shack,housing_unlocked:true};
    save.expansion.actors.player.facts['household.shackHearthInstalled']=true;
    save.inventories.person.main_character[WOOD_KEY]={count:8};
    save.inventories.person.main_character[QUALITY_WOOD_KEY]={count:2};
    delete save.household;
    return save;
}
export const carriedWood=(save,key=WOOD_KEY)=>save.inventories.person.main_character[key]?.count??0;
