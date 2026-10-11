# Our own polite fork of lightnovel-crawler, 2026-10-10

Dispatched by Claude Code at Weibao's request ("creating our own fork of the
ln scraper"). Personal research tooling.

## Where

- Clone `https://github.com/dipu-bd/lightnovel-crawler` into
  `/Users/weiwei/code/lncrawl-polite` (a new local repo, outside YAIRPG).
  Work on branch `polite`. **Do not create a GitHub fork, push, or publish
  anything**; Weibao decides that separately.
- Don't touch the running ttks lane's folders
  (`docs/research/novels/ttks-novels-2026-10-10/`), but read its
  `TOOLING.md` and `acquisition/` scripts to port what works.
- Read `docs/research/tools/FANQIE_FONT_DECODING.md` and the "Be a polite
  client" section of `docs/research/novels/SUBAGENT_RUN_RULES.md` first.
- Check the upstream license and keep it and its attribution intact.

## Build

1. **Polite network layer** replacing upstream's default for our use: one
   process, one request at a time per host, randomized 4 to 8 s gaps,
   robots.txt honored (including rules naming OpenAI agents), honest
   user agent, disk cache (never refetch), stop a host on the first
   403/429/challenge/CAPTCHA page (detected by page content and Cloudflare
   markers, not asset names), per-host chapter cap (default 300 per
   session), no proxy or address rotation, no refusal escalation, no
   retries in a loop, no logins. Upstream's rotation/escalation paths
   must be unreachable in our mode.
2. **Fanqie source** for normal free web reader pages: catalogue, chapter
   order, payment flags (stop on any paid/locked flag), and font decoding
   that derives the map from the font itself (render or outline-match
   against open Source Han Sans), detects font changes, and self-verifies
   (zero private-use characters left).
3. **Resume and update mode**: continue a book from its last cached chapter.
4. **Receipts**: per request URL, status, time, bytes, hash, and why a host
   was closed.
5. **Tests** with saved fixture pages (no live network in tests), including
   a challenge page, a paid flag, a font map check and robots refusal.
6. **README_POLITE.md**: what changed from upstream, the rules, usage.

## Output

The local repo with commits on `polite` (local commits in that new repo are
authorized; no push). A short `REPORT.md` and `CHECKPOINT.md` in
`docs/gm/dispatch/lncrawl-polite-fork-2026-10-10/`: what was built, test
results, what was verified live (if anything, politely) and what wasn't.
Plain English, no em dashes.
