# G4 variants, mantles and retcons

2026-10-14. **PROPOSAL ONLY.** Original worked fixtures, not current save
schema or canon histories. [Root CG1/CG7/CG9, GI2/GI6/GI7, SB18–SB26](../../../../GENERATION_FOUNDATION_RULES_2026-10-14.md#round-2-2026-10-14-comic-worlds-generation-cheats-overarching-shape-abstractions)
and [world kit Round 6](../../../../worlds/WORLD_CORE_KIT_2026-10-14.md#round-6-comic-worlds-cheats-that-show-the-kit-overarching-shape-abstractions-2026-10-14)
own rules. [PROFILES](PROFILES.md#source-boundary-and-locators) W1–W4/M1–M2/B1–B2
provide qualified source leads. Every example here is INFERRED original design.
G6 owns address/pin interfaces; G3 owns overlay operations; E1/P1 own stream
root persistence. This file proposes the payloads those owners must reconcile.

## CG1: one person, three Earths

Original root `person:quay:arun-vale`, snapshot `root-people@1`: Arun Vale,
local naming culture, birth fact, practical temperament and mechanical-learning
predisposition. Roots are design identity/correlated traits, not shared souls,
experiential memory, money or agency. Each counterpart has a separate actor ID.

| Field | Shared root | Earth A, civic charter | Earth B, concession charter | Earth C, open workshop charter |
|---|---|---|---|---|
| Identity | Same root/person-name seed; actual name Arun Vale is frozen | `actor:a:arun`; depot trainee | `actor:b:arun`; subcontractor bookkeeper | `actor:c:arun`; clinic equipment helper |
| Institution cause | Mechanical predisposition is common; no profession is inherited | Public apprenticeship exists | Depot jobs outsourced; apprenticeship absent | Clinic admits paid equipment apprentices |
| Means / origin | No power in root; aptitude is not mastery | Unpowered; borrowed meter under depot custody | Unpowered; ordinary accounts tools | Compatible learned service faculty through actual later workshop course, not birth grant |
| Codename | Optional public theme seed `signal`, no name at root | None at ordinary start | None at ordinary start | Later coined `Quaywhistle`, only if actually adopted |
| Look / life | Broad culture/disposition inputs retained | Issued work vest, actual wage reservation | Employer ledger, own rental obligation | Fitted kit, course obligations |
| Relationships | No root-local relationship events or feelings | Trusts coworker after actual shared repair | Rivalry after a documented missed settlement | Meets a tutor through real attendance |
| Knowledge | No root-shared observations | Knows tested meter fault from `obs:a:17` | Does not know that fault | Does not know A's test or B's debt |
| History / damage | Birth fact is invariant in this fixture | Depot service restored at local day 7 | Same street is still contracted out | Clinic repair is pending; no imported completion |

The world-law divergence is charter, not three unrelated job rolls. Eligibility
queries read the charter before occupation/admission. Power access in C is a
later caused event. No table turns mechanical aptitude into free mastery.
Shared means/biographies must be explicitly declared baseline facts if wanted;
they are not silently inferred from root identity. Changed household, birth or
body is possible through an explicit divergence, with dependent relationships
revalidated. All three can stay ordinary indefinitely.

### Proposed draw and resolution shape

Use a canonical structured derivation over `(existingWorldRootRef, personRootId,
continuityId, saltId, algorithmRev)` for continuity-specific draws. Shared traits
use a root-person address without continuity salt. Persist the salt identifier;
it never changes on reveal, era shift, load or table update. Encoding/hash/stream
implementation belongs to G6/E1, not this pseudocode. Each domain has its own
address. Rejecting C's name must not change its capability or A/B's results.

Resolution order: immutable versioned root-person snapshot → versioned local
continuity baseline → explicit divergence overlay → caused actor-local changes.
The profile defines allowed paths and dependent constraints. A frozen value
resolves from its retained revision/actual saved result, not the current table.
Canon pins follow the root pin owner's precedence; a conflicting explicit AU
must declare its divergence rather than accidentally winning a merge.

**Divergence-only** means storing a base ref plus changed paths, local facts and
local evidence. No `deepClone(rootPerson)` or full-world snapshot per Earth.
The root's actual invariant values are stored once. Saved mutable actor-local
state is still necessary, but it belongs to that actor, not a copy of the base.

```json
{
  "comicGeneration": {
    "schemaRev": 1,
    "profileRefs": {"quay": "masked-city@1"},
    "rootPeople": {
      "person:quay:arun-vale": {
        "baseRef": "root-people@1/arun-vale",
        "frozen": {"civilianName": "Arun Vale", "birthFactRef": "birth:arun:1"},
        "sharedTraitRefs": ["trait:practical@1", "trait:mechanical-study@1"]
      }
    },
    "continuities": {
      "earth:a": {"baseRef": "quay-baseline@1", "saltId": "salt:a:1", "changes": {"charterRef": "civic@1"}},
      "earth:b": {"baseRef": "quay-baseline@1", "saltId": "salt:b:1", "changes": {"charterRef": "concession@1"}},
      "earth:c": {"baseRef": "quay-baseline@1", "saltId": "salt:c:1", "changes": {"charterRef": "open-workshop@1"}}
    },
    "counterparts": {
      "actor:a:arun": {"rootRef": "person:quay:arun-vale", "continuityRef": "earth:a", "changes": {"jobRef": "job:depot-trainee@1"}, "localStateRef": "actor-state:a:arun", "knowledgeOwnerRef": "knowledge:a:arun", "freezeRefs": ["freeze:a:name:1"]},
      "actor:b:arun": {"rootRef": "person:quay:arun-vale", "continuityRef": "earth:b", "changes": {"jobRef": "job:bookkeeper@1"}, "localStateRef": "actor-state:b:arun", "knowledgeOwnerRef": "knowledge:b:arun", "freezeRefs": []},
      "actor:c:arun": {"rootRef": "person:quay:arun-vale", "continuityRef": "earth:c", "changes": {"jobRef": "job:clinic-helper@1"}, "localStateRef": "actor-state:c:arun", "knowledgeOwnerRef": "knowledge:c:arun", "freezeRefs": []}
    }
  }
}
```

`knowledge:*` and `actor-state:*` are conceptual owner refs, not known exports.
There is no root knowledge map. Memory sharing requires an actual permitted
carrier/cheat transaction, recipient, scope and receipt; it never merges whole
knowledge maps. G4's public fixture has no secret assignment or value.

## CG7: mantle succession

Source lead: pilot B1 F7 names six distinct transfer mechanisms; M2's OFA is an
exceptional power transfer, not a generic consequence of inheriting a hero name.
Worm/Ward source evidence does not establish ordinary codename power succession.
Separate title, source, item custody, office authority and recognition.

Original office **Beacon of the Quay** has persistent ID `mantle:quay-beacon`.
It begins with an authored incumbent and a custodied signal rig. Arun can first
earn ordinary maintenance work, then be nominated after an actual service
receipt. Refusal, training, acting-holder status and a contested claim remain
reachable. The first service job works without succession.

| Code | Succession stage | Data / consumer |
|---|---|---|
| ML1 | Vacancy or transition | Actual retirement/death/resignation/charter cause opens a claim slot. Simultaneous holders require an explicitly plural office rule. A dead holder is not deleted from history. |
| ML2 | Candidate and consent | Candidate ref, nomination receipts, eligibility rubric/revision and acceptance receipt. Roll eligible original candidates only if no authored choice is pinned; never reroll a rejected candidate on reload. |
| ML3 | Settlement | Validate source/rig custody, issuer authority and role capacity; atomically end old tenure and begin new tenure. Office standing/known rival claims transfer by policy; personal affection/debt only transfers under actual agreement. |
| ML4 | Public recognition | Institutions retain issuer/date, accepted or disputed holder claims. Rival challenges read communicated claims, not global instant knowledge. Civilian persona remains distinct. |
| ML5 | Ability boundary | Rig custody grants only its supported capabilities; the predecessor's body/learned skill does not transfer. Trial, patron, possessing-force or item-will profiles need their own source/agency methods. |

Mantle enemies are claims on the office, with dated target/knowledge/reason.
Personal enemies remain attached to their actual person. New holder can settle,
evade, challenge or disregard a communicated office claim; title inheritance
does not auto-start a fight. Reputation is inherited as an attributed expectation,
not a forged deed history. Names are deliberate title claims, not accidental
codename-generator collision exemptions.

```json
{
  "mantles": {
    "earth:a/mantle:quay-beacon": {
      "baseRef": "mantle-def:quay-beacon@1",
      "continuityRef": "earth:a",
      "revision": 2,
      "holderRef": "actor:a:arun",
      "tenureRefs": ["tenure:beacon:1", "tenure:beacon:2"],
      "transferReceiptRef": "transfer:beacon:2",
      "changes": {"recognitionClaimRefs": ["claim:depot:2"], "officeEnemyClaimRefs": ["claim:contractor:4"], "gearCustodyRef": "custody:signal-rig:2"}
    }
  },
  "mantleTransfers": {
    "transfer:beacon:2": {
      "expectedRevision": 1,
      "fromRef": "actor:a:incumbent",
      "toRef": "actor:a:arun",
      "methodRef": "appointment-and-consent@1",
      "eligibilityReceiptRefs": ["service:a:31", "consent:a:32"],
      "rightsPolicyRef": "beacon-rights@1",
      "status": "committed"
    }
  }
}
```

Maps above are fields within the proposed `comicGeneration` namespace. Local
mantle definition resolves from an immutable base plus changes; tenure history
is append-only references. No second copied office/rig appears in another Earth.
Cross-world passage needs an explicit carrier and local recognition decision.
Preview validates without reserving title/gear or ending a tenure. Commit has
an idempotency key and expected revision; two simultaneous appointments cannot
both succeed. Save at pending and committed boundaries, then reload/import,
must preserve holder, custody, claims and the next draw.

## CG9: retcon with residue

Original small fixture: a lamp was recorded as transit-bureau property. A
selected in-fiction **Charter Correction** mechanism changes that ownership
fact to a neighborhood trust at revision 2. The old signed work order survives
as residue. This is a declared truth rewrite, not a newly discovered mistake
or ordinary table upgrade. Use an ordinary correction event if truth itself
never changed.

| Code | Phase | Required behavior |
|---|---|---|
| RC1 | Scope/quote | Mechanism ref, cost/source, permitted truth paths, old revision and bounded dependency set. Preview shows knowledge-safe affected domains, not hidden values. No write during quote. |
| RC2 | Commit | Append new revision and old/new fact refs, move active pointer, consume declared means once. Expected-revision conflict rejects before any debit. Dependent ownership/access updates are one transaction; actual earlier payments stay paid. |
| RC3 | Residue | Old work-order artifact keeps its original frozen rendered text and provenance. Only viewers who read it get an observation; remembered ambiguity needs an explicit mechanism/carrier. No global synchronized half-memory. |
| RC4 | Consequence | Future maintenance authorization now requires the trust. A prior lawful paid repair remains historical fact. If the mechanism also changes restitution, use a separately conserved settlement receipt; no automatic refund/item regeneration. |
| RC5 | Revision/reversal | Later content updates leave this saved chain exact. Reversing the retcon appends revision 3 under another permitted transaction; it never deletes 1/2 or resets event pay. |

```json
{
  "retcons": {
    "retcon:a:lamp:1": {
      "mechanismRef": "charter-correction@1",
      "continuityRef": "earth:a",
      "subjectRef": "object:a:quay-lamp",
      "path": "ownerRef",
      "expectedRevision": 1,
      "beforeFactRef": "fact:lamp-owner:1",
      "afterFactRef": "fact:lamp-owner:2",
      "dependencyRefs": ["permission:lamp-maintenance:2"],
      "costReceiptRef": "cost:correction:a:9",
      "residueRefs": ["artifact:a:old-work-order"],
      "status": "committed"
    }
  },
  "truthHeads": {"earth:a/object:a:quay-lamp/ownerRef": {"factRef": "fact:lamp-owner:2", "revision": 2}},
  "residue": {
    "artifact:a:old-work-order": {"baseRef": "signed-order:a:1", "priorFactRef": "fact:lamp-owner:1", "carrierRef": "object:a:paper-order", "observationRefs": ["obs:a:order-reading:1"]}
  }
}
```

These fields join the same additive namespace. They store changes, receipt
refs and a revision chain, not a full alternate-world copy. Shared roots and
Earth B/C remain untouched. Cause/identity handles remain stable when text
changes. Prior observations remain dated beliefs about prior truth, not patched
omniscient observations. Lenses read permitted receipts through existing
projection; a public debug report cannot expose sealed before/after values.

## Compatibility and retention decision

**Proposed additive, opt-in migration:** an old save with no `comicGeneration`
loads with an empty read view and keeps absent storage absent until explicit
enrollment/new comic instance. No invented salt, counterpart, mantle, death,
retcon or changed birthday on legacy load. Enrollment records its profile/revision
and uses the existing root owner; do not back-derive seeds from save contents.
New actors default to one persona under the existing persona proposal, with
separate standing/knowledge owners. Existing saves' defeat behavior remains exact.

Persist actual revealed results and immutable root/profile refs plus local
deltas. Retain resolver revisions or the referenced base snapshot once per
save, so deleting a table row cannot alter a known actor. Do not compact away
before facts/residue referenced by a frozen document, observation or claim.
Full timeline copies and unbounded whole-history explain logs are unnecessary.

Unknown schema/resolver/base refs reject import before mutation with a neutral
unsupported-revision message; they do not fall back to a current replacement
person or reveal hidden candidates. Root validates actual existing save adapters
before implementing this proposal. The JSON examples are structural sketches,
not executable schemas or proof of importer support.

## Acceptance fixtures for a later builder

| Gate | Observable invariant |
|---|---|
| V-G1 | Generate A/B/C in different visit orders; shared invariant traits match, eligible local divergences remain exact; C learns nothing from A/B until a real carrier transaction. |
| V-G2 | Freeze A's name/power/file, upgrade unseen tables and reveal B/C; A keeps its actual values and old revisions, B/C use admitted revisions without changing root identity. |
| V-G3 | Preview/decline/commit succession; two contenders cannot duplicate holder/rig rights; predecessor history and private knowledge persist. |
| V-G4 | Quote then commit retcon, interrupt/reload at pending/committed boundary, import twice; cost settles once, truth revision/residue remain exact, earlier wages/installed goods stay conserved. |
| V-G5 | Old absent namespace stays absent; unsupported refs reject atomically; run the root's GR16 seed/golden/next-draw roundtrip tests plus fresh rebuilt desktop play for the selected consumer. |

All five are **NOT RUN**. This lane checks docs, not native save behavior.
