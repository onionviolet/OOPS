import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from contextlib import redirect_stdout
from io import StringIO
from unittest.mock import patch

SCRIPT = Path(__file__).parents[1] / "lanes.py"
spec = importlib.util.spec_from_file_location("lanes", SCRIPT)
lanes = importlib.util.module_from_spec(spec)
spec.loader.exec_module(lanes)


class LaneToolTests(unittest.TestCase):
    def make_repo(self, root):
        subprocess.run(["git", "init", "-b", "master"], cwd=root, check=True, capture_output=True)
        subprocess.run(["git", "config", "user.email", "test@example.com"], cwd=root, check=True)
        subprocess.run(["git", "config", "user.name", "Test"], cwd=root, check=True)
        (root / "a").write_text("base\n")
        subprocess.run(["git", "add", "a"], cwd=root, check=True)
        subprocess.run(["git", "commit", "-m", "base"], cwd=root, check=True, capture_output=True)
        subprocess.run(["git", "checkout", "-b", "lane"], cwd=root, check=True, capture_output=True)
        (root / "a").write_text("lane\n")
        subprocess.run(["git", "commit", "-am", "lane"], cwd=root, check=True, capture_output=True)

    def test_alive_rejects_invalid_pids_without_os_signal(self):
        for value in [None, 0, -1, -127, True, False, "123", 1.5, [], {}]:
            with self.subTest(value=value):
                with patch.object(lanes.os, "kill", return_value=None) as kill:
                    self.assertFalse(lanes._alive(value))
                    kill.assert_not_called()

    def test_alive_valid_pid_preserves_outcomes(self):
        for outcome, expected in [(None, True), (ProcessLookupError(), False), (PermissionError(), True)]:
            with self.subTest(outcome=outcome):
                with patch.object(lanes.os, "kill", side_effect=outcome) as kill:
                    self.assertIs(lanes._alive(32145), expected)
                    kill.assert_called_once_with(32145, 0)

    def test_status_marks_invalid_receipt_exited(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "job.log").write_text("hello")
            for value in [0, -1, True]:
                (root / "job.pid.json").write_text(json.dumps({"name": "job", "pid": value,
                    "started_at": 0, "log": str(root / "job.log"), "last_message": str(root / "job.log")}))
                args = type("Args", (), {"runs": str(root), "name": "job"})()
                with redirect_stdout(StringIO()) as out, patch.object(lanes.os, "kill", return_value=None) as kill:
                    self.assertEqual(lanes.status(args), 0)
                self.assertEqual(json.loads(out.getvalue())[0]["status"], "exited")
                kill.assert_not_called()

    def test_launch_not_blocked_by_invalid_receipt(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            runs = root / "runs"
            runs.mkdir()
            work = root / "work"
            work.mkdir()
            prompt = root / "prompt.md"
            prompt.write_text("synthetic fixture only")
            (runs / "job.pid.json").write_text(json.dumps({"name": "job", "pid": -1,
                "started_at": 0, "log": str(runs / "job.log"), "last_message": str(runs / "job.last.md")}))
            args = type("Args", (), {"runs": str(runs), "prompt": str(prompt), "workdir": str(work),
                "binary": "/fake/codex", "name": "job", "resume": None, "model": "fixture",
                "effort": "low", "approve_for_me": False, "add_dir": []})()
            class FakeProcess:
                pid = 32145
            with patch.object(lanes.subprocess, "Popen", return_value=FakeProcess()) as popen, \
                    patch.object(lanes.os, "kill", return_value=None) as kill, redirect_stdout(StringIO()):
                self.assertEqual(lanes.launch(args), 0)
            self.assertEqual(popen.call_count, 1)
            kill.assert_not_called()
            self.assertEqual(json.loads((runs / "job.pid.json").read_text())["pid"], 32145)

    def test_launch_writes_receipt_and_forwards_prompt(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            runs = root / "run artifacts"
            work = root / "checkout"
            work.mkdir()
            prompt = root / "prompt.md"
            prompt.write_text("bounded lane prompt")
            args = type("Args", (), {"runs": str(runs), "prompt": str(prompt), "workdir": str(work),
                "binary": "/fake/codex", "name": "sample", "resume": "session-7", "model": "gpt-6-luna",
                "effort": "low", "approve_for_me": True, "add_dir": [str(root / "extra") ]})()
            class FakeProcess:
                pid = 12345
            with patch.object(lanes.subprocess, "Popen", return_value=FakeProcess()) as popen:
                with redirect_stdout(StringIO()):
                    self.assertEqual(lanes.launch(args), 0)
            receipt = json.loads((runs / "sample.pid.json").read_text())
            self.assertEqual(Path(receipt["cwd"]), work.resolve())
            self.assertTrue((runs / "sample.log").exists())
            command = popen.call_args.args[0]
            self.assertEqual(command[0:4], ["/fake/codex", "exec", "resume", "session-7"])
            self.assertIn("--approve-for-me", command)
            self.assertIn("bounded lane prompt", command)
            self.assertIn(str((root / "extra").resolve()), command)

    def test_status_reports_receipt_and_artifacts(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "job.log").write_text("hello")
            (root / "job.last.md").write_text("done")
            (root / "job.pid.json").write_text(json.dumps({"name": "job", "pid": 99999999,
                "started_at": 0, "log": str(root / "job.log"), "last_message": str(root / "job.last.md")}))
            args = type("Args", (), {"runs": str(root), "name": None})()
            with redirect_stdout(StringIO()):
                self.assertEqual(lanes.status(args), 0)

    def test_merge_report_flags_dirty_tree(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.make_repo(root)
            (root / "dirty").write_text("untracked")
            args = type("Args", (), {"repo": str(root), "base": "master"})()
            with redirect_stdout(StringIO()):
                self.assertEqual(lanes.merge_report(args), 1)

    def test_merge_report_ready_clean_branch(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.make_repo(root)
            args = type("Args", (), {"repo": str(root), "base": "master"})()
            with redirect_stdout(StringIO()):
                self.assertEqual(lanes.merge_report(args), 0)

    def test_merge_report_flags_stale_base(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.make_repo(root)
            subprocess.run(["git", "checkout", "master"], cwd=root, check=True, capture_output=True)
            (root / "b").write_text("new base\n")
            subprocess.run(["git", "add", "b"], cwd=root, check=True)
            subprocess.run(["git", "commit", "-m", "advance base"], cwd=root, check=True, capture_output=True)
            subprocess.run(["git", "checkout", "lane"], cwd=root, check=True, capture_output=True)
            args = type("Args", (), {"repo": str(root), "base": "master"})()
            with redirect_stdout(StringIO()):
                self.assertEqual(lanes.merge_report(args), 1)

    def test_merge_report_flags_merge_conflict(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.make_repo(root)
            subprocess.run(["git", "checkout", "master"], cwd=root, check=True, capture_output=True)
            (root / "a").write_text("base conflicting change\n")
            subprocess.run(["git", "commit", "-am", "conflict on base"], cwd=root, check=True, capture_output=True)
            subprocess.run(["git", "checkout", "lane"], cwd=root, check=True, capture_output=True)
            args = type("Args", (), {"repo": str(root), "base": "master"})()
            with redirect_stdout(StringIO()):
                self.assertEqual(lanes.merge_report(args), 1)


if __name__ == "__main__":
    unittest.main()
