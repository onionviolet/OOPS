# Products, objects and legacies over time

2026-10-14. **PROPOSAL ONLY.** Extends root IT1-IT5 and PR1-PR2 in the [crafting palette](../../../../PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md). Reuse [P6 repair](../p6/REPAIR_SALVAGE.md), [containers and preservation](../p6/MORE.md), [constructs](../p6/CONSTRUCTS.md), [P11 biographies](../p11/MORE.md), [P19 lineage](../p19/LINEAGE.md) and [story G3/H4/L2/P3](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md). These proposals do not introduce universal decay, durability or upkeep.

## IT1: aging follows the product's clock and law

IT1.1: Retain immutable manufacture truth and a separate mutable lot/instance lifecycle: creation clock, applicable aging law/revision, current stage, eligible accumulated time, environment intervals, next boundary and transformed product reference. A generic inventory timestamp is insufficient when storage can alter the clock. Use played game time first. Browser closure does not age stock until an offline policy is selected and proved.

IT1.2: Aging may mature flavor, release a fraction, bind an impurity, lose charge or spoil a specific product. Each is an authored transformation or response, with actual consumer and accounted destinations. Improvement need not carry a forced downside. A stat-changing rule is distinct from a buyer liking the date on a label. Rare world laws can suspend, accelerate or reverse aging through an actual source; adjectives define them without a universal once restriction.

IT1.3: Resolve at meaningful boundaries, including quote/transfer/use admission, rather than scanning every item every tick. One large clock step and many small steps must traverse the same boundaries and preserve fractional progress. Transfer updates custody and environment, not the manufacturing birthday. Split a homogeneous lot into daughters with the same applicable history; heterogeneous bottles can retain distinct histories. Merge only when downstream consumers can safely treat them as equivalent, or keep member references under a visual group.

P2 seam: `src/mixture_state.js:37,64-70` in its worktree validates stored products against original inputs/profiles and revision-1 dose. Mutating its stored dose to represent aging would violate that contract. Propose a retained transition to a separately admitted supported product/lifecycle adapter. Existing revision-1 products remain unchanged and active exposures keep the exact dose already consumed. Recalculating a spent dose from the now-aged source would be incorrect.

Original first example: one explicitly new salve family has fresh and cured stages, where curing changes a supported application response. P6 owns that transformation; CR4 owns history/recognition and time selection. Existing P2 vials do not silently begin spoiling. Food remains optional and comfortable unfed play has no hunger death.

## IT2: use produces evidence and, where authored, growth

IT2.1: A growth law names qualifying actual use, beneficiary, progression unit, supported milestones and costs/source. A cauldron can improve precision for a practiced method through real batch receipts. A blade can retain a bond or local curse from qualified events. Equipping, inspecting, trading to oneself or reopening a tooltip is not automatically a use receipt. Repeated legitimate practice remains available.

IT2.2: Growth need not be numerical power. Unlocking a supported handling mode, learning a holder's preferences, becoming easier to repair, gaining a visible patina or attracting collector interest are distinct consumers. A player can keep a plain dependable tool, grow a favorite, refit it, transfer it or build several. No global highest-tier-only equipment rule.

IT2.3: Preserve object identity across repair and custody when its law permits. Replacing a handle may preserve a blade's history and change fit; remelting may destroy structure while retaining a historical account. Duplicate application of one receipt cannot grant growth twice. A lawful duplication cheat declares whether physical copies share or branch growth and conserved identity; do not infer this from copied text.

## IT3: awakening admits an actor

IT3.1: An awakened object has a qualified agency/bond/controller reference, goals, knowledge, supported perceptions and verbs. It is not a random personality label that grants omniscience. P6 constructs and actor/body owners decide dormant, deployed and carried states; one object cannot simultaneously occupy incompatible custody/worker roles.

IT3.2: History can influence personality through authored interpretation. A ceremonial tool might value careful work; an instrument may prefer a known performer. Disposition, memory, cooperation and output capability remain separate. A sentient item can disagree, negotiate, teach, transfer allegiance or remain quiet where the world supports these acts. This is not a universal refusal mechanic or mandatory companion.

IT3.3: Awakening conditions are fixed before discovery. A threshold may consume a saved draw or be deterministic under a local law. Failure to meet it does not reroll secret truth on every use. Sealed outcomes appear in ordinary reports by ID, route and status only; a generated nickname cannot disclose them.

## IT4: event curses and blessings are real transitions

IT4.1: Match a retained qualifying event receipt to actual participating object, place, wielder and world law. A reported murder is a claim; the physical event and a curse's formation have separate authority. Public franchise mechanics can be summarized with locators; changed/generated truths stay sealed. [P20 residue](../p20/RESIDUE.md) owns the local formation/removal reader; CR4 adds attachment to the exact crafted object.

IT4.2: Define whether residue is a current surface effect, ongoing grant, conserved identity, awakened agent or historical significance. Cleaning, repairing, exorcising, reconciling and remelting operate only on their supported representation. Removing a curse need not erase its history, refund spent matter or silence witnesses. Later distinct qualifying events can create new effects; receipt idempotence is not a lifetime once cap.

IT4.3: An ordinary event can also change sentimental value with no physical curse. Keep this useful social path available rather than requiring supernatural escalation for every heirloom. A blessing unknown to the holder still operates through its consumer; unknown authoring data never becomes an arbitrary surprise rule.

## IT5 and PR1-PR2: explicit carryover, one prestige layer

Separate travel, death succession, retirement, reincarnation, temporal reset and the selected prestige boundary. Current heir behavior is a source fact, not a design ceiling. The first milestone still has one prestige layer; these options describe its possible transfer policies.

| Root extension | Possible survivor | Required carrier and useful consequence |
|---|---|---|
| PR1.1 notebook | Tested methods, contradictory claims, evidence and partial knowledge | Surviving physical edition, transmitted teaching or explicitly supported memory. Imported knowledge does not grant absent ingredients, fuel or faculty. |
| PR1.2 precision | Practiced execution or muscle memory | Selected continuity law for body/memory; an ordinary heir studies/practices rather than inheriting all XP. A powerful rebirth cheat can retain more under its own law. |
| PR1.3 brand | Product line, maker mark, school and public recognition | Living audience or surviving accounts plus a recognition route. A name change or secret reincarnation does not automatically make every trader know the continuity. |
| IT5.1 heirloom | Exact tool, vial, manual, fixture or awakened object | Custody/title and reachable holder; preserve full product/lifecycle definitions before transferring references. Keep, sell, lend, donate, restore or recover remain reachable. |
| PR2.1 old-life relic | Surviving product from an earlier life | Same-world shelf/custodian and actual elapsed clock. Legend can grow through accounts while chemistry remains unchanged, aged or inert under its law. |
| PR2.2 recreated work | New copy made from inherited instructions | New inputs, new receipt and local resolver; a reconstructed blade is not the original unique heirloom. It can still have legitimate personal and economic value. |

PR1.4: Show a pre-boundary carryover manifest with known retained, transformed, inaccessible and lost fields. Hidden survivors remain ID/status only until an eligible discovery route. A kept brand does not carry escrow balances automatically. Pending jobs and commissions need explicit completion, transfer, cancellation or retained-custodian policy before succession.

SHOWN/SOURCE: main `src/heir_inheritance.js:32-64,81-93` derives carried/worn/chest goods, selected lessons, regional standing and money, then applies goods/home/reputation to a new envelope. It does not copy a general generated product catalogue. INFERRED join risk: transferring only a P2 mixture key can leave its product reference unresolved. This lane did not run that combined flow; root must implement and test full reference closure rather than declare it broken from source alone. Preserve existing heir rules outside selected extension. Row/key bounds need an explicit compatibility policy if an extension exceeds them, never silent loss of meaningful maker history.

STATED, inherited [P6 K11](../p6/CANON_LOCATORS.md): A Soldier's Life Book5 ch282 P50-54 and ch310 P48-53/ch311 P4-14,22 describe a particular storage law suspending content time. CR4 did not reread primary prose; it supports a qualified local preservation candidate, not ordinary global time-stop.

OPEN: lifecycle/eligible-clock equivalence, heterogeneous split/merge, actual growth consumer, event-to-object causality, actor deployment, old-exposure retention, exact carryover closure, prior holder disposition and pending commission settlement through Save/reload/literal-file Import. Human emotional value and balance remain separate acceptance.
