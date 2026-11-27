# Fang Yuan: a leaf for a patrol wound

| Preflight | Scope |
| --- | --- |
| Reading | Expand Fang Yuan's ordinary day with a consequential Gu interaction, using the current day comparison and existing Gu readings. |
| Authority | Authorized protagonist interaction expansion; AD38 mechanisms, AD43 delivery floor, AD51 shared law. This is a proposed world binding. |
| Player sentence | “The Vitality Leaf dissolved against the wolf cut and closed it. You can take a watch again.” Without a wound: “You have no patrol wound to treat.” Voice sample: “The kitchens paid a primeval stone for 6 jin of wolf meat.” |
| Ordinary route | Buy and consume a leaf to return to the wall immediately. The existing six-hour binding/rest route remains available without the purchase. |
| Mechanism | The Gu catalogue's Vitality Leaf treatment runs through `gu.working` in the derived command quote. Its healing effect admits treatment of the authored two-point patrol cut. The native transaction consumes the leaf, clears the existing injury and records the treatment. The same saved note supplies the catalogue's one-hour interval. |
| Fit | `gu_working_host.tryGuStep`, catalogue `vitality-leaf.treatment`, structured optional continuations, existing patrol injury and native item ownership. No new simulation effect or save slice. |
| Ring | Producer: healer sells a leaf. Consumer: treatment clears the injury blocking another watch. Failure: no funds, no leaf, no injury, or repeat treatment within an hour. Existing save owners hold purchase, consumption, injury and note. |
| Rules | AR2–AR7, AD38, AD43, AD51, PRS4–PRS7, UR70–UR75, ACR4/ACR6. |
| Files | `ri_leaf_treatment.js`, `book_gu_lead_leaf_treatment.js`, RI day registration/facts/UI hunks, RI tests. One coordinated hunk in `structured_pack_definitions.js` admits the exact bundled injury-clear effect; its negative tests reject other targets, values and command names. |
| Failure and checks | Double use cannot consume another leaf after the wound clears; another fresh wound within the hour is blocked by the saved treatment note. Quote and admission tests, rebuilt desktop journey and persistence proof. |
| Screen | Desktop 1920×1080; treatment and purchase appear in Fang's existing Hero day panel beside patrol/rest. Other leads and mobile deferred. |
| Calibration | Leaf consumption and one-hour repeat interval come from catalogue reading ch102. Two healing points are the existing authored catalogue calibration, bound here to the authored patrol cut. Two-stone purchase price and immediate local sale are proposed local dials, not canon prices. |
| Compatibility | New optional continuation. Existing day and Moonglow continuation identities remain unchanged. Existing saves acquire treatment by adopting it. |

## Receipt

| Check | Evidence |
| --- | --- |
| Focused | `node --test tests/ri_leaf_treatment.test.js tests/ri_daily_powers.test.js tests/ri_lead_day.test.js`: 21 passed. Includes exact admission positive/negative cases. |
| FLR1 Build | `BUILD_OUT=.lane-builds/fang-leaf npm run build` passed. Rebuilt bundle SHA-256 `1660b4128dc1ea22d828363305037b7904052a0de367a8a4491299d7087fe070`. |
| Architecture | `npm run check:arch` passed. No new cycles; main registration lines zero. Existing core owner: one coordinated extension-validation hunk. |
| Rules | `npm run check:rules` stopped at nine pre-existing Mac-only external documentation links. Lint warnings were outside this slice. |
| FLR2 Route | `tests/ri_leaf_browser.mjs .lane-builds/fang-leaf` passed in headless Chrome, fresh browser context, 1920×1080. Setup: composed `ri-fang-yuan-wild-gu` fixture plus rank-two/day pins, patrol injury, a fed held Moonglow and four stones. The earlier story and injury-producing patrol are not walked. Changed actions use native controls. |
| FLR3 Shown | Injury blocks the next watch. Buying spends two of four stones and adds the held leaf. Both paid treatment and six-hour rest are visible in the Hero day panel. [Before treatment](../../../representations/evidence/fang-leaf-2026-11-25/before.jpg). |
| FLR4 Used | Treatment consumes the held leaf, clears the same saved injury the watch reads, and immediately blocks a duplicate treatment. A new watch is then started and completed using the native clock stepper; its saved `patrol_out` requires the ordinary board report. [Returned watch](../../../representations/evidence/fang-leaf-2026-11-25/returned.jpg). This is patrol-cut treatment, not combat-HP healing. |
| FLR5 Kept | Save button, reload, Export download, Import upload in a separate empty browser context all passed. The two remaining stones, consumed leaf, cleared injury and treatment note survived. The imported life completed the next watch. Temporary exported save was deleted. |
| FLR6 Review | Agent-verified, not human-reviewed; composed route. Both desktop captures visually inspected. No browser page errors. No commit, push, installation or deployment. |
| Not covered | Earned Qing Mao checkpoint absent; source journey setup, full campaign, combat HP treatment, a second injury inside the hour, and mobile remain unexercised. The hour boundary is covered by focused law/fact tests. The fixture carries historical away-time metadata; no banked time was spent. |
