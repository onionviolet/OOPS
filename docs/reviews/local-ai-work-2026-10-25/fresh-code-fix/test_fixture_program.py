import importlib.util
from pathlib import Path
import subprocess
import sys
import unittest

spec=importlib.util.spec_from_file_location('fixture_program',Path(__file__).resolve().parents[1]/'fixture_program.py')
fixture=importlib.util.module_from_spec(spec)
spec.loader.exec_module(fixture)

class FixtureProgramTests(unittest.TestCase):
    def test_preserves_binary_unicode_quotes_and_exit(self):
        out=bytes([255,0,10,34,92])+'✓'.encode('utf-8')
        err=bytes([254,10,39,92])
        source=fixture.output_program(out,err,7)
        source.encode('ascii')
        run=subprocess.run([sys.executable,'-c',source],capture_output=True,timeout=5)
        self.assertEqual(run.stdout,out)
        self.assertEqual(run.stderr,err)
        self.assertEqual(run.returncode,7)

    def test_empty_program_and_cli_file(self):
        source=fixture.output_program()
        run=subprocess.run([sys.executable,'-c',source],capture_output=True,timeout=5)
        self.assertEqual((run.returncode,run.stdout,run.stderr),(0,b'',b''))
        import tempfile
        with tempfile.TemporaryDirectory() as td:
            path=Path(td)/'fixture with spaces.py'
            subprocess.run([sys.executable,str(Path(fixture.__file__)),'--stdout-hex','ff0a','--stderr-hex','fe','--exit-code','3','--out',str(path)],check=True,timeout=5)
            run=subprocess.run([sys.executable,str(path)],capture_output=True,timeout=5)
            self.assertEqual((run.returncode,run.stdout,run.stderr),(3,bytes([255,10]),bytes([254])))

    def test_invalid_payload_or_status_is_rejected(self):
        with self.assertRaises(TypeError):fixture.output_program('not bytes')
        for status in [True,-1,256,1.5]:
            with self.subTest(status=status),self.assertRaises(ValueError):fixture.output_program(exit_code=status)
if __name__=='__main__':unittest.main()
