// B2 p486 anchors the standard serving. HPPE108 reports that better brews
// can last longer. The penalties, finishing time and yield are original.
export const POLYJUICE_FINISH = Object.freeze({
    revision: 1,
    extraMinutes: 60,
    yieldLoss: 1,
});

export function planPolyjuiceFinish({mode, resolution, inputs, standardMinutes, standardDoses, brewMinutes, lacewingSlot}) {
    if(!['standard', 'concentrated'].includes(mode)) throw Error('Choose a supported Polyjuice finish.');
    const concentrated = mode === 'concentrated';
    let doseMinutes = 0;
    if(resolution.grade !== 'original') {
        let penalty = 10 * resolution.wear;
        const lots = Object.fromEntries(inputs.map(({slot, lot}) => [slot, lot]));
        for(const row of resolution.rows.filter(row => row.grade === 'near')) {
            if(row.slot === 'lacewing') {
                const {minStewMinutes, nearStewMinutes} = lacewingSlot;
                const shortfall = minStewMinutes - lots.lacewing.truth.stewedMinutes;
                penalty += Math.ceil(40 * shortfall / (minStewMinutes - nearStewMinutes));
            } else {
                penalty += row.slot === 'fluxweed' ? 20 : 30;
            }
        }
        doseMinutes = Math.max(10, standardMinutes - penalty) * (concentrated ? 2 : 1);
    }
    return {
        revision: POLYJUICE_FINISH.revision, mode, doseMinutes,
        brewMinutes: brewMinutes + (concentrated ? POLYJUICE_FINISH.extraMinutes : 0),
        doses: standardDoses - (concentrated ? POLYJUICE_FINISH.yieldLoss : 0),
    };
}
