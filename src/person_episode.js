// Leaf reads over the fact pointer an effect episode carries. No state, no clock.
import {address, hash64} from './gen_kit.js';

export const payload = e => {
    const parts = e.fact?.split('|');
    return parts?.length === 6 && parts[0] === 'fx1' ? {axis: decodeURIComponent(parts[1]), amount: Number(parts[2]), topic: parts[3], holder: parts[4]} : null;
};
export const tokens = new Map();
export const token = value => {const key=address(value); if(!tokens.has(key)) {if(tokens.size>2048) tokens.clear(); const {lo,hi}=hash64(0,key); tokens.set(key,hi.toString(16).padStart(8,'0')+lo.toString(16).padStart(8,'0'));} return tokens.get(key);};

export const isHarm = e => ['harmed', 'betrayed'].includes(e.kind);
