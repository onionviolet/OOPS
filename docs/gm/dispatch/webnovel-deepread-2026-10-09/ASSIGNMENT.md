# Web-novel deep read: skill romance and living skills, 2026-10-09

Dispatched 2026-10-09 by Claude Code under Weibao's "continue accordingly",
following the [web-novel scout](../../../research/novels/webnovel-scout-2026-10-09/REPORT.md)
(93 mechanics, 48 titles, but 51 of them synopsis-only). Weibao's named
interests: abilities treated as gal-game heroines, and abilities that evolve
like Pokémon.

Research only. No YAIR `src/`, builds, saves or commits. Notes in
`docs/research/novels/webnovel-deepread-2026-10-09/` (gitignored); paraphrase
only, no raw prose saved. No logins, payment, CAPTCHA or anti-bot bypass;
after one failed fetch switch route (mirror, search-indexed chapter, other
aggregator) and record it.

## Titles (read in this order, as far as public chapters allow)

| Title | Source from scout | Target depth |
|---|---|---|
| Gal武圣 | Ciweimao MIP route (W042, W043) | First 60 chapters, then skim to latest public |
| 我的功法怎么全变成了美少女？ | Fanqie reader (W049) | First 60 chapters, then skim |
| Skill Eater: A LitRPG Adventure | Royal Road (W088, W089) | Every public chapter |
| 御兽：我能无限进化 | 69shuba (W068) | First 80 chapters, then skim |
| 我被她们恋爱模拟了？ | NovelUpdates / original (W059) | First 40 chapters |
| One more of your choice from the scout's top 20 that is synopsis-only and looks strongest | — | First 40 chapters |

## For each title

1. The full rule set of the cheat as it actually plays: how abilities gain
   affection or experience, what each route/evolution needs, what fails,
   costs, jealousy and rivalry rules, caps and how they break, endings or
   final forms reached so far.
2. A day-in-the-life: what the protagonist actually does with the cheat
   across a normal day and how it changes their relationships and work.
3. The 5 most surprising later-chapter twists to the rules.
4. Mapping to YAIR: one cheat card (terms, costs, what it changes in a
   life), plus 5 small touches on native systems (skills, study, career,
   NPC memory, life record).

## Output

Per-title DOSSIER.md, a COMPARISON.md (how the five treat abilities as
people or creatures, and the best combined design for one YAIR cheat),
REPORT.md (short plain summary first), CHECKPOINT.md, SOURCES.md. Add a
dated "Web-novel deep-read findings (2026-10-09)" subsection to
`docs/LIFE_SIM_NORTH_STAR.md`, paraphrase only, marked proposals.

## Addendum (Weibao, 2026-10-09): no clicking through pages

Stop reading Royal Road (or any site) page by page through a browser or
computer use. Use dedicated tools per docs/research/novels/SUBAGENT_RUN_RULES.md
§Scraper tools first:
- Royal Road, FanFiction.net, AO3, SpaceBattles, SufficientVelocity:
  `fanficfare -f epub <story url>` into
  `docs/research/novels/webnovel-deepread-2026-10-09/<title>/sources/`,
  then read the EPUB locally.
- Chinese sites: lightnovel-crawler (pipx) or another open-source
  downloader for that site; else plain HTTP fetch of chapter pages by
  script, not by clicking.
- Stubbed books (removed from RR for Kindle): check local copies in
  ~/Downloads and ~/Sync/CalibreLibrary first. If none, list them in
  REPORT.md under "Needs a download" for Weibao; do not buy or log in.
Never use computer use or browser clicking for reading.

## Addendum 2 (Weibao, 2026-10-09): polite downloads only

Follow "Be a polite client" in docs/research/novels/SUBAGENT_RUN_RULES.md:
one request at a time per site, 4 to 8 second randomized delays, download
once and reuse, stop a site on the first 403/429/challenge. FanFicFare
delays are set in ~/.fanficfare/personal.ini.
