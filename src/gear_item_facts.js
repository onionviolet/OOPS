import {getAffix,isReductionAffix} from './gear_affixes.js';
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function gearItemFacts(item) {
    const rows=[];
    for(const entry of item.affixes||[]) {
        const a=getAffix(entry.id);if(!a)continue;
        const amount=a.operation==='flat'?`+${entry.v}`:`${(entry.v*100).toFixed(1)}% ${isReductionAffix(a)?'reduction':'increase'}`;
        rows.push(`${a.name}: ${a.stat.replaceAll('_',' ')} ${amount} (${entry.s==='mechanism'?'from its parts':'resolved when made'})`);
    }
    if(item.gearwork) {
        if(item.gearwork.socket)rows.push(`Rigid setting: ${item.gearwork.roles.setting?'filled with '+item.gearwork.roles.setting.name:'empty'}`);
        for(const [role,part]of Object.entries(item.gearwork.roles))rows.push(`${role}: ${part.name}, lot grade ${part.grade}`);
        rows.push(`Treatment: ${item.gearwork.treatment.stage}. ${item.gearwork.history.length} recorded processes; condition and item identity stay with this copy.`);
        const last=item.gearwork.history.at(-1);if(last)rows.push(`Last work: ${last.action} by ${last.maker==='oldCraftsman'?'old craftsman':last.maker}, ${last.location}.`);
    }
    return rows;
}
// The native tooltip owns these facts. Shell inspection clones that one view.
// Existing authored description markup retains its established presentation.
export function gearItemFactsHtml(item,description='') {
    return (description?`<br>${description}`:'')+gearItemFacts(item).map(row=>`<br>${esc(row)}`).join('');
}
