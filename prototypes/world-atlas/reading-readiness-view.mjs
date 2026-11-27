// Deliberately on demand: opening Reading never launches a source inspection.
export function appendReadingReadiness(parent,world,element){
 const box=element('section'),button=element('button','Show measured output readiness'),body=element('div');
 box.setAttribute('aria-label','Measured output readiness');
 button.type='button';box.append(button,body);parent.append(box);
 const tableFor=(outputs,caption,scope)=>{
  const table=element('table');table.dataset.readinessTable=scope;table.style.minWidth='50rem';table.append(element('caption',caption));
  const head=element('tr');for(const title of ['Output kind','Selected / expected','Inspected','Missing / partial / unattested','Rows / matched','Withheld / ambiguous / unindexed','Parse / read errors']){const th=element('th',title);th.scope='col';head.append(th);}table.append(head);
  for(const row of outputs){const tr=element('tr');for(const value of [`${row.pass} / ${row.kind}`,`${row.selected} / ${row.expected}`,row.inspected,`${row.missing} / ${row.partial} / ${row.unattested}`,`${row.parsedRows} / ${row.matchedRows}`,`${row.withheldRows} / ${row.ambiguousRows} / ${row.unindexedRows}`,`${row.parseErrors} / ${row.readErrors}`]){const td=element('td',String(value));td.style.whiteSpace='nowrap';tr.append(td);}table.append(tr);}
  const scroll=element('div');scroll.tabIndex=0;scroll.setAttribute('role','region');scroll.setAttribute('aria-label',caption);scroll.style.overflowX='auto';scroll.style.maxWidth='100%';scroll.append(table);return scroll;
 };
 const fieldDetails=(outputs,scopeLabel)=>{
  const fields=element('section');fields.append(element('h4','Approved field presence'),element('p','Counts show rows containing each approved field, not the field values. Presence is not semantic completeness; zero does not prove that a fact is absent from the source.'));
  for(const row of outputs){const detail=element('details');detail.append(element('summary',`${row.label||row.kind} · ${row.pass} / ${row.kind}`));
   if(!Array.isArray(row.fields)){detail.append(element('p','Field counts were not measured for this output.'));fields.append(detail);continue;}
   const table=element('table');table.dataset.readinessTable='fields';table.append(element('caption',`${scopeLabel} · ${row.label||row.kind}: ${row.fieldRows} evaluated rows`));
   const head=element('tr');for(const text of ['Approved field','Rows with field / evaluated rows']){const th=element('th',text);th.scope='col';head.append(th);}table.append(head);
   for(const field of row.fields){const tr=element('tr');tr.append(element('td',field.label));const value=element('td',`${field.rows} / ${row.fieldRows}`);value.style.whiteSpace='nowrap';tr.append(value);table.append(tr);}
   detail.append(table);fields.append(detail);
  }return fields;
 };
 const appendFollowups=(parent,report)=>{
  const details=element('details');details.dataset.readinessFollowups='';details.append(element('summary','Output files to follow up'));parent.append(details);
  let built=false;
  details.addEventListener('toggle',()=>{
   if(!details.open||built)return;built=true;
   const reasons={unindexed:'Unindexed rows',missing:'Missing files',unattested:'Unattested files',partial:'Partial files',errors:'Parse or read errors'};
   details.append(element('p','Unindexed counts are rows without an admitted public match. Missing means no selected output file. These are separate checks, not claims that source facts are absent. Only saved file counts are listed; withheld rows are not revealed.'));
   const label=element('label','Follow-up reason '),select=element('select');select.setAttribute('aria-label','Output follow-up reason');
   for(const [id,title]of Object.entries(reasons)){const option=element('option',title);option.value=id;select.append(option);}label.append(select);
   const load=element('button','Load file counts'),previous=element('button','Previous files'),next=element('button','Next files'),status=element('p'),rows=element('div');
   for(const button of [load,previous,next])button.type='button';previous.disabled=next.disabled=true;status.setAttribute('aria-live','polite');
   status.textContent=report.followups?.status==='remeasure'?'This older measurement needs an offline remeasure before individual files can be listed.':'Choose a reason and load its saved file counts.';
   details.append(label,load,status,previous,next,rows);let offset=0,busy=false;
   select.addEventListener('change',()=>{offset=0;rows.replaceChildren();previous.disabled=next.disabled=true;status.textContent='Load '+reasons[select.value].toLowerCase()+' to see their file counts.';});
   const fetchPage=async start=>{
    if(busy)return;busy=true;load.disabled=select.disabled=previous.disabled=next.disabled=true;status.textContent='Loading saved file counts…';rows.replaceChildren();
    try{const query=new URLSearchParams({world,reason:select.value,offset:String(start),limit:'25'}),response=await fetch('/reading-readiness-followups?'+query);if(!response.ok)throw Error();const page=await response.json();offset=page.offset;
     const freshness=page.status==='stale'?'Stale measurement. '+(page.stale?.length?'Changed: '+page.stale.join(', ')+'. ':''):'';
     if(page.availability!=='available'){status.textContent=freshness+page.note;return;}
     status.textContent=freshness+(page.total?`${reasons[page.reason]} · files ${page.offset+1}–${page.offset+page.files.length} of ${page.total}. `:`No files listed for ${reasons[page.reason].toLowerCase()} in this measured scope. `)+page.note;
     previous.disabled=page.offset===0;next.disabled=page.offset+page.files.length>=page.total;
     if(!page.files.length)return;
     const list=element('ul');list.dataset.readinessFollowupFiles='';list.style.paddingLeft='1.1rem';
     for(const file of page.files){const row=element('li'),c=file.counts;row.dataset.readinessFollowupFile='';row.append(element('strong',file.key+' / '+file.prefix),element('p',file.pass+' / '+file.kind+' · '+file.reasons.map(reason=>reasons[reason]||reason).join(', ')),element('p',`${c.unindexedRows} unindexed · ${c.missing} missing · ${c.parsedRows} parsed / ${c.matchedRows} matched · ${c.parseErrors} parse / ${c.readErrors} read errors`));const link=element('a','Open output');link.href=file.route;link.setAttribute('aria-label',`Open output ${file.key} ${file.prefix} ${file.pass} ${file.kind}`);row.append(link);list.append(row);}
     rows.append(list);
    }catch{status.textContent='The saved file counts could not be loaded.';}finally{busy=false;load.disabled=select.disabled=false;}
   };
   load.addEventListener('click',()=>fetchPage(0));previous.addEventListener('click',()=>fetchPage(Math.max(0,offset-25)));next.addEventListener('click',()=>fetchPage(offset+25));
  });
 };
 button.addEventListener('click',async()=>{
  button.disabled=true;body.textContent='Loading measured summary…';
  try{const response=await fetch('/reading-readiness?world='+encodeURIComponent(world));if(!response.ok)throw Error();const data=await response.json();body.replaceChildren();
   if(!data.report){body.append(element('p',data.note));return;}
   const report=data.report;
   body.append(element('h3','Measured output readiness'),element('p',`${data.status==='stale'?'Stale measurement':'Measured snapshot'} · ${report.scope} · ${report.measuredAt}. File metadata: ${data.fileState}.`));
   if(data.stale.length)body.append(element('p','Changed since measurement: '+data.stale.join(', ')+'. Run the offline tool again.'));
   body.append(element('p',report.note),tableFor(report.outputs,'World output counts','world'),element('p','File states can overlap: a partial file may be inspected, or unattested. Missing means no selected file; zero matched rows does not mean no source facts.'));
   const details=element('details');details.dataset.readinessDetails='';details.append(element('summary','Books and field counts'));
   let built=false;
   details.addEventListener('toggle',()=>{
    if(!details.open||built)return;built=true;
    const label=element('label','Counts for '),select=element('select'),selected=element('div');select.setAttribute('aria-label','Readiness book or world');
    const total=element('option','World total');total.value='';select.append(total);
    for(const book of report.books||[]){const option=element('option','Book '+book.key);option.value=book.key;select.append(option);}
    label.append(select);details.append(label,selected);
    const render=()=>{const book=(report.books||[]).find(b=>b.key===select.value),outputs=book?.outputs||report.outputs,title=book?'Book '+book.key:'World total';selected.replaceChildren(element('h4',title));
     if(book)selected.append(element('p',`${book.prefixes} measured chapter groups. Counts cover this book's selected outputs in the same snapshot.`));
     selected.append(tableFor(outputs,title+' output counts','detail'),fieldDetails(outputs,title));};
    select.addEventListener('change',render);render();
   });
   body.append(details);
   appendFollowups(body,report);
  }catch{body.textContent='The measured summary could not be loaded.';}finally{button.disabled=false;}
 });
}
