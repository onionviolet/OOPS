# W35: Canon calendars, other worlds

## CHECKPOINT

Complete design census, 2026-10-14. W35 owns this file and `docs/gm/dispatch/world-core-kit-2026-10-14/W35_REPORT.md` only. Seven worlds covered; profile choices and starts remain INFERRED proposals, not accepted decisions or gameplay. No sealed file opened. No source edits, builds, tests, saves, branch checkout, staging, commit or push. Resume by refreshing the root and W25/W29-W32, then resolving the named evidence gaps before any implementation.

## Scope, authority and evidence

Extends round 12 CC1-CC16, CW-C3/C7/C8/C9 and KX76-KX81 in the [kit root](../WORLD_CORE_KIT_2026-10-14.md#round-12-canon-calendars-2026-10-14). Read [COMMON](../../gm/dispatch/world-core-kit-2026-10-14/COMMON.md) first, the [audit playbook](../WORLD_CORE_KIT_AUDIT_PLAYBOOK.md), AGENTS, PROJECT standing priorities and USER_VISION. Canon-first order and the one-realm/one-prestige milestone remain unchanged. This census authorizes no world implementation.

The first calendar owners read were [origins: overarching history with local calendars](../ORIGINS_AND_WORLD_TIMELINES.md#overarching-history-with-local-calendars), [intro flow](../../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md) AH1-AH12, SS4, MZ5, IR3, [MoL pilot lessons](../../gm/dispatch/canon-events-2026-10-14/pilot-mol/LESSONS.md) K3/K6, and [timelines](../../TIMELINES_AND_DIVERGENCE.md) TIME-P4. They already separate campaign order, local date, exposure, anchor precision and recurrence. W35 supplies content candidates for those owners, not a replacement timeline service.

Read [W25](W25_CLOCKS_AND_AWAY.md), [W29](W29_PARADISE_SPECIAL.md) and [W30](W30_HP_DND_MOL_SPECIAL.md). W31 appeared before final review and its opening source/continuity rules were read; W32 remained absent at the last sibling check. W25's clock projection and W29's hub/derived-world distinctions apply: a named calendar formats local elapsed; it neither supplies a second ticker nor decides absence advancement. No unmerged branch was used. Branch findings in siblings remain their attributed evidence, not W35 live-code claims.

**Evidence vocabulary:** SHOWN means actually inspected source text with its locator, including code or owner text. STATED means a publisher/official/wiki assertion with URL or local path; a wiki's chapter reference is not a primary chapter read. MEMORY means unchecked recall. INFERRED means W35's proposal or deduction, never source text. Unknown means no sufficient evidence found in this bounded read, not proof that the world has no calendar.

Direct Fandom opens failed with restricted/402 results. The alternative route was existing revision-pinned local wiki payloads and indexed page excerpts. Web excerpts below are STATED, excerpt-only; their pages were not fully read. Full source chapters were not acquired or read. Dates in wiki timeline compilations remain secondary reconstructions even when their rows cite chapters. No fan chronology is promoted to SHOWN manga text.

### W35.E: source register

Relative paths are from `docs/`; wiki archive metadata is in `research/power-systems/wiki-digests/full-dumps/<host>_SOURCES.json`. Listed local revisions were read in bounded spans from the manifest's `read_file`, without altering the archive. Local line numbers refer to decoded payload `text`, not the JSON wrapper.

| ID | Evidence read and bounded use |
|---|---|
| W35.E-DN | STATED local `worlds/dnd/SOURCE_CONTRACT.md` S05, edition/era contract; `FIRST_SLICE.md` ST1-ST3 and PS04. D&D digest is `blocked_no_revision`, a lead only. STATED excerpt [Harptos](https://forgottenrealms.fandom.com/wiki/Calendar_of_Harptos), calendar/month/festival list and edition spelling notes; [1358 DR](https://forgottenrealms.fandom.com/wiki/1358_DR), year; [Drizzt](https://forgottenrealms.fandom.com/wiki/Drizzt_Do%27Urden), birth year; [Timesong](https://forgottenrealms.fandom.com/wiki/Timesong_calendar), local count and different month spans. |
| W35.E-JJ | STATED `worlds/jujutsu/{WORLD_BRIEF,SOURCE_LEDGER,CAMPAIGN}.md`, modern main-series cutoff still open and Modulo separate. `DIGEST_jujutsu-kaisen.md` DJ6 gives edition-sensitive rule deadlines, not dates. Local Yuji r79333 L16-L17 cites fanbook pp4-7 for birthday/age; Shibuya Incident r76739 L90/L96 cites ch82/episode31 and 19:00 opening. STATED excerpt [Shibuya Incident](https://jujutsu-kaisen.fandom.com/wiki/Shibuya_Incident), year/day; [Night Parade](https://jujutsu-kaisen.fandom.com/wiki/Night_Parade_of_a_Hundred_Demons), declared December 24; [Goodwill arc](https://jujutsu-kaisen.fandom.com/wiki/Kyoto_Goodwill_Event_Arc), annual event, ch32/episode14. |
| W35.E-BL | STATED `worlds/bleach/{WORLD_BRIEF,SOURCE_LEDGER,CAMPAIGN}.md`: original vols 1-74 default; later anime additions separate. Bleach digest is `blocked_no_revision`. STATED official [anime character page](https://bleach-anime.com/character/), Ichigo birthday entry, web L233-L245; [Ichigo wiki](https://bleach.fandom.com/wiki/Ichigo_Kurosaki), July15, debut15 and June17/1994/age8 excerpt; [German wiki chronology](https://bleach.fandom.com/de/wiki/Bleach_Timeline), relative year0 and August17 departure excerpt. STATED [Hueco Mundo wiki](https://bleach.neoseeker.com/wiki/Hueco_Mundo), constant night and reported opposite moon phase, secondary only. |
| W35.E-NA | STATED `worlds/naruto/{WORLD_BRIEF,SOURCE_LEDGER,CAMPAIGN}.md`: original manga1-700, supplemental continuities excluded by default; digest blocked. STATED official [Naruto birthday column](https://naruto-official.com/en/news/01_1610), October10, cites ch500/503/504 for birth and ch245 for return after almost three years. STATED [Naruto profile](https://naruto.fandom.com/wiki/Naruto_Uzumaki), Part I 12-13; [exam arc](https://naruto.fandom.com/wiki/Ch%C5%ABnin_Exams_%28Arc%29), July1 and reconstructed June24-August6 span. |
| W35.E-FA | No Fate world folder found; use `world-core-kit-2026-10-14/cards/fate.md` and `DIGEST_fate-series.md` DF1-DF3, which are Fuyuki-qualified mechanics, not a calendar audit. STATED [Fuyuki wars](https://typemoon.fandom.com/wiki/Fuyuki_Holy_Grail_War), 1994/2004; [timeline](https://typemoon.fandom.com/wiki/Timeline), November1994 and January31-February15 2004 synthesis. Local Timeline r405727 chronology/continuity entries distinguish works/branches. Local [Rin](https://typemoon.fandom.com/wiki/Rin_Tohsaka?oldid=405592) L52 has February3 versus February4 material notes. |
| W35.E-HX | STATED `worlds/hunter-x-hunter/{WORLD_BRIEF,SOURCE_LEDGER,CAMPAIGN}.md` and digest DX1-DX5, Nen rules not a date proof. Local [Hunter Exam r419181](https://hunterxhunter.fandom.com/wiki/Hunter_Exam?oldid=419181) L6: January7, annual, December31 application cutoff, references ch146-147. [Yorknew r411636](https://hunterxhunter.fandom.com/wiki/Yorknew_City?oldid=411636) L17/L46: September1-10 annual auctions, meeting September1, references ch71/85/44. [Gon r420754](https://hunterxhunter.fandom.com/wiki/Gon_Freecss?oldid=420754) L13/L16: debut 11, May5 supplementary birthday, explicit age conflict. [Timeline r417995](https://hunterxhunter.fandom.com/wiki/Timeline?oldid=417995) L3 warns Yorknew matches1999 weekdays but in-world2001 succession matches2017 weekdays. |
| W35.E-FM | STATED `worlds/fullmetal-alchemist/{WORLD_BRIEF,SOURCE_LEDGER,CAMPAIGN}.md`, manga/Brotherhood qualification and separate2003 rules; digest mechanics do not prove dates. Local [Timeline/Manga r77660](https://fma.fandom.com/wiki/Timeline/Manga?oldid=77660) L140-L144: October3 1911, ch24 locator; L168-L169: spring 1914, ch1 locator. [Timeline/2003 Anime r77990](https://fma.fandom.com/wiki/Timeline/2003_Anime?oldid=77990) L90-L100: October3 1910; [Edward/Manga r78040](https://fma.fandom.com/wiki/Edward_Elric/Manga?oldid=78040) L5-L6/L43/L54:15, birth 1899/winter, certification 12; [Alchemist r77469](https://fma.fandom.com/wiki/Alchemist?oldid=77469) L40: annual assessment; [Amestris r77354](https://fma.fandom.com/wiki/Amestris?oldid=77354) L44: late-winter 1915 claim. |

### W35.F: floor today

D means documentary calendar floor, not general world completeness. R means a playable canon-calendar proof. R is **missing evidence in this census** for all seven worlds; no native gameplay audited or verified. SHOWN code inspected: `src/book_world_paradise_native.js:7,19-20` retains a year1/30-day-month projection; `src/game_time.js:35-38,71-74` retains base month/season arithmetic. These neither establish nor disprove an individual world's implemented profile. W33 owns the exhaustive engine audit.

| Code / world | D today, pointer | Smallest missing floor proposal, INFERRED |
|---|---|---|
| W35.F-DN | Partial: source/edition/era contract and three starts; setting calendar unpinned | Harptos+DR, chosen settlement/era/anchor, intercalary festivals, calendar source revision |
| W35.F-JJ | Partial: modern-era campaign and sourced dates; no unified profile | Gregorian display2018 plus school/mission overlays and private event knowledge |
| W35.F-BL | Partial: continuity/body/realm owners; no qualified realm calendar mapping | Civil Karakura date plus separate realm light and unknown crossing offsets |
| W35.F-NA | Partial: birthday/exam clues and source cutoff; epoch not verified | Named-month local display, relative era, bounded exam windows; explicit synthetic year if needed |
| W35.F-FA | Partial: Fuyuki mechanics/card; missing dedicated world/calendar owner | Fuyuki 2004 work/route pin, civil date plus route-day window, no franchise-wide epoch |
| W35.F-HX | Partial: strong recurrence clues but contradictory age/weekday reconstruction | Month/day recurrence plus exam ordinal, uncertain civil year and age provenance |
| W35.F-FM | Partial: source-qualified dossiers and year clues, no calendar profile | Amestrian civil year and October3 marker, season windows with manga/2003 separation |

Baseline CC floors, before W35's proposed rows: P = partial documentary evidence; M = missing qualified profile/policy in the inspected owners. No “met” is assigned from a date clue alone. The per-world census/profile rows below propose the missing floors. CC7 private ID binding remains open for every world. All R proof states remain as qualified above.

| World | CC1 | CC4 | CC5 | CC2/6 | CC3 | CC11 | CC10 | CC15 | CC7 |
|---|---|---|---|---|---|---|---|---|---|
| D&D | P | P | P | P | P | P | P | P | M |
| JJK | P | P | P | P | P | M | P | P | M |
| Bleach | P | P | P | P | P | P | P | P | M |
| Naruto | P | P | M | P | P | M | P | P | M |
| Fate | P | M | P | P | P | M | P | P | M |
| HxH | P | P | P | P | P | M | P | P | M |
| FMA | P | P | M | P | P | M | P | P | M |

## W35.DN: D&D, Forgotten Realms Calendar of Harptos

INFERRED choice: **Forgotten Realms, Sword Coast, Harptos with Dale Reckoning (DR)**. It fits the existing post-rebuilding Phandalin proposal and supplies calendar content the setting-neutral SRD does not. This is one setting candidate, not the calendar of all D&D. Rules edition remains independently pinned by `SOURCE_CONTRACT.md`; advancing an era does not auto-change rules.

| Code / part | Census and evidence |
|---|---|
| W35.DN1 CC1 | STATED E-DN Harptos: twelve 30-day months, three tendays per month, five intercalary annual festivals and Shieldmeet every fourth year. Thus 365/366days, not the engine's360. Months: Hammer, Alturiak, Ches, Tarsakh, Mirtul, Kythorn, Flamerule, Eleasis, Eleint, Marpenoth, Uktar, Nightal. DR is year reckoning; Harptos is day/month organization. Source gives an actual system. Exact leap-year residue still needs a setting source pin before arithmetic. |
| W35.DN2 CC4 | STATED Harptos festival list: Midwinter after Hammer; Greengrass after Tarsakh; Midsummer after Flamerule; Highharvestide after Eleint; Feast of the Moon after Uktar; Shieldmeet after Midsummer in qualifying years. These sit outside numbered months. Local temple observances and caravan markets need settlement sources, not a universal list. |
| W35.DN3 CC5 | STATED Timesong has its own count and month spans; DR and local year names are additional displays. INFERRED use primary Harptos/DR, optional sourced cultural overlay. Plane-local time/light remains a separate profile, not a year-number conversion. |
| W35.DN4 CC2/CC6 | STATED E-DN places Time of Troubles in 1358DR, **year precision** here; no exact opening day claimed. STATED Harptos festival boundaries support day precision and recurring schedules. INFERRED PS04 departure date is an authored contract, not a published adventure event. |
| W35.DN5 CC3 | INFERRED ST1 caravan guard: just before a locally scheduled departure; ST2 student: ordinary work morning in the selected settlement; ST3 shrine helper: preparatory day before a sourced temple/festival duty. Retain post-rebuilding era proposal, **year unpinned**. Do not silently select 1491DR from a familiar adventure or 1358DR from this census example. |
| W35.DN6 CC11 | STATED Harptos labels seasons and equinox/solstice dates. INFERRED settlement latitude drives daylight; caves/planes have separate light. MEMORY Selûne phase period, pending a sky-source audit; no exact lunar phase table proposed as canon. |
| W35.DN7 CC10 | STATED Drizzt birth 1297DR, **year precision**, no birthday found. INFERRED no universal numeric age at entry until local year is pinned; generated ST1-ST3 ages are authored. Long-lived people's age, adult status and planar exposure stay separate. |
| W35.DN8 CC15 | STATED Harptos notes retain older **Eleasias** versus later **Eleasis** spellings. Preserve both as edition-labelled aliases, not two months. Setting-era/rules edition differences are profile differences, not a contradiction to flatten. |

### W35.DN-P: draft profile, all INFERRED

| Code / field | Default | Dial | In-world reason |
|---|---|---|---|
| W35.DN-P1 system/anchor | `fr.harptos.dr`, settlement+era+source revision; authored anchor day | Another named setting/calendar or earlier era with its own content | Caravan, shrine and town records use local dates |
| W35.DN-P2 recurrence/precision | Intercalary festivals; year-only historical event where evidenced | Sourced local cult/cultural calendar; labelled reconstruction | Holiday accounting affects contracts without inventing exact history |
| W35.DN-P3 sky/age | Settlement daylight; unknown moon phases; sourced birth years only | Qualified plane sky and traveler exposure | Darkness underground does not stop a tenday or age a visitor by civil date alone |

More to consider, INFERRED: W35.DN-M1 ACCOUNT NOW intercalary days must not consume ordinary tenday positions accidentally; payday rules need to specify whether festivals count. W35.DN-M2 ACCOUNT NOW night in a cave and a festival deadline can coexist. W35.DN-M3 LATER literacy makes “next tenday” meaningful through receipts, including local religious names and outsider translation, without globally converting Harptos to January.

## W35.JJ: Jujutsu Kaisen

| Code / part | Census and evidence |
|---|---|
| W35.JJ1 CC1 | STATED E-JJ gives2018 and explicit October31 time notices; Japan civil Gregorian display is INFERRED from the setting/date form. No bespoke calendar system found; exact civil leap/week arithmetic is an adapter choice, not a fan chronology. |
| W35.JJ2 CC4 | STATED Goodwill arc describes the30th annual school competition. No permanent month/day established by this read. MEMORY ordinary Japanese April school-year opening, New Year and holiday routines; these need period/institution sources before mechanical gates. Night Parade is one dated event, not a yearly attack. |
| W35.JJ3 CC5 | INFERRED civil date, institutional term/year and accepted mission/vow deadline overlays. STATED DJ6 supports rule-bound timers qualified by source stage; their remaining duration is not another civil calendar. No evidence here that a domain has its own astronomical year. |
| W35.JJ4 CC2/CC6 | STATED Shibuya October31,2018; local wiki opening approximately19:00, **day exact, minute approximate**. STATED Night Parade declared December24, **month/day exact**; MEMORY2017 year until primary/qualified year locator is checked. Goodwill is **annual, placement unknown** in this census. |
| W35.JJ5 CC3 | INFERRED support worker/sorcerer start in an ordinary mission week before a selected arc; school entrant near the selected term; witness start on a chosen civil day. An October31 arrival is selectable as a high-pressure anchor, with date knowledge separated from foreknowledge. No free student status inferred. |
| W35.JJ6 CC11 | INFERRED Tokyo/Kyoto regional daylight and seasons, locally derived Gregorian sky; curtains, buildings and domain visibility override exposure, not date. MEMORY seasonality of curse incidence is unverified and cannot become an automatic seasonal spawn curve. |
| W35.JJ7 CC10 | STATED Yuji r79333 cites fanbook pp4-7: March20,2003 and 15. Keep year/age attached to main-series snapshot; later Modulo 83 entry is a separate era. Actor knowing a birthday still needs a social source. |
| W35.JJ8 CC15 | No direct conflicting main-series calendar statements established. Retain “year/day stated, minute approximate” rather than sharpening the minute. Main series versus Modulo is an era separation, not one cast age rewritten. Fan blog day-by-day ordering remains unverified synthesis. |

### W35.JJ-P: draft profile, all INFERRED

| Code / field | Default | Dial | In-world reason |
|---|---|---|---|
| W35.JJ-P1 system/anchor | `jjk.main2018.gregorian`, specific assignment day | School/prequel/later-era profile separately sourced | School duty and phone timestamps use civil time |
| W35.JJ-P2 recurrence/precision | Annual Goodwill, date unpinned; actor-known mission notices | Authored term dates; labelled fan windows in research view | An annual event need not fall on the same date |
| W35.JJ-P3 sky/age | Regional daylight; separate visibility; sourced fanbook ages | Scenario weather and era-specific cast | A curtain can hide a street without advancing a birthday |

More to consider, INFERRED: W35.JJ-M1 ACCOUNT NOW public Halloween crowds and private mission notices have different audiences. W35.JJ-M2 ACCOUNT NOW “overtime” uses the actual work/vow agreement, not a universal18:00 buff. W35.JJ-M3 LATER a missed assignment can change institutional relations through an actual courier/report; the calendar alone does not notify every clan.

## W35.BL: Bleach

| Code / part | Census and evidence |
|---|---|
| W35.BL1 CC1 | STATED E-BL gives July15 birthday and June17 commemoration with school-age context. INFERRED modern Japanese civil Gregorian month/day display. **Absolute debut year remains unpinned**; no custom Soul Society month system confirmed. |
| W35.BL2 CC4 | STATED June17 memorial context supports a private annual remembrance candidate. Birthday July15 is official. MEMORY Karakura school holidays and spiritual academy terms need sources; do not import an assumed festival timetable. Execution/war notices are finite appointments, not recurrence. |
| W35.BL3 CC5 | STATED campaign distinguishes living world/Soul Society/Hueco Mundo. INFERRED display civil date for known living-world reports, institution-local duties for spiritual actors, and crossing/traveler exposure separately. No verified exact offset or shared epoch between realms. |
| W35.BL4 CC2/CC6 | STATED wiki June17 memorial, **month/day precision** supported in this census; wiki year1994/age8 assertion retained as secondary. STATED German chronology gives August17 Soul Society departure in relative “year0”, **wiki reconstructed day** only. INFERRED default departure remains **arc-relative**, pending manga locator. Do not turn either into exact 2001 history. |
| W35.BL5 CC3 | INFERRED independent street-record worker near the campaign's ordinary Karakura opening; spiritual worker near a sourced patrol/record duty; entrant to another realm near an actual crossing notice. Anchor each realm's observable date separately; no protagonist powers or rank are granted. |
| W35.BL6 CC11 | STATED secondary Hueco Mundo wiki: constant night and reported opposite lunar phase. INFERRED use constant-night outer-realm candidate, **moon relation unresolved**, with indoor lighting separate. MEMORY Las Noches artificial daylight versus outer night needs primary ch263 check. Soul Society seasons/day lengths remain unknown here; do not use one global Earth sunrise. |
| W35.BL7 CC10 | STATED official anime profile July15 for Ichigo, adaptation corroboration; wiki debut15. Spiritual lifespan is not inferable from apparent school age. INFERRED use era-qualified age assertions, unknown soul birth dates, separate living/spiritual/body exposure. |
| W35.BL8 CC15 | Preserve wiki **1994 and age8** versus MEMORY widely repeated **1995 and age9** reconstruction. Only the first is checked in this lane; second is unresolved, not an equal source fact. Keep common June17 separately from disputed year. Original manga versus expanded TYBW evidence also remains source-qualified. |

### W35.BL-P: draft profile, all INFERRED

| Code / field | Default | Dial | In-world reason |
|---|---|---|---|
| W35.BL-P1 system/anchor | `bleach.original.karakura`, month/day plus relative story year | Source-qualified absolute year; separate realm display | A living-world school date does not prove a spiritual epoch |
| W35.BL-P2 recurrence/precision | Known birthdays/private remembrances; canon windows arc-relative | Actor-known institutional appointments | A duty clerk may know an appointment while a civilian does not |
| W35.BL-P3 sky/age | Per realm/site lighting; unknown realm offsets; age assertions | Qualified artificial sky or lunar model | A visible sky is not enough to infer elapsed lifespan |

More to consider, INFERRED: W35.BL-M1 ACCOUNT NOW a transit incident's experienced duration cannot silently shift all civil dates. W35.BL-M2 ACCOUNT NOW private remembrance needs a relationship/knowledge route before appearing in the log. W35.BL-M3 LATER clocks and cross-realm couriers can disagree in delivery time without creating contradictory event order; save the observation and its origin realm.

## W35.NA: Naruto

| Code / part | Census and evidence |
|---|---|
| W35.NA1 CC1 | STATED official October10 and wiki July1 show named civil months/days. **No Gregorian epoch, complete month-length table or globally shared era is established.** INFERRED use a Gregorian-shaped display with explicit synthetic year when arithmetic requires one; never display that year as canon. |
| W35.NA2 CC4 | STATED exam arc supports July1 for this sitting. MEMORY twice-yearly Chūnin Exams, pending manga locator; this is a recurring institution candidate, not proof that every village uses the same dates. Official birthday can recur. No annual massacre/war schedule follows from one event. |
| W35.NA3 CC5 | INFERRED local village civil date, Academy cohort/rank calendar, mission deadlines and another country's schedules. No sourced alternative named calendar found. Village founding-relative labels are author coordinates unless a specific source names them. |
| W35.NA4 CC2/CC6 | STATED official birth October10, **month/day exact, year unknown**, references ch500-504. STATED wiki exam July1 and June24-August6 span: **secondary day placement/reconstruction**, primary inspection open. STATED official return after almost three years, **relative duration approximate**, ch245 locator; no exact arrival day. |
| W35.NA5 CC3 | INFERRED River Carrier ordinary mission before/alongside Part I village events; Academy/helper start tied to a cohort notice; exam visitor shortly before the selected sitting; post-training start relative to the return. Do not pick fan founding-year numbering to fill blanks. |
| W35.NA6 CC11 | MEMORY source climates vary by country: snowy territory, desert and forest are not one season. INFERRED site climate and normal day/night baseline, with day length/latitude unknown. No exact moon phase or “full moon every 30days” canon claim. |
| W35.NA7 CC10 | STATED official Naruto October10; wiki Part I 12-13. INFERRED bind age range to era; no reconstructed birth year by assuming Earth publication year. Generated family birthdays are labelled authored. |
| W35.NA8 CC15 | No direct source-source calendar contradiction proved. Preserve **month/day and relative time evidence** versus **fan absolute-year/complete arc reconstruction**, whose evidence is lower and unverified. Graduation's third attempt is not proof of three elapsed school years: official column says third attempt, not annual cadence. |

### W35.NA-P: draft profile, all INFERRED

| Code / field | Default | Dial | In-world reason |
|---|---|---|---|
| W35.NA-P1 system/anchor | `naruto.original.local-months`, no canonical absolute year | Explicit synthetic epoch or independently sourced national calendar | Villages can name October without sharing Earth's history |
| W35.NA-P2 recurrence/precision | Selected exam notice and relative-era windows | Qualified village cadence, authored local holidays | Promotion is an institutional action, not a seasonal automatic reward |
| W35.NA-P3 sky/age | Local climate, unknown astronomy; source-era age ranges | Authored region daylight and generated birthdays | A snowbound route and a forest village can share a date |

More to consider, INFERRED: W35.NA-M1 ACCOUNT NOW exam postponement/cancellation after divergence should retain the scheduled date and changed cause. W35.NA-M2 ACCOUNT NOW clones' remembered training is experience, not several civil birthdays. W35.NA-M3 LATER rank offices and trade routes can use seasonal demand without deriving techniques or eligibility from one universal birthday threshold.

## W35.FA: Fate, Fuyuki profile

| Code / part | Census and evidence |
|---|---|
| W35.FA1 CC1 | STATED E-FA Fourth War1994 and Fifth 2004. INFERRED Gregorian civil calendar for Fuyuki; **Fate is several world lines, not one calendar epoch**. Default candidate here is Fate/stay night Fuyuki 2004, route pinned separately. |
| W35.FA2 CC4 | STATED war page distinguishes expected spacing and an early Fifth War; do not schedule an annual Grail War or an unconditional sixty-year recurrence. MEMORY school terms/ordinary Japanese holidays need institutional source. Sourced birthdays are personal recurrences. |
| W35.FA3 CC5 | INFERRED civil date, chosen-route day ordinal, ritual/contract remaining time and traveler exposure. STATED Timeline distinguishes parallel works and hollow ataraxia's different premise. A loop profile or historical visit gets its own anchor; one war does not unify all Fate time. |
| W35.FA4 CC2/CC6 | STATED Fourth 1994, **year precision** from war page; timeline places November, **secondary month refinement**. Fifth 2004, **year precision** from war page; timeline January31-February15, **secondary route-spanning window**, not a single ending date. Exact event day ordinals need selected VN/route locators before mapping to dates. |
| W35.FA5 CC3 | INFERRED intermediary/student/support start before the selected war scene; work morning in Fuyuki 2004 or a prequel-era 1994 branch. Freeze work, route, edition and event window, not just year. A participant start requires actual contract/source means; date does not grant them. |
| W35.FA6 CC11 | INFERRED ordinary Fuyuki seasonal daylight; bounded spaces can override lighting while civil date continues. MEMORY matching a fictional city's coordinates to a real production location is not verified latitude. No source claim that historical eras or simulated spaces share this sky. |
| W35.FA7 CC10 | STATED Rin birthday February3, with contradictory material preserved below. Exact age at war unpinned in this lane; do not infer from an image-tab age. Servant legendary lifespan, vessel appearance, time summoned and Master's age are separate. |
| W35.FA8 CC15 | STATED Rin r405592 L52: February3, with February4 noted in complete material II and continued in anime visual guide despite a correction in Zero material. Keep **both publication claims**; default corrected 3, dial selected publication 4. Fourth/Fifth wars and differing work routes are distinct profiles, not merged contradictory events. |

### W35.FA-P: draft profile, all INFERRED

| Code / field | Default | Dial | In-world reason |
|---|---|---|---|
| W35.FA-P1 system/anchor | `fate.fuyuki.fsn2004.<route>`, civil plus scene ordinal | Qualified Zero, other work, loop or historical profile | A ritual's history depends on the world line |
| W35.FA-P2 recurrence/precision | War as causal event window, not recurrence | Research-only fan day mapping; publication-qualified birthday | A prematurely scheduled war defeats a simple timer |
| W35.FA-P3 sky/age | Local sky and exposure; sourced birthday claims, age unknown | Vessel/body lifetime and work-specific environment | A heroic record's age is not days since summoning |

More to consider, INFERRED: W35.FA-M1 ACCOUNT NOW branch identity must accompany every shared date/event ID. W35.FA-M2 ACCOUNT NOW contract countdown is issuer/actor knowledge, not a universal spoiler clock. W35.FA-M3 LATER distinguish a date actually experienced, a historical record read, and a simulated date display; repeating the latter cannot age or replenish the same actor automatically.

## W35.HX: Hunter x Hunter

| Code / part | Census and evidence |
|---|---|
| W35.HX1 CC1 | STATED dated exam/auction entries and Timeline warning give recognizable month/day/year/weekday references. No bespoke named calendar found. INFERRED Gregorian-shaped civil formatter, **year/weekday mapping uncertain**; use local date assertions instead of deriving every weekday from a guessed year. |
| W35.HX2 CC4 | STATED Hunter Exam r419181: annual January7 start, December31 application cutoff; one week to one month duration, exception noted. Yorknew r411636: annual auctions September1-10. These are sourced institution schedules, not proof every qualifying task/auction runs throughout that span. |
| W35.HX3 CC5 | INFERRED civil month/day, exam ordinal, auction session, Greed Island local activity and ship/travel day overlays. Game/travel counters are not evidenced alternative civil calendars. Preserve any later sourced local cycle without borrowing an Earth clock. |
| W35.HX4 CC2/CC6 | STATED timeline287th Exam January7,1999, **secondary absolute-day synthesis**; recurring month/day stronger in Exam page's ch147 citation. STATED Yorknew agreement September1, ch44 locator, **month/day exact**, absolute year from compilation only. Auction window September1-10 is annual; actual incident dates remain actor-restricted event windows. |
| W35.HX5 CC3 | INFERRED applicant before December31 cutoff or during travel to the January exam; auction helper/merchant before September1; ordinary hometown start in a quiet arc window. Freeze exam ordinal/source range separately from calendar year and age assumptions. |
| W35.HX6 CC11 | INFERRED region-specific daylight and seasons; no global latitude table verified. MEMORY fictional geography is not a reliable conversion to Earth's hemisphere. A game's local condition/sky needs its own source, not the site's civil month number. |
| W35.HX7 CC10 | STATED Gon r420754: debut 11 citing ch6; May5 citing wedding calendar1999 and databook; current 13-14 is explicitly caveated. Birth 1987 is also a wiki assertion, not independent primary read here. Keep separate reported age and birthday, do not regenerate age from disputed chronology. |
| W35.HX8 CC15 | STATED same Gon page notes age12 at later arcs conflicts with May5 chronology. STATED Timeline r417995: Yorknew weekdays fit1999; in-world2001 succession weekdays fit2017. Preserve **stated age**, **supplementary birthday**, **in-world year** and **weekday clues** independently. No silent switch to2017 or deletion of the birthday. |

### W35.HX-P: draft profile, all INFERRED

| Code / field | Default | Dial | In-world reason |
|---|---|---|---|
| W35.HX-P1 system/anchor | `hxh.manga.month-day`, exam ordinal and uncertain year | Qualified compilation year, with independent weekday assertions | Applicants need a deadline more than a reconstructed epoch |
| W35.HX-P2 recurrence/precision | January7/December31 and September1-10 with exceptions | Authored session timetable; source-stage schedule revision | Registration, sessions and event outcomes are different gates |
| W35.HX-P3 sky/age | Local sky unknown; reported age plus birthday provenance | Research chronology reconciliation, displayed as proposal | A databook birthday cannot overwrite manga age evidence silently |

More to consider, INFERRED: W35.HX-M1 ACCOUNT NOW forecasts and their expiry belong to the eligible user/recipient, not the public calendar. W35.HX-M2 ACCOUNT NOW a cancelled or relocated auction retains its old invitation and actual new place/time. W35.HX-M3 LATER exam information access can be a first useful learning goal; a novice need not know a secret venue just because a formatter knows January7.

## W35.FM: Fullmetal Alchemist

| Code / part | Census and evidence |
|---|---|
| W35.FM1 CC1 | STATED manga timeline/Edward give1899,1911 and1914; October3 marker gives month/day. INFERRED Amestrian civil Gregorian-shaped calendar, often labelled continental chronology; **epoch/leap rules not established here**. Do not identify Amestris with historical Earth merely because it uses1914. |
| W35.FM2 CC4 | STATED Alchemist r77469: annual assessment report, no fixed national date verified. October3 is a personal anniversary candidate, not a public holiday. MEMORY Resembool spring sheep festival is a lead needing chapter/bonus-source qualification, not an implemented annual fair. |
| W35.FM3 CC5 | INFERRED civil date, military duty/research assessment year, regional cultural/religious dates and traveler exposure. No sourced Xing or Ishval calendar conversion found. 2003 continuity has its own year mapping, not a decorative overlay on manga history. |
| W35.FM4 CC2/CC6 | STATED manga Timeline L144: October3,1911, ch24 locator, **secondary exact-day attribution**, primary inspection open. L168-L169 puts Liore opening in spring 1914, ch1 locator, **secondary season placement**. Annual review is **year recurrence with unspecified due date**. Late-winter1915 crisis placement from Amestris L44 is secondary and not a precise celestial date. |
| W35.FM5 CC3 | INFERRED supervised bench/research helper in an ordinary 1914 window; relief worker in an era-qualified aftermath; institutional start near an actually issued review deadline. Xing field study needs a region and source range, not automatic synchronization with Central. High-pressure later start remains a selectable sourced window. |
| W35.FM6 CC11 | MEMORY northern snow, desert and temperate farmland suggest distinct climates, pending region sources. INFERRED per-site daylight, unknown astronomical constants. Celestial-event scheduling requires source-qualified bounds and actor knowledge, not an invented Earth ephemeris. |
| W35.FM7 CC10 | STATED Edward/Manga: birth 1899, winter claim,15 through most story and18 at ending; certification 12. **No exact birthday verified**. Keep winter as wiki claim, not calendar day. Generated assistants can have authored birthdays. |
| W35.FM8 CC15 | STATED manga timeline October3,1911 versus2003 timeline October3,1910. Preserve both under separate source profiles; neither corrects the other. STATED Amestris article late-winter 1915 versus MEMORY often-repeated spring placement of later crisis: second remains unverified. Exact Edward birthdays on fan pages are excluded pending primary evidence; absence of a verified day does not erase sourced age/year. |

### W35.FM-P: draft profile, all INFERRED

| Code / field | Default | Dial | In-world reason |
|---|---|---|---|
| W35.FM-P1 system/anchor | `fma.manga.amestris`,1914 season window, synthetic arithmetic declared | Separate2003 profile; independently sourced region calendar | Military and personal records differ across adaptations |
| W35.FM-P2 recurrence/precision | Actor-issued annual review due date; private October3 marker | Source-qualified fair or research-only celestial window | Annual review does not mean every researcher reports on January1 |
| W35.FM-P3 sky/age | Site climate unknown; age/year assertions, birthday unknown | Qualified celestial profile and actual body exposure | A metal body, experienced life and civil year are different coordinates |

More to consider, INFERRED: W35.FM-M1 ACCOUNT NOW a publication revision that changes a date cannot move an already accepted research deadline silently. W35.FM-M2 ACCOUNT NOW seasonal roads and transport supplies can shape an ordinary relief slice without forcing hunger/death mechanics. W35.FM-M3 LATER a forecast based on private research needs confidence and source custody; astronomy alone cannot reveal a sealed purpose.

## W35.R: CC7 spoiler and sealed-date risks

**Proposed risk IDs only**, not existing secret IDs. No sealed registry/file was opened, so no real sealed-date ID mapping is claimed. A later authorized secret owner can bind these risk IDs privately. The payload, exact date and route truth must stay outside public reports. Default INFERRED: public dates and actor-observed appointments; Dial: acquired, qualified foreknowledge through its own discovery/cheat route. Source access by an author never grants actor knowledge.

| Risk ID | Public handling |
|---|---|
| W35.R-DN | Actor-knowledge gate; hidden rows omitted; private ID mapping OPEN |
| W35.R-JJ | Actor-knowledge gate; hidden rows omitted; private ID mapping OPEN |
| W35.R-BL | Actor-knowledge gate; hidden rows omitted; private ID mapping OPEN |
| W35.R-NA | Actor-knowledge gate; hidden rows omitted; private ID mapping OPEN |
| W35.R-FA | Route-qualified actor-knowledge gate; hidden rows omitted; private ID mapping OPEN |
| W35.R-HX | Actor-knowledge gate; hidden rows omitted; private ID mapping OPEN |
| W35.R-FM | Actor-knowledge gate; hidden rows omitted; private ID mapping OPEN |

INFERRED same projection gate must cover logs, upcoming-event counts, sort order, climate descriptions, start availability explanations, age displays and research/lens views. “One hidden event tomorrow” leaks a date even without its name. A public holiday is visible; an event happening on that holiday is not automatically public. Public franchise dates above are source research, not changed/randomized local truths.

## More to consider, other stuff

All rows INFERRED. These extend the palette rather than prescribe new engine work. CC8 divergence, CC9 loops, CC12 literacy, CC13 profile revision, CC14 lens and CC16 crossings retain their existing owners.

| Code | Cross-world angle and consequence | Disposition / Default + Dial + reason |
|---|---|---|
| W35.X1 | **Partial calendar is valid content.** Naruto/HxH/FMA can supply exact month/day without reliable year/weekday or leap rules. | ACCOUNT NOW default independent precision per component; dial explicitly synthetic arithmetic. A formatter should not manufacture evidence to obtain a sortable date. |
| W35.X2 | **Recurrence has a version and exception.** Exam timing, auction venues and review deadlines can change after canon or divergence. | ACCOUNT NOW default recurrence rule plus actual occurrence/cause; dial amended schedule. Existing invitations remain attributable and do not regenerate an impossible event yearly. |
| W35.X3 | **Contradiction is often one field wide.** Rin's day differs, Bleach's year differs, HxH's weekdays differ. | ACCOUNT NOW retain claim variants per field/source/profile; dial deliberate adjudication. Do not demote a supported month/day because the year is disputed. |
| W35.X4 | **Age evidence is not always arithmetic.** Supplementary birthdays conflict with reported age; vessels and spiritual bodies separate appearance from exposure. | ACCOUNT NOW default reported age plus provenance and exposure; dial computed age only from compatible source pins. A contradiction should remain inspectable after reload. |
| W35.X5 | **Calendar notices are owned information.** A birthday, private appointment, public fair and author-only event need different routes. | ACCOUNT NOW default knowledge-qualified notice with issuer, delivery time and confidence; dial foreknowledge receipt. Leaks through counts/order/start filters need the same gate as text. |
| W35.X6 | **Artificial sky and civil time can coexist.** Caves, barriers, realms and bounded spaces can hide sunlight without changing the date. | ACCOUNT NOW default sky/light/site distinct from calendar profile; dial explicitly sourced local cycles. W28 should accept UNKNOWN, not turn missing evidence into “no seasons”. |
| W35.X7 | **Revision preserves a lived branch.** Source correction or adaptation change must not rewrite accepted duties or cast memories. | LATER default profile revision+anchor pinned under CC13; dial explicit migration reviewed by owning writer. Evidence updates can be added without retroactive rewards, missed-deadline losses or body aging. |

### Ranked suggestions

1. **W35.A1:** Give W33 one bounded content test set: Harptos intercalary festival, JJK day/time window and HxH uncertain-year recurrence. Done check for later authorized work: each displays only supported precision, preserves unknowns and does not alter W25's clock/absence authority. Calendar documents alone do not close runtime proof.
2. **W35.A2:** Before expanding canon graphs, pin work/era/route and evidence precision on each arrival/event. Resolve the selected D&D era and Fate route first; retain Bleach/HxH/FMA variant claims rather than selecting a convenient exact year. Done check: every chosen anchor links its source, uncertainty and cast snapshot.
3. **W35.A3:** Source-check one useful ordinary recurring institution per next selected world, then bind private notice knowledge and exceptions. Prefer caravan/shrine dates, Goodwill, Hunter registration/auction sessions or research review over a universal catastrophe countdown. Done check: recurrence has an issuer/source, actual occurrence, cancellation behavior and spoiler-safe projection; rebuilt browser and persistence gates belong to a later implementation packet.
