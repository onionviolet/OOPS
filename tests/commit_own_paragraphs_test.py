"""commit_own_paragraphs.py: repeated headings must not overwrite unrelated HEAD paragraphs.

Regression for 8fb8a6b44 (2026-11-03), which dropped round 2's AB12-AB26 because a
new `#### ACCOUNT FOR NOW` paragraph replaced the earlier one with the same first line.
Set COP_TOOL to run the same checks against another copy of the tool.
"""
import os
import subprocess
import tempfile
import unittest
from pathlib import Path

TOOL = os.environ.get('COP_TOOL') or str(Path(__file__).resolve().parents[1] / 'docs/audits/tools/commit_own_paragraphs.py')
ENV = dict(os.environ, GIT_AUTHOR_NAME='t', GIT_AUTHOR_EMAIL='t@t', GIT_COMMITTER_NAME='t', GIT_COMMITTER_EMAIL='t@t')

BASE = """# Doc

#### ACCOUNT FOR NOW
Round 2 item AB12 stays.
Round 2 item AB13 stays.

Round 3 item AB27:
original detail.

| a | b |
| - | - |
| 0 | 0 |
"""


class Repo(unittest.TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.dir = Path(tmp.name)
        self.git('init', '-q', '-b', 'main')
        (self.dir / 'doc.md').write_text(BASE)
        (self.dir / 'msg').write_text('m')
        self.git('add', 'doc.md')
        self.git('commit', '-q', '-m', 'base')

    def git(self, *a):
        return subprocess.run(['git', *a], cwd=self.dir, env=ENV, capture_output=True, text=True, check=True).stdout

    def commit(self, disk, *para):
        (self.dir / 'doc.md').write_text(disk)
        return subprocess.run(['python3', TOOL, '--msg-file', 'msg', '--para', 'doc.md', *para],
                              cwd=self.dir, env=ENV, capture_output=True, text=True)

    def head(self):
        return self.git('show', 'HEAD:doc.md')

    def test_repeated_heading_appends_and_keeps_earlier_paragraph(self):
        new = BASE + "\n#### ACCOUNT FOR NOW\nRound 4 item AB40 new.\n"
        r = self.commit(new, 'AB40 new')
        self.assertEqual(r.returncode, 0, r.stderr + r.stdout)
        h = self.head()
        self.assertIn('AB12 stays', h)
        self.assertIn('original detail', h)
        self.assertIn('AB40 new', h)

    def test_repeated_table_header_appends(self):
        new = BASE + "\n| a | b |\n| - | - |\n| 1 | 2 |\n"
        r = self.commit(new, '| 1 | 2 |')
        self.assertEqual(r.returncode, 0, r.stderr + r.stdout)
        self.assertIn('| 1 | 2 |', self.head())
        self.assertIn('| 0 | 0 |', self.head())

    def test_replace_with_unique_first_line_updates_in_place(self):
        new = BASE.replace('original detail.', 'revised detail.')
        r = self.commit(new, '--replace', 'revised detail')
        self.assertEqual(r.returncode, 0, r.stderr + r.stdout)
        h = self.head()
        self.assertIn('revised detail', h)
        self.assertNotIn('original detail', h)
        self.assertIn('AB12 stays', h)
        self.assertIn('+1 -1 lines', r.stdout)

    def test_replace_with_ambiguous_first_line_refuses(self):
        two = BASE + "\n#### ACCOUNT FOR NOW\nRound 3 intro.\n"
        (self.dir / 'doc.md').write_text(two)
        self.git('commit', '-q', '-am', 'second heading')
        before = self.git('rev-parse', 'HEAD')
        (self.dir / 'doc.md').write_text(two + "\n#### ACCOUNT FOR NOW\nextra line\n")
        r = subprocess.run(['python3', TOOL, '--msg-file', 'msg', '--para', 'doc.md', '--replace', 'extra line'],
                           cwd=self.dir, env=ENV, capture_output=True, text=True)
        self.assertNotEqual(r.returncode, 0)
        self.assertIn('matches 2 HEAD paragraphs', r.stderr)
        self.assertEqual(self.git('rev-parse', 'HEAD'), before)

    def test_summary_reports_removals_against_replaceable_lines(self):
        new = BASE.replace('original detail.', 'revised detail.')
        r = self.commit(new, '--replace', 'revised detail')
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertRegex(r.stdout, r'-1 lines .*2 HEAD lines replaceable')


if __name__ == '__main__':
    unittest.main()
