# Ascension paths: gap fill, engine and LOTM digestion, 2026-10-22

Weibao: "fill gap and build htem here accordingly? Feel free to use subagents and
work together", following the ASC1–ASC21 round in
[the cultivation palette](../../../RESEARCH_CULTIVATION_PATHS.md#round-2026-10-22-digitized-paths-of-ascension).
Mid-task he asked how to digitize the value of progress, how the LOTM MMO does it,
and about rituals; that is saved as ASC22–ASC36 in the same owner. No commit or push
selected.

Rules: AD5, AD6, AD7, AD8, AD22, AD33, AD34, AD36, AD38; AR1–AR16; LTS1–LTS14.
Seam: new leaf `src/ascension_paths.js`; LOTM through its existing domain files.
Target viewport desktop 1920×1080; mobile deferred.

## Ownership

The P12/`world_adaptation` seam, `main.js` and Mistglass UI remain with the
W1–W4 Codex chat (`01a16509-8686-7850-b336-d1a8269acd77`). This task edited no
file there; `ascension_paths_mistglass.js` only imports `techniques.js`. LOTM
files were clean at `c679b431b` with no reservation.

Own paths: `src/ascension_paths.js`, `src/ascension_paths_mistglass.js`,
`src/book_world_lotm_{ids,actions,content,state,envelope,host,ui,path}.js`,
`tests/ascension_paths.test.js`, `tests/lotm_seer_digestion.test.js`,
`docs/worlds/LOTM_SEER_SLICE_LAWS_2026-10-19.md` (LTS11–LTS14 rows and exclusion
line), the two palette rounds, this folder, one USER_VISION entry and a launch
config entry `asc-lotm` (port 19811). `dist/` was rebuilt in the shared checkout.

## Subagents

Three read-only extractions (canon ladders, RI/FV/AWE gaps, LOTM slice and canon)
and one web research lane (official LOTM games). One subagent attempted an
unrelated session start; the permission classifier denied it and it did not retry.

## Implementation

- `ascension_paths.js`: `definePath` validates shape, typed crossings (quota,
  structure, insight, trial, ingest, digest, consume, recognition, bodyPoint),
  grants and failure; `pathView` projects position, `???` past `known`, an
  owner `ceiling`, and readiness. No state, clock or save slice.
- LOTM: two acting commands (`act_reading` repeatable with forfeit cancel,
  `act_refusal` once) add to actor resource `book.lotm.acting` up to 6;
  `request_assessment` spends one attention and releases one Clown dose;
  `ingest_clown` grants `book.lotm.clown`. `state.lotm` stays schema 1:
  progress lives in player facts and one resource, validated in
  `validateLotmState`; the envelope holds the released dose exactly once.
  Saves from before this change validate unchanged (tested).
- Panel: "Seer pathway" ladder, felt digestion, crossings with counts and
  irreversibility; past Sequence 8 shows `???` and the slice ceiling.

## Verification

- Focused: `node --test tests/ascension_paths.test.js tests/lotm_seer_slice.test.js
  tests/lotm_seer_digestion.test.js`: 17 pass, 0 fail.
- `npm run build`: pass. `npm run check:arch`: pass (`save_files.js` growth 0;
  no `main.js` line added). Bundle hash in `bundle.sha256`.
- Rebuilt native browser, fresh origin `localhost:19811/?lotm_probe=1`, 1920×1080:
  enroll, report in, accept, ingest, lesson, two readings, walk to lodging, sleep
  120 played minutes, walk back, three readings, refusal (6/6, "settled"), reading
  hidden after digestion, assessment (dose held), page reload kept the held dose
  and ladder, drink (Sequence 8, ceiling text), `save_to_file()` export string
  then literal `load_progress()` import: both sources present after import.
  Screenshot `browser/promoted-after-import-1920x1080.jpg`. Native Export button
  download not clicked (no file download); export used the same function.
- Full suite `node --test --test-concurrency=2 tests/*.test.js` on the final runtime inputs: **2,547 pass, 0 fail, 0 skipped** (`tests.txt`). `npm run check:rules`: pass, 3 pre-existing untracked-link warnings from other chats' files.

## Persistence compatibility decision

New saves can hold the `Tingen prepared Clown dose` item key, the
`book.lotm.clown` source, the `book.lotm.acting` resource and the `refusedHigh`,
`assessed` and `promoted` flags. `state.lotm` stays schema 1. Older saves load
in this build unchanged (tested). Builds from before this change are not expected
to read a save holding these: their validators would reject the Clown source or
dose. Reason: the Tingen branch is localhost-only behind `?lotm_probe=1`, its
saves are disposable test saves, and the normal app cannot enter it.

## Input identity

Shared checkout with other chats' uncommitted edits. Rebuilt `dist/bundle.js`
SHA-256 in `bundle.sha256`; own-path hashes in `own-diff.sha256` (line 1:
`git diff` of `src/book_world_lotm_*.js`; line 2: the five new files
concatenated). The full suite ran on that combined tree. Whoever commits `dist/`
next ships this LOTM work, so commit these sources with it.

## Official LOTM game sources (web research, 2026-10-22)

The developer is Kuaishou's studio 杭州弹指宇宙网络 (Sparknexa); no evidence of Tencent publishing.
Verified (official store text or press):
- [App Store CN, 《诡秘之主》](https://apps.apple.com/cn/app/%E8%AF%A1%E7%A7%98%E4%B9%8B%E4%B8%BB/id6756961871), v1.1.2, Aug 2026: 22 pathways, Sequences 9 to 0, forcing without acting risks loss of control, SAN falls and zero is irreversible, monetization list.
- [18183, 2026-08-19](https://www.18183.com/zhxz/9008528.html): China launch 2026-08-21; promotion by ingredients, acting and digestion; per-pathway acting abilities.
- [PC Games (DE), 2026-08-30](https://www.pcgames.de/Spiele-Thema-239104/News/Lord-of-Mysteries-MMORPG-1-Million-Spieler-1552412/): dailies, energy, grinding, seasonal resets; 1M players press-reported.
- [Gamersky, 2026-06](https://www.gamersky.com/news/202606/2158524.shtml): Zulong's 《诡秘之主：愚者》 trailer lists sequence promotion, digestion and rituals.

Guide-reported only (unconfirmed in game):
- [LDPlayer guide, 2026-08-18](https://www.ldmnq.com/7509/zixun/1058063.html): four promotion components; rituals from Sequence 5; material sources.
- [PP Assistant, 2026-07-23](https://wap.pp.cn/news/1286738.html): acting above 80% before a safe potion; "mental pollution" spike below it.

Gaps: pathway switching rules, digestion UI, characteristic mechanics, paid effects on promotion.

## Not done or not verified

Mistglass UI ladder (ASC20, owner-reserved), Clown abilities in use (ASC36),
forcing/loss-of-control route (ASC35), ritual crossing type (ASC34), 1800/1536
and 21px text checks for the new panel lines, human pacing and taste acceptance.
