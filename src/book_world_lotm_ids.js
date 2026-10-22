// Lord of the Mysteries, early-Tingen Seer slice (S1-S5 of the LOTM initiation
// plan). Source qualification is pinned in docs/gm/LOTM_INITIATION_IMPLEMENTATION_PLAN_2026-10-15.md.
// Every person, place, price, count and duration here is an original authored
// proposal, not a canon claim. Definitions initialize no means.
export const LOTM_SOURCE_HASH='6126274478a95dbe03eb904bc35c409067c7022563e52997a46e98be07b2d70d';
export const LOTM_SOURCE_SNAPSHOT='LOTM-EPUB-6126274478a9-r1';
export const LOTM_IDS=Object.freeze({world:'book.lotm.tingen',supervisor:'book.lotm.supervisor',source:'book.lotm.seer',clown:'book.lotm.clown',method:'book.lotm.material_perception',
 energy:'book.lotm.spirituality',strain:'book.lotm.overflow_fatigue',site:'book.lotm.workroom_bench',situation:'book.lotm.probationer_branch',lot:'book.lotm.supplier.stock'});
export const LOTM_LOCATIONS=Object.freeze({workroom:'Tingen supervised workroom',lodging:'Tingen probationer lodging'});
const key=id=>JSON.stringify({id});
export const LOTM_KEYS=Object.freeze({dose:key('Tingen prepared Seer dose'),comparator:key('Tingen ordinary comparator sample'),sampleA:key('Tingen supported sample lot A'),sampleB:key('Tingen supported sample lot B'),clownDose:key('Tingen prepared Clown dose')});
export const LOTM_SAMPLES=Object.freeze(['comparator','sampleA','sampleB']);
// Prototype energy policy (plan D3): capacity 3, output 1, control 1, 1:1, strain limit 6, 1 per use.
export const LOTM_ENERGY=Object.freeze({id:LOTM_IDS.energy,revision:1,label:'Spirituality',capacity:3,output:1,control:1,efficiencyNumerator:1,efficiencyDenominator:1,strainLimit:6,strainPerUse:1});
export const LOTM_PRACTICE_MINUTES=5, LOTM_OBSERVE_MINUTES=1, LOTM_SLEEP_MINUTES=120;
// Digestion by acting (LTS11-LTS14): authored count of in-role acts, not a canon rate.
export const LOTM_READING_MINUTES=10, LOTM_DIGEST_ACTS=6;
