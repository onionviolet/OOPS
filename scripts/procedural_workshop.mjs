import {readFileSync} from 'node:fs';
import {brewWorkshopAntidote, brewWorkshopDraught, brewWorkshopPolyjuice, potionWorkshopCases} from '../src/hogwarts_potion_workshop.js';
import {guWorkshopCases, runGuCoordination, runGuWorkshop} from '../src/gu_workshop.js';
import {runGuPropagation} from '../src/gu_propagation_workshop.js';
import {runSpellWorkshop, spellWorkshopCases} from '../src/hogwarts_spell_workshop.js';
import {runAbrasionWorkshop, runEnclosureWorkshop, substitutionWorkshopCases} from '../src/substitution_workshop.js';

const cases = {...potionWorkshopCases, ...guWorkshopCases, ...spellWorkshopCases, ...substitutionWorkshopCases,
    'gu-thunder-potato': {method: 'gu-propagation'}};
const methods = new Map([
    ['draught', brewWorkshopDraught], ['antidote', brewWorkshopAntidote], ['polyjuice', brewWorkshopPolyjuice],
    ['gu', runGuWorkshop], ['gu-coordination', runGuCoordination], ['gu-propagation', runGuPropagation],
    ['spell', runSpellWorkshop], ['abrasion', runAbrasionWorkshop], ['enclosure', runEnclosureWorkshop],
]);
const [argument, ...extra] = process.argv.slice(2);

try {
    if (argument === '--case') {
        if (extra.length !== 1 || !Object.hasOwn(cases, extra[0])) throw Error('Supply a named case after --case.');
        console.log(JSON.stringify(cases[extra[0]], null, 2));
    } else if (extra.length) {
        throw Error('Supply a single case name, JSON request, or "-" for standard input.');
    } else if (!argument || argument === '--help') {
        console.log('Usage: node scripts/procedural_workshop.mjs <case | JSON | ->');
        console.log(`Cases: ${Object.keys(cases).join(', ')}`);
        console.log('Use --case <name> to print a named case as editable JSON.');
        console.log('Example: node scripts/procedural_workshop.mjs \'{"method":"draught","preparation":"crush","strokes":"LLLLLLLR"}\'');
    } else {
        const request = Object.hasOwn(cases, argument) ? cases[argument]
            : JSON.parse(argument === '-' ? readFileSync(0, 'utf8') : argument);
        const resolve = methods.get(request?.method);
        if (!resolve) throw Error('Choose a supported method. Use --help for examples.');
        console.log(JSON.stringify(resolve(request), null, 2));
    }
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
}
