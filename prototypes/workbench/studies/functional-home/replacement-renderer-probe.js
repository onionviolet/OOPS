import {createReplacementReview} from './replacement-review.js';
let revision=0;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const component=createReplacementReview({escape:esc,read:()=>({identity:String(revision),title:'Tool handle · synthetic probe',current:'Practice handle',options:[{id:'wrapped',label:'Wrapped handle',available:true,reason:'Synthetic option'}],help:'No native tool state is used.'}),preview:id=>({identity:String(revision),eligible:true,summary:id,effects:[{label:'Grip stability',before:'Ordinary',after:'Improved'}],cost:'Synthetic quote: one wrap',disposition:'Original handle retained',action:'Apply probe'}),commit:()=>{revision++;return 'Tool adapter probe committed';}});
document.body.append(component.node);component.update();
