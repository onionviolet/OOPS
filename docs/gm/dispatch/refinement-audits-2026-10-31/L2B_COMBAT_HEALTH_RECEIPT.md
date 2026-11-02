# L2b combat health checkpoint, 2026-10-31

**Implemented, below floor.** Shared weekly Codex usage reached the 56% AU7 stop line. Browser verification was interrupted before it returned; this is not a completed or agent-verified player journey. No installation, commit, push or human review occurred.

## Scope and finding

On the known tempo fight path, each move updated detached `plan.vitals.player` but only final settlement staged native HP/stamina offsets. The native transaction writes those offsets to the detached save envelope and publishes the live character after successful storage. Hero HP labels round upward to whole points while the prior tempo card showed tenths. L2b addresses UIF2/F7 with AD6–AD8, AD36, AD42–AD43, AR3/AR10 and UR52. Target: existing fight card and native hero, 1920×1080 desktop; mobile, SRR2 injury durability, witness/aftermath and interruption remain L2c scope.

## Changed paths

- `src/tempo_fight.js` SHA-256 `2714b8431fa099e0fa2aa6c70192cce5f746d411af867e88c8ba5ab6a7ce2d6c`: stage capped player health and stamina offsets after each fight move, using the existing `plan.native` transaction path, and reuse that staging at settlement. Other staged native fields are retained.
- `src/ui/combat_situation.js` SHA-256 `107aee13b1ea97e5ebb869f62888f7a15f4fac1df88bf4e02144d718f0814e4d`: tempo card HP label uses the native hero's ceiling to whole points; the meter retains the precise value. Ordinary combat projection is unchanged.
- `tests/tempo_health_publication.test.js` SHA-256 `11be8607573dab6a649ad191a803184bd3c1146e3668e5de6a4b6e576441e57b`: detached fight-to-persistence damage, a simulated rejected storage write, capped tending, settlement and rounded display regression.
- This receipt and `l2b-evidence/inputs.sha256`, `l2b-evidence/browser-harness.mjs` are the only documentation/evidence writes. The harness SHA-256 is `f6affe0dc7da8b3947ebddf5269aab56cd01a73a1c14e38267d203f6a620cfbf`; it has not completed. <!-- slip-ok: Historical implementation/evidence scope of this receipt; not a general design rule (AD36). -->

L2a's `src/tempo_fight_domain.js` (`ec88ebcf559b81d5f9417b49ac0580b9aedb67613d5e290499dfad6dc49919c2`), `src/combat_situation_ui.js` (`3b550bac744afbbfb26433be6dd2563108f0b5b80b02ecc0a5063686f71200ac`) and `src/ui/tempo_interaction.js` (`be13e008e105c5df83ae773694d2cbe26e26af80142129b68ced98ce742410c5`) were not edited by L2b. Shared checkout HEAD was `43466ba23505c9f751317b4bd9e3ee161158105f` on `master`, with extensive unrelated dirty work preserved.

## Checks already obtained

- `node --test tests/tempo_health_publication.test.js tests/tempo_fight.test.js tests/tempo_exit.test.js tests/combat_situation.test.js tests/combat_interaction.test.js`: **39 passed**. The failed-write test calls the real `persistExpansionPlan` storage boundary with a throwing storage adapter, then checks its detached fight state, native fixture and prior bytes stay unchanged. It does not replace browser proof of the full host transaction. An initial version of the healing test failed because its fixture let the foe hit immediately after tending; delaying that foe in the explicitly labelled fixture made the cap independently observable, and the above run passed.
- `git diff --check -- src/tempo_fight.js src/ui/combat_situation.js`: passed. The new untracked test was not covered by this command.
- Isolated `/tmp/yairpg-l2b-snapshot`: copied 1,815 source inputs including the dirty L2a and L2b files and compared every copied hash with the checkout. [Input manifest](l2b-evidence/inputs.sha256) SHA-256 `13a7f0752a2b5597e71a2948bde05a41eb77c427d6ef323eb4576dbc9b09dfe2`. `npm run build` there passed with the existing duplicate `dial` warning; rebuilt minified bundle SHA-256 `a08dc163dd12bd422741da16a910e2b6c13cef6762a334e62ce448545b7e3774`. Shared `dist` and `index.html` were not written.
- A fresh-origin headless browser harness was started against that rebuilt snapshot, then interrupted at the 56% stop line before producing a report or screenshot. No browser outcome is claimed. No user saves or visible windows were touched.

## Exact next step after authorized resumption

Recheck the shared allowance and input hashes first. If authorized to continue, run `node scripts/l2b-health-browser.mjs /Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/refinement-audits-2026-10-31/l2b-evidence` from `/tmp/yairpg-l2b-snapshot` (the same harness is preserved in `l2b-evidence/browser-harness.mjs`). Inspect its report, resolve any actual failure, and capture the 1920×1080 named seeded fight: actual damage and healing, exact underlying native and fight HP, both displayed numbers, withdrawal settlement, Save/reload and literal Export/Import before and after exit, and an injected rejection at the browser's real storage setter. Confirm L2a focus/feedback still works. If a rerun's inputs differ, rebuild a new isolated snapshot and identify it before claiming evidence.

Still unverified: whether old already-saved in-progress fights with discrepant HP self-reconcile before a new move, the real browser host's rejected write behavior, native ordinary combat and other actors beyond focused coverage, and all browser and persistence journeys above. Treat existing in-progress mismatched saves as an explicit compatibility question, not proven fixed. No full suite, `check:arch`, `check:rules`, packaging, installation or human acceptance was run by this lane.
