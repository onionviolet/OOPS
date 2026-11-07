// Sun pathway, Sequences 9 (Bard) and 8 (Light Supplicant), as pure data for the generated-row factory (LG1, LANE_D_WORLD_GAPS 2.2).
// Same shape as SPECTATOR_SPEC (book_world_lotm_generated.js); this module imports nothing so the factory can import it without a cycle.
// Labels: [table] = potion table / reader notes (stated or shown, chapter refs per the notes), [proposal] = authored here (WPR5), [gap] = notes silent (DWF72).
// Sources used: table section 5 (Sun line); reader notes LOTM_PATHWAYS_A section 5: Bard "Let us praise the Sun" and the song's effect (stated, ch 142 of the
// whole-book merge), self-boost (shown, ch 294), Light Supplicant's Sun spells against corpses and ghosts (stated, ch 142). No sealed truth is involved.
const stamina=n=>({type:'vital',key:'stamina',amount:-n}),cond=(id,duration)=>({type:'condition',id,operation:'apply',duration});
export const SUN_SPEC=Object.freeze({
 key:'su',pid:'sun',slug:'sun',prefix:'su',baseFormula:'sun_9',nextFormula:'sun_8',holds:{base:'bardDose',next:'lightSupplicantDose'},
 baseSource:'book.lotm.bard',nextSource:'book.lotm.light_supplicant',digest:4,
 principle:{text:'Let us praise the Sun',evidence:'Bard motto, stated in the Night Watch files (T 0142); the song gives courage and piety to self and allies (T 0142, S 0294)',table:'PATHWAY_POTION_TABLE.md section 5, Sun line'},
 acts:[
  {id:'act_praise',once:false,minutes:20,label:'Sing a hymn of praise to the sun on the quay at first light, loud enough for the dockhands · 20 min',
   know:['su.acting.praise','You sang the sun up over the quay and the carters slowed to listen. Praising it aloud, with others in earshot, settles the role in you a little more each time.']},
  {id:'act_lift',once:true,flag:'lifted',minutes:30,label:'Lead a work-song for a tired crew until they straighten up · 30 min',
   know:['su.acting.lift','You led a whole crew through a shift in song and watched them stand taller. Giving courage away by singing is the role at its plainest, and it counted.']}],
 know:{
  ingest:['su.stabilized','The dose is gone for good. Warmth rose behind your ribs and the next hymn you hummed came out steadier and stronger than you meant it to. You hold a Bard source. Nobody supervised this; you were told only to praise the sun, and that the potion settles by singing, not by waiting.','observation'],
  assess:['su.assessment','You judge by feel that the potion has settled: a hymn comes out whole and the warmth stays put. No examiner asked you to prove it, and nobody will.','instruction'],
  promote:['su.promoted','The Light Supplicant potion is gone for good. A glare stays in the corner of your eye and sunlit work (a rite, a ward, a kindled flame) answers your call a little better. This Sequence needs digesting in turn, by its own role.','observation'],
  rushed:['su.rushed','The Light Supplicant potion took, but the Bard potion was not settled. The warmth runs hot and uneven, the hymns come out ragged, and a bright hum behind the eyes does not stop.','observation']},
 sources:{base:{label:'Bard source (initiated)',bioDetail:'One consumed brewed dose. Source ownership is separate from digestion. The song boosts courage and strength for the singer; allies and group effects are a gap.'},
  next:{label:'Light Supplicant source (Sequence 8)',bioDetail:'A second consumed brewed dose. Canon gives it Sun-domain spells and rituals that counter corpses and ghosts; only a bounded ward is written here (proposal).'}},
 ladder:{s9:['A hymn that steadies and strengthens the singer'],s8:['Sunlight called to ward off the dead'],
  failure:{signs:'Hymns come out ragged, the warmth runs hot and the glare lingers',outcome:'Loss of control if a potion is drunk undigested, out of order or from another pathway'}},
 gaps:[
  'The notes record no acting principle for Sequence 8 Light Supplicant (M); only the Sequence 9 motto is used, and Sequence 8 digestion is not offered.',
  'The Church of the Eternal Blazing Sun holds the Sun line in Intis, not Tingen; nobody supervises or examines here. A church contact is not written (LATER).',
  'Taking the Light Supplicant dose without a Bard source has no cause row yet; the drink is refused with a stated reason.',
  'The song boosting allies, Sun-domain spells and rituals are stated but not written; only a self-boost hymn and a ward against the dead exist (numbers are proposals).'],
 provenance:{potion:'table',next:'table',sequences:'table',doseKeys:'table (formula rows)',principle9:'table',principle8:'gap',digest:'proposal',acts:'proposal (from the table motto)',
  place:'proposal (anywhere people are)',supervision:'proposal (self-directed, no examiner)',texts:'proposal',abilities:'table (stated effect), proposal (costs, durations, drawbacks)'}});
// Ability rows in the shape of book_world_lotm_abilities.js ROWS (stage 'base' needs the Bard source, 'next' the Light Supplicant source).
export const SUN_ABILITY_ROWS=Object.freeze([
 {key:'sun_hymn',stage:'base',fn:'physical',kind:'body-faculty',label:'Sing a hymn of praise to steady and strengthen yourself',desc:'Courage and a stronger body for a while. The voice pays with hoarseness.',
  costs:[stamina(2)],effects:[cond('book.lotm.hymn_courage',240)],drawback:{id:'hymn_price',price:[cond('book.lotm.hoarse_voice',240)]}},
 {key:'sun_ward',stage:'next',fn:'physical',kind:'body-faculty',label:'Call a ward of sunlight against the dead',desc:'Corpses and ghosts keep their distance for a while. The glare stays in your eyes.',
  costs:[stamina(3)],effects:[cond('book.lotm.sun_ward',180)],drawback:{id:'ward_price',price:[cond('book.lotm.sun_glare',240)]}}]);
export const SUN_CONDITIONS=Object.freeze([
 {id:'book.lotm.hymn_courage',revision:1,label:'Hymn-steadied',stacking:'max',bioVisible:true,bioDetail:'The hymn still warms you: steadier nerves and a stronger body for a while.'},
 {id:'book.lotm.hoarse_voice',revision:1,label:'Hoarse voice',stacking:'max',bioVisible:true,bioDetail:'Your voice is rough from the hymn.'},
 {id:'book.lotm.sun_ward',revision:1,label:'Sun-warded',stacking:'max',bioVisible:true,bioDetail:'A faint daylight clings to you and the dead do not like it.',look:{slot:'bearing',rank:3,concealed:true,seenBy:['beyonder','undead'],text:'A steady warmth hangs about you, like standing in a patch of noon.'}},
 {id:'book.lotm.sun_glare',revision:1,label:'Sun glare',stacking:'max',bioVisible:true,bioDetail:'A glare lingers behind your eyes after calling the light.'}]);
