// First reader-to-game handoff: lotm.institution.material-quota, zh ch127 p32.
// Canon: that month's allocation was exhausted; personal purchase is an alternative.
// This EXTRA local requisition, eligibility, capacity, contents and times are authored defaults, not a refill rule.
export const CHARM_MATERIAL_APPROVAL = 'lotm.craft.slumber-practice-approval';
export const CHARM_MATERIAL_ISSUE = 'lotm.craft.slumber-office-materials';
export const CHARM_MATERIAL_ORDER = JSON.stringify({id:'book.lotm.slumber_material_order'});
export const CHARM_MATERIAL_PAYER = 'lotm.charm.slumber.material-payer';
export const CHARM_MATERIAL_DIALS = Object.freeze({allocationPackets:1,approvalMinutes:5,collectionMinutes:5});
export const charmMaterialItems = [['slumber_material_order','Signed Slumber material order','A local office approval for one Slumber practice packet, separate from the monthly material allocation.']];
const silver=JSON.stringify({id:'book.lotm.slumber_silver'}),supplies=JSON.stringify({id:'book.lotm.slumber_supplies'});
const fact=(key,value)=>({type:'fact',scope:'actor',key,value});

export function charmMaterialFacts(state,dials=CHARM_MATERIAL_DIALS) {
    const issued=state.actors?.player?.completed?.[CHARM_MATERIAL_APPROVAL+'.approve']||0;
    return {'charm.slumber.officeCredit':Math.max(0,dials.allocationPackets-issued)};
}

export function charmMaterialActs(workshop,dials=CHARM_MATERIAL_DIALS) {
    const row=(id,label,step)=>({id,kind:'item_use',label,sourceIds:['lotm.institution.material-quota'],locators:['zh 第127章 p32'],
        steps:[step],eligibility:null,inputs:[],effects:[]});
    const office='lotm.place.night-watch-reception';
    const noCredit='This local practice request has no material credit left. You can still order supplies with your own money.';
    const approved={fact:`item.${CHARM_MATERIAL_ORDER}`,op:'gte',value:1,reason:'Ask the office to approve the practice requisition first.'};
    return {rows:[row(CHARM_MATERIAL_APPROVAL,'A local practice requisition',{id:'approve',kind:'prepare',text:'Ask reception to approve an extra Slumber practice packet.'}),
        row(CHARM_MATERIAL_ISSUE,'Office Slumber materials',{id:'collect',kind:'prepare',text:'Exchange the signed material order for the office-funded practice materials.'})],
    bindings:{
        [CHARM_MATERIAL_APPROVAL]:{place:office,visibleWhen:workshop.commissioned,support:workshop.commissioned,
            requires:{fact:'charm.slumber.officeCredit',op:'gte',value:1,reason:noCredit},reason:noCredit,inputs:{},
            steps:{approve:{label:'Request a Slumber practice packet',
                description:'Ask reception to approve an extra packet for your workshop practice. This local request is separate from the monthly material allocation; it does not renew that allocation.',
                minutes:dials.approvalMinutes,costs:[],costText:'An available local practice credit; your own money is not charged',
                reportKey:'book.lotm.history.slumber.material-approved',report:'Reception signs a local material order for your Slumber practice. This extra request is separate from the monthly allocation.',
                effects:[{type:'item',key:CHARM_MATERIAL_ORDER,amount:1}]}}},
        [CHARM_MATERIAL_ISSUE]:{place:office,visibleWhen:workshop.commissioned,support:workshop.commissioned,requires:approved,reason:approved.reason,inputs:{},
            steps:{collect:{label:'Collect office-funded Slumber materials',
                description:'Hand over the signed local order. Reception issues a rectangular silver blank and a ritual packet; read the workshop instructions included with them.',
                minutes:dials.collectionMinutes,costs:[{type:'item',key:CHARM_MATERIAL_ORDER,amount:-1}],costText:'The signed material order; the office supplies the materials',
                reportKey:'book.lotm.history.slumber.office-materials',report:'You exchange the signed order for the silver and ritual packet. The office pays for this practice packet; your purse is unchanged.',
                effects:[{type:'item',key:silver,amount:1},{type:'item',key:supplies,amount:1},fact('lotm.charm.slumber.notes',true),fact(CHARM_MATERIAL_PAYER,'office')]}}},
    }};
}
