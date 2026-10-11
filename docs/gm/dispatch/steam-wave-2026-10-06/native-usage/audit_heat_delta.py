#!/usr/bin/env python3
"""Acquire four immutable physical Heat views without executing recovered code."""
from datetime import datetime, timezone
import gzip
import hashlib
import json
from pathlib import Path
import struct


PRIVATE = Path('/Users/weiwei/.codex/research/factorio/native-23347942')
OUTPUT = Path(__file__).parent / 'HEAT_CANONICAL_ACQUISITION.json'


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def file_sha(path):
    return sha(path.read_bytes())


def main():
    with gzip.open(PRIVATE / 'input/factorio-arm64.macho.gz', 'rb') as stream:
        data = stream.read()
    input_sha = sha(data)
    assert input_sha == '9e1d7571e0284bb4c4e0e12716143752c893cb79b266038e64d0ee41f54aab93'
    segments, offset = [], 32
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

    context_path = PRIVATE / 'logs/COMBINED_HEAT_PHYSICAL.json'
    context = json.loads(context_path.read_text())
    assert context['input_executable_sha256'] == input_sha
    before = {context_path: file_sha(context_path)}
    for item in context['exact_dependencies']:
        path = Path(item['path'])
        assert path.stat().st_size == item['bytes'] and file_sha(path) == item['sha256']
        before[path] = item['sha256']
    views = {v['entry']: v for v in json.loads((PRIVATE / 'logs/HEAT_PHYSICAL_CANONICAL.json').read_text())['views']}
    assert set(views) == {'1005fcf68', '1001e8af4', '10029a42c', '10029a460'}
    variant = PRIVATE / 'tool-repairs/scalar-alias/TOOL_VARIANT.json'
    before[variant] = file_sha(variant)
    variant_data = json.loads(variant.read_text())
    script = PRIVATE / 'pipeline-scripts/FactorioExport.java'
    before[script] = file_sha(script)
    tools = Path('/Users/weiwei/.codex/research/tools/native-recovery-2026-10-07/ghidra_12.1.4_PUBLIC/Ghidra')
    tool_proof = []
    for path, key in [(tools / 'Features/Decompiler/os/mac_arm_64/decompile', 'decompiler_binary_sha256'),
                      (tools / 'Processors/AARCH64/data/languages/AARCH64_AppleSilicon.sla', 'SLA_after_sha256'),
                      (tools / 'Processors/AARCH64/data/languages/AARCH64neon.sinc', 'source_after_sha256')]:
        before[path] = file_sha(path)
        assert before[path] == variant_data[key]
        tool_proof.append({'path': str(path), 'sha256': before[path], 'manifest_field': key})
    results, entries = [], set()
    for sequence in range(1854, 1858):
        receipt = PRIVATE / f'exports/arm64/chunk-{sequence:06d}.json'
        chunk = receipt.with_name(f'functions-{sequence:06d}.jsonl.gz')
        metadata = json.loads(receipt.read_text())
        before[receipt], before[chunk] = file_sha(receipt), file_sha(chunk)
        assert metadata['compressed_sha256'] == before[chunk]
        assert metadata['compressed_bytes'] == chunk.stat().st_size
        with gzip.open(chunk, 'rt') as stream:
            rows = [json.loads(line) for line in stream]
        assert metadata['function_records'] == len(rows) == 1
        row = rows[0]
        entry = row['entry']
        assert entry in views and entry not in entries and metadata['entries'] == [entry]
        entries.add(entry)
        assert row['architecture'] == metadata['architecture'] == 'arm64'
        assert row['input_executable_sha256'] == input_sha
        assert row['full_context_repair_receipt_sha256'] == before[context_path]
        assert row['pipeline_script_sha256'] == metadata['pipeline_script_sha256'] == before[script]
        assert row['tool_variant'] == variant_data and row['tool_variant_manifest_sha256'] == before[variant]
        assert row['status'] == 'success' and row['c_like_code'].strip()
        assert sha(row['c_like_code'].encode()) == row['c_like_sha256']
        old_path = PRIVATE / f'tool-repairs/physical-selected/{entry}-before.json'
        before[old_path] = file_sha(old_path)
        old = json.loads(old_path.read_text())
        view = views[entry]
        assert row['body_sha256'] == old['body_sha256'] == view['body_sha256']
        assert row['body_addresses'] == old['body_addresses'] and view['body_unchanged']
        assert row['disassembly'] == old['disassembly']
        assert row['signature'] == view['signature_after'] and row['signature_source'] == 'USER_DEFINED'
        body = bytearray()
        for part in row['body_ranges']:
            cursor, end = int(part['min'], 16), int(part['max'], 16) + 1
            for piece in part['raw_byte_pieces']:
                assert int(piece['address'], 16) == cursor
                raw = bytes.fromhex(piece['bytes_hex'])
                assert raw == original(cursor, len(raw))
                body.extend(raw)
                cursor += len(raw)
            assert cursor == end
        assert len(body) == row['body_addresses'] and sha(body) == row['body_sha256']
        assert row['instruction_count'] == old['instruction_count'] == len(row['disassembly'])
        for instruction in row['disassembly']:
            raw = bytes.fromhex(instruction['bytes'])
            assert raw == original(int(instruction['address'], 16), len(raw))
        if entry == '10029a460':
            # The existing default return remains unknown after parameter annotation.
            assert view['signature_after'].split(' ', 1)[0] == view['signature_before'].split(' ', 1)[0] == 'undefined'
        results.append({'entry': entry, 'chunk': sequence, 'line': 1, 'status': row['status'],
                        'body_sha256': row['body_sha256'], 'c_like_sha256': row['c_like_sha256'],
                        'old_c_like_sha256': old['c_like_sha256'], 'body_bytes': len(body),
                        'instruction_count': row['instruction_count'], 'body_and_ASM_unchanged': True,
                        'signature_before': view['signature_before'], 'signature_after': row['signature'],
                        'return_qualification': view['return_qualification'],
                        'chunk_sha256': before[chunk], 'receipt_sha256': before[receipt],
                        'before_record_sha256': before[old_path]})
    assert entries == set(views)
    assert all(file_sha(path) == expected for path, expected in before.items())
    report = {'observed_utc': datetime.now(timezone.utc).isoformat(),
              'owner': '/root/factorio_recovery_review', 'status': 'PASS bounded canonical physical acquisition',
              'input_sha256': input_sha, 'combined_context_receipt_sha256': before[context_path],
              'dependencies': context['exact_dependencies'], 'actual_tool_files': tool_proof,
              'pipeline_script_sha256': before[script], 'tool_variant_manifest_sha256': before[variant],
              'rows': results, 'all_read_artifacts_unchanged_before_after': True,
              'limits': ['Original class/member declarations and return types remain inferred.',
                         'Unknown transferEnergyTo return is explicitly preserved.',
                         'NaN/FPCR/signed-zero, loader/callee and global order are not qualified.',
                         'No game/recovered-code execution or gameplay/save acceptance.']}
    OUTPUT.write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps({'status': report['status'], 'rows': len(results), 'unchanged_bodies': len(results)}))


if __name__ == '__main__':
    main()
