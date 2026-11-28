import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {PLAYABLE,PARTIAL,READING} from './play-status.mjs';
import {SKILL_EVOLUTIONS} from '../../src/data/skill_evolutions.js';
import {census as readCensus,censusCells,mechanisms,sampleKey} from './census-rules.mjs';
import {worldTitle} from './world-titles.mjs';

const censusFile='docs/audits/LITRPG_SYSTEM_CENSUS_2026-11-27.md';
const progressionFile='docs/PROGRESSION_GATE_RULES.md';
const books={
    AZ:['az','Azarinth Healer'], BD:['bdm','Beneath the Dragoneye Moons'], ML:['mol','Mother of Learning'],
    TW:['twi','The Wandering Inn'], DC:['dcc','Dungeon Crawler Carl'], HW:['hwfwm','He Who Fights with Monsters'],
    PH:['primal-hunter','The Primal Hunter'], CH:['chrysalis','Chrysalis'], TA:['toa','Tree of Aeons'],
};
const codes=/\b(?:SM(?:1[0-2]|[1-9])|EV[1-6])\b/g;
const trim=value=>value.trim().replaceAll('**','').replaceAll('`','');
const cells=line=>line.split('|').slice(1,-1).map(trim);
const bundled=name=>'/system-play/'+name;
const hasBuild=proof=>/^[a-f0-9]{64}$/.test(proof?.bundleSha256||'');

export function parseCensus(text){
    const records=new Map(), definitions=[];
    const cutoff=text.indexOf('## Shared mechanisms');
    for(const line of text.slice(0,cutoff).split(/\r?\n/)){
        if(!line.startsWith('|'))continue;
        const [id,tag,statement,source,confidence,,owner,mechanisms]=cells(line);
        const kind=confidence?.match(/^(stated|implied|secondary|bg)\b/)?.[1];
        if(!/^([A-Z]{2})(?:[A-Za-z]*\d+)$/.test(id||'')||!kind)continue;
        const [world,book]=books[id.slice(0,2)]??[id.slice(0,2).toLowerCase(),id.slice(0,2)];
        records.set(id,{id,tag,statement,source,confidence:kind,qualification:confidence===kind?undefined:confidence,
            world,book,mechanisms:[...new Set(((mechanisms||'')+' '+owner).match(codes)||[])]});
    }
    for(const match of text.matchAll(/^### (SM\d+) · (.+)\r?\n([\s\S]*?)(?=^### |^## |(?![\s\S]))/gm)){
        const [,id,label,body]=match;
        const field=name=>trim(body.split(/\r?\n/).find(line=>line.startsWith('**'+name+'.**'))?.split('.** ')[1]??'');
        const extra=body.split(/\r?\n/).filter(line=>/^\*\*(?:Tradeoff|Variation|Edge|Held-out|Test|Smallest|Different|Save implications|Idle-play note)/i.test(line))
            .map(trim);
        definitions.push({id,label,definition:field('Definition'),variations:extra});
    }
    return {records,definitions};
}

const readMatchers={
    SM1:/stat-points|point-allocation|class-level-rewards|growth-points/, SM2:/relative-(?:level|reward)|level-difference|weak-enemy/,
    SM3:/shared-(?:kill|credit|xp)|group-kill/, SM4:/concurrent-class|class-slots|concurrent-role/, SM5:/ability-slots|skill-slots|ability-loadout/,
    SM6:/system-(?:revision|update|patch)|rules-rewrite/, SM7:/patronage|sponsor|audience-feed/, SM8:/combination-skill|participant-scoped/,
    SM9:/essence-combination|confluence/, SM10:/active-item-interference|artifact-interference/, SM11:/iteration-cap|restart-budget/,
    SM12:/simulacrum|shared-source/,EV1:/tier-rename|name-tier/,EV2:/skill-evolution|evolved-skill|skill-upgrade-choice/,
    EV3:/skill-rarity|grade-climb|ability-grade/,EV4:/skill-fusion|skill-merge/,EV5:/skill-consolidation/,EV6:/class-evolution|profession-evolution|worldly-princess/,
    voice:/status-display|level-notification|system-message|status-screen/,reveal:/\.identify$|class-privacy|appraisal-limit/,
};
const sameTheme=[
    ['SM1','SM2','SM3'],['SM4','SM5','EV6'],['SM6','voice','reveal'],['SM7','SM9'],
    ['SM8','EV4','EV5'],['SM10','SM12'],['SM11','reveal'],['EV1','EV2','EV3','EV4','EV5','EV6'],
];
const aliases={SM1:'level up level-up growth points stat allocation',EV1:'level up skill names YAIR',EV2:'level up skill evolution choose form',EV3:'level up rarity grade',EV6:'level up class path profession',voice:'level up notification system voice',reveal:'status window appraisal knowledge'};
const sourceCases={
    EV2:[['a-novel-concept','A Novel Concept','Chapter 120','Three Rare continuations of Common Thrust.','https://www.royalroad.com/fiction/66455/a-novel-concept-he-who-eludes-death/chapter/1422216/chapter-120-thrust-and-trust']],
    EV3:[['primal-hunter','The Primal Hunter','Chapter 1388','Piercing Cursed Arcane Fang climbs from Rare to Epic after a penetrating thrust.','https://www.royalroad.com/fiction/36049/the-primal-hunter/chapter/4002974/chapter-1388-sharpened-fangs']],
    EV4:[['timebender','The Timebender','Chapter 23','Kill Streak and Fast Stab yield Rampage. Assassinate stays separate.','https://www.royalroad.com/fiction/32603/the-timebender/chapter/508899/23-scouting']],
    EV5:[['badge-of-vice','Badge of Vice','Chapter 41','Four related disciplines are offered as one alchemy skill.','https://www.royalroad.com/fiction/191715/badge-of-vice/chapter/3981796/chapter-41-the-fusion-cards-power']],
    EV6:[['twi','The Wandering Inn','5.26 L','Restored Princess changes to Worldly Princess, with Flawless Attempt among its awards.','https://wanderinginn.com/2018/10/06/5-26-l/'],
        ['primal-hunter','The Primal Hunter','Chapter 1274','Two finalist professions weight alchemy and innate Primeval practice differently.','https://www.royalroad.com/fiction/36049/the-primal-hunter/chapter/3144163/chapter-1274-two-awesome-options']],
};

function evolutionReceipts(proofs){
    const [early,joined,career]=proofs;
    const a=early?.runs?.[0],b=joined?.runs?.[0],c=career?.runs?.[0];
    const row=(condition,file,action,proof)=>condition&&hasBuild(proof)?
        {id:file+'-'+action.toLowerCase().replace(/[^a-z0-9]+/g,'-'),life:'Village',action,build:proof.bundleSha256,href:bundled(file)}:null;
    return {
        EV1:row(a?.tierReport==='Skill Stone skin upgraded to Iron skin','ev2-ev3','YAIR tier report',early),
        EV2:row(a?.combat?.choice?.status==='chosen'&&a.combat.fight?.includes('Breathing skin'),'ev2-ev3','Breathing skin restores stamina in combat',early),
        EV3:row(a?.grade?.choice?.status==='chosen'&&a.grade.to==='Uncommon'&&a.grade.import,'ev2-ev3','Sleeping grows to Uncommon through sleep',early),
        EV4:row(b?.fusion?.effect?.includes('Counterstep restored'),'ev4-ev5','Counterstep restores stamina after a dodge',joined),
        EV5:row(b?.rest?.effect?.includes('Quiet recovery restored'),'ev4-ev5','Quiet recovery restores stamina while sleeping',joined),
        EV6:row(c?.effect?.includes('Route mentor earned')&&c.choice?.target==='village.route-mentor','ev6','Route mentor paid patrol',career),
    };
}

function growthReceipt(proof,id,action,effect) {
    if (!hasBuild(proof) || proof.life!=='Village' || proof.entry!=='/') return;
    const valid=(width,height)=>proof.runs?.some(run=>run.viewport.width===width&&run.viewport.height===height&&
        run.errors?.length===0&&run.effect?.startsWith(effect)&&['save','reload','export','import'].every(key=>run.persistence?.[key]));
    if(valid(1920,1080)&&valid(1366,768))return {id,life:proof.life,action,build:proof.bundleSha256,href:bundled(id)};
}

export function buildSystems({census,progression,digests=[],proofs=[],growthProofs={},campaign}){
    const {records,definitions}=parseCensus(census);
    const receipt=evolutionReceipts(proofs);
    receipt.SM1=growthReceipt(growthProofs.SM1,'sm1','Allocate Deep rest and recover health with stamina upkeep','Deep rest restored');
    receipt.SM5=growthReceipt(growthProofs.SM5,'sm5','Swap the sleep slot and recover stamina through Steady breath','Slotted Steady breath restored');
    for(const line of progression.split(/\r?\n/).filter(line=>/^\| EV[1-6] ·/.test(line))){
        const [header,definition,scope]=cells(line),[id,label]=header.split(' · ');
        definitions.push({id,label,definition,variations:[scope,...SKILL_EVOLUTIONS.filter(row=>row.policy===id)
            .flatMap(row=>row.targets.map(target=>target.description).filter(Boolean))]});
    }
    definitions.push({id:'voice',label:'System voice',definition:'How rules and awards are announced to an observer.',variations:['A summoned panel, a terse notice stream, delayed awards and a speaking system can coexist with different rules.']},
        {id:'reveal',label:'What the system reveals',definition:'What an observer can learn about themselves, other actors and the rules, through a given means.',variations:['Ranges, withheld information and interpretation can differ from the stored truth.']});
    const digestRules=new Map(digests.map(digest=>[digest.world,digest.rules??[]]));
    const readerLink=(world,id)=>'#world/'+encodeURIComponent(world)+'/things/'+encodeURIComponent(id);
    const sources=Object.fromEntries(records), counts=campaign?censusCells(campaign):[];
    return {sources,articles:definitions.map(article=>{
        const {id}=article, proof=receipt[id];
        const cases=[...records.values()].filter(record=>record.mechanisms.includes(id)||record.tag===({voice:'VOICE',reveal:'REVEAL'}[id]))
            .map(record=>{
                const canonical=(digestRules.get(record.world)??[]).find(rule=>(rule.col==='order'||['ability','spell'].includes(rule.kind))&&
                    record.source.includes(rule.id.replace(new RegExp('^'+record.world+'\\.'),'')));
                return {...record,cite:canonical?readerLink(record.world,canonical.id):'/system-source/'+record.id};
            });
        for(const [world,book,source,statement,cite] of sourceCases[id]??[])cases.push({world,book,source,statement,cite,id:world+'-'+id,confidence:'chapter'});
        for(const [world,rules] of digestRules){
            const book=worldTitle(world);
            for(const rule of rules.filter(r=>(r.col==='order'||['ability','spell'].includes(r.kind))&&readMatchers[id]?.test(r.id))){
                if(cases.some(c=>c.world===world&&(c.source.includes(rule.id)||c.cite===readerLink(world,rule.id))))continue;
                cases.push({id:rule.id,world,book,source:rule.id,confidence:'reader locator',
                    statement:'Indexed reader rule on '+article.label.toLowerCase()+'. Open the record for its scope and chapter.',
                    cite:readerLink(world,rule.id)});
            }
        }
        for(const cell of counts.filter(c=>c.code===id&&c.count)){
            const example=cell.example, key='RR'+BigInt('0x'+sampleKey(example).slice(0,16)).toString();
            const source=example.id+' · '+example.locator;
            sources[key]={id:example.id,world:cell.world,book:cell.book,locator:example.locator,mechanism:id,qualification:'Located reader claim'};
            const native=(digestRules.get(cell.world)??[]).some(r=>r.id===example.id);
            cases.push({id:key,world:cell.world,book:cell.book,source,confidence:'reader locator',
                statement:cell.count+' located matches for '+mechanisms[id][0].toLowerCase()+'.',
                cite:native?readerLink(cell.world,example.id):'/system-source/'+key});
        }
        const related=[...new Set(sameTheme.filter(set=>set.includes(id)).flat())].filter(code=>code!==id);
        const playStatus=proof?PLAYABLE:id.startsWith('EV')?PARTIAL:READING;
        const playGap=playStatus===PARTIAL?'The law has a recorded implementation, with no admitted normal-entry receipt for this policy.':undefined;
        return {...article,related,cases,playStatus,playGap,playReceipt:proof??undefined,evidence:proof?.href??bundled(id.startsWith('EV')?'progression':'census'),
            terms:aliases[id]??''};
    })};
}

export function readSystems(root,readers,worlds){
    const take=file=>{try{return JSON.parse(readFileSync(file,'utf8'));}catch(error){if(error.code==='ENOENT')return null;throw error;}};
    const proofs=['skill-evolution-ev2-ev3-2026-11-26/proof.json','skill-evolution-ev4-ev5-2026-11-26/proof.json',
        'skill-evolution-armor-ev6-2026-11-26/proof-ev6.json'].map(file=>take(join(root,'docs/representations/evidence',file)));
    const digests=worlds.map(world=>take(join(readers,world+'.json'))).filter(Boolean);
    const growthProofs=Object.fromEntries(['SM1','SM5'].map(id=>[id,take(join(root,'docs/representations/evidence/litrpg-sm1-sm5-2026-11-27',`proof-${id.toLowerCase()}.json`))]));
    return buildSystems({census:readFileSync(join(root,censusFile),'utf8'),progression:readFileSync(join(root,progressionFile),'utf8'),digests,proofs,growthProofs,campaign:readCensus(root)});
}

export function findSystems({articles=[]}={}){
    return articles.flatMap(article=>{
        const href='#systems/'+article.id;
        const base={type:'systems',label:article.id+' · '+article.label,world:'oops-systems',worldLabel:'Systems',kind:'Mechanism article',
            status:article.playStatus,playStatus:article.playStatus,playGap:article.playGap,summary:article.definition,terms:article.terms,href};
        return [{...base,id:article.id},...article.cases.map(row=>({...base,id:article.id+'/'+row.id,kind:'System comparison',
            label:article.label+' · '+row.book,world:row.world,worldLabel:row.book,summary:row.statement,status:row.confidence,
            // A reading claim is independent of the article's OOPS play receipt.
            playStatus:READING,playGap:undefined,terms:row.source,href:href+'?cell='+encodeURIComponent(row.id)}))];
    });
}
