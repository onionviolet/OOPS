---
name: source-deep-dive
description: Deep dive a book, series, game or wiki for YAIRPG - catalog its power system, turn its rules into engine state, survey fan premises for living beside the protagonist, cross-check the community wiki, and write an implementation-ready synthesis. Use when Weibao asks for a "deep dive", "audit", "considerations" or "how to implement" a source's system or world.
---

# Source deep dive

Follow `docs/research/SOURCE_DEEP_DIVE_PLAYBOOK.md` in this repo. It holds
the modules, steps, reader prompt skeleton, wiki route and synthesis
outline. Tools live in `docs/research/tools/book_deep_dive/`.

Short version:

1. Search `docs/` for earlier work on the source and build on it.
2. Find the local copy (Calibre, Downloads; see
   `docs/research/novels/LOCAL_LIBRARY.md`). Extract it with
   `epub_to_json.py` into the session scratchpad, never into git.
3. Verify the core laws yourself in the text first.
4. Dispatch parallel Sonnet readers (Agent tool, `model: "sonnet"`, run in
   background), each with its own output file. Add a WebSearch reader for
   fan premises when the question involves the protagonist.
5. Spot-check surprising reader claims directly.
6. Cross-check the wiki in the in-app browser with
   `wiki_api_in_browser.js` (scripted fetches usually get 403). Record
   revision ids.
7. Write the synthesis in the source's private research folder, copy the
   reader files beside it, and report what was read, what was blocked and
   what stays open.

Everything produced is research and proposals until Weibao accepts it.
