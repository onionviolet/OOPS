#!/usr/bin/env python3
"""Read-only acquisition of the three canonical guarded flow repair rows."""
from datetime import datetime, timezone
import gzip
import hashlib
import json
from pathlib import Path
import struct


PRIVATE = Path('/Users/weiwei/.codex/research/factorio/native-23347942')
OUTPUT = Path(__file__).parent / 'FLOW_CANONICAL_ACQUISITION.json'


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def file_sha(path):
    return sha(path.read_bytes())


def main():
    with gzip.open(PRIVATE / 'input/factorio-arm64.macho.gz', 'rb') as stream:
        data = stream.read()
    input_sha = sha(data)
    assert input_sha == '9e1d7571e0284bb4c4e0e12716143752c893cb79b266038e64d0ee41f54aab93'
    segments = []
    offset = 32
    for _ in range(struct.unpack_from('<I', data, 16)[0]):
        command, size = struct.unpack_from('<II', data, offset)
        if command == 0x19:
            segments.append(struct.unpack_from('<QQQQ', data, offset + 24))
        offset += size

    def original(address, length):
        for vm, virtual, at, size in segments:
            if vm <= address and address + length <= vm + size:
                return data[at + address - vm:at + address - vm + length]
        raise AssertionError((hex(address), length, 'not file backed'))

    combined_path = PRIVATE / 'logs/COMBINED_FLOW_CANONICAL_RESUME.json'
    combined = json.loads(combined_path.read_text())
    assert combined['input_executable_sha256'] == input_sha
    dependencies = []
    before = {combined_path: file_sha(combined_path)}
    for item in combined['exact_dependencies']:
        path = Path(item['path'])
        assert path.stat().st_size == item['bytes']
        assert file_sha(path) == item['sha256']
        before[path] = item['sha256']
        dependencies.append(item)
    script = PRIVATE / 'pipeline-scripts/FactorioExport.java'
    before[script] = file_sha(script)
    variant = PRIVATE / 'tool-repairs/scalar-alias/TOOL_VARIANT.json'
    before[variant] = file_sha(variant)
    variant_data = json.loads(variant.read_text())
    tool_root = Path('/Users/weiwei/.codex/research/tools/native-recovery-2026-10-07/ghidra_12.1.4_PUBLIC/Ghidra')
    tools = [
        (tool_root / 'Features/Decompiler/os/mac_arm_64/decompile', 'decompiler_binary_sha256'),
        (tool_root / 'Processors/AARCH64/data/languages/AARCH64_AppleSilicon.sla', 'SLA_after_sha256'),
        (tool_root / 'Processors/AARCH64/data/languages/AARCH64neon.sinc', 'source_after_sha256'),
    ]
    tool_proof = []
    for path, key in tools:
        before[path] = file_sha(path)
        assert before[path] == variant_data[key]
        tool_proof.append({'path': str(path), 'sha256': before[path], 'manifest_field': key})
    diagnostic_rows = {}
    for path in (PRIVATE / 'tool-repairs/flow-alltables/diagnostic-flow2').glob('functions-*.jsonl.gz'):
        with gzip.open(path, 'rt') as stream:
            for line in stream:
                row = json.loads(line)
                diagnostic_rows[row['entry']] = row
    rows, proof = {}, []
    for sequence, entry, expected_count in [(1851, '10095b968', 185), (1852, '10095bc4c', 638), (1853, '1007f70c4', 247)]:
        receipt = PRIVATE / f'exports/arm64/chunk-{sequence:06d}.json'
        chunk = receipt.with_name(f'functions-{sequence:06d}.jsonl.gz')
        metadata = json.loads(receipt.read_text())
        before[receipt], before[chunk] = file_sha(receipt), file_sha(chunk)
        assert before[chunk] == metadata['compressed_sha256']
        assert chunk.stat().st_size == metadata['compressed_bytes']
        with gzip.open(chunk, 'rt') as stream:
            records = [json.loads(line) for line in stream]
        assert metadata['function_records'] == len(records) == 1
        row = records[0]
        assert metadata['entries'] == [entry] and row['entry'] == entry
        assert row['status'] == 'success' and row['c_like_code'].strip()
        assert row['input_executable_sha256'] == input_sha
        assert row['pipeline_script_sha256'] == before[script] == metadata['pipeline_script_sha256']
        assert row['tool_variant_manifest_sha256'] == before[variant]
        assert row['tool_variant'] == variant_data
        assert row['full_context_repair_receipt_sha256'] == before[combined_path]
        assert sha(row['c_like_code'].encode()) == row['c_like_sha256']
        body, addresses = bytearray(), set()
        for part in row['body_ranges']:
            cursor, end = int(part['min'], 16), int(part['max'], 16) + 1
            for piece in part['raw_byte_pieces']:
                assert int(piece['address'], 16) == cursor
                raw = bytes.fromhex(piece['bytes_hex'])
                assert raw == original(cursor, len(raw))
                body.extend(raw)
                addresses.update(range(cursor, cursor + len(raw)))
                cursor += len(raw)
            assert cursor == end
        assert len(body) == row['body_addresses'] and sha(body) == row['body_sha256']
        assert row['instruction_count'] == len(row['disassembly']) == expected_count
        decoded = set()
        for instruction in row['disassembly']:
            at = int(instruction['address'], 16)
            raw = bytes.fromhex(instruction['bytes'])
            assert raw == original(at, len(raw))
            assert all(n in addresses for n in range(at, at + len(raw)))
            assert not decoded.intersection(range(at, at + len(raw)))
            decoded.update(range(at, at + len(raw)))
        assert len(decoded) == len(body)
        diagnostic = diagnostic_rows[entry]
        for key in ['c_like_code', 'body_sha256', 'body_ranges', 'disassembly', 'instruction_count']:
            assert row[key] == diagnostic[key], (entry, key, 'diagnostic drift')
        rows[entry] = row
        proof.append({'entry': entry, 'chunk': sequence, 'line': 1, 'status': row['status'],
                      'body_sha256': row['body_sha256'], 'c_like_sha256': row['c_like_sha256'],
                      'body_bytes': len(body), 'instruction_count': len(row['disassembly']),
                      'full_body_instruction_coverage': True, 'diagnostic_body_C_ASM_unchanged': True,
                      'chunk_sha256': before[chunk], 'receipt_sha256': before[receipt]})
    split = json.loads((PRIVATE / 'logs/ALL_SPLITTER_TABLES_CANONICAL_RESUME.json').read_text())
    tables = []
    assert split['qualified_table_count'] == len(split['tables']) == 14
    for item in split['tables']:
        spec = item['source_spec']
        row = rows[spec['function_entry']]
        instructions = {v['address']: v for v in row['disassembly']}
        for context in item['actual_guard_dispatch_context']:
            assert context['bytes'] == instructions[context['address']]['bytes']
            assert bytes.fromhex(context['bytes']) == original(int(context['address'], 16), 4)
        domain = item['actual_same_index_unsigned_domain_proof']
        assert domain['same_unsigned_value_proven'] and domain['no_intervening_control_transfer']
        assert domain['guard_expression'] == domain['table_index_expression']
        assert instructions[domain['cmp_address']]['text'].endswith(',#0x3')
        assert instructions[domain['unsigned_high_guard_address']]['text'].startswith('b.hi ')
        branch = instructions[spec['branch']]
        targets = []
        for target in item['actual_table_targets']:
            byte = original(int(target['table_address'], 16), 1)[0]
            assert byte == target['unsigned_byte']
            assert int(target['target'], 16) == int(spec['adr_base'], 16) + 4 * byte
            assert target['target'] in branch['flows'] and target['target'] in instructions
            targets.append(target['target'])
        assert len(targets) == 4 and set(branch['flows']) == set(targets)
        tables.append({'entry': row['entry'], 'branch': spec['branch'], 'targets': targets,
                       'domain': '0..3', 'original_bytes_and_canonical_CFG_match': True})
    inserter = rows['1007f70c4']
    ins = {v['address']: v for v in inserter['disassembly']}
    assert ins['1007f7298']['text'] == 'cmp w3,#0x5'
    assert ins['1007f729c']['text'] == 'b.hi 0x1007f748c'
    receipt = json.loads((PRIVATE / 'logs/INSERTER_TABLE_CANONICAL_RESUME.json').read_text())
    assert receipt['old_body_bytes'] == 924 and receipt['new_candidate_body_bytes'] == 988
    targets = []
    for item in receipt['table_cases']:
        byte = original(0x10296cf39 + item['index'], 1)[0]
        assert byte == item['table_byte']
        assert 0x1007f725c + 4 * byte == int(item['target'], 16)
        assert item['target'] in ins['1007f72ac']['flows'] and item['target'] in ins
        targets.append(item['target'])
    assert len(targets) == 6 and set(targets) == set(ins['1007f72ac']['flows'])
    assert all(file_sha(path) == expected for path, expected in before.items())
    report = {'observed_utc': datetime.now(timezone.utc).isoformat(),
              'owner': '/root/factorio_recovery_review', 'status': 'PASS bounded canonical acquisition',
              'scope': 'Three new canonical rows only; unchanged full initial corpora acquired separately.',
              'input_sha256': input_sha, 'combined_context_receipt_sha256': before[combined_path],
              'dependencies': dependencies, 'pipeline_script_sha256': before[script],
              'tool_variant_manifest_sha256': before[variant], 'actual_tool_files': tool_proof,
              'rows': proof, 'splitter_tables': tables,
              'inserter': {'branch': '1007f72ac', 'accepted_index_domain': '0..5', 'targets': targets,
                           'restored_original_case_bytes': 64, 'raw_body_C_ASM_CFG_qualified': True},
              'all_read_artifacts_unchanged_before_after': True,
              'limits': ['Candidate boundaries, inferred prototypes and member names remain qualified.',
                         'Dedicated overrides are visible in generated C and pinned to exact guarded table bytes.',
                         'No game, recovered-code or gameplay execution; no whole-engine semantic completion claim.']}
    OUTPUT.write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps({'status': report['status'], 'rows': len(proof), 'splitter_tables': len(tables),
                      'inserter_cases': len(targets), 'restored_bytes': 64}))


if __name__ == '__main__':
    main()
