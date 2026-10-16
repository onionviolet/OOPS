import {translationManager} from './translation.js';
import {language} from './runtime_state.js';
let readBio, readName;
export function bindTranslationReaders(bio, name) { readBio=bio; readName=name; }
export function translate(text_id, params = []) {    
    let text = translationManager.getText(text_id, language);
    const regex = /\{%\s*(\w+)\s*(?:\(([^)]*)\))?\s*%\}/g; //scary stuff

    text = text.replace(regex, (_, name, value) => {
        if(name === "param") {
            return params[value] ?? "";
        } else if(name === "dynamic") {
            return get_dynamic_translation(value);
        } else if(name === "translation") {
            return translationManager.getText(value, language);
        }
    });

    return text;
}

function get_dynamic_translation(key) {
    const bio = readBio();
    if(key === "gendered playful") {
        return bio.gender === "male" ? (bio.age === "middle-aged" ? "Jii-san" : "Onii-san") : (bio.age === "middle-aged" ? "Baa-san" : "Onee-san");
    } else if(key === "HeroName") {
        return readName();
    }
}
