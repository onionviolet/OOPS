# Kingdom of Loathing implementation packets (PROPOSALS, not accepted, not implemented)

Each packet needs a rebuild, a fresh-origin desktop browser check, and Save/reload/Import proof before anyone calls it done. Codes refer to [REPORT.md](REPORT.md).

## P1: Life rule profiles over a fixed spine (F1, F3)

- **Smallest result:** at life start, pick an optional profile ("no drink", "small appetite", "borrowed class") that changes 1 or 2 rules over the same world quest chain. Each profile keeps its own record across lives.
- **Seams:** `src/chronicle.js` (createChronicle, createHeirChronicle), `src/heir_inheritance.js`, `src/life_record.js`.
- **Player path:** new life, a profile picker shows the rule and its reward, play the same opening chain, then the life record notes the profile clear.
- **Acceptance:** the profile persists through save, reload and import; the rule is enforced with a stated reason; the clear is recorded once per life with no double reward. Needs a save migration (old saves get profile "none").

## P2: Three named capacity organs per world (F2, F4)

- **Smallest result:** one world gets three capacities, for example meals, drink and tonics. Food gives time or energy today, drink a bigger yield with a risk past the limit, tonics buffs only. Quality tiers set yield per unit. A world or profile can rename, resize or disable the organs.
- **Seams:** `src/energy_resources.js` (capacity, strainLimit), `src/status_care_host.js`, `src/everyday_life.js`, item data in `src/items.js`.
- **Acceptance:** each cap shows used and max with its source; going over shows a named consequence; caps reset on the world's own rhythm; persistence round-trips.

## P3: Charges as the module unit (F5, F6)

- **Smallest result:** a content pack declares 1 to 3 renewable charges ("3 summons per rest") with a pool id so packs can share a cap. The UI lists today's remaining charges across packs.
- **Seams:** `src/content_packs.js` (validatePack, advancePackSettlement), `src/structured_pack_definitions.js`, `src/world_rhythm.js`.
- **Acceptance:** charges renew at the world's boundary; a shared pool decrements across packs; reload neither refunds nor double-renews; limits stay per-world adjectives.

## P4: Two-tier permanence with a run currency (F7)

- **Smallest result:** ending a life awards a small currency scaled by the life's achievements. It buys "keep this technique next life" at a light tier or a deep tier at double cost (also kept under a hard profile). Refund allowed.
- **Seams:** `src/heir_inheritance.js`, `src/chronicle.js`, `src/life_experience.js`, `src/techniques.js`.
- **Acceptance:** the preview matches what carries; refund restores the currency exactly; import does not mint currency.

## P5: Requirement-flag crafting (F11)

- **Smallest result:** a recipe adds flags (skill, tool, calendar day, profile ban) on top of its family; the detail view lists unmet flags. Add one deterministic fold cycle for a single item.
- **Seams:** `src/crafting_recipes.js`, `src/crafting_detail.js`, `src/crafting_visibility.js`.
- **Acceptance:** an unmet flag blocks with its name; the fold cycle is deterministic and survives reload.
- **Coordination:** `crafting_detail.js` and `crafting_visibility.js` have uncommitted edits from the crafting-screen dispatch; coordinate with that writer first.
