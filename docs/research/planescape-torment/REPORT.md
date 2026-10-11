# Planescape: Torment: Enhanced Edition, section C

Completed targeted read-only source audit, 2026-10-10. Spoilers throughout.
Steam app 466300, build 25492483, fully installed. Nothing was launched,
changed in the install, built, committed or uninstalled.

**F1, seen in data or code and seen in text:** Death is an action the story
can use. A public demonstration increments the death counter and changes a
lecture; Jolmi pays for the experience. Area configuration specifies return
locations, sometimes with separate companion routing. This is not an heir
or random next-life system. [Evidence](FINDINGS.md#f1-death-and-return)

**F2, seen in text with data gates:** Earlier lives are not automatically
forgotten after every playable death. Nordom explicitly lets you correct that
claim using your current death count. The final adversary can be confronted
with the same fact. The old amnesiac history and this playable life differ.
[Evidence](FINDINGS.md#f2-amnesia-is-not-a-universal-death-tax)

**F3, seen in data or code and seen in text:** Earlier selves remain through
body inscriptions, a trapped journal, recorded experiences, witnesses and
binding promises. A recovered language opens the journal. Meeting previous
selves permits distinct merges; recovering the true name opens a later
confrontation route. Records and relationships carry different things.
[Evidence](FINDINGS.md#f3-carriers-of-earlier-lives)

**F4, inferred from named source evidence:** The useful YAIR opportunity is
an optional world where the player investigates their own prior acts and
can accept, repair or contest their consequences. Eight ranked
[implementation proposals](IMPLEMENTATION_PACKETS.md) and 25
[small touches](SMALL_TOUCHES.md) map this to existing systems. These are
options for review, not accepted design or authorization to implement.

**F5, seen in text and inferred:** The source also resists our lens. It uses
one authored immortal and curated past selves, not a generational society.
Its story describes other people dying in your place, yet inspected dialogue
also makes death profitable and demonstrable. Some playful choices change
moral counters, and major recollection rewards depend on attribute gates.
The resulting usability and balance concerns are analyst inferences, not
measured player consensus. [Contradictions and limits](FINDINGS.md#unbiased-readback)

The manual describes ordinary death as retaining possessions and stats, while
warning of permanent endings. That is documentation evidence, not a test of
this installed executable. [Beamdog manual, section V](https://files.beamdog.com/files/PSTEE_Manual_en.pdf)

All seven assigned outputs are present. Raw game text and extracted resources
stay private under `~/.codex/research/planescape-torment/`; project documents
contain paraphrases and reproducible locators. Extraction parsed 854 dialogues;
semantic review was targeted. Native return/HP handling, complete alignment
classification and unvisited branches remain opaque or unverified as detailed
in [COVERAGE](COVERAGE.md). The source pass is complete; there is no playable
acceptance claim. Weibao can manage removal of the install when ready.
