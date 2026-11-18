# JoJo and extreme-ability sources: collector report, 2026-11-18

Lane `jojo-collector`. Purpose: give the JoJo deep dive and the batched readers text to work from for conceptual, rule-bending powers. This report records access and readiness only. No source here has been read in full, screened for reading, or turned into design. Raw text stays in Source Library, `~/.codex/research/wikis/` and the gitignored `docs/research/novels/jojo-collection-2026-11-18/`.

Preflight facts: no JoJo, Toaru or Mob Psycho record was held at the start (`library_coverage.py` returned 0 records for JoJo, Toaru, Certain Magical, Railgun, Mob Psycho). *Ward* was already held (`d1b55735a782`, 295 chapters, no gaps). Anna's fast quota read 50 before the run and 7 after; Z-Library stayed at 10 of 10 (no use spent).

## Sources

| ID | Source | Route and state | Ready for batched reading? |
|---|---|---|---|
| J1 | *Jorge Joestar* (Maijo Otaro, English fan/unofficial EPUB, about 200k words) | Anna's fast, MD5 verified, registered `bd9d60ca095f`, ZIP CRC ok | Yes, EPUB with text. Long and mostly one narrative; split by its sections. |
| J2 | *Purple Haze Feedback* (Kadono Kohei, about 45k words) | Anna's fast, `d223d9044185`, CRC ok | Yes. Only 3 HTML sections, so cut by headings or word count. |
| J3 | *Purple Smoke Distortion* (Kadono, about 52k words; same author as J2, probably the same novel under another English title or translation, not compared yet) | Anna's fast, `fab4a992c513`, CRC ok | Yes |
| J4 | *Over Heaven* (NisiOisin, about 50k words) | Anna's fast, `541385e89097`, CRC ok | Yes. Chapter per section. The Z-Library record names Araki as author; the EPUB's own metadata says NisiOisin. |
| J5 | *The Book: JoJo's Bizarre Adventure 4th Another Day* (Otsuichi, about 102k words) | Anna's fast, `126835b39a75`, CRC ok | Yes |
| J6 | *JoJo's Bizarre Adventure: Light Novel Collection* (Eva Medeiros, about 418k words, 219 sections) | Anna's fast, `474ad4b62ebe`, CRC ok | Needs a look first. Its sections open with "The Genesis of Universe", so it overlaps J1 to J5 as an alternate compilation and may add translator front matter. Compare against J1 to J5 before reading both. |
| J7 | Japanese *The Book* and Japanese *Jorge Joestar* | Listed on Z-Library (`11875929:481db4`, `126596194:50d778`); not fetched, English exists | Not needed unless a reader finds the English incomplete |
| J8 | JoJo manga, parts 1 to 8 | Governor queue holds all eight (rows `jojo-phantom-blood` to `jojolion`, explicit id lists, 44 to 174 chapters each). Nothing downloaded or OCR'd yet; `manga-text/private/` has no JoJo folder. I moved the eight rows to sit right behind Boruto, ahead of `naruto-extra` (backup `governor/queue.json.bak-2026-11-18-jojo-first`). The runner is halted on a Naruto-extra failure (`possible_owned_edition_review`), the loop is outside its 18:00 to 08:20 window, and its 3 auto-unhalts for the window are used. Next window starts 18:00 on 2026-11-18. I did not unhalt it by hand. | Not yet. After download the OCR watcher picks the CBZs up on its own. |
| J9 | Stand stats and ability text: Fandom JoJo wiki, WikiTeam history XML, snapshot 2020-02-22 | Internet Archive item `wiki-jojofandomcom`, 48,098,981 bytes, SHA-256 `5c8f5505e88ec794cffb3e33c20287af80a11dd3035f4dec464a9c059c7aa9f2`, at `~/.codex/research/wikis/jojo.fandom.com/dump/`. 114,762 pages. Infoboxes carry `destpower`, `speed`, `range`, `persistence`, `precision`, `potential` (checked on Star Platinum: A/A/C/A/A/A). Hamon and Spin categories are present (about 1,400 and 470 category lines). No Fandom host contacted. | Yes after a deterministic extract. The snapshot is stale: it stops about JoJolion's mid-run and has no Stone Ocean-anime or later-chapter Stands. Add the dump to `scripts/wiki_power_census.py` as a `jojo` entry (`7z`, history XML) before census use; I did not change that script. |
| J10 | jojowiki.com (the better wiki) | Polite transport closed the host on its first request: "Cloudflare challenge parameters". No retry, no bypass. Its Internet Archive item `jojowiki.com` is one 77 GB `.7z`, mostly files, too large to take blindly. | No. Open gap. |
| J11 | Game move lists and mechanics (All-Star Battle R, Eyes of Heaven, Heritage for the Future, Golden Wind PS2, Last Survivor, gachas) | Not collected. The Fandom S3 dump for the main wiki is in Glacier Deep Archive (HTTP 403 `InvalidObjectState`). Internet Archive holds game binaries, match videos and a Golden Wind PS2 ROM, which are out of scope. No game wiki dump found. | No. Open gap. |
| J12 | JoJo tabletop or homebrew systems | Z-Library and Internet Archive searches found nothing usable (a Chinese romance novel, some Roblox and fan wikis). Small fan wikis exist on Internet Archive (for example `wiki-customjojostandsfandomcom`, `wiki-jojo-stand-maker.fandom.com-20261107`, 4.5 MB and 0.4 MB) but they are user-made Stand lists, not published rules. | Not collected |
| J13 | *Thus Spoke Kishibe Rohan*, *Golden Heart Golden Ring*, *Crazy Diamond's Demonic Heartbreak* | Searched Z-Library under several titles, no hit. | Open gap, no English edition located |

### Other extreme-ability works

All 41 files below are EPUBs fetched from Anna's fast, MD5 verified, ZIP CRC checked, 44k to 91k words each. Source Library hashes (first 12 characters):

| ID | Work | Held |
|---|---|---|
| T1 | *A Certain Magical Index* vols 1 to 22 | all 22: 1 `52f40ec17901`, 2 `3c3c44128eef`, 3 `a5a2bdffe0eb`, 4 `d4ca5fc37ee1`, 5 `c6363958a987`, 6 `c86dc546a4ef`, 7 `b7137b202476`, 8 `68d8ef3a4653`, 9 `d4eacade8583`, 10 `cfbf1adc40f4`, 11 `5f3c77039bf0`, 12 `07d10304f98b`, 13 `9bd7efc2a7eb`, 14 `fe75937488ba`, 15 `b02a9dbf4df5`, 16 `ce3ee3683ca9`, 17 `b3155e953208`, 18 `dc0a52534e93`, 19 `c51409366337`, 20 `3d238af7bac2`, 21 `130ed0cdced6`, 22 `99fea2de701e` |
| T2 | *A Certain Magical Index: New Testament* | vols 1 to 5, 7, 8, 10, 11: 1 `558374be54d5`, 2 `de6007887f48`, 3 `66c21532f000`, 4 `e6f92bb10e33`, 5 `354f534fa35d`, 7 `9073b68126a7`, 8 `18dd3f36bcb1`, 10 `ea8da7daa5e6`, 11 `13301815b111`. Missing: 6, 9, 12 (see below) and 13 onward. |
| T3 | *A Certain Scientific Railgun* light novel and SS1 to SS3 | `45da1a134b74`, `85a71ac8be6a`, `c160041c63b2`, `b0c30325a504` |
| T4 | *Ward* (Worm sequel) | already held, `d1b55735a782` |
| T5 | Re:Zero light novels and web novel arcs | already held (see the Re:Zero sections of the library index) |
| T6 | Hunter x Hunter, Jujutsu Kaisen, Mob Psycho 100 manga | manga governor queue already holds `hxh`, `hxh-extra`, `jjk-side`, `jjk-guide-modulo`, `mob-psycho-100` (148 chapters). JJK 277 chapters were already OCR'd. Mob Psycho on Z-Library is 8 English volumes (`26639251` to `26639556`); not fetched, because the governor spends no A/Z quota on them and they are image volumes needing OCR. |

Reading notes for the Toaru books: these are Yen Press-style English EPUBs of an official translation, so ability names and "Level 5" terminology are consistent across volumes. Volumes 10 to 22 are image-heavy (7 to 18 MB) but still carry full text (50k to 80k words).

## Failures and what they mean

- **Bad archives from Anna's.** *New Testament* 6, 9 and 12 downloaded and matched their MD5 but failed ZIP open ("Bad magic number for central directory"). The runner stopped each time under AR53 and I skipped the title and went on. This looks like bad uploads on those Anna's records, not a transfer error. Z-Library has separate records (for example NT 6 `22023314:de75ac`, NT 9 `22023080:768809`, NT 12 `22023085:f28bb8`, plus `New Testament` entries from `117399252` and `128999789` onward). Z-Library is the right fallback for those three, and also for NT 13 to 22 and the Genesis Testament, once the Anna's quota resets. Ten Z-Library uses are free.
- **One transient Anna's reply** with an empty body stopped the run once (Index 17). A second run on the same list continued without trouble.
- **Cloudflare on jojowiki.com** closed the host durably in `lncrawl-polite`'s state under the private `transport/` folder. Do not retry it from here; if Weibao wants it, a human-cleared browser route is a separate decision.

## Still missing and why

1. jojowiki.com Stand, Hamon and Spin pages with current stats: Cloudflare challenge, and the 77 GB archive is not practical. A newer Fandom snapshot would also do; only the 2020 one is on Internet Archive and the Fandom S3 copy is in deep archive.
2. Game mechanics: no clean published source reachable. The wiki route is the same Cloudflare problem.
3. JoJo TTRPG systems: none found.
4. Rohan, Golden Heart Golden Ring and Crazy Diamond's Demonic Heartbreak novels: no English edition located. Japanese originals untried.
5. *New Testament* 6, 9, 12 to 22, *Genesis Testament*, Railgun main volumes and *Mental Out*: Anna's quota is spent (7 left); Z-Library fallback is open.
6. JoJo manga text: waiting for the governor's 18:00 window and an unhalt. Check `status` then.

## Next step suggestions (not started)

- Add `jojo` to the wiki census dump table and run its deterministic extract of Stand infobox letters. A 2020 snapshot covers Parts 1 to 7 and most of Part 8.
- When Anna's resets, finish *New Testament* through Z-Library using the ids above.
- Once manga CBZs appear, the OCR watcher handles them.
