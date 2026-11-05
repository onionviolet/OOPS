# Kenshi life-sim source pass

The useful source inputs are copied and hash-matched. The assigned finite pass is complete and the installation can be removed after the coordinator checks for other installed-path consumers. The worker now uses only its private copy.

Kenshi's game runtime is native C++, but its Forgotten Construction Set editor is managed C#. Decompiling that editor recovered the real database reader. A private decoder then parsed all four shipped base/mod databases to their exact ends, including typed properties and links. This is recovered editor logic and readable authored game data, not recovered native gameplay execution.

- **F1:** A nobody origin changes the starting group and deprivation together. The patched Nobodies start points to five characters in a malnourished squad; the default Wanderer has money and a different squad. Origins can set practical obligations without replacing progression.
- **F2:** Food is connected to work, storage and bodily need. Bread links flour and water, a production functionality creates it, and a barrel restricts its contents to bread. Patched hunger constants differ substantially from base values; reading the base alone gives misleading balance.
- **F3:** Squad roles combine priorities, time windows and a separate unloaded behavior. Captive labour switches between mining and confinement. These data do not reveal the native scheduler or guarantee its timing.
- **F4:** Hired protection is an explicit temporary contract. A money condition and spend action connect to a 48-hour AI package and an expiry conversation. Contract end is a story consequence, not just a vanished bonus.
- **F5:** Named people's alive, dead and imprisoned states feed dialogue, patrols and replacement towns. Player involvement is separate. A changed ruler can alter a place's inhabitants and commerce without saving a transcript of every tick.

[Findings](FINDINGS.md) contains source record IDs and binary offsets; [coverage](COVERAGE.json) separates decoded from read and executable from authored behavior. [Implementation packets](IMPLEMENTATION_PACKETS.md) are original proposals for the experience/foundation GMs. None is an accepted decision or implemented gameplay.

No launch, save inspection, gameplay edit, commit or uninstall was performed by this worker. Native AI, needs, combat, world-state evaluation and save serialization remain unread. Steam's manifest lists soundtrack depot 468550; audio was deliberately excluded and no gameplay DLC coverage is claimed.


## Content and coverage reconciliation, 2026-11-04 (B174)

This report, full coverage JSON and P1–P5 were read.59558 decoded typed records across four individual layers and exact EOF checks are structural data recovery, not complete mod load-order/removal semantics or native AI/needs/combat/save execution. FCS managed reader recovery is distinct from native C++ gameplay. Patched hunger values differ from base, so even authored balance cannot be inferred from one layer alone. Source copying and zero worker consumers do not authorize present uninstall.

Retain practical origin circumstances, food/work/storage linkage, priority/window/unloaded policies, temporary protection ending with an actual contact, and person-status-driven institution changes. Proposed apprentice wages and shared work, expiring service versus durable friendship, institution truth versus who knows it, and coarse absent routine boundary checks should reuse current stock/job/actor/knowledge owners if selected. They do not require per-tick distant simulation or a universal hunger/survival penalty. Authored unloaded mode is not a recovered save-compaction algorithm. Old first-milestone, blanket existing-save and “verification deferral” wording is historical under current direction/AD36/AD43. No native game, private source or YAIR consumer was reverified.
