// Original life-sim proposal. The chronicle clock is the sole age owner.
const YEAR = 360 * 24 * 60;
export const LIFE_LESSONS = Object.freeze([
    {id:'routeSignals', label:'reading the road', youth:'I finally understand the road signs! There are places I could go now.', adult:'Learned the road signs. Ready for the next journey.', elder:'The old signs still point home. I remember who first showed me.'},
    {id:'guardLesson', label:'a patient guard', youth:'I got it! Hold steady, breathe, and their hand slips past.', adult:'Hold steady. Breathe. Waste less strength.', elder:'These hands remember the guard even now. Someone should learn it before I go.'},
    {id:'controlPattern', label:'watching an opponent', youth:'Did you see that? His hand followed me. Next time I will watch first!', adult:'Watch the hands before committing.', elder:'I was quick once. Watching taught me more than rushing ever did.'}
]);
export const lifeAge = c => c.life.initialAge + ((c.life.endedAt ?? c.lastClock) - c.enrolledAt) / YEAR;
export function lifeStage(c) {const age=lifeAge(c); return age < 25 ? 'youth' : age < 65 ? 'adult' : 'elder';}
export function lifeLearningMultiplier(c) {return c && c.life.endedAt === null && lifeStage(c)==='youth' ? 1.2 : 1;}
export function learnedLifeLessons(c) {return LIFE_LESSONS.filter(l=>c?.knowledge[l.id]);}
export function lifeVoice(c, lessonId) {
    const lesson=LIFE_LESSONS.find(l=>l.id===lessonId);
    if(!lesson)throw new Error('That lesson is not known.');
    return lesson[lifeStage(c)];
}
export function lifeEpitaph(c, milestones = []) {
    const deeds=[];
    if(c.relationships.villageElder?.ties.dutyKept)deeds.push('kept a promise when it mattered');
    if(c.relationships.villageElder?.ties.firstConcession)deeds.push('stood firm before the old master');
    if(c.knowledge.routeSignals)deeds.push('learned to find a way home');
    for(const m of milestones.slice(-2))if(typeof m.text==='string'&&!deeds.includes(m.text))deeds.push(m.text.slice(0,120));
    return deeds.length ? `Here rests one who ${deeds.slice(0,3).join('; ')}.` : 'Here rests a traveler. Not every kindness found its way into a book.';
}
export function lifeExperienceView(c) {
    if(!c)return null;
    const lessons=learnedLifeLessons(c), stage=lifeStage(c);
    return {age:Math.floor(lifeAge(c)),stage, multiplier:lifeLearningMultiplier(c),lessons,
        teaching:stage==='elder'&&c.life.endedAt===null&&lessons.length>0,
        epitaph:c.life.endedAt!==null?lifeEpitaph(c):null};
}

export function lifeGrave(c, name='A traveler') {
    if(c.life.endedAt===null)throw new Error('This life is still being lived.');
    return {name:String(name).slice(0,80),age:Math.floor(lifeAge(c)),epitaph:lifeEpitaph(c),lesson:c.life.experience?.bequest ?? null};
}
