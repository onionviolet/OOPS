# Home system implementation, 2026-10-21

Current publication, checked 2026-10-22: released home, building/staffed-start
extension and household-life source was handed off and included in published
`7df5a7df7`, followed by documentation receipt `e59df9a28`. The
[combined release](../inventory-overhaul-2026-10-21/REPORT.md) owns latest recorded
normal Electron adoption `v0.6-72af84cf8e66`. Earlier isolated-preview/no-push
boundaries describe their original runs. Their exact evidence stays with each
report; human household feel and natural pacing remain open.

Current later slice: [household life report](household-life/REPORT.md) records
staff rest/agency, tutoring, family duty, finite pantry delivery/return and owned
residence succession,2511 passing tests and14 rebuilt browser groups. Its exact
bundle is now installed and adopted in the normal Electron window; the report
records the separate adoption/optional-asset preservation receipt.

Current delivery: the later building/staff extension is technically verified. See [extension report](extension/REPORT.md), [final inputs](extension/FINAL_INPUTS.json) and [new preview](http://127.0.0.1:56037/). The earlier delivery and preview identities below are historical evidence for their original wave.

User authorization: “Implement the home system accordingly, including the missing domicile features and support for different starts, with owned, rented, shared and nonhuman homes as appropriate., homeowner stuff and more?” Implements the connected H5.5 horizon in the [home palette](../procgen-2026-10-13/p20/HOME.md). New prices, capacities and original places are reversible balance/content proposals.

Rules: AD1/AD5–8/AD11/AD15–18/AD23/AD32–38/AD41; AR1–16; UR1–17/UR41–49/UR59–64; MR custody/time/actual mechanism; SR15/SR19/SR22; ECR15/ECR16. Runtime seam: domain registry + existing expansion transaction, native item/inventory and local household model. No second clock or save writer. [Architecture](../../../ARCHITECTURE_RULES.md), [UI rules](../../../UI_RULES.md).

Primary checkout implementation owner: this chat. Reserved: new `src/home_*` residence modules, new residence tests/browser script; narrow integration hunks in `src/main.js`, `src/items.js`, `src/absorb_b/furniture.js`, `src/absorb_p23/household/model.js`; hunk-only direction/docs updates. Existing unrelated cleanup and Corc UI evidence preserved. INPUTS.json records starting identities. No commits/push selected. Verification builds use a frozen candidate because the shared checkout has concurrent work and generated artifacts.

Target: desktop 1920×1080 at 14/21px. Visible outcome: discoverable Homes panel with residence rights, exact storage/furnishing controls, paid improvements, local household scene, optional separate beginning page and multiple distinct usable home starts. Existing PLAY flow stays direct. Mobile, free-form geometry and broad NPC simulation remain deferred, not gates for this delivery.

Selected scope: owned/rented/shared and nonhuman residences; deed/access/occupancy distinction; explicit paid rent renewal without surprise eviction/destruction; personal local storage; install/select/remove meaningful furniture and recover native items; homeowner restoration/room improvements and naming; multiple retained homes with local fire/cat state; real start admission/body/stock and persistence. Existing Shack/cottage remain compatible.

Before implementation, selected checks: existing household/firewood/furniture/start tests, new meaningful residence invariants, then build/full tests/arch/rules (rule-behavior if rules change). Failure scenarios: stale rights/stock, borrowed object installation, rental expiry, moving with stored goods/fire, unsupported body, reissued start grants, storage failure. Browser: actual acquisition and furnishing, all start profiles, local household/time and rented/shared permissions, Save/reload/Export/literal Import, old-save no invented grant; distinguish synthetic prerequisites from natural routes. Human visual/balance acceptance remains separate.

Status: implemented and technically verified in the frozen rebuilt candidate, including the later wild-building extension. See [delivery report](REPORT.md), [exact input manifest](FINAL_INPUTS.json) and saved receipts/screenshots. Human visual/play and balance acceptance remains open. Source is uncommitted in primary; no push. The primary generated bundle is preserved, so use the rebuilt isolated preview below.

Later scope: Weibao specifically requested birds building nests without unnecessary purchases, then broader building consideration. [H5.6](../procgen-2026-10-13/p20/HOME.md#h56-building-a-home-need-not-mean-buying-one-2026-10-21) records natural gathering, nest weaving, burrow digging, lean-to construction, grass lining and careful dismantling/salvage; land, weather, partial work, repair and broader habitat proposals remain separately marked. Eight optional actual origins now include three starts without a granted home.

Final commands on `/tmp/oops-home-system-20261021`: `npm run build` PASS, `npm test` 2,480/2,480 PASS, `npm run check:arch` PASS (main 10,275 vs baseline 10,310), `npm run check:rules` PASS after refreshing a concurrently added documentation link, `npm run check:rule-behavior` 36/36 PASS. Primary `npm run check:rules` PASS with one expected untracked-checkpoint warning. Browser scripts `home-system.mjs`, `home-building.mjs`, `home-edges.mjs`, `home-consumers.mjs` all PASS against the same final bundle; 29 recorded check groups. Commands take the frozen candidate directory and disposable output path. No user save was used.

Final candidate bundle SHA256: `2673edd9a58ef1f13633011f41374bcd5af68fc89c869ed42d2f65d9489d39d2`. Preview: `http://127.0.0.1:54928/`, PID 65876, exec session 66270, cwd `/tmp/oops-home-system-20261021`. Keep it for review; stop that PID when no longer needed. All home-owned files match the candidate; the shared main file differs by the concurrent field-workshop callback recorded in LIVE_SHARED_MAIN_DIFF.patch. FINAL_INPUTS.json records the remaining unrelated live field/style drift. This proof does not claim the latest combined concurrent checkout passed its full suite.

Earlier build recovery: GENERATED_RECOVERY.json records the accidental primary build and byte-checked restoration of the initially clean generated artifacts. Subsequent builds used the isolated candidate. Historical pre-construction identities remain in PRE_CONSTRUCTION_INPUTS.json; earlier input captures are history, not final evidence.


## Building, weather and staffed-home extension, 2026-10-21

Later user authorization: “Implement the broader building stuff where it fits too, including weather, repairs, interrupted construction, shared labor and portable homes. More to consider? Staff working at homes, so something like starting in a manor as a prince or a son of. a duke or something”. This selects H5.6i–l where connected, plus bounded staffed-estate origins despite the general broad-NPC deferral. Same desktop target1920×1080, 14/21px; geometry, general political succession and city simulation remain separate. Prior REPORT.md/receipts remain evidence for the preceding slice, not this extension.

Reservation: this chat writes home modules/tests/scripts and narrow weather/read-port/registry hunks. Generated primary bundle/map/index are already dirty from concurrent work at extension start and must remain untouched. Use a new frozen candidate for verification. Existing worker/simulation jobs own resumable contributions and staffed orders; native weather/calendar owns rain. Home state owns structural condition and project material custody, not another scheduler or NPC inventory copy.

Selected failure scenarios: incomplete construction grants no housing; interrupted contribution cancels its native reservation while preserving finished phases; paid helpers cannot double-book or mint wages; rain uses played-calendar intervals and dry linings; repair consumes actual held materials; portable packing cannot teleport goods or leave duplicate housing; staff budgets/pantry/allowance retain one native owner; family access grants neither title nor communal fixture sale; Save/reload/Export/literal Import pending work/staff and packed/deployed shelter. Focused regressions, then required full gates and rebuilt browser journeys. Status: extension implemented and technically verified in `/tmp/oops-home-extension-20261021`. Build PASS; full tests 2,490/2,490 PASS; architecture and rules PASS; rule behavior 36/36 PASS; 40 rebuilt browser check groups at final bundle `15bc21fc7fbdb3224db1fc14a59bc45b202167602483964434409b47d7946a70`. Current-primary focused home tests30/30 PASS after the preserved concurrent equivalent rest-predicate extraction. Save/reload/Export/literal Import covers pending construction, packed/pitched/moved shelter, both pending/completed staff profiles and repaired rain exposure. [Report](extension/REPORT.md) records fixtures and scope. Human pacing/feel/visual acceptance remains open. Source uncommitted; no push. New preview `http://127.0.0.1:56037/`, PID23314, exec session67848; retain for review. No remaining required technical work in the selected slice.
