import contextlib
import importlib.util
import io
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

SPEC = importlib.util.spec_from_file_location('correction_sweep', Path(__file__).with_name('correction_sweep.py'))
sweep = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = sweep
SPEC.loader.exec_module(sweep)


class CorrectionSweepTests(unittest.TestCase):
    def test_import_does_not_scan_or_print(self):
        output = io.StringIO()
        with patch.object(Path, 'open', side_effect=AssertionError('import scanned files')), patch.object(Path, 'glob', side_effect=AssertionError('import discovered files')), contextlib.redirect_stdout(output):
            SPEC.loader.exec_module(sweep)
        self.assertEqual(output.getvalue(), '')

    def test_relay_excluded_and_human_retained(self):
        for text in ('Retained source order\n[1] assistant: Why is it broken?',
                     '[3] assistant: We should simplify the panel.',
                     'Claude said:\nThe panel is wrong.',
                     'Message Type: NEW_TASK\nPayload: Fix the broken panel.',
                     '# AGENTS.md instructions\nNever change this panel.'):
            self.assertFalse(sweep.human_text(text)[0])
        text, reason = sweep.human_text('Why is the button still hidden?')
        self.assertEqual(text, 'Why is the button still hidden?')
        self.assertEqual(reason, 'human_origin_candidate')
        text, _ = sweep.human_text('> The assistant says the button is broken.\nWhy is it still hidden?')
        self.assertEqual(text, 'Why is it still hidden?')
        self.assertEqual(sweep.human_text('```\nWrong panel\n```')[0], '')
        long_question = 'Why is this missing? ' + 'context ' * 100
        self.assertEqual(sweep.human_text(long_question)[0], long_question.strip())
        self.assertFalse(sweep.human_text('This session is being continued from a previous conversation. Why is it broken?')[0])

    def test_duplicate_transport_once_repeated_human_retained_and_machine_excluded(self):
        def message(when, transport='response', identity=''):
            p = {'type': 'message', 'role': 'user', 'content': [{'type': 'input_text', 'text': 'Why is the button still hidden?'}], 'id': identity}
            if transport == 'event':
                p = {'type': 'user_message', 'message': 'Why is the button still hidden?'}
            return {'timestamp': when, 'payload': p}
        def meta(source):
            return {'type': 'session_meta', 'payload': {'cwd': '/tmp/yet-another-idle-rpg', 'source': source}}
        with tempfile.TemporaryDirectory() as tmp:
            human = Path(tmp)/'human.jsonl'
            record = message('2026-10-26T14:20:01Z', identity='a')
            human.write_text('\n'.join(map(json.dumps, [meta('vscode'), record, message('2026-10-26T14:20:02Z', 'event'), record, message('2026-10-26T14:20:04Z', identity='b'), message('2026-10-26T14:30:00Z', identity='c')])) + '\n')
            machine = Path(tmp)/'machine.jsonl'
            machine.write_text('\n'.join(map(json.dumps, [meta({'subagent': {}}), record])))
            automated = Path(tmp)/'exec.jsonl'
            automated.write_text('\n'.join(map(json.dumps, [meta('exec'), record])))
            result = sweep.summarize([(human, 'codex'), (machine, 'codex'), (automated, 'codex')], *map(sweep.stamp, ('2026-10-26T14:10:00Z', '2026-10-26T14:25:00Z', '2026-10-26T14:30:00Z')))
        self.assertEqual(result['counts']['before']['human_origin_candidates'], 2)
        self.assertEqual(result['exclusions']['duplicate_event'], 2)
        self.assertEqual(result['exclusions']['machine_session_or_record'], 2)
        self.assertEqual(result['counts']['after'], {})
        self.assertEqual(result['class_keyword_candidates']['before']['IPC44'], 2)
        encoded = json.dumps(result)
        self.assertNotIn('button', encoded)
        self.assertNotIn('human.jsonl', encoded)

    def test_claude_sidechain_meta_and_quotes_excluded(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp)/'sample.jsonl'
            base = {'type': 'user', 'timestamp': '2026-10-26T14:20:00Z', 'message': {'role': 'user', 'content': 'Why is the panel broken?'}}
            path.write_text('\n'.join(map(json.dumps, [dict(base, isSidechain=True), dict(base, isMeta=True), dict(base, uuid='human')])))
            result = sweep.summarize([(path, 'claude')], *map(sweep.stamp, ('2026-10-26T14:10:00Z', '2026-10-26T14:25:00Z', '2026-10-26T14:30:00Z')))
        self.assertEqual(result['counts']['before']['human_origin_candidates'], 1)
        self.assertEqual(result['exclusions']['machine_session_or_record'], 2)


if __name__ == '__main__':
    unittest.main()
