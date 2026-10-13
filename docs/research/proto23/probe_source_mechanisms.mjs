// Read-only diagnostics of a pinned public source. Never starts the game or
// reads browser storage. Extracted functions run with disposable fixture owners.
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const path = process.argv[2] || '/private/tmp/proto23-ui-source.html';
const source = fs.readFileSync(path, 'utf8');
const sha256 = crypto.createHash('sha256').update(source).digest('hex');
assert.equal(sha256, 'a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5');
function between(start, end) {
    const a = source.indexOf(start), b = source.indexOf(end, a + start.length);
    assert.ok(a >= 0 && b > a, `Missing source boundary: ${start}`);
    return source.slice(a, b);
}
function run(code) {
    const context = vm.createContext({});
    vm.runInContext(code, context, {timeout: 1000});
    return JSON.parse(vm.runInContext('JSON.stringify(result)', context));
}
const skillCode = between('function Skill(){', 'skl.fgt = new Skill()') +
    between('function giveSkExp(skl,exp,res)', 'function giveTitle(');
const skillFixture = `
    var you={skls:[]}, global={stat:{slvs:0},flags:{}}, dom={ct_bt2:{innerHTML:'???????'}};
    var messages=[];
    function msg(t){messages.push(t)}
    function scanbyid(a,id){return a.some(v=>v.id===id)}
    var s=new Skill(); s.id=135; s.name='Water Absorption';
    var gains=[]; s.onGive=x=>gains.push(x);
`;
const skillReveal = run(skillCode + skillFixture + `
    giveSkExp(s,1);
    var before={xp:s.exp,level:s.lvl,visible:you.skls.length,tab:dom.ct_bt2.innerHTML};
    giveSkExp(s,50);
    var result={before,after:{xp:s.exp,level:s.lvl,visible:you.skls.length,tab:dom.ct_bt2.innerHTML}};
`);
assert.equal(skillReveal.before.visible, 0);
assert.equal(skillReveal.after.visible, 1);
const overflow = run(skillCode + skillFixture + `
    giveSkExp(s,60);
    var result={award:60,level:s.lvl,remainingXP:s.exp,onGiveCalls:gains,onGiveTotal:gains.reduce((a,b)=>a+b,0)};
`);
assert.equal(overflow.onGiveTotal, 69);

const craftCode = between('function evaluateSpecialRequirementsForRecipe(', 'function Vendor(){') +
    between('function _fcraft(', 'function renderSkl(');
const craftRequirements = run(craftCode + `
    var global={flags:{},tstcr:[],stat:{crftt:0}}, timers={}, messages=[], outputs=0;
    var material={id:1,amount:2}, inv=[material];
    function msg(t){messages.push(t)}
    function iftrunkopen(){}
    function isort(){}
    function removeItem(){}
    function giveItem(){outputs++}
    var rc={rec:[{item:material,amount:1}],res:[{item:{id:2},amount:1}],
        srect:['Tool A','Tool B'],srec:[()=>true,()=>false],onmake(){}};
    var preview=make(rc,true,1);
    var uiSafe=rc.rec.length===preview.y.length && preview.o[0]!==2;
    _fcraft(rc,uiSafe);
    var result={requirements:preview.o,engineSuccess:preview.success,uiSafe,
        outputs,remainingMaterial:material.amount,craftCounter:global.stat.crftt};
`);
assert.equal(craftRequirements.engineSuccess, false);
assert.equal(craftRequirements.uiSafe, true);
assert.equal(craftRequirements.outputs, 0);
assert.equal(craftRequirements.craftCounter, 1);

const randomDistribution = run(between('function rand(max, min)', 'function randf(') + `
    var sample=0;
    function random(){return sample}
    var counts=[0,0,0];
    for(var i=0;i<10000;i++){sample=(i+.5)/10000;counts[rand(2)]++}
    var result={fixture:'10000 evenly spaced midpoint samples in [0,1)',threeOptionCounts:counts};
`);
assert.deepEqual(randomDistribution.threeOptionCounts, [2500,5000,2500]);
const result = {sha256, scope:'Isolated exact source functions with disposable fixtures; no browser/save/full-game claim',
    skillReveal, overflow, craftRequirements, randomDistribution};
console.log(JSON.stringify(result,null,2));
if(process.argv[3]) fs.writeFileSync(process.argv[3], JSON.stringify(result,null,2)+'\n');
