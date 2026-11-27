# Hogwarts spellcraft slice, November 26

PFP1, PFP3, PC8 and PC95. Use the existing Hogwarts Capability run to extinguish wand-light. The source comparison found no upstream YAIR spellcraft equivalent. OOPS already encodes the Nox remove-light operation, so this slice connects that spell to normal play through the existing spell law and world effect host. [Foundation plan](../../../PROCEDURAL_FOUNDATION_PLAN.md) · [Spell vocabulary and held-out B7 p4265](../../../research/HOGWARTS_SPELL_VOCABULARY_PROPOSAL_2026-11-11.md)

The existing run contains one wand. Nox removes all its light, including after repeated Lumos. Casting in a dark room leaves the light at zero. The base Lumos amount and duration stay at four and thirty game minutes in this run. One existing run gains an action. It adds no world, lead, saved key or core-owner file. No registration lines or new import edges.

| Check | Evidence |
| --- | --- |
| Build | `npm run build` to `work/oops-nov26-foundation`, with bundle SHA recorded in the replay. |
| Normal entry and result | Fresh Village Play, Capability runs, Hogwarts, Begin this run. At 1920×1080, Nox on an unlit room kept zero, Lumos raised light to four, Save and reload kept four, Nox returned it to zero, and Lumos worked again. Zero page errors. |
| Focused regression | `node --test tests/effect_laws_land.test.js`, 4/4. Includes restore of the Lumos state, repeated casting and Nox in the dark. |
| Scope | Browser replay covered Save and reload. The run uses its existing save format. Mobile and the installed desktop app remain outside this receipt. Agent verified, human review optional. |

[Replay](proof.json) · [Desktop capture](nox-1920.png)
