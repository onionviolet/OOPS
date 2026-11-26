// Census metadata only. Free-form census notes stay in the private reader files.
import {publicLifeRow as open} from './texture-life.mjs';
import {parseLocator} from '../../scripts/lead_run/world_profiles.mjs';
const text = (value,max=160) => typeof value==='string'&&value.trim()&&!/^(unstated|not stated|not mentioned)$/i.test(value.trim())?value.trim().replace(/\s+/g,' ').slice(0,max):null;
const list = value => Array.isArray(value)?value:[];
const locator = value => parseLocator(value)?value.trim():null;
export function mergeCensusDetails(previous={},row,withheld=new Set()) {
    const out={names:[...(previous.names||[])],whereabouts:[...(previous.whereabouts||[])],amountRecords:[...(previous.amountRecords||[])]};
    if(!open(row)||withheld.has(row.id))return out;
    const add=(key,value)=>{if(!out[key].some(old=>JSON.stringify(old)===JSON.stringify(value)))out[key].push(value);};
    if(text(row.label)&&!/^[STIU]$/.test(row.label)) add('names',{name:text(row.label,80),zh:text(row.zh,80),
        source:['repo','wiki','pinyin-unconfirmed'].includes(row.nameSource)?row.nameSource:null,locator:locator(row.firstMention)});
    for(const w of list(row.whereabouts).filter(open)) {
        const place=text(w.place,100);
        if(place&&!withheld.has(place))add('whereabouts',{place,era:text(w.era),
            status:['stated','claimed','inferred'].includes(w.status)?w.status:null,locator:locator(w.locator)});
    }
    const a=row.amount;
    if(open(a)&&Number.isFinite(a.value))add('amountRecords',{value:a.value,unit:text(a.unit,40),per:text(a.per,60),
        cap:Number.isFinite(a.cap)?a.cap:null,locator:locator(row.firstMention),claimant:text(row.claimant,100)});
    return out;
}
