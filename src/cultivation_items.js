// Physical carriers shared by the existing native item/home owners.
export const CLUTCH='Mistglass Cloudseed beetle clutch';
export const SEALED_CONDENSATE='Mistglass sealed condensate';
export const QI_CRADLE='Home condensate cradle';
export const QI_FIELD='home.cultivation.seeded_mist';
export const QI_FIELD_MINUTES=240;
export function registerCultivationItems(templates,Item){
 templates[CLUTCH] ||= new Item({id:CLUTCH,name:'Cloudseed beetle clutch',value:8,description:'Two captive-bred Cloudseed beetle eggs. A fitted household cradle and actual condensate field support incubation; this packet grants no grown familiar.',tags:{domicile:true},saturates_market:false});
 templates[SEALED_CONDENSATE] ||= new Item({id:SEALED_CONDENSATE,name:'Sealed Mistglass condensate',value:3,description:'One native condensate sealed into a paid Cloudseed carrier. It is no longer in the original reserve. A fitted household cradle can release its finite field.',tags:{domicile:true},saturates_market:false});
}
