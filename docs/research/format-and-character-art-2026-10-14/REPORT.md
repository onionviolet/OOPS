# YAIR format references and scalable character art

## EC1–EC13: evanciao low-poly character consideration, 2026-10-26

Requested by Weibao: how evanciao's procedural low-poly characters work, further considerations, and usefulness for OOPS or other projects. This is a source-backed consideration, not an accepted art direction or implementation request.

**EC1, evidence boundary (ACT NOW, resolved).** The supplied [channel](https://www.youtube.com/@evanciao/videos) was inspected through the background browser after web fetching was throttled. It lists [character modeling](https://www.youtube.com/watch?v=16PpATt6aMc), [PSX texturing](https://www.youtube.com/watch?v=2lSXIVftq4g), and [Blender-to-Unity face rig](https://www.youtube.com/watch?v=aqJITl4QCGs) tutorials. Video playback was unavailable; no full tutorial or transcript inspection is claimed. The linked Yiku documentation returned 404. Technical findings below come from the creator's asset descriptions, not inspected paid source files. No whole-character procedural mesh generator was verified.

**EC2, documented construction.** [Yiku](https://evanciao.itch.io/yiku-advanced-retro-anime-girl) combines a low-poly mesh, hand-painted pixelated textures, custom Rigify rig, manually adjusted skin weights, Unity humanoid animation retargeting, a 2D face system and face-atlas baking, procedural clothing-texture baking, and procedural secondary hair motion. The page reports roughly 1,400 triangles. [Neto](https://evanciao.itch.io/neto512) reports 540 triangles, a 256×256 texture and four 32×32 face textures for eyelashes, eyebrows, pupils and mouth. These are distinct assets; their counts and capabilities must not be merged. Both descriptions establish substantial authored art work. The exact facial shader/control implementation and clothing-generation algorithm remain unverified.

**EC3, explanation.** The practical pattern is authored simple geometry plus reusable controls. Geometry supplies the silhouette; painted textures supply much of the detail; bones deform the body; facial controls manipulate 2D facial elements; procedural rules handle selected patterns or motion. A texture atlas packs multiple images into one texture. Retargeting adapts animation to a compatible humanoid skeleton. These definitions explain the documented features, rather than reconstructing the creator's unpublished code. Low polygon count does not remove topology, skin-weight, clothing-fit or artistic-direction work.

**EC4, OOPS fit (ACCOUNT FOR NOW).** The strongest candidate is an offline art pipeline: original compatible models and appearance choices → fixed cameras, poses and expressions → transparent portraits or sprite sheets → existing UI. This could support recurring companions, an optional equipment figure, transformations and scene tableaux. It does not require runtime 3D. The current package manifest contains no Three.js/Babylon dependency, but that alone is not a complete renderer audit. Live 3D would require a separate rendering/asset-lifecycle decision. Preserve the earlier optional-art recommendation and the user's portrait skepticism; neither this reference nor this note makes portraits mandatory.

**EC5, consequential constraints (ACCOUNT FOR NOW).** Keep resolved appearance/asset revisions stable across generator changes and reloads. Rendering reads actual observable appearance and equipment, including disguises, rather than inventing simulation facts or revealing hidden identities. Use separate compatible body families for nonhumans and a useful text/token fallback. Check silhouette and expressions at actual UI sizes before producing a large library. The main scaling costs may be fitting clothes, expressive range, coherent style and review, rather than triangle count. Procedural combinations do not automatically produce recognizable people.

**EC6, portability (ACCOUNT FOR NOW).** Blender source art can be adapted to another renderer, but Unity editor utilities, shaders, face baking and hair simulation do not automatically transfer with a mesh export. A humanoid rig does not guarantee compatibility with every animation. If reusing a purchased asset, inspect its included license and dependencies. Neto's public page permits credited personal/commercial projects while restricting redistribution/resale/sublicensing of the asset itself and minor modifications. Do not assume identical terms for Yiku or for bundled third-party hair code.

**EC7, other project fit (LATER).** Best fit: a small 3D game, animated short, original mascot or Blender learning artifact, where one character can justify modeling/rigging effort and support many poses. Possible Lumen use: a restrained optional mascot or scenario illustration. It does not itself improve assessment quality or create clinically accurate EMT anatomy. No change to Lumen, a learning plan or a new project is authorized here.

**EC8, bounded comparison (LATER, not dispatched).** Compare one original recurring character rendered as a flat token, a layered 2D bust and a low-poly 3D-derived bust inside the current UI. Use the same three expressions and two appearance states, actual display sizes, and record creation/revision effort. Done check: recognizable identity, legible expressions, believable changes and acceptable fit with the Proto23 shell. Choose the cheapest representation that meets those needs. A single Sol implementation/design lane at medium effort is suitable if later authorized; no delegation, installation, purchase or runtime change occurred in this pass.

**EC9, ease of use, follow-up (ACCOUNT FOR NOW).** Weibao asked whether low-poly is easy enough for these uses and what else to consider. Judgment: feasible for a small reusable cast, particularly fixed-camera busts or rendered sprites; a polished universal procedural character system is substantially harder. Relative effort rises from recoloring/posing an existing compatible rig, to an original static bust, to an expressive original rig, to interchangeable clothing/body families, to a maintained runtime generator. These are qualitative estimates, not measured production times or demonstrated agent modeling ability. Extremely low triangle counts can make silhouette and joint deformation more difficult; use enough geometry for the intended camera instead of chasing the smallest count.

**EC10, simplify by output (ACCOUNT FOR NOW).** A fixed bust camera permits omitting unseen geometry, simplifying hands/legs, restricting facial views and avoiding walk cycles. Static renders need neither a runtime rig nor hair physics. A character seen from every direction while walking, sitting and wearing interchangeable clothes needs much broader deformation/fit checks. Rigid segmented limbs are a possible stylistic shortcut where visible joints suit the design. Standardize camera, lighting, proportions, palette and attachment points before expanding a kit. An extreme-pose check should precede multiplying outfits: inspect raised arms, bent elbows and sitting only when those poses belong to the selected output.

**EC11, automation boundary (ACCOUNT FOR NOW).** A future agent could script primitive construction, palette swaps, part placement, camera setup and batch rendering. Distinctive faces, appealing silhouettes and convincing deformation still require image-based iteration and review. No live Blender operation or agent-quality benchmark occurred here. Blender's [Rigify basic workflow](https://docs.blender.org/manual/en/latest/addons/rigging/rigify/basics.html?highlight=pose+mode) still requires positioning a metarig and binding a mesh; its [Armature modifier](https://docs.blender.org/manual/en/latest/modeling/modifiers/deform/armature.html) uses weights to determine deformation. Auto-rigging does not establish finished skinning quality.

**EC12, representation and storage tradeoffs (ACCOUNT FOR NOW).** A 3D source model can serve several cameras and output styles, including illustrated-looking renders; adopting this authoring method does not require choosing a PSX presentation for every world. Offline output removes runtime 3D work but exhaustive combinations can create an asset explosion. Render a selected cast/state set or compose compatible 2D layers rather than pre-rendering every theoretical combination. Texture filtering, alpha edges and consistent crop/anchors affect small UI output. Neutral shading can simplify reuse; baked directional lighting may clash across backgrounds.

**EC13, revised next experiment (LATER, not dispatched).** First prove one original bust, three expressions and two clothing/color states at the intended UI size. Then request one meaningful revision, such as a different hairstyle or older appearance, to measure editability rather than just first-render quality. Record active effort and visible defects; no promised hour estimate. Only expand to full bodies, animation or procedural libraries if the selected use needs them. This narrows EC8's first production step without selecting an art direction. No implementation or agent dispatch is authorized by this consideration alone.

Verification: primary creator asset pages and live channel titles inspected; Blender documentation checked for the follow-up; existing project art owner and package manifest read; added prose reread. No asset source, export, rendering or performance test was performed. No commit or push.

2026-10-14. Response to Weibao's follow-up on open-source/decompilable games, portraits, optimal format and comparable games. Recommendation only. No format decision, implementation, engine migration, purchase, install or new decompilation is authorized or performed by this report.

## F1: Recommendation

Study **Wildermyth for scene casting and visual character continuity**, **Naev/Endless Sky for an independent career with local authored stories**, and **Elin for ordinary life and progression**. Use **RimWorld for jobs and pacing** and **CDDA/ToME for selective spatial rules**. Roadwarden is a particularly relevant presentation comparison. These are complementary references, not a plan to combine their engines or copy their content.

Best current YAIR hypothesis: a text-led world RPG with efficient idle controls, connected-place navigation, contextual scenes and optional illustration/spatial encounters. Portraits should be largely unnecessary, especially for book worlds. Art must be optional for content eligibility. A character can exist, matter and be remembered without a bespoke image. This responds to Weibao's follow-up question; it is a recommendation, not an assertion of an accepted permanent art policy.

Authority: [format assessment](../../YAIR_FORMAT_AND_STORY_DELIVERY_2026-10-14.md), [play beyond menus](../../PLAY_BEYOND_MENU_SELECTORS_CONSIDERATIONS_2026-10-14.md), [UI owner](../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md), [PROJECT](../../../PROJECT.md#standing-priorities-and-document-authority). Preserve desktop/laptop priority, the existing playable slice and deferred mobile work. This report adds no acceptance gate to active work.

## O1–O9: Ranked by the question they answer

| Code | Reference and access | Mechanism worth studying | YAIR fit and cost | Disposition |
| --- | --- | --- | --- | --- |
| O1 | **Wildermyth**, proprietary Java plus readable JSON/mod editor; earlier project report documents CFR recovery | Scene roles matched to traits/relationships, authored panels, composited character images, life changes | Strongest combined reference for personal stories and changing bodies without drawing every scene from scratch. A reusable art kit still needs consistent proportions and layer rules | Adapt scene casting and inspect art composition first |
| O2 | **Naev**, open source; canonical development points to Codeberg, historical GitHub pin retained by project | Local mission conditions, Lua lifecycle, dialogue/VN presentation, explicit mission memory, career continuity | Strong near-term model for combining efficient systems with situated scenes. Its space simulation and unrestricted Lua are not YAIR dependencies | Adapt authoring patterns; reuse existing dossier |
| O3 | **Endless Sky**, open-source C++ with text content definitions | Optional main plot, local offer eligibility, conditional conversation choices and optional scene images | Clean inspectable example of sandbox activity coexisting with authored narrative. The useful model can be implemented through YAIR hosts without porting C++ | Adapt; fresh narrow source read in this pass |
| O4 | **Elin**, proprietary managed game with community decompiled source | Skills/body traits, material-aware crafting, resident schedules, home research, remembered local opportunities | Closest reference here for living an ordinary developing life in a mechanically rich world. Spatial and asset demands are much larger than a scene view | Reuse source research for bounded mechanics |
| O5 | **RimWorld**, proprietary managed assemblies; earlier project report documents ILSpy recovery | Jobs, reservations, needs, relationships and incident direction | Useful for autonomous activity and consequences. A director that produces pressure should not become permission to force YAIR losses or interrupt all idle growth | Reuse dossier; new portrait/render audit remains unperformed |
| O6 | **CDDA**, open source with C++/JSON and documented tileset construction | Spatial interaction, content/rule definitions, layered tiles and fallback art | Strong example of broad systemic content surviving incomplete bespoke art. Detailed survival overhead is not automatically suitable for YAIR | Adapt fallback principle; spatial mechanics only where needed |
| O7 | **Tales of Maj'Eyal / T-Engine4**, source-available GPL code, Lua-facing engine | Actors, talents, persistent/nonpersistent zones, ASCII or graphical rendering | Useful for a bounded tactical zone. A complete engine replacement introduces migration work and does not supply YAIR's social/world content | Reference; park engine migration |
| O8 | **Roadwarden**, proprietary illustrated text RPG | Place illustrations, conversation, fast travel and preparation-based encounters | Strong presentation benchmark for a world that feels situated without mandatory walking. Earlier scout proposes Ren'Py extraction, but this pass did not verify a package or recover scripts | Compare experience; extraction is conditional |
| O9 | **Warsim**, proprietary native executable; earlier project report documents selected disassembly | Composed faces, reusable race/name pools, text-first breadth | Demonstrates another low-art direction. Combinatorial face counts do not establish meaningful character variation; native reverse engineering is more expensive than a readable content file | Reuse dossier and procedural-art idea; do not decompile the whole binary |

No single inspected reference demonstrates the entire requested combination of idle growth, independent book-world lives, persistent travel, exceptional powers and causal story intervention. That is an evidence limit, not a claim that no comparable game exists anywhere. YAIR's particular combination can be distinctive while its component problems have precedents.

## F2: What was actually checked

Fresh primary documentation: [Wildermyth image layers](https://wildermyth.com/wiki/Image_layers), [comic editor](https://wildermyth.com/wiki/Comic_Editor_Reference), [alternate races](https://wildermyth.com/wiki/Modding_alternate_races); [Naev mission tutorial](https://naev.org/devmanual/misn/starting.html) and [performance tips](https://naev.org/devmanual/misn/tips.html); [Endless Sky repository](https://github.com/endless-sky/endless-sky) and [mission authoring](https://github.com/endless-sky/endless-sky/wiki/CreatingMissions); [CDDA tilesets](https://docs.cataclysmdda.org/TILESET.html); [TE4 engine description](https://te4.org/te4); [Roadwarden developer description](https://moralanxietystudio.com/roadwarden); [Warsim developer description](https://warsimstore.com/pages/what-is-warsim).

Fresh source capture pins Endless Sky at `2a0f7445257e4b47a23a4fed656d5f7a9cd39a7a`, as returned by its GitHub master commit API during this pass. Selected semantic reads, not full-file audit:

- `source/Conversation.cpp:38–120`: optional scene declarations, choices, labels and conditional branch loading; `395–425`: active-choice conditions and branch/action queries; `464–470`: optional scene lookup.
- `source/Mission.cpp:998–1055`: offer checks against current source/location, conditions, failure, repeat count and feasibility of offer/accept/decline/defer actions.

[Pinned conversation source](https://github.com/endless-sky/endless-sky/blob/2a0f7445257e4b47a23a4fed656d5f7a9cd39a7a/source/Conversation.cpp), [pinned mission source](https://github.com/endless-sky/endless-sky/blob/2a0f7445257e4b47a23a4fed656d5f7a9cd39a7a/source/Mission.cpp). These establish specific source behavior, not full runtime rendering, save compatibility or a playthrough.

Existing project reports reread: [Wildermyth](../wildermyth/REPORT.md), [Elin](../elin/REPORT.md), [Naev](../naev/REPORT.md), [RimWorld](../rimworld/REPORT.md), [ToME](../tales-of-maj-eyal/REPORT.md), [Qud](../caves-of-qud/REPORT.md), [Warsim](../warsim/REPORT.md) and [feature scout](../feature-game-scout-2026-10-14/REPORT.md). Earlier recovery findings are attributed to those reports. Their original private input paths were not all confirmed present in this pass, and no current installed package/version equivalence is claimed.

Full captured source files and selected primary documentation are retained in [private reference index](private/README.md), with byte sizes, SHA-256 values, URLs and UTC capture time in its manifest. Raw sources and page text remain gitignored. Public notes paraphrase. No personal saves were inspected.

## D1: Portraits are an optional presentation layer

The earlier format recommendation mentioned portraits without defining their production cost. Correct that assumption now: unique finished portraits for every person are unnecessary. A good name, recognizable voice, relationship, remembered act and consistent visual token can establish identity.

| Code | Art strategy | Benefit | Actual cost or limit | Proposed role |
| --- | --- | --- | --- | --- |
| P1 | Text/name plus stable neutral token | Broadest support; immediate authoring; unusual bodies remain possible | Less facial recognition | Valid baseline for every character |
| P2 | Reusable symbolic tokens or restrained silhouettes | Clear participants and scene composition with a small asset set | Can accidentally imply faction, species or role the player does not know | Early scene/map representation using admitted appearance only |
| P3 | Layered faces/busts | Many consistent combinations from a reusable library; selected scars/hair/clothes can change | Parts must align; combinations need compatibility checks; new body families need additional art or fallback | Most promising scalable portrait approach if a small trial succeeds |
| P4 | Curated static illustrated portraits | Strong atmosphere and recognition | Outfit, age and transformation variants multiply review work | Selected recurring characters; art never gates their mechanics |
| P5 | AI-generated portraits cached as assets | Can help create selected original portraits or source art for a kit | Identity drift, style mismatch, corrections, hands/anatomy, crops and variant consistency still need review | Optional production tool, not per-encounter runtime dependency |
| P6 | Rigged 3D characters rendered as portraits | Potentially reusable expressions, clothing and camera poses | Models, rigs, materials, nonhuman bodies and rendering pipeline create substantial setup/maintenance | Park unless chosen visual needs justify it |

Wildermyth's documentation explicitly describes PNG layers, separate body/head/item groups, tints and aspect-conditioned layers. This is a concrete alternative to unique flattened art. Its alternate-race documentation also exposes the cost: a new rig can require new compatible assets. CDDA's tileset documentation provides filler and fallback ASCII sprites, showing that art coverage can improve incrementally. These establish possibilities, not a ready-made YAIR portrait library.

## D2: Recommended art allocation

Begin with readable text, stable tokens and a coherent restrained palette. Spend optional illustration work on reusable locations, facilities and major scene backgrounds as well as recurring people; a location image can support many encounters. Portrait work is a lower-priority optional experiment, not the next required slice. Use bespoke portraits where they visibly improve recognition or attachment. Unillustrated people remain equally eligible for important story roles.

Generate or draw reusable compatible parts if that proves easier than maintaining complete images, but generated parts still need consistent anchor points, masks and lighting. A universal humanoid portrait generator is not required for eggs, beasts, spirits or unusual bodies. Each can use a suitable family, an original static illustration, a neutral token or text.

## R1–R8: Subtle costs and opportunities

| Code | Consideration | Account for now |
| --- | --- | --- |
| R1 | Identity, body and visible guise differ | Reuse the character's identity while presenting only their presently observable appearance. A disguise must not expose a hidden identity through a familiar asset or filename-derived label |
| R2 | Rendering must not rewrite simulation | Art reads known appearance; a portrait generator cannot invent a permanent scar, ancestry or equipment bonus just to fill the picture |
| R3 | Stable presentation versus regeneration | Persist resolved appearance choices and asset/part references where needed; a seed alone may change the face when algorithms or part ordering change. Pin revisions and retain known assets. Do not reroll on load |
| R4 | Detail can reveal importance | If only secretly important NPCs get unique art, presentation leaks story status. Choose art allocation without turning it into a reliable secret detector |
| R5 | World style versus traveler continuity | Backgrounds and framing can differ across worlds while recurring identity remains recognizable. A new art style need not imply a new body or reset |
| R6 | Runtime generation latency and continuity | Optional background art generation must never block an action, save or scene. A neutral fallback should preserve play; no service/API is selected or billed by this proposal |
| R7 | Narrative repetition | Reuse scene structures with actual participants and circumstances, not only names swapped into identical dialogue. Stable character motives and consequences matter more than a large combination count |
| R8 | Asset formats and reuse | Open-source code, proprietary decompiled code, game data and artwork are different inputs. This pass recommends original adaptation, not bulk copying. If actual reuse is selected, check that exact file's terms and attribution; ToME's existing report already records distinct code/media terms |

## D3: How the examples choose their representation

These are interpretations of documented design and mechanisms, not claims to know every developer's internal decision process:

- **Wildermyth** makes a changing cast act in reusable authored scenes, so composited characters and role-based casting are a strong fit.
- **Roadwarden** puts emphasis on places, dialogue and preparation, so illustrations and efficient place-to-place travel can serve it without repeated walking.
- **Naev/Endless Sky** support ongoing activity between authored missions, so local eligibility and scene interfaces coexist with a broader explorable world.
- **CDDA/ToME** make spatial state consequential, so a tile or ASCII map exposes rules the player actually uses.
- **Warsim** emphasizes text-first procedural variety, so inexpensive compositional faces can accompany broad content without a realistic portrait pipeline.

For YAIR, decide what the player should repeatedly notice and do, then choose the cheapest clear representation that preserves that experience. The artistic treatment can become richer later without making all content wait for equivalent art coverage.

## A1: Most useful next comparison, not yet implemented

Extend the existing proposed Village presentation comparison, without adding a separate prototype project: show the same recurring people and actual choices in text-only form, in a scene with stable tokens and a reusable place illustration, and with a small composited portrait sample. Include one supported visible appearance change and an art-unavailable fallback. A spatial variant remains useful only if comparing movement itself.

At 1366×768, compare recognition, atmosphere, decision clarity, routine input burden and actual authoring effort. Human response determines whether portraits repay their maintenance cost. Rebuilt gameplay and persistence checks apply if code/state is later changed. None were run here.

Research priority within that possible trial: Wildermyth scene casting/image layers, then Naev/Endless Sky scene integration. Existing Elin and RimWorld findings inform specific world behavior when needed. Avoid another whole-game decompilation wave for a question already answered by readable docs and targeted source.

## B1–B5: Book-world implications and the portrait-light default

Weibao's steering: “consider implications for book worlds and more, portrait should be largely unnecisarry? More to consider?” Answer: yes, portraits should be largely unnecessary. A text-led game should work as a complete experience with no faces at all. Optional art can enhance a particular moment without creating an asset obligation for every resident, age, outfit, body or branch. This reinforces the earlier correction rather than selecting a portrait production pipeline.

| Code | Book-world issue | Proposed treatment | Why it changes the format decision |
| --- | --- | --- | --- |
| B1 | Canon appearance and reader imagination | Preserve sourced details where relevant; distinguish source fact, adaptation and original filling of gaps. Do not silently use an actor's face or a fan design as book canon | Prose can preserve recognizable details while leaving undescribed features open |
| B2 | Character voice and social context | Identify people by name or currently known description, role, present intention, manner of speaking, relationship and remembered actions. Keep distinctive gestures/descriptions selective | Recognition and attachment need continuity more than a portrait. Text needs careful writing rather than constant description repetition |
| B3 | Many timelines, ages, disguises and bodies | Separate continuing person, branch instance, current body, presented identity and observer knowledge. Show only admitted appearance and remembered facts | Portrait variants multiply quickly and can leak a disguise, relationship or hidden continuity; text/tokens need the same observer discipline |
| B4 | A book is a viewpoint, not an exhaustive world database | Track source edition/range and uncertainty. Fill unreported ordinary life with consistent original content, labeled in design records. Canon events become conditional when their causes change | More portraits, chapters or named locations cannot substitute for valid causal state. Do not force the player back onto the protagonist's route |
| B5 | Powers and events exceed ordinary visual scale | Use explicit known targets, conditions and consequences, with local diagrams only where useful. Spatial geometry is modeled when it affects the action | An exceptional body or ability need not wait for a new rig, sprite or animation; a local map must not silently redefine a world-level power |

Owner links: [world-depth palette](../../worlds/WORLD_DEPTH_CONSIDERATIONS_2026-10-13.md), [multiverse structures](../../worlds/MULTIVERSE_STRUCTURES.md), [secrets and discovery](../../worlds/WORLD_SECRETS_AND_DISCOVERY.md), and [book-world direction](../../USER_VISION.md#vision-update-what-weibao-asked-for-2026-10-05-evening-to-2026-10-07). Existing canon-first order and the current slice remain unchanged. No specific franchise mechanic or appearance claim is introduced here.

### B6: Where optional visuals would earn their place

Prefer useful diagrams and atmosphere over mandatory faces: a known-route map, a sourced or original location illustration, a supported ritual/material arrangement, a relationship view limited to known ties, or a timeline of witnessed/heard events. A character list with concise context can be more useful than a wall of faces. Do not draw unknown routes or hidden people simply to fill a map or graph.

Book sources, film adaptations and original branches can have different visual profiles without changing simulation rules. A text-only preference should hide optional images cleanly rather than leave empty portrait frames. Choosing a visual preference must not grant knowledge, change outcomes or require a different save identity.

### B7: Story delivery and away progress

Support different reading speeds: concise current situation, a few meaningful actions, expandable detail, and a journal of what the player actually encountered. Important scenes need distinct pacing; routine activities need concise receipts, batching or eligible automation. A novel's weeks of study can become supported queued progress without turning every day into a compulsory scene. Do not assume that a narrated training montage grants a skill or that closing the page already simulates absence.

Separate the expected canon course from the branch's committed outcomes and from participant knowledge. Foreknowledge may inform player choices without making every character know the source story. A return visit should acknowledge changed people, stock, commitments or access where actually modeled. The presentation cannot restore a canon event whose prerequisites no longer hold.

### B8: Reusable writing without interchangeable worlds

Reuse structural patterns such as asking for instruction, negotiating access, investigating a clue, preparing a journey and resolving a commitment. Give their world-local versions distinct prerequisites, institutions, vocabulary, character intentions and consequences. Swapping names or color palettes alone does not make a world feel like its book. Avoid a generic universal faction, mana or quest model that erases a source's important distinctions.

Keep authored dialogue for voice and meaningful scenes, structured state for costs/consequences, and summaries for routine history. Runtime LLM prose is an optional separate investigation, not a prerequisite for breadth or a trusted source of canon and state. This report selects no external generation service.

### B9: Updated most economical next experiment

Start with one **portrait-free** scene in the current Village slice: known place and participants, clear immediate stakes, ordinary character voice, supported decisions, a visible consequence and a useful later callback. Retain idle work visibility. Compare a compact text presentation with the same scene plus a small known-place map or optional reusable background. Only add a portrait comparison if missing facial recognition emerges as an actual problem.

This tests whether the game feels like living somewhere before incurring an art pipeline. It is still a proposal, not a new gate, implementation order overriding active work, or proof that the current game delivers this experience.

## C1: Proto23 and original YAIR character representation

Follow-up: “consider how characters were done in proto 23 or yair originally, and similar games? What things can make B5 easier and more? Abstractions that could be helpful? Implementing little slices of 2d, like the chinese character map, but there might be better ideas and more?”

**Correction to this discussion's framing:** the Hanzi field is already the preferred local wandering style in [its owner](../../WANDERING_ZONES_AND_INSIGHT.md#chinese-glyph-map-direction-explored-2026-10-02) and [USER_VISION](../../USER_VISION.md#chinese-character-wandering-visualization-2026-10-02). The ink atlas remains a candidate regional overview. This pass may compare useful complementary views but does not demote that accepted preference or select a whole-game glyph reskin.

Fresh static reads distinguish three layers:

| Source | Observed model | Useful lesson | Limit |
| --- | --- | --- | --- |
| Original YAIR, locally cached `upstream/master` at `e3356432ad5112f30842cfe6a6b5c3a4ced77de9`, `src/dialogues.js:7–80,108–155` | A named/described Dialogue contains Textlines with conditions, branches, unlocks/locks and rewards. The elder's opening offers lead into shared later progress | A person can become recognizable through speech, access, help and consequences with no portrait prerequisite. Shared later nodes need not mean identical remembered history | This is a local historical upstream snapshot, not a freshly fetched claim about current upstream. Dialogue/service records alone are not independent simulated lives |
| Existing Proto23 HTML capture, selected `11520–11529,12200–12262,12544–12590` | Chs screens have lifecycle hooks and screen data; local click chains read/write flags and counters. Hub options include conditioned/random encounters. A repeated cat interaction changes a counter and can lead to a retained companion | Small recurring interactions, changing availability, a service, a short voice cue and a remembered change can supply presence cheaply | These are selected source behaviors, not a current playthrough. Inline callbacks and random appearance during screen rebuild are poor defaults for durable, inspectable YAIR content |
| Current YAIR fork, `src/models/npc.js`, `src/components/dialogue_component.js` | NPC extends Person; dialogue, availability and trade are composed. Display name/description and available actions are separate concerns | Extend the person and command models instead of promoting every dialogue scene into a separate character system | The inherited NPC XP multipliers are set to zero; generic NPC growth is not established by extending Person. No native verification here |

Proto23's earlier [dialogue/source report](../proto23/readers-2026-10-10/R5_map_dialogue_time_save.md#5-npcs-dialogue-and-quest-hooks) adds mentor guidance, cross-person errands, ambient chatter and availability tied to conditions. Read that report with its historical-source limits; it is not evidence that every current YAIR system is absent. Current fork source already contains richer person and story models than original upstream.

The best adaptation is **small durable interactions around recognizable people**, with data and validated commands where practical. Reproduce the sense of presence, not the monolithic callback architecture. Do not reroll an encounter just because a map/list view was redrawn.

## C2: Make B5 tractable through bounded causal situations

The earlier B5 concerns adapting a book's course of events after intervention. A larger chapter tree is only one approach, and often an expensive one. Represent the conditions that make a situation possible, the supported actions within it and the results that later situations read. Do not attempt a universal simulation before authoring one useful chain.

| Proposed abstraction | What it owns | Existing YAIR support inspected | Remaining boundary |
| --- | --- | --- | --- |
| **Person and identity** | Continuing identity, current body/guise, actual location, capabilities and relationships | Person/NPC models plus simulation actors/people; causal situations require actual participant references | Multiple models are not automatically one reconciled identity service. Use the chosen host's owner; do not merge them speculatively |
| **Situation** | Participants, place/context, phase, actual prerequisites, pending work and resolution | `causal_situations.js` validates context, participants, phases, transitions and receipts; `causal_story_scenes.js` projects received accounts and actions | A bounded phase model is not an arbitrary plot solver or a complete world copy |
| **Role binding** | Find a currently eligible instructor, witness, carrier or helper for a reusable original scene | Wildermyth's documented casting is the external pattern; YAIR has participant IDs and selected binding functions | A new generic matcher is not established. Keep canon-specific roles fixed where identity matters; a dead named character cannot be silently replaced |
| **Action and means** | Target, concrete capability/equipment/support, cost, time, effect and refusal | Existing host commands and native/simulation owners; causal-story core explicitly leaves actual means to those owners | Add one supported alternate means when useful. Do not claim an arbitrary verb or any power can solve any scene |
| **Outcome and knowledge** | Committed change, its cause, who observed/heard it and later callbacks | `lore_history_state.js` records actual deltas and cause links; `story_aftermath.js` uses delivered/declined request outcomes; causal situations validate attributed knowledge | Current outcome validation is explicitly Village/base.frontier scoped with a finite history. It cannot be advertised as unlimited book-world memory |
| **Conditional event dependency** | An expected event occurs only if its actual causes still hold; later events read settled results | Storylet candidates check requirements/cooldowns/open instances; situations support checked transitions | General canon dependency invalidation and repair are proposed, not proven by these modules |
| **Scene/read model** | What the player sees now and which supported commands are offered | `projectVillageScene` groups admitted actions/accounts; known history is a separate view | A scene renderer cannot supply an unknown fact, revive an actor or settle a job |
| **Local topology** | Meaningful places, connections and optional supported local positions | Existing location graph plus Hanzi integration design | A visual coordinate is not automatically navigable distance, line of sight or travel time |

Recombine story flow while preserving state. If two approaches lead to the same later conversation, that conversation can still read who helped, the actual cost, who knows, and what changed. Branch convergence must not erase differences. Eligibility, rather than a numbered chapter, decides whether an expected later event remains possible.

An original example: a messenger intends to take a document through a pass. Model who has it, whether the messenger can travel, which routes are usable, the supported deadline and who knows the plan. Player help, delay, alternate transport or refusal changes those facts. Later content reads the delivered/missing/late result rather than requiring a wholly separate chapter for every combination. If the document never arrived, a scene premised on its arrival is ineligible. This illustrates the proposal, not an implemented generic messenger system.

World-specific identity and exceptional laws remain explicit. A generic carrier role can work for an original delivery; a source-specific ritual, fate protection, soul link or named person's unique power needs its own supported rule. Ordinary death must not be treated as final where the selected world actually supports another continuity mechanism, and such a mechanism must not be invented just to preserve the expected plot.

## C3: Tools and authoring choices that reduce causal work

Prefer an **author-facing situation card** over a new universal engine: source locator and uncertainty; involved people/place; prerequisites; their current aims; available actions/means; lasting effects; knowledge recipients; interruption/failure; later readers. Reuse existing host definitions where they already express these fields.

Maintain an expected canon course as a conditional reference, separate from the player's committed branch. Mark unsupported consequences and uncertain source detail in design records rather than silently returning the player to canon. Simulate distant activity at the granularity the selected world actually supports; explicit coarse resolution can be useful, but a fabricated detailed offscreen history is not evidence of simulation. Material changes elsewhere still need to affect later eligibility.

The highest-value debugging aid is often “why is this scene available/unavailable?” with prerequisite and cause inspection. A developer view may inspect sealed state, but player previews must stay observer-safe. Add scenario checks for absent participants, changed custody, known versus unknown information, stale choices and a missing prerequisite when a bounded implementation is selected. No new debugger, tests or schema are built here.

External grounding: [Emily Short's discussion](https://emshort.blog/2016/04/12/beyond-branching-quality-based-and-salience-based-narrative-structures/) explains how state-gated storylets avoid enumerating every order of acquiring clues, while also noting content-selection and scale costs. [Yarn Spinner's storylet/saliency primer](https://docs.yarnspinner.dev/3.1/write-yarn-scripts/advanced-scripting/storylets-and-saliency-a-primer) supplies another documented approach to selecting relevant content. These support the pattern, not a recommendation to install a second narrative runtime or randomize all pivotal canon events.

## C4: Small 2D views with different purposes

| Code | View | Best use | Minimum rules needed | Recommendation |
| --- | --- | --- | --- | --- |
| V1 | **Hanzi local field** | Wandering, gathering, tracks, observed people/threats, readable return routes | Real session/target IDs and shared commands; additional movement/exposure rules only if those are part of the slice | Preserve preferred local style; integrate one useful pocket before enlarging it |
| V2 | **Connected-place atlas** | Village/campus/city navigation, access and travel planning | Known native locations and actual connections/travel costs | Complementary regional scale; avoid inventing physical distances from diagram layout |
| V3 | **Scene tableau** | Who is here, a doorway, desk or relevant object, an immediate conversation | Stable participant/object references and supported contextual actions | Cheap candidate for social presence; names/tokens suffice, no free movement required |
| V4 | **Focused spatial encounter** | A chase, crossing, ambush, rescue or tactical fight where position matters | The selected positions/zones, movement, timing and relevant obstacles resolved by gameplay | Later bounded mechanic; unlike a tableau it adds simulation work |
| V5 | **Workbench/ritual diagram** | A supported arrangement, production step or actual magical connection | Inputs, stations/connections and valid operations that affect a result | Use only if arrangement changes supported behavior; ordinary crafting stays efficient |

No one view is globally best. Use topology for “where can I go?”, local glyphs for “what is around me?”, a scene for “who/what can I interact with?”, and a spatial encounter for “where should I move?”. Keep the chosen scene and character/work information visible together at the desktop target. A shared selected target should open the same details in map and list. View switching neither spends time nor redraws random outcomes.

Hito's World remains the closest previously inspected reference, not a confirmed identification of Weibao's original Reddit post. Its [current creator description](https://hito.world/demo) describes ideogram-based representation and English, Chinese and Japanese options. YAIR borrows the visual idea, not the language-learning requirement. Glyph labels need readable English inspection and stable accessible names; Chinese symbols need not label every UI control.

## C5: Recommended bounded follow-through, later

Connect **one real situation to one small view**, preserving the existing controls: show supported known participants/objects in a Village scene or one wandering pocket, let selection expose existing actions, settle an actual choice, then show a later callback from the committed outcome. Prefer the current slice's ready host; do not require a new gathering/tactics simulation merely to get a map on screen.

At 1366×768, the result should make location, people, available actions and current work clearer. Rebuild and exercise the actual commands; verify save/reload/import when persistent state changes; human review decides whether it feels more situated. All remain proposed and unperformed here. The dependency and art comparisons do not reprioritize active work or authorize engine replacement.
