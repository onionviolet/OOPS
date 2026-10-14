# Research tooling and rerun record

2026-10-14. Work area: `/Users/weiwei/.codex/research/free-text-worlds/`. All raw code, binary members, HTML, bytecode listings, captures and hashes stay there. No game code ran. No game, Steam client dialog, user save, account, CrossOver bottle or foreground UI touched. No stage, commit or push. The shared checkout was already busy and dirty; only this output tree was written.

## Acquisition and exact versions

| Code | Source / revision | Worked route and limits |
| --- | --- | --- |
| FT-T1 | Official URR `URR0104d.zip`, linked from current download page | ZIP tail fetched with HTTP Range `-65536`; central directory: 73 entries, offset 29261451, length 5284. No loose game `.py` entry. |
| FT-T2 | ZIP member `URR0104d.exe` | Range `20781616-28888660` retrieved local header and compressed member. Parser validates member length and CRC before inert extraction. Python version 307, PyInstaller script `URR0104d`. Exact SHA-256 in URR FINDINGS.json and work-area HASHES.txt. |
| FT-T3 | Progress Quest web, official static snapshot on 2026-10-14 | `https://progressquest.com/play/` then linked `roster.html`, `roster.js`, `main.js`, `config.js`, `clock.js`. SHA-256 in PQ FINDINGS.json. No Play button clicked. |
| FT-T4 | Historical third-party mirror `https://github.com/rudle/progress-quest.git` | `git clone --depth 1` to `repos/pq-web-mirror`; commit `b5d3424a6115c07186576afb8e5c5c19fe0894bd`. README identifies a Delphi-to-JS port and original Bitbucket project. Mirror is not current official bytes; official current source includes newer worker/online routes. |
| FT-T5 | Achaea public help and official feature pages | Housing, mining, commodities market, tradeskills, forging and city descriptions read. Old manual sampled through web text as historical evidence only. No server source or login. |
| FT-T6 | Godville official blog and developer app listing | Official public update descriptions read; April-August 2026 claims date-qualified. Server source unavailable in this pass. |
| FT-T7 | Steam 3443480 and 4218540 | Public store pages captured; beta 4219080 identity corroborated by SteamDB. Two developers retained separately. No entitlement assertion or licensing proof. |

`tools/capture.py` saves requested URLs, resolved URLs, byte sizes, errors and hashes to `notes/captures.json`. Twelve primary artifacts attempted serially with a one-second pause; Achaea tradeskill direct snapshot timed out. The official help had already been read through the web tool, so no repeat direct request was made. Text-only snapshots use a local HTMLParser with scripts/styles excluded. Failed captures are recorded as failures, not empty content.

## Installed tools

One isolated venv was created at `tools/venv` using host Python 3.15.0. Installed **xdis 6.3.0**, **click 8.5.0**, **six 1.17.0**. No global or sudo install. xdis parses/disassembles CPython 3.7 code objects without executing their instructions. No downloaded game script, import or simulator was run. The lane-authored inspection scripts alone were executed.

Commands that worked, from any directory:

```sh
git clone --depth 1 https://github.com/rudle/progress-quest.git /Users/weiwei/.codex/research/free-text-worlds/repos/pq-web-mirror
curl -L -sS --fail --range -65536 --max-time 45 -o /Users/weiwei/.codex/research/free-text-worlds/extract/urr-zip-tail.bin https://www.markrjohnsongames.com/wp-content/uploads/2026/01/URR0104d.zip
curl -L -sS --fail --range 20781616-28888660 --max-time 240 -o /Users/weiwei/.codex/research/free-text-worlds/extract/urr-exe-zip-member.bin https://www.markrjohnsongames.com/wp-content/uploads/2026/01/URR0104d.zip
python3 -m venv /Users/weiwei/.codex/research/free-text-worlds/tools/venv
/Users/weiwei/.codex/research/free-text-worlds/tools/venv/bin/python -m pip install xdis==6.3.0 click==8.5.0 six==1.17.0
python3 -I /Users/weiwei/.codex/research/free-text-worlds/tools/inspect_urr.py
/Users/weiwei/.codex/research/free-text-worlds/tools/venv/bin/pydisasm /Users/weiwei/.codex/research/free-text-worlds/extract/entry-URR0104d.pyc > /Users/weiwei/.codex/research/free-text-worlds/extract/urr-disassembly.txt
/Users/weiwei/.codex/research/free-text-worlds/tools/venv/bin/python -I /Users/weiwei/.codex/research/free-text-worlds/tools/select_urr.py
python3 -I /Users/weiwei/.codex/research/free-text-worlds/tools/capture.py
```

Rerun into a new empty directory or reuse the existing captures for reads. A changed ZIP requires rebuilding the central-directory inventory and member ranges, rather than trusting these offsets. Scripts live in the work area and take no game execution path. The synthesized `.pyc` header is for static decoding, with zero timestamp, not a release date.

## Dead ends and route changes

| Code | Attempt | Disposition |
| --- | --- | --- |
| FT-D1 | Web tool could not decode ZIP content type | Switched to direct HTTP download and static range inspection. |
| FT-D2 | Full URR download was slow; early unzip found incomplete central directory | Lane-owned transfer intentionally stopped before failure; selected range fetch succeeded. Partial ZIP retained and hashed as incomplete, not a valid release archive. |
| FT-D3 | Godville landing extraction error and GodWiki browser challenge | Switched to developer blog/app listing. No challenge bypass, login or retries. |
| FT-D4 | Several guessed Achaea help/feature URLs inaccessible | Switched to indexed official help and links from official feature pages; no repeated fetch of failed URL. Exact election thresholds remain unread. |
| FT-D5 | Steam community allnews/RSS and news API extraction inaccessible | Switched to store/news hub and secondary identity catalogue. News hub was script-dependent; no closure claim follows. |
| FT-D6 | Steam appdetails multi-ID request returned 400 | Stopped that API route; direct store captures already worked. |
| FT-D7 | First synthesized pyc header layout was corrected before disassembly | Final header uses Python 3.7 magic 3394 with CR/LF and 12 zero bytes. Extraction/disassembly succeeded after correction. |

## Verification scope

Source/static: ZIP CRC, script decoding, selected instruction traces, official PQ file reads and pinned mirror read. Documents: JSON syntax, evidence-label fields, local Markdown targets, output inventory and 24-touch count checked. Gameplay/build/install/human acceptance: none attempted or claimed. Full URR disassembly is available but not fully reviewed.
