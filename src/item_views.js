// The item display chain (display.js `nativeItemView`): each projection names the items it knows and
// passes the rest through. ITM23 (proposal): a registered item identity is named last, by the seat's
// own knowledge (observer_view.js), so the same item can read differently for another seat.
import {projectGameAbsorptionAssayItemView} from './game_absorption_assay_item_view.js';
import {projectFieldcraftItemView} from './nethack_fieldcraft_item_view.js';
import {projectItemIdentityView} from './item_identity.js';
import {observerView} from './observer_view.js';

export function projectItemView(item, state, fallback) {
    return projectItemIdentityView(item, state ? observerView(state).knowledge() : {},
        projectGameAbsorptionAssayItemView(item, state, projectFieldcraftItemView(item, state, fallback)));
}
