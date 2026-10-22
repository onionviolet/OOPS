# Batch summary: magic systems, 2026-10-22

Genre audit by the magic chat. Static reads only, nothing executed, nothing committed. Everything is a proposal (AD32). Raw files and locators: `private/magic/NOTES.md` (gitignored).

## Screen (about 30 titles)

Dedupe: none of these appear in the itch screen or earlier batches except Wizard Cats (Steam widget only, already dropped in BATCH_SCOUT). YAIR already covers magic as a making and crafting concern (MR rules for runes, enchanting and formations; `docs/CRAFTING_ENGINE.md` PR6 "magic input as an ingredient role"; `src/techniques.js`), so only mechanisms new to those owners are listed.

| Title | Route | Why it matters | Read? |
|---|---|---|---|
| Runemaster (samelinux, 7DRL 2021) | browser, plain JS | Rune-composed spells, element picks ending | Decoded |
| Tasks of the Spell Looper (Excalibur277) | browser, Unity | Effect-Target-Aspect, karma exhaustion | Decoded (strings) |
| Etsa Djavul (foolmoron, LD55) | browser, Godot | Infer a rune language from examples | Decoded |
| Witches' Rune (Yuzu Miu) | browser, GDevelop | Divination generator, hover meanings | Page and build identity only |
| Mimimage (Diego Palacios) | browser, GameMaker | Combine runes into spells, platformer | Page only |
| Echoes of Syntax (gmaker) | download | Noun, verb, adjective spells | Page only |
| The Last Great Mage / Unchained Mage (SolaceRune) | download | Carriers, modifiers, essences, proficiency | Page only |
| Of Mist and Shadows (Nomad Hermit) | download | Write magic words with real syntax, grammar book, words found in dungeon | Search snippet only |
| Lingua Magica (spritermino) | download | Learn the language of magic for puzzles | Search snippet only |
| Demortal (Honk1n) | download | Spells as code, a ritual with a bug | Page only |
| Wizard Spells (wolficheart) | browser, GameMaker | Join letters to make objects, disenchant back | Page only |
| Salvia's Scroll Atelier | browser | Spellbook, channel into scrolls, sell | Page only |
| Spellscriber (Cloaked Games) | devlog | Rune order on tablets is a tiny program | Search snippet only |
| Magic Runes (braintraining) | browser | Ordered rune sequence restores colors | Page only; shallow |
| Others screened and dropped (shallow, native-only or not spell systems) | | Runemage, RuneMage Alpha, Runes of Power, Runelite, Clair de Rune, Tryggr, ORD, Apophatic, Abracademy, Shapeshifting Sorcery, Spellslinger of Xandabar (own site), RuneCode, The Runic Conjecture, Weedbox, Runes of Chaos | |

Not found: no open-source GitHub browser game with composed spells turned up in three searches; Runemaster's source is readable but carries no license.

## Decoded games

### Runemaster (samelinux.itch.io/runemaster)
Build: itch html 3518958, 173 plain JS files, no bundling. Engine: hand-rolled canvas. Readability: plain. License: none stated (ideas only). The author calls the code messy.

- **Systems (source)**:
  - A spell is an ordered list of runes. The first must be a base rune (an element or kind); each later rune is allowed only if every rune already in the spell appears in its own compatibility list. Compatibility is therefore a pairwise whitelist, checked as you build, and the build screen filters the backpack to legal next runes.
  - Runes are additive records, not branches: shape flags (projectile, ray, area, summon, trap), radius, ailment chance and duration, crit, hit and over-time damage multipliers, and a mana multiplier. Support runes like Focus, Fork, Double, Culling, Blood and Proliferation trade damage against mana (examples in the descriptions: 30 percent more damage for 40 percent more mana; fork to two more targets at 50 percent less damage; spend life instead of mana). Cost and description are recomputed live into a spell card.
  - Same rune, different spell by composition: a lone Thunder rune cast on yourself restores mana; a lone Earth rune turns a wall tile to dirt; a lone Air rune teleports you; Light cast on yourself reverses the damage sign and heals. Single-rune spells are world-state tools, not weak attacks.
  - Dark base rune zeroes critical chance. Ailment spread (Proliferation) only works with Fire and one other base rune.
  - Unmaking: a rune whose description says nobody knows its effect, compatible only with elemental runes. A spell with Unmaking in second place is not cast at all; selecting it ends the run into a victory state chosen by the first rune's element. So the elemental choice at the start selects among multiple endings (stated in page text and found in code).
  - Recall rune: given to apprentices, returns you to the temple on death. Elements rune: lets you carry more than one elemental base rune, so the default is one element per character.
- **Representations**: a "?" key opens context help per screen; spell name is the rune nicknames joined by slashes; the spell card prints mana, damage type, hit and over-time ranges, crit and each rune's text.
- **Improvements**: author states a rewrite would add more runes, monsters and items; nothing else.
- **YAIR mapping**: MR rules and CRAFTING_ENGINE PR6 already treat a spell as a crafted thing with cost; `src/techniques.js` is the owner for any composition surface. New for YAIR: (1) compatibility as a whitelist per rune, so illegal combinations never appear rather than failing; (2) the "lone modifier-free rune does a world action" pattern (AD38: things work by how they work); (3) an unknown-effect slot whose result depends on a distinguishing input and ends a life chapter, a fit for a world's unlock or ending condition. I did not find composed-spell code in YAIR `src` (greps for spell and rune hit 42 files, mostly content strings); I did not verify each.
- **Worth playing?** Yes, 15 minutes. Confirm that the compatibility filter actually prunes the choices in the build screen and that the lone-rune actions (Earth, Air, Thunder) are discoverable from the descriptions alone.

### Tasks of the Spell Looper (excalibur277.itch.io/tasks-of-the-spell-looper)
Build: itch html 14528628, Unity WebGL (URP), 33.8 MB data served uncompressed, il2cpp wasm. Readability: engine-compiled; scenes unparseable with UnityPy here (typetree stripped), so only strings were read. License: none stated.

- **Systems (source, from tutorial and request text)**: a client brings a problem; you build up to five spells per request, each as Effect, then Target, then Aspect in that fixed order (aspects named in text include normal, powerful, corrupted; corrupted or powerful can change a rune's nature). Locking a rune on a spinning loop burns it out until the rune opposite on the loop is used. That is the karma balance: a Self target spent now must be restored by casting on something else first. Tutorial says not all spells in a request help; page says side effects are encouraged. Clients ask for compromised wishes (cure a dog, win gambling, make someone fall out of love, get a colleague's job), and about 900 hand-written consequence lines are keyed to the combinations (stated by the authors; I saw a sample of lines, not the table).
- **stated-not-found**: the combination-to-consequence table and rune count; the mapping from request to accepted spells.
- **Representations**: a Tab symbol reference showing each rune's meaning; runes exhausted visibly on the wheel; consequences as newspaper style headlines.
- **YAIR mapping**: owner would be a world's magic law (AD1, AD3, AD38) plus the chronicle (consequence lines are history entries). YAIR has no rune-pair exhaustion grammar that I found. New: **opposition recharge** (using a rune's opposite restores it) as a world-specific cost, and **three-slot grammar with consequences as prose**. The 900-line table shows combinatorial output is feasible with templated lines per slot pair.
- **Worth playing?** Yes, short. Confirm that burned-out runes force varied play rather than a fixed rotation, and whether the consequence text depends on all three slots or only the effect.

### Etsa Djavul (foolmoron.itch.io/etsa-djavul)
Build: itch html 10198112, Godot 4.2 web, index.pck 412 KB with GDScript left as text. Readability: engine-compiled but scripts readable via strings. License: none stated.

- **Systems (source)**: 34 levels. Each level is a stone tablet with a phrase made of rune entries; hint levels give a phrase and you trace its glyphs; empty levels you complete by extending patterns. The player draws strokes with the mouse; strokes whose bounding boxes overlap group into one glyph. Matching compares normalized point sets with a nearest-point error, tolerant of rotation and flips, with a per-glyph error limit (0.09). Each rune record carries word forms: plain, plural, genitive, genitive plural, accusative, accusative plural, and a negation prefix. Genitive entries swap places with the preceding word when the phrase is built, so word order is part of the language. Completion persists per level.
- **Representations**: glyph is the only interface; no dictionary; the player infers meaning from paired examples.
- **Improvements**: tips on the page say a near-match may be accepted and to thicken or double lines, i.e. recognition is lenient by design.
- **YAIR mapping**: relevant to unknown-versus-known effects in magic UI and to the Q of partial knowledge. New: a **language learned by contrast, with morphology (case, number, negation) and reordering rules**, as the research task of a world with written magic. Fits MR runes/formations and a "decipher" skill track; a lighter YAIR version would be a clue table with confidence rather than freehand drawing. No equivalent found in `src`; not grepped exhaustively.
- **Worth playing?** Yes, 10 minutes. Confirm the rules are inferable from examples without outside help, and how forgiving the stroke matcher is on a trackpad.

## Thin reads
- **Witches' Rune**: GDevelop divination generator; click casts a rune, hover shows meaning. Nothing systemic.
- **Mimimage**: GameMaker JS build, compiled; page says runes combine into unique spells in a platformer. Not decoded.
- **Download-only** (skipped by rule): Echoes of Syntax, Unchained Mage, Of Mist and Shadows, Lingua Magica, Demortal, Runelite. Of Mist and Shadows and Lingua Magica are the closest to a true magic grammar by their descriptions and are the best candidates if Weibao wants to play them locally.

## Top findings
1. **Whitelist compatibility per component** (Runemaster): the builder shows only legal next runes; costs and multipliers aggregate. Cheap way to keep any composition surface finite.
2. **Single-component spells as world-state actions** (Runemaster): Earth opens walls, Air relocates, Thunder restores mana, Light on self heals. Matches AD38.
3. **Opposition recharge** (Spell Looper): spent runes return only when their opposite is used, tying cost to the world's balance instead of mana.
4. **Conlang puzzle with case and negation** (Etsa Djavul): a magic language learnable by contrast.
5. **Unknown rune whose result depends on its context and ends a chapter** (Runemaster Unmaking): a ready pattern for sealed endings.

## Verification
Read: Runemaster's SpellWithRunes, Rune, RuneModifier, StateSpellbook, Entity.sufferSpellDamage and rune descriptions; Etsa Djavul's pck strings (Rune, Level, Drawing, DrawArea); Spell Looper raw strings from data.unity3d. Not read: Runemaster per-rune stats and monster files; Looper consequence table and scenes (UnityPy typetree stripped, il2cpp not dumped); every download-only title. About 40 tool calls, itch page requests spaced 5 s; no 429s. No game code executed.
