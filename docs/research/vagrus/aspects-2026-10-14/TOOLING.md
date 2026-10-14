# Tooling and evidence receipt

Work area: `~/.codex/research/asp-narrative/`. Prior private source `~/.codex/research/vagrus-2/` was read-only. No installs, downloads, clones, account access, assembly execution or game launch. Existing python3, rg and shell tools sufficed. No source acquisition plugin or delegated agent was used.

## Reproduction

1. Read COMMON.md and ASPECTS.md under the game-research-wave-2026-10-14 dispatch, PROJECT top 80 lines, relevant USER_VISION and prior dossiers. Original Vagrus TOOLING.md/private area is missing; the newer pass supplies both recovery and provenance. Do not recreate its extraction needlessly.
2. Use `rg --files` on the prior extract code roots. Read the named methods in ASPECTS/DEEPER_SYSTEMS. Read the data schema without executing the assembly or Ink story. Each source locator refers to the retained decompile from the installed bytes, not an upstream current version.
3. Run `python3 -I "$HOME/.codex/research/asp-narrative/tools/census.py"` from the repo. It checks six installed inputs against prior hashes: Heaven's Vault exe, assembly, resources.assets and sharedassets0.assets; Vagrus assembly and build.json. All six matched in this run. It writes this lane's private INPUT_VERIFICATION and public SYSTEM_INDEX files only inside both permitted output dirs. No upstream private file is changed.
4. Reports were generated with lane-local `tools/write_reports.py` and `tools/finish_reports.py`. They write only the two output folders. `tools/validate.py` validates keys, shape, links, required files, touch counts and whitespace. These are document checks, not gameplay tests.

## Retained detail

Full source code and full raw text/tables stay in the prior private areas. This lane retains two complete compiled Ink helper nodes and one full Vagrus five-step dialogue record in its own `extract/`, plus input verification and SHA256 HASHES.txt. Those include exact IDs, conditions and prose for later reference, but none is copied into committed Markdown. SYSTEM_INDEX is metadata only and names every recovered C# file with byte size. It does not claim semantic reading of every class. The source-readset receipt hashes newly inspected consumers without modifying the prior extracts.

Heaven's Vault original extraction used ILSpy 11.1 and UnityPy 1.25.4, with pinned Ink reference commit recorded in its prior TOOLING. Vagrus newer pass recovered two tables matching the earlier SHA256 and an installed Mono decompile. This lane reused those products without rerunning decryption or dependency installs. Installed build labels 4220136 and 25598304 are inherited from prior manifests; matching selected bytes confirms inspected input continuity, not the current state of every depot or entitlement.

## Dead ends and limits

Broad file listings were narrowed after output truncation. Vagrus EventStep.cs is top-level, EventChoiceButton.cs lives in Vagrus.UI, and VFile.cs in Vagrus.IO; guessed paths failed before the corrected paths were read. build.json graph collections are mappings, so a first list-style index failed; counts were subsequently read as mapping lengths. No fetch failed because no web fetch was needed. The original Vagrus private folder is absent, as the newer pass already reported. No save directory was enumerated, opened or changed. Native UI, roundtrip saves, performance and all expansion access remain unverified under the wave rule.
