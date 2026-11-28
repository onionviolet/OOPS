export function quoteLearning(row, progress, facts) {
    const missing=row.prerequisites.filter(key=>!facts[key]);
    const timeLeft=row.minutes==null ? null : Math.max(0,row.minutes-progress);
    const reachedCeiling=row.ceilingFact && facts[row.ceilingFact];
    return {teacher:row.teacher,practice:row.practice,sign:row.sign,terms:row.terms,missing,timeLeft,
        complete:!!(row.minutes!=null?timeLeft===0:facts[row.signFact] && !reachedCeiling),capped:!!reachedCeiling};
}

// Extra practice never creates a second skill-XP balance. The caller owns progress
// and grants its existing skill or knowledge when the lesson crosses its threshold.
export function practiceLearning(row,progress,facts,minutes) {
    if(!Number.isFinite(minutes)||minutes<0||!Number.isFinite(progress)||progress<0)throw Error('Invalid lesson progress.');
    const quote=quoteLearning(row,progress,facts);
    if(quote.complete || quote.missing.length || !facts[row.practiceFact])return {progress,quote};
    if(row.deadlineFact && facts[row.deadlineFact] && !facts[row.signFact])return {progress,quote,failed:true};
    const next=Math.min(row.minutes??Infinity,progress+minutes*Math.max(0,facts.practiceRate??1));
    return {progress:next,quote:quoteLearning(row,next,facts)};
}
