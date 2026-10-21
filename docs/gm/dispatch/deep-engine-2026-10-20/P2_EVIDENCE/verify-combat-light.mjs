// Run only from the isolated candidate. Original six-file bytes live in the supplied baseline directory.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {join,relative,resolve} from 'node:path';
import {build} from 'esbuild';
import {createHash} from 'node:crypto';
import {ROOT,boot} from '../../../../../scripts/headless/runner.mjs';
import {ordinaryLampFixture} from '../../../../../tests/fixtures/deep_engine/ordinary_lamp.mjs';
import {serve} from '../../../../../scripts/perf/lib.mjs';
import {Session} from '../../../../../scripts/playtest/lib.mjs';
const out=resolve(process.argv[2]),baseline=resolve(process.argv[3]);await mkdir(out,{recursive:true});
const paths=['src/main.js','src/items.js','src/models/hero.js','src/lamplight_domain.js','src/tools_domain.js','src/reveal_chain.js'];
const originals=new Map(await Promise.all(paths.map(async p=>[p,await readFile(join(baseline,p),'utf8')])));
const sha=s=>createHash('sha256').update(s).digest('hex');
let game=await boot(null,{seed:11,heroName:null});
const fixture=ordinaryLampFixture(await game.save());game.close();game=null;
fixture['current location']='Cave depths';fixture.availabilities.location['Cave depths']=1;
const bridge=`\nif(new URLSearchParams(location.search).get('test_hooks')==='1')window.p2LightCombat=()=>({bonus:character.nativeLightBonus(),attack:character.getLevelableComponent().stats.multiplier.light_level.attack_points,evasion:character.getLevelableComponent().stats.multiplier.light_level.evasion_points});\n`;
const receipts=[];
for(const version of ['before','after']){
    const outfile=join(out,version+'-bundle.js');
    await build({entryPoints:[join(ROOT,'src/main.js')],bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true,outfile,logLevel:'error',plugins:[{name:'controlled-structural-comparison',setup(b){b.onLoad({filter:/[\/]src[\/].*\.js$/},async args=>{const p=relative(ROOT,args.path);if(p==='src/main.js')return {contents:(version==='before'?originals.get(p):await readFile(args.path,'utf8'))+bridge,loader:'js'};if(version==='before'&&originals.has(p))return {contents:originals.get(p),loader:'js'};});}}]});
    await writeFile(join(ROOT,'dist/bundle.js'),await readFile(outfile));
    const server=await serve(ROOT),session=new Session({url:server.url+'?test_hooks=1',seed:11,wall:Date.UTC(2026,9,21),opTimeout:15000});
    try{
        await session.start();await session.open(fixture);
        const page=session.page,read=()=>page.evaluate(()=>window.p2LightCombat());
        async function use(){await page.locator(`#inventory_content_div > [data-character_item='${JSON.stringify({id:'Oil lamp'})}']`).click();await page.locator('[data-shell-item-action="use"]').click();}
        const dark=await read();await use();const lit=await read();await use();const outAgain=await read();
        assert.equal(lit.bonus-dark.bonus,40);assert.ok(lit.attack>dark.attack);assert.ok(lit.evasion>dark.evasion);assert.deepEqual(outAgain,dark);
        const lamp=await page.evaluate(()=>simulationTestHooks.project('lamplight'));
        assert.equal(lamp.oil,240);assert.equal(lamp.shining,false);
        assert.deepEqual(session.errors.filter(e=>!(e.kind==='console'&&/404 \(Not Found\)/.test(e.text))),[]);
        receipts.push({version,dark,lit,outAgain,bundleSha256:sha(await readFile(outfile))});
        await page.screenshot({path:join(out,version+'-dark-combat.png')});
    }finally{await session.close();await server.close();}
}
assert.deepEqual(receipts[0].dark,receipts[1].dark);assert.deepEqual(receipts[0].lit,receipts[1].lit);assert.deepEqual(receipts[0].outAgain,receipts[1].outAgain);
await writeFile(join(out,'receipt.json'),JSON.stringify({status:'passed',viewport:{width:1920,height:1080},setup:'Synthetic nighttime unlocked native Cave depths, owned lamp/flask. Visible native inventory use commands. Actual Hero combat attack/evasion light multipliers read by test bridge; no natural encounter or director acceptance claim.',originalSixFileHashes:Object.fromEntries([...originals].map(([p,s])=>[p,sha(s)])),receipts},null,2)+'\n');
console.log(JSON.stringify(receipts));
