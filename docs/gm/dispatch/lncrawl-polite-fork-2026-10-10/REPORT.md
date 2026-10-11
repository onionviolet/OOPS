# Polite crawler fork report

Completed 2026-10-10 in `/Users/weiwei/code/lncrawl-polite`, branch `polite`.
Local commit: `21aa69fb83c788c760f29bb41d49ca758d652975`.

**F1 Built:** isolated polite CLI and network layer, normal free Fanqie
catalogue/reader adapter, font-derived decoding, durable resume/update manifests,
request receipts, offline fixtures and usage documentation. The network layer
has one process lock, serialized requests, randomized 4 to 8 second host gaps,
robots checks including named OpenAI exclusions, immutable verified caching,
durable refusal stops and a 300-chapter session maximum. No upstream scraper,
proxy, browser solver, login, retry or escalation path is loaded by polite mode.
Any paid/locked flag closes the book. GPL-3.0-or-later license and upstream
attribution are retained; LICENSE is unchanged.

**F2 Verified:** 31 offline tests pass on Python 3.9.6. Tests block socket
connections and cover refusals, paid flags, robots, pacing/caps, font rotation,
cache integrity, interrupted requests, resume/update and import isolation.
`make lint` passes: pyright zero errors, 731 files formatted, ruff clean.
Both module entry points and the installed `lncrawl-polite` help work.
Real offline qualification maps 362/362 private-use glyphs against Adobe's
matching Source Han Sans SC Normal release `2.002R`. Two existing cached pages
decode to 2,298 and 2,412 characters with zero PUA remaining. Reference glyph
aliases use documented Chinese-source normalization, not a copied mapping table
or a claim of recovering indistinguishable original Unicode identities.

**F3 Live limits:** no live Fanqie catalogue, reader or font request was made.
The dated normal catalogue query used by update mode is fixture-verified only.
One direct `raw.githubusercontent.com/robots.txt` request failed with URLError;
the host was closed and no retry ran. Adobe's open reference font and its license
were then acquired through Git, using release commit
`6ffa3adb0ee3973487679406f00647e092a326c1`. The real Fanqie font and pages were
read from the ttks lane's existing cache without modifying it. Different future
font versions need a matching reference; unknown outlines stop without output.

New fork working tree is clean. No GitHub fork, push or publication occurred.
YAIRPG gameplay, private saves and unrelated dirty work remain untouched.

Usage: [README_POLITE.md](/Users/weiwei/code/lncrawl-polite/README_POLITE.md).
Local evidence: [tests](/Users/weiwei/code/lncrawl-polite/polite-data/OFFLINE_TESTS.log),
[lint](/Users/weiwei/code/lncrawl-polite/polite-data/LINT.log),
[real-font qualification](/Users/weiwei/code/lncrawl-polite/polite-data/real-reader-qualification.json).
Caches, font inputs, maps and evidence are ignored by the fork's Git rules.
