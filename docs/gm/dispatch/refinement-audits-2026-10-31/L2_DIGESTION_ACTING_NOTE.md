# L2: digestion, the acting method and advancing (text pass, 2026-11-03)

Proposals only. Nothing here is an accepted decision and no runtime code changed. Receipt: [L2_IMPLEMENTATION_RECEIPT.md](L2_IMPLEMENTATION_RECEIPT.md).

**Locator scheme.** `chN PM` is chapter N of the continuous 1-1394 count in the supplied official English edition (`lotm-en-official`), paragraph M, with `vXcY` added when the chapter is past volume 1. This is the scheme of the round note's `ch33 P038` (checked: ch33 P8, P24, P38 are the Neil passages it cites). Quotation is kept to paraphrase. Labels: **S** shown on the page, **T** told by a character (speaker named), **I** inferred (by a character, or by this note). Machine-translation wording is a risk on every line (WPR4).

## F1 The premise is stale: the engine already has a digestion gate

The round note's O1 says the probe "found no digestion consumer". The code has one, per pathway:

- `lotm.acting` / `<p>.acting` counts completed in-role acts, capped at `LOTM_DIGEST_ACTS` (6, Seer) or the row's `digest` (4 for Corpse Collector via `LOTM_CC_ACTS`, Savant, Sailor, Visionary) (`book_world_lotm_ids.js:20`, `book_world_lotm_rows.js`, `book_world_lotm_pathways.js:19-58`).
- `lotm.<p>.digested` gates the assessment, the examination and the next-Sequence drink (`pathways.js:30-35`, `actions.js:61-67`). The panel shows unsettled / settling / settled (`pathways.js:91`, LTS12).
- A rushed drink is a supported route: `drink_market_<k>8` and, for generated rows, `drink_<k>8_rushed`, which add the `skip`/`rushed` causes and pressure (`book_world_lotm_causes.js:36-42`, `generated.js:80-84`).
- LTS11-LTS14 in `docs/worlds/LOTM_SEER_SLICE_LAWS_2026-10-19.md` already record that counts are authored dials ("canon gives months with acting and about three years without").

So L2 is a check of that gate against the text, plus the pieces the text shows that the gate does not read. The round note should be corrected by its owner (not edited here).

## F2 What the text states, with pathway differences

### Common frame (all pathways)

| Point | Label | Locator |
|---|---|---|
| Roselle's diary: the point of a potion is digesting it, not gaining its power; acting is the method; the potion's name is a concrete image and the "key" | S (diary text) | ch21 P8 |
| The Fool repeats the same three claims to Alger and Audrey | T (Klein as the Fool) | ch34 P58-60 |
| Controlling a potion is not enough (a tamed beast stays outside the person); digestion makes it part of the person, a single system | T (Klein as the Fool) | ch57 P2-3 |
| Acting = actions matching the potion's name, understanding the role's hidden laws, abiding by them; this shifts body, heart and soul toward the potion's remnant psyche | I (Klein) | ch101 P29-30 |
| Zaratul's reported guidance: low Sequences take about half a year with strict acting, a month at best; every Beyonder senses completion without being taught | T (Zaratul, relayed in Roselle's diary, ch93 P33-34; Klein as the Fool repeats it to Audrey, ch93 P52-53) | ch93 |
| Completion is felt as a distinct, unmistakable sensation | T (Church voice, Dunn/Crestet scene) / S (Klein) | ch167 P55; ch101 P33; ch127 P14 |
| Digestion calms the side effects as it progresses | S | ch105 P38; ch118 P20 |
| Acting lowers the risk of loss of control but is "not the be-all"; role and self can blur | T (Crestet) | ch168 P8 |
| The acting method is guarded by oath inside the Church; a wider group knows it (City of Silver, Evernight members) | S/T | ch148 P11; ch170 P5; ch158 P59-60; ch1039 P38 (v5c93) |

### Time bands (the text gives ranges, not counts)

| Band | Label | Locator |
|---|---|---|
| With acting: Seq 8 to 7 three months to two years; Seq 7 to 6 half a year to three years; same for 6 to 5; Seq 5 to 4 three to twenty years. The range depends on how well the drinker grasps the role's core spirit | T (Daly, citing what she read) | ch148 P38 |
| Daly spent about a year each at Seq 9 and 8 and about three years at Seq 7 | T (Dunn's account via Klein's recollection) | ch148 P41 |
| "The normal three years" for a Seer without acting; Klein did it in a month | I (Klein) | ch168 P3; ch154 P20; ch143 P8-9 |
| Seq 7 digestion six months to three years even with acting; a quick grasp of the principles saves one to two months | I (Klein) | ch302 P5 (v2c89) |
| After Seq 7, digestion "easily" a year, two to three years, then five to six | I (Alger's thought, as Klein sees it) | ch442 P18-19 (v2c229) |
| Magician: with principles concluded, under two months, then New Year; Faceless: "several months"; later two to three weeks of acting as the covering identity | I (Klein) | ch397 P25, ch401 P77, ch488 P29, ch634 P55 |
| Hanged Man's Seafarer: nearly four months | I (Audrey) then S | ch341 P63; ch366 P38 (v2c153) |
| Excess characteristic digests much faster with acting experience | S | ch463 P29 (v2c250) |

**Not stated:** any act count, any per-act amount, a rate that scales smoothly with Sequence, or Seq 3-1 digestion figures. The engine's 4 and 6 acts are authored dials (AD49: assumed and flagged where the text is silent). Do not derive counts from these bands.

### Pathway differences the text shows

| Pathway | What shapes digestion | Label | Locator |
|---|---|---|---|
| Seer (9) | Divinations that help people read signs while keeping fear and respect for fate; recognition makes spirituality feel lighter. Klein later doubts that others' feedback is a direct cause | I (Klein); doubt is I | ch101 P29-32; ch364 P4 (v2c151) |
| Spectator (9) | Stay an absolutely objective, neutral bystander; digest by watching | T (Alger's account); summary I (Klein) | ch35 P51, P57 |
| Spectator (Susie) | Susie senses she has digested the potion although nobody taught her the method; the page does not say by what acts | S | ch295 P12-18 (v2c82). The table's "by watching" is not confirmed at this locator |
| Clown (8) | Klein digests in about a month because he already grasps the role; completion arrives at an emotional peak after the revenge | S | ch293 P34 (v2c80) |
| Clown principles | Never perform unprepared, need a stage, finish by diversion; incomplete principles mean slow, shallow digestion, a year or two or three | I (Klein) | ch361 P81 (v2c148) |
| Audience feedback (Clown/Magician line) | A small audience makes digestion feel faster; performances inside the gray fog give no feedback | S (Klein notes it) | ch370 P75 (v2c157); ch374 P32 (v2c161); ch1031 P32 (v5c85) |
| Arbiter | Digested by unknowingly acting the role for over a year; deliberate acting not needed | I (Klein) | ch131 P51; ch406 P43 (v2c193) |
| Faceless | Acting under a covering identity and a sabotage act both advance it; right after drinking there is harmony but no digestion signs | S | ch454 P7 (v2c241); ch492 P33 (v3c10); ch583 P27 (v3c101) |
| Bizarro Sorcerer | Horror acts digest it, faster with an audience; Amon is said to digest in under a month | S / I | ch1031 P32; ch1080 P35 (v5c134) |
| Moon line (Scarlet Scholar) | Sincerely like, worship and study the moon | I (Emlyn) | ch1009 P25 (v5c63) |
| Traveler | Principles differ per person; adjusting them can slow digestion without harm. Acting is a tool | T (instructor) | ch1194 P13 (v6c44) |
| Marionettist | Every marionette keeps a persona; split-personality strain when earlier potions were not completely digested | I (Klein) | ch800 P13 (v4c68) |
| Seafarer, Sun/Bard | Progress read from the surface colour of an Astral Projection with Spirit Vision | S | ch341 P62; ch264 P23 (v2c51) |
| Nightwatcher, Miracle Invoker | Mission work as the role; concluded principles make completion "a matter of time" | I (Klein) | ch1320 P65 (v7c54); ch1316 P1 (v7c50) |

The table's Dai and Susie citations (`0150`, `0299`) do not land on those events in this edition (ch150 is the Azik scene; the band is at ch148 P38 and Susie at ch295). Different locator scheme, left uncorrected in the table; see receipt.

### What else gates advancing besides digestion

| Gate | Label | Locator |
|---|---|---|
| Formula and materials come through contribution, so digestion alone does not release a dose | I (Klein) | ch171 P57; ch216 P46 (v2c3) |
| A ritual is needed from Seq 6 to 5, and digestion gets harder; demigods hold some rituals | I (Cattleya, Emlyn) | ch592 P60 (v3c110); ch1009 P25 |
| In the City of Silver everyone knows the method and rituals are the only block | S | ch1039 P38 (v5c93) |
| Undigested characteristics on top of an advancement ritual would make loss of control certain | I (Klein) | ch1380 P23 (v8c27) |
| Advancing without full digestion is a stated route to loss of control | I (Audrey) | ch295 P11 (v2c82) |
| Digestion lowers risk but does not remove it: fully digested Magician, still "two to three steps" from losing control at Seq 6 | I (Klein) | ch451 P48 (v2c238) |
| Even a completely digested potion did not spare Roselle near-mutation at Seq 2 | I (Klein) | ch1267 P69 (v7c1) |
| Time-only drinkers face real failure odds; Seq 6 numbers fall off | I (Klein) | ch451 P48 |
| The captain advanced twice without full digestion because he did not know the method | I (Klein) | ch154 P6 |
| Age: past a point advancing is too dangerous digested or not | I (Klein) | ch305 P58 (v2c92) |
| The Church's examination checks digestion level, latent dangers, whether you know the method and whether you shared it | I (Klein) | ch168 P4 |
| Digesting a Sequence in a month (instead of about three years) draws attention and may expose the method | I (Klein) | ch143 P8-9; ch216 P46 |

**Unclear (do not use):** ch207 P26 (Dunn says the method "increases the difficulty" of digesting; likely translation or a different sense). **Conflict:** ch364 P4 (feedback is not a direct cause) vs ch370 P75, ch374 P32 and ch1031 P32 (feedback and an audience speed it); both are Klein's inferences, so the engine should not hard-code either (see P3).

## F3 Gaps between the text and what exists

- **G1 Digestion is one dial.** The text ties speed to how well the drinker grasps this role's principles (ch148 P38; ch302 P5), but the engine counts identical acts per row. Not a bug; a flat dial.
- **G2 Digestion does not change the failure odds.** The text says digestion lowers risk without removing it (ch451 P48; ch1267 P69). The engine is binary: digested (safe) or rushed (fixed pressure, `causes.js`).
- **G3 The time-only route is absent.** About three years without the method (ch168 P3, ch148 P41) has no command; `act_*` is gated on `methodLearned`.
- **G4 The exam does not read method knowledge.** ch168 P4 lists digestion level, latent danger and acting-method awareness; the examination command reads digestion and `assessed` only (`pathways.js:116`).
- **G5 No outside reading of digestion.** ch341 P62 and ch264 P23 show Spirit Vision reading it; LTS12 allows a fallible outside assessor but none exists.
- **G6 Only Seq 9 to 8 exists** in play; the ritual, characteristic and Seq 7+ rows (F2 gates) are LATER.

## F4 Bounded design note (proposal, not built)

The passages support one small, additive change and not a new gate.

**P1 (supported): digestion quality as a read of the existing count, not a new meter.** Keep `<p>.acting` and `digest`. Add a `risk` read on the promote step: digested → low residual pressure (text: still non-zero, ch451 P48); rushed → existing causes. The residual value is an authored dial, flagged as assumed (AD49), default near zero for Seq 9→8, because the text shows risk only from Seq 6 up and nothing for Seq 8.

**P2 (supported, small): the time-only route.** For a drinker who has not learned the method, digestion completes by elapsed days, with a long window (default three years; text ch168 P3, ch148 P41), and the examination and the pre-screen apply. It reuses the clock; no new state. The window length is a dial (Seq 8 to 7 range is three months to two years per ch148 P38; use the text's range, not one number).

**P3 (supported as a dial, not a rule): audience feedback.** Digestion progress per act may be weighted when the act is observed by someone who is not the drinker's own gray-fog audience (ch370, ch374, ch1031). The text conflicts (ch364 P4), so ship it off by default and tie it to the pathway row, not to the engine.

**P4 (supported, content): exam reads the method.** One extra examiner read: whether the player learned and shared the method (ch168 P4). Consequence is attention, not refusal, per ch143 P8-9.

**P5 (supported, content): a second reader.** Spirit Vision on another's Astral Projection reports "settled/unsettled" with a stated error (ch341 P62; ch264 P23).

**Not proposed:** act counts from the bands; pathway-specific act lists for any pathway whose principle is not stated; Seq 7+ digestion; ritual gates (LATER, need per-ritual passages); any claim that every pathway needs audience feedback.

Order: P1 and P2 are the smallest ones that change play (a digested drink is no longer free of risk, and a slow route exists). Both need an AD43 floor and a persistence check before they count; neither is started. Runtime owner reads `.claude/rules/runtime-code.md` and `docs/ARCHITECTURE_RULES.md` AR1-AR16 first.
