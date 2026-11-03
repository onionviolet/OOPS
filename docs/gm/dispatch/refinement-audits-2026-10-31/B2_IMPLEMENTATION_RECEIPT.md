# B2 implementation receipt: darkened eyes visible to cast observers (M4), 2026-11-03

Status: implemented, below floor (focused-tested and built; no native run). Rules: AR1-AR16, AD36, AD43, AD38, AD49. Numbers: none added.

## What changed
- `book_world_lotm_be_seer.js`: condition `book.lotm.be_seer_eyes` ("Darkened eyes", concealed `look`, slot `eyes`, `seenBy: ['beyonder']`), builders `beSeerEyesDarkEffects()` / `beSeerEyesClearEffects()`, a `restoreEyes` option on `beSeerCogitateEffects(amount,{restoreEyes})`, and one assertion (the eyes need the drink). Registered in `book_world_lotm_content.js` (`conditions`).
- `book_world_lotm_abilities.js`: `LOTM_CAST_OBSERVERS`, keyed by stable index id (Old Neil, Dunn Smith, Leonard Mitchell), and `lotmReveal(..., indexOf)`. Pack ids are hashed, so a cast person resolves through the loaded pack's `indexId`.
- New `book_world_lotm_cast_reveal.js`: `lotmCastReveal(observerId, registry, state)` and `castIndexOf`; the result feeds `characterBioView({reveal})`, the existing route.
- `character_bio.js`: slot label `eyes` (without it the look was collected but never listed).

## Dials (defaults, not rules)
- Observer table is data: add a person to let them read a concealed look. Dunn and Rozanne make no remark in ch32-33; being in the table means they could see it if they looked, not that they comment.
- The sign is subtle (dark brown reads as black unless looked at closely, ch32 P040), hence concealed.
- Cogitation restores the eyes only when the content passes `restoreEyes:true`. Neil gives the return as Cogitation plus power convergence (ch32 P041); no paragraph through ch33 shows it, so the default leaves the sign (brief Q4). Apply has no duration (the text gives none).

## Compatibility
Additive condition definition and one assertion; no schema bump. Older saves hold no such condition.

## Evidence rows
- source-edited: yes. focused-tested: yes. built: yes. native: no. packaged/installed/human-accepted: no.
- `node --test tests/lotm_be_seat.test.js`: 15 pass (new case: cast Neil via hashed id sees the eyes, clerk and unobserved owner do not, index id works, round trip, Cogitation with and without `restoreEyes`).
- `node --test` abilities, sailor, seer slice, primary compat, character bio: 31 pass, 0 fail.
- `npm run build` ok (dist restored, not committed). `check:arch` pass (main.js -5). `check:rules` pass, 0 problems.

## Not verified / native proof needs from kjw6
No place-act row applies the condition yet, and no UI calls `lotmCastReveal` (the bio view passes `reveal` only in tests). For ch32 P041, the act should apply `beSeerEyesDarkEffects()` after the drink effects; the confirming line then reads `lotmCastReveal(<Neil's pack id>, registry, state)` to include `book.lotm.be_seer_eyes`. A surface that shows what an observer sees is a content or UI follow-up, not built here.
