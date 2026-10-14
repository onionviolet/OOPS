---
name: topic-expansion-audit
description: Run or rerun a YAIRPG design-topic core audit - root considerations palette in rounds, parallel Codex lanes with owned files, lane returns folded in, USER_VISION record, and a safe own-paths commit. Use when Weibao asks "more to consider? ... save and extend accordingly, send out codex" about a topic, or asks to repeat a saved core audit (e.g. docs/audits/COMPANIONS_CORE_AUDIT.md).
---

# Topic expansion audit

Follow `docs/audits/TOPIC_EXPANSION_AUDIT_PLAYBOOK.md`. If a
`docs/audits/<TOPIC>_CORE_AUDIT.md` exists, start from it: read its trigger
table and run log, diff what changed since the last run, and rerun only the
affected lanes in a new dated dispatch folder.

Short version:

1. Search docs for existing owners; link them.
2. Append a round to the root palette with new angles on every axis asked.
3. Launch Codex lanes detached (`runs/launch.py`), one writer per file,
   session ids in `runs/SESSIONS.md`.
4. Fold lane returns as they land, corrections first.
5. Record the round in USER_VISION and IDEA_INDEX.
6. Commit only this run's paths with
   `docs/audits/tools/commit_own_paragraphs.py`; push or merge only on an
   explicit yes.
7. Update the core audit's run log.
