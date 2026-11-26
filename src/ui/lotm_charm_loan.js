export function renderCharmLoan(view,{node}){
 const box=node('section');box.dataset.lotmCharmLoan='';box.append(node('h3','Old Neil’s Slumber loan'));
 box.append(node('p',view.active?`Old Neil provided the workshop charm. You owe him ${view.owes}.`:'No workshop Slumber charm is currently owed to Old Neil.'));
 if(view.active)box.append(node('p',view.held?'You still carry his unused charm. Return it as it is, or use it and replace it later.':view.using?'You are using the borrowed charm. Stopping returns it; burning it leaves a replacement owed.':'The borrowed charm is gone. Bring Old Neil an owned Slumber charm to replace it in kind.'));
 else box.append(node('p',view.lenderStock?'His recorded charm is available for a loan when you meet him.':'A loan needs an actual charm in Old Neil’s keeping.'));
 box.append(node('p','There is no cash fee or fixed due date on this arrangement. Meet him here and awake for a handover.'));
 if(view.response?.known){const r=view.response;box.append(node('h4','The shared-response charm'));
  box.append(node('p',r.active?(r.held?'You carry Old Neil’s unused response charm. You can return it as it is.':'The response charm was used. A replacement is still owed to Old Neil.'):'No replacement is currently owed for the response charm.'));
  if(r.discussable)box.append(node('p','The shared emergency is over. Speak to Old Neil: you can keep the replacement promise or ask him to handle this cost.'));
  if(r.choice==='continue')box.append(node('p','You chose to keep your replacement promise.'));
  if(r.choice==='released')box.append(node('p','Old Neil has released your replacement obligation for this response.'));
  if(r.intent)box.append(node('p',r.intent));
 }
 return box;
}
