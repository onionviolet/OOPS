# Four web novels: download politely and read for power "types", 2026-10-10

Dispatched 2026-10-10 by Claude Code at Weibao's request ("yes do both
accordingly"), after he asked for a polite scraper for four novels on
ttks.tw and for "types of observe skills... types of future sight? aspects
of the same idea? aspects of a certain law? shards of abilities? types of
immortality? subtle stuff like these?" Personal research use; reading
supplied books in full is allowed by AGENTS.md.

## The four books (ttks slugs; Chinese titles not yet confirmed)

| Code | Slug | Why Weibao named it |
|---|---|---|
| B1 | `wushinihaowoshiweiren` | Power types and subtle variants |
| B2 | `yinianchouquyicitiaomonideyekeyi` | Power types and subtle variants |
| B3 | `zhouhuitejidewoqusimiedasunuole` | "Worlds like" this one |
| B4 | `quanrenleidejichengzhe` (likely 全人类的继承者) | "Idea like" this one |

## Hard limits

- **ttks.tw and ttkan.co are closed for this run.** On 2026-10-10 every
  request to both returned a Cloudflare challenge (403). Do not request them
  again, and do not use cloudscraper, FlareSolverr, curl_cffi, header
  spoofing, proxies or headless-browser tricks.
- Follow "Be a polite client" in `docs/research/novels/SUBAGENT_RUN_RULES.md`:
  one request at a time per host, 4 to 8 s randomized delay, download once
  and reuse, stop a host on the first 403/429/challenge/CAPTCHA, about 300
  chapters per host per session, no logins, no purchases.
- Never use computer use or browser clicking to read.
- Raw text stays in `docs/research/novels/ttks-novels-2026-10-10/<code>/sources/`
  (gitignored). Never commit or copy prose into tracked files; findings are
  paraphrase, with at most a few short quoted terms.
- No YAIR `src/` edits, builds, saves or commits. Another Codex lane may be
  running; don't touch its folders.

## Steps

1. **Identify titles.** Use web search on each slug (pinyin) plus words like
   小说 to find the Chinese title, author and platform (Qidian, Fanqie,
   etc.). Record evidence in `TITLES.json`. If a slug can't be resolved with
   confidence, say so and move on.
2. **Install tools.** `pipx install lightnovel-crawler` (record version in
   TOOLING.md). Its Chinese sources include 69shuba, uukanshu, ixdzs,
   novel543, piaotian, xbanxia, 27k, shuhaige and trxs. Configure one
   thread and the polite delay (or wrap it in a script that enforces 4 to 8
   s).
3. **Find a supported mirror** for each book on one of those sites (search
   the site, one request at a time). Prefer the most complete free mirror.
   If no supported site has a book, list it in REPORT under "Needs WebToEpub
   in Weibao's browser" with the ttks URL, and skip it.
4. **Download** each found book once (EPUB or TXT). Long books: the first
   300 chapters per host this session, then continue on a later run in
   update mode. Record chapters fetched, host, dates and hashes.
5. **Read** with the lens below. Use subagents/parallel readers per book if
   useful, but never parallel requests to one host. Read enough to answer
   the lens fully: openings, the power system's explanations, every
   chapter where a power type, aspect, shard or immortality method is
   introduced or contrasted, and the world rules.

## Lens

Weibao wants **"types of" a power family**: one idea with many distinct,
subtle variants. For each book, collect:
- **Taxonomies.** How the book splits one power into types: kinds of
  observation or insight, kinds of future sight (what is seen, how sure,
  what it costs, what breaks it), aspects or facets of one law, shards or
  fragments of abilities (how they combine, transfer, conflict), kinds of
  immortality or revival (what persists, what can kill it, the price).
- **The axes** that make two variants different (scope, certainty, cost,
  trigger, range, who can perceive or counter it).
- **Subtle variants**: two powers that look alike but play differently.
- **B3 world** rules: what makes the world mechanically distinct, its
  loops or cycles, its threats, how a person grows in it.
- **B4 idea**: what "inheriting" means mechanically, what is inherited,
  from whom, how it is chosen, limits and costs.
- How each maps onto our design docs (read first, read-only):
  `docs/EMERGENT_SYSTEMS.md`, `docs/emergent/E7_OBSERVATION_AND_MYSTERY.md`,
  `docs/emergent/E8_POWER_ASPECTS.md` (being written by Claude in parallel;
  read it when it exists), and the north star sections "One skill, many
  Daos, and tiers of concepts" and "Cheat tiers, clean cheats, cheat fusion".

## Output

- In `docs/research/novels/ttks-novels-2026-10-10/` (gitignored): per-book
  NOTES.md with chapter anchors, TITLES.json, TOOLING.md, CHECKPOINT.md,
  run evidence.
- In `docs/gm/dispatch/ttks-novels-2026-10-10/` (tracked): **FINDINGS.md**,
  paraphrase only, no prose: per book a one-paragraph premise, the
  taxonomies found as tables, ten or more design proposals for E8/E7
  marked as proposals, and a "needs WebToEpub" list. Plus CHECKPOINT.md.
- Plain English, short words, no em dashes.

## Addendum (Weibao, 2026-10-10): official free chapters, and 69shu again

Weibao: "try route 2 accordingly, does ttks or 69shu not work? Try those if
they have full text".

1. **Official platforms, free chapters only.** B2 and B3 on Fanqie, B1 and
   B4 on Qidian (the book pages your FINDINGS resolved). Read the publicly
   free chapters through each site's normal web reader pages with the same
   polite wrapper (serial, 4 to 8 s, robots respected, stop on challenge).
   No login, no purchase, no VIP or paid chapters, no app-API device
   spoofing. If Fanqie's web text uses an obfuscated font, decoding the
   font mapping locally for reading is allowed (personal research,
   interoperability); record the method in TOOLING.
2. **69shu, other domains.** lightnovel-crawler also has a `69shuba.cx`
   source; there may be other official 69shu domains. Try each distinct
   domain's robots.txt once. If one answers without a challenge and
   permits the client, search it for the four titles and download full
   text politely. Stop each domain on its first challenge. ttks.tw and
   ttkan.co stay closed (both gave Cloudflare challenges on every request
   on 2026-10-10).
3. Then **read with the original lens**, plus: for B3 (a JJK-world book),
   note how the author handles binding vows, domains, cursed techniques and
   any vow-gaming or joke-vow use; Weibao is designing vow pricing in
   `docs/emergent/E8B_POWER_CATALOG.md` ("Gaming vows and rules") and paths
   in `docs/emergent/E8C_POWER_PATHS_AND_ANIME.md`. Read both first.
4. Update FINDINGS.md (paraphrase only) and CHECKPOINT.md. Any book still
   unavailable goes on the WebToEpub handoff list.

## Addendum 2 (Weibao, 2026-10-10): browser EPUBs and a fifth book

Weibao will fetch full text himself with WebToEpub in his browser and drop
EPUBs in `docs/research/novels/inbox/` (see `docs/research/SOURCE_REQUESTS.md`,
S1 to S5). Agents do not pass bot checks. B5:
`https://ttks.tw/novel/chapters/feitubianjingjianchaguan/index.html`
(resolve its title and platform by web search; check official free chapters
the same way as B2/B3). When EPUBs appear in the inbox, hash them, move each
into its book's `sources/`, and read with the original lens.
