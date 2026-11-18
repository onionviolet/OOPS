# PSA24: wire the unreachable effect packs, 2026-11-17

Register status: Proposal (AD32). Runtime slice (AR1-AR16, AD43 floor). Agent-verified, not human-reviewed. Source: PSA24 in the procedural system audit (revamp plan row 1).

## What changed

- `src/world_effect_packs.js` is the manifest: the potion, Gu and Hogwarts effect grammars, the derived LOTM formula and its two sentences, `guEffectSearch`, and a factory per substrate pack the engine registry does not list. Definitions without state or ticks (AR3).
- `src/world_packs/effects_workshop.js` is the played caller: a capability run, "Workshop · Effects", 13 acts, shown to the home hero. `src/capability_runs_domain.js` registers it, so `main.js` gains no line (AR1).
- `scripts/compression_baseline.json`: C6 3 to 7 (the ratchet rises, never falls by default).

The brief said to import through the world-pack manifest. `world_pack_manifest.js` validates plain-data world packs (families, slots, cohorts); an effect grammar or a substrate pack is code that takes a world's own numbers, so it does not load there. The seam that exists for such packs is the engine world's `ownPacks` (E11), which the capability runs already use. Default: use that seam. Dial: a later plain-data form for substrate settings would let them load through the manifest.

## Per-pack proof (AD43 floor)

Build rebuilt, fresh test origin, Game MCP `yairpg-game` on this checkout, seed 11, headless. Open Capability runs, choose Workshop · Effects, Begin, press each act.

| Pack | Act | What the run said |
| --- | --- | --- |
| `brew_vapor` (b.vapor) | Let a flask of irritant boil off | the brewer breathed in 3 units, the rest hung in the room |
| `brew_splash` (b.splash) | Spill the flask on the bench | the brewer is swollen for 30 minutes |
| `gu_aperture` | Let the adept's aperture refill | sea rose by 24,000 motes in an hour (4% of 600,000) |
| `layered_protection` | Strike the ward with fire | the ward took 4 of 4, the wearer lost 0 |
| `breathing` | Send the diver under | breath fell 3 to 0, then 2 vitality |
| `fiendfyre` | Light the aisle with Fiendfyre | aisle fuel 3 to 0 in four minutes |
| `spell_sustain` | Let the caster fall asleep | the conjured thing ended |
| `brew_effects_pack` | Drink a Hogwarts pick-me-up | Pepperup reads "add vitality, self, instant", vitality +3 |
| `gu_effect_pack` | Feed the brewer a vitality leaf | reads "add vitality, touched, instant", vitality +3 |
| `hp_effect_pack` (and `spell_grammar`) | Cast a healing charm | "Heal the caster" reads "add vitality, self, instant", vitality +2 |
| `lotm_derived_cases` | Derive a Sequence formula | Seer (Fool 9), 9 steps; power "bind thing", hazard "transform mind" |
| `effect_checks`, `grammar_search` | Ask the Gu grammar for a new effect | 3 wordings fit, first "conceal information, area, sustained" |
| `kernel_search` | Look for someone worth tending | tried 3 of 4 before the budget ran out |

Persistence: the run lives in the existing `capabilityRuns` slice under a new run id. Save, reload, export and import were exercised in the MCP: after each the run showed 13 of 13 seen, clock 74 min and the same 13 lines. No older save changes (the slice is absent until the run begins).

Gaps, named:

- Reports (follow-up, 2026-11-17): a played act now also writes its line to the Reports log through a `logMessage` port that `native_tool_domains.js` passes to `capability_runs_domain.js`. Seen in the Game MCP on a fresh origin after the Ward act: the Reports view ends with "Ward · the ward took 4 of 4 and the wearer lost 0." The panel keeps its own list too.
- The numbers are the packs' own, but the scene is a workshop demonstration, not a story beat. The fresh-life lives named in the audit (Gu academy, Tingen, Hogwarts) do not yet call these packs from their own play. PSA18's "a played life runs a sentence" is met by an opt-in run, not yet by the lives' own days.
- 60-odd other `world_packs/*` files stay unreachable and were left alone (scope).

## Test changes

Five assertions in `tests/hp_potion_case_scenes.test.js` read `expressed-authored` for cases whose module was library-only. The packs are now reachable from `main.js`, so the common runner reports those cases as `runs-authored`; the assertions follow (this is the C6 and coverage movement PSA24 aims for, not a loosened check). A full `npm test` also failed two LOTM files when the Game MCP's symlinked `private_packs` sat in this worktree; with the symlink removed they pass.
