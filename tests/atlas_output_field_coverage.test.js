import test from 'node:test';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {OUTPUT_KINDS} from '../prototypes/world-atlas/batch-output-index.mjs';
import {createOutputFieldCoverage,OUTPUT_FIELD_DESCRIPTORS} from '../prototypes/world-atlas/output-field-coverage.mjs';
import {readOutputRecords} from '../prototypes/world-atlas/output-records.mjs';

const admitted={admitted:true,matched:true};
const count=(page,id)=>page.fields.find(field => field.id === id)?.rows;
test('the fixed descriptors cover the twelve contracted logical files, including three separate other files',()=>{
    assert.equal(OUTPUT_FIELD_DESCRIPTORS.length,12);
    assert.deepEqual(OUTPUT_FIELD_DESCRIPTORS.map(({pass,kind}) => `${pass}/${kind}`).sort(),
        OUTPUT_KINDS.map(({pass,kind}) => `${pass}/${kind}`).sort());
    for (const descriptor of OUTPUT_FIELD_DESCRIPTORS) {
        assert.ok(Object.isFrozen(descriptor.fields));
        assert.ok(descriptor.fields.length > 0 && descriptor.fields.length <= 48);
        assert.equal(new Set(descriptor.fields.map(f=>f.id)).size,descriptor.fields.length);
        const output=createOutputFieldCoverage(descriptor.pass,descriptor.kind).snapshot();
        assert.equal(output.rows,0);
        assert.ok(output.fields.every(field=>field.rows===0));
        assert.equal(output.presentation.status,'not-assessed');
    }
    assert.throws(()=>createOutputFieldCoverage('private_source_key','__proto__'),/Unsupported output kind/);
});

test('a measured rules file counts admitted matched rows, preserving false and zero without empty shells or provenance-only fields',()=>{
    const coverage=createOutputFieldCoverage('rules','rules');
    const rows=[
        {row:{id:'public.rule.a',minutes:0,ritual:{needed:false},costs:[{amount:0}],acquire:{teacher:'PRIVATE TEST VALUE'}}},
        {row:{id:'public.rule.b',ritual:{},costs:[{}, {label:'T',locator:'en b1 c1 p1'}],acquire:{label:'T',locator:'en b1 c1 p1'},reset:{remembers:['PRIVATE HOLDER']}}},
        {row:{id:'not.indexed',minutes:5,ritual:{needed:true}},verdict:{admitted:true,matched:false}},
        {row:{id:'rejected',minutes:5,ritual:{needed:true}},verdict:{...admitted,rejected:true}},
        {row:{id:'sealed',minutes:5,ritual:{needed:true},sealed:['SECRET']}},
        {row:{id:'private',minutes:5,ritual:{needed:true},private:true}},
    ];
    for (const {row,verdict=admitted} of rows) coverage.observe(row,verdict);
    const output=coverage.snapshot();
    assert.equal(rows.length,6);
    assert.equal(output.rows,2);
    assert.equal(count(output,'minutes'),1);
    assert.equal(count(output,'ritual-needed'),1);
    assert.equal(count(output,'cost-amount'),1);
    assert.equal(count(output,'teacher'),1);
    assert.equal(count(output,'costs'),0,'numeric cost presence is separate from its description');
    assert.equal(count(output,'reset-trigger'),0);
    assert.doesNotMatch(JSON.stringify(output),/PRIVATE|SECRET|private_source|not.indexed|remembers|public.rule/);
    assert.equal(output.presentation.status,'not-assessed','input presence never claims renderer support');
});

test('arrays count a source row once per field and omit nested private or sealed data',()=>{
    const coverage=createOutputFieldCoverage('people','people');
    coverage.observe({routine:[{recurrence:'daily'},{recurrence:'weekly'}, {recurrence:'yearly',private:true}],
        reacts:[{class:'help',private:true},{class:'harm',sealed:['SECRET']},{response:'Public paraphrase'}],
        knows:[{fact:'PRIVATE KNOWLEDGE'}],speech:['PRIVATE RAW VOICE'],wants:['', '   ']},admitted);
    coverage.observe({routine:[{recurrence:'daily',scope:'private'}],reacts:[{}],wants:[]},admitted);
    const output=coverage.snapshot();
    assert.equal(output.rows,2);
    assert.equal(count(output,'routine-recurrence'),1);
    assert.equal(count(output,'reaction-class'),0);
    assert.equal(count(output,'reactions'),1);
    assert.equal(count(output,'goals'),0);
    assert.doesNotMatch(JSON.stringify(output),/PRIVATE|SECRET|speech|knows/);
});

test('admission cannot be forged by row keys; source-defined keys, object shells and accessors never become output',()=>{
    const coverage=createOutputFieldCoverage('texture','services');
    const row=JSON.parse('{"admitted":true,"matched":true,"amount":0,"evil_key":"RAW","__proto__":{"amount":9}}');
    assert.equal(coverage.observe(row),false);
    assert.equal(coverage.observe(row,{matched:true}),false);
    assert.equal(coverage.observe(row,{admitted:true}),false);
    assert.equal(coverage.observe(row,admitted),true);
    let getterCalls=0;
    const accessor={get amount(){getterCalls++;throw Error('must not run');}};
    coverage.observe(accessor,admitted);
    coverage.observe(Object.create({amount:7,unit:'private inherited'}),admitted);
    coverage.observe({amount:{unexpected:0},unit:' ',hours:'not stated'},admitted);
    const output=coverage.snapshot();
    assert.equal(output.rows,4);
    assert.equal(count(output,'amount'),1);
    assert.equal(count(output,'unit'),0);
    assert.equal(count(output,'hours'),0);
    assert.equal(getterCalls,0);
    assert.doesNotMatch(JSON.stringify(output),/evil_key|RAW|__proto__|inherited|unexpected/);
    output.fields[0].rows=99;
    assert.equal(coverage.snapshot().fields[0].rows,0,'snapshots do not mutate the collector');
});

test('each logical kind measures its own public structure, without inferring which view displays it',()=>{
    const examples=[
        ['census','census',{amount:{value:0},touchedByLead:false},'amount'],
        ['scenes','scenes',{steps:[{actor:'public.actor',time:{minutes:0}}]},'step-time'],
        ['scenes','fills',{basis:['en b1 c1 p1']},'basis'],
        ['rules','rules',{ritual:{needed:false}},'ritual-needed'],
        ['rules','other',{about:['public.rule']},'about'],
        ['people','people',{routine:[{recurrence:'daily'}]},'routine-recurrence'],
        ['people','other',{about:['public.actor']},'about'],
        ['texture','places',{routes:[{to:'public.place',minutes:0}]},'route-minutes'],
        ['texture','services',{amount:0},'amount'],
        ['texture','news',{date:'Public date'},'date'],
        ['texture','customs',{applies:'public.place'},'applies'],
        ['texture','other',{about:['public.place']},'about'],
    ];
    for(const [pass,kind,row,id] of examples){
        const coverage=createOutputFieldCoverage(pass,kind);
        coverage.observe(row,admitted);coverage.observe(row,admitted);
        const output=coverage.snapshot();
        assert.equal(output.rows,2,`${pass}/${kind}: source duplicates remain two source rows`);
        assert.equal(count(output,id),2,`${pass}/${kind}`);
        assert.equal(output.presentation.status,'not-assessed');
    }
    const news=createOutputFieldCoverage('texture','news');
    assert.equal(news.observe({date:'PRIVATE',scope:'private'},admitted),false);
    assert.equal(news.observe({date:'PRIVATE',at:'private'},admitted),false);
    assert.equal(news.snapshot().rows,0);
});

test('cyclic non-JSON containers cannot recurse indefinitely into a descriptor',()=>{
    const coverage=createOutputFieldCoverage('people','people'),cycle=[];cycle.push(cycle);
    coverage.observe({routine:cycle},admitted);
    assert.equal(count(coverage.snapshot(),'routine-recurrence'),0);
});

test('a selected six-row file yields two admitted exact joins and measured structured coverage',()=>{
    const rows=[
        {id:'w.rule.first',minutes:0,ritual:{needed:false},costs:[{amount:0}]},
        {id:'w.rule.second',ritual:{},acquire:{label:'T',locator:'en b1 c1 p1'}},
        {id:'w.rule.unindexed',minutes:9,ritual:{needed:true}},
        {id:'w.rule.rejected',minutes:9,ritual:{needed:true}},
        {id:'w.rule.first',minutes:9,ritual:{needed:true},sealed:['SECRET']},
        {id:'w.rule.first',minutes:9,ritual:{needed:true},private:true},
    ];
    const directory=resolve('unused-coverage-fixture');
    const book={key:'x',world:'w',dir:pathToFileURL(directory).href};
    const query={prefix:'xc001',pass:'rules',kind:'rules'};
    const options={directory,names:['xc001_rules.jsonl'],shards:[{prefix:'xc001'}],registry:[book],
        digest:{world:'w',rules:[{id:'w.rule.first',name:'First public rule'},{id:'w.rule.second',name:'Second public rule'}]},
        readFile:()=>rows.map(row=>JSON.stringify(row)).join('\n')};
    const file=readOutputRecords(book,query,options);
    assert.deepEqual([file.counts.fileRows,file.counts.matchedRows,file.counts.unindexed,file.counts.noPublicMatch],[6,2,2,2]);
    const coverage=createOutputFieldCoverage('rules','rules');
    for(const row of rows){
        const selected=readOutputRecords(book,query,{...options,readFile:()=>JSON.stringify(row)});
        const matched=selected.counts.matchedRows===1;
        coverage.observe(row,{admitted:matched,matched});
    }
    const output=coverage.snapshot();
    assert.equal(output.rows,2);
    assert.deepEqual(Object.fromEntries(output.fields.filter(field=>field.rows).map(field=>[field.id,field.rows])),
        {minutes:1,'cost-amount':1,'ritual-needed':1});
    assert.doesNotMatch(JSON.stringify(output),/SECRET|w\.rule\.|\.jsonl|file:\/\//);
});
