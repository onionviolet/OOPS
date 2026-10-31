import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,hostOver} from './lotm_helpers.js';
import {setHarmState} from '../src/harm_state.js';

test('the LOTM host tick asks for loss_of_control once power strain reaches the lost stage, and only then',async()=>{
 const calls=[];
 const {host,box}=hostOver(fresh(),{die:cause=>{calls.push(cause);return Promise.resolve();}});
 setHarmState({schema:1,backlash:{power:8}});host.tick(351);
 assert.deepEqual(calls,[]);
 setHarmState({schema:1,backlash:{power:9}});host.tick(351);
 await Promise.resolve();
 assert.deepEqual(calls,['loss_of_control']);
 setHarmState(null);
});
