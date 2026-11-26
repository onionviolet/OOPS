# Idea owners to reading handoffs

Status: agent-verified in the rebuilt desktop Atlas, not human-reviewed.

## Preflight

| Field | Scope |
|---|---|
| Request | The Workbench idea directory offered a handoff shortcut but no way to see saved proposals that cite an owner. Repair that observed connection using the existing local handoff queue. |
| Authority | Parent's bounded reverse-lookup task; AD6/AD36; [UI rules](../../../UI_RULES.md) UR70–UR75, with the existing Workbench Ideas surface. The directory owns discovery, not decisions or backlog priority. |
| Visible result | At desktop 1366×768, a cited owner expands to its saved handoffs, including attached-report counts. The user can filter directory sections or owners with handoffs, then open the original proposal. Mobile is deferred. |
| Fit and seam | Public owner directory and existing `GET /reading-handoffs`; complete Markdown reference tokens and unique filename shorthand; source packets remain immutable. No gameplay or save change. |
| Ownership | `idea-owners.mjs`, its view, shared reference matcher, focused tests/proof and scoped CSS. Parent explicitly granted the static module route and `/idea-owners` API hunk in `serve.mjs`. Handoff preparation/report attachment remains the parent's lane. |
| Adverse cases | Similar filenames and anchors must not collide; ambiguous shorthand, traversal/private/sealed references must not create owners; an unavailable handoff queue must not look like a zero count. |

Voice sample: “These documents include proposals, completed work and historical plans.” The new directory explanation preserves that distinction. A citation is a saved proposal, and an implementation report is an attachment rather than automatic acceptance or completion.

## Behavior

The directory retains its indexed owners and public backlog documents, then admits existing public Markdown owners actually cited by saved handoffs. The current two chapter-127 proposals add Making Rules and the read-ahead owner to the former 443 references, producing 445 directory references. This number does not count open work.

Typed text such as `MR10/MR13/MR25-MR27/MR32; docs/MAKING_RULES.md; RA21 in READ_AHEAD_USE_2026-11-08.md` stays intact in its packet. The reverse lookup recognizes the complete document references. A bare filename resolves when its public document path is unique. A document citation appears at its document owner; an anchored owner requires that specific anchor. Private/sealed paths and paths outside `docs/` remain excluded through the directory's path and realpath checks.

| State | Display |
|---|---|
| Owner has saved proposals | Expand a named count and follow links to the original handoffs, with Proposed and attached-report counts kept distinct. |
| Owner has no readable saved proposal | A qualified empty message appears for that owner. |
| Search or section has no matches | Zero directory references; no claim about completed or open ideas. |
| Handoff request fails | Directory remains usable; citation counts are unavailable and the handoff filter is disabled. |
| Some queue files are unreadable | A warning explains that counts cover readable proposals. |

## Verification

| Check | Result |
|---|---|
| `node --test tests/atlas_idea_owners.test.js tests/atlas_reading_handoffs.test.js` | 11/11 passed. Covers public cited owners, unchanged typed references, whole-token/anchor matching, ambiguous shorthand, restricted paths and existing immutable proposal/report boundaries. |
| `node prototypes/world-atlas/prove-idea-owners.mjs` | Passed, exit 0 at 1366×768. Ordinary snapshot rebuild has failures `[]`, native map 79/100. Actual quota and upkeep proposals link from Making Rules; the attached report stays distinct. Typed references, unique filename lookup, section filter, empty state, direct refresh, no overflow/page exceptions and a simulated queue-503 adverse case pass. No POST or synthetic proposal. |
| `git diff --check` on changed existing paths; module syntax checks | Passed during editing. |
| `npm run check:docs` | Passed, no new hits. |

Snapshot SHA-256: `79d9071470a1b8a8a729920ca83e3f7e4caf39b4aa58fbcd9511fa757f3ab25d`. [Machine proof](../../../representations/evidence/atlas-idea-owners-2026-11-25/proof.json), [owner reverse links](../../../representations/evidence/atlas-idea-owners-2026-11-25/owner-reverse-links-1366.png), [actual quota handoff](../../../representations/evidence/atlas-idea-owners-2026-11-25/actual-quota-handoff-1366.png). The owner capture was visually inspected. The actual quota packet is `221e0889c81cd9655cfd425fb1688bd1d853032c8d1e1e4e2ea5a5ba6af05715`; upkeep is `e9d91f20f0d853fff601abafa85e8be05c5d28c52fb9ac5be3d19ada168183db` with one attached report.

Proof scratch snapshots and owned server/browser processes were removed. Windows teardown tolerates an already exited Chrome child, including taskkill's no-running-instance status; the final run exits 0 after cleanup. Retained artifacts are the proof script, screenshots, machine proof and this receipt.

The parent owns integrated release gates. The local handoff packets remain in the existing private `work/` queue under its ownership. This lane does not claim that the quota proposal was implemented or that the earned Klein route is verified.
