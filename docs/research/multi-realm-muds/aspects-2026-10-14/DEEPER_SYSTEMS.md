# Deeper systems, ranked by payoff

**PROPOSALS ONLY.** This closes three conceptual implementation questions to the extent public material supports them. All server code consumers remain unread.

## DS1: Conditional transit and local familiarity

Inputs: current planet, local daylight, route location/destination policy, known inspection result, body/movement support and possibly alignment. Output: a route may open, move, lead elsewhere or refuse. RetroMUD's help describes those distinctions; homeworld bonuses separately affect competence and costs. Unknowns: actual route RNG, reset boundaries, current thresholds and statue placement conflict. No complete state machine recovered. [retro-transportxml](https://www.retromud.org/proxy/helpxml?=Movement/interplanetary_transport), [retro-newtransport](https://newbie.retromud.org/gameplay/world-transport), [retro-worldbonuses](https://www.retromud.org/proxy/helpxml?=Worlds/homeworld_bonuses).

INFERRED YAIRPG: MW-P1/P04/P13/P14. Inspect -> quote -> recheck -> staged commit under the existing publisher. Retain known route information with source and time, not permanent truth for a changing destination. Have a practical refusal/return route. Support source-specific extraordinary passage rather than always enforcing the ordinary travel test.

## DS2: Guild growth versus current embodiment

RetroMUD layers training subject to path history and race aptitude. 3K guilds expose different power machinery: summons, implants, prepared bodies; professions and Ascended add independent layers. Retained skill, installed source, fuel, teacher access and affiliation cannot be collapsed into one level or membership bit. Server stacking order and simultaneous activation are unread. [retro-paths](https://www.retromud.org/proxy/helpxml?=Guilds/paths_of_power), [retro-creation](https://newbie.retromud.org/gameplay/character-creation), [3k-professions](https://3k.org/support/help/fetch-help.php?topic=professions), [3k-sii](https://3k.org/support/help/fetch-help.php?topic=sii), [3k-cyborg](https://3k.org/support/help/fetch-help.php?topic=cyborg), [3k-ascended](https://3k.org/support/help/fetch-help.php?topic=ascended).

INFERRED YAIRPG: MW-P2/P03/P04/P07. Keep the learned method when access or embodiment changes, then let actual lore decide whether it executes. Crossing is not reincarnation. Credential recognition and institutional standing remain jurisdictional, not automatic cross-world authority. Do not copy MMO slot limits or party dependence as a solo design requirement.

## DS3: Many authors, common objects, distinct renewal policy

3K's public examples supply common room and monster inheritance; inspect/search and hidden/guarded exits differ. Level defaults simplify baseline monsters while local specials vary. Reset repopulation is authored and presence-guarded. Review proceeds through sponsor/staff/player stages; catalogue repair and approval remain distinct. This makes a useful public authoring model, but exact deployed inheritance, resets and all numeric ranges are not audited. [3k-room](https://3k.org/resources/primer/examples/room.html), [3k-monster](https://3k.org/resources/primer/examples/monster.html), [3k-put](https://3k.org/resources/primer/examples/put_it_together.html), [3k-wizzing](https://3k.org/resources/primer/coding/wizzing.html), [3k-arealist](https://3k.org/support/help/fetch-help.php?topic=arealist).

INFERRED YAIRPG: MW-P3/P16/P22. Use an existing pack with clear source/revision, local verb, capability band and renewal contract. Separate renewable encounters from named deaths and once-settled stock. Human/player review remains distinct from offline lint and native proof. No second pack engine, all-world readiness re-score or new mandatory gate follows.
