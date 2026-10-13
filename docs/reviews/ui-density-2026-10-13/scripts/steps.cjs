// usage: node steps.cjs build "click:Text" "wait:ms" "shot:name" ... ; prints location panel text after each step
const L=require('./lib.cjs');const fs=require('fs');
(async()=>{await L.launch();const [b,...steps]=process.argv.slice(2);const savePath=process.env.SAVE;const {p,ctx}=await L.open(b,{width:1920,height:1080,save:savePath?fs.readFileSync(savePath,'utf8'):null});
const dump=async()=>console.log('  LOC>',(await p.locator('#location_related_div,#action_div').first().innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,700));
for(const s of steps){const [k,...v]=s.split(':');const a=v.join(':');console.log('#',s);
 try{if(k==='click'){await p.locator(`#location_related_div >> text="${a}"`).first().click({timeout:4000}).catch(async()=>{await p.getByText(a,{exact:false}).first().click({timeout:4000});});await p.waitForTimeout(500);}
 else if(k==='any'){await p.getByText(a,{exact:false}).first().click({timeout:4000});await p.waitForTimeout(500);}
 else if(k==='autotalk'){const seen=new Set();for(let i=0;i<40;i++){const opts=await p.evaluate(()=>[...document.querySelectorAll('#location_related_div *')].filter(e=>getComputedStyle(e).cursor==='pointer'&&e.offsetParent&&e.children.length<4&&!(e.parentElement&&getComputedStyle(e.parentElement).cursor==='pointer')).map(e=>e.innerText.trim()).filter(Boolean));const nxt=opts.find(o=>o.startsWith('"')&&!seen.has(o));if(!nxt){const back=opts.find(o=>/go back/i.test(o));if(back&&i<39){await p.locator('#location_related_div').getByText(/go back/i).first().click();await p.waitForTimeout(300);break;}break;}seen.add(nxt);await p.locator('#location_related_div').getByText(nxt,{exact:true}).first().click();await p.waitForTimeout(250);}console.log('  talked',[...seen].length);}
 else if(k==='wait')await p.waitForTimeout(+a);else if(k==='shot')await p.screenshot({path:a});else if(k==='save')fs.writeFileSync(a,await L.getSave(p));else if(k==='js')console.log('  JS>',JSON.stringify(await p.evaluate(a)).slice(0,800));
 if(k!=='js')await dump();}catch(e){console.log('  ERR',e.message.split('\n')[0]);}}
console.log('errs',p.errs);await L.browser.close();})();
