// Read-only authoring and source-rule input. This module owns no runtime or saves.
// A supported result means the supplied evidence fits a scoped rule, not that a
// playable command, carrier transfer, reward, reset, or book world was activated.
import {deepFreezeUnlessFrozen as freeze} from './basics.js';
const root = 'docs/research/novels/full-book/';
const evidence = (id, owner, locator, qualification, detail) => ({id, owner: root + owner, locator, qualification, detail});
const check = (path, kind, expected, reason) => ({path, kind, expected, reason});
const same = (path, expectedPath, reason) => check(path, 'same-path', expectedPath, reason);
const yes = (path, reason) => check(path, 'equals', true, reason);
const no = (path, reason) => check(path, 'equals', false, reason);
const present = (path, reason) => check(path, 'present', null, reason);
const rule = (id, eraIds, evidenceIds, checks, joins, boundary, exception = null) => ({
    id, eraIds, evidenceIds, checks, joins, boundary, exception,
    implementation: 'pure-rule-implemented-unverified', nativeConsumer: null,
    activation: 'unactivated', bindingGap: 'Features must supply actual world/branch/carriers and bind an existing native command.'
});
const carrierBoundary = {
    separate: ['actor', 'body', 'controller', 'soul', 'memory', 'source', 'fuel', 'learned-mastery',
        'holdings-and-custody', 'institutional-rights', 'duties-and-liabilities', 'observer-belief'],
    noImplicitTransfer: ['source', 'fuel', 'learned-mastery', 'memory', 'affection', 'holdings-and-custody',
        'institutional-rights', 'completed-quests', 'native-xp'],
    continuity: 'The old holder and recipient keep explicit actual life/body/controller records. An unresolved occupant is not dead.',
    baseline: 'Source history stays immutable. An original branch records its actual cause and recomputes affected later events.',
    nativeConsumer: null, activation: 'unactivated'
};
const recognition = (eraIds, evidenceIds) => rule('recognition', eraIds, evidenceIds, [],
    ['observer-scoped-evidence', 'actual-actor-carriers', 'remembered-aftermath', 'Legibility projection'],
    'An appearance, title or successful local test supports that observer claim only. It transfers no carrier.');

export const cultivationBookProfiles = freeze({
    'fated-villain': {
        id: 'cultivation.fated_villain.v1', worldId: 'fated-villain', title: 'I Am the Fated Villain',
        edition: {
            sha256: '3136ed56debd2f33ba03751e80bdbbd027cc0a06977cd19a5825b843cb6a9496',
            owner: root + 'fated-villain/EDITION.md',
            reviewedExtent: '2239 included story/unlabelled sections, physical 1–2240 except publishing 58; 2993817 raw body words.',
            excludedInspected: 'Introduction 0 and publishing 58; repetition counts as supplied text, not additional events.',
            qualification: 'Supplied English Gemini MTL; primary fidelity/publication completeness unverified. Final 2239p77 error marker; 2240 ongoing account through p81.'
        },
        carrierBoundary,
        context: {
            actualBranch: null, status: 'unactivated-source-profile',
            proposedBranchId: 'cultivation.fv.guest_errand.branch.v1',
            originalBranchCause: 'An original ordinary entrant elects honest guest work or a disclosed borrowed-livery claim.',
            eras: [
                {id: 'fv.taixuan.s0010', placeIds: ['fv.taixuan.guest_hall'], cutoff: 'Physical 10; after the investiture and three-day monitoring.', entryModes: ['ordinary-local', 'qualified-outsider']},
                {id: 'fv.root.s2072', placeIds: ['fv.alliance.central_island'], cutoff: 'Physical 2072; tools remelted and prototype allocated.', entryModes: ['ordinary-local', 'qualified-outsider']},
                {id: 'fv.wang.s2166', placeIds: ['fv.dao_prosperity.recovery'], cutoff: 'Physical 2166; Ni spirit destroyed, Wang recovery begins.', entryModes: ['ordinary-local', 'qualified-outsider']}
            ]
        },
        evidence: [
            evidence('FV-S0004-C02', 'fated-villain/workers/opening/NOTES.md', 'physical4, Chapter4, split_001.html#calibre_toc_5 p59–81', 'S/U, private interface claim', 'Destiny Points and Fortune differ; Gu sees a private System, not a publicly inheritable office.'),
            evidence('FV-S0004-C01', 'fated-villain/workers/opening/NOTES.md', 'physical4, Chapter4, split_001.html#calibre_toc_5 p27–35', 'N/U, narrated hidden order', 'Separate Elder Ming suppresses the ring-spirit support channel; the crowd sees pressure, not the secret cause.'),
            evidence('FV-S0008-C01', 'fated-villain/workers/opening/NOTES.md', 'physical8, Chapter8, split_001.html#calibre_toc_9 p1–50, especially29–42', 'E/U, witnessed purchase/result', 'Gu pays over500 of550 points for Codex6→7; remembered rank or institutional appearance is not mastery.'),
            evidence('FV-S0009-C02', 'fated-villain/workers/opening/NOTES.md', 'physical9, Chapter9, split_001.html#calibre_toc_10 p20–28,p53–68', 'B/U, separate actor accounts', 'Yan Ji awakens through Ye cultivation energy yet chooses not to expose herself; ring custody does not purchase loyalty.'),
            evidence('FV-S0006-C01', 'fated-villain/workers/opening/NOTES.md', 'physical6, Chapter6, split_001.html#calibre_toc_7 p78–91', 'N/U, Elder Ming report', 'Taixuan wants external patronage after a privately reported elder loss; politics has concrete means and partial information.'),
            evidence('FV-S0005-C02', 'fated-villain/workers/opening/NOTES.md', 'physical5, Chapter5, split_001.html#calibre_toc_6 p46–80', 'E/U, tea service and distinct reactions', 'Su’s tea service and silence are read differently by Ye and the hall. Ordinary subsistence prices are not established here.'),
            evidence('FV-S2072-C1790', 'fated-villain/workers/s2071-2090/NOTES.md', 'physical2072, Chapter1790, split_119.html#calibre_toc_2073 p1–44,p45–74; POWERS p15/p34', 'E/N/B, consumed sources versus rumor', 'Seven Heaven tools and older artifacts are remelted with Epoch Tree rootstock. Prototype Root, old key and later separate Seed differ.'),
            evidence('FV-S2166-C01', 'fated-villain/workers/s2151-2170/NOTES.md', 'physical2166, Chapter1872, split_124.html#calibre_toc_2167 p1–17', 'E/N, body/occupant outcome', 'Xian’er destroys Ni’s spirit and preserves Wang’s host body; no all-clan-death conclusion follows.'),
            evidence('FV-S2166-C03', 'fated-villain/workers/s2151-2170/NOTES.md', 'physical2166, Chapter1872, split_124.html#calibre_toc_2167 p58–72; PEOPLE current correction p58–68', 'N/B, recovery narrated, Gu attribution conjectural', 'Hidden Wang wisp, intact body and helpers support actual recovery. Gu’s alleged stabilization role is explicitly unproved.'),
            evidence('FV-S1228-C01', 'fated-villain/workers/s1211-1230/NOTES.md', 'physical1228, Chapter1100, split_071.html#calibre_toc_1229 p53–63', 'E/N/U, owned inner-world custody', 'Actual Epoch Tree and surrounding land enter Gu’s Inner Universe; a phantom manifestation is not arbitrary full-world control.'),
            evidence('FV-S1690-C02', 'fated-villain/workers/s1671-1690/NOTES.md', 'physical1690, Chapter1484, split_097.html#calibre_toc_1691 p22–43', 'E/U, concrete historical incursion', 'Boat and Stone node permit tangible past entry under broken local laws; output is suppressed to at most one tenth.'),
            evidence('FV-S1695-C1488', 'fated-villain/workers/s1691-1710/NOTES.md', 'physical1695, Chapter1488, split_097.html#calibre_toc_1696 p1–10,p12–49,p50–62', 'E/N/U, costly return and changed history', 'Tree remains inside current Inner Universe; Boat/Stone/Bottle support return with residual blood backlash and later changed-clan evidence.')
        ],
        recognitionTests: {
            appearance: 'A local usher may recognize guest livery; this proves neither source nor office.',
            personal_memory: 'An actual familiar person remembers a meeting or duty, within that observer’s knowledge.',
            credential_binding: 'Original guest-work permission needs actual issuing authority; this register is an original scene choice.',
            demonstrated_method: 'Demonstrated method shows only the demonstrated means and present control.',
            soul_signature: 'No universal soul-detection or Mirage-versus-Divine-Mirror result is established by this profile.'
        },
        replacementExceptions: [
            {kind: 'alias-or-credential', transfer: 'observer claim only', sourceVsOriginal: 'Original guest-livery scene; source hierarchy cue only.'},
            {kind: 'role-or-fate-credit', transfer: 'no System/points/Fortune by borrowed title', sourceVsOriginal: 'Source private System; future opportunity redirection needs explicit actual host cause.'},
            {kind: 'body-occupant', eraId: 'fv.wang.s2166', transfer: 'intact host and surviving wisp are separate', sourceVsOriginal: 'Narrow source recovery, not universal possession/rebirth.'},
            {kind: 'material-substitution', eraId: 'fv.root.s2072', transfer: 'consumed key components are unavailable unchanged', sourceVsOriginal: 'Source remelting; original averted-remelt branch must show that cause.'}
        ],
        tropeChain: {
            evidenceIds: ['FV-S0006-C01', 'FV-S0004-C01', 'FV-S0009-C02'],
            source: 'Patron-seeking sect → public confrontation → hidden helper suppresses a support channel → private surveillance and competing interpretations.',
            originalLocal: 'Guest errand → livery claim or honest introduction → steward tests permission → same porter reports the performed duty later.',
            subversions: ['Refuse the errand without generating a rival.', 'Ask a willing sponsor for actual permission.', 'Expose a false claim or compensate wasted labor.', 'Source ally can withhold risky aid; no infinite young-master escalation.'],
            rememberedAftermath: 'Record who saw livery, who authorized work, who performed it and whose report was corrected; no stolen affection or future System reward.'
        },
        topology: {
            sourceQualified: true, evidenceIds: ['FV-S1228-C01', 'FV-S1690-C02', 'FV-S1695-C1488'],
            setting: 'Connected universes and local histories; no universal mission hub selected.',
            nodes: [
                {id: 'cultivation.fv.topology.local_universe', kind: 'physical-universe'},
                {id: 'cultivation.fv.topology.gu_inner_universe', kind: 'owned-inner-world', boundary: 'Actual tree/land custody; access and full ecology not generalized.'},
                {id: 'cultivation.fv.topology.historical_node', kind: 'same-universe-earlier-history', boundary: 'Tangible costly incursion differs from observed memories/forecasts.'}
            ],
            edges: [
                {id: 'cultivation.fv.edge.tree_custody', from: 'cultivation.fv.topology.local_universe', to: 'cultivation.fv.topology.gu_inner_universe', evidenceId: 'FV-S1228-C01', carriers: 'Actual tree plus rooted land, not a fresh duplicate.', clock: 'No exact internal/outside conversion qualified.'},
                {id: 'cultivation.fv.edge.past_incursion', from: 'cultivation.fv.topology.local_universe', to: 'cultivation.fv.topology.historical_node', evidenceId: 'FV-S1690-C02', carriers: 'Actual Gu/Boat/Stone under local suppression; no automatic allies/office rights.', clock: 'Source node and local chronology; no universal real-time ratio.'},
                {id: 'cultivation.fv.edge.return', from: 'cultivation.fv.topology.historical_node', to: 'cultivation.fv.topology.local_universe', evidenceId: 'FV-S1695-C1488', carriers: 'Supported return means; retained Tree, actual backlash, witnesses and changed records.', clock: 'Exact elapsed outside interval unspecified in this window.'}
            ],
            unknowns: ['No universal portal compatibility or exact all-universe calendar.', 'Root/Seed prototypes are not complete independent inhabited destinations.'],
            nativeQualification: 'unactivated; no native inner-world/history edge or source-era destination instance', nativeConsumer: null,
            joins: ['actual instance/branch IDs', 'body/cargo/route/source costs', 'history/witness aftermath', 'one durable publisher']
        },
        deepChain: {
            id: 'cultivation.fv.chain.guest_credit', sourceVsOriginal: 'Original recognition-to-legitimate-work chain; source patronage/tea/report cues only.',
            evidenceIds: ['FV-S0006-C01', 'FV-S0004-C01', 'FV-S0005-C02'],
            actorMeans: {steward: 'Actual permission and one finite errand, not cultivation gifts.', porter: 'Visual livery memory plus its own later witnessed return.', rightful_runner: 'Borrowed tray/livery custody and continuing duty; remains alive.', entrant: 'Present ordinary body, time and actual material custody.'},
            phases: [
                {id: 'offer', prerequisites: 'Known guest hall/steward and available actual errand.', choices: ['honest introduction', 'livery claim', 'refusal'], next: ['recognition', 'closed_refusal']},
                {id: 'recognition', prerequisites: 'Porter visual evidence and steward permission checked separately.', choices: ['disclose borrowing', 'ask willing handover', 'persist in false office claim'], next: ['work', 'dispute']},
                {id: 'work', prerequisites: 'Actual one-errand right/custody and funded time.', choices: ['perform duty', 'return unused tray', 'partial work and report'], next: ['credit_review']},
                {id: 'dispute', prerequisites: 'Specific mismatched claim and named witnesses; no invented omniscient proof.', choices: ['correct testimony', 'compensate actual wasted stock/time', 'refuse claim resolution'], next: ['credit_review', 'closed_dispute']},
                {id: 'credit_review', prerequisites: 'Performed work, witness knowledge and donor claim remain separate.', choices: ['rightful credit', 'negotiated shared credit', 'reject unsupported award'], next: ['later_return']},
                {id: 'later_return', prerequisites: 'Same porter/steward and committed history.', choices: ['ordinary work invitation', 'repair retained dispute', 'leave'], next: []}
            ],
            outcomes: {lawful: 'Real duty and specific permission earned; no source grant.', refusal: 'Returned property, no hostility replacement.', partial: 'Actual unfinished duty/stock and report remain.', hostile: 'Contested claim and bounded access refusal; no automatic fight or stronger relative.'},
            retainedAftermath: 'Conserve tray/livery, holder life, real duties and each witness’s distinct correction.',
            nativeQualification: 'authoring/pure rule only, unactivated', nativeConsumer: null,
            joins: ['Features replacement carriers', 'permission/duty/custody native commands', 'Legibility witness correction', 'Ink continuation']
        },
        interactions: {
            material: 'An original borrowed tray/livery stays the lender’s property; real return/custody is required. Late artifacts consumed in remelting are a separate era.',
            learning: 'Codex text, True Disciple access, paid insight, execution and independent cultivation differ; no universal point price.',
            body: 'Pressure, ring-spirit, host body, spirit wisp and restoration are separate means.',
            sourceFuel: 'Private Destiny currency, Fortune, cultivation and Yan Ji’s awakening support are distinct; no portable universal luck bar.',
            access: 'Patronage and actual permission shape access; a familiar robe cannot convey institutional rights.',
            ordinaryAlternative: 'Honest guest work, waiting, refusing, asking the responsible steward or paying an ordinary service remain proposals.'
        },
        voices: [
            {id: 'cultivation.fv.voice.porter', personId: 'cultivation.fv.person.porter', sourceVsOriginal: 'Original local voice, opening tea/report hierarchy cue', line: 'The robe tells me which door to point at. The steward tells me whether to open it.'},
            {id: 'cultivation.fv.voice.steward', personId: 'cultivation.fv.person.steward', sourceVsOriginal: 'Original local voice; no canonical character imitation', line: 'Leave the tray here. Tell me whose errand it is, then we can both stop guessing.'}
        ],
        rules: [
            recognition(['fv.taixuan.s0010', 'fv.root.s2072', 'fv.wang.s2166'], ['FV-S0004-C01', 'FV-S0005-C02', 'FV-S2166-C03']),
            rule('private-system-entitlement', ['fv.taixuan.s0010'], ['FV-S0004-C02'], [
                check('intent.acquisitionCause', 'equals', 'source-native-gu-system', 'A costume, copied name or office does not grant Gu’s private System.'),
                check('actual.source.nativeOrigin', 'equals', 'gu-changge-private-system', 'Only the source-qualified native Gu System is covered.'),
                same('actual.source.ownerActorId', 'actual.actorId', 'Source ownership is separate from the claimed identity.'),
                same('actual.source.controllerId', 'actual.controllerId', 'The actual controller must be the source controller.'),
                yes('actual.source.bindingVerified', 'The native source binding must actually exist.')
            ], ['source-lifecycle owner', 'actual actor/controller', 'world-specific acquisition command'], 'No reward formula, System transfer or global Fortune rule.'),
            rule('ring-assistance', ['fv.taixuan.s0010'], ['FV-S0004-C01', 'FV-S0009-C02'], [
                present('actual.helper.actorId', 'The ring spirit is a separate actual actor.'),
                yes('actual.helper.awakeningSupportAvailable', 'Awakening support is not supplied by ring appearance.'),
                no('actual.helper.suppressed', 'A suppressed support channel cannot provide this aid.'),
                yes('actual.helper.willingToAssist', 'The spirit can refuse risky aid.')
            ], ['helper life/controller/source', 'support-channel suppression', 'paid native aid command'], 'Ring custody is not a learned technique or obedient summoned helper.'),
            rule('remelted-key-availability', ['fv.root.s2072'], ['FV-S2072-C1790'], [
                yes('actual.material.originalKeyIntact', 'Consumed/remelted tools cannot remain the original key.'),
                no('actual.material.originalKeyConsumed', 'Consumption and replacement stock must be explicit.'),
                same('actual.material.custodianActorId', 'actual.actorId', 'The acting person needs actual custody.'),
                yes('actual.material.branchRemeltAverted', 'Availability after this cutoff requires an explicitly altered remelt cause.')
            ], ['material/custody/consumption', 'actual altered branch history', 'artifact-use native command'], 'In the source-baseline2072 branch the original tools were remelted.', 'source-baseline-blocked'),
            rule('wang-host-recovery', ['fv.wang.s2166'], ['FV-S2166-C01', 'FV-S2166-C03'], [
                yes('actual.continuity.hostBodyIntact', 'Destroying an occupant is not recreating the host body.'),
                yes('actual.continuity.wangWispPresent', 'A surviving Wang wisp, not a rumor, is required.'),
                yes('actual.continuity.niSpiritDestroyed', 'The removed occupant outcome must be explicit.'),
                yes('actual.continuity.helperCareAvailable', 'Injuries and stabilization require actual care.')
            ], ['body/controller/soul continuity', 'care command/materials', 'stable Wang actor and later meeting'], 'This validates the narrow recovery prerequisites; it grants no restored actor, full power or unknown Gu intervention.')
        ],
        unknowns: ['MTL rank aliases and early point arithmetic.', 'No exact civilian price list at the opening.', 'No generalized System transfer, Fortune formula, oath immunity or all-observer soul test.', 'Gu’s role in Wang-wisp stabilization is conjectural.'],
        bindingNeeds: ['Native Taixuan instance and ordinary entrant.', 'Guest-work permission/custody command and independent steward/porter actors.', 'Observer-specific remembered return plus Ink continuation.']
    },
    'reverend-insanity': {
        id: 'cultivation.reverend_insanity.v1', worldId: 'reverend-insanity', title: 'Reverend Insanity',
        edition: {
            sha256: '981c313a5f122272c0f6656df0071bfb43d37715e6ca20c10813a6341833e562',
            owner: root + 'reverend-insanity/manifest.json',
            reviewedExtent: 'Root-reviewed/integrated chapters1–590; 1259728 unique manifest words, 2118 claims at inspected SYNTHESIS snapshot.',
            pendingExtent: 'Chapters591–2334 reader-consumed, pending root review; do not activate later identity/soul/clone/luck rules.',
            qualification: 'Supplied2334-chapter English snapshot; provenance and publication completeness qualified.'
        },
        carrierBoundary,
        context: {
            actualBranch: null, status: 'unactivated-source-profile',
            proposedBranchId: 'cultivation.ri.token_inspection.branch.v1',
            originalBranchCause: 'An original ordinary visitor brings a borrowed token and can elect paid ordinary shop access instead.',
            eras: [
                {id: 'ri.qing_mao.c0023', placeIds: ['ri.qing_mao.academy_market'], cutoff: 'Chapter23; early Moonlight practice/feed economy.', entryModes: ['ordinary-local', 'qualified-outsider']},
                {id: 'ri.qing_mao.c0156', placeIds: ['ri.qing_mao.recipe_archive'], cutoff: 'Chapter156; Gu Yue elder archive access.', entryModes: ['ordinary-local', 'qualified-outsider']},
                {id: 'ri.shang.c0272', placeIds: ['ri.shang.outer_shop', 'ri.shang.token_gate'], cutoff: 'Chapter272; token issuance and social invitation, before later succession outcomes.', entryModes: ['ordinary-local', 'qualified-outsider']}
            ]
        },
        evidence: [
            evidence('RI-c0022-01', 'reverend-insanity/INDEXES.json', 'c0022.b010–b028, EPUB/chapter_22.xhtml', 'N, teacher demonstration', 'Controlled Gu, actual primeval essence and bodily execution produce a blade; elder range is not novice range.'),
            evidence('RI-c0023-02', 'reverend-insanity/INDEXES.json', 'c0023.b031–b064, EPUB/chapter_23.xhtml', 'N, specific early feed economy', 'Moonlight four petals/day, Liquor one green-bamboo-wine jar/four days; untreated petals keep five days. Food is not activation fuel.'),
            evidence('RI-c0057-01', 'reverend-insanity/INDEXES.json', 'c0057.b020–b045, EPUB/chapter_57.xhtml', 'W, bounded investigator evidence', 'Footprint Gu displays last30000 footprints; it does not reveal every speech or murder truth.'),
            evidence('RI-c0057-02', 'reverend-insanity/INDEXES.json', 'c0057.b046–b081, EPUB/chapter_57.xhtml', 'N, explicit detector exception', 'Cicada aura incapacitates this Bamboo Gentleman; unchanged color cannot validate answers. No universal lie-detector immunity.'),
            evidence('RI-c0096-03', 'reverend-insanity/INDEXES.json', 'c0096.b053–b092, EPUB/chapter_96.xhtml', 'W/N, recorded inheritance', 'A dead clan member’s recorded Gu are reserved for an inheritor, not automatically battlefield salvage.'),
            evidence('RI-c0138-01', 'reverend-insanity/INDEXES.json', 'c0138.b003–b031, EPUB/chapter_138.xhtml', 'W, particular refinement exception', 'Fang catches Plunder; Cicada aura permits rapid control replacement. Physical capture and former-owner will differ.'),
            evidence('RI-c0156-01', 'reverend-insanity/INDEXES.json', 'c0156.b003–b035, EPUB/chapter_156.xhtml', 'N, local institutional policy', 'Rank-three elders receive watched15-minute/day access to rank1–3 Digital Shade recipes, not source custody.'),
            evidence('RI-c0271-05', 'reverend-insanity/readers/R0261-0275-NOTES.md', 'c0271.b126–b172, EPUB/chapter_271.xhtml', 'W, actual issuance and binding', 'Purple Thorn Token binds recipient blood using consumed token Gu; decaying wood credential cannot be refined as a living Gu to steal authority.'),
            evidence('RI-c0272-01', 'reverend-insanity/INDEXES.json', 'c0272.b003–b032, EPUB/chapter_272.xhtml', 'W, social invitation', 'Xin Ci accepts an invitation and heirs meet socially; no durable alliance/obedience follows automatically.'),
            evidence('RI-c0012-02', 'reverend-insanity/INDEXES.json', 'c0012.b031–b069, EPUB/chapter_12.xhtml', 'W, particular ordinary encounter', 'Badge/uniform prompts deference; companion checks Jiang Ya and recognition changes his address. This is not a blood-token test.'),
            evidence('RI-c0261-02', 'reverend-insanity/readers/R0261-0275-NOTES.md', 'c0261.b068–b104, EPUB/chapter_261.xhtml', 'N, bounded shop service', 'Shopkeeper-refined Bookworms lend catalogue access; contents knowledge does not transfer the shop Gu or purchased stock.'),
            evidence('RI-c0346-03', 'reverend-insanity/INDEXES.json', 'c0346.b016–b026, EPUB/chapter_346.xhtml', 'N, subordinate world entry', 'Three kings establish inheritance routes inside an older Immortal blessed land; entering leaves main world and separates companions.'),
            evidence('RI-c0346-01', 'reverend-insanity/INDEXES.json', 'c0346.b016–b034, EPUB/chapter_346.xhtml', 'N, qualified time-flow account', '3×faster local flow/Cicada recovery is reported, but b034 reverses the day conversion. Do not manufacture an exact global ratio.'),
            evidence('RI-c0350-02', 'reverend-insanity/INDEXES.json', 'c0350.b031–b088, EPUB/chapter_350.xhtml', 'T, particular route choice', 'Offered right-hand route exits directly; periodic exit is not available at any arbitrary moment.'),
            evidence('RI-c0351-02', 'reverend-insanity/INDEXES.json', 'c0351.b054–b102; c0352.b018–b020, EPUB/chapter_351.xhtml / EPUB/chapter_352.xhtml', 'W, exit means', 'Earned token exits via tongue blood/bark; source352 gives three-use capacity, with dog cargo custody unshown.')
        ],
        recognitionTests: {
            appearance: 'Badge/uniform can change social reaction without verifying actual Gu source or rights.',
            credential_binding: 'Purple token blood binding must match the actual recipient; wood custody alone is insufficient.',
            personal_memory: 'A merchant’s actual prior interaction is a separate, limited evidence channel.',
            demonstrated_method: 'Observed Gu use demonstrates that controlled source and fuel, not every claimed rank or body trait.',
            detector_operation: 'A failed/incapacitated Bamboo Gentleman provides no valid answer; Footprint evidence is bounded location evidence.'
        },
        replacementExceptions: [
            {kind: 'twin-alias', transfer: 'No Fang Zheng body, current portfolio or sect rights from Fang Yuan’s alias.', sourceVsOriginal: 'Reviewed SYNTHESIS twins/false identity; original visitor is neither twin.'},
            {kind: 'credential-theft', transfer: 'Borrowed Purple Thorn wood does not transfer blood-bound privileges.', sourceVsOriginal: 'Source c271; no new blood-rebinding recipe selected.'},
            {kind: 'source-theft', transfer: 'Physical Gu capture, refinement/control and legal custody are different.', sourceVsOriginal: 'Source Plunder/Cicada exception, not a universal instant refinement faculty.'},
            {kind: 'inheritance', transfer: 'Recorded rightful inheritor differs from finder.', sourceVsOriginal: 'Source Qing Mao clan policy; not all world institutions.'}
        ],
        tropeChain: {
            evidenceIds: ['RI-c0271-05', 'RI-c0272-01', 'RI-c0261-02'],
            source: 'Public clan gratitude → owner-specific token → bounded services and price privileges → young-heir introductions, still without durable loyalty.',
            originalLocal: 'Visitor borrows a token → gate keeper checks blood binding → outer-shop catalogue/ordinary paid access → same clerk recognizes returned property.',
            subversions: ['Return the token and use an ordinary service.', 'Ask its actual owner to accompany the visitor where rules allow.', 'Accept refusal without a young-master fight.', 'Correct an exaggerated invitation claim before later trade.'],
            rememberedAftermath: 'Actual owner keeps token rights and Gu; clerk remembers return/refusal, the issuer and donor remain separate, and purchased stock has its own custody.'
        },
        topology: {
            sourceQualified: true, evidenceIds: ['RI-c0346-03', 'RI-c0346-01', 'RI-c0350-02', 'RI-c0351-02'],
            setting: 'Main world plus subordinate blessed land and local inheritance routes; no central mission institution inferred.',
            nodes: [
                {id: 'cultivation.ri.topology.main_world', kind: 'physical-world'},
                {id: 'cultivation.ri.topology.three_kings', kind: 'subordinate-blessed-land', boundary: 'Three routes modified an older Immortal inheritance; not three unrelated universes.'}
            ],
            edges: [
                {id: 'cultivation.ri.edge.inheritance_entry', from: 'cultivation.ri.topology.main_world', to: 'cultivation.ri.topology.three_kings', evidenceId: 'RI-c0346-03', carriers: 'Actual entered actors separate under spatial law; no guaranteed immediate companion reunion.', clock: 'Reported3×faster flow conflicts with one reversed day conversion; exact outside elapsed remains unknown.'},
                {id: 'cultivation.ri.edge.periodic_exit', from: 'cultivation.ri.topology.three_kings', to: 'cultivation.ri.topology.main_world', evidenceId: 'RI-c0350-02', carriers: 'Specific offered right-hand route exits; no anytime withdrawal entitlement.', clock: 'No universal exit duration.'},
                {id: 'cultivation.ri.edge.token_exit', from: 'cultivation.ri.topology.three_kings', to: 'cultivation.ri.topology.main_world', evidenceId: 'RI-c0351-02', carriers: 'Owned limited-use travel token, blood/bark activation; remaining uses require actual charge owner.', clock: 'No inferred global source/stock reset on return.'}
            ],
            unknowns: ['Reviewed591+ topology/soul/clone rules stay unqualified.', 'Local3×conversion tension; no imposed idle multiplier.', 'No assumed dog cargo exit custody or fresh unique Immortal Gu copy.'],
            nativeQualification: 'unactivated; no native blessed-land route/charge/local-clock consumers', nativeConsumer: null,
            joins: ['retained instance/route stage', 'Gu/actor/cargo portability', 'finite exit token charges', 'explicit local clock']
        },
        deepChain: {
            id: 'cultivation.ri.chain.token_trade_credit', sourceVsOriginal: 'Original credential-to-trade chain; source token/catalogue/social invitation rules only.',
            evidenceIds: ['RI-c0271-05', 'RI-c0272-01', 'RI-c0261-02'],
            actorMeans: {clerk: 'Actual catalogue source/stock and bounded service authority.', token_owner: 'Own blood-bound privilege and continuing Gu portfolio.', entrant: 'Borrowed wood, own actual funds and optional ordinary market work.', witness: 'Only attended token/service/return facts.'},
            phases: [
                {id: 'presentation', prerequisites: 'Actual owned or borrowed token custody.', choices: ['truthful bearer statement', 'false privileged claim', 'refusal'], next: ['binding_check', 'closed_refusal']},
                {id: 'binding_check', prerequisites: 'Current token condition and blood-binding test.', choices: ['proper owner accompaniment', 'ordinary service', 'contest mismatch'], next: ['funded_trade', 'dispute']},
                {id: 'funded_trade', prerequisites: 'Authorized real service, finite funds/stock and source control.', choices: ['catalogue reading', 'buy compatible feed', 'stop after information'], next: ['credit_review']},
                {id: 'dispute', prerequisites: 'Observed mismatch or concrete unpaid stock; other observers remain uninformed.', choices: ['return borrowed stock', 'pay actual liability', 'withdraw disputed claim'], next: ['credit_review', 'closed_dispute']},
                {id: 'credit_review', prerequisites: 'Actual purchaser/bearer/service recipient and clerk receipt.', choices: ['correct purchase credit', 'disclose owner role', 'decline unsupported heir-alliance claim'], next: ['revisit']},
                {id: 'revisit', prerequisites: 'Same token owner/clerk and retained stock/rights/history.', choices: ['renew ordinary trade', 'resolve remaining liability', 'leave'], next: []}
            ],
            outcomes: {lawful: 'Paid stock/information to actual recipient, owner rights retained.', refusal: 'Borrowed token returned and no forced rival.', partial: 'Catalogue knowledge can remain while purchases/privileges remain unacquired.', hostile: 'Specific access refusal/debt dispute with actual witnesses; no automatic arena duel.'},
            retainedAftermath: 'No blood rights stolen by appearance, no duplicated Bookworm/stock, no source-grade or heir allegiance from social credit.',
            nativeQualification: 'authoring/pure rule only, unactivated', nativeConsumer: null,
            joins: ['credential/authority/custody', 'funded shop service', 'observer receipt/credit correction', 'Ink same-clerk revisit']
        },
        interactions: {
            material: 'Living Gu food, worn weapon teeth, inventory, perishable petals and residue-bearing wooden credentials differ.',
            learning: 'Catalogue/recipe access gives information; refinement practice, actual ingredients, body execution and stored fuel remain separate.',
            body: 'Permanent boar strength can remain after White Boar consumption; rank, aptitude and body development do not substitute for each other.',
            sourceFuel: 'Gu control/feeding/activation are separate. Primeval stones can be both money and refinement resource, but price is not spell fuel.',
            access: 'Shang token zones and Qing Mao watched archive are era/institution-specific; no worldwide title allowance.',
            ordinaryAlternative: 'Paid catalogue reading, available outer services, ordinary food/medicine, refusal and proper owner accompaniment are original selected possibilities, subject to native availability.'
        },
        voices: [
            {id: 'cultivation.ri.voice.clerk', personId: 'cultivation.ri.person.clerk', sourceVsOriginal: 'Original shop clerk, c261 catalogue and c271 credential cue', line: 'You can hold the wood. That does not make the blood inside it yours.'},
            {id: 'cultivation.ri.voice.feed_seller', personId: 'cultivation.ri.person.feed_seller', sourceVsOriginal: 'Original market voice, c23 feed/scarcity cue', line: 'Buy the petals you can keep fresh. An impressive pouch will not feed next week’s Gu.'}
        ],
        rules: [
            recognition(['ri.qing_mao.c0023', 'ri.qing_mao.c0156', 'ri.shang.c0272'], ['RI-c0012-02', 'RI-c0271-05', 'RI-c0057-02']),
            rule('purple-token-access', ['ri.shang.c0272'], ['RI-c0271-05'], [
                check('actual.credential.kind', 'equals', 'purple-thorn-wood-token', 'This credential is wood with spent Gu power, not a living Gu.'),
                same('actual.credential.custodianActorId', 'actual.actorId', 'The presented token needs actual custody.'),
                same('actual.credential.boundActorId', 'actual.actorId', 'A borrowed token is not bound to this person.'),
                yes('actual.credential.bindingVerified', 'The current blood-binding check must exist.'),
                yes('actual.credential.authorityActive', 'Token decay/revocation must be checked without inventing a decay interval.'),
                yes('actual.credential.requestedServiceAuthorized', 'Nearly half-elder authority is not universal service permission.')
            ], ['credential/blood/source identity', 'Shang institutional access', 'item custody', 'service native command'], 'No rebinding, copied body rights, Gu-refinement shortcut or combat power.'),
            rule('gu-activation', ['ri.qing_mao.c0023', 'ri.shang.c0272'], ['RI-c0022-01', 'RI-c0138-01'], [
                same('actual.gu.controllerId', 'actual.controllerId', 'Physical custody is not refined control.'),
                yes('actual.gu.refinementComplete', 'A recipe or captured Gu does not establish refinement.'),
                yes('actual.gu.alive', 'Consumed/dead Gu cannot activate again.'),
                yes('actual.fuel.localPrimevalEssenceSufficient', 'A source grade does not create present fuel.'),
                yes('actual.body.executionCompatible', 'The actual body must execute the selected method.'),
                yes('actual.method.executionLearned', 'Observation alone is not learned execution.')
            ], ['Gu source/control/food', 'local energy resources', 'method/body', 'native activation command'], 'No rank conversion, novice range, reward or global Gu-slot count.'),
            rule('moonlight-feed-substitution', ['ri.qing_mao.c0023'], ['RI-c0023-02'], [
                check('actual.feed.kind', 'equals', 'moon-orchid-petals', 'This early Moonlight diet is not arbitrary edible plant matter.'),
                yes('actual.feed.quantitySufficientForSelectedUse', 'A real finite feed amount is required.'),
                yes('actual.feed.freshOrVerifiedStorage', 'Spoiled stock cannot silently become usable food.'),
                same('actual.feed.custodianActorId', 'actual.actorId', 'Feed costs belong to actual owned stock.')
            ], ['feed item/material owner', 'storage/freshness', 'native feeding command'], 'Four-petal/day source cue; this helper neither advances time nor consumes stock. Other substitution recipes remain unknown.'),
            rule('watched-recipe-access', ['ri.qing_mao.c0156'], ['RI-c0156-01'], [
                yes('actual.rights.guYueElderRecognized', 'An elder disguise is not actual Gu Yue archive permission.'),
                check('intent.recipeRank', 'one-of', [1, 2, 3], 'This archive privilege excludes rank4/5 recipes.'),
                yes('actual.access.supervisedSlotAvailable', 'A remembered text does not manufacture the watched daily slot.'),
                yes('actual.access.withinLocalAllowance', 'Actual local15-minute/day allowance must be owned by the native clock.')
            ], ['institution rights', 'known recipe/read owner', 'native shared clock/appointment', 'archive read command'], 'Access is information, not recipe mastery, Digital Shade custody or fabricated Gu.'),
            rule('bamboo-test-validity', ['ri.qing_mao.c0023', 'ri.qing_mao.c0156', 'ri.shang.c0272'], ['RI-c0057-02'], [
                check('actual.detector.kind', 'equals', 'bamboo-gentleman', 'Only this named detector’s reviewed rule is covered.'),
                yes('actual.detector.operational', 'An unchanged color from an incapacitated specimen proves no answer.'),
                no('actual.detector.cicadaAuraSuppressed', 'This actual aura-suppressed test is invalid.'),
                yes('actual.detector.refinementAndFoodEligible', 'Refinement and honesty feeding are actual conditions.')
            ], ['detector source/condition', 'observer attributed test', 'known evidence projection'], 'Even a valid operation is bounded testimony, not omniscient discovery or a generic immunity rule.')
        ],
        unknowns: ['Reviewed coverage stops590; later full-book rules stay inactive.', 'Token decay period, all authorized services and revocation details are not fully enumerated.', 'No universal Gu food substitution, slot cap, will-transfer rate, soul/clone rule or lie-detector immunity.', 'Foreknowledge does not guarantee an unchanged stone-gambling opportunity.'],
        bindingNeeds: ['Native era-specific Shang guest/local instance.', 'Owned wooden token with actual binding and bounded service rights.', 'Catalogue service/return command, actual merchant stock and remembered clerk encounter.']
    },
    'regressors-tale': {
        id: 'cultivation.regressors_tale.v1', worldId: 'regressors-tale', title: 'A Regressor’s Tale of Cultivation',
        edition: {
            sha256: '798bfee32222c8b67131266f43ea58a39875b110b06dd0810f0b35e162ad71e1',
            owner: root + 'regressors-tale/MANIFEST.json',
            reviewedExtent: 'All644 members: Prologue, labelledCh1–640 and four supplied QAs, reviewed/integrated at revision40.',
            qualification: 'Exact accessible supplied snapshot; authenticity/translation and publication completeness unverified. Nonembedded227/229/240/567/568/573 images unfetched/uninspected.'
        },
        carrierBoundary,
        context: {
            actualBranch: null, status: 'unactivated-source-profile',
            proposedBranchId: 'cultivation.rt.lesson_permit.branch.v1',
            originalBranchCause: 'An original ordinary herb worker chooses a paid referral, an honest lesson or an exposed predecessor claim.',
            eras: [
                {id: 'rt.seokyung.ord0005', placeIds: ['rt.seokyung.lesson_court'], cutoff: 'Ordinal5, second narrated life, Seokyung paid martial admission.', entryModes: ['ordinary-local', 'qualified-outsider']},
                {id: 'rt.bright_cold.ord0298', placeIds: ['rt.bright_cold.seo_li'], cutoff: 'Ordinal298, continuing eighteenth life; Seo Li and main body hold different means.', entryModes: ['ordinary-local', 'qualified-outsider']},
                {id: 'rt.ham_relay.ord0373', placeIds: ['rt.ham_jin.middle_zone'], cutoff: 'Ordinal373, current nineteenth life; consented host journey and finite vessel.', entryModes: ['ordinary-local', 'qualified-outsider']}
            ]
        },
        evidence: [
            evidence('RT-Q01', 'regressors-tale/workers/0001-0006/NOTES.md', 'ord1, OEBPS/chapter0.html p119–146; ord6,OEBPS/chapter5.html p375–402', 'E/N, narrow early returned state', 'Memory/youthful arrival returns are shown; no early complete inventory, universal observer carry or transferable regression follows.'),
            evidence('RT-Q07', 'regressors-tale/workers/0001-0006/NOTES.md', 'ord5,OEBPS/chapter4.html p36–80,p88–170; ord6,OEBPS/chapter5.html p7–74', 'E/N, paid means and individual talent', 'Herbs fund clothes, residence and paid sect access; Kim’s unusual pace is not an ordinary learner rate.'),
            evidence('RT-Q09', 'regressors-tale/workers/0001-0006/NOTES.md', 'ord5,OEBPS/chapter4.html p116–170; ord6,OEBPS/chapter5.html p136–178,p241–250', 'E/W/N, local institutional distinction', 'Donation grants outer-disciple admission with selected technique access; actual institution rights differ from martial rank.'),
            evidence('RT-Cheonji-ord5', 'regressors-tale/POWERS.md', 'ord5,OEBPS/chapter4.html p103–115', 'N/W/T, individually compared sensing', 'Method teaching, reported lower-abdominal Qi sensing and accumulated reserve differ;3/8/13months are individual comparisons.'),
            evidence('RT-treatise-ord6', 'regressors-tale/POWERS.md', 'ord6,OEBPS/chapter5.html p359–370', 'W/N, possession versus understanding', 'Seo memorizes Kim’s treatise while lacking comprehension; memorized text is not execution.'),
            evidence('RT-0295-0302-R01', 'regressors-tale/workers/0295-0302/NOTES.md', 'ord298,OEBPS/chapter297.html p97–105; audit0287–0302 correction p101–105', 'E/N, narrow current carrier', 'Colorless Glass Sword and its prior-cycle reservoir are with main body; Seo Li lacks that particular reserve, not every retained effect.'),
            evidence('RT-0295-0302-C01', 'regressors-tale/workers/0295-0302/NOTES.md', 'ord295,OEBPS/chapter294.html p70–90; ord300,OEBPS/chapter299.html p49–80', 'E/N/W, shared link with disagreement', 'Concurrent selves share connection yet differ in attention and interpretation; shared thoughts do not collapse actual identities.'),
            evidence('RT-0367-0374-C04', 'regressors-tale/workers/0367-0374/NOTES.md', 'ord373,OEBPS/chapter372.html p146–199,p239–255; ord374,OEBPS/chapter373.html p78–90,p141–148', 'E/N/W/T, consented possession and injury link', 'Seo borrows Ham Jin’s finite Qi-Building vessel with consent. Remote-avatar injury affects main body; no equal full bodies or new temporal reset.'),
            evidence('RT-0367-0374-C01', 'regressors-tale/workers/0367-0374/NOTES.md', 'ord367,OEBPS/chapter366.html p3–43,p204–274', 'E/N/W, distinct contemporary person', 'Current Hyang-hwa differs from Seo’s tenth-cycle lover. Norigae promise and resemblance do not transfer an earlier relationship.'),
            evidence('RT-SYNTHESIS-later-carriers', 'regressors-tale/REGRESSION.md', 'ord331p23–201, especially193–196; ord474p129,p133–139; reviewed later-carrier sections', 'Later reviewed exceptions, no global theorem', 'Later actual soul-linked equipment and cultivation retention revise early absence; Armor severance and un-inventoried stock keep carry rules specific.'),
            evidence('RT-Q10', 'regressors-tale/workers/0001-0006/NOTES.md', 'ord4,OEBPS/chapter3.html p116–165', 'E/W/N/I, spatial destination uncertainty', 'Capable rider sends current people/herbs through a claimed random rift; changed landing is witnessed, butterfly causality is an inference.'),
            evidence('RT-0455-0462-C09', 'regressors-tale/workers/0455-0462/NOTES.md', 'ord461,OEBPS/chapter460.html p158–271,p291–324; ord462,OEBPS/chapter461.html p1–18,p98–124', 'E/W/N, memory-world entry', 'Norigae/Light/Play support Salt Mountain dream entry; familiar point is not objective Bright Cold rewind. Qi/inner-world access is restricted.'),
            evidence('RT-0455-0462-C10', 'regressors-tale/workers/0455-0462/NOTES.md', 'ord462,OEBPS/chapter461.html p47–124; ord461,OEBPS/chapter460.html p291–323', 'E/W, altered embodied cohort', 'Uneven memory/body/role changes affect the actual cohort; Seo’s role interpretation does not turn Ran into the same underlying person as Kang.')
        ],
        recognitionTests: {
            appearance: 'Familiarity/ressemblance is a clue; a prior-life counterpart remains its own present person.',
            personal_memory: 'Attributed recalled history is not proof that the listener lived or remembers the same cycle.',
            credential_binding: 'Paid/referral-gated local admission must be an actual right for the present learner.',
            demonstrated_method: 'Qi sensing, instruction recollection, martial control and current cultivation differ.',
            soul_signature: 'Source-specific true-soul or linked-vessel recognition requires its own actual faculty and era; no universal regressor detector.'
        },
        replacementExceptions: [
            {kind: 'earlier-life-counterpart', transfer: 'No automatic affection, debt, memories or authority over current counterpart.', sourceVsOriginal: 'Source367; original learner may disclose a claimed remembered meeting.'},
            {kind: 'remembered-method', transfer: 'Knowledge differs from rebuilt body/fuel and sword-stored reserve.', sourceVsOriginal: 'Source5/6 and298; later retention exceptions remain era-specific.'},
            {kind: 'consented-host', transfer: 'Ham Jin remains actual donor; vessel resources/strain and linked injury remain real.', sourceVsOriginal: 'Source373/374; no free portable possession system.'},
            {kind: 'regression-versus-dream', transfer: 'Specific returned state cannot be inferred from dream, projection, body repair or name recognition.', sourceVsOriginal: 'Reviewed REGRESSION owner; ordinary entrant has no Seo regression.'}
        ],
        tropeChain: {
            evidenceIds: ['RT-Q07', 'RT-Q09', 'RT-treatise-ord6'],
            source: 'Ordinary herb work funds admission → unusually gifted pupil draws scrutiny → faction restraint and departure → later treatise, still beyond another learner’s understanding.',
            originalLocal: 'Herb worker requests lesson → presents honest referral or predecessor claim → instructor checks current Qi/method rather than surname → same bursar recalls who paid and attended.',
            subversions: ['Choose ordinary lessons and a useful livelihood.', 'Instructor can correct a mistaken method without a forced betrayal.', 'Refuse a paid admission or keep herbs for personal care.', 'A stronger teacher may help without becoming a compulsory final boss.'],
            rememberedAftermath: 'Current learner keeps paid rights and learned practice; remembered predecessor has separate life/relationship records. The bursar remembers actual attendance, not claimed former rank.'
        },
        topology: {
            sourceQualified: true, evidenceIds: ['RT-Q10', 'RT-0367-0374-C04', 'RT-0455-0462-C09', 'RT-0455-0462-C10'],
            setting: 'Higher/lower realms, spatial middle-zone relays and source-specific dream/inner spaces; no universal hub or reset topology.',
            nodes: [
                {id: 'cultivation.rt.topology.lower_realm', kind: 'physical-realm'},
                {id: 'cultivation.rt.topology.bright_cold', kind: 'physical-higher-realm', boundary: 'The source461 crisis/dream departure is from Bright Cold, not an arbitrary lower-realm scene.'},
                {id: 'cultivation.rt.topology.ham_host_world', kind: 'physical-host-world', boundary: 'Ham Jin’s actual world/vessel is distinct from Seo’s distant main-body location.'},
                {id: 'cultivation.rt.topology.ham_middle_zone', kind: 'spatial-relay-bubble', boundary: 'Not every coordinate called Lightning Sacred Sea is the final destination.'},
                {id: 'cultivation.rt.topology.salt_mountain', kind: 'memory-built-dream-world', boundary: 'Lived altered dream with its own forward history, not objective Bright Cold rollback.'}
            ],
            edges: [
                {id: 'cultivation.rt.edge.random_rift', from: 'cultivation.rt.topology.lower_realm', to: 'cultivation.rt.topology.lower_realm', evidenceId: 'RT-Q10', carriers: 'Present actors/herbs moved by capable rider; actual changed destination, not universal portal or regressor right.', clock: 'No proved regression or common outside ratio.'},
                {id: 'cultivation.rt.edge.host_relay', from: 'cultivation.rt.topology.ham_host_world', to: 'cultivation.rt.topology.ham_middle_zone', evidenceId: 'RT-0367-0374-C04', carriers: 'Consented actual host, finite energy/life, jade tablet and coordinates; linked injury remains.', clock: 'No global world/subjective conversion established.'},
                {id: 'cultivation.rt.edge.memory_dream', from: 'cultivation.rt.topology.bright_cold', to: 'cultivation.rt.topology.salt_mountain', evidenceId: 'RT-0455-0462-C09', carriers: 'Norigae/Light/Play supported cohort; uneven memories and severely limited body/source/inner-world access.', clock: 'Independent dream experience; no proved erased outside history.'}
            ],
            unknowns: ['Full ontology/outside clocks and exact all-body/equipment carry.', 'Ascension is distinct from regression; no arbitrary earlier-anchor control.', 'A dream resemblance cannot replace actual counterparts or revive dead source actors.'],
            nativeQualification: 'unactivated; no native source-era relay/dream/reset consumers', nativeConsumer: null,
            joins: ['source-qualified route/body/soul', 'consented host/source/fuel', 'separate destination/subjective clocks', 'known memory/identity projection']
        },
        deepChain: {
            id: 'cultivation.rt.chain.fragment_to_instruction', sourceVsOriginal: 'Original incomplete-method-to-earned-function chain using paid lessons and remembered-text source distinctions.',
            evidenceIds: ['RT-Q07', 'RT-Q09', 'RT-treatise-ord6', 'RT-Cheonji-ord5'],
            actorMeans: {instructor: 'Own actual competence, current lesson capacity and bounded school permission.', bursar: 'Actual fees/admission/attendance records, not mind-reading.', entrant: 'Herbs/proceeds, claimed text and present body/fuel.', peer: 'Own method interpretation and voluntary practice role.'},
            phases: [
                {id: 'fragment', prerequisites: 'Attributable original lesson notes or remembered text; no copied rank.', choices: ['honest uncertainty', 'claimed predecessor mastery', 'refusal'], next: ['preparation', 'closed_refusal']},
                {id: 'preparation', prerequisites: 'Actual ordinary proceeds/materials and learner-specific admission.', choices: ['fund ordinary lesson', 'request teacher comparison', 'keep herbs'], next: ['demonstration', 'closed_refusal']},
                {id: 'demonstration', prerequisites: 'Present understanding/body/source/fuel checked separately.', choices: ['use only learned portion', 'stop at missing comprehension', 'unsafe unsupported claim refused'], next: ['interpretation']},
                {id: 'interpretation', prerequisites: 'Peer/instructor sees actual performance and only knows disclosed fragment.', choices: ['correct mistaken purpose', 'cooperate on incomplete passage', 'withdraw dispute'], next: ['settlement']},
                {id: 'settlement', prerequisites: 'Actual instruction rights, material cost and achieved function.', choices: ['authorized transmission', 'retain private fragment', 'compensate real wasted lesson'], next: ['later_work']},
                {id: 'later_work', prerequisites: 'Same actors, retained admission and earned limited function.', choices: ['use function on an ordinary funded task', 'seek next qualified lesson', 'leave'], next: []}
            ],
            outcomes: {lawful: 'Specific learned function and accepted instruction right; no universal rank jump.', refusal: 'Keep stock/notes and ordinary livelihood.', partial: 'Remembered text retained while comprehension/function remains incomplete.', hostile: 'Specific false-mastery dispute or withdrawn access; no forced sect purge/boss.'},
            retainedAftermath: 'Lesson costs, actual pupil/instructor memories, private method limits and current-person relationships remain; no affection/XP/source copied from prior life.',
            nativeQualification: 'authoring/pure rule only, unactivated', nativeConsumer: null,
            joins: ['owned work proceeds', 'school admission', 'method mastery/body/source/fuel', 'Ink peer/instructor continuation']
        },
        interactions: {
            material: 'Herbs become real proceeds/medicine; clothes, residence permission and instruction compete for actual money. An old treatise is information, not fabricated stock.',
            learning: 'Memorized text, comprehension, Qi sensing, method control, body rebuilding and stored sword cultivation stay separate.',
            body: 'Ordinary hunger/injury, compatible present vessel, root eligibility and fatigue remain meaningful even around superior practitioners.',
            sourceFuel: 'Martial/internal means, spiritual cultivation and local reserves differ; a soul-linked source reservoir belongs to its actual carrier.',
            access: 'Seokyung paid outer admission and advanced Ham relay are separate places/eras; no universal sect-pass permission.',
            ordinaryAlternative: 'Fund lessons with actual ordinary work, buy specific instruction, keep a noncombat livelihood, wait for a willing teacher or withdraw.'
        },
        voices: [
            {id: 'cultivation.rt.voice.instructor', personId: 'cultivation.rt.person.instructor', sourceVsOriginal: 'Original lesson voice, ord5/6 learning cue', line: 'You remember the words. Good. Show me where your breath stops following them.'},
            {id: 'cultivation.rt.voice.bursar', personId: 'cultivation.rt.person.bursar', sourceVsOriginal: 'Original local voice, paid admission cue; no invented canonical price', line: 'Your family name can wait. I need the pupil’s name and who is paying for the lesson.'}
        ],
        rules: [
            recognition(['rt.seokyung.ord0005', 'rt.bright_cold.ord0298', 'rt.ham_relay.ord0373'], ['RT-Q09', 'RT-0367-0374-C01', 'RT-0295-0302-C01']),
            rule('remembered-method-execution', ['rt.seokyung.ord0005', 'rt.bright_cold.ord0298'], ['RT-treatise-ord6', 'RT-Cheonji-ord5'], [
                yes('actual.method.instructionsKnown', 'Instructions/remembered text must actually be available.'),
                yes('actual.method.understood', 'Memorization alone is not comprehension.'),
                yes('actual.method.executionLearned', 'The present actor needs practiced control.'),
                yes('actual.body.executionCompatible', 'The present body must perform the method.'),
                yes('actual.fuel.selectedMethodSufficient', 'Remembered cultivation does not create this reserve.')
            ], ['known method/understanding', 'mastery/body/source', 'native training or use command'], 'No automatic root, rank, XP or universal training times.'),
            rule('outer-lesson-access', ['rt.seokyung.ord0005'], ['RT-Q07', 'RT-Q09'], [
                same('actual.admission.learnerActorId', 'actual.actorId', 'The current learner needs its own admission.'),
                yes('actual.admission.actualPaymentCommitted', 'A claimed prior-life fee is not present payment.'),
                yes('actual.admission.institutionAccepted', 'An original donor’s title does not make the school accept this learner.'),
                yes('actual.admission.requestedLessonAuthorized', 'Outer admission does not authorize all inner techniques.')
            ], ['owned money/material acquisition', 'school rights', 'teacher availability', 'paid lesson native command'], 'Successful admission is permission, not a body/source/learned technique.'),
            rule('sword-reservoir-access', ['rt.bright_cold.ord0298'], ['RT-0295-0302-R01'], [
                check('actual.reserve.kind', 'equals', 'colorless-glass-sword-prior-cycle-reserve', 'The source is the specific sword-carried reserve.'),
                same('actual.reserve.carrierBodyId', 'actual.bodyId', 'A linked self does not automatically hold the main body’s sword reserve.'),
                yes('actual.reserve.bindingVerified', 'The actual source binding must be known.'),
                yes('actual.reserve.available', 'A remembered reservoir is not a present available reserve.')
            ], ['unique source/custody/carrier', 'local power availability', 'native supported draw command'], 'No universal no-retention rule; this specific reserve remains with its actual carrier.'),
            rule('ham-host-journey', ['rt.ham_relay.ord0373'], ['RT-0367-0374-C04'], [
                present('actual.host.actorId', 'Ham remains a separate actual host actor.'),
                yes('actual.host.explicitConsent', 'The selected source journey has consented borrowing.'),
                same('actual.host.controllerId', 'actual.controllerId', 'The current controller/body relation must be explicit.'),
                same('actual.host.bodyId', 'actual.bodyId', 'The action uses the actual host vessel.'),
                yes('actual.host.remainingJourneyMeansSufficient', 'Finite low-stage vessel energy/life cannot support unlimited jumps.'),
                yes('actual.host.injuryLinkAccounted', 'Remote and main-body linked injury must be handled by the native owner.'),
                yes('actual.route.jadeTabletAndCoordinatesReady', 'A named relay is not an unlocked arbitrary portal.')
            ], ['consented body/controller/soul carrier', 'shared injury and local fuel', 'actual route/tablet/coordinates', 'native journey command'], 'No host death, body duplication, unbounded travel, regression or copied local rights.'),
            rule('prior-life-relationship-claim', ['rt.seokyung.ord0005', 'rt.bright_cold.ord0298', 'rt.ham_relay.ord0373'], ['RT-0367-0374-C01', 'RT-Q01'], [
                yes('actual.relationship.currentPersonSeparate', 'A prior-life counterpart is its own actual present person.'),
                no('intent.automaticAffectionTransfer', 'Former affection does not transfer automatically.'),
                no('intent.automaticDebtTransfer', 'A former-life debt needs current supported history/terms.'),
                no('intent.automaticObserverRecall', 'A recalled meeting does not give its listener old-life memory.')
            ], ['directed relationship/memory owner', 'observer attributed testimony', 'Ink later meeting'], 'Permits an honest attributed memory claim; it grants no affection, obligation or temporal reset.')
        ],
        unknowns: ['Exact full regression anchor/initiator/stock and all observer-retention rules remain qualified.', 'Later explicit equipment/cultivation retention must not be erased by the opening absence of evidence.', 'No general soul-signature test, complete counterpart identity rule or common world clock.', 'No canonical prices or universal learner rates invented for the proposed lesson.'],
        bindingNeeds: ['Native Seokyung ordinary entrant and actual teacher/bursar.', 'Owned herbs/proceeds, specific school admission, current training/body/source.', 'Attributed prior-life claim and same-person attendance continuation; no regression activation.']
    }
});

// All wording/people below are original concise proposals, not copied source scenes.
export const cultivationBookSceneSpecs = freeze([
    {
        id: 'cultivation.fv.guest_errand', worldId: 'fated-villain', profileId: 'cultivation.fated_villain.v1',
        eraId: 'fv.taixuan.s0010', placeId: 'fv.taixuan.guest_hall', actualBranchId: null,
        proposedBranchId: 'cultivation.fv.guest_errand.branch.v1', sourceVsOriginal: 'Original scene using qualified opening hierarchy/tea/report cues.',
        peopleIds: ['cultivation.fv.person.porter', 'cultivation.fv.person.steward', 'cultivation.fv.person.rightful_runner'],
        itemIds: ['cultivation.fv.item.borrowed_livery', 'cultivation.fv.item.tea_tray'],
        opportunityIds: ['cultivation.fv.opportunity.authorized_errand'],
        entry: 'Ordinary entrant; rightful runner remains alive and keeps source, body, rights and obligations.',
        opening: 'The porter points a borrowed sleeve toward the guest hall. The steward asks whose tray it is.',
        choices: [
            {id: 'honest', text: 'Introduce yourself and ask for ordinary work.', requiredRuleIds: ['recognition']},
            {id: 'borrowed_livery', text: 'Offer the borrowed-livery claim for the porter’s visual check.', requiredRuleIds: ['recognition'], scope: 'appearance claim only; no office/source reward'},
            {id: 'permission', text: 'Ask the willing runner and steward for a specific errand handover.', requiredRuleIds: ['recognition'], scope: 'real rights/custody/duty native join required'},
            {id: 'refuse', text: 'Return the tray and leave the errand alone.', requiredRuleIds: []}
        ],
        continuationId: 'cultivation.fv.guest_errand.return',
        aftermath: 'The same porter remembers the introduction/livery claim; steward remembers authorization, actual duty and return. The lender keeps every untransferred carrier.',
        nativeConsumer: null, activation: 'unactivated', laterGate: 'Features carrier/permission/custody commitment plus Ink continuation; then deferred playable acceptance.'
    },
    {
        id: 'cultivation.ri.token_inspection', worldId: 'reverend-insanity', profileId: 'cultivation.reverend_insanity.v1',
        eraId: 'ri.shang.c0272', placeId: 'ri.shang.token_gate', actualBranchId: null,
        proposedBranchId: 'cultivation.ri.token_inspection.branch.v1', sourceVsOriginal: 'Original clerk encounter using reviewed c261/c271–272 services/token rules.',
        peopleIds: ['cultivation.ri.person.clerk', 'cultivation.ri.person.token_owner'],
        itemIds: ['cultivation.ri.item.borrowed_purple_token'],
        opportunityIds: ['cultivation.ri.opportunity.catalogue_service'],
        entry: 'Ordinary visitor; token owner remains alive, bound and separately controls their Gu.',
        opening: 'A shop clerk turns the wooden token over and asks for its actual bearer.',
        choices: [
            {id: 'binding_check', text: 'Ask for the token’s current binding check.', requiredRuleIds: ['purple-token-access', 'recognition']},
            {id: 'ordinary_service', text: 'Ask which ordinary catalogue service is available.', requiredRuleIds: ['recognition'], scope: 'real service price/access/stock native join required'},
            {id: 'owner', text: 'Return it and ask the actual owner to accompany you.', requiredRuleIds: ['recognition'], scope: 'owner consent and bounded access required'},
            {id: 'leave', text: 'Leave without buying or claiming a privilege.', requiredRuleIds: []}
        ],
        continuationId: 'cultivation.ri.token_inspection.return',
        aftermath: 'Same clerk remembers the invalid binding or proper return. Token rights stay with the actual bearer; paid stock and borrowed Bookworms have separate custody.',
        nativeConsumer: null, activation: 'unactivated', laterGate: 'Shang credential/service/item native bindings plus Ink remembered clerk; deferred playable acceptance.'
    },
    {
        id: 'cultivation.rt.lesson_permit', worldId: 'regressors-tale', profileId: 'cultivation.regressors_tale.v1',
        eraId: 'rt.seokyung.ord0005', placeId: 'rt.seokyung.lesson_court', actualBranchId: null,
        proposedBranchId: 'cultivation.rt.lesson_permit.branch.v1', sourceVsOriginal: 'Original pupil/instructor/bursar using qualified paid admission and learning cues.',
        peopleIds: ['cultivation.rt.person.instructor', 'cultivation.rt.person.bursar', 'cultivation.rt.person.current_pupil'],
        itemIds: ['cultivation.rt.item.herb_bundle', 'cultivation.rt.item.lesson_notes'],
        opportunityIds: ['cultivation.rt.opportunity.outer_lesson'],
        entry: 'Ordinary current learner; no Seo regression, counterpart affection or predecessor office.',
        opening: 'The bursar records the current pupil’s name. In the court, the instructor waits to see a complete breath.',
        choices: [
            {id: 'honest_lesson', text: 'Request the ordinary lesson you can actually fund.', requiredRuleIds: ['outer-lesson-access', 'recognition']},
            {id: 'remembered_text', text: 'Explain the remembered method as your own attributed claim.', requiredRuleIds: ['remembered-method-execution', 'recognition'], scope: 'text claim only until present control is demonstrated'},
            {id: 'old_meeting', text: 'Describe the earlier-life meeting without demanding a debt.', requiredRuleIds: ['prior-life-relationship-claim', 'recognition']},
            {id: 'keep_herbs', text: 'Keep the herbs and decline admission.', requiredRuleIds: []}
        ],
        continuationId: 'cultivation.rt.lesson_permit.return',
        aftermath: 'The same bursar remembers payment/attendance and corrected identity claim; instructor recognizes actual learned practice, not copied former rank.',
        nativeConsumer: null, activation: 'unactivated', laterGate: 'Current admission/owned herb proceeds/training/observer memory bindings plus Ink continuation; deferred playable acceptance.'
    }
]);

// Manifest metadata pins only; no novel prose is imported or stored.
export const cultivationBookSourcePins = freeze({
    "fated-villain": [
        {
            "ordinal": 1,
            "title": "Chapter 1: Young Master Gu Changge",
            "member": "temp_copyright_1770454724_I Am the Fated Villain (gemini-2.5-flash) ENG_split_001.html",
            "anchor": "calibre_toc_2",
            "text_sha256": "2e5c6666d44dc84986b035e33faebac60299ace72f23e3c601445e46e0f1d1bd",
            "member_sha256": "409c47d06b3277a9840363c1c377101207bee2e4ef18520a45a806eb92afb53e"
        },
        {
            "ordinal": 4,
            "title": "Chapter 4: Black Fortuity, Must Be Trampled Slowly",
            "member": "temp_copyright_1770454724_I Am the Fated Villain (gemini-2.5-flash) ENG_split_001.html",
            "anchor": "calibre_toc_5",
            "text_sha256": "fbdf9f60a5eca7a4e823f25a2ee19c0673c33d5d9045da1b43d80f003ea2263b",
            "member_sha256": "409c47d06b3277a9840363c1c377101207bee2e4ef18520a45a806eb92afb53e"
        },
        {
            "ordinal": 5,
            "title": "Chapter 5: The Moonlight is Beautiful Tonight, Destiny Points are Easy to Earn",
            "member": "temp_copyright_1770454724_I Am the Fated Villain (gemini-2.5-flash) ENG_split_001.html",
            "anchor": "calibre_toc_6",
            "text_sha256": "cc6b80a192a880bbc234ae4ae8ab303b3c0f66e4d1cd052ee26b7373414f6326",
            "member_sha256": "409c47d06b3277a9840363c1c377101207bee2e4ef18520a45a806eb92afb53e"
        },
        {
            "ordinal": 6,
            "title": "Chapter 6: Two Souls, One Body: The Supreme Mystery Sacred Lord's Predicament",
            "member": "temp_copyright_1770454724_I Am the Fated Villain (gemini-2.5-flash) ENG_split_001.html",
            "anchor": "calibre_toc_7",
            "text_sha256": "3b68bfdeac4983fa72317f7b2c727637970e709f441bd519c36e11ac593df1ed",
            "member_sha256": "409c47d06b3277a9840363c1c377101207bee2e4ef18520a45a806eb92afb53e"
        },
        {
            "ordinal": 8,
            "title": "Chapter 8: Cutting Leeks, Ye Chen's Mysterious Master",
            "member": "temp_copyright_1770454724_I Am the Fated Villain (gemini-2.5-flash) ENG_split_001.html",
            "anchor": "calibre_toc_9",
            "text_sha256": "9b7c5c4a4d0a8d6b7b1f7cb2d003e8576ba4ad085ff6f2999475e55484219ece",
            "member_sha256": "409c47d06b3277a9840363c1c377101207bee2e4ef18520a45a806eb92afb53e"
        },
        {
            "ordinal": 9,
            "title": "Chapter 9: Yan Ji, The So-Called Letting Go to Catch",
            "member": "temp_copyright_1770454724_I Am the Fated Villain (gemini-2.5-flash) ENG_split_001.html",
            "anchor": "calibre_toc_10",
            "text_sha256": "394b05b6f6774616984fdfcb5f8cc8796aa695e2bc8884959f2dbd785f8373dc",
            "member_sha256": "409c47d06b3277a9840363c1c377101207bee2e4ef18520a45a806eb92afb53e"
        },
        {
            "ordinal": 1228,
            "title": "Chapter 1100",
            "member": "temp_copyright_1770454724_I Am the Fated Villain (gemini-2.5-flash) ENG_split_071.html",
            "anchor": "calibre_toc_1229",
            "text_sha256": "fe9c16aa730d59320efde9e38efff1367896e1717f40f64d955ad68cf255111e",
            "member_sha256": "b0261421b5c97740690b511cf67a1a46c46e2b6d6cfb75d42af6b1f1f2745a6d"
        },
        {
            "ordinal": 1690,
            "title": "Chapter 1484",
            "member": "temp_copyright_1770454724_I Am the Fated Villain (gemini-2.5-flash) ENG_split_097.html",
            "anchor": "calibre_toc_1691",
            "text_sha256": "4d0a7b4a73fc0917273a99f9551b258ea59b8ae80945f7db4514396a2daddbf6",
            "member_sha256": "d36d48689ee72f9d2c9cfa391f15a25201bf5a3f19bb756c938717a25bced0bc"
        },
        {
            "ordinal": 1695,
            "title": "Chapter 1488: Identity",
            "member": "temp_copyright_1770454724_I Am the Fated Villain (gemini-2.5-flash) ENG_split_097.html",
            "anchor": "calibre_toc_1696",
            "text_sha256": "dc8e2952478131bd8a1fa5916f456a6307d2495f1f09595d500e14e191d7ceef",
            "member_sha256": "d36d48689ee72f9d2c9cfa391f15a25201bf5a3f19bb756c938717a25bced0bc"
        },
        {
            "ordinal": 2072,
            "title": "Chapter 1790",
            "member": "temp_copyright_1770454724_I Am the Fated Villain (gemini-2.5-flash) ENG_split_119.html",
            "anchor": "calibre_toc_2073",
            "text_sha256": "e7190352a322f60d75db34465df72c4ce241f96b62d15540b88aa7ebbe171554",
            "member_sha256": "a4eadfaa4734c25936f9839303f695bde3bdb747b39bcadc8df110dc3652872f"
        },
        {
            "ordinal": 2166,
            "title": "Chapter 1872",
            "member": "temp_copyright_1770454724_I Am the Fated Villain (gemini-2.5-flash) ENG_split_124.html",
            "anchor": "calibre_toc_2167",
            "text_sha256": "5b57786f4f75ebea9c5e9b49b58bb54909bdbdce83b9cc486b5bc1eb0e6ab2c5",
            "member_sha256": "b2a62370985c7030e28358418b785fba54e659fdf045ff7cf0cdcff28595f554"
        }
    ],
    "reverend-insanity": [
        {
            "chapter": 12,
            "title": "Chapter 12 - Green Bamboo Wine is fragrant, Gu Master flaunts power",
            "member": "EPUB/chapter_12.xhtml",
            "member_sha256": "63bac53ce148b85339a1bd1e114f8f449d55f77da7e65e9e78e59487b5e838af"
        },
        {
            "chapter": 22,
            "title": "Chapter 22 - Dancing Moonblade",
            "member": "EPUB/chapter_22.xhtml",
            "member_sha256": "e533d9c604d7161c29b148a0ad86f7a844ac25224f54dd5a8b250be67ff85e04"
        },
        {
            "chapter": 23,
            "title": "Chapter 23 - Raising a Gu is like raising a mistress",
            "member": "EPUB/chapter_23.xhtml",
            "member_sha256": "2ace3f4c7d3a72ff44c4fc47592f8465800d61d0ba7b27eeedd0ab4d78de2091"
        },
        {
            "chapter": 57,
            "title": "Chapter 57 - A gentleman’s lie",
            "member": "EPUB/chapter_57.xhtml",
            "member_sha256": "253180a0e2dc08d172397ad5ecd864fdda753b72eba06d01555cbd4f961a4f5d"
        },
        {
            "chapter": 96,
            "title": "Chapter 96 - For the sake of those who died",
            "member": "EPUB/chapter_96.xhtml",
            "member_sha256": "8ef3eb137e5f13c91576b209c11b4a0c352a80ba63057d4be0596ae45afd4b4e"
        },
        {
            "chapter": 138,
            "title": "Chapter 138 - Someone is actually chasing and trying to kill Bai Ning Bing?",
            "member": "EPUB/chapter_138.xhtml",
            "member_sha256": "0bdcd6d54e576b2d59b5190f278d484fc8840dc30f661835db97490153e22203"
        },
        {
            "chapter": 156,
            "title": "Chapter 156 - Digital Shade Recipe, Flower Wine mystery",
            "member": "EPUB/chapter_156.xhtml",
            "member_sha256": "bf6cc247824543604dcd54d542798a6e58e6f7a2d19bda51224cf36a1659b0ad"
        },
        {
            "chapter": 261,
            "title": "Chapter 261 - Shang Clan Inner City",
            "member": "EPUB/chapter_261.xhtml",
            "member_sha256": "04c234e9a25e5729f204a360bea92c68400fd5813e3c62ac8b5830c3710a6186"
        },
        {
            "chapter": 271,
            "title": "Chapter 271 - Purple Thorn Token",
            "member": "EPUB/chapter_271.xhtml",
            "member_sha256": "9903def4e7cc138b191f3387342ce47e1b84a63e6b4026357a2f22d4f35971d8"
        },
        {
            "chapter": 272,
            "title": "Chapter 272 - New Alliance Agreements",
            "member": "EPUB/chapter_272.xhtml",
            "member_sha256": "33bbc6a82a369eea6505367d61f3dc34b36d61ca0e010d9c188f51d327fd1fed"
        },
        {
            "chapter": 346,
            "title": "Chapter 346 - First entry into King Quan Inheritance",
            "member": "EPUB/chapter_346.xhtml",
            "member_sha256": "d1a70773dfe1279374bbdaf76a7fe140e40852e286748203c9e5a9469a6a9ade"
        },
        {
            "chapter": 350,
            "title": "Chapter 350 - Dog Guts Gu",
            "member": "EPUB/chapter_350.xhtml",
            "member_sha256": "0f2da42615407d2ce5f782d4a797c8250e29857ce4fce2db44b0c74b6baa8fa6"
        },
        {
            "chapter": 351,
            "title": "Chapter 351 - Multitask Gu",
            "member": "EPUB/chapter_351.xhtml",
            "member_sha256": "77901dbbd0a8bdc80ed8a1669768647fe9fbc21257f043c6a12e7de3bac058fc"
        },
        {
            "chapter": 352,
            "title": "Chapter 352 - Casually Killed",
            "member": "EPUB/chapter_352.xhtml",
            "member_sha256": "703db5fd5782f66458d4be9cbffdc74a408ff9254f51b75a307b8dab89694da6"
        }
    ],
    "regressors-tale": [
        {
            "ordinal": 1,
            "title": "Prologue",
            "member": "OEBPS/chapter0.html",
            "member_sha256": "b674890b12be7986f42f9bdff1c3402349047eeb1beef890da55ff1ee9a5b6c7"
        },
        {
            "ordinal": 4,
            "title": "Chapter 3: Scattering Destiny (2)",
            "member": "OEBPS/chapter3.html",
            "member_sha256": "7e824b20a0db83c44e31526a3e814037062baae05b6b0dc96a411817521311eb"
        },
        {
            "ordinal": 5,
            "title": "Chapter 4: Director Kim is a Martial Genius (1)",
            "member": "OEBPS/chapter4.html",
            "member_sha256": "0128bd6d603f76ef172c7a73b62a110f36d2fc8176cd5994a8b9c2898d5042f9"
        },
        {
            "ordinal": 6,
            "title": "Chapter 5: Director Kim is a Martial Genius (2)",
            "member": "OEBPS/chapter5.html",
            "member_sha256": "b704b9d633fbdecbaf1a85c574063011a28663ffb560b17005aa465cd740658a"
        },
        {
            "ordinal": 295,
            "title": "Chapter 291: Avenger (1)",
            "member": "OEBPS/chapter294.html",
            "member_sha256": "12bdeea2937654463245e46d77cf458b54fd2b9038d00ff93968169e7edabb51"
        },
        {
            "ordinal": 298,
            "title": "Chapter 294: Avenger (4)",
            "member": "OEBPS/chapter297.html",
            "member_sha256": "bc10989037806d4e49a5ea47a764760d7ee942889def608b955d89b2a9601452"
        },
        {
            "ordinal": 300,
            "title": "Chapter 296: Her (2)",
            "member": "OEBPS/chapter299.html",
            "member_sha256": "a02f1dda35d8c6c9efbff6b1cf256e0ef5891556f66553be23d0638791150c7a"
        },
        {
            "ordinal": 331,
            "title": "Chapter 326",
            "member": "OEBPS/chapter330.html",
            "member_sha256": "559a589e719c0681c1bf00fbd1e668b2e04eb6b8cc348e8e4917da11ba219425"
        },
        {
            "ordinal": 367,
            "title": "Chapter 363: Is It Not A Joy To Have Friends Come From Afar? (7)",
            "member": "OEBPS/chapter366.html",
            "member_sha256": "799ac02b5d72275a60a4af535693ee87f244a7950311f1da070be02777fb65c3"
        },
        {
            "ordinal": 373,
            "title": "Chapter 369: Holding Hands (6)",
            "member": "OEBPS/chapter372.html",
            "member_sha256": "57c623f075c2b33fe5d9e38d3b704a67c2c9e29ed74f079f0ac6732044187eed"
        },
        {
            "ordinal": 374,
            "title": "Chapter 370: Holding Hands (7)",
            "member": "OEBPS/chapter373.html",
            "member_sha256": "23dcf427affc1a56976a9489bf9924848d3c733fa46d0d217479ae6dd3aeb94d"
        },
        {
            "ordinal": 461,
            "title": "Chapter 457: Key (2)",
            "member": "OEBPS/chapter460.html",
            "member_sha256": "1eda3d3e7d444a7b0cd602879d286279d8a7b9df3fd0bcf78dfa9be29e75b5b2"
        },
        {
            "ordinal": 462,
            "title": "Chapter 458: Key (3)",
            "member": "OEBPS/chapter461.html",
            "member_sha256": "516ff2bcdfccfc880e2af47b82aef78c79604c7ce3ebdbb9e63ac5b2d92c4435"
        },
        {
            "ordinal": 474,
            "title": "Chapter 470: 701st Cycle's First Day. And...",
            "member": "OEBPS/chapter473.html",
            "member_sha256": "f5662f88b9c29c0160f364a02c769ca728fc73428ef07911cbc909fe46d11a03"
        }
    ]
});

export function getCultivationBookProfile(worldId) {
    return Object.hasOwn(cultivationBookProfiles, worldId) ? cultivationBookProfiles[worldId] : null;
}

const at = (object, path) => path.split('.').reduce((value, key) =>
    value && typeof value === 'object' && Object.hasOwn(value, key) ? value[key] : undefined, object);
const isPresent = value => value !== undefined && value !== null && value !== '';
const validId = value => typeof value === 'string' && value.trim().length > 0;
const outcome = (profile, ruleId, status, reasons, missing = [], extra = {}) => freeze({
    profileId: profile?.id ?? null, worldId: profile?.worldId ?? null, ruleId, status,
    authorOnlyReasons: reasons, missingSnapshotFields: missing,
    evidenceIds: profile?.rules.find(row => row.id === ruleId)?.evidenceIds ?? [],
    demandedNativeJoins: profile?.rules.find(row => row.id === ruleId)?.joins ?? [],
    nativeConsumer: null, activation: 'unactivated', commitmentAllowed: false,
    // Reasons can reference actual private truth. A host must use Legibility to
    // project known facts; these messages are never direct player UI copy.
    playerExplanation: null, ...extra
});

/**
 * snapshot.context = {editionSha256, eraId, placeId, entryMode, actualBranchId,
 *   branchKind: 'source-baseline'|'original-divergence'};
 * snapshot.actual = {actorId,bodyId,controllerId,soulId,...rule-specific fields};
 * snapshot.observer = {id,requestedTests?,evidence?}; snapshot.intent = {...}.
 * No inference of an absent false/true field: absence is unknown.
 * Recognition evidence rows explicitly name observerId, subjectActorId,
 * branchId, evidenceId, test and outcome ('match'|'mismatch'|'inconclusive').
 */
export function evaluateCultivationBookRule(worldId, ruleId, snapshot) {
    const profile = getCultivationBookProfile(worldId);
    if (!profile) return outcome(null, ruleId, 'unknown', ['Unknown cultivation world profile.']);
    const selected = profile.rules.find(row => row.id === ruleId);
    if (!selected) return outcome(profile, ruleId, 'unknown', ['Unknown rule in this profile.']);
    if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) {
        return outcome(profile, ruleId, 'unknown', ['An actual carrier and observer snapshot is required.'], ['snapshot']);
    }
    const required = ['context.editionSha256', 'context.eraId', 'context.placeId', 'context.entryMode',
        'context.actualBranchId', 'context.branchKind', 'actual.actorId', 'actual.bodyId',
        'actual.controllerId', 'actual.soulId', 'observer.id'];
    const absent = required.filter(path => !validId(at(snapshot, path)));
    if (absent.length) return outcome(profile, ruleId, 'unknown', ['Required actual context/carrier/observer IDs are missing.'], absent);
    const context = snapshot.context;
    if (context.editionSha256 !== profile.edition.sha256) return outcome(profile, ruleId, 'unknown', ['This edition has not been qualified by the profile.']);
    const era = profile.context.eras.find(row => row.id === context.eraId);
    if (!era || !selected.eraIds.includes(era.id) || !era.placeIds.includes(context.placeId)) {
        return outcome(profile, ruleId, 'unknown', ['No reviewed rule binding for this exact era/place.']);
    }
    if (!era.entryModes.includes(context.entryMode)) return outcome(profile, ruleId, 'unknown', ['This entry mode requires a separately qualified native body/role profile.']);
    if (!['source-baseline', 'original-divergence'].includes(context.branchKind)) return outcome(profile, ruleId, 'unknown', ['Branch kind must explicitly separate baseline from altered history.']);
    if (selected.exception === 'source-baseline-blocked' && context.branchKind === 'source-baseline') {
        return outcome(profile, ruleId, 'blocked', ['At this source cutoff the original key tools were remelted; unchanged availability contradicts baseline history.']);
    }
    if (ruleId === 'recognition') return evaluateRecognition(profile, snapshot);
    const failed = [], missing = [];
    for (const entry of selected.checks) {
        const actual = at(snapshot, entry.path);
        const expected = entry.kind === 'same-path' ? at(snapshot, entry.expected) : entry.expected;
        if (!isPresent(actual) || (entry.kind === 'same-path' && !isPresent(expected))) {
            missing.push(entry.path);
            continue;
        }
        const matches = entry.kind === 'present' ? validId(actual)
            : entry.kind === 'one-of' ? entry.expected.includes(actual)
                : actual === expected;
        if (!matches) failed.push(entry.reason);
    }
    if (failed.length) return outcome(profile, ruleId, 'blocked', failed, missing);
    if (missing.length) return outcome(profile, ruleId, 'unknown', ['The actual rule prerequisites have not all been supplied.'], missing);
    return outcome(profile, ruleId, 'supported', ['The supplied actual snapshot fits this scoped prerequisite rule. Native commitment is still unbound.']);
}

function evaluateRecognition(profile, snapshot) {
    const observer = snapshot.observer;
    if (!validId(snapshot.intent?.claimId) || !validId(snapshot.intent?.claimedActorId)) {
        return outcome(profile, 'recognition', 'unknown', ['Recognition requires a separately attributed claim ID and claimed actor ID.'], ['intent.claimId', 'intent.claimedActorId']);
    }
    if (!Array.isArray(observer.requestedTests) || !observer.requestedTests.length ||
        !Array.isArray(observer.evidence)) {
        return outcome(profile, 'recognition', 'unknown', ['One named observer must supply its demanded tests and attributed evidence.'], ['observer.requestedTests', 'observer.evidence']);
    }
    const demands = [...new Set(observer.requestedTests)], failed = [], missing = [];
    for (const test of demands) {
        if (test === 'soul_signature') {
            missing.push('observer.unqualifiedSourceFaculty:soul_signature');
            continue;
        }
        if (!Object.hasOwn(profile.recognitionTests, test)) {
            missing.push(`observer.unsupportedTest:${String(test)}`);
            continue;
        }
        const rows = observer.evidence.filter(row => row && row.test === test &&
            row.observerId === observer.id && row.subjectActorId === snapshot.actual.actorId &&
            row.claimId === snapshot.intent.claimId && row.branchId === snapshot.context.actualBranchId && validId(row.evidenceId));
        if (!rows.length || rows.some(row => !['match', 'mismatch', 'inconclusive'].includes(row.outcome))) {
            missing.push(`observer.evidence:${test}`);
        } else if (rows.some(row => row.outcome === 'mismatch') && rows.some(row => row.outcome === 'match')) {
            missing.push(`observer.conflictingEvidence:${test}`);
        } else if (rows.some(row => row.outcome === 'mismatch')) {
            failed.push(`This named observer’s ${test} evidence does not match the attributed claim.`);
        } else if (rows.some(row => row.outcome === 'inconclusive')) {
            missing.push(`observer.inconclusiveEvidence:${test}`);
        }
    }
    const status = failed.length ? 'blocked' : missing.length ? 'unknown' : 'supported';
    return outcome(profile, 'recognition', status, failed.length ? failed : missing.length
        ? ['The observer’s demanded evidence is absent, conflicting or inconclusive.']
        : ['Only this observer’s requested recognition tests match; actual identity and carriers remain unchanged.'], missing,
    {conclusionScope: 'named-observer-recognition-only', observerId: observer.id,
        observerConclusion: status, carrierTransfers: []});
}
