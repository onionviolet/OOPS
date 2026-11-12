import {projectMeadowShell} from './meadow_shell_state.js';
import {registerTempoOpener} from './tempo_starters.js';

export function meadowShellFightSpec(view, {me, vitals, enemyProfile}) {
    const {condition, state} = view;
    const id = `meadow.terrapin.${state.id}`;
    const hp = 16;
    const foe = {attack: condition.canWork ? 3 : 1, attack_speed: .7, agility: 3, dexterity: 4, intuition: 4,
        defense: condition.armor.value, crit_rate: 0, crit_multiplier: 1, attack_count: 1, health: hp, max_stamina: 10};
    return {id: 'meadow-terrapin-practice', title: 'Reed terrapin spar', floor: 1,
        fighters: [
            {id: 'player', name: 'You', side: 'a', hp: vitals.health, maxHp: vitals.max_health,
                stamina: vitals.stamina, maxStamina: vitals.max_stamina, profile: me,
                moves: ['jab','guard','withdraw','yield']},
            {id, name: 'Reed terrapin', side: 'b', hp, maxHp: hp, stamina: 10, maxStamina: 10,
                profile: enemyProfile(foe, 'Reed terrapin', id), moves: ['jab','guard','withdraw']},
        ]};
}

export function registerMeadowShellFight(read) {
    const view = () => {
        const {owner, clock} = read();
        return projectMeadowShell(owner?.shellAnimal, clock);
    };
    registerTempoOpener({id: 'meadow.terrapin', label: 'Practice with the reed terrapin',
        text: 'A short practice bout. Its shell guards more when tucked in, and it moves better after care.',
        quote(state, context) {
            if (state.actors.player.worldId !== 'base.frontier' || context.facts?.location !== 'Village')
                return {visible: false};
            const current = view();
            return {visible: !!current, eligible: !!current && !current.pending,
                reason: current?.pending ? 'Check the terrapin’s chamber first.' : ''};
        },
        spec: (_, context, helpers) => meadowShellFightSpec(view(), helpers),
    });
}
