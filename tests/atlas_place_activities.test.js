import test from 'node:test';
import assert from 'node:assert/strict';
import {projectOfficeMaterialActivities,projectHpLibraryActivities,activitiesForPlace,placeSearchText,nativeActivityPlaces,nativePlaceDigest,handoffsForActivityReceipt} from '../prototypes/world-atlas/place-activities.mjs';
import {defineActs} from '../src/book_world_lotm_acts_host.js';
import {charmMaterialActs} from '../src/lotm_charm_materials.js';
import {tingenSilverWorkshop} from '../src/lotm_amulet_crafting.js';
import {HP_LIBRARY_COMMANDS,HP_LIBRARY_ACTIONS} from '../src/hp_library_work.js';

test('activity evidence finds both workbench origins by exact gameplay receipt',()=>{
    const reading={id:'r',schema:'atlas-reading-handoff/1',record:{label:'A reader finding'}};
    const idea={id:'i',schema:'atlas-idea-handoff/1',record:{label:'A backlog idea'}};
    const report={receipt:{path:'docs/game.md'},consumer:{name:'Apply the skill'}};
    const other={...report,receipt:{path:'docs/older/game.md'}};
    const matches=handoffsForActivityReceipt([{...reading,implementationReports:[report,other]},
        {...idea,implementationReports:[report,report]}, {...reading,id:'pending'}, {...idea,id:'other',implementationReports:[other]}],'docs/game.md');
    assert.deepEqual(matches,[{id:'r',origin:'Reading',label:'A reader finding',consumers:['Apply the skill']},
        {id:'i',origin:'Backlog',label:'A backlog idea',consumers:['Apply the skill']}]);
});

test('office map evidence follows exact native commands and retains authored and fixture boundaries',()=>{
    const projection=projectOfficeMaterialActivities([{id:'district.nonact',worldId:'book.lotm.tingen',location:'Tingen'},...defineActs().commands],charmMaterialActs(tingenSilverWorkshop).rows,{worldId:'book.lotm.tingen'});
    assert.deepEqual(projection.map(row=>row.id),['lotm.craft.slumber-practice-approval.approve','lotm.craft.slumber-office-materials.collect']);
    for(const row of projection){
        assert.equal(row.location,'lotm.place.night-watch-reception');
        assert.equal(row.minutes,5);
        assert.deepEqual(row.sources,['lotm.institution.material-quota']);
        assert.deepEqual(row.locators,['zh 第127章 p32']);
        assert.match(row.boundary,/authored.*does not reset/);
        assert.match(row.verification.scope,/fixture; earned Klein route unverified/);
    }
    assert(!projection.some(row=>row.location===tingenSilverWorkshop.place),'the unplaced inscription workshop is not remapped to reception');
});

test('both genuine consumers share exact native locations while missing readings and absent Workbench packets stay explicit',()=>{
    const lotm=projectOfficeMaterialActivities(defineActs().commands,charmMaterialActs(tingenSilverWorkshop).rows,{worldId:'book.lotm.tingen'});
    const hp=projectHpLibraryActivities(HP_LIBRARY_COMMANDS,{worldId:'book.hp.lead.world'});
    assert.equal(hp.length,4);assert(hp.every(action=>action.location==='book.hp.lead.school_hall'));
    assert(hp.every(action=>action.sources.length===0&&action.locators.length===0));
    assert(hp.every(action=>!Object.hasOwn(action.verification,'handoffId')),'backlog-first work does not fabricate a packet');
    const cast=hp.find(action=>action.id===HP_LIBRARY_ACTIONS.cast);
    assert.match(cast.costText,/1 stamina per try/);assert.equal(cast.minutes,0);
    assert(cast.conditions.some(reason=>reason.includes('Learn the Levitation Charm')));
    assert(cast.conditions.some(reason=>reason.includes('wand')));
    const data={placeActivities:{lotm,hp},others:[{id:'book.hp.lead.school_hall',label:'Hogwarts, the Great Hall'}]};
    const digest=nativePlaceDigest(null,'hp',data);
    assert.equal(digest.nativeOnly,true);assert.deepEqual(digest.entities,[]);assert.deepEqual(digest.rules,[]);assert.deepEqual(digest.counts,{});
    assert.equal(nativePlaceDigest({entities:[],rules:[],shards:0,counts:{places:{distinct:0}}},'hp',data).nativeOnly,true,'an emitted empty digest is not source coverage');
    const places=nativeActivityPlaces('hp',data,[]);
    assert.equal(places.length,1);assert.equal(places[0].label,'Hogwarts, the Great Hall');
    assert(!places.some(place=>/library/i.test(place.id)),'no library geography is invented');
    assert.deepEqual(activitiesForPlace(['book.hp.lead.school_hall'],'lotm',data),[]);
    assert.equal(nativePlaceDigest(null,'mol',data),null);
});

test('projection and place lookup reject other worlds, suffix collisions and location-free commands',()=>{
    const rows=[{id:'office',sourceIds:['source']}],command={id:'request',worldId:'lotm',location:'reception',lotmAct:{rowId:'office'}};
    const projection=projectOfficeMaterialActivities([command,{...command,id:'foreign',worldId:'mol'},{...command,id:'portable',location:null}],rows,{worldId:'lotm'});
    assert.deepEqual(projection.map(row=>row.id),['request']);
    const data={placeActivities:{lotm:projection}};
    const places=nativeActivityPlaces('lotm',data,[]);
    assert.equal(places.length,1);assert.equal(places[0].nativeBindingOnly,true);
    assert.deepEqual(nativeActivityPlaces('lotm',data,[{id:'reception'}]),[]);
    assert.equal(activitiesForPlace(['reception'],'lotm',data).length,1);
    assert.deepEqual(activitiesForPlace(['reception-extra'],'lotm',data),[]);
    assert.deepEqual(activitiesForPlace(['reception'],'mol',data),[]);
});

test('place search finds native action labels and source affordances without moving a command between places',()=>{
    const place={id:'reception',label:'Nighthawk reception',affordances:[{what:'Have lunch with colleagues'}]};
    const data={placeActions:{lotm:{reception:[{label:'Request a Slumber practice packet'}]}}};
    assert.match(placeSearchText(place,'lotm',data),/slumber practice/);
    assert.match(placeSearchText(place,'lotm',data),/have lunch/);
    assert.doesNotMatch(placeSearchText({...place,id:'other'},'lotm',data),/slumber/);
    assert.doesNotMatch(placeSearchText(place,'mol',data),/slumber/);
});
