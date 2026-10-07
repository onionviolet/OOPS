# Known routes leaf

This is a source/UI leaf, not a gameplay or release proof. It adds an import-free route projection, a projection adapter over existing host read models, and a small renderer for the existing Notebook. The shared `main.js`, Notebook mount, build entry and command integration remain with the active home/root owner.

## Integration surface

`knownRoutesPresentation(snapshot, {refinement, pocket, proto23})` in `src/known_routes_host.js` reads the current state plus already projected native views. `refinement` is the current `refinementPresentation(...)` result; `pocket` contains `pocketRealmView(state)` and the exact `pocketRealmActions` previews; `proto23` is `proto23Presentation(state, registry, context)`. The adapter selects only the explicit current passage/open action IDs in [INPUTS.json](INPUTS.json) from those displayed rows. It never imports or scans destination registries and returns `{visible, section}`. Unsupported worlds or absent disclosed actions return `visible:false`.

`projectKnownRoutes({current, routes})` in `src/known_routes.js` accepts only already projected, player-addressed host rows. `current` is `{known:true, recipientId:'player', destinationId, destinationLabel, commitments?:[{known:true,recipientId:'player',id,text:{known:true,text}}]}`. Destination identity and label describe the character's actual current represented world/place. `routes` is an ordered list of rows shaped as:

```js
{
  known: true,
  recipientId: 'player',
  currentDestinationId, // must equal current.destinationId
  id,                    // source action/route identity, unique in this presentation
  direction: 'onward' | 'return',
  destinationLabel,      // already disclosed by the route's actual discovery
  label,                 // existing action label
  description: {known: true, text},
  costText: {known: true, text},
  blockerText: {known: true, text},
  commitmentText: {known: true, text},
  inputFingerprint,      // frozen by the native host adapter for this exact preview
  action: {eligible, reasons, command} // unchanged existing dispatcher input
}
```

Omit a route when its owning host did not disclose it to the player. Do not add registry-derived destination choices, inferred edges, hidden source plans, or a synthetic generic travel command. Empty cost/blocker/commitment text should be represented as empty known text only when the host explicitly has nothing to disclose. Unknown text is omitted. Preserve the host's availability, quote, exact reason strings, command shape and dispatch path.

`createKnownRoutesPanel({container, read, present, command, focusFallback})` mounts inside the existing Notebook container. `present(snapshot)` calls `knownRoutesPresentation(...)`. `command` routes the unchanged existing host command to its current dispatcher. Nested, first-Goa, Cyoria, Proto23 and Tidemark commands use the current feature action dispatcher; Glasshouse commands use `actPocketRealm`. On click, the panel reprojects, compares route ID, frozen input fingerprint and exact command, then dispatches. A mismatch asks for a fresh review. The fingerprint binds saved sequence and current played clock, current endpoint/location, player facts, alive state, actual native body, source owner connection revision and mission/visit state, custody, relevant inventory/equipment, native route snapshots, and current host quote details. Current location comes from `snapshot.context.facts.location` with the saved simulation location as fallback. The panel does not make a new quote or command. Route and commitment rows update in place so keyboard focus remains stable; if a row disappears, focus moves before it is removed, and if the whole panel hides, focus moves to the supplied external fallback (or Notebook container).

The adapter uses each route's visible action preview for eligibility, reasons, costs and action command. It keeps blocked but disclosed rows visible with existing preview blockers and omits undisclosed actions. Glasshouse is included only when `pocketRealmView(state).discovered === true`, matching the existing panel's discovery gate. Proto23 route rows without legibility reuse `playerOfferCostText` for their actual disclosed costs and duration; available legibility duration, requirements and reservations remain visible. Duplicate route IDs are dropped rather than resolved by order. After a dispatcher call returns, the panel says only “Route action sent.” A thrown stale or commit error is shown as-is. Existing command dispatch remains responsible for re-preview and commit.

## Current evidence and discovery boundaries

The local priority-2 audit calls for current place, already known onward/return routes, custody/source/fuel blockers and real commitments. Current host action projections are the authority for whether a route is disclosed and what it costs. The adapter reads host projections instead of importing route owners because each family has different passage owners, discovery names, carrier rules and commitment exceptions.

- **Original service district:** the `nestedCampaign` owner has a Village chart discovered after meeting the Village elder; explicit enrollment admits the side entry. Hub to Saltworks and hub to Archive personal passages require an actually settled destination visit and contractor role. A return passage uses the destination's actual landing. An active contract, local resident work, route/body/cargo checks and visit capacity can block the relevant action. The adapter accepts its visible route rows from the existing refinement presentation; it never makes an extra `nestedCarrierKnowledge` quote.
- **Book contractor district:** this independent first-Goa branch is owned by `bookWorldCampaign`, separate from the original service district. Optional enrollment is disclosed by the Village chart and keeps the existing character. Personal Goa entry is separate from accepting and arriving under the civilian survey. Contract return requires its actual two-played-minute extraction preparation and passage; a prepared extraction is not arrival. The contractor hub can return to Village only with no active mission. The two actual destination labels stay distinct even though both use Paradise in their names.
- **Cyoria:** the optional visitor entry follows its own Village chart and enrollment. The adapter includes only the currently projected `book.mol.enter` or `book.mol.return`; it does not infer loop, festival or other future routes. The current body/cargo and accepted local-work checks remain owned by the Mother of Learning host.
- **Proto23 village:** the optional visitor entry follows its own disclosed guest terms and enrollment. The adapter includes only the existing enter/return previews from `proto23Presentation`; its current resident commitments, body/cargo checks and bounded visit history remain with the source owner.
- **Folded Glasshouse:** Iona's received lead is the discovery gate. The already displayed one-coin doorway opener appears only when its preview is visible; entering requires the actual open doorway and same-body cargo checks. Exit can be blocked by Joss's reserved local work or outstanding observation/custody conditions. The adapter consumes `pocketRealmActions` previews and `pocketRealmView` from the current pocket panel.
- **Tidemark:** the chart is a discovery step, then the existing one-coin `tidemark.open` preview opens the known route. The actual `enter`/`return` previews require bound native owners, the current human body, owned cargo and direction-specific passage checks. The adapter reads them from the feature refinement projection, never from broad `featureDestination` presence.

The adapter currently covers the exact route action IDs listed in [INPUTS.json](INPUTS.json) from six represented families: Original service district, book contractor/first-Goa, Cyoria, Proto23, Tidemark and Glasshouse. It does not cover ordinary native Frontier location movement, unrelated feature panels, non-route location changes within a destination, arbitrary connections, unregistered future worlds, or any action missing from the current host projection. The readable labels “Original service district” and “Book contractor district” are reversible presentation proposals; the source identities and different journey rules remain explicit. `INPUTS.json` records SHA-256 hashes of the decisive current projection, route-host and route-content inputs used for this adapter.

## Parent wiring sketch

The parent can create one renderer beside the existing Notebook panels and use its existing reads. Reuse the same current refinement and Proto23 host views; for Glasshouse, preview only its three public doorway actions and keep each existing `{id, sequence}` command. Route dispatch branches only to the existing owning dispatchers:

```js
const routePanel = createKnownRoutesPanel({
  container: existingNotebookContent,
  focusFallback: existingNotebookSummary,
  read: readFeatureSnapshot,
  present: snapshot => {
    const state = snapshot.state;
    const pocketView = pocketRealmView(state);
    return knownRoutesPresentation(snapshot, {
    refinement: refinementPresentation(snapshot, expeditionRegistry, refinementDependencies),
    pocket: {
      view: pocketView,
      actions: ['pocket.open', 'pocket.enter', 'pocket.exit'].flatMap(id => {
        const action = pocketRealmActions.find(row => row.id === id);
        const quote = previewPocketRealmAction(state, expeditionRegistry, id,
          pocketContext(state, snapshot.context));
        return action && quote.visible && pocketView.discovered === true
          ? [{...action, ...quote, command: {id, sequence: snapshot.state.sequence}}]
          : [];
      })
    },
    proto23: proto23Presentation(state, expeditionRegistry, snapshot.context)
  });
  },
  command: command => command.type ? actFeatureExpansion(command) : actPocketRealm(command)
});
```

## Status and later gate

The adapter and renderer are implemented-unverified and have no `main.js` mount or build integration. Syntax/import/definition/link checks do not establish visible or usable gameplay. After the shared root integrates the adapter and rebuilds, the later playable acceptance gate remains: confirm discovery hides unrevealed places; inspect both Paradise hubs separately; exercise a disclosed onward and return route; inspect exact custody/source/fuel blockers and active contract/extraction exceptions; use mouse and keyboard; confirm stable focus, stale quote rejection and unchanged dispatcher behavior; travel and verify current destination plus retained body/cargo/commitment state; save, reload and revisit. Gameplay, unit, browser, save/failure and regression suites remain deferred for this trailblaze wave.

## Source pointers

- [Multi-world audit and priority 2](../../multi-world-paths-2026-10-07/AUDIT.md#five-priorities-to-consider)
- [Nested route previews and disclosure](../../../../src/feature_expansion_nested_host.js)
- [Nested route receipts](../../../../src/feature_expansion_nested_carriers.js)
- [Separate first-Goa branch previews](../../../../src/book_world_paradise_host.js)
- [Cyoria route previews](../../../../src/book_world_mol_host.js)
- [Proto23 route previews](../../../../src/proto23_world_host.js)
- [Glasshouse doorway preview](../../../../src/pocket_realm_host.js)
- [Tidemark passage preview](../../../../src/feature_expansion_destination_host.js)
- [Source hashes and exact route action IDs](INPUTS.json)
- [Projection adapter](../../../../src/known_routes_host.js)
- [Cost formatter used for source rows without legibility](../../../../src/feature_expansion_presentation_costs.js)
