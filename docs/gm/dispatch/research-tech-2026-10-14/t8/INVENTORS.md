# T8: people who pursue invention

2026-10-14. **Proposal only; no inventor controller implemented.** B16-B20 extend
PW4, PI11a, RP and IN. [DIFFUSION_MODEL](DIFFUSION_MODEL.md) owns regional spread;
[HISTORIES](HISTORIES.md) owns retained contribution/credit links.

## B16. One identity, several kinds of ability

Bind an inventor profile to an existing admitted actor identity. Source-reserved
inventors stay authored; generated actors occupy only permitted roles. A profile
references body/senses, current knowledge and practiced methods, workshop/site
access, institution/patron ties, owned or reserved resources, interests and
active roadmap. It does not copy these into an independent inventor inventory.
Dead historical inventors retain identity capsules, not newly spawned living
actors. A predecessor's notebook does not grant their heirs personal mastery.

Main `src/npc_lives.js:5-22` has authored household identities with hash-varying
death years, not generated invention goals. `src/simulation_resolution.js:9-32`
freezes spawned participant IDs/templates for a cause. These are source seams,
not proof a general inventor population already exists.

P4 is present only in its isolated worktree at inspection. Its
[REPORT](../../../../../.claude/worktrees/proc-p4-people/docs/gm/dispatch/procgen-2026-10-13/p4/REPORT.md)
states that names, traits, needs, goals, possessions and final RNG are saved in
a separate `generated_people` store, with broader actor mapping deferred. That
is worker-reported proof, not independently rerun or main integration evidence.
An eventual bridge must map stable qualified IDs, custody, knowledge and residence
explicitly. Name matching or spawning a second inventor copy would duplicate a
person. P4's bounded requests are not a technology controller API.

## B17. Targets arise from what this inventor encounters

Generate an initial target from admitted interests, circumstances and known
functions. Later candidate targets come from actual commissions, observed needs,
anomalies, received evidence, incomplete projects or recombinations. A player can
fund an unfamiliar question without gifting its solution. An NPC cannot choose
an unimagined sealed method because it is cheap in the author's full graph.

Proposed `InventorProject`: actor/ref, target function/magnitude/form, origin
question/evidence, graph/method revisions, actor-known roadmap, selected route,
budget/access/reservation refs, progress/settled evidence, due boundary, state
and named stall. Distinguish aspiration, investigation, build and test. A distant
aspiration can open a reachable study or hiring step before fabrication exists.

The current isolated T6 draft exposes `expandTarget`, `checkFeasibility` and
`roadmapView` at
`.claude/worktrees/rt-t6-planner/src/invention_planner.js:103-105,136-151,197-233`.
Its feasibility starts from boolean world availability and its view is
knowledge-only. It does not allocate shared stock, advance research, enforce
practiced mastery, price work or provide inverse planning. T8 proposes a separate
resource/actor/time adapter before treating graph solvability as executable work.
The interface is a read-only snapshot and needs root reconciliation after T6 lands.

Basis: `docs/TECHNOLOGY_AND_PROGRESSION.md:546-561,878-884,1148-1159` and
`docs/worlds/RESEARCH_TALENTS_PROGRESSION_AND_STARTS_2026-10-13.md:102-126`.
No universal age/era/intelligence prohibition or forced menial-work prelude.

## B18. Temperament guides plans without inventing physics

Draw temperament once from a world/culture-qualified profile with correlations
only where authored. Keep non-mechanical texture when no selected consumer reads
it. Suggested axes have independent uses:

| Axis | Fitting behavior reader | Boundary |
|---|---|---|
| Curious/practical | Weigh open questions against actual recipient needs | Neither grants hidden theory |
| Careful/bold | Choose supported test scale and inspection effort | Risk uses the actual operation law, not guaranteed failure for bold people |
| Sharing/private | Choose recipients, publication or lawful secrecy | Institutions and consent still affect transmission |
| Persistent/flexible | Reconsider a stalled approach or seek another method | No irrational endless spending or permanent refusal to adapt |
| Cooperative/competitive | Seek collaborators, application niches or public priority | Similar designs do not prove theft; cooperation can still earn credit |

Interpret these as context-sensitive preferences. A cautious inventor can adopt
quickly after a conclusive demonstration. A secretive person can teach a trusted
student. A curious person can finish a mundane repair. Temperament never prunes a
lawful route from the player's options or substitutes for actual recipient consent.
No mandatory flaw offsets an unusually capable inventor.

## B19. Event-driven project decisions with bounded commitments

At a supported decision boundary, gather known feasible next actions and named
investigations. Exclude work lacking required access, consent or reservation.
Score the remainder against actual need, useful payoff, effort, obligations,
interests and risk policy. Deterministic tie order is sufficient; stochastic
variety uses an inventor-specific saved stream and freezes its candidate vector
and choice. Previewing their known work does not invoke the controller.

Commit one next step, or parallel independent steps only when distinct held
people/stations/stock support them. The resource owner reserves shared stock and
capacity. Save selected tests, draw outcomes and progress at commitment, then
apply settled results through actual craft/research consumers. A completed graph
node is useful only when its consumer changes something. Evidence updates only
the propositions the observed operation establishes.

Stop or revise at relevant events: exhausted input, removed access, decision
outside budget, test result, collaborator arrival, competing supplier or changed
need. A repeated failed approach need not automatically earn knowledge. Conversely,
genuine strong knowledge/fabrication means can remove the bottleneck directly.
Cancellation retains actual spending, surviving objects and learned evidence under
the declared operation policy; it cannot reroll the same admitted experiment.

Distant inventors can use declared cohort/project abstractions. Materializing an
individual conserves its reserved identity, project, contributors and resources;
moving the camera closer never rolls a smarter inventor or extra stock. Advance
only on the selected branch/world clock. Native projects continue without player
attention or player research exposure, while new player interventions affect only
their actual dependencies. Do not install global offscreen aging from this design.

## B20. A rival can help, compete and surpass

Original fixture: a lamp maker wants lighting for a late-working customer. Missing
measurement means stall reproducible fittings. A player can lend a gauge, hire the
maker, teach a lawful method, sell components, collaborate or leave. Those actions
create different access/exposure/contribution receipts. The maker can also obtain
the gauge independently and finish on their natural course. A refinement can
later surpass the player's version if actual tests and means support it.

No guaranteed rivalry, exclusive first-unlock or automatic theft. Credit claims
follow B11-B15 and adoption follows B1-B5. At the desktop targets, an introduced
person's known goal, named stall and supported interaction sit beside their known
roadmap; private temperament and hidden projects stay outside public projections.

Future checks, **NOT RUN**: actor mapping creates no duplicate person; a controller
uses no hidden answer; disconnected knowledge cannot copy the player; scarce stock
cannot be spent by two inventors; strongest lawful means can bypass real gates;
cancel/resume preserves committed outcome; absence of player intervention permits
native progress; segmented clocks and Save/reload/import preserve identity,
knowledge, projects, reservations, temperament and next draw.
