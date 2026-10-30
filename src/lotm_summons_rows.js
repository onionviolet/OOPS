// Volume 1 summons scene data only (MR10/MR13, AR2/AR8, AD38).
// S = source-stated/shown, T = source interpretation, I = authored/inferred.
// Evidence uses field paths; specific paths override their parent tag.
// Locators are the anchor paragraphs the coverage ledger lists; surrounding context paragraphs were read but are not cited.
// No engine hookup, resource mutation, general permission list or save state.
export const LOTM_SUMMONS_ROWS = {
  "schema": 1,
  "rows": [
    {
      "id": "lotm.summon.copper-whistle-messenger",
      "label": "Call the copper-whistle messenger",
      "description": "Call the messenger tied to a borrowed copper whistle, hand over a letter and dismiss its appearance with a second blow.",
      "sourceIds": [
        "lotm.rite.copper-whistle-summon",
        "lotm.rite.copper-whistle-messenger",
        "lotm.rule.bronze-whistle-summon",
        "lotm.rule.copper-whistle-messenger",
        "lotm.rite.summon-bone-messenger",
        "lotm.rite.summon-sunflame-to-backlund"
      ],
      "locators": [
        "zh 第170章 p94",
        "zh 第182章 p56",
        "zh 第189章 p76"
      ],
      "device": "An old copper whistle belonging to Azik, linked to his personal messenger.",
      "eligibility": {
        "all": [
          {
            "fact": "actor.lotm.summon.place.spiritual-wall",
            "op": "eq",
            "value": true,
            "reason": "For this lead-use scene, prepare a room with a spiritual wall; Azik also demonstrates the call in a sitting room."
          },
          {
            "fact": "actor.lotm.summon.held.copper-whistle",
            "op": "eq",
            "value": true,
            "reason": "Have access to Azik's copper whistle; it is borrowed equipment, not a newly granted possession."
          },
          {
            "fact": "actor.lotm.summon.held.folded-letter",
            "op": "eq",
            "value": true,
            "reason": "Have the prepared letter ready for handoff."
          },
          {
            "fact": "actor.lotm.summon.preparation.spirit-vision",
            "op": "eq",
            "value": true,
            "reason": "Use spirit vision to observe the messenger's form; this is an observation prerequisite for this row, not a stated limit on the call."
          }
        ]
      },
      "participants": [
        {
          "role": "caller",
          "ref": "lead",
          "note": "Uses the borrowed whistle and hands over the letter."
        },
        {
          "role": "responder",
          "ref": "azik-messenger",
          "note": "An illusory skeletal messenger linked to the whistle's owner."
        },
        {
          "role": "recipient",
          "ref": "azik",
          "note": "The whistle owner says the messenger carries letters to him; arrival is not shown in the dispatch passages."
        }
      ],
      "steps": [
        {
          "id": "prepare",
          "kind": "prepare",
          "label": "Prepare the letter, room and whistle",
          "minutes": 1,
          "perceived": "You have folded the letter, raised a spiritual wall and taken up the whistle."
        },
        {
          "id": "call",
          "kind": "call",
          "label": "Blow the whistle once",
          "minutes": 1,
          "perceived": "You blow the whistle and hear no sound."
        },
        {
          "id": "response",
          "kind": "response",
          "label": "Observe the messenger",
          "minutes": 1,
          "perceived": "The room grows cold; through spirit vision you see pale bones gather into a huge illusory figure."
        },
        {
          "id": "handoff",
          "kind": "rite",
          "label": "Hand over the letter",
          "minutes": 1,
          "perceived": "The messenger catches and holds the letter."
        },
        {
          "id": "dismiss",
          "kind": "outcome",
          "label": "Blow the whistle a second time",
          "minutes": 1,
          "perceived": "The messenger's visible appearance ends; you do not observe the letter arriving."
        }
      ],
      "response": {
        "entity": "An illusory skeletal messenger",
        "perceived": "Sudden cold and, through spirit vision, an enormous figure of bones that catches the letter."
      },
      "result": {
        "kind": "delivery",
        "stated": "Azik says the messenger will bring letters to him soon by a concealed route. The cited dispatches show acceptance and dismissal, without confirming arrival.",
        "effects": [
          {
            "type": "owner-needed",
            "owner": "messenger-mail",
            "value": {
              "intent": "deliver-letter",
              "recipientRef": "azik",
              "handoffObserved": true,
              "arrivalConfirmed": false
            }
          }
        ]
      },
      "limits": [
        {
          "condition": "Use of this copper whistle",
          "outcome": "Azik describes it as calling his own messenger; this is a device association, not a universal ban on other routes.",
          "evidence": "T"
        }
      ],
      "evidence": {
        "id": "I",
        "label": "I",
        "description": "S",
        "sourceIds": "S",
        "locators": "S",
        "device": "S",
        "eligibility": "S",
        "eligibility.all.*.fact": "I",
        "eligibility.all.*.op": "I",
        "eligibility.all.*.value": "I",
        "eligibility.all.3.reason": "I",
        "participants": "S",
        "participants.*.ref": "I",
        "steps": "S",
        "steps.*.id": "I",
        "steps.*.kind": "I",
        "steps.*.minutes": "I",
        "response": "S",
        "result.kind": "I",
        "result.stated": "S",
        "result.effects": "I",
        "limits": "T",
        "proposals": "I"
      },
      "proposals": [
        "Identifiers, participant references, step kinds and host fact bindings are authored proposals.",
        "Each step takes 1 minute as an authored pacing proposal; the passages give no duration.",
        "Spirit vision is required here to reproduce the observed scene, not asserted as necessary to summon.",
        "The messenger-mail effect is an integration request, not an executed delivery or a resource grant."
      ]
    },
    {
      "id": "lotm.summon.candle-self-summoning",
      "label": "Answer the candle self-summoning rite",
      "description": "Prepare the candle rite in a sealed room, then answer the linked call from above the grey fog. The early attempt fails; a later attempt forms a complete door.",
      "sourceIds": [
        "lotm.rite.self-summon",
        "lotm.rule.self-summon-ritual",
        "lotm.rite.end-self-summon",
        "lotm.rite.summoning-incantation-candle",
        "lotm.rite.summoning-door-attempt"
      ],
      "locators": [
        "zh 第152章 p2",
        "zh 第152章 p36",
        "zh 第181章 p1",
        "zh 第182章 p25"
      ],
      "device": "A candle representing the caller, spiritual sealing, ritual oils, hydrosol and herb powder, with an invocation begun in Giant and continued in Hermes; the responder touches the linked chair symbol above the grey fog.",
      "eligibility": {
        "all": [
          {
            "fact": "actor.lotm.summon.place.sealed-room",
            "op": "eq",
            "value": true,
            "reason": "Perform the candle rite in a spiritually sealed room."
          },
          {
            "fact": "actor.lotm.summon.held.candle",
            "op": "eq",
            "value": true,
            "reason": "Have a candle representing the caller, lit with spirituality."
          },
          {
            "fact": "actor.lotm.summon.held.ritual-ingredients",
            "op": "eq",
            "value": true,
            "reason": "Have the ritual oils, hydrosol and herb powder; quantities are not stated."
          },
          {
            "fact": "actor.lotm.summon.preparation.invocation",
            "op": "eq",
            "value": true,
            "reason": "Prepare the invocation in Giant and Hermes; no source sentences are reproduced here."
          },
          {
            "fact": "actor.lotm.summon.preparation.linked-symbol",
            "op": "eq",
            "value": true,
            "reason": "The lead can answer from above the grey fog through the linked chair symbol."
          },
          {
            "fact": "actor.lotm.summon.spirituality.door-readiness",
            "op": "gte",
            "value": 1,
            "reason": "Sufficient spirituality is needed for a complete door. The value 1 is an authored readiness marker, not a source numerical threshold or a general resource scale."
          }
        ]
      },
      "participants": [
        {
          "role": "caller",
          "ref": "lead-in-room",
          "note": "The lead performs the material-world rite."
        },
        {
          "role": "responder",
          "ref": "lead-above-grey-fog",
          "note": "The same lead answers from above the grey fog; these references do not create separate persistent actors."
        }
      ],
      "steps": [
        {
          "id": "prepare",
          "kind": "prepare",
          "label": "Prepare the sealed room and candle",
          "minutes": 1,
          "perceived": "You raise the spiritual wall, place and spiritually light the candle, and add the ritual ingredients."
        },
        {
          "id": "call",
          "kind": "call",
          "label": "Speak the invocation",
          "minutes": 1,
          "perceived": "You recite the prepared invocation in Giant and Hermes."
        },
        {
          "id": "response-flame",
          "kind": "response",
          "label": "Observe the candle response",
          "minutes": 1,
          "perceived": "The flame and scent form a spiritual vortex. In the early attempt the flame turns grey-white without an arrival."
        },
        {
          "id": "answer-symbol",
          "kind": "response",
          "label": "Answer through the linked symbol",
          "minutes": 1,
          "perceived": "Above the grey fog, you touch the linked chair symbol and hear the invocation again."
        },
        {
          "id": "door",
          "kind": "response",
          "label": "Focus on forming the door",
          "minutes": 1,
          "perceived": "Spiritual currents gather into a door. The early door stays incomplete and will not open, with painful spiritual depletion; the later door forms fully and you pass through."
        },
        {
          "id": "return",
          "kind": "outcome",
          "label": "End the summoned state by intention",
          "minutes": 1,
          "perceived": "On the later return, you intend to follow the connection back and arrive above the grey fog with the charm wrapped in your spirit body."
        }
      ],
      "response": {
        "entity": "The caller's own presence answering from above the grey fog",
        "perceived": "A vortex and grey-white flame at the candle, then a door seen by the responding lead; its early incomplete form cannot be opened, while the later complete form admits passage."
      },
      "result": {
        "kind": "attendance",
        "stated": "The later attempt brings the lead through the completed door. A later return carries a Sunflame charm inside his spirit body; this does not establish general object-carrying rules.",
        "effects": [
          {
            "type": "owner-needed",
            "owner": "summoned-attendance",
            "value": {
              "intent": "record-self-attendance",
              "callerRef": "lead-in-room",
              "responderRef": "lead-above-grey-fog"
            }
          },
          {
            "type": "owner-needed",
            "owner": "spirit-body-custody",
            "value": {
              "intent": "resolve-observed-charm-return",
              "objectRef": "sunflame-charm",
              "generalCarryRuleStated": false
            }
          }
        ]
      },
      "limits": [
        {
          "condition": "The early attempt has insufficient spirituality to form a complete door.",
          "outcome": "The incomplete door cannot open and no arrival occurs. The lead experiences painful depletion; no universal numerical threshold is stated.",
          "evidence": "S"
        }
      ],
      "evidence": {
        "id": "I",
        "label": "I",
        "description": "S",
        "sourceIds": "S",
        "locators": "S",
        "device": "S",
        "eligibility": "S",
        "eligibility.all.*.fact": "I",
        "eligibility.all.*.op": "I",
        "eligibility.all.*.value": "I",
        "participants": "S",
        "participants.*.ref": "I",
        "steps": "S",
        "steps.*.id": "I",
        "steps.*.kind": "I",
        "steps.*.minutes": "I",
        "steps.4.perceived": "T",
        "response": "S",
        "result.kind": "I",
        "result.stated": "S",
        "result.effects": "I",
        "limits.0.condition": "S",
        "limits.0.outcome": "T",
        "limits.0.evidence": "I",
        "proposals": "I"
      },
      "proposals": [
        "Identifiers, participant references, step kinds and host fact bindings are authored proposals.",
        "Each step takes 1 minute as an authored pacing proposal; no duration is stated.",
        "Door readiness >= 1 is an authored eligibility placeholder; no canonical numeric spirituality threshold is supplied.",
        "This row summarizes failed and successful occasions, rather than claiming both occur in every attempt.",
        "Effects name owners still needed for attendance and custody; no travel, consumption, save mutation or object grant is performed."
      ]
    }
  ]
};

// Required host facts, not starting inventory or grants of ability.
export const LOTM_SUMMONS_FACTS = [...new Set(
  LOTM_SUMMONS_ROWS.rows.flatMap(row => row.eligibility.all.map(rule => rule.fact))
)];

export const LOTM_SUMMONS_GAPS = [
  {
    "id": "lotm.rite.messenger-summon",
    "reason": "The personal-messenger ritual design, invocation and contract terms are not shown; the letter handoff does not establish delivery."
  },
  {
    "id": "lotm.rule.spirit-medium-contact",
    "reason": "The personal-messenger ritual design, invocation and contract terms are not shown; the letter handoff does not establish delivery."
  },
  {
    "id": "lotm.rite.star-summons",
    "reason": "The gathering call lacks a physical device, a precise call mechanism and stated limits."
  },
  {
    "id": "lotm.summon.gap.dispatch-arrival",
    "reason": "The whistle dispatches do not show where or when the letters arrive; no duration, spirituality cost or failure case is stated."
  },
  {
    "id": "lotm.summon.gap.ritual-quantities",
    "reason": "Ingredient quantities and a numerical spirituality threshold are unstated."
  },
  {
    "id": "lotm.summon.gap.general-object-carrying",
    "reason": "The observed charm return does not establish which objects can be carried generally."
  }
];
