// Presence derives from actual people, body/controller bindings and a live channel.
// Pack text controls what an observer may see, never admission or settlement.
export function remotePresenceFacts(state,data){
 const result={};
 for(const session of data?.remoteSessions||[]){
  const people=state.simulation?.people||{},world=state.worlds?.[session.worldId]?.facts||{};
  const host=people[session.host],active=world[session.activeFact]===true&&host?.life==='alive'&&host.location===session.anchor;
  let all=active;
  for(const seat of session.seats){
   const p=people[seat.id],origin=people[seat.origin];
   const connected=!!(active&&p?.life==='alive'&&p.location===session.location&&p.body?.ownerId===seat.origin&&p.body?.controllerId===seat.controller&&origin?.life==='alive');
   result[`remote.${session.id}.${seat.id}`]=connected;all=all&&connected;
  }
  result[`remote.${session.id}.ready`]=!!all;
 }
 return result;
}
export function remotePresenceView(state,data){
 const facts=remotePresenceFacts(state,data);
 return (data?.remoteSessions||[]).filter(s=>state.worlds?.[s.worldId]?.facts?.[s.activeFact]===true).map(s=>({
  id:s.id,title:s.title,anchor:s.anchorLabel,ready:facts[`remote.${s.id}.ready`],
  seats:s.seats.map(seat=>({label:state.worlds[s.worldId].facts[seat.aliasFact]||seat.label,connected:facts[`remote.${s.id}.${seat.id}`]}))}));
}
