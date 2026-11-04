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
- Sections: weapon special abilities (184 pages in scope), armor special
  abilities, afflictions (diseases, poisons, curses and the rest under
  `/gamemastering/afflictions/`), conditions, and the disguise set (Disguise,
  Bluff and Perception skills; *alter self*, *disguise self*, *true seeing*,
  *seeming*, *veil*).
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
