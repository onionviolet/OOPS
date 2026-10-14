import {ANTHOLOGY, STORIES, REST_MEAL} from './content.js';
import {validateReadingState} from './runtime.js';
/** Known-only view for P00's existing Here/book panel. No animation/effect. */
export function readingPresentation(state,context) {
    validateReadingState(state,context.clock);
    const current = state?.current;
    const known = context.knownAnthology === true;
    return {
        visible: known || !!current || !!state?.receipts.length,
        label: 'Reading and earned rest · proposed balance',
        anthology: known ? ANTHOLOGY : null,
        current: current ? {id:current.id,kind:current.kind,status:current.status,
            remaining:current.outcome.duration-current.progress,
            label:current.kind === 'read' ? ANTHOLOGY : REST_MEAL} : null,
        records:(state?.receipts || []).map(row => ({id:row.id,kind:row.kind,status:row.status,at:row.observedAt,
            text:row.kind === 'read' ? STORIES[row.outcome.story] :
                `Long rest ${row.status}; ${row.progress} played minutes. The packed meal was consumed at start.`})),
    };
}
