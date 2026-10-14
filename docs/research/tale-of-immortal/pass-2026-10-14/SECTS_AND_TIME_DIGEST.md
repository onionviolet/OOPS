# Sects and a world that changes over time

Shown table values and stated comments, with no game-time simulation exercised.

## Offices have different time rules

`宗门配置表.xlsx/SchoolPostParam` is the highest-value extension beyond prior C3. It describes both player-facing promotion scripts and background population maintenance; neither should be misreported as a complete personal-disciple AI.

| Code | Rows | Configured consequence |
|---|---|---|
| S21 Contests | 6–30,38–40 | outStartMonth1 is explicitly an interval; outMaxJoinCount4. Inner starts month1, max15 entrants/one promoted; true-disciple starts month7, max7 entrants. The meanings differ despite similar field suffixes. |
| S22 Overflow | 17–21,31–34,120–126 | Excess outer/inner disciples have exit/death weights65/35 and delays1–12 months. Low-loyalty departures target post5–6; leavePercentMin50; maxRealPolulationIndex300 and exceedPopulationReduce40 exist. These are population-management parameters, not demonstrated personal life stories. -1 supplementation limits need interpreter semantics. |
| S23 Office repair | 79–80,93–94,118–119 | Elders and great elders get replacement delays1–2 months; leader5–8 months. A vacancy can persist, but exact trigger, selected replacement and promotion cost are untraced. |
| S24 Leadership stories | 97–117 | Abdication relation type6/intimacy240; monthly trigger parameters35 for abdication/challenge/succession; maximum inheritance story wait6 months. mainHideYearMin/Max5/8, mainUpGrade2, story and hostility fields describe an authored absence/return route. No autonomous hidden cultivation planner is proved. |
| S25 Recruitment | 123–126; RoleSchoolRecruit rows4–7 | recruitCD24 months and refusal drama; dialogue and energy-cost inputs for the invitation. Replenishment, joining an institution and becoming a personal student must remain distinct. |

**Correction to an easy inference:** counts are not proof that every unnamed disciple is a separately simulated actor. The same workbook has aggregate registered population floors/caps. Nor should an excess-population death weight be imported into YAIR as a hidden disposal rule.

## Funding affects future choices

`SchoolParameters1` rows4–31: area2 population floor50, per-addition5–15, maximum300. Regions4/6/8/10 have separate values. Wage shortfall loyalty loss4–8; arrears payment loyalty+5. Its explicit NPC-leader comment says loyalty below90 with enough stones causes backpay. Expansion should retain6 months' salary. These confirm prior N10–N12 at table level; they do not establish final resource debit ordering.

`SchoolIntimEvent` rows4–14 and annotations18–26 separate travel, world-run, dungeon-entry and sect-war triggers. Friendly or hostile sect relations can add friendly/enemy units to a dungeon, visit, attack hostile disciples or support a war. All shown param1–5 are zero in these rows, so do not infer complete logs/dialogue from the schema alone. This is a useful concrete route for institutional ties to affect an encounter rather than just prices.

Prior N14's war data is still a table-level trace: retaliation waiting24 months, retry+36, victory protection24 and random offset0–6. This pass does not re-prove combat casualty, compensation or territory settlement execution. The earlier ambiguity around attackSchoolAIInterval's own comment remains open.

## Calendar is not one global plot

`奇遇配置.xlsx/FortuitousEvent` row199 ID10001 contains gameCurYearMonth_7_8 with grade2–10, area4 and absence of event17, then creates17. Rows772–773 IDs51201/51202 use gameMonth_24_999 / gameMonth_48_999 with different regions/NPC/drama IDs. The tokens distinguish calendar season from elapsed-world-month eligibility; exact inclusivity needs the interpreter. A threshold is not a promise the event fires on that date.

**S26 A missed event can become persistent aftermath:** `大地图元素配置表.xlsx/WorldFortuitousEventBase` row937 ID801125 lasts6 months. The expiry hook deletes task8000845 and creates801300 within range. Row945 ID801300 has grave icon `fenmu`, duration-1 and function `dramaPackageActive_11100`. This extends prior CE13 by one real successor edge. It does not establish whose grave, package contents, closure or autonomous cause; none is invented. The header distinguishes timeout from intermediate clearing.

**Inference:** over years, access windows, officeholders, obligations and local encounter support can change under distinct clocks. **Unproved:** full tick order, closed-browser catch-up, deterministic replay, birth/death ecology, ancient plans and every event's reachability. A date on a table is not a fully simulated history.
