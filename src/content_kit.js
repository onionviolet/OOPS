// Shared content-DSL builders (AR3, AR5, DWF121). Leaf module: imports nothing, so any module may
// import it without a cycle. Each export is one body that several files used to re-declare; the name
// says which variant it is, because the key order, defaults and optional keys differ between variants
// and change the emitted JSON. Files import with an alias (`import {moneyActorNativeKey as money}`) so
// call sites keep their old names. Do not change a body here without reading every importer.

// money: resource effect on native money. Suffix = emitted key order / presence of actor.
export const moneyActorNativeKey = amount => ({type: 'resource', actor: 'player', native: true, key: 'money', amount});
export const moneyNativeKey = amount => ({type: 'resource', native: true, key: 'money', amount});
export const moneyActorKeyNative = amount => ({type: 'resource', actor: 'player', key: 'money', native: true, amount});
export const moneyKeyNative = amount => ({type: 'resource', key: 'money', native: true, amount});

// item: effect on an item stack. Name says the argument order.
export const itemActorFirst = (actor, key, amount, returned = false) => ({type: 'item', actor, key, amount, ...(returned ? {reservationReturn: true} : {})});
export const itemPlayerReturned = (key, amount, returned = false) => ({type: 'item', actor: 'player', key, amount, ...(returned ? {reservationReturn: true} : {})});
export const itemPlayer = (key, amount) => ({type: 'item', actor: 'player', key, amount});
export const itemKeyActorReturned = (key, amount, actor = 'player', returned = false) => ({type: 'item', actor, key, amount, ...(returned ? {reservationReturn: true} : {})});
export const itemKeyActor = (key, amount, actor = 'player') => ({type: 'item', actor, key, amount});
export const itemOptionalActor = (key, amount, actor) => ({type: 'item', key, amount, ...(actor ? {actor} : {})});

// gte with an optional reason (basics.gte has none).
export const gteReason = (fact, value, reason) => ({fact, op: 'gte', value, ...(reason ? {reason} : {})});

// stamina: vital effect.
export const staminaActorFirst = (actor, amount) => ({type: 'vital', actor, key: 'stamina', amount});
export const staminaPlayer = amount => ({type: 'vital', actor: 'player', key: 'stamina', amount});
export const staminaAmountFirst = (amount, actor = 'player') => ({type: 'vital', actor, key: 'stamina', amount});
export const staminaOptionalActor = (amount, actor) => ({type: 'vital', key: 'stamina', amount, ...(actor ? {actor} : {})});

// transfer: item moves between actors.
export const transferCount = (from, to, key, count = 1) => ({type: 'transfer', from, to, key, count});
export const transferOne = (from, to, key) => ({type: 'transfer', from, to, key, count: 1});
export const transferKeyCountFirst = (key, count, from, to) => ({type: 'transfer', key, count, from, to});

// coins: resource effect on the coins key.
export const coinsActorFirst = (actor, amount) => ({type: 'resource', actor, key: 'coins', amount});
