# SEALED: S1 candidate design and fairness self-review

SEALED. Author/implementer/reviewer only. PROPOSAL, not accepted truth or verified gameplay. Do not show this file, its diff, its candidate text or mechanical answers to Weibao outside the authorized discovery route. Public reports use S1.T1, S1.T2, S1.T3, R1, R2 and P1 IDs only.

Host: original base.frontier Village branch proc.s1@1. This is an original local phenomenon, not canon or a replacement for inherited world physics. All three candidates concern an optional demonstration brace at a local bench. Legacy survey kits and native weather retain their existing behavior. Use separate demonstration objects and task IDs. Ordinary preparation remains possible without discovery.

## Shared playable setup

The branch contact sells one reusable demonstration brace for 2 coins, one reusable testing board for 1 coin and a duplicate bound local ledger for 1 coin. If none affordable, a repeatable three-minute local service job earns 1 coin, costs 1 stamina and provides no campaign credit. Inputs and job effects use actual native owners. These prices are prototype values. The selected brace starts unidentified with surface text: “A locally made brace. Its maker recommends testing it rather than guessing.” No template description advertises its hidden condition.

The player can perform baseline preparation (4 minutes, 1 stamina, 1 coin) to produce one ordinary preparation token usable by a new eight-minute local parcel task. The token reduces that task by 1 minute; exactly one token consumed per parcel, parcel pays 2 coins and costs 1 stamina. There is no travel gate, special loot or mandatory secret-solving. The secret-supported preparation P1 instead takes 2 minutes under the candidate's condition with the same stamina and coin, yielding exactly the same token. Off-condition secret preparation takes 4 minutes, disclosed as a measured result rather than an unexplained success probability. The unpaid preview reports only the player's actual observations; before knowledge it may quote “2–4 minutes, not yet tested.” Freeze actual duration at paid commitment.

R1 requires Perception level 1 or a taught observation service: 1 coin, two minutes, with the local contact physically present. The service is a supported means, not direct truth grant. The testing board is required and not consumed. Three paired experiments each take 2 minutes/1 stamina; manipulate exactly the candidate condition, compare true job durations, and record observations. At most one pair is needed for sensed, two for suspected, three for known. Identical unmanipulated retries do not count as distinct proof. Every candidate has both conditions accessible in Village without seasonal or annual waiting.

R2 requires Literacy level 1 plus possession of the local ledger, or commission its reading from the same present contact for 1 coin/two minutes. Read two independent maker records (2 minutes each) and inspect the corresponding bench trace (2 minutes/1 stamina). Their agreement is direct proof even without R1. The ledger's contents are IDs resolved under the chosen candidate/revision, never a catalogue of all possible solutions. An incomplete read is a guess clearly marked suspected. No random skill failure can permanently close R1 or R2.

Stage 4 known uses either completed R1 or R2 proof; stage 5 usable requires an actual successfully completed secret preparation, not pressing its preview button. Proof records have stable operation/pair/sample IDs, candidate revision and measured duration. Legacy log emits neutral “S1 observation recorded” until proof; secret text renders solely in its Notebook route, including the known stage.

## Candidate records

### S1.T1

Truth: the brace's resin responds to a repeating mechanical pulse. Its joining surfaces tighten under a regular tapped rhythm and remain ordinary under irregular tapping. It is a specific authored material rule, not a claim that all Village wood behaves this way.

R1 paired setup: regular taps versus irregular taps on the same testing board, then measure preparation. Explicit tap choice is a command, not player timing skill. Three independent sample positions are authored and always available.

R2 maker records: the shop's pulse-count trial and the repairer's vibrating-joint note; the bench trace is a regular contact pattern. All disclose only progressively through reading/inspection.

Known text: “The brace tightens to a regular pulse. Repeat the tested rhythm to prepare the joint faster.” P1 condition: committed preparationMode=pulse. Off-condition: preparationMode=irregular. Surface clue: unusually even marks, with no explanation before observation.

### S1.T2

Truth: the brace's mineral lining retains a short-lived reaction to fresh moisture. Deliberately dampening the lining speeds the next preparation; drying it restores the ordinary rate. This is unrelated to the global rain cycle and never changes carried food or unrelated tools.

R1 paired setup: wet the lining with the board's reusable water cup versus wipe it dry with its attached cloth; measure preparation. Both operations use the actual board apparatus, no free native ingredient grants. Each sample position has its own temporary state.

R2 maker records: the moist-lining timing sheet and the dry-storage inventory note; the bench trace is a chalky boundary after drying.

Known text: “Fresh moisture activates the brace's lining. Dampen it just before preparing the joint.” P1 condition: liningState=damp with a committed use within 10 played minutes. Off-condition: dry or expired. Surface clue: an intermittent chalky boundary.

### S1.T3

Truth: the brace's living fibers respond to contact with a specific living potted cutting at the demonstration bench. Dead cuttings do not evoke the response. The supported contact is material-specific, not a universal plant intelligence or power-source inheritance rule.

R1 paired setup: contact the reusable living cutting versus a dead comparison cutting at the same bench, then measure preparation. The authored apparatus owns both, preventing duplication into player stock or harvest farming.

R2 maker records: the living-cutting trial and the dried-cutting failure entry; the trace is a pattern of fiber alignment beside the living cutting.

Known text: “The living cutting aligns the brace's fibers. Use that contact before preparing the joint.” P1 condition: contactId=living, performed at this bench during preparation. Off-condition: dead or none. Surface clue: fibers seem to align unevenly around the bench apparatus.

## Fairness self-review (design only)

| Candidate ID | R1 ordinary access | R2 independent access | Payoff | Basic-progress fallback | Risk / mitigation |
|---|---|---|---|---|---|
| S1.T1 | Board plus taught/held observation; both commands always available | Obtainable ledger, two records and trace; taught reader alternative | Faster paid preparation under discovered condition | Baseline preparation/parcel work unchanged | Do not encode rhythmic skill as actual click speed; use explicit paid command |
| S1.T2 | Board apparatus supplies paired controlled conditions | Same ordinary reading access, independent documentary proof | Same useful token sooner; expiry is played time | Baseline remains four minutes without danger | Freeze duration/lining consumption at commitment; reload cannot renew moisture |
| S1.T3 | Both apparatus samples are always accessible at original bench | Independent records plus local trace | Same useful token sooner at supported bench | Baseline never needs the cutting | Apparatus has actual custody; do not turn contact into free plant inventory |

All candidates: clue reachable with ordinary play; two complete independent routes; knowledge changes a useful option; no mandatory hunger, death, prestige, world travel, rare gear, years of waiting or irrecoverable route loss. P5 self-review is not the separate sealed reviewer pass requested by WORLD_SECRETS_AND_DISCOVERY. That independent pass remains OPEN before runtime acceptance. Reviewer should test off-condition/expiry/custody cases and inspect all visible/exported strings privately, reporting only IDs.

## Implementation receipts and output boundary

Use candidate/evidence/reading/payoff IDs in worldSecrets. Do not put the paragraphs above or candidate-dependent truth text into item inventory payloads, generic simulation knowledge.value, roll labels, raw event history or save exports. Stage-specific text resolves from this versioned content. Save condition state as opaque IDs and clocks in the sealed owner; measured duration is an observed numeric result, not truth prose. Generic source/knowledge metadata stores neutral IDs; unsupported content errors identify revision only.

Source fixtures select each candidate on fresh test origins using real constructor/commit code. Their ordinary actions can then exercise R1/R2/P1. Automated checks assert leaks with boolean/ID messages; do not print expected/actual secret text on failure. Evidence report contains IDs, route, stage and pass/fail only. No P5 private saves or runtime fixtures have been used.
