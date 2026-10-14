const layer=(id,patch={},extra={})=>({id,revision:1,tags:[],needs:[],excludes:[],weight:1,patch,...extra});
export const frontierStartWorld={id:'base.frontier',revision:1,axes:['entry','background','possessions'],base:{location:'Village',quest:'Lost memory'},layers:{
    entry:[layer('empty'),layer('vanilla',{money:102,items:[{id:'Cheap leather pants',quality:40,count:1},{id:'Stale bread',count:5}],
        pockets:{'Cheap leather pants':'A rough patch inside the knee covers a tear with dried mud still caught in its edge.',
            'Stale bread':'The five pieces smell faintly of wood smoke, with flour from a shared loaf still dusting their crusts.'},
        location:'Village',quest:'Lost memory',text:['A cloth seam presses against your skin as you wake in a village with no memory of how you arrived, where the elder may know what happened.']},{tags:['village','woke']})],
    background:[layer('empty'),layer('farmhand',{money:3,text:['Your hands settle an imagined harvest basket by habit, and three more coins remain in your pocket.']},{tags:['farmhand'],needs:['village']}),
        layer('runaway',{money:1,text:['One more coin is tucked into the seam of your sleeve.']},{tags:['runaway'],needs:['village'],excludes:['family-keepsake']}),
        layer('scholars-child',{money:4,text:['Ink sits beneath a fingernail, and four more coins are tied in the corner of your coat.']},{tags:['scholar'],needs:['village']})],
    possessions:[layer('empty'),layer('packed-bread',{items:[{id:'Stale bread',count:2}],
        pockets:{'Stale bread':'The two extra pieces were wrapped for the road in cloth that smells of onion.'},text:['Crumbs cling to a folded parcel holding two additional pieces of bread.']},{tags:['provisions']}),
        layer('family-keepsake',{money:2,text:['A little purse with a worn fastening holds two more coins.']},{tags:['family-keepsake'],excludes:['runaway']})]
}};
