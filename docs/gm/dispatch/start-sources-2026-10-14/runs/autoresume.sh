#!/bin/bash
# Resume Lout readers whose run ended before their range is complete. Max 6 resumes each.
R=/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/start-sources-2026-10-14/runs
N=/Users/weiwei/code/yet-another-idle-rpg/docs/research/novels/lout-of-counts-family
sid() { case $1 in A) echo 01a1389c-4115-7c30-8b61-3fa85bd3f322;; B) echo 01a1389c-4135-7192-816a-556efde3c7d9;; C) echo 01a1389c-4159-7b63-8d19-0f6b029e6663;; esac; }
want() { case $1 in A) echo 27;; B) echo 25;; C) echo 29;; esac; }
tA=0; tB=0; tC=0
while true; do
  alldone=1
  for x in A B C; do
    w=$(want $x); have=$(cat $N/reader-$x/READ_LEDGER.jsonl 2>/dev/null | wc -l | tr -d ' ')
    if [ "$have" -ge "$w" ] && grep -q "SUMMARY" $N/reader-$x/NOTES.md 2>/dev/null; then continue; fi
    alldone=0
    if ! ps auxww | grep -v grep | grep -q "runs/lout_$x.last.md"; then
      eval t=\$t$x
      if [ $t -lt 6 ]; then
        eval t$x=$((t+1))
        echo "$(date '+%F %T') resume lout_$x ($have/$w, try $((t+1)))"
        python3 $R/launch.py lout_$x $R/resume_lout.prompt.md $(sid $x)
      fi
    fi
  done
  [ $alldone -eq 1 ] && { echo "$(date '+%F %T') all Lout readers complete"; exit 0; }
  sleep 120
done
