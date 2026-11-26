# Earned item arrival, 2026-11-25

| Preflight | Scope |
| --- | --- |
| Question | Which rarity styling and arrival feedback appears when an item is actually earned through normal OOPS play? Follow the Discord audit’s supplied-inventory tier check with a distinct acquisition check. |
| Authority and seam | AD36, UR70–UR75, PS153 and the existing display/feel settings. This is verification of current behavior, not a new visual direction or a claim about unseen Discord motion. |
| Route | Empty browser context, fresh Village, current Here panel → Talk to Old Hesk → hello/head injury/leave/need/starting gear → choose the dagger. The actual dialogue reward grants one native Cheap iron dagger at 50% quality. No supplied save, inventory, learned flags, wall-clock override or CSS timing change. Native game stepping is paused after boot so the dialogue route is reversible and bounded. |
| Screen and proof | Rebuilt headless Chrome, 1920×1080. Five isolated fresh contexts use the real setting controls; the system-reduced case emulates the browser media preference. A separate native-frame capture observes the running animation with screenshots explicitly allowing animations. |
| Changes | New proof script, captures, frame/event observations and this receipt. No runtime/style defect reproduced, so no game-code change. Existing seven-tier artifacts remain byte-identical. |

## Observed result

| Code | Result |
| --- | --- |
| E1 | The earned dagger displays `[50%]`, white common-quality text and the title `Quality 50%: common`. Its settled row has no rarity halo. Reports records `Hero obtained "Cheap iron dagger x1"`. Common and trash are the incumbent plain tiers; this route does not establish a naturally earned uncommon-or-higher item. |
| E2 | Default arrival produces a literal **new** tag and one `feel-new-pulse` CSS animation with a computed 0.9-second duration. The main fresh run recorded start/end events and 26 native frame samples with 25 distinct computed shadow values. The shadow settles back to none while the tag remains. [Settled arrival](default-earned-1920.jpg), [native running-frame capture](default-arrival-pulse-1920.jpg), [event/frame trace](proof.json), [separate capture trace](motion-proof.json). A still capture does not establish the whole motion; the frame/event trace supplies that evidence. |
| E3 | Actual hover acknowledges the item and removes its new marker. Opening the normal item details and pressing Equip creates the separate green ◆ worn mark, with no new marker or arrival animation on the equipped row. Its quality stays common/50%. [Equipped](default-equipped-1920.jpg). |
| E4 | The existing new-item baseline is keyed by native inventory identity, taken at the first trusted game gesture outside the startup/creation overlays. Initial possessions become known; a later unseen inventory key can be marked. This is session presentation, not a saved loot or rarity upgrade. The arrival pulse uses the shared money/accent color, while the static uncommon-and-up edge uses tier color. |

| Actual setting case | Earned item marker | Arrival observation | Quality |
| --- | --- | --- | --- |
| Default Item glow on | `new` | 0.9s, changing multi-frame shadow | Common 50%, white |
| Item glow off | `new` remains | Animation none, zero events | Same |
| Effects reduced | `new` remains | Computed 0s; lifecycle events have zero elapsed duration, one sampled shadow | Same |
| System reduced motion | `new` remains | Incumbent accessibility rule computes 0.001ms, preserving animation lifecycle events; one sampled shadow, no multi-frame pulse sampled | Same |
| New-item dot off | No new marker | Animation none, zero events | Same |

Captures: [glow off](glow-off-earned-1920.jpg), [Effects reduced](effects-reduced-earned-1920.jpg), [system reduced](system-reduced-earned-1920.jpg), [marker off](new-marker-off-earned-1920.jpg). No arrival delay, duration, animation current time or playback rate was set by the proof.

## Trace and verification

The normal reward enters through [dialogue data](../../../../src/data/dialogues.js) and `process_rewards` in [main](../../../../src/main.js). [Display](../../../../src/display.js) owns the session baseline/marker and applies it to unequipped native character inventory rows. [Feel decoration](../../../../src/ui/feel_finish.js) reads native quality and equipped state. [Feel CSS](../../../../styles/feel_finish.css) draws the tier edge, worn mark and arrival pulse. [Workspace CSS](../../../../styles/workspace.css) supplies the system reduced-motion micro-duration cap. [Display settings](../../../../src/display_settings.js) owns the per-browser marker/glow preferences; saved Effects settings cap motion through UI tokens.

`BUILD_OUT=.lane-builds/discord-earned-20261125 npm run build`: passed. Bundle SHA256 `027e28270ce0a49f2165716fea2164622695e6404005d191a379b4a13ad0de6c`.

`node docs/audits/discord_absorption_2026-10-21/earned-item-browser-2026-11-25.mjs`: all five fresh routes passed with zero page errors, normal exit. `node …/earned-item-browser-2026-11-25.mjs .lane-builds/discord-earned-20261125/dist motion`: native running-frame capture and the same acquisition/equip assertions passed, normal exit. No CSS animation was frozen, slowed or sought. [Replay script](../earned-item-browser-2026-11-25.mjs).

The prior seven-tier proof’s bundle SHA256 remains `42f9906310975d82203faa9051ff6b544d77cc4c6bd7203cf6ab3f26f974e6f6`; its three captures and proof JSON match the hashes taken before this task. [Preservation manifest](prior-tier-preservation.json). Those supplied tier rows retain their original scope; they are not relabeled as earned loot.

Agent-verified, not human-reviewed. No higher-tier natural loot, continuous video, audio, mobile, broader Discord media review or persistence change is claimed. No crawl, spend, commit or push. The cited build and evidence remain; test browsers and HTTP server closed normally, with no personal saves accessed.

`node --check` on the replay script, `node scripts/check_doc_slips.mjs` and scoped `git diff --check`: passed. All seven retained desktop captures were visually inspected. Superseded selector/assertion-debug captures were read and removed; they are not delivery evidence.
