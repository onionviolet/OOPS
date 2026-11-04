# d20 rules collection receipt (2026-11-03)

Weibao asked: “Scraping wiki of the two D&D wikis”, then, after Archives of
Nethys refused the polite transport: “Archives of Nethys, we can do the in
browser version”. Scope is the rules families the
[afflictions palette](../../AFFLICTIONS_AND_WEAPON_PROPERTIES_CONSIDERATIONS_2026-11-03.md)
and the [Polyjuice identity palette](../../worlds/HP_POLYJUICE_AND_PERCEIVED_IDENTITY_CONSIDERATIONS_2026-11-03.md)
use, not either whole site. Raw data stays in gitignored `private/`;
committed docs paraphrase and cite. Pathfinder rules text is Paizo's, published
under the OGL (1e) or ORC (2e) as each site states.

## Pathfinder 1e: d20pfsrd (polite transport)

- Route: [collect_d20_polite.py](collect_d20_polite.py) through the
  lncrawl-polite `Client` (one GET at a time, 4-8 s apart, robots checked,
  first refusal closes the host). Data dir: the shared
  `docs/research/novels/power-scout-2026-10-10/transport`.
- Collected: weapon special abilities, complete. That is the index plus 184
  pages, 185 manifest rows in total, from run-2.
- **Host closed, 2026-11-04 01:06:40 UTC** (transport session
  `14f25d1109784ddbadcde09488a43eb2`). Run-2's next section requested
  `/magic-items/magic-armor/magic-armor-special-abilities/` and got HTTP 404. No
  page the site had served linked to that URL; it was typed by hand. The
  transport treats any non-200 as a durable host closure, so
  `www.d20pfsrd.com: unexpected HTTP 404` is now in the shared `state.json`. The
  armor, afflictions, conditions and disguise sections got 0 pages. Every later
  run stops before sending a request. The site did not refuse anything; the
  closure is a collector defect. Reopening it would change the stop state,
  which needs Weibao's explicit say. It is not cleared, and no fresh data
  directory or browser route was used.
- Fix (2026-11-04): the collector fetches only URLs that appeared as links in a
  page the transport holds or fetched in that run. It builds that set locally
  from the cache; anything else is refused before a request. PF1 URLs use the
  trailing-slash form, because all 187 receipts and each page's
  `rel=canonical` use it, and a redirect would also close the host. Checked
  offline with no Client and no network: the 404 URL is refused, and all 13
  PF1 seeds are site-linked. The hand-typed disguise set is dropped. The skills
  and spell sections now find the same pages through the site's own links.
- Reopened 2026-11-04 on Weibao's "Yes, clear it". Only the d20pfsrd entry was
  removed from `state.json`; the other nine closed hosts were left as they
  were, and a `reopened` row went into `requests.jsonl`.
- **Closed again**, same day, during the run-3 probe. Five catalogue pages
  returned 200: magic items, magic armor, *magic armor and shield special
  abilities*, specific armor and specific shields. Then a broken link on the
  site's own magic-armor page, `/magic-items/magic-armor/-Armor-Special-Abilities/`,
  got HTTP 404. A follow pattern that was too broad had picked it up as a
  catalogue page. The closure stands and has not been cleared again. Fix: a
  lint now refuses any PF1 path that is not lowercase slug segments, before a
  request. All 190 earlier 200 URLs pass it and both broken links fail it. The
  armor section now starts at the verified index, which lists 117 ability
  pages, all lint-clean. Remaining risk: any dead link that looks normal still
  closes the host, because the transport treats every 404 as a closure.
- Scope (Weibao, 2026-11-03): "For d20pfsrd, we consider stuff beyond
  weapons too".
- **Browser route, 2026-11-04** (Weibao: "try opening in extension or
  something"; recorded in [source acquisition tools](../SOURCE_ACQUISITION_TOOLS.md)).
  A background built-in-browser tab fetches same-origin pages one at a time,
  4-8 s after each response. Text is extracted in the page and no raw HTML is
  kept. Dumps go to `private/browser-dumps/` and are folded into the manifest
  with `--import-browser`; those rows carry `route: browser`. Every catalogue
  URL came from links on pages the site served. Catalogue pages: magic items,
  gamemastering, conditions, skills, feats, magic, universal monster rules,
  cursed items, wondrous items, afflictions, environment, haunts, magic item
  creation, Craft, alternate crafting and item creation feats, plus the
  sorcerer/wizard spell list (1,493 spells, mapped to school from its
  headings).

  | Section | Collected | Not collected and why |
  |---|---|---|
  | pf1-weapon-abilities | 184 + index | |
  | pf1-armor-abilities | 117 + 5 catalogue | |
  | pf1-cursed-items | the cursed-items page itself (all items inline, 61k characters) | its 40 child links are dead relative links (404) |
  | pf1-afflictions | curses, diseases, drugs, infestations, madness, pharmaceuticals, poison, hazards and disasters (third party): 8 | |
  | pf1-conditions | the conditions page (all conditions inline) | |
  | pf1-environment | 17 (environmental rules, weather, terrains, dungeons, urban, planes) | |
  | pf1-haunts | 6 (haunts by CR) | |
  | pf1-skills | 32 | |
  | pf1-crafting | 22 (Craft, alternate crafting rules, item creation feats, magic item creation) | 2 dead links |
  | pf1-universal-monster-rules | the one page (all rules inline, 106k characters) | |
  | pf1-spells-transmutation | 393 of 394 | 1 dead link |
  | pf1-spells-illusion | 144 (spells in both schools are filed under transmutation) | |
  | other sorcerer/wizard schools | 954 of 955: abjuration 111, conjuration 200, divination 119, enchantment 179, evocation 169, necromancy 170, universal 6 | 1 dead link |
  | pf1-wondrous-items | 2,352 + the index page | 1 dead link |

  Finished 2026-11-04 10:06 UTC. The manifest holds 4,251 rows with unique
  URLs: 4,061 browser and 190 transport, about 39 MB of private text. Spells
  cover the whole sorcerer/wizard list (1,493). Spells only on other classes'
  lists (cleric, druid, occult and the rest) are not collected; that would be
  a later pass from their class spell lists.
- Stops on the browser route. (1) Batch B stopped itself at 02:43 UTC on a
  network error (`Failed to fetch`). The cause was hidden-tab timer throttling:
  gaps grew from about 7 s to 658 s. The site never refused anything. It
  resumed at about 6.7 s per page after the pacing timer moved into a Web
  Worker and the Mac was kept awake. (2) The browser pane was closed while
  batch C was running, between the last dump at 04:03 UTC and 04:33 UTC. Pages after the last dump were only
  in the tab's memory and were lost. Weibao said "Yes, resume". The pane
  closed again about 30 minutes after a turn ended. The first loss was
  refetched; from then on each page also went to the tab's IndexedDB, so the
  second closure lost nothing (296 pages recovered). Checks every 25 minutes
  kept the pane open for the rest of the run. The IndexedDB and localStorage
  copies were deleted after the final import.
- Polite transport state for `www.d20pfsrd.com`: closed (second 404, see
  above). Not cleared again.
- Publisher per page (AFW-R4-2, 2026-11-04). d20pfsrd mixes Paizo and
  third-party rules, so each PF1 manifest row now has `publisher` (`Paizo`,
  `third party`, `mixed` or `unknown`), `publishers` (the names) and
  `pzo_codes`. These come from the page's Section 15 notice, any inline
  "Source ... ©" line, PZO product codes, and the "<page> – <publisher> –
  d20PFSRD" title form. `unknown` means no notice was found, which is mostly
  hub and index pages. Cite a PF1 page with its publisher. The tagging is
  offline (`--publishers`) and runs after every `--import-browser`. Count at
  4,251 rows: 3,688 Paizo, 10 third party, 9 mixed, 544 unknown. Of the
  wondrous items, 2,040 are Paizo, 1 is third party and 311 are unknown.
- Output: `private/manifest.jsonl` (one row per page: URL, title, HTTP status,
  SHA-256, text path) and `private/<section>/<hash>.txt`. Reader budget is 300
  pages per session, so the run resumes across sessions; rerun the same
  command to continue. The manifest is the live count.

## Pathfinder 2e: Archives of Nethys (browser, by Weibao's instruction)

- The polite transport got HTTP 403 on the first page, which durably closed
  `2e.aonprd.com` for that route (state unchanged). Weibao then asked for the
  in-browser route. The built-in browser loaded the site normally.
- Route: in a background tab on `2e.aonprd.com`, eight queries to the search
  index the site's own list pages use (`elasticsearch.aonprd.com/aon/_search`,
  index `aon-20261012-045539`), sent 4-8 s apart. Eight requests instead of
  about 2,000 page loads.
- Groups (records, file SHA-256 prefix): disease 44 (`c7c51542`), curse 92
  (`7afe2ad3`), condition 98 (`3d5233d1`), skill and general skill actions 75
  (`ca3ca4c8`), action 719 (`3be36033`), poison-trait equipment 345
  (`5e757aae`), runes 347 (`83f3417b`), illusion, polymorph, revelation and
  detection spells and rituals 346 (`85e286a5`). All totals equal the rows
  returned.
- Fields kept: id, name, category, level, rarity, traits, URL, source, item
  category, summary, the site's markdown and plain text, release date.
- Output: `private/aon/<group>.json`.
- Check: Tetanus (now `/Diseases.aspx?ID=3`; the old ID 28 redirects) matches
  the calibration in `src/affliction_catalogue.js`: DC 14 Fortitude, onset 10
  days, clumsy 1 for a week, clumsy 2 and mute for a day, paralysis with
  spasms for a day, then death.

## Not done

- Pathfinder 1e conditions and afflictions are not cross-checked against 2e yet.
- Nothing from either set is wired into the game beyond the existing seams.
