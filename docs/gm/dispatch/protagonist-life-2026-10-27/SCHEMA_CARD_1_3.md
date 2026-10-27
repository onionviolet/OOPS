## Lead-run schema 1.3 card (frozen 2026-10-27)

Every row has a `schema` key. Ids: `<world>.<kind>.<slug>`; organizations use `organization`. Locators:
`zh 第N章 pM`. Labels: `S` stated, `I` inferred, `U` unknown, nothing else. Never copy more than five source
characters in a row outside `zh` and `aliases`. Notes: at most 15 words, own words.

**Kinds:** person, place, organization, deity, item, price, law, calendar, clock, event, language, measure,
document, note, creature.
**Action classes:** study, practice, research, craft, trade, work, travel, fight, socialize, rest, care, appraise,
ritual, other.
**Motives:** hunger, fatigue, safety, fear, curiosity, thrift, income, family-duty, loyalty, ambition, pride,
secrecy, caution, guilt, grief, faith, justice, comfort, belonging, revenge.

**Scene** `{schema:'lead-run/1.3', beat:'lr.<world>.main.NNN', order, pov:'lead' or a person id,
date:{anchor, offsetDays, value, label, note}, timeOfDay:{value, precision:'day'|'band'|'hour'|'minute', evidence},
window?, place, deps:[{id: beat id, kind:'after'|'needs'}], continues?, steps:[{verb, class, label, time:{minutes}|{band},
inputs, outputs, gains, requires}], touched:[{kind, id, status:'present'|'partial'|'missing'}], present:[ids],
knowledge:[{fact, change:'gained'|'lost', from, locator}], motives:[{tag, locator}], choices:[{taken, options,
label, locator}], options:[{action, class, needs:[ids], taken, label, locator}], outcomes:[{fact, value,
class:'carried'|'changed'|'blocked'}], anchors:[{fact, value:number, unit, scope:'lead'|'household', locator,
approx?}], weight:'great'|'routine', footprint:{places, window, hazards, roles}|null, conflict?:{sides, stakes,
means, terrain, outcome, unseen}, tone?, open?:[questions], hook?:true, sealed:[opaque ids],
evidence:[{label, locator, kind:'shown'|'narration'|'inferred'|'thought:<who>'|'dialogue:<who>'|'dream:<who>'}],
mechanism:null|name}`. Only `pov:'lead'` scenes are lead scenes; others still produce census rows.

**Census** `{schema:'census/1.3', id, label, zh (literal, as printed), nameSource:'repo'|'wiki'|'pinyin-unconfirmed',
kind, rung:'M0'|'M1', whereabouts:[{place, era, status:'stated'|'claimed'|'inferred', locator}], firstMention,
firstVolume:null unless shown, touchedByLead, aliases, claimant, amount?:{value, unit, per, cap}, estimateBy?,
voice?, procedure?, tech?, note}`. Present in a scene means M1 at that place and date. Every distinct amount is a row.

**Fill** `{schema:'fill/1.3', id:'<world>.fill.<slug>', for, kind, what, status:'authored-proposal',
layer:'implied'|'period'|'invented', basis:[ids or locators], respects:[ids], replaceableBy:'later reading',
confidence:'high'|'medium'|'low'}`.

**Units:** penny (pence), soli (shilling), pound (gold pound); record the unit the text uses and its amount.
