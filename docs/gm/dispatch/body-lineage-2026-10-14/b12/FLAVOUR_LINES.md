# B12 MP3 flavour-line catalogue

2026-10-14. **Proposal only:** 72 state/phase sets, each with three short
world-family variants, for 216 authored log lines. This is original wording,
not franchise prose or a canon claim. Every set names its resolved modifier;
prose adds no second bonus. Missing consumer/state groups remain pending as
[NO_CONSUMER](NO_CONSUMER.md) records.

F1 Ordinary frontier: local work, tools, meals and plain surroundings.
F2 Scholarly wizardry: study halls, lesson notes and practice staffs, only where
those objects/actions really exist. F3 Cultivation: training grounds, manuals
and practiced forms, only where supported. These are wording families, not
three implemented worlds. Use ordinary wording when a referenced means is
absent. No line grants qi, magic, bloodline knowledge or another person's
private state. A family change changes wording, not the effect.

Use these as alternatives selected for a real transition/relevant action,
not a 72-message sequence. Each table row has a stable FL ID. Onset and
ongoing are separate eligible phases; remedy/expiry lines require the state
actually to clear. A neutral line describes only its own row's contribution:
other effects may still apply. See [HOOKS D3](HOOKS.md#d3-mp3-publication-and-knowledge-proposal)
for deduplication, publication, secrecy, saved observation cursor and feed rules.

Effect units: chance deltas are probability fractions, so -.01 is one
percentage point. x factors are relative multipliers, not direct hit chance.
XP refers only to the named skill/task; no Watchcraft timer or discrete
technique proficiency is changed. Duration modifiers are applied once when
incoming food is actually consumed, not re-scaled every tick.

For food-poison lines, observed easing alone cannot establish resistance.
Only use comparative “sooner/usual” text when the player has a known prior
reaction or a supported observation; otherwise use “Your stomach upset is
easing.” Do not announce easing at the instant of exposure. Similarly,
“usual” in any group needs a known baseline. Recovery prose follows the
actual resolved recovery use and does not promise perfect health or stamina.

## MI1: Cold fingers

Pending hand-exposure state and craft adapter. Fine item craft only.

| ID | State/phase | Resolved modifier reflected | Ordinary frontier | Scholarly wizardry | Cultivation |
|---|---|---|---|---|---|
| FL001 | onset | craft chance -0.01 | Your fingers feel stiff around the small tool. | Your fingers stiffen around the fine tool. | Your fingers stiffen around the carving tool. |
| FL002 | ongoing | craft chance -0.01 | You rub your cold hands before the next cut. | You rub your hands before the next fine cut. | You rub your hands before carving the next mark. |
| FL003 | warming cleared | craft delta 0 | Warmth returns to your fingers. | Your fingers loosen beside the study-room hearth. | Your fingers loosen beside the practice-room brazier. |
| FL004 | clear at work | craft delta 0 | The small tool sits comfortably in your hand again. | The fine tool sits comfortably in your hand again. | The carving tool sits comfortably in your hand again. |

## MI2: Sweaty palms

Pending sweat and grip-task qualification. Requires a held grip tool/weapon for these lines.

| ID | State/phase | Resolved modifier reflected | Ordinary frontier | Scholarly wizardry | Cultivation |
|---|---|---|---|---|---|
| FL005 | onset | attack_points x.98 | Your grip needs another small adjustment. | You shift your damp grip on the practice staff. | You shift your damp grip on the practice blade. |
| FL006 | ongoing | attack_points x.98 | Your palm feels slick against the handle. | Your palm feels slick against the staff. | Your palm feels slick against the sword grip. |
| FL007 | wiped or wrapped | attack_points x1 | Your grip settles after wiping your hand. | Your grip settles after drying the staff handle. | Your grip settles after drying the sword grip. |
| FL008 | sweat cleared | attack_points x1 | Your hand stays where you put it now. | Your hand stays firm on the staff now. | Your hand stays firm on the practice blade now. |

## MI3: Post-meal drowsiness

Pending actually consumed large-meal state. Reading lines, not automatic proof of a cultivation faculty.

| ID | State/phase | Resolved modifier reflected | Ordinary frontier | Scholarly wizardry | Cultivation |
|---|---|---|---|---|---|
| FL009 | onset | reading x.95; Meditation XP x.98 | The meal leaves you slow over the next page. | The meal leaves you slow over the lesson notes. | The meal leaves you slow over the practice manual. |
| FL010 | ongoing | reading x.95; Meditation XP x.98 | You read the same sentence a second time. | You read the same instruction a second time. | You read the same breathing note a second time. |
| FL011 | timer cleared | reading x1; Meditation XP x1 | The heavy feeling after lunch has passed. | The heavy feeling after the hall meal has passed. | The heavy feeling after the shared meal has passed. |
| FL012 | clear at study | reading x1; Meditation XP x1 | The page holds your attention again. | The lesson notes hold your attention again. | The manual holds your attention again. |

## MI4: Stimulant jitters

Pending qualified stimulant item. Benefit lines require reading; cost lines require fine craft. No general detection claim.

| ID | State/phase | Resolved modifier reflected | Ordinary frontier | Scholarly wizardry | Cultivation |
|---|---|---|---|---|---|
| FL013 | fine-work cost | craft chance -0.02 | Your hands shake a little over the fine cut. | Your hands shake a little over the fine mark. | Your hands shake a little over the carved mark. |
| FL014 | reading benefit | reading x1.02 | The page feels easier to follow, despite the jitters. | The lesson feels easier to follow, despite the jitters. | The manual feels easier to follow, despite the jitters. |
| FL015 | jitter expired | craft delta 0 | The small shake in your hands has stopped. | Your pen hand has stopped its small shake. | Your carving hand has stopped its small shake. |
| FL016 | benefit expired | reading x1 | The extra edge has passed; you keep reading. | The extra edge has passed; you continue the lesson. | The extra edge has passed; you continue the manual. |

## MI5: Thirst headache

Pending authored thirst condition and real water action. Never emit from fullness alone.

| ID | State/phase | Resolved modifier reflected | Ordinary frontier | Scholarly wizardry | Cultivation |
|---|---|---|---|---|---|
| FL017 | onset | reading x.97 | A dull headache makes the page harder to follow. | A dull headache makes the notes harder to follow. | A dull headache makes the manual harder to follow. |
| FL018 | ongoing | reading x.97 | Your dry mouth keeps pulling you from the page. | Your dry mouth keeps pulling you from the lesson. | Your dry mouth keeps pulling you from the manual. |
| FL019 | actual water cleared | reading x1 | After the water, the page feels clearer. | After the water, the lesson feels clearer. | After the water, the manual feels clearer. |
| FL020 | clear at study | reading x1 | You can stay with the text again. | You can stay with the lesson again. | You can stay with the practice notes again. |

## MI6: Afternoon dip

First-slice candidate. Match the profile interval and active reading or Meditation tick. No new cause diagnosis.

| ID | State/phase | Resolved modifier reflected | Ordinary frontier | Scholarly wizardry | Cultivation |
|---|---|---|---|---|---|
| FL021 | interval starts | reading x.95; Meditation XP x.98 | Your attention drifts as the afternoon settles in. | Your attention drifts over the afternoon lesson. | Your attention drifts during the afternoon practice. |
| FL022 | ongoing reading | reading x.95 | You take longer over the next paragraph. | You take longer over the next lesson paragraph. | You take longer over the next manual paragraph. |
| FL023 | interval ends | reading x1; Meditation XP x1 | The afternoon fog in your head has lifted. | The afternoon lesson feels clearer again. | The afternoon practice feels clearer again. |
| FL024 | shifted profile neutral | reading x1; Meditation XP x1 | This hour suits your attention today. | This lesson hour suits your attention today. | This practice hour suits your attention today. |

## MI7: Warm-up

Pending session clock, grip-qualified attack and consistent stamina spend. Routine lines require its actual completion.

| ID | State/phase | Resolved modifier reflected | Ordinary frontier | Scholarly wizardry | Cultivation |
|---|---|---|---|---|---|
| FL025 | cold start | attack_points x.98; combat cost x1.02 | Your first movements feel a little stiff. | Your first staff movements feel a little stiff. | Your first blade movements feel a little stiff. |
| FL026 | still warming | attack_points x.98; combat cost x1.02 | You have not settled into the movement yet. | You have not settled into the staff work yet. | You have not settled into the blade work yet. |
| FL027 | routine completed | attack_points x1; combat cost x1 | The warm-up leaves your movements loose. | The warm-up leaves your staff movements loose. | The warm-up leaves your blade movements loose. |
| FL028 | timer completed | attack_points x1; combat cost x1 | Your movements have found their usual ease. | Your staff movements have found their usual ease. | Your blade movements have found their usual ease. |

## MI8: Hunger mood

Pending actual enabled fullness, tagged hunting and willing merchant reaction. These are separate contexts, not a guaranteed mood.

| ID | State/phase | Resolved modifier reflected | Ordinary frontier | Scholarly wizardry | Cultivation |
|---|---|---|---|---|---|
| FL029 | hunting benefit | hunting resource chance +.01 | Hunger makes you watch the animal tracks more closely. | Hunger makes you watch the field tracks more closely. | Hunger makes you watch the beast tracks more closely. |
| FL030 | merchant reaction | merchant markup above 1 x1.01 | Your short answers make this trader less willing to bend. | Your short answers make this bookseller less willing to bend. | Your short answers make this stallholder less willing to bend. |
| FL031 | meal clears hunting state | hunting delta 0 | After eating, the sharp edge of hunger fades. | After eating, the sharp edge of hunger fades. | After eating, the sharp edge of hunger fades. |
| FL032 | observer reaction clears | merchant markup factor x1 | The trader relaxes as your answers soften. | The bookseller relaxes as your answers soften. | The stallholder relaxes as your answers soften. |

## MI9: Glare and wind

Pending actual facing/glare and ranged action. These lines cover glare only; no directional wind or scent modifier exists.

| ID | State/phase | Resolved modifier reflected | Ordinary frontier | Scholarly wizardry | Cultivation |
|---|---|---|---|---|---|
| FL033 | glare onset | qualified ranged attack_points x.97 | Bright light makes the target harder to hold in view. | Bright light makes the practice target harder to hold. | Bright light makes the training target harder to hold. |
| FL034 | ongoing aim | qualified ranged attack_points x.97 | You narrow your eyes against the bright sky. | You narrow your eyes across the bright practice yard. | You narrow your eyes across the bright training ground. |
| FL035 | position remedy | qualified ranged attack_points x1 | The target is clearer from the shaded position. | The target is clearer from the shaded yard edge. | The target is clearer from the shaded training edge. |
| FL036 | glare cleared | qualified ranged attack_points x1 | The harsh light has softened around the target. | The harsh light has softened around the practice target. | The harsh light has softened around the training target. |

## MI10: Pins and needles

Pending uninterrupted posture episode and exact conceal quote. Remedy lines require actual movement/posture transition.

| ID | State/phase | Resolved modifier reflected | Ordinary frontier | Scholarly wizardry | Cultivation |
|---|---|---|---|---|---|
| FL037 | on movement quote | pursuit.conceal cost +.1 stamina | Your sleeping leg makes the quiet step awkward. | Your sleeping leg makes the quiet courtyard step awkward. | Your sleeping leg makes the quiet practice-yard step awkward. |
| FL038 | ongoing state | pursuit.conceal cost +.1 stamina | Your foot prickles when you put weight on it. | Your foot prickles when you leave the reading seat. | Your foot prickles when you leave the meditation mat. |
| FL039 | posture remedy | conceal cost delta 0 | Changing your posture brings feeling back to your foot. | Changing your posture brings feeling back beside the desk. | Changing your posture brings feeling back on the mat. |
| FL040 | moving timer cleared | conceal cost delta 0 | Your next quiet step feels ordinary again. | Your next quiet courtyard step feels ordinary again. | Your next quiet training-yard step feels ordinary again. |

## MG6: Daily variance

First-slice candidate. Emit only after resolved full day key, persisted adoption and relevant use. Normal is its own observation, not a diagnosis.

| ID | State/phase | Resolved modifier reflected | Ordinary frontier | Scholarly wizardry | Cultivation |
|---|---|---|---|---|---|
| FL041 | off day | sleep stamina x.98; reading x.98 | You feel a little off today. | The lesson takes a little more from you today. | The manual takes a little more from you today. |
| FL042 | normal day | sleep stamina x1; reading x1 | Your body feels much as it usually does. | Study feels much as it usually does. | Practice reading feels much as it usually does. |
| FL043 | sharp day | sleep stamina x1.02; reading x1.02 | You feel unusually sharp today. | The lesson comes a little more easily today. | The manual comes a little more easily today. |
| FL044 | neutral recovery use | sleep stamina x1 | Rest is returning your strength at its usual pace. | Rest is returning your strength after study at its usual pace. | Rest is returning your strength after practice at its usual pace. |

## MG5: Return to form

Pending selected substantial recovery episode, qualifying training/attack and return timer. No claim of measured lifelong baseline.

| ID | State/phase | Resolved modifier reflected | Ordinary frontier | Scholarly wizardry | Cultivation |
|---|---|---|---|---|---|
| FL045 | first qualifying work | attack_points x.98; native training XP x.98 | You are back at work, though still finding your rhythm. | You are back in the practice yard, finding your rhythm. | You are back at training, though still finding your rhythm. |
| FL046 | ongoing return | attack_points x.98; native training XP x.98 | The familiar movement asks a little more care today. | The familiar staff movement asks a little more care. | The familiar form asks a little more care today. |
| FL047 | return timer ends | attack_points x1; native training XP x1 | The movement no longer carries that extra hesitation. | The staff movement no longer carries that extra hesitation. | The form no longer carries that extra hesitation. |
| FL048 | clear at practice | attack_points x1; native training XP x1 | You settle into the drill without the earlier drag. | You settle into staff practice without the earlier drag. | You settle into the form without the earlier drag. |

## MB2: Calibration drift

Pending actual calibrated part, counted use drift and tuning. Require a fitted grip assembly, never infer this from the brass lung.

| ID | State/phase | Resolved modifier reflected | Ordinary frontier | Scholarly wizardry | Cultivation |
|---|---|---|---|---|---|
| FL049 | drift onset | qualified craft chance -0.01 | The fitted grip feels a little out of line. | The fitted tool grip feels a little out of line. | The fitted carving grip feels a little out of line. |
| FL050 | ongoing drift | qualified craft chance -0.01 | You keep correcting the grip during the fine work. | You keep correcting the tool grip during fine work. | You keep correcting the carving grip during fine work. |
| FL051 | actual tuning | qualified craft delta 0 | The tuned grip follows your hand cleanly again. | The tuned tool grip follows your hand cleanly again. | The tuned carving grip follows your hand cleanly again. |
| FL052 | qualified bypass | qualified craft delta 0 | The supported tool fit takes the drift out of this work. | The supported tool fit takes the drift out of this work. | The supported chisel fit takes the drift out of this work. |

## MB3: New hand, old habits

Pending actual changed hand and motor-learning adapter. Does not erase memory or grant practice.

| ID | State/phase | Resolved modifier reflected | Ordinary frontier | Scholarly wizardry | Cultivation |
|---|---|---|---|---|---|
| FL053 | new grip | grip attack_points x.97 | Your new hand reaches for the old grip. | Your new hand reaches for the familiar staff grip. | Your new hand reaches for the familiar sword grip. |
| FL054 | relearning | grip attack_points x.97 | You know the movement; this hand is still learning it. | You know the staff movement; this hand is still learning. | You know the sword movement; this hand is still learning. |
| FL055 | qualified familiar template | grip attack_points x1 | This hand already feels at home with the grip. | This hand already feels at home with the staff. | This hand already feels at home with the blade. |
| FL056 | actual relearning completed | grip attack_points x1 | Your hand finds the practiced grip without correction now. | Your hand finds the staff grip without correction now. | Your hand finds the sword grip without correction now. |

## MB7: Scale slips

Pending genuine frame change, fine-task tags and tool-fit practice. These lines require a too-large reach change, not any race selection.

| ID | State/phase | Resolved modifier reflected | Ordinary frontier | Scholarly wizardry | Cultivation |
|---|---|---|---|---|---|
| FL057 | changed reach | qualified craft chance -0.01 | Your changed reach carries the tool a little too far. | Your changed reach carries the fine tool too far. | Your changed reach carries the chisel a little too far. |
| FL058 | ongoing adjustment | qualified craft chance -0.01 | You stop the tool short and adjust your reach. | You stop the fine tool and adjust your reach. | You stop the chisel short and adjust your reach. |
| FL059 | real fitted tool | qualified craft delta 0 | The fitted handle brings the small movement back within reach. | The fitted tool brings the small movement back within reach. | The fitted chisel brings the small movement back within reach. |
| FL060 | practice completed | qualified craft delta 0 | Your reach settles into the fine work again. | Your reach settles into the fine tool work again. | Your reach settles into the carving work again. |

## LQ3 / C01: Rest timing

B2 proposal reused. Prefer/poor-hour factors from the selected chronotype, with actual sleep. No family-specific physiology invented.

| ID | State/phase | Resolved modifier reflected | Ordinary frontier | Scholarly wizardry | Cultivation |
|---|---|---|---|---|---|
| FL061 | preferred sleep hour | sleep stamina x1.05 | Rest comes easily at this hour. | Rest comes easily after study at this hour. | Rest comes easily after practice at this hour. |
| FL062 | less suited sleep hour | sleep stamina x.95 | Rest comes a little slowly at this hour. | Rest comes a little slowly after the late lesson. | Rest comes a little slowly after the late practice. |
| FL063 | preferred boundary reached | sleep stamina x1.05 | The quiet hour suits your sleep better now. | The quiet hall hour suits your sleep better now. | The quiet courtyard hour suits your sleep better now. |
| FL064 | neutral profile | sleep stamina x1 | You rest at your usual pace here. | You rest at your usual pace after study. | You rest at your usual pace after practice. |

## MH4 / MB4 / LQ1: Qualified food sensitivity

Only B2 explicit Stale bread sensitivity x.90. MH4 inheritance and MB4 changed palate remain pending. Do not derive reaction from preference or kin.

| ID | State/phase | Resolved modifier reflected | Ordinary frontier | Scholarly wizardry | Cultivation |
|---|---|---|---|---|---|
| FL065 | consumed sensitive bread | positive Basic meal duration x.90 | The bread does not sit as well with you. | The study-room bread does not sit as well with you. | The shared bread does not sit as well with you. |
| FL066 | ongoing shortened buff | original applied duration was x.90 | The bread has left you less settled than usual. | The hall bread has left you less settled than usual. | The shared bread has left you less settled than usual. |
| FL067 | consumed qualified alternative | positive food duration x1 | This meal sits better with you. | This hall meal sits better with you. | This shared meal sits better with you. |
| FL068 | profile reaction suppressed | positive food duration x1 | The bread sits comfortably with you this time. | The hall bread sits comfortably with you this time. | The shared bread sits comfortably with you this time. |

## LQ2 / C02: Qualified food-poison tolerance

B2 proposal reused. These lines require observed upset/timing, not a hidden resistance diagnosis. Duration applies on incoming food effect only.

| ID | State/phase | Resolved modifier reflected | Ordinary frontier | Scholarly wizardry | Cultivation |
|---|---|---|---|---|---|
| FL069 | observed short upset | Slight food poisoning duration x.80 | Your stomach turns, but the upset passes sooner. | Your stomach turns after the hall meal, then settles. | Your stomach turns after the shared meal, then settles. |
| FL070 | remaining short upset | original applied duration was x.80 | The stomach upset is already easing. | The upset after the hall meal is already easing. | The upset after the shared meal is already easing. |
| FL071 | effect expired | poison effect inactive; new delta 0 | The last of the stomach upset has passed. | The last of the hall-meal upset has passed. | The last of the shared-meal upset has passed. |
| FL072 | known neutral profile | incoming poison duration x1 | The stomach upset takes its usual time to pass. | The hall-meal upset takes its usual time to pass. | The shared-meal upset takes its usual time to pass. |

