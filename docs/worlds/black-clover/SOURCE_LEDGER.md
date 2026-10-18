# Black Clover source ledger

## Source policy

The research corpus is the Black Clover Wiki in the WikiTeam Internet Archive snapshot dated 2023-12-24. Every citation below names the page title and revision ID, the requested citation form. The wiki is secondary; manga-cited sections remain wiki reports of manga claims, not direct chapter verification. Anime, film, game, novel and guidebook claims are never merged into manga mechanics. Pages that cite chapters after the represented snapshot boundary are excluded from this synthesis unless the snapshot's own dated metadata confirms the chapter was already published by the snapshot date.

No tracked file contains raw source prose. Paraphrases are kept short. Source facts, analyst inference, proposals and unresolved facts have separate labels.

## Coverage and source identity

| Evidence | Coverage |
|---|---|
| Full selected-page reads | Reader completed 1,102 retained inputs in manifest order, 4,655,809 selected characters, chunks no larger than 4,500. Read ledger and notes match every retained title/revision. “Full” means full selected payload/article, not full manga, every linked page, or all media. |
| Scope audit | 230 character articles checked for additional named mechanic headings; limitation: unheaded mechanics are not comprehensively proven captured. |
| Non-character audit | 161 private page bodies metadata-verified as characters with mechanic-span receipts; bodies were not claimed as additional semantic full reads. |
| Unexpanded template | `Black Clover Wiki` rev92682 is a short portal/transclusion; template bodies were not expanded. |
| Primary sources | Manga volumes/chapters were not read directly in this synthesis. Primary authentication remains open. |
| Temporal boundary | Snapshot is 2023-12-24. Later manga is outside scope. The dated issue-list page rev96110 itself places chapters 345–368 in 2023 and cites chapter 368 in its 2023-12-24 entry. Do not infer publication dates from chapter numbers alone. |

Readers: `docs/research/power-systems/wiki-digests/full-dumps/workers/black-clover-full/{NOTES.jsonl,READ_LEDGER.jsonl,SUMMARY.md,NOTE_CORRECTIONS.md}` (git-ignored). Prior digest: `docs/research/power-systems/wiki-digests/DIGEST_black-clover.md` was `blocked_no_revision` and its mappings were explicitly unverified; this new frozen dump supersedes that evidence status, not the digest file.

## Core source claims checked against payloads

These are source facts as stated by the cited wiki pages, not direct manga authentication.

| Source fact | Payload checked |
|---|---|
| **Source fact:** Asta is described as having no mana and being unable to use magic; the page links this to Anti Magic use without magic-drain weakening and being undetectable to mana sensors. | Asta rev96080; full selected page payload opened and read at relevant sections. |
| **Source fact:** Rune arrays encode spell instructions; complexity takes longer, poor/hasty drawing can fail or explode, and arrays usually disappear after one use while carved arrays may be reused. | Rune array rev93898; full payload checked directly. |
| **Source fact:** Mana Method uses natural mana for rune arrays; Fifth Stage and below cannot form them properly, combat use needs Third Stage or higher, and high personal magic/power, instincts and reflexes are also stated. | Mana Method rev86194; full payload checked directly. |
| **Source fact:** Ultimate Magic requires knowledge of souls' origin and physically drawing near mana; humans can reach it artificially through Mana Method and True Magic. | Ultimate Magic rev83638; full payload checked directly. |
| **Source fact:** Soul Chain Deathmatch requires a full-body array and a fireball hitting the opponent's chest; the link persists after mana exhaustion, ends at unconsciousness, can be disrupted by outside mages, and its array is one-use. | Soul Chain Deathmatch rev95746; full payload checked directly. |
| **Source fact:** Spatial Mana Domination has three listed counters: equal magic power, mana affinity plus greater control, or a spatial mage's mastered Spatial Mana Zone. | Spatial Mana Domination rev95846; full payload checked directly. |
| **Source fact:** Unite follows the Devil-Binding Ritual; master-servant and equal contracts differ, and equal contracts require synchronized thought/intent. | Unite rev96045; full payload checked directly. Details should be cross-checked with the dedicated ritual and chapter/event pages before implementation. |

## High-use revision index

| Topic | Wiki page, revision | Claim class / caveat |
|---|---|---|
| Main character / Anti Magic | Asta rev96080 | Manga-cited claims plus separately attributed novel/anime and game material. |
| Grimoire ceremony | Grimoire Acceptance Ceremony rev89662 | Manga and anime cited; use only the manga-cited ceremony event. |
| Kingdom class structure | Clover Kingdom rev93261 | Manga narrative mixed with guidebook data; label individual claims. |
| Wizard King / merit | Wizard King rev93541 | Manga-cited institutional description. |
| Squad missions/stars | Black Bull rev95897; Golden Dawn rev95977 | Manga-cited institution/mission information. |
| Mana sensing / Ki | Ki rev95847; Mana Zone rev94318; Mana Skin rev96042 | Distinct methods; mana sensing is not Ki. |
| Arrays | Rune array rev93898 | Includes exact failure/reuse conditions. |
| Heart training | Mana Method rev86194; Heart Kingdom rev95598 | Explicit stage and natural-mana gates. |
| Ultimate Magic | Ultimate Magic rev83638 | “Ultimate magic” term on Yami's page can mean a different phrase; do not conflate. |
| Spatial counter | Spatial Mana Domination rev95846 | Exact counters retained. |
| Spirit route | Spirit Magic rev96046; Spirit Dive rev92818 | Contracts/transfer and Saint Stage prerequisites remain separate. |
| Devil route | Unite rev96045; Unite Mode: Canis rev95782; Equus rev95783; Felis rev95784; Gallus rev95785 | Different devils/forms; do not assume modes are interchangeable. |
| Anti Magic weapons | Demon-Slayer Sword rev95749; Demon-Dweller Sword rev95908; Demon-Destroyer Sword rev95860; Demon-Slasher: Infinite Slash Equinox rev95744; Anti Magic Weapon rev95931 | Weapon-specific properties. |
| Dungeon | Dungeon rev95914 | Main article lists anime-only locations separately. |
| Regions | Kikka rev89445; Royal Capital rev86147; Kiten rev87080; Heart Kingdom rev95598; Diamond Kingdom rev93303; Spade Kingdom rev87964 | Mix of manga, guidebook and other page citations; source page's sub-attribution controls. |
| Healing / delayed death | William Vangeance rev95875; Twilight of Valhalla rev83402 | Do not generalize one ability's timing/limits to all healing. |
| Timeline metadata | List of Weekly Shōnen Jump Issues rev96110 | Secondary publication metadata; supports snapshot cutoff only. |

## Contradictions and corrections kept visible

- **Correction, not a conflict:** `NOTE_CORRECTIONS.md` withdraws earlier claims that Asta/Yuno/Yami notes cite chapters after the snapshot based solely on chapter numbers. Dated issue-list evidence rev96110 directly places ch. 326 (2022-03-14), ch. 355 (2023-03-27), ch. 365 (2023-07-17), and ch. 367 (2023-08-07). Keep the 2023-12-24 snapshot boundary, but do not call these chapters post-snapshot.
- **Actor attribution conflict:** Nacht Faust rev95697's passage for Canis × Felis names Slotos and Plumede, while the dedicated mode page Unite Mode: Canis × Felis rev95780 identifies Gimodelo and Plumede. Keep the disputed participant pair unresolved; do not use that composite as a core ability row. (NOTE_CORRECTIONS.md.)
- **Age discrepancy:** Nacht Faust rev95697 and Morgen Faust rev95708 report different ages for the twins at the summoning incident (Nacht text L59; Morgen text L34–37). Preserve both page attributions; this is not a disagreement about how many twins there were, and no campaign rule depends on the age.
- **Character perspective conflict:** Meshu rev89271's supportive account conflicts with Dazu Tayak rev90752's account of contempt. Treat as conflicting beliefs, not a resolved objective relationship.
- **Achievement conflict:** Princia Funnybunny rev94300's broad undefeated assertion coexists with an account of a Mereoleona reversal (Mereoleona Vermillion rev95968). Scope each statement and source context; do not harmonize it to an absolute record.
- **Continuity attribution:** Moonlight Magic rev95790 L10–12 attributes the basic attribute claim to the Quartet Knights game. Bewitching Moonlight rev95791 L19 attributes its basic control effect to the game, while L21 attributes simultaneous control to the Quartet Knights Side-Story, chapter 6. Keep these claims separately tagged; neither is generic manga canon. Anime-only spell names, film powers, guidebook/profile material and novel indexes also remain individually tagged.
- **Compound-magic medium:** Yami Sukehiro rev96062 L88 cites a chapter 324 example and a separate film-only spell entry. Keep the manga and film instances distinct in downstream compound-magic claims.
- **Source causality correction:** Demon rev85888 and Massacre of the Elf Tribe rev90190 differ in detail. The note correction says reducing negative mana may briefly restore consciousness, and Lemiel separately used a tool to absorb magic before slaying the demon; Demon rev85888 does not establish that the absorption caused lucidity. Keep that causal link as inference, not fact.

## Citation rule for downstream rows

Each fact-bearing row elsewhere in this pack carries at least one `(wiki page title, revID)` citation. If a row is a design abstraction spanning multiple pages, cite each. New fiction has no canon citation and must be labeled proposal. An empty row or missing citation never implies a source prohibition.
