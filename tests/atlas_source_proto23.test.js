// Proto23 atlas extractor against a tiny synthetic snippet shaped like the real definitions.
import test from 'node:test';
import assert from 'node:assert/strict';
import {extractProto23} from '../prototypes/world-atlas/source-proto23.mjs';

const SNIPPET = `
creature.rat = new Creature();
creature.rat.name = 'Giant Rat'; creature.rat.id = 1;
item.herb.name='Cure Grass'; item.herb.val = 7
item.cp.name='Copper Coin';
vendor.shp1 = new Vendor();
vendor.shp1.name = 'Test Store';
quest.q1 = new Quest(); quest.q1.id=2
quest.q1.name='Rat Hunt';
area.cellar = new Area(); area.cellar.id = 106;
area.cellar.name = 'Damp cellar';
area.cellar.pop = [{crt:creature.rat,lvlmin:1,lvlmax:4}];
area.cellar.size = 33; z_bake(area.cellar);
area.cellar.onEnd = function(){ roll(item.herb,.5,1,3); }
function z_bake(area){}
chss.town = new Chs(); chss.town.id = 1;
chss.town.sl=()=>{ d_loc('Hill Town'); 
  chs('Guard: "Halt"',true);
  chs('"=> Enter the shop"',false).addEventListener('click',()=>{ smove(chss.shop); });
  chs('"=> Cellar"',false).addEventListener('click',()=>{ smove(chss.cell); });
  // chs('"=> Hidden"',false).addEventListener('click',()=>{ smove(chss.nope); });
  chs('"Rest a while"',false).addEventListener('click',()=>{ msg('zzz'); });
}
chss.shop = new Chs(); chss.shop.id = 2; chss.shop.shop=true;
chss.shop.sl=()=>{ d_loc('Hill Town, Corner Shop');
  chs('<span style="color:lime">Clerk</span>: Hi there',true);
  let v = vendor.shp1;
  chs('"<= Return back"',false).addEventListener('click',()=>{ smove(chss.town); });
}
chss.cell = new Chs(); chss.cell.id = 3; addtosector(sector.x,chss.cell);
chss.cell.sl=()=>{ d_loc('Hill Town, Cellar'); giveQst(quest.q1);
  chs('"<= Up"',false).addEventListener('click',()=>{ smove(chss.town); smove(chss.cell,false); });
}
chss.cell.onEnter=function(){ area_init(area.cellar); }
chss.cell.scout=[
  {c:.01,f:()=>{giveItem(item.cp)},exp:3},
]
`;

test('parses places, containment, routes and contents from synthetic definitions', () => {
    const r = extractProto23(SNIPPET);
    const by = Object.fromEntries(r.places.map(p => [p.id, p]));
    assert.equal(r.game, 'proto23');
    assert.equal(r.source.matchesRecorded, false);
    assert.deepEqual(Object.keys(by).sort(), ['cell', 'shop', 'town']);
    // "Hill Town" is a place without a comma, so spots parent to it directly, no synthetic region
    assert.equal(by.shop.parent, 'town');
    assert.equal(by.shop.label, 'Corner Shop');
    assert.equal(by.cell.parent, 'town');
    assert.deepEqual(by.town.routes, [{to: 'shop', label: 'Enter the shop'}, {to: 'cell', label: 'Cellar'}]);
    assert.deepEqual(by.shop.routes, [{to: 'town', label: 'Return back'}]);
    assert.deepEqual(by.cell.routes, [{to: 'town', label: 'Up'}]); // self-refresh dropped
    assert.deepEqual(by.town.people, ['Guard']);
    assert.deepEqual(by.shop.people, ['Clerk']);
    assert.deepEqual(by.shop.shops, ['Test Store']);
    assert.equal(by.shop.kind, 'shop');
    assert.deepEqual(by.town.activities, ['Rest a while']);
    assert.deepEqual(by.cell.enemies, ['Giant Rat']);
    assert.ok(by.cell.activities.includes('Fight: Damp cellar (lv 1-4)'));
    assert.ok(by.cell.activities.includes('Quest: Rat Hunt'));
    assert.ok(by.cell.gather.includes('Cure Grass') && by.cell.gather.includes('Copper Coin'));
    assert.ok(by.cell.sourceLine > by.town.sourceLine);
});

test('synthesizes a region when no scene owns the prefix', () => {
    const r = extractProto23(`chss.a = new Chs(); chss.a.id = 1;
chss.a.sl=()=>{ d_loc('Deep Woods, Glade'); chs('"=> Back"',false).addEventListener('click',()=>{ smove(chss.b); }); }
chss.b = new Chs(); chss.b.id = 2;
chss.b.sl=()=>{ d_loc('Deep Woods, Path'); }
`);
    const by = Object.fromEntries(r.places.map(p => [p.id, p]));
    assert.equal(by['region:deep-woods'].kind, 'region');
    assert.equal(by.a.parent, 'region:deep-woods');
    assert.deepEqual(by.a.routes, [{to: 'b', label: 'Back'}]);
});
