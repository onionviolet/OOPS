import importlib.util
import io
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

LAUNCHER = Path(__file__).resolve().parents[2] / 'toolsets.py'
spec = importlib.util.spec_from_file_location('toolsets', LAUNCHER)
toolsets = importlib.util.module_from_spec(spec)
spec.loader.exec_module(toolsets)


class LauncherTests(unittest.TestCase):
    def row(self, **extra):
        return {'id': 'fixture', 'kind': 'launch', 'root': '{repo}',
                'argv': [sys.executable, '-c'], 'required': [], 'env': {},
                'probe': None, **extra}

    def test_preserves_arguments_cwd_and_child_exit(self):
        # Process boundary: special characters and spaces never reach a shell.
        argument = 'space ; $(touch forbidden) `literal` "quotes"'
        with tempfile.TemporaryDirectory(prefix='toolsets path ') as folder:
            env = dict(os.environ, YAIR_UNITY_VENV=folder)
            bindir = Path(folder) / 'bin'
            bindir.mkdir()
            (bindir / 'python').symlink_to(sys.executable)
            code = 'import os,sys,json; print(json.dumps([os.getcwd(),sys.argv[1:]])); sys.exit(7)'
            run = subprocess.run([sys.executable, str(LAUNCHER), 'run', 'unitypy', '--', '-c', code, argument],
                                 cwd=folder, env=env, capture_output=True, text=True)
            self.assertEqual(run.returncode, 7)
            cwd, args = json.loads(run.stdout)
            self.assertEqual(Path(cwd).resolve(), Path(folder).resolve())
            self.assertEqual(args, [argument])
            self.assertFalse((Path(folder) / 'forbidden').exists())

    def test_missing_runtime_does_not_fallback_or_exec(self):
        row = self.row(required=['/definitely-missing-tool-runtime'])
        with patch.object(toolsets, 'load_registry', return_value={'fixture': row}), \
             patch.object(os, 'execvpe') as execute, patch('sys.stderr', new=io.StringIO()):
            self.assertEqual(toolsets.main(['run', 'fixture', '--', '--help']), 2)
            execute.assert_not_called()

    def test_environment_precedence_and_no_global_mutation(self):
        env = {'PATH': os.defpath, 'JAVA_HOME': '/chosen jdk', 'PYTHONPATH': '/old'}
        row = self.row(env={'JAVA_HOME': '{java}', 'PYTHONPATH': '{code}/fixture'}, prepend_env=['PYTHONPATH'])
        before = dict(env)
        plan, child = toolsets.plan(row, env)
        self.assertTrue(plan['ready'])
        self.assertEqual(child['JAVA_HOME'], '/chosen jdk')
        self.assertTrue(child['PYTHONPATH'].endswith(os.pathsep + '/old'))
        self.assertEqual(env, before)

    def test_reference_route_cannot_launch(self):
        with self.assertRaisesRegex(ValueError, 'reference route'):
            toolsets.plan({'id': 'browser', 'kind': 'reference', 'owner': 'owner.md'}, {})

    def test_no_probe_does_not_execute_collector(self):
        with patch.object(subprocess, 'run') as execute:
            result = toolsets.diagnose(self.row(), dict(os.environ), probe=True)
            self.assertEqual(result['state'], 'present')
            execute.assert_not_called()

    def test_probe_failure_and_timeout_are_not_ready(self):
        row = self.row(probe=['print(1)'])
        with patch.object(subprocess, 'run', return_value=subprocess.CompletedProcess([], 3, '', 'failure')):
            self.assertEqual(toolsets.diagnose(row, dict(os.environ), True)['state'], 'probe-failed')
        with patch.object(subprocess, 'run', side_effect=subprocess.TimeoutExpired([], 20)):
            self.assertEqual(toolsets.diagnose(row, dict(os.environ), True)['state'], 'probe-timeout')

    def test_probe_non_utf8_output_stays_serializable(self):
        # A child emitting raw (non-UTF-8) bytes must not crash decoding and must
        # keep useful text, the real exit status, and JSON-serializable strings.
        probe = "import os,sys;" \
                " os.write(1,b'version: \\xff\\n');" \
                " os.write(2,b'warning: \\xfe\\n'); sys.exit(3)"
        row = self.row(probe=[probe])
        result = toolsets.diagnose(row, dict(os.environ), True)
        self.assertEqual(result['state'], 'probe-failed')
        self.assertEqual(result['exit_code'], 3)
        self.assertIsInstance(result['stdout'], str)
        self.assertIsInstance(result['stderr'], str)
        self.assertIn('version:', result['stdout'])
        self.assertIn('warning:', result['stderr'])
        # Retained-output limits are preserved even with replacement characters.
        self.assertLessEqual(len(result['stdout']), 16000)
        self.assertLessEqual(len(result['stderr']), 4000)
        # Diagnostics stay JSON-serializable.
        self.assertTrue(json.loads(json.dumps(result, ensure_ascii=False)))

    def test_unknown_batch_id_causes_no_partial_probes(self):
        with patch.object(toolsets, 'diagnose') as diagnose, patch('sys.stderr', new=io.StringIO()):
            self.assertEqual(toolsets.main(['doctor', '--probe', 'rea', 'unknown']), 2)
            diagnose.assert_not_called()

    def test_registry_contract_and_offline_probes(self):
        rows = toolsets.load_registry()
        self.assertGreater(len(rows), 25)
        for row in rows.values():
            self.assertIn(row['kind'], ['launch', 'reference'])
            if row['kind'] == 'launch':
                toolsets.plan(row, dict(os.environ))
                if row['id'] in ['discord-web', 'discord-desktop', 'zlibrary-mcp', 'playtest', 'simfuzz', 'perf']:
                    self.assertIsNone(row['probe'])


if __name__ == '__main__':
    unittest.main()
