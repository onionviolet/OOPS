// Skills and techniques gallery section (figure-gallery.html): populated and empty, so a headless run can read both.
import {renderSkillsTab} from '../skills_tab.js';
import {SKILL_ROWS} from './fixtures/skills.js';

export function mountSkillsTabGallery(main) {
    const doc = main.ownerDocument;
    for (const [id, title, rows] of [['skills-tab', 'Skills and techniques', SKILL_ROWS], ['skills-tab-empty', 'Skills and techniques, none known', []]]) {
        const section = doc.createElement('section'); section.className = 'fig-gallery-section'; section.dataset.fixture = id;
        const h = doc.createElement('h2'); h.textContent = title; const host = doc.createElement('div');
        section.append(h, host); main.append(section); renderSkillsTab(host, rows);
    }
}
