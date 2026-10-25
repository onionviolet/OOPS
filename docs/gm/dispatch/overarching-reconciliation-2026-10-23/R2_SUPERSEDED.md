# R2 superseded status wording, 2026-10-23

Verbatim replaced blocks from the immediate pre-R2 dirty working copies.
These are dated findings and inventories, not current status or build instructions.
Current summaries remain in the two owning documents linked by [R2 report](R2_REPORT.md).
The original wording, including its proposal and authored labels, is retained here.

## docs/research/itch-io-2026-10-22/OPEN_GAPS.md

Pre-R2 SHA-256: `c1355ba8ed8d085310270b60cb96c1216732810ba7f772640f53337cefe2074b`.

### Original lines 7-8

````markdown
[play queue](PLAY_QUEUE.md) keeps the games and their play checks. Nothing
here is accepted direction (AD32). Codes `OG1`+ are stable; extend them, do
````

### Original lines 12-12

````markdown
fix or route first), **play** (only play can settle it), **closed-unreachable**
````

### Original lines 17-17

````markdown
Fixing these unlocks code in several batches at once.
````

### Original lines 21-23

````markdown
| OG1 | The shared Godot decoder (`~/.codex/research/idle-reincarnator/tools/decode_gdc.py`) asserts bytecode v101. Godot 4.3 (v100) builds fail. The crafting batch patched a private copy for Stacksmith. | Cartographomancer (EXPLORE); possibly POTION Godot builds | Fold the patched variant into the shared tool with a version table, then record it in `docs/TOOL_REGISTRY.md` | Cartographomancer scripts decode with zero errors |
| OG2 | Il2CppDumper and Cpp2IL cannot handle Unity metadata v39 or v108. Auto mode failed on a v31 wasm. Cpp2IL gave signatures with empty bodies. | Slime Reborn, Surviving Magic Academy, Terraformental bodies (LIFE_B); Beggar's Life code (LIFE_A) | Check for newer dumper releases supporting v39/v108 and wasm call analysis, through `scripts/toolsets.py doctor --probe` | One of these builds yields method bodies |
| OG3 | Il2CppDumper was not run on several IL2CPP builds whose metadata was downloaded. | Looper consequence table (MAGIC); Path Past The Mountain, Stoneheart Archive, Astroecologist (EXPLORE); Levers of Democracy (ECONOMY) | Run the dumper on each saved `global-metadata.dat` | Each gets type and method names, or a stated failure |
````

### Original lines 28-30

````markdown
These five sessions never received the gap-pass message (it was paused by
the app), so their gaps come from each batch's own verification lines rather
than a ledger:
````

### Original lines 34-37

````markdown
| OG5 | [CULT_REST](BATCH_CULT_REST.md) | Four titles not read: Dao of the Endless Sky, Nivrael, Text Cultivation, The Left Hand refers to the moon. Idle Xanxia combat formulas and Quest of Qinghe's battle engine only partly read. |
| OG6 | [LIFE_A](BATCH_LIFE_A.md) | Incremortal routine unlock not traced. Lifeidle event prose, Lowmoor sea nodes, Town Tycoon fishing and ski, God of Ashes event prose unread. Beggar's Life code blocked by OG2. |
| OG7 | [POTION](BATCH_POTION.md) | Method bodies of the Godot builds (CHROMA, Alchemyst Apprentice), which should be readable with OG1. Hidden Grimoire logic is minified Dart, so only constants were read. Unity builds (Herbarium, Pestis Apotheca, Potion Seller) are names and assets only. |
| OG8 | [PROCGEN](BATCH_PROCGEN.md) | Eigengrau factions and plot hooks. Talk of the Town `person.py` and its knowledge model beyond `mind.py`. Nothing Beside Remains text not recovered (no type trees). |
````

### Original lines 44-46

````markdown
| OG10 | [BROAD](BATCH_BROAD.md) | Medieval Merchant Simulator: trace where a hired spouse's pay comes from (payroll code located, pay source not traced). |
| OG11 | [MAGIC](BATCH_MAGIC.md) | Tasks of the Spell Looper: the key from a rune combo to its consequence line (needs OG3). |
| OG12 | [EXPLORE](BATCH_EXPLORE.md) | Far Beyond The Mountain, the original game, not yet located. |
````

### Original lines 94-96

````markdown
From the [YAIR gap check](YAIR_GAP_CHECK.md): 74 claims, 33 confirmed gaps,
25 partial, 11 already exist, 5 unclear. The most consequential confirmed
gaps:
````

### Original lines 100-104

````markdown
| OG14 | No chronic conditions or isolation effects | IM30/IM31 flat-gauge checklist; EMERGENT (BROAD) | **built** (`aging_contact.js`, panel and domain; 1536 and companion contacts unchecked); long-life run IM31/IM53 open |
| OG15 | The heir is a single successor with no inheritance law or parentage traits | IM3, IM8; Kinfolks, My Cultivation Sect | **built** (inheritance law, heirlooms; wired per the lives record); orphan, grief and came-of-age events open (IM47) |
| OG16 | No standing routines or unlocks from completion counts | Incremortal (LIFE_A) | **built** (standing routines in `household_fortunes_*`) |
| OG17 | No credit, insurance, market memory or faction tiers | IM32; Silver Way, The Debt Ledger (ECONOMY) | **built** (`economy_standing_*`: tiers, credit, insurance, price memory); carry rows for it open (IM37, IM46) |
| OG18 | No cross-life discovery codex | IM21; Hidden Grimoire, Cycle of the First Dawn | **built** (`discovery_codex.js`, carried as any life) |
````

### Original lines 118-118

````markdown
They are open as small per-world dials, tracked in
````

### Original lines 123-127

````markdown
| OG19 | Orphan, grief and came-of-age events | open | IM39, IM47 |
| OG20 | Genetics and companion wishes | open (companion bond rite IM33 built) | none yet |
| OG21 | Diplomacy and schism | open | IM41, IM49 |
| OG22 | Skill floor | open | IM40, IM48 |
| OG23 | Spatial homes (authored, not procedural) | open | IM43, IM50 |
````

## docs/worlds/IMPLEMENTATION_MAP_ABILITIES_PROCEDURES_SUBTLE_INTEGRATIONS_2026-10-23.md

Pre-R2 SHA-256: `f518fa95a1aa52d8e043fe14a9aac69cf71bc1ea569e149b611a084500dab618`.

### Original lines 26-26

````markdown
Not yet included (pending when this file was resumed): the A Soldier's Life, TTKS and Regressor's Tale passes; classes may gain members when they land. The eight pass docs above plus the Paradise gate catalog had landed when this file was written. Finding codes repeat across docs (every pass has an F1), so every locator below carries its prefix, for example LOTM F10 or RI F1. Queue codes Q1-Q6 are the LOTM build queue; this file uses C (mechanism class), I (integration), B (build step), PC (pass-versus-code contradiction), OQ (open question) and A (action) so none collide.
````

### Original lines 32-32

````markdown
Across nine worlds the passes describe about nineteen recurring shapes. Each shape has one shared verb, one row a world supplies, and one owning seam. The shared layer owns identity, custody, transactions, knowledge, clocks and save (AR12); the world owns nouns, numbers and laws (WA5). A class below merges worlds by verb and row shape, never by outcome, so a Gu auction and a Dokkaebi auction share the bidding verb and keep their own steps, fees, leaks and refund rules as data.
````

### Original lines 36-36

````markdown
Git and file state as read on 2026-10-23 from `git status`, `git log` and file headers. A test count proves its own slice only (portable rules).
````

### Original lines 38-38

````markdown
| State | What | Evidence |
````

### Original lines 40-43

````markdown
| **Built (committed, in `master`)** | `src/ascension_paths.js` (path descriptor, `pathView`), `src/book_world_lotm_path.js` Seer pathway and digestion-by-acting to Sequence 8, `src/reveal_chain.js`, `src/rules.js`, `src/check_contract.js`, `src/domain_registry.js`, `src/simulation_contracts.js`, `src/native_trade_transaction.js`, `src/trade.js`, MOL pack under `src/world_packs/book_mol_pack.js`, world-pack lint and registry | `git log` shows `b6e9332dc` for the ascension and Seer files; the others are tracked and unmodified in `git status` |
| **Built and played, uncommitted** | LOTM Q1 Corpse Collector pathway. Its checkpoint (`docs/gm/dispatch/lotm-q1-2026-10-23/CHECKPOINT.md`) reports 22 engine tests passing, `check:arch` passing and a browser run at 1920x1080 on a fresh origin including a reload mid-job; the 1366x768 layout, the Seer ladder replayed in browser, ability use in an encounter and a hand-edited two-pathway save were not exercised. Files: modified `src/book_world_lotm_{actions,content,envelope,host,ids,path,state,ui}.js` and untracked `tests/lotm_corpse_collector.test.js`. Another session owns it; this file touched none of it | `git status`: M on the LOTM files, `??` on the test; test and browser results are the checkpoint's, not re-run here. Q2 districts is in flight in the same files |
| **Source-implemented, uncommitted, leaf only** | `src/progression_gates.js` (`defineGate`, `evaluateGate`), `src/obligations_ledger.js`, `src/vow_rules.js`, `src/carry_ledger.js`, `src/economy_standing.js`, `economy_standing_domain.js`, `economy_standing_ui.js`, `tests/progression_gates.test.js` | all `??` in `git status`. `vow_rules.js` and `obligations_ledger.js` state in their own headers that they are not wired into save or gameplay; `economy_standing.js` imports the obligations ledger and `household_fortunes_domain.js` imports `collectObligations`, so some wiring exists but persistence was not verified here |
| **Documented only** | every class C4, C6, C10 (as a mechanism), C12, C13, C14 (as a conversion registry), C15 (as a pack record kind), C18 (as a document record), plus the shared forms of C2, C3, C5, C7, C8, C9, C11, C16, C17, C19; all pass findings; the whole HP, RI, ORV, SS, COI, RP runtime; MOL's source loop | grep of `src` finds no auction module, no jurisdiction resolver, no clearance or group rule, no loss-of-control mechanism beyond strings and text fields, no hearing procedure |
````

### Original lines 45-45

````markdown
Nothing in this file was run, built or played. Anything above labelled built means committed, not browser-verified by this pass (WA19).
````

### Original lines 52-52

````markdown
| `src/book_world_lotm_{ids,actions,content,state,envelope,host,ui,path,domain}.js` | One branch, authored commands via a local `cmd()` helper, flags in actor facts, resources for acting counts, `state.lotm` fixed at schema 1 (queue gate) | Second pathway was added by copying commands, flags, validator lines and view branches under a `cc.` prefix; no pathway factory |
````

### Original lines 59-60

````markdown
| `src/native_trade_transaction.js`, `trade.js`, `market_saturation.js`, `economy_domain.js`, `economy_standing*.js` | Quote fingerprint and synchronous revalidation; vendor trade with host callbacks; standing tiers, loans, insurance, price memory, rumour draw and view (untracked) | No auction, no stock refresh with banked attempts, no bound-goods flag, no multi-currency conversion by status |
| `src/obligations_ledger.js` | Record `{kind coin/favor/grievance/duty, debtor, creditor, amount, why, source, since, eases, carries}`, adapters from household, career, heirs | Header: not wired to save or gameplay; no vouching or sponsor kind |
````

### Original lines 67-67

````markdown
| `src/vow_rules.js` | Data-driven vows, bonus while kept, scar when broken, plain JSON slice `progression.vows@1` | Unwired; scar is the nearest "pressure" shape for loss of control |
````

### Original lines 90-90

````markdown
| Owning seam | Exists: `ascension_paths.js` `definePath`/`pathView` (committed). Missing: crossing-to-gate link (two evaluators exist: `pathView.met` and `evaluateGate`, against GTR9), attempts, examiner, cadence, and a pathway factory. LOTM currently copies a pathway by hand (see PC1). |
````

### Original lines 114-114

````markdown
| Owning seam | Rights: `progression_gates.js` `defineGate` kind credential or social with `closes` revocable (exists, untracked). Duties: `obligations_ledger.js` kind duty (exists, unwired). Titles live in `state.simulation.titles` (`simulation_contracts.js`). Missing: the bundle record, attempt counter, duty trigger and leave terms. |
````

### Original lines 290-290

````markdown
| Owning seam | Missing as a mechanism. Today: strings in LOTM files and the path `failure` text. Nearest shapes: `vow_rules.js` scar pressure, `breakthrough_trial` (cited there), `check_contract.js`. |
````

### Original lines 295-296

````markdown
| Smallest slice and test | A "wrong-pathway potion" cause row for the existing Seer and Corpse Collector ladders. Test: each listed cause adds pressure; an ordinary day adds none. |
| Unlocks | Completes Q1 honestly; precondition for Q6; COI Demon rows; ORV Story limit. |
````

### Original lines 416-416

````markdown
| Owning seam | `obligations_ledger.js` and `economy_standing.js` with its domain (all untracked). Missing: persistence verification, vouching, credit as a venue gate fact. |
````

### Original lines 521-522

````markdown
Respecting the LOTM queue (`docs/gm/dispatch/lotm-lives-regions-2026-10-23/QUEUE.md`). Q1 is done per its checkpoint (uncommitted) and Q2 districts is in flight in the LOTM files in another session; this order starts after them and defers to their ownership. Each step names classes it builds once and later steps reuse. Every step carries the queue gates: ownership check, additive save fields, a focused test file, a played journey at 1920x1080, no commit without Weibao's yes. Rank is a proposal, not a selection.

````

### Original lines 525-528

````markdown
| B1 | Q1 second pathway (done per checkpoint, uncommitted) | C1 second consumer | Q6, RI, Paradise | Proved that a second ladder is a descriptor; the commands were still copied by hand |
| B2 | Extraction E1: per-pathway command-set factory (structural move, WA17); the checkpoint names it as the next refactor and the two `request_assessment` commands as the merge point for a data-driven assessor row | C1 | Q6 and any later pathway | Do this before Q6 and coordinate with Q2, which is editing the same LOTM files: the second pathway was copied by hand into actions, state validator and view (PC1); a third copy triples the drift. Prove with the same journey before and after (AR9) |
| B3 | Cause rows for loss of control | C10 | Q6, COI, ORV | The queue says loss of control must stay tied to stated causes; a data row stops a third pathway bypassing it (I5) |
| B4 | Q2 districts | C8 | Q4, Q5, C13 forums, COI | One region owner; jurisdiction split by faith feeds clearance and who responds |
````

### Original lines 549-550

````markdown
| PC1 | LOTM queue: loss of control must stay tied to its stated causes, and region and life rows should be data over shared verbs (WPR31) | `book_world_lotm_state.js` rejects a save holding both pathways, which turns a stated cause of loss of control into a wall; actions, state asserts and the path view carry parallel `cc.` copies of the Seer rows | Q1's checkpoint records the refusal as deliberate and engine-tested. Default: keep Hale withholding the second dose as an institutional rule (Q1 does), add cause rows at B3, and replace the validator wall with a consequence row at B2/B3. A change of this kind needs its own lane |
| PC2 | LOTM X3: a senior deacon examines (F9) | The Seer and Corpse Collector `recognition` crossings name Warden Hale | Authored stand-in; keep the label authored and make the examiner a row (C1) |
````

### Original lines 552-552

````markdown
| PC4 | LOTM X3 is warden versus deacon; the church wait is three years (F18) | The Q1 checkpoint and a code comment on `LOTM_CC_ACTS` cite "source note X3" for a recruit waiting about a year | Probably a different X3 (the checkpoint cites its own deep-dive note); the LOTM pass shows three years. Check before repeating either number |
````

### Original lines 561-561

````markdown
Unverified by this pass: what the Paradise runtime means by `tier` in `book_world_paradise_*.js` (grep shows tier fields in the host, state, carriers and actions files; it was not opened to see whether tier is a bundle or a number).
````

### Original lines 568-568

````markdown
| OQ2 | When is the pathway factory extracted? | After Q1 lands and before Q6, as a structural move with the same journey before and after (AR9) |
````

### Original lines 570-570

````markdown
| OQ4 | How is switching pathways modelled? | Keep Hale's dose withholding for the slice, add a "wrong-pathway potion" cause row at B3, and let a later lane decide the validator change |
````

### Original lines 586-586

````markdown
1. Q1 is played but uncommitted; the Corpse Collector pathway proves the descriptor, not command-level generality, until B2 shows the factory.
````

### Original lines 596-596

````markdown
| A1: Pathway factory design note | sonnet | S | A one-page row shape that regenerates today's Seer and Corpse Collector commands identically |
````

### Original lines 619-619

````markdown
Highest state reached: drafted. Not rules-reconciled in detail with DOMAIN_RULES (PIR, ECR, SLR, CBR texts were not reopened), not built, not browser-verified, not director-accepted. Source facts come from the pass docs, not the novels; no novel was read. The code survey was read-only and partial: `expansion_engine.js`, `trade.js` and the Paradise runtime were opened only as far as headers, export lists and greps. Nothing was run, built or committed.
````
