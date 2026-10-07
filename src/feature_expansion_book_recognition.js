// Supplied-edition analytical rules. The host owns every body, source, item,
// right, observer memory, command and publication. These helpers mutate none.
const deepFreeze = value => {
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
        Object.values(value).forEach(deepFreeze);
        Object.freeze(value);
    }
    return value;
};

// Source-qualified immutable profiles are appended below by this worker.
export const BOOK_RECOGNITION_PROFILES = deepFreeze([
  {
    "id": "mother-of-learning",
    "title": "Mother of Learning",
    "source": {
      "edition": "Mother of Learning / nobody103, English WebToEpub compilation, metadata 2022-04-29",
      "sha256": "e53f95695730fd58b70c9676f03cd2ee457521c60210515cea38c1a514aa2fcf",
      "locatorConvention": "pN is the Nth XHTML p element in document order, including chapter-label p elements; nested emphasis stays in its paragraph. Non-p headings are represented by the navigation title.",
      "manifestSha256": "7382d752d308dd19cb114de924c49cec04e55c8b40d0e9319d06eedbd5d91378",
      "coverageSha256": "4fe9eb7c4a823d6f099f5b7302eb15a8b965d5e00fd0f9321a958f75b33219ea",
      "coveragePath": "docs/research/novels/full-book/mother-of-learning/coverage.json",
      "reviewedExtent": {
        "storyChapters": [
          [
            1,
            106
          ]
        ],
        "epilogue": true,
        "reviewedIntegratedStoryItems": 107
      },
      "verifiedSourceFileHash": true,
      "provenance": "Exact supplied compilation. Primary publication/translation authenticity and whole-series coverage are unverified."
    },
    "baselineImmutable": true,
    "nativeBound": false,
    "nativeWorldStatus": "unactivated-source-qualified-adapter",
    "era": {
      "id": "mol.cyoria.first-chariot.school",
      "place": "Cirin arrival and Cyoria academy district",
      "entry": "Proposed ordinary student/artisan visitor; optional impersonation is a separately authored branch, never an automatic loop entrant.",
      "branch": "Original participant intervention after an explicitly selected Chariot opening; no loop/reset activated."
    },
    "rules": [
      {
        "id": "mol.mana-key",
        "eraId": "mol.cyoria.first-chariot.school",
        "algorithm": "signature",
        "channel": "mana-key",
        "title": "A keyed implement checks personal mana, not a face",
        "evidence": [
          "MOL-C001-04",
          "MOL-C001-05"
        ],
        "findingScope": "this implement access condition",
        "alternative": "Ask Ilsa/the academy to verify eligibility or obtain a key honestly.",
        "demandedJoins": [
          "actual mana-key observation",
          "independent actual carriers",
          "player-known observer report"
        ],
        "requiredMethod": "channel-personal-mana"
      },
      {
        "id": "mol.local-memory",
        "eraId": "mol.cyoria.first-chariot.school",
        "algorithm": "memory",
        "channel": "remembered-encounter",
        "title": "A remembered answer belongs to one person and one history",
        "evidence": [
          "MOL-C005-01",
          "MOL-C012-01"
        ],
        "findingScope": "one observer remembered account",
        "alternative": "Explain the present encounter and let this observer build a new relationship.",
        "demandedJoins": [
          "actual remembered-encounter observation",
          "independent actual carriers",
          "player-known observer report"
        ]
      },
      {
        "id": "mol.physical-sound",
        "eraId": "mol.cyoria.first-chariot.school",
        "algorithm": "mechanism",
        "channel": "mechanism-observation",
        "title": "Illusion taxonomy does not determine the counter",
        "evidence": [
          "MOL-C018-07"
        ],
        "findingScope": "physical-sound versus mind-ward pair",
        "alternative": "Address the sound-producing mechanism or ask a specialist.",
        "demandedJoins": [
          "actual mechanism-observation observation",
          "independent actual carriers",
          "player-known observer report"
        ]
      }
    ],
    "replacementAndContinuity": {
      "disguise": "Appearance/alias can change a claim. It supplies no personal mana, keyed entitlement, completed class, licensed commerce or faculty.",
      "credential": "Certification, housing key, Academy verification and commercial badge are distinct. Xvim later verifies identity through the retained first-year mana signature; this requires the actual record/test and does not make every observer a soul examiner.",
      "memory": "Zorian demonstrates retained memories/control in a new pass. His counterpart’s memory and local records are not updated by his recall.",
      "bodySoul": "Simulacrum capture can target the wrong body. Zorian’s late interpretation of original-self replacement remains his private assessment, not an early NPC fact.",
      "sourceExceptions": [
        "MOL-C026-13",
        "MOL-C031-08",
        "MOL-C099-03",
        "MOL-C103-10",
        "MOL-C049-05"
      ],
      "carrierDisposition": "Actual actor/body/controller, source/mana, practiced mastery, memories, key/badge custody, academy rights and relationships remain separately owned. No actor death or replacement is performed by the adapter."
    },
    "selectedTropeChain": {
      "pattern": "An unknown student passes the visible introduction, meets a keyed/credential gate, then faces a teacher or familiar peer’s narrower account.",
      "people": [
        "mol.ilsa-zileti",
        "mol.zorian-kazinski",
        "mol.kirielle-kazinski"
      ],
      "subversions": [
        "Honest admission",
        "Ask for institutional verification",
        "Refuse bodily teaching and attend traditional lessons",
        "Cooperate without stealing another student’s place"
      ],
      "aftermath": "Only a committed local meeting can become this observer’s later remembered encounter; no new antagonist is generated.",
      "evidence": [
        "MOL-C001-04",
        "MOL-C001-05",
        "MOL-C003-05"
      ]
    },
    "smallInteractions": [
      {
        "detail": "The train’s shaping ward and crystallized engine fuel are separate; possessing an engine material does not remove a passenger casting restriction.",
        "evidence": [
          "MOL-C001-07",
          "MOL-C001-10"
        ],
        "nativeConsumerGap": "Native personal-mana source, train region/ward and implement carriers."
      },
      {
        "detail": "Animation dance teaching needs known steps and usable control; refusal has an ordinary lesson alternative.",
        "evidence": [
          "MOL-C003-05"
        ],
        "nativeConsumerGap": "Consent/lesson appointment and method/body-control commands."
      }
    ],
    "everydayTextureAndVoice": [
      {
        "original": true,
        "speaker": "Proposed unnamed academy desk assistant",
        "text": "Keep the key beside the scroll. It saves us both a second search.",
        "cue": "Housing keys, sealed certification and ordinary school administration.",
        "evidence": [
          "MOL-C001-04"
        ]
      },
      {
        "original": true,
        "speaker": "Proposed dance helper",
        "text": "The slow lesson is available. You still have to know where your feet go.",
        "cue": "Traditional sessions remain viable alongside uncomfortable bodily guidance.",
        "evidence": [
          "MOL-C003-05"
        ]
      }
    ],
    "stableSourcePeople": [
      "mol.zorian-kazinski",
      "mol.ilsa-zileti",
      "mol.kirielle-kazinski",
      "mol.kael",
      "mol.alanic"
    ],
    "unknowns": [
      "No native academy source/body/key/registry binding.",
      "No universally available soul-signature oracle. Source-backed Academy mana-signature verification remains bounded to its retained record and actual test.",
      "Early NPCs cannot know late loop-self/simulacrum explanations.",
      "Human bond domination is a library account, not a guaranteed transfer mechanism."
    ],
    "missingNativeBindings": [
      "native realm/era/location and entry",
      "actor/body/controller/soul owners",
      "actual source/fuel/method and native material custody",
      "per-observer testimony/belief and committed-history owner",
      "native command/UI and durable publication"
    ],
    "implementationStatus": "implemented-unverified; pure adapter; parent original-scene consumer required",
    "deferredGates": [
      "actual gameplay",
      "save/reload/failure",
      "keyboard/regression",
      "director acceptance"
    ],
    "topologyDisposition": {
      "settingContinuity": "Eldemar/Cyoria in the supplied Mother of Learning story, not an institutional mission hub.",
      "structures": [
        {
          "kind": "same-world-recurrence",
          "qualifiedFinding": "Zorian experiences a return to Chariot morning with retained memory/control; at the selected opening its mechanism, domain and trigger remain unknown.",
          "evidence": [
            "MOL-C005-01",
            "MOL-C005-08"
          ]
        },
        {
          "kind": "accelerated-pocket-copy-theory",
          "qualifiedFinding": "Ch54 characters propose a physically real copied snapshot rebuilt in an accelerated pocket dimension; this is explicitly an unproved theory at that disclosure.",
          "evidence": [
            "MOL-C054-02",
            "MOL-C058-03"
          ]
        },
        {
          "kind": "material-spiritual-plane-boundary",
          "qualifiedFinding": "The matriarch attributes absent interplane summoning to the loop. This report does not grant travel to every plane or source-backed return permission.",
          "evidence": [
            "MOL-C022-09"
          ]
        }
      ],
      "edges": [
        {
          "from": "Cirin",
          "to": "Cyoria",
          "kind": "ordinary train within one setting",
          "body": "ordinary traveler",
          "methods": "shaping inhibited on train",
          "cargo": "actual carried stock; no duplicate",
          "clock": "ordinary source journey, no imported exact global rate",
          "evidence": [
            "MOL-C001-07",
            "MOL-C001-10"
          ]
        },
        {
          "from": "remembered prior pass",
          "to": "new Chariot pass",
          "kind": "experienced recurrence, mechanism unknown at entry",
          "bodySoul": "no native retention operation selected",
          "memory": "Zorian’s tested memory/control",
          "cargo": "not authenticated by remembering it",
          "authority": "local institution does not inherit prior-pass appointments",
          "evidence": [
            "MOL-C005-01"
          ]
        }
      ],
      "activation": "No loop, copied realm, plane passage or offline catch-up is active. No shared Paradise-style mission issuer.",
      "nativeGaps": [
        "Exact selected-loop body/soul/memory/cargo retention",
        "Local versus outside clock and reset trigger",
        "Separate native academy and every destination’s retained state"
      ]
    },
    "deepChainDisposition": {
      "id": "recognition.mol.earned-admission",
      "family": "incomplete-method-to-earned-authority",
      "sourceVsOriginal": "Original branchable chain using academy/key/teaching source cues; it is not claimed to be a canonical quest.",
      "actors": [
        "mol.ilsa-zileti",
        "mol.zorian-kazinski",
        "mol.proposed-desk-assistant"
      ],
      "privateGoals": [
        "The academy wants verifiable eligibility and controlled person-targeting teaching.",
        "The entrant wants lawful access without impersonating another student."
      ],
      "phases": [
        {
          "id": "introduction",
          "prerequisite": "actual arrival and willing meeting",
          "means": "personal claim and held scroll/key",
          "evidence": [
            "MOL-C001-04"
          ],
          "choices": [
            "honest introduction",
            "ask about admission",
            "decline impersonation"
          ]
        },
        {
          "id": "gate",
          "prerequisite": "exact implement plus completed channel test",
          "means": "actual mana/control, bound key or academy verification",
          "evidence": [
            "MOL-C001-04",
            "MOL-C001-05"
          ],
          "choices": [
            "complete supported test",
            "request verification",
            "leave housing access pending"
          ]
        },
        {
          "id": "lesson",
          "prerequisite": "actual lesson offer and student choice",
          "means": "teacher control/known steps or ordinary sessions",
          "evidence": [
            "MOL-C003-05"
          ],
          "choices": [
            "consent to guided lesson",
            "choose traditional sessions",
            "postpone"
          ]
        },
        {
          "id": "account",
          "prerequisite": "later remembered local meeting",
          "means": "actual observer memory and compared answer, no transferred affection",
          "evidence": [
            "MOL-C005-01"
          ],
          "choices": [
            "clarify a mistaken claim",
            "offer corroboration",
            "keep unsupported prior-pass story private"
          ]
        },
        {
          "id": "closure",
          "prerequisite": "performed qualification or explicit refusal",
          "means": "native institution’s own actual decision and retained duties",
          "evidence": [
            "MOL-C001-05"
          ],
          "choices": [
            "lawful qualification",
            "ordinary study without badge",
            "refusal without new boss",
            "unsupported impersonation remains blocked"
          ]
        }
      ],
      "outcomes": {
        "lawful": "Earned only the verified local entitlement; methods/source/mastery still separate.",
        "refusal": "Ordinary lessons or leave remain available.",
        "partial": "Unverified key/credential leaves only that gate pending.",
        "hostile": "An attempted unauthorized claim prompts only the affected observer/institution’s actual response, not automatic murder or universal hostility."
      },
      "aftermath": "Keep the same teacher/witness and actually committed lessons. Retained duties/appointments require the native institution, not a regenerated reward.",
      "status": "source-qualified authoring disposition; native full-world chain unactivated",
      "callableRecognitionRules": [
        "mol.mana-key",
        "mol.local-memory",
        "mol.physical-sound"
      ],
      "nativeBindingsRequired": [
        "native realm/era/location and entry",
        "actor/body/controller/soul owners",
        "actual source/fuel/method and native material custody",
        "per-observer testimony/belief and committed-history owner",
        "native command/UI and durable publication"
      ],
      "clockPolicy": "No new clock. Native worlds remain unactivated; unsupported absence stays frozen under the eventual host policy."
    },
    "evidenceIndex": {
      "MOL-C001-04": {
        "claimId": "MOL-C001-04",
        "notesPath": "docs/research/novels/full-book/mother-of-learning/readers/001-005_NOTES.md",
        "locators": [
          {
            "chapter": 1,
            "member": "OEBPS/Text/0001_1_Good_Morning_Brother.xhtml",
            "memberSha256": "9f09317b745e62ee9cd5479cc0803ff510f44132c63f359bd8f490e0b9716923",
            "paragraphs": [
              65,
              80
            ]
          },
          {
            "chapter": 1,
            "member": "OEBPS/Text/0001_1_Good_Morning_Brother.xhtml",
            "memberSha256": "9f09317b745e62ee9cd5479cc0803ff510f44132c63f359bd8f490e0b9716923",
            "paragraphs": [
              83,
              86
            ]
          }
        ],
        "qualification": "W; Zorian",
        "sourceSha256": "e53f95695730fd58b70c9676f03cd2ee457521c60210515cea38c1a514aa2fcf"
      },
      "MOL-C001-05": {
        "claimId": "MOL-C001-05",
        "notesPath": "docs/research/novels/full-book/mother-of-learning/readers/001-005_NOTES.md",
        "locators": [
          {
            "chapter": 1,
            "member": "OEBPS/Text/0001_1_Good_Morning_Brother.xhtml",
            "memberSha256": "9f09317b745e62ee9cd5479cc0803ff510f44132c63f359bd8f490e0b9716923",
            "paragraphs": [
              81,
              100
            ]
          }
        ],
        "qualification": "C; Ilsa reports academy policy; Zorian reports student hearsay",
        "sourceSha256": "e53f95695730fd58b70c9676f03cd2ee457521c60210515cea38c1a514aa2fcf"
      },
      "MOL-C005-01": {
        "claimId": "MOL-C005-01",
        "notesPath": "docs/research/novels/full-book/mother-of-learning/readers/001-005_NOTES.md",
        "locators": [
          {
            "chapter": 5,
            "member": "OEBPS/Text/0005_5_Start_Over.xhtml",
            "memberSha256": "06762ccc93005d367e6827b5ea76033b6a876878acc029d170398451897483e0",
            "paragraphs": [
              2,
              29
            ]
          }
        ],
        "qualification": "W; Zorian’s experience",
        "sourceSha256": "e53f95695730fd58b70c9676f03cd2ee457521c60210515cea38c1a514aa2fcf"
      },
      "MOL-C012-01": {
        "claimId": "MOL-C012-01",
        "notesPath": "docs/research/novels/full-book/mother-of-learning/readers/006-020_NOTES.md",
        "locators": [
          {
            "chapter": 12,
            "member": "OEBPS/Text/0012_12_Soul_Web.xhtml",
            "memberSha256": "9248f7ee55d4aee7fee07e25a00f7050f82a2f44bb9dbebdf46bccf123211708",
            "paragraphs": [
              2,
              7
            ]
          }
        ],
        "qualification": "N/C; soul-bond danger and familiar asymmetry",
        "sourceSha256": "e53f95695730fd58b70c9676f03cd2ee457521c60210515cea38c1a514aa2fcf"
      },
      "MOL-C018-07": {
        "claimId": "MOL-C018-07",
        "notesPath": "docs/research/novels/full-book/mother-of-learning/readers/006-020_NOTES.md",
        "locators": [
          {
            "chapter": 18,
            "member": "OEBPS/Text/0018_18_The_Pact_is_Sealed.xhtml",
            "memberSha256": "6331b3c54798f5d47eaa3b76ecaa40dee50430227234fbcd1d6a9f011d3b071f",
            "paragraphs": [
              46,
              56
            ]
          }
        ],
        "qualification": "W/C; sound versus mental illusion",
        "sourceSha256": "e53f95695730fd58b70c9676f03cd2ee457521c60210515cea38c1a514aa2fcf"
      },
      "MOL-C026-13": {
        "claimId": "MOL-C026-13",
        "notesPath": "docs/research/novels/full-book/mother-of-learning/readers/021-035_NOTES.md",
        "locators": [
          {
            "chapter": 26,
            "member": "OEBPS/Text/0026_26_Soulkill.xhtml",
            "memberSha256": "a951d08b15800212bea04a662d71123d10f8cb1eb01263d2ee5ce0b7885aeab2",
            "paragraphs": [
              195,
              204
            ]
          }
        ],
        "qualification": "W; matriarch, Red Robe",
        "sourceSha256": "e53f95695730fd58b70c9676f03cd2ee457521c60210515cea38c1a514aa2fcf"
      },
      "MOL-C031-08": {
        "claimId": "MOL-C031-08",
        "notesPath": "docs/research/novels/full-book/mother-of-learning/readers/021-035_NOTES.md",
        "locators": [
          {
            "chapter": 31,
            "member": "OEBPS/Text/0031_31_Marked.xhtml",
            "memberSha256": "ccc1e2e3ff343e942a796868f3995df29008c9778803f68aeb4ff5e3fdba5801",
            "paragraphs": [
              141,
              160
            ]
          }
        ],
        "qualification": "W/C; Alanic, Zorian",
        "sourceSha256": "e53f95695730fd58b70c9676f03cd2ee457521c60210515cea38c1a514aa2fcf"
      },
      "MOL-C099-03": {
        "claimId": "MOL-C099-03",
        "notesPath": "docs/research/novels/full-book/mother-of-learning/readers/096-epilogue_NOTES.md",
        "locators": [
          {
            "chapter": 99,
            "member": "OEBPS/Text/0099_99_Powderkeg.xhtml",
            "memberSha256": "acfa2eb7bd8d05ffec2f02dc6f958ffb6a1722d0d64d766f525744c7eb7b18f6",
            "paragraphs": [
              86,
              93
            ]
          }
        ],
        "qualification": "N; underlying identity and moral uncertainty",
        "sourceSha256": "e53f95695730fd58b70c9676f03cd2ee457521c60210515cea38c1a514aa2fcf"
      },
      "MOL-C103-10": {
        "claimId": "MOL-C103-10",
        "notesPath": "docs/research/novels/full-book/mother-of-learning/readers/096-epilogue_NOTES.md",
        "locators": [
          {
            "chapter": 103,
            "member": "OEBPS/Text/0103_103_Window_of_Opportunity.xhtml",
            "memberSha256": "327d5665bc4ccddf08b2df2a0d8f5fe23d88a3eb8fdde796b0400a7d7cf13c5c",
            "paragraphs": [
              175,
              194
            ]
          }
        ],
        "qualification": "W; two Silverlakes",
        "sourceSha256": "e53f95695730fd58b70c9676f03cd2ee457521c60210515cea38c1a514aa2fcf"
      },
      "MOL-C003-05": {
        "claimId": "MOL-C003-05",
        "notesPath": "docs/research/novels/full-book/mother-of-learning/readers/001-005_NOTES.md",
        "locators": [
          {
            "chapter": 3,
            "member": "OEBPS/Text/0003_3_The_Bitter_Truth.xhtml",
            "memberSha256": "de97f51f0015aa044667335a9cdae700b2ad89f540522fb96b262a62359262ad",
            "paragraphs": [
              58,
              82
            ]
          },
          {
            "chapter": 3,
            "member": "OEBPS/Text/0003_3_The_Bitter_Truth.xhtml",
            "memberSha256": "de97f51f0015aa044667335a9cdae700b2ad89f540522fb96b262a62359262ad",
            "paragraphs": [
              96,
              100
            ]
          }
        ],
        "qualification": "W/C; Ilsa and Zorian",
        "sourceSha256": "e53f95695730fd58b70c9676f03cd2ee457521c60210515cea38c1a514aa2fcf"
      },
      "MOL-C001-07": {
        "claimId": "MOL-C001-07",
        "notesPath": "docs/research/novels/full-book/mother-of-learning/readers/001-005_NOTES.md",
        "locators": [
          {
            "chapter": 1,
            "member": "OEBPS/Text/0001_1_Good_Morning_Brother.xhtml",
            "memberSha256": "9f09317b745e62ee9cd5479cc0803ff510f44132c63f359bd8f490e0b9716923",
            "paragraphs": [
              114,
              114
            ]
          },
          {
            "chapter": 1,
            "member": "OEBPS/Text/0001_1_Good_Morning_Brother.xhtml",
            "memberSha256": "9f09317b745e62ee9cd5479cc0803ff510f44132c63f359bd8f490e0b9716923",
            "paragraphs": [
              129,
              134
            ]
          },
          {
            "chapter": 1,
            "member": "OEBPS/Text/0001_1_Good_Morning_Brother.xhtml",
            "memberSha256": "9f09317b745e62ee9cd5479cc0803ff510f44132c63f359bd8f490e0b9716923",
            "paragraphs": [
              155,
              156
            ]
          }
        ],
        "qualification": "N; transit and ambient constraints",
        "sourceSha256": "e53f95695730fd58b70c9676f03cd2ee457521c60210515cea38c1a514aa2fcf"
      },
      "MOL-C001-10": {
        "claimId": "MOL-C001-10",
        "notesPath": "docs/research/novels/full-book/mother-of-learning/readers/001-005_NOTES.md",
        "locators": [
          {
            "chapter": 1,
            "member": "OEBPS/Text/0001_1_Good_Morning_Brother.xhtml",
            "memberSha256": "9f09317b745e62ee9cd5479cc0803ff510f44132c63f359bd8f490e0b9716923",
            "paragraphs": [
              114,
              115
            ]
          }
        ],
        "qualification": "W; technology",
        "sourceSha256": "e53f95695730fd58b70c9676f03cd2ee457521c60210515cea38c1a514aa2fcf"
      },
      "MOL-C005-08": {
        "claimId": "MOL-C005-08",
        "notesPath": "docs/research/novels/full-book/mother-of-learning/readers/001-005_NOTES.md",
        "locators": [
          {
            "chapter": 5,
            "member": "OEBPS/Text/0005_5_Start_Over.xhtml",
            "memberSha256": "06762ccc93005d367e6827b5ea76033b6a876878acc029d170398451897483e0",
            "paragraphs": [
              157,
              166
            ]
          }
        ],
        "qualification": "W; second return; unresolved reset trigger",
        "sourceSha256": "e53f95695730fd58b70c9676f03cd2ee457521c60210515cea38c1a514aa2fcf"
      },
      "MOL-C054-02": {
        "claimId": "MOL-C054-02",
        "notesPath": "docs/research/novels/full-book/mother-of-learning/readers/051-065_NOTES.md",
        "locators": [
          {
            "chapter": 54,
            "member": "OEBPS/Text/0054_54_The_Gate_Is_Barred.xhtml",
            "memberSha256": "7a137befb5ba5b16d9ddc62b66bf9fb7dfdd5b3720763d55d3b6229f310078a3",
            "paragraphs": [
              32,
              60
            ]
          }
        ],
        "qualification": "C; Zorian’s theory and Zach’s response",
        "sourceSha256": "e53f95695730fd58b70c9676f03cd2ee457521c60210515cea38c1a514aa2fcf"
      },
      "MOL-C058-03": {
        "claimId": "MOL-C058-03",
        "notesPath": "docs/research/novels/full-book/mother-of-learning/readers/051-065_NOTES.md",
        "locators": [
          {
            "chapter": 58,
            "member": "OEBPS/Text/0058_58_Questions_and_Answers.xhtml",
            "memberSha256": "0a385f1789500bf681ff6175275c0a9520753878cb9832cac0df56ab93116110",
            "paragraphs": [
              59,
              77
            ]
          }
        ],
        "qualification": "W/C; full disclosure",
        "sourceSha256": "e53f95695730fd58b70c9676f03cd2ee457521c60210515cea38c1a514aa2fcf"
      },
      "MOL-C022-09": {
        "claimId": "MOL-C022-09",
        "notesPath": "docs/research/novels/full-book/mother-of-learning/readers/021-035_NOTES.md",
        "locators": [
          {
            "chapter": 22,
            "member": "OEBPS/Text/0022_22_Complications.xhtml",
            "memberSha256": "ca5c496c564293a4c5c027cdd087eaa54a1472a99f5f462cdbee3b43f75edca3",
            "paragraphs": [
              125,
              146
            ]
          }
        ],
        "qualification": "C/W; matriarch",
        "sourceSha256": "e53f95695730fd58b70c9676f03cd2ee457521c60210515cea38c1a514aa2fcf"
      },
      "MOL-C049-05": {
        "claimId": "MOL-C049-05",
        "notesPath": "docs/research/novels/full-book/mother-of-learning/readers/036-050_NOTES.md",
        "locators": [
          {
            "chapter": 49,
            "member": "OEBPS/Text/0049_49_Substitution.xhtml",
            "memberSha256": "32e1d8799d560185eb47cf5e618906a1f123f0908f2fbc7d9932ddb88bb6da78",
            "paragraphs": [
              81,
              109
            ]
          }
        ],
        "qualification": "W/C; Xvim verifies identity / time-loop evidence",
        "sourceSha256": "e53f95695730fd58b70c9676f03cd2ee457521c60210515cea38c1a514aa2fcf"
      }
    }
  },
  {
    "id": "lord-of-mysteries",
    "title": "Lord of the Mysteries · first novel",
    "source": {
      "edition": "Lord of the Mysteries, first novel / 爱潜水的乌贼, supplied Chinese EPUB, 1460 spine members",
      "sha256": "6126274478a95dbe03eb904bc35c409067c7022563e52997a46e98be07b2d70d",
      "locatorConvention": "Nonempty HTML p elements, 1-based; tolerant HTMLParser, inline text joined and stripped; br preserved as newline",
      "manifestSha256": "4264ffc7a51eeaad8cbf86f2a6b3fd4664f59a35904c10cb2a3b82ae34039b69",
      "coverageSha256": "8415e48aa675020b2a2aba7c1e2b1ba3c45370011505e2f1764ddd5a688d5a12",
      "coveragePath": "docs/research/novels/full-book/lord-of-mysteries/coverage.json",
      "reviewedExtent": {
        "memberSerialRanges": [
          [
            1,
            129
          ],
          [
            131,
            138
          ],
          [
            140,
            215
          ],
          [
            217,
            264
          ],
          [
            266,
            327
          ],
          [
            329,
            342
          ],
          [
            344,
            369
          ]
        ],
        "reviewedIntegratedStoryItems": 363,
        "narrativeBoundary": "All 213 Part One story entries and Part Two 1–150. Later reader returns are unreviewed for this adapter.",
        "allReaderReadStoryItems": 1402,
        "paratextExcludedFromStoryCredit": 47
      },
      "verifiedSourceFileHash": true,
      "provenance": "Exact supplied compilation. Primary publication/translation authenticity and whole-series coverage are unverified."
    },
    "baselineImmutable": true,
    "nativeBound": false,
    "nativeWorldStatus": "unactivated-source-qualified-adapter",
    "era": {
      "id": "lotm1.backlund.qilingos.reception",
      "place": "Backlund reception and its reporting aftermath",
      "entry": "Proposed ordinary visitor/investigator; native source eligibility must be acquired independently. Reincarnation-as-Klein is not selected.",
      "branch": "Original reception intervention before violence, using source-era knowledge; canonical future causes remain contingent."
    },
    "rules": [
      {
        "id": "lotm1.appearance",
        "eraId": "lotm1.backlund.qilingos.reception",
        "algorithm": "appearance",
        "channel": "appearance-observation",
        "title": "A copied baron’s appearance does not acquire the baron’s means",
        "evidence": [
          "R020-C21",
          "R020-C26",
          "R020-C27"
        ],
        "findingScope": "appearance consistency only",
        "alternative": "Attend honestly or report observed inconsistencies.",
        "demandedJoins": [
          "actual appearance-observation observation",
          "independent actual carriers",
          "player-known observer report"
        ]
      },
      {
        "id": "lotm1.behavior",
        "eraId": "lotm1.backlund.qilingos.reception",
        "algorithm": "behavior",
        "channel": "behavior-observation",
        "title": "Observed habits can support suspicion without an identity verdict",
        "evidence": [
          "R020-C22"
        ],
        "findingScope": "local suspicion",
        "alternative": "Warn using the concrete behavior you actually observed.",
        "demandedJoins": [
          "actual behavior-observation observation",
          "independent actual carriers",
          "player-known observer report"
        ]
      },
      {
        "id": "lotm1.office",
        "eraId": "lotm1.backlund.qilingos.reception",
        "algorithm": "registry",
        "channel": "institutional-registry",
        "title": "Public attribution and actual institutional entitlement differ",
        "evidence": [
          "R020-C21",
          "R021-C04"
        ],
        "findingScope": "supplied native institutional right",
        "alternative": "Ask the institution to appoint or verify the actual holder.",
        "demandedJoins": [
          "actual institutional-registry observation",
          "independent actual carriers",
          "player-known observer report"
        ]
      }
    ],
    "replacementAndContinuity": {
      "disguise": "Qilingos uses a disguise while the victim is unconscious; the source does not require killing as its activation trigger.",
      "credential": "A noble likeness and rehearsed accent/gesture may affect admission. Retinue/debts are social complications, not automatically copied powers.",
      "memory": "Zhou’s access to Klein knowledge is fragmentary. Family notices changed manners; it does not supply universal perfect autobiographical access.",
      "bodySoul": "The glove’s active stored soul offers limited faculties. Irreversibly replacing a stored slot is different from changing active mode, killing the victim, acquiring the victim’s whole life or becoming that person.",
      "sourceExceptions": [
        "R001-C01",
        "R001-C10",
        "R009-C25",
        "R020-C26",
        "R020-C27"
      ],
      "carrierDisposition": "Real baron and impersonator are distinct. Source victim death occurs after disguise in this baseline; the original prototype selects no canonical death. Gloves/retinue/debt/public bounty, native wind faculty and stored souls remain distinct owners."
    },
    "selectedTropeChain": {
      "pattern": "Invitation-only concealment → behavior discrepancy → ordinary warning → possible retreat, protection or inquiry → separately attributed public credit.",
      "people": [
        "lotm1.qilingos",
        "lotm1.audrey-hall",
        "lotm1.susie",
        "lotm1.audrey-father",
        "lotm1.real-baron"
      ],
      "subversions": [
        "Decline the invitation",
        "Warn without exposing private affiliation",
        "Withdraw instead of fighting superior means",
        "Let a rightful claimant claim credit"
      ],
      "aftermath": "A private lead does not pay a bounty. Proxy attribution, promised estate, available cash and later actual settlement remain separate.",
      "evidence": [
        "R014-C30",
        "R020-C22",
        "R021-C04"
      ]
    },
    "smallInteractions": [
      {
        "detail": "A disguise-only active soul supplies no combat function; switching leaves a real latency while native faculties remain independently usable.",
        "evidence": [
          "R020-C26",
          "R020-C27"
        ],
        "nativeConsumerGap": "Actual soul-storage item/mode/fuel/latency and combat source owners."
      },
      {
        "detail": "Gas light uses a paid coin meter; ordinary clerical shifts and archive study are work, not automatic occult mastery.",
        "evidence": [
          "R001-C05",
          "R003-C16"
        ],
        "nativeConsumerGap": "Native household meter, actual money and work/lesson owners."
      }
    ],
    "everydayTextureAndVoice": [
      {
        "original": true,
        "speaker": "Proposed household attendant",
        "text": "The lamp is behaving. The meter is the one asking for money.",
        "cue": "Coin-meter household lighting; original humor.",
        "evidence": [
          "R001-C05"
        ]
      },
      {
        "original": true,
        "speaker": "Proposed records clerk",
        "text": "Write what you saw first. Leave room for what you think it means.",
        "cue": "Evidence, clearance and ordinary reports distinct from private occult inference.",
        "evidence": [
          "R020-C22",
          "R003-C16"
        ]
      }
    ],
    "stableSourcePeople": [
      "lotm1.klein-moretti",
      "lotm1.zhou-mingrui",
      "lotm1.audrey-hall",
      "lotm1.qilingos",
      "lotm1.susie"
    ],
    "unknowns": [
      "No first-novel native body/pathway/glove/institution bindings.",
      "Faceless, later marionette and parasite rules outside the captured reviewed story extent are not inferred.",
      "The registry helper is an original analytical comparison; source does not establish a universal noble-office registry procedure.",
      "No generic costume grants native or stored-soul powers."
    ],
    "missingNativeBindings": [
      "native realm/era/location and entry",
      "actor/body/controller/soul owners",
      "actual source/fuel/method and native material custody",
      "per-observer testimony/belief and committed-history owner",
      "native command/UI and durable publication"
    ],
    "implementationStatus": "implemented-unverified; pure adapter; parent original-scene consumer required",
    "deferredGates": [
      "actual gameplay",
      "save/reload/failure",
      "keyboard/regression",
      "director acceptance"
    ],
    "topologyDisposition": {
      "settingContinuity": "First-novel physical cities/institutions. This is neither the COI sequel era nor a universal mission multiverse.",
      "structures": [
        {
          "kind": "gray-fog-space",
          "qualifiedFinding": "Repeated ritual access and represented carried pendulum are tested; the pendulum projection is not physical cargo relocation.",
          "evidence": [
            "R007-C32",
            "R008-C32"
          ]
        },
        {
          "kind": "spirit-world-distinction",
          "qualifiedFinding": "Klein himself distinguishes gray fog from the spirit world while declining an uncertain involuntary contact.",
          "evidence": [
            "R005-C02"
          ]
        },
        {
          "kind": "dream-and-information-contact",
          "qualifiedFinding": "Audrey receives a dream-like response and Alger later receives a message outside a ritual. A contact does not supply the petitioned source power.",
          "evidence": [
            "R008-C04",
            "R008-C05",
            "R008-C06"
          ]
        }
      ],
      "edges": [
        {
          "from": "physical carried item",
          "to": "gray-fog representation",
          "kind": "projection only",
          "body": "not a second physical body",
          "cargo": "one actual pendulum stays physically carried",
          "authority": "no new institutional right",
          "clock": "no universal rate authenticated",
          "evidence": [
            "R008-C32"
          ]
        },
        {
          "from": "gray-fog contact",
          "to": "recipient dream/perception",
          "kind": "bounded information",
          "source": "does not grant the fog power",
          "knowledge": "selected received message only",
          "evidence": [
            "R008-C04",
            "R008-C05",
            "R008-C06"
          ]
        }
      ],
      "activation": "No native gray-fog/physical-spirit journey or second copy of carried stock. Original relay comparison is not this setting.",
      "nativeGaps": [
        "Qualified physical-versus-represented body/item implementation",
        "Actor-specific rites/spirituality and risk",
        "Exact world/space clocks and native recipient/observation owners"
      ]
    },
    "deepChainDisposition": {
      "id": "recognition.lotm1.warning-and-credit",
      "family": "recognition-to-institutional-change",
      "sourceVsOriginal": "Original reception-response chain grounded in Qilingos/Audrey cues; canonical violent outcome is not forced after intervention.",
      "actors": [
        "lotm1.qilingos",
        "lotm1.audrey-hall",
        "lotm1.audrey-father",
        "lotm1.real-baron"
      ],
      "privateGoals": [
        "The impersonator pursues a specific target and promised reward.",
        "Audrey wants to protect her father without exposing her Tarot identity.",
        "Family/institution wants a useful warning and correct attribution."
      ],
      "phases": [
        {
          "id": "entry",
          "prerequisite": "invitation/actual entry and source means",
          "means": "costume or actual disguise faculty; independent native source retained",
          "evidence": [
            "R014-C30",
            "R020-C21"
          ],
          "choices": [
            "attend honestly",
            "decline",
            "present a bounded disguise claim"
          ]
        },
        {
          "id": "cue",
          "prerequisite": "real observing person and observed habits",
          "means": "actual behavioral comparison",
          "evidence": [
            "R020-C22"
          ],
          "choices": [
            "observe",
            "ask a narrow question",
            "leave identity unresolved"
          ]
        },
        {
          "id": "warning",
          "prerequisite": "specific cue communicated to father/responsible recipient",
          "means": "ordinary report, recipients’ independent resources and agency",
          "evidence": [
            "R020-C22"
          ],
          "choices": [
            "private warning",
            "public accusation with scrutiny",
            "protective withdrawal"
          ]
        },
        {
          "id": "claim",
          "prerequisite": "actual outcome and a delivered claim",
          "means": "witnesses/public intermediary/actual institution decision",
          "evidence": [
            "R021-C04"
          ],
          "choices": [
            "rightful credit",
            "proxy credit with consent",
            "refuse publicity",
            "challenge incorrect credit"
          ]
        },
        {
          "id": "settlement",
          "prerequisite": "actual cleared recipient/available stock",
          "means": "native funds/property ownership and once-only settlement",
          "evidence": [
            "R021-C04"
          ],
          "choices": [
            "settle verified claim",
            "negotiate privately",
            "keep merely promised payment pending"
          ]
        }
      ],
      "outcomes": {
        "lawful": "Warning and correct entitlement can settle without stolen powers.",
        "refusal": "Private safety/departure remains meaningful.",
        "partial": "A useful cue or promised bounty is not final identity proof or delivered payment.",
        "hostile": "Failed accusation or violence affects actual targets and witnesses; no endless stronger-relative chain."
      },
      "aftermath": "The real baron’s resolved life, actual funds, privacy agreement and recipient’s attribution persist; averted attack creates no replacement assassin by default.",
      "status": "source-qualified authoring disposition; native full-world chain unactivated",
      "callableRecognitionRules": [
        "lotm1.appearance",
        "lotm1.behavior",
        "lotm1.office"
      ],
      "nativeBindingsRequired": [
        "native realm/era/location and entry",
        "actor/body/controller/soul owners",
        "actual source/fuel/method and native material custody",
        "per-observer testimony/belief and committed-history owner",
        "native command/UI and durable publication"
      ],
      "clockPolicy": "No new clock. Native worlds remain unactivated; unsupported absence stays frozen under the eventual host policy."
    },
    "evidenceIndex": {
      "R020-C21": {
        "claimId": "R020-C21",
        "notesPath": "docs/research/novels/full-book/lord-of-mysteries/workers/r020/NOTES.md",
        "locators": [
          {
            "serial": 190,
            "member": "OEBPS/Text/lotm_c_0190.xhtml",
            "memberSha256": "7c4d2fab084fd28c871d85cc4e393009476643d9cc4e734baa91c88aabae3708",
            "paragraphs": [
              1,
              33
            ]
          }
        ],
        "qualification": "event/narrator/character report",
        "sourceSha256": "6126274478a95dbe03eb904bc35c409067c7022563e52997a46e98be07b2d70d"
      },
      "R020-C26": {
        "claimId": "R020-C26",
        "notesPath": "docs/research/novels/full-book/lord-of-mysteries/workers/r020/NOTES.md",
        "locators": [
          {
            "serial": 192,
            "member": "OEBPS/Text/lotm_c_0192.xhtml",
            "memberSha256": "8cc170baca5b7dd2e7b2642838097e27e38b340c68097853d797fce209b1bd2d",
            "paragraphs": [
              1,
              28
            ]
          }
        ],
        "qualification": "narrator/character explanation",
        "sourceSha256": "6126274478a95dbe03eb904bc35c409067c7022563e52997a46e98be07b2d70d"
      },
      "R020-C27": {
        "claimId": "R020-C27",
        "notesPath": "docs/research/novels/full-book/lord-of-mysteries/workers/r020/NOTES.md",
        "locators": [
          {
            "serial": 192,
            "member": "OEBPS/Text/lotm_c_0192.xhtml",
            "memberSha256": "8cc170baca5b7dd2e7b2642838097e27e38b340c68097853d797fce209b1bd2d",
            "paragraphs": [
              19,
              45
            ]
          }
        ],
        "qualification": "event/character assessment",
        "sourceSha256": "6126274478a95dbe03eb904bc35c409067c7022563e52997a46e98be07b2d70d"
      },
      "R020-C22": {
        "claimId": "R020-C22",
        "notesPath": "docs/research/novels/full-book/lord-of-mysteries/workers/r020/NOTES.md",
        "locators": [
          {
            "serial": 190,
            "member": "OEBPS/Text/lotm_c_0190.xhtml",
            "memberSha256": "7c4d2fab084fd28c871d85cc4e393009476643d9cc4e734baa91c88aabae3708",
            "paragraphs": [
              35,
              81
            ]
          }
        ],
        "qualification": "event/Audrey inference",
        "sourceSha256": "6126274478a95dbe03eb904bc35c409067c7022563e52997a46e98be07b2d70d"
      },
      "R021-C04": {
        "claimId": "R021-C04",
        "notesPath": "docs/research/novels/full-book/lord-of-mysteries/workers/r021/NOTES.md",
        "locators": [
          {
            "serial": 194,
            "member": "OEBPS/Text/lotm_c_0194.xhtml",
            "memberSha256": "cca1948a402a22ff6f3e20680d7ac42638ecdf12efd1d2c9dc288378ec1a678e",
            "paragraphs": [
              1,
              43
            ]
          }
        ],
        "qualification": "event/father promise/Audrey inference/narrator",
        "sourceSha256": "6126274478a95dbe03eb904bc35c409067c7022563e52997a46e98be07b2d70d"
      },
      "R001-C01": {
        "claimId": "R001-C01",
        "notesPath": "docs/research/novels/full-book/lord-of-mysteries/workers/r001/NOTES.md",
        "locators": [
          {
            "serial": 1,
            "member": "OEBPS/Text/lotm_c_0001.xhtml",
            "memberSha256": "44c9b0ac2fcda9215f44aa64b4d71d58fcb29ebacee73d53c33e4758c98bf55e",
            "paragraphs": [
              44,
              54
            ]
          }
        ],
        "qualification": "event/narrator",
        "sourceSha256": "6126274478a95dbe03eb904bc35c409067c7022563e52997a46e98be07b2d70d"
      },
      "R001-C10": {
        "claimId": "R001-C10",
        "notesPath": "docs/research/novels/full-book/lord-of-mysteries/workers/r001/NOTES.md",
        "locators": [
          {
            "serial": 3,
            "member": "OEBPS/Text/lotm_c_0003.xhtml",
            "memberSha256": "4427da65cc4e24b40b9047a6ed7238ac181ea96758e4e60c654e779262967996",
            "paragraphs": [
              2,
              8
            ]
          }
        ],
        "qualification": "narrator/character reflection",
        "sourceSha256": "6126274478a95dbe03eb904bc35c409067c7022563e52997a46e98be07b2d70d"
      },
      "R009-C25": {
        "claimId": "R009-C25",
        "notesPath": "docs/research/novels/full-book/lord-of-mysteries/workers/r009/NOTES.md",
        "locators": [
          {
            "serial": 84,
            "member": "OEBPS/Text/lotm_c_0084.xhtml",
            "memberSha256": "0ab8c73e3b070947aecb28444001c9b7fa18425bce4921ba5cd60840eb62d585",
            "paragraphs": [
              1,
              31
            ]
          }
        ],
        "qualification": "event; character reflection",
        "sourceSha256": "6126274478a95dbe03eb904bc35c409067c7022563e52997a46e98be07b2d70d"
      },
      "R014-C30": {
        "claimId": "R014-C30",
        "notesPath": "docs/research/novels/full-book/lord-of-mysteries/workers/r014/NOTES.md",
        "locators": [
          {
            "serial": 131,
            "member": "OEBPS/Text/lotm_c_0131.xhtml",
            "memberSha256": "86bf4cecc0900d6f372d2f5b74aaee3ccec50823e2344adfff1cc71af0572c26",
            "paragraphs": [
              57,
              96
            ]
          }
        ],
        "qualification": "event,dialogue",
        "sourceSha256": "6126274478a95dbe03eb904bc35c409067c7022563e52997a46e98be07b2d70d"
      },
      "R001-C05": {
        "claimId": "R001-C05",
        "notesPath": "docs/research/novels/full-book/lord-of-mysteries/workers/r001/NOTES.md",
        "locators": [
          {
            "serial": 2,
            "member": "OEBPS/Text/lotm_c_0002.xhtml",
            "memberSha256": "1d32222973ce47de2699b50bfa5911d10626fb0115a543283953404266791a2e",
            "paragraphs": [
              12,
              30
            ]
          }
        ],
        "qualification": "event/narrator",
        "sourceSha256": "6126274478a95dbe03eb904bc35c409067c7022563e52997a46e98be07b2d70d"
      },
      "R003-C16": {
        "claimId": "R003-C16",
        "notesPath": "docs/research/novels/full-book/lord-of-mysteries/workers/r003/NOTES.md",
        "locators": [
          {
            "serial": 19,
            "member": "OEBPS/Text/lotm_c_0019.xhtml",
            "memberSha256": "2e1ce69a183702d0552cb2cb69af851d43729acf9b94ea64988ea5b3e336681e",
            "paragraphs": [
              18,
              38
            ]
          }
        ],
        "qualification": "Dunn report",
        "sourceSha256": "6126274478a95dbe03eb904bc35c409067c7022563e52997a46e98be07b2d70d"
      },
      "R007-C32": {
        "claimId": "R007-C32",
        "notesPath": "docs/research/novels/full-book/lord-of-mysteries/workers/r007/NOTES.md",
        "locators": [
          {
            "serial": 58,
            "member": "OEBPS/Text/lotm_c_0058.xhtml",
            "memberSha256": "48770340f893f677eaa4c9b065884a5df0bca0e08e78a9bbecf328e45ab8b1b3",
            "paragraphs": [
              46,
              55
            ]
          }
        ],
        "qualification": "narrator/event",
        "sourceSha256": "6126274478a95dbe03eb904bc35c409067c7022563e52997a46e98be07b2d70d"
      },
      "R008-C32": {
        "claimId": "R008-C32",
        "notesPath": "docs/research/novels/full-book/lord-of-mysteries/workers/r008/NOTES.md",
        "locators": [
          {
            "serial": 75,
            "member": "OEBPS/Text/lotm_c_0075.xhtml",
            "memberSha256": "910f951c65736d3ac54bb50f0dfab5f3aacc781f89b6cdc57e0bda5b3d736aba",
            "paragraphs": [
              34,
              48
            ]
          }
        ],
        "qualification": "event; Klein observed generalization",
        "sourceSha256": "6126274478a95dbe03eb904bc35c409067c7022563e52997a46e98be07b2d70d"
      },
      "R005-C02": {
        "claimId": "R005-C02",
        "notesPath": "docs/research/novels/full-book/lord-of-mysteries/workers/r005/NOTES.md",
        "locators": [
          {
            "serial": 36,
            "member": "OEBPS/Text/lotm_c_0036.xhtml",
            "memberSha256": "d0e57834ed01843f6c35ea3304028bc43eced0af82045a9d10d64c9b08f9abd6",
            "paragraphs": [
              45,
              67
            ]
          }
        ],
        "qualification": "Klein inference and self-report",
        "sourceSha256": "6126274478a95dbe03eb904bc35c409067c7022563e52997a46e98be07b2d70d"
      },
      "R008-C04": {
        "claimId": "R008-C04",
        "notesPath": "docs/research/novels/full-book/lord-of-mysteries/workers/r008/NOTES.md",
        "locators": [
          {
            "serial": 67,
            "member": "OEBPS/Text/lotm_c_0067.xhtml",
            "memberSha256": "22f8478848341637fd240d12b34f0b2427fa0e87042f4af866fe7902a5afd212",
            "paragraphs": [
              6,
              36
            ]
          }
        ],
        "qualification": "event/narrator",
        "sourceSha256": "6126274478a95dbe03eb904bc35c409067c7022563e52997a46e98be07b2d70d"
      },
      "R008-C05": {
        "claimId": "R008-C05",
        "notesPath": "docs/research/novels/full-book/lord-of-mysteries/workers/r008/NOTES.md",
        "locators": [
          {
            "serial": 67,
            "member": "OEBPS/Text/lotm_c_0067.xhtml",
            "memberSha256": "22f8478848341637fd240d12b34f0b2427fa0e87042f4af866fe7902a5afd212",
            "paragraphs": [
              56,
              63
            ]
          }
        ],
        "qualification": "character experiment and inference",
        "sourceSha256": "6126274478a95dbe03eb904bc35c409067c7022563e52997a46e98be07b2d70d"
      },
      "R008-C06": {
        "claimId": "R008-C06",
        "notesPath": "docs/research/novels/full-book/lord-of-mysteries/workers/r008/NOTES.md",
        "locators": [
          {
            "serial": 67,
            "member": "OEBPS/Text/lotm_c_0067.xhtml",
            "memberSha256": "22f8478848341637fd240d12b34f0b2427fa0e87042f4af866fe7902a5afd212",
            "paragraphs": [
              64,
              88
            ]
          }
        ],
        "qualification": "event; character interpretation",
        "sourceSha256": "6126274478a95dbe03eb904bc35c409067c7022563e52997a46e98be07b2d70d"
      }
    }
  },
  {
    "id": "circle-of-inevitability",
    "title": "Circle of Inevitability · separate sequel era",
    "source": {
      "edition": "Circle of Inevitability, separate sequel / supplied English Light Novel World compilation, creator unknown",
      "sha256": "e7d156a15f97b207c141a347a4e048e0db176a7ee3cd9bd3be49d5963621805f",
      "locatorConvention": "zero-based EPUB spine_index; printed chapters are separate and have a gap; paragraph locators to be defined by GM",
      "manifestSha256": "02e538ab3a232bff2752f5b6fa0a346b557c1a78b12eb581add8a145307ab0bf",
      "coverageSha256": "12dad059d38270667aa76581e788081fc7f11ea8f018d351c5a23bb09846a915",
      "coveragePath": "docs/research/novels/full-book/circle-of-inevitability/COVERAGE.json",
      "reviewedExtent": {
        "spineIndexRanges": [
          [
            1,
            1170
          ]
        ],
        "reviewedIntegratedStoryItems": 1170,
        "sourceBoundary": "1178 narrative members plus supplied afterword; printed chapter 1026 is absent. No missing text reconstructed."
      },
      "verifiedSourceFileHash": true,
      "provenance": "Exact supplied compilation. Primary publication/translation authenticity and whole-series coverage are unverified."
    },
    "baselineImmutable": true,
    "nativeBound": false,
    "nativeWorldStatus": "unactivated-source-qualified-adapter",
    "era": {
      "id": "coi.trier.market.society-review",
      "place": "Trier market district, asylum identity check and Research Society gathering",
      "entry": "Proposed ordinary newcomer/collaborator; appearance tools, boons and potion/body changes require their actual carriers. No inherited first-novel player state.",
      "branch": "Original local investigation branch after stated market-district entry. Earlier Cordu disclosures are attributed history, not every observer’s knowledge."
    },
    "rules": [
      {
        "id": "coi.sincerity",
        "eraId": "coi.trier.market.society-review",
        "algorithm": "sincerity",
        "channel": "truth-serum-test",
        "title": "Sincere identity belief is not authenticated identity",
        "evidence": [
          "r030-c17"
        ],
        "findingScope": "reported statement sincerity",
        "alternative": "Seek independent corroboration or a qualified specialist.",
        "demandedJoins": [
          "actual truth-serum-test observation",
          "independent actual carriers",
          "player-known observer report"
        ],
        "requiredMethod": "truth-serum"
      },
      {
        "id": "coi.office",
        "eraId": "coi.trier.market.society-review",
        "algorithm": "registry",
        "channel": "institutional-registry",
        "title": "Impersonating Muggle does not grant her committee place",
        "evidence": [
          "r030-c31",
          "r030-c34"
        ],
        "findingScope": "supplied native institutional right",
        "alternative": "Seek a seat or appointment in your own name.",
        "demandedJoins": [
          "actual institutional-registry observation",
          "independent actual carriers",
          "player-known observer report"
        ]
      },
      {
        "id": "coi.appearance",
        "eraId": "coi.trier.market.society-review",
        "algorithm": "appearance",
        "channel": "appearance-observation",
        "title": "An appearance change does not defeat every tracking channel",
        "evidence": [
          "r028-c35",
          "r029-c03"
        ],
        "findingScope": "appearance consistency only",
        "alternative": "Investigate the tracking method or relocate with informed help.",
        "demandedJoins": [
          "actual appearance-observation observation",
          "independent actual carriers",
          "player-known observer report"
        ]
      }
    ],
    "replacementAndContinuity": {
      "disguise": "Lumian uses Lie to present as Muggle. The displayed identity and actual participant are separate; he declines the committee seat while impersonating her.",
      "credential": "Society membership, chosen committee office, testimony and prepared contracts are distinct. No copied face signs a contract or grants a seat automatically.",
      "memory": "A proxy can sincerely believe a hypnotically supplied identity. Truth serum cannot by itself distinguish that proxy from the actual person.",
      "bodySoul": "Potion-linked bodily transformation, Lie appearance, soul/heart-and-mind/physical layers and borrowed identity are separate. Aurore’s Pualis/Pulitt inference is not proven by bodily change.",
      "sourceExceptions": [
        "r004-c17",
        "r006-c08",
        "r028-c35",
        "r029-c03",
        "r030-c17"
      ],
      "carrierDisposition": "Lumian, Aurore/Roche, Franca, the captured person and any hypothetical proxy remain separately identified. No later resurrection/death or possession is committed by this adapter."
    },
    "selectedTropeChain": {
      "pattern": "Impersonation to raise a traitor warning → safety hearing and corroboration → offer of authority → voluntary refusal → guarded cooperation.",
      "people": [
        "coi.lumian-lee",
        "coi.aurore-roche",
        "coi.franca",
        "coi.hela",
        "coi.professor",
        "coi.gandalf",
        "coi.magician"
      ],
      "subversions": [
        "Attend under one’s own name",
        "Decline the stolen office",
        "Use ordinary corroboration",
        "Withdraw/relocate before a trap",
        "Leave an unidentified mechanism unresolved"
      ],
      "aftermath": "Reported information goes only to recipients who heard it. Prepared committee contracts are not treated as already signed; public disguise does not rewrite the actual actor.",
      "evidence": [
        "r030-c17",
        "r030-c31",
        "r030-c34"
      ]
    },
    "smallInteractions": [
      {
        "detail": "The arrow, sedation, actual sheepskin, incantation, transformed body, bandaging and transfer to Jenna occur in a specific order; knowing the trick supplies none of those materials.",
        "evidence": [
          "r030-c17",
          "r030-c18"
        ],
        "nativeConsumerGap": "Native captive/controller, injury/care, material custody and method commands."
      },
      {
        "detail": "A stronger astral cue is a bounded observation, not a precise soul diagnosis. Anti-tracking hypotheses remain competing explanations.",
        "evidence": [
          "r004-c17",
          "r028-c35",
          "r029-c03"
        ],
        "nativeConsumerGap": "Native faculty/source/actual observation and attributed theory owners."
      }
    ],
    "everydayTextureAndVoice": [
      {
        "original": true,
        "speaker": "Proposed Cordu tavern keeper, separate early-era texture",
        "text": "Tell the short version while I find the glasses. The long one can wait for the table.",
        "cue": "Local yarns, visitors and uneven city fashions; original incidental person.",
        "evidence": [
          "q001-c01",
          "q001-c02"
        ]
      },
      {
        "original": true,
        "speaker": "Proposed society attendee",
        "text": "You can warn us without taking the chair. Someone still has to keep the minutes.",
        "cue": "Committee refusal, privacy and ordinary work during the hearing.",
        "evidence": [
          "r030-c34"
        ]
      }
    ],
    "stableSourcePeople": [
      "coi.lumian-lee",
      "coi.aurore-roche",
      "coi.franca",
      "coi.jenna",
      "coi.hela",
      "coi.magician"
    ],
    "unknowns": [
      "Separate sequel edition, people/era and active rules; no first-novel automatic loadout.",
      "Magician’s detailed identity test mechanism is unspecified.",
      "Seal/aura tracking is attributed attacker speech or participant inference, not a universal soul radar.",
      "The native registry comparison procedure is original, not claimed canonical institutional machinery.",
      "Remaining supplied source beyond captured accepted extent is not promoted here."
    ],
    "missingNativeBindings": [
      "native realm/era/location and entry",
      "actor/body/controller/soul owners",
      "actual source/fuel/method and native material custody",
      "per-observer testimony/belief and committed-history owner",
      "native command/UI and durable publication"
    ],
    "implementationStatus": "implemented-unverified; pure adapter; parent original-scene consumer required",
    "deferredGates": [
      "actual gameplay",
      "save/reload/failure",
      "keyboard/regression",
      "director acceptance"
    ],
    "topologyDisposition": {
      "settingContinuity": "Separate sequel continuity/era. Trier and Cordu are places, not interchangeable mission instances.",
      "structures": [
        {
          "kind": "dream-versus-waking-inventory",
          "qualifiedFinding": "Lumian’s dream coin is absent after waking. This is one tested carried item, not proof every method/material has the same boundary.",
          "evidence": [
            "r002-c05"
          ]
        },
        {
          "kind": "dream-loop-account",
          "qualifiedFinding": "Investigators’ self-awareness/wish-trigger explanation and experience/fiction composition remain attributed hypotheses.",
          "evidence": [
            "r009-c04"
          ]
        },
        {
          "kind": "symbolic-mental-space",
          "qualifiedFinding": "Lumian’s dream and Susie’s interpretation are distinguished from literal external historical discovery.",
          "evidence": [
            "r010-c30"
          ]
        },
        {
          "kind": "fragmented-dream-setting",
          "qualifiedFinding": "Lumian infers separated dream fragments; Amandina’s crossing report and his private Cordu figures are not omniscient knowledge for the whole team.",
          "evidence": [
            "r050-c687-01"
          ]
        }
      ],
      "edges": [
        {
          "from": "dream ruin",
          "to": "waking Lumian",
          "kind": "wake/experience",
          "memory": "subjective account can be described",
          "cargo": "the tested coin is absent",
          "knowledge": "not shared with everyone by default",
          "source": "no free boon, soul or potion copy",
          "evidence": [
            "r002-c05"
          ]
        },
        {
          "from": "one apparent dream fragment",
          "to": "another",
          "kind": "reported/perceived fragment passage",
          "body": "exact general passage carrier unresolved",
          "authority": "not a hub-issued mission",
          "clock": "no universal rate selected",
          "evidence": [
            "r050-c687-01"
          ]
        }
      ],
      "activation": "No automatic sequel loadout, dream cargo exporter, infinite dream city or generic reset. Later-source cues are author-facing, unavailable to an earlier player.",
      "nativeGaps": [
        "Selected exact dream/mental scene and actor/source cutoff",
        "Independent waking/dream inventory and observation carriers",
        "Boundary condition, clocks and retained residents/actual aftereffects"
      ]
    },
    "deepChainDisposition": {
      "id": "recognition.coi.hearing-without-stolen-chair",
      "family": "recognition-to-institutional-change",
      "sourceVsOriginal": "Original society-hearing chain using reviewed sequel cues; first-novel bodies and roles do not enter by default.",
      "actors": [
        "coi.lumian-lee",
        "coi.franca",
        "coi.hela",
        "coi.magician",
        "coi.gandalf",
        "coi.proposed-recorder"
      ],
      "privateGoals": [
        "Lumian seeks truth and safety without acquiring Aurore’s chair by impersonation.",
        "The society needs trustworthy evidence while members retain privacy."
      ],
      "phases": [
        {
          "id": "testimony",
          "prerequisite": "actual captive/test and delivered testimony",
          "means": "completed truth-serum result; sincerity versus actual identity separate",
          "evidence": [
            "r030-c17"
          ],
          "choices": [
            "corroborate",
            "retain provisional identity",
            "refuse unsupported verdict"
          ]
        },
        {
          "id": "corroboration",
          "prerequisite": "willing qualified helper or ordinary independent lead",
          "means": "specific supplied specialist report; opaque mechanism remains unknown",
          "evidence": [
            "r030-c17"
          ],
          "choices": [
            "request help",
            "wait",
            "use ordinary witness evidence"
          ]
        },
        {
          "id": "hearing",
          "prerequisite": "actual meeting and reported evidence",
          "means": "held Lie item for source disguise, actual participant and received facts",
          "evidence": [
            "r030-c31"
          ],
          "choices": [
            "speak under own identity",
            "make bounded warning",
            "leave"
          ]
        },
        {
          "id": "office",
          "prerequisite": "committee offer/vote",
          "means": "actual appointment remains distinct from face/claimed Muggle",
          "evidence": [
            "r030-c34"
          ],
          "choices": [
            "decline borrowed chair",
            "seek own appointment",
            "contest entitlement with scrutiny"
          ]
        },
        {
          "id": "safety",
          "prerequisite": "members agree to a supported action",
          "means": "independent relocation, written terms and actual signature only when performed",
          "evidence": [
            "r030-c34",
            "r028-c35"
          ],
          "choices": [
            "cooperate",
            "retain privacy",
            "relocate",
            "do not claim a draft is signed"
          ]
        }
      ],
      "outcomes": {
        "lawful": "Evidence-driven hearing and legitimate appointment/decline.",
        "refusal": "No forced chair or continuing disguise.",
        "partial": "Identity/test mechanism or unsigned terms remain pending.",
        "hostile": "Actual traitor/exposure response needs identified actors and evidence; attacker speech does not reveal every hidden member."
      },
      "aftermath": "Shared evidence reaches only actual recipients. Declined chair, actual contract signing and relocation persist under each native owner.",
      "status": "source-qualified authoring disposition; native full-world chain unactivated",
      "callableRecognitionRules": [
        "coi.sincerity",
        "coi.office",
        "coi.appearance"
      ],
      "nativeBindingsRequired": [
        "native realm/era/location and entry",
        "actor/body/controller/soul owners",
        "actual source/fuel/method and native material custody",
        "per-observer testimony/belief and committed-history owner",
        "native command/UI and durable publication"
      ],
      "clockPolicy": "No new clock. Native worlds remain unactivated; unsupported absence stays frozen under the eventual host policy."
    },
    "evidenceIndex": {
      "r030-c17": {
        "claimId": "r030-c17",
        "notesPath": "docs/research/novels/full-book/circle-of-inevitability/workers/r030/NOTES.md",
        "locators": [
          {
            "spineIndex": 406,
            "member": "OEBPS/Text/0406_406_Inevitability-like_Ending.xhtml",
            "memberSha256": "c8593c530d512b241d2697fcb5eb5c9a6c36d692b895f6791537f27b629e43e3",
            "paragraphs": [
              1,
              28
            ]
          }
        ],
        "qualification": "witnessed",
        "sourceSha256": "e7d156a15f97b207c141a347a4e048e0db176a7ee3cd9bd3be49d5963621805f"
      },
      "r030-c31": {
        "claimId": "r030-c31",
        "notesPath": "docs/research/novels/full-book/circle-of-inevitability/workers/r030/NOTES.md",
        "locators": [
          {
            "spineIndex": 410,
            "member": "OEBPS/Text/0410_410_A_Leisure_Week.xhtml",
            "memberSha256": "1a609a0056d9f98c203cfd7333a90192e6faa87d891908355130735855d780ad",
            "paragraphs": [
              54,
              78
            ]
          }
        ],
        "qualification": "witnessed",
        "sourceSha256": "e7d156a15f97b207c141a347a4e048e0db176a7ee3cd9bd3be49d5963621805f"
      },
      "r030-c34": {
        "claimId": "r030-c34",
        "notesPath": "docs/research/novels/full-book/circle-of-inevitability/workers/r030/NOTES.md",
        "locators": [
          {
            "spineIndex": 411,
            "member": "OEBPS/Text/0411_411_Review_Committee.xhtml",
            "memberSha256": "a212c54c2b6c8691b1e3c3fd0985d7154667fc701547fde96e12dab6ea4fb055",
            "paragraphs": [
              34,
              58
            ]
          }
        ],
        "qualification": "witnessed",
        "sourceSha256": "e7d156a15f97b207c141a347a4e048e0db176a7ee3cd9bd3be49d5963621805f"
      },
      "r028-c35": {
        "claimId": "r028-c35",
        "notesPath": "docs/research/novels/full-book/circle-of-inevitability/workers/r028/NOTES.md",
        "locators": [
          {
            "spineIndex": 385,
            "member": "OEBPS/Text/0385_385_Before_and_After_Comparison.xhtml",
            "memberSha256": "d8442d2f04117c0d07654c2486649908b8ee8a34a9ef50a9ec1956fccde856d8",
            "paragraphs": [
              41,
              64
            ]
          }
        ],
        "qualification": "actor_inference",
        "sourceSha256": "e7d156a15f97b207c141a347a4e048e0db176a7ee3cd9bd3be49d5963621805f"
      },
      "r029-c03": {
        "claimId": "r029-c03",
        "notesPath": "docs/research/novels/full-book/circle-of-inevitability/workers/r029/NOTES.md",
        "locators": [
          {
            "spineIndex": 387,
            "member": "OEBPS/Text/0387_387_Vile.xhtml",
            "memberSha256": "6b861813bb18ca1c953772e5d39397eca75893c063686e6a21821a5f3437130d",
            "paragraphs": [
              35,
              50
            ]
          }
        ],
        "qualification": "character_claim",
        "sourceSha256": "e7d156a15f97b207c141a347a4e048e0db176a7ee3cd9bd3be49d5963621805f"
      },
      "r004-c17": {
        "claimId": "r004-c17",
        "notesPath": "docs/research/novels/full-book/circle-of-inevitability/workers/r004/NOTES.md",
        "locators": [
          {
            "spineIndex": 45,
            "member": "OEBPS/Text/0045_45_Make-up_Lesson.xhtml",
            "memberSha256": "4557df08158a909d8ebb6ebf80c86a0b671d0a0711e22a852d6ab0051465fa38",
            "paragraphs": [
              8,
              34
            ]
          }
        ],
        "qualification": "character_claim",
        "sourceSha256": "e7d156a15f97b207c141a347a4e048e0db176a7ee3cd9bd3be49d5963621805f"
      },
      "r006-c08": {
        "claimId": "r006-c08",
        "notesPath": "docs/research/novels/full-book/circle-of-inevitability/workers/r006/NOTES.md",
        "locators": [
          {
            "spineIndex": 69,
            "member": "OEBPS/Text/0069_69_Him.xhtml",
            "memberSha256": "bd967144de25efc4530cf6f2ad9605b5f83953511b1c3eed19f940ebaaf2b2ae",
            "paragraphs": [
              15,
              50
            ]
          }
        ],
        "qualification": "actor_inference",
        "sourceSha256": "e7d156a15f97b207c141a347a4e048e0db176a7ee3cd9bd3be49d5963621805f"
      },
      "r030-c18": {
        "claimId": "r030-c18",
        "notesPath": "docs/research/novels/full-book/circle-of-inevitability/workers/r030/NOTES.md",
        "locators": [
          {
            "spineIndex": 406,
            "member": "OEBPS/Text/0406_406_Inevitability-like_Ending.xhtml",
            "memberSha256": "c8593c530d512b241d2697fcb5eb5c9a6c36d692b895f6791537f27b629e43e3",
            "paragraphs": [
              31,
              60
            ]
          }
        ],
        "qualification": "witnessed",
        "sourceSha256": "e7d156a15f97b207c141a347a4e048e0db176a7ee3cd9bd3be49d5963621805f"
      },
      "q001-c01": {
        "claimId": "q001-c01",
        "notesPath": "docs/research/novels/full-book/circle-of-inevitability/workers/q001/NOTES.md",
        "locators": [
          {
            "spineIndex": 1,
            "member": "OEBPS/Text/0001_1_Foreigners.xhtml",
            "memberSha256": "846f85af6aba1e14c4dfd7058eca650835f11676a5d42a7020086d1d0c2dc7d0",
            "paragraphs": [
              33,
              40
            ]
          },
          {
            "spineIndex": 1,
            "member": "OEBPS/Text/0001_1_Foreigners.xhtml",
            "memberSha256": "846f85af6aba1e14c4dfd7058eca650835f11676a5d42a7020086d1d0c2dc7d0",
            "paragraphs": [
              91,
              98
            ]
          }
        ],
        "qualification": "character_claim",
        "sourceSha256": "e7d156a15f97b207c141a347a4e048e0db176a7ee3cd9bd3be49d5963621805f"
      },
      "q001-c02": {
        "claimId": "q001-c02",
        "notesPath": "docs/research/novels/full-book/circle-of-inevitability/workers/q001/NOTES.md",
        "locators": [
          {
            "spineIndex": 1,
            "member": "OEBPS/Text/0001_1_Foreigners.xhtml",
            "memberSha256": "846f85af6aba1e14c4dfd7058eca650835f11676a5d42a7020086d1d0c2dc7d0",
            "paragraphs": [
              37,
              56
            ]
          },
          {
            "spineIndex": 1,
            "member": "OEBPS/Text/0001_1_Foreigners.xhtml",
            "memberSha256": "846f85af6aba1e14c4dfd7058eca650835f11676a5d42a7020086d1d0c2dc7d0",
            "paragraphs": [
              63,
              79
            ]
          }
        ],
        "qualification": "narrator_explicit",
        "sourceSha256": "e7d156a15f97b207c141a347a4e048e0db176a7ee3cd9bd3be49d5963621805f"
      },
      "r002-c05": {
        "claimId": "r002-c05",
        "notesPath": "docs/research/novels/full-book/circle-of-inevitability/workers/r002/NOTES.md",
        "locators": [
          {
            "spineIndex": 10,
            "member": "OEBPS/Text/0010_10_Blood.xhtml",
            "memberSha256": "e3bbc665332e40b398510a6d38dd3aef9b7c581223b7048037c375a1c5a9cb45",
            "paragraphs": [
              8,
              29
            ]
          },
          {
            "spineIndex": 10,
            "member": "OEBPS/Text/0010_10_Blood.xhtml",
            "memberSha256": "e3bbc665332e40b398510a6d38dd3aef9b7c581223b7048037c375a1c5a9cb45",
            "paragraphs": [
              97,
              101
            ]
          }
        ],
        "qualification": "narrator_explicit",
        "sourceSha256": "e7d156a15f97b207c141a347a4e048e0db176a7ee3cd9bd3be49d5963621805f"
      },
      "r009-c04": {
        "claimId": "r009-c04",
        "notesPath": "docs/research/novels/full-book/circle-of-inevitability/workers/r009/NOTES.md",
        "locators": [
          {
            "spineIndex": 108,
            "member": "OEBPS/Text/0108_108_Report.xhtml",
            "memberSha256": "8abdbbfc0b572307d23354b4f6149fd9581dfc5bbfe7869be7adf94bbf8278cb",
            "paragraphs": [
              24,
              27
            ]
          },
          {
            "spineIndex": 108,
            "member": "OEBPS/Text/0108_108_Report.xhtml",
            "memberSha256": "8abdbbfc0b572307d23354b4f6149fd9581dfc5bbfe7869be7adf94bbf8278cb",
            "paragraphs": [
              34,
              47
            ]
          }
        ],
        "qualification": "character_claim",
        "sourceSha256": "e7d156a15f97b207c141a347a4e048e0db176a7ee3cd9bd3be49d5963621805f"
      },
      "r010-c30": {
        "claimId": "r010-c30",
        "notesPath": "docs/research/novels/full-book/circle-of-inevitability/workers/r010/NOTES.md",
        "locators": [
          {
            "spineIndex": 128,
            "member": "OEBPS/Text/0128_128_In_the_Dream.xhtml",
            "memberSha256": "8293a04415cf924355fe410735a68684a030a4fb108ced66f36efa0ba1b6ee9a",
            "paragraphs": [
              24,
              68
            ]
          }
        ],
        "qualification": "actor_inference",
        "sourceSha256": "e7d156a15f97b207c141a347a4e048e0db176a7ee3cd9bd3be49d5963621805f"
      },
      "r050-c687-01": {
        "claimId": "r050-c687-01",
        "notesPath": "docs/research/novels/full-book/circle-of-inevitability/workers/r050/NOTES.md",
        "locators": [
          {
            "spineIndex": 687,
            "member": "OEBPS/Text/0687_687_Gaining_Immortality.xhtml",
            "memberSha256": "bb0acc5e1a424f9957e7fef0dae9b7e8f4741ee4010bd1743594aee553acc9a1",
            "paragraphs": [
              1,
              10
            ]
          },
          {
            "spineIndex": 687,
            "member": "OEBPS/Text/0687_687_Gaining_Immortality.xhtml",
            "memberSha256": "bb0acc5e1a424f9957e7fef0dae9b7e8f4741ee4010bd1743594aee553acc9a1",
            "paragraphs": [
              22,
              37
            ]
          }
        ],
        "qualification": "actor_inference",
        "sourceSha256": "e7d156a15f97b207c141a347a4e048e0db176a7ee3cd9bd3be49d5963621805f"
      }
    }
  },
  {
    "id": "shadow-slave",
    "title": "Shadow Slave",
    "source": {
      "edition": "Shadow Slave / Guiltythree, Calibre16 English chapters 1–1840 plus separately supplied volumes 9, 10, 11",
      "sha256": "2faa3640bfc84043d1821b935c42bd4d22a9c7af3b65a985b3595ed0b519c0b6",
      "locatorConvention": "All XHTML p elements, one-based, including empty p elements; whitespace words",
      "manifestSha256": "2b3c168bc5a82d5a4a75a0a1fa60cdff96e9277c92deabdc1ca4979c52570412",
      "coverageSha256": "8b1c1b1bac3218ddc798875d7ecda070a98865b66dd9a02bf310c96830e3c5f2",
      "coveragePath": "docs/research/novels/full-book/shadow-slave/coverage.json",
      "reviewedExtent": {
        "chapterRanges": [
          [
            1,
            1000
          ],
          [
            1576,
            1589
          ],
          [
            1788,
            1792
          ]
        ],
        "reviewedIntegratedStoryItems": 1019,
        "readerReportedRead": 3000,
        "suppliedChapterGoal": 3000,
        "narrowReusedRanges": [
          [
            1576,
            1589
          ],
          [
            1788,
            1792
          ]
        ],
        "reusedSurroundingArcEnrichmentPending": true,
        "notReviewedHere": "All supplied chapters outside the captured integrated ranges, including volumes 9–11."
      },
      "verifiedSourceFileHash": true,
      "provenance": "Exact supplied compilation. Primary publication/translation authenticity and whole-series coverage are unverified.",
      "suppliedVolumes": [
        {
          "edition": "Calibre16",
          "chapters": [
            1,
            1840
          ],
          "sha256": "2faa3640bfc84043d1821b935c42bd4d22a9c7af3b65a985b3595ed0b519c0b6",
          "reviewedByThisSnapshot": true
        },
        {
          "edition": "volume-9",
          "chapters": [
            1841,
            2260
          ],
          "sha256": "b8fcea86e2761833b5ce995fbd7df8872f65a0ad7b64e4542ce9128d731dd7c8",
          "reviewedByThisSnapshot": false,
          "verifiedSourceFileHash": true
        },
        {
          "edition": "volume-10",
          "chapters": [
            2261,
            2720
          ],
          "sha256": "18e8216c63ce675e87e145b6f7547b446f548d848ffc517502e63bec19ba6f99",
          "reviewedByThisSnapshot": false,
          "verifiedSourceFileHash": true
        },
        {
          "edition": "volume-11",
          "chapters": [
            2721,
            3000
          ],
          "sha256": "b1151c9f2e7ace31781ddef0482a37cd48f5581b8d6b139df7f5992e14fd5b75",
          "reviewedByThisSnapshot": false,
          "structuralException": "Missing declared toc/title page; original 2737–2739 spine order differs from numbered chapter order.",
          "verifiedSourceFileHash": true
        }
      ]
    },
    "baselineImmutable": true,
    "nativeBound": false,
    "nativeWorldStatus": "unactivated-source-qualified-adapter",
    "era": {
      "id": "ss.forgotten-shore.kai-rescue.after",
      "place": "Forgotten Shore after Kai’s rescue, chapters 118–120; separately qualified post-Third-Nightmare exception",
      "entry": "Proposed ordinary local entrant with a stated rank/body/source. Sunny replacement, a Nightmare host role and banished-Sunny entry are separate unactivated choices.",
      "branch": "Original local encounter branch after the Kai rescue; post-theft rule requires its own later era and is never an early Shore condition."
    },
    "rules": [
      {
        "id": "ss.sincerity",
        "eraId": "ss.forgotten-shore.kai-rescue.after",
        "algorithm": "sincerity",
        "channel": "lie-flaw-test",
        "title": "A lie-detecting observer does not learn motives or actual identity",
        "evidence": [
          "SS-0101-0120-C32",
          "SS-0006-0020-C20",
          "SS-0006-0020-C25"
        ],
        "findingScope": "reported statement sincerity",
        "alternative": "Ask a narrow question and corroborate the facts independently.",
        "demandedJoins": [
          "actual lie-flaw-test observation",
          "independent actual carriers",
          "player-known observer report"
        ],
        "requiredFaculty": "lie-detecting-flaw"
      },
      {
        "id": "ss.name-condition",
        "eraId": "ss.third-nightmare.fate-severance.after",
        "algorithm": "name-condition",
        "channel": "name-condition-check",
        "title": "Retained Shadow Bond can lack its activation condition",
        "evidence": [
          "SS-0006-0020-C16",
          "OE07"
        ],
        "findingScope": "specific faculty name condition",
        "alternative": "Use willing ordinary cooperation; do not claim an activated bond.",
        "demandedJoins": [
          "actual name-condition-check observation",
          "independent actual carriers",
          "player-known observer report"
        ]
      },
      {
        "id": "ss.local-recognition",
        "eraId": "ss.third-nightmare.fate-severance.after",
        "algorithm": "recognition-loss",
        "channel": "recognition-response",
        "title": "One failed recognition is not an exhaustive record test",
        "evidence": [
          "OE07"
        ],
        "findingScope": "one actual observer encounter",
        "alternative": "Introduce yourself now and let a new encounter form.",
        "demandedJoins": [
          "actual recognition-response observation",
          "independent actual carriers",
          "player-known observer report"
        ]
      }
    ],
    "replacementAndContinuity": {
      "disguise": "A nickname, implied weakness, masked public theory or a copied physical form does not acquire True Name, Aspect, Flaw, Soul Core or another person’s Memories.",
      "credential": "Displayed status can be private; public title/alias and institutional doctrine do not establish the actual faculty or binding.",
      "memory": "Sunny’s truthful wording can create misleading impressions. Kai’s Flaw checks lying, not omniscient causality; post-theft recognition failure is not a blanket demonstrated record erasure.",
      "bodySoul": "Avatars share one mind, soul and essence reserve. Individually equipped weapons remain actual stock; one summoned Memory sword remains one item. Fate theft is not body/soul/power duplication.",
      "sourceExceptions": [
        "SS-0006-0020-C16",
        "SS-0006-0020-C20",
        "SS-0006-0020-C25",
        "OE07",
        "OE16",
        "OE08"
      ],
      "carrierDisposition": "Sunny survives bodily and retains tested intrinsic faculties after theft. Nephis’s response and Cassie’s later memory report are distinct observer evidence. Bird return/recovery stays conditional theory, never an actual rightful-claimant transfer."
    },
    "selectedTropeChain": {
      "pattern": "Actual rescue → negotiated errands and selective self-description → truthful misunderstanding → independent corroboration → useful cooperation without magical ownership.",
      "people": [
        "ss.sunless",
        "ss.jet",
        "ss.kai",
        "ss.nephis",
        "ss.cassie"
      ],
      "subversions": [
        "Accept ordinary help",
        "Refuse invasive name disclosure",
        "Question without claiming ownership",
        "Corroborate a sincere but incomplete answer",
        "Introduce oneself after recognition loss"
      ],
      "aftermath": "Later committed witnesses remember only their actual encounter; the later theft-era exception cannot silently rewrite earlier Shore history.",
      "evidence": [
        "SS-0006-0020-C22",
        "SS-0006-0020-C25",
        "SS-0101-0120-C32",
        "OE07"
      ]
    },
    "smallInteractions": [
      {
        "detail": "Flaw pressure, truthful words and inference differ; Shadow Bond’s worthy-master/name description is not a completed activation test.",
        "evidence": [
          "SS-0006-0020-C16",
          "SS-0006-0020-C20",
          "SS-0006-0020-C25"
        ],
        "nativeConsumerGap": "Native dialogue command, actual faculty/source, disclosed-name and binding carrier."
      },
      {
        "detail": "Avatar bodies consume a shared actual essence reserve and need individually supplied weapons; Memory access failure does not prove deletion of every intrinsic faculty.",
        "evidence": [
          "OE16",
          "OE07"
        ],
        "nativeConsumerGap": "Native shared controller/soul/essence and separate body/material loadouts."
      }
    ],
    "everydayTextureAndVoice": [
      {
        "original": true,
        "speaker": "Proposed Academy intake worker, separate early-era texture",
        "text": "Food first. The forms are much less useful to someone who cannot stay awake.",
        "cue": "Food/lodging/classes and actual exhaustion; new incidental worker, no reward hook.",
        "evidence": [
          "SS-0006-0020-C22"
        ]
      },
      {
        "original": true,
        "speaker": "Proposed cooperating survivor",
        "text": "That answers my question. It leaves a few others, which is allowed.",
        "cue": "Truthful wording and observer-limited knowledge; original dialogue, no borrowed author voice.",
        "evidence": [
          "SS-0006-0020-C25",
          "SS-0101-0120-C32"
        ]
      }
    ],
    "stableSourcePeople": [
      "ss.sunless",
      "ss.jet",
      "ss.kai",
      "ss.nephis",
      "ss.cassie",
      "ss.vile-thieving-bird"
    ],
    "unknowns": [
      "All 3000 chapters are reader-reported read, but only the captured accepted ranges are used.",
      "Volumes 9–11 have no reviewed/integrated credit in this frozen snapshot.",
      "Nightmare historical-role ontology, exact first worthy-master eligibility and universal soul signature remain unbound.",
      "Bird emergence/location and guaranteed fate/relationship restoration are not witnessed.",
      "No all-observer/all-record recognition erasure is proved by the selected encounter."
    ],
    "missingNativeBindings": [
      "native realm/era/location and entry",
      "actor/body/controller/soul owners",
      "actual source/fuel/method and native material custody",
      "per-observer testimony/belief and committed-history owner",
      "native command/UI and durable publication"
    ],
    "implementationStatus": "implemented-unverified; pure adapter; parent original-scene consumer required",
    "deferredGates": [
      "actual gameplay",
      "save/reload/failure",
      "keyboard/regression",
      "director acceptance"
    ],
    "topologyDisposition": {
      "settingContinuity": "Waking society, Dream Realm regions and particular Nightmare trials are distinct; the Spell is not equated with Paradise’s contractor hub.",
      "structures": [
        {
          "kind": "nightmare-presented-history",
          "qualifiedFinding": "Sunny experiences a centuries-reversed scene and a role body; this does not certify literal time travel or all ancient history.",
          "evidence": [
            "SS-0001-0005-C06"
          ]
        },
        {
          "kind": "rank-qualified-travel-doctrine",
          "qualifiedFinding": "Sleeper spirit-entry and higher bodily/passenger travel are learned doctrine, with stage-specific limits; this opening report is not every travel operation exercised.",
          "evidence": [
            "SS-0006-0020-C21"
          ]
        },
        {
          "kind": "represented-nightmare-collapse",
          "qualifiedFinding": "The attacked Nightmare ends and Sunny actually returns bodily. The Bird’s own far-side emergence is not witnessed.",
          "evidence": [
            "OE04",
            "OE05",
            "OE08"
          ]
        },
        {
          "kind": "shared-soul-multiple-bodies",
          "qualifiedFinding": "Avatars occupy body positions while sharing one mind/soul/essence. This is not several separately born actors or separate reward owners.",
          "evidence": [
            "OE16"
          ]
        }
      ],
      "edges": [
        {
          "from": "third Nightmare",
          "to": "waking ruins",
          "kind": "actual Sunny physical return",
          "actor": "Sunny survives",
          "source": "Transcendence/intrinsic functions differ from Spell connection",
          "cargo": "tested summons and failed summons remain different",
          "authority": "no restored True Name/Bond activation",
          "evidence": [
            "OE07",
            "OE05"
          ]
        },
        {
          "from": "represented Bird",
          "to": "possible reality",
          "kind": "conditional theory only",
          "actorBodySoul": "final identity and location unknown",
          "cargo": "stolen fate is not duplication of Sunny’s entire source/body",
          "clock": "specific collapse opportunity, not general omnipotence",
          "evidence": [
            "OE08"
          ]
        }
      ],
      "activation": "No native Dream/Nightmare/fate/Spell or avatar-body adapter. No source-supported guarantee for post-banishment Sunny’s own round trip.",
      "nativeGaps": [
        "Physical/spirit/represented role bodies and qualified passenger edges",
        "Native Spell/True Name/fate owner without source/fuel duplication",
        "Region/trial clocks, local residents, independent inventory and actual return operations"
      ]
    },
    "deepChainDisposition": {
      "id": "recognition.ss.cooperation-without-ownership",
      "family": "recognition-to-earned-cooperation",
      "sourceVsOriginal": "Original post-rescue cooperation chain grounded in Shore evidence; its later fate exception stays a separate era.",
      "actors": [
        "ss.sunless",
        "ss.kai",
        "ss.stone-saint",
        "ss.proposed-castle-contact"
      ],
      "privateGoals": [
        "Kai wants release and safety.",
        "Sunny wants practical access while protecting his name and private means.",
        "Ordinary castle contacts have their own resources and beliefs."
      ],
      "phases": [
        {
          "id": "release",
          "prerequisite": "actual captivity and physically reachable grate",
          "means": "actual lifting help; flight does not grant lifting strength",
          "evidence": [
            "SS-0101-0120-C30"
          ],
          "choices": [
            "help",
            "request assistance",
            "decline a dangerous intervention"
          ]
        },
        {
          "id": "terms",
          "prerequisite": "rescue actually performed and voluntary promised work",
          "means": "independent Kai, errands and actual coercion risk; not a magical bond",
          "evidence": [
            "SS-0101-0120-C31"
          ],
          "choices": [
            "accept ordinary help",
            "negotiate",
            "release without errands"
          ]
        },
        {
          "id": "question",
          "prerequisite": "actual narrow question and truthful reply",
          "means": "Sunny’s own Flaw and Kai’s actual lie-detection rather than mind reading",
          "evidence": [
            "SS-0101-0120-C32",
            "SS-0006-0020-C25"
          ],
          "choices": [
            "answer narrowly",
            "corroborate",
            "decline invasive name question"
          ]
        },
        {
          "id": "supplies",
          "prerequisite": "local travel/help actually requested",
          "means": "actual water/limited arrows/cargo and route, no copied Memories",
          "evidence": [
            "SS-0101-0120-C34"
          ],
          "choices": [
            "share owned water",
            "wait",
            "take a supported safer route"
          ]
        },
        {
          "id": "reencounter",
          "prerequisite": "committed later meeting",
          "means": "actual remembered promises/account and independent observer correction",
          "evidence": [
            "SS-0101-0120-C32",
            "OE07"
          ],
          "choices": [
            "correct mistaken impression",
            "keep earned cooperation",
            "resolve duty",
            "later source era explicitly requalifies recognition"
          ]
        }
      ],
      "outcomes": {
        "lawful": "Cooperation through actual help and performed terms, without a name-bond.",
        "refusal": "Departure or release without claim remains possible.",
        "partial": "Sincere explanation supports only its stated scope; supplies and risky help can be postponed.",
        "hostile": "Threat/coercion has only the actual people’s persistent reaction; no automatic control or stolen affection."
      },
      "aftermath": "Kai’s actual release, used supplies and completed errands persist. No reimprisonment or respawned loot on revisit; post-theft nonrecognition is an explicit later source-qualified branch.",
      "status": "source-qualified authoring disposition; native full-world chain unactivated",
      "callableRecognitionRules": [
        "ss.sincerity",
        "ss.name-condition",
        "ss.local-recognition"
      ],
      "nativeBindingsRequired": [
        "native realm/era/location and entry",
        "actor/body/controller/soul owners",
        "actual source/fuel/method and native material custody",
        "per-observer testimony/belief and committed-history owner",
        "native command/UI and durable publication"
      ],
      "clockPolicy": "No new clock. Native worlds remain unactivated; unsupported absence stays frozen under the eventual host policy."
    },
    "evidenceIndex": {
      "SS-0101-0120-C32": {
        "claimId": "SS-0101-0120-C32",
        "notesPath": "docs/research/novels/full-book/shadow-slave/workers/r0101-0120/NOTES.md",
        "locators": [
          {
            "chapter": 118,
            "member": "1/2/OEBPS/page-22_u2.html",
            "memberSha256": "bb24e5d2eea0cd95c8eec2ad3293735ec43966c9658e43e7005e54e25eb28a3f",
            "paragraphs": [
              13,
              32
            ]
          },
          {
            "chapter": 119,
            "member": "1/2/OEBPS/page-23_u3.html",
            "memberSha256": "8490eb254af40fa41f37a04ed91cadbbbcbd18982a1b25ee18d64b9b825d53f4",
            "paragraphs": [
              19,
              21
            ]
          }
        ],
        "qualification": "Kai reports a lie-detecting Flaw and accepts explanations; monster applicability unknown.",
        "sourceSha256": "2faa3640bfc84043d1821b935c42bd4d22a9c7af3b65a985b3595ed0b519c0b6"
      },
      "SS-0006-0020-C20": {
        "claimId": "SS-0006-0020-C20",
        "notesPath": "docs/research/novels/full-book/shadow-slave/workers/r0006-0020/NOTES.md",
        "locators": [
          {
            "chapter": 17,
            "member": "1/1/OEBPS/page-16_u3.html",
            "memberSha256": "c7d73ad22d198c1e1f018391451fe6c5e1cdc07f9efa94ae162935af398ab9a2",
            "paragraphs": [
              4,
              14
            ]
          },
          {
            "chapter": 17,
            "member": "1/1/OEBPS/page-16_u3.html",
            "memberSha256": "c7d73ad22d198c1e1f018391451fe6c5e1cdc07f9efa94ae162935af398ab9a2",
            "paragraphs": [
              34,
              48
            ]
          },
          {
            "chapter": 18,
            "member": "1/1/OEBPS/page-17_u1_u1.html",
            "memberSha256": "352d3ac1d5dff3270941d8ab22439008f8e92b22fb6530cc5dc19c78fd778af6",
            "paragraphs": [
              62,
              64
            ]
          }
        ],
        "qualification": "Displayed Clear Conscience plus witnessed pressure/answers; separate from Shadow Bond.",
        "sourceSha256": "2faa3640bfc84043d1821b935c42bd4d22a9c7af3b65a985b3595ed0b519c0b6"
      },
      "SS-0006-0020-C25": {
        "claimId": "SS-0006-0020-C25",
        "notesPath": "docs/research/novels/full-book/shadow-slave/workers/r0006-0020/NOTES.md",
        "locators": [
          {
            "chapter": 20,
            "member": "1/1/OEBPS/page-19_u2.html",
            "memberSha256": "4dc4e2439a64524d29c807208892b04785ced4f2f57ad7e587dd3b4fdd07ffad",
            "paragraphs": [
              23,
              55
            ]
          }
        ],
        "qualification": "Witnessed truthful wording can mislead about motives.",
        "sourceSha256": "2faa3640bfc84043d1821b935c42bd4d22a9c7af3b65a985b3595ed0b519c0b6"
      },
      "SS-0006-0020-C16": {
        "claimId": "SS-0006-0020-C16",
        "notesPath": "docs/research/novels/full-book/shadow-slave/workers/r0006-0020/NOTES.md",
        "locators": [
          {
            "chapter": 15,
            "member": "1/1/OEBPS/page-14_u1.html",
            "memberSha256": "b759cdb1a210d584ac8875cc909a6fbf035b1f02b546e2ec412fc4ac0a83ab30",
            "paragraphs": [
              48,
              58
            ]
          }
        ],
        "qualification": "Displayed faculty description; exact worthy-master eligibility and first activation unresolved in this range.",
        "sourceSha256": "2faa3640bfc84043d1821b935c42bd4d22a9c7af3b65a985b3595ed0b519c0b6"
      },
      "OE07": {
        "claimId": "OE07",
        "notesPath": "docs/research/novels/shadow-slave/observation-emergence/SOURCE_NOTES.md",
        "locators": [
          {
            "chapter": 1589,
            "member": "2/3/OEBPS/page-358.html",
            "memberSha256": "9474dc8b31c182607e22a1875726370b6063ee544d8def75ae2acfedb7ad2fb7",
            "paragraphs": [
              1,
              18
            ]
          },
          {
            "chapter": 1589,
            "member": "2/3/OEBPS/page-358.html",
            "memberSha256": "9474dc8b31c182607e22a1875726370b6063ee544d8def75ae2acfedb7ad2fb7",
            "paragraphs": [
              26,
              54
            ]
          }
        ],
        "qualification": "Narrated causal account and one observed Nephis recognition failure; no exhaustive record/observer test.",
        "sourceSha256": "2faa3640bfc84043d1821b935c42bd4d22a9c7af3b65a985b3595ed0b519c0b6"
      },
      "OE16": {
        "claimId": "OE16",
        "notesPath": "docs/research/novels/shadow-slave/observation-emergence/SOURCE_NOTES.md",
        "locators": [
          {
            "chapter": 1584,
            "member": "2/3/OEBPS/page-353.html",
            "memberSha256": "92033180e997732550b81194771d39c6a7f46f43521881ac489fd0b982a18ecf",
            "paragraphs": [
              1,
              44
            ]
          }
        ],
        "qualification": "Narration summarizes avatar experiments: one mind/soul/essence, individually supplied weapons, one Memory sword.",
        "sourceSha256": "2faa3640bfc84043d1821b935c42bd4d22a9c7af3b65a985b3595ed0b519c0b6"
      },
      "OE08": {
        "claimId": "OE08",
        "notesPath": "docs/research/novels/shadow-slave/observation-emergence/SOURCE_NOTES.md",
        "locators": [
          {
            "chapter": 1790,
            "member": "2/4/OEBPS/page-199_u1_u1.html",
            "memberSha256": "c7196530a6750232692425283b144157dcd2cb126579b59197fd612f4610b848",
            "paragraphs": [
              1,
              17
            ]
          }
        ],
        "qualification": "Sunny conditional developed theory; no independently witnessed Bird emergence/location or restoration.",
        "sourceSha256": "2faa3640bfc84043d1821b935c42bd4d22a9c7af3b65a985b3595ed0b519c0b6"
      },
      "SS-0006-0020-C22": {
        "claimId": "SS-0006-0020-C22",
        "notesPath": "docs/research/novels/full-book/shadow-slave/workers/r0006-0020/NOTES.md",
        "locators": [
          {
            "chapter": 17,
            "member": "1/1/OEBPS/page-16_u3.html",
            "memberSha256": "c7d73ad22d198c1e1f018391451fe6c5e1cdc07f9efa94ae162935af398ab9a2",
            "paragraphs": [
              76,
              78
            ]
          },
          {
            "chapter": 18,
            "member": "1/1/OEBPS/page-17_u1_u1.html",
            "memberSha256": "352d3ac1d5dff3270941d8ab22439008f8e92b22fb6530cc5dc19c78fd778af6",
            "paragraphs": [
              68,
              99
            ]
          }
        ],
        "qualification": "Jet reports counseling/Academy food, lodging and lessons; no guaranteed safety.",
        "sourceSha256": "2faa3640bfc84043d1821b935c42bd4d22a9c7af3b65a985b3595ed0b519c0b6"
      },
      "SS-0001-0005-C06": {
        "claimId": "SS-0001-0005-C06",
        "notesPath": "docs/research/novels/full-book/shadow-slave/workers/r0001-0005/NOTES.md",
        "locators": [
          {
            "chapter": 2,
            "member": "1/1/OEBPS/page-1.html",
            "memberSha256": "02b53f87f166927675f2b8a12486340fc18e1a93fa059b9365ecec180a6f42c1",
            "paragraphs": [
              1,
              7
            ]
          }
        ],
        "qualification": "Subjective witnessed temporal presentation, not authenticated physical history",
        "sourceSha256": "2faa3640bfc84043d1821b935c42bd4d22a9c7af3b65a985b3595ed0b519c0b6"
      },
      "SS-0006-0020-C21": {
        "claimId": "SS-0006-0020-C21",
        "notesPath": "docs/research/novels/full-book/shadow-slave/workers/r0006-0020/NOTES.md",
        "locators": [
          {
            "chapter": 17,
            "member": "1/1/OEBPS/page-16_u3.html",
            "memberSha256": "c7d73ad22d198c1e1f018391451fe6c5e1cdc07f9efa94ae162935af398ab9a2",
            "paragraphs": [
              62,
              78
            ]
          }
        ],
        "qualification": "Learned doctrine and Jet’s report; higher entry not exercised in this range",
        "sourceSha256": "2faa3640bfc84043d1821b935c42bd4d22a9c7af3b65a985b3595ed0b519c0b6"
      },
      "OE04": {
        "claimId": "OE04",
        "notesPath": "docs/research/novels/shadow-slave/observation-emergence/SOURCE_NOTES.md",
        "locators": [
          {
            "chapter": 1580,
            "member": "2/3/OEBPS/page-349.html",
            "memberSha256": "a486773244aacd00b3ed40fc9fcd183db99449ddbe4bcadec4da4a1923a5ad43",
            "paragraphs": [
              49,
              89
            ]
          }
        ],
        "qualification": "Narrated theft/collapse with privileged counterfactual; no Bird destination witness",
        "sourceSha256": "2faa3640bfc84043d1821b935c42bd4d22a9c7af3b65a985b3595ed0b519c0b6"
      },
      "OE05": {
        "claimId": "OE05",
        "notesPath": "docs/research/novels/shadow-slave/observation-emergence/SOURCE_NOTES.md",
        "locators": [
          {
            "chapter": 1581,
            "member": "2/3/OEBPS/page-350.html",
            "memberSha256": "244cd33e0c3d788c694a045c04bef6434cdf1dd101dbbab182a7f625dbbfba15",
            "paragraphs": [
              1,
              10
            ]
          },
          {
            "chapter": 1581,
            "member": "2/3/OEBPS/page-350.html",
            "memberSha256": "244cd33e0c3d788c694a045c04bef6434cdf1dd101dbbab182a7f625dbbfba15",
            "paragraphs": [
              28,
              43
            ]
          },
          {
            "chapter": 1581,
            "member": "2/3/OEBPS/page-350.html",
            "memberSha256": "244cd33e0c3d788c694a045c04bef6434cdf1dd101dbbab182a7f625dbbfba15",
            "paragraphs": [
              48,
              67
            ]
          }
        ],
        "qualification": "Actual return",
        "sourceSha256": "2faa3640bfc84043d1821b935c42bd4d22a9c7af3b65a985b3595ed0b519c0b6"
      },
      "SS-0101-0120-C30": {
        "claimId": "SS-0101-0120-C30",
        "notesPath": "docs/research/novels/full-book/shadow-slave/workers/r0101-0120/NOTES.md",
        "locators": [
          {
            "chapter": 115,
            "member": "1/2/OEBPS/page-19_u3.html",
            "memberSha256": "ed165f96ea7e129864b0f1df2684a08979a8355137f96b2912f772be7df378db",
            "paragraphs": [
              63,
              71
            ]
          },
          {
            "chapter": 116,
            "member": "1/2/OEBPS/page-20.html",
            "memberSha256": "faa5e9515136517203a38f7b0b30cb52924885dbce7a8356a320e3aed250cf73",
            "paragraphs": [
              1,
              3
            ]
          },
          {
            "chapter": 116,
            "member": "1/2/OEBPS/page-20.html",
            "memberSha256": "faa5e9515136517203a38f7b0b30cb52924885dbce7a8356a320e3aed250cf73",
            "paragraphs": [
              20,
              20
            ]
          },
          {
            "chapter": 116,
            "member": "1/2/OEBPS/page-20.html",
            "memberSha256": "faa5e9515136517203a38f7b0b30cb52924885dbce7a8356a320e3aed250cf73",
            "paragraphs": [
              35,
              35
            ]
          },
          {
            "chapter": 117,
            "member": "1/2/OEBPS/page-21_u3.html",
            "memberSha256": "35b9140eeb423843548d82f2a6e3a183f0eda3242d79ff92b4a319ab57bb83e8",
            "paragraphs": [
              1,
              5
            ]
          }
        ],
        "qualification": "Witnessed flight/grate release with separate strength",
        "sourceSha256": "2faa3640bfc84043d1821b935c42bd4d22a9c7af3b65a985b3595ed0b519c0b6"
      },
      "SS-0101-0120-C31": {
        "claimId": "SS-0101-0120-C31",
        "notesPath": "docs/research/novels/full-book/shadow-slave/workers/r0101-0120/NOTES.md",
        "locators": [
          {
            "chapter": 116,
            "member": "1/2/OEBPS/page-20.html",
            "memberSha256": "faa5e9515136517203a38f7b0b30cb52924885dbce7a8356a320e3aed250cf73",
            "paragraphs": [
              7,
              18
            ]
          },
          {
            "chapter": 116,
            "member": "1/2/OEBPS/page-20.html",
            "memberSha256": "faa5e9515136517203a38f7b0b30cb52924885dbce7a8356a320e3aed250cf73",
            "paragraphs": [
              69,
              80
            ]
          },
          {
            "chapter": 118,
            "member": "1/2/OEBPS/page-22_u2.html",
            "memberSha256": "bb24e5d2eea0cd95c8eec2ad3293735ec43966c9658e43e7005e54e25eb28a3f",
            "paragraphs": [
              40,
              40
            ]
          },
          {
            "chapter": 118,
            "member": "1/2/OEBPS/page-22_u2.html",
            "memberSha256": "bb24e5d2eea0cd95c8eec2ad3293735ec43966c9658e43e7005e54e25eb28a3f",
            "paragraphs": [
              61,
              63
            ]
          }
        ],
        "qualification": "Witnessed bargain and promise, no supernatural enforcement",
        "sourceSha256": "2faa3640bfc84043d1821b935c42bd4d22a9c7af3b65a985b3595ed0b519c0b6"
      },
      "SS-0101-0120-C34": {
        "claimId": "SS-0101-0120-C34",
        "notesPath": "docs/research/novels/full-book/shadow-slave/workers/r0101-0120/NOTES.md",
        "locators": [
          {
            "chapter": 119,
            "member": "1/2/OEBPS/page-23_u3.html",
            "memberSha256": "8490eb254af40fa41f37a04ed91cadbbbcbd18982a1b25ee18d64b9b825d53f4",
            "paragraphs": [
              2,
              2
            ]
          },
          {
            "chapter": 119,
            "member": "1/2/OEBPS/page-23_u3.html",
            "memberSha256": "8490eb254af40fa41f37a04ed91cadbbbcbd18982a1b25ee18d64b9b825d53f4",
            "paragraphs": [
              31,
              33
            ]
          },
          {
            "chapter": 120,
            "member": "1/2/OEBPS/page-24_u2.html",
            "memberSha256": "395080af936242eace854d1fa8060c5818216b89b8ceb6e9a11790b42e6ff69a",
            "paragraphs": [
              18,
              48
            ]
          }
        ],
        "qualification": "Witnessed preparation/limited stock and bounded interpretation",
        "sourceSha256": "2faa3640bfc84043d1821b935c42bd4d22a9c7af3b65a985b3595ed0b519c0b6"
      }
    }
  }
]);

export const BOOK_RECOGNITION_SCENE = deepFreeze({
    id: 'subtlety.reference_desk',
    original: true,
    location: 'Village',
    hostSceneId: 'subtlety.relay_office',
    description: 'An optional comparison of the actual relay badge, registry and witness account with four source-qualified recognition rules.',
    nativeWorldActivation: false,
    choices: ['mother-of-learning', 'lord-of-mysteries', 'circle-of-inevitability', 'shadow-slave'],
    demandedJoins: ['actual carrier snapshot', 'observer-reported evidence', 'known committed history', 'host-owned scene choice'],
    effects: [],
    status: 'original-source-comparison-specification; parent integration receipt owns registration'
});

export const getBookRecognitionProfile = id =>
    BOOK_RECOGNITION_PROFILES.find(profile => profile.id === id) || null;

const record = value => value && typeof value === 'object' && !Array.isArray(value);
const textValue = value => typeof value === 'string' && value.length > 0;
const same = (left, right) => textValue(left) && textValue(right) && left === right;
const bool = value => typeof value === 'boolean';

function result(profile, rule, input, status, code, description, finding = {}) {
    const reported = input?.observer?.playerKnown === true && input?.means?.reported === true;
    return deepFreeze({
        status, code, profileId: profile?.id || null, ruleId: rule?.id || null,
        mode: input?.mode || 'native-world',
        grants: [], commits: [], nativeWorldActivated: false,
        finding: { ...finding, scope: rule?.findingScope || 'none' },
        playerView: reported
            ? { status, explanation: description, alternative: rule?.alternative || 'Ask the person or the responsible institution.' }
            : { status: 'unknown', explanation: 'This observer has not reported a result.', alternative: 'Ask for the observer’s account.' },
        // Author-facing evidence must not be published as an NPC revelation.
        authorEvidence: (rule?.evidence || []).map(id => profile?.evidenceIndex?.[id]).filter(Boolean),
        demandedJoins: rule?.demandedJoins || profile?.missingNativeBindings || []
    });
}

/**
 * Evaluate already observed evidence, without performing a test or updating belief.
 * Native book worlds remain inactive. An explicitly original reference-desk
 * comparison can use actual Village carriers; it is never a canonical event.
 * Inputs are optional/inert. An omitted or unknown value cannot pass a check.
 */
export function recognizeBookWorld(profileId, input = {}) {
    if (!record(input)) input = {};
    const profile = getBookRecognitionProfile(profileId);
    const rule = profile?.rules.find(entry => entry.id === input.ruleId);
    const answer = (status, code, description, finding) => result(profile, rule, input, status, code, description, finding);
    if (!profile || !rule) return answer('unknown', 'unknown-profile-or-rule', 'There is no qualified rule for this comparison.');
    if (input.mode !== 'source-comparison') {
        return answer('unknown', 'native-world-unbound', 'This book world has no active native binding.');
    }
    if (input.sceneId !== BOOK_RECOGNITION_SCENE.id || input.originalScene !== true) {
        return answer('unknown', 'comparison-scene-unbound', 'This comparison needs its explicitly original scene.');
    }
    if (input.eraId !== rule.eraId) return answer('unknown', 'era-not-qualified', 'That rule does not cover this era.');
    const { observer, carriers, means } = input;
    if (!record(observer) || !record(carriers) || !record(means) || !textValue(observer.id)
        || !textValue(carriers.actorId) || !textValue(carriers.bodyId) || !textValue(carriers.controllerId)) {
        return answer('unknown', 'actual-carriers-missing', 'The actor, body, controller or observer is unspecified.');
    }
    if (means.completed !== true || means.observerId !== observer.id || means.actorId !== carriers.actorId) {
        return answer('unknown', 'observation-not-completed', 'No completed observation has been supplied for this person.');
    }
    // Each rule consumes its actual channel. A visual badge cannot be relabelled
    // a soul scan, and a testimony cannot become an institutional registry.
    if (means.channel !== rule.channel) return answer('unknown', 'wrong-observation-channel', 'That observation uses a different recognition test.');
    if (rule.requiredFaculty && (!Array.isArray(observer.faculties) || !observer.faculties.includes(rule.requiredFaculty)
        || means.facultyWasActuallyUsed !== true)) {
        return answer('unknown', 'observer-faculty-not-supplied', 'This observer has not supplied the required faculty and its actual use.');
    }
    if (rule.requiredMethod && means.methodId !== rule.requiredMethod) {
        return answer('unknown', 'method-not-supplied', 'The actual means for this test are unspecified.');
    }
    switch (rule.algorithm) {
    case 'signature': {
        if (!textValue(carriers.credentialId) || !textValue(carriers.credentialHolderId)
            || !textValue(carriers.boundSignature) || !textValue(means.observedSignature)) {
            return answer('unknown', 'signature-evidence-missing', 'The actual key and tested signature are needed.');
        }
        if (carriers.credentialHolderId !== carriers.actorId) return answer('blocked', 'key-not-held', 'The presented key is not held by this actor.');
        const matches = same(carriers.boundSignature, means.observedSignature);
        return answer(matches ? 'supported' : 'blocked', matches ? 'key-signature-matches' : 'key-signature-differs',
            matches ? 'The tested key matches its bound signature. This establishes this key’s access condition.' : 'The tested signature differs from the key’s binding.',
            { credentialMatches: matches, identityVerified: false });
    }
    case 'mechanism': {
        if (!textValue(means.effectMechanism) || !textValue(means.counterMechanism)) return answer('unknown', 'mechanism-missing', 'The effect and counter mechanisms are unspecified.');
        if (means.effectMechanism === 'physical-sound' && means.counterMechanism === 'mind-ward') {
            return answer('blocked', 'physical-sound-not-mind-effect', 'A mind ward does not remove these physical sound waves.', { counterApplies: false });
        }
        return answer('unknown', 'mechanism-pair-unqualified', 'This source case does not establish that counter for this effect.');
    }
    case 'appearance': {
        if (!bool(means.appearanceMatches)) return answer('unknown', 'appearance-not-compared', 'No appearance comparison has been supplied.');
        return answer(means.appearanceMatches ? 'supported' : 'blocked', means.appearanceMatches ? 'appearance-consistent' : 'appearance-differs',
            means.appearanceMatches ? 'The observed appearance is consistent with the claim. Powers, memories and rights remain separate.' : 'The observed appearance differs from the claim.',
            { appearanceConsistent: means.appearanceMatches, identityVerified: false });
    }
    case 'behavior': {
        if (!textValue(carriers.claimedActorId) || !same(observer.expectedActorId, carriers.claimedActorId)
            || !Array.isArray(observer.expectedCues) || !observer.expectedCues.length || !observer.expectedCues.every(textValue)) {
            return answer('unknown', 'observer-expectation-missing', 'This observer has no supplied prior expectation for the claimed person.');
        }
        if (!Array.isArray(means.observedCues) || !means.observedCues.length || !means.observedCues.every(textValue)
            || !bool(means.cueConflict)) return answer('unknown', 'behavioral-evidence-missing', 'No compared behavior has been supplied.');
        return answer('supported', means.cueConflict ? 'grounds-for-suspicion' : 'behavior-consistent',
            means.cueConflict ? 'The observed behavior conflicts with the expected person. That supports suspicion, without naming an impostor.' : 'The observed behavior is consistent with the expected person. That does not authenticate a soul.',
            { suspicionSupported: means.cueConflict, identityVerified: false });
    }
    case 'registry': {
        if (!textValue(carriers.claimedActorId) || !textValue(carriers.rightId) || !textValue(carriers.rightHolderId)) return answer('unknown', 'right-claim-missing', 'The claimed person, exact institutional right or actual holder is unspecified.');
        if (!record(means.registryEntry) || !textValue(means.registryEntry.actorId) || !textValue(means.registryEntry.rightId)) {
            return answer('unknown', 'registry-missing', 'A face or testimony does not supply an institutional entry.');
        }
        if (means.registryEntry.rightId !== carriers.rightId) return answer('unknown', 'different-right', 'This entry records a different right.');
        const holds = same(means.registryEntry.actorId, carriers.actorId) && same(carriers.rightHolderId, carriers.actorId);
        return answer(holds ? 'supported' : 'blocked', holds ? 'actual-right-recorded' : 'right-belongs-elsewhere',
            holds ? 'The supplied registry and actual right carrier identify this actor as the holder. The comparison transfers nothing.' : 'The supplied registry does not make this actor the actual right holder.',
            { rightHolderConfirmed: holds, identityVerified: false });
    }
    case 'sincerity': {
        if (!bool(means.sincere)) return answer('unknown', 'sincerity-unreported', 'No result of the sincerity test has been supplied.');
        if (means.requestedFinding !== 'sincerity') return answer('unknown', 'sincerity-not-identity', 'This test can report sincerity; it cannot establish the person’s actual identity.');
        return answer(means.sincere ? 'supported' : 'blocked', means.sincere ? 'statement-sincere' : 'statement-insincere',
            means.sincere ? 'The statement is sincere according to this completed test. A sincerely held identity belief can still be wrong.' : 'The completed test reports an insincere statement.',
            { sincerity: means.sincere, identityVerified: false });
    }
    case 'memory': {
        if (!record(observer.encounter) || !textValue(observer.encounter.eventId) || !textValue(observer.encounter.branchId)
            || !textValue(observer.encounter.actorId) || !textValue(means.eventId) || !textValue(means.branchId)
            || !bool(means.answerMatches)) return answer('unknown', 'local-history-missing', 'A specific remembered encounter and compared answer are needed.');
        if (observer.encounter.eventId !== means.eventId || observer.encounter.branchId !== means.branchId) {
            return answer('unknown', 'different-remembered-history', 'This observer remembers a different encounter or branch.');
        }
        return answer(means.answerMatches ? 'supported' : 'blocked', means.answerMatches ? 'memory-account-consistent' : 'memory-account-differs',
            means.answerMatches ? 'The answer is consistent with this observer’s remembered encounter. It proves no copied soul or transferred relationship.' : 'The answer differs from this observer’s remembered encounter.',
            { memoryAccountConsistent: means.answerMatches, identityVerified: false });
    }
    case 'name-condition': {
        if (carriers.facultyId !== 'shadow-bond') return answer('unknown', 'different-faculty', 'This case concerns a specific innate faculty.');
        if (carriers.trueName === null && carriers.nameConditionAbsent === true) {
            return answer('blocked', 'name-condition-absent', 'The retained faculty cannot meet its missing name condition.', { facultyDeleted: false, bindingGranted: false });
        }
        return answer('unknown', 'name-eligibility-unqualified', 'The name alone does not establish master eligibility or an active bond.', { bindingGranted: false });
    }
    case 'recognition-loss': {
        if (carriers.fateCondition !== 'severed' || !bool(means.recognizes)) return answer('unknown', 'recognition-case-missing', 'This local case needs the specified condition and an actual reported response.');
        return answer(means.recognizes ? 'unknown' : 'supported', means.recognizes ? 'possible-exception-needs-source' : 'local-nonrecognition',
            means.recognizes ? 'That response differs from the selected source case; its exception is unqualified.' : 'This observer does not recognize the person in this encounter. Other people and records remain untested.',
            { locallyRecognized: means.recognizes, universalForgetting: false });
    }
    default:
        return answer('unknown', 'rule-not-implemented', 'This rule has no qualified callable implementation.');
    }
}

// Safe derivative for a real scene/UI consumer. No author-only truth, signatures,
// raw testimony, source spoilers or unreported suspicion is exposed here.
export function bookRecognitionSceneView(profileId, input = {}) {
    const evaluation = recognizeBookWorld(profileId, input);
    const profile = getBookRecognitionProfile(profileId);
    return deepFreeze({
        sceneId: BOOK_RECOGNITION_SCENE.id,
        profileId: profile?.id || null,
        label: profile ? `${profile.title} comparison` : 'Unqualified comparison',
        originalComparison: true, nativeWorldActivated: false,
        ...evaluation.playerView
    });
}
