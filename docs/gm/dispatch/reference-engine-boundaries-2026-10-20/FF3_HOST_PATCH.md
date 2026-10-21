# FF3 joins, applied after recorded owner release

Final status: H1 and H2 are applied; see FF3_STATUS.md for source release and verification. Historical integration request follows. FF3 model/test writer did not edit the palette/P2 reservations while active. These are precise integration needs, not a competing host implementation. Model APIs are already implemented and tested in `src/absorb_p23/household/model.js`. All household commands continue through the existing root inventory/condition/household/sequence transaction.

## H1: household host projection (palette owner)

Import `householdFirewood` alongside the existing model imports. Inside the existing hearth-owned branch of `householdPresentation`:

```js
const supply = householdFirewood(s, c);
records.push({id:'household.firewood',at:c.clock,basis:null,
    text:`Firewood pile · ${supply.logs.length}/${supply.capacity} stocked logs · auto-feed ${supply.enabled ? 'on' : 'off'}. Stocked logs feed an already burning hearth while you are home. Extinguish keeps the reserve; lighting remains manual.`});
for(const row of supply.available) {
    const quality = JSON.parse(row.key).quality;
    add(row.action, `Stock 1 Rough wood log${quality == null ? '' : ` · ${quality}% quality`}`,
        supply.logs.length < supply.capacity, 'The five-log local pile needs space.');
}
if(h) {
    add(supply.enabled ? 'supply_off' : 'supply_on', supply.enabled ? 'Disable firewood auto-feed' : 'Enable firewood auto-feed');
    add('withdraw_firewood', 'Take 1 stocked log back', supply.logs.length > 0, 'The pile is empty.');
}
```

`row.action` is a domain-generated string such as `stock_firewood:{"id":"Rough wood log"}`; do not rebuild it from a display name. It passes through the current `p00HouseholdFrame → actP00Household → stageHouseholdJoin` string seam without a payload or scheduler change. Revalidate actual owned usable exact-key stock at execute, as the model already does. Existing host wording “never refuels itself” must describe manual baseline plus the selected finite pile policy instead. FF1 scene can add supply count/capacity/enabled using `householdFirewood`; no graphics, styling or animation is owned by FF3.

## H2: household tick location (composition owner after palette/P2 release)

In `stageP00Time`, change only the household context call:

```diff
-const c={...p00HouseholdContext(plan.state.clock,plan.state),sequence:plan.state.sequence-1};
+const c={...p00HouseholdContext(plan.state.clock,plan.state),...(plan.nativeLocation&&plan.nativeLocation!==current_location?.id?{atHome:false}:{}),sequence:plan.state.sequence-1};
```

Reason: a plan travelling in either direction must burn the already paid hearth fuel but must not auto-feed the home reserve or dry the travelling player's clothes during those travel minutes. The existing subsequent `leave` publication still clears exposure at its own boundary. No new clock or main-owned state. Recheck native leaving/returning at fuel expiry and remaining reserve persistence.

## Ownership

release=false for FF3 model/tests until native verification. Host and main remain untouched by FF3 while reserved. After a recorded release, FF3 can apply these exact hunks if the owner has not already integrated them; re-read live source first. Current implementation tests pass 19/19, including existing household/scene cases and the new finite-reserve invariants. Full gates and native UI/persistence are still pending.
