import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

RUNNER = Path(__file__).resolve().parents[1] / 'verify_task.py'

class VerificationTests(unittest.TestCase):
    def run_case(self, checks):
        folder = tempfile.TemporaryDirectory(prefix='local-check-runner-')
        self.addCleanup(folder.cleanup)
        cwd = Path(folder.name)
        (cwd / 'source.py').write_text('initial\n')
        (cwd / 'checks.json').write_text(json.dumps({'sources': ['source.py'], 'checks': checks}))
        run = subprocess.run([sys.executable, str(RUNNER), 'checks.json',
                              '--receipt', 'receipt.json'], cwd=cwd,
                             capture_output=True, text=True, timeout=10)
        receipt = json.loads((cwd / 'receipt.json').read_text())
        return run, receipt, cwd

    def command(self, code, **extra):
        return {'name': 'fixture', 'argv': [sys.executable, '-c', code], **extra}

    def test_pass_records_all_checks_and_current_hashes(self):
        run, receipt, _ = self.run_case([self.command('print("one")'), self.command('print("two")')])
        self.assertEqual(run.returncode, 0)
        self.assertTrue(receipt['pass'])
        self.assertEqual(len(receipt['checks']), 2)
        self.assertEqual(receipt['sources_before'], receipt['sources_after'])

    def test_failure_stops_before_later_command(self):
        run, receipt, cwd = self.run_case([self.command('import sys; print("FAIL DETAILS", file=sys.stderr); raise SystemExit(7)'),
            self.command('from pathlib import Path; Path("forbidden").touch()')])
        self.assertEqual(run.returncode, 1)
        self.assertFalse(receipt['pass'])
        self.assertEqual(receipt['checks'][0]['exit_code'], 7)
        self.assertIn('FAIL DETAILS', run.stderr)
        self.assertEqual(len(receipt['checks']), 1)
        self.assertFalse((cwd / 'forbidden').exists())

    def test_changed_source_prevents_pass_even_with_exit_zero(self):
        run, receipt, _ = self.run_case([self.command('from pathlib import Path; Path("source.py").write_text("changed")')])
        self.assertEqual(run.returncode, 1)
        self.assertFalse(receipt['pass'])
        self.assertFalse(receipt['sources_unchanged'])

    def test_invalid_output_bytes_are_recorded(self):
        run, receipt, _ = self.run_case([self.command('import os; os.write(1,bytes([255])); os.write(2,bytes([254]))')])
        self.assertEqual(run.returncode, 0)
        self.assertEqual(receipt['checks'][0]['stdout'], '\ufffd')
        self.assertEqual(receipt['checks'][0]['stderr'], '\ufffd')

    def test_timeout_fails_without_later_check(self):
        run, receipt, _ = self.run_case([self.command('import time; time.sleep(1)', timeout_seconds=0.05),
                                        self.command('print("not reached")')])
        self.assertEqual(run.returncode, 1)
        self.assertEqual(receipt['checks'][0]['error'], 'timeout')
        self.assertEqual(len(receipt['checks']), 1)

    def test_argv_is_not_interpreted_by_shell(self):
        value = 'literal ; $(touch forbidden) ' + chr(96) + 'literal' + chr(96)
        check = {'argv': [sys.executable, '-c', 'import sys; print(sys.argv[1])', value]}
        run, receipt, cwd = self.run_case([check])
        self.assertEqual(run.returncode, 0)
        self.assertEqual(receipt['checks'][0]['stdout'].strip(), value)
        self.assertFalse((cwd / 'forbidden').exists())

    def test_edit_after_pass_makes_recorded_hash_stale(self):
        run, receipt, cwd = self.run_case([self.command('print("pass")')])
        self.assertEqual(run.returncode, 0)
        (cwd / 'source.py').write_text('edited after verification')
        import hashlib
        self.assertNotEqual(receipt['sources_after']['source.py'],
                            hashlib.sha256((cwd / 'source.py').read_bytes()).hexdigest())

if __name__ == '__main__':
    unittest.main()
