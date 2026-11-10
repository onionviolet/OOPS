# Source kind rules

Working defaults 2026-11-10 under AD56 (ideas that open possibilities are welcome), adjustable; lines listed in the [limiting lines review](audits/LIMITING_LINES_REVIEW_2026-11-10.md) stay proposals until Weibao answers. Drafted as proposals the same day (AD32). Requested by Weibao ("foundational implementation rules for types of worlds and more? also types of source?", [log](gm/USER_VISION_LOG_2026-11.md#world-kind-and-source-kind-rulebooks-2026-11-10)). Rows marked **(restates)** repeat a rule that already binds through its own code and add no authority.

Covers what kind of thing a source is (web novel, light novel, manga, anime, game, tabletop book, databook, wiki, fan fiction, CYOA and jumpchain, community discussion, nonfiction, Weibao's own words, agent and model output) and how that kind shows up in data: provenance on rows, layers that stay apart, which medium answers which question, licence on what ships, and where raw material lives. A world may set any line differently with a reason (AD5); each row gives the default, the dial and the reason.

What Weibao has said: media priorities SM5–SM7 high, SM9 next, anime deferred (2026-10-18); hold the source that runs furthest, prefer text that parses easily, and cross-check a web novel against its rewrite with neither winning by default (2026-11-10, AR56–AR59 in source acquisition tools); nonfiction is "extremely low priority" (2026-11-10); raw book prose stays out of git (AGENTS); original worlds and book references are both allowed design sources.

Owners and neighbours (linked, not restated): WA3, WA8, WA53, WA58, WA61–WA64 in [WORLD_ABSORPTION_RULES](WORLD_ABSORPTION_RULES.md); SM1–SM12 and SM-B1–SM-B9 in the [deep dive playbook](research/SOURCE_DEEP_DIVE_PLAYBOOK.md#more-to-consider-source-media-and-getting-the-most-from-them-2026-10-18); [source acquisition tools](research/SOURCE_ACQUISITION_TOOLS.md) (AR codes there are acquisition rules, not architecture rules); [library index](research/LIBRARY_INDEX.md) and `scripts/library_coverage.py`; [agent usage rules](AGENT_USAGE_RULES.md) AU1–AU15; [WORLD_KIND_RULES](WORLD_KIND_RULES.md) WKR4 (origin decides gap filling). Code: `LICENCE_TIERS` and `REFUSED_LICENCES` in `src/world_pack_manifest.js`; the evidence row shape in `src/world_packs/book_hp_pack.js` (`ev`, `orig`); the free-text `provenance` in `src/world_packs/book_mol_pack.js`.

## Terms

| Term | Means |
| --- | --- |
| Medium | What the source is: web novel, light novel, translation, manga, anime, game, tabletop book, databook, wiki, fan work, discussion, nonfiction, direction, generated |
| Edition | The version inside a medium: WN or LN, translator, volume printing, game patch, rulebook edition, wiki revision date |
| Locator | Where in the source: chapter and paragraph, volume and page, page and panel, episode and timestamp, file and offset, URL and date |
| Status | How a row knows: shown (a scene), stated (a speaker or narrator), inferred (analysis), original (a labelled YAIRPG proposal) |
| Layer | Which pass wrote a row: source extraction, model-read, wiki, fan, community theory, generated fill, agent original, Weibao's direction |

## Provenance on rows

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| SKR1 | **Every fact names its medium, edition and locator.** | Default: a pack keeps a source table (id, medium, edition, hash) and each evidence row points at a source id with a locator, the HP `ev(id, status, locator, speaker, note)` shape. MOL's single `provenance` string folds into that table when a slice touches it. Dial: a world may add fields (speaker, translator). Reason: a fact without its medium cannot be checked when two media disagree. | WA64 (restates the fact rule), SM-A1 |
| SKR2 | **(restates) Status is shown, stated, inferred or original.** | P9 profile rules as used in the HP pack; original rows carry a reason (MR13). | MR13 |
| SKR3 | **Layers stay apart.** A row's layer is data; no layer is written over another. | Default: model-read text (WA63), wiki, fan, community theory and generated fills live in their own rows or files keyed by source, model or generator; a source-extraction row that later confirms one adds a confirmation, it does not erase the lead. Dial: none needed for most worlds. Reason: a fan theory or a model guess quietly becoming canon is the worst provenance failure. | WA63, GR |
| SKR4 | **(restates) Conflicts are two labelled facts.** The world states which it treats as canon for which seat and why; no medium outranks another by default. | WA64, WA58, SM-B7. |
| SKR5 | **(restates) Gaps are records with a locator and class.** | WA61, WA62. |
| SKR6 | **Row tests name their source window.** A test that pins a source-derived row asserts the chapter or arc it came from. | Default: builds on WA53 (proposed); a test that cannot name a window marks its row as authored. Dial: none. Reason: tests then survive a source swap or a later arc. | WA53 |

## Which source for which question

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| SKR7 | **Route each question to the cheapest medium that answers it.** | Default routing: rules, costs and inner life to prose; numbers to games, tabletop books and databooks; look, space and crowds to manga; speech and sound to anime or audio (deferred); daily life to side stories; timelines to a wiki for targeting, then the text to confirm; readings and theories to community discussion, labelled as theory. Dial: Weibao's own picture of a world (SM12) picks the default medium. Reason: SM-B2; each medium is strong at different things. | SM-B2, SM-B8 |
| SKR8 | **(restates) Hold the source that runs furthest and cross-check versions.** Prefer text that parses easily; where a web novel and its rewrite both exist, hold both and cross-check, neither wins by default. | Weibao 2026-11-10; AR56–AR59 in source acquisition tools. |
| SKR9 | **A coverage map per world.** Which arcs exist in which media and editions. | Default: one table per world beside its library rows, built from `library_coverage.py` output; a gap is an uncovered chapter range. Dial: single-medium worlds skip it. Reason: routing (SKR7) needs to know what each medium covers. | SM-B1, library index |
| SKR10 | **(restates) Budget by medium.** Text routes first; images and video sampled only for visual questions. | SM-B9, AU1–AU15. |

## Kinds of source

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| SKR11 | **Game sources give calibration anchors.** Official games and visual novels supply tables, rates and routes. | Default: numbers enter as anchors with game and patch version; shipped values are our own, tuned to those anchors; decompiled or extracted data stays private, and owned games are read read-only. Dial: a direct adaptation Weibao asks for may carry closer numbers. Reason: game balance differs from story canon, and gameplay stays original unless he asks for a direct adaptation. | SM5, research rules, SPR anchors |
| SKR12 | **Tabletop books ship by licence.** | Default: rules under an open licence (`srd-cc-by`, `orc`) may ship with attribution; other books are reference only; edition is the version pin. Dial: per book licence. Reason: `LICENCE_TIERS` already separates what can ship. | SM6, `LICENCE_TIERS` |
| SKR13 | **Fan work, CYOA, jumpchain and discussion are palettes.** | Default: fan fiction and fan quests feed premises and alternative lives (M3); CYOA and jumpchain documents feed the [cheat catalogue](CHEAT_CATALOGUE.md) and start options; forum and Reddit threads are community theory with thread and date. None is canon unless a world picks it for a seat (SKR4). Dial: per world. Reason: these are rich in options and weak in authority. | M3, CHT, SM11 |
| SKR14 | **Databooks and author statements are their own tier.** | Default: a canon tier between main text and supplement, dated, with later statements recorded as revisions. Dial: a world may rank a word-of-God statement above the text with a reason. Reason: they retcon and contradict. | SM7, WA3 |
| SKR15 | **(restates) Nonfiction is extremely low priority.** Real history, science and how-to books are read only for a named gap. | Weibao, 2026-11-10 (DL31, DL33). |
| SKR16 | **Weibao's own words are a source.** | Default: his direction lives in USER_VISION and the direction log; his reading of a world (which version he pictures, what he loved) is a director's note per world that sets defaults without overriding source facts. Dial: he can override a source fact for a world. Reason: SM12; he is the creative director. | SM12, AGENTS role |
| SKR17 | **Agent originals and generated fills say so.** | Default: agent-invented law is an `original` row with a reason; generated fills carry generator `id@rev` and seed and are replaced by a revision when a source fact is found. Dial: none. Reason: the difference between "the book says" and "we chose" must survive into play and saves. | MR13, GR3, GR10, WKR4 |

## Storage and what ships

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| SKR18 | **(restates) Raw material stays private.** Prose, OCR output, subtitles, stills, scans and decompiled data live in gitignored `docs/research/<source>/private/` or `~/.codex/research/`; committed docs paraphrase. | AGENTS, research rules, SM-A2. |
| SKR19 | **(restates) Private research never loads in the game.** | `REFUSED_LICENCES` in the manifest; `fanwork-private` stays out of shipped packs. |
| SKR20 | **Each source kind has one extraction route.** | Default: prose through reader shards (AU13); manga through OCR or a vision read into the model-read layer; games through the decompile standing task; wikis through the wiki route (M4); discussion through a bounded scout that records thread and date. Dial: a better route replaces the old one in the playbook. Reason: one route per kind keeps evidence comparable. | Deep dive playbook M1–M5, tool registry |

## Open details

- Where the per-pack source table lives: proposal, a `references` family in the world pack (not `sources`, which the MOL pack already uses for power sources), so the HP and MOL shapes meet.
- Whether the coverage map (SKR9) becomes a generated file: proposal, yes once two worlds need it.
