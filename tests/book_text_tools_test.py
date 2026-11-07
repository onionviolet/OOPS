"""Book text tools (docs/research/tools/book_deep_dive, scripts/library_coverage.py) must not lose
or mislabel text silently. Every fixture is a generated EPUB-shaped ZIP in a temp dir; no acquired
or user EPUB is read. Run: python3 -I tests/book_text_tools_test.py

F16 (docs/audits/idea-audit-2026-11-06/COMPLETION_10_SOURCE_PLAYBOOK.md): two distinct bodies with
the same basename in different folders collapsed into one member, and a volume restart made the
merger keep only the later Chapter 1 while reporting one "duplicate" and zero missing.
Set BOOK_TOOLS_DIR to run the same checks against another copy of the tools.
"""
import importlib.util
import json
import os
import subprocess
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TOOLS = Path(os.environ.get('BOOK_TOOLS_DIR') or ROOT / 'docs/research/tools/book_deep_dive')
COVERAGE = ROOT / 'scripts/library_coverage.py'


def xhtml(title, *paras, raw=None, encoding='utf-8', decl=True):
    body = raw if raw is not None else ''.join(f'<p>{p}</p>' for p in paras)
    head = f'<?xml version="1.0" encoding="{encoding}"?>\n' if decl else ''
    return (head + '<html xmlns="http://www.w3.org/1999/xhtml"><head>'
            f'<title>{title}</title><style>p {{ margin: 0 }}</style></head><body>{body}</body></html>').encode(encoding)


def make_epub(path, members, spine=None, opf_dir='OEBPS'):
    """members: list of (archive path, bytes). spine: archive paths in reading order (default: members order)."""
    spine = spine if spine is not None else [m for m, _ in members if m.endswith(('html', 'htm'))]
    items, refs = [], []
    for i, m in enumerate(spine):
        rel = os.path.relpath(m, opf_dir)
        items.append(f'<item id="i{i}" href="{rel}" media-type="application/xhtml+xml"/>')
        refs.append(f'<itemref idref="i{i}"/>')
    opf = ('<?xml version="1.0"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0">'
           '<metadata/><manifest>' + ''.join(items) + '</manifest><spine>' + ''.join(refs) + '</spine></package>')
    container = ('<?xml version="1.0"?><container xmlns="urn:oasis:names:tc:opendocument:xmlns:container" version="1.0">'
                 f'<rootfiles><rootfile full-path="{opf_dir}/content.opf" media-type="application/oebps-package+xml"/>'
                 '</rootfiles></container>')
    with zipfile.ZipFile(path, 'w') as z:
        z.writestr('mimetype', 'application/epub+zip')
        z.writestr('META-INF/container.xml', container)
        z.writestr(f'{opf_dir}/content.opf', opf)
        for name, data in members:
            z.writestr(name, data)
    return path


def run(tool, *args):
    p = subprocess.run([sys.executable, '-I', str(TOOLS / tool), *map(str, args)], capture_output=True, text=True)
    return p


def load(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)


class Base(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.d = Path(self.tmp.name)

    def tearDown(self):
        self.tmp.cleanup()


class EpubToJson(Base):
    def test_f16_same_basename_in_two_folders_keeps_both_bodies(self):
        book = make_epub(self.d / 'b.epub', [
            ('OEBPS/vol1/part.xhtml', xhtml('Book', 'Chapter 1', 'First distinct body.')),
            ('OEBPS/vol2/part.xhtml', xhtml('Book', 'Chapter 2', 'Second distinct body.')),
        ])
        p = run('epub_to_json.py', book, self.d / 'o.json')
        self.assertEqual(p.returncode, 0, p.stderr)
        out = load(self.d / 'o.json')
        self.assertEqual(list(out), ['OEBPS/vol1/part.xhtml', 'OEBPS/vol2/part.xhtml'])
        self.assertIn('First distinct body.', out['OEBPS/vol1/part.xhtml'][1])
        self.assertIn('Second distinct body.', out['OEBPS/vol2/part.xhtml'][1])
        self.assertIn('2 members', p.stdout)

    def test_spine_order_wins_over_archive_name_order(self):
        book = make_epub(self.d / 'b.epub', [
            ('OEBPS/a_end.xhtml', xhtml('Book', 'Chapter 2', 'Later.')),
            ('OEBPS/z_start.xhtml', xhtml('Book', 'Chapter 1', 'Earlier.')),
        ], spine=['OEBPS/z_start.xhtml', 'OEBPS/a_end.xhtml'])
        run('epub_to_json.py', book, self.d / 'o.json')
        self.assertEqual(list(load(self.d / 'o.json')), ['OEBPS/z_start.xhtml', 'OEBPS/a_end.xhtml'])

    def test_html_outside_spine_is_kept_and_reported(self):
        book = make_epub(self.d / 'b.epub', [
            ('OEBPS/c1.xhtml', xhtml('Book', 'Chapter 1', 'In spine.')),
            ('OEBPS/extra.xhtml', xhtml('Book', 'Afterword', 'Not in spine.')),
        ], spine=['OEBPS/c1.xhtml'])
        p = run('epub_to_json.py', book, self.d / 'o.json')
        out = load(self.d / 'o.json')
        self.assertEqual(list(out), ['OEBPS/c1.xhtml', 'OEBPS/extra.xhtml'])
        self.assertIn('not in spine', p.stderr)

    def test_head_style_and_title_are_not_body_text_and_heading_is_found(self):
        book = make_epub(self.d / 'b.epub', [
            ('OEBPS/c.xhtml', xhtml('Series Title Vol 3', raw='<div class="x">Translator note</div>'
                                    '<script>var a=1;</script><h2>Chapter 7</h2><p>Body.</p>')),
        ])
        run('epub_to_json.py', book, self.d / 'o.json')
        heading, body = load(self.d / 'o.json')['OEBPS/c.xhtml']
        self.assertEqual(heading, 'Chapter 7')
        self.assertNotIn('Series Title', body)
        self.assertNotIn('margin', body)
        self.assertNotIn('var a', body)

    def test_inline_tags_do_not_split_a_paragraph(self):
        book = make_epub(self.d / 'b.epub', [
            ('OEBPS/c.xhtml', xhtml('B', 'Chapter 1', 'He <i>said</i> no, <b>twice</b>&nbsp;over &amp; out.')),
        ])
        run('epub_to_json.py', book, self.d / 'o.json')
        body = load(self.d / 'o.json')['OEBPS/c.xhtml'][1]
        self.assertIn('He said no, twice\xa0over & out.', body)

    def test_declared_gbk_member_decodes_instead_of_dropping_bytes(self):
        book = make_epub(self.d / 'b.epub', [
            ('OEBPS/c.xhtml', xhtml('书', '第1章 开端', '克莱恩醒来。', encoding='gbk')),
        ])
        p = run('epub_to_json.py', book, self.d / 'o.json')
        heading, body = load(self.d / 'o.json')['OEBPS/c.xhtml']
        self.assertEqual(heading, '第1章 开端')
        self.assertIn('克莱恩醒来。', body)
        self.assertNotIn('undecodable', p.stderr)

    def test_undecodable_bytes_are_reported(self):
        bad = xhtml('B', 'Chapter 1', 'ok').replace(b'ok', b'ok \xff\xfe broken', 1)
        book = make_epub(self.d / 'b.epub', [('OEBPS/c.xhtml', bad)])
        p = run('epub_to_json.py', book, self.d / 'o.json')
        self.assertEqual(p.returncode, 0, p.stderr)
        self.assertIn('undecodable', p.stderr)

    def test_no_container_falls_back_to_archive_order(self):
        with zipfile.ZipFile(self.d / 'b.epub', 'w') as z:
            z.writestr('x/a.html', xhtml('B', 'Chapter 1', 'A.'))
            z.writestr('y/a.html', xhtml('B', 'Chapter 2', 'B.'))
        p = run('epub_to_json.py', self.d / 'b.epub', self.d / 'o.json')
        self.assertEqual(list(load(self.d / 'o.json')), ['x/a.html', 'y/a.html'])
        self.assertIn('no OPF spine', p.stderr)

    def test_help_does_not_write_a_file(self):
        p = run('epub_to_json.py', '--help')
        self.assertEqual(p.returncode, 0)
        self.assertIn('usage', p.stdout.lower())


class MergeVolumes(Base):
    def vol(self, name, *chapters):
        return make_epub(self.d / name, [
            (f'OEBPS/Text/c{i}.xhtml', xhtml('Book', h, b)) for i, (h, b) in enumerate(chapters)])

    def test_f16_volume_restart_keeps_both_chapter_ones(self):
        v1 = self.vol('v1.epub', ('Chapter 1', 'Volume 1 body.'), ('Chapter 2', 'V1 two.'))
        v2 = self.vol('v2.epub', ('Chapter 1', 'Volume 2 body.'), ('Chapter 3', 'V2 three.'))
        p = run('merge_volumes.py', self.d / 'o.json', v1, v2)
        self.assertEqual(p.returncode, 0, p.stderr)
        out = load(self.d / 'o.json')
        self.assertEqual(list(out), ['v01ch00001', 'v01ch00002', 'v02ch00001', 'v02ch00003'])
        self.assertIn('Volume 1 body.', out['v01ch00001'][1])
        self.assertIn('Volume 2 body.', out['v02ch00001'][1])
        self.assertIn('0 duplicates', p.stdout)
        self.assertIn('restart', p.stdout)
        self.assertIn('v02: missing [2]', p.stdout)

    def test_true_duplicate_is_kept_once_and_counted(self):
        v1 = self.vol('v1.epub', ('Chapter 1', 'One.'), ('Chapter 2', 'Two.'))
        v2 = self.vol('v2.epub', ('Chapter 2', 'Two.'), ('Chapter 3', 'Three.'))
        p = run('merge_volumes.py', self.d / 'o.json', v1, v2)
        self.assertEqual(list(load(self.d / 'o.json')), ['ch00001', 'ch00002', 'ch00003'])
        self.assertIn('1 duplicates', p.stdout)
        self.assertIn('0 missing', p.stdout)

    def test_continuous_volumes_keep_plain_chapter_keys(self):
        v1 = self.vol('v1.epub', ('Chapter 1', 'One.'), ('Chapter 2', 'Two.'))
        v2 = self.vol('v2.epub', ('Chapter 3', 'Three.'))
        run('merge_volumes.py', self.d / 'o.json', v1, v2)
        self.assertEqual(list(load(self.d / 'o.json')), ['ch00001', 'ch00002', 'ch00003'])

    def test_split_chapter_keeps_every_part(self):
        v1 = self.vol('v1.epub', ('Chapter 5 (1)', 'First half.'), ('Chapter 5 (2)', 'Second half.'),
                      ('Chapter 6', 'Six.'))
        p = run('merge_volumes.py', self.d / 'o.json', v1)
        out = load(self.d / 'o.json')
        self.assertEqual(list(out), ['ch00005', 'ch00005-2', 'ch00006'])
        self.assertIn('Second half.', out['ch00005-2'][1])
        self.assertIn('1 split parts', p.stdout)

    def test_basename_clash_across_folders_is_not_a_duplicate(self):
        v = make_epub(self.d / 'v.epub', [
            ('OEBPS/a/part.xhtml', xhtml('B', 'Chapter 1', 'Alpha.')),
            ('OEBPS/b/part.xhtml', xhtml('B', 'Chapter 2', 'Beta.')),
        ])
        p = run('merge_volumes.py', self.d / 'o.json', v)
        self.assertEqual(list(load(self.d / 'o.json')), ['ch00001', 'ch00002'])
        self.assertIn('0 duplicates', p.stdout)

    def test_restart_inside_one_compilation_starts_a_new_volume(self):
        v = self.vol('c.epub', ('Chapter 1', 'A1.'), ('Chapter 2', 'A2.'), ('Chapter 1', 'B1.'), ('Chapter 2', 'B2.'))
        run('merge_volumes.py', self.d / 'o.json', v)
        self.assertEqual(list(load(self.d / 'o.json')), ['v01ch00001', 'v01ch00002', 'v02ch00001', 'v02ch00002'])

    def test_unnumbered_text_is_reported(self):
        v = self.vol('v.epub', ('Prologue', 'Before it all.'), ('Chapter 1', 'One.'), ('Side Story', 'Extra.'))
        p = run('merge_volumes.py', self.d / 'o.json', v)
        self.assertIn('2 unnumbered members skipped', p.stdout)
        self.assertIn('Prologue', p.stdout)

    def test_chinese_numeral_and_uppercase_headings_are_numbered(self):
        v = self.vol('v.epub', ('第一章 开端', '一。'), ('第十二章 远行', '十二。'), ('CHAPTER 13', 'Thirteen.'),
                     ('第一百零五章 归来', '一百零五。'))
        run('merge_volumes.py', self.d / 'o.json', v)
        self.assertEqual(list(load(self.d / 'o.json')), ['ch00001', 'ch00012', 'ch00013', 'ch00105'])

    def test_long_real_heading_counts_but_prose_mention_does_not(self):
        long_heading = 'Chapter 681: The Incredible Adventures and ' + 'Astonishing Exploits ' * 5
        v = self.vol('v.epub', ('Chapter 2', 'Two.'), (long_heading, 'Body.'),
                     ('He reread chapter 9 of the manual, which ' + 'went on and on ' * 10, 'Body.'))
        p = run('merge_volumes.py', self.d / 'o.json', v)
        self.assertEqual(list(load(self.d / 'o.json')), ['ch00002', 'ch00681'])
        self.assertIn('1 unnumbered', p.stdout)


    def test_contents_and_notes_pages_are_not_chapters(self):
        v = self.vol('v.epub', ('Table of Contents', 'Chapter 1: Start'),
                     ('Chapter 1', 'Real one.'), ('Chapter 2', 'Real two.'),
                     ('Notes', 'Content from Chapter 1: Start to Chapter 2: Next'))
        p = run('merge_volumes.py', self.d / 'o.json', v)
        out = load(self.d / 'o.json')
        self.assertEqual(list(out), ['ch00001', 'ch00002'])
        self.assertIn('Real one.', out['ch00001'][1])
        self.assertIn('0 split parts', p.stdout)
        self.assertIn('2 unnumbered', p.stdout)

    def test_index_page_without_contents_title_is_skipped(self):
        v = make_epub(self.d / 'v.epub', [
            ('OEBPS/i.xhtml', xhtml('B', 'Index', 'Chapter 1 A', 'Chapter 2 B', 'Chapter 3 C')),
            ('OEBPS/c.xhtml', xhtml('B', 'Chapter 1', 'One.'))])
        run('merge_volumes.py', self.d / 'o.json', v)
        self.assertEqual(list(load(self.d / 'o.json')), ['ch00001'])

    def test_volume_prefixed_heading_is_numbered(self):
        v = self.vol('v.epub', ('Volume 2 - Chapter 7: Exile', 'Seven.'), ('第二卷 第八章 归来', '八。'))
        run('merge_volumes.py', self.d / 'o.json', v)
        self.assertEqual(list(load(self.d / 'o.json')), ['ch00007', 'ch00008'])


class Readers(Base):
    def test_grep_ctx_follows_file_order_and_volume_keys(self):
        data = {'v01ch00002': ['Chapter 2', 'needle one'], 'v01ch00010': ['Chapter 10', 'x'],
                'v02ch00001': ['Chapter 1', 'needle two']}
        (self.d / 'm.json').write_text(json.dumps(data))
        p = run('grep_ctx.py', self.d / 'm.json', 20, 10, 'needle')
        lines = [l for l in p.stdout.splitlines() if l.startswith('##')]
        self.assertEqual(lines, ['## v01ch00002 vol1 Chapter 2', '## v02ch00001 vol2 Chapter 1'])

    def test_grep_ctx_numeric_keys_sort_numerically(self):
        data = {'10': ['Chapter 10', 'needle ten'], '2': ['Chapter 2', 'needle two']}
        (self.d / 'n.json').write_text(json.dumps(data))
        p = run('grep_ctx.py', self.d / 'n.json', 20, 10, 'needle')
        keys = [l.split()[1] for l in p.stdout.splitlines() if l.startswith('##')]
        self.assertEqual(keys, ['2', '10'])

    def test_json_range_reads_merged_keys(self):
        data = {'ch00001': ['Chapter 1', 'a'], 'ch00002': ['Chapter 2', 'b'], 'ch00002-2': ['Chapter 2 (2)', 'c'],
                'ch00003': ['Chapter 3', 'd']}
        (self.d / 'm.json').write_text(json.dumps(data))
        p = run('json_range.py', self.d / 'm.json', 2, 2)
        self.assertEqual(p.returncode, 0, p.stderr)
        self.assertIn('[ch00002]', p.stdout)
        self.assertIn('[ch00002-2]', p.stdout)
        self.assertNotIn('[ch00001]', p.stdout)

    def test_json_range_volume_keys_need_volume(self):
        data = {'v01ch00001': ['Chapter 1', 'a'], 'v02ch00001': ['Chapter 1', 'b']}
        (self.d / 'm.json').write_text(json.dumps(data))
        p = run('json_range.py', self.d / 'm.json', 1, 1, '--vol', 2)
        self.assertIn('[v02ch00001]', p.stdout)
        self.assertNotIn('[v01ch00001]', p.stdout)
        p = run('json_range.py', self.d / 'm.json', 1, 1)
        self.assertNotEqual(p.returncode, 0)

    def test_keyword_scan_reports_unmatched_members_and_serial_clash(self):
        book = make_epub(self.d / 'b.epub', [
            ('OEBPS/a/x_0001.xhtml', xhtml('B', 'Chapter 1', 'Potion here.')),
            ('OEBPS/b/x_0001.xhtml', xhtml('B', 'Chapter 2', 'Potion again.')),
            ('OEBPS/notes.xhtml', xhtml('B', 'Notes', 'Potion note.')),
        ])
        p = run('keyword_scan.py', book, self.d / 'h.jsonl', 'Potion')
        self.assertIn('1 html members without a _NNNN serial', p.stderr)
        self.assertIn('serial 0001', p.stderr)

    def test_keyword_scan_counts_div_paragraphs(self):
        book = make_epub(self.d / 'b.epub', [
            ('OEBPS/x_0001.xhtml', xhtml('B', raw='<div>Chapter 1</div><div>The potion boiled.</div>')),
        ])
        p = run('keyword_scan.py', book, self.d / 'h.jsonl', 'potion')
        self.assertIn('hits 1', p.stdout)

    def test_keyword_scan_no_serial_members_fails_loudly(self):
        book = make_epub(self.d / 'b.epub', [('OEBPS/c.xhtml', xhtml('B', 'Chapter 1', 'Potion.'))])
        p = run('keyword_scan.py', book, self.d / 'h.jsonl', 'Potion')
        self.assertNotEqual(p.returncode, 0)


def coverage():
    spec = importlib.util.spec_from_file_location('library_coverage', COVERAGE)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


class LibraryCoverage(Base):
    def test_ch_inside_a_word_is_not_a_chapter(self):
        book = make_epub(self.d / 'b.epub', [
            ('OEBPS/a.xhtml', xhtml('The March 12 Branch 40', 'Text.')),
            ('OEBPS/b.xhtml', xhtml('Chapter 3', 'Text.')),
        ])
        info = coverage().inspect(book)
        self.assertEqual((info['ch_first'], info['ch_last'], info['ch_count']), (3, 3, 1))

    def test_file_name_titles_are_not_chapter_numbers(self):
        book = make_epub(self.d / 'b.epub', [
            ('EPUB/text/ch001.xhtml', xhtml('ch001.xhtml', 'Foreword', 'About.')),
            ('EPUB/text/ch002.xhtml', xhtml('ch002.xhtml', 'Chapter 1 Crimson', 'Body.')),
            ('EPUB/text/ch003.xhtml', xhtml('Ch. 2', 'Body.')),
        ])
        info = coverage().inspect(book)
        self.assertEqual((info['ch_first'], info['ch_last'], info['ch_count']), (1, 2, 2))

    def test_restarted_numbering_is_counted_not_collapsed(self):
        members = [(f'OEBPS/v{v}/c{n}.xhtml', xhtml(f'Chapter {n}', 'x')) for v in (1, 2) for n in (1, 2, 3)]
        info = coverage().inspect(make_epub(self.d / 'b.epub', members))
        self.assertEqual(info['ch_count'], 6)
        self.assertEqual(info['restarts'], 1)

    def test_chinese_and_body_headings_count(self):
        book = make_epub(self.d / 'b.epub', [
            ('OEBPS/a.xhtml', xhtml('诡秘之主', '第一章 绯红', '正文。')),
            ('OEBPS/b.xhtml', xhtml('Book Title', 'Chapter 2', 'Body.')),
        ])
        info = coverage().inspect(book)
        self.assertEqual((info['ch_first'], info['ch_last'], info['ch_count']), (1, 2, 2))

    def test_contents_and_notes_pages_do_not_fake_restarts(self):
        members = [('OEBPS/toc.xhtml', xhtml('Table of Contents', 'Table of Contents', 'Chapter 1: A', 'Chapter 2: B'))]
        members += [(f'OEBPS/c{n}.xhtml', xhtml(f'Chapter {n}', 'x')) for n in (1, 2)]
        members += [('OEBPS/notes.xhtml', xhtml('Notes', 'Content from Chapter 1: A to Chapter 2: B'))]
        info = coverage().inspect(make_epub(self.d / 'b.epub', members))
        self.assertEqual((info['ch_count'], info['restarts'], info['gaps']), (2, 0, []))

    def test_gaps_reported_for_short_books(self):
        members = [(f'OEBPS/c{n}.xhtml', xhtml(f'Chapter {n}', 'x')) for n in (1, 2, 5)]
        info = coverage().inspect(make_epub(self.d / 'b.epub', members))
        self.assertEqual(info['gaps'], [3, 4])


if __name__ == '__main__':
    unittest.main()
