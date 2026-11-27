// One readable DOM copy, with native disclosure/keyboard semantics.
import {kitElement} from './kit.js';
export function renderCircusHandbill(paper,{open=false,onToggle,document:doc=globalThis.document}={}){
 if(!paper)return null;
 const el=(tag,text,className)=>kitElement(tag,className||'',text,doc);
 const details=el('details',null,'lotm-handbill');details.dataset.lotmHandbill=paper.copy;details.open=open;
 const summary=el('summary','Read the circus notice');summary.dataset.lotmHandbillSummary='';
 const sheet=el('article',null,'lotm-handbill__sheet');
 sheet.append(el('h4',paper.title,'lotm-handbill__title'));
 for(const line of paper.lines)sheet.append(el('p',line,'lotm-handbill__line'));
 details.append(summary,sheet,el('small',paper.caption,'lotm-handbill__caption'));
 details.addEventListener('toggle',()=>onToggle?.(details.open));return details;
}
