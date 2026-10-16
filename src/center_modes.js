// Ephemeral navigation only. Native commands still own stopping work and trade.
export function createCenterModes(paint) {
    const stack = [];
    const draw = (direction='open') => paint(stack.at(-1)?.mode || 'local', stack.length, stack.at(-2)?.mode || 'local', direction);
    return {
        open(mode, stop) {
            if (stack.at(-1)?.mode === mode) { stack.at(-1).stop = stop; draw(); return; }
            stack.push({mode, stop}); draw();
        },
        close(mode) {
            const at = stack.findLastIndex(entry => entry.mode === mode);
            if (at >= 0) stack.splice(at,1); draw('back');
        },
        local() {
            // A native return/completion retires native screens, including those
            // underneath an inspection, without erasing borrowed reference views.
            for(let i=stack.length-1;i>=0;i--)if(stack[i].mode!=='mixing'&&!stack[i].mode.startsWith('workspace:'))stack.splice(i,1);
            draw('back');
        },
        back() {
            const entry = stack.pop();
            if (!entry) return false;
            try { if(!stack.some(earlier=>earlier.mode===entry.mode))entry.stop?.(); } catch (error) { stack.push(entry); draw(); throw error; }
            draw('back'); return true;
        },
        get mode() { return stack.at(-1)?.mode || 'local'; },
    };
}

let owner;
export function centerModes() {
    if (owner) return owner;
    const actions = document.getElementById('location_actions_div');
    const nav = document.createElement('div'); nav.id = 'center_mode_navigation';
    const back = document.createElement('button'); back.id = 'center_mode_back'; back.type = 'button';
    back.textContent = '← Village'; back.addEventListener('click', () => owner.back());
    nav.append(back);
    const host = actions.parentElement;
    const content = document.createElement('div'); content.id = 'center_mode_content';
    actions.before(content);
    for (const id of ['location_actions_div','trade_div','storage_div','crafting_window']) {
        const node = document.getElementById(id); if (node) content.append(node);
    }
    host.append(nav);
    const views=new Map(),positions=new Map();let activeMode='local',releasedMode=null;
    const remember=mode=>{const root=views.get(mode)?.node||content;positions.set(mode,{scroll:[content,root,...root.querySelectorAll('*')].filter(n=>n.scrollHeight>n.clientHeight).map(n=>[n,n.scrollTop,n.scrollLeft]),groups:[...root.querySelectorAll('details')].map(n=>[n,n.open]),dropdowns:[...root.querySelectorAll('.location_choice_dropdown')].map(n=>[n.className.split(' ').find(c=>c.startsWith('choice_')),n.classList.contains('location_choice_dropdown_expanded')])});};
    const surfaces = {crafting: 'crafting_window', trade: 'trade_div', storage: 'storage_div', mixing: 'village_mixing_panel'};
    const titles={crafting:'Crafting',trade:'Trade',storage:'Storage',mixing:'Village mixing counter'};
    const nativeHeadings=new Map();
    function modeHeading(mode) {
        if(!surfaces[mode])return views.get(mode)?.node.querySelector('.expanded-panel-heading');
        let heading=nativeHeadings.get(mode);
        if(!heading){heading=document.createElement('h2');heading.className='expanded-panel-heading';heading.tabIndex=-1;heading.textContent=titles[mode];content.insertBefore(heading,content.firstChild);nativeHeadings.set(mode,heading);}
        for(const[key,node]of nativeHeadings)node.hidden=key!==mode;
        return heading;
    }
    owner = createCenterModes((mode, depth, destination,direction) => {
        const changed=activeMode!==mode;if(changed&&releasedMode!==activeMode)remember(activeMode);releasedMode=null;
        activeMode=mode;
        for(const[key,node]of nativeHeadings)node.hidden=key!==mode;
        const mixing = document.getElementById('village_mixing_panel');
        if (mixing && mixing.parentElement !== content) content.append(mixing);
        nav.hidden = !depth;
        host.classList.toggle('center-mode-open', !!depth);
        // R13: one published fact for layout: which center task or reference is open, if any.
        const root = document.getElementById('main_content'); if (root) { if (depth) root.dataset.centerTask = mode; else delete root.dataset.centerTask; }
        const place = document.getElementById('location_name_span')?.textContent.trim() || 'Local actions';
        const label = views.get(destination)?.label || {mixing:'Village mixing counter',dialogue:'Conversation',reading:'Reading',sleep:'Resting',activity:'Current work',action:'Current work',crafting:'Crafting',trade:'Trade',storage:'Storage'}[destination] || place;
        back.textContent = `← ${label}${mode === 'reading' ? ' · Stop reading' : mode === 'sleep' ? ' · Wake up' : ''}`;
        back.setAttribute('aria-label', back.textContent);
        nav.dataset.centerMode = mode;
        for (const [key, id] of Object.entries(surfaces)) {
            const node = document.getElementById(id); if (!node) continue;
            node.classList.toggle('center-mode-hidden', mode !== key);
            node.style.display = mode === key ? 'block' : 'none';
        }
        for(const [key,view] of views)view.node.classList.toggle('center-mode-hidden',key!==mode);
        const native = !Object.hasOwn(surfaces, mode)&&!views.has(mode);
        actions.classList.toggle('center-mode-hidden', !native); actions.style.display = native ? 'block' : 'none';
        if (changed) {
            const saved=positions.get(mode);
            if(saved) {for(const [n,open]of saved.groups)if(n.isConnected)n.open=open;for(const [cls,open]of saved.dropdowns){const n=cls&&content.querySelector('.'+cls);n?.classList.toggle('location_choice_dropdown_expanded',open);}for(const [n,top,left]of saved.scroll)if(n.isConnected){n.scrollTop=top;n.scrollLeft=left;}}
            else content.scrollTop=0;
            if(depth)host.closest('.workspace-module')?.scrollIntoView({block:'nearest'});
            if(depth)modeHeading(mode)?.focus({preventScroll:true});
        }
    });
    owner.registerView=(mode,node,label)=>{views.set(mode,{node,label});content.append(node);};
    owner.releaseView=mode=>{const view=views.get(mode);if(view){remember(mode);releasedMode=mode;view.node.classList.remove('center-mode-hidden');views.delete(mode);}};
    owner.showHere=()=>{for(let i=0;i<30&&owner.mode.startsWith('workspace:');i++)owner.back();if(['mixing','crafting'].includes(owner.mode))owner.back();host.closest('.workspace-module')?.scrollIntoView({block:'nearest'});};
    document.addEventListener('keydown', event => {
        if (event.key !== 'Escape' || event.defaultPrevented || document.querySelector('dialog[open]')) return;
        if (owner.back()) { event.preventDefault(); event.stopPropagation(); }
    });
    return owner;
}
