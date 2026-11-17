// Effect-family words for Gu coverage labels (GG2, GL7), shared by the ledger build and the wiki-tier
// normaliser so both read one table. Wiki type categories name an effect family; Support, Consumable,
// Grass, Storage and House name a role or a form, so they supply none. Name keywords are an inference,
// checked in order, whole words only. Changing either table is rule fitting: fit it on rows that are not
// held out (GKM429) and report held-out agreement apart.
export const typeFunction = {'Offensive Type Gu': 'attack', 'Defensive Type Gu': 'guard', 'Movement Type Gu': 'move',
    'Flying Type Gu': 'fly', 'Steed Type Gu': 'move', 'Investigative Type Gu': 'sense', 'Concealment Type Gu': 'conceal',
    'Healing Type Gu': 'heal', 'Amplification Type Gu': 'amplify'};
export const nameFunction = [
    [/\b(strength|power|might)\b/i, 'strength'],
    [/\b(shield|armou?r|skin|guard|shell|barrier)\b/i, 'guard'], [/\b(wings?|flight|fly|flying)\b/i, 'fly'],
    [/\b(eye|eyes|ear|ears|sight|investigat\w*|probe|scout)\b/i, 'sense'], [/\b(stealth|hide|hidden|conceal\w*|invisib\w*)\b/i, 'conceal'],
    [/\b(heal\w*|recover\w*|restor\w*|cure|vitality)\b/i, 'heal'], [/\b(blade|sword|spear|arrow|fist|claw|strike|cut|kill\w*)\b/i, 'attack'],
    [/\b(step|steps|dash|charge|travel|escape|leap|run)\b/i, 'move'],
    [/\b(light|glow|shine|bright\w*)\b/i, 'illuminate'], [/\b(steal|theft|plunder|rob)\b/i, 'steal'],
];
export const keywordFunction = text => nameFunction.find(([pattern]) => pattern.test(text ?? ''))?.[1] ?? null;
// A type word in a free-text kind ("Immortal, offensive Gu") maps like the wiki category of that name.
export function kindWordFunction(text) {
    const word = /\b(offensive|defensive|movement|flying|steed|investigative|concealment|healing|amplification)\b/i.exec(text ?? '');
    return word ? typeFunction[`${word[1][0].toUpperCase()}${word[1].slice(1).toLowerCase()} Type Gu`] : null;
}
