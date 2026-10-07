// Source-qualified roster authoring only. No state, persistence, reward or clock owner.
// The arrays are inert until the sole Features integrator registers a selected
// consumer. Source/author knowledge below is never automatically player knowledge.
const freezeTree = value => {
    if(value && typeof value === 'object') {
        for(const child of Object.values(value)) freezeTree(child);
        Object.freeze(value);
    }
    return value;
};

export const bookRosterProfiles = freezeTree([
  {
    "id": "original-frontier",
    "label": "Original Frontier",
    "authoringFamily": "base.frontier",
    "nativeWorldId": "base.frontier",
    "source": {
      "kind": "original-existing-campaign",
      "edition": "Current native YAIRPG fork and authored Frontier",
      "reviewedExtent": "Current saved adventure and selected source/native owner excerpts. No external book source."
    },
    "baseline": {
      "era": "current saved adventure",
      "place": "Village / earned Shack / road and Town corridor",
      "entry": "existing player continuity; opt-in existing work/rivalry",
      "branch": "No source replacement or new past. Later choices change actual local history.",
      "actualState": "Existing saved base.frontier only; new authoring profile is inert."
    },
    "sourceRefs": [
      {
        "path": "docs/worlds/original-frontier/WORLD_BRIEF.md",
        "sha256": "7712218c9f268b5381946a68bb8af9ec0c9ed4317c372623987d258e360d5193",
        "locators": [
          "Identity, scope and player experience",
          "Residents, means and knowledge"
        ]
      },
      {
        "path": "docs/worlds/original-frontier/CAMPAIGN.md",
        "sha256": "29b5cc2e045177049570ed00ac142a487f2c3a0c163bc651a01e866f26a0a14a",
        "locators": [
          "Local lives at three stages",
          "Dispatch and account work",
          "Material craft and prepared stock"
        ]
      },
      {
        "path": "src/frontier_campaign.js",
        "sha256": "f1e08ded56a03ab38feec3004ca1f88b06accaa7cd1c9393cdd1a91e31806012",
        "locators": [
          "campaignDefinitions.commands rival.begin/rival.settle/rival.decline/rival.report"
        ]
      },
      {
        "path": "src/original_frontier_career_content.js",
        "sha256": "52c408cf90d3f28fd6a07f501a11251ba9ea49ebe1cadde5cf7604e3cc513a79",
        "locators": [
          "succession commands original_frontier.successor_meet/teach/fund/work/report/handoff"
        ]
      },
      {
        "path": "src/backlog_expansion_replacement.js",
        "sha256": "384603fe1322941e8d31ec694e28b5aae4b5d96eeea809ee663c42d58d9e98d5",
        "locators": [
          "REPLACEMENT_IDS",
          "REPLACEMENT_CONTRACT",
          "stageReplacementCommand accept_office",
          "available/office/belief",
          "validateReplacementRecord"
        ]
      }
    ],
    "replacement": [
      {
        "qualification": "O original selected native proof",
        "detail": "Living Eda willingly appoints the player to the same seal-steward office and its two-seal duty. Eda retains actual actor/body/controller, memories, personal five-mastery source/fuel, goods and three-coin personal debt. This is no face/soul/canonical-role replacement.",
        "claimRefs": [
          "src/backlog_expansion_replacement.js REPLACEMENT_CONTRACT/accept_office"
        ]
      },
      {
        "qualification": "O original selected native proof",
        "detail": "Orrin may interpret the heard Eda-name claim through the issued credential. Bera checks remembered forearm mark and demonstrated personal method. The registry names player/deputy and living Eda separately; only an actually delivered registry report corrects Orrin. Belief does not move actual identity or affection.",
        "claimRefs": [
          "src/backlog_expansion_replacement.js present_honest/claim_eda/personal_test/registry_test/correct_clerk"
        ]
      },
      {
        "qualification": "O",
        "detail": "Jun is a new willing learner, not a copy of the player or a revival of a departing helper. A bounded management handoff follows actual teaching, transferred means, contribution and heard report."
      },
      {
        "qualification": "O",
        "detail": "Credit for stock is tied to the actual supplied lot/receipt and observer, not a second reward for telling the story."
      },
      {
        "qualification": "O",
        "detail": "Actual actor/body/controller, memories, acquired source/fuel, learned mastery, goods/custody, rights/duties and observer beliefs remain separate. No appearance/role helper transfers them."
      }
    ],
    "trope": {
      "chain": "Mara disputes an actual association route, spends her own pursuit supplies, seeks observed leads and offers a nonlethal contest. A resolved dispute closes its current cause.",
      "subversions": [
        "Settle with actual supplies.",
        "Decline or take Shack shelter.",
        "Recover and optionally agree a new rematch after the old contest closes."
      ],
      "noEscalation": "No patron/elder/enemy is spawned because Mara was outclassed or refused."
    },
    "smallInteractions": [
      {
        "detail": "Load tally knowledge differs from actual stock; promises cannot fill a short lot.",
        "claimRefs": [
          "CAMPAIGN Dispatch and account work"
        ]
      },
      {
        "detail": "Jun needs own acquired operation, real kit/funds/body/stamina and a financed employer need.",
        "claimRefs": [
          "src/original_frontier_career_content.js succession"
        ]
      },
      {
        "detail": "A current Mara report differs from private position; concealment spends existing stamina/time under its own command.",
        "claimRefs": [
          "src/frontier_campaign.js rival.report/rival.hide"
        ]
      },
      {
        "detail": "The title alone supplies no blank or skill. Borrowing Eda’s one template requires actual custody; the paid apprentice lesson is a new method; two actual seals settle the same duty once.",
        "claimRefs": [
          "src/backlog_expansion_replacement.js borrow_template/learn_press/press/deliver_duty/return_office"
        ]
      }
    ],
    "texture": {
      "qualification": "O original new wording",
      "voice": [
        {
          "actorId": "roadRival",
          "line": "A fresh map does not make it your road. What are you offering?"
        },
        {
          "actorId": "original_frontier.jun",
          "line": "I know the stop now. I still need something to hold."
        }
      ],
      "room": "At the Village reserve desk a count is crossed out once; the held log still belongs to its named owner.",
      "routine": "Packing, a known paid job, rest and a later report can be enough for an ordinary day.",
      "custom": "A greeting remembers disclosed work; it accepts no next shift.",
      "incidental": "A passing carrier checks a strap and keeps walking; no new quest is attached."
    },
    "people": [
      "roadRival",
      "original_frontier.mira",
      "original_frontier.wen",
      "original_frontier.jun",
      "backlog.registry.eda",
      "backlog.registry.orrin",
      "backlog.registry.bera"
    ],
    "rules": [
      {
        "id": "funded_handoff",
        "claimRefs": [
          "src/original_frontier_career_content.js succession"
        ],
        "scope": "Authoring admissibility for the existing bounded Jun handoff; native command remains authoritative.",
        "requirements": [
          {
            "key": "successorWilling",
            "expected": true,
            "label": "Jun willingly accepts this bounded handoff"
          },
          {
            "key": "successorTaught",
            "expected": true,
            "label": "Jun actually learned the ordinary operation"
          },
          {
            "key": "successorFunded",
            "expected": true,
            "label": "Jun received actual kit and finite funds"
          },
          {
            "key": "successorCompleted",
            "expected": true,
            "label": "Jun completed the funded independent contribution"
          },
          {
            "key": "playerHeardReport",
            "expected": true,
            "label": "the player heard the actual completed-work report"
          }
        ],
        "demandedJoins": [
          "original_frontier.successor_handoff",
          "commitOriginalFrontier",
          "existing simulation costs/power/source/relationship owners"
        ],
        "unresolved": null
      }
    ],
    "recognition": [
      {
        "id": "mara_route_history",
        "claimRefs": [
          "src/frontier_campaign.js rival.begin/rival.settle/rival.report"
        ],
        "scope": "Mara may acknowledge that particular route history; no global fame, private position or source ownership is inferred.",
        "requirements": [
          {
            "key": "sameInstanceActor",
            "expected": true,
            "label": "this is the same roadRival in base.frontier"
          },
          {
            "key": "actualContact",
            "expected": true,
            "label": "Mara is actually contacted"
          },
          {
            "key": "historyKnownToMara",
            "expected": true,
            "label": "Mara witnessed or received this particular history"
          }
        ],
        "demandedJoins": [
          "observer-scoped knowledge/provenance",
          "actual same-instance actor and contact",
          "host belief/correction publication"
        ],
        "unresolved": null
      },
      {
        "id": "orrin_credential",
        "claimRefs": [
          "src/backlog_expansion_replacement.js recognition/belief"
        ],
        "scope": "Orrin’s credential-only interpretation can support his heard claimed name, without proving body/identity or transferring Eda’s source.",
        "requirements": [
          {
            "key": "actualSameOrrin",
            "expected": true,
            "label": "this is the same living Orrin"
          },
          {
            "key": "issuedCredentialActive",
            "expected": true,
            "label": "the player’s actual issued office credential is active"
          },
          {
            "key": "claimActuallyHeard",
            "expected": true,
            "label": "Orrin heard this particular name claim"
          }
        ],
        "demandedJoins": [
          "Backlog actual player-known reports",
          "same original Eda/Orrin/Bera actors",
          "Legibility observer-safe projection"
        ],
        "unresolved": null
      },
      {
        "id": "bera_personal_signs",
        "claimRefs": [
          "src/backlog_expansion_replacement.js recognition/belief"
        ],
        "scope": "Bera’s particular personal comparison supports a local match only; it does not rewrite actor/body identity or tell Orrin the result.",
        "requirements": [
          {
            "key": "actualSameBera",
            "expected": true,
            "label": "this is the same living Bera"
          },
          {
            "key": "personalMemoryKnown",
            "expected": true,
            "label": "Bera holds the actual remembered signs"
          },
          {
            "key": "forearmMarkMatches",
            "expected": true,
            "label": "Bera observed the remembered forearm mark match"
          },
          {
            "key": "personalMethodDemonstrated",
            "expected": true,
            "label": "the actual Eda-signature method was demonstrated at its qualifying mastery"
          }
        ],
        "demandedJoins": [
          "Backlog actual player-known reports",
          "same original Eda/Orrin/Bera actors",
          "Legibility observer-safe projection"
        ],
        "unresolved": null
      }
    ],
    "binding": {
      "actualExistingConsumers": [
        "campaignDefinitions.commands: rival.begin/confront/settle/decline/report/recover/rematch",
        "originalFrontierCareerDefinitions: original_frontier.successor_*",
        "commitOriginalFrontier / existing main durable publisher",
        "Backlog stageReplacementCommand: backlog.replacement.accept_office; validateReplacementRecord, replacementCarrierView and player-safe replacementView"
      ],
      "newProfileConsumer": null,
      "gap": "New source-profile/office evaluator requires Features admission at actual Backlog/connected original scene preview and commit. Existing Backlog native stage/validate owns all transfers. The eight optional roster scenes remain unregistered."
    },
    "sourceGaps": [
      "No face/soul/canonical-role start is selected; only Backlog’s bounded original office/duty substitution is selected.",
      "The new dialogue has no native Ink/observer join yet."
    ],
    "status": {
      "profiles": "implemented-unverified authoring data",
      "pureRules": "implemented-unverified",
      "sceneRegistered": false,
      "nativeBinding": false,
      "playableAcceptance": "deferred"
    },
    "officeRuleContract": {
      "schema": 1,
      "revision": 1,
      "contractId": "backlog.registry.office_substitution",
      "operation": "office_substitution",
      "commandId": "backlog.replacement.accept_office",
      "worldId": "base.frontier",
      "location": "Village",
      "donorId": "backlog.registry.eda",
      "recipientId": "player",
      "officeId": "backlog.registry.seal_steward",
      "dutyId": "backlog.registry.two_seals",
      "donorBodyId": "backlog.registry.eda.body",
      "donorControllerId": "backlog.registry.eda",
      "recipientBodyId": "native.player.body",
      "recipientControllerId": "player",
      "transferred": [
        "institutional office right",
        "accepted office duty"
      ],
      "retained": [
        "actual actor identities",
        "bodies and controllers",
        "personal memories",
        "personal learned mastery",
        "original sources and fuel",
        "personal goods",
        "personal debt",
        "relationships and completed quests"
      ],
      "requiredActualEvidence": [
        "sameLivingParticipantsPresentAndFree",
        "donorOwnsActualOffice",
        "donorOwnsUnperformedDuty",
        "donorWilling",
        "recipientAcceptsDuty",
        "exactTwoSealDutyConserved",
        "personalCarriersRetained"
      ]
    },
    "topology": {
      "qualification": "O actual existing native setting; this profile activates no topology",
      "setting": "YAIRPG original Frontier",
      "physicalWorld": "base.frontier",
      "regions": [
        "Village",
        "earned Shack",
        "Forest road",
        "earned Town corridor"
      ],
      "institutionOrHub": "Existing voluntary Open Counter/association work are local institutions, not automatically a mission multiverse hub.",
      "sourceQualifiedTopology": [
        "Native places in the corridor are regions/locations within the current saved adventure.",
        "Existing original Glasshouse/Tidemark keep their own prototype/entry/native histories; they are not book-world identities."
      ],
      "branchPolicy": "Current adventure persists; a changed institution is an actual causal branch fact, not reset.",
      "missionVsDestination": "Local jobs belong to actual sites/people. An issued mission would be a contract over an instance, not a new copy of its population.",
      "passageDisposition": "Original connected hub/two-destination implementation belongs to the parent’s separate current modules. No new passage from this roster.",
      "unknowns": [
        "No source book metaphysics, new childhood or universal reincarnation/reset selected."
      ],
      "activatedByThisModule": false,
      "portableCarrierPolicy": "Per edge, actual body/controller/memory/method/source/fuel/goods/custody/title/debt/allies/observer scope needs an explicit native contract. No generic conversion or credential jurisdiction.",
      "clockDisposition": "Unsupported absence frozen by current prototype policy, not claimed as source canon. No new browser-closed loss/growth/time settlement."
    },
    "deepChain": {
      "id": "book_roster.chain.frontier.office_continuity",
      "qualification": "O actual Backlog finite source/native owners; new graph metadata unactivated",
      "phases": [
        {
          "id": "terms",
          "people": [
            "backlog.registry.eda",
            "backlog.registry.orrin",
            "backlog.registry.bera"
          ],
          "means": "Living Eda owns one template, personal source/fuel/debt and actual right/two-seal duty. Orrin has finite wage purse; Bera remembers distinct signs.",
          "requires": "Actual same Village, living/free people, native body and heard terms.",
          "commands": [
            "backlog.replacement.meet",
            "backlog.replacement.honest_entry",
            "backlog.replacement.public_delivery"
          ]
        },
        {
          "id": "appointment",
          "people": [
            "backlog.registry.eda",
            "player"
          ],
          "means": "Willing Eda transfers only the same right and unperformed duty.",
          "requires": "Exact snapshot evaluated by evaluateOriginalFrontierOfficeReplacement, then Backlog native stage/validation.",
          "commands": [
            "backlog.replacement.accept_office"
          ]
        },
        {
          "id": "differing_recognition",
          "people": [
            "backlog.registry.orrin",
            "backlog.registry.bera"
          ],
          "means": "Credential inference, personal signs and registry report have different actual audiences.",
          "requires": "Actual claim, issued credential and appropriate local reports.",
          "commands": [
            "backlog.replacement.present_honest",
            "backlog.replacement.claim_eda",
            "backlog.replacement.personal_test",
            "backlog.replacement.registry_test",
            "backlog.replacement.correct_clerk"
          ]
        },
        {
          "id": "means_and_duty",
          "people": [
            "backlog.registry.eda",
            "player",
            "backlog.registry.orrin"
          ],
          "means": "Loaned one real template; separately paid apprentice learning; native sound blanks/stamina; two real seals and finite wage.",
          "requires": "Actual custody/source/body/fuel/stock and office duty; no title-powered fabrication.",
          "commands": [
            "backlog.replacement.borrow_template",
            "backlog.replacement.learn_press",
            "backlog.replacement.ask_eda_press",
            "backlog.replacement.press",
            "backlog.replacement.deliver_duty"
          ]
        },
        {
          "id": "return_and_revisit",
          "people": [
            "backlog.registry.eda",
            "backlog.registry.orrin",
            "backlog.registry.bera"
          ],
          "means": "Returned same tool/right; performed duty stays settled; unperformed duty follows right; learned method and observed history persist.",
          "requires": "Actual loan return and known earlier history.",
          "commands": [
            "backlog.replacement.return_template",
            "backlog.replacement.return_office",
            "backlog.replacement.revisit"
          ]
        }
      ],
      "outcomes": {
        "lawful": "Honest visit/paid actual delivery or actual deputy with performed duty.",
        "refusal": "Honest route accepts no office; current no-cost refusal remains the parent scene’s ordinary exit.",
        "partial": "Return the actual office with unperformed duty after custody return; no fabricated paid completion.",
        "hostile": "False-name claim can cause Bera/Orrin’s scoped suspicion/correction; no violence/fight/automatic wider hostility is supplied."
      },
      "consumer": "Existing Backlog stageReplacementCommand/validateReplacementRecord; parent is admitting the pure appointment rule at preview/commit.",
      "gap": "This metadata is not a new graph scheduler; parent owns connected deeper-chain/hub consumers.",
      "laterGate": "Actual changed beliefs, native template/duty conservation and remembered later encounter.",
      "status": "implemented-unverified immutable authoring graph; native source-world activation explicitly separate"
    }
  },
  {
    "id": "reincarnation-paradise",
    "label": "Reincarnation Paradise",
    "authoringFamily": "source.reincarnation_paradise",
    "nativeWorldId": null,
    "source": {
      "kind": "supplied-novel-MTL",
      "edition": "Calibre 13 English MTL labelled Gemini 2.5 Flash; PD-MTL-67f15d112389-r1",
      "suppliedSourceSha256": "67f15d112389a7e4a1218a9f0888b358c5c8f8bd6ab339d9df4ede50c76636e6",
      "reviewedExtent": "Existing completed dossier: 4,505 distinct bodies read/reviewed/integrated, all 4,656 spine members resolved with 151 exact duplicate dependencies. Readers attested full text; source coordinator sampled selected passages. This worker reused selected dossier sections only.",
      "qualification": "All new MTL findings U for original primary canon. Compilation/translation authenticity and every-detail recall are unproven."
    },
    "baseline": {
      "era": "opening post-first-trial hub; sid26/27 service context",
      "place": "hub paid-guidance/drinks counter, exact room original",
      "entry": "proposed ordinary same-body traveler; no inherited Hunter/employee brand",
      "branch": "Source opening is immutable. This ordinary traveler and guide scene are O; no source protagonist is replaced.",
      "actualState": "No native instance, actor initialization, elapsed time or source-world activation from this module."
    },
    "sourceRefs": [
      {
        "path": "docs/research/novels/trailblaze-reading/paradise-depth/FULL_SYNTHESIS.md",
        "sha256": "0c0a44f59a198653db7012b9c3a4f3878916df6b18d4abb97102c3a05beb6a84",
        "locators": [
          "PR01–PR08",
          "Institutions, ordinary life and material consequences",
          "Edition limits and original authoring"
        ]
      },
      {
        "path": "docs/research/novels/trailblaze-reading/paradise-depth/AUTHORING_BOUNDARIES.md",
        "sha256": "44ca0acbe2cef6a31b57f9ad20c642a319a20c77f0b371b36cd02e10ada6cfa3",
        "locators": [
          "Using this dossier for a playable era"
        ]
      },
      {
        "path": "docs/research/novels/trailblaze-reading/paradise-depth/PEOPLE_AND_INSTITUTIONS.md",
        "sha256": "b2a21f2534ec9386badc984d6b4294bb127d439b5379bfe3e35244b07f387ff4",
        "locators": [
          "Su Xiao / chosen Byakuya alias",
          "Xi/Si Luoluo, employee",
          "Courts, churches, guilds and craft",
          "Civic economies and late new lives"
        ]
      },
      {
        "path": "docs/research/novels/trailblaze-reading/paradise-depth/AGGREGATE_COVERAGE.json",
        "sha256": "149b643f9bc4cc64870bd42d3b7bf1eec9381c17064a349a30f580bebe5865a1",
        "locators": [
          "4505 read/reviewed/integrated distinct bodies; 151 exact duplicates"
        ]
      },
      {
        "path": "docs/research/novels/trailblaze-reading/paradise-depth/FINAL_VALIDATION.json",
        "sha256": "ec81773bdd9597686020cac148666a1f703a06bed114571c261ec12db1e16c5a",
        "locators": [
          "source_pins / known_limits"
        ]
      },
      {
        "path": "docs/worlds/paradise-hub/WORLD_BRIEF.md",
        "sha256": "cb39a4e9f939a834f8e4eba2b25deac46b7ea7f016e11380f4be87a56ba90ed7",
        "locators": [
          "Residence connects to journeys",
          "First build and source gate: dated original Wayfarer Exchange proposal"
        ]
      },
      {
        "path": "docs/research/novels/trailblaze-reading/paradise-depth/CHECKPOINT.md",
        "sha256": "62774ad32bcdb1ecc373208740d1c05b64afa504f340bb269c300b7cb15994d2",
        "locators": [
          "Revision18 source objective complete; all4505distinct/151duplicates; no remaining source gate"
        ]
      }
    ],
    "replacement": [
      {
        "qualification": "U-primary / L-observed dossier",
        "detail": "Su Xiao’s cover alias, displayed protected number and actual Hunter authority are distinct; using the alias does not acquire his actual role.",
        "claimRefs": [
          "PEOPLE_AND_INSTITUTIONS Su Xiao; b0001 C10–C17"
        ]
      },
      {
        "qualification": "O",
        "detail": "An original guide can accept an ordinary customer without giving contractor, Hunter or Employee rights; registry/role access needs exact institutional proof."
      },
      {
        "qualification": "U-primary / L-source late exceptions",
        "detail": "Kaiser’s late new body and Eluna/You You An lodging are separate late cases. Their occupant death, prior-body unknown, patron involvement and compatible inheritance cannot initialize an opening-era visitor.",
        "claimRefs": [
          "PEOPLE_AND_INSTITUTIONS Civic economies and late new lives; FULL_SYNTHESIS History, clocks and the ending"
        ]
      },
      {
        "qualification": "O",
        "detail": "Actual actor/body/controller, memories, acquired source/fuel, learned mastery, goods/custody, rights/duties and observer beliefs remain separate. No appearance/role helper transfers them."
      }
    ],
    "trope": {
      "chain": "An ordinary paid guide provides a scoped answer; a broker competes for the next referral; the customer can ask for evidence before buying another service.",
      "subversions": [
        "Pay for the narrow supported answer.",
        "Decline the next offer without new debt.",
        "Seek a second qualified source rather than force a betrayal."
      ],
      "noEscalation": "Original service competition has no inevitable assassin or omniscient institution reaction."
    },
    "smallInteractions": [
      {
        "detail": "Employee statements and a purportedly notarized tablet stay attributed; paying for guidance does not make the claim true.",
        "claimRefs": [
          "PR04"
        ]
      },
      {
        "detail": "Equipment service, training and attribute allocation use separate actual supports; trial rewards do not supply a universal XP curve.",
        "claimRefs": [
          "PR03–PR04"
        ]
      },
      {
        "detail": "Origin item permissions are stage/function-specific; paid restricted storage is not all-items export.",
        "claimRefs": [
          "PR05"
        ]
      }
    ],
    "texture": {
      "qualification": "O new guide/counter details and wording, informed by PR04 paid services",
      "voice": [
        {
          "actorId": "book_roster.paradise.guide",
          "line": "One question is in the price. The second cup is not."
        },
        {
          "actorId": "book_roster.paradise.guide",
          "line": "That is what the tablet says. I can tell you what happened to me."
        }
      ],
      "room": "A spare cup sits upside down beside a wiped counter; a repair ticket is tucked under the tray.",
      "routine": "The guide takes a paid break and asks about a family errand.",
      "custom": "An alias can be used in conversation while permission is checked separately.",
      "incidental": "A customer asks which shop is open; the answer need not become a mission."
    },
    "people": [
      "book_roster.paradise.guide",
      "book_roster.paradise.broker"
    ],
    "rules": [
      {
        "id": "paid_guidance",
        "claimRefs": [
          "PR04"
        ],
        "scope": "O ordinary guidance-service admissibility informed by qualified PR04; grants no role or verified lore.",
        "requirements": [
          {
            "key": "quoteKnown",
            "expected": true,
            "label": "the particular guide quote is known"
          },
          {
            "key": "guideAvailable",
            "expected": true,
            "label": "the guide is available for that scoped service"
          },
          {
            "key": "paymentAvailable",
            "expected": true,
            "label": "native payment is actually available"
          },
          {
            "key": "claimAttributed",
            "expected": true,
            "label": "the answer retains guide/tablet attribution"
          }
        ],
        "demandedJoins": [
          "new native Paradise instance/person/service IDs",
          "existing paid work/currency and knowledge provenance",
          "Ink continuation; one durable publisher"
        ],
        "unresolved": null
      },
      {
        "id": "soul_lodging_entry",
        "claimRefs": [
          "PEOPLE_AND_INSTITUTIONS Civic economies and late new lives"
        ],
        "scope": "Opening-era soul lodging is not established by the late exceptional case.",
        "requirements": [],
        "demandedJoins": [
          "exact late-case era/body/occupant/source binding"
        ],
        "unresolved": "The selected opening profile lacks a source-qualified lodging/body-transfer operation."
      }
    ],
    "recognition": [
      {
        "id": "guide_permission",
        "claimRefs": [
          "PEOPLE_AND_INSTITUTIONS Su Xiao; PR04"
        ],
        "scope": "O local service recognition only; an alias/displayed number is insufficient for actual Hunter authority.",
        "requirements": [
          {
            "key": "guideReceivedPermissionProof",
            "expected": true,
            "label": "the guide received actual permission proof"
          },
          {
            "key": "proofNamesActualActor",
            "expected": true,
            "label": "the proof applies to this actual actor"
          },
          {
            "key": "proofCoversRequestedService",
            "expected": true,
            "label": "that proof covers the requested service"
          }
        ],
        "demandedJoins": [
          "observer-scoped knowledge/provenance",
          "actual same-instance actor and contact",
          "host belief/correction publication"
        ],
        "unresolved": null
      }
    ],
    "binding": {
      "actualExistingConsumers": [],
      "newProfileConsumer": null,
      "gap": "Native Paradise instance, role/brand permissions, service stock/facility/fuel, player-known claim projection and Ink registration are unactivated. Existing original Exchange is not this novel world."
    },
    "sourceGaps": [
      "Exact institutional authentication/role exceptions for the selected opening service.",
      "Qualified MTL chronology, spellings and compilation seams.",
      "Source-canon voice and original edition authentication remain unverified."
    ],
    "status": {
      "profiles": "implemented-unverified authoring data",
      "pureRules": "implemented-unverified",
      "sceneRegistered": false,
      "nativeBinding": false,
      "playableAcceptance": "deferred"
    },
    "topology": {
      "qualification": "U-primary; completed supplied MTL PR01–PR08, locally observed/notice/testimony channels qualified",
      "setting": "Supplied Reincarnation Paradise continuity",
      "physicalWorld": "Selected opening destination/origin worlds are separate from the hub and its institutions. Exact native instance IDs remain parent-selected.",
      "regions": [
        "Hub residence/services/training facilities",
        "selected source-era destination footprint",
        "origin world under scoped permission"
      ],
      "institutionOrHub": "Paradise assignments, contractor/Hunter/Employee distinctions and actual facilities are separate institutional roles and authority.",
      "sourceQualifiedTopology": [
        "PR01 transports an existing injured body; treatment/role approval are distinct.",
        "PR02 mission completion initiates extraction, interference, repair and arrival, rather than guaranteed exit.",
        "PR03 once-only World Source settlement and named growth facilities differ from local destination welfare.",
        "PR04 supports lived paid-service residence, not merely a mission menu.",
        "PR05 origin restrictions/storage exceptions are stage/function-specific.",
        "PR07 negotiated hidden-task return extension has its own penalties and unresolved timing.",
        "PR08 exceptional linked brands/entitlements do not prove two active minds or universal duplicate rewards."
      ],
      "branchPolicy": "Source chronology immutable; ordinary traveler/guide scene is O. Novel-presented franchise destinations are not primary verification of those franchises.",
      "missionVsDestination": "A mission is an issued obligation/settlement over an actual destination; revisiting must retain changed local people/stock/history.",
      "passageDisposition": "No literal Paradise native hub/destination is activated by this profile. Parent owns finite original hub plus two retained destination native qualification.",
      "unknowns": [
        "Exact original canon/translation authenticity.",
        "Exact global ontology/rate/timing and all-role authority exceptions.",
        "PR07 approximate timing conflict; no universal all-world passage or safe extraction."
      ],
      "activatedByThisModule": false,
      "portableCarrierPolicy": "Per edge, actual body/controller/memory/method/source/fuel/goods/custody/title/debt/allies/observer scope needs an explicit native contract. No generic conversion or credential jurisdiction.",
      "clockDisposition": "Unsupported absence frozen by current prototype policy, not claimed as source canon. No new browser-closed loss/growth/time settlement."
    },
    "deepChain": {
      "id": "book_roster.chain.paradise.service_to_assignment",
      "qualification": "O chain proposal grounded in qualified PR01–PR08, not asserted novel plot",
      "phases": [
        {
          "id": "guide",
          "people": [
            "book_roster.paradise.guide",
            "player"
          ],
          "means": "Paid scoped service and actual guide availability; attributed tablet/personal testimony.",
          "requires": "Known quote and actual payment; no inherited role.",
          "commands": []
        },
        {
          "id": "preparation",
          "people": [
            "book_roster.paradise.guide",
            "book_roster.paradise.broker"
          ],
          "means": "Repair/training/facility bookings and actual equipment, not reward-token conversions.",
          "requires": "Actual compatible body/source/stock and institutional permission.",
          "commands": []
        },
        {
          "id": "issued_terms",
          "people": [
            "unactivated selected issuer",
            "unactivated destination resident"
          ],
          "means": "Issuer objective and resident independent duty/stock are separate.",
          "requires": "Selected actual native issuer/destination/mission era, known alternatives.",
          "commands": []
        },
        {
          "id": "local_outcome",
          "people": [
            "unactivated selected resident/faction"
          ],
          "means": "Finite competing supply and independent local commitments.",
          "requires": "Actual intervention/abstention and source-qualified body/cargo/reach.",
          "commands": []
        },
        {
          "id": "return_dispute_revisit",
          "people": [
            "book_roster.paradise.guide",
            "unactivated issuer/resident"
          ],
          "means": "Extraction stages, once-only settlement and changed local stock/history.",
          "requires": "Real return/settlement/retained history; PR07 timing remains unresolved.",
          "commands": []
        }
      ],
      "outcomes": {
        "lawful": "Supported issued objective plus chosen independent local cooperation.",
        "refusal": "Decline guide/offer before obligation.",
        "partial": "Scoped early withdrawal/extension only under known selected contract, preserving local duties.",
        "hostile": "Breach or disclosure dispute requires exact issuer jurisdiction and actual informed people; no universal hostility."
      },
      "consumer": null,
      "gap": "Source-specific literal Paradise chain unactivated; parent separate original hub/2destination/3chain modules supply current finite native proof.",
      "laterGate": "Issuer success versus welfare, scoped role affordances, staged extraction and changed same-instance revisit.",
      "status": "implemented-unverified immutable authoring graph; native source-world activation explicitly separate"
    }
  },
  {
    "id": "skyrim",
    "label": "Skyrim",
    "authoringFamily": "fan.skyrim",
    "nativeWorldId": null,
    "source": {
      "kind": "game-reference",
      "edition": "skyrim.base.primary.r1",
      "reviewedExtent": "Reuses bounded official-source ledger and selected existing authoring excerpts; no executable/whole-game or full manga text read by this worker.",
      "qualification": "Ledger C claims stay bounded; anime A corroboration stays separate; original local people/era extensions are O. Not a supplied full-novel lane."
    },
    "baseline": {
      "era": "opening_crisis",
      "place": "whiterun_workyards",
      "entry": "traveler_artisan",
      "branch": "fan.skyrim.lower_road; original local side story, source chronology immutable; earlier/parallel snapshots unactivated",
      "actualState": "No native instance, actor initialization, elapsed time or source-world activation from this module."
    },
    "sourceRefs": [
      {
        "path": "docs/worlds/skyrim/WORLD_BRIEF.md",
        "sha256": "188d40c2b40cc03ccb0c6a56da8109959e37075981f0b9244612030e3c4addb9",
        "locators": [
          "Owners and identity",
          "Entry and connected local life"
        ]
      },
      {
        "path": "docs/worlds/skyrim/CAMPAIGN.md",
        "sha256": "f943464572698c190ec0f2402fd3c948b59fd62d485332b50ef45fa9b909a329",
        "locators": [
          "source/invention boundary",
          "campaign promise",
          "contexts/institutions"
        ]
      },
      {
        "path": "docs/worlds/skyrim/INTERACTIONS.md",
        "sha256": "f79be62e19c907866e9d0208d36d866e3d0da99eb28c337501f6f68240339f9e",
        "locators": [
          "People, means and voice",
          "Compact reaction matrix"
        ]
      },
      {
        "path": "docs/worlds/skyrim/SOURCE_LEDGER.md",
        "sha256": "2820aaffdf7ab84eb68401fe8b90418563cf8c05b8108187544b39b87a2774f3",
        "locators": [
          "S1b",
          "S1c",
          "S2",
          "S4",
          "SU1",
          "SU3",
          "SU4",
          "SU5",
          "SU6"
        ]
      }
    ],
    "replacement": [
      {
        "qualification": "O",
        "detail": "Runa can recognize witnessed fitting work without treating good armor as College membership. Orven inspects the actual eligible specimen, not an assumed lineage."
      },
      {
        "qualification": "O",
        "detail": "Replacing a dispatcher or claiming Teren’s archive title needs an explicit local lease/right/debt transfer; the predecessor survives unless actual history resolves otherwise."
      },
      {
        "qualification": "C source principle; O local recipe",
        "detail": "Destructive study consumes the actual legally held specimen. Replacing its physical housing is not buying a reusable enchantment cartridge.",
        "claimRefs": [
          "S1b/S1c; SU1"
        ]
      },
      {
        "qualification": "O",
        "detail": "Dragonborn status, Shouts and soul/occupant replacement are not granted by appearance or entry."
      },
      {
        "qualification": "O",
        "detail": "Actual actor/body/controller, memories, acquired source/fuel, learned mastery, goods/custody, rights/duties and observer beliefs remain separate. No appearance/role helper transfers them."
      }
    ],
    "trope": {
      "chain": "Competing civilian/militia orders exhaust Runa’s bench; Odda protects timber rights; Teren offers a partial title ledger and financed survey.",
      "subversions": [
        "Fund dry stock and capacity.",
        "Let Runa choose under her own financed policy.",
        "Resolve a particular lost delivery by compensation, retaining its history."
      ],
      "noEscalation": "A refused exclusive corridor does not summon an angry hidden elder."
    },
    "smallInteractions": [
      {
        "detail": "Study destroys one legally owned eligible ring; later craft needs a known compatible effect, actual blank gear and filled gem. Ring-to-hauling-boots remains O pending SU1.",
        "claimRefs": [
          "S1b/S1c/SU1"
        ]
      },
      {
        "detail": "Worn and weapon enchantments differ in recharge behavior; no universal fuel/module rule.",
        "claimRefs": [
          "S1c"
        ]
      },
      {
        "detail": "Orven’s teaching and escort compete for his actual availability.",
        "claimRefs": [
          "INTERACTIONS study/supply, O"
        ]
      }
    ],
    "texture": {
      "qualification": "O original local people/details/new wording",
      "voice": [
        {
          "actorId": "skyrim.runa",
          "line": "The bent nails go in that tin. Their ambitions are no longer our problem."
        },
        {
          "actorId": "skyrim.orven",
          "line": "A loan is not permission to destroy it. Ask its owner first."
        }
      ],
      "room": "Two sorting tins and drying timber crowd Runa’s bench.",
      "routine": "Odda counts paid shifts before accepting another freight promise.",
      "custom": "A familiar supplier still waits for a free bench; the greeting waives no wage.",
      "incidental": "A hauler shakes water from a boot liner while waiting for a quote."
    },
    "people": [
      "skyrim.runa",
      "skyrim.orven",
      "skyrim.odda",
      "skyrim.teren"
    ],
    "rules": [
      {
        "id": "destructive_study",
        "claimRefs": [
          "S1b/S1c"
        ],
        "scope": "C bounded study principle with O appointment; no destruction or knowledge is performed.",
        "requirements": [
          {
            "key": "specimenLegallyOwned",
            "expected": true,
            "label": "the exact specimen is legally owned for destructive study"
          },
          {
            "key": "eligibleEffectConfirmed",
            "expected": true,
            "label": "the selected effect/study eligibility is confirmed"
          },
          {
            "key": "destructionAccepted",
            "expected": true,
            "label": "the actual loss is explicitly accepted"
          },
          {
            "key": "enchanterAvailable",
            "expected": true,
            "label": "the local enchanter appointment is available"
          }
        ],
        "demandedJoins": [
          "new independent native world/person/stock/service binding",
          "existing method/body/source/fuel and item/custody owners",
          "observer-specific claims/memories and Ink admission",
          "one durable host publisher"
        ],
        "unresolved": null
      },
      {
        "id": "ring_to_hauling_boots",
        "claimRefs": [
          "SU1"
        ],
        "scope": "Exact canonical hauling recipe is unresolved.",
        "requirements": [],
        "demandedJoins": [
          "new independent native world/person/stock/service binding",
          "existing method/body/source/fuel and item/custody owners",
          "observer-specific claims/memories and Ink admission",
          "one durable host publisher"
        ],
        "unresolved": "SU1 has no verified exact ring effect/equipment pairing."
      }
    ],
    "recognition": [
      {
        "id": "runa_work",
        "claimRefs": [
          "INTERACTIONS reaction matrix, O"
        ],
        "scope": "Runa acknowledges particular work, without inferring College rank or private enchantment.",
        "requirements": [
          {
            "key": "sameInstanceActor",
            "expected": true,
            "label": "this is the same Runa"
          },
          {
            "key": "actualContact",
            "expected": true,
            "label": "Runa is actually contacted"
          },
          {
            "key": "runaWitnessedWork",
            "expected": true,
            "label": "Runa witnessed or received this particular completed work"
          }
        ],
        "demandedJoins": [
          "observer-scoped knowledge/provenance",
          "actual same-instance actor and contact",
          "host belief/correction publication"
        ],
        "unresolved": null
      }
    ],
    "binding": {
      "actualExistingConsumers": [],
      "newProfileConsumer": null,
      "gap": "Skyrim independent native instance, body/source/stock/service/observer bindings and registered Ink scene remain unactivated. Existing generic worlds do not activate this profile."
    },
    "sourceGaps": [
      "SU1",
      "SU3",
      "SU4",
      "SU5",
      "SU6"
    ],
    "status": {
      "profiles": "implemented-unverified authoring data",
      "pureRules": "implemented-unverified",
      "sceneRegistered": false,
      "nativeBinding": false,
      "playableAcceptance": "deferred"
    },
    "topology": {
      "qualification": "Bounded S1–S3 source anchors; local topology O",
      "setting": "Skyrim base primary r1, DLC/Creations excluded",
      "physicalWorld": "One selected source setting, ordinary visitor",
      "regions": [
        "Whiterun workyards O",
        "Jorrvaskr source anchor / supplier annex O",
        "Winterhold/College source anchor / depot O",
        "pass refuge O"
      ],
      "institutionOrHub": "College/Companions are bounded institutions, not a universal mission-world hub.",
      "sourceQualifiedTopology": [
        "S2 Whiterun/Jorrvaskr and Winterhold/College are place/institution anchors.",
        "A local road/refuge/archive is not automatically a separate universe."
      ],
      "branchPolicy": "opening_crisis local side story; prior_generation is separately authored O history, not a time rewind.",
      "missionVsDestination": "A hauling contract uses real local roads/sites and has its own issuer; refusal does not regenerate the cart or ring.",
      "passageDisposition": "Cross-world method/cargo uses explicit actual support/custody; no canon portal/subworld travel is supplied by the bounded ledger.",
      "unknowns": [
        "SU5 exact source eras/history.",
        "SU4/SU6 dragon/source/soul/exceptional realm passage or revival."
      ],
      "activatedByThisModule": false,
      "portableCarrierPolicy": "Per edge, actual body/controller/memory/method/source/fuel/goods/custody/title/debt/allies/observer scope needs an explicit native contract. No generic conversion or credential jurisdiction.",
      "clockDisposition": "Unsupported absence frozen by current prototype policy, not claimed as source canon. No new browser-closed loss/growth/time settlement."
    },
    "deepChain": {
      "id": "book_roster.chain.skyrim.bench_to_road_compact",
      "qualification": "O local campaign branch, S1b/S1c constraint retained",
      "phases": [
        {
          "id": "cart",
          "people": [
            "skyrim.runa"
          ],
          "means": "Damaged real cart, finite bench/timber and medicine shipment.",
          "requires": "Known quote, actual cart/stock and booking.",
          "commands": []
        },
        {
          "id": "study_or_escort",
          "people": [
            "skyrim.orven",
            "skyrim.serevyn"
          ],
          "means": "Legally held eligible ring/gem/boots or Orven’s paid finite escort.",
          "requires": "SU1 pairing resolved or recipe explicitly O; actual loss/fuel.",
          "commands": []
        },
        {
          "id": "competing_orders",
          "people": [
            "skyrim.odda",
            "skyrim.runa"
          ],
          "means": "Timber rights and real civilian/militia orders exceed capacity.",
          "requires": "Actual funded demand and known affected buyers.",
          "commands": []
        },
        {
          "id": "title_audit",
          "people": [
            "skyrim.teren"
          ],
          "means": "Partial archive ledger and one financed survey, not proof of office.",
          "requires": "Provenance and particular lawful rights before exclusive/public terms.",
          "commands": []
        },
        {
          "id": "road_return",
          "people": [
            "skyrim.runa",
            "skyrim.serevyn"
          ],
          "means": "Surviving shipment/loan/property and particular disclosed delivery memory.",
          "requires": "Same-instance return; compensated loss remains in earlier history.",
          "commands": []
        }
      ],
      "outcomes": {
        "lawful": "Fund civilian compact or lawful exclusive corridor under real rights.",
        "refusal": "Keep ring, decline shipment/management and leave ordinary mill work viable.",
        "partial": "Prepare only sound stock or compensate a missed accepted delivery without resetting it.",
        "hostile": "Separately authorized supported coercion can meet actual local refusal/patrol; no infinite patron chain."
      },
      "consumer": null,
      "gap": "Native Skyrim instance/services/stock/arc bindings unactivated.",
      "laterGate": "Consumed ring, route/bench allocations, affected buyer knowledge and actual return history.",
      "status": "implemented-unverified immutable authoring graph; native source-world activation explicitly separate"
    }
  },
  {
    "id": "fallout4",
    "label": "Fallout 4",
    "authoringFamily": "fallout",
    "nativeWorldId": null,
    "source": {
      "kind": "game-reference",
      "edition": "fallout4.commonwealth.primary.r1",
      "reviewedExtent": "Reuses bounded official-source ledger and selected existing authoring excerpts; no executable/whole-game or full manga text read by this worker.",
      "qualification": "Ledger C claims stay bounded; anime A corroboration stays separate; original local people/era extensions are O. Not a supplied full-novel lane."
    },
    "baseline": {
      "era": "era2287",
      "place": "riverpocket",
      "entry": "visitor",
      "branch": "fallout.waterline.branch; original local side story, source chronology immutable; earlier/parallel snapshots unactivated",
      "actualState": "No native instance, actor initialization, elapsed time or source-world activation from this module."
    },
    "sourceRefs": [
      {
        "path": "docs/worlds/fallout/WORLD_BRIEF.md",
        "sha256": "e77f0f0f53639956d1ec9e3cdc6f5dbf09398520ffcd27266c2c2d422e3f791f",
        "locators": [
          "Owners and identity",
          "Entry and connected local life"
        ]
      },
      {
        "path": "docs/worlds/fallout/CAMPAIGN.md",
        "sha256": "f5a7adccf642dcd955cda490e142a317c53380e35b601e5e496fc90ba052d790",
        "locators": [
          "source/invention boundary",
          "campaign promise",
          "contexts/institutions"
        ]
      },
      {
        "path": "docs/worlds/fallout/INTERACTIONS.md",
        "sha256": "6ca0f95460378e32a5a630d17c78dfbacbfee3ff54d201badfcb700985ffa322",
        "locators": [
          "People, means and voice",
          "Compact reaction matrix"
        ]
      },
      {
        "path": "docs/worlds/fallout/SOURCE_LEDGER.md",
        "sha256": "d4c4eed832b8937879df19dae543de538dd5e7ab839bc4fa28c36d9fc5455c2f",
        "locators": [
          "F1",
          "F2",
          "F3",
          "F4",
          "F6",
          "FU1",
          "FU2",
          "FU3",
          "FU4",
          "FU5",
          "FU6"
        ]
      }
    ],
    "replacement": [
      {
        "qualification": "O",
        "detail": "A uniform suggests affiliation to local observers; credential/witness checks are separate. No Sole Survivor family, rank or quest credit transfers."
      },
      {
        "qualification": "O",
        "detail": "A Water Line service-right holder changes only under a real local issuer’s terms; a replacement inherits only explicit obligations and prior disclosed history."
      },
      {
        "qualification": "O",
        "detail": "A removed part stays one object with condition/custody. A salvage/refit does not refund already consumed diagnostic charge or fuel."
      },
      {
        "qualification": "U",
        "detail": "Synth creation, cognition, occupant replacement and memories need FU4 primary scenes; faction existence is not a universal body-copy recipe.",
        "claimRefs": [
          "FU4"
        ]
      },
      {
        "qualification": "O",
        "detail": "Actual actor/body/controller, memories, acquired source/fuel, learned mastery, goods/custody, rights/duties and observer beliefs remain separate. No appearance/role helper transfers them."
      }
    ],
    "trope": {
      "chain": "Orren controls a hoist/crew and wants a joint service claim; Mina can offer an actual manual bypass; Imani tests water while Edda guards freight privacy.",
      "subversions": [
        "Negotiate joint reservation with actual goods and duty.",
        "Build the narrow bypass.",
        "Dispute the invoice with evidence or refuse before commitment."
      ],
      "noEscalation": "An exposed local claim does not force all four factions into hostility."
    },
    "smallInteractions": [
      {
        "detail": "A sufficient lift moves a beam but cannot certify clean water; sample, radiation exposure and ordinary wounds are different questions.",
        "claimRefs": [
          "F2/F3; CAMPAIGN O procedures"
        ]
      },
      {
        "detail": "Fit must be established for the particular rig; no T-series interchangeable parts or core manufacture inferred.",
        "claimRefs": [
          "F2/FU1/FU2"
        ]
      },
      {
        "detail": "Completed diagnostic charges remain spent after refit; new certification uses real batch stock and bay capacity.",
        "claimRefs": [
          "INTERACTIONS sample/rig, O"
        ]
      }
    ],
    "texture": {
      "qualification": "O original Water Line cast/details/new wording",
      "voice": [
        {
          "actorId": "fallout.mina",
          "line": "It fits the sketch. The bolts would like a second opinion."
        },
        {
          "actorId": "fallout.imani",
          "line": "This sample failed. It has not told us who to blame."
        }
      ],
      "room": "A marked clean tray shares the bay with a wrench rack; a wet invoice dries near the gauge.",
      "routine": "Mina books one bay, Imani triages real patients, and Edda meets between freight legs.",
      "custom": "A familiar repair customer still owes their accepted invoice.",
      "incidental": "A farmer asks how many certified allotments actually arrived, then returns to planting."
    },
    "people": [
      "fallout.mina",
      "fallout.imani",
      "fallout.orren",
      "fallout.edda"
    ],
    "rules": [
      {
        "id": "original_rig_refit",
        "claimRefs": [
          "F2/F6; INTERACTIONS rig"
        ],
        "scope": "O Water Line part-refit authoring guard; does not specify canonical T-series compatibility.",
        "requirements": [
          {
            "key": "partCustodyValid",
            "expected": true,
            "label": "the exact part is legally held"
          },
          {
            "key": "originalFitTested",
            "expected": true,
            "label": "fit for this original rig is actually tested"
          },
          {
            "key": "actualToolAndLabor",
            "expected": true,
            "label": "the quoted tools and labor exist"
          },
          {
            "key": "oldPartAccounted",
            "expected": true,
            "label": "the removed physical part has one actual holder"
          },
          {
            "key": "spentSupplyRetained",
            "expected": true,
            "label": "spent diagnostic/fuel cost remains recorded"
          }
        ],
        "demandedJoins": [
          "new independent native world/person/stock/service binding",
          "existing method/body/source/fuel and item/custody owners",
          "observer-specific claims/memories and Ink admission",
          "one durable host publisher"
        ],
        "unresolved": null
      },
      {
        "id": "synth_occupant_replacement",
        "claimRefs": [
          "FU4"
        ],
        "scope": "Source-specific synth identity/body replacement is unresolved.",
        "requirements": [],
        "demandedJoins": [
          "new independent native world/person/stock/service binding",
          "existing method/body/source/fuel and item/custody owners",
          "observer-specific claims/memories and Ink admission",
          "one durable host publisher"
        ],
        "unresolved": "FU4 needs exact creation/cognition/transfer scenes; no universal recipe is inspected."
      }
    ],
    "recognition": [
      {
        "id": "vale_service_claim",
        "claimRefs": [
          "INTERACTIONS faction recognition/claim, O"
        ],
        "scope": "O service-right recognition, independent of uniform, suit silhouette and family biography.",
        "requirements": [
          {
            "key": "issuerProofReceived",
            "expected": true,
            "label": "the local observer received issuer proof"
          },
          {
            "key": "proofCoversThisService",
            "expected": true,
            "label": "proof covers the actual Water Line service"
          },
          {
            "key": "actorAndInstanceMatch",
            "expected": true,
            "label": "actor and instance match that proof"
          }
        ],
        "demandedJoins": [
          "observer-scoped knowledge/provenance",
          "actual same-instance actor and contact",
          "host belief/correction publication"
        ],
        "unresolved": null
      }
    ],
    "binding": {
      "actualExistingConsumers": [],
      "newProfileConsumer": null,
      "gap": "Fallout 4 independent native instance, body/source/stock/service/observer bindings and registered Ink scene remain unactivated. Existing generic worlds do not activate this profile."
    },
    "sourceGaps": [
      "FU1",
      "FU2",
      "FU3",
      "FU4",
      "FU5",
      "FU6"
    ],
    "status": {
      "profiles": "implemented-unverified authoring data",
      "pureRules": "implemented-unverified",
      "sceneRegistered": false,
      "nativeBinding": false,
      "playableAcceptance": "deferred"
    },
    "topology": {
      "qualification": "F1 base-era anchor; local 2282/parallel topology O",
      "setting": "Fallout 4 base Commonwealth 2287, no chosen faction ending",
      "physicalWorld": "Commonwealth source setting; O Water Line footprint",
      "regions": [
        "river pocket",
        "harbor pier",
        "farm settlement",
        "refuge and faction annexes O"
      ],
      "institutionOrHub": "Four faction anchors have distinct means/rights; none is selected as universal travel/mission issuer.",
      "sourceQualifiedTopology": [
        "F1 cryogenic pre-war protagonist continuity is not a universal traveler reset or new universe.",
        "2282 local prehistory and parallel 2287 instances are O separate snapshots; later stock/actors cannot be copied backward."
      ],
      "branchPolicy": "Water Line public/private network changes actual downstream supply/rights.",
      "missionVsDestination": "A utility service/invoice is a local obligation; a hub mission cannot settle every water promise.",
      "passageDisposition": "No selected technological body-transfer, simulation-as-physical-world or universal core/fuel conversion.",
      "unknowns": [
        "FU4 exact synth cognition/body/occupant transfer.",
        "FU6 era/faction altered-event response."
      ],
      "activatedByThisModule": false,
      "portableCarrierPolicy": "Per edge, actual body/controller/memory/method/source/fuel/goods/custody/title/debt/allies/observer scope needs an explicit native contract. No generic conversion or credential jurisdiction.",
      "clockDisposition": "Unsupported absence frozen by current prototype policy, not claimed as source canon. No new browser-closed loss/growth/time settlement."
    },
    "deepChain": {
      "id": "book_roster.chain.fallout.sample_to_supply_rights",
      "qualification": "O Water Line campaign; F2/F3/F4 bounded anchors",
      "phases": [
        {
          "id": "sample",
          "people": [
            "fallout.imani",
            "fallout.mina"
          ],
          "means": "One real sample, diagnostic charge and controlled bay.",
          "requires": "Actual measured test with uncertainty retained.",
          "commands": []
        },
        {
          "id": "bypass_or_claim",
          "people": [
            "fallout.orren",
            "fallout.mina"
          ],
          "means": "Orren’s hoist/crew versus actual fitted manual bypass.",
          "requires": "Service-right terms/goods or actual tools/support.",
          "commands": []
        },
        {
          "id": "network_supply",
          "people": [
            "fallout.hana",
            "fallout.edda"
          ],
          "means": "Farm allotments, two freight safe stops and one financed convoy.",
          "requires": "Actual certified output and privacy/witness conditions.",
          "commands": []
        },
        {
          "id": "rights_audit",
          "people": [
            "fallout.vale"
          ],
          "means": "Invoices, inspection tools, credit and limited buying authority.",
          "requires": "Actual issuer proof/rights and tested supply capacity.",
          "commands": []
        },
        {
          "id": "water_return",
          "people": [
            "fallout.mina",
            "fallout.imani",
            "fallout.orren"
          ],
          "means": "Same parts, spent tests, known delivered allotments and owed accepted duty.",
          "requires": "Same native instance and actual disclosed prior work.",
          "commands": []
        }
      ],
      "outcomes": {
        "lawful": "Public utility or knowingly accepted lawful joint/private service.",
        "refusal": "Decline joint debt; ordinary repair/salvage remains.",
        "partial": "A real lift or paid diagnosis can succeed without certified water/network peace.",
        "hostile": "Coercion/route disclosure changes only actual witnessed local targets and means; no generic faction chase."
      },
      "consumer": null,
      "gap": "Native Water Line rights/test/part/stock/faction-envoy consumers unactivated.",
      "laterGate": "Gross versus actual output, no refit charge refund, local welfare versus claim completion.",
      "status": "implemented-unverified immutable authoring graph; native source-world activation explicitly separate"
    }
  },
  {
    "id": "elden-ring",
    "label": "Elden Ring",
    "authoringFamily": "fan.elden_ring",
    "nativeWorldId": null,
    "source": {
      "kind": "game-reference",
      "edition": "eldenring.base.primary.r1",
      "reviewedExtent": "Reuses bounded official-source ledger and selected existing authoring excerpts; no executable/whole-game or full manga text read by this worker.",
      "qualification": "Ledger C claims stay bounded; anime A corroboration stays separate; original local people/era extensions are O. Not a supplied full-novel lane."
    },
    "baseline": {
      "era": "shattered_return",
      "place": "limgrave_waystation",
      "entry": "living_outsider",
      "branch": "er.ferry_branch; original local side story, source chronology immutable; earlier/parallel snapshots unactivated",
      "actualState": "No native instance, actor initialization, elapsed time or source-world activation from this module."
    },
    "sourceRefs": [
      {
        "path": "docs/worlds/elden-ring/WORLD_BRIEF.md",
        "sha256": "0fdfd4ca718705fa9ea8923ef6483538e9a8399150fdb5a90b9a307fbfbe1678",
        "locators": [
          "Owners and identity",
          "Entry and connected local life"
        ]
      },
      {
        "path": "docs/worlds/elden-ring/CAMPAIGN.md",
        "sha256": "d841e8d552eece42d162816aa24bcd1018837ddbf2b44c8fa1d057216947d8ad",
        "locators": [
          "source/invention boundary",
          "campaign promise",
          "contexts/institutions"
        ]
      },
      {
        "path": "docs/worlds/elden-ring/INTERACTIONS.md",
        "sha256": "bd6101d723660b8fac5028588e6ab96d5abcb700ae7b8768b10277e852b9fecd",
        "locators": [
          "People, means and voice",
          "Compact reaction matrix"
        ]
      },
      {
        "path": "docs/worlds/elden-ring/SOURCE_LEDGER.md",
        "sha256": "46799b854b3b6cb7c000c9796461e319132dbde033560577a557af2d1fca1052",
        "locators": [
          "E1",
          "E2a",
          "E2b",
          "E2c",
          "E6",
          "E7",
          "EU1",
          "EU2",
          "EU3",
          "EU4",
          "EU5",
          "EU6"
        ]
      }
    ],
    "replacement": [
      {
        "qualification": "O",
        "detail": "Ilen’s seal is a custody loan, not transfer of office or divine authority. A matched record and actual witness are required by this original rite."
      },
      {
        "qualification": "O",
        "detail": "Another person cannot take a lost witness’s testimony by costume or parallel-history memory; the actual loss remains in this instance."
      },
      {
        "qualification": "C scoped mechanic; U outsider rule",
        "detail": "Source-player grace/Stake recovery is not every NPC’s extra life or the living outsider’s guaranteed resurrection.",
        "claimRefs": [
          "E2c/EU3"
        ]
      },
      {
        "qualification": "O",
        "detail": "Replacing an arm configuration still checks weapon eligibility, actual support and condition; Great Rune authority is not an equipment slot."
      },
      {
        "qualification": "O",
        "detail": "Actual actor/body/controller, memories, acquired source/fuel, learned mastery, goods/custody, rights/duties and observer beliefs remain separate. No appearance/role helper transfers them."
      }
    ],
    "trope": {
      "chain": "The Warden uses a bounded writ and actual patrol to seize indexed cargo; Ilen and Kest can preserve lawful testimony or arrange another route.",
      "subversions": [
        "Use a funded legal testimony route.",
        "Pay for an actual decoy/alternative using real stock.",
        "Overcome the fixed patrol with genuinely sufficient force, retaining custody and witnesses."
      ],
      "noEscalation": "A defeated toll patrol is not replaced by a demigod just to restore the source plot."
    },
    "smallInteractions": [
      {
        "detail": "The living willing witness is E6 O local rite; it is not a global ban on spirit testimony.",
        "claimRefs": [
          "E6; INTERACTIONS entry"
        ]
      },
      {
        "detail": "Sorcery needs actual learned method/catalyst/FP support; ashes need represented local monument support.",
        "claimRefs": [
          "E2a/E2b"
        ]
      },
      {
        "detail": "Weapon ash/affinity eligibility is specific; armor does not inherit the weapon reinforcement ladder.",
        "claimRefs": [
          "E7"
        ]
      }
    ],
    "texture": {
      "qualification": "O original waystation/cast/details/new wording",
      "voice": [
        {
          "actorId": "er.ilen",
          "line": "I can lend the seal. I cannot lend you someone else’s consent."
        },
        {
          "actorId": "er.sura",
          "line": "Fold it here. Rain does not read the label saying dry."
        }
      ],
      "room": "Dry linen, a resin pot and a partly copied register occupy the sheltered bench.",
      "routine": "Kest checks the actual departure while Ilen finishes an accepted entry.",
      "custom": "A familiar bearer still brings the same lawful cargo record.",
      "incidental": "A porter moves a stool out of a drip; the stool has no hidden relic payoff."
    },
    "people": [
      "er.ilen",
      "er.kest",
      "er.sura",
      "er.warden"
    ],
    "rules": [
      {
        "id": "original_witnessed_entry",
        "claimRefs": [
          "E6; INTERACTIONS entry"
        ],
        "scope": "E6 O local ferry rite only; no general spirit/grace law.",
        "requirements": [
          {
            "key": "urnAndRecordMatch",
            "expected": true,
            "label": "actual urn and lawful record match"
          },
          {
            "key": "custodyValid",
            "expected": true,
            "label": "cargo custody is valid"
          },
          {
            "key": "sealLoanValid",
            "expected": true,
            "label": "the actual seal loan is valid"
          },
          {
            "key": "witnessLiving",
            "expected": true,
            "label": "the local rite’s witness is actually living"
          },
          {
            "key": "witnessWilling",
            "expected": true,
            "label": "that witness presently consents"
          }
        ],
        "demandedJoins": [
          "new independent native world/person/stock/service binding",
          "existing method/body/source/fuel and item/custody owners",
          "observer-specific claims/memories and Ink admission",
          "one durable host publisher"
        ],
        "unresolved": null
      },
      {
        "id": "outsider_resurrection",
        "claimRefs": [
          "E2c/EU3"
        ],
        "scope": "A source-player recovery mechanic does not establish the selected outsider’s return from death.",
        "requirements": [],
        "demandedJoins": [
          "new independent native world/person/stock/service binding",
          "existing method/body/source/fuel and item/custody owners",
          "observer-specific claims/memories and Ink admission",
          "one durable host publisher"
        ],
        "unresolved": "EU3 needs selected actor/form/method evidence and a native recovery policy."
      }
    ],
    "recognition": [
      {
        "id": "ilen_entry",
        "claimRefs": [
          "E6; INTERACTIONS entry/return, O"
        ],
        "scope": "Ilen recognizes this original rite’s entry, not universal divine authority or the claimant’s soul identity.",
        "requirements": [
          {
            "key": "sameInstanceActor",
            "expected": true,
            "label": "this is the same Ilen and local register"
          },
          {
            "key": "recordActuallyInspected",
            "expected": true,
            "label": "Ilen inspected the matching lawful record"
          },
          {
            "key": "witnessConsentKnown",
            "expected": true,
            "label": "Ilen received the actual living witness consent"
          }
        ],
        "demandedJoins": [
          "observer-scoped knowledge/provenance",
          "actual same-instance actor and contact",
          "host belief/correction publication"
        ],
        "unresolved": null
      }
    ],
    "binding": {
      "actualExistingConsumers": [],
      "newProfileConsumer": null,
      "gap": "Elden Ring independent native instance, body/source/stock/service/observer bindings and registered Ink scene remain unactivated. Existing generic worlds do not activate this profile."
    },
    "sourceGaps": [
      "EU1",
      "EU2",
      "EU3",
      "EU4",
      "EU5",
      "EU6"
    ],
    "status": {
      "profiles": "implemented-unverified authoring data",
      "pureRules": "implemented-unverified",
      "sceneRegistered": false,
      "nativeBinding": false,
      "playableAcceptance": "deferred"
    },
    "topology": {
      "qualification": "E1/E3 regional backdrop; E6 local rites O",
      "setting": "2022 Elden Ring base premise, no ending/DLC/Nightreign",
      "physicalWorld": "Selected base setting; O waystation footprint",
      "regions": [
        "Limgrave",
        "Liurnia",
        "waystation/register-house/annex O"
      ],
      "institutionOrHub": "Original ferry/register circle is local civic authority, not divine or universal realm passage.",
      "sourceQualifiedTopology": [
        "Source regional names and grace/Stake support do not automatically define separate universes or temporal branches.",
        "The source player recovery mechanic does not reset the outsider’s entire instance/population."
      ],
      "branchPolicy": "shattered_return side story; earlier convoy/parallel history is a separately authored O snapshot.",
      "missionVsDestination": "The witnessed ferry entry/urn job is one local claim; alternate approaches settle it once in the same history.",
      "passageDisposition": "Actual cargo, witness and supported source/tool contact remain distinct; no portable grace/monument or outsider resurrection edge selected.",
      "unknowns": [
        "EU3 death/grace/exceptional revival.",
        "EU5 exact historical topology.",
        "EU6 spiritual/imported-soul/Great Rune authority."
      ],
      "activatedByThisModule": false,
      "portableCarrierPolicy": "Per edge, actual body/controller/memory/method/source/fuel/goods/custody/title/debt/allies/observer scope needs an explicit native contract. No generic conversion or credential jurisdiction.",
      "clockDisposition": "Unsupported absence frozen by current prototype policy, not claimed as source canon. No new browser-closed loss/growth/time settlement."
    },
    "deepChain": {
      "id": "book_roster.chain.elden.custody_to_witness_circle",
      "qualification": "E6 O local civic rite; E2/E7 source support remains scoped",
      "phases": [
        {
          "id": "dry_wrap",
          "people": [
            "er.sura",
            "er.kest"
          ],
          "means": "Real linen/resin/bench and Kest’s cart/purse.",
          "requires": "Actual cargo custody and supported wrap/transport work.",
          "commands": []
        },
        {
          "id": "witnessed_entry",
          "people": [
            "er.ilen",
            "er.kest"
          ],
          "means": "One seal loan, matched urn/register and living willing witness.",
          "requires": "Local E6 rite consent, no spirit substitution by default.",
          "commands": []
        },
        {
          "id": "toll_response",
          "people": [
            "er.warden"
          ],
          "means": "Specific writ, actual patrol/reach and seized indexed cargo.",
          "requires": "Seen/report-established seizure; paid decoy/legal route or sufficient force.",
          "commands": []
        },
        {
          "id": "record_audit",
          "people": [
            "er.ilen",
            "er.nessa"
          ],
          "means": "Partial copied register, witnesses and funded lawful reconstruction.",
          "requires": "Actual evidence distinguishes intact record from unverified recollection.",
          "commands": []
        },
        {
          "id": "circle_return",
          "people": [
            "er.ilen",
            "er.kest"
          ],
          "means": "Actual survivors, returned seal and preserved or lost testimony.",
          "requires": "Same-instance history; no parallel witness revival.",
          "commands": []
        }
      ],
      "outcomes": {
        "lawful": "Preserve independent witness circle or accepted civic registry terms.",
        "refusal": "No rite/no loan before commitment; existing lawful held property stays.",
        "partial": "Recover cargo or fund care without restoring lost witness/record.",
        "hostile": "Genuinely stronger supported attack can break the fixed patrol; not create divine authority or replace the dead."
      },
      "consumer": null,
      "gap": "Native ferry/record/witness/patrol/body/source consumers unactivated.",
      "laterGate": "Withdrawn consent, actual lost people, tool return and local rite versus source summon support.",
      "status": "implemented-unverified immutable authoring graph; native source-world activation explicitly separate"
    }
  },
  {
    "id": "naruto",
    "label": "Naruto",
    "authoringFamily": "fan.naruto",
    "nativeWorldId": null,
    "source": {
      "kind": "manga/anime-reference",
      "edition": "naruto.original.1-72.primary.r1",
      "reviewedExtent": "Reuses bounded official-source ledger and selected existing authoring excerpts; no executable/whole-game or full manga text read by this worker.",
      "qualification": "Ledger C claims stay bounded; anime A corroboration stays separate; original local people/era extensions are O. Not a supplied full-novel lane."
    },
    "baseline": {
      "era": "part_one_side_story",
      "place": "leaf_river_yard",
      "entry": "civilian_visitor",
      "branch": "naruto.river_carrier.branch; original local side story, source chronology immutable; earlier/parallel snapshots unactivated",
      "actualState": "No native instance, actor initialization, elapsed time or source-world activation from this module."
    },
    "sourceRefs": [
      {
        "path": "docs/worlds/naruto/WORLD_BRIEF.md",
        "sha256": "4e42a09b6ea51075d0f04fcc6a80bcdf31b8b3ce1f228992b99f86c0c860669c",
        "locators": [
          "Owners and identity",
          "Entry and connected local life"
        ]
      },
      {
        "path": "docs/worlds/naruto/CAMPAIGN.md",
        "sha256": "d9b4af786a4faa084ca9b0172321307fd4e65156a1492a2b65cf1bd4075b40b0",
        "locators": [
          "source/invention boundary",
          "campaign promise",
          "contexts/institutions"
        ]
      },
      {
        "path": "docs/worlds/naruto/INTERACTIONS.md",
        "sha256": "ec6dd4a72c1787384049a7be1e9c1fc2c138a025e82da8276b73f1dcc2d2b59d",
        "locators": [
          "People, means and voice",
          "Compact reaction matrix"
        ]
      },
      {
        "path": "docs/worlds/naruto/SOURCE_LEDGER.md",
        "sha256": "d0636f17f1425b1d3bacd670f31611845243112251e76239bff3299ec8da8004",
        "locators": [
          "N5",
          "N6",
          "N7",
          "N11",
          "N14",
          "NU1",
          "NU2",
          "NU3",
          "NU4",
          "NU6",
          "NU7",
          "NU8"
        ]
      }
    ],
    "replacement": [
      {
        "qualification": "O",
        "detail": "Chika asks who issued a headband/clearance; its appearance alone gives no mission rank, clan relationship or medical competence."
      },
      {
        "qualification": "C/A bounded anchors; U procedure",
        "detail": "Observed signs or borrowed appearance do not supply eye/body/nature/control prerequisites. Kakashi’s actual eye provenance and exceptional later intervention cannot become a general transplant recipe.",
        "claimRefs": [
          "N3/N4/N5/NU2"
        ]
      },
      {
        "qualification": "O",
        "detail": "Replacing a clinic carrier joint preserves its actual stock and tested fit; an ordinary maker differs from a trained chakra operator."
      },
      {
        "qualification": "U",
        "detail": "Body possession, soul occupant transfer, reincarnation and human-puppet source retention need exact original scenes; N7 is not a freely harvested bloodline recipe.",
        "claimRefs": [
          "NU2/NU3/NU4"
        ]
      },
      {
        "qualification": "O",
        "detail": "Actual actor/body/controller, memories, acquired source/fuel, learned mastery, goods/custody, rights/duties and observer beliefs remain separate. No appearance/role helper transfers them."
      }
    ],
    "trope": {
      "chain": "Daigo offers a competing financed convoy; Aki needs a sound carrier; Yae holds only a partial teaching text and asks for a funded trial before supporting a disputed method.",
      "subversions": [
        "Make the ordinary carrier repair.",
        "Pay an actually qualified Toma service.",
        "Share measured evidence or decline the exclusive patron before acceptance."
      ],
      "noEscalation": "A disproven rival claim need not become a clan feud or obligatory exam."
    },
    "smallInteractions": [
      {
        "detail": "Actual fitted frame, learned control and available supported body/source/reserve are distinct from purchasing the puppet.",
        "claimRefs": [
          "N7; INTERACTIONS reaction matrix, O application"
        ]
      },
      {
        "detail": "Chakra control training can be useful without granting medicine; hidden/private instructions are not automatic executable knowledge.",
        "claimRefs": [
          "N6/N14; NU1/NU4"
        ]
      },
      {
        "detail": "Clean clinic stock and actual booking are separate from powerful retrieval output.",
        "claimRefs": [
          "INTERACTIONS carrier, O"
        ]
      }
    ],
    "texture": {
      "qualification": "O original yard/clinic people/details/new wording",
      "voice": [
        {
          "actorId": "naruto.aki",
          "line": "Try the joint with your hand. Paint has a generous view of itself."
        },
        {
          "actorId": "naruto.ren",
          "line": "The tray is clean. Keep the spare linkage on the other bench."
        }
      ],
      "room": "Cloth, spare linkage and a partly repaired carrier occupy Aki’s yard; the clinic keeps a clean work surface.",
      "routine": "Toma books training and escort separately; Chika returns between real freight legs.",
      "custom": "A headband prompts an issuer question, not an automatic salute or lineage grant.",
      "incidental": "A courier folds an inaccurate map small enough to fit a sleeve."
    },
    "people": [
      "naruto.aki",
      "naruto.ren",
      "naruto.toma",
      "naruto.chika",
      "naruto.yae",
      "naruto.daigo"
    ],
    "rules": [
      {
        "id": "original_puppet_retrieval",
        "claimRefs": [
          "N7; WORLD_BRIEF original carrier"
        ],
        "scope": "O ordinary carrier-control application; no precise canonical chakra/thread formula.",
        "requirements": [
          {
            "key": "frameActuallyFitted",
            "expected": true,
            "label": "the actual frame/linkage fits this original task"
          },
          {
            "key": "controlActuallyLearned",
            "expected": true,
            "label": "the operator learned this supported control method"
          },
          {
            "key": "bodyAndSourceSupported",
            "expected": true,
            "label": "the actual operator body/source support is established"
          },
          {
            "key": "reserveAvailable",
            "expected": true,
            "label": "actual supported reserve remains available"
          },
          {
            "key": "operatorAvailable",
            "expected": true,
            "label": "the real operator and booking are available"
          }
        ],
        "demandedJoins": [
          "new independent native world/person/stock/service binding",
          "existing method/body/source/fuel and item/custody owners",
          "observer-specific claims/memories and Ink admission",
          "one durable host publisher"
        ],
        "unresolved": null
      },
      {
        "id": "copy_bloodline_or_organ",
        "claimRefs": [
          "N4/N5/NU2"
        ],
        "scope": "Appearance/observation does not establish a source-acquisition procedure.",
        "requirements": [],
        "demandedJoins": [
          "new independent native world/person/stock/service binding",
          "existing method/body/source/fuel and item/custody owners",
          "observer-specific claims/memories and Ink admission",
          "one durable host publisher"
        ],
        "unresolved": "NU2 original eye/copy/body/transfer exceptions remain uninspected."
      }
    ],
    "recognition": [
      {
        "id": "chika_clearance",
        "claimRefs": [
          "INTERACTIONS attire, O"
        ],
        "scope": "O route recognition only; no clan source, rank transfer or diagnosis.",
        "requirements": [
          {
            "key": "issuerProofReceived",
            "expected": true,
            "label": "Chika received actual clearance issuer proof"
          },
          {
            "key": "actualActorNamed",
            "expected": true,
            "label": "proof applies to this actual actor"
          },
          {
            "key": "routeWithinClearance",
            "expected": true,
            "label": "clearance covers this particular route"
          }
        ],
        "demandedJoins": [
          "observer-scoped knowledge/provenance",
          "actual same-instance actor and contact",
          "host belief/correction publication"
        ],
        "unresolved": null
      }
    ],
    "binding": {
      "actualExistingConsumers": [],
      "newProfileConsumer": null,
      "gap": "Naruto independent native instance, body/source/stock/service/observer bindings and registered Ink scene remain unactivated. Existing generic worlds do not activate this profile."
    },
    "sourceGaps": [
      "NU1",
      "NU2",
      "NU3",
      "NU4",
      "NU6",
      "NU7",
      "NU8"
    ],
    "status": {
      "profiles": "implemented-unverified authoring data",
      "pureRules": "implemented-unverified",
      "sceneRegistered": false,
      "nativeBinding": false,
      "playableAcceptance": "deferred"
    },
    "topology": {
      "qualification": "Bounded manga C plus named anime A; local side story O",
      "setting": "Original manga 1–72 / 1–700; excluded sequel/filler separate",
      "physicalWorld": "Selected original source continuity; Leaf river-yard footprint O",
      "regions": [
        "river workshop",
        "clinic",
        "known route/annexes O"
      ],
      "institutionOrHub": "Village mission rank/duty and ordinary clinic/craft access differ; no Paradise-style mission multiverse imposed.",
      "sourceQualifiedTopology": [
        "Summoning teaching N13 is a bounded learning anchor, not a complete portal/entity/consent topology.",
        "part_two_relief and predecessor history need their own actor-age/body/source snapshots; era change is not a reset."
      ],
      "branchPolicy": "part_one_side_story is O; affected shipments, mentorship and local patron causes remain contingent after intervention.",
      "missionVsDestination": "A courier/clinic mission uses actual stock and issuer terms; victory cannot certify supplies or grant lineage.",
      "passageDisposition": "Cross-world tools/knowledge require supported actual source/body/consent; no infinite clones or free pact-partner transfer.",
      "unknowns": [
        "NU5 exact summoning/sage/tailed-beast spaces and entry rules.",
        "NU2/NU4 possession/reanimation/eye/chakra-body exceptions.",
        "NU6 exact era population/leadership/organs."
      ],
      "activatedByThisModule": false,
      "portableCarrierPolicy": "Per edge, actual body/controller/memory/method/source/fuel/goods/custody/title/debt/allies/observer scope needs an explicit native contract. No generic conversion or credential jurisdiction.",
      "clockDisposition": "Unsupported absence frozen by current prototype policy, not claimed as source canon. No new browser-closed loss/growth/time settlement."
    },
    "deepChain": {
      "id": "book_roster.chain.naruto.carrier_to_method_compact",
      "qualification": "O campaign chain; N6/N7/N11/N14 bounds preserved",
      "phases": [
        {
          "id": "carrier",
          "people": [
            "naruto.aki",
            "naruto.ren"
          ],
          "means": "Cracked actual carrier, timber/cloth and finite clean clinic stock.",
          "requires": "Known normal repair terms/support.",
          "commands": []
        },
        {
          "id": "control_trial",
          "people": [
            "naruto.toma",
            "naruto.yae"
          ],
          "means": "Fitted real puppet/linkage, trained operator reserve or partial method text and one funded trial.",
          "requires": "Actual body/source/control; fragment is not complete mastery.",
          "commands": []
        },
        {
          "id": "rival_convoy",
          "people": [
            "naruto.daigo",
            "naruto.chika"
          ],
          "means": "Daigo deposit/crew/limited escort; Chika manifest/food/guide.",
          "requires": "Disclosed competing actual shipment claim, evidence and access.",
          "commands": []
        },
        {
          "id": "method_terms",
          "people": [
            "naruto.yae",
            "naruto.ren"
          ],
          "means": "Tested taught function, private text custody and willing actual instruction.",
          "requires": "Qualified acquisition/refinement and accepted neutral/restricted distribution.",
          "commands": []
        },
        {
          "id": "clinic_return",
          "people": [
            "naruto.aki",
            "naruto.ren"
          ],
          "means": "Actual delivery receipts, ordinary fitted parts and disclosed care history.",
          "requires": "Same instance and surviving teachers/clients, no duplicate organs.",
          "commands": []
        }
      ],
      "outcomes": {
        "lawful": "Neutral supply/method compact or knowingly accepted restricted patron.",
        "refusal": "Ordinary fitter pays for Toma/declines rare method with no new debt.",
        "partial": "Sound carrier/delivered stock can succeed while source trial stays unresolved.",
        "hostile": "Supported conflict responds to real theft/coercion/witness reports; no forced clan feud or guaranteed source boss."
      },
      "consumer": null,
      "gap": "Native river-yard/body/chakra/control/clinic/teacher/arc consumers unactivated.",
      "laterGate": "Private incomplete transmission versus actual acquired control, affected local clinic welfare and funded rival response.",
      "status": "implemented-unverified immutable authoring graph; native source-world activation explicitly separate"
    }
  },
  {
    "id": "bleach",
    "label": "Bleach",
    "authoringFamily": "fan.bleach",
    "nativeWorldId": null,
    "source": {
      "kind": "manga/anime-reference",
      "edition": "bleach.original.1-74.primary.r1",
      "reviewedExtent": "Reuses bounded official-source ledger and selected existing authoring excerpts; no executable/whole-game or full manga text read by this worker.",
      "qualification": "Ledger C claims stay bounded; anime A corroboration stays separate; original local people/era extensions are O. Not a supplied full-novel lane."
    },
    "baseline": {
      "era": "early_living_district",
      "place": "river_street",
      "entry": "living_visitor",
      "branch": "bleach.street_record.branch; original local side story, source chronology immutable; earlier/parallel snapshots unactivated",
      "actualState": "No native instance, actor initialization, elapsed time or source-world activation from this module."
    },
    "sourceRefs": [
      {
        "path": "docs/worlds/bleach/WORLD_BRIEF.md",
        "sha256": "45f87d89e0ba70c889d8fd000bebd8c480208819c67c976ecf29f004cc3ad288",
        "locators": [
          "Owners and identity",
          "Entry and connected local life"
        ]
      },
      {
        "path": "docs/worlds/bleach/CAMPAIGN.md",
        "sha256": "cff4a6d881a08f46c3beaa8c015348fa3eed73456c23fee8be0ae7e1bf970b4d",
        "locators": [
          "source/invention boundary",
          "campaign promise",
          "contexts/institutions"
        ]
      },
      {
        "path": "docs/worlds/bleach/INTERACTIONS.md",
        "sha256": "5eb805c752262929441c5e76c6d62791df6ef7d9764d8c087cdef634a3f91a79",
        "locators": [
          "People, means and voice",
          "Compact reaction matrix"
        ]
      },
      {
        "path": "docs/worlds/bleach/SOURCE_LEDGER.md",
        "sha256": "9d41e919192d7ffdd7ec324135c99afbe3b0bdb633d145616c76f6d153c7ec57",
        "locators": [
          "B1",
          "B2",
          "B5",
          "B6",
          "B10",
          "B12",
          "BU1",
          "BU2",
          "BU3",
          "BU4",
          "BU5",
          "BU6",
          "BU7"
        ]
      }
    ],
    "replacement": [
      {
        "qualification": "O",
        "detail": "Ritsu checks actual credentials/report jurisdiction; a uniform does not grant captaincy or a personal release."
      },
      {
        "qualification": "A scoped support; U exact exceptions",
        "detail": "A bought sword/sheath does not buy its owner’s soul relationship, name or learned release. Ordinary scabbard repair cannot restore a destroyed Bankai. Exact exceptions remain BU1/BU2.",
        "claimRefs": [
          "B2/B5/B6"
        ]
      },
      {
        "qualification": "O",
        "detail": "Nao’s attributed report can be heard by Emi without granting Emi spiritual perception; actual observer and paid faculty scope remain attached."
      },
      {
        "qualification": "U",
        "detail": "Artificial souls, bodily occupants, soul death/reincarnation and passage need exact source/body-interface cases; named existence does not provide a printable replacement person.",
        "claimRefs": [
          "BU5/BU6"
        ]
      },
      {
        "qualification": "O",
        "detail": "Actual actor/body/controller, memories, acquired source/fuel, learned mastery, goods/custody, rights/duties and observer beliefs remain separate. No appearance/role helper transfers them."
      }
    ],
    "trope": {
      "chain": "Ritsu requests jurisdictional evidence; Jun has damaged records and willing witnesses; Nao supplies a bounded paid survey whose interpretation can stay uncertain.",
      "subversions": [
        "Repair and mark an ordinary detour.",
        "Supply attributed testimony and preserve uncertainty.",
        "Decline confidential disclosure or fund actual corroboration."
      ],
      "noEscalation": "An uncertain report is not a forced invisible villain or a replacement captain fight."
    },
    "smallInteractions": [
      {
        "detail": "Perception, physical targeting and passage need different actual source/body support. A paid report grants information only.",
        "claimRefs": [
          "B10; INTERACTIONS report, O application"
        ]
      },
      {
        "detail": "Personal source/release differs from institutional office and ordinary instrument condition.",
        "claimRefs": [
          "B2/B5/B6"
        ]
      },
      {
        "detail": "A same-instance return retains the actual parcel holder, damaged records and known disclosures.",
        "claimRefs": [
          "INTERACTIONS street/authority/return, O"
        ]
      }
    ],
    "texture": {
      "qualification": "O original street/shelter people/details/new wording",
      "voice": [
        {
          "actorId": "bleach.emi",
          "line": "The shelf is called dry records. The roof has filed an objection."
        },
        {
          "actorId": "bleach.nao",
          "line": "I detected it there. Its reason for being there is still a question."
        }
      ],
      "room": "A drying address ledger and patched parcel cloth share a shelf beneath the leaking roof.",
      "routine": "Emi fits repairs around deliveries; Fuyu counts beds and food before offering care.",
      "custom": "Jun asks who supplied a claim; a familiar greeting grants no invisible sight.",
      "incidental": "A resident gives a mundane timestamp and returns to sweeping the doorway."
    },
    "people": [
      "bleach.emi",
      "bleach.nao",
      "bleach.jun",
      "bleach.fuyu",
      "bleach.ritsu"
    ],
    "rules": [
      {
        "id": "attributed_survey",
        "claimRefs": [
          "B10; INTERACTIONS report, O"
        ],
        "scope": "O paid survey/report application; the recipient acquires no spiritual faculty.",
        "requirements": [
          {
            "key": "facultyActuallySupported",
            "expected": true,
            "label": "Nao’s actual survey faculty is supported"
          },
          {
            "key": "fundedSlotAvailable",
            "expected": true,
            "label": "the funded survey slot is available"
          },
          {
            "key": "reportActuallyIssued",
            "expected": true,
            "label": "the scoped report was actually issued"
          },
          {
            "key": "attributionRetained",
            "expected": true,
            "label": "observer/method/time attribution remains attached"
          }
        ],
        "demandedJoins": [
          "new independent native world/person/stock/service binding",
          "existing method/body/source/fuel and item/custody owners",
          "observer-specific claims/memories and Ink admission",
          "one durable host publisher"
        ],
        "unresolved": null
      },
      {
        "id": "restore_destroyed_release",
        "claimRefs": [
          "B6/BU1/BU2"
        ],
        "scope": "Exact personal-release repair/exception is unresolved.",
        "requirements": [],
        "demandedJoins": [
          "new independent native world/person/stock/service binding",
          "existing method/body/source/fuel and item/custody owners",
          "observer-specific claims/memories and Ink admission",
          "one durable host publisher"
        ],
        "unresolved": "Ordinary equipment repair cannot authorize a Bankai restoration; selected original-manga exception is missing."
      }
    ],
    "recognition": [
      {
        "id": "jun_report",
        "claimRefs": [
          "INTERACTIONS report/return, O"
        ],
        "scope": "Jun acknowledges an attributed account; hearing it is not direct spiritual sight or a soul-signature test.",
        "requirements": [
          {
            "key": "sameInstanceActor",
            "expected": true,
            "label": "this is the same Jun and local history"
          },
          {
            "key": "reportReceived",
            "expected": true,
            "label": "Jun received this actual report/testimony"
          },
          {
            "key": "provenanceKnown",
            "expected": true,
            "label": "Jun knows its particular source/time/scope"
          }
        ],
        "demandedJoins": [
          "observer-scoped knowledge/provenance",
          "actual same-instance actor and contact",
          "host belief/correction publication"
        ],
        "unresolved": null
      }
    ],
    "binding": {
      "actualExistingConsumers": [],
      "newProfileConsumer": null,
      "gap": "Bleach independent native instance, body/source/stock/service/observer bindings and registered Ink scene remain unactivated. Existing generic worlds do not activate this profile."
    },
    "sourceGaps": [
      "BU1",
      "BU2",
      "BU3",
      "BU4",
      "BU5",
      "BU6",
      "BU7"
    ],
    "status": {
      "profiles": "implemented-unverified authoring data",
      "pureRules": "implemented-unverified",
      "sceneRegistered": false,
      "nativeBinding": false,
      "playableAcceptance": "deferred"
    },
    "topology": {
      "qualification": "Bounded manga C / anime A; exact passage/body interfaces U",
      "setting": "Original Bleach 1–74, exclusions separate",
      "physicalWorld": "World of the Living, Soul Society and Hueco Mundo are locations within one source continuity, not automatically alternate histories.",
      "regions": [
        "early living river street O",
        "shelter/report office O",
        "source named realms unactivated"
      ],
      "institutionOrHub": "Local report office and source institutions have jurisdiction; no universal mission hub is imposed.",
      "sourceQualifiedTopology": [
        "Perceiving a spirit, interacting/targeting and passing between domains are separate support questions.",
        "A parallel Bleach history has separate actual versions of those people/places; a projection/artificial body is not a second living original."
      ],
      "branchPolicy": "early_living_district O; later relief/predecessor/post-ending needs separately sourced contemporary actor states.",
      "missionVsDestination": "A shelter parcel/report is an actual local claim; jurisdictional success does not grant another person’s release or settle every realm.",
      "passageDisposition": "No native physical-to-soul passage, gigai/soul conversion or generic resurrection edge activated.",
      "unknowns": [
        "BU5 artificial soul/body interface.",
        "BU6 soul death/reincarnation/realm passage.",
        "BU7 exact earlier/endpoint state."
      ],
      "activatedByThisModule": false,
      "portableCarrierPolicy": "Per edge, actual body/controller/memory/method/source/fuel/goods/custody/title/debt/allies/observer scope needs an explicit native contract. No generic conversion or credential jurisdiction.",
      "clockDisposition": "Unsupported absence frozen by current prototype policy, not claimed as source canon. No new browser-closed loss/growth/time settlement."
    },
    "deepChain": {
      "id": "book_roster.chain.bleach.report_to_local_jurisdiction",
      "qualification": "O living-district chain; C/A source categories qualified",
      "phases": [
        {
          "id": "street",
          "people": [
            "bleach.emi",
            "bleach.jun"
          ],
          "means": "Damaged address ledger/roof, parcel and actual willing witnesses.",
          "requires": "Mundane repair/custody or interview without fabricated sight.",
          "commands": []
        },
        {
          "id": "survey",
          "people": [
            "bleach.nao"
          ],
          "means": "Actual qualified faculty, finite reserve and paid available slot.",
          "requires": "Named detection scope and issued attributed report.",
          "commands": []
        },
        {
          "id": "jurisdiction",
          "people": [
            "bleach.ritsu",
            "bleach.jun"
          ],
          "means": "Ritsu credentials/actual escort/report network; confidential sources.",
          "requires": "Received proof within actual authority, no hidden omniscience.",
          "commands": []
        },
        {
          "id": "office_terms",
          "people": [
            "bleach.emi",
            "bleach.jun",
            "bleach.fuyu"
          ],
          "means": "Record store, care stock/beds and funded supervision.",
          "requires": "Actual chosen public/private report/care terms and consent.",
          "commands": []
        },
        {
          "id": "relief_return",
          "people": [
            "bleach.nao",
            "bleach.jun"
          ],
          "means": "Same attributed reports, actual prior disclosures and surviving parcel recipients.",
          "requires": "Same local history; recipient remains without direct perception unless separately acquired.",
          "commands": []
        }
      ],
      "outcomes": {
        "lawful": "Public civic reporting or accepted privacy/care terms.",
        "refusal": "Decline confidentiality disclosure/new survey; ordinary detour remains.",
        "partial": "Deliver parcel or establish mundane timeline without solving spiritual cause.",
        "hostile": "Only actual informed local authority can close a supported route/act with escort; no automatic source-realm enemy ladder."
      },
      "consumer": null,
      "gap": "Native spirit perception/contact/passage/report/jurisdiction/stock consumers unactivated.",
      "laterGate": "Per-observer correction, report versus direct sight, personal release versus equipment and same-instance aftermath.",
      "status": "implemented-unverified immutable authoring graph; native source-world activation explicitly separate"
    }
  },
  {
    "id": "harry-potter",
    "label": "Harry Potter",
    "authoringFamily": "fan.harry_potter",
    "nativeWorldId": null,
    "source": {
      "kind": "bounded-novel-publisher/companion-reference",
      "edition": "Proposed original seven English Bloomsbury novels; supplemental H2–H4 individually qualified",
      "reviewedExtent": "Existing publisher synopsis plus official companion/author pages H1–H4. Complete novel/chapter text unacquired; this worker reviewed the existing ledger/brief only.",
      "qualification": "H1 bounded C; H2–H4 C-X companion/author evidence outside default novel snapshot; local people, body starts and rules O."
    },
    "baseline": {
      "era": "before_letter; recognizable school-age premise, exact canonical year/cast unknown",
      "place": "O household/nursery/craft contexts; exact canonical placement unknown",
      "entry": "proposed ordinary adult outsider; child/counterpart/tree profiles remain separate unactivated proposals",
      "branch": "hp.before_letter.branch; original local family/craft story. No Harry replacement or canonical date selected.",
      "actualState": "No native instance, actor initialization, elapsed time or source-world activation from this module."
    },
    "sourceRefs": [
      {
        "path": "docs/worlds/harry-potter/WORLD_BRIEF.md",
        "sha256": "d26bb9a47bdb003d0a2a50776ea82ed2e0459066ca2b234eebc6c4fa6e31e765",
        "locators": [
          "Identity, scope and fantasy",
          "Origin variants",
          "Original people and connected life arc"
        ]
      },
      {
        "path": "docs/worlds/harry-potter/SOURCE_LEDGER.md",
        "sha256": "3cc43e541609e7e471e0bd8996fdc68fe31ce5aa6f9c0f4c526585e2fd4bad9c",
        "locators": [
          "H1–H5",
          "Questions before a direct implementation"
        ]
      }
    ],
    "replacement": [
      {
        "qualification": "O",
        "detail": "Mara Fen knows shown signals and care history, not private past-life memories. A role-only counterpart previews actual missing acquired powers versus declared anatomy/history."
      },
      {
        "qualification": "C-X bounded support",
        "detail": "Family membership alone does not establish the eligible source or acceptance letter. An admitted registry check is separate from clothing, surname or asserted role.",
        "claimRefs": [
          "H2"
        ]
      },
      {
        "qualification": "O",
        "detail": "A caretaker or nursery role needs actual guardian/property/tool permissions and retains particular duties; family property is not freely cloned."
      },
      {
        "qualification": "O/U",
        "detail": "Tree reincarnation, soul-to-tree retention and generic occupant replacement are original changed metaphysics, not supported by H4 moving plants. No source-backed procedure is selected.",
        "claimRefs": [
          "H4/H5; Origin variants"
        ]
      },
      {
        "qualification": "O",
        "detail": "Actual actor/body/controller, memories, acquired source/fuel, learned mastery, goods/custody, rights/duties and observer beliefs remain separate. No appearance/role helper transfers them."
      }
    ],
    "trope": {
      "chain": "Mara protects household means; Elias needs healthy plants and a fair supply contract; Nessa seeks a teaching place and tests a claimed design before the later registry/supply dispute.",
      "subversions": [
        "Contribute ordinary craft or tending work.",
        "Ask for a supervised known lesson under actual eligibility/support.",
        "Disclose an uncertain future prediction, refuse it or pursue independent supply."
      ],
      "noEscalation": "A failed prediction or declined patron does not force a canonical villain at the nursery."
    },
    "smallInteractions": [
      {
        "detail": "A good wand/tool does not create an eligible magical source or learned mastery; H3 wood affinities are no universal fitting formula.",
        "claimRefs": [
          "H2/H3; WORLD_BRIEF careers"
        ]
      },
      {
        "detail": "An adult uses actual tools/body; a child needs real guardian/supervision. A tree uses separately authored senses/actions, not renamed adult buttons.",
        "claimRefs": [
          "Origin variants H5 O"
        ]
      },
      {
        "detail": "Nursery stock, safe known material preparation and actual family permission remain real; particular canonical spells/potions need source evidence.",
        "claimRefs": [
          "H4/H5"
        ]
      }
    ],
    "texture": {
      "qualification": "O original local people/nursery/details/new wording; no canonical character voice",
      "voice": [
        {
          "actorId": "hp.mara_fen",
          "line": "Leave the cup where I can reach it. Then tell me what you noticed."
        },
        {
          "actorId": "hp.elias_brook",
          "line": "That pot is borrowed. The plant has not become your landlord."
        }
      ],
      "room": "A nursery work table holds labeled pots and a repaired cloth carrier; a household cup cools beside it.",
      "routine": "Elias checks healthy stock before discussing sales; Nessa counts her one rented bench and samples.",
      "custom": "A caretaker asks for a shown signal rather than pretending to hear private memories.",
      "incidental": "A visitor leaves an ordinary gardening question; it need not hide a prophecy."
    },
    "people": [
      "hp.mara_fen",
      "hp.elias_brook",
      "hp.nessa_vale"
    ],
    "rules": [
      {
        "id": "original_nursery_work",
        "claimRefs": [
          "H4/H5; WORLD_BRIEF local people"
        ],
        "scope": "O ordinary nursery/craft action; no magical eligibility or letter is awarded.",
        "requirements": [
          {
            "key": "actualBodyAndTools",
            "expected": true,
            "label": "actual body/tools support this original ordinary task"
          },
          {
            "key": "stockPermission",
            "expected": true,
            "label": "the stock owner permits the particular tending/repair"
          },
          {
            "key": "supervisionSatisfied",
            "expected": true,
            "label": "the selected age/guardian/supervision terms are satisfied"
          },
          {
            "key": "knownProcedure",
            "expected": true,
            "label": "the ordinary procedure is actually known"
          }
        ],
        "demandedJoins": [
          "new native hp household/nursery actor/body/stock permissions",
          "existing paid job/custody/knowledge owners",
          "Ink continuation and one durable publisher"
        ],
        "unresolved": null
      },
      {
        "id": "canonical_admission_or_tree_rebirth",
        "claimRefs": [
          "H2/H4; ledger Questions"
        ],
        "scope": "Exact default-novel admission/changed tree reincarnation is not established.",
        "requirements": [],
        "demandedJoins": [
          "selected original chapter/era/source procedure",
          "native body/source/registry adapter"
        ],
        "unresolved": "Supplemental registry evidence and moving plants do not establish the requested default-novel start procedure."
      }
    ],
    "recognition": [
      {
        "id": "mara_care_history",
        "claimRefs": [
          "WORLD_BRIEF Mara Fen, O"
        ],
        "scope": "Mara recognizes observed care/signals, without reading a soul, private memory or future prophecy.",
        "requirements": [
          {
            "key": "sameHouseholdActor",
            "expected": true,
            "label": "this is the same original Mara Fen"
          },
          {
            "key": "signalActuallyObserved",
            "expected": true,
            "label": "Mara saw/heard the declared supported signal"
          },
          {
            "key": "historyActuallyKnown",
            "expected": true,
            "label": "Mara knows this particular care/household history"
          }
        ],
        "demandedJoins": [
          "observer-scoped knowledge/provenance",
          "actual same-instance actor and contact",
          "host belief/correction publication"
        ],
        "unresolved": null
      }
    ],
    "binding": {
      "actualExistingConsumers": [],
      "newProfileConsumer": null,
      "gap": "Native household/nursery/age/body/support/registry/tool-binding and Ink scene remain unactivated; no independent Harry Potter instance exists from this module."
    },
    "sourceGaps": [
      "Exact original novel magical-source/admission/tool/bond/spell/potion/recognition rules.",
      "Canonical date/place/cast and source voice before a consequential cameo.",
      "Tree soul/source/body mechanics need an explicit original contract, not H4 inference."
    ],
    "status": {
      "profiles": "implemented-unverified authoring data",
      "pureRules": "implemented-unverified",
      "sceneRegistered": false,
      "nativeBinding": false,
      "playableAcceptance": "deferred"
    },
    "topology": {
      "qualification": "H1 bounded synopsis; H2–H4 supplemental C-X; local topology/starts O",
      "setting": "Proposed original seven Bloomsbury novels; supplemental set named separately",
      "physicalWorld": "Recognizable school/household premise; exact era/map unqualified",
      "regions": [
        "household/caretaker",
        "nursery/craft court",
        "school grounds proposed, no exact direct canonical placement"
      ],
      "institutionOrHub": "School/registry, guardian and craft permissions are distinct. No Paradise mission ontology imposed.",
      "sourceQualifiedTopology": [
        "A moving magical plant H4 is not a soul-to-tree realm or a reincarnation operation.",
        "Earlier generation/post-ending/counterpart/tree branches are original authored snapshots, not source-backed temporal reset or unrestricted passage."
      ],
      "branchPolicy": "before_letter original local story; private future memories are uncertain leads and not shared NPC knowledge.",
      "missionVsDestination": "A supervised lesson or nursery supply job has specific authority/body/stock, not blanket magical admission.",
      "passageDisposition": "No canonical passage, inner world, magical-tree rebirth or generic possession action activated.",
      "unknowns": [
        "Exact novel magical admission/body/catalyst/passages and era/cast source.",
        "Supplemental registry inclusion and source exceptions before direct native implementation."
      ],
      "activatedByThisModule": false,
      "portableCarrierPolicy": "Per edge, actual body/controller/memory/method/source/fuel/goods/custody/title/debt/allies/observer scope needs an explicit native contract. No generic conversion or credential jurisdiction.",
      "clockDisposition": "Unsupported absence frozen by current prototype policy, not claimed as source canon. No new browser-closed loss/growth/time settlement."
    },
    "deepChain": {
      "id": "book_roster.chain.hp.care_to_tested_instruction",
      "qualification": "O original household/nursery chain; H1/H2–H4 bounds unchanged",
      "phases": [
        {
          "id": "care_signal",
          "people": [
            "hp.mara_fen"
          ],
          "means": "Actual household stock and guardian care; observed supported signal.",
          "requires": "Actual age/body/language/interpreter and household permission.",
          "commands": []
        },
        {
          "id": "nursery_work",
          "people": [
            "hp.elias_brook"
          ],
          "means": "Healthy plants, actual pots/tools and fair supply contract.",
          "requires": "Permission and known supported tending/craft, no magic source by surname.",
          "commands": []
        },
        {
          "id": "design_trial",
          "people": [
            "hp.nessa_vale"
          ],
          "means": "One rented bench, limited samples and partial instruction.",
          "requires": "Tested actual design/body/tool support and qualified source if magical.",
          "commands": []
        },
        {
          "id": "registry_dispute",
          "people": [
            "hp.mara_fen",
            "hp.nessa_vale"
          ],
          "means": "Particular family evidence, source-qualified registry facts and actual supply rights.",
          "requires": "Selected source/era proof; future memories stay uncertain claims.",
          "commands": []
        },
        {
          "id": "nursery_return",
          "people": [
            "hp.elias_brook",
            "hp.mara_fen"
          ],
          "means": "Returned borrowed goods, actual healthy stock and known care/contribution.",
          "requires": "Same household/branch; age advance/body conversion needs its own native adapter.",
          "commands": []
        }
      ],
      "outcomes": {
        "lawful": "Actual useful nursery/craft support and a supported supervised instruction.",
        "refusal": "Decline magical claim/prediction/patron, retain useful ordinary work.",
        "partial": "Healthy stock or learned ordinary process without letter/spell admission.",
        "hostile": "False credit/disclosure/coercion can affect known original guardian/supplier; no compulsory canonical villain."
      },
      "consumer": null,
      "gap": "Native age/guardian/body/source/stock/registry/teacher/chain consumers unactivated.",
      "laterGate": "Care recognition versus private memories, magical eligibility versus family/role, actual body-specific actions.",
      "status": "implemented-unverified immutable authoring graph; native source-world activation explicitly separate"
    }
  }
]);

export const bookRosterScenes = freezeTree([
  {
    "id": "book_roster.frontier.mara_return",
    "profileId": "original-frontier",
    "revision": 1,
    "qualification": "O original concise scene specification, not source prose",
    "place": "Village / actual same-instance road contact",
    "speakerId": "roadRival",
    "peopleIds": [
      "roadRival",
      "frontier.road_rival"
    ],
    "opening": "A fresh map does not make it your road. What are you offering?",
    "ordinaryChoices": "Existing funded rival dispute can settle, close or be reported; no new scene reward.",
    "hostCommandTargets": [
      "rival.report",
      "rival.settle",
      "rival.decline"
    ],
    "requires": "Actual same-instance contact, player-known terms and native context validation before any commitment.",
    "aftermath": "Mara retains her actual pursuit/dispute history; resolution generates no replacement rival.",
    "rewards": [],
    "registered": false,
    "consumer": null,
    "bindingGap": "Optional prose/recognition profile requires Features/Ink admission; existing commands are delivered but this new scene/profile is unregistered.",
    "status": "implemented-unverified / inert authoring scene"
  },
  {
    "id": "book_roster.paradise.guide_counter",
    "profileId": "reincarnation-paradise",
    "revision": 1,
    "qualification": "O original concise scene specification, not source prose",
    "place": "O hub counter after first trial",
    "speakerId": "book_roster.paradise.guide",
    "peopleIds": [
      "book_roster.paradise.guide",
      "book_roster.paradise.broker"
    ],
    "opening": "One question is in the price. The second cup is not.",
    "ordinaryChoices": "Buy a scoped known guide service, decline or ask what the guide personally observed.",
    "hostCommandTargets": [],
    "requires": "Actual same-instance contact, player-known terms and native context validation before any commitment.",
    "aftermath": "Guide remembers only paid/disclosed service; aliases and role permission remain distinct.",
    "rewards": [],
    "registered": false,
    "consumer": null,
    "bindingGap": "Native Paradise instance, role/brand permissions, service stock/facility/fuel, player-known claim projection and Ink registration are unactivated. Existing original Exchange is not this novel world.",
    "status": "implemented-unverified / inert authoring scene"
  },
  {
    "id": "book_roster.skyrim.borrowed_ring",
    "profileId": "skyrim",
    "revision": 1,
    "qualification": "O original concise scene specification, not source prose",
    "place": "O rented enchanter bench in opening_crisis",
    "speakerId": "skyrim.orven",
    "peopleIds": [
      "skyrim.orven",
      "skyrim.runa"
    ],
    "opening": "A loan is not permission to destroy it. Ask its owner first.",
    "ordinaryChoices": "Keep the exact ring, accept lawful destructive study or ask separate escort terms.",
    "hostCommandTargets": [],
    "requires": "Actual same-instance contact, player-known terms and native context validation before any commitment.",
    "aftermath": "Consumed ring stays gone; study knowledge and unrelated costume/rank stay separate.",
    "rewards": [],
    "registered": false,
    "consumer": null,
    "bindingGap": "Skyrim independent native instance, body/source/stock/service/observer bindings and registered Ink scene remain unactivated. Existing generic worlds do not activate this profile.",
    "status": "implemented-unverified / inert authoring scene"
  },
  {
    "id": "book_roster.fallout.tray_and_plate",
    "profileId": "fallout4",
    "revision": 1,
    "qualification": "O original concise scene specification, not source prose",
    "place": "O Water Line bay in 2287",
    "speakerId": "fallout.mina",
    "peopleIds": [
      "fallout.mina",
      "fallout.imani"
    ],
    "opening": "It fits the sketch. The bolts would like a second opinion.",
    "ordinaryChoices": "Inspect actual part fit, buy a supported sample test or arrange ordinary bypass work.",
    "hostCommandTargets": [],
    "requires": "Actual same-instance contact, player-known terms and native context validation before any commitment.",
    "aftermath": "Spent test charge stays spent; removed part has one holder and water claims keep provenance.",
    "rewards": [],
    "registered": false,
    "consumer": null,
    "bindingGap": "Fallout 4 independent native instance, body/source/stock/service/observer bindings and registered Ink scene remain unactivated. Existing generic worlds do not activate this profile.",
    "status": "implemented-unverified / inert authoring scene"
  },
  {
    "id": "book_roster.elden.seal_loan",
    "profileId": "elden-ring",
    "revision": 1,
    "qualification": "O original concise scene specification, not source prose",
    "place": "O Limgrave waystation ferry",
    "speakerId": "er.ilen",
    "peopleIds": [
      "er.ilen",
      "er.kest",
      "er.sura"
    ],
    "opening": "I can lend the seal. I cannot lend you someone else’s consent.",
    "ordinaryChoices": "Use legitimate matching cargo/witness terms, retain the seal loan or refuse before acceptance.",
    "hostCommandTargets": [],
    "requires": "Actual same-instance contact, player-known terms and native context validation before any commitment.",
    "aftermath": "Record, living consent, physical seal and later returned loan remain separate in this instance.",
    "rewards": [],
    "registered": false,
    "consumer": null,
    "bindingGap": "Elden Ring independent native instance, body/source/stock/service/observer bindings and registered Ink scene remain unactivated. Existing generic worlds do not activate this profile.",
    "status": "implemented-unverified / inert authoring scene"
  },
  {
    "id": "book_roster.naruto.plain_carrier",
    "profileId": "naruto",
    "revision": 1,
    "qualification": "O original concise scene specification, not source prose",
    "place": "O Leaf river yard part-one side story",
    "speakerId": "naruto.aki",
    "peopleIds": [
      "naruto.aki",
      "naruto.ren",
      "naruto.toma"
    ],
    "opening": "Try the joint with your hand. Paint has a generous view of itself.",
    "ordinaryChoices": "Fit an ordinary carrier, hire qualified Toma or demonstrate actually learned supported control.",
    "hostCommandTargets": [],
    "requires": "Actual same-instance contact, player-known terms and native context validation before any commitment.",
    "aftermath": "Technique information does not become chakra/organ/lineage; real stock/clinic receipt remains.",
    "rewards": [],
    "registered": false,
    "consumer": null,
    "bindingGap": "Naruto independent native instance, body/source/stock/service/observer bindings and registered Ink scene remain unactivated. Existing generic worlds do not activate this profile.",
    "status": "implemented-unverified / inert authoring scene"
  },
  {
    "id": "book_roster.bleach.attributed_report",
    "profileId": "bleach",
    "revision": 1,
    "qualification": "O original concise scene specification, not source prose",
    "place": "O early living street shelter",
    "speakerId": "bleach.nao",
    "peopleIds": [
      "bleach.emi",
      "bleach.nao",
      "bleach.jun"
    ],
    "opening": "I detected it there. Its reason for being there is still a question.",
    "ordinaryChoices": "Fund a scoped report, compare mundane witnesses or take ordinary detour work.",
    "hostCommandTargets": [],
    "requires": "Actual same-instance contact, player-known terms and native context validation before any commitment.",
    "aftermath": "Recipient knows an account, not new spiritual sight; same local report/disclosure history remains.",
    "rewards": [],
    "registered": false,
    "consumer": null,
    "bindingGap": "Bleach independent native instance, body/source/stock/service/observer bindings and registered Ink scene remain unactivated. Existing generic worlds do not activate this profile.",
    "status": "implemented-unverified / inert authoring scene"
  },
  {
    "id": "book_roster.hp.borrowed_pot",
    "profileId": "harry-potter",
    "revision": 1,
    "qualification": "O original concise scene specification, not source prose",
    "place": "O household nursery before_letter",
    "speakerId": "hp.elias_brook",
    "peopleIds": [
      "hp.mara_fen",
      "hp.elias_brook",
      "hp.nessa_vale"
    ],
    "opening": "That pot is borrowed. The plant has not become your landlord.",
    "ordinaryChoices": "Tend stock with real permission, ask known ordinary instruction or decline the quote.",
    "hostCommandTargets": [],
    "requires": "Actual same-instance contact, player-known terms and native context validation before any commitment.",
    "aftermath": "Borrowed pot and family stock retain their owner; no automatic letter, spell or role-power grant.",
    "rewards": [],
    "registered": false,
    "consumer": null,
    "bindingGap": "Native household/nursery/age/body/support/registry/tool-binding and Ink scene remain unactivated; no independent Harry Potter instance exists from this module.",
    "status": "implemented-unverified / inert authoring scene"
  }
]);

export const bookRosterTopologyProfiles = freezeTree(bookRosterProfiles.map(profile => ({profileId:profile.id,...profile.topology})));
export const bookRosterDeepChains = freezeTree(bookRosterProfiles.map(profile => ({profileId:profile.id,...profile.deepChain})));

export function getBookRosterProfile(profileId) {
    return bookRosterProfiles.find(profile => profile.id === profileId) || null;
}

const result = (status, explanation, demandedJoins = [], detail = {}) => freezeTree({
    status, explanation, demandedJoins: [...demandedJoins], ...detail,
    grants: [], mutations: [], clockChanges: [], authority: 'authoring-only',
});

// Input is a host-supplied snapshot of explicit booleans for this narrow rule.
// Missing and malformed evidence stays unknown. These helpers neither discover
// truth nor turn an attributed statement into actual rights, source or memory.
function evaluate(profileId, kind, localId, input) {
    const profile = getBookRosterProfile(profileId);
    if(!profile) return result('unknown', 'No qualified roster profile exists for that ID.');
    const rule = profile[kind].find(candidate => candidate.id === localId);
    if(!rule) return result('unknown', 'No qualified local rule exists for that ID.');
    if(rule.unresolved) return result('unknown', rule.unresolved, rule.demandedJoins,
        {profileId, localId, claimRefs: [...rule.claimRefs], scope: rule.scope});
    const supplied = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
    const unknown = rule.requirements.filter(r => !Object.hasOwn(supplied, r.key) || typeof supplied[r.key] !== 'boolean');
    const blocked = rule.requirements.filter(r => Object.hasOwn(supplied, r.key) && typeof supplied[r.key] === 'boolean' && supplied[r.key] !== r.expected);
    const detail = {profileId, localId, claimRefs: [...rule.claimRefs], scope: rule.scope,
        missingEvidence: unknown.map(r => r.key), blockedEvidence: blocked.map(r => r.key),
        nativeBindingRequired: !profile.status.nativeBinding};
    if(blocked.length) return result('blocked', 'Required evidence is absent: ' + blocked.map(r => r.label).join('; ') + '.', rule.demandedJoins, detail);
    if(unknown.length) return result('unknown', 'Required evidence is unknown: ' + unknown.map(r => r.label).join('; ') + '.', rule.demandedJoins, detail);
    return result('supported', rule.scope, rule.demandedJoins, detail);
}

export function evaluateBookRosterRule(profileId, ruleId, input = {}) {
    return evaluate(profileId, 'rules', ruleId, input);
}

// Supported means this observer's stated evidence supports a narrow attributed
// reading. It does not prove the claimed identity or grant institutional access.
// No hidden input values, author truth or unrelated observer memories are echoed.
export function evaluateBookRosterRecognition(profileId, observerRuleId, input = {}) {
    const evaluated = evaluate(profileId, 'recognition', observerRuleId, input);
    return freezeTree({...evaluated, observationScope: 'named-observer-only',
        beliefDisposition: evaluated.status === 'supported' ? 'evidence-supported-reading' : 'not-established',
        suspicion: 'not-inferred', correction: 'requires-actual-later-evidence'});
}

// Exact original Backlog appointment contract. This snapshot contract is authoring
// admission only; Backlog remains the sole actual carrier/transfer validator.
export const originalFrontierOfficeRuleContract = freezeTree({
  "schema": 1,
  "revision": 1,
  "contractId": "backlog.registry.office_substitution",
  "operation": "office_substitution",
  "commandId": "backlog.replacement.accept_office",
  "worldId": "base.frontier",
  "location": "Village",
  "donorId": "backlog.registry.eda",
  "recipientId": "player",
  "officeId": "backlog.registry.seal_steward",
  "dutyId": "backlog.registry.two_seals",
  "donorBodyId": "backlog.registry.eda.body",
  "donorControllerId": "backlog.registry.eda",
  "recipientBodyId": "native.player.body",
  "recipientControllerId": "player",
  "transferred": [
    "institutional office right",
    "accepted office duty"
  ],
  "retained": [
    "actual actor identities",
    "bodies and controllers",
    "personal memories",
    "personal learned mastery",
    "original sources and fuel",
    "personal goods",
    "personal debt",
    "relationships and completed quests"
  ],
  "requiredActualEvidence": [
    "sameLivingParticipantsPresentAndFree",
    "donorOwnsActualOffice",
    "donorOwnsUnperformedDuty",
    "donorWilling",
    "recipientAcceptsDuty",
    "exactTwoSealDutyConserved",
    "personalCarriersRetained"
  ]
});

export function evaluateOriginalFrontierOfficeReplacement(snapshot) {
    const c = originalFrontierOfficeRuleContract;
    const joins = ['stageReplacementCommand: backlog.replacement.accept_office',
        'validateReplacementRecord', 'Features selected original scene preview/commit',
        'existing one durable publisher'];
    const unknown = explanation => result('unknown', explanation, joins,
        {profileId: 'original-frontier', localId: c.commandId});
    if(!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot))
        return unknown('The actual original office snapshot is missing.');
    const metadata = ['schema','revision','contractId','operation','commandId','worldId','location',
        'donorId','recipientId','officeId','dutyId','donorBodyId','donorControllerId',
        'recipientBodyId','recipientControllerId'];
    if(metadata.some(key => !Object.hasOwn(snapshot,key) || snapshot[key] !== c[key]))
        return unknown('The supplied snapshot does not match this fixed original office/actor/body contract.');
    const evidence = snapshot.actual;
    if(!evidence || typeof evidence !== 'object' || Array.isArray(evidence) ||
        c.requiredActualEvidence.some(key => !Object.hasOwn(evidence,key) || typeof evidence[key] !== 'boolean'))
        return unknown('The actual ownership, presence, consent and conserved-duty evidence is incomplete.');
    const effects = snapshot.effects;
    const sameList = (actual, expected) => Array.isArray(actual) && actual.length === expected.length &&
        new Set(actual).size === actual.length && expected.every(value => actual.includes(value));
    if(!effects || typeof effects !== 'object' || Array.isArray(effects) ||
        Object.keys(effects).some(key => !['transferred','retained','borrowed','grants','fromActorId','toActorId','rightId','dutyId','additionalCarrierChanges'].includes(key)) ||
        !sameList(effects.transferred,c.transferred) || !sameList(effects.retained,c.retained) ||
        !Array.isArray(effects.borrowed) || effects.borrowed.length ||
        !Array.isArray(effects.grants) || effects.grants.length ||
        effects.fromActorId !== c.donorId || effects.toActorId !== c.recipientId ||
        effects.rightId !== c.officeId || effects.dutyId !== c.dutyId ||
        effects.additionalCarrierChanges !== false)
        return unknown('The effect snapshot must move only the same office right and duty, retain personal carriers, and make no item/source/reward grant.');
    const blockers = c.requiredActualEvidence.filter(key => evidence[key] === false);
    if(blockers.length) return result('blocked', 'The actual original appointment prerequisites fail: ' + blockers.join(', ') + '.', joins,
        {profileId:'original-frontier',localId:c.commandId,blockedEvidence:blockers});
    return result('supported', 'This original willing office appointment conserves the same right and duty while retaining both actual people and their personal carriers. Backlog still validates and stages the native operation.', joins,
        {profileId:'original-frontier',localId:c.commandId,sourceQualification:'O original',transferred:[...c.transferred],retained:[...c.retained]});
}
