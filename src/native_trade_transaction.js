import {stageAcquisition, recordAcquisitions} from "./acquisition.js";
import {applyGameplayEffect} from "./gameplay_transactions.js";
import {validateExpansionState} from "./expansion_engine.js";

// Quotes include the price inputs and both owners' quantities. Revalidation is
// synchronous with staging and saving; no callback can interleave the transfer.
export const tradeQuoteFingerprint = quote => JSON.stringify(quote);

export function stageNativeTrade({state, gameplay, owners, money, market, itemLog, quote, currentQuote, xp, getItem}) {
    if(tradeQuoteFingerprint(quote) !== tradeQuoteFingerprint(currentQuote)) throw new Error("Trade quote changed. Refresh your selections before accepting.");
    if(!quote.buy.length && !quote.sell.length) throw new Error("Select items to trade first.");
    if(![quote.buyValue, quote.sellValue, money].every(n => Number.isFinite(n) && n >= 0 && n <= Number.MAX_SAFE_INTEGER)) throw new Error("Invalid trade price.");
    const balance = money + quote.sellValue - quote.buyValue;
    if(!Number.isFinite(balance) || balance < 0 || balance > Number.MAX_SAFE_INTEGER) throw new Error("This trade cannot be afforded.");
    const transfers = [
        ...quote.buy.map(e => ({from: "vendor", to: "player", key: e.item_key, count: e.count})),
        ...quote.sell.map(e => ({from: "player", to: "vendor", key: e.item_key, count: e.count}))];
    const ownership = stageAcquisition(owners, {transfers});
    const nextMarket = structuredClone(market);
    for(const [entries, selling] of [[quote.buy, false], [quote.sell, true]]) for(const entry of entries) {
        const item = getItem(entry.item_key);
        if(!item.saturates_market) continue;
        const {group_key, group_tier} = item.getMarketSaturationGroup();
        const region = nextMarket[quote.region];
        if(!region) throw new Error("Unknown market region.");
        if(!selling && !region[group_key]?.[group_tier]) continue;
        region[group_key] ||= [];
        while(region[group_key].length <= group_tier) region[group_key].push({sold: 0, recovered: 0});
        const tier = region[group_key][group_tier];
        tier.sold = selling ? tier.sold + entry.count : Math.max(0, tier.sold - entry.count);
        tier.recovered = Math.min(tier.recovered, tier.sold);
        if(!Number.isSafeInteger(tier.sold) || tier.sold < 0) throw new Error("Market quantity overflow.");
    }
    const nextGameplay = structuredClone(gameplay);
    nextGameplay.player.inventory = ownership.player;
    if(xp) applyGameplayEffect(nextGameplay, {type: "xp", skill: "Haggling", amount: xp}, "player");
    const nextState = structuredClone(state);
    nextState.sequence++;
    nextState.history.push({id: `event:${nextState.sequence}`, sequence: nextState.sequence, at: nextState.clock,
        actionId: "native.trade", revision: 1, outcome: "transferred", draw: 0,
        label: `Trade with ${quote.vendorId}: bought ${quote.buyValue}, sold ${quote.sellValue} coins`});
    nextState.history = nextState.history.slice(-100);
    validateExpansionState(nextState);
    return {state: nextState, external: {money: balance}, gameplay: nextGameplay, ownership: {vendor: ownership.vendor},
        market: nextMarket, itemLog: recordAcquisitions(itemLog, quote.buy.map(e => ({key: e.item_key, count: e.count})), getItem)};
}
