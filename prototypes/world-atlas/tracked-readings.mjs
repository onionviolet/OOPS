// Curated, tracked source checks. Add entries from verified receipts; these never increment batch coverage.
// `findings` are source-grounded paraphrases. Proposed interactions stay in `proposals`.
export const TRACKED_READINGS = Object.freeze([{
    id: 'RA21', world: 'lotm', title: 'Unused charm maintenance', checkedAt: '2026-11-25',
    state: 'Agent-read, not human-reviewed', coverage: 'Selected Chinese passages, volume 1. Not three completed chapters or a whole-book read.',
    evidence: {file: 'docs/gm/dispatch/cross-world-systems-2026-11-07/READ_AHEAD_USE_2026-11-08.md',
        heading: 'RA21 · Unused charm maintenance, November 25, 2026',
        paragraphMethod: 'Paragraphs count nonempty XHTML paragraphs from 1, excluding the heading. Chapter 133 is identified by navigation and heading rather than its member filename.',
        sourceHash: '6126274478a95dbe03eb904bc35c409067c7022563e52997a46e98be07b2d70d'},
    findings: [{label: 'Stated practice', locators: ['zh 第127章 p25–p30'],
        text: 'Low-grade charms lose spirituality. The passage gives a two-week remaking practice and says colleagues seek Old Neil’s recharge for rarely used charms. It does not show a recharge taking place.'},
    {label: 'Read in context', locators: ['zh 第128章 p69–p71'],
        text: 'The purchase total concerns manufacturing materials. It does not establish a recharge fee or a fixed price for one recipe.'},
    {label: 'Shown Dream use', locators: ['zh 第133章 p17–p25', 'zh 第133章 p44–p47'],
        text: 'The selected Dream use includes activation and burning, followed by ash. This distinguishes maintaining an unused held charm from replacing spent stock; it does not freshly demonstrate a Slumber use.'},
    {label: 'Later creditor choice, stated', locators: ['zh 第130章 p30–p31'],
        text: 'After the loaned Slumber charm is burned, Neil tells Klein not to worry about it and plans to seek compensation from Swain later, considering his mood. This qualifies the earlier replacement condition. No third-party agreement, actual payment or collection is shown.'}],
    limits: ['The exact recharge procedure, fee and restored amount remain unqualified.',
        'The two-week practice does not establish a decay curve or effect duration.',
        'English paragraph locators were not freshly checked or aligned with these Chinese passages.'],
    authoredHeading: 'Authored interaction',
    proposals: [{status: 'Authored gameplay interpretation, not source observation',
        text: 'The implemented Slumber visit brings the same unused held charm to Old Neil. That visit and its procedure are authored; the source check does not show Klein making it.'}],
    gameStatus: 'Slumber-only upkeep is agent-verified in a named aged-charm workshop through normal game controls, save, reload, Export and Import. The same charm returns and later burns on use. The earned Klein journey and other charm variants are not covered by that proof.',
    runtimeTuning: 'Ten minutes, one spirituality, and the gradual five-to-two-minute sleep response over fourteen played days are authored gameplay dials. They are not a source-measured procedure, price, charge amount, decay curve or effect duration.',
    implementationReceipt: 'LOTM_CHARM_UPKEEP_2026-11-25.md',
    relatedWorkings: [{href: '#world/lotm/making/lotm.item.slumber-charm', label: 'Open Slumber making and use',
        status: 'Inscription, activation and Slumber-only upkeep are linked. Native upkeep has a named-fixture proof; broader recharge is unverified.'},
    {href: '#world/lotm/things/lotm.rule.lender-release-and-compensation-intent',label:'Open chapter130 lender-choice source record',
        status:'The source supports an individual lender assurance and a separate future compensation intention. Native continuation and voluntary release are agent-verified with the genuine restored cast and disclosed late-response prerequisites, including save/reload/import; the complete earned journey is unverified. Earlier ch129 reports predate this qualification.'}],
}, {
    id:'HP-D7-S1',world:'hp',title:'Instruction and an observed levitation',checkedAt:'2026-10-25',reviewedAt:'2026-11-25',
    state:'Earlier documented source evidence; receipt reviewed here, not freshly reread source text',
    coverage:'One selected novel window. This receipt contributes no batch rows. The Library measures the collected outputs separately.',
    evidence:{file:'docs/worlds/harry-potter/SOURCE_LEDGER.md',href:'/tracked-reading-evidence/hp',heading:'D7 bounded spell cases · HP-D7-S1',
        paragraphMethod:'The earlier source ledger uses B1 PDF pages 137–138, not newly aligned paragraph numbers. It records a selected window from the private seven-novel extraction.',
        sourceHash:'aa4e950432c809b14ce045b08bcb134b175afaa7102ce29f94d3f3229e45875e',
        reviewHash:'616fd6d814bc3264a644e495f7c5b8a93860b689f0ee533e8afcfa1ac0cca077'},
    findings:[{label:'Earlier ledger: shown in selected window',locators:['HP-D7-S1 · B1:PDF-p137–138'],
        text:'The documented window contains instruction in motion and pronunciation, unsuccessful attempts, and a feather rising.'}],
    limits:['The November 25 receipt review used the tracked ledger. It did not reread the raw novel or the extracted book.',
        'The feather case does not establish safe heavy loads, exact training time or universal success odds. The recorded hash identifies the earlier extracted book text, not a newly verified local file.'],
    authoredHeading:'Authored play method',proposals:[{status:'Existing authored application, not a novel event',
        text:'Harry’s library chart work applies learned Levitation or an ordinary ladder to a high-shelf book, then copies notes for assigned Astronomy homework. The shelf, task and timings are authored.'}],
    gameStatus:'The November 25 library-work receipt records rebuilt desktop and save/reload/import proof on a lesson-prepared, clock-advanced fixture. This Atlas review verifies the evidence display, not a fresh gameplay run or an earned Harry life.',
    implementationReceipt:'HARRY_LIBRARY_WORK_2026-11-25.md',implementationHref:'/activity-evidence/hp-library',
}, {
    id:'RI-RA9-FIRST-REFINEMENT',world:'ri',title:'An incomplete first refinement',checkedAt:'2026-11-09',reviewedAt:'2026-11-26',
    state:'Earlier documented source evidence; receipt reviewed here, not freshly reread source text',
    coverage:'One bounded opening-refinement claim from the tracked RA9/RA16 follow-up. This receipt contributes no batch rows. The Library measures the collected outputs separately.',
    evidence:{file:'docs/gm/dispatch/cross-world-systems-2026-11-07/READ_AHEAD_USE_2026-11-08.md',href:'/tracked-reading-evidence/ri',heading:'RA9 and RA16 follow-up · first refinement, November 9',
        paragraphMethod:'The earlier receipt binds prepared English volume 1 chapter 10 paragraphs 14–43. The world owner qualifies the supplied English compilation; original-edition alignment was not freshly checked.',
        reviewHash:'75ec7f5804545188a2f972e7558e3afee98bb5ae0b525b3c902061a1f8a32a54'},
    findings:[{label:'Earlier receipt: shown progress, with a stated estimate',locators:['en b1 c10 p14–p43'],
        text:'Fang Yuan holds the unrefined Gu and infuses essence while it resists. The documented half-hour attempt leaves partial refinement; after infusion stops the Gu expels essence. The six-hour loss horizon is his projection from the observed rate. Paragraphs 33–43 distinguish natural recovery at about four aperture points per hour from the faster drawing of essence from a held stone; that refill does not establish the stone’s total capacity.'}],
    limits:['The November 25 receipt review did not reread the raw chapter. The tracked follow-up supplies no source-file hash.',
        'The passage supplies no exact mid-attempt settlement schedule. The later, harder refinement failure described elsewhere is not imported into this opening attempt.'],
    authoredHeading:'Authored play method',proposals:[{status:'Recorded bounded runtime interpretation',
        text:'The existing lead refinement action reserves essence for an authored timed attempt and keeps the same Gu held and unrefined at settlement. Cancellation refunds the current reservation; that rule is distinct from the source’s post-attempt loss of progress.'}],
    gameStatus:'The November 9 follow-up reports 36 historical route tests. The linked current checkpoint records resisted infusion, the guardians’ house bed, early waking, going on below full essence and measured stone drawing. This Atlas display does not rerun that gameplay or claim a full Fang Yuan journey.',
    relatedWorkings:[{label:'Fang Yuan’s guardians’ house, resisted infusion and optional first-night bed',href:'#workbench/play-evidence/fang-first-night',status:'Current played-route scope, native/desktop checks and authored alternatives are kept with that card; prepared source is not freshly reread here.'}],
}, {
    id:'MOL-C002-METHODS',world:'mol',title:'Invocation and shaping are distinct methods',checkedAt:'2026-11-25',reviewedAt:'2026-11-25',
    state:'Earlier documented source evidence; receipt reviewed here, not freshly reread source text',
    coverage:'One chapter-2 method distinction reused by the light-formula correction receipt. This receipt contributes no batch rows. The Library measures the collected outputs separately.',
    evidence:{file:'docs/worlds/mother-of-learning/LIGHT_FORMULA_CORRECTION_2026-11-25.md',href:'/tracked-reading-evidence/mol',heading:'A worked light-formula correction · Source and Receipt',
        paragraphMethod:'The existing correction receipt pins the method distinction to MOL-C002-05/08 and chapter 2 paragraphs 137–153 and 165–175. This review does not re-open or realign the absent EPUB.',
        sourceHash:'e53f95695730fd58b70c9676f03cd2ee457521c60210515cea38c1a514aa2fcf',
        reviewHash:'7945f82cc6bb37032ad4ad3894397c22b9cd4a1a965fc4f094fa6e3c737a7859'},
    findings:[{label:'Earlier documented method distinction',locators:['MOL-C002-05 · en b1 c2 p137–p153','MOL-C002-08 · en b1 c2 p165–p175'],
        text:'The retained source owner distinguishes a structured invocation from shaping. Learning or adapting the invocation is not evidence that the character has learned direct shaping.'}],
    limits:['The November 25 receipt review did not reread the raw EPUB. The world brief records the source hash.',
        'The worksheet, time, stamina cost and revision-session reward are authored, not chapter-measured values.'],
    authoredHeading:'Authored play method',proposals:[{status:'Existing authored application, not a novel episode',
        text:'The worked correction requires light that lasts through completion and feeds the existing Formulas revision consumer. Its later adapted invocation remains a separate method from direct shaping.'}],
    gameStatus:'The correction receipt records an earned Village-to-Zorian route, rebuilt 1920×1080 checks and save/reload/export/import; time was test-stepped. Its later-use proof also distinguishes adapted invocation from unlearned shaping. This review does not rerun that gameplay.',
    implementationReceipt:'LIGHT_FORMULA_CORRECTION_2026-11-25.md',implementationHref:'/tracked-reading-evidence/mol',
}]);

export function trackedReadings(world) {return TRACKED_READINGS.filter(entry => entry.world === world);}
export function trackedReadingHref(entry) {return '#world/' + encodeURIComponent(entry.world) + '/reading/' + encodeURIComponent('tracked:' + entry.id);}

export function appendTrackedReadings({parent, world, focus, element: el}) {
    const entries = trackedReadings(world);
    if (!entries.length) return;
    const section = el('section', null, 'sheet findings-sheet tracked-readings');
    section.setAttribute('aria-label', 'Verified tracked readings');
    section.append(el('h2', 'Verified tracked readings'), el('p', 'Selected source checks recorded in project receipts. These do not increase collected batch-row counts.'));
    for (const entry of entries) {
        const record = el('details', null, 'tracked-reading-record'); record.dataset.readingId = entry.id;
        record.open = focus === 'tracked:' + entry.id;
        record.append(el('summary', entry.id + ' · ' + entry.title));
        record.append(el('p', entry.state + ' · '+(entry.reviewedAt?'earlier evidence dated ':'checked ')+entry.checkedAt+
            (entry.reviewedAt?' · receipt reviewed '+entry.reviewedAt:'')), el('p', entry.coverage));
        const findings = el('section'); findings.append(el('h3', 'What the selected source supports'));
        const list = el('ul');
        for (const finding of entry.findings) {
            const item = el('li'); item.append(el('p', finding.text), el('small', finding.label + ' · ' + finding.locators.join(' · '))); list.append(item);
        }
        findings.append(list); record.append(findings);
        const limits = el('section'); limits.append(el('h3', 'What remains unqualified'));
        const unqualified = el('ul'); for (const line of entry.limits) unqualified.append(el('li', line)); limits.append(unqualified); record.append(limits);
        const proposals = el('section'); proposals.append(el('h3', entry.authoredHeading || 'Authored proposal'));
        for (const proposal of entry.proposals) proposals.append(el('p', proposal.text), el('small', proposal.status)); record.append(proposals);
        record.append(el('p', 'In OOPS · ' + entry.gameStatus));
        if (entry.runtimeTuning) record.append(el('p', entry.runtimeTuning));
        if (entry.implementationReceipt) {
            const receipt=el(entry.implementationHref?'a':'small','Gameplay receipt: '+entry.implementationReceipt);
            if(entry.implementationHref)receipt.href=entry.implementationHref;
            record.append(receipt);
        }
        for (const working of entry.relatedWorkings || []) {
            const link = el('a', working.label); link.href = working.href;
            record.append(link, el('p', working.status));
        }
        const evidence = el('section'); evidence.append(el('h3', 'Tracked evidence'));
        const link = el('a', entry.evidence.file + ' · ' + entry.evidence.heading); link.href = entry.evidence.href || trackedReadingHref(entry);
        evidence.append(link, el('p', entry.evidence.paragraphMethod));
        if(entry.evidence.sourceHash)evidence.append(el('small','Recorded source SHA-256: '+entry.evidence.sourceHash));
        if(entry.evidence.reviewHash)evidence.append(el('p','Reviewed receipt SHA-256: '+entry.evidence.reviewHash));
        record.append(evidence); section.append(record);
    }
    parent.append(section);
}
