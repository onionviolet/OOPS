"""Synthetic C4 coverage regression; no source or reader output writes."""
import runpy
import unittest
validate = runpy.run_path('docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c4/fold.py')['validate_output']
class FoldTest(unittest.TestCase):
    def test_artifact_partial_and_overlap(self):
        row=dict(id='a',label=None,holder_by_date=[],effect=[],cost_or_drawback=[],containment=[],access_route=[],gaps=[])
        good=[row,{'unread':['b']}]
        got=validate([{'id':'a'},{'id':'b'}],good,'gm33')
        self.assertEqual(got,([row],{'b'}))
        for output in [[row,{'unread':['a','b']}],[row,{'unread':[]}],[row,{'unread':['foreign']}],[row]]:
            with self.assertRaises(AssertionError):validate([{'id':'a'},{'id':'b'}],output,'gm33')
    def test_procedure_usable_requires_supported_shape(self):
        row=dict(family='craft',ids=['a'],label='fixture',locators=['fixture'],conditions=[],inputs=[],performers=[],steps=[],outcomes=[],products=[],costs=[],limits=[],consequences=[],scale=None,tags=[],gaps=[],usable=True)
        with self.assertRaises(AssertionError):validate([{'id':'a'}],[row,{'unread':[]}],'methods')
        row['usable']=False
        self.assertEqual(validate([{'id':'a'}],[row,{'unread':[]}],'methods'),([row],set()))
if __name__ == '__main__': unittest.main()
