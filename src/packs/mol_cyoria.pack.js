// Cyoria (Mother of Learning) world pack: plain data (WA21). Its person, technique, power and item
// records carry the engine definitions in `data`; the runtime installs them (WAC8, WA17).
// Revision 2: records now carry engine payloads and K2/K8 records (revision 1 was a derived lint pilot).
export default {
 "schema": 1,
 "id": "book.mol.pack.cyoria_visitor",
 "revision": 2,
 "worldId": "book.mol.cyoria",
 "namespace": "book.mol",
 "label": "Cyoria · academy visitor",
 "source": {
  "title": "Mother of Learning",
  "snapshot": "MOL-WebToEpub-e53f95695730-r1",
  "boundary": "Third-year academy-era ordinary city, source patterns chapters1–20; early Kael access is an authored scheduling divergence."
 },
 "continuity": {
  "id": "book.mol.independent_visitor.branch",
  "kind": "divergent"
 },
 "facts": [
  {
   "id": "book.mol.fact.academy_cast",
   "status": "source",
   "locator": "chapters 1–20 (coarse; per-person locators pending)",
   "confidence": "shown"
  }
 ],
 "records": [
  {
   "id": "book.mol.law.device_needs_local_anchor",
   "kind": "law",
   "status": "authored",
   "engine": "mol.deviceSupported",
   "reason": "The keyed lamp only works with its locally anchored formula and supplied charge."
  },
  {
   "id": "book.mol.law.no_personal_mana_casting",
   "kind": "law",
   "status": "inferred",
   "engine": "mol.playerSupported",
   "reason": "Without a demonstrated personal mana source, you operate devices instead of casting."
  },
  {
   "id": "book.mol.law.visit_needs_bound_native_body",
   "kind": "law",
   "status": "authored",
   "engine": "mol.nativeBound",
   "reason": "The campaign only runs for the retained native body bound to this visit; nothing here borrows another body."
  },
  {
   "id": "book.mol.law.operator_needs_trained_faculty",
   "kind": "law",
   "status": "authored",
   "engine": "mol.operatorFacultySupported",
   "reason": "Operating the lamp takes the trained, active control faculty you earned; owning a lamp alone grants it nothing."
  },
  {
   "id": "book.mol.law.untreated_exposure_blocks_device",
   "kind": "law",
   "status": "authored",
   "engine": "mol.needsTreatment",
   "reason": "A mild smoke or hand burn left untreated stops steady device control until Kael treats it."
  },
  {
   "id": "book.mol.law.retrieval_window_closes",
   "kind": "law",
   "status": "authored",
   "engine": "mol.retrievalWindowOpen",
   "reason": "Taiven’s retrieval terms lapse after a short window; late work is acknowledged, not paid."
  },
  {
   "id": "book.mol.law.hatch_threat_needs_means",
   "kind": "law",
   "status": "authored",
   "engine": "mol.opponentThreatSupported",
   "reason": "The scavenger only threatens while armed with their own hook, trained method and a ready guard."
  },
  {
   "id": "book.mol.law.cover_needs_means",
   "kind": "law",
   "status": "authored",
   "engine": "mol.taivenResponseSupported",
   "reason": "Taiven only covers you with her own staff, her trained response and her willing agreement, in the sewer."
  },
  {
   "id": "book.mol.loop.study_build_test",
   "kind": "loop",
   "part": "K13",
   "status": "authored",
   "tier": "T4",
   "summary": "Study formula, assemble and charge the keyed lamp, drill control, test it, then compile and commission."
  },
  {
   "id": "book.mol.imaya",
   "kind": "person",
   "part": "K6",
   "status": "source",
   "facts": [
    "book.mol.fact.academy_cast"
   ],
   "tier": "T2",
   "summary": "Own household, costs, chores and guests. Guest work is an original explicit agreement; no automatic home ownership or private family knowledge.",
   "data": {
    "id": "book.mol.imaya",
    "label": "Imaya Kuroshka",
    "revision": 1,
    "worldId": "book.mol.cyoria",
    "location": "Cyoria Imaya household",
    "description": "Own household, costs, chores and guests. Guest work is an original explicit agreement; no automatic home ownership or private family knowledge.",
    "inventory": "native",
    "provision": false,
    "resources": {
     "book.mol.crowns": 10,
     "book.mol.attention": 14
    },
    "body": {
     "form": "human",
     "hands": 2,
     "mobile": true
    },
    "vitals": {
     "health": 24,
     "max_health": 24,
     "stamina": 18,
     "max_stamina": 18
    }
   }
  },
  {
   "id": "book.mol.ilsa",
   "kind": "person",
   "part": "K6",
   "status": "source",
   "facts": [
    "book.mol.fact.academy_cast"
   ],
   "tier": "T2",
   "summary": "Academy representative and invocation teacher. Guest library permission, practical competence and commercial certification are distinct.",
   "data": {
    "id": "book.mol.ilsa",
    "label": "Ilsa Zileti",
    "revision": 1,
    "worldId": "book.mol.cyoria",
    "location": "Cyoria academy guest desk",
    "description": "Academy representative and invocation teacher. Guest library permission, practical competence and commercial certification are distinct.",
    "inventory": "native",
    "provision": false,
    "resources": {
     "book.mol.crowns": 0,
     "book.mol.attention": 10
    },
    "body": {
     "form": "human",
     "hands": 2,
     "mobile": true
    },
    "vitals": {
     "health": 24,
     "max_health": 24,
     "stamina": 18,
     "max_stamina": 18
    }
   }
  },
  {
   "id": "book.mol.ibery",
   "kind": "person",
   "part": "K6",
   "status": "source",
   "facts": [
    "book.mol.fact.academy_cast"
   ],
   "tier": "T2",
   "summary": "Library assistant with actual books/materials, work and attention. A received observation is separate from author knowledge.",
   "data": {
    "id": "book.mol.ibery",
    "label": "Ibery Ambercomb",
    "revision": 1,
    "worldId": "book.mol.cyoria",
    "location": "Cyoria academy guest library",
    "description": "Library assistant with actual books/materials, work and attention. A received observation is separate from author knowledge.",
    "inventory": "native",
    "provision": false,
    "resources": {
     "book.mol.crowns": 14,
     "book.mol.attention": 12
    },
    "body": {
     "form": "human",
     "hands": 2,
     "mobile": true
    },
    "vitals": {
     "health": 24,
     "max_health": 24,
     "stamina": 18,
     "max_stamina": 18
    }
   }
  },
  {
   "id": "book.mol.nora",
   "kind": "person",
   "part": "K6",
   "status": "source",
   "facts": [
    "book.mol.fact.academy_cast"
   ],
   "tier": "T2",
   "summary": "Formula teacher who requires understanding and functional reconstruction. Her own attuned mana anchors a narrow authored device; she shares neither mastery nor personal source.",
   "data": {
    "id": "book.mol.nora",
    "label": "Nora Boole",
    "revision": 1,
    "worldId": "book.mol.cyoria",
    "location": "Cyoria formula workshop",
    "description": "Formula teacher who requires understanding and functional reconstruction. Her own attuned mana anchors a narrow authored device; she shares neither mastery nor personal source.",
    "inventory": "native",
    "provision": false,
    "resources": {
     "book.mol.crowns": 10,
     "book.mol.attention": 14,
     "book.mol.personalMana": 18
    },
    "body": {
     "form": "human",
     "hands": 2,
     "mobile": true
    },
    "vitals": {
     "health": 24,
     "max_health": 24,
     "stamina": 18,
     "max_stamina": 18
    }
   }
  },
  {
   "id": "book.mol.xvim",
   "kind": "person",
   "part": "K6",
   "status": "source",
   "facts": [
    "book.mol.fact.academy_cast"
   ],
   "tier": "T2",
   "summary": "Demanding mentor evaluates attention and controlled procedure. This paid guest exercise is manual device control, not a copied mage faculty.",
   "data": {
    "id": "book.mol.xvim",
    "label": "Xvim Chao",
    "revision": 1,
    "worldId": "book.mol.cyoria",
    "location": "Cyoria supervised practice court",
    "description": "Demanding mentor evaluates attention and controlled procedure. This paid guest exercise is manual device control, not a copied mage faculty.",
    "inventory": "native",
    "provision": false,
    "resources": {
     "book.mol.crowns": 0,
     "book.mol.attention": 7
    },
    "body": {
     "form": "human",
     "hands": 2,
     "mobile": true
    },
    "vitals": {
     "health": 24,
     "max_health": 24,
     "stamina": 18,
     "max_stamina": 18
    }
   }
  },
  {
   "id": "book.mol.taiven",
   "kind": "person",
   "part": "K6",
   "status": "source",
   "facts": [
    "book.mol.fact.academy_cast"
   ],
   "tier": "T2",
   "summary": "Recent graduate seeking paid retrieval work with trained physical/combat means. She can receive a bounded survey and refuse an unsafe plan; no invulnerable escort.",
   "data": {
    "id": "book.mol.taiven",
    "label": "Taiven",
    "revision": 1,
    "worldId": "book.mol.cyoria",
    "location": "Cyoria sewer service hatch",
    "description": "Recent graduate seeking paid retrieval work with trained physical/combat means. She can receive a bounded survey and refuse an unsafe plan; no invulnerable escort.",
    "inventory": "native",
    "provision": false,
    "resources": {
     "book.mol.crowns": 8,
     "book.mol.attention": 10,
     "book.mol.personalMana": 12
    },
    "body": {
     "form": "human",
     "hands": 2,
     "mobile": true
    },
    "vitals": {
     "health": 24,
     "max_health": 24,
     "stamina": 18,
     "max_stamina": 18
    }
   }
  },
  {
   "id": "book.mol.kael",
   "kind": "person",
   "part": "K6",
   "status": "source",
   "facts": [
    "book.mol.fact.academy_cast"
   ],
   "tier": "T2",
   "summary": "Widowed healer/alchemist with scarce supplies and a daughter. Early guest collaboration and numerical budgets are original proposals; research privacy and family time remain his.",
   "data": {
    "id": "book.mol.kael",
    "label": "Kael Tverinov",
    "revision": 1,
    "worldId": "book.mol.cyoria",
    "location": "Cyoria Imaya household",
    "description": "Widowed healer/alchemist with scarce supplies and a daughter. Early guest collaboration and numerical budgets are original proposals; research privacy and family time remain his.",
    "inventory": "native",
    "provision": false,
    "resources": {
     "book.mol.crowns": 10,
     "book.mol.attention": 12
    },
    "body": {
     "form": "human",
     "hands": 2,
     "mobile": true
    },
    "vitals": {
     "health": 24,
     "max_health": 24,
     "stamina": 18,
     "max_stamina": 18
    }
   }
  },
  {
   "id": "book.mol.zorian",
   "kind": "person",
   "part": "K6",
   "status": "source",
   "facts": [
    "book.mol.fact.academy_cast"
   ],
   "tier": "T2",
   "summary": "Third-year student following his own ordinary studies. His private perceptions, later loop discoveries and memories are not the visitor’s knowledge.",
   "data": {
    "id": "book.mol.zorian",
    "label": "Zorian Kazinski",
    "revision": 1,
    "worldId": "book.mol.cyoria",
    "location": "Cyoria academy guest library",
    "description": "Third-year student following his own ordinary studies. His private perceptions, later loop discoveries and memories are not the visitor’s knowledge.",
    "inventory": "native",
    "provision": false,
    "resources": {
     "book.mol.crowns": 0,
     "book.mol.attention": 3
    },
    "body": {
     "form": "human",
     "hands": 2,
     "mobile": true
    },
    "vitals": {
     "health": 24,
     "max_health": 24,
     "stamina": 18,
     "max_stamina": 18
    }
   }
  },
  {
   "id": "book.mol.hatch_scavenger",
   "kind": "person",
   "part": "K6",
   "status": "authored",
   "facts": [],
   "tier": "T2",
   "summary": "Original independent local scavenger guarding a short hatch for salvage. Own hook, meal, finite effort and purse; no sourced antagonist identity or future intelligence. Intervention changes actual injury/position/means.",
   "data": {
    "id": "book.mol.hatch_scavenger",
    "label": "Hatch scavenger (original local adversary)",
    "revision": 1,
    "worldId": "book.mol.cyoria",
    "location": "Cyoria sewer service hatch",
    "description": "Original independent local scavenger guarding a short hatch for salvage. Own hook, meal, finite effort and purse; no sourced antagonist identity or future intelligence. Intervention changes actual injury/position/means.",
    "inventory": "native",
    "provision": false,
    "resources": {
     "book.mol.crowns": 0,
     "book.mol.attention": 4
    },
    "body": {
     "form": "human",
     "hands": 2,
     "mobile": true
    },
    "vitals": {
     "health": 24,
     "max_health": 24,
     "stamina": 18,
     "max_stamina": 18
    }
   }
  },
  {
   "id": "book.mol.source.hatch_hook_method",
   "kind": "technique",
   "part": "K3",
   "status": "authored",
   "tier": "T2",
   "summary": "Original local adversary’s physical practice and held hook. No novel antagonist identity, mage source, unlimited attack or copied player capability.",
   "data": {
    "id": "book.mol.hatch_hook_method",
    "revision": 1,
    "label": "Original scavenger’s trained short-hook handling",
    "kind": "technique",
    "origin": "trained",
    "grants": [],
    "bioDetail": "Original local adversary’s physical practice and held hook. No novel antagonist identity, mage source, unlimited attack or copied player capability."
   }
  },
  {
   "id": "book.mol.source.formula_operator",
   "kind": "technique",
   "part": "K3",
   "status": "authored",
   "tier": "T2",
   "summary": "Original supervised hands-and-device procedure; no personal mana faculty. Actual locally anchored lamp, finite charge and trained control required.",
   "data": {
    "id": "book.mol.formula_operator",
    "revision": 1,
    "label": "Learned keyed-device manual procedure",
    "kind": "technique",
    "origin": "trained",
    "grants": [],
    "bioDetail": "Original supervised hands-and-device procedure; no personal mana faculty. Actual locally anchored lamp, finite charge and trained control required."
   }
  },
  {
   "id": "book.mol.source.nora_formula",
   "kind": "technique",
   "part": "K3",
   "status": "authored",
   "tier": "T2",
   "summary": "Source formula teacher’s own body and expertise. Numeric attuned reserve and manual-interface variation are original finite proposals.",
   "data": {
    "id": "book.mol.nora_formula",
    "revision": 1,
    "label": "Nora’s own trained formula anchoring",
    "kind": "technique",
    "origin": "trained",
    "grants": [],
    "bioDetail": "Source formula teacher’s own body and expertise. Numeric attuned reserve and manual-interface variation are original finite proposals."
   }
  },
  {
   "id": "book.mol.source.taiven_combat",
   "kind": "technique",
   "part": "K3",
   "status": "authored",
   "tier": "T2",
   "summary": "Source older graduate’s trained body and actual staff. Only bounded covering response with own finite mana is implemented.",
   "data": {
    "id": "book.mol.taiven_combat",
    "revision": 1,
    "label": "Taiven’s trained physical/formula combat",
    "kind": "technique",
    "origin": "trained",
    "grants": [],
    "bioDetail": "Source older graduate’s trained body and actual staff. Only bounded covering response with own finite mana is implemented."
   }
  },
  {
   "id": "book.mol.power.formula_operator",
   "kind": "power",
   "part": "K3",
   "status": "authored",
   "tier": "T2",
   "summary": "Earned manual brightness/key/occlusion procedure. Knowledge, fixed equipment capacity, mastery, charge and supported body each have separate consumers.",
   "data": {
    "id": "book.mol.formula_operator",
    "revision": 1,
    "label": "Keyed lamp control",
    "model": "practice",
    "capacity": 1,
    "worlds": [
     "book.mol.cyoria"
    ],
    "cooldown": 0,
    "execution": {
     "all": [
      {
       "all": [
        {
         "fact": "mol.nativeBound",
         "op": "eq",
         "value": true
        },
        {
         "fact": "mol.playerSupported",
         "op": "eq",
         "value": true
        },
        {
         "fact": "mol.local.book.mol.cyoria",
         "op": "eq",
         "value": true
        }
       ]
      },
      {
       "fact": "mol.deviceSupported",
       "op": "eq",
       "value": true
      }
     ]
    },
    "description": "Earned manual brightness/key/occlusion procedure. Knowledge, fixed equipment capacity, mastery, charge and supported body each have separate consumers."
   }
  },
  {
   "id": "book.mol.item.cyorian_research_paper",
   "kind": "item",
   "part": "K9",
   "status": "authored",
   "tier": "T2",
   "summary": "Counted local blank paper. Study/research consumes it; a title grants no spell.",
   "data": {
    "id": "Cyorian research paper",
    "name": "Cyorian research paper",
    "description": "Counted local blank paper. Study/research consumes it; a title grants no spell.",
    "value": 1,
    "tags": {
     "expedition": true,
     "book_world_mol": true
    }
   }
  },
  {
   "id": "book.mol.item.cyorian_formula_ink",
   "kind": "item",
   "part": "K9",
   "status": "authored",
   "tier": "T2",
   "summary": "Counted inscription material for the supervised keyed lamp.",
   "data": {
    "id": "Cyorian formula ink",
    "name": "Cyorian formula ink",
    "description": "Counted inscription material for the supervised keyed lamp.",
    "value": 1,
    "tags": {
     "expedition": true,
     "book_world_mol": true
    }
   }
  },
  {
   "id": "book.mol.item.cyorian_blank_stone_cube",
   "kind": "item",
   "part": "K9",
   "status": "authored",
   "tier": "T2",
   "summary": "Source-pattern training blank. It is not a working magical item without anchored formula, specialist and test.",
   "data": {
    "id": "Cyorian blank stone cube",
    "name": "Cyorian blank stone cube",
    "description": "Source-pattern training blank. It is not a working magical item without anchored formula, specialist and test.",
    "value": 1,
    "tags": {
     "expedition": true,
     "book_world_mol": true
    }
   }
  },
  {
   "id": "book.mol.item.cyorian_keyed_formula_lamp",
   "kind": "item",
   "part": "K9",
   "status": "authored",
   "tier": "T2",
   "summary": "Original bounded manual-interface variant of Nora’s lamp lesson. Its keyed brightness/occlusion procedure needs earned control and finite specialist-supplied device fuel; it grants no spellcasting, attacks or light elsewhere.",
   "data": {
    "id": "Cyorian keyed formula lamp",
    "name": "Cyorian keyed formula lamp",
    "description": "Original bounded manual-interface variant of Nora’s lamp lesson. Its keyed brightness/occlusion procedure needs earned control and finite specialist-supplied device fuel; it grants no spellcasting, attacks or light elsewhere.",
    "value": 1,
    "tags": {
     "expedition": true,
     "book_world_mol": true
    }
   }
  },
  {
   "id": "book.mol.item.cyorian_lamp_oil",
   "kind": "item",
   "part": "K9",
   "status": "authored",
   "tier": "T2",
   "summary": "Ordinary combustible fuel. Spell disruption cannot extinguish its continuing flame.",
   "data": {
    "id": "Cyorian lamp oil",
    "name": "Cyorian lamp oil",
    "description": "Ordinary combustible fuel. Spell disruption cannot extinguish its continuing flame.",
    "value": 1,
    "tags": {
     "expedition": true,
     "book_world_mol": true
    }
   }
  },
  {
   "id": "book.mol.item.cyorian_bread_parcel",
   "kind": "item",
   "part": "K9",
   "status": "authored",
   "tier": "T2",
   "summary": "Counted household food, used by actual paid meals or Taiven field preparation.",
   "data": {
    "id": "Cyorian bread parcel",
    "name": "Cyorian bread parcel",
    "description": "Counted household food, used by actual paid meals or Taiven field preparation.",
    "value": 1,
    "tags": {
     "expedition": true,
     "book_world_mol": true
    }
   }
  },
  {
   "id": "book.mol.item.cyorian_mild_burn_salve",
   "kind": "item",
   "part": "K9",
   "status": "authored",
   "tier": "T2",
   "summary": "Kael’s finite ordinary preparation, used only for this authored mild exposure/burn. No universal cure.",
   "data": {
    "id": "Cyorian mild burn salve",
    "name": "Cyorian mild burn salve",
    "description": "Kael’s finite ordinary preparation, used only for this authored mild exposure/burn. No universal cure.",
    "value": 1,
    "tags": {
     "expedition": true,
     "book_world_mol": true
    }
   }
  },
  {
   "id": "book.mol.item.cyorian_sewer_residue_sample",
   "kind": "item",
   "part": "K9",
   "status": "authored",
   "tier": "T2",
   "summary": "One original local sealed sample obtained through supported field observation, not a captured creature or copied power.",
   "data": {
    "id": "Cyorian sewer residue sample",
    "name": "Cyorian sewer residue sample",
    "description": "One original local sealed sample obtained through supported field observation, not a captured creature or copied power.",
    "value": 1,
    "tags": {
     "expedition": true,
     "book_world_mol": true
    }
   }
  },
  {
   "id": "book.mol.item.cyorian_retrieved_watch",
   "kind": "item",
   "part": "K9",
   "status": "authored",
   "tier": "T2",
   "summary": "The finite local retrieval objective, represented in hatch stock. Return it to the willing client once.",
   "data": {
    "id": "Cyorian retrieved watch",
    "name": "Cyorian retrieved watch",
    "description": "The finite local retrieval objective, represented in hatch stock. Return it to the willing client once.",
    "value": 1,
    "tags": {
     "expedition": true,
     "book_world_mol": true
    }
   }
  },
  {
   "id": "book.mol.item.cyorian_annotated_design_notebook",
   "kind": "item",
   "part": "K9",
   "status": "authored",
   "tier": "T2",
   "summary": "Player-authored mature design record compiled from completed study and actual observed outcomes. Material is exportable; magical operation is local.",
   "data": {
    "id": "Cyorian annotated design notebook",
    "name": "Cyorian annotated design notebook",
    "description": "Player-authored mature design record compiled from completed study and actual observed outcomes. Material is exportable; magical operation is local.",
    "value": 1,
    "tags": {
     "expedition": true,
     "book_world_mol": true
    }
   }
  },
  {
   "id": "book.mol.item.cyorian_guest_library_pass",
   "kind": "item",
   "part": "K9",
   "status": "authored",
   "tier": "T2",
   "summary": "Ilsa’s explicit original guest access, distinct from enrolment or commercial mage certification.",
   "data": {
    "id": "Cyorian guest library pass",
    "name": "Cyorian guest library pass",
    "description": "Ilsa’s explicit original guest access, distinct from enrolment or commercial mage certification.",
    "value": 1,
    "tags": {
     "expedition": true,
     "book_world_mol": true
    }
   }
  },
  {
   "id": "book.mol.item.cyorian_scavenger_reach_hook",
   "kind": "item",
   "part": "K9",
   "status": "authored",
   "tier": "T2",
   "summary": "Original adversary’s short physical reach tool. It supports a bounded threatened hatch strike, not magic, an unlimited attack or all tunnel ownership.",
   "data": {
    "id": "Cyorian scavenger reach hook",
    "name": "Cyorian scavenger reach hook",
    "description": "Original adversary’s short physical reach tool. It supports a bounded threatened hatch strike, not magic, an unlimited attack or all tunnel ownership.",
    "value": 1,
    "tags": {
     "expedition": true,
     "book_world_mol": true
    }
   }
  },
  {
   "id": "book.mol.item.cyorian_taiven_focus_staff",
   "kind": "item",
   "part": "K9",
   "status": "authored",
   "tier": "T2",
   "summary": "Taiven’s own formula-bearing combat implement. It supports her bounded field response and grants no player entitlement.",
   "data": {
    "id": "Cyorian Taiven focus staff",
    "name": "Cyorian Taiven focus staff",
    "description": "Taiven’s own formula-bearing combat implement. It supports her bounded field response and grants no player entitlement.",
    "value": 1,
    "tags": {
     "expedition": true,
     "book_world_mol": true
    }
   }
  },
  {
   "id": "book.mol.job.house_shift",
   "kind": "job",
   "part": "K8",
   "status": "authored",
   "tier": "T2",
   "summary": "Local command book.mol.house_shift: Complete Imaya’s actual kitchen sorting · 8 crowns + bread"
  },
  {
   "id": "book.mol.job.catalog_shift",
   "kind": "job",
   "part": "K8",
   "status": "authored",
   "tier": "T2",
   "summary": "Local command book.mol.catalog_shift: Repair the public shelf catalogue · 12 crowns + paper"
  },
  {
   "id": "book.mol.job.kael_shift",
   "kind": "job",
   "part": "K8",
   "status": "authored",
   "tier": "T2",
   "summary": "Local command book.mol.kael_shift: Sort Kael’s permitted laboratory labels · 8 crowns + paper"
  },
  {
   "id": "book.mol.food.meal",
   "kind": "food",
   "part": "K8",
   "status": "authored",
   "tier": "T2",
   "summary": "Local command book.mol.meal: Eat your actual bread in Imaya’s kitchen · 1 crown, 2 min"
  },
  {
   "id": "book.mol.food.bread",
   "kind": "food",
   "part": "K8",
   "status": "authored",
   "tier": "T2",
   "summary": "Local command book.mol.bread: Buy 1 Cyorian bread parcel · 1 local crowns"
  },
  {
   "id": "book.mol.price.guest_room",
   "kind": "price",
   "part": "K8",
   "status": "authored",
   "tier": "T2",
   "summary": "Local command book.mol.guest_room: Pay for a quiet guest interval · 1 crown, 4 min"
  },
  {
   "id": "book.mol.price.guest_pass",
   "kind": "price",
   "part": "K8",
   "status": "authored",
   "tier": "T2",
   "summary": "Local command book.mol.guest_pass: Obtain Ilsa’s actual guest pass · 2 crowns, 2 min"
  },
  {
   "id": "book.mol.price.mana_assessment",
   "kind": "price",
   "part": "K8",
   "status": "authored",
   "tier": "T2",
   "summary": "Local command book.mol.mana_assessment: Pay Ilsa to assess your actual personal-mana compatibility · 2 crowns"
  },
  {
   "id": "book.mol.price.paper",
   "kind": "price",
   "part": "K8",
   "status": "authored",
   "tier": "T2",
   "summary": "Local command book.mol.paper: Buy 2 Cyorian research paper · 2 local crowns"
  },
  {
   "id": "book.mol.price.ink",
   "kind": "price",
   "part": "K8",
   "status": "authored",
   "tier": "T2",
   "summary": "Local command book.mol.ink: Buy 1 Cyorian formula ink · 1 local crowns"
  },
  {
   "id": "book.mol.price.cube",
   "kind": "price",
   "part": "K8",
   "status": "authored",
   "tier": "T2",
   "summary": "Local command book.mol.cube: Buy 1 Cyorian blank stone cube · 2 local crowns"
  },
  {
   "id": "book.mol.price.oil",
   "kind": "price",
   "part": "K8",
   "status": "authored",
   "tier": "T2",
   "summary": "Local command book.mol.oil: Buy 1 Cyorian lamp oil · 1 local crowns"
  },
  {
   "id": "book.mol.price.rope",
   "kind": "price",
   "part": "K8",
   "status": "authored",
   "tier": "T2",
   "summary": "Local command book.mol.rope: Buy 1 Survey rope · 1 local crowns"
  }
 ],
 "laws": [],
 "generators": [],
 "unknowns": [
  {
   "id": "book.mol.unknown.1",
   "question": "Exact synchronization to the source recurring month"
  },
  {
   "id": "book.mol.unknown.2",
   "question": "Compatibility of the retained native body with personal Cyorian mana"
  },
  {
   "id": "book.mol.unknown.3",
   "question": "Unseen sewer ecology and city-wide future"
  },
  {
   "id": "book.mol.unknown.4",
   "question": "Canonical availability of a non-mage keyed lamp operator"
  }
 ],
 "tiers": {
  "K2": "T2",
  "K3": "T2",
  "K6": "T2",
  "K8": "T2",
  "K9": "T2",
  "K13": "T4"
 }
};
