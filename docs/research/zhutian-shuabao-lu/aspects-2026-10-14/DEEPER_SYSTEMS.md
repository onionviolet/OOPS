# Three deeper systems with the largest payoff

All adaptation ideas below are PROPOSALS. Source locators resolve through [SOURCES](../SOURCES.md). Complete original tables and decoded selected flows stay private.

## DS1: place-bound services over a shared roster

SHOWN: world, faction, career and actor tables share ID-based formats. Enter-plane changes current map/location and resets encounter selectors while retaining shared save ownership. Faction records include groups of skill references; skill/career tables use shared battle fields. The source therefore has a cheap way to make the destination useful without a separate character engine.

STATED: local reputation and contribution admit recruits/skills; profession prerequisites and guides enable career changes; incompatible learned skill types stop working after a switch. Hunting, tower, rebirth and rift services are anchored at different planes. This is the joined pattern of travel -> service access -> retained learning/growth -> changed use. It does not establish per-world laws of magic or social memory.

S11 selected rebirth reader actually checks tier/level/slots/material quantity and writes tier and level increments, rather than merely showing a button. That gives a stronger mechanism reference than its help text alone. Its entire cost/effect transaction is still not audited.

YAIRPG: ZSL-P02/P03, K3/K5/K7/K13/K15, P03/P04/P07/P17. Use a place's tools, teachers or law to explain one real service. Carry the acquired method independently from present fuel/body/tool compatibility. Do not add a universal profession switch or forced pilgrimage.

## DS2: loot becomes home work instead of inventory clutter

SHOWN: the drop consumer joins enemy-indexed arrays to items, constructs weighted outcomes and calls a shared item acquisition path. Items include equipment, materials and special progression goods. Company structures include CEO/departments, research, construction, crafting, exhibition, synthesis, taming, dispatch, study and education. Dispatch has its own team, status and reward handlers.

STATED: the inherited antique shop sells acquired plane equipment for home cash. Research unlocks buildings and boosts returns. Material supply feeds continuing education; practice expands learnable skill caps. A character's management or work competence changes corresponding buildings, while the protagonist's competence boosts global output rather than holding a building job (`bz[2,9]`, `[1,23:32]`, `[5,28]`). This is an ongoing reason to care about both world loot and roster roles.

Inference: a useful reward can serve a second career or production goal, and that creates return value without inventing another world. This source's economy is not proof of autonomous residents or a balanced arbitrage simulation. All production queues, double-assignment prevention and sink conservation remain partial.

YAIRPG: ZSL-P01/P08, K6/K8/K9/K25/K26, P02/P06/P07. Use one existing workshop/household/provider and an actual alternative use. Preserve custody and person availability. Do not import a company dashboard or duplicate a resident to staff two activities.

## DS3: definition, persistent progress and temporary encounter state

SHOWN: external tables define content; a shared save array holds positional player/world state; temporary arrays and mode variables hold current encounter bookkeeping. Plane entry writes plane versus otherworld coordinates. A progress reader derives floor/difficulty from packed completion. A distinct reset handler zeroes selected battle counters, temporary record fields and selected saved encounter cells. This scoped reset is not evidence of wiping a world's population or whole save.

SHOWN save handler exports arrays and metadata through separate LocalStorage/NW.js branches with normal/backup names. Multiple calls write metadata and payload separately. A backup folder alone cannot establish a coherent recovery point. The source's template save file does not contain a player's state.

YAIRPG: ZSL-P07/P04, K5/K12/K17/K18/K33, P05/P12/P16/P24 and integration map IR4. Keep authored definitions, lived instances, repeatable encounters and settlement receipts separate. A fresh world version should not overwrite a revisited lived instance. Pin revisions, stop on incompatible saved meanings and use the existing durable publisher; do not reproduce this positional array scheme.
