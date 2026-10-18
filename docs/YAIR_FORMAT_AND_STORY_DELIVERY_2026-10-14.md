# YAIR format and story delivery

2026-10-14. Design assessment responding to Weibao: “what is the best format for the idea of YAIR? is the current the best or will we/should we consider telling the story another way? 2d world? Scope expansion? more to consider?”

Status: proposals, not an accepted format change, implementation assignment or new prerequisite for active work. No runtime edits, prototype, rebuild or browser playtest in this pass. Conclusions about fit are design judgments, not measured player preference.

## F1: The vision is broader than the current interface

[User vision](USER_VISION.md#vision-update-what-weibao-asked-for-2026-10-05-evening-to-2026-10-07) asks for independent lives in book worlds, causal interventions, ordinary life, persistent progress and reconsideration of YAIR as the vehicle. [PROJECT](../PROJECT.md#standing-priorities-and-document-authority) preserves desktop/laptop priority, genuine eligible idle progress, world order and the current delivery scope. One realm and one prestige layer are delivery limits, not the permanent extent of the vision.

Text-led representation fits unusual powers, transformations and different world laws without requiring a complete visual asset set for every interaction. That advantage does not establish that the present arrangement of panels and selectors is the best final experience. A story can be represented correctly yet feel remote if its important moments arrive as interchangeable status rows.

The [existing play-beyond-menus proposal](PLAY_BEYOND_MENU_SELECTORS_CONSIDERATIONS_2026-10-14.md) owns interaction families and command integration. The [UI owner](THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md) owns layout and disclosure, and the [multiverse owner](worlds/MULTIVERSE_STRUCTURES.md) owns world boundaries. This assessment compares formats rather than replacing those specifications.

## O1–O5: Formats compared

| Code | Format | Strongest contribution | Main cost for this vision | Recommendation |
| --- | --- | --- | --- | --- |
| O1 | Current text/menu dashboard | Efficient comparisons, queues and broad systems | Places and characters can feel like entries in a control panel; narrative importance can disappear in the feed | Keep its efficient functions; do not assume its composition is final |
| O2 | Text-led scenes with maps, portraits and contextual workspaces | Breadth plus situated choices, atmosphere and readable consequences | Requires consistent scene writing and integration rather than additional decorative panels | Best current hypothesis |
| O3 | Full top-down 2D world | Walking, geography, proximity, exploration and visual encounters | Maps, visual bodies, object interaction, movement and any chosen collision/pathfinding rules need support across authored content | Worth testing when physical presence is central; not selected for a rewrite |
| O4 | Visual novel or chapter-led adventure | Authored dialogue, pacing and dramatic scenes | A single chapter sequence can conflict with independent lives, optional intervention and ongoing world activity | Borrow scene direction, not a mandatory global chapter sequence |
| O5 | Turn-based spatial simulation with text | Mechanically meaningful distance, terrain, tactics and systemic interactions | Adds spatial rules and authoring/testing obligations; visually simple tiles do not remove simulation complexity | Consider locally where position changes decisions |

“2D” needs a concrete meaning. A route diagram, illustrated location with hotspots, movable token scene and full freely navigable world have different costs. A useful map is a genuine visual improvement even if it adds no new mechanic. Spatial gameplay is a separate proposal: position, routes or geometry must affect resolved outcomes.

## D1: Recommended direction, pending comparison

A desktop, text-led world simulation with scenes as the immediate experience and idle routines supporting sustained growth. The player should feel situated in a place among people, with actions and consequences tied to that situation. Character, equipment and planning information can remain alongside it.

Use different representations for different decisions: connected places for travel, a focused conversation for an important relationship, a work area for supported crafting choices, a spatial view for actual tactical geometry, and concise status for routine training. Keep common navigation and time/commitment language stable across these views. Avoid making every feature introduce another permanent panel or disconnected minigame.

No new narrative engine or engine migration is recommended. Source inspection finds an existing read-only scene projection in `src/causal_story_scenes.js`, including received accounts, available approaches and phase labels, and command-driven work/routine presentation in `src/simulation_ui.js`. These are integration leads, not proof of full story delivery or gameplay acceptance. `src/authored_site.js` explicitly offers a bounded site authoring schema, not a universal world editor.

## D2: Tell a continuing life through causal situations

Combine authored scenes for voice and pivotal moments, state-dependent encounters for relevance, simulation for durable consequences, and a player-facing journal for remembered history. Do not require a giant authored tree for every combination or assume prose generation supplies the missing rules.

An illustrative, original hypothetical: an acquaintance asks for help before leaving town. The player can help directly, prepare a useful item, introduce someone with relevant means, or continue their own work. Supported choices change actual availability, possessions or relationships. A later encounter acknowledges what happened. The journal records what the player learned, with attribution; it does not reveal an unseen objective truth. These are proposed behaviors, not a claim that this example is implemented.

External grounding: [Failbetter's narrative design explanation](https://www.failbettergames.com/news/echo-bazaar-narrative-structures-part-two) describes storylets whose availability and branches depend on game qualities, including linked sequences and completed-content exclusion. This supports the pattern, not universal reuse of its exact model. [inkle's ink documentation](https://www.inklestudios.com/ink/) describes a narrative system designed to integrate into a host game. Narrative structure and graphical presentation need not be one choice. Neither source establishes YAIR fit through playtesting.

## R1–R5: More to account for now

| Code | Consideration | Consequence for the format decision |
| --- | --- | --- |
| R1 | Breadth versus felt depth | Prioritize one place that remembers a meaningful choice before increasing the number of places or rendering every world |
| R2 | Active versus away time | Scenes need explicit pause/advance rules and routines need defined interruption behavior. Essential dialogue should not silently disappear during absence by default; any time-sensitive loss needs an intentional world policy. Actual offline advancement still requires implementation and proof |
| R3 | Extreme scales and bodies | A person, tiny creature, giant and world-level actor may require different abstractions. One fixed walking scale can constrain the very breadth that makes YAIR distinctive |
| R4 | Visibility and knowledge | Maps, portraits, silhouettes, relationship lines and journals can leak identities, counts, transformations or hidden connections. Render only admitted knowledge and preserve sealed discovery routes |
| R5 | Authoring and continuity | Every proposed experience needs reusable content patterns, remembered outcomes and compatibility decisions. Art volume and prose volume both become ongoing work; neither medium makes causal content free |

Additional constraints: preserve comfortable desktop text and useful simultaneous panels; make routine actions efficient with keyboard/click access. Important scenes can slow down while routine work compresses. A world can support optional spatial exploration without requiring repeated walking for every ordinary task. Strong powers may legitimately bypass obstacles; presenting a wall does not justify silently disabling an established ability to preserve the map.

## A1: Bounded comparison, later

Compare the same short Village situation in three presentations: the current panel arrangement, a contextual scene with a small place map, and a simple 2D/token scene. Hold available actions, underlying outcomes and writing as constant as possible. Clearly identify any spatial mechanic that cannot be held constant; it tests a different game design, not presentation alone.

Target 1366×768, with a 1920×1080 follow-up if implemented. Visible outcome: the player can identify where they are, who is involved, what matters, what they can do and what changed, while retaining useful character/work information. Defer additional worlds, mobile optimization, a whole-game art pipeline, engine migration and universal spatial simulation.

Human comparison asks which version creates presence and makes a later consequence memorable, which makes decisions clearer, and which adds routine navigation burden. Implementation would require a fresh rebuilt browser origin and both supported action paths; any persistent changes also require save/reload/import. This is an optional proposed experiment, not a gate imposed on current work.

The recommendation is O2. Expand how the existing depth is experienced before expanding the simulation or replacing the engine. Reconsider O3 if the comparison shows that moving through space is a central source of enjoyment rather than an attractive way to reach the same choices.

## Follow-up: existing games and character art

The [reference and art comparison](research/format-and-character-art-2026-10-14/REPORT.md) ranks open-source and decompilable examples, distinguishes current source reads from earlier dossiers, and corrects the implied portrait requirement: characters need no bespoke image to exist or matter. Wildermyth's documented scene casting and layered images, Naev/Endless Sky's scene integration, and a text/token fallback are the leading references. All remain proposals; no runtime or acceptance state changes.

## Follow-up: decision audit

The [format and view decision audit](FORMAT_AND_VIEW_DECISION_AUDIT_2026-10-14.md) lists every open format, view, character and story decision with status and a recommended default, and compares Hanzi with eight other view options. Its proposal: a semantic place layer under all maps, Hanzi as the default skin, other skins as per-world and per-player dials, and a scene surface as the first presence test.


## OD13 narration, voices and discovery, 2026-10-15

[Accepted answer](USER_VISION.md#overarching-direction-discussion-od13-2026-10-15):
direct narration close to current experience by default, usually "You...";
voices vary by world/mode/means. Discovering base-cheat powers is part of play;
talking cheats, unreliable narrators and book/media inspiration are possibilities.
This accepts narration direction, not the older document's proposed format/UI
rewrite or every narrator device in related palettes.

### ACCOUNT FOR NOW: proposed authoring implications

- **NR1, distinct sources:** event narration, spoken NPC dialogue, journals,
  reports, an internal voice and a talking cheat can have different speakers,
  knowledge and reliability. A speaker may be mistaken, incomplete, deceptive or
  truthful. Record source/context without exposing hidden motives or a sealed
  reliability verdict to the player.
- **NR2, discover usable powers:** reveal basic observable effects and available
  actions through actual encounters/experiments/means. Hidden functions, origin,
  scope or combinations can remain discoverable. The accepted modest starting
  continuation must still be usable; do not silently make it require a secret
  prerequisite to function. Exact discovery routes stay with cheat/world owners.
- **NR3, useful uncertainty:** evidence and experience can support, contradict or
  qualify a narrator's claims. Detecting one lie does not reveal all world truth;
  a genuinely omniscient or truth-reading means can reveal within its supported
  scope. Do not give every narrator the same deception pattern or reveal which
  belief is false through out-of-world formatting.
- **NR4, lore and controls:** fictional unreliability does not by itself grant
  silent authority to falsify player comfort settings, ordinary save controls or
  mode commitments. An in-world screen or counterfeit appraisal can be misleading
  under its actual rules. Keep actor-reported predictions distinct from settled
  outcomes and player-facility explanations. Exact fourth-wall exceptions need
  selected means/modes and existing accessibility/knowledge requirements.
- **NR5, source inspiration:** books, fanfiction, games and other media can inform
  voice, layered revelation, personification and dialogue. Separate recreation,
  qualified AU and original inspiration; inspect actual passages before making
  precise source claims. Avoid copying raw prose into committed/gameplay text.
  No particular source was newly researched for this direction answer.

An unreliable narrator may also be a fallible ally, a limited sensor, a damaged
memory or an earnest observer, not necessarily a villain. Talking cheats can
learn, disagree or have goals where the selected lore supports it; personality
alone does not establish control, power, omniscience or willingness to help.
Special starts and multiple minds may change whose voice speaks. Existing
truth/knowledge/view separation and author W1-W5 chain govern continuity.

Gameplay narration direction stays in these owners; representation chat retains
visual/composition questions and its exclusive record. Cheat chat owns concrete
base-cheat access/design in its exclusive record. No shared-source edit, voice
asset, implementation brief dispatch or hidden secret truth added here.
