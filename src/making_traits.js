// Shared vocabulary, declared by each world's catalogue through tag_store.
// Presence traits carry no strength, effect or knowledge. Hidden tags stay out
// of tagFacts' default observer projection; learning belongs to native knowledge.
export const MAKING_TRAITS = Object.freeze([
 {id:'material.plant',kind:'physical',revision:1},
 {id:'material.animal',kind:'physical',revision:1},
 {id:'material.mineral',kind:'physical',revision:1},
 {id:'material.liquid',kind:'physical',revision:1},
 {id:'preparation.dried',kind:'physical',revision:1},
 {id:'preparation.crushed',kind:'physical',revision:1},
 {id:'preparation.stewed',kind:'physical',revision:1},
 {id:'function.binding',kind:'functional',revision:1,visible:'hidden'},
 {id:'function.spiritual_charge',kind:'functional',revision:1,visible:'hidden'},
 {id:'function.heat_reactive',kind:'functional',revision:1,visible:'hidden'},
].map(Object.freeze));
