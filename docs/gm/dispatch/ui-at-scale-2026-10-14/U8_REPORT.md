# U8 report: combat and conflict UI at scale

Completed 2026-10-14. Documentation and proposals only.

| Code | Delivered | Status |
| --- | --- | --- |
| D1 | [COMBAT_AT_SCALE.md](COMBAT_AT_SCALE.md): checkpoint, incumbent source review, all 13 reference groups, CB1-CB11 defaults/dials and root mappings. | Written, not accepted design or implemented gameplay. |
| D2 | 1/5/50/army layout comparison; player-as-participant authority; conditions, telegraphs, retreat, powers, body/appraisal and auto/idle receipts. | INFERRED proposals with explicit future desktop checks. |
| D3 | Corrected reading of audit F3 against current workspace registration and retreat location. | Source evidence only. Old browser finding is preserved; current visibility remains unverified. |

## Scope and checks

Read COMMON first; read AGENTS, PROJECT and user preferences, USER_VISION's
standing UI priority, root palette codes, Panel Kit, nonhuman senses/scale UI,
audit F3 and combat-related source. Target is 1366×768 and 1920×1080;
mobile is deferred. Used the reference-scout skill for bounded comparisons.
The memory registry search returned no relevant hits; no memory finding was
used. No subagents were spawned.

SHOWN source paths and line ranges are in SF1-SF6 of the main document:
`src/workspace_views.js`, `src/display.js`, `src/ui/combat_display.js` and
`src/models/combat.js`. Read-only search found the native combat surface and
its render/model paths. This is not an exhaustive audit of all combat adapters.

Document checks: confirmed requested root mappings, CB codes, reference/topic
coverage, both desktop targets, checkpoint/report links and proposal labels;
checked no em dashes or spaced double-hyphen prose. Only the two owned files
were written by this lane. The working tree was already dirty and active;
unrelated paths were preserved. No builds, browsers, tests, game execution,
source edits, bundles, save operations, commits or pushes were performed.
No files named SECRETS were opened.

## Sources and evidence limits

CR1-CR13 in [the main document](COMBAT_AT_SCALE.md#references-and-transfer)
contain direct URLs and the claim each supports. References cover Melvor,
Darkest Dungeon, Battle Brothers, Kenshi, Mount & Blade, Total War, RimWorld,
Dwarf Fortress, Final Fantasy XII, Dragon Age, Mudlet/MUDs, Cogmind and
Dragon Quest as the text-heavy JRPG example. Official developer material,
manuals and documented wiki mechanisms are distinguished from inferred transfer.
No unchecked game-memory claim is used as evidence.

Loaded primary material includes Battle Brothers' UI rework, Kenshi's medical
update, Cogmind's log article, EA's tactics manual, Mudlet's function docs,
Nintendo's Dragon Quest VII manual, Ludeon's mechanoid preview, Bay 12's
archive and Total War's battle guide. Search-indexed developer/manual text
supports the explicitly labelled Bannerlord and FFXII rows where direct opens
failed. Other directly cited reference rows use indexed official/wiki material;
none claims live gameplay inspection.

Failed routes: direct RimWorld home, Bannerlord's 2019 blog and the mirrored
FFXII manual returned internal retrieval errors. Switched to Ludeon/wiki,
indexed developer text plus another official update, and indexed publisher
manual plus Square Enix's update, respectively. No retry variants or login
attempts. Historical posts are evidence of described mechanisms, not claims
about every current version. Kenshi's old post treats severance as future work;
RimWorld's wiki flags outdated equipment data, which was not used.

## Open owner questions and acceptance

| Code | Unsettled point | Useful next evidence |
| --- | --- | --- |
| Q1 | Actual formation mechanics versus presentation-only groups. | Relevant future battle model owner; do not infer from attacker/defender arrays. |
| Q2 | Whether a world's clock supports paused/slowed order entry. | World/time owner and actual policy semantics. |
| Q3 | Combat-event retention and persistent receipts. | Bounded event budget and explicit save compatibility choice if implemented. |
| Q4 | Command delivery/obedience for autonomous allies. | Party/relationship/authority owner; a UI badge does not create control. |

U8 is complete within its document-only scope. The next useful visual gate is
A1 in the main file: rebuilt desktop combat with player, selected opponent,
retreat and meaningful recent feedback visible together. That gate was not
run and is not claimed closed. CB proposals do not change accepted direction
or require army gameplay before the current playable slice finishes.
