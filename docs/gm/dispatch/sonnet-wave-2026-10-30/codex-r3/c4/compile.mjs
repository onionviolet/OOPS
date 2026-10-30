// Exercise the existing act compiler; extracted source JSONL needs authored normalization first.
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {defineLotmActs} from '../../../../../../src/lotm_act_engine.js';
import {LOTM_RITE_ROWS} from '../../../../../../src/lotm_rite_rows.js';
import {LOTM_CRAFT_ROWS} from '../../../../../../src/lotm_craft_rows.js';
import {LOTM_AID_PREPARATIONS} from '../../../../../../src/lotm_potion_rule_rows.js';
import {LOTM_ACT_BINDINGS} from '../../../../../../src/lotm_act_bindings.js';
const args=process.argv.slice(2), value=k=>args.includes(k)?args[args.indexOf(k)+1]:null;
const load=async p=>import(pathToFileURL(resolve(p)));
const rowsPath=value('--rows'), bindingsPath=value('--bindings');
if(Boolean(rowsPath)!==Boolean(bindingsPath))throw Error('Pass both normalized --rows and authored --bindings.');
const rows=rowsPath?(await load(rowsPath)).ROWS:[...LOTM_RITE_ROWS.rows,...LOTM_CRAFT_ROWS.rows,...LOTM_AID_PREPARATIONS.rows];
const bindings=bindingsPath?(await load(bindingsPath)).BINDINGS:LOTM_ACT_BINDINGS;
if(!Array.isArray(rows)||!bindings)throw Error('Expected ROWS array and BINDINGS object exports.');
const {commands,unbound}=defineLotmActs(rows,bindings,{worldId:'fixture.lotm',group:'book_lotm',situationId:'fixture.rites'});
console.log(JSON.stringify({mode:rowsPath?'private-normalized':'existing-baseline',rows:rows.length,boundRows:new Set(commands.map(c=>c.lotmAct.rowId)).size,commands:commands.length,unbound:unbound.length}));
if(args.includes('--require-bound')&&unbound.length)throw Error('Unbound rows remain; inspect privately and author complete bindings.');
