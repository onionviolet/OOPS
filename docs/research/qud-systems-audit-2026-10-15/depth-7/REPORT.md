# Qud depth 7: recovery of preserved contextless actors

2026-10-15. Research only. Same pinned Assembly-CSharp2.0.211.56 SHA256 `2cc28fba5a86221e27bfdcaa5f5a91a2e249fd474814dce7cff25a9a649b8589`. No game, save experiment, personal data or YAIRPG implementation. A small analyst-built tool reads PE metadata/IL only; it does not load or execute the game assembly.

**Q7-F1:** Preserved actors remain usable as references. Damage/death credit and thermal events can refer to them; party consumers can inspect retained bodies and update selected effects. Reference access is not world placement. The direct field scan retains61 uses of the four Physics attribution fields across62,661 managed method bodies, with no decode errors. That is navigation evidence, not semantic reading of the whole assembly.

**Q7-F2:** Ordinary recovery paths still do not select these actors. The join-party command scans actors already in cached-zone cells. Brain's ordinary action path exits when IsNowhere before reaching follow logic. A party wrapper has no automatic integer-ID recovery, although individual consumers can explicitly try lookup or use a retained body.

**Q7-F3:** Generic movement can accept a null origin and re-establish context when a caller supplies the actor and a valid destination and all gates succeed. The inspected attribution consumers do not supply such a rescue. Several return values acknowledge an attempt rather than verified placement, including Cell.AddObject's same-object return on rejected entry and party-follow's ignored movement result.

[Full decoded consumers](RECOVERY_CONSUMERS.md), [independent audit](independent-audit/REPORT.md), [root unread](../private/depth-7/UNREAD.json), [independent unread](independent-audit/UNREAD.md), [exact cumulative line complements](../private/depth-7/CUMULATIVE_LINE_COVERAGE.json) and [validation](VALIDATION.json) preserve exact scope. [Depth6](../depth-6/REPORT.md) remains the positive conditional body-preservation owner; [depth5](../depth-5/REPORT.md) owns queue admission/expiry. No generic permanent loss, impossible recovery or native bug is claimed.

Full selected classes, exact source windows, commands, receipts, metadata scan/tool source/binary and hashes remain in [private depth7](../private/depth-7/). Seven root captures include five reuses and two new exports; six types have printed windows. Root cumulative452 captured types includes234 without root printed windows. Independent coverage is separate; method scanning is not added as source-reading credit.
