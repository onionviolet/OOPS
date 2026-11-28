// Held-out edges are bound to the host's own role ladders. A missing book
// rule (for example the Commander's post-merge level) is left to that owner.
export const roleCases = [
    {id:'azarinth',sources:[
        ['az.custom.class-system','zh ch6 p81'],['az.custom.fire-mage','zh ch18 p24,29'],
        ['az.custom.guardian-progression','zh b1 ch37 p92']],
        slots:[{}, {requires:'qualifies'}],changes:{'take-second':{from:[],to:'second'}}},
    {id:'dragoneye',sources:[['bdm.institution.system','zh ch50 p103']],
        slots:[{},{}],changes:{'change-class':{from:['second-class'],to:'firebug',start:7,tracks:{practice:7}}}},
    {id:'wandering-inn',sources:[['twi.other.dual-class-leveling','en b11 c11 p24'],['twi.other.class-merge','en b2 c38 p113']],
        slots:[{},{}],changes:{'merge-commander':{from:['warrior','strategist'],to:'commander',requires:'sufficientLevels',requiresEntry:true}}}
];
