// Preserve exact requested subjects after real stock changes. Never substitute.
export function recoverTradeRequests(requests, stock) {
    return requests.flatMap(row => {
        const available=stock[row.item_key]?.count || 0;
        const count=Math.min(row.count,available);
        return Number.isSafeInteger(count) && count>0 ? [{item_key:row.item_key,count}] : [];
    });
}
