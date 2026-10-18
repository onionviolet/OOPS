# Black Clover module catalogue proposal

All entries are proposals for authored content and progression, not a runtime schema. Source IDs are pinned in [SOURCE_LEDGER](SOURCE_LEDGER.md). Local authored people, jobs, prices and numeric balances remain original proposals.

## Core tracks

| ID | Proposed module | Evidence anchor | Proposed gates and outputs |
|---|---|---|---|
| BC-MOD-01 | Grimoire and spell book | Grimoire Acceptance Ceremony rev89662; Anti Magic Weapon rev95931 | Track current grimoire, known spells, open/closed use conditions, and bound items separately. |
| BC-MOD-02 | Attribute magic | Asta rev96080; Yuno rev96105; Noelle rev96082; Magna rev95568 | One attribute per sourced start unless the chosen source case establishes more. Model each spell's own targets, range, setup and cost. |
| BC-MOD-03 | Mana reserve and sensing | Ki rev95847; Mana Zone rev94318; Mana Skin rev96042 | Separate reserve, ambient mana, mana perception and control. Sensing does not equal spell ownership. |
| BC-MOD-04 | Rune arrays / Mana Method | Rune array rev93898; Mana Method rev86194 | Array grammar, complexity, preparation time, caster capacity, execution, failure and reusable carved carrier. Mana Method has its own stage threshold. |
| BC-MOD-05 | True Magic / Ultimate Magic | Mana Method rev86194; Ultimate Magic rev83638 | True Magic requires the supported natural-mana method. Ultimate Magic separately gates on soul-origin knowledge and approaching mana; human route needs Mana Method and True Magic. |
| BC-MOD-06 | Magic Knight institution | Clover Kingdom rev93261; Wizard King rev93541; Black Bull rev95897 | Squad membership, orders, mission record, stars, pay, rank and reputation are different records. |
| BC-MOD-07 | Ki and physical discipline | Ki rev95847; Yami rev96062 | Train intention/movement reading and bodily reinforcement as separate learnable methods; avoid granting future sight. |
| BC-MOD-08 | Spirit bonds and succession | Spirit Magic rev96046; Spirit Dive rev92818 | Track spirit identity, compatible attribute, current host, bond/access, availability, resonance, attack eligibility and active form. Include departure, next-host choice, refusal to return after revival, lineage succession and required grimoire spells; do not call every bond a formal contract. |
| BC-MOD-09 | Devil-binding and Unite | Unite rev96045; Devil-Binding Ritual page (see ledger) | Model binding trial, relationship/contract mode, control, synchronized intent, mode duration and recovery only where the cited page supplies it. Do not merge master-servant and equal contracts. |
| BC-MOD-10 | Anti Magic | Asta rev96080; Demon-Slayer Sword rev95749; Demon-Dweller Sword rev95908; Demon-Destroyer page (ledger) | A separate negating force, not an attribute spell or mana pool. Each weapon has distinct target/cancellation semantics and hand/ownership conditions. |
| BC-MOD-11 | Tools and artifacts | Magic tool rev89371; Dungeon rev95914 | Distinguish tool assistance, user mana requirement, stored effects, condition, custody and destruction. |
| BC-MOD-12 | Healing and recovery | William Vangeance rev95875; Twilight of Valhalla rev83402; Grey rev95984; Flower Princess Utopia rev83647; Aquenelle Lore rev83687; Healing Magic page (ledger) | Tissue reassembly, fatal-wound healing, methods unable to heal fatal wounds, temporary death delay, fatigue relief, sealing and resurrection are distinct effects. Preserve each page's stated limits. |

## Proposed ladders and classifications

| ID | Proposal | Boundary |
|---|---|---|
| BC-LAD-01 | Magic stages as local capability classification | Not a universal level or direct combat score. Page-level stage criteria belong in SOURCE_LEDGER before any use. |
| BC-LAD-02 | Magic Knight rank as institutional progression | Mission record, merit, openings and political standing matter; not a spell-learning gate by default. |
| BC-LAD-03 | Spell mastery as personal practice | New spell, accuracy/control, setup speed and reliable execution are distinct outcomes. |
| BC-LAD-04 | Forbidden Magic as a source/cost classification | Mark source and consequence; do not treat horns or loss of humanity as universal price without the exact applicable page. |
| BC-LAD-05 | Team combinations | Store participants, each contributed magic, timing and cancellation interaction. A combined spell is not an owned solo ability by default. |

## Proposed module interfaces

- Spell use checks actual learned spell, grimoire access where required, mana/fuel, body/control, target conditions, preparation and interruption.
- Array use references its grammar and carrier, with one-use or carved/reusable status; poor drawing can fail or explode (Rune array rev93898).
- Ambient-mana techniques use a location/state field. Natural mana availability is not silently infinite or uniform.
- Contracts reference two parties and terms. A pact, spirit succession, devil ritual and equal Unite are different relationship types.
- Ki reading, Zetten and Tengentsu need separate progression records. Zetten uses stored power and motion speed, with divided strikes weaker (Zetten rev95188); Tengentsu requires high initial magic and permanently removes all magic (Tengentsu rev95134). This is later design coverage, not first-slice scope.
- Institution results write to one mission/claim owner and separately update pay, stars, rank consideration and each observer's knowledge.
- Imports do not copy a grimoire, bloodline, spirit or devil. A cross-world method remains dormant until its actual requirements are supported.
