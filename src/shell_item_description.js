// Present native item facts once; retain omitted technical lines on demand.
// No item statistics or comparison math is computed by this view.
export function descriptionCopy(tooltip) {
    const doc=tooltip.ownerDocument,copy=tooltip.cloneNode(true);
    copy.removeAttribute('id');copy.removeAttribute('style');copy.className='shell-native-item-description';
    for(const n of copy.querySelectorAll('[id]'))n.removeAttribute('id');
    const lines=[];let line=doc.createElement('div');
    const finish=()=>{if(line.textContent.trim()){line.className='shell-description-line';lines.push(line);}line=doc.createElement('div');};
    for(const child of [...copy.childNodes]){if(child.nodeName==='BR'){child.remove();finish();}else line.append(child);}finish();
    copy.replaceChildren();
    const extra=doc.createElement('details'),summary=doc.createElement('summary');summary.textContent='Item specifics';extra.className='shell-item-specifics';extra.append(summary);
    const seen=new Set();
    for(const [index,row] of lines.entries()){
        // Native tooltips begin with the item name; the panel owns that heading.
        if(index===0)continue;
        const text=row.textContent.trim(),key=text.replace(/\s+/g,' ');
        if(seen.has(key))continue;seen.add(key);
        if(/^(Component tier|Basic stats):?/.test(text)){if(!/^Basic stats:?[\s]*$/.test(text))extra.append(row);continue;}
        if(/^(Slot|Type|Material type|Effects|Compared to equipped|Time to read|Reading it provided|Value|Count in player inventory):?/.test(text))row.dataset.detailRole='label';
        if(/^Value:/.test(text))row.dataset.detailRole='value';
        if(/:\s*-\d/.test(text))row.dataset.detailRole='decrease';
        else if(/:\s*\+\d/.test(text))row.dataset.detailRole='increase';
        else {const multiplier=text.match(/:\s*x(\d+(?:\.\d+)?)/);if(multiplier&&Number(multiplier[1])!==1)row.dataset.detailRole=Number(multiplier[1])<1?'decrease':'increase';}
        copy.append(row);
    }
    if(extra.children.length>1)copy.append(extra);
    return copy;
}
