// Loader remains the authority for data; structured runtime owns active play and saves.
import {packNative} from './world_pack_registry.js';
export function createHpLifeContent(profile='school'){
 if(!['school','trade'].includes(profile))throw Error('Unknown HP life profile.');
 return packNative('book.hp')[profile+'Life'];
}

// Arrival fiction is an original proposal, outside the exact saved D7 definition.
// Both lives consume the shared typed beginning presentation seam.
export async function registerHpBeginnings(register, choices) {
 for (const profile of ['school','trade']) {
  const d=await register(createHpLifeContent(profile));
  choices.register({packId:d.id,label:profile==='school'?'Harry Potter · school life':'Harry Potter · adult glass trade',
   arrival:profile==='school'
    ?'Proposed supply-week arrival: your guardian has already arranged your school supplies during the week before term. Confirm to arrive in the supervised Hogwarts study room at the start of the first term. This opening does not simulate that earlier week.'
    :'Proposed supply-week arrival: you have arranged a rented Diagon Alley workshop and a glass-counter contact. Confirm to arrive at your bench for the first working day. You are an adult trader, without school enrollment.',
   means:profile==='school'
    ?'Start as an eleven-year-old magical pupil with a fitted wand, six sheets of parchment, classroom practice materials, eight local allowance units and four units of supply debt. Your guardian’s role here is the completed supply arrangement; no guardian actor or recurring support is created.'
    :'Start as an adult with magical faculty, a learned ordinary-glass repair method, your fitted wand, two complete fragment sets, twelve local trade units and six units of rent debt. Elias owns his separate finite counter stock and till.'});
 }
}
