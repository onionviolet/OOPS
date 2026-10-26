const gate=require('../cultivation-spacing-2026-10-22/browser-helper.cjs');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const source=path.join(__dirname,'evidence/o1-focus-workshop-Nc1Np6/focus-tempered-gear.save.txt');
const identity=()=>Object.fromEntries(['dist/bundle.js','styles/material_icons.css','styles/ui_tokens.css','index.html','src/gear_work.js','src/gear_workshop_domain.js','src/gear_workshop_panel.js',source].map(f=>[f,hash(fs.readFileSync(f))]));
gate('o5-desktop',async h=>{
 const {p,boot,play,assert,gates,out}=h;const start=identity();
 fs.writeFileSync(path.join(out,'inputs.json'),JSON.stringify({head:require('child_process').execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),files:start,rebuild:'No rebuild; existing O1–O4 served dist retained. CSS loaded directly.',save:source},null,2));
 await boot();
 await Promise.all([p.waitForNavigation({waitUntil:'domcontentloaded'}),p.locator('#saved_file_input').setInputFiles(source)]);await play();
 await p.evaluate(()=>{const n=document.querySelector('[aria-label="Other known panels"]');n.value='gear-workshop';n.dispatchEvent(new Event('change',{bubbles:true}));});
 const panel=p.locator('#gear_workshop');await panel.waitFor({state:'visible'});
 const gear=await panel.getByRole('combobox',{name:'Carried gear',exact:true}).locator('option').evaluateAll(opts=>opts.map(o=>({value:o.value,text:o.textContent})));
 const dagger=gear.find(o=>o.value.includes('"gearwork"')&&o.value.includes('short blade'));assert.ok(dagger,JSON.stringify(gear));
 await panel.getByRole('combobox',{name:'Carried gear',exact:true}).selectOption(dagger.value);
 await panel.getByRole('combobox',{name:'Gear process',exact:true}).selectOption('quench');
 await panel.getByRole('combobox',{name:'Process material',exact:true}).selectOption('{"id":"Lamp oil"}');
 await panel.getByRole('combobox',{name:'Process control',exact:true}).selectOption('focus');
 assert.equal(await panel.locator('[data-gear-commit]').isEnabled(),false);assert.match(await panel.innerText(),/Recover measured focus/);assert.match(await panel.innerText(),/Heat-treated edge/);
 fs.writeFileSync(path.join(out,'workshop-context.txt'),await panel.innerText());
 const cases=[];
 for(const [width,height]of [[1920,1080],[1800,1040],[1536,864]])for(const size of [14,21]){
  await p.setViewportSize({width,height});
  await panel.evaluate((n,size)=>{const r=document.documentElement;for(const key of ['--ui-type-body','--ui-type-small','--ui-type-title','--custom-size'])r.style.setProperty(key,size+'px');r.style.setProperty('--ui-font',`"OOPS Gothic Bitmap ${size}",var(--ui-font-gothic)`);n.style.fontSize=size+'px';n.style.setProperty('--custom-size',size+'px');n.style.setProperty('--custom-small-size',size+'px');n.style.setProperty('--custom-font',`"OOPS Gothic Bitmap ${size}",var(--ui-font-gothic)`);n.style.fontFamily=`"OOPS Gothic Bitmap ${size}",var(--ui-font-gothic)`;},size);
  await p.evaluate(()=>document.fonts.ready);
  const typography=await panel.evaluate(n=>({font:getComputedStyle(n).fontSize,family:getComputedStyle(n).fontFamily,controls:[...n.querySelectorAll('button,select')].filter(b=>b.getClientRects().length).map(b=>({tag:b.tagName,name:b.getAttribute('aria-label')||b.textContent,font:getComputedStyle(b).fontSize,family:getComputedStyle(b).fontFamily,left:b.getBoundingClientRect().left,right:b.getBoundingClientRect().right}))}));
  assert.equal(typography.font,size+'px');for(const c of typography.controls){assert.equal(c.font,size+'px',c.name);assert.ok(c.left>=-1&&c.right<=width+1,JSON.stringify(c));}
  const reachable=[];
  for(const name of ['Carried gear','Gear process','Process material','Process control']){
   const control=panel.getByRole('combobox',{name,exact:true});await control.scrollIntoViewIfNeeded();const rect=await control.boundingBox();assert.ok(rect&&rect.y>=0&&rect.y+rect.height<=height,`${name} reachable ${width}/${size}`);await control.focus();assert.equal(await control.evaluate(n=>n===document.activeElement),true);reachable.push({name,rect});
  }
  const commit=panel.locator('[data-gear-commit]');await commit.scrollIntoViewIfNeeded();const r=await commit.boundingBox();assert.ok(r&&r.y>=0&&r.y+r.height<=height);assert.equal(await commit.isEnabled(),false);
  const back=p.locator('#center_mode_back');assert.equal(await back.isVisible(),true);const br=await back.boundingBox();assert.ok(br&&br.y>=0&&br.y+br.height<=height);
  await p.screenshot({path:path.join(out,`workshop-${width}-${size}.png`)});
  const layout=await p.evaluate(()=>({pageHeight:document.documentElement.scrollHeight,viewport:innerHeight,log:(()=>{const n=document.querySelector('#message_log_div'),r=n.getBoundingClientRect();return {visible:!!n.getClientRects().length,left:r.left,right:r.right,top:r.top,bottom:r.bottom,scrollHeight:n.scrollHeight,clientHeight:n.clientHeight};})()}));
  cases.push({width,height,size,...typography,reachable,commit:r,back:br,layout});
 }
 // Verify the local ligature font independently of contextual icon-size overrides.
 const icon=await p.evaluate(async()=>{await document.fonts.load('24px "Material Icons"','star');const n=document.createElement('i');n.className='material-icons';n.textContent='star';document.body.append(n);const s=getComputedStyle(n),r=n.getBoundingClientRect();const result={loaded:document.fonts.check('24px "Material Icons"','star'),family:s.fontFamily,font:s.fontSize,weight:s.fontWeight,width:r.width,height:r.height,faces:[...document.fonts].filter(f=>f.family.includes('Material Icons')).map(f=>({family:f.family,status:f.status,weight:f.weight}))};n.remove();return result;});
 assert.equal(icon.loaded,true);assert.equal(icon.font,'24px');assert.equal(icon.weight,'400');assert.ok(icon.width>20&&icon.width<28,JSON.stringify(icon));
 const fontResponse=await p.request.get(new URL('resources/fonts/material-icons/material-icons.woff2',process.env.URL).href);assert.equal(fontResponse.status(),200);icon.localFontSha256=hash(await fontResponse.body());assert.equal(icon.localFontSha256,hash(fs.readFileSync('resources/fonts/material-icons/material-icons.woff2')));
 fs.writeFileSync(path.join(out,'geometry.json'),JSON.stringify({cases,icon},null,2));assert.deepEqual(identity(),start,'Inputs stable through desktop proof');
 gates.push('O1 literal earned save imported; carried worked dagger, quench, Measured Focus, depleted rejection and Heat-treated edge reader; six desktop cases assert actual panel/control fonts, horizontal bounds, focused/reachable selects and pinned Back; local Material Icons ligature loaded at 24px/400 with one-glyph width');
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
