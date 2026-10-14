# Politics, factions and AI

Evidence uses [REPORT](REPORT.md)'s installed root. No ideology/politics system is selected for YAIRPG by this report.

## H-A1: Politics is several state variables

SHOWN, `common/ideologies/00_ideologies.txt:140`: ideology groups contain subtypes and rule/AI settings. Character ideology and national party support are distinct. SHOWN economic ideas couple political support to legal law changes (`common/ideas/_economic.txt:31`). SHOWN defines separate stability and war support, with defaults 0.5, range 0..1, war/party popularity factors and distinct offensive/defensive effects (`common/defines/00_defines.lua:329` to 353). Casualty, bombing and convoy effects have their own gain/decay caps later in that section. These are authored parameters; exact drift dynamics and aggregation require the engine.

INFERRED: ideology drift is a tendency operating over time, while government change, party support, stability and willingness to sustain war need not happen together. Advisors/ideas/events contribute through separate effects and modifiers. Do not reduce all four to one allegiance bar in an adaptation.

## H-A2: Balance of power

SHOWN, `common/bop/ITA.txt:2`: a named balance has an initial value, two sides, a decision category and value ranges. Ranges can attach modifiers and on_activate/on_deactivate effects. The first control range alters advisor cost (`:28`). This shows threshold changes with entry/exit hooks rather than only a decorative meter.

PROPOSAL: a fitting world institution may track a local balance between patrons or practices. Persist actual value and active band; distinguish a continuous magnitude from the effects that fire at a crossing. Repeated ticks/reload must not retrigger an already settled crossing. No current new political mode is authorized.

## H-A3: Diplomacy and factions

SHOWN, `events/Germany.txt:476`: a negotiated response installs a non-aggression relation and opinions. `common/scripted_triggers/diplomacy_scripted_triggers.txt:34` handles game-rule exceptions and conditional guarantees. Same-group ideology is not evidence of automatic consent to a specific relation.

STATED, `common/factions/_documentation.md:5`, 221, 231: faction goals have actor/target scopes, visibility/availability, progress/completion and short/medium/long categories. Faction templates select rules and structure; rules are separate from simple membership. `common/on_actions/_documentation.md` lists join/leave/leadership hooks. The newer faction content is richer than a single alliance list, but detailed faction scoring/member upgrades were not semantically exhausted.

## H-A4: Strategic plans, tactical execution and weights

SHOWN, `common/ai_strategy_plans/GER_historical_strategy_plan.txt:1`: country admission, enabled historical/game-rule modes and abort conditions surround a named plan. It can stop when the political/strategic context invalidates it. `common/ai_strategy/GER_operation_strats.txt:1` separately declares operation/missions, their target, priority and abort_when_not_enabled. A plan is a preference layer, not a legal bypass.

SHOWN, focus/decision/technology samples use `ai_will_do` with base/factor and conditional add/multiply modifiers; event options use `ai_chance`. A factor-zero branch can suppress a preference. Do not claim that all these families normalize weights identically or that zero weight prevents player actions.

SHOWN, `common/defines/00_defines.lua:2952`, 3524, 3547: AI front/controller constants score supply nodes, path costs and rail connections. STATED, `common/ai_navy/_documentation.md:1`: naval goals are purposes, objectives bind them to concrete targets, and active objectives are scored and prioritized. Native front search/pathfinding and complete air/naval mission resolution remain uninspected.

PROPOSAL: NPC objectives share legal command/knowledge projections with players, retain actual target IDs and abort on lost premises. Do not adopt HoI4 scripting as proof of viewer-safe AI; that must be tested in YAIRPG and Province War through their own knowledge owners.
