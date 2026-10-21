// Original developer definitions. These are never installed in ordinary play.
export function workshop(revision = 1, reward = 3) {
    const command = (name, duration, costs, effects) => ({id:`author_workshop.${name}`, revision,
        label:name === 'paid' ? 'Complete paid work' : 'Take a measured rest',
        worldId:'author_workshop.world', actorId:'player', location:'author_workshop.room',
        audience:['$actor'], duration, cancellation:'refund', costs, effects});
    return {schema:2,id:'author_workshop',revision,title:'Author workshop',
        compatibility:{legacy:'preserve-dormant',origin:'mandatory'}, capabilities:['native-stock','jobs'],
        world:{id:'author_workshop.world',label:'Author workshop'},
        locations:[{id:'author_workshop.room',label:'Synthetic workroom',description:'An original author test room.',underRoof:true}],
        simulation:{people:[],commands:[
            command('paid',2,[{type:'resource',native:true,key:'money',amount:-1}],
                [{type:'resource',native:true,key:'money',amount:reward}]),
            command('rest',0,[{type:'resource',native:true,key:'money',amount:-2}],
                [{type:'vital',key:'stamina',amount:4}]),
        ]}, presentation:{people:{},status:[]},
        starts:[{id:'author_workshop.start',locationId:'author_workshop.room',description:'A synthetic beginning for executable author feedback.',
            body:{id:'author_workshop.body',form:'human',ownerId:'player',controllerId:'player',hands:2},effects:[]}],
    };
}
