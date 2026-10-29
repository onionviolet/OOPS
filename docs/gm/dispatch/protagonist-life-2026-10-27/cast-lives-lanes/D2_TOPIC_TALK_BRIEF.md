# Lane brief: D2, pack-driven talk on a topic with choices (largest whole-book gap family)

Model: `gpt-6.1-sol`, medium. Local, `/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; never stash, reset, force
or push. Read first: [X4_CHECKPOINT](X4_CHECKPOINT.md) "Resume 1" (family table: speak or ask 1,196 whole-book gaps, agree
or refuse 311, direct another actor 127, obtain information 104), [H1_CHECKPOINT](H1_CHECKPOINT.md) and `src/place_acts.js`
(the pack-driven act pattern to follow), [P6_CHECKPOINT](P6_CHECKPOINT.md). Rules: `.claude/rules/runtime-code.md` AR1-AR16,
AD36, AD38, AD43, AD45, MD1-MD3, CLR1-CLR12, LSD60 (relationships), LSD139 (keyed draws). Publication: public code
(name-free) in `src/` and `tests/` using synthetic ids; canon rows only in private packs.

## Why

Today the only talk control is a brief greeting with a principal, no time cost. The book's talks are about something: a
topic, a question, an offer, a request, an agreement or refusal, with a person, at a time, costing minutes and changing
what each side knows and how they stand. One mechanism that takes talk rows from the pack and runs them as real native
commands unlocks the biggest verb family in the whole book. Each row keeps inputs, costs, outcomes and who was there (CLR6).

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Existing talk-like commands and the people each reaches (principal, recurring, role) | list | | yes |
| Native stock a topic talk can reuse (dialogue, knowledge effects, relationship or standing facts, time cost) | list | | yes |
| Where `place_acts.js` pack rows are defined, quoted, committed, reported | list | | yes |

## Scope and seam

- A world-neutral module `src/cast_topic_talk.js` modeled on `place_acts.js`: `defineTopicTalks(data, ports)` turns pack
  rows into commands; rows carry: person id, topic id and label, minutes, optional requirements (a knowledge key,
  a place or hour), choices (each choice: label, effects: knowledge written to either side with basis, relationship
  or standing delta through the existing owner, optional follow-on wake or time cost), and a blocked reason when
  the person is away (reuse `castTalkPreview` logic through a port). Quotes show cost and every choice's effects before commit.
  Draws, if any, are keyed (LSD139). Absent means silent (CLR4).
- Files owned: `src/cast_topic_talk.js`, `tests/cast_topic_talk.test.js` (synthetic ids), `cast-lives-lanes/D2_CHECKPOINT.md`.
  `src/book_world_lotm_cast_host.js` is held by lane P7: write the registration as a prepared patch
  `D2_INTEGRATION.patch` (one registration site, host-file hunks, a `topicTalks` pack field read like `householdActs`)
  and a second patch for the Tingen save validator if admitted jobs need it (H1's `H1_SAVE_INTEGRATION.patch` pattern).
  Do not touch `src/main.js`. Do not edit `private_packs/`.
- Save: pending jobs are JSON and validate through the owning validator; missing pack means existing missing-pack policy.
  Pre-D2 saves stay valid (additive facts). No new save slice; say so in the checkpoint.
- UI: topic talks appear where talk controls appear today, grouped under the person, with disclosure group and perspective tag
  as H1's acts do (CL228, CL243). Desktop 1920×1080 first; no mobile work.
- Fixture: a synthetic pack with two people, three topics (one with a refusal branch, one gated by knowledge, one away),
  built in the test only.

## Done check

Focused test passes (quote, commit, away reason, gated topic, choice effects, save/reload through the real validator with
the prepared patch applied to a disposable copy, Export/Import); `npm run check:arch` no growth; lane review; checkpoint
with FLR lines. Verification gaps stated plainly (below floor until a browser run). Ambiguity default (CLR12): where a
choice's relationship effect has no existing owner, record it as knowledge only and name the owner needed.
