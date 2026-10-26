// Original proposed assessment and classroom contribution, using D7's already
// source-qualified ordinary-glass repair case. No new spell or canon syllabus.
const P='book.hp.school',E=P+'.assessed_repair',id=n=>P+'.'+n,key=n=>JSON.stringify({id:id(n)});
const eq=(fact,value=true)=>({fact,op:'eq',value}),all=(...rules)=>({all:rules});
const note=(n,value)=>({type:'knowledge',key:E+'.'+n,stage:'understood',value});
const means=all(eq('actor.life','alive'),eq('native.ready'),eq('structured.extension.'+E+'.admitted'),eq('hp.school.wandReady'),eq('faculty.'+id('magic')+'.active'),eq('power.'+id('repair_glass')+'.owned'),{fact:'power.'+id('repair_glass')+'.mastery',op:'gte',value:1},{fact:'body.hands',op:'gte',value:1});
const cmd=(n,label,extra)=>({id:E+'.'+n,revision:1,label,group:'structured_local',worldId:id('world'),actorId:'player',location:id('commons'),audience:['$actor'],visibleWhen:eq('structured.extension.'+E+'.admitted'),targetId:id('tutor'),coLocated:true,participants:['$target'],once:true,duration:10,cancellation:'refund',reservationReturns:1,completionCoLocated:true,completionFailure:'refund',...extra});
export const hpSchoolAssessmentExtension={
 schema:1,id:E,revision:1,
 base:{id:P,revision:1,contentHash:'sha256:60f98887abca007da8c704d5d4ecc4dd4cfc4f3da7575c667b999737ac543017'},
 label:'Optional assessed repair continuation (original proposal)',
 description:'After learning repair, opt into Mara’s original ten-minute assessed exercise and an optional classroom pane contribution. Assessment needs practiced repair, actual magical faculty, a supported wand, a free hand, the tutor and an open lesson window. It reserves one complete shard set, one sheet and two stamina. Passing opens a ten-minute contribution using another set and one stamina, including outside lesson hours. Each is finite; neither grants rank, mastery, wages or missed lessons. These authored tasks, values and times are proposals, not a canon syllabus.',
 requires:all(eq('knowledge.'+id('tutor_known')+'.understood'),eq('knowledge.'+id('lesson_repair')+'.understood'),eq('power.'+id('repair_glass')+'.owned')),
 reason:'Meet Mara and complete the existing glass-repair instruction before choosing this continuation.',
 commands:[
  cmd('assessment','Demonstrate taught glass repair · 10 min',{
   description:'Original proposed assessment. Mara observes you rejoin one owned complete set into a practice pane during the posted charms window. Attendance or a student role supplies no pass. Costs and duration are authored values.',
   requires:all(means,eq('hp.school.assessmentStart')),completionRequires:all(means,eq('hp.school.charmsOpen')),
   costs:[{type:'item',key:key('glass_shards'),amount:-1},{type:'item',key:key('paper'),amount:-1},{type:'vital',key:'stamina',amount:-2}],
   effects:[{type:'item',key:key('glass_pane'),amount:1},note('passed','Mara witnessed you rejoin a complete ordinary-glass set into a pane with your taught, practiced method. This assessed case opens her optional classroom pane contribution; it is not a general school rank or proof for missing fragments or enchanted glass.')]}),
  cmd('contribution','Repair a classroom supply pane · 10 min',{
   description:'Original proposed optional application after the assessed case. Rejoin another owned complete fragment set into a pane for Mara’s classroom stock. You give up that material; no money or new mastery is awarded. The supervised contribution can be done outside scheduled lessons. Values and timing are proposals.',
   requires:all(means,eq('knowledge.'+E+'.passed.understood')),completionRequires:all(means,eq('knowledge.'+E+'.passed.understood')),
   costs:[{type:'item',key:key('glass_shards'),amount:-1},{type:'vital',key:'stamina',amount:-1}],
   effects:[{type:'item',actor:id('tutor'),key:key('glass_pane'),amount:1},{type:'xp',skill:'Literacy',amount:2},note('contributed','You repaired and handed one real pane to Mara for classroom stock. She now holds it; your fragment set is spent. The finite contribution exercised your written repair notes, without wages or a school rank.')]})
 ]
};
