# R4 prompt for Codex: the sources R1–R3 could not read

Prompt for a Codex session in `/Users/weiwei/code/yet-another-idle-rpg` (UIC87 in [UI audit round 41](../../audits/UI_DESIGN_CORE_AUDIT.md#round-41-2026-11-10-research-returns-on-distinct-forms)). Written 2026-11-10 at Weibao's request ("Give me prompt for codex to find the reports and stuff in case they can view it? Try chrome extension if needed and more"). Paste everything below the line.

---

You are running research lane R4 for YAIRPG, a text-forward idle life-sim RPG with many book worlds (Lord of the Mysteries, xianxia cultivation, D&D and others). It is built with vanilla JS DOM and inline SVG, and ships as a web build and a Tauri desktop app on macOS.

**Goal.** Fill the evidence gaps that the first three research lanes could not close because pages were blocked, truncated or video-only. The question behind all of it: how do games and projects that solve the same problem give each mechanism a distinct, readable, reactive form (rituals, mixing, cultivation, investigation, relationships), and what does that cost to build?

**Read first, in this order.**

1. `AGENTS.md`, the startup read.
2. `docs/UI_RULES.md`, section "Distinct, reactive and pleasing surfaces" (UR93–UR99).
3. `docs/audits/UI_DESIGN_CORE_AUDIT.md`, rounds 39, 40 and 41 (search `## Round 39`).
4. `docs/reviews/ui-distinct-forms-2026-11-10/R1_GAME_REFERENCES.md`, especially "Gaps for a follow-up lane" and every claim tagged `[K]` or `[?]`.
5. `R2_LAYERS_LIBRARIES_ORNAMENT.md` and `R3_ACCESSIBILITY_AND_COST.md` in the same folder, for their unverified claims.

Do not redo what those files verified (tag `[S]`). Upgrade `[K]` and `[?]` claims to `[S]` with a source, or correct them.

**Targets, in priority order.**

1. **Cultivation UIs (the biggest gap).** No source yet shows a meridian, dantian or realm-chart interface. Find screenshots, store pages, wikis, reviews and dev posts for:
   - Tale of Immortal;
   - Amazing Cultivation Simulator;
   - Immortal Life;
   - Wandering Sword;
   - Path of Immortals (or similar);
   - any game with an acupuncture or meridian-chart UI;
   - Chinese-language sources (Bilibili, Zhihu, TapTap, Steam CN reviews).

   For each, describe the body or realm form: what is drawn, what fills, what blocks, and how a breakthrough shows. If nothing exists, say so with what you searched, so we can record our body chart as original.
2. **Developer talks.** Get transcripts or detailed summaries of:
   - Daniel Mullins, Inscryption, "Sacrifices Were Made" (GDC 2022);
   - Josh Sawyer and team on Pentiment's lettering and fonts (GDC 2025 or interviews);
   - Zach Barth, Zachtronics (GDC 2018 and 2019);
   - the Cultist Simulator and Book of Hours talks or blogs by Alexis Kennedy and Lottie Bevan (Weather Factory's own blog);
   - Lucas Pope's Obra Dinn devlog on TIGSource;
   - Gareth Damian Martin on Citizen Sleeper's UI;
   - the Hades UI/VFX article on 80.lv (full text);
   - the Slay the Spire talks on intents.

   For YouTube talks, use the captions. Try `yt-dlp --write-auto-subs --skip-download` if it is installed, YouTube's transcript panel in the browser, or the `vimeo-transcript` helper named in `docs/TOOL_REGISTRY.md` for Vimeo. Summarize; do not paste transcripts.
3. **Pages that returned 403 or truncated text.**
   - Potion Craft's UI article on Medium.
   - PC Gamer's Pentiment piece.
   - The Shacknews Potion Craft article (full text).
   - Any Disco Elysium interview on the skill voices and passive-check display.
   - A screenshot check of Disco Elysium's per-skill colours and Citizen Sleeper's dice and body UI.
4. **Idle games at design or engineering level.** Kittens Game (its open source on GitHub counts), Antimatter Dimensions (open source), Melvor Idle, A Dark Room, Universal Paperclips. What do they animate, what do they skip, and how do they show returns and offline progress? How does each keep a distinct look with few assets? Reading their source code on GitHub is allowed and encouraged.
5. **Library facts R2 marked third-party or unverified.** Bundlephobia or pkg-size numbers for `motion` (mini animate), `roughjs` and `animejs` v4. Current licence and maintenance status. Any WebKit/Safari issues with Rough.js or Motion.
6. **WebKit filter performance (R3 F8).** Are the WebKit bugs on animated `feTurbulence` and `feDisplacementMap` still open as of 2026? Link each bug and give its status.

**Routes when a page is blocked.** Switch route after one failure; don't retry variants of the same fetch.

1. Plain fetch first.
2. On 403, a login wall or a script-rendered page, use the browser.
   - **The Chrome extension (Claude in Chrome) is allowed for this task**, because Weibao asked for it.
   - Work in a new background tab and close it when done.
   - Do not sign in, accept terms or click consent beyond the privacy-preserving choice.
   - Take no action on accounts.
   - If a page needs a sign-in, skip it and record that.
3. Archive routes: the Wayback Machine (`web.archive.org/web/2024*/<url>`), Google cache equivalents and archive.today when reachable.
4. Video: captions as above. Store pages: the Steam store and SteamDB for screenshots; describe screenshots in words.
5. Chinese sources: search in Chinese (for example 修仙 经脉 界面, 太吾绘卷 UI, 鬼谷八荒 经脉).

**Rules.**

- Work in the background by default (his standing rule): no visible windows beyond the Chrome tab route above, and no native computer control.
- No paid services and no API billing.
- Copyright: summarize in your own words; at most one quote under 15 words per source; no transcript dumps; no song lyrics.
- Tag every claim `[S]` (a fetched page or transcript said it, with its URL), `[K]` (recalled, unverified) or `[?]` (could not verify).
- Write plain words with no em dashes. Write any constraint as default, dial and reason, never as never/always/only.
- Do not edit any file except your output file. Do not commit. Weibao or the Claude session commits.

**Output.** Write `docs/reviews/ui-distinct-forms-2026-11-10/R4_BLOCKED_SOURCES.md` with:

1. **What was reached.** A table of each target, the route that worked or failed, and the URL.
2. **Findings per target.** For each mechanism form:
   - what is drawn;
   - how it teaches the rule;
   - what reacts;
   - the material and motion;
   - build cost if stated;
   - the level it fits: L2 layout, L3 mechanism form, L4 world dress or L5 diegetic frame.
3. **Corrections to R1–R3.** Each `[K]` or `[?]` claim upgraded, corrected or still open.
4. **The cultivation verdict.** A precedent with sources, or "original" with your search list.
5. **Ranked list.** ACT NOW / ACCOUNT FOR NOW / LATER, each item tied to a UIC code from rounds 39–41 (UIC50, UIC57, UIC66, UIC68, UIC71–UIC86), with effort and a done check.

Finish with a 200-word summary in chat: what you reached, what stayed blocked, the cultivation verdict, and the top three changes to our plan.
