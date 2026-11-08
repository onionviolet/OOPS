// Developer-only contract fixture. Not imported by the production entrypoint;
// this is not a canon house offer or a change to Dunn's authored circumstances.
import {registerHomeWorld} from '../../../src/home_content.js';
const W='book.lotm.tingen',H=W+'.home.fixture_purchase',seller='lotm.person.cast-618f4df49af02c7da45e';
registerHomeWorld({worldId:W,places:{[H]:{name:'Fixture purchase house',location:'lotm.place.cast-67769506e76820d498cc',tenure:'rented',owner:seller,price:100,forms:['human'],capacity:8,description:'A developer purchase fixture.',listedAt:['lotm.place.cast-67769506e76820d498cc'],purchase:{seller,price:100,tie:{kind:'trust',atLeast:2,reason:'The seller needs to know you first.'},loan:{deposit:10,interest:5,period:10080,installment:20,creditor:W+'.fixture_lender'},installments:{deposit:20,period:10080,installment:20}}}}});

