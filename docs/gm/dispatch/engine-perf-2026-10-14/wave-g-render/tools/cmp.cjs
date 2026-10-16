const fs=require('fs');const [dir,...pairs]=process.argv.slice(2);
for(const fx of ['developed','crowded'])for(const rep of [0,1]){
 const f=v=>`${dir}/dump-${fx}-${v}-${rep}.json`;if(!fs.existsSync(f('base'))||!fs.existsSync(f('head')))continue;
 const a=JSON.parse(fs.readFileSync(f('base'))),b=JSON.parse(fs.readFileSync(f('head')));
 for(const t of Object.keys(a))for(const k of Object.keys(a[t])){const x=a[t][k],y=b[t]?.[k];
  for(const m of ['inner','text','html']){const ok=(x&&x[m])===(y&&y[m]);if(!ok){let i=0;const X=x?.[m]||'',Y=y?.[m]||'';while(X[i]===Y[i])i++;console.log(fx,rep,'t'+t,k,m,'DIFF at',i,JSON.stringify(X.slice(Math.max(0,i-80),i+80)),'\n   vs',JSON.stringify(Y.slice(Math.max(0,i-80),i+80)));}}}
 console.log(fx,rep,'compared');}
