// Reviewed public owners. Fingerprints bind defining evidence, not unrelated document appendices.
const checkpoint='docs/gm/dispatch/cross-world-systems-2026-11-07/CHECKPOINT.md';
const lender='docs/gm/dispatch/procedural-crafting-2026-11-11/LOTM_LENDER_RELEASE_2026-11-25.md';
const light='docs/worlds/mother-of-learning/LIGHT_FORMULA_CORRECTION_2026-11-25.md';
const lenderEvidence=(marker,sha256)=>({path:lender,heading:"The response charm and Old Neil's later assurance",marker,sha256});
const lightEvidence=(marker,sha256)=>({path:light,heading:'Receipt',marker,sha256});
export const CAMPAIGN_TRACKS=[{
 world:'lotm',protagonist:'Klein Moretti',reviewedAt:'2026-11-25',
 historicalChain:'docs/representations/evidence/lotm-earned-frontier-2026-11-25/historical-chain.json',
 historicalOwner:'docs/research/LOTM_EARNED_FRONTIER_AUDIT_2026-11-25.md',
 localSegments:[{episode:'KJ3BB',actions:21,entryLabel:'original earned BA checkpoint',scopePath:'docs/representations/evidence/lotm-earned-frontier-2026-11-25/current-full-bb-scope.json',proofPath:'docs/representations/evidence/lotm-earned-frontier-2026-11-25/current-full-bb.json'},
  {episode:'KJ3BC',actions:12,entryLabel:'newly earned BB checkpoint',follows:'KJ3BB',scopePath:'docs/representations/evidence/lotm-earned-frontier-2026-11-25/current-full-bc-scope.json',proofPath:'docs/representations/evidence/lotm-earned-frontier-2026-11-25/current-full-bc.json'}],
 connected:[],mechanics:[{
  label:'Independent lender-choice mechanic',reviewedAt:'2026-11-25',
  statement:'Chapter 130 response-charm choices were independently played on bundle 9a960b6694049fb0, with disclosed late-response prerequisites. Save/reload/export/import passed. The complete earned Klein journey was not verified by this fixture; it does not advance the connected frontier.',
  href:'#workbench/handoffs/4d1614c2ed8e24b134ba0e637d417faac6a01bd8f9875aa061af46501479cc03',
  evidence:[lenderEvidence('node tests/lotm_charm_response_browser.mjs','2fc72768db20206f7992693ce30af68ad0e33455fcd288912ab6cf61b3172204'),
   lenderEvidence('| Bounds |','b5ef246a5f38f12c66326650b69c6f1bad0d9820cabd0e6458c1969991ad1ea5'),
   lenderEvidence('| Choices and persistence |','2d9b55c014daab94045d85057223a9840837a0a8d2c3045eb8e4d73cdc4bf8cb')]
 }]
},{world:'mol',protagonist:'Zorian Kazinski',reviewedAt:'2026-11-25',connected:[{
 label:'Historical printed Arc 1 endpoint',reviewedAt:'2026-11-25',
 statement:'The November 9 receipt records printed chapter 26 P287 at mol-zorian-arc-one-end, with earned reset prerequisites and save/reload/export/import on historical bundle fd6768dd92e38ff0. Some interludes were compressed. This does not establish a current-build uninterrupted replay.',
 evidence:{path:checkpoint,heading:'Four arcs resumed, November 9, 2026',marker:'**Zorian’s Arc 1 endpoint verified.**',sha256:'1959e50cc43e91a38bfb1be2aecad8c509af37a14e13155454347879d19f91ec'}
 }],mechanics:[{
 label:'Independent worked light-formula correction',reviewedAt:'2026-11-25',
 statement:'A fresh Village → Zorian → Torch route independently tested the correction and its class-test revision consumer on bundle 0c175cd2e5fd713d. Save/reload/export/import passed; time was test-stepped and no setup grant was used. This local earned mechanic does not replay the whole printed Arc 1 campaign.',
 href:'/tracked-reading-evidence/mol',
 evidence:[lightEvidence('| FLR1 Build |','158fafebd99215512bc0c999b575a3b7b5e5f3f9242c8340124c36e89ce884c1'),
  lightEvidence('| FLR2 Route |','39d380fbbf6654280533a9d02d3f55e6746256f4df5e08e175154f8c340b7042'),
  lightEvidence('| FLR5 Kept |','47dc9f3b051c8a684bae94fa31900130a0ce94b308ad7dcbc239ac07c50a0da2')]
 }]}];
