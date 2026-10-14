# G49-B8 desktop body and lineage UI specification

2026-10-14. Docs-only proposal. UI1-UI6 retain the genetics owner's codes; G49-B8 subcodes below extend them. This specifies presentation and proposed navigation, not accepted mechanics, a schema migration or implemented gameplay.

Authority: [standing desktop direction](../../../../USER_VISION.md#standing-ui-priority-2026-10-13), [theme/density owner](../../../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md), [panel kit](../../../../PANEL_KIT.md), [G49](../../../../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md#g49-tools-the-player-sees), [dispatch rules](../COMMON.md). The [current audit](CURRENT_UI.md) owns file:line evidence. Earlier life-sim examples of mandatory trade-offs, purity or two-copy genes are local proposals under G1/G11/G18, not universal rules. No new direction is being integrated into PROJECT.md by this lane.

## G49-B8.1 Layout and entry routes

**Default:** keep routine play in the existing Workspace. Bio retains its useful short profile and lasting history. Add a known-only “Inspect body” entry there. Family and succession entries belong in Journal & received accounts, near known people/household records, with reciprocal links from a known person's inspection. Body work keeps its existing Notebook → Practice command owner; known local care actions can link there. A player does not need a cheat to inspect their body or read a family record.

**Dial:** a player can pin a discovered compact Body or Family summary as its own kit module. A world with an actual diagnostic device/system can supply richer readings through its known provider; a world without it uses sensations and records. More independent panels become useful on wider desktops, but six permanently expanded modules are not the default.

**In-world reason/cost:** reading known information is free and advances no time. Examination, research, treatment, marriage arrangements, transmission and succession are separate real actions with their existing provider/command costs. UI does not silently perform them while inspecting, sorting, comparing or selecting a skin.

| View | Current home and proposed launch | Expanded desktop home | Role / proposed stable panel ID |
|---|---|---|---|
| UI1 Body | Character & preparation → Bio → Inspect body; condition/effect links open the matching known row | Independent Body reading region on right in inspection arrangement; optional compact pin on left | character / `body-inspection` |
| UI2 Family tree | Journal & received accounts → known family record; People you know → Family | Right records region with branch list and selected person's evidence | records / `lineage-records` |
| UI3 Heir comparison | Family → Compare successors; existing ending/estate preview can link here when eligible | Same right records region, two people side by side at laptop size; optional third at wider size | records / reuse `lineage-records` mode, not another mandatory shell |
| UI4 Match planner | Family record or a known person's household/reproduction option → Plan traits | Same right records region, parent inputs, estimates and assumptions visible together | records / reuse `lineage-records` mode |
| UI5 Condition log | Bio current condition → View history; Reports event → that known event | Separate right log reading region; optional short current-condition pin beside vitals | log / `body-condition-log` |
| UI6 Skin | Automatic arrived-world frame plus current known reading provider; This browser controls density/style override after discovery | Decorates the same surfaces; a status provider may link to them | no extra module / frame/provider adapter |

These IDs are proposed UI identities, not save-field paths. UI3/UI4 buttons appear only after their respective tools and usable record context are learned. Family tool knowledge does not reveal a match-planning feature automatically. Unknown people or features produce no named tabs, locked silhouettes or disabled secret entries. A previously learned tool stays readable when its current provider is unavailable, with a specific reason.

**Inspection arrangement proposal:** opening Inspect uses a reversible desktop arrangement rather than adding a large viewer at the bottom of a crowded dock. At 1366x768 use approximately 280px left, 360px center, and 678px right with 12px gaps and 12px margins. Left preserves vitals and the short character/selected-person context; center preserves location, work and useful Local actions; right owns the current detailed question. This uses available width without shrinking body text. Keep the native footer and a 40px workspace toolbar. Inspector header, provenance/subject strip and Back to play stay fixed; long content has one scroll owner. Left and center may retain their ordinary lists, but there is no enclosing dock scroll around an independently scrolling inspector.

At 1920x1080 use approximately 300px left, 440px center, remaining width for inspection. Extra space supports broader branches, a third known successor or a pinned evidence column. It does not just enlarge blank cards. Minimum 14px body text and 15px normal controls in the sketches; compact reduces padding before text. At larger text sizes, allow the reading region to scroll and wrap; do not clip evidence or confirmation terms to maintain a one-screen promise.

Existing saved layouts win. Back/Escape returns to the exact prior layout, selections, disclosure state and scroll positions. Opening a known detail focuses its heading or selected row and brings useful content into view; it does not change the stored layout. Pin/Edit layout remains explicit. A critical save failure or live required choice stays visible in play context while reading. Do not duplicate full native stats in every body card.

This temporary arrangement and return behavior require future workspace support. The static wireframes show the target, not an existing layout API. A new implementation must explicitly handle fresh preset order and dimensions, not rely on `after: 'vitals'` alone, because CURRENT_UI A16/A17 show that can leave content off screen.

## G49-B8.2 Knowledge projection and safe unknowns

**Default:** every viewer consumes an observer-qualified projection, never the true body/genetics record. The subject body, controlling person, observer and world/provider are explicit. Own-body inspection can know a sensation without knowing its mechanism. Familiarity or a generated NPC detail level is not proof of a diagnosis.

**Dial:** a real world-specific means may supply precise anatomy, heredity or a genuinely exhaustive reading. An unreliable source may disagree with another. The UI preserves both source statements rather than upgrading one to truth based on theme or relationship depth.

**Reason/cost:** finer readings need an authored observer, means, access and evidence. A supported test has time/material/service terms; an ordinary inference has uncertainty and may be revised. A world can supply free or complete diagnostics when its actual mechanism does so. No compulsory fee or penalty is introduced.

| Public state | Exact display behavior | What it does not imply |
|---|---|---|
| Shown / observed | “Observed: grip weak after use.” Include event/context/time when known | A mechanism, heredity or complete diagnosis |
| Stated / reported | “Mira reports cold tolerance.” Named known reporter/record and date if available | Player confirmation or automatic access to the reporter's private body |
| Inferred / estimated | “Possible strain, based on observed grip change.” Show relevant inputs and scope | A true hidden cause or measured confidence number |
| Measured / diagnosed | “Clinic reading: …”, scope, method, date and applicable world | Infallibility, permanence or suitability of the same method elsewhere |
| Unknown answer to a known question | “Not investigated” / “No reading available” / “Parentage not established” | Zero, sterile, trait-free, no relatives, no faculty or a secretly populated slot |
| Known non-detection | “No signal detected by this test.” Identify tested range and conditions | Absence of everything the test could not detect |
| Known inapplicability | “This body does not use lungs”, only if anatomy/means supports that conclusion | Generic human anatomy with empty stats |
| Old or conflicting report | Keep dated statements, “Reports disagree” and a link to their context | Automatic averaging, erasure or retroactive change to history |
| Known physiological suppression/seal | “Function unavailable here” or “Known seal present”, with only the reason/route already learned | A spoiler-protection seal, a hidden power name or ancestral identity |

A generic Genetics section can say “Inheritance has not been investigated” because the question is known. It must not display “3 unknown genes”, secret slots, a named sealed physique, blank ancestor silhouettes or a guessed rarity. If no existence is learned, omit the secret row entirely. If evidence establishes an unexplained change, show that change and its known discovery route without naming its concealed cause. In particular, content sealed for Weibao is distinct from an in-world seal: the UI cannot announce a content seal merely because an internal secret exists.

Redaction applies before rendering to labels, IDs exposed in data attributes, descriptions, URLs, ARIA, tooltips, menus, search, counts, settings, exportable viewer text, theme choices and reveal cues. A DOM-hidden truth is still a leak. Sorting/comparison uses public values, so an unknown trait cannot influence ordering, node size, color or recommendation. Do not enumerate hidden records in a “no results” count. The mock data in these wireframes are invented public fixtures and contain no hidden true-state counterpart.

Suggested view contract, not a new persistence schema: subject label/body reference, observer label, provider label/scope/time/world, stable opaque public row key, known layer, public value/unit, evidence kind, source links already known, operational status, uncertainties and known available action quote. Hidden internal IDs are resolved behind the projection. Diagnostic evidence, generation and family commitments remain B2/B7/world owners; UI never triggers a new random draw or body reveal just to fill a comparison.

## G49-B8.UI1 Body view

**Default:** a short summary gives body/species, known stage/build, declared address and immediate usable differences. Then layer groups answer Frame and senses, Constitution/physique, Lineage faculties, Genetics, Adaptation/conditions, and Person/address. These organize G1/G17-G24 rather than becoming six resource bars. Keep inherited/acquired/trained, carried/expressed/dormant/suppressed, anatomy/function and learned method distinct when known.

**Dial:** humans may use a simple labelled body outline; an unfamiliar or distributed body uses a schematic or text part list with the same accessible information. Only known parts appear. Show an unlabeled generic silhouette only when it represents a known species template, not exact undiscovered anatomy. Advanced diagrams are optional; the text list is the baseline.

**Reason/cost:** part selection inspects known function and the action it affects. “Open recovery actions” opens the existing Notebook → Practice body controls or a known local provider without spending. If remote/unsupported, show the known reason. A diagnosis request opens an actual quote, with scope, time, cost, uncertainty and cancellation before commitment.

Do not translate a legacy `bio.gender` value into anatomy, fertility or social eligibility. Identity, address, presentation, recorded sex and body/reproductive role appear as distinct labelled rows only where known/relevant. Biological age, chronicle age and calendar age also stay separate. A changed host states whose body is being inspected; possession does not overwrite the person's identity. Learned skills link to practice; body function is not duplicated as skill XP. “Inheritance not investigated” does not promise a hidden gift.

## G49-B8.UI2 Family tree

**Default:** root the view in the selected known person. Use a generation/branch list, not an infinite canvas requiring two-axis panning. Render a small local graph only from known relationships; a readable relation list provides the same content. Selecting a person opens the evidence detail beside the branch.

**Dial:** dense houses can filter known generations/branches and page known records. Wider screens can show three generation columns and evidence simultaneously. Known bloodline concentration can be displayed with the exact local method, units and uncertainty; no universal purity meter, ranking or dilution law is inferred.

**Reason/cost:** records establish claims; recognized kinship, genetic ancestry, household, adoption, apprenticeship, ritual kinship, marriage, office and allegiance differ. Each edge labels its type and evidence. A dashed connector also says “Reported”; a solid connector also says “Recorded”, so color alone carries nothing. “Adoption recorded” proves adoption, not biological descent.

Do not create hypothetical ancestor nodes to connect a hidden relative. A generic “Parentage not established” detail is enough when the question is known. No visible total-person count includes unknown kin. A bloodline faculty does not establish a family connection. A known family claim can conflict with a clinic test: retain both dated facts and the source scope. Browse related records without granting access to distant minds, inventories or actions.

## G49-B8.UI3 Heir comparison

**Default:** compare two known candidate people side by side. Rows: expressed functions; learned/trained capabilities; observed/reported temperament; recognized standing; willingness and current reachability; actual estate/teaching/carrier routes; known eligibility and limitations. Each has a provenance marker. Do not reduce them to a “best heir” or power score.

**Dial:** a wider desktop can compare a third candidate or pin the estate breakdown. Users can choose a decision lens, such as continue workshop or preserve teachings, which highlights publicly supported rows without choosing the successor automatically. Biological children, adopted heirs, students and other locally supported successors can enter through their real routes.

**Reason/cost:** a candidate inherits actual leftovers under the selected route, not all the predecessor's visible body/skills. A body-faculty row can say “Transmission not established” even when the faculty is expressed. Known standing is not an inheritable organ. Unknown willingness is not refusal; remote status is not death.

Selection means comparison only. The footer offers “Open succession terms” when the actual ending/estate route supports it, rather than a destructive Choose heir button in an informational screen. That later surface must show what transfers, what is lost, agency, world/time, and final commitment. The current wired heir path is not a multi-person chooser and does not establish bloodline transfer; [B3 audit](../b3/AUDIT.md) owns its source findings. UI3 remains a target requiring a later succession integration. Do not reconstruct estate or inheritance authority from biography prose.

## G49-B8.UI4 Match planner

**Default:** choose known participants and a locally supported reproductive/transmission method, then show what can and cannot be estimated from authorized observations. First use without a model: “No reliable estimate. Expression alone does not establish what is carried.” Show missing evidence and known acquisition routes without discovering a secret trait. Family formation, adoption and teaching are separate alternatives where supported, not genetic simulation modes.

**Dial:** an authored genetics/lineage model can give ranges, qualitative odds or exact probabilities. The method label, inputs, test scope, assumptions and model uncertainty remain visible next to results. More than two parents, budding, pacts or asexual transmission use their own world model; do not force two human sex roles. SG1, identity and recorded sex do not establish reproductive capacity.

**Reason/cost:** a forecast reads saved known inputs and never rolls a child. It advances no time, changes no relationship and cannot reroll the seed. A clinic/instrument test or real arrangement has its own quote and actual NPC agency. No trait objective overrides those actions' eligibility.

If a deliberately simple single-locus model is known, tested Aa × Aa inputs can display AA 25%, Aa 50%, aa 25% as a conditional illustration, not a promise about a whole child. Show expression separately from genotype when development/conditions matter. Missing genotype yields no fabricated narrow interval. A range should identify what accounts for its endpoints; “confidence 83%” is absent unless calibrated and knowable. A true backend genotype cannot tighten player-visible odds when undiscovered. Physiological compatibility, developmental effects and social recognition remain separate outputs. Do not rank people by an imagined child or assume a match, conception or commitment is available.

## G49-B8.UI5 Condition log

**Default:** one chronological record joins known injury, substance exposure, stress and acclimation events. Keep a small current-state strip fixed: what affects work now, a known cause, the last update and any necessary response. Historical rows show onset, intervention, observed change and resolved/ongoing/uncertain status. They retain what was believed then; later correction appends evidence.

**Dial:** filter by category/body/person/world and known time interval. Long quiet stretches can group already-known routine events with a disclosed count. Use played minutes for local body jobs, named world calendar for dated evidence and biological time only where supported. Across worlds, preserve origin time and an explicit ordering reference; do not pretend every clock shares a rate.

**Reason/cost:** inspecting an event is free; treatment/regulation opens the existing Notebook → Practice controls or actual local provider quote. Timers distinguish an authored expiry from an estimated recovery. No exact finish time is invented for a chronic state or unmeasured acclimation. Empty history says “No condition events recorded”, not “Perfect health”.

New information gives a calm unread marker without moving the active row or stealing focus. History is not an `aria-live` stream on every tick; meaningful updates can be announced once, with settled facts only. If a condition matters during combat, the existing critical state remains visible beside vitals even while the history scrolls. UI cannot turn G35/G36/G44 possibilities into mandatory maintenance or override accepted comfortable unfed play.

## G49-B8.UI6 World skins and information providers

**Default:** same role tints, navigation order, evidence words, comparison structure and keyboard semantics. World styling changes heading ornament, frame accent and provider vocabulary at arrival/known-provider transitions. Body text stays plain. Skin is presentation; a provider is a real means that may add or qualify information. Switching style does not improve diagnostic scope.

**Dial:** optional preferred discovered style, density and Player Appearance override in This browser. Respect L7 first, then restrained world/place/occasion/state accents. The world may author a diegetic system with genuine reading powers or known limitations. Its scope lives in evidence, not in CSS.

**Reason/cost:** a status window, physician, clan registrar and genome scanner answer different questions through actual evidence. Acquiring access can cost service/time/materials where authored; reading an already recorded answer need not. A provider can be free, exhaustive or exceptional if the world supports it. No fixed usage cap is proposed.

| Skin proposal / fitting settings | Presentation | Provider distinction retained |
|---|---|---|
| Ordinary doctor's notes; home, low-magic travel, mundane communities | Plain ruled notes, quiet date margin, readable teal/violet/plum role surfaces | Symptoms, observation, treatment and incomplete diagnosis, not an exhaustive body truth |
| Clan ledger; cultivation houses and ancestry institutions | Restrained jade/brass frame, branch seals only when known, legal/house record vocabulary | Clan claim, recognized status and measured faculty are separate; no compulsory purity scale |
| Scholarly magical notes; HP, D&D, Mother of Learning or book-world schools where a fitting provider exists | Ink headings, annotation margins, known diagram motifs | Local exam/spell/pact scope; no generic meridian or DNA assumption |
| Instrument/genome scan; technologically capable worlds or acquired devices | Sparse schematic headings, units, method/read time | Scan quality, sample identity, test limitations and inherited vs somatic change |
| Diegetic status window; worlds/held systems that actually provide it | Compact label/value rows and restrained header mark, matching CH1 language | Provider ownership and known reading scope; native core stats are not secret genotype data |
| Brood or distributed-body record; fitting original/nonhuman starts | Part/channel list, known communication reach, current inspected member | Individual evidence stays local until a real channel communicates it; no omniscient network |

These are fitting examples, not verified canon UI claims or six new worlds. Book/world source owners qualify exact names and laws. Unreached worlds never appear in a theme menu, asset fingerprint or preview. A known device that loses signal preserves its prior dated report and says “Live reading unavailable: no connection”, rather than erasing the known body. A dead system's cosmetic cracks cannot obscure factual saving warnings or Back to play.

## G49-B8.3 Interaction and acceptance handoff

Wireframes are static HTML with local navigation links and native disclosures. All fixture data are synthetic and public. Game-action buttons are disabled; there is no simulated genetic backend, save system, reveal behavior or real outcome. [Wireframe index](wireframes/index.html) links all six.

| Gate | Future implementation evidence required |
|---|---|
| V1 Desktop contents | Rebuild, fresh origin at 1366x768 and 1920x1080. Screenshot and bounding rectangles for header, selected evidence, comparison results, quote and return controls. No horizontal page/panel overflow. Verify the useful content lies above the footer or can be reached through the named reading scroll region. Header visibility alone fails this gate. |
| V2 Known-only projection | Unknown/no-card control, partially investigated body, conflicting parent claim, non-detection, known unavailable provider and known seal. Scan DOM/ARIA/tooltips/pickers/settings/search/URLs for synthetic forbidden tokens; hidden truth cannot influence sort/odds/skin/count. Exercise the real discovery route and once-only visible arrival. |
| V3 Decision continuity | Actual Bio/People/Reports entry, Back/Escape, pin, saved layout, branch selection, comparison and long history preserve focus/scroll/disclosures through native refresh. F6/Shift+F6 reaches shells; Tab reaches their useful controls. Read-only browsing spends nothing or regenerates nothing. |
| V4 Readability | Standard/Vivid, real Appearance apply/restore, density, 150% browser zoom/text growth, long names, keyboard focus, high contrast, Effects off and reduced motion. Text ≥4.5:1; meaningful edges/focus ≥3:1. Screen-reader route remains a separate check. |
| V5 Mechanics and persistence | Selected B2/B3/B7/world contracts first. Verify diagnosis/condition/body change/transmission consumers, not only mock tables. If data change: explicit compatibility decision, save/reload and literal-file import preserving truth/evidence/discovery separately and without rerolls/replayed reveals. Succession/arrangements commit only through their actual transaction, with failure evidence. Human layout/fiction acceptance is separate. |

The first bounded implementation recommendation is UI1 plus links to existing current conditions and practice, using a qualified known-body projection. UI2 follows when genuine family claims/records exist. UI3/UI4 need real candidate/method contracts; UI5 needs historical event records, not a repaint of active conditions. UI6 is shared presentation throughout. This ordering is a recommendation beside G51, not authorization to implement it or a new product gate for other lanes.

B8 completes when its docs, six rendered sketches, source audit and explicit limits are reviewable. The gameplay gates above remain OPEN. Mobile optimization, production diagram assets, source/build edits, balance, generation, body/succession schemas and shared owner integration are deferred to their authorized owners.
