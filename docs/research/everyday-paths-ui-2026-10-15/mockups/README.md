# Everyday paths design viewer

2026-10-15. Standalone proposal artifact, no gameplay implementation. Desktop/laptop target:1366×768. Intended visible outcome: compare how a stable pursuit changes presentation with chosen involvement, retaining current work, useful scope and received evidence. Mobile optimization deferred. Production acceptance follows [UI rules](../../../UI_RULES.md).

Open [index.html](index.html) directly, or visit [running local viewer](http://127.0.0.1:8874/). Static [gallery](gallery.html), [contact sheet](screenshots/overview.jpg), [browser checks](BROWSER_CHECKS.json), [interaction checks](INTERACTION_CHECKS.json) and [review](REVIEW.md) are retained.

To restart the local server when port8874 is free:

```sh
python3 -m http.server 8874 --bind 127.0.0.1 --directory '/Users/weiwei/code/yet-another-idle-rpg/docs/research/everyday-paths-ui-2026-10-15/mockups'
```

| Family | Views |
|---|---|
| Fishing | Personal / Routine / Investigate / Delegation |
| Farming | Personal / Routine / Investigate / Delegation |
| Mining | Current flow plus those four proposed views |
| Potions | Ingredients / Process / Experiment / Work order |
| Cheats | Known faculty / Applications / Study / Scope |
| Other menus | Four adjacent-pursuit reference cards |

The21 main scenes share fictional paused fixtures. Farming blocks themselves are clickable and keyboard accessible with Enter/Space; labelled bed buttons remain an alternate selector. Selecting a bed changes its inspector and contextual previews. Delegation keeps a selected-bed agreement preview. Power coverage hides/shows the overlay without changing which beds are supplied. Esc returns to the routine view; the mock Back control also selects routine, not actual navigation history. Reset restores the initial fixture view.

Previews write explanatory status only. There is no clock, RNG, game import, inventory mutation, accepted helper agreement, storage or network call in the artifact. Fishing/mining diagrams are scope illustrations, not measured maps. The invented Quiet lens faculty is not a revealed game cheat. Proposed actions, crop laws, powers and helpers are not accepted content.

The source-backed mining reconstruction is labelled and separated from proposed face/haul interactions. See [mining source study](../MINING_FLOW_AND_PATH_PROPOSAL.md) and [parity, menus, studio and abstraction proposals](../MOCKUP_PARITY_AND_IMPLICATIONS.md). Native production components/controller are not imported. Passing these viewer checks does not prove native gameplay or persistence.


## Interactive fishing and mining follow-up

Fishing spots and mining faces now select directly with click or Enter/Space. Personal view compares Skill, Power and Method using explicit fictional scenario controls. Unavailable methods show their reason and disable Preview next plan. The method chooser, preview and Back stay pinned; longer explanations scroll centrally. Selecting targets never changes current work. Investigation and delegation use the selected target, and each family retains its last selection.

Keep index.html and target-studies.js together when copying this viewer. These are local design files; no game module is imported. See [concrete choices and worked examples](../FISHING_MINING_INTERACTIVE_CHOICES.md), [36 scenario checks](TARGET_CHOICE_CHECKS.json) and [interaction checks](TARGET_INTERACTION_CHECKS.json). All21 main captures are refreshed for this revision.
