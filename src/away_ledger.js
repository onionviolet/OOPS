const MINUTE_MS=60000;
function nonnegative(value,name) {
    if(!Number.isFinite(value) || value<0)throw new Error(`Invalid ${name}.`);
}
// Banked minutes are retained credit, not automatically spent by this ledger.
export function computeAway({lastSeen,now,capMinutes,gameMinutesPerRealMinute=1,
    activity=null,barriers=[],overflow='drop',bankedMinutes=0,remainderMs=0}) {
    if(!Number.isFinite(lastSeen) || !Number.isFinite(now))throw new Error('Invalid timestamp.');
    nonnegative(capMinutes,'capMinutes');
    if(!Number.isFinite(gameMinutesPerRealMinute) || gameMinutesPerRealMinute<=0)throw new Error('Invalid gameMinutesPerRealMinute.');
    nonnegative(bankedMinutes,'bankedMinutes');
    nonnegative(remainderMs,'remainderMs');
    if(remainderMs>=MINUTE_MS)throw new Error('Invalid remainderMs.');
    if(overflow!=='drop' && overflow!=='bank')throw new Error('Invalid overflow policy.');
    for(const barrier of barriers)nonnegative(barrier.at,'barrier time');
    if(activity) {
        nonnegative(activity.xpPerMinute,'xpPerMinute');
        if(activity.diminishAfter!==undefined)nonnegative(activity.diminishAfter,'diminishAfter');
        if(activity.diminishFactor!==undefined)nonnegative(activity.diminishFactor,'diminishFactor');
    }
    const result={appliedMinutes:0,overflowMinutes:0,bankedMinutes,gains:{xp:0},
        stoppedBy:null,remainderMs,nextLastSeen:lastSeen};
    if(now<lastSeen) {result.stoppedBy='clock-back';return result;}
    const elapsedMs=now-lastSeen+remainderMs;
    const available=Math.floor(elapsedMs/MINUTE_MS)*gameMinutesPerRealMinute;
    let applied=Math.min(available,capMinutes),first=null;
    for(const barrier of barriers)
        if(barrier.at<applied && (!first || barrier.at<first.at))first=barrier;
    if(first) {
        applied=first.at;
        result.stoppedBy=first.id;
        // Carried time was already consumed from the wall clock. Spend it first;
        // retain any unspent carry, and leave the remaining wall time pending.
        const consumedMs=applied/gameMinutesPerRealMinute*MINUTE_MS;
        result.nextLastSeen=lastSeen+Math.max(0,consumedMs-remainderMs);
        result.remainderMs=Math.max(0,remainderMs-consumedMs);
    } else {
        result.overflowMinutes=available-applied;
        if(overflow==='bank')result.bankedMinutes+=result.overflowMinutes;
        result.nextLastSeen=now;
        result.remainderMs=elapsedMs%MINUTE_MS;
    }
    result.appliedMinutes=applied;
    if(activity) {
        const full=Math.min(applied,activity.diminishAfter ?? applied);
        result.gains.xp=activity.xpPerMinute*(full+(applied-full)*(activity.diminishFactor ?? 1));
    }
    return result;
}
