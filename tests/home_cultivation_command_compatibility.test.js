import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {cultivationDefinitions,CRADLE_FILM,CULTIVATION_STEWARD} from '../src/home_cultivation_content.js';
const frozen=JSON.parse(fs.readFileSync(new URL('../docs/gm/dispatch/cultivation-absorption-2026-10-24/checks/fixtures/awakening-command-golden.json',import.meta.url)));
test('current circulation changes version explicitly while every other old definition and its frozen terms stay intact',()=>{for(const old of frozen.commands){const current=cultivationDefinitions.commands.find(d=>d.id===old.id);if(old.id==='home.cultivation.release'){assert.deepEqual(current,{...old,revision:2,effects:[...old.effects,{type:'resource',actor:CULTIVATION_STEWARD,key:CRADLE_FILM,amount:1}]});}else assert.deepEqual(current,old,old.id+' retains its original definition');}for(const id of ['home.cultivation.awakened_lesson','home.cultivation.clean'])assert.ok(cultivationDefinitions.commands.some(d=>d.id===id));});
