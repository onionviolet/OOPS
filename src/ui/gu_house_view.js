// Gu house (surface: lower-center beginning panel, desktop first). Gauges, per-Gu feed timers and a stipend ledger,
// drawn from keeperHouseView(). Text is the whole form; the meters only repeat it (UR37). Every node carries a data-gu hook.
import {renderGuMoves} from './gu_moves_view.js';
const span = minutes => minutes >= 1440 ? `${(minutes / 1440).toFixed(minutes % 1440 ? 1 : 0)} days` : minutes >= 60 ? `${Math.round(minutes / 60)} hours` : `${Math.max(0, minutes)} min`;
const signed = n => n > 0 ? `+${n}` : String(n);
export function renderGuHouse(parent, house) {
    const doc = parent.ownerDocument;
    const el = (tag, text, host = parent, attrs = {}) => { const n = doc.createElement(tag); if(text != null) n.textContent = String(text); for(const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); host.append(n); return n; };
    const root = el('section', null, parent, {class: 'gu-house', 'data-gu': 'root', 'aria-label': 'Gu house'});
    el('h4', 'Gu house', root);
    if(house.vitalityGarden) {
        const {held, leaves, capacity, detached, growthWait, treatmentWait} = house.vitalityGarden;
        el('p', ['Nine Leaf Vitality Grass', held ? 'in your care' : 'with the steward', `${leaves}/${capacity} on the stem`,
            `${detached} plucked`, growthWait && `stem settling · ${span(growthWait)}`,
            treatmentWait && `next leaf treatment · ${treatmentWait} min`].filter(Boolean).join(' · '),
            root, {'data-gu': 'vitality-garden', role: 'status'});
    }
    const g = house.gauge;
    if(g) {
        const wrap = el('div', null, root, {'data-gu': 'aperture'});
        el('p', `Aperture · ${g.text}`, wrap);
        const m = el('meter', null, wrap, {min: 0, max: g.max, value: g.now, 'aria-label': 'Primeval essence reserve', 'data-gu': 'essence-meter'});
        m.textContent = `${g.now} of ${g.max}`;
        el('p', g.now >= g.max ? 'The sea is full at your aptitude cap; more rest cannot raise it.' : `Next unit in ${span(g.nextRegenIn)}. A Gu activation costs ${g.perActivation}.`, wrap);
    }
    el('p', house.feedingCap.line, root, {'data-gu': 'feeding-cap', role: 'status'});
    if(house.colony) {
        const {ordinary, emerged, starGrass, light, pending, kept} = house.colony;
        el('p', `Firefly bed · ${ordinary} ordinary fireflies · ${emerged} Gu ready to collect · ${starGrass} patches of star fragment grass · ${light === 'shaded' ? 'shaded' : 'open to sun'}${pending ? ' · check the overdue bed' : ''}`,
            root, {'data-gu': 'firefly-bed'});
        if(kept) el('p', `Firefly enclosure · ${kept.resting ? 'resting in the shade' : kept.tired ? 'needs rest' : 'ready to shine'}`,
            root, {'data-gu': 'firefly-enclosure'});
    }
    if(house.gateSky) {
        const {clear, annex, observatory} = house.gateSky;
        const condition = clear ? `Gu house ${annex ? 'lit' : 'dim'} · hill ${observatory ? 'lit' : 'dim'}` : 'rain obscures the stars';
        el('p', `Stargate starlight · ${condition}`, root, {'data-gu': 'stargate-sky', role: 'status'});
    }
    if(house.wildWorm) {
        const {phase, controlled, refuge, familiar, canFind, essence, fourFlavors, redSteel, seven, nine, roam} = house.wildWorm;
        const trail = {
            trail: 'spotted at the border', sheltered: refuge ? 'hiding in its refuge' : 'left a trace through the grass',
            lured: 'approached the wine', held: controlled ? 'in your enclosure · refined' : 'in your enclosure · wild will',
            released: canFind ? 'released · its trail can be followed again' : 'released · give it time to settle',
            roaming: roam?.returning ? 'away from the border · wine waiting' : 'left the border · trail went cold',
            fused: 'used in the Four Flavors fusion',
        };
        el('p', `Wild Liquor Worm · ${trail[phase]}${familiar ? ' · recognizes your scent' : ''}`,
            root, {'data-gu': 'wild-worm', role: 'status'});
        if(essence) {
            const meal = phase === 'held' ? ` · ${essence.fed ? 'Worm fed' : 'Worm needs wine'}` : '';
            const cut = essence.lastCut ? ` · last refined Moonblade cut ${essence.lastCut * 4} sheets` : '';
            el('p', `Rank-one green-copper essence · ${essence.middle} middle-stage ${essence.middle === 1 ? 'measure' : 'measures'}${meal}${cut}`,
                root, {'data-gu': 'worm-essence', role: 'status'});
        }
        if(fourFlavors) el('p', `Four Flavors Liquor Worm · rank ${fourFlavors.rank} · in your care`,
            root, {'data-gu': 'four-flavors-worm', role: 'status'});
        if(redSteel) {
            const cut = redSteel.lastCut ? ` · last Moonglow cut ${redSteel.lastCut} straw bundles` : '';
            const worm = seven?.status === 'working' ? 'Four Flavors at the furnace' : seven?.status === 'complete' ?
                'Four Flavors used in the fusion' : redSteel.fed ? 'Four Flavors fed' : 'Four Flavors needs wine';
            el('p', `Rank-two red steel · ${redSteel.stock} upper-stage measures · ${worm}${cut}`,
                root, {'data-gu': 'worm-red-steel', role: 'status'});
        }
        if(seven) {
            const status = nine?.status === 'working' ? 'bound in the Nine Eyes fusion' : nine?.status === 'complete' ?
                'used in the Nine Eyes fusion' : seven.status === 'working' ? (seven.remaining ? `fusion settling · ${span(seven.remaining)} left` : 'fusion ready to finish') :
                seven.status === 'cancelled' ? 'fusion stopped · both Worms survived' :
                    `rank 3 · ${seven.fed ? 'Worm fed' : 'Worm needs wine'} · ${seven.stock} upper-stage white-silver measures`;
            const strike = seven.lastStrike ? ` · Thunderclap struck with force ${seven.lastStrike}` : '';
            el('p', `Seven Fragrances Liquor Worm · ${status}${strike}`, root, {'data-gu': 'seven-fragrances-worm', role: 'status'});
        }
        if(nine) {
            const {status, readyIn, closesIn, fed, stock, lastDistance} = nine;
            const work = status === 'working' ? (readyIn ? `fusion settling · ${span(readyIn)} left` :
                closesIn ? `ready to tend · ${span(closesIn)} of warmth left` : 'the prepared eyes have gone cold') :
                status === 'failed' ? 'fusion failed · both Worms survived · fresh eyes needed' :
                status === 'cancelled' ? 'fusion stopped · both Worms survived' :
                    `rank 4 · ${fed ? 'Worm fed' : 'Worm needs wine'} · ${stock} middle-stage yellow-gold measures`;
            const cast = lastDistance ? ` · Charging Crash covered ${lastDistance} paces` : '';
            el('p', `Nine Eyes Liquor Worm · ${work}${cast}`, root, {'data-gu': 'nine-eyes-worm', role: 'status'});
        }
    }
    if(house.hostedWolf) {
        const {held, wounded, careUntil, dead, gu, struck, ridge, smoke, stealth, defense} = house.hostedWolf;
        const wolf = dead ? 'killed in the hunt' : `${held ? 'in the shelter' : 'on the trail'} · ${wounded ? 'injured leg' : 'sound'}${careUntil ? ' · under care' : ''}`;
        const specimen = gu ? ` · Thunderclap ${gu.custody === 'host' ? 'living on the wolf' : gu.custody === 'lost' ? 'lost in the hunt' : gu.controlled ? 'refined and in your care' : 'captured with wild will'}` : '';
        el('p', `Lightning wolf · ${wolf}${specimen}${struck ? ' · Thunderclap struck the target post' : ''}`,
            root, {'data-gu': 'hosted-wolf', role: 'status'});
        if(defense) {
            const section = el('div', null, root, {'data-gu': 'layered-defense', role: 'status'});
            const guards = {'water-shield': 'Water Shield', 'white-jade': 'White Jade', 'scale-armor': 'Scale Armor'};
            el('p', [defense.shotIn ? `Thunderclap ready in ${defense.shotIn} min` : 'Thunderclap ready',
                defense.shieldIn ? `Water Shield recovering · ${defense.shieldIn} min` : 'Water Shield ready'].join(' · '), section);
            if(defense.last) {
                const [blast, landing] = defense.last.remainder;
                el('p', `Blast took ${blast.amount} health · Landing took ${landing.amount} health`, section);
                for(const layer of defense.last.layers) {
                    el('p', `${guards[layer.id]} stopped ${layer.absorbed}${layer.broken ? ' and broke' : ''}`, section);
                }
            }
            if(defense.research) {
                const research = el('div', null, section, {'data-gu': 'defense-research'});
                el('p', `Blast lane · Hunter’s practice limit ${defense.research.limit} health · 1 white-silver dose per crossing`, research);
                const leads = {
                    'white-jade': 'Bring a sound White Jade Gu. Ask the steward at the Gu house.',
                    'water-shield': 'The hunter’s Water Shield is still recovering.',
                    'scale-armor': stealth?.armorJob && stealth.status === 'working'
                        ? 'Finish the Scale Armor at the bench to test a softer landing.'
                        : 'For a softer landing, trade a wolf eye or pay the hunter for Fish Scale, then refine Scale Armor.',
                };
                for(const kind of defense.research.missing) el('p', leads[kind], research);
                if(!defense.research.options.length) el('p', 'No combination of ready Gu fits the limit with your current essence.', research);
                for(const plan of defense.research.options) {
                    const label = plan.kinds.map(kind => guards[kind]).join(' + ');
                    el('p', `${label} · ${plan.cost} essence · Blast ${plan.blast} health · Landing ${plan.landing} health`, research);
                }
            }
        }
        if(stealth) {
            const {rock, fish, controlled, cloak, armor, armorJob, status, remaining, testedRock, testedScales, crossed, armorGuarded} = stealth;
            const work = status === 'working' ? (remaining ? `${armorJob ? 'Fish Scale in the shell laminate' : 'both Gu at the bench'} · ${span(remaining)} left` : 'the fusion is ready') :
                status === 'cancelled' ? `fusion stopped · ${armorJob ? 'Fish Scale survived' : 'both Gu survived'}` : '';
            const inputs = status !== 'working' && [rock && `Stealth Rock ${controlled ? 'refined' : 'in your care with wild will'}`,
                fish && 'Fish Scale in your care'].filter(Boolean).join(' · ');
            el('p', ['Fish Scale work', work, inputs, cloak && 'rank-two Stealth Scales in your care', armor && 'rank-two Scale Armor in your care',
                testedRock && 'Stealth Rock hid you but left your sash visible', testedScales && 'Stealth Scales hid the sash · the hound caught your scent',
                crossed && 'you passed the watch screen', armorGuarded && 'Scale Armor stopped the falling stone'].filter(Boolean).join(' · '),
                root, {'data-gu': 'stealth-fusion', role: 'status'});
        }
        if(smoke && smoke.site !== 'away') {
            const section = el('section', null, root, {'data-gu': 'smoke-passage', role: 'status'});
            const wrong = {wolves: 'You backed away from the wolf pack.', bank: 'The bank gave way. You scrambled back.'}[smoke.wrong];
            const ally = smoke.ally ? `Steward beside you · ${smoke.reserve} listening doses left` : 'The steward is away';
            el('p', [smoke.site === 'exit' ? 'Clearing reached' : 'Smoke passage', ally, wrong,
                smoke.expired && 'The earlier signs have faded'].filter(Boolean).join(' · '), section);
            if(smoke.clues.length) {
                const clues = el('ul', null, section);
                for(const clue of smoke.clues) el('li', clue, clues);
            }
        }
        if(ridge) {
            const change = {marked: 'the first wolf returned', fresh: 'fresh trail found', returned: 'the same wolf returned',
                spared: 'wolf left alive', hunted: 'wolf taken out of the pack', flew: 'Thunderwings reached the shelf'}[ridge.last];
            const sign = ridge.focus ? ` · ${ridge.focus.mark.replaceAll('-', ' ')} · ${ridge.focus.hosted === 'wings' ? 'Thunderwings on the wolf' : 'no Gu sighted'}` : '';
            const wings = ridge.wingState ? ` · Thunderwings ${ridge.wingState === 'refined' ? 'ready for white silver' : 'in your care with wild will'}` : '';
            el('p', `Wolf ridge · ${ridge.hares} hares · ${ridge.wolves} wolves · ${ridge.pending ? 'check the tracks again' : `tracks change in ${span(ridge.next)}`}${change ? ` · ${change}` : ''}${sign}${wings}`,
                root, {'data-gu': 'wolf-ridge', role: 'status'});
            if(ridge.scouting) {
                const {moved, dead, custody, plain, plainOwned, result, cache, quietIn} = ridge.scouting;
                const approach = {seen: 'Lightning Eye saw through Stealth Scales', hidden: 'Stealth Scales hid you from the crown wolf',
                    screened: 'the stone bank kept you out of sight'}[result];
                const eye = custody === 'captured' ? 'Lightning Eye captured with wild will' :
                    custody === 'refined' ? 'Lightning Eye ready for white silver' : '';
                el('p', ['Pale-crested crown wolf', dead ? 'died in the ravine' : moved ? 'followed the prey to the ravine' : 'on the ridge',
                    plain && `the other wolf missed you under ${plainOwned ? 'your ' : ''}Stealth Scales`, !dead && approach,
                    !dead && quietIn && `let the trail settle · ${span(quietIn)}`, eye, cache && 'concealed cache recovered'].filter(Boolean).join(' · '),
                    root, {'data-gu': 'wolf-scouting', role: 'status'});
            }
            if(ridge.flight) {
                for(const [kind, gu] of Object.entries(ridge.flight.gu)) {
                    const label = kind === 'spark' ? 'Blue Gu' : gu.tried ? 'Thunder Shield' : 'Glassy Gu';
                    const resistance = kind === 'spark' ? 'shocked your hand' : 'raised a lightning shield';
                    const status = {fleeing: `fleeing · ${span(gu.remaining)} left`, resisted: `${resistance} · ${span(gu.remaining)} left`,
                        lost: 'trail went cold', captured: 'captured with wild will', refined: 'ready for white silver'}[gu.status];
                    const crossing = kind === 'shield' && ridge.flight.crossed ? ' · carried you across the sparking ford' : '';
                    el('p', `${label} · ${status}${crossing}`, root, {'data-gu': `fleeing-${kind}`, role: 'status'});
                }
            }
        }
    }
    if(house.propagation) {
        const {unsorted, sorted, carried, last, planted, trial, market, rig, millRuns} = house.propagation;
        const growth = planted ? planted.remaining ? ` · growing, ${span(planted.remaining)} left` :
            ` · mature, buried ${planted.depth === 'deep' ? 'deep' : 'near the surface'}` : '';
        const result = last === 'blast' ? ' · the blast cleared the clay plug' : last === 'quiet' ? ' · the soil stayed quiet' : '';
        el('p', `Thunder Potato Gu · ${unsorted} unsorted fruit · ${carried} carried${sorted === null ? '' : ` · last sort yielded ${sorted}`}${growth}${result}`,
            root, {'data-gu': 'thunder-potato', role: 'status'});
        if (trial) {
            const mother = trial.loaned ? trial.fed ? 'crested mother fed' : 'crested mother needs food' : 'crested mother with the steward';
            const fruit = trial.plantedForce ?? trial.nextForce;
            const blast = fruit ? ` · ${trial.plantedForce ? 'Buried' : 'Next'} fruit has a ${fruit === 2 ? 'strong' : 'usual'} blast` : '';
            const brace = {held: 'The stone brace held', opened: 'The stone brace broke'}[trial.brace];
            el('p', `Mother Gu trial · ${mother}${blast}${brace ? ` · ${brace}` : ''}`,
                root, {'data-gu': 'thunder-potato-trial', role: 'status'});
        }
        if (market) {
            const {fruit, last: tested, cleared} = market;
            const current = fruit ? `${fruit.force === 2 ? 'Crested' : 'Usual'} fruit ${fruit.planted ?
                fruit.remaining ? `growing, ${span(fruit.remaining)} left` : 'ready to test' : 'in the steward’s care'}` : 'No fruit with the steward';
            const outcome = tested ? tested.force === 2 ? 'the last blast cleared the stone drain' : 'the last blast left the heavy stone in place' : '';
            el('p', [current, outcome, cleared && tested?.force !== 2 && 'the drain is open'].filter(Boolean).join(' · '),
                root, {'data-gu': 'potato-market', role: 'status'});
        }
        if (rig || millRuns) {
            const cause = rig?.release === 'wear' ? 'frayed cord snapped' : 'cord cut';
            const motion = rig?.phase === 'tethered' ? `${rig.size} log tethered${rig.worn ? ' with frayed cord' : ''}` : rig?.phase === 'rolling' ?
                `${cause} · log rolling` : rig ? `log at the foot of the track · ${rig.triggered ? 'fruit detonated' : 'no detonation'}` : '';
            el('p', [motion, millRuns && 'the waterwheel ground the grain'].filter(Boolean).join(' · '), root,
                {'data-gu': 'drain-rig', role: 'status'});
        }
    }
    if(house.rainbow) {
        const {active, reserve, remaining, reason} = house.rainbow;
        const status = active ? `${active.supported ? 'with Light Source' : 'running alone'} · next draw in ${span(remaining)}` :
            {'stopped': 'ended by the Keeper', 'Gu unavailable': 'faded when a bound Gu became unavailable',
                'needs more essence': 'faded when white-silver essence ran short'}[reason] ?? 'ready to practice';
        el('p', `Rainbow Light · ${reserve} white-silver measures · ${status}`,
            root, {'data-gu': 'rainbow-light', role: 'status'});
    }
    if(house.moveTrial?.plans.length) {
        const list = el('section', null, root, {'data-gu': 'moonblade-combinations'});
        el('h5', 'Written Moonblade combinations', list);
        const entries = el('ol', null, list);
        for(const plan of house.moveTrial.plans) {
            const method = [...plan.names, 'Moonlight Gu'].join(' → ');
            el('li', `${method} · ${plan.cost} essence · force ${plan.power} · reach ${plan.reach}${plan.known ? ' · known pairing' : plan.names.length ? ' · experiment' : ''}`,
                entries, {'data-gu-move-slot': plan.slot});
        }
        const last = house.moveTrial.last;
        if(last) {
            const result = last.outcome === 'complete' ? `The blade struck with force ${last.power} and reach ${last.reach}.` :
                last.reason === 'Gu unavailable' ? 'A Gu was unavailable. The blade did not form.' : 'The essence ran short. The blade did not form.';
            el('p', `Combination ${last.slot} · ${last.spent} essence spent. ${result}`,
                list, {'data-gu': 'moonblade-result', role: 'status'});
        }
    }
    if(house.moveTrial?.raised) {
        const {target, moonFed, support, plans, last, cut} = house.moveTrial.raised;
        const section = el('section', null, root, {'data-gu': 'distant-cord'});
        el('h5', 'Distant practice cord', section);
        el('p', `Cord at reach ${target} · Moonlight ${moonFed ? 'fed this meal' : 'awaiting its meal'} · Little Light ${support}`, section);
        const entries = el('ol', null, section);
        for(const plan of plans) {
            const name = [...plan.names, 'Moonlight Gu'].join(' → ');
            el('li', `${name} · ${plan.cost} essence · reach ${plan.reach}`, entries,
                {'data-cord-plan': plan.slot});
        }
        if(last) {
            const result = last.outcome === 'complete'
                ? last.reach >= target ? 'The blade cut the cord.' : 'The blade fell short of the cord.'
                : {'Gu unavailable': 'A Gu in the written plan is unavailable.', 'needs feeding': 'A Gu in the written plan needs feeding.',
                    'needs more essence': 'Essence ran short.'}[last.reason];
            el('p', `${last.spent} essence spent. ${result}`, section, {'data-cord-result': '', role: 'status'});
        }
        if(cut) el('p', 'The alcove latch is released.', section);
    }
    if(house.fireTrial) {
        const {plans, pair, bundle, last} = house.fireTrial;
        const section = el('section', null, root, {'data-gu': 'red-fire-trial'});
        el('h5', 'Red Fire practice', section);
        el('p', `Twin braziers ${pair ? 'lit' : 'need two flames'} · Damp kindling ${bundle ? 'lit' : 'needs force 2 per flame'}`,
            section, {'data-gu': 'fire-targets', role: 'status'});
        if(plans.length) {
            const list = el('ol', null, section);
            for(const plan of plans) {
                const method = [...plan.names, 'Red Fire Gu'].join(' → ');
                el('li', `${method} · ${plan.cost} essence · ${plan.count} ${plan.count === 1 ? 'flame' : 'flames'} · force ${plan.force} per flame`,
                    list, {'data-fire-slot': plan.slot});
            }
        }
        if(last) {
            const outcome = last.outcome === 'complete' ? `${last.count} ${last.count === 1 ? 'flame' : 'flames'}, force ${last.force} each.` :
                last.reason === 'Gu unavailable' ? 'A Gu was unavailable. No flame formed.' : 'The essence ran short. No flame formed.';
            el('p', `Combination ${last.slot} · ${last.spent} essence spent. ${outcome}`, section, {'data-gu': 'fire-result', role: 'status'});
        }
    }
    if(house.moonlightStock) {
        const section = el('section', null, root, {'data-gu': 'moonlight-stock'});
        el('h5', 'Clan tray comparison', section);
        const list = el('ul', null, section);
        for(const {label, held, refined, cut} of house.moonlightStock) {
            el('li', `${label} · ${held ? 'in your care' : 'with the steward'} · ${cut === null ? 'untested' : `${cut} sheets on its last cast`}${refined ? ' · refined focus' : ''}`, list);
        }
    }
    if(house.trayMove) {
        const {written, missing, target, result, plans} = house.trayMove;
        const section = el('section', null, root, {'data-gu': 'tray-move', role: 'status'});
        el('p', result?.open ? `The blade cut ${result.sheets} sheets · the seal is open` :
            result ? `The blade cut ${result.sheets} of ${target} sheets · the seal held` : `The seal has ${target} sheets`, section);
        if(written) el('p', `Written blade · ${written}${missing ? ' · the written Gu is away' : ''}`, section);
        for(const plan of plans) el('p', [plan.name, plan.support, `${plan.sheets} sheets`, `${plan.cost} essence`].filter(Boolean).join(' · '), section);
    }
    if (house.bladeChains) {
        const {last, plans} = house.bladeChains;
        const section = el('section', null, root, {'data-gu': 'blade-chains', role: 'status'});
        if (!plans.length) el('p', 'No blade chain reaches both catches with the Gu and essence on hand.', section);
        for (const [index, {names, cost, force}] of plans.entries()) {
            el('p', `Chain ${index + 1} · ${names.join(' → ')} · force ${force} at each catch · ${cost} essence`, section);
        }
        if (last) {
            const outcome = last.open ? 'Both catches cut' : last.stopped ? `The blade stopped at ${last.stopped}` : 'The catches held';
            el('p', `${outcome} · ${last.spent} essence spent`, section);
        }
    }
    if (house.lightReaders) {
        const {last, recorded, witnessed, signal, remaining, specimen} = house.lightReaders;
        const report = el('section', null, root, {'data-gu': 'light-readers', role: 'status'});
        el('p', [specimen, witnessed && 'earlier cast marked', recorded && 'light recorded on the silver plate',
            remaining === 0 ? 'time seal expired' : remaining && `time seal has ${span(remaining)} left`].filter(Boolean).join(' · '), report);
        if (last) {
            const source = {echo: 'Borrowed blade', replay: 'Recorded light', present: 'Live blade'}[last.op];
            el('p', `${source} · ${signal ? 'the light door opened' : 'the light door held'} · ${last.authorized ?
                'the keeper’s door recognized you' : 'the keeper’s door asks for the marked Gu in your care'}`, report);
        }
    }
    if(house.moonlightTrial) {
        const {held, tuned, marks, prospect} = house.moonlightTrial;
        const cut = n => n === null ? 'untested' : `${n} sheets cut`;
        el('p', `Moonlight Gu trial · your Gu: ${cut(marks.clan)} · loan Gu: ${cut(marks.loan)} on the last cast · ${held ? 'in your care' : 'back with the steward'}${tuned ? ' · refined focus' : ''}`,
            root, {'data-gu': 'moonlight-trial', role: 'status'});
        if(prospect) {
            const preparation = {pending: prospect.workRemaining ? `preparation settling · ${span(prospect.workRemaining)}` :
                'ready to finish the refinement', lost: 'the loan ended and the seal lost its connection',
                complete: 'refinement complete', cancelled: 'preparation stopped'}[prospect.status];
            const seal = prospect.status !== 'pending' || !prospect.opened ? '' :
                prospect.windowRemaining ? ` · seal open for ${span(prospect.windowRemaining)}` :
                    prospect.cut === null ? ' · seal expired' : ' · seal spent';
            el('p', `Future Moonblade · ${preparation}${seal}${prospect.cut === null ? '' : ` · ${cut(prospect.cut)} in the trial`}`,
                root, {'data-gu': 'moonlight-prospect', role: 'status'});
        }
    }
    if(house.cooperation) {
        const {withSteward, fed, response, lightRemaining, future, witnessed} = house.cooperation;
        const visitor = response?.actor === 'player' ? 'you' : 'the steward';
        const visit = response?.result === 'lit' ? `glowed for ${visitor}` : `stayed quiet for ${visitor}`;
        el('p', ['Insight Moth', withSteward ? 'at the steward’s desk' : 'at your desk',
            lightRemaining ? `glowing · ${span(lightRemaining)}` : fed ? 'fed' : 'ready for petals',
            ...(response ? [visit] : [])].join(' · '), root, {'data-gu': 'insight-moth', role: 'status'});
        if(future) {
            const status = future.status === 'kept' ? 'the moth learned the steward’s notes' :
                future.status === 'cancelled' ? 'lesson called off' : future.status === 'broken' ? 'the moth left before the lesson' :
                    future.lesson ? `lesson in ${span(future.lesson)}` : 'the steward is ready to give the lesson';
            const glow = future.remaining ? ` · future moth glowed for the steward · ${span(future.remaining)}` :
                future.reached ? ' · borrowed glow ended' : '';
            el('p', `Future lesson · ${status}${glow}`, root, {'data-gu': 'future-moth', role: 'status'});
        }
        if(witnessed) {
            const seal = witnessed.remaining ? `seal open · ${span(witnessed.remaining)}` :
                witnessed.opened ? 'the seal has closed' : 'the visit is marked';
            const visits = [witnessed.refused && 'the earlier moth stayed quiet for the steward',
                witnessed.lit && (witnessed.remaining ? 'the earlier moth glowed for you' : 'the earlier glow ended')];
            el('p', ['Earlier visit', seal, ...visits.filter(Boolean)].join(' · '), root, {'data-gu': 'witnessed-moth', role: 'status'});
        }
    }
    if(house.moonFusion) {
        const {plans, product, cast, waiting, recovering, destroyed, future, vital} = house.moonFusion;
        const section = el('section', null, root, {'data-gu': 'moon-fusion'});
        el('h5', 'Moonlight fusion', section);
        if(plans.length) {
            const list = el('ol', null, section);
            for(const {label, traits, alternate} of plans) {
                el('li', `${label} · force ${traits.power} · reach ${traits.reach}${alternate ? ' · uses Groove Stone' : ''}`, list);
            }
        }
        if(waiting !== null) el('p', waiting ? `Fusion settling · ${span(waiting)}` : 'Ready to finish the fusion.', section);
        if(destroyed.length) el('p', `Lost in fusion: ${destroyed.join(', ')}.`, section);
        if(recovering !== null) el('p', recovering ? `Surviving Gu injured · ${span(recovering)} until they can be tended` :
            'The survivors are ready to be tended.', section);
        if(product) el('p', `${product} · rank 2${cast ? ` · test cut: force ${cast.power}, reach ${cast.reach}` : ''}`, section, {role: 'status'});
        if(vital) {
            const condition = !vital.alive ? 'lost in fusion' : vital.injured ? 'injured' : 'ready';
            const holder = vital.withSteward ? 'with the steward' : 'on your bench';
            el('p', `Steward’s Vital Gu · ${vital.label} · rank ${vital.rank} · ${condition} · ${holder}`, section,
                {'data-gu': 'fusion-vital', role: 'status'});
            if(vital.protected) el('p', 'The living bond turned a fatal failure into an injury.', section);
        }
        if(future) {
            let cage = 'A Little Light Gu is trapped. The latch needs force 3.';
            if(future.cut) cage = `The borrowed blade struck at force ${future.cut}. The latch held.`;
            if(future.rescued) cage = 'Rescued Little Light Gu sheltered with the steward.';
            if(future.brought) cage = 'Rescued Little Light Gu brought to the bench.';
            if(future.fate === 'consumed') cage = 'The rescued Little Light Gu became part of the fused Gu.';
            if(future.fate === 'destroyed') cage = 'The rescued Little Light Gu was lost in the fusion.';
            el('p', cage, section, {role: 'status', 'data-gu': 'fusion-cage'});
            if(future.opened) el('p', future.remaining ? `Seal open · ${span(future.remaining)}` : 'The seal is closed.', section);
        }
    }
    if(house.goalResearch) {
        const {plans, blocked, last, openedBy} = house.goalResearch;
        const section = el('section', null, root, {'data-gu': 'screen-research'});
        el('h5', 'Ways to open the screen', section);
        const entries = el('ol', null, section);
        for(const {label, cost, synchronized} of plans) {
            el('li', `${label} · ${cost} essence${synchronized ? ' · the cut and catch must work together' : ''}`, entries);
        }
        for(const {label, reason, role} of blocked) {
            const why = {'missing-role': role === 'lifting-strength' ? 'needs a Gu that can lift the iron runner' : 'needs another suitable Gu',
                'insufficient-effect': 'the Gu at hand cannot move that part of the screen',
                'no-funded-binding': 'needs ready Gu and enough essence', budget: 'needs more study'}[reason];
            el('p', `${label} · ${why}`, section);
        }
        if(last) {
            const result = {'cut-cord': 'The cord is cut and the screen opens.',
                'lower-counterweight': 'The counterweight is lowered and the screen opens.',
                'lift-runner': 'The runner lifts and the screen opens.'}[openedBy] ?? 'The screen stayed shut.';
            el('p', `${result} ${last.spent} essence spent.`, section, {role: 'status'});
        }
    }
    if(house.spirit) {
        const {held, alive, mind, soul, last} = house.spirit;
        const outcome = {abort: 'stopped before charging Fight Gu', rush: 'backlash destroyed the supports',
            steady: 'the steward resumed practice'}[last];
        const condition = mind === undefined ? 'learn the recovery exercises' :
            `mind ${mind === 0 ? 'injured' : 'steady'} · soul ${soul === 0 ? 'injured' : 'steady'}`;
        el('p', `Fighting Spirit · Fight Gu ${held ? 'in your care' : 'with the steward'} · ${alive} living supports · ${condition}${outcome ? ` · ${outcome}` : ''}`,
            root, {'data-gu': 'fighting-spirit', role: 'status'});
    }
    if(house.giantHand) {
        const hand = house.giantHand;
        const result = {old: 'The prepared Giant Hand broke the slab', revised: 'The revised Giant Hand broke the slab',
            expired: 'The prepared phantoms had faded', support: 'Group Strength was away when you needed it',
            essence: 'There was too little essence to gather the phantoms'};
        const held = hand.preparation ? `preparing phantoms · ${span(hand.preparation)} left` : hand.lifetime === null ? null :
            hand.lifetime ? `phantoms held · ${span(hand.lifetime)} left` : 'the phantoms have faded';
        const refinement = hand.refined ? 'rank-seven Myriad Self in your care' :
            hand.refinement === null ? null : hand.refinement ? `refining Myriad Self · ${span(hand.refinement)} left` : 'Myriad Self ready to finish';
        el('p', ['Giant Hand', hand.group && 'two Group Strength Gu on loan', held, refinement, result[hand.last],
            hand.hand && 'the far path is open'].filter(Boolean).join(' · '), root, {'data-gu': 'giant-hand', role: 'status'});
        if(hand.ward) {
            const ward = el('section', null, root, {'data-gu': 'giant-hand-ward', role: 'status'});
            if(hand.ward.result === 'broken') el('p', 'The reinforced hand broke the ward · the protected path is open', ward);
            else {
                el('p', hand.ward.result === 'held' ? 'The ward held against the last strike' : `The ward needs force ${hand.ward.force} to break`, ward);
                for(const plan of hand.ward.plans) {
                    const method = plan.reinforced ? 'Giant Hand with Self Strength' : 'Giant Hand';
                    el('p', `${method} · force ${plan.force} of ${hand.ward.force} needed · ${plan.beads} red date ${plan.beads === 1 ? 'bead' : 'beads'}, ${plan.essence} essence · ${plan.breaks ? 'breaks the ward' : 'the ward holds'}`, ward);
                }
                if(!hand.older) el('p', 'Borrow Self Strength to test a stronger hand.', ward);
            }
        }
        if(hand.variants) {
            const variants = hand.variants;
            const section = el('section', null, root, {'data-gu': 'giant-hand-variants', role: 'status'});
            el('p', variants.result === 'open' ? 'The brace fell · the covered path is open' :
                variants.result === 'short' ? 'The braced slab withstood the last strike' :
                    `The braced slab needs force ${variants.force}`, section);
            if(variants.written) el('p', `Written pair · ${variants.written.join(' + ')}${variants.missing ? ' · a Gu from this plan is away' : ''}`, section);
            for(const plan of variants.plans) {
                el('p', `${plan.supports.join(' + ')} · force ${plan.force} · ${plan.essence} essence`, section);
            }
        }
    }
    if(house.procedure) {
        const {plans, last, load, condensation, link, copy} = house.procedure;
        const section = el('section', null, root, {'data-gu': 'beam-procedure'});
        el('h5', 'Written beam moves', section);
        const entries = el('ol', null, section);
        for(const {label, cost, load: capacity} of plans) {
            el('li', `White Jade → Moonlight and ${label} together · ${cost} essence · ${capacity === 2 ? 'catches the heavy shelf' : 'catches the beam'}`, entries);
        }
        if(last) el('p', last.outcome === 'complete' ? `The move worked · ${last.spent} essence spent.` :
            `The move stopped · ${last.spent} essence spent before it stopped.`, section, {role: 'status'});
        if(load) el('p', load === 2 ? 'The beam and heavy shelf are lowered.' : 'The beam is lowered. The heavy shelf still hangs above it.', section);
        if(condensation) {
            const work = condensation.status === 'working' ? (condensation.remaining ? `shaping · ${span(condensation.remaining)} left` : 'ready to finish') :
                condensation.status === 'complete' ? `in your care · ${condensation.cost} essence to use` :
                    condensation.status === 'cancelled' ? 'shaping stopped · materials spent' : 'ready to shape from a successful move';
            const source = condensation.source && `practiced move used ${condensation.source.spent} essence`;
            el('p', ['Beam Catch Gu', work, source, condensation.passage && 'the narrow passage is open',
                condensation.heavyTried && 'Beam Catch could not lower the heavy shelf'].filter(Boolean).join(' · '),
                section, {'data-gu': 'beam-condensation', role: 'status'});
        }
        if(link) {
            const result = {
                pending: link.remaining ? `Beam Catch is holding the shelf · ${span(link.remaining)} left` : 'Beam Catch’s hold has faded',
                complete: 'Woven Catch took the weight · the heavy shelf is lowered',
                support: 'Woven Catch was away when you needed it',
                expired: 'The hold had faded before Woven Catch could act',
                essence: 'There was too little essence for Woven Catch',
            };
            el('p', result[link.outcome], section, {'data-gu': 'beam-link', role: 'status'});
        }
        if (copy) {
            const status = {open: 'side gate lowered', 'too-light': 'the catch could not take the gate’s weight',
                interrupted: 'the move stopped before lowering the gate'}[copy.last?.outcome];
            const load = value => value === 1 ? 'light' : 'heavy';
            el('p', [`Copied demonstration with ${copy.label}`, `caught a ${load(copy.load)} beam`, `gate load: ${load(copy.target)}`,
                status && `${status} · ${copy.last.spent} essence spent`].filter(Boolean).join(' · '),
            section, {'data-gu': 'beam-record', role: 'status'});
        }
    }
    if(house.antNest) {
        const {queen, worker, soldier, held, breeding, clear} = house.antNest;
        const count = (n, caste) => `${n} ${caste}${n === 1 ? '' : 's'}`;
        el('p', `Army-ant tray · ${count(queen, 'queen')} · ${count(worker, 'worker')} · ${count(soldier, 'soldier')} · Ant Nest ${held ? 'in your care' : 'with the steward'}${breeding === null ? '' : ` · brood due in ${span(breeding)}`}${clear ? ' · storeroom niche clear' : ''}`,
            root, {'data-gu': 'ant-nest', role: 'status'});
    }
    if(house.attitude) {
        const {held, remaining, response, approved, collected, mental} = house.attitude;
        const reserve = mental === undefined ? 'gather your thoughts first' : `${mental} mental energy`;
        const reply = response === 'reassured' ? 'the steward was reassured' :
            response === 'wary' ? 'the steward was wary' : '';
        const petals = collected ? 'practice petals collected' : approved ? 'practice petals set aside · show your clan ledger entry' : '';
        el('p', ['Attitude Gu', held ? 'in your care' : 'with the steward', reserve,
            remaining && `composed demeanor · ${span(remaining)}`, reply, petals].filter(Boolean).join(' · '),
            root, {'data-gu': 'attitude-gu', role: 'status'});
    }
    if(house.fixedTravel) {
        const {held, rank, vacant, doses, knowsAnnex, knowsHill} = house.fixedTravel;
        const sites = [knowsAnnex && 'Gu house', knowsHill && 'hill terrace'].filter(Boolean);
        const custody = vacant ? 'no living specimen here' : `rank ${rank ?? 6} · ${held ? 'in your care' : 'with the steward'}`;
        el('p', `Fixed Immortal Travel · ${custody} · ${doses} green grape ${doses === 1 ? 'dose' : 'doses'} · ${sites.length ? `landings remembered: ${sites.join(' and ')}` : 'study a landing before travelling'}`,
            root, {'data-gu': 'fixed-immortal-travel', role: 'status'});
    }
    if(house.fixedForge) {
        const {status, wait, doses, mark, house: transit, furnace} = house.fixedForge;
        const result = {working: wait ? `distant furnace settling · ${span(wait)}` : 'ask for the distant furnace result',
            failed: 'the distant rank-six refinement failed', complete: 'the refiner delivered a new rank-six Gu'}[status];
        el('p', `Fixed Immortal Travel forge · ${doses} red date ${doses === 1 ? 'dose' : 'doses'}${result ? ` · ${result}` : ''}`,
            root, {'data-gu': 'fixed-forge', role: 'status'});
        if (furnace) {
            const sighting = {unseen: 'Furnace unseen from here', quiet: 'Last sighting · furnace quiet',
                stoked: 'Last sighting · smoke rising from the furnace', banked: 'Last sighting · furnace banked'}[furnace];
            el('p', sighting, root, {'data-gu': 'fixed-watch', role: 'status'});
        }
        if(mark) {
            const condition = {pending: `Destructive mark flaring · ${span(mark.wait)}`,
                stabilized: `Mark removed · ${mark.injured ? 'Gu still injured' : 'Gu recovered'}`,
                detonated: 'The mark destroyed the original Gu.', lost: 'The marked Gu was destroyed before the mark could fire.'}[mark.status];
            el('p', condition, root, {'data-gu': 'gu-restoration', role: 'status'});
        }
        if(transit) {
            const frame = {empty: 'Core unseated', setting: transit.wait ? `Frame setting · ${span(transit.wait)}` : 'Ready to finish fitting',
                damaged: 'Brace lost during fitting', ready: 'Ready to cross', injured: 'Core needs treatment', 'core-lost': 'Bound core lost · fit a living replacement'}[transit.phase];
            const brace = {anchor: 'Anchor Reed · carries freight · 2 doses', glide: 'Glide Reed · passenger crossing · 1 dose'}[transit.brace];
            const lost = transit.lost.map(kind => kind === 'anchor' ? 'Anchor Reed' : 'Glide Reed');
            el('p', ['Transit Gu House', frame, transit.rank && `core rank ${transit.rank}`, brace,
                lost.length && `Lost: ${lost.join(', ')}`, transit.delivered && 'Hill crate delivered'].filter(Boolean).join(' · '),
                root, {'data-gu': 'transit-gu-house', role: 'status'});
        }
    }
    if(house.refinement) {
        const {status, stage, wait, rank, advancement, reclamation} = house.refinement;
        const result = {
            working: wait ? `${stage ? 'The sand is settling' : 'The furnace is warming'} · ${span(wait)}` :
                stage ? 'ready for the final step' : 'ready to prepare the sand',
            complete: `rank ${rank} · in your care`,
            failed: 'the refinement failed · the sand has turned to ash',
            cancelled: 'furnace cooled · unused sand returned',
        };
        const advance = advancement && {
            working: advancement.wait ? `rank ${rank} · furnace settling · ${span(advancement.wait)}` :
                `rank ${rank} · ready to finish raising the Gu`,
            complete: `rank ${rank} · in your care`,
            failed: 'the Gu was destroyed in the furnace',
            cancelled: `rank ${rank} · unused sand returned`,
        }[advancement.status];
        const custody = reclamation && (reclamation.holder === 'steward' ? `rank ${reclamation.rank} · with the steward` :
            reclamation.holder === 'player' ? `rank ${reclamation.rank} · in your care` :
                reclamation.destroyed ? 'the Gu in your care was destroyed' : 'none in your care');
        const replacement = reclamation?.replacement;
        const newWork = replacement && (replacement.status === 'working' ?
            replacement.wait ? `furnace settling · ${span(replacement.wait)}` :
                replacement.stage ? 'ready for the final step' : 'ready to prepare the fresh sand' :
            replacement.status === 'complete' ? 'a new Fortune Thread emerged' : result[replacement.status]);
        const current = advancement?.status === 'working' ? advance : custody ?? advance ?? result[status];
        el('p', `Fortune Thread · ${current}`, root, {'data-gu': 'immortal-refinement', role: 'status'});
        if(replacement) el('p', `New refinement · ${newWork}`, root, {'data-gu': 'immortal-replacement', role: 'status'});
    }
    const table = el('table', null, root, {class: 'gu-timers', 'data-gu': 'timers'});
    const head = el('tr', null, el('thead', null, table));
    for(const h of ['Gu', 'Condition', 'Larder', 'Next meal', 'Hunger', 'Work']) el('th', h, head, {scope: 'col'});
    const body = el('tbody', null, table);
    for(const r of house.gu) {
        const tr = el('tr', null, body, {'data-gu-row': r.id, ...(r.kept && r.alive && !r.willEat ? {'data-hungry': ''} : {})});
        const head = el('th', `${r.label}${r.refined ? ' (refined)' : ''}`, tr, {scope: 'row'});
        // CPR9/CPR10: grain, holder and custody from the shared being record, one home beside the care numbers.
        if(r.being) el('small', `${r.being.grain} · with ${r.being.holder} · ${r.being.tie.line}`, head, {'data-gu': 'being', title: r.being.custody.join(' ')});
        if(r.consumed) { el('td', 'Used in the Four Flavors fusion', tr, {colspan: 5}); continue; }
        if(!r.kept) { const c = el('td', `In the clan house · ${r.price ? `${r.price} stones to take in` : 'issued free'} · eats ${r.meal} ${r.food} every ${r.everyDays} day${r.everyDays > 1 ? 's' : ''}`, tr, {colspan: 5}); c.dataset.gu = 'unheld'; if(r.work?.remembers) el('small', ` ${r.work.remembers}`, c, {'data-gu': 'remembers'}); continue; }
        if(!r.alive) { el('td', 'Dead', tr, {colspan: 5, 'data-gu': 'dead'}); continue; }
        const cond = el('td', null, tr); const m = el('meter', `${r.condition} of ${r.maxCondition}`, cond, {min: 0, max: r.maxCondition, low: 2, optimum: r.maxCondition, value: r.condition, 'aria-label': `${r.label} condition`}); el('span', ` ${r.condition}/${r.maxCondition}`, cond);
        el('td', `${r.stock} ${r.food}${r.altFood ? ` + ${r.altStock} ${r.altFood}` : ''} · ${r.mealsStocked} meal${r.mealsStocked === 1 ? '' : 's'}${r.order ? ` · standing order on (bag covers ${r.bagMeals})` : ''}`, tr);
        el('td', `${span(r.nextMealIn)} · eats ${r.meal}${r.willEat ? '' : ' (not enough: it will miss this meal)'}`, tr);
        el('td', r.condition <= 1 && !r.lethal ? 'Starved out now: feed it to recover' : `${r.lethal ? 'Dies' : 'Starved out'} in ${span(r.lethal ? r.starvesIn : r.starvedOutIn)} if unfed${r.sustained === false ? ' · beyond what the stipend feeds' : ''}`, tr, {'data-gu': 'starves-in'});
        const work = el('td', `${r.ability} · ${r.yield} stone${r.yield > 1 ? 's' : ''} a window`, tr, {'data-gu': 'work'});
        // CPR15: the standing order line; CPR18: its opinion of you, apart from the tie line under its name.
        if(r.work?.line) el('small', ` · ${r.work.line}`, work, {'data-gu': 'work-order'});
        if(r.work?.remembers) el('small', ` · ${r.work.remembers}`, work, {'data-gu': 'opinion'});
    }
    if(house.moves?.length) renderGuMoves(root, house.moves);
    const led = el('section', null, root, {'data-gu': 'ledger', 'aria-label': 'Stipend and stone ledger'});
    const a = house.ledger.agreement;
    el('p', `Stones in hand: ${house.stones}. ${a.why}.${house.ledger.nextStipendIn == null ? '' : ` Next payment in ${span(house.ledger.nextStipendIn)}.`}`, led, {'data-gu': 'agreement'});
    // OPN2: the entry-by-entry ledger folds behind a disclosure; the agreement line above and the net below stay in view.
    const lines = el('details', null, led, {class: 'gu-ledger-details'}); el('summary', 'Ledger entries', lines);
    const lt = el('table', null, lines, {class: 'gu-ledger', 'data-gu': 'ledger-rows'});
    const lh = el('tr', null, el('thead', null, lt)); for(const h of ['Entry', 'Stones', 'Detail']) el('th', h, lh, {scope: 'col'});
    const lb = el('tbody', null, lt);
    for(const l of house.ledger.lines) { const tr = el('tr', null, lb); el('th', l.label, tr, {scope: 'row'}); el('td', signed(l.amount), tr); el('td', l.note, tr); }
    el('p', `Net since the start: ${signed(house.ledger.net)} stones.`, led, {'data-gu': 'net'});
    return root;
}
