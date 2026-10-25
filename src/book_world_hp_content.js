// Loader remains the authority for data; structured runtime owns active play and saves.
import {packNative} from './world_pack_registry.js';
export function createHpLifeContent(profile='school'){
 if(!['school','trade'].includes(profile))throw Error('Unknown HP life profile.');
 return packNative('book.hp')[profile+'Life'];
}
