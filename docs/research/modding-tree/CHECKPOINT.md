# Modding Tree checkpoint (2026-10-13)

**Status:** source audit COMPLETE for the TMT engine and Prestige Tree content layers. Profectus partly read (reset, persistence, save, gameLoop). Community game survey PARTIAL.

## Pinned sources

- The Modding Tree: `4d8a86cfb3c59ef3ef4c222f21ef4fbee980c621` (master, 2024-10-28, TMT 2.7). MIT, Acamaeda 2020, plus a bundled Prestige Tree MIT notice (Jacorb, 2020).
- Prestige Tree: `cec9198c8ce9a5c6d107179871cbe84fab92ae0d` (2021-05-25). MIT.
- Profectus: `d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea` (2025-07-17). MIT, Anthony Lawn 2021.

**Code reuse:** permitted under MIT if the notice travels with any copied portion. In practice ideas only: TMT is Vue 2 globals with per-tick code and Decimal math, which does not fit YAIR's frozen-JSON content model. Bundled `break_eternity.js` carries its own license, not checked.

## Covered

TMT `js/game.js`, `js/technical/layerSupport.js`, `temp.js`, `js/utils/save.js`, milestone utils, `mod.js`, `tree.js`; docs for layer features, milestones, challenges, buyables, upgrades, trees; PT layers p, b, t, h, ma (mastery); Profectus reset, persistence, save versioning and offline.

YAIR files read: `src/simulation.js` L520-L632, `src/simulation_contracts.js` L185-L200, `src/save_files.js` L1-L140, `src/frontier_campaign.js` L55-L75, `src/foundation_start_content.js` L70-L90, `src/heir_inheritance.js` head, `docs/ENGINE_AUTHORING.md`.

## Not covered

galaxy.click (404), Discord (login wall), Prestige Tree Rewritten, Incrementreeverse and Communitree source, runtime play, grids/particles/clickables in depth, Profectus boards and requirements.

## Safety and future pass

Shallow clones only, in session scratch. No npm, scripts, repo edits or commits by the lane. No decompile needed. Optional next pass: Prestige Tree Rewritten and The Communitree for many-author layer conventions; Profectus `game/requirements.tsx` and boards.
