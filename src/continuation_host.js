import {planContinuation} from './continuation_state.js';
import {domainRegistry} from './domain_registry.js';

// Caller supplies the existing native writer and a production mutation freeze.
// No storage namespace, timer, world regeneration or rollback is owned here.
export function createContinuationHost({capture,preflight,publish,ownsSave,freeze,thaw,revision,fresh,reload}) {
    let busy=false;
    return {get busy(){return busy;},async command(action,request) {
        if(busy)throw Error('A continuation transition is already being checked.');
        if(!ownsSave())throw Error('Use the writable game tab to continue.');
        busy=true;const was=freeze();
        try {
            const before=revision(),source=capture();
            const newLife=(action==='fresh'||action.startsWith('challenge:begin:'))?await fresh():undefined;
            const next=planContinuation(source,action,{...request,fresh:newLife});
            if(action.startsWith('die:'))domainRegistry.command('positions','diedInSave')?.(next); // the dying life's posts close as died, in the same save
            await preflight(next);
            if(!ownsSave()||revision()!==before)throw Error('The active save changed during continuation checks. Your life is kept.');
            publish(next); // Existing guarded authority commits before live publication.
            reload(next);
            return next;
        } finally {busy=false;thaw(was);}
    }};
}
