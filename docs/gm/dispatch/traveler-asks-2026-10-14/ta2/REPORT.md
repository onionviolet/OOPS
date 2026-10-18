# TA2 report: world ask profiles

2026-10-14. **Docs delivered, proposals only.** No generated travelers, code, save migration or new world was implemented. Writes are restricted to `ta2/`; nothing staged or committed. Root owns the docs commit. Sealed truths were not included.

## F1: what changed and where to read

The old request vocabulary described three Village goods. [INVENTORY](INVENTORY.md) now routes **120 profiles**, each with six original asks, roles, seasonal/situational needs, reward palette, cadence, effort/danger bands, world-specific exclusions and obtainability notes. [PLAYABLE_PROFILES](PLAYABLE_PROFILES.md) puts the ten source-present destinations first, then the retained optional Soldier slice whose full expansion stays paused. The other files cover books/tabletop, anime/deferred games, comics/webtoons/BD/strips and original candidates/families. Bread is one possible ordinary need, not the universal fit for every world.

The profile tables contain **720 example rows**. Frontier's graded-hide extension and the additional Cyoria bread example make **722 unique example asks** across this packet. Canon/source constraints are attributed to local owners with their claim limits; all new dialogue and jobs are original proposals. [SOURCES](SOURCES.md) explains that coverage is source-family/profile coverage, not an exhaustive list of every place within every fictional universe. Ten destination IDs do not mean ten completed worlds.

## D1: amendment applied

[SHAPE](SHAPE.md) uses **ready / stretch / unknown**, with real route support kept separate from the player's knowledge. No fresh-player route filter is proposed. Unknown asks provide honest leads, stretch/unknown quotes carry extra funded effort/discovery rewards, and neither creates an absence deadline penalty. Planned route suggestions stay outside runtime admission until a world owner builds or binds them.

Item asks remain exact data-driven IDs with an optional grade selector. Completeness and quality remain distinct, resolved by the harvest owner. TA1 currently reserves `grade:null` and excludes non-null rows; the Frontier graded-hide example is proposed, not usable gameplay. Services/information/favors are a minimal conditional target extension, not fake inventory items or an invented shared job engine.

## D2: ranked next generated-traveler worlds

This is a **build recommendation**, not a change to PROJECT's canon-first direction or authorization to launch another lane. PLAN's TA1 play-feedback condition remains. Rank 1 chooses an existing book-world footprint so the next traveler slice can be playable without waiting for a whole new campaign.

| Rank / code | World | Why this position | Concrete first slice / readiness |
|---|---|---|---|
| 1 / O1 | **Cyoria retained visitor branch** | Already has exact paper/ink/bread IDs, finite named purchase/work routes, a distinct local crown economy and an ordinary study theme within the accepted book-world tier | [NEXT_WORLD_BUILD_PACKET](NEXT_WORLD_BUILD_PACKET.md): three goods, original visitors, actual local stock/crown/history adapter, ready/stretch/unknown assessment. Data and route references are ready for a code lane; execution/proof open |
| 2 / O2 | **Harry Potter** | Leading accepted canon priority; supervised school/shop needs give clear ordinary requests without relying on protagonist powers | Parchment/jar/ordinary equipment asks first. Selected era/origin, source-qualified shop/stock and runnable world footprint must exist before generation; these docs do not supply them |
| 3 / O3 | **D&D selected setting/edition** | Leading accepted canon priority; mundane goods, repair and known guide work have explicit edition/setting boundaries | Rope/repair-kit goods first; add Mending only through actual sourced spell/service terms. World owner must select setting and bind executable routes/currency |
| 4 / O4 | **Paradise contractor hub** | Accepted book-world priority and existing footprint; preparatory supplies and paid training fit recurring visitors | Hub goods first with `book.paradise.coin`, separate from Goa belli and nested credits. Avoid mission-foreknowledge and protagonist entitlement; broader actors/route scope need explicit binding |
| 5 / O5 | **JJK** | Leads the accepted anime tier; ordinary support and qualified containment preparation fit its tone | Ordinary containers/records first. Select continuity and supervised acquisition/handling before any cursed-object or source-sensitive demand; no generic resource collection invented |

Saltworks is a technically compact alternative for testing a second local stock/credit adapter, with meaningful maintenance needs. Its cheaper implementation does not move original-world expansion above the accepted canon-first priorities. Soldier remains profile-ready but its paused whole-world task is not resumed. LOTM/COI, Shadow Slave, TTKS and the other profiles remain concrete palettes for their selected world owners.

## F2: TA1 comparison and verification

Read committed branch files with `git show proc/ta1-village-asks:...`; final reviewed head **d79a99d1ec152b60e98329bf7e0f72765105ae4f**. [SHAPE F1](SHAPE.md#f1-checked-against-committed-ta1) records the exact row/goal/contract mapping, eight item IDs, twelve rows, quantity ranges, reach/fee behavior and the grade reservation. A table alone does not remove Village-specific execution. Later branch changes need a fresh comparison before implementation.

TA2 ran structural documentation checks recorded in [DOC_CHECKS](DOC_CHECKS.md): profile/ask counts, unique IDs, required per-profile sections, inventory coverage, local files/anchors and no em dashes. It inspected current Cyoria acquisition commands and local payment resources. These are **DOC/SOURCE** checks. No test suite, rebuild, browser, gameplay/save/import or human acceptance check was run for a docs-only task; historical sibling proofs were not claimed as this lane's evidence.

## R1: remaining authoritative gate

After TA1 play feedback and an authorized second-world lane, build the selected adapter and prove its natural local acquisition/delivery, seeded band comparisons, rebuilt desktop behavior and exact save/reload/literal-file Import. Human fiction/price/pacing acceptance remains separate. [BACKLOG](BACKLOG.md) records deferred implementation, source qualifications and harvest integration without turning them into new global gates.

Summary: profiles and the shared shape are delivered. Cyoria is the recommended next finite traveler slice, with the concrete route/currency packet ready for implementation planning.
