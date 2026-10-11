# Polite crawler checkpoint

Revision 6, completed 2026-10-10. Owner: Codex, assignment implementer.

## Objective and ownership

Complete ASSIGNMENT.md in a new local upstream clone, branch polite. Local
commits authorized; no GitHub fork, push or publication. Only this checkpoint
and REPORT.md were written in YAIRPG. Existing dirty work, game source, private
saves and the running ttks lane remain untouched.

Checkout: /Users/weiwei/code/lncrawl-polite.
Upstream input: 59b0382d51927953aa8120c5de62dab23ce3f731.
Delivered commit: 21aa69fb83c788c760f29bb41d49ca758d652975.
New fork working tree is clean; no active child agents or pending tool sessions.

## Completed and checked

Isolated polite transport/CLI, Fanqie free normal-web adapter, outline-derived
font decoding, durable resume/update, receipts, fixtures and README_POLITE.md
are committed. GPL-3.0-or-later license/attribution are intact. Polite entry
points never load upstream network/escalation code. Cache data and downloaded
books/font inputs remain local and gitignored.

31 offline tests pass on Python 3.9.6; socket connections are blocked in tests.
Final make lint passes: pyright zero errors, 731 files formatted, ruff clean.
Module and installed CLI help are checked. Synthetic fixture timestamps were
fixed after a second-boundary hash failure; the repaired suite and an explicit
stable-hash check pass.

Real cached Fanqie font: SHA-256
60e1f33d3513967fc0ef35cf2aafbfd062a3cbffb53cd405a8a60b2ab1834bd4.
Matching Adobe Source Han Sans SC Normal reference: release 2.002R,
Git commit 6ffa3adb0ee3973487679406f00647e092a326c1, SHA-256
69a090057ee75936451397c038da6d32194e45bbf878ef674dddc0d5f0621ce5.
362/362 PUA glyphs mapped. Two read-only cached reader inputs decode locally
with zero remaining PUA (2,298 and 2,412 characters). Identical glyph aliases
use the documented Chinese-source normalization policy; unrelated ambiguity
fails closed. No static third-party map or raw prose was committed.

## Limits and resume

No live Fanqie acquisition was exercised. The dated normal catalogue update
query is tested with fixtures only. One direct raw.githubusercontent.com robots
fetch failed; the client recorded durable closure with no retry. Reference font
acquisition then used Adobe's Git repository and retained its font license.

No required assignment work remains. Optional next proof: a separately chosen
free normal Fanqie page through this CLI, respecting current robots/refusal
state. Before any future work inspect the fork's Git status and current
checkpoint; keep the existing data root and never reset a refused host to retry.
Do not run upstream's default scraper for this task.

Delivery and private evidence links: [REPORT.md](REPORT.md).
