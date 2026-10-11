# Battle Brothers source audit, 2026-10-08

The bounded extraction and audit are complete. Battle Brothers makes a company feel like people because food, pay, wounds and past work change who stays, what they can do, and what they remember. That is the strongest lesson for YAIR.

The install stayed read-only and remains installed. No game launch, user-save access, uninstall, YAIR source edit, build or commit occurred. This is source research, not playable acceptance.

## Main findings

**F1: People have practical reasons to stay or leave.** Backgrounds affect biography, traits, kit and costs. Mood keeps a short reason history; missed pay and food affect individuals differently, and severe mood can trigger desertion. Departure and death have separate custody and record paths. Wounds can redirect an established fighter into another role. These are selected script readings, not a full social simulation.

**F2: The company carries obligations and a reputation.** Wages, provisions and repair supplies compete for money. Public capability and moral reputation are distinct. Retinue specialists have requirements and concrete service effects. Cities and their rulers have linked but separate standing. This supports a small organization; the reviewed code does not establish player kingdom-building or simulated succession.

**F3: Crises alter the world through phases.** Scheduling and company-strength gates lead to warning and active phases. Crisis choice depends on the political structure and previously used types; war changes alliances and leaves start/end news and aftermath. A necromancer has a specific corpse-based revival method. None of this proves ancient powers autonomously planning their own world-scale resurrection.

**F4: Aging and fairness need narrower claims.** Swordmaster aging is a level-gated event, not evidence of universal year-by-year lifespan. Separate combat, economy and ironman settings show that harshness and save policy are different choices. Visible causes, recovery estimates and warnings can make loss understandable; that is a design inference, not a playtest verdict. YAIR's accepted native unconsciousness and recovery remain unchanged.

## Ranked proposals

Original proposals only, not accepted decisions or authorization to implement.

| Rank/code | Proposal | First useful vanilla result |
|---|---|---|
| 1/P1 | Continue one named helper agreement | Extend the existing pathfinder commission with explicit continuing terms, one preference and a departure warning. |
| 2/P2 | Explain local standing through recent causes | One Village contact tells you why a favor or grievance changes its response. |
| 3/P3 | Earn a practical specialist through ordinary work | Actual crafting/care opens a concrete repair or care service. |
| 4/P4 | Let prior work shape a recurring social scene | A veteran teaches, or a helper comments on food you actually supplied. |
| 5/P5 | Keep useful work available during recovery | An optional companion injury restricts one physical job while workshop/study stays useful. |
| 6/P6 | Make one local crisis change the place | Traces, pressure and aftermath affect one road or supply chain. |
| 7/P7 | Record an enemy power as an observed method | Notebook evidence reveals a real restriction and a researched counter. |
| 8/P8 | Give service and loss an individual ending | A named departure/loss leaves a milestone and one authored survivor response. |

[Packets](IMPLEMENTATION_PACKETS.md) define costs, current owners and proposed browser/persistence gates. [Twenty-four small touches](SMALL_TOUCHES.md) map to vanilla actions and additive owners. Live YAIR already has pathfinder commissions, social mood conditions, regional reputation, a bounded Village family and compacted biography. These proposals deepen those owners.

## Extraction and limits

Build 23856902 supplied 3,114 encrypted Squirrel members in ten ZIP-form DAT archives. A selective 30.2 MB snapshot retains 3,239 script/UI members with matching SHA256s. 1,109 unique nonempty .nut reconstructions were emitted; 41 private source files received selected-method review, supporting 44 findings. These counts are different verification states, not whole-game coverage.

Tools: [Enduriel/bbkit v0.1.3](https://github.com/Enduriel/bbkit/releases/tag/v0.1.3), bbsq and Nutcracker 0.02, with isolated CrossOver execution. A reconstructed farmhand passed syntax compilation without execution; selected debug bytecode matched its stat literals and event-selection operations. The [tool author warns of reconstruction bugs](https://www.adammil.net/blog/v133_Battle_Brothers_mod_kit.html). An unresolved food-loop jump and a crisis serialization read/write discrepancy remain unqualified; numeric background arrays are endpoint offsets, not final ranges.

[Coverage](COVERAGE.json) answers all seven lenses. [Findings](FINDINGS.json), [reviewed sources](REVIEWED_SOURCES.json), [DLC coverage](DLC_COVERAGE.json), and [extraction receipt](EXTRACTION_RECEIPT.json) preserve the evidence boundaries. Full combat balance, contract payment execution, specific crisis contribution actions, native save internals, universal aging and runtime DLC activation remain open source questions. Raw proprietary code, prose and binaries stay private in `~/.codex/research/battle-brothers/`.
