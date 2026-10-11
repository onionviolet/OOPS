import {FORT} from './fort.js';

// Call once after native imports evaluate, before any save loads or path lookup.
// Constructors/registries are injected to avoid adding another native owner.
export function registerFortContent({locations,item_templates,book_stats,quests,availabilities,
    SafeLocation,CombatZone,Book,BookData,Quest,QuestTask}) {
    if(locations[FORT.post])return;
    const addBook=(id,description,data)=>{
        const book=new Book({id,name:id,value:0,description});book.id=id;
        item_templates[id]=book;book_stats[id]=new BookData(data);
        availabilities.item[id]=book._getBasicAvailabilityComponent();
    };
    addBook(FORT.notes,'The clerk’s practical repair sketch. Read for four minutes. The yard has a first salvage heap, then a second heap at two full clears. Smelt five ore with one coal into an iron ingot in Village. Bring three ore and one ingot to the Fort supply post to repair its cellar hatch.',
        {required_time:4,literacy_xp_rate:1,rewards:{locations:[{location:FORT.post},{location:FORT.yard}],
            recipes:[{category:'smelting',subcategory:'items',recipe_id:'Iron ingot'}],quests:[FORT.quest]}});
    addBook(FORT.ledger,'A returned storekeeper ledger: repair receipts, stores counted, and the clerk’s thanks. Its pages record ordinary local work.',
        {required_time:3,literacy_xp_rate:1});
    const post=new SafeLocation({id:FORT.post,name:FORT.post,is_unlocked:false,
        description:'A clerk works beneath the surviving gatehouse. The repair board buys packing supplies from a finite purse. The cellar hatch needs three ore and one finished iron ingot.',
        connected_locations:[{location:locations.Village,travel_time:20}],is_under_roof:true});
    const yard=new CombatZone({id:FORT.yard,name:FORT.yard,is_unlocked:false,parent_location:post,
        description:'Wolf rats nest among displaced stone and old salvage. The clerk marked two accessible salvage heaps in the repair notes.',
        enemies_list:['Wolf rat'],enemy_group_size:[1,2],enemy_count:8,enemy_stat_variation:0.1,
        first_reward:{xp:20,items:[{item:'Iron ore',count:4},{item:'Coal',count:2}]},
        repeatable_reward:{items:[{item:'Iron ore',count:1},{item:'Coal',count:1}]},
        rewards_with_clear_requirement:[{required_clear_count:2,items:[{item:'Iron ore',count:3}]}]});
    const cellar=new CombatZone({id:FORT.cellar,name:FORT.cellar,is_unlocked:false,parent_location:post,
        description:'An old store cellar beneath the repaired hatch. Recover the clerk’s misplaced ledger after driving out the rats.',
        enemies_list:['Wolf rat'],enemy_group_size:[2,3],enemy_count:10,enemy_stat_variation:0.1,
        first_reward:{xp:30},is_under_roof:true});
    for(const location of [post,yard,cellar]){locations[location.id]=location;availabilities.location[location.id]=location.getAvailabilityComponent();}
    locations.Village.connected_locations.push({location:post,travel_time:20});
    post.connected_locations.push({location:yard,travel_time:5},{location:cellar,travel_time:5});
    // Native Quest currently registers this.id before it has an id. Preserve
    // unrelated placeholder bindings just as the other native registrars do.
    const placeholderKeys=['undefined','undefined:task:0','undefined:task:1'];
    const prior=new Map(placeholderKeys.map(key=>[key,{present:Object.hasOwn(availabilities.quest,key),value:availabilities.quest[key]}]));
    let q;
    try {q=new Quest({quest_id:FORT.quest,quest_name:'Restore the Waypost stores',questline:'Waypost stores',display_priority:20,
        quest_description:'Clear the yard, smelt a native iron ingot, then hand over three ore and one ingot at the supply post. Clear the opened cellar to recover the clerk’s ledger.',
        quest_tasks:[new QuestTask({task_description:'Clear the Fort yard once.',task_condition:{all:{clear:{[FORT.yard]:{target:1}}}}}),
            new QuestTask({task_description:'Repair the hatch at the supply post and clear the Fort cellar.',task_condition:{all:{clear:{[FORT.cellar]:{target:1}}}}})],
        quest_rewards:{items:[{item:FORT.ledger,count:1}]}});
    } finally {
        for(const [key,saved] of prior) {
            if(saved.present)availabilities.quest[key]=saved.value;
            else delete availabilities.quest[key];
        }
    }
    q.quest_id=FORT.quest;quests[FORT.quest]=q;availabilities.quest[FORT.quest]=q.getAvailabilityComponent();
    q.quest_tasks.forEach((t,i)=>{availabilities.quest[`${FORT.quest}:task:${i}`]=t.getAvailabilityComponent();});
}
