# Outer Wilds research checkpoint (2026-10-13)

**Status:** bounded research delivered. Static community-code/schema evidence and developer design evidence are complete for the inspected files. Wiki coverage is excerpt-only; talks are abstract/author-sample level. No game playthrough, proprietary code inspection or implementation is claimed.

## Coverage

Read AGENTS.md, PROJECT.md top 60 lines, USER_VISION.md's current UI and priority sections, SOURCE_DEEP_DIVE_PLAYBOOK.md, all five cultivation-idlers format files and WORLD_SECRETS_AND_DISCOVERY.md. Searched docs and research lanes for the target and overlap. REPORT.md owns the covered/new matrix and actual source comparison.

Community sources were cloned with no checkout and read using git show. Selected files were materialized as untrusted text under `/private/tmp/claude-501/codex-lanes/outer-wilds-src/reads/`. No repository hooks, builds, dependency installs or downloaded scripts ran. Both clones and every materialized third-party file remain in that scratch root. `source_manifest.json` there records selected file hashes and SHAs.

| Repository | Pinned SHA | Selected files read |
|---|---|---|
| New Horizons | `5611a9ce01f881d8798de5c0342f99ba3cee3e47` | Ship-log guide, XML schema, RevealBuilder, ShipLogHandler, RumorModeBuilder, ShipLogModule, manager and fact patches, root LICENSE |
| OWML | `d58505f01d37630e71152ef0b78921b3d2c08f4f` | README, storage guide, ModStorage, IModStorage, root LICENSE |

Custom Ship Log Modes author API sections were also read at page level to distinguish rumored, unread and unfinished cues.

Source findings distinguish a schema's affordance from a tested implementation. The New Horizons repository was not read in full. Shared runtime files were already dirty or concurrently owned; this lane only read them. Their comparison is a 2026-10-13 snapshot, not a future guarantee.

## Unread and blocked

Fandom web open failed; the hidden in-app browser was unavailable. Chrome extension inventory was available, but browser security denied access to Fandom, stating that the user declined permission. No retry or workaround followed that browser denial. Search had supplied wiki excerpts; those support only the qualified claims in the report. A later search returned a non-retryable robots notice. No complete wiki page, revision ID or raw wiki dump was obtained.

GDC slide PDF returned 403 and was not retried. Kelsey Beachum's author site and accessible three-page found-text design sample provided an alternate public source. The GDC 2021 abstract and author talk listing were read; the video was linked but not watched. Alex's 2015 interview was read; his 4D Level Design GDC page was only an announcement, not the talk itself. That interview describes a pre-release 20-minute period; shipped 22-minute timing is supported separately by Mobius's 2019 page.

Unread: full vanilla log XML and parser; precise asterisk algorithm; full wiki histories; every base-game clue; detailed event timing; all Echoes archives, simulation rules and seals; complete DLC reel catalogue; runtime persistence; controller navigation and accessibility. A 1.1.12 patch page was inspected but did not establish the searched later bottleneck claims, so those claims were excluded.

## Safety and license

Only the five requested files were written inside `docs/research/outer-wilds/`. No git add, commit or push. No other repo edits, builds, installs, user-save access, purchases, accounts, login or game acquisition. No raw copyrighted prose, code or assets copied into the lane. Research uses paraphrases and names only for source attribution; proposed gameplay names are original. Outer Wilds canon spoilers are public franchise facts. No YAIRPG divergent or randomized sealed truth was read into these outputs.

New Horizons and OWML root LICENSE files are MIT. That does not license Outer Wilds' commercial code, assets, dialogue, or referenced libraries. No code reuse is proposed here; any later reuse must retain applicable notices and check the specific file and dependency provenance. Developer articles and wiki text have no reuse permission inferred from public access.

## Future download and decompile value

| Route | Value | Reason and limit |
|---|---|---|
| More selected New Horizons text | Medium | Entry completeness patches and author examples could refine hint policy; static reads only |
| More OWML source | Low | Loader/storage boundary already clear; unlikely to answer clue design |
| Full GDC talk through a permitted public route | Medium | Could add playtest and pacing detail; no need to retry blocked slides |
| Wiki revision capture through a later explicitly permitted route | Medium | Would upgrade excerpt claims and resolve exact DLC rules; current denial remains binding |
| Proprietary game download or decompile | Low for this question | Author samples and mod contracts cover the transferable pattern; lawful owned-copy inspection could resolve exact vanilla completeness semantics only if separately authorized |
| A commercial purchase | Not needed | No purchase or account required for these proposals |

P1 to P5 remain unaccepted. Next meaningful gate, if implementation is later authorized: one connected known-clue slice, rebuilt and exercised at the named desktop viewports, with Save/reload/Import and a sealed-text leakage check. Research completion does not close any existing Foundation or native gameplay gate.
