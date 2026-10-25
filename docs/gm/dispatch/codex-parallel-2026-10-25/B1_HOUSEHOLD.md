# B1 playtest: household and manor

Input: isolated worktree at master `3a1180dc274868d1e4350058a74725ac6b534394` with the task's fixed `scripts/mcp/` wrapper. Rules applied: AD6–8, AD11–18, AD23, AD32, AD36–38, AD41; AR7–8; UR1–17; PIR, SLR, and ECR where household contacts, learning, time, and funds intersect. This is player-visible headless play evidence; it does not establish desktop layout or human acceptance. No game source edits or commits.

## Coverage

| Life | Start and location | Actions and time | Persistence | Result |
|---|---|---|---|---|
| B1, manor household | `game_new`, seed 251032, Village Day 1 08:00; Homes → Open Homes → Choose a home beginning → Duke’s child; arrived at Arlmere family manor | Opened the private chest and household panel; claimed the ten-coin allowance; requested and completed Iven’s meal preparation; accepted one meal; requested and completed Toma’s estate gathering; agreed Sera’s leave, resumed her duties, and completed a reading lesson; accepted and completed Rowan’s ledger appointment. Advanced 1,440 played minutes after the activities, reaching Day 2 09:15. All action receipts had 0 page errors. | `game_save`: hash `07b38481f581f570`, 122,614 bytes; export 163,516 bytes; `game_load` of that exact export returned Arlmere family manor at Day 2 09:15, with 0 page errors. The initial `game_new({seed:1,path})` failed; see BHB1. After the wrapper correction, the same export resumed through `game_new(path)`. | Staff and household requests changed state through played time; the export restored the home and clock. On a resumed copy, five-minute travel to Village and purchase of Hearthside cottage for 80 coins left 32 from 112 displayed coins and listed both `Arlmere family manor · shared` and `Hearthside cottage · owned`. The private chest showed 1/16 after a storage deposit. |
| B1, continued from the original manor export | New stdio server resumed the Day 2 09:15 Arlmere export through `game_new(path)` | Advanced 720 minutes to Day 2 21:15, then 240 minutes to Day 3 01:15. Each response reported `started: true` and 0 page errors. | `game_save`: hash `27bf9541b72f81c9`, 134,894 bytes; export 179,888 bytes; `game_load` of that export returned Arlmere family manor at Day 3 01:15, with 0 page errors. | The same life reached a third in-game day and stayed at its manor. On reload, the personal chest surface said it was empty while Homes later showed the residence's private storage at 1/16. See BHB2 for the unresolved store identity. |

The in-world accounting was legible during play. The household showed 60 coins and an unclaimed 10-coin allowance; claiming it left 50. Iven’s ten-minute, two-coin meal order reduced kitchen stock from 4 to 2 meat chunks and 3 to 2 logs, then left two prepared meals. The result showed 2 coins earned by Iven. Toma’s gathering used his energy and produced materials into his stock; the caretaker panel reported recovery during idle played time at home. Sera’s lesson was a paid twenty-minute appointment and Rowan’s ledger work required a separate agreement before the fifteen-minute appointment could be kept. The family panel distinguished the player's room and private chest from household title, staff employment, pantry, and communal furnishings.

## Findings

### BHB1 — `game_new(path)` could not resume an exported save (fixed on this worktree)

- **Area:** Game MCP persistence handoff.
- **Reproduction:** On the B1 life above, call `game_export`, then `game_load({path: exported.path})`. The import succeeds and returns Arlmere family manor at Day 2 09:15. Then call `game_new({seed: 1, path: exported.path})`.
- **Expected:** `game_new` resumes the supplied exported life at its saved home and time.
- **Observed:** It fails with `Game reported a loading error: Something went wrong on loading from localStorage! SyntaxError: Unexpected token 'Y', "YAIR-UTF8-"... is not valid JSON` from `load_from_localstorage`. The normal `game_load` route is a working workaround.
- **Severity:** bug on the initial wrapper input. The coordinator's follow-up fix passed the same exported-life resume path.
- **Evidence:** `/tmp/b1-household-finaljourney.out`, Day 2 09:15, saved hash and export receipt above; exact failure at the final `game_new(path)` call. The requested `game_report_limit` was called once and recorded ledger entry 7; its response notes the working `game_load` workaround.
- **Follow-up:** The coordinator changed `game_new(path)` to boot a fresh game and import the encoded export through the existing import route. `node /tmp/b1-resume-verify.mjs` passed on the updated worktree: the same export resumed at Arlmere family manor, Day 2 09:15, with `started: true` and 0 page errors. This verifies the observed path only; the full MCP regression remains the coordinator's gate.

### BHB2 — Private-storage count and personal-chest copy disagree (confusing; store identity unresolved)

- **Area:** Manor private storage and personal chest.
- **Reproduction:** In the first B1 life, the Homes panel started at `Private storage · 0/16`. The player-visible result of `Store one selected item` said, `One owned item moved into your private local storage.` After the Day 2 09:15 export resumed through `game_new(path)` and advanced to Day 3 01:15, open `Open your personal chest` at Arlmere family manor. Then travel the native five-minute route to Village and open Homes.
- **Expected:** If these labels refer to the same store, the stored unit appears in the chest; if they refer to separate stores, the copy should distinguish them clearly.
- **Observed:** The chest view says `Nothing is stored here yet. Move items in from your inventory.` The Village Homes panel still says `Private storage · 1/16`; the residence text describes the player's `private chest`. No item was moved during this follow-up. Both screens had 0 page errors.
- **Severity:** confusing. The visible labels suggest a shared store, but the observed count and contents differ. I did not inspect source or raw save data, so I cannot establish whether the two surfaces intentionally use distinct storage authorities.
- **Evidence:** `/tmp/b1-household.jsonl` records the original deposit receipt and Home count; `/tmp/b1-day3-followup.jsonl` records the two time steps, save, export, and import; `/tmp/b1-day3-chest-check.jsonl` records the empty chest copy; `/tmp/b1-day3-property-check.jsonl` records the 1/16 Homes count after reload.

## What felt good

- The optional manor start was discoverable from the Village Homes service and immediately explained the private-room/shared-estate relationship. The start went directly to the manor at the same clock time.
- Household funds, player allowance, staff wages, kitchen stores, prepared food, caretaker stock and personal chest were presented as separate things with visible reasons and costs.
- Staff and family actions had grounded completion gates: paid supplies and reserved effort for staff work, shared presence and a real syllabus for teaching, and an explicit agreement before the family appointment. There was no invented deadline or housing penalty during the two-day check.
- The exact exported save imported back into the manor with its day and time intact through `game_load`, and later resumed through corrected `game_new(path)`.
- The supplier showed a concrete contrast between the shared manor and owned cottage. Buying the cottage changed the displayed funds from 112 to 32 and left both residences on the Homes panel; private storage stayed at the manor with a visible 1/16 unit count.

## Coverage gaps

The resumed cottage copy traveled from the manor to the Village, but no return trip was exercised. I did not test the Royal child start, rental, home construction/repair, furniture installation, alternate body starts, or staff leave during pending work. The manor life now reached Day 3 01:15, though ordinary household pacing beyond that remains unassessed. Storage deposit and the 1/16 count were observed; chest retrieval and whether the two storage surfaces share an authority remain unresolved.

## Checks

- `node /tmp/b1-household-finaljourney.mjs` — household journey and two-day advance reached Day 2 09:15; save/export/import passed; `game_new(path)` failed as BHB1.
- `node /tmp/b1-resume-verify.mjs` — PASS after the coordinator's wrapper fix; same export resumed at Arlmere family manor, Day 2 09:15, with 0 page errors.
- `node /tmp/b1-home-purchase.mjs` — PASS; resumed the same synthetic save, traveled five minutes to Village, bought Hearthside cottage, and observed two distinct residence rights plus the manor's private storage count.
- `node /tmp/b1-day3-followup.mjs` — PASS; resumed the original manor export, stepped 720+240 minutes through Day 3 01:15, then Save/Export/Import returned the same day and manor with 0 page errors.
- `node /tmp/b1-day3-chest-check.mjs` — PASS for visible chest access at Day 3 01:15; the chest view reported empty.
- `node /tmp/b1-day3-property-check.mjs` — PASS for visible Homes panel at Village 5 minutes later; manor remained shared and private storage showed 1/16. This leaves BHB2's store-identity question open.
- `node /tmp/b1-limit-report.mjs` — `game_report_limit` recorded successfully; ledger reports 7 entries.
- Runtime and source tests — not run; this lane was an authorized player-visible playtest.
