// One named source document, en v1 ch55 P006–P019. The item key owns its
// identity; knowledge of the details and later recollection live elsewhere.
export const ANNA_DETAILS_ID='book.lotm.anna_written_details';
export const ANNA_DETAILS_KEY=JSON.stringify({id:ANNA_DETAILS_ID});
export const ANNA_ID='lotm.person.cast-aa2181a89caa75eede0e';
export const ANNA_ADVICE_KEY='book.lotm.kj3aa.advice.received';
export const ANNA_MEMORY_KEY='book.lotm.kj3aa.details.memorized';
// World-owned content data. Shared native catalog code handles registration.
export const lotmDivinationItems=Object.freeze([{id:ANNA_DETAILS_ID,name:'Anna’s written details',description:'The identity and birth details Anna wrote for this divination session.',value:0,tags:{document:true}}]);
