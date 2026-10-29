// World-neutral reader for authored canon-event rows. The world adapter owns
// scene windows, state mutation and the existing Reports ledger.
const id = value => typeof value === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(value) && !['__proto__', 'constructor', 'prototype'].includes(value);
const text = value => typeof value === 'string' && value.trim().length > 0;
const rowId = value => typeof value === 'string' && /^[a-z][a-z0-9_.:#-]*$/i.test(value) && !['__proto__','constructor','prototype'].includes(value);
const own = (value, key) => Object.hasOwn(value, key);
const CARD_FIELDS = new Set(['schema','id','stepId','scene','threadId','verb','object','class','kind','kindWeak','actor','place','packPlaceId','present','time','order','inputs','outputs','gains','requires','effects','choices','lockedOptions','evidence','source']);
const EFFECT_FIELDS = {fact:new Set(['type','key','value','class']), knowledge:new Set(['type','fact','change','from','locator'])};
const check = (ok, message) => { if (!ok) throw Error(message); };

export function defineCards(data, binding = {}) {
  check([binding.worldId,binding.actorId,binding.group,binding.situationId].every(id), 'Invalid card binding.');
  if (data == null) return [];
  const rows = Array.isArray(data) ? data : data.cards;
  check(Array.isArray(rows), 'Expected event cards.');
  const ids = new Set();
  return rows.map(row => {
    check(row && typeof row === 'object' && Object.keys(row).every(key => CARD_FIELDS.has(key)), 'Unsupported card field needs its owning mechanism.');
    check(row.schema === 'event-card/1' && rowId(row.id) && !ids.has(row.id) && rowId(row.stepId) && id(row.scene) && text(row.verb), 'Invalid event card identity or action.');
    ids.add(row.id);
    check(row.threadId == null || id(row.threadId), 'Invalid card thread id.');
    check(text(row.place) && row.time && typeof row.time === 'object' && row.order && Number.isSafeInteger(row.order.step) && row.order.step > 0, 'Card needs a place, time and ordered step.');
    for (const key of ['present','inputs','outputs','gains','requires','effects','choices','lockedOptions','evidence']) if (row[key] != null) check(Array.isArray(row[key]), `Card ${key} must be a list.`);
    const effects = (row.effects || []).map(effect => {
      check(effect && EFFECT_FIELDS[effect.type] && Object.keys(effect).every(key => EFFECT_FIELDS[effect.type].has(key)), 'Unsupported card effect needs its owning mechanism.');
      if (effect.type === 'fact') {
        check(id(effect.key) && own(effect,'value'), 'Fact effect needs a key and value.');
        return {type:'fact',scope:'actor',actor:binding.actorId,key:effect.key,value:structuredClone(effect.value),provenance:'canon'};
      }
      check(id(effect.fact) && text(effect.change), 'Knowledge effect needs a fact and authored change.');
      return {type:'knowledge',actor:binding.actorId,key:`canon.${row.id}.${effect.fact}`,stage:'seen',value:effect.change,
        basis:{kind:'observation',attributedTo:binding.actorId,situationId:binding.situationId,provenance:'canon',fact:effect.fact,...(effect.from?{from:effect.from}:{}),...(effect.locator?{locator:effect.locator}:{})}};
    });
    return {...structuredClone(row), actorId:binding.actorId, worldId:binding.worldId, group:binding.group,
      situationId:binding.situationId, effects};
  });
}

const dateReached = (time, window) => {
  if (typeof window?.at === 'number') return time?.date?.offsetDays == null || window.at >= time.date.offsetDays;
  if (typeof window?.day === 'number' && Number.isSafeInteger(time?.date?.offsetDays)) return window.day >= time.date.offsetDays;
  return window?.reached === true;
};
export function dueCards(state, cards, window = {}) {
  const reached = new Set([...(window.scenes || []), ...(window.scene ? [window.scene] : [])]);
  return cards.filter(card => (reached.has(card.scene) || dateReached(card.time, window)) &&
    state?.worlds?.[card.worldId]?.facts?.[`lotm.cast.card.${card.id}.settled`] !== true &&
    state?.worlds?.[card.worldId]?.facts?.[`lotm.cast.card.${card.id}.due`] !== true)
    .slice().sort((a,b) => (a.order.sceneOrder ?? 0) - (b.order.sceneOrder ?? 0) || a.order.step - b.order.step || a.id.localeCompare(b.id));
}

export function renderCardLine(card) {
  const action = `${card.verb}${card.object ? ` ${card.object}` : ''}`;
  return `${card.threadId ? `${card.threadId}: ` : ''}${action}${card.lockedOptions?.length ? ` · Not how it happened: ${card.lockedOptions.join('; ')}` : ''}`;
}
export function quoteCards(cards, {attemptedOption} = {}) {
  return cards.map(card => ({id:card.id,scene:card.scene,threadId:card.threadId || null,order:card.order.step,
    text:renderCardLine(card),lockedOptions:[...(card.lockedOptions || [])],
    ...(attemptedOption && card.lockedOptions?.includes(attemptedOption) ? {refusal:'Not how it happened'} : {}),effects:structuredClone(card.effects)}));
}
export function pendingCardReports(state, cards) {
  return cards.some(card => state?.worlds?.[card.worldId]?.facts?.[`lotm.cast.card.${card.id}.settled`] !== true &&
    state?.worlds?.[card.worldId]?.facts?.[`lotm.cast.card.${card.id}.due`] === true);
}
export function settleCardReports(state, cards, {window = {}, decide = () => ({allowed:true}), attemptedOptions = {}} = {}) {
  const facts = state?.worlds?.[cards[0]?.worldId]?.facts;
  if (!facts) return [];
  const due = dueCards(state,cards,window);
  const reports=[];
  for (const card of due) {
    const marker=`lotm.cast.card.${card.id}.settled`;
    if (facts[marker] === true) continue;
    const attempted = attemptedOptions[card.id];
    const decision = attempted && card.lockedOptions?.includes(attempted)
      ? {allowed:false,reason:'Not how it happened'} : decide(card);
    facts[marker] = true;
    const refusal=decision.reason && decision.reason!=='Not how it happened'?` · ${decision.reason}`:'';
    reports.push({text:decision.allowed?renderCardLine(card):`${renderCardLine(card)}${refusal}`,at:state.clock,kind:'events',actor:card.actorId,place:card.place,threadId:card.threadId || null,
      effects:decision.allowed?structuredClone(card.effects):[]});
  }
  return reports;
}
