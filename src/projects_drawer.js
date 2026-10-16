import {decorateActionComponents} from './ui_components.js';
import {definePanel} from './panel_kit.js';
let drawer,body;
export function projectsHome() {
    if(body?.isConnected)return body;
    drawer=document.createElement('details');drawer.id='projects_drawer';
    const title=document.createElement('summary');title.textContent='Optional projects';
    const note=document.createElement('p');note.textContent='Original proposals. Open a project to read its terms before opting in.';
    body=document.createElement('div');drawer.append(title,note,body);
    definePanel({id:'projects',title:'Projects',role:'optional',node:drawer,
        home:document.getElementById('main_content'),defaultDock:'center',
        discovered:()=>true,eligible:()=>[...body.children].some(n=>!n.hidden),
        unavailableReason:()=> 'No projects available at this place.'});
    decorateActionComponents(body);
    return body;
}
export function openProjects() {projectsHome();drawer.open=true;drawer.closest('.workspace-module')?.scrollIntoView({block:'nearest'});}
