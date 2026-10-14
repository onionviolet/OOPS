const tick=n=>{for(let i=0;i<n;i++)seed.update_timer();};
const c=(id,n=0,type='command',targetId=null)=>{console.log('CMD',id);if(type==='command')seed.actSimulation({type,id,targetId});else seed.actFeatureExpansion({type,id});tick(n);};
c('skills.timber.observe',1,'command','oldCraftsman');c('skills.timber.learn',3,'command','oldCraftsman');
for(let i=0;i<4;i++)c('skills.timber.practice',4);
c('feature_powers.timber.wedge',6,'feature_command');
