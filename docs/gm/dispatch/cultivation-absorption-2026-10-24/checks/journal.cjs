const gate=require('../../cultivation-spacing-2026-10-22/browser-helper.cjs');
gate('journal',async h=>{
 const {p,assert,boot,save,roundtrip,gates,fs,path,out}=h;await p.setViewportSize({width:1920,height:1080});await boot();
 const open=()=>p.getByRole('combobox',{name:'Other known panels'}).selectOption('personal-journal');await open();
 const prose='今天的路\n<My words> & "left unchanged"\n  careful spaces  ';await p.getByRole('textbox',{name:'Your journal',exact:true}).fill(prose);await p.locator('[data-journal-save]').click();assert.equal((await save()).personal_journal.text,prose);
 await roundtrip('personal-prose',s=>s.personal_journal);await open();assert.equal(await p.getByRole('textbox',{name:'Your journal',exact:true}).inputValue(),prose);
 const [download]=await Promise.all([p.waitForEvent('download'),p.locator('[data-character-card]').click()]);const file=path.join(out,'character.svg');await download.saveAs(file);const svg=fs.readFileSync(file,'utf8');assert.match(svg,/<svg/);assert.match(svg,/Health 60\/60/);assert.ok(!svg.includes(prose));
 assert.match(await p.locator('#personal_journal_panel').innerText(),/Discovered atlas/);await p.screenshot({path:path.join(out,'journal-1920.png')});gates.push('Verbatim player prose Save/reload/Export/literal Import; native discovered atlas and public-stats-only SVG export');
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
