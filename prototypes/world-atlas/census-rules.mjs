import {existsSync, readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {censusDirectory,censusWorlds} from './census-worlds.mjs';
import {publicLifeRow} from './texture-life.mjs';
import {parseLocator} from '../../scripts/lead_run/world_profiles.mjs';

// A match requires a relation in a single claim. Terms from unrelated fields never complete a relation.
export const mechanisms = {
    SM1:['Allocating earned attribute points', /(?:allocat\w*|distribut\w*|spend\w*|unassigned|free) (?:\w+ ){0,4}(?:stat|attribute) points?|(?:stat|attribute) points? (?:\w+ ){0,4}(?:allocat|spen|distribut)/i],
    SM2:['Reward depends on the level gap', /(?:xp|experience|reward) (?:\w+ ){0,8}(?:level difference|level gap|lower.level enem|higher.level enem)|(?:weaker|lower.level|higher.level) (?:opponents?|enemies|monsters?) (?:\w+ ){0,6}(?:experience|xp)/i],
    SM3:['Shared defeat credit', /(?:split|share[ds]?|divid\w*|distribut\w*) (?:\w+ ){0,3}(?:xp|experience|kill credit) (?:\w+ ){0,5}(?:party|group|partner|member)|(?:party|group) (?:xp|experience|kill credit) (?:is )?(?:split|shar|divid)/i],
    SM4:['Concurrent class and profession tracks', /(?:second|secondary|multiple|two|both) class(?:es)?\b|class and profession (?:level|progress|experience|slot)|(?:class|profession) levels? (?:and|alongside) (?:profession|class) levels?/i],
    SM5:['Limited ability slots and replacement', /(?:active|available|limited|free|empty|occupied|additional|passive|general|class) (?:ability|skill|spell) slots?|(?:skill|ability|spell) slots? (?:is |are )?(?:full|limit|cap|availab|occup|unlock)|(?:equip|replace|slot) (?:\w+ ){0,3}(?:skill|ability) (?:in|into) (?:\w+ ){0,3}slot/i],
    SM6:['A revision changes the rules in force', /(?:system update|system patch|system integration) (?:\w+ ){0,6}(?:chang|replac|introduc|remov|disable|enable)|(?:new|revised) (?:floor|system) rules? (?:\w+ ){0,4}(?:apply|replace|take effect)/i],
    SM7:['An outside patron grants aid', /(?:sponsor|patron)(?:s|ship)? (?:\w+ ){0,6}(?:gift|benefit|donat|provide|grant|send|reward|supply)|(?:gift|supply box|boon|reward) (?:\w+ ){0,3}(?:from|by) (?:\w+ ){0,2}(?:sponsor|patron)/i],
    SM8:['A technique depends on designated participants', /(?:joint|team|combined|shared) (?:skill|technique|ability) (?:\w+ ){0,7}(?:member|partner|participant|both|together)|(?:both|all) (?:participants|partners|members) (?:\w+ ){0,6}(?:activate|invoke) (?:\w+ ){0,2}(?:skill|technique)/i],
    SM9:['Several essence types determine a confluence', /(?:essence|combination) (?:\w+ ){0,7}confluence|confluence (?:\w+ ){0,8}(?:combination|three essences|essence set)/i],
    SM10:['Nearby active items interfere', /(?:artifact|enchantment|enchanted item)s? (?:\w+ ){0,7}(?:interfer\w*|disrupt\w*) (?:\w+ ){0,4}(?:other|nearby|each)/i],
    SM11:['Restarts spend a finite budget', /(?:finite|limited|remaining|last) (?:number of )?(?:restarts|iterations|resets|time loops)|(?:restart|iteration) (?:counter|budget) (?:\w+ ){0,5}(?:decreas|spen|remain)/i],
    SM12:['Copies draw on one source', /(?:clone|simulacr\w*|bod(?:y double|ies))s? (?:\w+ ){0,7}share\w* (?:\w+ ){0,4}(?:mana|reserve|soul|energy pool)/i],
    EV1:['A level changes the skill name', /(?:skill|ability) (?:name )?(?:changes|renamed|is renamed) (?:\w+ ){0,4}(?:at|upon|on) (?:\w+ ){0,2}level/i],
    EV2:['An offered evolution replaces a skill', /(?:skill|ability) evolution (?:choice|options?|selection)|(?:choose|select) (?:\w+ ){0,5}(?:skill evolution|evolved (?:skill|form))/i],
    EV3:['A skill or ability climbs rarity or grade', /(?:skill|ability) (?:rarity|grade) (?:\w+ ){0,3}(?:increas|upgrad|improv|rise|advance)|(?:upgrad\w*|rais\w*) (?:\w+ ){0,3}(?:skill|ability) rarity/i],
    EV4:['Skills fuse into a new skill', /(?:skills|abilities) (?:\w+ ){0,4}(?:fuse|fusion|merge) (?:\w+ ){0,4}(?:into|new)|(?:skill fusion|fusion of (?:two|multiple) skills)/i],
    EV5:['Related skills consolidate', /(?:skill consolidation|skills? (?:are |is )?consolidat\w*|consolidat\w* (?:\w+ ){0,3}skills? into)/i],
    EV6:['A class or profession evolves', /(?:class|profession) evolution\b|(?:class|profession) (?:\w+ ){0,2}evolves? into/i],
};
const fields=['name','worldKind','conditions','steps','results','limits','consequences'];
function claims(value) {
    if(typeof value==='string')return [value];
    if(Array.isArray(value))return value.flatMap(claims);
    if(!value||!publicLifeRow(value))return [];
    return ['what','trigger','response'].flatMap(key=>claims(value[key]));
}
export function classify(row){
    if(!publicLifeRow(row)||!['S','T'].includes(row.label)||!parseLocator(row.locator))return [];
    const text=fields.flatMap(key=>claims(row[key])).filter(s=>!/(?:not stated|unstated|no evidence|does not|no such)/i.test(s));
    return Object.entries(mechanisms).filter(([, [,test]])=>text.some(s=>test.test(s))).map(([id])=>id);
}
export function census(root,{review=false}={}){
    const worlds=[],matches=[];
    for(const [slug,[world,book]] of Object.entries(censusWorlds)){
        const dir=join(root,censusDirectory(slug)),files=existsSync(dir)?new Set(readdirSync(dir)) : new Set();
        const selected=new Map(), blocked=new Set(), located=new Set(), byAssociation=new Map();
        const facets={acquire:new Set(),enforcement:new Set(),reset:new Set()};
        let raw=0;
        for(const file of [...files].sort()){
            const m=/^(\w+c\d{3,})(L?)_rules\.jsonl$/.exec(file);
            if(!m||files.has(m[1]+m[2]+'_rules.partial'))continue;
            if(!selected.has(m[1])||!m[2])selected.set(m[1],file);
        }
        for(const file of selected.values())for(const line of readFileSync(join(dir,file),'utf8').split(/\r?\n/)){
            if(!line.trim())continue;
            const row=JSON.parse(line);raw++;
            if(!publicLifeRow(row)){blocked.add(row.id);continue;}
            if(!/^[\w.-]+$/.test(row.id)||!parseLocator(row.locator)||!['S','T'].includes(row.label))continue;
            const key=row.id+'@'+row.locator;
            located.add(key);
            for(const [kind,keys] of Object.entries(facets)){
                const facet=row[kind];
                if(facet&&publicLifeRow(facet)&&['S','T'].includes(facet.label)&&parseLocator(facet.locator))
                    keys.add(row.id+'@'+facet.locator);
            }
            for(const code of classify(row)){
                const id=code+'|'+key;
                if(!byAssociation.has(id))byAssociation.set(id,{code,world,book,id:row.id,locator:row.locator,...(review?{row}: {})});
            }
        }
        const admitted=[...byAssociation.values()].filter(m=>!blocked.has(m.id));
        matches.push(...admitted);
        worlds.push({world,book,raw,facets:Object.fromEntries(Object.entries(facets).map(([kind,keys])=>[kind,[...keys].filter(k=>!blocked.has(k.split('@')[0])).length])),located:[...located].filter(k=>!blocked.has(k.split('@')[0])).length,
            classified:new Set(admitted.map(m=>m.id+'@'+m.locator)).size});
    }
    return {worlds,matches};
}
export const sampleKey=m=>createHash('sha256').update(['U2 precision v1',m.world,m.code,m.id,m.locator].join('|')).digest('hex');
export function sample(matches,n=40){return [...matches].sort((a,b)=>sampleKey(a).localeCompare(sampleKey(b))).slice(0,n);}
export function censusCells({worlds,matches}){
    const groups=new Map();
    for(const match of matches){
        const key=match.world+'|'+match.code;
        if(!groups.has(key))groups.set(key,[]);
        groups.get(key).push(match);
    }
    return worlds.flatMap(({world,book})=>Object.keys(mechanisms).map(code=>{
        const rows=groups.get(world+'|'+code)??[];
        return {world,book,code,count:rows.length,example:rows[0]};
    }));
}
export function rankGaps(report,played){
    const cells=censusCells(report);
    return Object.keys(mechanisms).filter(code=>!played.has(code)).map(code=>{
        const supported=cells.filter(c=>c.code===code&&c.count);
        const density=supported.reduce((n,c)=>n+1000*c.count/report.worlds.find(w=>w.world===c.world).located,0)/report.worlds.filter(w=>w.located).length;
        return {code,worlds:supported.length,count:supported.reduce((n,c)=>n+c.count,0),density};
    }).filter(r=>r.count).sort((a,b)=>b.worlds-a.worlds||b.density-a.density||a.code.localeCompare(b.code));
}
