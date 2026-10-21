import {LAYOUT_SPEC} from './layout_spec.js';
import {registerShortcut} from './shortcut_registry.js';

// UIL7: presentation-only gutter controller. The workspace remains the only placement writer.
// Fractions follow the browser's existing per-context R21 placement; geometry is measured only
// at stable composition moments or during an explicit resize, never on simulation ticks.
export function clampSplit(value, total, before, after) {
    return Math.max(before, Math.min(total - after, value));
}
export function createShellResize({root, board, regions, read, context, commit}) {
    registerShortcut({id:'divider-resize',keys:'Arrow keys to resize, Home to reset, Esc cancels a drag',label:'Panel divider',scope:'On a divider'});
    let drag = null, preview = null, lastContext = null;
    const handles = {};
    const definitions = {
        topLeft: ['top left and top centre', 'vertical'],
        bottomLeft: ['bottom left and actions', 'vertical'],
        log: ['Centre and Reports', 'vertical'],
        top: ['Top and bottom panels', 'horizontal'],
    };
    const canvas = document.createElement('canvas'), pen = canvas.getContext('2d');
    // Minimum readable unit: longest visible word/control and header chrome at the current font.
    // Long prose wraps; lists scroll. We never scale text or measure an entire paragraph as one row.
    function minimum(region) {
        const style = getComputedStyle(region), font = parseFloat(style.getPropertyValue('--shell-context-size')) || 14;
        let width = font * 8;
        for (const node of region.querySelectorAll('button,select,summary,strong,label,[data-panel-row]')) {
            if (!node.checkVisibility() || node.closest('.workspace-module-controls,.shell-move-control')) continue;
            const css = getComputedStyle(node); pen.font = css.font || `${css.fontStyle} ${css.fontWeight} ${css.fontSize} ${css.fontFamily}`;
            const text = node.tagName === 'SELECT' ? node.selectedOptions[0]?.textContent || '' : node.textContent;
            const word = Math.max(0, ...text.trim().split(/\s+/).map(w => pen.measureText(w).width));
            width = Math.max(width, word + font * 2);
        }
        // You needs two readable stat columns. A single column pushes Gear and
        // Condition below the frame even though every individual word fits.
        const sheet = region.querySelector('#proto23_character');
        if (sheet) {
            let pair = 0;
            for (const row of sheet.querySelectorAll('.shell-core-stats > button')) {
                const css = getComputedStyle(row); pen.font = css.font || `${css.fontStyle} ${css.fontWeight} ${css.fontSize} ${css.fontFamily}`;
                pair = Math.max(pair, pen.measureText(row.firstElementChild.textContent).width + pen.measureText(row.children[1].textContent).width + font * .75);
            }
            width = Math.max(width, pair * 2 + font * 1.35);
        }
        if (region === regions.log) {
            const header = region.querySelector('.workspace-module-header');
            let chrome = 0;
            for (const n of header?.querySelectorAll('strong,small,button,select') || []) {
                if (!n.checkVisibility() || n.closest('.workspace-module-controls,.shell-move-control')) continue;
                pen.font=getComputedStyle(n).font;
                const text=n.tagName==='SELECT' ? n.selectedOptions[0]?.textContent || '' : n.textContent;
                chrome += pen.measureText(text).width + font;
            }
            width=Math.max(width,chrome);
        }
        if (region === regions.actions) {
            let navigation=0;
            for (const n of region.querySelectorAll('[data-module="pane-navigation"] button')) {
                if(!n.checkVisibility())continue;
                pen.font=getComputedStyle(n).font; navigation+=pen.measureText(n.textContent).width+font;
            }
            width=Math.max(width,navigation);
        }
        return Math.ceil(width + 12);
    }
    const visible = n => n.getClientRects().length && getComputedStyle(n).display !== 'none';
    function measure() {
        const enabled = root.dataset.parity === 'r3';
        for (const h of Object.values(handles)) h.hidden = !enabled;
        if (!enabled) { clear(); return; }
        if (drag && drag.context !== context()) finish(true);
        if (lastContext !== context()) { clear(); lastContext = context(); }
        const sizes = preview || read();
        if (!Object.keys(sizes).length) clear();
        const rect = board.getBoundingClientRect(), css = getComputedStyle(board);
        const pad = parseFloat(css.paddingLeft), gap = parseFloat(css.columnGap), total = rect.width - pad * 2 - gap * 3;
        const font = parseFloat(getComputedStyle(regions.player).getPropertyValue('--shell-context-size')) || 14;
        const minLog = minimum(regions.log), minLeft = Math.max(minimum(regions.player), minimum(regions.inventory));
        const minCentre = Math.max(minimum(regions.focus), minimum(regions.actions));
        const log = clampSplit((sizes.log || regions.log.getBoundingClientRect().width / total) * total, total, minLog, minLeft + minCentre);
        const leftMax = total - log;
        const current = r => (r.getBoundingClientRect().right - rect.left - pad - gap) / total;
        const topLeft = clampSplit((sizes.topLeft || current(regions.player)) * total, leftMax, minLeft, minCentre);
        const bottomLeft = clampSplit((sizes.bottomLeft || current(regions.inventory)) * total, leftMax, minLeft, minCentre);
        if (['topLeft','bottomLeft','log'].some(k => sizes[k])) {
            const low = Math.min(topLeft,bottomLeft), high = Math.max(topLeft,bottomLeft);
            board.style.setProperty('grid-template-columns', `${low}px ${high-low}px ${total-high-log}px ${log}px`, 'important');
            board.style.setProperty('grid-template-areas', 'none', 'important');
            const service = !visible(regions.focus);
            const set = (id,col,row) => { regions[id].style.setProperty('grid-area','auto','important'); regions[id].style.setProperty('grid-row', row, 'important'); regions[id].style.setProperty('grid-column', col, 'important'); };
            const topEnd = topLeft <= bottomLeft ? 2 : 3, bottomEnd = bottomLeft <= topLeft ? 2 : 3;
            set('player', `1 / span ${topEnd-1}`, '1');
            set('focus', `${topEnd} / span ${4-topEnd}`, '1');
            set('inventory', `1 / span ${(service ? topEnd : bottomEnd)-1}`, '2');
            set('actions', `${service ? topEnd : bottomEnd} / span ${4-(service ? topEnd : bottomEnd)}`, service ? '1 / span 2' : '2');
            set('log', '4', '1 / span 2');
        }
        const height = rect.height - parseFloat(css.paddingTop) * 2 - parseFloat(css.rowGap);
        const minTop = font * LAYOUT_SPEC.topRow.minLines, minBottom = font * LAYOUT_SPEC.topRow.bottomLines;
        if (sizes.top) {
            const row = clampSplit(sizes.top * height, height, minTop, minBottom);
            board.style.setProperty('grid-template-rows', `${row}px minmax(0,1fr)`, 'important');
        } else board.style.removeProperty('grid-template-rows');
        const player = regions.player.getBoundingClientRect(), inventory = regions.inventory.getBoundingClientRect(), reports = regions.log.getBoundingClientRect();
        const place = (key,x,y,w,h) => Object.assign(handles[key].style,{left:`${x-rect.left}px`,top:`${y-rect.top}px`,width:`${w}px`,height:`${h}px`});
        const service = !visible(regions.focus);
        handles.bottomLeft.hidden = service;
        place('topLeft', player.right, player.top, gap, service ? reports.height : player.height);
        place('bottomLeft', inventory.right, inventory.top, gap, inventory.height);
        place('log', reports.left-gap, reports.top, gap, reports.height);
        place('top', player.left, player.bottom, reports.left-player.left-gap, parseFloat(css.rowGap));
        for (const [key,h] of Object.entries(handles)) {
            const val = key==='top' ? player.height / rect.height : key==='log' ? (reports.left-rect.left)/rect.width : ((key==='topLeft'?player:inventory).right-rect.left)/rect.width;
            h.setAttribute('aria-valuenow',Math.round(val*100));
        }
        return {rect, total, minLeft, minCentre, minLog, height, minTop, minBottom};
    }
    function clear() {
        for (const k of ['grid-template-columns','grid-template-rows','grid-template-areas']) board.style.removeProperty(k);
        for (const r of Object.values(regions)) for(const p of ['grid-area','grid-row','grid-column']) r.style.removeProperty(p);
    }
    function sizesNow() {
        const b=board.getBoundingClientRect(), css=getComputedStyle(board), total=b.width-parseFloat(css.paddingLeft)*2-parseFloat(css.columnGap)*3;
        return {...read(),topLeft:(regions.player.getBoundingClientRect().width-parseFloat(css.columnGap))/total,
            bottomLeft:regions.inventory.getBoundingClientRect().width/total,log:regions.log.getBoundingClientRect().width/total,
            top:regions.player.getBoundingClientRect().height/(b.height-parseFloat(css.paddingTop)*2-parseFloat(css.rowGap))};
    }
    function adjust(key, delta, initial) {
        const info=measure(); if(!info)return;
        const {total,height,minTop,minBottom,minLeft,minCentre,minLog}=info;
        const next={...initial};
        if (key==='top') next.top=clampSplit(initial.top*height+delta,height,minTop,minBottom)/height;
        else if(key==='log') next.log=clampSplit(initial.log*total-delta,total,minLog,minLeft+minCentre)/total;
        else next[key]=clampSplit(initial[key]*total+delta,total-initial.log*total,minLeft,minCentre)/total;
        // Moving a vertical divider must not silently turn automatic row height
        // into a saved fixed height. Extra bars still need a content-fit row.
        if (key !== 'top' && !read().top) delete next.top;
        preview=next;measure();
    }
    function finish(cancel=false) {
        if(!drag)return;
        const g=drag;drag=null;
        if(handles[g.key].hasPointerCapture(g.id))handles[g.key].releasePointerCapture(g.id);
        const next=preview;preview=null;
        if(!cancel&&next)commit(next); else {clear();measure();}
        delete root.dataset.shellResizing;
    }
    const escape=e=>{if(drag&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();finish(true);}};
    document.addEventListener('keydown',escape,true);
    for(const [key,[label,orientation]] of Object.entries(definitions)) {
        const h=document.createElement('div');h.className='shell-resize-handle';h.dataset.shellResize=key;h.tabIndex=0;
        h.setAttribute('role','separator');h.setAttribute('aria-label',`Resize ${label}`);h.setAttribute('aria-orientation',orientation);
        h.setAttribute('aria-valuemin','0');h.setAttribute('aria-valuemax','100');h.title=`Resize ${label}. Arrow keys adjust; Escape cancels a drag; double-click or Home resets this divider.`;
        h.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();h.focus({preventScroll:true});drag={key,id:e.pointerId,x:e.clientX,y:e.clientY,initial:sizesNow(),context:context()};root.dataset.shellResizing='true';h.setPointerCapture(e.pointerId);});
        h.addEventListener('pointermove',e=>{if(drag?.key===key&&drag.id===e.pointerId)adjust(key,orientation==='horizontal'?e.clientY-drag.y:e.clientX-drag.x,drag.initial);});
        h.addEventListener('pointerup',()=>finish());h.addEventListener('pointercancel',()=>finish(true));h.addEventListener('lostpointercapture',()=>finish(true));
        h.addEventListener('keydown',e=>{const keys=orientation==='horizontal'?['ArrowUp','ArrowDown']:['ArrowLeft','ArrowRight'];if(!keys.includes(e.key))return;e.preventDefault();e.stopPropagation();adjust(key,(keys.indexOf(e.key)?1:-1)*(e.shiftKey?40:10),sizesNow());const next=preview;preview=null;commit(next);});
        // GU5: reset this divider alone. The other dividers keep their sizes; the stored size for this
        // one is dropped, so the context's default shows for it again.
        const resetThis=()=>{const next={...read()};if(!(key in next))return;delete next[key];commit(next);};
        h.addEventListener('dblclick',e=>{e.preventDefault();resetThis();});
        h.addEventListener('keydown',e=>{if(e.key!=='Home')return;e.preventDefault();e.stopPropagation();resetThis();});
        handles[key]=h;board.append(h);
    }
    return {measure,prepare(){if(lastContext!==context()||!Object.keys(preview||read()).length)clear();},destroy(){document.removeEventListener('keydown',escape,true);for(const h of Object.values(handles))h.remove();clear();}};
}
