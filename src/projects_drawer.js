import {decorateActionComponents} from './ui_components.js';
import {definePanel} from './panel_kit.js';
let drawer,body,met=false;
export function projectsHome() {
    if(body?.isConnected)return body;
    drawer=document.createElement('details');drawer.id='projects_drawer';
    const title=document.createElement('summary');title.textContent='Optional projects';
    const note=document.createElement('p');note.textContent='Original proposals. Open a project to read its terms before opting in.';
    body=document.createElement('div');drawer.append(title,note,body);
    definePanel({id:'projects',title:'Projects',role:'optional',node:drawer,
        home:document.getElementById('main_content'),defaultDock:'center',
        // UR82: stays out of the list until a project has been offered; after that an empty place says where to look.
        discovered:()=>{if([...body.children].some(n=>!n.hidden))met=true;return met;},eligible:()=>[...body.children].some(n=>!n.hidden),
        unavailableReason:()=> 'No project is offered here. Try another place.'});
    decorateActionComponents(body);
    return body;
}
export function openProjects() {projectsHome();drawer.open=true;drawer.closest('.workspace-module')?.scrollIntoView({block:'nearest'});}
