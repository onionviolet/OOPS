import {storyRecap} from './lore_history_view.js';
import {formatDuration} from './number_format.js';
import {LAYOUT_SPEC} from './layout_spec.js';

// UIC127, PRS1: what the action list calls someone ("Talk to the suspicious man" gives "The suspicious man"), so Around you
// shows no name the character has not learned. '' when the line is not of that shape.
export const heardName = line => {const m = String(line || '').replace(/<[^>]*>/g, '').trim().match(/^(?:talk|speak|chat) (?:to|with) (.+?)[.!]?$/i); return m ? m[1][0].toUpperCase() + m[1].slice(1) : '';};

// UIC127: the ways out of a place, read from the same links the action list uses. A fight has none.
// `act` is the verb the player presses; `role` is the walk, with a warning where the far side is not safe.
export function placeExits(location, context, travelTimes = {}) {
    if (!location || LAYOUT_SPEC.placeList?.exits === false) return [];
    return (location.connected_locations || []).map(link => link.location)
        .filter(to => to && to.canBeStarted(context) && !to.is_challenge)
        .map(to => {
            const minutes = travelTimes[location.id]?.[to.id], safe = !!to.tags?.safe_zone;
            return {id: `go:${to.id}`, name: to.name, safe, act: safe ? `Go to ${to.name}` : `Enter ${to.name}`,
                role: [Number.isFinite(minutes) && minutes > 0 ? `${formatDuration(minutes)} away` : '', safe ? '' : 'Not safe'].filter(Boolean).join(' · ')};
        });
}

// PS107: a way out that is not a walk (a crossing to another world) joins Ways out from its owner. A source returns rows
// {id, name, role, act, run}; pressing the row's action runs the owner's own control, so the owner stays the authority.
const wayOutSources = new Map();
export function registerWayOut(source) {
    wayOutSources.set(source.id, source);
    return () => { if (wayOutSources.get(source.id) === source) wayOutSources.delete(source.id); };
}
export function extraWayOuts() {
    const out = [];
    for (const s of wayOutSources.values()) { let found = []; try { found = s.rows() || []; } catch { found = []; } for (const r of found) if (r?.id && r.name) out.push(r); }
    return out;
}

const rows = value => Array.isArray(value) ? value : [];
const admitted = row => row && row.id && row.known !== false && row.hidden !== true;
const firstSentence = text => String(text || '').trim().match(/^.*?[.!?](?:\s|$)/)?.[0].trim() || String(text || '').trim();

// Read only the same observer-admitted frame used by villageFocus. No registry,
// schedule, danger or secret lookup belongs to this presentation leaf.
export function projectNearbyContext(frame = {}, selected = null, description = '') {
    const seen = new Set();
    const add = (source, kind) => rows(source).filter(admitted).filter(row => {
        if (row.id === 'projects' || seen.has(row.id)) return false;
        seen.add(row.id); return true;
    }).map(row => ({id:row.id,name:row.name,kind,role:row.role || row.description || '',
        traits:row.met === true ? rows(row.traits) : [],
        relationship:row.met === true ? row.relationship : null,
        memory:row.met === true ? storyRecap(frame.history || {}, row.id)?.line : null,
        actions:typeof row.run === 'function' ? [{id:`way:${row.id}`,label:row.act || row.name,run:row.run}] : rows(frame.actions).filter(admitted).filter(action => action.target === row.id)}));
    const people = add(frame.people, 'person');
    const services = [...add(frame.services, 'service'), ...add(frame.things, 'station')];
    const exits = add(frame.exits, 'exit');
    const subjects = [...people, ...services, ...exits];
    const requested = frame.dialogue || selected;
    const subject = subjects.find(row => row.id === requested) || null;
    const summary = [people.length ? `${people.length} ${people.length === 1 ? 'person' : 'people'}` : '',
        services.length ? `${services.length} ${services.length === 1 ? 'service / station' : 'services / stations'}` : '',
        exits.length ? `${exits.length} ${exits.length === 1 ? 'way out' : 'ways out'}` : ''].filter(Boolean).join(' · ');
    return {place:frame.place || 'This place',people,services,exits,subjects,subject,
        selectedId:subject?.id || null,summary,description:String(description || '').trim(),
        // A short account shows whole; a long one shows its first sentence with the rest behind More (PX46).
        ...(String(description || '').trim().length <= 320 ? {descriptionLead:String(description || '').trim(),descriptionRest:''} : {descriptionLead:firstSentence(description),descriptionRest:String(description || '').trim().slice(firstSentence(description).length).trim()}),missing:!!requested && !subject};
}

export function createNearbyContextView({choose,act,document:doc=globalThis.document} = {}) {
    const el=(tag,text='')=>{const n=doc.createElement(tag);n.textContent=text;return n;};
    const text=(n,value)=>{value=String(value||'');if(n.textContent!==value)n.textContent=value;};
    const node=el('section');node.className='nearby-context-view';node.setAttribute('aria-label','Around you');
    const summary=el('p');summary.className='nearby-context-summary';
    const placeLead=el('p'),place=el('details'),placeSummary=el('summary','More about this place'),placeBody=el('p');placeLead.className='nearby-place-lead';place.className='nearby-place-description';place.append(placeSummary,placeBody);
    const split=el('div');split.className='nearby-context-split';
    const list=el('div');list.className='nearby-context-list';list.setAttribute('aria-label','Known nearby subjects');
    const detail=el('section');detail.className='nearby-context-detail';detail.tabIndex=-1;detail.setAttribute('aria-label','Selected nearby subject');
    const navigation=el('nav');navigation.className='nearby-context-navigation';navigation.setAttribute('aria-label','Nearby inspection');
    const back=el('button'),previous=el('button','‹ Previous'),next=el('button','Next ›');for(const b of [back,previous,next])b.type='button';
    back.dataset.nearbyBack='';previous.dataset.nearbyPrevious='';next.dataset.nearbyNext='';navigation.append(previous,next);
    const title=el('h3'),role=el('p'),facts=el('p'),memory=el('p'),actions=el('div'),empty=el('p');actions.className='nearby-context-actions';
    detail.append(navigation,title,role,facts,memory,actions,back);split.append(list,detail);
    // PS120 (round 14): Around you folds to one line in the location box, "Here: 2 people · 6 stations · 3 ways out". Each
    // count opens its verb in the action list (Talk to someone, Move somewhere else); stations, with no single verb, and
    // Show all unfold the full list, so every subject, role and act stays one press away (PS129).
    const hereLine=el('p');hereLine.className='nearby-here-line';const hereLinks={};let expanded=false,lastArgs={};
    const openKind=(kind,selector)=>{const verb=selector&&doc.querySelector?.(`#location_actions_div ${selector}`);
        if(verb&&!verb.hidden&&verb.style?.display!=='none'){if(!verb.classList.contains('location_choice_dropdown_expanded'))verb.click();verb.scrollIntoView?.({block:'nearest'});verb.focus?.();return;}
        expanded=true;update(lastArgs);};
    for(const [kind,selector] of [['people','.choice_dialogue'],['services',null],['exits','.choice_travel']]){const b=el('button');b.type='button';b.dataset.hereLink=kind;b.onclick=()=>openKind(kind,selector);hereLinks[kind]=b;}
    const showAll=el('button');showAll.type='button';showAll.dataset.hereLink='all';showAll.onclick=()=>{expanded=!expanded;update(lastArgs);};
    hereLine.append(el('span','Here:'),hereLinks.people,hereLinks.services,hereLinks.exits,showAll);
    node.append(summary,placeLead,place,hereLine,split,empty);
    const groups=new Map(),buttons=new Map(),actionButtons=new Map();let model=null,lastPlace=null,returnId=null,missingNotice=false;
    const select=id=>{missingNotice=false;returnId=id || model?.selectedId || returnId;choose?.(id);};
    const move=direction=>{if(!model?.subjects.length)return;const index=model.subjects.findIndex(s=>s.id===model.selectedId);const target=model.subjects[(index+direction+model.subjects.length)%model.subjects.length];select(target.id);};
    previous.onclick=()=>move(-1);next.onclick=()=>move(1);
    const returnToList=()=>{select(null);buttons.get(returnId)?.focus();};
    back.onclick=returnToList;
    // Keyboard navigation is local and ignores inputs, commands and modified keys.
    list.addEventListener('keydown',event=>{if(event.altKey||event.ctrlKey||event.metaKey||!event.target.dataset.inspectNearby)return;
        const delta={ArrowDown:1,j:1,ArrowUp:-1,k:-1}[event.key];if(!delta)return;event.preventDefault();move(delta);buttons.get(returnId)?.focus();});
    const update=({frame,selected=null,description=''}={})=>{
        lastArgs={frame,selected,description};
        const previousModel=model;model=projectNearbyContext({...frame,exits:[...rows(frame?.exits),...extraWayOuts()]},selected,description);
        if(lastPlace!==model.place){place.open=false;returnId=null;missingNotice=false;lastPlace=model.place;list.scrollTop=0;detail.scrollTop=0;}
        if(model.missing)missingNotice=true;
        // PX46, UR147: the first sentence shows once; the disclosure holds only what follows it. No count line when there is nothing to count.
        text(summary,model.summary);summary.hidden=true;
        const count=(n,one,many)=>n?`${n} ${n===1?one:many}`:'';
        for(const [kind,words] of [['people',count(model.people.length,'person','people')],['services',count(model.services.length,'station','stations')],['exits',count(model.exits.length,'way out','ways out')]]){text(hereLinks[kind],words);hereLinks[kind].hidden=!words;
            hereLinks[kind].title=kind==='people'?'Opens Talk to someone in the actions':kind==='exits'?'Opens Move somewhere else in the actions':'Shows the stations and services here';}
        hereLine.hidden=!model.subjects.length;text(showAll,expanded?'Fold':'Show all');showAll.setAttribute('aria-expanded',String(expanded));
        node.dataset.compact=String(!expanded&&!model.subject&&!model.missing&&model.subjects.length>0);text(placeLead,model.descriptionLead);placeLead.hidden=!model.descriptionLead;
        text(placeBody,model.descriptionRest);place.hidden=!model.descriptionRest;text(back,`← ${model.place} overview`);
        // PS98: the pinned band's folded This place line reads these, so the counts have one author.
        // The frame re-measures when what this view holds changes shape (the centre split sizes the region to it).
        if(node.dataset.place!==model.place||node.dataset.placeSummary!==model.summary){node.dataset.place=model.place;node.dataset.placeSummary=model.summary;if(typeof CustomEvent==='function')doc.dispatchEvent?.(new CustomEvent('shell-content-change',{detail:{part:'around-you'}}));}
        node.dataset.selected=String(!!model.subject);node.dataset.selectionMissing=String(model.missing);
        for(const [kind,label,subjects] of [['people','People here',model.people],['services','Services & stations',model.services],['exits','Ways out',model.exits]]){
            let group=groups.get(kind);if(!group){group=el('section');group.dataset.nearbyGroup=kind;const heading=el('h3'),body=el('div');group.append(heading,body);groups.set(kind,group);list.append(group);}
            group.hidden=!subjects.length;text(group.firstChild,`${label} · ${subjects.length}`);
            const body=group.lastChild;
            for(const [index,subject] of subjects.entries()){
                let button=buttons.get(subject.id);if(!button){button=el('button');button.type='button';button.append(el('strong'),el('small'));button.dataset.inspectNearby=subject.id;button.onclick=()=>select(subject.id);buttons.set(subject.id,button);}
                if(body.children[index]!==button)body.insertBefore(button,body.children[index]||null);
                text(button.firstChild,subject.name);text(button.lastChild,subject.role);button.lastChild.hidden=!subject.role;
                button.dataset.nearbyKind=subject.kind;button.setAttribute('aria-pressed',String(subject.id===model.selectedId));button.title=subject.kind==='exit'?`${subject.name}: see the way there`:`Inspect ${subject.name}`;
            }
        }
        let removedFocus=false;for(const [id,button] of buttons)if(!model.subjects.some(s=>s.id===id)){removedFocus ||= doc.activeElement===button;button.remove();buttons.delete(id);}
        const subject=model.subject;detail.hidden=!subject;
        // PX90: the populated Village list already shows what can be inspected.
        empty.hidden=!!subject || (frame?.inVillage===true && model.subjects.length>0 && !missingNotice);
        text(empty,missingNotice?'That subject is no longer available here. Choose another known subject.':model.subjects.length?'Choose someone or something here to inspect.':(model.description?'Nothing here to pick out just now.':'Nothing here to inspect yet. Talk to someone in Local actions to meet them.'));
        if(subject){text(title,subject.name);text(role,subject.role);role.hidden=!subject.role;
            const known=[subject.traits.length?`Known traits: ${subject.traits.join(', ')}`:'',subject.relationship?`Relationship: ${subject.relationship}`:''].filter(Boolean).join(' · ');
            text(facts,known);facts.hidden=!known;text(memory,subject.memory);memory.hidden=!subject.memory;
            previous.hidden=next.hidden=model.subjects.length<2;
        }
        const wanted=subject?.actions||[];
        for(const [id,button] of actionButtons)if(!wanted.some(a=>a.id===id)){removedFocus ||= doc.activeElement===button;button.remove();actionButtons.delete(id);}
        for(const [index,action] of wanted.entries()){
            let button=actionButtons.get(action.id);if(!button){button=el('button');button.type='button';button.dataset.focusAction=action.id;
                button.onclick=()=>{const current=model.subject?.actions.find(a=>a.id===action.id);if(current&&!current.disabled){if(current.run)current.run();else act?.(current.id);}};actionButtons.set(action.id,button);}
            if(actions.children[index]!==button)actions.insertBefore(button,actions.children[index]||null);
            text(button,action.label);button.disabled=!!action.disabled;button.title=action.reason||'';
        }
        // A disappearing subject must not strand keyboard focus in a removed detail.
        // UIC127: with a row picked the list is one narrow column, so keep the picked row in sight.
        if(subject&&previousModel?.selectedId!==subject.id)buttons.get(subject.id)?.scrollIntoView?.({block:'nearest'});
        if(removedFocus || (!subject && previousModel?.subject && detail.contains(doc.activeElement))) (buttons.get(returnId)||buttons.values().next().value||node).focus();
        return model;
    };
    node.tabIndex=-1;
    return {node,update,returnToList,destroy:()=>node.remove()};
}
