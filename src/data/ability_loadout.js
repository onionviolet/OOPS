export const VILLAGE_ABILITY_LOADOUT={
    world:'base.frontier',
    unlock:{track:'Sleeping',level:1},
    groups:{active:{capacity:1,cost:{minutes:12}}},
    defaults:{active:['ordinary-sleep']},
    abilities:[
        {id:'ordinary-sleep',name:'Ordinary sleep',groups:['active'],description:'Rest at the usual rate.'},
        {id:'steady-breath',name:'Steady breath',groups:['active'],effects:{sleepStamina:3},
            description:'Recover up to 3 extra stamina per sleep minute, limited by what is missing.'},
        {id:'gentle-position',name:'Gentle position',groups:['active'],effects:{sleepHealth:3},
            description:'Recover up to 3 extra health per sleep minute, limited by what is missing.'},
    ],
};
