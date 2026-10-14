# cividle: three deeper systems

Ranked by payoff for this aspect backfill, especially earlier text/save/authoring gaps. These are targeted traces. Full semantic completeness and future YAIR selection are separate.

## D1 Tutorial records

Prior status: Previously undocumented authoring/UI path.

Trace: authored step -> current/target callback -> selector/video guidance -> next instruction when condition met.

Evidence: https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/src/scripts/logic/Tutorial.ts

Limit: Shown tutorial records reference actual buildings/tech. No rendered selector robustness or skipped-step runtime proof.

PROPOSAL: route this pattern through the existing owners named in ASPECTS; no new parallel scheduler/save store and no automatic source adaptation.

## D2 Transport source cache lifetime

Prior status: Explicit prior unread item.

Trace: reset -> tick indexes -> distance sorted candidates -> cached material/target list; clear and clearDistanceSources are separate.

Evidence: https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/shared/logic/TransportSourcePlanner.ts

Limit: Derived ordering must not become persistent truth. All caller invalidation joins are still unread.

PROPOSAL: route this pattern through the existing owners named in ASPECTS; no new parallel scheduler/save store and no automatic source adaptation.

## D3 Checksum and migration distinction

Prior status: Prior save finding extended.

Trace: clone/refund -> encode Map/Set -> checksum; parse/revive -> expected/actual metadata -> shape repairs.

Evidence: https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/shared/logic/GameStateLogic.ts; https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/src/scripts/MigrateSavedGame.ts

Limit: Legacy exceptions make a universal corruption-rejection claim false. Callers remain a named gap.

PROPOSAL: route this pattern through the existing owners named in ASPECTS; no new parallel scheduler/save store and no automatic source adaptation.

