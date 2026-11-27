import {readFile,stat} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {playStatus} from './play-status.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
// Tracked text may be checked out as CRLF. Accept the canonical Git text bytes
// for a pinned receipt, while rejecting every other edit.
function receiptHash(bytes, expected) {
 const raw=sha(bytes);
 return raw===expected||sha(bytes.toString('utf8').replace(/\r\n/g,'\n'))!==expected?raw:expected;
}
const isHash=s=>typeof s==='string'&&/^[a-f0-9]{64}$/.test(s);
const empty=a=>Array.isArray(a)&&a.length===0;
const source=(id,path,fingerprint,format,scope,evidenceDate='2026-11-25')=>({id,path:'docs/representations/evidence/'+path,fingerprint,format,scope,evidenceDate});
export const NATIVE_EVIDENCE_CARDS=[
 {id:'fang-first-night',title:'Fang Yuan · house, inn and breakfast',pov:'Reverend Insanity · Fang Yuan',relatedHref:'#world/ri/things',evidenceKind:'authored-record',
  where:'From a fresh Village life, open Beginning, choose Reverend Insanity · the returned clan youth, then Confirm arrival. Play the awakening and academy opening, receive the unrefined Moonlight Gu, and continue through the home and rain scenes to Press essence into the Moonlight Gu. After the resisted first infusion, you are at your guardians’ house with fourteen of forty-four essence. Sleep in your bed or stay awake; wake early, go on with your current reserve, or draw a measured part from a held stone. The later inn room is a separate place and costs two untouched stones. Once that room is paid, use Sleep in your room at the inn without paying rent again; leaving for the grove removes the bed. After the paid night, Go downstairs for breakfast to hear Fang Zheng. Choose Take the pouch or Push the pouch back from the same offer. After taking the pouch, choose Draw from a carried small stone. Pick a piece under Stone to draw from, then draw one part.',
  setup:'Prepared English volume 1 chapter 10 paragraphs 14–43 support the resisted attempt, partial refinement, fading trace and different natural/stone recovery rates. The English compilation’s original-edition alignment was not freshly checked, and this Atlas update rereads no raw chapter. Optional first-night bed/rest, proceeding below full essence and measured carrier controls are authored play choices, not asserted source events. The aggregate separates earlier08527/fa360 observations from final d87e9e8f0df4b8c9ee45a047f516a1a5214c317fec8f3a3bf1e49cc47efd2332 checks. Desktop checks import genuinely earned first-infusion progress; that is distinct from the native normal-entry producer and earlier full-rest proofs. The separate paid-inn check uses normal build8751c15de722c1deff382507b29c841ed535f6df4772d1048f7e14c70ebc423f; its paid room and older native save are distinct from the d87e guardians’ house/source checkpoint. The later breakfast proof separately records native build13866612, desktop b7d18eb2 and already-paid compatibility a2e99fc4. Its checked English chapter17/18 source and authored reply alternatives are explained on the readable breakfast page.',
  outcome:'Natural sleep filled fourteen to forty-four essence after 450 played minutes while Fang Yuan remained asleep, keeping six untouched stones. A banked hour settled sixty minutes and four essence once. Waking at sixteen essence, two one-minute draws used the same stone and reached eighteen; cancelling a third kept the carrier at two parts drawn. The later inn left nineteen essence, three untouched stones and that carrier. Pending, kept and inn Save/reload/Export/Import passed. The corrected inn display has no guardians’ bed. Bodily recovery was checked separately on an explicit depleted-health/stamina fixture. The Moonlight Gu remains unrefined; no full Fang Yuan campaign is claimed. Separately on8751c15d, the earned inn bed entered native sleep without another rent charge and the grove showed no bed. Desktop sleep moved fifteen-to-eighteen essence while four untouched stones remained. An older paid-room native save slept fourteen-to-sixteen, retained completed worm work and inventory through Save/reload/Export/Import, then continued to breakfast. In the new breakfast offer, pushing the pouch back keeps Fang Yuan at three whole stones and leaves five whole stones plus the half piece with Fang Zheng. Taking it leaves Fang Yuan with eight whole stones and one half-sized, partly depleted piece. Neither choice records Liquor Worm work. Pending and settled choices persist; the already-paid older save keeps its stock and cannot receive a second offer. The kept half stone has an authored fifteen-part estimate; the separate draw proof records desktop14→15 with fourteen parts left, near-capacity use, refusal and older-save persistence.',
  receipts:[],references:[{id:'fang-current-first-night',label:'Read the current first-night checkpoint summary',path:'docs/representations/evidence/fang-yuan-first-night-2026-11-26/proof.json',fingerprint:'2dd55536e1097e3302ede9f534d086e0e05b7d8ea45025ded1d22e7b76534b76',href:'/native-play-record/fang',scope:'Current factual metadata: guardians’ house and partial-reserve choices, per-branch builds, native/desktop evidence and persistence; earlier full-rest proof remains separate.'},
   {id:'fang-prepared-reading',label:'Read the qualified first-refinement and recovery source',path:'docs/gm/dispatch/cross-world-systems-2026-11-07/READ_AHEAD_USE_2026-11-08.md',fingerprint:'75ec7f5804545188a2f972e7558e3afee98bb5ae0b525b3c902061a1f8a32a54',href:'#world/ri/reading/tracked%3ARI-RA9-FIRST-REFINEMENT',scope:'Existing prepared English b1 ch10 paragraphs14–43; source paraphrase and authored runtime choices remain distinct.'},
   {id:'fang-paid-inn',label:'Read the separate paid-inn evidence summary',path:'docs/representations/evidence/fang-yuan-first-night-2026-11-26/paid-inn.json',fingerprint:'f3cb4c7279bfbdb9de8dddc6142b74e1528054bad47696b481a76136f1c42f21',href:'#workbench/play-evidence/fang-first-night/paid-inn',scope:'Separate normal build8751c15de722c1deff382507b29c841ed535f6df4772d1048f7e14c70ebc423f: earned paid-room bed, no repeated rent, grove bed absent, and older native paid-room Save/reload/Export/Import with fourteen-to-sixteen essence sleep then breakfast. The d87e house/source checkpoint remains separate.'},
   {id:'fang-breakfast',label:'Read the breakfast choices and checked source',path:'docs/representations/evidence/fang-yuan-first-night-2026-11-26/breakfast.json',fingerprint:'5d85be99206ff10524d8f8f0e9f35df8379df46be5f937b98d3e2efd83affe6f',href:'#workbench/play-evidence/fang-first-night/breakfast',scope:'Separate breakfast proof: same07:13 offer, physical pouch acceptance/refusal, pending/outcome persistence and already-paid compatibility; source qualification is the current checkpoint’s direct English ch17/18 check.'},
   {id:'fang-half-stone',label:'Read how the kept half stone can be used',path:'docs/representations/evidence/fang-yuan-first-night-2026-11-26/half-stone.json',fingerprint:'d1af5fe43048eb2a06bc4469f1cd10a5e0c9c0d092f82aef09fef592d549af72',href:'#workbench/play-evidence/fang-first-night/breakfast',scope:'Separate half-stone continuation: authored15-part estimate, desktop14→15, near-capacity use, refusal and older accepted-save persistence. Source states a partly depleted piece, not its remaining charge.'}]},
 {id:'ryan-wyvern-visit',title:'Ryan · Wyvern’s visit',pov:'The Perfect Run · Ryan Romano',relatedHref:'#world/pr/things',evidenceKind:'authored-record',
  where:'From a fresh Village life, open Capability runs, choose Ryan Romano · New Rome, then Begin this run. Finish the chapter-one briefcase delivery: learn from the first failed attempt, return, use the learned car route, pay repairs and clear security before handing over the case. Choose Continue to the next morning, then Open the window. Ask Wyvern about Len or keep your search private; put recruitment aside, then take or decline her card.',
  setup:'The signed combined integration record covers the adopted primary build b9d9d7572f628b9d34cafce3ed3a2003e12d966dd195f71db3a3130ef28c5989. It records a fresh earned delivery and private/no-card route, plus a separate unchanged original Export continued through the offered inquiry and card. Earlier chapter-one and isolated next-morning proofs are separate history. This card registers that authored record, not a machine-readable playtest receipt. Chapter-two dialogue follows checked source; overnight/action minutes, withholding Len and declining the card are authored alternatives.',
  outcome:'Asking gives Wyvern the disclosed description and a conditional offer to look in the files. Keeping the search private creates no Len request. Taking the card changes physical custody and remembered contact; declining leaves it with Wyvern without erasing a remembered address. Recruitment stays open without joining. Native pending-offer Save/reload and card Export/Import passed on the combined build. Payment is received without inventing a spendable payout; no found person, finished investigation, employment or permanent ally is granted. Later-death memory/reset is a regression check, not a played new death scene.',
  receipts:[],references:[{id:'ryan-combined-record',label:'Read Ryan’s public visit and integration summary',path:'docs/gm/dispatch/protagonist-foundations-2026-11-25/COMBINED_INTEGRATION_2026-11-26.md',fingerprint:'c0531208be962887e53c6d1d46a6ff3db3a050005d59f54cb8ea1d98846cc2df',href:'/native-play-record/ryan',scope:'Signed combined primary record: fresh and prior-export branches, scoped native persistence and source/authored distinctions; no relabeling of earlier candidate proofs.'}]},
 {id:'taylor-backpack-bus',title:'Taylor · backpack and ride home',pov:'Worm · Taylor Hebert',relatedHref:'#world/worm/things',
  where:'From a fresh Village life, open Beginning, choose Worm · Taylor Hebert, then Confirm arrival. After the washroom choice, step into the corridor and choose The way home. Collect the backpack or leave it at school, walk to the stop, board and Ride toward home. Inspect only while the same bag is within reach; the return bus lets you retrieve a bag left behind.',
  setup:'The native fresh route earned this entry without a supplied save. A separate native route continued the unchanged earned corridor export and left the bag at school. The signed-off desktop record separately covers that earned export, bag-free travel and the return option at 1280×720. An earlier held-bag desktop inspection is not relabeled as the corrected run.',
  outcome:'One physical bag can be carried, set down and retrieved. Bag-free travel reaches the home stop without granting remote inspection. Cancelling inspection reveals nothing; completing the retry confirms private notebook damage without replacement or public disclosure. Native Save/reload and Export/Import kept one bag and the insects at their prior location, with money unchanged. These are bounded school/bus routes, not a timetable or later costume result.',
  receipts:[source('taylor-bus-fresh','worm-bus-2026-11-26/native-fresh-proof.json','1e45fc0cb354461a33c7eeff7a87e1c841f1f4fb11117cda552350a0d7cee554','taylor-bus-fresh','Fresh ordinary native entry, actual bag access and bus inspection, native persistence; no desktop claim','2026-11-26'),source('taylor-bus-earned','worm-bus-2026-11-26/native-earned-left-bag-proof.json','e3f571443dc056df52ea963b671728dc70ee8726c755c216c4412f55ff45afe9','taylor-bus-earned','Separate unchanged earned corridor continuation: bag-free ride, return, same-bag recovery, Stop/retry and persistence','2026-11-26')],
  references:[{id:'taylor-bus-desktop-record',label:'Read the public backpack and desktop summary',path:'docs/representations/WORM_OPENING_2026-11-26.md',fingerprint:'c003e9325fc1fbcb5438c9b5b024ba0e3fff842c49d7f761a45d6e5a6c8a8182',href:'/native-play-record/taylor',scope:'Corrected 6cd804 desktop bag-free route at 1280×720; earlier held-bag inspection is a separate run.'}]},
 {id:'alden-bedside-choice',title:'Alden · choosing the bedside visit',pov:'Super Supportive · Alden Thorn',relatedHref:'#world/sup/things',evidenceKind:'authored-record',
  where:'From a fresh Village life, open Beginning, choose Super Supportive · Alden Thorn, then Confirm arrival. Listen to Amanda and Ask who has come. Refuse for now, or ask to see Hannah. Admitting her is separate from Let Hannah come to the bedside; after welcoming her, ask about the metal that hurt you.',
  setup:'This card relies on the signed-off authored title record, not a registered machine-readable native receipt. The recorded 1280×720 desktop refusal used build c7a58589ddac5f9aaba9b0c1c365dcd20f3f5a926c06c168c14cb13139fb4f76. Later old-save reopening used 8a430b38 and does not re-test the original choice on that build. Source offers refusal; its delivery and conversation minutes are authored.',
  outcome:'The desktop refusal kept Hannah downstairs and supplied no private account; Save/reload and actual Export/Import retained that refusal. Source and focused tests separately support admission, actual recipient presence, a second bedside permission and a request Hannah can hear. Asking about the fragment gives no fragment, retrieval promise, automatic trust or power. The admission branch is not claimed as a desktop replay by this card.',
  receipts:[],references:[{id:'alden-signed-off-record',label:'Read Alden’s public choice and desktop summary',path:'docs/gm/dispatch/protagonist-foundations-2026-11-25/ALDEN_OPENING_2026-11-26.md',fingerprint:'b910ddf83599fdda8c0de8dfa99a30232994a0f31075ae3e51402929e00986ce',href:'/native-play-record/alden',scope:'Authored record: historical refusal desktop, later exact-save reopening and separately scoped focused/native checks.'}]},

 {id:'farm-courtyard',title:'Courtyard harvest for Bram',pov:'Ordinary Village life',relatedHref:'#world/village/places',
  where:'In OOPS, open Organizations, visit the market courtyard, rent Mira’s plot and buy seed. Book the courtyard before harvesting. Under Grain for Bram’s booked gathering, choose the household keep count and reserve the next grain. Plant, tend, grow and harvest grain, then open Events and performances to host Bram with Mira’s set-aside portion.',
  setup:'Fresh Village native controls earned the booking and harvest. The desktop check imported that earned stored-food checkpoint; it did not start fresh. Mira’s pantry role is an authored continuation. The separate native replay checks persistence and cancellation; automatic delivery was exercised with local support.',
  outcome:'A harvest of five left four with the player and one with Mira. The completed meal paid five coins from Bram and kept the household holdback until explicitly cleared. Reserve five supplied no meal portion; cancelling returned unserved food, and the original carry-and-host route remained usable. Native Save/reload and Export/Import passed while stored and mid-meal. Desktop at 1280×720 separately showed custody, expected payment, completed payment and the keep-four readout.',
  receipts:[source('farm-native','farm-gathering-2026-11-26/native.json','41acc2200907d81b78e83f1772b422f12c615b982b3804142fb2d876cd941476','farm-native','Fresh native booking before food, manual harvest, reserve and cancellation comparisons, native persistence; no desktop claim','2026-11-26'),source('farm-desktop','farm-gathering-2026-11-26/desktop.json','ee2a660b2d63861d3f34abb30823793b521da74a2c32c9300b00e0b453999e4d','farm-desktop','Desktop host/payment from the earned stored-food checkpoint, 1280×720; no fresh harvest or browser persistence claim','2026-11-26')]},
 {id:'su-xiao-recruitment',title:'Su Xiao · recruitment and Gray Terminal',pov:'Su Xiao beginning, separate life',relatedHref:'#world/paradise/places',
  where:'In OOPS, start a fresh ordinary Village life, open the Beginning picker, choose Su Xiao and Confirm arrival. Inspect the wounds, ask about the knife and Hunter duties, then sign and receive treatment. Continue through awakening and transfer, read the world notice, and open the mark’s personal and trial panels.',
  setup:'The native opening began fresh without a supplied save or time or skill grants. Optional early signing and one-minute readings are authored choices in the source-qualified opening. A later desktop check reopened the genuinely earned post-trial checkpoint; it did not replay recruitment.',
  outcome:'Treatment closed the original body’s wounds. Transfer reached Gray Terminal; personal and trial readings each used one minute, leaving 4318 of 4320 trial minutes. Recruitment and later Save/reload plus native Export/Import passed. The later desktop reopening preserved the house, injury-to-healing history and issue-minute-zero countdown. No completed mission, extraction or currency conversion was verified.',
  receipts:[source('paradise-opening','paradise-opening-2026-11-26/native-proof.json','152467409ae3e2dc64136ca87e6627158695ab0f356dc84114711131aa2b8057','paradise-opening','Fresh native recruitment, treatment, transfer and panel readings with persistence; no desktop opening claim','2026-11-26'),source('paradise-continuity','paradise-opening-2026-11-26/continuity-desktop.json','fb6d7432e05d13b1c9913ab35354ff2553d25bbf8d73ad11eb3ec2f0ec7e15c7','paradise-continuity','Desktop reopening of genuine earned checkpoint and historical injury/countdown wording; no new mission outcome','2026-11-26')]},

 {id:'village-watch-relay',title:'Village watch and relay',pov:'Ordinary Village life',relatedHref:'#world/village/places',
  where:'In OOPS, begin in Village. Speak with the elder and earn field, cave and mill access. Open Local life for the watch and parcel work; relay the receipt through the millers to the old craftsman.',
  setup:'Genuinely earned cave-report and courier checkpoints, following fresh native play. No stat, inventory or outcome grants. Test ticks advance played time.',
  outcome:'A completed watch pays 12p and standing; the elder→millers→craftsman relay pays 8p. Leaving a watch forfeits its unpaid reward. Pending and completed Save/reload/Export/Import were checked.',
  receipts:[source('village-watch-relay','village-watch-relay-2026-11-25/proof.json','0c3b7770eb6856c158b1bfdb3feb828ed0d1fa18c0e75e150c930837ebfe28ce','village','Watch, relay, interruption and independent courier route')]},
 {id:'tingen-local',title:'Tingen tent · ordinary local',pov:'Ordinary local, separate life',relatedHref:'#world/lotm/places',
  where:'Enter ordinary Tingen life. Watch the tent at 08:40 on day one and return the next day for work. After the paid flyer round, ask for a spare notice and ask Wendy at Sline Bakery to display it; morning visits need no circus job. Edwin buys bread there on day two, 09:15–09:25, then passes through Municipal Square until 10:00. Finish walking before speaking. If you asked the reader about work, you can give Edwin one-minute directions.',
  setup:'The notice and customer are authored continuations in a sourced setting. Browser replays followed separate earned lives with different prior jobs; a same-state regression separately isolates physical paper. Earlier answers/persistence and the corrected arrival check have separate receipts.',
  outcome:'The flyer round pays 2p in 15 minutes; posting adds no wages. Edwin arrived for bread without dialogue selection. Directions changed his text and retired the action; bakery Save/reload kept the answer. Away itinerary: bakery → tent → square at 09:26, then answer. The unposted life had bread but no circus question. The corrected arrival check withheld dialogue and actions until the walk finished.',
  receipts:[source('tingen-local-actions','lotm-tent-incident-2026-11-25/checked-d815-resume/scope.json','078b63274eaf86bfec5fc5b938a40de6f13aeea57533ebd9436315ce9ebbaaa0','local','Local assertions passed; combined process exit1 at later Klein control'),source('tingen-local-boundaries','lotm-tent-incident-2026-11-25/final-boundaries/result.json','a3ae2c9b01475781919c6c749339a7621c9f60906deb7d7c917db7f60af2d7a2','boundaries','Exact9:00 closure and an actual hour elsewhere grant no witness, favor or pay'),source('tingen-local-bakery-notice','lotm-tent-incident-2026-11-25/bakery-notice-browser.json','11c55c6f8606b04512d71b082a463ed807cf2da1eedaa2407f456b88ade2ed76','bakery-notice','Independent no-job bakery visit; paid-round spare notice, interrupted retry, unchanged purse and persistent window','2026-11-26'),source('tingen-local-bakery-customer','lotm-tent-incident-2026-11-25/bakery-customer-observations-2026-11-26.json','52d2d2361921689418a9ed8858d3d19c342f3fccc88aee93736af5e8c16a4af0','bakery-customer-observations','Coordinator desktop observations: bakery answer/reload and separate posted/unposted square histories; same-state paper regression is separate. Does not verify pre-arrival timing or customer native Import','2026-11-26'),source('tingen-local-customer-arrival','lotm-tent-incident-2026-11-25/bakery-customer-arrival-2026-11-26.json','cc57cfd62dfef7b8c0343f1545ce7d2fd250c4caab6095a8a98dca0bf3eaa816','bakery-customer-arrival','Corrected desktop arrival: no dialogue/action while walking, available after arrival; no answer or persistence replay on this build','2026-11-26')]},
 {id:'tingen-klein',title:'Tingen tent · Klein',pov:'Klein developer playthrough, separate life',relatedHref:'#world/lotm/places',
  where:'Start Klein’s developer life and buy bread. From the bakery, walk straight to market or keep the original tent route. After shopping, you can return to the tent at 08:40: finish the free reading before choosing Decline, then take the groceries home to unpack.',
  setup:'Shopping and the later tent return were checked from separate earned checkpoints. Original reading/Decline and paid-work receipts remain historical. This is not a whole-campaign replay; refunds after a completed sale were not tested.',
  outcome:'Bakery 07:06 → market 07:08 → purchase 07:13 → unpack 07:17. The sale reserves 16p; Stop before completion returns it. Completing leaves 0p and 16 loaves, mutton and vegetables. Purchase-state Save/reload and native file Export/Import passed. On the separate return, the reply stayed unavailable before the draw and after an interrupted reading. Completing the free reading opened Decline; it charged no fee and left the groceries ready to unpack. Historical receipts separately cover clarification and the 2p paid round.',
  receipts:[source('tingen-klein-index','lotm-tent-incident-2026-11-25/native-proof-index.json','9de120c2a838f43756ffa211def470335864448554d1ebc9d2a22ef52a245a0e','index','Earned opening, final reading/response and separate clean closure linked by exact checkpoint hashes'),source('tingen-klein-closure','lotm-tent-incident-2026-11-25/klein-paid-closure-0675/result.json','9f9e302aa54793ad3c10561342c15a5f0b50a0fa8e86697082bdc0e9a9e37a38','klein','Clean paid continuation exit0; final native persistence'),source('tingen-klein-direct-market','lotm-tent-incident-2026-11-25/market-direct-browser.json','61e7371c5690fe618ce169679f6b8f9e375467d8a91f8ecdea9d4db9e41170fe','market-direct','Direct shopping and unpacking, pre-completion refund and purchase-state persistence; tent return checked separately','2026-11-26'),source('tingen-klein-market-return','lotm-tent-incident-2026-11-25/market-return-browser.json','4944c85e2a7d189afff76708000c0d1fcdc002b97d9316eeb68f4772d24c357f','market-return','Groceries-first tent return: completed free reading opens Decline; groceries remain ready to unpack','2026-11-26')]},
 {id:'starting-insight',title:'+1 starting insight',pov:'Fresh ordinary and advantage beginnings',relatedHref:'#library/cheats/CTC21',
  where:'In OOPS, start a fresh game and choose Take +1 starting insight or Keep the ordinary beginning. Earn the faculty through the ordinary elder/sword/field route; use the faculty’s appraisal and recharge controls.',
  setup:'Matched fresh native games, same seed and wall clock; no injected inventory, insight or victory. Native clock stepping advances real fights.',
  outcome:'Both branches develop the same 3 facets. Ordinary insight reads 3 distinct carcasses; +1 permits a recharge and a fourth reading. Opening and used-state Save/reload/Export/Import passed.',
  receipts:[source('starting-insight','cheat-starting-insight-normal-2026-11-25/proof.json','07ee9f241b859848892e4c61328c7d3f5d4478b2c505505e66b4606a7e4098db','insight','Matched ordinary/+1 decisions and actual downstream appraisal consumer')]},
 {id:'loaded-dice',title:'Loaded Dice',pov:'Earned development and matched headless continuations',relatedHref:'#library/cheats/CTC64',
  where:'Start a fresh default game. Talk to the Village elder about leaving and starting gear, take and equip his sword, then fight in the Infested field. In All panels, open Continuing insight and Explore your continuing insight. Use Retain insight on ready milestones, then develop True Appraisal followed by Loaded Dice. Call LOW or HIGH before another fight, then process its pelt.',
  setup:'Ordinary native headless preparation earned the sword, fight, insights and first facet without an extra starting point. Desktop play then developed Loaded Dice and queued HIGH; it did not measure loot. Matched headless continuation checks passed, but the combined final source guard failed after unrelated edits. This is not a passed whole-run verification. Historical acquisition and held-card proofs remain separate.',
  outcome:'No-call/LOW/HIGH earned-save continuations produced pelt quality 75/70/80 after 26 fighting ticks apiece. Every pelt was scraps with 35 integrity; HIGH did not undo battle damage. Each call spent one reserve. The older held-card comparison separately checked browser persistence and rejected-write recovery.',
  receipts:[source('loaded-dice-acquisition','cheat-starting-insight-normal-2026-11-25/ordinary-proof.json','0eb8cd43ba22a706478a1e54b397290b40b0a37fdc5477bf6cc3d3d26370a1d6','dice-acquisition','Ordinary fresh beginning: earned insight and developed the first three facets, including Loaded Dice; no extra starting point'),source('loaded-dice','cheat-loaded-dice-normal-2026-11-25/proof.json','7f5cd530d7d9b87b2d86410b7e93b62d7d61e67e87c7743cc60a2b3e4f7facbe','dice','Ordinary/low/high actual combat→owned graded pelt; held-card fixture, separate from acquisition'),source('loaded-dice-earned-development','cheat-loaded-dice-normal-2026-11-25/ordinary-acquisition-2026-11-26.json','f49d56e530c64b5255c1afa1486864f8b0bfa8568c2eca5586378896b3548889','dice-earned-development','Native headless earned preparation; desktop development and queued HIGH, without a measured loot outcome','2026-11-26'),source('loaded-dice-earned-consumption','cheat-loaded-dice-normal-2026-11-25/earned-consumption-2026-11-26.json','3472d3b0d1a7c932dd5f3542e5d525e008e4b6d10ec06c071b5f2ac4c41263b7','dice-earned-consumption','Matched native-headless case assertions passed; combined run exit1 at whole-tree source guard. Actual headless bundle, not browser acceptance or reload/import acceptance','2026-11-26')]}
];
// A receipt supports this action only. Other receipts on the card can cover
// persistence, setup or neighbouring branches without establishing play.
const playedRoutes = {
 'taylor-backpack-bus':['taylor-bus-fresh','Taylor Hebert','Collect the backpack and ride toward home'],
 'farm-courtyard':['farm-desktop','Ordinary Village life','Host Bram with Mira’s stored grain'],
 'su-xiao-recruitment':['paradise-opening','Su Xiao','Sign, receive treatment and open the trial panel'],
 'village-watch-relay':['village-watch-relay','Ordinary Village life','Patrol and complete the watch relay'],
 'tingen-local':['tingen-local-bakery-notice','Local Tingen life','Post the bakery notice after collecting a spare'],
 'tingen-klein':['tingen-klein-closure','Klein Moretti','Complete the earned tent reading and response'],
 'starting-insight':['starting-insight','Ordinary Village life','Take starting insight, develop facets and appraise a carcass'],
 'loaded-dice':['loaded-dice','Frontier dice holder','Arm a LOW or HIGH call and consume it on a native loot draw'],
};
const authoredReplays = {
 'alden-bedside-choice':{id:'alden-signed-off-record',life:'Alden Thorn',action:'Listen, ask who has come, and refuse the visit',
  build:'c7a58589ddac5f9aaba9b0c1c365dcd20f3f5a926c06c168c14cb13139fb4f76',
  markers:['coordinator played the real Beginning entry','refuse left Hannah downstairs']},
 'ryan-wyvern-visit':{id:'ryan-combined-record',life:'Ryan Romano',action:'Earn the delivery and continue through the private, no-card branch',
  build:'b9d9d7572f628b9d34cafce3ed3a2003e12d966dd195f71db3a3130ef28c5989',
  markers:['identical to the proved candidate','Fresh native life earned the opening','private/no-card branch']},
};

function earnedConsumptionMatches(r){
 if(r.schema!=='loaded-dice-earned-consumption/1'||r.status!=='native-headless-case-assertions-passed-combined-end-input-guard-rejected'||r.browserUsed!==false||
  r.normalBundleSha256!=='db58757be1df194ac5193c357d176c71eec4f235ff831065038d8913342b57a1')return false;
 const q=r.sourceQualifications,files=['main','enemies','harvest','native_resources_domain','seeded_streams','cheat_cards','cheat_mechanisms','cheat_definitions','cheat_loaded_dice','cheat_host','cheat_ui'].map(x=>'src/'+x+'.js');
 if(!Array.isArray(q?.relevantSourcesUnchanged)||q.relevantSourcesUnchanged.length!==files.length||!files.every(file=>q.relevantSourcesUnchanged.some(x=>x.file===file&&isHash(x.sha256))))return false;
 if(!Array.isArray(q.mappedSourceDriftAtStart)||q.mappedSourceDriftAtStart.length!==1||q.mappedSourceDriftAtStart[0].file!=='src/audit_remainder_facts.js')return false;
 const drift=['perspective_controls','lotm_tent_incident','lotm_circus_notice','book_world_lotm_ui'].map(x=>'src/'+x+'.js');
 if(!Array.isArray(q.sourceDriftObservedAfterRun)||q.sourceDriftObservedAfterRun.length!==4||!drift.every(file=>q.sourceDriftObservedAfterRun.some(x=>x.file===file)))return false;
 if(!Array.isArray(r.results)||r.results.length!==3)return false;
 const normal=r.results.find(x=>x.direction==='ordinary');
 return ['ordinary','low','high'].every(direction=>{
  const x=r.results.find(row=>row.direction===direction),called=direction!=='ordinary';
  return x&&x.sourceInputSha256===(direction==='high'?'f62c051e562a46aedc420ebb2a094810c49f80054ae8ef45f75260a51984ff2e':'a9742de4f47a4b02a51b6833d1cf44f70d4cc75f8cc190c36feb6abaec6203ce')&&
   x.firstDecision?.key===normal?.firstDecision?.key&&typeof x.firstDecision.key==='string'&&x.firstDecision.key.endsWith(':specimen')&&
   x.firstDecision.draw===(direction==='high'?0xffffffff/0x100000000:direction==='low'?0:0.45699055143631995)&&
   x.firstDecision.original===(called?normal.firstDecision.draw:null)&&x.firstDecision.via===(called?'loaded-dice':null)&&
   x.fightTicks===26&&x.startClock===42&&x.consumptionClock===83&&x.endClock===100&&x.skill===0&&x.tool===50&&
   x.output?.part==='pelt'&&x.output.count===1&&x.output.quality===({ordinary:75,low:70,high:80})[direction]&&x.output.completeness==='scraps'&&x.output.integrity===35&&
   x.charges?.charges===(called?1:2)&&x.charges.used===(called?1:0)&&x.charges.recharged===0&&x.moneyDelta===0&&empty(x.errors)&&
   isHash(x.measurementSha256)&&isHash(x.saveSha256)&&isHash(x.exportSha256);
 });
}
function testedBundle(r,format){
 const h=format==='farm-native'?r.executedNativeBundle:format==='paradise-continuity'?r.candidateBundleSha256:format==='index'?r.kleinCleanClosure?.testedBundleSha256:format==='dice-earned-consumption'?r.headlessInitialBundleSha256:r.bundleSha256;
 if(!isHash(h))throw Error('Unrecognized bundle');
 if(['village','insight','dice'].includes(format)&&!empty(r.errors))throw Error('Proof errors');
 if(['insight','dice'].includes(format)&&!(r.ok===true&&r.servedBundleSha256===h&&Array.isArray(r.results)))throw Error('Unrecognized proof');
 if(format==='village'&&!(Array.isArray(r.checks)&&r.checks.length>=6&&r.final?.life?.parcelStep===3))throw Error('Unrecognized Village proof');
 if(format==='dice-earned-consumption'&&!(h==='df6cfe6cfb58ba0ce6d598910f98cf906d1c8f476ceaf3c5913c724d52c1709f'&&earnedConsumptionMatches(r)))throw Error('Unrecognized scoped earned consumption');
 if(format==='dice-acquisition'&&!(r.ok===true&&empty(r.errors)&&
  h==='b691073af3c1a5a3c1ccf49171c4d97175873f992e4b7d00e8d6b1c05eca9d2a'&&
  r.result?.choice==='ordinary'&&r.result.earnedBeforeSpending===3&&r.result.facets===3&&
  Array.isArray(r.result.claimedMilestones)&&r.result.claimedMilestones.length===3&&
  r.result.ordinaryElderSword===true&&r.result.actualFieldFightTicks===65&&r.result.recharges===0&&
  r.result.distinctNativeCarcassReadings===3&&r.result.openingAndUsedSaveReloadExportFreshImport===true))throw Error('Unrecognized ordinary acquisition');
 if(format==='dice-earned-development'&&!(r.schema==='ordinary-loaded-dice-acquisition/1'&&
  h==='efcf175d46efe11d641dfa8025dffd86bb271a0e2e7238090663f98b0266df54'&&
  r.inputSaveSha256==='a9742de4f47a4b02a51b6833d1cf44f70d4cc75f8cc190c36feb6abaec6203ce'&&
  r.exportSha256==='f62c051e562a46aedc420ebb2a094810c49f80054ae8ef45f75260a51984ff2e'&&
  r.viewport?.[0]===1920&&r.viewport[1]===1080&&r.browser?.clock===42&&r.browser.unspentBefore===1&&r.browser.unspentAfter===0&&
  r.browser.card==='loaded-dice'&&r.browser.direction==='high'&&r.browser.chargesRemaining===1&&r.browser.chargesUsed===1&&
  r.browser.pendingValue===0xffffffff/0x100000000&&(r.errors===undefined||empty(r.errors))))throw Error('Unrecognized earned development');
 if(format==='local'&&!(r.schema==='lotm-tent-browser-partial/1'&&r.status==='local-passed-klein-ui-blocked'&&r.browserExit===1&&Array.isArray(r.local?.checks)))throw Error('Unrecognized partial scope');
 if(format==='index'&&!(r.schema==='lotm-tent-native-proof-index/1'&&r.kleinCleanClosure?.exit===0&&r.kleinCleanClosure?.kept==='Save/reload and literal native Export/Import'))throw Error('Unrecognized index');
 if(['boundaries','klein'].includes(format)&&!(r.status==='agent-verified-not-human-reviewed'&&empty(r.pageErrors)&&Array.isArray(r.servedBundleSha256)&&r.servedBundleSha256.length===1&&r.servedBundleSha256[0]===h))throw Error('Unrecognized served proof');
 if(format==='boundaries'&&!['exact-close','actual-hour-elsewhere'].every(kind=>r.branches?.some(b=>b.kind===kind&&b.unobserved===true)))throw Error('Missing boundary');
 if(format==='klein'&&!(r.mode==='klein'&&r.checks?.includes('Klein paid round Save/reload and literal native Export/Import')))throw Error('Unrecognized Klein closure');
 if(format==='market-direct'&&!(r.schema==='lotm-market-direct-browser/1'&&r.date==='2026-11-26'&&
  h==='c3b5b3dbdb71ab16e9d6577d997aef43343be902b3a0f32a087c513f83d5733e'&&
  r.postBreadSha256==='816cafec0ad62c54bf26af2b1a69352b29d2634cffa8f2dc100cc0f01b94f2b3'&&isHash(r.exportSha256)&&r.marketMinute===428&&r.purchaseMinute===433&&r.unpackMinute===437&&
  r.moneyBefore===16&&r.moneyReserved===16&&r.moneyRefunded===16&&r.moneyAfter===0&&
  r.stock?.loaves===16&&r.stock.muttonLb===1&&r.stock.vegetableBundles===1&&r.directPurchases===1&&
  r.readingCompletions===0&&empty(r.newCastKnowledge)&&r.saveReload===true&&r.fileExportImport===true&&
  r.afterUnpacking==='Prepare the invocations'&&(r.errors===undefined||empty(r.errors))))throw Error('Unrecognized direct-market scope');
 if(format==='market-return'&&!(r.schema==='lotm-market-return-browser/1'&&r.date==='2026-11-26'&&
  h==='ab3094e7e5684929fa0951142b856d184335acb186eb3ce5942358ea072bd300'&&
  r.checkpointSha256==='67aff563ebd4003ead68711d926314cba7ac17f9f73a9a495061948316904ba6'&&
  r.startMinute===519&&r.openingMinute===520&&r.firstReadingStoppedMinute===521&&r.readingCompletedMinute===526&&r.replyCompletedMinute===528&&
  r.replyBeforeDraw===false&&r.replyAfterInterruptedReading===false&&r.replyAfterCompletedReading===true&&r.paidFee===0&&
  r.nextHouseholdTask==='Unpack the shopping at home'&&(r.errors===undefined||empty(r.errors))))throw Error('Unrecognized market-return scope');
 if(format==='bakery-notice'&&!(r.schema==='lotm-circus-notice-browser/1'&&r.date==='2026-11-26'&&
  h==='efcf175d46efe11d641dfa8025dffd86bb271a0e2e7238090663f98b0266df54'&&
  r.paidStartSha256==='89bd5ac6708a9cc691d2c4cef853bf0c28975c2e52c2d9563c066180927ef58d'&&
  r.independentStartSha256==='32f8ff953ab080ef2dabdd75e2a8fb16650cbbfcb683ffb37b30a657cf5ee6cc'&&isHash(r.exportSha256)&&
  r.paidRoute?.spareMinute===1982&&r.paidRoute.bakeryMinute===1984&&r.paidRoute.stoppedBeforePosting===true&&r.paidRoute.postedMinute===1987&&
  r.paidRoute.sparesCollected===1&&r.paidRoute.displayed===1&&r.paidRoute.loosePaper===0&&r.paidRoute.purseBefore===482&&r.paidRoute.purseAfter===482&&
  r.independentRoute?.startMinute===520&&r.independentRoute.arriveMinute===522&&r.independentRoute.visitCompletedMinute===524&&r.independentRoute.postingOffered===false&&
  r.windowAfterReload===true&&r.windowAfterNativeImport===true&&(r.errors===undefined||empty(r.errors))))throw Error('Unrecognized bakery-notice scope');
 if(format==='bakery-customer-observations'&&!(r.schema==='lotm-bakery-customer-observations/1'&&r.date==='2026-11-26'&&
  r.status==='coordinator-observed-not-human-reviewed'&&r.method==='built-in-desktop'&&h==='5b3851783584e7e701ad867d680b9337868bb8dbba01de6499ce39b79f2fa6b0'&&
  r.inputMetadataSha256?.earned==='fd97bf39bcd811a90f1dc13ab1ca6dfc4e52d92d537140bdc0e5d037f3f713c1'&&r.inputMetadataSha256.square==='81a06a1003e5bc31f0af19b81fb8bf45df0f039dde8bfa9839615f9f95b7d66a'&&
  r.present?.inputSha256==='5c335c381a55c70223c6a49fd9fa43517ae927163b15e965748694ba3ebc9377'&&r.present.startMinute===554&&r.present.arrivalMinute===555&&r.present.arrivalWithoutDialogueSelection===true&&r.present.shownDepartureMinute===565&&r.present.answerMinute===556&&r.present.changedScene===true&&r.present.directionsActionsAfterAnswer===0&&
  r.present.saveReload?.clock===true&&r.present.saveReload.changedScene===true&&r.present.saveReload.spentActionAbsent===true&&
  r.away?.comparison==='separate-earned-lives-with-different-prior-jobs'&&r.away.playerAbsentAtReading===true&&
  r.away.posted?.inputSha256==='eb34fba9216d4887569baae27f80cd5d18434708fded9b8286dc4e3c9030c176'&&r.away.posted.startMinute===565&&r.away.posted.remainingWalkMinutes===1&&r.away.posted.customerReportedNotice===true&&r.away.posted.walkCompletedMinute===566&&r.away.posted.answerMinute===567&&r.away.posted.changedScene===true&&r.away.posted.directionsActionsAfterAnswer===0&&
  r.away.unposted?.inputSha256==='0d32bf8b7e31c18b7b4a175e9354f2b378f0f7ea41d7c5a0dcedd399157dc05a'&&r.away.unposted.startMinute===565&&r.away.unposted.remainingWalkMinutes===1&&r.away.unposted.breadErrandPresent===true&&r.away.unposted.shownDepartureMinute===600&&r.away.unposted.circusQuestion===false&&r.away.unposted.directionsAction===false&&
  r.controlledRegression?.kind==='same-state-native-regression'&&r.controlledRegression.separateFromBrowserLives===true&&r.controlledRegression.physicalPaperCondition===true&&r.controlledRegression.noInventedPastWitness===true&&
  r.limitations?.preArrivalOfferTimingVerified===false&&r.limitations.customerNativeImportVerified===false&&r.limitations.wholeCampaignReplay===false))throw Error('Unrecognized bakery-customer observations');
 if(format==='bakery-customer-arrival'&&!(r.schema==='lotm-bakery-customer-arrival/1'&&r.date==='2026-11-26'&&r.status==='coordinator-observed-not-human-reviewed'&&r.method==='built-in-desktop'&&
  h==='5880e9e702fd5392eac9b7a80cd4f592d13d273efcb920cad21c510addd02617'&&r.inputSha256==='eb34fba9216d4887569baae27f80cd5d18434708fded9b8286dc4e3c9030c176'&&
  r.before?.day===2&&r.before.minute===565&&r.before.remainingWalkMinutes===1&&r.before.edwinDialogue===false&&r.before.directionsActions===0&&
  r.advance?.kind==='native-tick'&&r.advance.minutes===1&&r.after?.day===2&&r.after.minute===566&&r.after.remainingWalkMinutes===0&&r.after.customerReportsBakeryNotice===true&&r.after.shownDepartureMinute===600&&r.after.directionsActions===1&&
  r.controlledRegression?.coordinatorReportedPassed===13&&r.controlledRegression.witnessWithheldDuringWalk===true&&r.controlledRegression.independentCustomerReadingContinues===true&&
  r.limitations?.answerReplayed===false&&r.limitations.persistenceReplayed===false))throw Error('Unrecognized customer arrival boundary');
 if(format==='farm-native'&&!(h==='7bfb24cde35027e515ea30a019f975ef5bd4e78bc1fe3b8c96709011a6894cec'&&r.browserUsed===false&&r.normalBundleExecuted===false&&empty(r.sourceDrift)&&r.results?.length===5&&['manual','reserve-holds','cancel-booking','old-carry','custodian-away'].every(mode=>r.results.some(x=>x.mode===mode&&empty(x.errors)))&&r.results.find(x=>x.mode==='manual')?.playerGrain===4&&r.results.find(x=>x.mode==='manual')?.cash===99&&r.results.find(x=>x.mode==='manual')?.BramCoins===195&&r.results.find(x=>x.mode==='custodian-away')?.MiraGrain===1))throw Error('Unrecognized farm native replay');
 if(format==='farm-desktop'&&!(h==='71d4c2541833e955e0be8b5986c1c14229c0567f155f67f9a725a4372dec2c40'&&r.status==='desktop host/payment acceptance passed; coordinator observed'&&r.viewport?.width===1280&&r.viewport.height===720&&r.setup?.outcomeEdited===false&&r.setup.privateSnapshotSha256==='0f74634216f80e04ea95ea3a87c17130ae028c519251bc844bdeebaa05efec99'&&r.observations?.length===3&&r.observations[2].visible==='No pending job; balance9C9W; Meal finished. Keep 4 grain for the household until you clear this order.'))throw Error('Unrecognized farm desktop replay');
 if(format==='paradise-opening'&&!(h==='7bfb24cde35027e515ea30a019f975ef5bd4e78bc1fe3b8c96709011a6894cec'&&r.schema==='paradise-opening-native/1'&&r.observed?.sameBody===true&&r.observed.woundsClosedAfterTreatment===true&&r.observed.trialIssuedAt===0&&r.observed.clock===2&&r.observed.deadline===4320&&r.observed.remainingMinutes===4318&&r.observed.trialRead===true&&r.observed.personalRead===true&&r.observed.separateContractorState===true&&r.observed.noCompletedMissionClaim===true&&r.persistence?.saveReloadDuringRecruitment===true&&r.persistence.saveReloadAfterPanels===true&&r.persistence.literalExportImport===true))throw Error('Unrecognized recruitment opening');
 if(format==='paradise-continuity'&&!(h==='12d9760f32ceb47f1c15e040587350b892192baad778bb4112eea664913b2cc3'&&r.schema==='paradise-copy-desktop/1'&&r.status==='Coordinator desktop PASS'&&r.input?.sha256==='20ee37ba43892fb22719bccbe1fe001c4dd59ea67e1937ec5ce7a1179af4a18a'&&r.observed?.length===3&&r.observed[0]==='PLAY reopened the actual Gray Terminal house'&&r.observed[2]==='Trial retained issue minute0 and continued counting down'))throw Error('Unrecognized recruitment desktop continuity');
 if(format==='taylor-bus-fresh'&&!(h==='6cd80403907c3c913edcf3c85c02dc0e917b5a0a2e9dc2e922c2f5b7d6ef1b69'&&empty(r.errors)&&r.setup==='Ordinary fresh Village entry; no edited save or fixture'&&r.steps?.length===3&&r.steps[0].includes('one neutral backpack collected in washroom')&&r.steps[2]==='Native Save/reload and Export/Import retain one bag, observed contents and earlier dispersal'))throw Error('Unrecognized fresh Taylor bus proof');
 if(format==='taylor-bus-earned'&&!(h==='6cd80403907c3c913edcf3c85c02dc0e917b5a0a2e9dc2e922c2f5b7d6ef1b69'&&empty(r.errors)&&r.inputSha256==='ef11bffa5f5f536cf3b77e6aeb5f4be6e65493e1f8d920665f8bf97fbe305dba'&&r.setup==='Unedited real earned corridor export'&&r.steps?.length===3&&r.steps[0].includes('without it; no notebook observation')&&r.steps[2].includes('cancellation reveals nothing')&&r.results?.bagCount===1&&r.results.swarm==='book.worm.lead.washroom'&&r.results.inspectionKnown===true&&r.results.moneyUnchanged===true))throw Error('Unrecognized earned Taylor bus proof');
 return h;
}
export async function loadNativePlayEvidence(root,{cards=NATIVE_EVIDENCE_CARDS}={}){
 let currentBundleSha256=null;
 try {const h=createHash('sha256');for await(const b of createReadStream(join(root,'dist/bundle.js')))h.update(b);currentBundleSha256=h.digest('hex');}catch{}
 const entries=[];
 for(const card of cards){
  const receipts=[];
  for(const definition of card.receipts){
   const base={id:definition.id,expectedSha256:definition.fingerprint,scope:definition.scope,evidenceDate:definition.evidenceDate??'2026-11-25'};
   try{
    if((await stat(join(root,definition.path))).size>65536)throw Error('Receipt too large');
    const bytes=await readFile(join(root,definition.path)),actualSha256=receiptHash(bytes,definition.fingerprint);
    if(actualSha256!==definition.fingerprint){receipts.push({...base,status:'changed',actualSha256,buildComparison:'unavailable'});continue;}
    const testedBundleSha256=testedBundle(JSON.parse(bytes),definition.format);
    receipts.push({...base,status:'verified',actualSha256,testedBundleSha256,buildComparison:!currentBundleSha256?'unavailable':testedBundleSha256===currentBundleSha256?'exact':'different'});
   }catch{receipts.push({...base,status:'unavailable',buildComparison:'unavailable'});}
  }
  const references=[];
  let authoredReplay;
  for(const reference of card.references||[]){
   const base={id:reference.id,label:reference.label,href:reference.href,scope:reference.scope,expectedSha256:reference.fingerprint};
   try{
    if((await stat(join(root,reference.path))).size>65536)throw Error('Record too large');
    const bytes=await readFile(join(root,reference.path)),actualSha256=receiptHash(bytes,reference.fingerprint);
    const matched=actualSha256===reference.fingerprint;
    references.push({...base,actualSha256,status:matched?'verified':'changed'});
    const spec=authoredReplays[card.id];
    if(matched&&spec?.id===reference.id){
     const record=bytes.toString('utf8');
     if([spec.build,...spec.markers].every(marker=>record.includes(marker))){
      const {id,life,action,build}=spec;
      authoredReplay={id,life,action,build};
     }
    }
   }catch{references.push({...base,status:'unavailable'});}
  }
  const referencesVerified=references.every(x=>x.status==='verified');
  const verified=referencesVerified&&receipts.every(r=>r.status==='verified');
  const [receiptId,life,action]=playedRoutes[card.id]||[];
  const receipt=receipts.find(row=>row.id===receiptId&&row.status==='verified');
  const exercised=authoredReplay||(receipt&&{id:receiptId,life,action,build:receipt.testedBundleSha256});
  const gap=card.id==='fang-first-night'?'The aggregate first-night card needs matching breakfast and half-stone receipts.':
   card.id==='taylor-backpack-bus'?'The fresh and earned backpack replay files need their pinned identity and action scope confirmed.':
    'The named native replay could not be verified for this route.';
  entries.push({id:card.id,title:card.title,pov:card.pov,relatedHref:card.relatedHref,where:card.where,setup:card.setup,outcome:verified?card.outcome:null,status:verified?(card.evidenceKind==='authored-record'?'documented':'verified'):'unavailable',
   ...playStatus({receipt:verified?exercised:null,gap}),receipts,...(card.evidenceKind?{evidenceKind:card.evidenceKind}:{}),...(references.length?{references}:{})});
 }
 return {schema:'atlas-native-play-evidence/1',currentBundleSha256,entries};
}

// These two endpoints expose the public projection, never the underlying Markdown.
export async function loadNativePlayRecord(root,pathname){
 const id=({'/native-play-record/taylor':'taylor-backpack-bus','/native-play-record/alden':'alden-bedside-choice','/native-play-record/ryan':'ryan-wyvern-visit','/native-play-record/fang':'fang-first-night'})[pathname];
 if(!id)return null;
 const report=await loadNativePlayEvidence(root),entry=report.entries.find(x=>x.id===id);
 return entry?{schema:'atlas-native-play-record/1',...entry}:null;
}

// One exact public proof, projected for human reading. Input fingerprints and
// unrecognized fields are deliberately not part of this HTTP payload.
export async function loadPaidInnEvidence(root){
 const base={schema:'atlas-paid-inn-evidence/1',title:'Fang Yuan · paid inn evidence',backHref:'#workbench/play-evidence/fang-first-night'};
 const ref=NATIVE_EVIDENCE_CARDS.find(c=>c.id==='fang-first-night').references.find(r=>r.id==='fang-paid-inn');
 try{
  const path=join(root,ref.path);if((await stat(path)).size>65536)throw Error();
  const bytes=await readFile(path);if(receiptHash(bytes,ref.fingerprint)!==ref.fingerprint)throw Error();
  const p=JSON.parse(bytes),names={buy_wine:'Buy green bamboo wine',lure:'Lure the worm',follow:'Follow it',take_worm:'Take the worm',search_crevice:'Search the crevice',return_inn:'Return to the inn',first_night:'Finish the first-night working'},places={grove:'Grove',crevice:'Crevice',inn:'Paid inn'};
  if(p.schema!=='fang-yuan-paid-room/1'||p.testedBundle!=='8751c15de722c1deff382507b29c841ed535f6df4772d1048f7e14c70ebc423f'||!empty(p.errors)||p.ordinaryRoute?.length!==7||p.sleepAndBreakfast?.length!==2)throw Error();
  return {...base,status:'verified',...playStatus({receipt:{id:ref.id,life:'Fang Yuan',action:'Sleep and wake in the already-paid inn room',build:p.testedBundle}}),testedBundleSha256:p.testedBundle,evidenceSha256:ref.fingerprint,scope:p.scope,
   desktop:{viewport:[...p.desktop.viewport],summary:p.desktop.route},persistence:p.restoration,
   route:p.ordinaryRoute.map(r=>({action:names[r.action],place:places[r.scene],essence:r.essence,untouchedStones:r.untouchedStones})),
   savedRoute:p.sleepAndBreakfast.map((r,i)=>({action:i?'Continue to breakfast':'Sleep, restore and wake',essence:r.essence,untouchedStones:r.stones,priorWorkKept:r.worked===1,breakfastHappened:r.brother===1}))};
 }catch{return {...base,status:'unavailable',...playStatus({gap:'A matching paid-room sleep and wake receipt is needed.'})};}
}

async function loadBreakfastStoneEvidence(root){
 const ref=NATIVE_EVIDENCE_CARDS.find(c=>c.id==='fang-first-night').references.find(r=>r.id==='fang-half-stone');
 try{
  const path=join(root,ref.path);if((await stat(path)).size>65536)throw Error();const bytes=await readFile(path);if(receiptHash(bytes,ref.fingerprint)!==ref.fingerprint)throw Error();const p=JSON.parse(bytes);
  if(p.schema!=='fang-yuan-half-stone/1'||p.authoredCharge!==15||p.olderAcceptedSave?.status!=='passed')throw Error();
  return {status:'verified',authoredParts:p.authoredCharge,evidenceSha256:ref.fingerprint,
   desktop:{bundleSha256:p.desktop.build,before:p.desktop.reserveBefore,after:p.desktop.reserveAfter,whole:p.desktop.otherWholeStones,remaining:p.desktop.remainingPartsShown},
   nearCapacity:{bundleSha256:p.nearCapacity.nativeBundle,before:p.nearCapacity.start.sea,after:p.nearCapacity.outcome.after.sea,carrierKept:p.nearCapacity.outcome.after.remainder===1,cancelRestored:p.nearCapacity.outcome.cancelledAndRestored},
   refusedUnavailable:p.refusal.outcome.unavailable,
   older:{before:p.olderAcceptedSave.start.reserve,after:p.olderAcceptedSave.end.reserve,naturalParts:p.olderAcceptedSave.naturalPartsDuringDraw,whole:p.olderAcceptedSave.end.whole,pending:p.olderAcceptedSave.pendingSaveReloadImport,final:p.olderAcceptedSave.finalSaveReloadImport}};
 }catch{return {status:'unavailable'};}
}
async function readFangReceipt(root, filename, fingerprint) {
 const path = join(root, 'docs/representations/evidence/fang-yuan-first-night-2026-11-26', filename);
 try {
  if ((await stat(path)).size > 65536) return null;
  const bytes = await readFile(path);
  return receiptHash(bytes,fingerprint) === fingerprint ? JSON.parse(bytes) : null;
 } catch { return null; }
}
export async function loadBreakfastEvidence(root){
 const base={schema:'atlas-breakfast-evidence/1',title:'Fang Yuan · breakfast choices',backHref:'#workbench/play-evidence/fang-first-night'};
 const ref=NATIVE_EVIDENCE_CARDS.find(c=>c.id==='fang-first-night').references.find(r=>r.id==='fang-breakfast');
 try{
  const path=join(root,ref.path);if((await stat(path)).size>65536)throw Error();const bytes=await readFile(path);if(receiptHash(bytes,ref.fingerprint)!==ref.fingerprint)throw Error();
  const p=JSON.parse(bytes);if(p.schema!=='fang-yuan-breakfast/1'||p.status!=='passed'||!isHash(p.nativeBundle)||!isHash(p.desktop?.webBundle)||p.previouslyPaid?.status!=='passed')throw Error();
  const time=r=>'Day '+r.date.day_count+' · '+String(r.date.hour).padStart(2,'0')+':'+String(r.date.minute).padStart(2,'0');
  const [selection, purchase] = await Promise.all([
   readFangReceipt(root, 'individual-stone-desktop.json', '2fcd5e7ac6445a9a2e1bd1fd7f616e35c1b824b5b532bdf35c8d06a13f121d7f'),
   readFangReceipt(root, 'breakfast-wine.json', 'b369d2b09a263a048d2b16c14c104bf4dc530b1beb11e7ac8669691e01dbd9b8')
  ]);
  return {...base,status:'verified',...playStatus({receipt:{id:ref.id,life:'Fang Yuan',action:'Hear the breakfast offer and accept or refuse the pouch',build:p.nativeBundle}}),
   selection:selection && {charges:selection.input.charges, before:selection.selectedPiece.before, after:selection.selectedPiece.after, keptSelection:selection.selectedPiece.persistedSelection, whole:selection.wholeStones},
   purchases:purchase?.cases.map(row=>({branch:row.branch,whole:row.after.whole,minutes:row.after.minute-row.before.minute,grove:row.lureAvailable})) ?? [],
   stone:await loadBreakfastStoneEvidence(root),evidenceSha256:ref.fingerprint,nativeBundleSha256:p.nativeBundle,desktopBundleSha256:p.desktop.webBundle,
   morning:{time:time(p.morning),whole:p.morning.whole,half:p.morning.half},offer:{time:time(p.offered),whole:p.offered.whole,half:p.offered.half},
   choices:['refuse','accept'].map(key=>({choice:key==='accept'?'Take the pouch':'Push the pouch back',whole:p.outcomes[key].whole,half:p.outcomes[key].half,brotherWhole:p.outcomes[key].brotherWhole,brotherHalf:p.outcomes[key].brotherHalf,noWormWork:p.outcomes[key].work===0})),
   desktop:{viewport:[...p.desktop.viewport],setup:p.desktop.setup,observed:p.desktop.observed},
   compatibility:{bundleSha256:p.previouslyPaid.nativeBundle,whole:p.previouslyPaid.baseline.whole,half:p.previouslyPaid.baseline.half,workKept:p.previouslyPaid.baseline.worked===1,noSecondOffer:p.previouslyPaid.baseline.visitor===false&&p.previouslyPaid.baseline.newEncounter===false,nextRefinement:p.previouslyPaid.continued==='book.ri.lead.vital.press_again'},
   source:{edition:'Held English EPUB, Calibre 15',epubSha256:'bb27766e61f651546386e5ae4ccaee41ec64ea148a771d156f0a55532906d6f5',reviewedCheckpointSha256:'2f28c31dee88ec37c29f482c27ffc9c765817073a74b1dc19b47ccb4e80e4a9c',
    method:'The checkpoint records a direct EPUB check matching the prepared paragraphs. This Atlas page reuses that qualification; it does not reread the raw book.',
    findings:[{locator:'English ch17 paragraphs56–61',text:'Fang Yuan orders breakfast downstairs before Fang Zheng arrives.'},{locator:'English ch18 paragraphs2 and6',text:'Fang Zheng describes comforting Shen Cui. She is absent from this conversation.'},{locator:'English ch18 paragraphs23 and31–35; paragraph45',text:'Six stones were asked for; the actual pouch held five whole stones and one half-sized, partly depleted piece. The retained balance is separately recorded.'},{locator:'English ch18 paragraphs47–52',text:'Fang Zheng later reports the exchange to his uncle, who promises reimbursement. This encounter does not deliver that later payment.'}],
    authored:'Hearing the conversation and pushing the pouch back are authored alternatives. Neither answer transfers Shen Cui or delivers the uncle’s later reimbursement. This breakfast source check is separate from the chapter10 qualification on the main card.'}};
 }catch{return {...base,status:'unavailable',...playStatus({gap:'The breakfast choices need a matching pinned native receipt.'})};}
}
