```markdown
You are conducting a bounded research-and-adoption audit for the local YAIRPG repository. Complete the audit and leave decision-ready evidence and follow-up packets. Do not implement gameplay, install tools, acquire games, or dispatch follow-on work.

## Repository and authority

Work in:

`/Users/weiwei/code/yet-another-idle-rpg`

Before drawing conclusions:

1. Read `AGENTS.md` and `PROJECT.md`.
2. Identify the current document owners, active research owners, relevant implementation owners, assignments, checkpoints, `COVERAGE` / `FINDINGS` records, locators, and actual YAIR source needed for this audit.
3. Treat current accepted decisions and live owners as authoritative over old milestones, aggregate summaries, candidate lists, and historical process state.
4. Preserve concurrent owners and dirty edits.

This is a personal single-player browser idle RPG expanding toward distinct worlds, useful ordinary skills, lived character lives, materials/crafting, people and institutions, and remembered consequences. The user remains the creative director.

The sending chat separately maintains the prompt-roundtrip workflow/skill and shared skills repository. That maintenance is outside this audit. Do not inspect, repair, document, or take ownership of it.

## Supplied context: verify consequential claims during execution

The following is context supplied to this fresh chat, not evidence you have personally verified. Use it to orient the audit, then check consequential claims against the repository, retained artifacts, or cited upstream sources before relying on them.

Starting documents:

- `docs/research/GAME_AUDIT_COVERAGE_RECONCILIATION_2026-10-13.md`
  - Reports that all 21 originally named titles have some research coverage, except that Streets of Rogue has framework/mod fallback rather than original-gameplay coverage.
  - Reports a scan of 60 direct report directories, 48 game-focused after exclusions.
  - Those are routing counts, not 48 complete whole-game audits.
  - Reports repository-bank dispositions for 30 repository rows plus nine related works, with overlap.

- `docs/research/REVERSE_ENGINEERING_TOOL_FIT_2026-10-13.md`
  - Recommends retaining existing exports, considering a bounded REA native-analysis trial, and selectively applying useful guide practices.
  - Reports upstream `morluto/rea` inspected at revision `bb540826d65316c164d2de8ba4ef10f81a8ad073`.
  - Reports that REA exposes CLI/MCP access to existing providers and that its Ghidra launcher performs a fresh ephemeral import.
  - Preservation of YAIR's custom Factorio repairs through that path was not established.
  - No REA install or trial was performed.

These documents reconcile saved records. They do not establish current private-corpus hashes, current installations or processes, current upstream state, or gameplay acceptance.

### Original requested titles

Caves of Qud; DCSS; Cataclysm DDA; NetHack; RimWorld; Tales of Maj'Eyal; Elin; Idling to Rule the Gods; Rogue Legacy; Streets of Rogue; KeeperRL; Amazing Cultivation Simulator; Melvor Idle; Orb of Creation; Your Chronicle; Crush Crush; Cult of the Lamb; Factorio; Dwarf Fortress; Book of Hours; Oxygen Not Included.

### Known later coverage

Noita; Kenshi; CK3; Wildermyth; Cultist Simulator; King of Dragon Pass; Six Ages 2; Battle Brothers; Tale of Immortal; Theory of Magic; Bitburner; Progress Knight; Idle Loops; Evolve; Kill the Lich; Ani Idle; Endless Ascent; Upload Labs; Sucker for Love; Increlution; Sunless Sea / Sunless Skies; Planescape; Citizen Sleeper 1/2; Disco Elysium; Vagrus; and newer-game demos.

Do not treat either list as exhaustive. Discover additional relevant entries from current owners, assignments, indexes, dossiers, checkpoints, and locators. Deduplicate aliases, series groupings, repository-bank entries, and overlapping inventories rather than inflating counts.

### Supplied qualifications to check

Verify these where they affect a conclusion, priority, or disposition:

- Streets of Rogue original gameplay remains `0/5`; Eldyn is only a local Electron wrapper and lacks the remote gameplay/server logic needed to close original-gameplay coverage.
- Erenshor and The Matchless Kungfu await source payloads.
- Soulash 2, Achra, and Magic Research 2 rely on demos or older snapshots rather than full current retail source.
- Factorio retains initial native exports for both architectures, but narrow repairs, reconciliation, and the broader native-use objective remain unfinished in its saved checkpoint. Historical worker/process status is not current process status.
- Amazing Cultivation Simulator has five saved deeper priorities, and the cross-game depth queue contains further questions. A completed finite pass does not automatically close those broader requests.
- Dwarf Fortress, Oxygen Not Included, and Kenshi have selected readable-data / managed / editor coverage while native systems remain comparatively opaque.
- Citizen Sleeper numerical graphs and Upload Labs automation payloads remain unresolved.
- The October 9 library aggregate is stale. Individual dossiers now reportedly contain installed-source audits for Sucker for Love, Ani Idle, Endless Ascent, Upload Labs, and Kill the Lich.
- Eldyn's wrapper pass does not itself close Streets of Rogue gameplay coverage.
- Roadwarden, 80 Days, and Spiritfarer lacked direct source dossiers in the prior scan.
- Bannerlord, Stellaris, Terra Invicta, and Endless Legend 2 were noted for later consideration outside that lane.

Keep wishlist/candidate titles distinct from assigned unfinished audits.

## Audit objective

Determine:

1. What the existing reference-game research can still usefully contribute to YAIRPG.
2. What remains meaningfully unaudited or insufficiently evidenced.
3. Which existing findings are implemented, unverified, planned, obsolete, duplicated, or genuinely unused.
4. Whether REA, other reverse-engineering tools, source acquisition, or a different evidence route would materially improve the next source pass.
5. What research and adaptation work should happen next, without treating recommendations as accepted design decisions or implementation authorization.

Complete the audit itself, not merely a plan for an audit.

## Work

### A. Reconcile the actual research corpus

Reconstruct the requested and later-added scope from live repository evidence:

- assignments;
- current owners;
- checkpoints;
- `COVERAGE` / `FINDINGS`;
- indexes and locators;
- repository-bank records;
- individual dossiers;
- retained source/export records;
- relevant current research documents.

A complete file-by-file reread is not required. Read enough to support each consequential disposition, and expand into underlying records when:

- summaries disagree;
- a status materially affects prioritization;
- a supposedly completed pass may hide an unresolved request;
- a dossier's selected packets appear to have been mistaken for its full findings;
- provenance or source version matters;
- an adoption claim needs checking against current YAIR source.

For each relevant game or repository, assign a supported research disposition such as:

- screened;
- acquired;
- targeted-reviewed;
- partial / opaque;
- payload-blocked;
- deferred.

Do not collapse fundamentally different evidence dimensions into one status. Separately record, where applicable:

- provenance and export/source coverage;
- semantic reading or system understanding;
- runtime/gameplay proof;
- YAIR implementation/adoption state.

Do not count overlapping inventories as additional unique games.

### B. Audit findings against current YAIR adoption

Do not equate "researched" with "used."

For consequential findings, compare the research with current YAIR source and the relevant live implementation/design owners.

Trace mechanics far enough to understand meaningful player consequences. Where applicable, follow:

- prerequisite or unlock;
- resource/input or spending;
- mutation/state change;
- timing or accumulation;
- failure, cancellation, or stop behavior;
- retained aftermath or remembered consequence;
- at least one downstream consumer.

Look for both large systems and small interactions/details that may improve coherence, feedback, pacing, ordinary-life texture, failure handling, or world consequence.

Classify candidate findings as:

- implemented and evidenced;
- implemented but not sufficiently verified;
- already planned/owned;
- obsolete or superseded;
- duplicate of another accepted direction;
- newly justified gap/opportunity.

Do not infer adoption merely from similar naming. Verify consequential implementation claims with exact paths, symbols, owner records, or other precise locators.

Read beyond each dossier's highlighted packets when needed. Existing packets are selections, not necessarily the complete finding set or creative horizon.

### C. Identify meaningful remaining audit gaps

Distinguish at least these kinds of incompleteness:

1. No useful source or gameplay evidence.
2. Source exists but has not received semantic review.
3. Semantic understanding exists but important mechanics remain opaque.
4. Static evidence exists but runtime behavior is still unproven.
5. Research exists but has not been checked against YAIR's current implementation.
6. A finite assigned pass completed, but a broader explicitly recorded research request remains open.
7. The evidence exists but provenance/version/currentness is inadequate for a decision.

For each consequential open gap, identify a plausible evidence route. Do not claim that every opaque proprietary subsystem needs reverse engineering.

### D. Evaluate REA and alternative evidence routes against named gaps

Evaluate tools only against concrete unanswered questions from this audit.

Default preference order:

1. existing retained private exports, indexes, callers, xrefs, repaired artifacts, and checkpoints;
2. readable data/configuration/content;
3. open-source implementations or official source;
4. existing direct-source routes;
5. existing ILSpy / Cpp2IL / Ghidra artifacts and workflows;
6. narrowly scoped acquisition or repair when justified;
7. a bounded new-tool trial only when it answers a question the existing routes do not answer efficiently.

For REA specifically:

- verify current upstream claims that affect the recommendation using official upstream docs/source;
- compare it with the repository's actual ILSpy, Cpp2IL, Ghidra, direct-source, and retained-export workflows;
- determine whether its value is primarily workflow/automation, provider access, analysis quality, preservation, or something else;
- explicitly consider whether a fresh-import workflow would discard or bypass repaired/custom analysis state;
- do not recommend broad re-exporting or migration merely because REA exists.

Use `reference-scout` for a concrete comparison if the repository's applicable instructions make it useful, but do not turn that into a general reconnaissance exercise.

For every named research/tool gap, recommend one of:

- read/reuse existing evidence;
- narrowly repair/reconcile existing evidence;
- acquire a missing permitted source later;
- propose a small bounded trial;
- defer because the expected information value does not justify its cost.

A proposed tool trial must specify:

- exact unanswered question;
- exact input/artifact to test;
- why existing routes are insufficient;
- what evidence the trial must produce;
- preservation requirements;
- pass / fail / unknown gate;
- what decision follows from each outcome.

Do not install or run a new tool during this audit.

### E. Rank research and adaptation separately

Produce two rankings rather than mixing them:

1. **Next research targets**
2. **Original YAIR adaptation opportunities**

Evaluate candidates using:

- likely player value;
- evidence confidence;
- remaining uncertainty;
- effort and resource cost;
- duplication with existing work;
- dependencies;
- reversibility where relevant.

Retain substantive lower-ranked findings in the supporting inventory instead of discarding them.

Surface no more than five immediate user decisions/actions in the executive portion. The larger inventory may contain additional ranked or deferred candidates.

Research findings and adaptation proposals remain proposals. They are not accepted design decisions.

## Evidence standard

A consequential statement is one that changes:

- a game's audit status;
- whether a request is considered finished;
- whether YAIR already implements a finding;
- whether a source/tool is needed;
- a priority or ranking;
- a recommended acquisition/trial;
- a claim about opaque or missing behavior.

Support consequential local claims with the narrowest practical evidence:

- exact local path;
- symbol/function/class where applicable;
- locator/checkpoint/assignment ID;
- source/export revision or provenance when relevant;
- owner/status record where relevant.

For changing public tool claims, cite the official upstream source/docs and the inspected revision/date where practical.

Clearly distinguish:

- **verified during this audit**;
- **reported by existing repository records but not independently reverified here**;
- **supplied starting context still not verified**;
- **inference/proposal**;
- **unknown or blocked**.

Do not manufacture certainty to complete a table.

Historical "worker running," "process active," "installed," or similar status is not evidence of current process state unless checked now. Do not restart historical work merely to verify that it is no longer running.

## Outputs

Reuse existing document locations, IDs, owners, and evidence-gated-handoff conventions where they exist rather than creating parallel systems.

Save:

### 1. Concise audit report

It should make clear:

- what corpus was actually reconciled;
- major corrections to stale or misleading aggregate status;
- strongest unused/underused findings;
- consequential remaining gaps;
- tool-fit conclusion, including REA;
- separate research and adaptation rankings;
- no more than five immediate user decisions/actions;
- what was not checked and why.

### 2. Supporting coverage/opportunity inventory

The inventory should preserve enough detail to audit the audit. For relevant entries include, as applicable:

- canonical game/repository identity;
- requested/later-added/wishlist status;
- owner or assignment;
- evidence/provenance;
- research disposition;
- provenance/export coverage;
- semantic-review state;
- runtime-proof state;
- YAIR adoption state;
- meaningful findings/opportunities;
- unresolved questions;
- evidence route;
- dependencies/blockers;
- next disposition;
- precise locators.

Do not invent a universal completion percentage.

### 3. Strongest bounded follow-up packets

Create only packets justified by the audit.

Each packet must state:

- intended outcome;
- source/input bindings;
- dependencies;
- bounded scope;
- expected cost/resource burden;
- relevant failure/stop cases;
- write ownership;
- explicit exclusions;
- observable acceptance gate.

For future gameplay/adaptation proposals, specify fresh-origin rebuilt journeys rather than assuming existing saves, and include save/reload/import coverage where relevant. Mark these as **specified, not run**.

For research or tool trials, state the exact question, evidence target, and pass / fail / unknown gate.

Packets are handoff specifications only. Do not execute them or treat them as authorization.

## Protection and authorization boundaries

Authorized:

- read-only inspection of this repository;
- inspection of relevant existing private source/export artifacts already available to the project;
- public upstream research needed to verify tool/repository claims;
- edits to audit/research documentation necessary to record this audit.

Not authorized:

- gameplay or build implementation;
- changing game code;
- downloading or installing games or tools;
- purchases;
- launching or uninstalling games;
- accessing or modifying personal saves;
- source-library mutation;
- commits or pushes;
- publication;
- starting new chats;
- autonomous follow-on implementation;
- resuming unrelated paused tasks.

Do not use subagents unless the user or applicable repository instructions separately authorize them.

Never put raw proprietary code or substantial proprietary prose into public Git or public-facing reports.

### World-secret handling

World secrets remain sealed.

You may inspect secret-bearing material only when necessary for this audit, but chat output and ordinary/public research docs may expose only non-secret metadata such as:

- IDs;
- routes;
- ownership;
- presence/absence;
- status.

Do not reveal secret truths, solutions, hidden narrative facts, or secret-bearing payloads.

Do not resume the paused full-world task.

## Corrections during the audit

If repository evidence disproves or materially qualifies a supplied status, correct the affected audit/research documentation only when:

- the evidence is strong enough;
- the document is within this audit's ownership;
- the change does not collide with another active owner.

Otherwise record the contradiction and route it to the current owner.

Do not turn a research finding into an accepted gameplay decision.

## Completion and stopping gate

The audit is complete when all of the following are true:

1. The original requested corpus and relevant later-added/assigned entries have supported dispositions, with wishlist/deferred candidates kept distinct.
2. Material stale aggregate claims have been reconciled against current live owners and records where they affect decisions.
3. The strongest existing findings have been checked against current YAIR adoption rather than merely restated.
4. Consequential unfinished gaps have an evidence route, blocker, or justified defer decision.
5. REA and competing evidence routes have been evaluated against specific gaps rather than generically.
6. Research priorities and YAIR adaptation opportunities are ranked separately.
7. The user has no more than five immediate decision-ready actions.
8. The supporting inventory preserves substantive lower-priority findings and unresolved questions.
9. Any follow-up packet has an observable evidence/acceptance gate and does not authorize its own execution.
10. The report states what was checked, what remains unknown, and the limits of the audit.

Stop there.

Completion does **not** require:

- reverse engineering every proprietary function;
- eliminating every opaque subsystem;
- completing implementation;
- installing or trialing REA;
- acquiring currently missing payloads;
- exhausting every possible reference game;
- proving historical process state;
- creating a universal completion percentage.

If further inspection would only add breadth without changing a disposition, evidence route, ranking, or user decision, record the limit and stop.

At the end, summarize the audit artifacts changed, the strongest evidence-backed conclusions, the remaining material unknowns, and the user decisions that now need direction. Do not begin any follow-up packet.
```

Material changes: I reorganized the prompt around a clearer authority hierarchy, explicitly separated supplied context from execution-time evidence, and made the audit's evidence model much more precise. The largest change is the stopping gate: it now defines both what must be true before the audit is complete and what does **not** need to be completed, which should reduce endless source exploration.

I also separated research dispositions, evidence dimensions, and YAIR adoption state so "researched," "understood," "runtime-proven," and "implemented" cannot be conflated. The REA section is now gap-driven rather than tool-driven, with a mandatory question/input/evidence/pass-fail structure for any proposed trial. Finally, I consolidated repeated authorization language, strengthened the stale-status and ownership rules, preserved the five-decision cap, and explicitly excluded the sending chat's prompt-roundtrip/shared-skill maintenance from the recipient's responsibilities.
