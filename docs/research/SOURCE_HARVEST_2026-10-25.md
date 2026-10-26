# Ranked-source harvest, 2026-10-25

Status: IN PROGRESS. Collection, extraction, reading and gameplay remain separate.
This receipt owns this harvest's execution; the [source queue](SOURCE_DEEP_DIVE_QUEUE_2026-10-24.md)
owns candidate discovery and priority. A separate receipt is needed because this
run performs collection/preparation rather than another ranking round.

Authority: Weibao requested harvesting the top sources, reusing held/read material,
filling missing books/chapters and retaining traditional novels for fitting into
OOPS. His follow-up explicitly selects direct Z-Library app control as a route.
Rules: WPR1–5/7–8, WA3/8/12, AD32/35–38; [acquisition tools](SOURCE_ACQUISITION_TOOLS.md).
No source collection grants a completed-world, runtime or publication claim.

## Current result

| Code | Work | Evidence / qualification |
|---|---|---|
| H-R1 | Reconciled 54 ranked rows plus 15 traditional/other prose rows against the local catalogue, Calibre, Downloads and private EPUB stores | 69 candidate rows, with a few deliberate cross-list title aliases. Baseline: 61 distinct EPUB hashes serving 18 rows. Alternate editions and sparse serial samples are not extra numbered books |
| H-R2 | Reused 19 verified preparations and prepared 42 additional held EPUB editions | Source hashes, archive CRCs, extractor receipts and text hashes checked. 3,981 spine text members. No original source changed; extraction does not certify semantic reading or complete editions |
| H-R3 | Reused the supplied Skill Eater 1–5 reading packet | All five held hashes match the newer intake. Earlier partial-reading snapshot is superseded for these editions; no repeat full read |
| H-R4 | Recovered RH1 under its English alias, Primordial Saint Sect | Existing MTL corpus: 1,437 distinct numbered chapters through 1441; missing headings 295/506/751/1096. Preserved original and duplicate spans, derived a longest-body chapter view. Translation/completeness remain qualified; earlier audits are bounded, not a full read |
| H-R5 | Downloaded Applied Cultivation: Survival Protocol through the native Z-Library app | CatVI, English EPUB, 4,011,771 bytes, valid CRC, 107 spine members; prepared and indexed. Not read this run |
| H-R6 | Downloaded The Menocht Loop Book 1 through the native Z-Library app | Lorne Ryburn / caerulex, English EPUB, 735,307 bytes, valid CRC, 48 spine members; prepared and indexed. Later books remain open |
| H-R7 | Retained a proposed native-system routing field for every candidate | Points to the systems register's three owning areas. Routing is a starting point for source-qualified design, not evidence that the source's mechanics are implemented |
| H-R8 | Downloaded Saintess Summons Skeletons Book 1 | Mornn, English EPUB, 2,375,671 bytes, valid CRC, 106 spine members; prepared and indexed. The user authorized the CAPTCHA; file verification established completion despite the app's loading screen |
| H-R9 | Expanded beyond the shortlist to 18 additional held leads | 40 distinct EPUB hashes, 39 verified preparations and one alternate DCC edition blocked by duplicate spine members. Current pass reused 21 preparations and created 18; some reused preparations were created before an interrupted first attempt. These counts are separate from the 61-file baseline |
| H-R10 | Recovered A Soldier's Life Book 4 as MOBI | Read-only Calibre metadata confirms title/authors. Its exact source hash matches the earlier series manifest, whose Book 4 conversion and reading packet are reused; no new conversion needed |

Traditional material retained in preparation includes The Way of Kings, the
Malazan collection, Children of Time, The Goblin Emperor, The Curse of Chalion,
The Traitor Baru Cormorant and the Craft Sequence collection. Collection labels
do not certify every volume's completeness. Missing traditional titles stay in
the same gap ledger rather than being dropped for collection friction.

## Open collection boundaries

- **H-G1 resolved:** Saintess Book 1 is verified, prepared and indexed. The
  user supplied CAPTCHA confirmation. The app remained on a loading screen,
  so completion was established from the actual file rather than its badge.
- **H-G2:** Bookworm Part 2 Volume 4 is an interior gap. Reviewed English EPUB
  candidate's Bookracy download timed out after request issuance; the recorded
  job remains interrupted. No automatic retry, job rename or edition switch.
- **H-G3:** Bookworm has selected later volumes rather than a contiguous whole
  series; Log Horizon holds 1/2/5, leaving 3/4 interior gaps; Cradle holds 1–10,
  with 11/12 still to locate. Source identity/coverage checks precede more copies.
- **H-G4:** Missing local asset matches require exact edition/capture discovery.
  Kindle ownership, raw text and legacy aliases can exist without catalogue hits.
  The RH1 correction demonstrates why absence from EPUB metadata is insufficient.

## Route findings and correction

The initial desktop API returned network_error, then desktop_route_blocked after
the app was opened. That did **not** establish native app failure. Direct app
control successfully searched and downloaded H-R5/H-R6. This native route remains
selected; three actual downloads are verified. No credentials were entered or account settings changed.

Bookracy search returned browser_http_404; JNovel catalogue timed out. Existing
RR/CN collector refusals were inspected without clearing or bypassing them. The
author-site Sorcery probe used the existing polite transport state and stopped
on HTTP 403. These route failures do not exclude their sources from the project.
The existing governor/downloader and its shared lease were preserved.

## Private evidence and verification

Private owner: `docs/research/novels/source-harvest-2026-10-25/` (gitignored).
HOLDINGS.json preserves the pre-download holdings baseline; PREPARATIONS.json
records reuse/new extraction. SOURCE_AND_GAP_LEDGER.json carries all 69 rows;
NATIVE_DOWNLOADS.json records the new files, hashes, metadata, preparations and
catalogue registration. ACQUISITION_ROUTES.json retains failed/pending outcomes.
The raw RH1 manifest records every heading span and the four missing numbers.
No private catalogue export, credentials, signed links or source prose belongs
in tracked output.

ADDITIONAL_LOCAL.json owns the expanded local pass and alternate-format receipt.
The queue's LH1–LH18 table ranks these additional leads separately, so existing
54-source ranks and their IDs remain stable. Historical reading owners for
Mother of Learning, Worm, Godclads, Beyond the Timescape and A Soldier's Life
are retained with their supplied-edition limits; no new full read is claimed.
The technique-girls packet concerns a different Chinese work from RH11's Naruto
title. Related mechanics alone do not establish an alias or close that gap.

Checks: hashes/CRC/spine extraction and verified preparation for held and newly
downloaded EPUBs; unchanged-source hashes; Skill Eater intake matching; RH1
number/duplicate/gap check. Image-only members are flagged rather than called
readable text; illustrations are not transcribed. Three unselected ORV copies
had metadata parse errors during inventory and were left unchanged. Validation
passes the 40 additional source hashes, 39 prepared text hashes, three native
download hashes/CRCs/preparations, prior MOBI hash binding and document link
existence. `git diff --check` passes for both owned reports. Runtime
tests do not apply. Broader harvest, source reading, gameplay fitting, human
acceptance, commit and publication remain open.
