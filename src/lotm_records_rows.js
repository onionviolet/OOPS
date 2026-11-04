// R6 rows (ch65 P007-P060, ch66 P001-P034): the stack Old Neil brings from Chanis Gate. Texts are own-words summaries of what the page
// gives the lead; they claim no more than the source states. Grades are Sequence bands in LOTM_RECORDS_CLEARANCE (7 open on Dunn's note,
// 6 and 5 beyond it). Minutes, the Sequence 6 page and the captain default are proposals (WPR5); the source gives the stop at Sequence 7
// [ch65 P052] and the ten-minute fetch [ch65 P004]. Binding ids are the cast pack's (Old Neil, the armory alias); grants are facts the arc earned.
export const LOTM_RECORD_ROWS=[{id:'lotm.records.chanis-stack',label:'The Chanis Gate papers',archive:'armory',locators:['en v1 ch65 P007','en v1 ch66 P034'],
 pages:[
  {id:'seer-line',label:'The Seer pathway',grade:7,seq:8,pathway:'seer',text:'The Seer entry has no potion names for Sequences 8 and 7. It says the next step is about fighting with artifice, and Sequence 7 about many quick spells. A name on the page, Zaratul, points back at what you hold from Roselle\'s diary.'},
  {id:'other-paths',label:'Sailor, Spectator, Savant, Archaeologist, Appraiser',grade:7,seq:7,pathway:'several',text:'You go through the Sailor, Spectator, Savant, Archaeologist, Appraiser, Apprentice and Marauder entries. Each is complete only in places: a potion name, a list of abilities, or nothing.'},
  {id:'instigator',label:'The Instigator entry',grade:7,seq:8,pathway:'instigator',text:'The Instigator entry lists the abilities of the potion that fit what the Alfalfa killer did, and the Assassin entry beside it shares the pattern.'},
  {id:'theosophy',label:'The Theosophy Order and its two pathways',grade:7,seq:7,pathway:'instigator',text:'The Order\'s two pathways are Instigator and Assassin, which turns the question toward the Demoness Sect.'},
  {id:'beyond-seven',label:'The pages after Sequence 7',grade:6,seq:6,pathway:'several',text:'Pages for Sequence 6 and above are in the stack. Your clearance does not open them.'},
  {id:'cathedral-file',label:'The Demoness Sect folder',grade:5,seq:5,pathway:'demoness',text:'The folder is marked for the Holy Cathedral, not the armory.'}],
 links:[{id:'tris-instigator',label:'Match the Instigator entry to the Alfalfa killer',needs:['instigator'],minutes:5,text:'Set beside what you know of the Alfalfa killing, the Instigator entry fits: the culprit drank the Instigator potion.'}]}];
// Production binding: Old Neil (index id, resolved to the pack's person by the host) and the pack's Armory anteroom (no alias exists, so the pack id); Dunn's note shown to Neil is the earned grant
// (pack fact book.lotm.kj3ad.dunn.note.shown.neil). A captain grant does not exist in this arc, so Sequence 6 stays shut.
export const LOTM_RECORD_BINDINGS={armory:{place:'lotm.place.cast-a815f2c711b207abf093',custodian:'lotm.person.old-neil',fetchMinutes:10,
 grants:{cleared_7:'book.lotm.kj3ad.dunn.note.shown.neil'},minutes:{'seer-line':20,'other-paths':25,instigator:15,theosophy:15,'beyond-seven':5,'cathedral-file':5},
 evidence:{'tris-instigator':'book.lotm.kj3ac.tris.suspected.instigator'}}};
