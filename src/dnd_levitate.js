// 2024 revised fifth edition, Levitate and Counterspell. The work-yard
// geometry, referee's one reaction and DC 14 are authored fixture inputs.
import {resolveCheck, replayCheck} from './check_resolver.js';

const TARGET = Object.freeze({id: 'dnd.phandalin.work_crate', pounds: 80, loose: true});
const POSITIONS = Object.freeze({
    open: {crateFeet:15, mageFeet:30, mageCanSee:true},
    screened: {crateFeet:25, mageFeet:40, mageCanSee:false},
});
const MOVE_FEET = 10;
const SPEED_FEET = 30;
const RANGE_FEET = 60;
const CEILING_FEET = 30;
const position = s => s.position ?? 'open';
const geometry = s => POSITIONS[position(s)];
const movement = s => s.movement ?? SPEED_FEET;
const mageCanReact = s => !s.reactionUsed && geometry(s).mageCanSee && geometry(s).mageFeet<=RANGE_FEET;
const inRange = (s,feet) => Math.hypot(geometry(s).crateFeet,feet)<=RANGE_FEET;
const DC = 14;
const CONSTITUTION = 2;
const LIFT_FEET = 10;
const MAX_MINUTES = 10;
const LEVEL = 2;
const COPYING_MINUTES = LEVEL * 120;
const COPYING_GP = LEVEL * 50;
const REST_MINUTES = 480;
const materials = Object.freeze({
    spring: {id:'dnd.phandalin.metal_spring',label:'metal spring'},
    focus: {id:'dnd.phandalin.arcane_focus',label:'arcane focus'},
});
const material = s => s.material ?? (s.means?.spring ? 'spring' : 'none');
const materialChoices = {takeSpring:'spring',holdFocus:'focus',setMaterialDown:'none'};
export const levitationMaterialLabel = s => materials[material(s)]?.label ?? 'no material or focus';
export const newLevitationTrial = ({study=false}={}) => ({
    known: study?[]:['levitate'], prepared: [], means: {voice:true,hand:true}, material:'spring', slots: 2, turn: 1, actionUsed: false,
    position: 'open', movement: SPEED_FEET, reactionUsed: false, pending: null, support: null, counter: null, recovered: false,
    ...(study?{study:{gp:COPYING_GP,rested:false}}:{}),
});
const need = (ok, message) => {if(!ok) throw Error(message);};
export function validateLevitationTrial(s, minute) {
    if(s === undefined) return; // Earlier work-yard saves had no trial.
    need(s && Array.isArray(s.known) && s.known.length <= 1 && s.known.every(id=>id==='levitate') && (s.study||s.known.length===1) &&
        Array.isArray(s.prepared) && s.prepared.length <= 1 && s.prepared.every(id => s.known.includes(id)) &&
        ['voice','hand'].every(id=>typeof s.means?.[id]==='boolean') &&
        (s.means.spring===undefined||typeof s.means.spring==='boolean') &&
        (material(s)==='none'||Object.hasOwn(materials,material(s))) &&
        Number.isSafeInteger(s.slots) && s.slots >= 0 && s.slots <= 2 &&
        Number.isSafeInteger(s.turn) && s.turn > 0 && Object.hasOwn(POSITIONS,position(s)) &&
        Number.isSafeInteger(movement(s)) && movement(s)>=0 && movement(s)<=SPEED_FEET &&
        ['actionUsed','reactionUsed','recovered'].every(key=>typeof s[key]==='boolean'), 'Invalid work-yard spell state.');
    need(s.pending === null || (s.pending?.targetId === TARGET.id && s.pending.turn === s.turn && Number.isSafeInteger(s.pending.startedAt) &&
        s.pending.startedAt >= 0 && s.pending.startedAt <= minute &&
        (s.pending.materialId===undefined||s.pending.materialId===materials[material(s)]?.id) &&
        s.actionUsed && s.slots > 0 && s.prepared.includes('levitate') && s.support === null), 'Invalid pending Levitate.');
    need(s.support === null || (s.support?.targetId === TARGET.id && Number.isSafeInteger(s.support.feet) && s.support.feet>=0 && s.support.feet<=CEILING_FEET &&
        Number.isSafeInteger(s.support.until) && s.support.until > minute && s.support.until <= minute + MAX_MINUTES &&
        s.pending === null && s.slots < 2 && s.prepared.includes('levitate')), 'Invalid Levitate concentration.');
    need(s.reactionUsed === (s.counter !== null) && (!s.recovered || s.slots < 2), 'Invalid work-yard spell history.');
    if(s.study)need(Number.isSafeInteger(s.study.gp)&&s.study.gp>=0&&s.study.gp<=COPYING_GP&&
        typeof s.study.rested==='boolean'&&(!s.study.rested||s.known.includes('levitate'))&&
        (!s.prepared.length||s.study.rested), 'Invalid spellbook study.');
    if(s.counter) {
        const {result} = replayCheck(s.counter);
        need(s.counter.check.id === 'dnd.phandalin.counterspell' && result.target === DC, 'Invalid Counterspell DC.');
    }
}
const studyOptions = [
    ['copyLevitate','Copy Levitate into your spellbook','Use the borrowed wizard’s spellbook and spend 4 hours and 100 GP copying supplies.'],
    ['restAfterCopy','Take a long rest','Rest for eight hours so you can change the prepared spell list.'],
];
const options = [
    ['prepareLevitate', 'Prepare Levitate', 'Choose it from your spellbook during preparation.'],
    ['screenedPosition','Move behind the screen','Walk ten feet to a place where you can see the crate and the mage cannot see you.'],
    ['openPosition','Return to the open yard','Walk ten feet back into the mage’s view.'],
    ['takeSpring','Take the metal spring','Use the spell’s material component from the workbench.'],
    ['holdFocus','Hold the arcane focus','Use the wizard’s focus in place of the spring.'],
    ['setMaterialDown','Set your casting aid down','Leave the spring or focus on the bench.'],
    ['beginLevitate', 'Cast Levitate on the crate', ''],
    ['resolveLevitate', 'Resolve the casting', 'The watching mage attempts Counterspell if their reaction is available.'],
    ['nextSpellTurn', 'Begin your next turn', 'Your Magic action becomes available again.'],
    ['raiseCrate','Raise the crate another ten feet','Spend your Magic action to raise the crate.'],
    ['lowerCrate','Lower the crate by ten feet','Spend your Magic action to lower the crate.'],
    ['retrieveUnderCrate', 'Retrieve the wedged tool', 'Reach below the suspended crate and take the tool.'],
    ['endLevitate', 'End concentration', 'The crate floats gently back down.'],
];
export const levitationActions = options.map(([id,label])=>({id,label}));
export const levitationStudyActions = studyOptions.map(([id,label])=>({id,label}));
export function quoteLevitation(s, type, {mending=false}={}) {
    const row=options.find(([id])=>id===type) ?? (s.study&&studyOptions.find(([id])=>id===type));
    if(!row) return null;
    const canMove = s.pending ? 'Resolve the casting before moving.' : movement(s)<MOVE_FEET ? 'You need ten feet of movement.' : mending ? 'Finish or abandon Mending first.' : '';
    const canAdjust = !s.support ? 'You are not concentrating on Levitate.' : s.actionUsed ? 'You have used your action this turn.' : '';
    const feet=s.support?.feet??0;
    const kitChange = Object.hasOwn(materialChoices,type);
    const kitReason = s.pending ? 'Resolve the casting before changing your casting aid.' : mending ? 'Finish or abandon Mending first.' :
        material(s)===materialChoices[type] ? 'That is already your choice.' : '';
    const reason = {
        copyLevitate: s.known.includes('levitate') ? 'Levitate is already in your spellbook.' :
            (s.study?.gp??0)<COPYING_GP ? 'You need 100 GP in copying supplies.' : mending ? 'Finish or abandon Mending first.' : '',
        restAfterCopy: !s.known.includes('levitate') ? 'Copy Levitate before taking this rest.' :
            s.study?.rested ? 'You have already finished your rest.' : mending ? 'Finish or abandon Mending first.' : '',
        prepareLevitate: !s.known.includes('levitate') ? 'Copy Levitate into your spellbook first.' :
            s.study&&!s.study.rested ? 'Finish a long rest before changing your prepared spells.' :
            s.prepared.length ? 'Levitate is already prepared.' : s.turn!==1 || s.actionUsed || mending ? 'Your preparation window has ended.' : '',
        screenedPosition: position(s)==='screened' ? 'You are already behind the screen.' : canMove,
        openPosition: position(s)==='open' ? 'You are already in the open yard.' : canMove,
        beginLevitate: !s.prepared.includes('levitate') ? 'Prepare Levitate from the spellbook first.' : !s.slots ? 'You have no second-level slots left.' :
            s.actionUsed || s.pending ? 'You have used your Magic action this turn.' : mending ? 'Finish or abandon Mending first.' : s.support ? 'You are already holding this crate aloft.' :
            !s.means.voice ? 'Levitate requires the spoken words.' : !s.means.hand ? 'Levitate requires a hand for its gestures.' :
            material(s)==='none' ? 'Take the metal spring or hold the arcane focus.' : '',
        resolveLevitate: s.pending ? '' : 'There is no casting to resolve.',
        nextSpellTurn: s.pending ? 'Resolve the casting before passing the turn.' : !s.actionUsed&&movement(s)===SPEED_FEET ? 'Your turn has just begun.' : '',
        raiseCrate: canAdjust || (feet+LIFT_FEET>CEILING_FEET ? 'The roof limits further rise here.' : !inRange(s,feet+LIFT_FEET) ? 'The crate would be out of range.' : ''),
        lowerCrate: canAdjust || (feet===0 ? 'The crate is already at ground level.' : ''),
        retrieveUnderCrate: s.recovered ? 'You already recovered the tool.' : feet===0 ? 'The crate blocks the tool.' : s.actionUsed ? 'You have used your action this turn.' : '',
        endLevitate: s.support ? '' : 'You are not concentrating on Levitate.',
    }[type];
    const blocked = kitChange ? kitReason : reason;
    return blocked ? {eligible:false,reason:blocked} : {eligible:true,summary:type==='beginLevitate' ?
        'Magic action. Use the words, a free hand and the '+levitationMaterialLabel(s)+'. A second-level slot is due if the cast continues.' : type==='resolveLevitate'&&!mageCanReact(s) ?
        'No Counterspell is available. Resolve Levitate and spend the slot.' : row[2]};
}
export function settleLevitationStudy(s,type) {
    if(type==='copyLevitate'){
        s.study.gp-=COPYING_GP;s.known.push('levitate');
        return {minutes:COPYING_MINUTES,message:'You finish copying Levitate into your own spellbook.'};
    }
    need(type==='restAfterCopy','Unknown spellbook study action.');
    s.study.rested=true;s.slots=2;s.turn=1;s.actionUsed=false;s.movement=SPEED_FEET;
    return {minutes:REST_MINUTES,message:'After a long rest, you can prepare Levitate from your spellbook.'};
}

export function settleLevitation(s, type, {minute, profile, root, worldId}) {
    if(Object.hasOwn(materialChoices,type)){
        s.material=materialChoices[type];
        return s.material==='none' ? 'You leave the casting aid on the bench.' : 'You take the '+levitationMaterialLabel(s)+'.';
    }
    switch(type){
        case 'prepareLevitate': s.prepared=['levitate']; return 'You prepare Levitate from your spellbook.';
        case 'screenedPosition':
        case 'openPosition':
            s.position=type==='screenedPosition'?'screened':'open';
            s.movement=movement(s)-MOVE_FEET;
            return s.position==='screened'?'The screen hides you from the mage. You can still see the crate.':'You step back into the open yard.';
        case 'beginLevitate':
            need(TARGET.loose&&inRange(s,LIFT_FEET)&&TARGET.pounds<=500,'Choose a loose object in range weighing at most 500 pounds.');
            s.pending={targetId:TARGET.id,turn:s.turn,startedAt:minute,materialId:materials[material(s)].id}; s.actionUsed=true;
            return geometry(s).mageCanSee ? 'You speak and gesture with the '+levitationMaterialLabel(s)+' in hand. The watching mage sees the casting.' :
                'You speak and gesture with the '+levitationMaterialLabel(s)+' in hand, out of the mage’s sight.';
        case 'resolveLevitate': {
            const startedAt=s.pending.startedAt;
            s.pending=null;
            if(mageCanReact(s)){
                const check={id:'dnd.phandalin.counterspell',target:DC,
                    modifiers:[{id:'constitution',kind:'bonus',value:CONSTITUTION,reason:'Constitution saving throw'}]};
                const draw={root,worldId,lifeId:'life:dnd',gameTime:startedAt,eventId:'dnd.phandalin.levitate.counterspell'};
                const result=resolveCheck(profile,check,draw);
                s.counter=result.receipt; s.reactionUsed=true;
                if(!result.result.success) return 'Counterspell breaks the cast. Your action is spent, and you keep your spell slot.';
            }
            s.slots--;
            s.support={targetId:TARGET.id,feet:LIFT_FEET,until:minute+MAX_MINUTES};
            return 'The crate rises ten feet. It stays there while you concentrate.';
        }
        case 'nextSpellTurn': s.turn++;s.actionUsed=false;s.movement=SPEED_FEET;return 'Your next turn begins.';
        case 'raiseCrate':
        case 'lowerCrate':
            s.support.feet=Math.max(0,s.support.feet+(type==='raiseCrate'?LIFT_FEET:-LIFT_FEET));
            s.actionUsed=true;
            return s.support.feet ? 'The crate is now '+s.support.feet+' feet above the ground.' : 'The crate reaches the ground. You are still concentrating.';
        case 'retrieveUnderCrate': s.recovered=true;s.actionUsed=true;return 'You reach under the crate and recover the wedged tool.';
        case 'endLevitate': s.support=null;return 'You let go of the spell. The crate floats gently to the ground.';
        default: throw Error('Unknown Levitate action.');
    }
}
export function expireLevitation(s, minute) {
    return s.support && minute>=s.support.until ? settleLevitation(s,'endLevitate',{}) : null;
}
