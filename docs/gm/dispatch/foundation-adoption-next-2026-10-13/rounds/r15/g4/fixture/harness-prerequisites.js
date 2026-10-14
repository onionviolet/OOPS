const tick=n=>{for(let i=0;i<n;i++)seed.update_timer();};
const cmd=(id,n=0)=>{console.log('CMD',id);seed.actFeatureExpansion({type:'audit_remainder',id});tick(n);};
cmd('remainder_combat_fit.terms');cmd('remainder_combat_fit.craft_rigid',8);cmd('remainder_combat_fit.craft_flexible',6);
for(const fit of ['original','rigid','flexible']){cmd('remainder_combat_fit.give_'+fit,2);await writeFile(owner+'/TEST-FIXTURE-R15-G4-harness-'+fit+'.txt',seed.encodeSaveFile(seed.create_save())+'\n');}
