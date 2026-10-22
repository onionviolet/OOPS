# itch research: open gaps for future work, 2026-10-22

Weibao asked to save the remaining gaps from the itch.io research wave so they
can be picked up later. This file consolidates them. Each batch's own "Gap
ledger" keeps the full rows with locators. The
[YAIR gap check](YAIR_GAP_CHECK.md) keeps the YAIR-side verdicts. The
[play queue](PLAY_QUEUE.md) keeps the games and their play checks. Nothing
here is accepted direction (AD32). Codes `OG1`+ are stable; extend them, do
not restart them.

Status words: **open** (readable, not yet done), **blocked** (needs a tool
fix or route first), **play** (only play can settle it), **closed-unreachable**
(server-side, download-only or unreadable, recorded so nobody retries blindly).

## OG-A: tool gaps that block several reads

Fixing these unlocks code in several batches at once.

| Code | Gap | Blocks | Next step | Done check |
| --- | --- | --- | --- | --- |
| OG1 | The shared Godot decoder (`~/.codex/research/idle-reincarnator/tools/decode_gdc.py`) asserts bytecode v101. Godot 4.3 (v100) builds fail. The crafting batch patched a private copy for Stacksmith. | Cartographomancer (EXPLORE); possibly POTION Godot builds | Fold the patched variant into the shared tool with a version table, then record it in `docs/TOOL_REGISTRY.md` | Cartographomancer scripts decode with zero errors |
| OG2 | Il2CppDumper and Cpp2IL cannot handle Unity metadata v39 or v108. Auto mode failed on a v31 wasm. Cpp2IL gave signatures with empty bodies. | Slime Reborn, Surviving Magic Academy, Terraformental bodies (LIFE_B); Beggar's Life code (LIFE_A) | Check for newer dumper releases supporting v39/v108 and wasm call analysis, through `scripts/toolsets.py doctor --probe` | One of these builds yields method bodies |
| OG3 | Il2CppDumper was not run on several IL2CPP builds whose metadata was downloaded. | Looper consequence table (MAGIC); Path Past The Mountain, Stoneheart Archive, Astroecologist (EXPLORE); Levers of Democracy (ECONOMY) | Run the dumper on each saved `global-metadata.dat` | Each gets type and method names, or a stated failure |
| OG4 | Craftomation 101's pack is encrypted. The published engine key failed in three byte orders. | CRAFTING | Low priority. Retry only if a key route appears. | n/a |

## OG-B: readable work not yet done

These five sessions never received the gap-pass message (it was paused by
the app), so their gaps come from each batch's own verification lines rather
than a ledger:

| Code | Batch | Open gap |
| --- | --- | --- |
| OG5 | [CULT_REST](BATCH_CULT_REST.md) | Four titles not read: Dao of the Endless Sky, Nivrael, Text Cultivation, The Left Hand refers to the moon. Idle Xanxia combat formulas and Quest of Qinghe's battle engine only partly read. |
| OG6 | [LIFE_A](BATCH_LIFE_A.md) | Incremortal routine unlock not traced. Lifeidle event prose, Lowmoor sea nodes, Town Tycoon fishing and ski, God of Ashes event prose unread. Beggar's Life code blocked by OG2. |
| OG7 | [POTION](BATCH_POTION.md) | Method bodies of the Godot builds (CHROMA, Alchemyst Apprentice), which should be readable with OG1. Hidden Grimoire logic is minified Dart, so only constants were read. Unity builds (Herbarium, Pestis Apotheca, Potion Seller) are names and assets only. |
| OG8 | [PROCGEN](BATCH_PROCGEN.md) | Eigengrau factions and plot hooks. Talk of the Town `person.py` and its knowledge model beyond `mind.py`. Nothing Beside Remains text not recovered (no type trees). |
| OG9 | [SCOUT](BATCH_SCOUT.md) | Peasant to King beyond its help text. Whether Noble's player build calls its LLM client is still undetermined. |

From the ledgers that do exist, the open and readable items worth doing:

| Code | Batch | Open gap |
| --- | --- | --- |
| OG10 | [BROAD](BATCH_BROAD.md) | Medieval Merchant Simulator: trace where a hired spouse's pay comes from (payroll code located, pay source not traced). |
| OG11 | [MAGIC](BATCH_MAGIC.md) | Tasks of the Spell Looper: the key from a rune combo to its consequence line (needs OG3). |
| OG12 | [EXPLORE](BATCH_EXPLORE.md) | Far Beyond The Mountain, the original game, not yet located. |
| OG13 | [BROAD](BATCH_BROAD.md) | Promote any of the about 23 listing-only titles (the screen table's later rows) if a later topic needs them. |

Items marked low value in the ledgers stay there and are not repeated here.

## OG-C: needs play

Static reading cannot settle these. They are tied to rows in the
[play queue](PLAY_QUEUE.md):

- Feel and pacing for every decoded game. No game code was ever executed.
- Idle Fantasy Shop: is the acceptance breakdown shown to the player?
- Medieval Merchant Simulator: what the serf and free status does to loyalty.
- Hacksmith: does the shaping step read as shaping?
- Age of Iteration: wear decay feel.
- Runemaster: does compatibility actually prune the build menu?
- Looper: does the rune's aspect affect the outcome?
- DRGN scene variety, Grim Brood hide reading, Cat Cove Inn matching.
- Path Past The Mountain: the pedometer error model.
- Cartographomancer: noise on walkers.
- Stoneheart: do restored settlements change on revisit?
- Emerald Woods: does the per-run explanation change?
- Path of the Idle Cultivator: real-time arena, Weapon God fights, Archon
  scripts.
- Great Expanse: the AI-assisted claim (needs the developer's statement or
  play).
- Parser and detective games (Hadean Lands, Anchorhead, Teide and others):
  story files are not readable source.

## OG-D: closed-unreachable

Recorded so nobody retries blindly. Reasons are in each ledger.

- **Server-side:** the Fate system and duels in Path of the Idle Cultivator;
  Ascension Tower's rules; Coop Catacombs (PHP/MySQL); princi-pal judging;
  Beanlings Wildlands; DOGMA++; The Liars' Line; Office Immortal sync. Also
  Heavenly Path's Living Jianghu and Sects Become Real, which are not in the
  served build.
- **Download-only or no web build:** Sovereign Tower, Flawed Heist, The Gods
  are Hungry, Alchemyst Apprentice's Windows zip, and six magic titles listed
  in BATCH_MAGIC. These would need Weibao to download them; agents do not
  download native builds.
- **Unreadable as served:** Path of the Idle Cultivator's changelog before
  0.3.5 and its Steam mod loader; Little Chef recipe values (IL2CPP, not
  serialized); Terraformental localisation CSVs; Godot wasm engine binaries.

## OG-E: YAIR-side gaps (design follow-ups, not research)

From the [YAIR gap check](YAIR_GAP_CHECK.md): 74 claims, 33 confirmed gaps,
25 partial, 11 already exist, 5 unclear. The most consequential confirmed
gaps:

| Code | Gap | Related proposal |
| --- | --- | --- |
| OG14 | No chronic conditions or isolation effects | IM30/IM31 flat-gauge checklist; EMERGENT (BROAD) |
| OG15 | The heir is a single successor with no inheritance law or parentage traits | IM3, IM8; Kinfolks, My Cultivation Sect |
| OG16 | No standing routines or unlocks from completion counts | Incremortal (LIFE_A) |
| OG17 | No credit, insurance, market memory or faction tiers | IM32; Silver Way, The Debt Ledger (ECONOMY) |
| OG18 | No cross-life discovery codex | IM21; Hidden Grimoire, Cycle of the First Dawn |

Unclear items to resolve:

- **G08:** the flat-gauge run (IM31).
- **G38:** a delayed-letter evidence route. An event feed exists in
  `src/event_feed.js`, but no letter route was found.
- **G45:** a mood, feature and terrain prompt triple.
- **G66:** "7 files" of weight modifiers. This claim is probably wrong.
- **G11:** the lethal-task guard for away time. Largely moot under AD16 and
  AD19.

Spatial homes stay deferred under AD33, which also deprioritizes the
NPC-heavy gaps.

## OG-F: proposal backlog

The LATER / DELEGATE rows in the
[screen report](../ITCH_IO_IDLE_SCREEN_2026-10-22.md) are the build-side
follow-ups, each with level, effort and done check:

- IM8 to IM13 (round 1)
- IM21 to IM26 (round 2)
- IM31 to IM33 (round 3)

Pick by sequencing against PROJECT.md priorities, not by this list's order.
