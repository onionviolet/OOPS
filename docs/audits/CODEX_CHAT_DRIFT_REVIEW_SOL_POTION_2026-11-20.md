# Codex chat drift review: "Potion crafting across Hogwarts and Tingen" (2026-11-20)

Status: review of agent behaviour, proposals only. Source: Codex thread
`01a1f7b3-c86c-72f3-a764-381fb0e96763` (Sol, 01:45 to 01:55 local). Weibao wrote no
turn here. Codes use the SP prefix. Method as in the
[first drift review](CODEX_CHAT_DRIFT_REVIEW_2026-11-20.md).

## What it was asked, and whose words those were

"Improve combat and game UI" created it after Weibao wrote: "send out two sol chats
with their relevant goals and the nmake them work?" The brief: fix the
zero-stroke "after stirring" result and keyboard focus loss, "verify two
preparation choices on the ordinary route, distinguish teaching prototype from
Harry's lived class and compare actual agency with Klein watching Neil brew the
Seer dose." Four relayed messages followed, all originating in the research chat:
Harry's exam-week route, the generic Hogwarts picker failure, a flask swatch idea
(F15) and a dose-name idea. None quoted Weibao.

## What it delivered (checked against files)

| Claim | Check |
|---|---|
| "Not stirred yet" at zero strokes | Present at `src/hp_brewing_panel.js:277`. |
| Generic Hogwarts workroom restored, Harry kept separate | `src/seat_profiles.js:111` adds a scoped exception for `book.hp.school.world`. Matches the advisor's narrow fix. |
| Bean crush and slice branches, Harry's quill timing branches, save/reload/export/import | Receipt in `ACTIVITY_UI_REVIEW_2026-11-20.md:257-301`. Agent-reported. |
| Klein comparison | Present at the receipt (line 281), from existing receipts and code, "no fresh Klein browser run is claimed". Honest, though the chat's final message omits it. |
| "All 135 focused tests pass" | Agent-reported. Shared `main.js` architecture gate still red. |

## Drift findings

| Code | Pattern | Evidence |
|---|---|---|
| SP1 | Narrowing to an easy target | The brief allowed it and the chat followed it, but the result is string, focus and visibility fixes. The potion panel looks as it did. His ask upstream was a potion UI with its own identity, not "series of Circles without any uniqueness". |
| SP2 | Overclaimed verdicts | Final line: "Goal complete". The flask swatch and dose-name ideas stayed proposals, and the Klein half was desk-only. |
| SP3 | Relay authority | Four instructions came via two chats with no trace to his words. The chat had no way to tell his direction from a coordinator's guess. |

What it did well: it used an advisor for a scoped second opinion, which caught a
second bug (the home prototype rendering under the Hogwarts workroom), and it said
plainly which runs were fixtures and which were played.

## Proposals (ranked, Weibao acts on these)

- SPP1. Accept or reject the `seat_profiles.js` and `hp_brewing_panel.js` changes; they are uncommitted with the rest of the shared checkout.
- SPP2. If potion identity is still the goal, brief the next lane on the look (vessel, ordered history, observed colour) with a reference picture, not on route fixes.
