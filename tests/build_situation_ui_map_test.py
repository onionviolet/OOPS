"""Offline situation qualification invariants, independent of private corpus."""
import copy
import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('situation_map', Path(__file__).resolve().parents[1] / 'scripts/lead_run/build_situation_ui_map.py')
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

class QualificationTests(unittest.TestCase):
    def test_bare_late_chapter_never_becomes_opening(self):
        self.assertEqual(m.locator_volume([{'locator': 'zh 第1章 p4'}]), 'unresolved')
        self.assertEqual(m.locator_volume([{'locator': 'zh b7 第1章 p4'}]), '7')
        self.assertEqual(m.locator_volume([{'locator': 'zh b1 第1章 p4-p9'}]), '1')
        self.assertEqual(m.locator_volume([{'locator': 'zh b1 第1章 p4'}, {'locator': 'zh b7 第1章 p4'}]), 'unresolved')
        row = {'population': 'literal_lead_pov', 'source_evidence': [{'locator': 'zh 第1章 p4'}]}
        self.assertFalse(m.opening_row(row))
        row['source_evidence'] = [{'locator': 'zh b7 第1章 p4'}]
        self.assertFalse(m.opening_row(row))
        row['source_evidence'] = [{'locator': 'zh b1 第1章 p4'}]
        self.assertTrue(m.opening_row(row))

    def fixture(self):
        row = {'id': 'scene#1', 'source_volume': 'unresolved', 'actor_status': 'unresolved_no_step_actor', 'contract_status': 'family_triage_proposal_not_scene_qualified', 'missing': ['source_locator_unresolved', 'step_actor_unresolved', 'scene_specific_ui_contract_not_qualified', 'current_journey_proof_not_run']}
        o = {'id': 'scene#1', 'source': {'edition_sha256': 'a'*64, 'spans': [{'volume': 1, 'chapter': 1, 'p_start': 3, 'p_end': 9}]}, 'roles': {'actor': None, 'uncertainty': 'speaker not established'}, 'operation': {'kind': 'observation'}, 'engine': {'status': 'proposed_missing'}, 'ui': {'home': 'task'}, 'result': {'consumer': 'task'}, 'lifecycle': {'revision': 'revalidate'}, 'later_pressure': ['observer independent of actor'], 'alternatives': [], 'review': {'source_status': 'source_qualified', 'actor_status': 'source_ambiguous_roles', 'ui_status': 'situation_specific_ui_proposal', 'engine_status': 'proposed_missing', 'journey_verified': False}}
        return row, o

    def test_source_ui_and_unknown_actor_do_not_become_play_proof(self):
        row, o = self.fixture()
        counts = m.apply_qualifications([row], [o])
        self.assertEqual((counts['source_qualified'], counts['ui_specified'], counts['actor_qualified'], counts['engine_connected'], counts['journey_verified']), (1,1,0,0,0))
        self.assertIn('step_actor_unresolved', row['missing'])
        self.assertIn('current_journey_proof_not_run', row['missing'])
        self.assertNotIn('source_locator_unresolved', row['missing'])

    def test_rejects_orphan_duplicate_incomplete_and_unbound(self):
        row, o = self.fixture()
        bad = copy.deepcopy(o); bad['id'] = 'absent#1'
        with self.assertRaises(ValueError): m.apply_qualifications([row], [bad])
        with self.assertRaises(ValueError): m.apply_qualifications([row], [o,o])
        bad = copy.deepcopy(o); del bad['lifecycle']
        with self.assertRaises(ValueError): m.apply_qualifications([row], [bad])
        bad = copy.deepcopy(o); bad['source']['spans'][0]['p_end'] = 1
        with self.assertRaises(ValueError): m.apply_qualifications([row], [bad])
        bad = copy.deepcopy(o); bad['review']['journey_verified'] = True
        with self.assertRaises(ValueError): m.apply_qualifications([row], [bad])

if __name__ == '__main__': unittest.main()
