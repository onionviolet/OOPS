# AI playtest harness considerations (2026-10-20)

Palette, not spec. Every row is a proposal unless it says DONE; nothing here is
an accepted decision (AD32). Codes PT1 onward are stable; later rounds append.

Authority: Weibao's questions on 2026-10-20: "how can each play through identify
gaps and more? can we tune/have a local ai play through the game? Would we need
a harness / other stuff and more?" and the same day's follow-up: "Can it
consider taking UI and more? What harness should we use? Local AI versions?
Missing stuff, other little details and more? Having a checklist of to dos?"
(relayed by the coordinating session). Builds on the Electron host round
([EL16 game MCP server, EL40 bot playtests](ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md#electron-host-2026-10-20-el)).
Rules applied: AR7 and AR8 ([architecture rules](ARCHITECTURE_RULES.md)), AD32,
AD36, AU1-AU15 ([agent usage](AGENT_USAGE_RULES.md)), sealed secrets (AGENTS.md),
Weibao's no-visible-windows rule.

## Short answer

- **Yes, a harness, and the first slice exists.** `scripts/playtest/run.mjs`
  plays a real route in headless Chrome with dev-stepped time, records a trace
  and runs five gap detectors. It passed on the current build and caught each of
  five injected faults with the matching detector (PT45), including one UI
  check at 1920x1080 (PT46).
- **A playthrough finds gaps through detectors, not through watching.** Each
  detector is a question asked of every run: did anything throw, did a control
  do nothing, did a save survive a reload, did the same seed give the same game,
  was any content never reached, did pacing stall. The bot only has to play;
  the detectors do the judging.
- **A local AI can play.** This Mac (Apple M5 Pro, 64 GB unified memory) already
  has Ollama with 27B to 31B models, which is the right size class for a
  persona that picks actions and writes "this confused me" notes. It is slower
  and less reliable than Claude at long plans, so it fits overnight wandering
  and legibility notes, while scripted bots carry the regression gates (PT14).
- **Harness to use:** Playwright (already in the repo) as the runner for every
  policy, the game MCP server (EL16) as the action and observation layer for
  model players, and a plain tool loop (or the Claude Agent SDK) as the model
  driver (PT54).
- **The single to-do list is the [checklist](#harness-checklist) at the end.**
- **No shell change is needed.** Playthroughs run headless (Chrome or the Node
  runner) or in the hidden Electron host. Nothing opens a window (PT43).

## Harness layers

| Code | Layer | Default | Dial | Reason |
|---|---|---|---|---|
| PT1 | **One loop, swappable parts.** observe, choose, act, record, detect, repeat; report at the end | DONE in the slice as a generator policy plus a detector pass | A policy is any function from observation to the next op | Scripted, random and LLM policies then share every detector and trace format |
| PT2 | **Runner.** Where the game runs | Headless Chrome on a private localhost port with `?test_hooks=1` (`simulationTestHooks` pause, resume, snapshot, project, tickrate, saveStatus; `advanceTicks`). DONE | Node full-game runner (`scripts/headless/runner.mjs`, 3-10x faster, no layout); hidden Electron host (`YAIRPG_HIDDEN=1`, own temp userData) for host-specific behavior; Node `advanceSimulation` for expansion systems only (simfuzz, perf gate) | Chrome is the real target and catches layout and CSS-visibility bugs; Node is for volume; Electron only when the host itself is under test |
| PT3 | **Fresh origin per run.** Every run gets its own browser context and seeded storage, never Weibao's profile or saves | DONE (new context per open, temp bundle dir, private port) | Fixture saves from `tests/fixtures/perf/` for mid-game starts | AGENTS safety: user saves stay private and untouched |
| PT4 | **Recorder.** A JSON trace of op, target, wall ms, game minute, location and observation hashes | DONE (`trace.json`) | Add projection excerpts per op once PT6 exists; keep full saves only in the temp out dir | Raw snapshots hold sealed truth; hashes prove sameness without revealing contents |
| PT5 | **Observation, two tiers.** Detectors may read truth (snapshots, saves) because they never show it; policies read only observer-safe projections (AR8) and visible UI | DONE for detectors; policy tier waits on PT36 | A debug-truth tier for scripted bots only, behind an explicit flag | An LLM that reads a snapshot can repeat a sealed secret in its notes. A detector that compares hashes cannot |
| PT6 | **Action space.** Commands with quote and revalidate (AR7) for agents; DOM clicks for UI coverage | DOM clicks DONE (same selectors a player clicks) | `HeadlessGame.clickables()` already lists every visible enabled control: a ready random-bot menu | Clicking proves the UI path works; commands let an agent act in game terms without brittle selectors |
| PT7 | **Time.** Dev-stepped ticks, chunked to 60 | DONE | `YAIRPG_REAL_TIMERS=1`-style natural pace for a final evidence run | Stepping makes hours of play take seconds and keeps runs deterministic |
| PT8 | **Seeds and wall clock pinned.** mulberry32 `Math.random`, seeded crypto, frozen `Date` | DONE (copied from `browser_parity.mjs`) | Seed sweeps (PT31) | Determinism is a detector only if the runner removes ambient chance |
| PT9 | **Report.** `REPORT.md` with a verdict per detector, findings, notes and save hashes | DONE | A rolling `docs/audits/playtest/` index for overnight batches; traces stay out of git | Weibao reads one table; agents read the trace |

## Policies

| Code | Policy | Default | Dial | Reason |
|---|---|---|---|---|
| PT10 | **Scripted routes** as the regression backbone | DONE: reuses `scripts/headless/village_route.mjs` (elder greeting, craftsman, axe, woodcutting, coal, smelting) so Chrome, Node and the bot share one route | One route per shipped slice; each slice's acceptance route becomes a playtest route | Cheap, exact, and a failure names the step |
| PT11 | **Scripted bot with detectors** | DONE (`scripts/playtest/run.mjs`) | `--seed`, `--runs`, `--inject` | Turns every acceptance route into gap evidence for free |
| PT12 | **Random and coverage bots.** Pick from `clickables()` with a seeded chooser; bias toward controls and locations not yet seen | Proposal: Node runner first (speed), Chrome sample nightly | Weight by novelty, avoid known traps (the Village patrol tooltip throw) | Finds the clicks no script thought of; coverage bias stops it from looping on one menu |
| PT13 | **LLM agents (Claude) with personas** | Proposal, after PT36: explorer (reach new places), min-maxer (fastest power), idler (set and forget, check back), confused newcomer (reads only on-screen text, says what is unclear) | Persona prompt, step budget, how often it may write notes | Personas find different gaps: the explorer finds dead ends, the newcomer finds legibility gaps, the idler finds offline and pacing gaps |
| PT14 | **Local models (Ollama on this Mac)** | Proposal: 27B to 31B class (already installed: `qwen3.8:27b`, `gemma4:31b-mlx`) for persona play and notes; scripted bots for gates | Smaller 7B to 14B for fast action picking; the q8 27B when quality matters more than speed | See PT64 for measured speed. Local runs cost no allowance (AU7) and can run overnight in the background |
| PT15 | **What a local model can and cannot judge** | Can: pick a plausible next action from a short projection, notice "I do not know what to do now", flag unexplained jargon, summarize a session. Cannot reliably: plan long multi-step goals, judge balance numbers, tell a bug from a design choice without a detector, keep secrets it was shown (so it is shown none, PT5) | Escalate a named confusing moment to Claude rather than the whole run | Model output is a note to triage, never a finding by itself |
| PT16 | **Hybrid driver** | Proposal: scripted or random bot plays; a model is consulted only at decision points or every N minutes to choose a goal and write a note | Consult rate | Keeps model calls (and tokens) proportional to judgment, not to clicks |

## Gap detectors

Each detector is a function over the trace, saves and page events. Fail-level
findings fail the run; notes are reported and never fail it.

| Code | Detector | Default | Dial | Reason |
|---|---|---|---|---|
| PT17 | **Errors.** `pageerror` and `console.error`, tagged with the running op | DONE | Allowlist of known errors with an owner and date, never silent | The cheapest and highest-yield gap signal |
| PT18 | **Stuck.** Dead end (target never appears), dead click (neither screen text nor durable state changed), no progress (6 ops without a durable state change) | DONE | Streak length; per-route expected idle stretches | Dev stepping always moves the clock, so "time passed" proves nothing; the state hash excludes the clock |
| PT19 | **Softlocks.** No enabled control leads anywhere new and no timer is running | Proposal, needs `clickables()` plus PT36 action lists | How long to wait for a timer | A random bot can reach states a script never does |
| PT20 | **Save round trip.** Save, load in a fresh context, save again (B), load and save again (C). Fail on lost or changed values or B differs from C; note added fields | DONE | Every N game minutes on long runs; Export/Import path too (`exportFile`/`importFile` in the Node runner) | The first-load normalization on this build adds fields (PTF1, PTF2), so byte equality on the first reload would fail every run; idempotence and no data loss are the real invariants |
| PT21 | **Determinism.** Same seed and route give byte-identical canonical saves at every save point | DONE (two runs) | Different seed as a divergence sanity check; Node versus Chrome parity (`browser_parity.mjs`) | Catches ambient `Math.random`, wall-clock reads and order-dependent iteration |
| PT22 | **Content coverage.** Which locations, dialogues, recipes, activities and traders were reached, against the content registries | Proposal | Per-world coverage targets set by Weibao's slice, not 100% | "Never reached" is the gap Weibao asked about most directly |
| PT23 | **Pacing.** Game minutes and ops between unlocks, levels and new verbs | Proposal: record now, judge later | Per-world target bands | Long flat stretches are where an idle game loses its player |
| PT24 | **Sealed-secret leak.** Scan projections, visible UI text and model notes for sealed-secret markers | Proposal: secret files carry a test token or ID list the scan matches; the scan reports IDs only | Strictness per secret status | Leaks are invisible to a human tester who already knows the truth |
| PT25 | **Legibility notes** from the confused-newcomer persona | Proposal | Note budget per run | Finds UI that only makes sense to its author; feeds UR rules, never edits them |
| PT26 | **Balance outliers.** Rates (xp, money, items per hour) outside a band set by sweeps | Proposal | Band width | Outliers are questions for Weibao, not fixes (AD5, AD32) |
| PT27 | **Performance.** Op wall time from the trace; full budgets stay with `scripts/perf/gate.mjs` | Partly DONE (per-op ms recorded) | Flag ops over N ms | Slow ops show up in long playthroughs before the perf gate sees them |
| PT28 | **Invariants.** The Node runner's built-ins (finite non-negative money, clock never backwards, no `expansionError`) | Proposal: reuse `HeadlessGame.check()` in Node runs | Add per-system invariants as systems land | Already written; the playtest only has to call them |
| PT29 | **UI layout sanity** (Chrome only) | Superseded by the UI section (PT46-PT53) | | |
| PT30 | **Fault-injection self-test.** Each detector must catch its own injected fault and the clean run must have zero findings | DONE (`--self-test`) | Add a fault per new detector | A detector that never fires is indistinguishable from one that is broken |

## Tuning

| Code | Idea | Default | Dial | Reason |
|---|---|---|---|---|
| PT31 | **Seed sweeps.** The same route over N seeds | Proposal | N, Node runner for volume | Shows variance and rare failures |
| PT32 | **Parameter sweeps over balance dials.** Run a policy across dial values and chart time-to-milestone | Proposal: dials read from world data, never patched in source | Which dials, how many points | Gives evidence for a balance conversation without Weibao grinding |
| PT33 | **Persona comparison.** Same build, four personas, compare where each stalls | Proposal | Personas | Different players hit different walls |
| PT34 | **Before and after builds.** Same seeds and routes on two commits, diff reports | Proposal: copy the perf gate's `git archive` base build | Base commit | Turns a change into a measured change |
| PT35 | **Findings are proposals.** A sweep result never changes a balance number by itself | Standing (AD32) | None | Weibao decides balance; the harness supplies evidence |

## What the game MCP server (EL16) should expose

So the later EL16 lane can build to a contract agents can play well with.

| Code | Tool | Shape | Reason |
|---|---|---|---|
| PT36 | `observe` | The AR8 projection for the current screen: location, visible people, actions, inventory summary, active activity, messages since last call. Observer-safe only | One call gives an agent what a player sees, in game terms |
| PT37 | `actions` and `quote` | Every currently available command with id, label, cost and eligibility (AR7 quote); `quote(id)` for detail | Agents choose from what is possible instead of guessing selectors |
| PT38 | `act(id, args)` | Revalidates, runs, returns the result and the new observation delta | AR7 revalidation protects against stale choices |
| PT39 | `step(minutes)` and `until(condition)` | Dev-stepped time; conditions such as activity ended, new message, unlock | Idle play is mostly waiting; agents must wait cheaply |
| PT40 | `save`, `load(fixture)`, `export`, `import`, `screenshot` | Save tools operate on the instance's own temp userData only | Round trips and evidence without touching real saves |
| PT41 | `trace` and `note(text)` | Server-side recorder (PT4) and a place for persona notes | The same trace format for every policy |
| PT42 | Safety: 127.0.0.1, Origin check, token, off by default, no debug-truth tool unless a flag names it | As EL16 | Sealed secrets stay sealed and nothing else on the machine can drive the game |

## Shell choice

| Code | Question | Default answer | Reason |
|---|---|---|---|
| PT43 | **Anything better than Electron for playthroughs?** | Playthroughs need no shell: headless Chrome via Playwright is the default runner, the Node full-game runner is the fast tier, and the hidden Electron host is used only when the host itself is under test or for EL16 MCP. Tauri, NW.js or a native wrapper would not help playtests, since the game is the same web bundle | The slice proved it: a full route, four detectors and fault injection with no window and no shell change |

## Cost and budget

| Code | Idea | Default | Reason |
|---|---|---|---|
| PT44 | **Budget model calls, not clicks.** Scripted and random bots cost CPU only. LLM runs declare a step budget and model calls per run before starting (AU2) and stop at the first exhausted bound (AU7). Local Ollama runs cost no allowance; Claude runs default to one coordinator and at most two concurrent agents (AU1, AU3) | Proposal | An overnight Claude persona run with a call per click could spend a day's allowance on menus |

## First slice status

| Code | Item | Status |
|---|---|---|
| PT45 | `scripts/playtest/` scripted bot, five detectors, fault injection, self-test, optional screenshots | DONE and verified on 2026-10-20 at 1920x1080. Clean run: all five detectors pass on two seeded runs. Self-test: `throw` caught by errors, `stall` by stuck, `save` by round trip, `nondet` by determinism, `overflow` by ui. Commands and timings in [scripts/playtest/README.md](../scripts/playtest/README.md) |

Findings from the first runs, reported as notes (not failures) and as proposals
to investigate:

| Code | Finding | Evidence |
|---|---|---|
| PTF1 | First load after a save fills about 750 default fields (zero skill xp for NPCs and similar); a second reload is byte-stable | Round-trip notes, save point `talked` |
| PTF2 | A quest task status entry appears only after a reload, not when the save was written | Round-trip note `reload added data` at `/quests/.../task_status/0` |
| PTF3 | Reloading a brand-new save appends a second "life begins" memory to the continuation record | One-off probe, fresh save round trip |
| PTF4 | The hero stat block wraps labels mid-word at 1920x1080 ("Defens/e", "Spee/d", "Cri/t x") | Screenshot `run0-op13.png` from `--shots`; the clipped-text check does not catch wrapping, which is what PT49 (vision critique) is for |
| PTF5 | One visible `<button>` with no text, aria-label or title on the inventory item screen | ui note, op 13 |
| PTF6 | Both local models, shown a hand-written village screen without the inventory, said "I have no tools", though the hero had them. The confusion came from the harness prompt, not the game | PT64 benchmark; see PT71 |

## UI in playthroughs

Desktop first (standing UI priority): 1920x1080 is the default playtest
viewport, 1366x768 a dial. Headless only.

| Code | Idea | Default | Dial | Reason |
|---|---|---|---|---|
| PT46 | **Cheap UI detector in every run.** Sideways page overflow fails; clipped text (overflow hidden, no ellipsis) and visible controls with no text, aria-label or title are notes, once per run | DONE (`ui` detector, checked on every changed screen) | Promote a note kind to fail once the clean build has none of it | Mechanical checks catch regressions without judgment; notes avoid failing on current debt |
| PT47 | **Per-step evidence.** Screenshot and accessibility snapshot per op | Screenshots DONE behind `--shots` (temp out dir only); accessibility snapshot proposal (CDP `Accessibility.getFullAXTree`) | Every op, changed screens only, or failures only | Screens and the AX tree are what a vision model and a keyboard user each see |
| PT48 | **UR checks a bot can run** | Proposal: overlap of interactive boxes; text clipped vertically; focus or scroll stolen across `advanceTicks` (record `document.activeElement` and `scrollTop` before and after a step); layout shift between ticks (CDP layout-shift entries); keyboard-only reachability (Tab through and confirm each listed action gets focus); an action available through the API (PT37) with no visible control | Which UR codes each check claims; desktop viewport first | Each check maps to a UR rule so a failure has an owner |
| PT49 | **Vision critique.** A model looks at screenshots and answers "would a newcomer understand this screen" and "what reads wrong" | Proposal: local vision model first (both installed models report vision), Claude for a named hard screen | Screens per run; persona | Catches what geometry checks cannot, such as PTF4's mid-word wrapping. Output is a proposal for the UI owner, never a UR change |
| PT50 | **Visual diff against a baseline build.** Same seed and route on base and head; pixel diff per op with a threshold | Proposal: base built like the perf gate (`git archive`) | Threshold, masked regions (clock, weather) | Shows unintended UI changes; frozen clock and seeds make screens comparable |
| PT51 | **Sealed text in screenshots.** Screens can show text that is sealed until discovered | Default: screenshots stay in the temp out dir, never committed, never shown in chat unless the screen is known clean | Redaction boxes over known secret selectors | The sealed-secret rule covers images as well as text |
| PT52 | **Reachability, both ways.** Every PT37 action should have a visible control and every visible control should map to an action | Proposal after EL16 | | Catches hidden features and dead controls together |
| PT53 | **Tick-time UI churn.** Count DOM mutations and reflows per stepped minute on an idle screen | Proposal, pairs with the perf gate | Budget per screen | Idle screens that churn waste battery and steal focus |

## Which harness to use

| Code | Layer | Default | Alternatives (dials) | Reason |
|---|---|---|---|---|
| PT54 | **Overall** | Playwright library for the runner; EL16 game MCP for model players; a plain tool loop as the model driver | See rows below | Uses what the repo already has; adds one new piece (EL16) that is also the AR7/AR8 seam |
| PT55 | **Runner** | Playwright from `scripts/ui_helpers.cjs` (system Chrome headless, CDP available for metrics) | Node full-game runner for volume; hidden Electron for host tests | Already proven by every browser check in the repo |
| PT56 | **Browser MCP servers** (Playwright MCP, chrome-devtools-mcp; [comparison, 2026](https://mcp.directory/blog/chrome-devtools-mcp-vs-playwright-mcp-2026)) | Not the default for playtests | chrome-devtools-mcp for an ad hoc performance trace or debugging session; Playwright MCP for poking a page interactively | Both act on accessibility snapshots of the DOM, close to what our own clicks do, and spend many tokens per step on page trees. A game-level tool (EL16) gives a model the same decision in far fewer tokens and stays observer-safe. Token figures in that comparison come from vendor blogs and are unverified |
| PT57 | **Model driver** | Plain tool loop: send observation plus tool list, receive one tool call, apply, repeat, with a hard step and call budget (AU2) | Claude Agent SDK when a run needs sessions, subagents or file tools; Ollama's chat API with tools for local models (same loop, different endpoint) | The loop is small and the budget logic must be ours anyway |
| PT58 | **Game testing frameworks** | Borrow ideas, do not adopt a framework | TITAN ([arXiv 2509.22170](https://arxiv.org/abs/2509.22170), 2025): perceive, prioritize, reason with action-trace memory, reflect, and LLM oracles for bug reports. MIMIC-Py ([FSE 2026 demo](https://conf.researchr.org/details/fse-2026/fse-2026-demonstrations/16/MIMIC-Py-An-Extensible-Tool-for-Personality-Driven-Automated-Game-Testing-with-Large)): personality traits as configurable inputs, with planning, execution and memory separate from game code. [arXiv 2410.02829](https://arxiv.org/abs/2410.02829) (2024): LLM agents as difficulty testers | These are research tools or tied to other engines (MMORPG clients, Unity). Their shape (state abstraction, action memory, persona traits, oracle reports) maps onto PT1, PT4, PT13 and the detectors |
| PT59 | **Agent eval scaffolding** | Our own trace and report format (PT4, PT9) | An eval framework if runs ever need cross-model scoring | One player and one game do not need a general eval platform yet |
| PT60 | **Where results go** | `REPORT.md` per run in the temp out dir; chosen summaries saved under `docs/audits/playtest/` | | Saves substantive reports in the project without committing raw traces |

## Local AI versions

Measured on this Mac on 2026-10-20 unless a source is cited. Hardware: Apple M5
Pro, 64 GB unified memory (`sysctl`). Ollama 0.40.3 is installed with
`qwen3.8:27b` (18 GB), `gemma4:31b-mlx` (19 GB) and an abliterated
`Qwen3.8:27b-q8_0` (29 GB).

| Code | Idea | Default | Dial | Reason |
|---|---|---|---|---|
| PT61 | **Runner.** Ollama: already installed, local HTTP API on 127.0.0.1:11434, background server with no window | DONE as the measured route | LM Studio or `mlx-lm` for MLX-native models. Sources disagree on whether Ollama's Apple path runs on MLX: some say since 0.19 in March 2026, others updated in May and September 2026 say llama.cpp ([promptquorum](https://www.promptquorum.com/prompt-bites/ollama-mlx-apple-silicon), [bestllmfor](https://bestllmfor.com/guides/ollama-on-mac-mlx/)). The installed `-mlx` tag suggests MLX models load in 0.40.3; unverified | One runner is enough; switch only for a model Ollama cannot serve |
| PT62 | **Size that fits.** 27B to 32B at 4 to 8 bit (18 to 30 GB) leaves room for Chrome and the game. 70B class at 4 bit (about 40 GB, estimate) fits but crowds the machine. gpt-oss-120b (about 66 GB per [pinggy, 2026](https://pinggy.io/blog/top_5_local_llm_tools_and_models/)) does not fit | Installed 27B and 31B models | 7B to 14B for fast action picking; gpt-oss-20b is a commonly recommended tool-calling pick (same source; unverified here) | Weibao's other work shares the memory |
| PT63 | **Capabilities.** `ollama show` reports completion, tools, vision and thinking for both `qwen3.8:27b` and `gemma4:31b-mlx` | Measured | Thinking off for action picking, on for end-of-run summaries | Tools let the same PT57 loop drive local models; vision enables PT49 locally |
| PT64 | **Speed (measured).** Game decision prompt (173 tokens in, about 55 to 75 out, JSON, thinking off), with a Chrome playtest running at the same time: `qwen3.8:27b` 10.5 to 11.4 tokens/s generated, 6.4 s per warm decision, 12.6 s first load; `gemma4:31b-mlx` 9.0 to 10.4 tokens/s, 5.4 s warm, 8.8 s first load | Measured | A quiet machine will be somewhat faster; longer observations raise prompt time | About 600 decisions an hour: enough for an overnight persona run of a few thousand choices, far too slow to drive every click |
| PT65 | **What they judged in the probe.** Both gave valid JSON, a plausible action and a newcomer-style confusion note. They chose different actions (talk to the elder versus gather), which is persona variety, not error | Measured, one prompt | | Good enough for notes and choices at decision points (PT16); not evidence of planning depth |
| PT66 | **Limits to plan around** | Long multi-step goals, arithmetic over balance tables and telling a bug from intent stay with detectors or Claude; runs use temperature 0 and a seed for reproducibility | | Same as PT15, now with a measured probe behind it |

## More to consider

Subtle points, each with its default handling. Saved as round 1; later rounds
append.

| Code | Detail | Default handling |
|---|---|---|
| PT67 | **Seeds and RNG streams.** The bot seeds `Math.random` and crypto, but game systems may own named streams (GR rules, `hashStreamSeed`) | Determinism (PT21) compares saves, which covers stream state; a new ambient `Math.random` path shows as a diverged save point. Every report records its seed |
| PT68 | **Time stepping and offline catch-up.** Dev-stepped ticks are not the same path as catch-up after a closed tab | Later route: save, advance the frozen wall clock (`advanceWall` in the Node runner), reload, compare with the stepped equivalent |
| PT69 | **Save privacy.** Bots never read or write Weibao's real saves or profile | Fresh contexts and temp dirs only (PT3); fixtures from `tests/fixtures/perf/` |
| PT70 | **Token and usage budgets.** Model runs declare a call budget before starting (AU2) and stop at the first exhausted bound (AU7) | Local runs still record call counts so a Claude rerun can be priced |
| PT71 | **Observation completeness.** A persona confused by missing context reports a harness gap as a game gap (PTF6) | Observations come from the game's own projection (PT36), not hand-written summaries; a confusion note is checked against the screenshot before it becomes a finding |
| PT72 | **Persona bias.** Models share habits: they read every message, try every menu and stay patient | Mix scripted, random and model policies; give personas explicit traits (impatient, skims text); compare with friction Weibao notes in his own play |
| PT73 | **Flaky-test triage.** A finding that appears once may be timing | Rerun the same seed; a reproduced finding is a finding, an unreproduced one is logged as flaky with both traces kept until triaged |
| PT74 | **Trace size and retention.** A 1920x1080 screenshot is roughly 100 to 300 KB | Traces stay in the temp out dir; keep the last N runs; commit summaries only |
| PT75 | **Sealed-secret redaction in traces and screenshots** | Traces hold hashes only (DONE); screenshots stay local (PT51); model notes pass the PT24 scan before being saved in docs |
| PT76 | **From gap to regression.** A found gap becomes a test that fails before the fix | Each finding records seed, op index and route; the fix lane adds a focused test (AD36) and the playtest route keeps covering it |
| PT77 | **Findings flow to owners.** UI findings to the UI rules owner, saves to persistence, balance to Weibao | Report rows name the rule code (UR, AR, MR) and owner doc; findings stay proposals (AD32) |
| PT78 | **Known traps in routes.** The Village patrol tooltip throw would fail every route that touches it | Routes avoid it (listed in `village_route.mjs`); a known-error allowlist (PT17 dial) needs an owner and date |
| PT79 | **First-load normalization** (PTF1) | Round trip fails only on lost or changed data or a non-idempotent loader; added fields are notes |
| PT80 | **Determinism is per environment.** Chrome and the Node runner may differ on layout-dependent paths | Compare within one runner by default; cross-runner parity stays with `browser_parity.mjs` |
| PT81 | **Bots and the frozen clock.** Wall-clock features (export rewards) do not move under a frozen `Date` | Routes that test them advance the wall clock explicitly |
| PT82 | **Concurrent runs on a shared machine.** Several sessions share this Mac | One playtest batch at a time, at most two parallel browsers; local model runs off while a perf gate measures |

## Harness checklist

The single to-do list for the harness. Level is the suggested model; effort is
a rough size; the done check is what must pass.

- [x] **Scripted bot, five detectors, fault self-test, screenshots** (PT11, PT17, PT18, PT20, PT21, PT30, PT46, PT47). Sonnet, S. Done check: `node scripts/playtest/run.mjs --self-test` prints `ok` for all six cases. DONE 2026-10-20.
- [ ] **Triage PTF2 to PTF5** with the save and UI owners. Sonnet, S. Done check: each has a fix with a focused test, or an owner note saying it is intended.
- [ ] **Random coverage bot on the Node runner** (PT12, PT22). Sonnet, M. Done check: 20 seeds x 2,000 ops in under 10 minutes, reporting reached and never-reached locations, dialogues, recipes and traders against the registries.
- [ ] **Round trip every N minutes plus Export/Import** on long Node runs (PT20, PT28). Sonnet, S. Done check: an injected export fault is caught and the clean run passes.
- [ ] **UR bot checks** (PT48): focus and scroll stolen across ticks, overlap, keyboard reachability. Sonnet, M. Done check: each check names its UR code and catches an injected fault.
- [ ] **EL16 game MCP tools to the PT36-PT42 contract** on a hidden instance. Opus, M. Done check: an agent plays the elder greeting through the tools and the save round-trips (EL16's own check).
- [ ] **Tool-loop model driver** (PT57) with the AU2 budget and the PT24 note scan. Sonnet, S. Done check: a local `qwen3.8:27b` explorer plays 50 decisions through EL16 and writes a report with notes.
- [ ] **Local vision critique** (PT49) on `--shots` output. Sonnet, S. Done check: on the current build it reports PTF4 or an equivalent legibility note unprompted.
- [ ] **Visual diff against base** (PT50). Sonnet, M. Done check: an injected CSS change shows on the right op with clock and weather masked.
- [ ] **Persona comparison and parameter sweeps** (PT32, PT33). Opus to design, Sonnet to run, M. Done check: one report comparing four personas' time to the first three unlocks, labeled as proposals.
- [ ] **Offline catch-up route** (PT68). Sonnet, S. Done check: stepped and offline paths agree, or the difference is reported.
