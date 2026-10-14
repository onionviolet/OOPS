# Content and scope digest

SHOWN: inventory reads only Data/ and Extras/ text. It never traverses personal
Saves/ or Scores/. Counts below are physical nonempty lines, not callable rules,
complete entities or unique player choices. Raw inventory and SHA-256 values
stay in `~/.codex/research/warsim/extract/`.

| Pool | Installed count | Content per system and reuse |
|---|---:|---|
| Race base / modifier | 101 / 379 rows | Three tiers, description and modifier fields support many faction variants |
| Faction names | 375 content rows plus three headers | General and role-specific entries; helper called by kingdoms and mercenaries |
| Kingdom names | 1,185 lines | Naming variety without new governing rules |
| Personal suffix / addon | 3,528 / 644 rows | Rich identity surface; not all numeric semantics inspected |
| Hero biography | 286 lines | Whole-line selection confirmed in native helper |
| Mercenary story | 333 content rows plus four headers | Eligibility categories reuse story infrastructure |
| Local talk | 33 files / 2,630 lines | TavernTalk alone 883 lines; location flavor is a sizeable authored pool |
| Warrior type | 524 lines | Named role vocabulary; mercenary generator calls its helper |
| Animals / monster pool | 267 / 105 lines | Structured animal descriptions and monster data; total monster combinations not derived |
| Quest items / advice / jests | 718 / 265 / 290 lines | Broad vocabulary and flavor; quest-result dependency graph unread |
| Name directory | 95 files, 50 NONAME-leading files | Shared-reference pattern reduces duplicate vocabularies |
| Faces | Seven files, 16,608 lines combined | Component text, not 16,608 distinct faces |
| Flag / Flags | 344 / 520 lines | Distinct files; do not combine as a verified logical table |
| Race packs | 16 listed profiles and 16 pack files | Selective race content, not separate engines |
| All surveyed text | 255 files in Data and Extras | Includes presentation, settings and old design notes; not a count of simulation tables |

**C1 SHOWN:** core race rows and modifiers mix rule fields with descriptions;
hero story rows are authored paragraphs. Dialogue tables exist, but many
encounters and choices are embedded in native strings. Therefore a claim that
all events are external table data would be false or at least unproved.

**C2 INFERRED:** scope scales through small reusable parts, but the developer
still authors a great deal of content. Adding a prefix is not automatically
free: its consumers, stacking, portrait effects, laws and knowledge need checks.
Authoring one modifier with several readers often gives better returns than
adding hundreds of unused names.

**C3 PROPOSAL:** budget a themed slice by one player route and its consequences:
one actor pool, one action reader, one report, stable save data. Track reachable
choices, meaningful mechanical differences and reader coverage separately from
row counts. Keep future ideas in their owners; do not turn every audit option
into a current build gate.

Historical developer scope-management account is in SOURCES.md. This audit
makes no claim that current Warsim is built from a small generic engine or that
its huge advertised variety required only a small codebase.
