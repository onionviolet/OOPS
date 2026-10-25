# Ancillary UI audit: homes, household and local management

2026-10-25. Read-only UI audit lane D1. Applies AD34, AD40, UR1–UR17,
UR35, UR41–UR49, UR51–UR64, ECR1–ECR33, PIR1–PIR25, and the homes router
row in `docs/RULES_INDEX.md`. Desktop first; mobile remains deferred. Scope:
home/manor/household/family, stock and local trade/management panels; shell,
combat, cultivation and workshop are excluded. No runtime or save changes.

## Authority and method

`PROJECT.md` routes current home and household behavior to
`docs/gm/dispatch/home-system-2026-10-21/CHECKPOINT.md` and its household-life
report. That release documents actual staff effort, shared family duties, finite
pantry orders and title-qualified succession. The 2026-10-22 combined release
and 2026-10-24 reconciliation set the current integration baseline. These are
implemented-scope owners; the itch and Discord reports below remain design
proposals under AD32, not new accepted mechanics.

Consulted `docs/research/PROTOLIKE_DISCORD_SWEEP_2026-10-24.md`,
`docs/research/itch-io-2026-10-22/BATCH_LIFE_A.md`,
`docs/research/itch-io-2026-10-22/BATCH_LIFE_B.md`,
`docs/UI_CONSISTENCY_AND_MODULARITY_AUDIT_2026-10-11.md`,
`docs/UI_EXPERIENCE_AUDIT_2026-10-12.md`,
`docs/UI_DENSITY_AND_ORIGINAL_COMPARISON_AUDIT_2026-10-13.md`,
`docs/audits/UI_DESIGN_CORE_AUDIT.md`, and
`docs/audits/DISCORD_RESEARCH_AND_UI_STATUS_2026-10-21.md`.

The rebuilt browser pass used the coordinator-granted 5101 slot and a temporary
esbuild bundle routed into the existing local server. Home evidence uses the
actual supported Duke's child start at the family manor. Trade evidence uses
the sanitized public midgame performance fixture (`recipe/undefined` removed,
following `scripts/playtest/proto23-ui-delivery.mjs`) and opens the native
Village trader. No personal save was read. The home driver opened details
groups to inspect populated household content; its resulting panel height is
an expanded-state measurement, not the default opening height. Screenshots
and DOM measurements are in `evidence/before/household/`.

The trade screenshot and DOM receipt were captured before the coordinator's
concurrent `index.html` conversion of legacy `div` controls to real buttons.
That source change happened after the capture. The captured DOM had already
received `role="button"` and `tabindex=0` from `src/workspace_views.js:66–77`;
the receipt confirms those semantics for sorting, categories, Accept, Cancel and
Exit. This audit does not claim a keyboard defect for those controls.
The trade captures also contain a transient item tooltip because the headless
pointer remained over the list after the Play click; this is a capture artifact,
not a ranked tooltip-placement issue.

## Registry coverage

The inventory source is `src/layout_spec.js` (`LAYOUT_SPEC.surfaces` and route
table) plus live `definePanel` registrations. The `Other known panels` control
is populated from `knownWorkspaceModules()` in `src/workspace_navigation.js`.
The snapshot below records the unique options from the rebuilt manor session.

| Panel / route family | Registration source | Audit coverage |
|---|---|---|
| Homes, lodging, estate storage, construction, home household scene | `src/home_panel.js` | Source reviewed; populated manor captured at 1920×1080 and 1440×900 |
| Household routines and obligations | `src/household_fortunes_panel.js` | Source reviewed; manor start made the panel known; panel itself not opened |
| Family line and succession record | `src/family_tree_panel.js`, `src/life_record_ui.js`, `src/lives_carry_domain.js` | Source reviewed; family is gated until succession; no screenshot |
| Companion stock custody | `src/stock_view_ui.js` | Source reviewed; not captured because no native companion was met in this lane |
| Local standing, credit and trade memory | `src/economy_standing_ui.js`, `src/economy_standing_domain.js` | Source reviewed; standing terms visible in native trade screenshots at both sizes |
| Trade visit and trader stock | `src/display.js` (`update_displayed_trader`) | Native trade captured at both sizes; pre-concurrent button-tag conversion |
| Residence worker rooms/rotas and staffed arrangements | `src/home_panel.js`, `src/home_workers.js`, `src/home_staff.js` | Source reviewed; populated manor content captured with all detail groups open |
| Other ancillary known panels | `src/layout_spec.js`, `src/workspace_navigation.js` | Unique live option registry captured; only the focused home/trade surfaces received visual review |

## Ranked defects

| Rank | Defect and evidence | Source and player impact |
|---|---|---|
| F1 · High | At 1440×900, trade's price/standing explanation consumes the center-view footer space: `#trade_price_div` measures 345px tall, while `#accept_trade_button` and `#cancel_trade_button` start at y=893. The screenshot places them under the fixed pane navigation, leaving the ordinary settle/cancel path off-screen. At 1920×1080 those controls sit much higher. Evidence: `trade-1440x900.png`, `trade-1920x1080.png`, `receipt.json`. | `index.html:339–360` places total, cost terms and action controls in one footer; `src/economy_standing_ui.js:14–26` appends standing explanations into the total-price box; center mode opens at `src/display.js:1349–1355`. UR46/UR57 apply, along with the existing trade-total visibility gate in the 2026-10-13 desktop audit. A player at the 1440 target can select a basket but the receipt buttons are below the fixed footer. |
| F2 · Medium, lower confidence | In the populated manor, household agreements follow residence text, furnishings, private storage, and home-specific operations in one long panel. With all details opened for inspection, the tutor action sits at document y=3805 in 1440×900 and y=3010 in 1920×1080. This is an expanded-state measurement, not the default height, but reaching family/staff work still means navigating a shared sequence of residence sections. Evidence: `manor-1440x900.png`, `manor-1920x1080.png`, `receipt.json`. | `src/home_panel.js:41–78` builds property/furnishing/storage content before the `Hearth and companion` section and its household actions. UR51/UR57 apply. Common family or staff tasks may cost extra scrolling through unrelated property operations; validate frequency before changing grouping. |
| F3 · Low | Disabled furnishing actions place the refusal reason immediately beside the button in the same inline row. The 1920 capture shows “Pack Plain bed” running directly into “Home: communal and landlord furnishings remain with their owner,” which makes the button and its reason read like one label. | `src/home_panel.js:24–29` creates a button and `<small>` in one wrapper without an explicit separator. UR46/UR60 apply. The reason remains present and the action is visibly disabled, so this is a small reading cost. |

### Registry coverage snapshot

Unique options from `#workspace_navigation select[aria-label="Other known panels"]`
after the manor start. “Source only” means the live route was inventoried but
that panel was not opened. Gated routes were not treated as defects or rendered
empty.

| Area | Live panel IDs / titles | Coverage |
|---|---|---|
| Household/property | `homes` Homes; `household-fortunes` Household; `family` Family; `companions` Companions; `stock_view` Stock; `lives_carry` Lives & inheritance; `memories` Remembered years | Homes visible at both sizes. Household source reviewed and routed. `family` waits for succession; `companions` and `stock_view` wait for a met companion. Other entries source/registry only. |
| Local management/economy | `social-trust` Regard; `economy_standing` Standing and ledger; `ledger` Work Ledger; `fields` Spilled stock and smoke; `tools` Tools; `projects` Projects; `pledges` Vows and trials; `rune-bench` Rune bench | Trade visit and price terms captured; other panels source/registry only. Work Ledger was unavailable in this fresh manor state. |
| People, place and world records | `story-insight` Stories & history; `known-things` Known things; `naming` Naming and achievements; `today` Today; `region-view` Where I am; `around-place` Around this place; `notebook` Notes, practice & people; `known-people`; `known-routes`; `world-events`; `village-neighbors`; `village-travelers` | Registry inventory only; this lane did not visually inspect these panels. |
| Gear/other worlds and settings | `loadouts`; `hp-polyjuice`; `lotm`; `beginning`; `optional-worlds`; `customization` Appearance; `customization-effects`; `customization-rules`; `customization-preview`; `customization-sites`; `continuation` Continuing connection | Registry inventory only; workshop/cultivation excluded. `optional-worlds` was unavailable at capture time. |
| Core shell excluded from this lane | `vitals`; `status-window`; `condition`; `belongings`; `combat-controls`; `shell-inventory-tools`; `shell-character`; `shell-detail`; `focus`; `location`; `time`; `village-scene`; `current-work`; `local-actions`; `messages`; `equipment-comparison`; `preparation`; `records`; `skills`; `opponents`; `stance`; `combat` | Present in the live navigation inventory; excluded by scope. |
| Other excluded by task scope | `herbal-experiments` Village experiments; `gear-workshop` Gear workshop | Present but excluded; both unavailable in the capture state. |

The stock panel was not given a synthetic party member. Its actual reveal gate is
`src/stock_view_ui.js:14,57–58`; this lane did not reach the native meet-a-
companion action. No stock visual finding is claimed.

## Verification state

| Check | Result |
|---|---|
| Authority, rule router and UI rules read | Complete |
| Required household/life reference reports and prior UI audits consulted | Complete |
| Home, household, stock and standing panel source pass | Complete |
| Ancillary registry enumeration from live rebuilt app | Complete; visual review was limited to the focused home and trade surfaces |
| Fresh-origin 1920×1080 and 1440×900 rebuilt screenshots | Complete for populated manor and native trade; stock not captured |
| Runtime edits, tests, commit | None; outside this read-only audit |

The run recorded seven generic console 404 messages, not investigated; no page
exceptions were captured. Trade was visually reviewed, not settled by pressing
Accept. The coordinator changed trade control tags in `index.html` after these
captures, so that source edit needs its paired rebuilt after screenshots in the
coordinator's final harness.


## Coordinator verification, 2026-10-25

The coordinator fixed the native footer/price-detail layout and verified keyboard Cancel plus the actual shared Village return. The internal Exit control is intentionally hidden while the shared controller owns Back. Native manor overview and household focus/grouping are captured at both sizes in `evidence/{before,after}/journeys/`. Qualified household/social reference panels are also attempted on that actual supported start; unavailable panels stay explicitly gated. Use canonical receipts rather than initial fallback-font screenshots.
