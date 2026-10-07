# Fallout 4 ability variants: force, evidence and protected access

Status: Develop/Research proposal r1, 2026-10-03. These are semantic comparisons and future fixtures, with no runtime or gameplay claim.
Inherit [ability contract](../ABILITY_AUTHORING.md), [campaign](CAMPAIGN.md), [module catalogue](MODULE_CATALOGUE.md), [source ledger](SOURCE_LEDGER.md) and [engine packet](../conceptual/ENGINE_PACKET.md).
Baseline: `fallout4.commonwealth.primary.r1`; base Commonwealth, no 76/TV/DLC/Creations rules. The visitor receives no Sole Survivor identity or perks on entry.
`C` denotes bounded ledger evidence; `O` denotes authored engineering/gameplay; `U` denotes an exact unverified source claim. All local IDs/numbers here are O.
The catalogue owns chassis, parts, budgets and structural stages. This file owns what an operator's selected mode actually does on a target.

## Comparison 1: lift the same culvert obstruction

Task: raise one measured beam long enough to place a supported replacement seal. Clearing the opening and certifying the water are different achievements.
O `fallout.variant.hand_purchase` uses a braced winch; O `fallout.variant.ram_hold` uses the Waterline rig; a source-qualified Power Armor lift waits on FU1/FU2.
F2 establishes Power Armor maintenance/customization generally. It proves neither our rig's numbers nor a particular armor model's capacity, battery interface or pilot readiness.

| Use | Hand Purchase | Ram Hold | Source-qualified armor/body lift |
|---|---|---|---|
| Lower | Taught rigging uses real rope, anchorage, time and stamina | Trained operator runs one serviced ram on a measured support | Actual eligible suit/body and control support the inspected lift only |
| Developed | Better setup changes leverage and permits secure mechanical locking | Supported control and stabilizer hold the beam while tools move | Qualified operator combines known body/suit capability with footing and field practice |
| Mature | Expert crew handles larger loads with actual anchorage and several people | Stronger supported actuation can simply lift faster and farther with stable control | A genuinely superior qualified suit/body can exceed both mechanisms without an invented novice-only immunity |

Acquisition: winch/ram/suit are actual property; the handling method is learned separately. Watching a pilot supplies neither frame nor trained control.
O fixed fixture: load demand four; hand rig output four after four minutes/two stamina; fitted ram output eight for two finite rig-charge units and one minute.
Output/control/reserve are separate. An output-eight ram with broken stabilizer cannot perform a precise load-four placement merely by doubling charge.
Named Fallout fusion-core consumption/recharge remains FU2. Our `rig_charge` is original finite supply, never an asserted universal core equivalent.
Commitment names beam, lift points, operator, tool and actual support. Unknown beam integrity is uncertainty, not a silently guaranteed successful hoist.
Startup reserves inputs and establishes support; lock mode and live powered hold are separate authored choices with different stopping behavior.
Powered hold ends on release, supply/control failure or lost footing. Mechanical lock persists only if that actual lock/load was qualified.
Seal installation consumes the real seal and labor separately. No lift ability creates clean water or repairs a damaged filter.
Failure may drop/damage cargo after paid use; an invalid preview spends nothing. Record which support failed only when observation permits it.
Retention: training survives equipment removal; the actual ram keeps wear/spent reserve; repair restores its function without granting a new copy.
Enough real physical strength can bypass the rig on a suitable beam. That advantage should work, including for an imported supported body.

## Comparison 2: identify the same intake fault

Task: distinguish a leaking joint from a blocked cartridge before buying a repair. The hidden truth is authored once and does not follow the chosen method.
O `fallout.variant.leak_listen`, `fallout.variant.gauge_read` and `fallout.variant.paired_diagnostic` all acquire evidence; none automatically learns repair or confers immunity.
F3 supports separate exposure/injury logistics as a comparison. A radiation instrument's exact canon availability and treatment remain FU3/FU7-gated.

| Use | Leak Listen | Gauge Read | Paired Diagnostic |
|---|---|---|---|
| Lower | Listen at one safe accessible joint; record a possible leak | Calibrated supported meter supplies one pressure reading | Own two actual channels and a reference; record disagreement without concluding a cause |
| Developed | Compare repeated sounds and visible flow against taught examples | Compare upstream/downstream readings using paid access and sample | Run paired readings plus isolated sample to distinguish the selected leak/blockage fixtures |
| Mature | Expert observation recognizes more familiar mechanical patterns | Better qualified instrument resolves smaller changes within its range | On these fixtures, calibrated redundant channels plus tested interpretation are strictly more reliable than a single reading |

Acquisition: listened clues become actor-private knowledge; a meter is held equipment; diagnostic procedure is trained/tested knowledge.
O fixture costs: listening two minutes/one stamina; gauge one minute/one battery unit; paired test two units plus one consumed diagnostic sample.
The superior pair need not have a special weakness to preserve listening. Affordability explains availability; output superiority remains real.
Record sensor definition/calibration revision, target, time, observed values and inference confidence. A recording is not a true repair recipe.
Spoofed/broken gauge can return a plausible wrong reading under its fixed fault rule. Preview must not expose the hidden truth as a rejection reason.
Losing access between readings interrupts the comparison. Preserve paid samples and earlier observations; do not fill missing measurements automatically.
An owned recorder can store a demonstrated repair sequence O; replay grants a study lead, not the mechanic's knowledge, stock or hands.
O reverse engineering uses a legally held specimen, bench and paid trial. A successful test can reconstruct a procedure never witnessed complete.
No faithful organ/cognition/synth-body copying is supported by a blueprint or F4's Institute existence; FU4 remains unresolved.
Inspection reports known coverage/uncertainty. A mature detector sees its supported channels, not hidden motives or every buried threat.
Retention: notes survive meter sale; execution loses the sold instrument; borrowed equipment retains its actual owner and return terms.
Actual institutions can deny sample access. Stolen data changes information/custody according to its real acquisition, not faction rank.

## Comparison 3: enter the same hazardous service chamber

Task: repair a debris-exposed valve with measured contamination. Debris, bullet impacts, heat and radiation are separate channels.
O `fallout.variant.work_guard` covers debris; O `fallout.variant.sealed_task` supplies a tested contamination envelope; canonical suit protection requires selected FU1/FU3 evidence.
The sealed task is a local engineering proposal. No real-world safety certification or canon “all radiation immunity” is asserted.

| Use | Work Guard | Sealed Task | Source-qualified armor protection |
|---|---|---|---|
| Lower | Sound apron/panel covers declared debris paths | Fitted seals and actual clean support block one tested contaminant mechanism | Actual source effect protects the channels its inspected item supports |
| Developed | Trained movement keeps openings away from observed impacts | Tested pressure/seam control permits a bounded working period | Maintained eligible pieces and trained handling sustain the qualified sortie |
| Mature | Strong material withstands larger measured debris | Better tested support offers longer/broader actual protection | A genuinely strong qualified suit may defeat lower ballistic threats and remove applicable exposure concerns |

Output is prevented exposure while the envelope holds. It is not treatment of accumulated bodily radiation, prior wounds or contaminated cargo.
Acquisition requires actual fitted parts/supply; practice controls use; diagnosis identifies what needs protection. Buying armor grants none of the other two.
O sealed-use costs one cartridge and two finite charge units per declared work period; field refit requires an actual clean bay.
Work Guard has ordinary carried mass/wear. Do not invent a magical exhaustion meter or fusion-core drain for plain clothing.
Loss of the seal disables that contamination protection, leaving unrelated plating and training operative. A broken display does not erase steel durability.
Counter: an attack through a real open seam or beyond supported output may work. “Boss radiation” is not a reason to ignore a verified compatible barrier.
Two guards cover their actual geometry; two identical filters do not automatically double duration without a supported routing interface.
A sealed worker and unsealed cargo have different owners/exposure states. Passing the room does not certify the carried sample.
Termination: exit, declared work-time limit, exhausted actual support or a breached boundary; spent input and exposure remain after stopping.
Body resistance can be superior protection where its actual mechanism fits. It need not acquire a suit just to satisfy the mission's expected build.
Failure can be serious under a later selected profile; this document enables no radiation damage, lethal/offline policy or save deletion.

## Cross-source combinations and observer limits

Force plus a sensor can be an effective combination if mounting, power and operator attention fit the catalogue's real budgets.
Free reserve does not fix inadequate supply throughput or cooling; our proposed apparatus needs exact adapter checks, not prose warnings.
Frontier Load-bearing Step keeps its actual drive/strain policy; it is not chakra, FP, fusion supply or a free battery charger.
Mina observes serviced mechanism and funded work; Imani knows actual sample results; neither learns a private source from a successful beam lift.
NPCs can own superior rigs, funded diagnostics and learned methods. Their fuel, control, targets and information obey the same causal rules.
A loan grants use within terms; theft changes actual property only under a selected custody policy, not by setting a power-family tag.
Learning a repair procedure retains its demonstrator/test provenance. The donor's later improved rig does not upgrade the saved learner record.
Physical/knowledge copying, source transfer, appearance and actor identity remain separate. FU4 prevents a generic synth-clone factory claim.

## Mastery within the selected operating method

O facets: evidence interpretation, load estimation, setup precision, motion control, duty planning and emergency recovery; they improve independently through paid trials.
A mechanic can diagnose well but pilot poorly; a strong operator can lift well but misread calibration. One success never grants the entire profession.
Use observable facet gates, such as a controlled loaded stop or a correct redundant-reading diagnosis, with real reserve/stock/time.
Submodes can develop faster lift, finer placement or longer supported work. Mature equipment/control can improve several together without invented equalizing penalties.
Structural upgrade stays in the catalogue; practice cannot supply an absent motor, interface, cooler or source. Better parts do not erase learned mastery.
Repeated trivial trials may retain evidence without unlimited new insight; paid failure can still improve a bounded hypothesis rather than award an invented successful repair.

## Bounded implementation gate

Available groundwork: typed commands, paid effects, energy, native inventory staging, custody, knowledge and claims; ENGINE_PACKET maps actual source functions.
Missing: installed-part condition/identity, rig mode budgets/thermal support, local currency/items, radiation channels, qualified suit costs and native per-shot/general local combat.
Freeze one ordinary diagnostic plus one fixed O ram fixture before attempting canonical Power Armor assembly or body replacement.
Preview changes no sample, truth, reserve, RNG or knowledge; errors reveal missing known inputs without disclosing a private fault.
Compare the same beam/fault/chamber at lower/developed/mature use; include one superior result with no compensating hidden immunity.
Missing fuel, control, wrong target, stale calibration, borrowed destructive specimen and occupied helper must reject without spend.
Interrupt after a paid measurement/lift; retain actual input loss, partial evidence and changed cargo. Reload cannot refill support or clear exposure.
Repeat delivery cannot mint frame/parts or duplicate claim; failed persistence publishes neither spent stock nor apparent success.
An integrator must rebuild and check visible use/save/reload on generated fixtures. No browser, migration or human acceptance is claimed here.

## Local checkpoint

Revision 1: new exclusive semantic owner only; campaign, catalogue, ledger and all runtime inputs remain unedited by this role.
Evidence: F2/F3 and FU1-FU4/FU7 bound canonical machinery/body/protection claims. Named methods, calibrated thresholds and industrial modes are O.
Next: source one selected canonical equipment rule if needed, otherwise freeze the O diagnostic/lift brief and its precise missing adapters.
