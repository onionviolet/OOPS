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

## Gap pass additions (2026-10-22)

- **Runemaster per-rune stats (closed)**: bases are Fire (hit 2-6, over-time 1-2, 1 mana, 50 percent ailment for 4 turns), Ice (3-5, 1 mana, 30 percent, 2 turns), Thunder (1-11, 30 percent, 3 turns), Light (2-4, no ailment), Dark (no hit, over-time 1-2, 100 percent ailment for 6 turns, no crits), plus Earth and Air as utility. Shape runes Sphere, Ray, Area and Trap (trap +20 percent damage) and 20 or so supports (Hit: +50 percent hit and +60 percent mana, removes over-time; Chain: -40 percent damage and +20 percent mana; Fear: 40 percent flee chance, -30 percent damage, +40 percent mana). Compatibility is not symmetric: Fear and others omit Earth, Trap accepts only the seven elements. Elemental monsters subtract their own element from incoming spell damage (fire 20-25, ice 10-15, dark 5-10), so element choice matters against matching monsters. Every hit has a flat 20 percent base resist roll plus equipment bonuses.
- **Mimimage (partly closed, GameMaker JS, 5.1 MB, readable identifiers)**: runes feed per-spell numeric axes held in a persistent controller indexed by spell number: move, lift, up, boost, fire, ice, lightning, time, portal, protect, aim, number, monster, copy, charge, chaos, water, death, circle, growth and a few more. About 25 spell objects (homing, shield, bubble shield, twister, telekinesis, slow time, copy, ice, fire, magma, explosion, cure, chicken, crystal, portal, shadow form and others) read those axes in formulas such as "ice plus boost times 0.5" or "protect scales shield strength". Ten rune slots track whether each rune was found. So composition is additive axes that different spell objects interpret, not named recipes. Per-rune axis assignments were not traced.
- **Looper (partly closed)**: effect vocabulary visible in strings includes Luck, Ward, Charisma, Life, Death, Love, Peace, Fire, Heat, Cold, Strike, Weak, Corrupt; aspect vocabulary Pure, Regular, Powerful, Strange, Corrupt. Feedback lines come in three kinds: client reaction to the cast ("I would have preferred a stronger Ward"), a news-style outcome headline, and an ending epilogue. Roughly 1,000 strings total, matching the authors' 900-line claim. The key from (effect, target, aspect) to line is not recoverable: typetree is stripped and scripts are il2cpp.

## Gap ledger

| Gap | Status | Evidence or locator |
|---|---|---|
| Runemaster per-rune stats | closed | `private/magic/runemaster/Rune*.js`, `EntityElemental*.js` |
| Runemaster unread monsters and maps | low value: no magic mechanism beyond elemental reduction | file list in `runemaster/list.txt` |
| Looper consequence table text | closed as a string dump (no key) | `private/magic/looper/rawstrs.txt` |
| Looper key from rune combo to line, rune count | unreadable: UnityPy typetree stripped, scripts il2cpp, Il2CppDumper not run | `looper/web/data.unity3d`, `global-metadata.dat` 10.4 MB present |
| Looper aspect effect on outcome | needs play | tutorial lines 115-127 of `rawstrs.txt` |
| Mimimage per-rune axes | low value: GameMaker minified identifiers; trace is long for little new idea | `private/magic/mimi/m.js` |
| Witches' Rune | low value: GDevelop divination generator, hover text only | `private/magic/NOTES.md` |
| Echoes of Syntax, Unchained Mage, Demortal, Of Mist and Shadows, Lingua Magica, Runelite | unreadable by rule: download only | page reads in `private/magic/page_*.html` |
| Spellscriber, Spellslinger of Xandabar, RuneCode, Runic Conjecture | server-side or off-itch / search snippet only | not fetched |
| Etsa Djavul glyph data and level phrases | low value: binary scene resources, mechanism already read | `etsa/pck_strings.txt` |
| Whether Runemaster compatibility prunes the build menu in practice | needs play | StateCreateSpell.js |
