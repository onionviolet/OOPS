# P14 host join contract

Status: proposal, module implemented; native integration and persistence OPEN.
Target: 1366×768 desktop. Mobile deferred. Native C2 remains the authority for
runner contacts, calendar windows and the original finite stashes.

## API

From `repeat_search.js`:

- `normalizeRepeatSearch(raw?) -> state`. Optional absent `absorb_repeat_search`
  defaults to schema 1 with no offered stock. A supplied record is strictly
  validated, and unsupported schemas throw. Run it during complete native save
  preflight before changing any live state. Never replace a rejected save with
  defaults. Export the normalized optional field and restore it verbatim.
- `replenishRepeatSearch(raw, context, event) -> plan`. Context:
  `{worldId, location, alive, clock}`. Event:
  `{kind:'village-runner-departed', ordinal, clock}`. Ordinal is the safe integer
  `nextC2.helped + nextC2.declined` after a SUCCESSFUL native help/decline action.
  P00 must reject unsafe sums before mutation. Use the native played clock;
  event.clock must equal context.clock. A new departure stocks one offcut, not
  one native item; unclaimed stock is replaced, never accumulated. A repeated
  or earlier ordinal and a backward event clock do nothing. No lifetime cap.
- `repeatSearchAction(raw, context) -> plan`, with context additionally containing
  `idle`. Toggle the `runner_offcut` action only, at the current live context.
  Readiness must use C2's native alive/idle/custody/action restrictions. Stops,
  moving, combat, sleep, trade, work or foreign worlds cancel search progress.
- `advanceRepeatSearch(raw, context) -> plan`. Called only for a committed
  native played-clock advance, not load/render/offline catch-up. Invoke for
  location/readiness transitions too, so leaving and returning cannot accrue
  time across an interruption. One offer yields exactly one `Linen cloth`
  after five idle played minutes. No historical batch of offers is paid.
- `repeatSearchView(raw, context) -> {visible,title,summary,rows}`. Pure known
  information only. Never replenishes or consumes. Show separately from the
  depleted physical C2 stash, so the original found flag stays truthful.

Every plan has `{state,native:{money:0,items:[],skillXp:{}},messages:[]}`;
accepted actions add `ok:true`, refused actions `ok:false`. Use the existing
native item template and acquisition/discovery/custody owners for the one
`{item_id:'Linen cloth',count:1}` reward, never direct inventory assignment.
No new RNG, timer, generic discovery or resource store is required.

## P00 exact wiring request

1. Add optional `absorb_repeat_search` to the native full save envelope and
   native-patch preflight/publication, following C2's normalize-before-mutate
   contract. Keep P14 state plus native inventory/RNG/clock/sequence in the same
   saved envelope. A failed save publishes neither half. Restore suppresses
   event and reward replay. No user save or old C2 search state migration.
2. In native C2 help/decline settlement only, after the action's native
   preflight succeeds, stage P14 replenishment with the NEW C2 departure count.
   Persist it with the same C2 plan before publishing either state or messages.
   Do not reconstruct departures from old counters on load. Prior C2 counters
   do not grant initial stock; the next genuinely played departure does.
3. Stage `advanceRepeatSearch` in the existing common-clock transaction. Ensure
   busy/movement transitions stop P14, including when time has not advanced: call `advanceRepeatSearch`
   at each native location/readiness transition. It cancels even at the same
   clock. Do not let same-clock leave-and-return preserve progress.
   Dispatch accepted `runner_offcut` action through the same native transaction.
4. `createRepeatSearchPanel({container,read,act})` from `panel.js` is a standalone
   presentation adapter, deliberately outside contested C2 files. `read` returns
   `{state,context}` and `act('runner_offcut')` returns the committed action plan.
   Join it to Local actions/workspace alongside C2; refresh after native ticks,
   actions and restores. The panel reattaches after location-menu replacement.
   It emits no VFX; Effects off therefore suppresses all presentation effects.

## Gate after join

Read the finished life-loops remaining-find report first and reconcile messages
and callbacks against it. Preserve finite Village/Shack finds and all adopted
UI work from d49cb911/379007d7. First genuine runner departure, collect the
single offcut, observe zero remaining and stopped search; wait for the next
native contact/day and resolve that departure; collect again. Keep/decline
both work, without requiring the five-coin help. Save/reload/export/literal-file
import at pending, depleted, and replenished states must retain exact stock,
progress, departure receipt and native inventory. Same departure/tick after
restore pays nothing. Test Effects off and layout at 1366×768 with freshly
rebuilt and hashed served bundle bytes. Unexercised paths remain OPEN; final
fiction/balance acceptance belongs to Weibao.
