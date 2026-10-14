// Predicates are the same browser predicates as waitForFunction. Only time changes.
async function engineWait(page, predicate, arg, options = {}) {
    if(process.env.YAIRPG_REAL_TIMERS === '1') return page.waitForFunction(predicate,arg,options);
    const source = predicate.toString();
    for(let i=0;i<3600;i++) {
        const result = await page.evaluate(({source,arg}) => {
            const predicate = (0,eval)(`(${source})`);
            if(predicate(arg)) return true;
            if(typeof advanceTicks !== 'function') throw new Error('Use localhost ?test_hooks=1 for engine checks.');
            const state = JSON.parse(localStorage.getItem('save data'))?.expansion;
            const due = state?.simulation?.jobs.filter(j=>j.actorId==='player' && j.commandId.startsWith('systems_workshop.')).map(j=>j.due) || [];
            const ticks = due.length ? Math.max(1,Math.min(1000,Math.ceil(Math.min(...due)-state.clock))) : 1;
            advanceTicks(ticks);
            return !!predicate(arg);
        },{source,arg});
        if(result) return;
    }
    throw new Error('Engine predicate did not pass within 3600 advances: '+source);
}
module.exports = {engineWait};
