import {DataViewer} from '../mods/debug_screen.js';

const viewer=new DataViewer();
document.getElementById('show_yair_data_viewer')?.addEventListener('click',()=>viewer.show_debug_window());
