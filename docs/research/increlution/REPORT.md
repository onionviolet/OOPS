# Increlution: section A source audit

**Seen in data or code:** Increlution makes repeated survival attempts progressively faster. **Inferred assessment:** it is useful for cross-life skill growth, automation and a readable death summary. It offers little evidence for random births or heirs: the inspected reset returns to the same authored opening and clears buildings and possessions (F2/F7/F13/F21).

## What the source shows

| Code | Label | Result |
|---|---|---|
| F2/F3/F21 | Seen in data or code; seen in text | Same-time replay, not randomized birth or family succession. Amy's story supplies explicit loop fiction and exceptional recognition. Ordinary friends forget. |
| F4/F5 | Seen in data or code | Life is active survival time. Health decay grows roughly 25% per minute; shelter, food and faster skills postpone death. No chronological life stages were found in the inspected state. |
| F6/F7/F13/F14 | Seen in data or code | Instinct XP/levels, accumulated base health, automation/completion history and artifact powers persist. Generation XP, inventory, finished buildings/explorations, action progress and queue reset. Artifacts funnel power into instincts/DNA; generic instincts are a game mechanic rather than a detailed inheritance simulation. |
| F9/F10/F12/F15 | Seen in data or code | First life teaches gathering, construction and exploration manually. Repeated completions unlock individual automation on rebirth. Later lives retain faster learning/action multipliers and configured automation, while still meeting route and resource gates. Empty work pauses the life. |
| F8/F11/F16 | Seen in data or code; seen in text | Compact skills/action tables, hover details and death deltas explain progress. Offline catch-up uses the same health-consuming actions and can end a life; it stops at paused states. Three detailed past-generation snapshots are retained. |

These claims refer to installed build 11640258, whose embedded script label is 6 July 2023. See [FINDINGS](FINDINGS.json) for exact code/text locators, formulas and bounded absence claims.

## Contradictions and friction

**F20, inferred:** the reset's repetition can cost attention, and compounding survival rewards can make farming time attractive. Neither is a player-review result. **F19, seen in text:** the developer explicitly describes mid-run priority tweaking and adds overrides to reduce its repetition. Advanced automation options also carry learning warnings. Player complaints were not independently surveyed.

The north star proposes random next lives, real heirs, persistent world traces and lives lasting many sessions. The inspected game instead repeats authored short survival runs and destroys temporary world assets. Its offline actions consume life, whereas the north-star background discusses protecting life while closed. The accepted rulebook lets each world choose its own rules: these differences are evidence, not grounds to rewrite either game or impose a universal policy.

The proposed YAIR use is selective: show exactly what survived and its carrier; separate current-life practice from carry; earn useful automation; pause on a new commitment; report how the life was spent. [Eight ranked packets](IMPLEMENTATION_PACKETS.md) map these options to inspected YAIR owners. Random births and family inheritance need original implementation, not an Increlution attribution. [Twenty-six small touches](SMALL_TOUCHES.md) cover the details.

## Coverage and completion

The engine is Electron, not expected Unity. Eight small inputs are retained with matching SHA-256; static recovery produced 2,624 decoded strings and 18,037 formatted lines. Indexed 12 skills, 69 jobs, 53 constructions, 307 explorations and 11 chapter ranges. Indexing all records is not a full manual review of every story branch. [Coverage](COVERAGE.json) separates traced mechanisms, indexed records and unread/opaque areas.

Source audit is complete. No game was launched, no saves/settings were read, and no gameplay/browser verification was performed. No YAIR source edit, build, commit or uninstall. Installed files remain available for Weibao to remove after reviewing [CHECKPOINT](CHECKPOINT.md). Proposals remain unaccepted and unimplemented. Shared wave synthesis belongs to the coordinator/last finisher and is outside this session's exclusive game-folder scope.
