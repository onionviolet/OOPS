// Standard Here/Local actions presentation. No reward, clock, RNG or save owner.
export function createTrancheFourPanel({read,act}) {
 const node=(tag,text='')=>{const n=document.createElement(tag);n.textContent=text;return n;};
 const panel=node('details'),summary=node('summary','Village practice and familiar ground'),body=node('div'),notice=node('p');
 panel.id='p23_tranche_four_panel';panel.className='expedition_panel';notice.setAttribute('role','status');panel.append(summary,body,notice);
 let signature='';
 function render(){const host=document.getElementById('location_actions_div');if(panel.parentElement!==host)host.append(panel);
  const view=read();panel.hidden=!view.visible;const next=JSON.stringify(view);if(next===signature)return;signature=next;body.replaceChildren();if(panel.hidden)return;
  for(const text of view.lines)body.append(node('p',text));
  for(const row of view.actions){const button=node('button',row.label);button.type='button';button.dataset.p23Local=row.id;button.disabled=!!row.disabled;
   button.onclick=()=>{try{act(row.id,row);notice.textContent='';}catch(error){notice.textContent=error.message;}render();};body.append(button);}
 }render();return {panel,render};
}
