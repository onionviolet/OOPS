# Module catalogue

Status: **[PROPOSAL]** All gameplay rows are proposals. Source labels identify the cited snapshot evidence; see [source ledger](SOURCE_LEDGER.md). Catalog is a compact first-pass coverage map, not complete named-technique census.

| Module | Proposed records / progression | State to model | Evidence / boundary |
|---|---|---|---|
| Human breathing | **[PROPOSAL]** Total Concentration; constant practice; styles derived from Sun; forms and individual variations | Lung conditioning, fatigue, injury, current execution, learned forms, body fit | Total Concentration Breathing rev 127065; Water Breathing rev 126658; source imagery is not physical water |
| Training | **[PROPOSAL]** Instructor, regimen, practice interval, measurable milestone, readiness review | Time, help, body condition, attempted practice, observed result | Rehabilitation Training rev 117121; Hashira Training rev 128706 |
| Demon biology | **[PROPOSAL]** Conversion, blood dose tolerance, feeding/growth, regeneration, art development | Species/body, blood exposure, nutrition, injury, regeneration, control link, vulnerabilities | Demon rev 130890; thresholds vary or remain unknown |
| Demon arts | **[PROPOSAL]** Individual authored effects composed from body/material/space/senses/control | Trigger, range, target, substrate, duration, cost, counter and actor | Demon and selected character/ability pages; do not generalize an individual art |
| Nichirin equipment | **[PROPOSAL]** Sunlight-absorbing ore, crafted weapon, owner color condition, repair, red state | Material, maker, custody, condition, owner, heat/friction/pressure state | Nichirin Sword rev 126696; Bright Red Nichirin Sword rev 123577 |
| Mark and perception | **[PROPOSAL]** Mark state; heightened perception; Transparent World; Selfless State | Preconditions, duration, fatigue, sensory cues, knowledge and risk | Demon Slayer Mark rev 129116; Transparent World rev 127620; wiki conditions conflict |
| Corps institution | **[PROPOSAL]** Cultivator, selection, ranks, Hashira, Tsuguko, Kakushi, crow, swordsmith network | Membership, duty, role, assessment, access and local authority | Demon Slayer Corps rev 125400; Demon Slayer rev 127565 |
| Medicine and recovery | **[PROPOSAL]** Wisteria poison, treatment, rehabilitation, antidote and demon-restoration research | Exposure, dose, expertise, time, side effects and residual injury | Demon rev 130890; Shinobu / battle pages have narrow examples |
| Human logistics | **[PROPOSAL]** Food, sleep, shelter, transport, secrecy, household and mission supplies | Perishable stock, travel time, witnesses, local trust and supply chain | Campaign source pages; local economic detail invented |
| Information and memory | **[PROPOSAL]** Scent, hearing, crows, witnesses, reports, rumors and confirmed knowledge | Observer, modality, confidence, provenance and shared information | Character / demon and battle pages; medium label required |

## Proposed data model

**[PROPOSAL]** Keep source family, continuity, era, place, entry profile, scenario, body, learned method, owned item, state condition, actor observation and obligation as separate records. Each technique record names user eligibility, trigger, target, effect, range, duration, cost, failure, counter and evidence. Each demon art is individually authored. A demonstrated counter is not automatically universal. Every save-affecting pack revision needs an explicit compatibility decision and frozen definition.

**[PROPOSAL]** Proposed pack IDs are illustrative only: `ds.breathing.water`, `ds.breathing.sun`, `ds.body.demon`, `ds.item.nichirin`, `ds.condition.mark`, `ds.institution.corps`. No runtime registration is implied.
