# Dungeon Crawl Stone Soup and Cataclysm: Dark Days Ahead: small touches, 2026-10-14

Each entry is an original PROPOSAL derived from the linked source aspect. Source facts are in ASPECTS, not asserted as absent from YAIRPG. Use the current owner before adding anything. None is runtime-verified here.

## Dungeon Crawl Stone Soup

| ID | Small touch / caution | Source evidence | Likely YAIR owner |
|---|---|---|---|
| crawl-T01 | Reduce chatter for permanent companions. | [A01](ASPECTS.md#A01) | `src/display.js / existing content owner` |
| crawl-T02 | Let distinctive actors have more distinctive contextual barks. | [A01](ASPECTS.md#A01) | `src/display.js / existing content owner` |
| crawl-T03 | Distinguish visual gestures from audible speech. | [A01](ASPECTS.md#A01) | `src/display.js / existing content owner` |
| crawl-T04 | Suppress visual cues when the actor cannot be seen. | [A01](ASPECTS.md#A01) | `src/display.js / existing content owner` |
| crawl-T05 | Select barks from current fleeing/confused/allied state. | [A01](ASPECTS.md#A01) | `src/display.js / existing content owner` |
| crawl-T06 | Filter routine history into meaningful milestones. | [A02](ASPECTS.md#A02) | `src/display.js / existing content owner` |
| crawl-T07 | Keep a stable cause on a chronicle entry. | [A02](ASPECTS.md#A02) | `src/display.js / existing content owner` |
| crawl-T08 | Name why automatic exploration or work stopped. | [A06](ASPECTS.md#A06) | `src/display.js / existing content owner` |
| crawl-T09 | Let players choose which useful discoveries stop a plan. | [A06](ASPECTS.md#A06) | `src/display.js / existing content owner` |
| crawl-T10 | Offer a functional training target. | [A08](ASPECTS.md#A08) | `src/simulation.js` |
| crawl-T11 | Distinguish base and modified training goals. | [A08](ASPECTS.md#A08) | `src/simulation.js` |
| crawl-T12 | Notify when the actual target is reached. | [A08](ASPECTS.md#A08) | `src/simulation.js` |
| crawl-T13 | Default destructive save deletion to no. | [A04](ASPECTS.md#A04) | `src/native_storage_transaction.js` |
| crawl-T14 | Avoid rewriting a save header merely to inspect it. | [A04](ASPECTS.md#A04) | `src/native_storage_transaction.js` |
| crawl-T15 | Persist which contextual hints remain useful. | [A10](ASPECTS.md#A10) | `src/display.js / existing content owner` |
| crawl-T16 | Keep hint state separate from earned ability. | [A10](ASPECTS.md#A10) | `src/display.js / existing content owner` |
| crawl-T17 | Separate branch-generation randomness from ordinary play. | [A08](ASPECTS.md#A08) | `src/simulation.js` |
| crawl-T18 | Restore the prior RNG scope after a temporary operation. | [A08](ASPECTS.md#A08) | `src/simulation.js` |
| crawl-T19 | Recheck an actor before acting on a queued reference. | [A05](ASPECTS.md#A05) | `src/simulation.js` |
| crawl-T20 | Count crossed timer boundaries explicitly. | [A09](ASPECTS.md#A09) | `src/simulation.js` |
## Cataclysm: Dark Days Ahead

| ID | Small touch / caution | Source evidence | Likely YAIR owner |
|---|---|---|---|
| cdda-T01 | Keep unavailable replies visible when the reason helps. | [A01](ASPECTS.md#A01) | `src/display.js / existing content owner` |
| cdda-T02 | Preserve a normal exit when adding responses. | [A01](ASPECTS.md#A01) | `src/display.js / existing content owner` |
| cdda-T03 | Require failure behavior for a social trial. | [A01](ASPECTS.md#A01) | `src/display.js / existing content owner` |
| cdda-T04 | Generate inventory-related replies from actual owned items. | [A01](ASPECTS.md#A01) | `src/display.js / existing content owner` |
| cdda-T05 | Use a portrait override only when a topic needs it. | [A01](ASPECTS.md#A01) | `src/display.js / existing content owner` |
| cdda-T06 | Let success change the actual relationship state. | [A01](ASPECTS.md#A01) | `src/display.js / existing content owner` |
| cdda-T07 | End conversation coherently if a committed effect causes hostility. | [A01](ASPECTS.md#A01) | `src/display.js / existing content owner` |
| cdda-T08 | Keep preview text pure even when the source game does not. | [A01](ASPECTS.md#A01) | `src/display.js / existing content owner` |
| cdda-T09 | Retain a mission identity before an effect can remove it. | [A02](ASPECTS.md#A02) | `src/display.js / existing content owner` |
| cdda-T10 | Give diary and immediate messages different reading roles. | [A02](ASPECTS.md#A02) | `src/display.js / existing content owner` |
| cdda-T11 | Report a failed save without clearing unsaved state. | [A04](ASPECTS.md#A04) | `src/native_storage_transaction.js` |
| cdda-T12 | Keep clock/player/world owners in one declared publication policy. | [A04](ASPECTS.md#A04) | `src/native_storage_transaction.js` |
| cdda-T13 | Throttle autosaves without implying offline simulation. | [A04](ASPECTS.md#A04) | `src/native_storage_transaction.js` |
| cdda-T14 | Distinguish blocked, deferred and satisfied work. | [A05](ASPECTS.md#A05) | `src/simulation.js` |
| cdda-T15 | Process heard speech before deciding the next actor move. | [A05](ASPECTS.md#A05) | `src/simulation.js` |
| cdda-T16 | Validate content before finalizing it. | [A07](ASPECTS.md#A07) | `src/display.js / existing content owner` |
| cdda-T17 | Reject a topic with no response route. | [A07](ASPECTS.md#A07) | `src/display.js / existing content owner` |
| cdda-T18 | Show that practice may consume tools without making an item. | [A08](ASPECTS.md#A08) | `src/simulation.js` |
| cdda-T19 | Save delayed-event context with its deadline. | [A09](ASPECTS.md#A09) | `src/simulation.js` |
| cdda-T20 | Avoid processing global events once per actor. | [A09](ASPECTS.md#A09) | `src/simulation.js` |
