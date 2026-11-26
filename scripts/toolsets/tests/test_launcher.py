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

    def test_owner_documents_resolve_without_runtime_and_without_launch(self):
        with tempfile.TemporaryDirectory(prefix='toolsets owners ') as folder:
            owner = Path(folder) / 'fixture repo' / 'docs' / 'OWNER.md'
            owner.parent.mkdir(parents=True)
            owner.write_text('Fixture owner text', encoding='utf-8')
            row = self.row(required=[str(Path(folder) / 'missing-runtime')], documents=[{
                'id':'scope', 'path':'{code}/fixture repo/docs/OWNER.md',
                'original_path':'/Users/fixture/code/fixture repo/docs/OWNER.md'}])
            env = dict(os.environ, YAIR_TOOLS_CODE=folder)
            with patch.object(toolsets, 'load_registry', return_value={'fixture':row}), \
                 patch.dict(os.environ, env, clear=True), \
                 patch.object(subprocess, 'run') as execute, \
                 patch('sys.stdout', new=io.StringIO()) as output:
                self.assertEqual(toolsets.main(['show','fixture']),0)
                shown=json.loads(output.getvalue())
                self.assertFalse(shown['resolved']['ready'])
                document=shown['resolved_documents'][0]
                self.assertEqual(Path(document['path']),owner)
                self.assertEqual(document['state'],'present')
                self.assertEqual(document['sha256'],toolsets.hashlib.sha256(owner.read_bytes()).hexdigest())
                self.assertIsNone(document['recorded'])
                self.assertIsNone(document['matches_recorded'])
                execute.assert_not_called()

    def test_owner_provenance_distinguishes_missing_current_and_historical_digest(self):
        row=toolsets.load_registry()['discord']
        with tempfile.TemporaryDirectory(prefix='toolsets owner provenance ') as folder:
            env={'YAIR_TOOLS_CODE':folder}
            absent=toolsets.resolve_documents(row,env)[0]
            self.assertEqual(absent['state'],'missing')
            self.assertIsNone(absent['sha256'])
            self.assertIsNone(absent['matches_recorded'])
            self.assertEqual(absent['recorded']['sha256'],
                             'bcc8768fa5e712dab9cc67ae862083598bc7b8d275554ff12794f4dd94825553')
            owner=Path(absent['path']);owner.parent.mkdir(parents=True)
            owner.write_text('A different fixture revision',encoding='utf-8')
            present=toolsets.resolve_documents(row,env)[0]
            self.assertEqual(present['state'],'present')
            self.assertFalse(present['matches_recorded'])
            self.assertEqual(present['original_path'],absent['original_path'])
            self.assertEqual(present['recorded'],absent['recorded'])

    def test_owner_scoped_doctor_reports_document_absence_without_executing_missing_tool(self):
        with tempfile.TemporaryDirectory(prefix='toolsets missing owners ') as folder:
            row=self.row(required=[str(Path(folder)/'missing-runtime')],probe=['--help'],documents=[{
                'id':'scope','path':'{code}/missing/OWNER.md','original_path':'/original/OWNER.md'}])
            with patch.object(subprocess,'run') as execute:
                result=toolsets.diagnose(row,dict(os.environ,YAIR_TOOLS_CODE=folder),probe=True)
                self.assertEqual(result['state'],'missing')
                self.assertEqual(result['documents'][0]['state'],'missing')
                execute.assert_not_called()

    def test_owner_locators_preserve_all_eight_original_document_identities(self):
        registry=toolsets.load_registry()
        actual={document['original_path'] for tool in ['discord','source-library']
                for document in registry[tool]['documents']}
        expected={
            '/Users/weiwei/code/discord-reference-workbench/README.md',
            '/Users/weiwei/code/discord-reference-workbench/docs/LOCAL_COLLECTOR.md',
            *('/Users/weiwei/code/zlibrary-research/docs/'+name for name in [
                'SOURCE_LIBRARY_0_5_0.md','KAVITA_READER_0_6_1.md','INTEGRATED_READER_0_6_0.md',
                'LIGHT_NOVEL_SOURCES_0_5_2.md','SUWAYOMI_EXTENSIONS_2026-10-22.md','YAIRPG.md'])}
        self.assertEqual(actual,expected)
        for tool in ['discord','source-library']:
            documents=registry[tool]['documents']
            self.assertEqual(len({document['id'] for document in documents}),len(documents))
            self.assertTrue(all(document['path'].startswith(registry[tool]['root']+'/') for document in documents))


if __name__ == '__main__':
    unittest.main()
