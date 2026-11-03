// B2: what a cast person could see of the lead's concealed looks, by the existing reveal route (lotmReveal -> characterBioView reveal).
// Pack people carry hashed ids; the loaded pack maps each to its stable index id, which the observer table keys.
import {getPrivateLotmCast} from './book_world_lotm_cast_days.js';
import {lotmReveal} from './book_world_lotm_abilities.js';
export const castIndexOf=(id,pack=getPrivateLotmCast())=>pack?.people?.find(p=>p.id===id)?.indexId||id;
export const lotmCastReveal=(observerId,registry,state,pack=getPrivateLotmCast())=>lotmReveal(observerId,registry,state,id=>castIndexOf(id,pack));
