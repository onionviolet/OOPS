export const resetCases=[
    {id:'dcc.character-actor',source:'dcc.reset.character-actor-floor',locator:'en b2 c1 p115',triggers:['floorComplete'],
        span:'one floor',resets:['temporarySpecialtyAbilities','specialtyPenalties'],keeps:['previousAbilities'],remembers:null,ends:['floorComplete']},
    {id:'ph.puzzle',source:'ph.reset.puzzle-box-level-retry',locator:'en b10 c41 p13',triggers:['structureCollapse'],
        span:null,resets:['layout','formations','weakPoints','height'],keeps:['difficulty','objective'],remembers:null,ends:['levelSolved']},
    {id:'hwfwm.realm-arrival',source:'hwfwm.reset.arrival-reversion',locator:'en b10 c43 p47',triggers:['realmReversion'],
        span:'since realm entry',resets:['physicalState','mentalState','episodicMemory'],keeps:['emotionalImprint'],remembers:null,ends:null},
    {id:'mnl.school-layer',source:'mnl.reset.loop-death-restart',locator:'en b1 c21 p22',triggers:['death'],
        span:'about one month',resets:['position','politicalWork','paperwork'],keeps:['previousRunMemory'],remembers:['Dunai'],ends:null},
    {id:'mnl.recursion',source:'mnl.reset.recursion-checkpoint',locator:'en b2 c7 p21',triggers:['scenarioTimeout','earlyStop'],
        span:'about one minute',resets:['positions','injuries','deaths','outcome'],keeps:['answers','plans'],remembers:['Euryphel'],ends:['checkpointDissolves']},
];
