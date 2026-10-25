// Lord of the Mysteries, early-Tingen Seer slice (S1-S5 of the LOTM initiation
// plan). Source qualification is pinned in docs/gm/LOTM_INITIATION_IMPLEMENTATION_PLAN_2026-10-15.md.
// Every person, place, price, count and duration here is an original authored
// proposal, not a canon claim. Definitions initialize no means.
export const LOTM_SOURCE_HASH='6126274478a95dbe03eb904bc35c409067c7022563e52997a46e98be07b2d70d';
export const LOTM_SOURCE_SNAPSHOT='LOTM-EPUB-6126274478a9-r1';
export const LOTM_IDS=Object.freeze({world:'book.lotm.tingen',supervisor:'book.lotm.supervisor',source:'book.lotm.seer',clown:'book.lotm.clown',corpse:'book.lotm.corpse_collector',gravedigger:'book.lotm.gravedigger',method:'book.lotm.material_perception',
 evernightDeacon:'book.lotm.evernight_deacon',stormOfficer:'book.lotm.storm_officer',stormDeacon:'book.lotm.storm_deacon',sailor:'book.lotm.sailor',folk:'book.lotm.folk_of_rage',seniorDeacon:'book.lotm.senior_deacon',savant:'book.lotm.savant',archaeologist:'book.lotm.archaeologist',broker:'book.lotm.broker',member:'book.lotm.member',machineryOfficer:'book.lotm.machinery_officer',
 energy:'book.lotm.spirituality',strain:'book.lotm.overflow_fatigue',site:'book.lotm.workroom_bench',situation:'book.lotm.probationer_branch',lot:'book.lotm.supplier.stock'});
export const LOTM_LOCATIONS=Object.freeze({workroom:'Tingen supervised workroom',lodging:'Tingen probationer lodging',docks:'Tingen docks',university:'Tingen university area'});
// Money is the native `money` resource, read in Tingen as pence (12 pence a soli, 20 soli a pound: 240 a pound). Source prices are in pounds and soli (LOTM F16, F17).
export const LOTM_PENCE=Object.freeze({soli:12,pound:240});
const key=id=>JSON.stringify({id});
export const LOTM_KEYS=Object.freeze({dose:key('Tingen prepared Seer dose'),comparator:key('Tingen ordinary comparator sample'),sampleA:key('Tingen supported sample lot A'),sampleB:key('Tingen supported sample lot B'),clownDose:key('Tingen prepared Clown dose'),corpseDose:key('Tingen prepared Corpse Collector dose'),gravediggerDose:key('Tingen prepared Gravedigger dose'),sealed3:key('Tingen sealed grade-3 item'),savantDose:key('Tingen prepared Savant dose'),sailorDose:key('Tingen prepared Sailor dose'),folkDose:key('Tingen prepared Folk of Rage dose'),marketSv9:key('Unmarked prepared dose (Savant line, Sequence 9)'),marketSv8:key('Unmarked prepared dose (Savant line, Sequence 8)'),marketSa9:key('Unmarked prepared dose (Sailor line, Sequence 9)'),marketSa8:key('Unmarked prepared dose (Sailor line, Sequence 8)'),archaeologistDose:key('Tingen prepared Archaeologist dose'),frog:key('Dried black-spotted frog'),marketCc9:key('Unmarked prepared dose (Sequence 9)'),marketCc8:key('Unmarked prepared dose (Sequence 8)'),hairs:key('Bundle of rare hairs'),ink:key('Grave-dust ink')});
export const LOTM_SAMPLES=Object.freeze(['comparator','sampleA','sampleB']);
// Prototype energy policy (plan D3): capacity 3, output 1, control 1, 1:1, strain limit 6, 1 per use.
export const LOTM_ENERGY=Object.freeze({id:LOTM_IDS.energy,revision:1,label:'Spirituality',capacity:3,output:1,control:1,efficiencyNumerator:1,efficiencyDenominator:1,strainLimit:6,strainPerUse:1});
export const LOTM_PRACTICE_MINUTES=5, LOTM_OBSERVE_MINUTES=1, LOTM_SLEEP_MINUTES=120;
// Digestion by acting (LTS11-LTS14): authored count of in-role acts, not a canon rate.
export const LOTM_READING_MINUTES=10, LOTM_DIGEST_ACTS=6;
// Corpse Collector (Q1) has its own authored dial, all proposals (WPR5). 4 acts: three layings-out and one vigil,
// because the Evernight line's acting is quiet, repeated handling of the dead and the church requires a wait on the previous potion (institutions pass F18, X4: three years, or
// up to half a year with acting), so a short, supervised, hands-on count suits it. 25 and 60 minutes: washing and
// shrouding takes longer than a hedged reading; a vigil is an hour in the cold room. Each act spends 1 of Hale's
// attention because the cold room is supervised, which replaces the Seer's spirituality limit: this pathway
// grants no spirituality pool (the sourced Sequence 9 abilities are bodily and perceptual).
export const LOTM_CC_ACTS=4, LOTM_CC_LAYING_MINUTES=25, LOTM_CC_VIGIL_MINUTES=60;
export const LOTM_SWITCH_NOTICE='One pathway per life. Taking a second pathway\'s potion is switching, a stated cause of loss of control, so Warden Hale issues one pathway\'s dose per probationer and withholds the other.';
