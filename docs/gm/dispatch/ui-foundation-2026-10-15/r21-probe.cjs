// R21 dev probe: open a control box at one target and screenshot it. Usage: node r21-probe.cjs <label> <box> [target]
const T=require('./target-set.cjs');const {L}=T;const {path}=L;
const label=process.argv[2]||'probe',box=process.argv[3]||'inventory';
(async()=>{const b=await T.launch(300);try{const r=await T.forTargets(b,async(p,t)=>{await p.locator(`[data-control-box=${box}] button`).click();await p.waitForTimeout(300);
  const info=await p.evaluate(()=>{const n=document.querySelector('.control-box-panel:popover-open');if(!n)return null;const r=n.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,fs:getComputedStyle(n).fontSize,focus:document.activeElement?.outerHTML.slice(0,80)};});
  await T.shot(p,path.join(__dirname,'evidence/r21',label,`${box}-${T.tag(t)}.png`));return{info};},{list:T.targets().filter(t=>!process.argv[4]||T.tag(t)===process.argv[4])});console.log(JSON.stringify(r));}finally{await b.close();}})();
