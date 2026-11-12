const gate = require('../cultivation-spacing-2026-10-22/browser-helper.cjs');

gate('village-repair-rollback',async ({p,fs,assert,boot,load,save,play,roundtrip,gates})=>{
    await p.setViewportSize({width:1920,height:1080});
    await boot();
    const encoded=fs.readFileSync(process.env.REPAIR_FIXTURE,'utf8').trim();
    const baseline=JSON.parse(Buffer.from(encoded.split(':')[1],'base64'));
    const stock=s=>s.inventories.person.main_character;
    const original=Object.keys(stock(baseline)).find(key=>JSON.parse(key).componentLineage?.head);
    assert.ok(original);
    const damaged=JSON.stringify({...JSON.parse(original),e2_instance:'e2.1'});
    const repairMaterial=JSON.stringify({id:'Iron axe head',quality:100});
    stock(baseline)[damaged]=stock(baseline)[original];
    delete stock(baseline)[original];
    stock(baseline)[repairMaterial]={count:1};
    baseline.equipment_durability={schema:1,enabled:true,nextId:2,condition:{[damaged]:50}};
    await load(baseline,'damaged-assembled-axe');
    const panel=p.locator('#gear_workshop');
    const commit=panel.locator('[data-gear-commit]');
    const openRepair=async()=>{
        await p.evaluate(()=>{
            const menu=document.querySelector('[aria-label="Other known panels"]');
            menu.value='gear-workshop';
            menu.dispatchEvent(new Event('change',{bubbles:true}));
        });
        const choose=(name,value)=>panel.getByRole('combobox',{name,exact:true}).selectOption(value);
        await choose('Carried gear',damaged);
        await choose('Gear process','repair');
        await choose('Process material',repairMaterial);
        assert.equal(await commit.isEnabled(),true,await panel.innerText());
        assert.match(await panel.locator('#gear-workshop-quote').innerText(),/Restore condition 50 → 70\/100/);
    };
    await openRepair();
    await save();
    const rollback=await p.evaluate(()=>{
        const view=()=>{
            const s=simulationTestHooks.snapshot();
            return {stock:s.inventories.person.main_character,durability:s.equipment_durability,sequence:s.expansion.sequence};
        };
        const before=view(), durable=localStorage.getItem('save data');
        const set=Storage.prototype.setItem;
        let denied=0;
        Storage.prototype.setItem=function(key,value){
            if(key==='save data'){
                denied++;
                throw new DOMException('Test quota','QuotaExceededError');
            }
            return set.call(this,key,value);
        };
        try{
            document.querySelector('#gear_workshop [data-gear-commit]').click();
            return {before,after:view(),durableSame:localStorage.getItem('save data')===durable,denied};
        }finally{Storage.prototype.setItem=set;}
    });
    assert.ok(rollback.denied>0);
    assert.equal(rollback.durableSame,true);
    assert.deepEqual(rollback.after,rollback.before);
    await p.reload({waitUntil:'domcontentloaded'});
    await play();
    await openRepair();
    await commit.press('Enter');
    const repaired=await save();
    const result=Object.keys(stock(repaired)).find(key=>JSON.parse(key).e2_instance==='e2.1');
    assert.ok(result&&result!==damaged);
    assert.equal(stock(repaired)[repairMaterial],undefined);
    assert.equal(stock(repaired)[damaged],undefined);
    assert.equal(repaired.equipment_durability.condition[result],70);
    assert.deepEqual(JSON.parse(result).componentLineage,JSON.parse(damaged).componentLineage);
    await roundtrip('paid-condition-repair',s=>({stock:stock(s),durability:s.equipment_durability}));
    assert.equal((await save()).equipment_durability.condition[result],70);
    gates.push('Native repair spends one exact compatible component, preserves the fitted source and instance, and raises condition 50 to 70.',
        'Injected durable quota rejection rolls back the live stock and condition as well as preserving the prior save.');
},{deterministic:true}).catch(error=>{console.error(error);process.exitCode=1;});
