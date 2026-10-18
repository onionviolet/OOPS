import {storyRecap} from './lore_history_view.js';

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
        actions:rows(frame.actions).filter(admitted).filter(action => action.target === row.id)}));
    const people = add(frame.people, 'person');
    const services = [...add(frame.services, 'service'), ...add(frame.things, 'station')];
    const subjects = [...people, ...services];
    const requested = frame.dialogue || selected;
    const subject = subjects.find(row => row.id === requested) || null;
    const summary = [people.length ? `${people.length} ${people.length === 1 ? 'person' : 'people'}` : '',
        services.length ? `${services.length} ${services.length === 1 ? 'service / station' : 'services / stations'}` : ''].filter(Boolean).join(' · ') || 'No known subjects here';
    return {place:frame.place || 'This place',people,services,subjects,subject,
        selectedId:subject?.id || null,summary,description:String(description || '').trim(),
        descriptionLead:firstSentence(description),missing:!!requested && !subject};
}

export function createNearbyContextView({choose,act,document:doc=globalThis.document} = {}) {
    const el=(tag,text='')=>{const n=doc.createElement(tag);n.textContent=text;return n;};
    const text=(n,value)=>{value=String(value||'');if(n.textContent!==value)n.textContent=value;};
    const node=el('section');node.className='nearby-context-view';node.setAttribute('aria-label','Around you');
    const summary=el('p');summary.className='nearby-context-summary';
    const place=el('details'),placeSummary=el('summary'),placeBody=el('p');place.className='nearby-place-description';place.append(placeSummary,placeBody);
    const split=el('div');split.className='nearby-context-split';
    const list=el('div');list.className='nearby-context-list';list.setAttribute('aria-label','Known nearby subjects');
    const detail=el('section');detail.className='nearby-context-detail';detail.tabIndex=-1;detail.setAttribute('aria-label','Selected nearby subject');
    const navigation=el('nav');navigation.className='nearby-context-navigation';navigation.setAttribute('aria-label','Nearby inspection');
    const back=el('button'),previous=el('button','‹ Previous'),next=el('button','Next ›');for(const b of [back,previous,next])b.type='button';
    back.dataset.nearbyBack='';previous.dataset.nearbyPrevious='';next.dataset.nearbyNext='';navigation.append(previous,next);
    const title=el('h3'),role=el('p'),facts=el('p'),memory=el('p'),actions=el('div'),empty=el('p');actions.className='nearby-context-actions';
    detail.append(navigation,title,role,facts,memory,actions,back);split.append(list,detail);node.append(summary,place,split,empty);
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
        const previousModel=model;model=projectNearbyContext(frame,selected,description);
        if(lastPlace!==model.place){place.open=false;returnId=null;missingNotice=false;lastPlace=model.place;list.scrollTop=0;detail.scrollTop=0;}
        if(model.missing)missingNotice=true;
        text(summary,model.summary);text(placeSummary,model.descriptionLead);text(placeBody,model.description);place.hidden=!model.description;
        // The first sentence is the compact place account; the disclosure holds its full native text.
        placeSummary.title='More about this place';text(back,`← ${model.place} overview`);
        node.dataset.selected=String(!!model.subject);node.dataset.selectionMissing=String(model.missing);
        for(const [kind,label,subjects] of [['people','People here',model.people],['services','Services & stations',model.services]]){
            let group=groups.get(kind);if(!group){group=el('section');const heading=el('h3'),body=el('div');group.append(heading,body);groups.set(kind,group);list.append(group);}
            group.hidden=!subjects.length;text(group.firstChild,`${label} · ${subjects.length}`);
            const body=group.lastChild;
            for(const [index,subject] of subjects.entries()){
                let button=buttons.get(subject.id);if(!button){button=el('button');button.type='button';button.append(el('strong'),el('small'));button.dataset.inspectNearby=subject.id;button.onclick=()=>select(subject.id);buttons.set(subject.id,button);}
                if(body.children[index]!==button)body.insertBefore(button,body.children[index]||null);
                text(button.firstChild,subject.name);text(button.lastChild,subject.role);button.lastChild.hidden=!subject.role;
                button.dataset.nearbyKind=subject.kind;button.setAttribute('aria-pressed',String(subject.id===model.selectedId));button.title=`Inspect ${subject.name}`;
            }
        }
        let removedFocus=false;for(const [id,button] of buttons)if(!model.subjects.some(s=>s.id===id)){removedFocus ||= doc.activeElement===button;button.remove();buttons.delete(id);}
        const subject=model.subject;detail.hidden=!subject;empty.hidden=!!subject;
        text(empty,missingNotice?'That subject is no longer available here. Choose another known subject.':model.subjects.length?'Choose someone or something here to inspect.':'No known people, services or stations to inspect here.');
        if(subject){text(title,subject.name);text(role,subject.role);role.hidden=!subject.role;
            const known=[subject.traits.length?`Known traits: ${subject.traits.join(', ')}`:'',subject.relationship?`Relationship: ${subject.relationship}`:''].filter(Boolean).join(' · ');
            text(facts,known);facts.hidden=!known;text(memory,subject.memory);memory.hidden=!subject.memory;
            previous.hidden=next.hidden=model.subjects.length<2;
        }
        const wanted=subject?.actions||[];
        for(const [id,button] of actionButtons)if(!wanted.some(a=>a.id===id)){removedFocus ||= doc.activeElement===button;button.remove();actionButtons.delete(id);}
        for(const [index,action] of wanted.entries()){
            let button=actionButtons.get(action.id);if(!button){button=el('button');button.type='button';button.dataset.focusAction=action.id;
                button.onclick=()=>{const current=model.subject?.actions.find(a=>a.id===action.id);if(current&&!current.disabled)act?.(current.id);};actionButtons.set(action.id,button);}
            if(actions.children[index]!==button)actions.insertBefore(button,actions.children[index]||null);
            text(button,action.label);button.disabled=!!action.disabled;button.title=action.reason||'';
        }
        // A disappearing subject must not strand keyboard focus in a removed detail.
        if(removedFocus || (!subject && previousModel?.subject && detail.contains(doc.activeElement))) (buttons.get(returnId)||buttons.values().next().value||node).focus();
        return model;
    };
    node.tabIndex=-1;
    return {node,update,returnToList,destroy:()=>node.remove()};
}
