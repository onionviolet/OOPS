import {registerDomain} from './domain_registry.js';
import {get_current_light_level} from './weather.js';
import {current_game_time} from './game_time.js';
import {bindReadingLightReader} from './reveal_chain.js';
import {createLamplightDomain} from './lamplight_factory.js';
export {createLamplightDomain, validateLamplight, LAMP, OIL, LAMP_LIGHT, FLASK_MINUTES, LAMPLIGHT_DETAILS} from './lamplight_factory.js';

// The played game's legacy singleton facade. Independent hosts import the factory
// directly and supply their own clocks/readers; they never enroll in this registry.
const nativeLamplight = createLamplightDomain();
export const lamplightState = nativeLamplight.getState;
export const setLamplightState = nativeLamplight.setState;
export const lamplightPresentation = nativeLamplight.projection;
export const quoteLamp = nativeLamplight.commands.quote;
export const executeLamp = nativeLamplight.commands.execute;
export function configureLamplight(operations) {
    nativeLamplight.configure({
        ...operations,
        ambientLight: operations.ambientLight ?? get_current_light_level,
        clockPosition: operations.clockPosition ?? (() => [current_game_time.year, current_game_time.month, current_game_time.day, current_game_time.hour, current_game_time.minute].join(':')),
        bindLightSource: operations.bindLightSource ?? (reader => {
            const actor = operations.actor?.();
            if (actor?.bindNativeLightSource) return actor.bindNativeLightSource(reader);
            actor?.setNativeLightSource?.('lamplight', reader);
            return () => actor?.setNativeLightSource?.('lamplight', () => 0);
        }),
        bindReadingLightReader: operations.bindReadingLightReader ?? bindReadingLightReader,
    });
}
registerDomain(nativeLamplight);
