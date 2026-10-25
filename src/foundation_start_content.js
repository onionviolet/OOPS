// Original development-only content. Importing this module enrolls no world,
// person, stock, save or RNG. The host must explicitly register the returned
// schema-2 definition through its ordinary structured native pipeline.
import {eq} from './basics.js';
import {gteReason as gte} from './content_kit.js';
export const FOUNDATION_START_PACK_ID = 'foundation_start';
export const FOUNDATION_START_IDS = Object.freeze({
    world:'foundation_start.workroom',room:'foundation_start.shelter',
    body:'foundation_start.player.body',coat:'foundation_start.work_coat',
    blank:'foundation_start.wood_blank',clasp:'foundation_start.clasp',
    twoHand:'foundation_start.shape',oneHand:'foundation_start.jig_shape',
    refit:'foundation_start.refit',
    method:'foundation_start.method',reserve:'foundation_start.reserve',legacy:'foundation_start.legacy',
});
const key=id=>JSON.stringify({id});
const fact=(name,value)=>({type:'fact',scope:'actor',key:`foundation_start.${name}`,value});
const note=(name,value)=>({type:'knowledge',key:`foundation_start.${name}`,stage:'understood',value});

export function createFoundationStartContent() {
    const I=FOUNDATION_START_IDS;
    const support=hands=>({all:[
        eq('actor.life','alive','This work needs your living body.'),
        eq('native.ready',true,'Recover before working.'),
        eq('body.mobile',true,'Use this bench with a mobile body.'),
        gte('body.hands',hands,`This arrangement needs ${hands} usable ${hands===1?'hand':'hands'}.`),
    ]});
    const command=(name,label,extra)=>({id:`foundation_start.${name}`,revision:1,label,
        worldId:I.world,actorId:'player',location:I.room,audience:['$actor'],costs:[],effects:[],...extra});
    const shape=(name,label,hands,duration)=>command(name,label,{
        duration,cancellation:'refund',reservationReturns:1,requires:support(hands),
        completionRequires:support(hands),completionCoLocated:true,completionFailure:'refund',
        description:`Use one owned wood blank and ${duration} played minutes. If your body can no longer use this arrangement, its reserved blank returns and no clasp or practice is earned.`,
        costs:[{type:'item',key:key(I.blank),amount:-1}],
        effects:[{type:'item',key:key(I.clasp),amount:1},fact('method',2),fact('worked',true),
            {type:'resource',key:I.reserve,amount:1},note('work','You shaped an actual wooden clasp. The steady method and its practice reserve belong to you.')],
    });
    const initial=[{type:'item',key:key(I.coat),amount:1},{type:'item',key:key(I.blank),amount:2},
        fact('method',1),fact('legacy',0),fact('worked',false),fact('fitted',false),
        note('opening','This sheltered workroom has a seated holding jig and two owned wood blanks. Your name and gender stay yours. The coat needs a clasp fitted before its full protection applies.')];
    return {
        schema:2,id:FOUNDATION_START_PACK_ID,revision:1,title:'A sheltered workroom',
        compatibility:{legacy:'preserve-dormant',origin:'mandatory'},
        admission:{forms:['human'],lifeStages:['adult']},capabilities:['native-stock','jobs'],
        world:{id:I.world,label:'Original sheltered workroom'},
        locations:[{id:I.room,label:'Sheltered workroom',description:'A dry bench, a seated holding jig and an ordinary coat offer two ways to begin working.',underRoof:true}],
        items:[
            {id:I.coat,label:'Work coat',description:'Your ordinary layered coat. Fit its clasp to receive its full protection.',value:1,
                equipment:{slot:'torso',baseDefense:2,weight:1,layer:1,coverage:{chest:1,back:1},forms:['human'],
                    fitFlag:'actor.foundation_start.fitted',unfitMultiplier:0.25}},
            {id:I.blank,label:'Wood blank',description:'One owned piece of wood suitable for a small clasp.',value:1},
            {id:I.clasp,label:'Wooden clasp',description:'A clasp you shaped from one actual wood blank.',value:1},
        ],
        starts:[
            {id:'foundation_start.paired_start',locationId:I.room,description:'You begin with two usable hands. The ordinary bench shapes a clasp in two minutes; the seated jig is also available.',
                body:{id:I.body,ownerId:'player',controllerId:'player',form:'human',lifeStage:'adult',hands:2,mobile:true},effects:structuredClone(initial)},
            {id:'foundation_start.single_start',locationId:I.room,description:'You begin with one usable hand. The seated holding jig supports the same useful clasp in three minutes. The ordinary two-hand bench is unavailable.',
                body:{id:I.body,ownerId:'player',controllerId:'player',form:'human',lifeStage:'adult',hands:1,mobile:true},effects:structuredClone(initial)},
        ],
        simulation:{people:[],commands:[
            shape('shape','Shape a clasp at the bench · 1 blank · 2 min',2,2),
            shape('jig_shape','Shape a clasp with the holding jig · 1 blank · 3 min',1,3),
            command('refit','Fit your coat clasp · 1 clasp · 1 min',{
                once:true,duration:1,cancellation:'refund',reservationReturns:1,requires:support(1),
                completionRequires:support(1),completionCoLocated:true,completionFailure:'refund',
                description:'Unequip your owned coat, then fit one owned clasp to it. Both are reserved during work; interruption or cancellation returns them. The same coat supplies full protection when worn.',
                costs:[{type:'item',key:key(I.clasp),amount:-1},{type:'item',key:key(I.coat),amount:-1}],effects:[{type:'item',key:key(I.coat),amount:1,reservationReturn:true},fact('fitted',true),note('fit','You fitted the coat clasp. The same worn coat now fits; carrying it alone still gives no armor.')],
            }),
        ]},
        presentation:{people:{},status:[
            {id:'foundation_start.opening_status',label:'Your opening',knowledgeKey:'foundation_start.opening'},
            {id:'foundation_start.work_status',label:'Learned arrangement',knowledgeKey:'foundation_start.work'},
            {id:'foundation_start.fit_status',label:'Coat fit',knowledgeKey:'foundation_start.fit'},
        ]},
        renewal:{id:'foundation_start.renewal',label:'Renew applied practice',
            description:'Choose a fresh round of practice in this same life. This resets applied mastery and earned reserve; it changes no body and creates no past deeds.',
            methodKey:I.method,reserveKey:I.reserve,legacyKey:I.legacy,masteryThreshold:2,
            visibleWhen:eq('actor.foundation_start.worked'),
            requires:{all:[eq('actor.foundation_start.worked'),eq('actor.foundation_start.fitted')]},
            reset:['Applied mastery returns to 1.','Earned practice reserve returns to 0.'],
            retain:['The same person, body, known arrangement, fitted coat, actual remaining stock and witnessed work remain.'],
            reward:'One lasting renewal record. Further ordinary work remains available.',
        },
    };
}
