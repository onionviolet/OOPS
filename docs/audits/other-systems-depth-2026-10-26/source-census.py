"""Repeat bounded static checks against the recorded synthetic-test snapshot."""
import hashlib
import json
import pathlib
import re
import sys

root = pathlib.Path(sys.argv[1])
symbols = {
    'src/structured_expedition_runtime.js': ['compileStructuredExpeditions', 'validateStructuredExpeditionDefinition', 'previewStructuredExpeditions'],
    'src/site_projects.js': ['compileSiteProject', 'projectView'],
    'src/drainage_site.js': ['validateDrainage', 'quoteDrainage', 'drainageView'],
    'src/authored_site.js': ['compileDraft', 'applyAuthoredState'],
    'src/body_progression.js': ['bodyFacts', 'bodyFacultyActive'],
    'src/status_care_facts.js': ['statusCareSupportedBody', 'projectStatusCareEffects'],
    'src/book_care_facts.js': ['bookCareEffectsSupported', 'bookCareCarriedBaseCareSupported'],
    'src/habitat_care.js': ['validateHabitat', 'projectHabitat'],
    'src/world_completion_learning_runtime.js': ['freezeWorldCompletionLearningJob', 'retainWorldCompletionLearningWindow', 'completeWorldCompletionLearningJob'],
    'src/steam_boh_facts.js': ['steamBOHFacts', 'validateSteamBOHState'],
    'src/known_routes.js': ['projectKnownRoutes', 'routeSpeedGain'],
}
out = {'route': 'static source inspection; no runtime acceptance', 'locators': {}}
for name, names in symbols.items():
    lines = (root / name).read_text().splitlines()
    out['locators'][name] = {n: [i + 1 for i, line in enumerate(lines) if n in line][:8] for n in names}
packs = sorted((root / 'src/world_packs').glob('*.js'))
out['packExpeditionSearch'] = {'searchedFiles': [str(p.relative_to(root)) for p in packs],
    'pattern': r'\bexpeditions\b',
    'matches': [str(p.relative_to(root)) for p in packs if re.search(r'\bexpeditions\b', p.read_text())],
    'limit': 'Lexical search in this directory, not proof that no expedition-like gameplay exists.'}
out['conditionCarrier'] = {'file': 'src/simulation_effects.js',
    'actorKeyedAssignmentPresent': 's.conditions[actor] ||= {}' in (root / 'src/simulation_effects.js').read_text()}
out['routeWear'] = {name: [{'line': i + 1, 'text': line.strip()} for i, line in enumerate((root / name).read_text().splitlines()) if 'pathWear' in line]
    for name in ['src/runtime_state.js', 'src/economy_standing_domain.js', 'src/pathfinding.js']}
print(json.dumps(out, indent=2))
