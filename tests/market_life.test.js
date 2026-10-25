import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {normalizeMarketLife, planMarketTrade, quoteMarketPurchase, planMarketDelivery, marketLifeView} from '../src/absorb_p23/market_life/market_life.js';
import {nativeMarketPreview} from '../src/absorb_p23/host_joins/tranche_four.js';

// market_life: original fixture scope retained.
{
const context = {worldId:'base.frontier',location:'Village',traderId:'village trader',alive:true,
    clock:100,calendarMinute:100,marketKnown:true,effectsEnabled:true};
const buy = (index,buyUnits=5) => ({index,buyUnits,buySubtotal:buyUnits*20,breadSubtotal:buyUnits*20,useCoupon:false});
test('old saves remain empty; unsupported and inconsistent records reject before mutation', () => {
    const s=normalizeMarketLife(); assert.equal(s.supplyDay,null);
    for(const raw of [null,[],{}, {...s,schema:2},{...s,couponsUsed:1},{...s,purchasedUnits:5},
        {...s,deliveryIndex:1},{...s,supplyDay:0},{...s,tradeIndex:Infinity},{...s,extra:true}]) {
        const before=structuredClone(raw);assert.throws(()=>normalizeMarketLife(raw));assert.deepEqual(raw,before);
    }
});
test('two favor occurrences provide useful coupons without random draws or lifetime limits', () => {
    let s=normalizeMarketLife();
    const one=planMarketTrade(s,context,buy(1));s=one.state;
    assert.equal(one.earnedCoupons,1);assert.equal(one.quote.total,100);
    const two=planMarketTrade(s,context,{...buy(2),useCoupon:true});s=two.state;
    assert.equal(two.quote.total,95);assert.equal(two.moneyDelta,5);assert.equal(two.earnedCoupons,1);
    const third=planMarketTrade(s,context,{...buy(3,1),useCoupon:true});
    assert.equal(third.quote.total,15);assert.equal(third.state.couponsUsed,2);
    assert.equal(third.state.couponsIssued,2);assert.equal(marketLifeView(third.state,context).favor.startsWith('1/5'),true);
});
test('duplicate and older transactions are no-ops; fresh coupon cannot fund its own earning purchase', () => {
    const initial=normalizeMarketLife();const event={...buy(9),useCoupon:true};
    const first=planMarketTrade(initial,context,event);
    assert.equal(first.quote.couponDiscount,0);assert.deepEqual(initial,normalizeMarketLife());
    for(const index of [9,8,1]) {
        const replay=planMarketTrade(first.state,context,{...event,index});
        assert.equal(replay.ok,false);assert.equal(replay.moneyDelta,0);assert.equal(replay.earnedCoupons,0);
        assert.deepEqual(replay.state,first.state);
    }
});
test('native delivery changes notice and exact bread price; no passive drift or wall-clock replay', () => {
    const original=normalizeMarketLife();const before=marketLifeView(original,context);
    const delivered=planMarketDelivery(original,context,{index:1,kind:'parcel_delivery',completed:true,clock:100}).state;
    const view=marketLifeView(delivered,context);assert.notEqual(view.notice,before.notice);
    assert.equal(view.occurrence,1);assert.equal(view.supplyIndex,.95);
    const q=quoteMarketPurchase(delivered,context,{...buy(1),breadSubtotal:61});
    assert.equal(q.supplyDiscount,3);assert.equal(q.total,97);assert.match(q.explanation,/pay 97 coins/);
    const next={...context,calendarMinute:1440,clock:1440};
    assert.equal(quoteMarketPurchase(delivered,next,buy(1)).total,100);
    assert.equal(marketLifeView(delivered,next).supplyIndex,1);
    assert.deepEqual(planMarketDelivery(delivered,next,{index:1,kind:'parcel_delivery',completed:true,clock:1440}).state,delivered);
    const again=planMarketDelivery(delivered,next,{index:2,kind:'parcel_delivery',completed:true,clock:1440});
    assert.equal(marketLifeView(again.state,next).supplyIndex,.95);
});
test('JSON restore retains occurrences, coupons and index exactly; projection never changes state', () => {
    let s=planMarketTrade(undefined,context,buy(1,10)).state;
    s=planMarketDelivery(s,context,{index:2,kind:'parcel_delivery',completed:true,clock:100}).state;
    const restored=normalizeMarketLife(JSON.parse(JSON.stringify(s)));assert.deepEqual(restored,s);
    const serialized=JSON.stringify(restored);
    for(let i=0;i<4;i++) {
        marketLifeView(restored,context);quoteMarketPurchase(restored,context,{...buy(2),useCoupon:true});
        assert.equal(JSON.stringify(restored),serialized);
    }
    assert.equal(planMarketTrade(restored,context,buy(1)).ok,false);
});
test('known-only notice and Effects-off suppress cues without freezing economy', () => {
    const s=planMarketTrade(undefined,context,buy(1)).state;
    assert.deepEqual(marketLifeView(s,{...context,marketKnown:false}),{visible:false});
    assert.equal(marketLifeView(s,{...context,effectsEnabled:false}).cue,null);
    assert.equal(quoteMarketPurchase(s,{...context,effectsEnabled:false},{...buy(2),useCoupon:true}).couponDiscount,5);
    for(const c of [{...context,worldId:'other'},{...context,location:'Shack'},{...context,alive:false}]) {
        assert.deepEqual(marketLifeView(s,c),{visible:false});assert.equal(planMarketTrade(s,c,buy(2)).ok,false);
    }
    assert.equal(planMarketTrade(s,{...context,traderId:'suspicious trader'},buy(2)).ok,false);
});
test('small baskets keep a one-coin floor; selling gives no coupon or purchase subsidy', () => {
    const s=planMarketTrade(undefined,context,buy(1)).state;
    const q=quoteMarketPurchase(s,context,{buyUnits:1,buySubtotal:3,breadSubtotal:0,useCoupon:true});
    assert.equal(q.total,1);assert.equal(q.couponDiscount,2);
    const sale=planMarketTrade(s,context,{index:2,buyUnits:0,buySubtotal:0,breadSubtotal:0,useCoupon:true});
    assert.equal(sale.moneyDelta,0);assert.equal(sale.state.couponsUsed,0);assert.equal(sale.earnedCoupons,0);
});
test('invalid baskets, incomplete deliveries and overflow cannot mutate caller state', () => {
    const s=normalizeMarketLife();
    for(const event of [{...buy(1),buyUnits:-1},{...buy(1),breadSubtotal:101},{...buy(1),index:0},
        {...buy(1),useCoupon:1},{...buy(1),buyUnits:0},{...buy(1),buySubtotal:NaN}]) assert.throws(()=>planMarketTrade(s,context,event));
    for(const receipt of [{index:1,kind:'parcel_delivery',completed:false,clock:100},
        {index:1,kind:'parcel_delivery',completed:true,clock:99},{index:1,kind:'preview',completed:true,clock:100}])
        assert.throws(()=>planMarketDelivery(s,context,receipt));
    assert.deepEqual(s,normalizeMarketLife());
    const large={...s,purchasedUnits:Number.MAX_SAFE_INTEGER,couponsIssued:Math.floor(Number.MAX_SAFE_INTEGER/5)};
    assert.throws(()=>planMarketTrade(large,context,buy(1)));
});

// Execute the actual unchanged native TraderComponent and market_saturation
// bodies with small dependency doubles. This is source behavior evidence only,
// not browser/native integration. Direct Node import hits native circular init.
const doubles = {
    'seeded_streams.js':`export const STREAMS={market:'market'};let draws=[0];export const setMarketDraws=x=>{draws=[...x]};export const gameKeyedRandom=()=>draws.length>1?draws.shift():draws[0];`,
    'accessories.js':`export const accessoryTradeMargin=n=>n;`,
    'character.js':`export const character={reputation:{Village:0},getTotalLevelBonus:()=>0};`,
    'inventory_templates.js':`export const row={item_name:'bread',chance:.5,count:[2,4],canBeStarted:()=>true}; export default {Test:[{canBeStarted:()=>true,items:[row]}]};`,
    'game_time.js':`export const current_game_time={day_count:0};`,
    'items.js':`export const item_templates={bread:{id:'bread',getInventoryKey(){return 'bread'}}}; export const getItem=x=>({...x,getInventoryKey:()=>x.id}); export const getItemFromKey=key=>getItem(item_templates[key]); export const round_item_price=Math.round;`,
    'inventory_component.js':`export const inventories={};export default class {items={};getItems(){return this.items}emptyInventory(){this.items={}}}`,
    'availability_component.js':`export default class {constructor(x){Object.assign(this,x)}}`,
    'component_references.js':`export const availabilities={},availability_havers=[];`,
    'factorio_retort_content.js':`export const factorioRetortItemSpecifications=[];`,
    'proto23_world_content.js':`export const proto23ItemSpecifications=[];`
};
async function nativeProbe() {
    const bundled=await build({stdin:{contents:`export {TraderComponent} from './src/components/trader_component.js';
        export * from './src/market_saturation.js';export {current_game_time} from './src/game_time.js';
        export {character} from './src/data/character.js';export {setMarketDraws} from './src/seeded_streams.js';export {row} from './src/data/inventory_templates.js';`,resolveDir:process.cwd()},
        bundle:true,write:false,platform:'node',format:'esm',plugins:[{name:'native-dependency-doubles',setup(b){
            b.onResolve({filter:/\.js$/},args=>{const name=args.path.split('/').at(-1);if(doubles[name]) return {path:name,namespace:'double'};});
            b.onLoad({filter:/.*/,namespace:'double'},args=>({contents:doubles[args.path],loader:'js'}));
        }}]});
    return import('data:text/javascript;base64,'+Buffer.from(bundled.outputFiles[0].text).toString('base64'));
}
test('native stock chance/count, restock boundary and earned markup remain unchanged',async()=>{
    const n=await nativeProbe();const trader=new n.TraderComponent({inventory_template:'Test',profit_margin:4,refresh_time:4});
        n.setMarketDraws([.6]);trader.fillInventoryFromTemplate({});assert.deepEqual(trader.getTradeInventory(),{});
        n.setMarketDraws([.49,.999]);trader.fillInventoryFromTemplate({});
        assert.equal(trader.getTradeInventory().bread.count,4);
        n.setMarketDraws([0]);n.current_game_time.day_count=0;assert.equal(trader.refresh({}),true);
        assert.equal(trader.last_refresh,1);assert.equal(trader.getTradeInventory().bread.count,2);
        n.current_game_time.day_count=4;assert.equal(trader.refresh({}),false);
        n.current_game_time.day_count=5;assert.equal(trader.refresh({}),true);
        assert.equal(trader.getProfitMargin('Village'),4);
        n.character.reputation.Village=1000;n.character.getTotalLevelBonus=()=>.2;
        assert.ok(Math.abs(trader.getProfitMargin('Village')-2.2)<1e-12);

});
test('native sales cause saturation; purchases and recovery reduce it without inflation',async()=>{
    const n=await nativeProbe();n.market_regions.Village={};n.fill_market_regions();
    assert.equal(n.get_item_value_with_market_saturation({value:100,group_key:'bread',group_tier:0,region:'Village'}),100);
    n.add_to_sold({group_key:'bread',group_tier:0,region:'Village',count:56});
    assert.equal(n.get_total_tier_saturation({region:'Village',group_key:'bread',group_tier:0}),56);
    assert.equal(n.get_item_value_with_market_saturation({value:100,group_key:'bread',group_tier:0,region:'Village'}),50);
    n.recover_item_prices(1,0);assert.equal(n.get_total_tier_saturation({region:'Village',group_key:'bread',group_tier:0}),55);
    n.remove_from_sold({group_key:'bread',group_tier:0,region:'Village',count:100});
    assert.equal(n.get_total_tier_saturation({region:'Village',group_key:'bread',group_tier:0}),0);
    assert.equal(n.get_loot_price_modifier({value:100,how_many_sold:499,is_group:false}),.1);
    assert.equal(n.get_loot_price_modifier({value:100,how_many_sold:-10,is_group:false}),1);
});

}

// p23-host-joins-step2: original fixture scope retained.
{
test('market quote consumes native rounded subtotals and leaves coupon off by default',()=>{
 const c={worldId:'base.frontier',location:'Village',alive:true,clock:4,calendarMinute:1444,traderId:'village trader'},b={buySubtotal:101,breadSubtotal:21,buyUnits:2,useCoupon:false};
 const q=nativeMarketPreview(undefined,c,b);assert.equal(q.quote.total,101);assert.equal(q.quote.couponDiscount,0);assert.deepEqual(q.basket,b);
});

}

