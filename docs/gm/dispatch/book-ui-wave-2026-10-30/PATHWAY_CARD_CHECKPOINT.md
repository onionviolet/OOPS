# Pathway card and requirements ladder: checkpoint (2026-10-30)

Status: **implemented, below the AD43 floor** (not wired into the host; see "Below the floor"). Target viewport 1920x1080, desktop first; mobile and per-world skins deferred (shared look). Input: Round 5 P5, Rounds 6, 10-13 of [PLAN](PLAN.md). Publication classes (CLR3): code, tests, public screenshots are public; card art, emblems, the publisher summary and private-build screenshots are private and stay out of tracked files.

## What exists

| Piece | File | Class |
|---|---|---|
| Requirement read model (R1-R5): seven families over the existing crossing types, knownness, provenance, known routes, next steps, failure outcomes | `src/pathway_requirements.js` | public, world-neutral |
| Card model and text form (group header, emblem slot, art slot, summary, ladder, routes) | `src/pathway_card.js` | public, world-neutral |
| Card DOM and styles | `src/ui/pathway_card_view.js`, `styles/pathway_card.css` (in `styles/manifest.txt`) | public |
| Private art hook (`pathway-card/art.json` supplement, fetch-if-present like the advancement pack) | `src/pathway_card_art.js` | public code, private data |
| Seer adapter over the real LOTM host view | `src/book_world_lotm_card.js` | public |
| Synthetic second world (cultivation-like realms), labelled a fixture | `src/ui/preview/fixtures/card_paths.js` | public fixture |
| Private staging script | `scripts/stage_pathway_card_private.mjs` | public script, private inputs |
| Host mount (single-writer file) | `patches/pathway-card-host.patch` | for floor-wire |
| Proof entry and capture script | `evidence/pathway-card/proof_entry.js`, `capture.cjs` | public |

Design notes. Scarce token and condition have no crossing type, so the read model takes them from authored `defs` (a def's `family`, or `extras` per edge) and from a lock's reason; `ascension_paths.js` and `ascension_graph.js` are unchanged (L10 owns them). Knowledge per line: level 1 is a locked line with no words of its own, 2 is the family only, 3 is its name, 4-5 adds amounts, ways and what a shortfall does. A rung past the next one that is known only by name shows one locked line, not the shape of its needs. Routes are existing host actions (`v.actions`, `v.actingGuidance`); a route whose action the character cannot see is not listed, and the quote is that action's own duration. Nothing is stored (R7); there is no save state to migrate.

## Checks (one line each)

- `node --test tests/pathway_card.test.js`: 7 pass. Covers the neutral-module ratchet (no world, pathway or lead; text says "the playing character"), the crossing-type-to-family map, known/partial/unknown states and no leak of an unknown line's words, failure outcomes, the art hook with and without a pack, and the Seer card over the real host view at start, after the first dose, and after the lesson.
- Browser, headless Chrome, 1920x1080, fresh profile per shot, text sizes 14 px and 21 px (`--ui-type-body`, the sizes the wave's other proofs use), no horizontal overflow (scrollWidth 1920), no page errors (only 404s for the missing favicon): `evidence/pathway-card/pathway-card-{seer-0,seer-1,seer-2,realm}-{14,21}.png`. Page is a bundled proof entry that builds the card from the real LOTM host view (`tests/lotm_helpers.js` host over a real branch state) and the real stylesheets.
- Taste pass: two rounds against screenshots. Fixed: routes and amounts never rendered (state/knownness mix-up); a rung two steps ahead listed the shape of five unknown requirements (now one locked line); the stub rung above the ceiling showed locked lines (now none); family labels collided at 21 px (min width); the art slot stretched the header (narrowed).
- Public and private builds: public (no art pack) draws the generated glyph in the emblem and art slots with the same layout (screenshots above). Private (art pack staged in a worktree-local gitignored `private_packs/`) loads the emblem and card art (`naturalWidth` 162 and 1131, zero glyphs). Private shots are in the gitignored `docs/research/novels/lord-of-mysteries/private/pathway-card-private-proof/`, not committed.
- `npm run build`, `npm test`, `npm run check:arch`, `npm run check:rules`: see "Gate results" below.
- Persistence (save, reload, Export, Import): not applicable, the card adds no save state.

## Below the floor (stated plainly)

- **Not host-wired.** `src/book_world_lotm_ui.js` and `src/book_world_lotm_path.js` belong to floor-wire (single writer of LOTM host files). The mount is `patches/pathway-card-host.patch` (adds the card under the ladder figure and a one-line `lotmPathDescriptor` export; `git apply --check` passes). Until it lands, the card is not in the running game, so FLR2 (consumer) and FLR4 (game-level browser proof) are open. Browser proof used the real host view and real renderer in a proof page, not the game shell.
- **No game-shell run.** I could not reach a Tingen life in the built game from the Beginning/Worlds panels in a fresh save (only the Soldier's Life world is listed there), so the patched build was not played end to end.
- The Seer card covers the public ladder (Ordinary clerk to Sequence 8, Sequence 7 stub). Rungs above come from the private advancement pack through the same view and get typed lines by crossing type, but have no authored routes, provenance or short-fall text yet.
- Group header (cluster) and arcana are not in `pathways_guide.jsonl` (PG1 lists them as later work); the private card shows the pack's summary and art, and the header reads "Potion sequence".
- Authored Seer routes are sparse on purpose: only actions the host already offers (dose allotment, the dose, the lesson and acting guidance, assessment, examination). Purchase, divination and other ways exist as families in the model but have no Seer content.
- The card duplicates the host's "Plan the next crossing" list; the patch keeps both. floor-wire can drop the plan block once the card's "Find it" (same `findControl`) is accepted.
- Graph shapes beyond a ladder (branches, mixes, swaps) are not drawn on the card; the read model follows the advance chain only.

## Other findings

- `sync_with_base_branch` refused: `origin` now points at `github.com/onionviolet/OOPS.git` but the app pinned `github.com/onionviolet/yet-another-idle-rpg.git`. The branch was fast-forwarded to local `master` with git instead. Re-pin from Help > Troubleshooting > Review Pinned Git Origins if the move is real.
- Origin is public: private-build screenshots contain publisher art and were kept out of the repo.

## Gate results

- `npm run build`: pass (rebuilt `dist/` and `index.html`; the diff includes fingerprint drift from other sessions' stylesheet changes already on master).
- `npm run check:arch`: pass. `npm run check:rules`: pass (17 warnings, none new; 16 receipts).
- `npm test` (full, one run): 4728 tests, 4720 pass, 5 fail. One was mine and is fixed: `ui_contract` flagged literal em spacing, a colour and type sizes in `styles/pathway_card.css`; replaced with `--ui-space-*`, `--ui-line-prose`, `--ui-type-heading` and a swatch token, then `ui_contract`, `stylesheet_manifest`, `pathway_card`, `build_output` re-run: 17 pass. The other four are environmental and untouched by this change: `cast_worksheet` and one more CLI test need the gitignored `docs/research/novels` directory, which a worktree does not have; `cast_inference_adapter` (live integration) and the native place-panel journey died in their child worker after a 274 s run under machine load 20-37. I did not rerun those two on master, so "environmental" is inference.
- Not re-run after the CSS token fix: the full suite (only the four files above plus the browser captures, which were re-shot after the fix).
