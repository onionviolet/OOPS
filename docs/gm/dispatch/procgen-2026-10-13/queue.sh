#!/bin/zsh
# Slot queue: launch each lane when fewer than 12 procgen story lanes run.
cd "${0:A:h}"; L=~/.codex/research/procgen-2026-10-13
running(){ ps -eo args | grep -v grep | grep -o '# P[0-9]*: ' | sort -u | grep -c -E '# P(1[2-9]|2[0-9]|3[0-9]): '; }
for lane in "$@"; do
  until [ "$(running)" -lt 12 ]; do sleep 60; done
  python3 launch.py $lane; sleep 45
  s=$(grep -m1 -o 'session id: [0-9a-f-]*' $L/$lane.log | cut -d' ' -f3)
  echo "| $lane | $s | main checkout, ${lane:l}/ only | n/a |" >> SESSIONS.md
  python3 -c "import pathlib,re;p=pathlib.Path('STATUS.md');t=p.read_text();p.write_text(re.sub(r'\| $lane \| queued[^|]*\|','| $lane | running |',t))"
  echo "$lane $s $(date +%H:%M)"
done
