# Kingdom of Loathing through KoLmafia aspect pass, 2026-10-14

Pinned KoLmafia d6747f7, third-party Java client and data. Server prose/state arrives over HTTP. Client logic is SHOWN; actual server implementation, authoritative account persistence and live choice eligibility are unread. Prior path/archive findings retain their dates.

All recommendations are PROPOSALS. No runtime implementation or accepted decision. No game was launched, downloaded code run, personal save opened, account used, install changed, git staged, committed or pushed. Only assigned aspect folders and asp-text scratch were written. Desktop first; one realm/one prestige remains the milestone; no fixed solo once restriction is adopted.

SHOWN means statically inspected artifact behavior. STATED means documented by source/help/store. INFERRED identifies our interpretation. Covered is a bounded aspect answer, not exhaustive content or runtime verification.

## A01 Dialogue and conversation

Status: partial

SHOWN: ChoiceUtilities extracts choice IDs from hidden fields or fallback encounter names, parses forms/links into numeric options and text labels, and skips non-choice forms. ChoiceManager follows choice chains, optional scripts, manual fallbacks and fight redirects. This is a response adapter, not KoL dialogue authoring or a full NPC tree. Player chat is a separate package and is not NPC conversation. Speaker portraits, relationship predicates and full dialogue corpus are unread.

- SHOWN: [extractChoice, parseChoices](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/utilities/ChoiceUtilities.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.
- SHOWN: [processChoiceAdventure, invokeChoiceAdventureScript](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/session/ChoiceManager.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.

PROPOSAL: Store a stable encounter/option identity, display actual available choices and revalidate before effects; never equate parsed labels with authoritative rules. Owner: `docs/worlds/DIALOGUE_AND_INTERACTIONS.md`.

## A02 Narrative delivery

Status: covered

SHOWN: QuestDatabase uses quest preference IDs with unstarted/started/step/finished state strings and text matching; QuestLogRequest reads multiple server journal sections and reconciles state. Data questslog.txt associates quest titles and progress text. Specific adventure handlers track branch effects. Prior dossier corrects the Council spine: some paths replace or reroute it. This describes client recognition, not server scheduling or the complete prose catalogue.

- SHOWN: [Quest, quest state helpers](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/persistence/QuestDatabase.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.
- SHOWN: [run, registerQuests](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/request/QuestLogRequest.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.
- SHOWN: [src/main/resources/data/questslog.txt](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/resources/data/questslog.txt). d6747f7af98605b14eaeb2c63e11daa9532e1152.

PROPOSAL: Keep structured quest state and receipts separate from rendered prose; alternative goal graphs can reuse places and skills. Owner: `docs/PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md`.

## A03 Implementation architecture

Status: covered

SHOWN: Java request classes parse game responses; session managers reconcile custom systems; persistence databases load tabular data; Swing and relay-browser code display or decorate results; ASH and JavaScript runtimes automate supported operations. Specific path managers supplement shared modifier tables. No KoL server engine, tick loop or database source was acquired.

- SHOWN: [src/main/java/net/sourceforge/kolmafia/session/ChoiceManager.java](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/session/ChoiceManager.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.
- SHOWN: [src/main/java/net/sourceforge/kolmafia/textui/AshRuntime.java](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/textui/AshRuntime.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.
- SHOWN: [src/main/java/net/sourceforge/kolmafia/textui/javascript/JavascriptRuntime.java](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/textui/javascript/JavascriptRuntime.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.
- SHOWN: [src/main/java/net/sourceforge/kolmafia/session/QuestManager.java](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/session/QuestManager.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.

PROPOSAL: Use shared definitions plus explicit custom action handlers; third-party client projections should never become the model of authoritative game state. Owner: `docs/ENGINE_EXPANSION.md`.

## A04 Save and persistence

Status: partial

SHOWN: KoLmafia PreferencesFile owns properties snapshot, backup, temporary file and append journal. It validates empty/null-byte files, tries backup then temp, salvages complete lines, replays ordered journal entries and removal markers, trims by 10 MB or one day, writes/syncs temp then moves it into place. Preferences separates user/global defaults and reset scopes. This saves client settings/tracking, not a complete KoL account; server save format, migration and offline processing are unread. No user preference or save file was accessed.

- SHOWN: [loadWithBackup, applyJournal, appendChange, savePrefsFile, safeMove](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/preferences/PreferencesFile.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.
- SHOWN: [reset, resetPerAscension, resetDailies](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/preferences/Preferences.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.

PROPOSAL: Preserve the last valid save, make salvage explicit and publish atomically; retain module validation and reject unsupported schemas. Owner: `docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md`.

## A05 AI and NPC behavior

Status: partial

SHOWN: monster records and combat response handling describe opponents; choice automation and scripts implement client decisions. These are not NPC server planners or schedules. Familiar/path handlers track selected behavior and custom state, but full authoritative enemy rules remain unread.

- SHOWN: [src/main/resources/data/monsters.txt](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/resources/data/monsters.txt). d6747f7af98605b14eaeb2c63e11daa9532e1152.
- SHOWN: [src/main/java/net/sourceforge/kolmafia/request/FightRequest.java](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/request/FightRequest.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.
- SHOWN: [src/main/java/net/sourceforge/kolmafia/session/ChoiceManager.java](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/session/ChoiceManager.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.

PROPOSAL: Keep enemy behavior distinct from player automation; share capability predicates only when a real actor consumer exists. Owner: `docs/CHARACTERS_AND_WORLD_EVENTS.md`.

## A06 UI and information design

Status: partial

SHOWN: relay responses can gain spoiler/option decoration and manual browser fallback when automation cannot recognize a choice; Swing frames and CLI expose several client views. ChoiceManager preserves last raw/decorated response separately. No current official game layout, desktop density or accessibility behavior was exercised.

- SHOWN: [lastResponseText, lastDecoratedResponseText, no-choice abort](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/session/ChoiceManager.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.
- SHOWN: [parseChoicesWithSpoilers](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/utilities/ChoiceUtilities.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.
- SHOWN: [src/main/java/net/sourceforge/kolmafia/swingui](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/swingui). d6747f7af98605b14eaeb2c63e11daa9532e1152.

PROPOSAL: Keep raw event identity and presentation separate; show an explained blocker instead of silently choosing unknown options. Owner: `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`.

## A07 Content authoring and modding

Status: covered

SHOWN: tab-separated resources and databases define items, effects, skills, modifiers, quests and daily limits; custom manager code handles special transitions. ASH/JS scripting extends client behavior, not server content. Authoritative KoL editor, load order and validators remain unavailable.

- SHOWN: [src/main/resources/data](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/resources/data). d6747f7af98605b14eaeb2c63e11daa9532e1152.
- SHOWN: [src/main/java/net/sourceforge/kolmafia/textui/AshRuntime.java](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/textui/AshRuntime.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.
- SHOWN: [src/main/java/net/sourceforge/kolmafia/textui/javascript/JavascriptRuntime.java](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/textui/javascript/JavascriptRuntime.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.

PROPOSAL: Validate stable IDs and declarative prerequisites while allowing registered effect handlers; do not import arbitrary automation scripts into content. Owner: `docs/ENGINE_AUTHORING.md`.

## A08 Balance and numbers

Status: partial

SHOWN prior format-aware counts: 12,098 items, 3,014 effects, 1,651 skills, 2,389 monsters, 601 adventures, 324 familiars, 13,369 modifier records, 258 lexical fields and 439 daily-limit records. These supersede base report line counts. Modifier expressions use context; class/path capacity and permissions are distinct. Server RNG, seeds, pity and exact live drop formulas unread.

- SHOWN: [src/main/resources/data/modifiers.txt](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/resources/data/modifiers.txt). d6747f7af98605b14eaeb2c63e11daa9532e1152.
- SHOWN: [src/main/java/net/sourceforge/kolmafia/ModifierExpression.java](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/ModifierExpression.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.
- SHOWN: [src/main/java/net/sourceforge/kolmafia/persistence/DailyLimitDatabase.java](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/persistence/DailyLimitDatabase.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.

PROPOSAL: Reuse one property vocabulary with explicit exceptions; record count is not balance proof or number of mechanics. Owner: `docs/ENGINE_EXPANSION.md`.

## A09 Time and scheduling

Status: partial

SHOWN: preferences have separate per-fight, rollover and ascension reset consumers. DailyLimitDatabase models charges, shared tome pools and aftercore distinctions. Rollover is server-linked; no continuous offline simulation or current bank cap proof follows from the client. The historical 40-turn description remains archive evidence.

- SHOWN: [resetStartOfFight, resetPerRollover, resetDailies, resetPerAscension](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/preferences/Preferences.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.
- SHOWN: [src/main/java/net/sourceforge/kolmafia/persistence/DailyLimitDatabase.java](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/persistence/DailyLimitDatabase.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.

PROPOSAL: Name allowance scope, replenishment clock and reset boundary; keep world-specific repeat access and avoid fixed solo once limits. Owner: `docs/TIMELINES_AND_DIVERGENCE.md`.

## A10 Onboarding and reveal

Status: partial

SHOWN: quest enum includes TOOT tutorial state, while class/path checks gate content and capacity. Choice automation falls back on unexpected data. Complete live tutorial text, staged panels and first-run path selection not read.

- SHOWN: [Quest.TOOT](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/persistence/QuestDatabase.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.
- SHOWN: [src/main/java/net/sourceforge/kolmafia/AscensionPath.java](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/AscensionPath.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.
- SHOWN: [src/main/java/net/sourceforge/kolmafia/AscensionClass.java](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/AscensionClass.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.

PROPOSAL: Teach a real action then reveal a supported alternative; optional starts may change rules while keeping ordinary access reachable. Owner: `docs/worlds/DIALOGUE_AND_INTERACTIONS.md`.

## A11 Little touches

Status: covered

SHOWN: option labels entity-decode, duplicate options are ignored, form and link options are both recognized, hidden labels have a fallback, raw/decorated responses are separate, script redirects are detected and unknown choice pages stop automation. Preference journaling preserves complete lines and escaped deletion markers. These are client quality-of-life mechanisms, not official UI acceptance.

- SHOWN: [src/main/java/net/sourceforge/kolmafia/utilities/ChoiceUtilities.java](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/utilities/ChoiceUtilities.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.
- SHOWN: [src/main/java/net/sourceforge/kolmafia/session/ChoiceManager.java](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/session/ChoiceManager.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.
- SHOWN: [src/main/java/net/sourceforge/kolmafia/preferences/PreferencesFile.java](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/preferences/PreferencesFile.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.

PROPOSAL: Give automation a clear pause reason and protect progress when content recognition fails. Owner: `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`.

## A12 Other systems

Status: partial

SHOWN prior deep pass covers robot body/CPU permissions, absorption, research trees, biodiversity progression, familiar team moves, recipe methods, replica shop data, ascension and mode exit. Clan dungeons, PvP seasons and each monthly item are still unread. Managers are inventoried with sizes; names alone do not prove every mechanic.

- SHOWN: [src/main/java/net/sourceforge/kolmafia/session/YouRobotManager.java](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/session/YouRobotManager.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.
- SHOWN: [src/main/java/net/sourceforge/kolmafia/session/GreyYouManager.java](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/session/GreyYouManager.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.
- SHOWN: [src/main/java/net/sourceforge/kolmafia/request/ResearchBenchRequest.java](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/request/ResearchBenchRequest.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.
- SHOWN: [src/main/java/net/sourceforge/kolmafia/session/BugbearManager.java](https://github.com/kolmafia/kolmafia/blob/d6747f7af98605b14eaeb2c63e11daa9532e1152/src/main/java/net/sourceforge/kolmafia/session/BugbearManager.java). d6747f7af98605b14eaeb2c63e11daa9532e1152.

PROPOSAL: Separate identity, acquisition, legal use, transformed function and exit conversion; Province War can cite zone overlays without adopting KoL charge rules. Owner: `docs/ENGINE_EXPANSION.md`.
