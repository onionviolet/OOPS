import {mountGallery} from './ui_directions.js';
const main = document.createElement('main'); main.id = 'ud_gallery'; document.body.append(main);
window.__ud = mountGallery(main);
