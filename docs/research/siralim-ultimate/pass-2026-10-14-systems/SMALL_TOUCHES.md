# Small touches from the deeper systems pass

26 bounded details, 2026-10-14 wave, finalized 2026-10-15. Every YAIRPG use is a PROPOSAL. **STATED** below means shipped text, not observed gameplay. **SHOWN** native fields mean static code observations only. Source prefix `L/` is the prior private localization folder, as defined in [SYSTEMS](SYSTEMS.md). No proprietary dialogue is reproduced.

| Code | Source detail and evidence | Original YAIRPG use / owner |
|---|---|---|
| ST25 | STATED, Hunt selector explains rank D eligibility; S targets are excluded. `L/ui.csv:L_PROJECTS_HUNT_TITLE/ERROR` | Show the real next learning route, including when it has become obsolete. Knowledge; P03/P04. |
| ST26 | STATED, Assassination refuses a creature whose trait has no material. `L_PROJECTS_ASSASSINATION_ERROR` | A learned fact does not invent a producible object. Production; P02/P04. |
| ST27 | STATED, candle refuses excessive current enemy population. `L_CHARMCANDLE_ERROR1` | A targeted encounter must check local capacity before charging. World/encounters; P10/P14. |
| ST28 | STATED, candle's cost rises within one realm. `L_DIVCANDLE_WELCOME` | Quote a visit-scoped price and its lifetime; do not silently make it permanent. Means/appraisal; P18. |
| ST29 | STATED, full creature Mana doubles Knowledge gain. `L/codex.csv:L_CODD_CHARACTER_KNOWLEDGE` | Connect a saturated collection dimension to another useful activity, if an original local rule fits. Knowledge; P09/P11. |
| ST30 | STATED, knowledge reveals HP information. `L_BESTIARY_KNOW2` | A real observation can improve what is known without giving free power. Appraisal; P04/P11. |
| ST31 | STATED, Bestiary separately refuses Essence and Mana shortages. `L_BESTIARY_E1/E3` | Show each independent blocker from the actual quote. UI/means; P01/P04. |
| ST32 | SHOWN, project progress has six item counters plus parts, dust and a completion field. `N17/N21` | Show accepted job progress by actual input rather than a decorative progress bar. Production; P01/P02. |
| ST33 | SHOWN, project capacity starts at one and adds four prior-completion checks. `N22` | Explain an earned capacity increase through the real service upgrade. Home/production; P12/P16. Source limit is not a proposed YAIRPG cap. |
| ST34 | STATED, Training mission grants three scrolls. `L/projects.csv:L_PROJD_TRAINING` | A job should name its output before acceptance. Skills/production; P02/P06. |
| ST35 | STATED, stone crushing gives Piety while unsocketing returns the stone. `L_CHOICE_REFINERY_OPTION3`; codex unsocketing | Distinguish removal, reuse and destructive recycling. Items; P02/P18. |
| ST36 | STATED, inscriptions are reusable crafting knowledge. Codex `SPELLGEMS_CRAFTING` | Separate a learned method from each produced object. Technology; P03/P16. |
| ST37 | STATED, property compatibility can block enchanting. Codex `SPELLGEMS_ENCHANTING` | Keep recipe compatibility in the same validation that commits the craft. Authoring; P16/P22. |
| ST38 | SHOWN, personality growth helper has a biome-21 exception. `N29` | Display a local rule's effect without erasing the traveler's retained disposition. World/body; P05/P14. |
| ST39 | STATED, race and personality select companion speech. Codex personality; `personality.csv` tag families | Use retained facts for voice, while keeping memory claims causal. Companions; P15/P21. |
| ST40 | SHOWN, cooking lookup accepts ingredient pair plus style, with fallback ID 28. `N25` | Save a discovered method separately from its execution requirements. Technology/food; P03/P16. Source reachability is OPEN. |
| ST41 | STATED, most decorations are cosmetic; Utility/NPCs have function. Codex `CASTLE_DECORATIONS` | Label useful furnishings through their real service. Housing; P12/P04. |
| ST42 | SHOWN, decoration serialization retains custom name and text. `N18` | Preserve authored description without letting prose grant permissions. Authoring/dialogue; P16/P19. |
| ST43 | STATED, duplicate next-battle blessings are consumed one at a time. Codex `REALMS_BLESSINGS_OF_THE_GODS` | Repeated acquisition can stock later supported uses without multiplying one occurrence. Items/events; P10/P12. |
| ST44 | STATED, favor rank and patron emblems serve different roles. Codex `GODS_FAVOR/EMBLEMS` | Keep standing and spendable stock distinct. Institutions; P07/P18. |
| ST45 | STATED, stronger bounty runes widen the anointment choice pool. Codex `GUILDSANDFALSEGODS_ANOINTMENTS` | Disclose optional risk and what it changes about the reward. Trials; P10/P14. |
| ST46 | SHOWN, prophecy turn-in checks nonzero completed lines; UI offers continue for a larger reward. `N27`; `L_PROPHECY_LINE_COMPLETED_EXPLAIN` | Preserve partial work and explicit settlement timing. Events; P10/P12/P24. |
| ST47 | STATED, card duplicates help ordinary stats but not set membership. Codex `CHARACTER_CARDS` | Separate unique coverage from quantity in inventory and save state. Collections; P04/P16. |
| ST48 | STATED, god challenge rewards stop scaling after difficulty ten. Codex `GATEOFTHEGODS_DIFFICULTY` | Say when further difficulty is chosen self-challenge. Trials; P14. |
| ST49 | STATED, Arena draft display can toggle and supports mulligans. `L_ARENA_DRAFT_CHOOSE` | Keep selection context while changing inspection detail. UI; P01/P04. Exact mulligan allowance unread. |
| ST50 | SHOWN, project loader clamps negative `quests` to zero. `N17` | State migration/default policy narrowly and test it; one clamp is not a universal compatibility guarantee. Save owner; P16/P24. |

UI adoption uses [UI_RULES.md](../../../UI_RULES.md): declare the surface and home, keep the log intact, use shared tokens/components/controller and verify discoverability on a populated save at 1366x768. Routine summaries belong with current work; reference-heavy lists need their own navigable reference surface. Mobile remains deferred. No UI was built or tested by this lane.
