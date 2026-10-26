const fs=require('fs'),path=require('path'),http=require('http');
const output=process.env.BUILD_OUT;if(!output)throw Error('BUILD_OUT required');
const server=http.createServer((req,res)=>{try{let file=path.resolve(output,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(output+'/')&&file!==output)throw Error('path');if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));}catch{res.writeHead(404).end();}});
server.listen(0,'127.0.0.1',async()=>{process.env.URL=`http://127.0.0.1:${server.address().port}`;process.env.L8_BUNDLE=path.join(output,'dist/bundle.js');try{
await require('./native-helper.cjs')('m8-existing-household',async h=>{
 const {p,assert,boot,enroll,act,save,played,roundtrip,gates,path,out}=h;await p.setViewportSize({width:1920,height:1080});await boot();await enroll();
 await act('data-mistglass-action','enter');await act('data-mistglass-action','learn');await played(8);await act('data-mistglass-action','trade');
 const dose=p.locator('[data-trader_item]').filter({hasText:'Cloudseed dose'}).first();await dose.click();await p.locator('#accept_trade_button').press('Enter');await p.evaluate(()=>window.exitTrade());await played(1);
 let s=await save(),before=s.expansion.simulation.energies.player['p23.mistglass.condensate'].reserve;await act('data-mistglass-action','method:seal');s=await save();assert.equal(s.expansion.simulation.energies.player['p23.mistglass.condensate'].reserve,before-1000);assert.equal(s.inventories.person.main_character['{"id":"Mistglass sealed condensate"}'].count,1);
 await act('data-mistglass-action','exit');
 const homes=async()=>{await p.getByRole('combobox',{name:'Other known panels'}).selectOption('homes');await p.locator('#home_panel details').evaluateAll(ns=>ns.forEach(n=>n.open=true));};
 const ha=async id=>{await homes();const b=p.locator(`[data-home-action=${JSON.stringify(id)}]`);assert.equal(await b.isEnabled(),true,await b.locator('..').innerText());await b.press('Enter');};
 await homes();await p.getByRole('combobox',{name:'Furnishing to buy'}).selectOption('Home condensate cradle');await ha('buy');await ha('institution_join');assert.equal((await save())['current location'],'Arlmere family manor');await homes();await ha('install:manor:{"id":"Home condensate cradle"}');
 await ha('cultivation_release');await roundtrip('cradle-reserved',s=>({jobs:s.expansion.simulation.jobs,stock:s.inventories.person.main_character}));await played(5);
 for(let i=0;i<2;i++){await homes();await ha('cultivation_study');await played(30);await played(20);}
 s=await save();assert.equal(s.expansion.actors['home.manor.keeper'].resources['home.cultivationPractice'],2);const xp=s.levels.person.main_character.skill_xp.Meditation;
 await homes();await ha('cultivation_lesson');await played(30);s=await save();assert.ok(s.levels.person.main_character.skill_xp.Meditation>xp);assert.equal(s.expansion.actors.player.resources['home.cultivationContributions'],1);
 await roundtrip('household-circulation-earned',s=>({resources:s.expansion.actors['home.manor.keeper'].resources,player:s.expansion.actors.player.resources,condition:s.expansion.simulation.conditions,skill:s.levels.person.main_character.skill_xp.Meditation}));await homes();await p.locator('[data-home-action="cultivation_lesson"]').evaluate(n=>n.scrollIntoView());await p.screenshot({path:path.join(out,'household-1920.png')});gates.push('Actual paid Cloudseed purchase, real reserve/carrier sealing, purchased installed cradle, existing worker admission, finite keeper field, own energy/pay, two earned studies and actual native Meditation lesson');
},{deterministic:true});
}catch(e){console.error(e);process.exitCode=1;}finally{server.close();}});
