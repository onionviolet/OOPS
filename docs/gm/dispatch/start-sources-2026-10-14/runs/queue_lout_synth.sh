#!/bin/bash
R=/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/start-sources-2026-10-14/runs
N=/Users/weiwei/code/yet-another-idle-rpg/docs/research/novels/lout-of-counts-family
done_x() { w=$2; h=$(cat $N/reader-$1/READ_LEDGER.jsonl 2>/dev/null | wc -l | tr -d ' '); [ "$h" -ge "$w" ] && grep -q SUMMARY $N/reader-$1/NOTES.md 2>/dev/null; }
until done_x A 27 && done_x B 25 && done_x C 29; do
  if ! ps auxww | grep -v grep | grep -q "autoresume.sh\|runs/lout_[ABC].last.md"; then echo "$(date '+%F %T') readers stopped incomplete; synthesis not launched"; exit 1; fi
  sleep 120
done
echo "$(date '+%F %T') all readers complete; launching synthesis"
python3 $R/launch.py lout_synth $R/lout_synth.prompt.md
