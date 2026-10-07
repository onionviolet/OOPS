#!/usr/bin/env python3
"""Read-only acquisition of immutable native exports; emit metadata, never code."""
import argparse
from bisect import bisect_right
from collections import Counter
import datetime
import gzip
import hashlib
import json
from pathlib import Path
import re
import struct


def sha(data):
    return hashlib.sha256(data).hexdigest()


def file_sha(path):
    h = hashlib.sha256()
    with path.open('rb') as stream:
        for part in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(part)
    return h.hexdigest()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', type=Path, required=True)
    parser.add_argument('--architecture', choices=['arm64', 'x86_64'], required=True)
    parser.add_argument('--through', type=int, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--extended', action='store_true',
                        help='Acquire final provenance, aliases and latest byte-union metadata in the same scan.')
    args = parser.parse_args()
    folder = args.root / 'exports' / args.architecture
    thin = args.root / 'input' / f'factorio-{args.architecture}.macho'
    if thin.exists():
        data = thin.read_bytes()
    else:
        with gzip.open(str(thin) + '.gz', 'rb') as stream:
            data = stream.read()
    assert struct.unpack_from('<I', data)[0] == 0xfeedfacf
    segments = []
    sections = []
    execute_file_ranges = []
    offset = 32
    for _ in range(struct.unpack_from('<I', data, 16)[0]):
        command, size = struct.unpack_from('<II', data, offset)
        if command == 0x19:
            vm, virtual_size, file_offset, file_size = struct.unpack_from('<QQQQ', data, offset + 24)
            segments.append((vm, virtual_size, file_offset, file_size))
            if struct.unpack_from('<I', data, offset + 60)[0] & 4:
                execute_file_ranges.append((file_offset, file_offset + file_size))
            for number in range(struct.unpack_from('<I', data, offset + 64)[0]):
                section_offset = offset + 72 + number * 80
                name = data[section_offset:section_offset + 16].split(b'\0', 1)[0].decode()
                segment_name = data[section_offset + 16:section_offset + 32].split(b'\0', 1)[0].decode()
                address, length = struct.unpack_from('<QQ', data, section_offset + 32)
                sections.append({'segment': segment_name, 'section': name,
                                 'address': address, 'bytes': length})
        offset += size

    def location(address, length):
        for vm, virtual_size, file_offset, file_size in segments:
            if vm <= address and address + length <= vm + virtual_size:
                delta = address - vm
                if delta + length <= file_size:
                    return file_offset + delta
        return None

    def original(address, length):
        for vm, virtual_size, file_offset, file_size in segments:
            if vm <= address and address + length <= vm + virtual_size:
                delta = address - vm
                if delta + length <= file_size:
                    return data[file_offset + delta:file_offset + delta + length]
                if delta >= file_size:
                    return b'\0' * length
        return None

    records = 0
    schemas, attempts, variants = Counter(), Counter(), Counter()
    latest = {}
    diagnostics = Counter()
    examples = []
    receipts = []
    scalar_pattern = re.compile(r'^(fmax|fmaxnm|fmin)\s+([hsd]\d+),\s*([hsd]\d+),\s*([hsd]\d+)$')
    scalar_rows = 0
    pinned_sha = sha(data)
    last_locations = {}
    body_bitmap = instruction_bitmap = None
    provenance = Counter()
    latest_provenance = Counter()
    alias_names = {}
    extended_examples = []
    union_counts = Counter()
    flow_counts = Counter()
    backend_hashes, manifest_hashes, script_hashes = Counter(), Counter(), Counter()
    if args.extended:
        # Receipts provide the final locator before decompression. Historical refresh
        # rows therefore cannot leave stale bytes in the latest union.
        for sequence in range(1, args.through + 1):
            metadata = json.loads((folder / f'chunk-{sequence:06d}.json').read_text())
            for line, entry in enumerate(metadata['entries'], 1):
                last_locations[entry] = (sequence, line)
        body_bitmap, instruction_bitmap = bytearray(len(data)), bytearray(len(data))

    def note(kind, entry, sequence, line):
        diagnostics[kind] += 1
        if len(extended_examples) < 20:
            extended_examples.append({'kind': kind, 'entry': entry,
                                      'chunk': sequence, 'line': line})
    for sequence in range(1, args.through + 1):
        receipt = folder / f'chunk-{sequence:06d}.json'
        metadata = json.loads(receipt.read_text())
        chunk = folder / f'functions-{sequence:06d}.jsonl.gz'
        assert chunk.stat().st_size == metadata['compressed_bytes'], chunk
        assert file_sha(chunk) == metadata['compressed_sha256'], chunk
        receipts.append((sequence, file_sha(receipt), metadata['compressed_sha256']))
        entries = []
        with gzip.open(chunk, 'rt') as stream:
            for line, text in enumerate(stream, 1):
                row = json.loads(text)
                if args.extended:
                    assert metadata['architecture'] == args.architecture
                    assert row['architecture'] == args.architecture
                    is_latest = last_locations[row['entry']] == (sequence, line)
                    record_provenance = 'schema1_snapshot_only'
                    if row.get('schema', 1) >= 2:
                        claimed_sha = row.get('input_executable_sha256')
                        if claimed_sha is None:
                            record_provenance = 'schema2_input_hash_absent'
                        elif claimed_sha == pinned_sha:
                            record_provenance = 'schema2_input_hash_matches'
                        else:
                            record_provenance = 'schema2_input_hash_mismatch'
                            note(record_provenance, row['entry'], sequence, line)
                        if row.get('pipeline_script_sha256') != metadata.get('pipeline_script_sha256'):
                            note('record_receipt_script_hash_mismatch', row['entry'], sequence, line)
                    provenance[record_provenance] += 1
                    if is_latest:
                        latest_provenance[record_provenance] += 1
                        names = {symbol['name'] for symbol in row.get('entry_symbols', [])}
                        names.add(row['name'])
                        alias_names[row['entry']] = names
                        variant = row.get('tool_variant') or {}
                        backend = variant.get('decompiler_binary_sha256') or variant.get('native_decompiler', {}).get('sha256')
                        backend_hashes[backend or 'not_explicit'] += 1
                        manifest_hashes[row.get('tool_variant_manifest_sha256') or 'not_explicit'] += 1
                        script_hashes[row.get('pipeline_script_sha256') or 'not_explicit'] += 1
                        ranges = [(int(part['min'], 16), int(part['max'], 16) + 1)
                                  for part in row.get('body_ranges', [])]
                        starts = [part[0] for part in ranges]
                        assert starts == sorted(starts), (sequence, line, 'Unordered body ranges')
                        for start, end in ranges:
                            at = location(start, end - start)
                            if at is None:
                                union_counts['body_bytes_not_file_backed'] += end - start
                            else:
                                union_counts['overlapping_latest_body_bytes'] += sum(body_bitmap[at:at + end - start])
                                body_bitmap[at:at + end - start] = b'\1' * (end - start)
                records += 1
                entries.append(row['entry'])
                schemas[row.get('schema', 1)] += 1
                attempts[row['status']] += 1
                code = row.get('c_like_code') or ''
                if code:
                    assert sha(code.encode()) == row['c_like_sha256'], (sequence, line, 'C hash')
                if row['status'] == 'success':
                    assert code.strip(), (sequence, line, 'Empty success')
                elif args.extended and code.strip():
                    note('non_success_row_contains_C', row['entry'], sequence, line)
                if row.get('schema', 1) >= 2:
                    h = hashlib.sha256()
                    count = 0
                    for body_range in row['body_ranges']:
                        cursor = int(body_range['min'], 16)
                        for piece in body_range['raw_byte_pieces']:
                            raw = bytes.fromhex(piece['bytes_hex'])
                            address = int(piece['address'], 16)
                            assert cursor == address, (sequence, line, 'Range piece gap')
                            cursor += len(raw)
                            h.update(raw)
                            count += len(raw)
                            if raw != original(address, len(raw)):
                                diagnostics['raw_body_vs_input_mismatch'] += 1
                                if len(examples) < 12:
                                    examples.append({'entry': row['entry'], 'chunk': sequence, 'line': line, 'address': piece['address'], 'kind': 'raw body'})
                        assert cursor == int(body_range['max'], 16) + 1
                    assert count == row['body_addresses'], (sequence, line, 'Body byte count')
                    assert h.hexdigest() == row['body_sha256'], (sequence, line, 'Body hash')
                scalar_count = aliases = 0
                instructions = row['disassembly']
                assert row.get('instruction_count', len(instructions)) == len(instructions)
                for instruction in instructions:
                    raw = bytes.fromhex(instruction['bytes'])
                    if raw != original(int(instruction['address'], 16), len(raw)):
                        diagnostics['instruction_vs_input_mismatch'] += 1
                        if len(examples) < 12:
                                    examples.append({'entry': row['entry'], 'chunk': sequence, 'line': line, 'address': instruction['address'], 'kind': 'instruction'})
                    if args.extended and is_latest:
                        address = int(instruction['address'], 16)
                        if ranges:
                            index = bisect_right(starts, address) - 1
                            if index < 0 or address + len(raw) > ranges[index][1]:
                                note('instruction_outside_declared_body', row['entry'], sequence, line)
                        else:
                            union_counts['latest_instructions_without_schema2_body'] += 1
                        at = location(address, len(raw))
                        if at is None:
                            union_counts['instruction_bytes_not_file_backed'] += len(raw)
                        else:
                            union_counts['overlapping_latest_instruction_bytes'] += sum(instruction_bitmap[at:at + len(raw)])
                            instruction_bitmap[at:at + len(raw)] = b'\1' * len(raw)
                        if instruction.get('flow_type') == 'COMPUTED_JUMP':
                            flow_counts['computed_jump_instructions'] += 1
                            flow_counts['computed_jumps_without_discovered_targets'] += int(not instruction.get('flows'))
                    match = scalar_pattern.match(instruction['text'].lower())
                    if match:
                        scalar_count += 1
                        aliases += int(match[2] == match[4] and match[2] != match[3])
                variant = row.get('tool_variant') or {}
                sla = variant.get('SLA_after_sha256')
                variants[sla or 'original-or-not-explicit'] += 1
                scalar_rows += int(scalar_count > 0)
                latest[row['entry']] = {
                    'entry': row['entry'], 'name': row['name'], 'status': row['status'],
                    'error': row.get('error') or '', 'chunk': sequence, 'line': line,
                    'body_sha256': row.get('body_sha256'), 'c_like_sha256': row.get('c_like_sha256'),
                    'body_bytes': row['body_addresses'], 'instruction_count': len(instructions),
                    'thunk': row['thunk'], 'schema': row.get('schema', 1),
                    'class': row.get('function_classification', 'initial-qualified-code'),
                    'scalar_instructions': scalar_count, 'second_source_aliases': aliases,
                    'scalar_SLA': sla, 'input_sha256': row.get('input_executable_sha256'),
                }
        assert len(entries) == metadata['function_records'], (sequence, 'Receipt count')
        assert entries == metadata['entries'], (sequence, 'Receipt identities')
        if sequence % 300 == 0:
            print(json.dumps({'verified_through_chunk': sequence, 'rows': records}), flush=True)

    inventory = {}
    with gzip.open(folder / 'function-inventory.jsonl.gz', 'rt') as stream:
        for line in stream:
            row = json.loads(line)
            inventory[row['entry']] = row
    candidate_path = args.root / 'inventory' / f'{args.architecture}-all-entry-candidates.tsv'
    candidates = set(line.split('\t', 1)[0] for line in candidate_path.read_text().splitlines())
    failures = [row for row in latest.values() if row['status'] != 'success' and not row['status'].startswith('classified-')]
    affected = [row for row in latest.values() if row['scalar_instructions']]
    expected_sla = '541a9b1f35da6e7ebdbff962fae7bb221698695861647bbee8ec4a59533dcfe6'
    report = {
        'observed_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'scope': 'Read-only root verification of closed snapshot. Full machine export is not full semantic reading.',
        'architecture': args.architecture, 'through_chunk': args.through,
        'input_bytes': len(data), 'input_sha256': sha(data),
        'closed_chunk_receipt_projection_sha256': sha(json.dumps(receipts, separators=(',', ':')).encode()),
        'retained_attempt_records': records, 'schema_counts': dict(schemas), 'attempt_status_counts': dict(attempts),
        'latest_unique': len(latest), 'latest_status_counts': dict(Counter(row['status'] for row in latest.values())),
        'latest_function_classifications': dict(Counter(row['class'] for row in latest.values())),
        'latest_body_bytes': sum(row['body_bytes'] for row in latest.values()),
        'latest_decoded_instructions': sum(row['instruction_count'] for row in latest.values()),
        'inventory_entries': len(inventory), 'missing_inventory_entries': sorted(inventory.keys() - latest.keys()),
        'candidate_count': len(candidates),
        'missing_callable_candidates': sorted(candidates - latest.keys() - {'100000000'}),
        'classified_noncallable_header': '100000000', 'failures': failures,
        'raw_or_instruction_vs_original_diagnostics': dict(diagnostics), 'diagnostic_examples': examples,
        'C_body_chunk_hash_and_count_verification': 'pass',
        'latest_scalar_affected_methods': len(affected),
        'latest_scalar_instructions': sum(row['scalar_instructions'] for row in affected),
        'latest_scalar_second_source_aliases': sum(row['second_source_aliases'] for row in affected),
        'latest_scalar_without_repaired_SLA': [row for row in affected if row['scalar_SLA'] != expected_sla],
        'record_tool_SLA_counts': dict(variants),
        'limits': ['Schema1 historical rows lack full raw body pieces.', 'Loader changes to noninstruction memory must be qualified separately if present.', 'Successful generated C retains optimization, ABI, type, indirect-flow and analyzer limits.'],
    }
    if args.extended:
        alias_missing = []
        candidate_aliases = matched_aliases = 0
        for candidate in candidate_path.read_text().splitlines():
            fields = candidate.split('\t', 1)
            if fields[0] == '100000000':
                continue
            candidate_aliases += 1
            if len(fields) == 2 and fields[1] in alias_names.get(fields[0], set()):
                matched_aliases += 1
            else:
                alias_missing.append({'entry': fields[0], 'candidate_name': fields[1] if len(fields) == 2 else None})
        section_counts = []
        for section in sections:
            item = dict(section)
            at = location(item['address'], item['bytes'])
            item['address'] = format(item['address'], 'x')
            item['file_backed'] = at is not None
            if at is not None:
                end = at + item['bytes']
                item['latest_body_bytes'] = sum(body_bitmap[at:end])
                item['latest_decoded_instruction_bytes'] = sum(instruction_bitmap[at:end])
            section_counts.append(item)
        report['extended_acquisition'] = {
            'status': 'metadata acquired; diagnostics and inferred boundaries require disposition',
            'inventory_compressed_sha256': file_sha(folder / 'function-inventory.jsonl.gz'),
            'candidate_file_sha256': file_sha(candidate_path),
            'extra_export_entries_not_in_inventory': sorted(latest.keys() - inventory.keys()),
            'all_attempt_input_provenance': dict(provenance),
            'latest_input_provenance': dict(latest_provenance),
            'latest_declared_backend_hash_counts': dict(backend_hashes),
            'latest_declared_tool_manifest_hash_counts': dict(manifest_hashes),
            'latest_declared_script_hash_counts': dict(script_hashes),
            'candidate_alias_rows': candidate_aliases,
            'candidate_alias_exact_matches': matched_aliases,
            'candidate_alias_missing': alias_missing,
            'latest_file_backed_body_union_bytes': sum(body_bitmap),
            'latest_file_backed_instruction_union_bytes': sum(instruction_bitmap),
            'latest_body_bytes_without_decoded_instructions': sum(b and not i for b, i in zip(body_bitmap, instruction_bitmap)),
            'execute_segment_file_bytes_outside_latest_bodies': sum(end - start - sum(body_bitmap[start:end]) for start, end in execute_file_ranges),
            'union_diagnostics': dict(union_counts),
            'latest_flow_counts': dict(flow_counts),
            'section_byte_counts': section_counts,
            'diagnostic_examples': extended_examples,
            'limits': [
                'Declared tool hashes require a separate retained-tool receipt acquisition.',
                'Mach-O executable segment permissions include headers, padding and data; these byte counts do not identify all original code.',
                'Aliases compare exact retained names; demangling differences or alternate aliases need disposition.',
                'The latest union uses only final immutable locators; original failed and superseded records stay retained.',
                'Computed jumps with no discovered targets are unknown flow, not automatically confirmed defects.',
            ],
        }
    args.output.write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps({key: value for key, value in report.items() if not isinstance(value, (list, dict))}), flush=True)
    print(json.dumps({'latest_status_counts': report['latest_status_counts'], 'diagnostics': dict(diagnostics), 'scalar_without_repaired_SLA': len(report['latest_scalar_without_repaired_SLA'])}), flush=True)


if __name__ == '__main__':
    main()
