#!/usr/bin/env node
// Draft-only, deterministic text adapter. Never rewrites accepted data.
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {validateEffectRecord, SRD521_ATTRIBUTION} from '../src/effect_dsl.js';
const abilities={Strength:'str',Dexterity:'dex',Constitution:'con',Intelligence:'int',Wisdom:'wis',Charisma:'cha'};
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
/** Parse a single spell block, with page/hash supplied from the canonical source.
 * Validation proves shape only. Every result still requires source/semantic review.
 * Unsupported header syntax stays null and fails validation, never guessed.
 */
export function draftSpell(block,{page,textSha256}) {
    const lines=block.trim().split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
    const name=lines[0]||'';
    const heading=lines[1]||'';
    const levelMatch=heading.match(/^Level ([1-9]) (\w+)/i), cantrip=heading.match(/^(\w+) Cantrip/i);
    const header=label=>{
        const i=lines.findIndex(l=>l.startsWith(label+':'));
        if(i<0)return '';
        const next=lines.slice(i+1).findIndex(l=>/^(Casting Time|Range|Components?|Duration):/.test(l));
        // Duration ends the header. Body follows; only its first line is a duration.
        return [lines[i].slice(label.length+1),...(label==='Duration'?[]:lines.slice(i+1,next<0?i+1:i+1+next))].join(' ').trim();
    };
    const time=header('Casting Time'), range=header('Range'), comp=header('Components')||header('Component'), dur=header('Duration');
    const times={'Action':'action','Bonus Action':'bonus_action'};
    const tm=time.replace(/ or Ritual$/,'');
    const timeUnit=times[tm] || (/^Reaction,/.test(tm)?'reaction':/^(\d+) (minute|hour)s?$/.exec(tm)?.[2]) || null;
    const rangeMatch=range.match(/^(\d+) feet$/);
    const durationMatch=dur.match(/^(?:Concentration, up to )?(\d+) (round|minute|hour)s?$/);
    const duration={unit:dur==='Instantaneous'?'instant':durationMatch?.[2]??null,value:durationMatch?Number(durationMatch[1]):0,ends:[]};
    const material=comp.match(/M \((.+)\)/), priced=material?.[1].match(/worth (\d+)\+? GP/i);
    const consumed=!!material && /spell consumes/i.test(material[1]);
    const e={id:'main',target:{kind:'creature',count:1,disposition:'any',requiresSight:false,sizes:[],creatureTypes:[]},area:null,
        range:{kind:range==='Self'?'self':range==='Touch'?'touch':rangeMatch?'distance':null,feet:Number(rangeMatch?.[1]||0),longFeet:Number(rangeMatch?.[1]||0)},
        castingTime:{unit:timeUnit,value:/^\d+/.test(tm)?Number(tm.match(/^\d+/)[0]):1,trigger:timeUnit==='reaction'?tm.replace(/^Reaction,\s*/,''):null,ritual:/ or Ritual$/.test(time)},
        resolution:{kind:'none'},damage:[],healing:null,conditions:[],duration,concentration:/^Concentration,/.test(dur),
        components:{verbal:/(?:^|, )V(?:,|$)/.test(comp),somatic:/(?:^|, )S(?:,|$)/.test(comp),materials:material?[{stockId:'srd521.stock.'+slug(name)+'_draft_material',description:material[1],quantity:1,minimumValueGp:Number(priced?.[1]||0),consumed,substitutable:!priced&&!consumed}]:[]},rules:[],notes:[]};
    const bodyStart=lines.findIndex(l=>l.startsWith('Duration:'));
    const body=lines.slice(bodyStart+1).join(' ').replace(/-\s+/g,'');
    const dmg=body.match(/(\d+)d(4|6|8|10|12|20)(?:\s*\+\s*(\d+))? (Acid|Bludgeoning|Cold|Fire|Force|Lightning|Necrotic|Piercing|Poison|Psychic|Radiant|Slashing|Thunder) damage/i);
    if(dmg)e.damage.push({type:dmg[4].toLowerCase(),dice:{count:Number(dmg[1]),sides:Number(dmg[2]),bonus:Number(dmg[3]||0),ability:null},instances:1});
    const save=body.match(/(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma) saving throw/);
    if(save)e.resolution={kind:'save',ability:abilities[save[1]],dc:'spell',success:/half as much damage/.test(body)&&dmg?'half_damage':'none',repeat:'none'};
    else {const attack=body.match(/(ranged|melee) spell attack/i);if(attack)e.resolution={kind:'attack',mode:attack[1].toLowerCase(),bonus:'spell'};}
    const draft={schema:1,id:'srd521.spell.'+slug(name),kind:'spell',name,revision:1,
        source:{document:'SRD',edition:'5.2.1',heading:'Spell Descriptions / '+name,page,url:'https://www.dndbeyond.com/srd',textSha256},licence:'CC-BY-4.0',attribution:SRD521_ATTRIBUTION,
        status:'needs_ruling',rulings:[{id:'draft.semantic_review',question:'Does the draft preserve every target, secondary effect, choice, timing edge and scaling rule in the source?'}],
        unmodeled:['Draft importer does not infer target eligibility, geometry, healing, condition choice, secondary effects or scaling.'],
        function:{doesWhat:['unreviewed_spell'],carrier:'spell',needs:['source_review'],scale:{basis:levelMatch?'slot_level':'caster_level',steps:[]}},effects:[e],
        spell:{level:levelMatch?Number(levelMatch[1]):cantrip?0:null,school:(levelMatch?.[2]||cantrip?.[1]||'').toLowerCase()}};
    let validation;
    try { validateEffectRecord(draft); validation={valid:true,errors:[]}; }
    catch(error) { validation={valid:false,errors:[error.message]}; }
    return {draft,validation,review:{required:true,accepted:false}};
}
async function main() {
    const args=process.argv.slice(2);
    if(args.length!==3)throw Error('Usage: node tools/import_srd521.mjs BLOCK_FILE PAGE CANONICAL_TEXT_FILE');
    const [block,canonical]=await Promise.all([readFile(args[0],'utf8'),readFile(args[2])]);
    const result=draftSpell(block,{page:Number(args[1]),textSha256:createHash('sha256').update(canonical).digest('hex')});
    process.stdout.write(JSON.stringify(result,null,2)+'\n');
    if(!result.validation.valid)process.exitCode=1;
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(e=>{process.stderr.write(e.message+'\n');process.exitCode=1;});
