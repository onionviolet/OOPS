"""Finite local correction-candidate sweep. CLI emits aggregates, never message text.

User role is transport metadata, not proof of human authorship. Known machine
sessions/records are rejected; remaining messages are human-origin candidates.
Keyword classes need local contextual review before being called corrections.
Importing this module performs no filesystem discovery or reads.
"""
import argparse
from collections import Counter
from dataclasses import dataclass
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import re

KEY = re.compile(r"\b(wrong|don'?t|not what|still|why|sucks?|instead|rather than|should be|again|stop|too (big|wide|much|many|small)|missing|ugly|weird|actually|i meant|isn'?t|not that|not like|what happened|broken|doesn'?t|didn'?t|never|always|simpl\w*|confus\w*|hard to|can'?t)\b", re.I)
MACHINE = re.compile(r'<(?:command-name|system-reminder|ide_|local-command|task-notification|side-sessions|ci-monitor|bash-|user-prompt|environment_context|permissions instructions)|# AGENTS\.md instructions|Message Type: (?:NEW_TASK|MESSAGE|FINAL_ANSWER)|\[Artifact comment|You are (?:a|an) .*agent|This session is being continued from|You have been assigned|(?:^|\n)(?:Task|Payload|Sender):', re.I)
RELAY = re.compile(r'Retained source order|(?:^|\n)\s*(?:\[\d+\]|\d+[.):])\s*(?:assistant|system|developer|tool)\s*:|(?:^|\n)\s*(?:assistant|ChatGPT|Claude|Codex)\s*(?:said|wrote|response)\s*:', re.I)
# Non-exclusive screening vocabulary, not a semantic classifier or confirmed count.
CLASS_PATTERNS = {
 'IPC36': r'descri|prose|formula|wording|text|tooltip',
 'IPC37': r'never|always|rule|constraint|gate|permission|milestone',
 'IPC38': r'overthink|complex|unnecessary|too many|too much|simpl|hour long',
 'IPC39': r'app|see it|show up|actually show|mockup|visible|playable',
 'IPC40': r'fully|fullly|complete system|stale|already implemented|coverage|up to date',
 'IPC41': r'existing system|fit|decomp|prior|previous|already have|audit',
 'IPC42': r'means|process the|drops|aftermath|pay|buy|nest|both sides',
 'IPC43': r'i meant|i mean|dont mean|don.t mean|rather than|not what',
 'IPC44': r'panel|scroll|button|screen|overlap|space|hidden|viewable|shift',
 'IPC45': r'memory|save.*note|record|locally|project\.md|agents\.md|duplicate',
 'IPC46': r'token|model|haiku|sonnet|luna|reader|hours|cost',
}
CLASSES = {k: re.compile(v, re.I) for k, v in CLASS_PATTERNS.items()}


def stamp(value):
    d = datetime.fromisoformat(value.replace('Z', '+00:00'))
    if d.tzinfo is None:
        raise ValueError('timestamps require an explicit timezone')
    return d.astimezone(timezone.utc)


def texts(content):
    if isinstance(content, str):
        return content
    return '\n'.join(c['text'] for c in content or [] if isinstance(c, dict)
                     and c.get('type') in ('text', 'input_text') and isinstance(c.get('text'), str))


def human_text(text):
    """Discard recognized pasted blocks; keep a human's unquoted question."""
    if MACHINE.search(text):
        return '', 'machine_text'
    if RELAY.search(text) or '<pasted_content' in text:
        return '', 'relay_or_ambiguous_mixture'
    kept, fence = [], False
    for line in text.splitlines():
        if line.lstrip().startswith(('```', '~~~')):
            fence = not fence
            continue
        if not fence and not line.lstrip().startswith('>'):
            kept.append(line)
    clean = '\n'.join(kept).strip()
    return clean, 'human_origin_candidate' if clean else 'quoted_only'


@dataclass
class Event:
    time: datetime
    text: str
    transport: str
    identity: str = ''


def read_events(path, kind):
    """Yield session-local events or exclusion reason strings, without printing."""
    with path.open(errors='replace') as handle:
        records = (json.loads(line) for line in handle if line.strip())
        machine_session = False
        project_session = kind == 'claude'
        for record in records:
            payload = record.get('payload') or {}
            if record.get('type') == 'session_meta':
                project_session = 'yet-another-idle-rpg' in payload.get('cwd', '')
                source = payload.get('source')
                machine_session = (isinstance(source, dict) or source == 'exec'
                                   or bool(payload.get('parent_thread_id')))
            content, transport, identity = None, '', ''
            if kind == 'claude' and record.get('type') == 'user':
                message = record.get('message') or {}
                if message.get('role') == 'user':
                    content = texts(message.get('content'))
                    transport, identity = 'claude', record.get('uuid', '')
            elif kind == 'codex' and payload.get('role') == 'user' and payload.get('type') == 'message':
                content = texts(payload.get('content'))
                transport, identity = 'response', payload.get('id') or ''
            elif kind == 'codex' and payload.get('type') == 'user_message':
                content = payload.get('message')
                transport = 'event'
            if content is None or not project_session:
                continue
            if machine_session or record.get('isMeta') or record.get('isSidechain') or record.get('isCompactSummary') or record.get('sourceToolAssistantUUID'):
                yield 'machine_session_or_record'
                continue
            try:
                when = stamp(record['timestamp'])
            except (KeyError, ValueError, TypeError):
                yield 'missing_or_invalid_time'
                continue
            yield Event(when, content, transport, identity)


def summarize(inputs, start, boundary, end):
    if not start < boundary < end:
        raise ValueError('require start < boundary < end')
    counts = {side: Counter() for side in ('before', 'after')}
    classes = {side: Counter({k: 0 for k in CLASSES}) for side in counts}
    excluded, fingerprints = Counter(), []
    for path, kind in sorted(inputs, key=lambda pair: str(pair[0])):
        fingerprints.append(hashlib.sha256(path.read_bytes()).hexdigest())
        seen_ids, recent = set(), []
        try:
            for event in read_events(path, kind):
                if isinstance(event, str):
                    excluded[event] += 1
                    continue
                if not start <= event.time < end:
                    continue
                # IDs dedupe exact repeated records. Mirrored Codex event/response
                # transports dedupe matching text within 5s, but same-transport
                # repeated human instructions stay distinct without a shared ID.
                duplicate = bool(event.identity and event.identity in seen_ids)
                if event.identity:
                    seen_ids.add(event.identity)
                match = next((i for i, old in enumerate(recent)
                              if old.text == event.text and old.transport != event.transport
                              and abs((event.time-old.time).total_seconds()) <= 5), None)
                if match is not None:
                    recent.pop(match)
                    duplicate = True
                elif not duplicate:
                    recent.append(event)
                recent = [old for old in recent if abs((event.time-old.time).total_seconds()) <= 5]
                if duplicate:
                    excluded['duplicate_event'] += 1
                    continue
                side = 'before' if event.time < boundary else 'after'
                clean, reason = human_text(event.text)
                if not clean:
                    excluded[reason] += 1
                    continue
                counts[side]['human_origin_candidates'] += 1
                if not KEY.search(clean):
                    continue
                counts[side]['correction_keyword_candidates'] += 1
                matched = [k for k, rule in CLASSES.items() if rule.search(clean)]
                classes[side].update(matched)
                if not matched:
                    counts[side]['unclassified_keyword_candidates'] += 1
        except (ValueError, TypeError):
            excluded['malformed_session_stopped'] += 1
    return {'schema': 1, 'bounds_utc': {'start_inclusive': start.isoformat(), 'boundary': boundary.isoformat(), 'end_exclusive': end.isoformat()},
            'corpus_files': len(fingerprints), 'corpus_sha256': hashlib.sha256('\n'.join(sorted(fingerprints)).encode()).hexdigest(),
            'counts': {k: dict(v) for k, v in counts.items()}, 'class_keyword_candidates': {k: dict(v) for k, v in classes.items()},
            'exclusions': dict(excluded), 'exclusion_scope': 'entire input files for machine/session errors; time-bounded for text and duplicates',
            'interpretation': 'Human-origin and keyword candidates, not independently confirmed corrections. Classes overlap. No raw texts or per-message fingerprints emitted.'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for arg in ('start', 'boundary', 'end'):
        parser.add_argument('--' + arg, type=stamp, required=True)
    parser.add_argument('--codex', type=Path, nargs='*', default=[])
    parser.add_argument('--claude', type=Path, nargs='*', default=[])
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    inputs = [(p, 'codex') for p in args.codex] + [(p, 'claude') for p in args.claude]
    if not inputs:
        parser.error('explicit --codex/--claude input paths required; no automatic private-log scan')
    result = json.dumps(summarize(inputs, args.start, args.boundary, args.end), indent=2) + '\n'
    if args.output:
        args.output.write_text(result)
    else:
        print(result, end='')


if __name__ == '__main__':
    main()
