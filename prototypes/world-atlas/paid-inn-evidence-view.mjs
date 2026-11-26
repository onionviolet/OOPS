const BACK='#workbench/play-evidence/fang-first-night';
export function renderPaidInnEvidence({main,report,element:el}){
 const sheet=el('article',null,'sheet findings-sheet');sheet.style.overflowWrap='anywhere';sheet.dataset.nativeEvidence='fang-paid-inn';
 const back=el('a','Back to Fang Yuan’s first-night card');back.href=BACK;
 sheet.append(el('h2','Fang Yuan · paid inn evidence'),back);main.replaceChildren(sheet);
 if(report.status!=='verified'){
  const message=el('p',report.status==='loading'?'Reading the paid-inn proof…':'The paid-inn proof is unavailable or changed. No paid-room result is inferred.');message.setAttribute('role','status');sheet.append(message);return sheet;
 }
 sheet.append(el('p','Separate paid-room check on normal build 8751c15d. The guardians’ house and prepared source qualification remain on the original card.'),el('p',report.scope));
 sheet.append(el('h3','Earned room: desktop check'),el('p',report.desktop.summary),el('p',report.desktop.viewport.join(' × ')+' desktop. The paid bed uses the existing room without another rent charge; the grove has no bed.'));
 sheet.append(el('h3','Earlier paid-room save: sleep, restore and breakfast'),el('p',report.persistence));
 function table(rows,columns,caption){
  const wrap=el('div',null,'reading-survey-table'),grid=el('table'),head=el('thead'),tr=el('tr');grid.append(el('caption',caption));
  for(const [,label]of columns){const th=el('th',label);th.setAttribute('scope','col');tr.append(th);}head.append(tr);grid.append(head);const body=el('tbody');
  for(const row of rows){const line=el('tr');for(const [key]of columns)line.append(el('td',key==='essence'?row[key]+'/44':String(row[key])));body.append(line);}grid.append(body);wrap.append(grid);return wrap;
 }
 sheet.append(table(report.savedRoute,[['action','Played step'],['essence','Essence'],['untouchedStones','Untouched stones']],'Earlier native save, distinct from the desktop checkpoint'));
 sheet.append(el('p','Prior worm work stayed completed through sleep and restoration. Breakfast followed as its own action.'));
 const breakfast=el('a','Read the later breakfast choices and source qualification');breakfast.href='#workbench/play-evidence/fang-first-night/breakfast';sheet.append(breakfast);
 const route=el('details');route.append(el('summary','Seven earned steps leading to the later first-night working'),table(report.route,[['action','Action'],['place','Place'],['essence','Essence'],['untouchedStones','Untouched stones']],'Earned continuation before the sleeping-save check'));sheet.append(route);
 const identity=el('details');identity.append(el('summary','Build and proof identity'),el('p','Tested normal bundle: '+report.testedBundleSha256),el('p','Verified paid-inn metadata: '+report.evidenceSha256));const machine=el('a','Machine-readable whole-card record');machine.href='/native-play-record/fang';identity.append(machine);sheet.append(identity);
 return sheet;
}
export async function paidInnEvidenceView({main,element:el,read=()=>fetch('/native-paid-inn-evidence',{cache:'no-store'})}){
 const loading=renderPaidInnEvidence({main,element:el,report:{status:'loading'}});
 try{const response=await read();if(!response.ok)throw Error();const report=await response.json();if(loading.isConnected)renderPaidInnEvidence({main,element:el,report});}
 catch{if(loading.isConnected)renderPaidInnEvidence({main,element:el,report:{status:'unavailable'}});}
}
