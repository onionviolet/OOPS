"""Freshness of folded execution-control relationships, not gameplay evidence."""
import importlib.util
import tempfile
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('plan_review_status', Path(__file__).resolve().parents[1] / 'docs/audits/tools/plan_review_status.py')
status = importlib.util.module_from_spec(spec)
spec.loader.exec_module(status)


class RelationshipFreshness(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        for name in ('owner', 'receipt', 'member', 'successor', 'unrelated'):
            (self.root / name).write_text(name)
        self.group = dict(id='SG09', owner='owner', owner_sha256=status.digest(self.root/'owner'),
                          relationship_evidence='receipt', evidence_sha256=status.digest(self.root/'receipt'),
                          skip_unchanged_execution_review=True,
                          members=[dict(path='member', sha256=status.digest(self.root/'member'))],
                          relationship_inputs=[dict(path='successor', sha256=status.digest(self.root/'successor'))])

    def test_unrelated_edit_reuses_only_selected_control_relationship(self):
        (self.root/'unrelated').write_text('changed')
        self.assertEqual(status.group_state(self.root, self.group)['state'], 'unchanged_control_skip')

    def test_successor_drift_reopens_relationship_without_reopening_unchanged_children(self):
        (self.root/'successor').write_text('new result')
        result = status.group_state(self.root, self.group)
        self.assertEqual(result['state'], 'dependency_changed_review_relationship')
        self.assertEqual(result['reopen_dependencies'], ['successor'])
        self.assertEqual(result['reopen_members'], [])

    def test_missing_supplier_cannot_appear_current(self):
        (self.root/'successor').unlink()
        with self.assertRaisesRegex(ValueError, 'Missing relationship input'):
            status.group_state(self.root, self.group)

    def test_changed_member_keeps_its_own_reopen_scope(self):
        (self.root/'member').write_text('changed')
        result = status.group_state(self.root, self.group)
        self.assertEqual(result['state'], 'changed_members')
        self.assertEqual(result['reopen_members'], ['member'])

    def test_legacy_groups_and_unreviewed_groups_keep_their_semantics(self):
        self.group.pop('relationship_inputs')
        self.assertEqual(status.group_state(self.root, self.group)['state'], 'unchanged_control_skip')
        self.group['skip_unchanged_execution_review'] = False
        self.assertEqual(status.group_state(self.root, self.group)['state'], 'needs_successor_mapping')


if __name__ == '__main__':
    unittest.main()
