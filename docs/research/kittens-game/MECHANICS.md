# Mechanic digest

Evidence is stated source except controlled technology/price models marked shown. Revision is in REPORT.

| State | Donor source field / evaluator | UI consequence |
| --- | --- | --- |
| Technology exposed | tech.unlocked | Visible research row |
| Technology learned | tech.researched | Completed label, disabled purchase; optional hiding |
| Building permitted | unlockable/defaultUnlockable | Eligible for reveal evaluation, not owned |
| Building exposed | unlocked plus unlockRatio | Visible build row, possibly unaffordable |
| Building owned | val | Owned quantity |
| Building active | on | Active/owned count or toggle |
| Affordable now | resPool.hasRes | Enabled purchase unless already complete/other limit |
| Cost blocked by storage | isStorageLimited | Optional limited highlight; held overcap exceptions |
| Input conversion limited | lackResConvert | Building warning class; no exact missing input receipt |
| Engineer progress input-limited | isLimitedAmt | Craft warning class; progress can hold |

Controlled calendar research models showed hidden, exposed-but-short, cap-blocked, affordable and researched as distinct outputs. They were seeded model fixtures, not paid purchases.

| Held resource | Upkeep / running use | Craft use | Build use | Display limitation |
| --- | --- | --- | --- | --- |
| Catnip | Population consumption | Wood refinement | Fields, pastures | Costs/rates live in different tooltips; no combined destination quote |
| Wood | Smelter running input with minerals | Beams | Housing and other structures | Same common pool; converter consumption competes with instant spend |

Cost display computes held/required, not an explicit missing-number sentence. Positive-rate ETA is a local forecast, not a promised completion time. Zero/negative rates have no cost ETA; resource tooltip can show depletion. Nominal-cap asterisk can disagree with actual affordability for already-held overcap stock. Queue ETA has stronger capacity/nonpositive guards than tooltip ETA. These details should be resolved by the existing YAIRPG admission facts rather than duplicated as a second evaluator.
