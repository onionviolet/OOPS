#!/bin/zsh
# sample automated (playwright) chrome roots, their parent script, renderer count, and total CPU of tree
out=$1; n=$2
for i in $(seq 1 $n); do
  ts=$(date +%H:%M:%S)
  ps -axo pid=,ppid=,pgid=,%cpu=,rss=,command= > /tmp/ps.$$ 2>/dev/null
  awk -v ts=$ts '
  { pid=$1; ppid[$1]=$2; pg[$1]=$3; cpu[$1]=$4; rss[$1]=$5; $1=$2=$3=$4=$5=""; cmd[pid]=$0 }
  END {
    personal=0; autoc=0; pr=0; ar=0; pcpu=0; acpu=0
    for (p in cmd) {
      if (cmd[p] ~ /Google Chrome\.app/) {
        isauto = (cmd[p] ~ /playwright_chromiumdev_profile/ || cmd[p] ~ /enable-automation/)
        g=pg[p]; root=g
        if (cmd[root] ~ /playwright_chromiumdev_profile/) isauto=1
        if (isauto) { acpu+=cpu[p]; if (cmd[p] ~ /type=renderer/) ar++ }
        else { pcpu+=cpu[p]; if (cmd[p] ~ /type=renderer/) pr++ }
      }
    }
    roots=""
    for (p in cmd) if (cmd[p] ~ /MacOS\/Google Chrome / && cmd[p] ~ /playwright_chromiumdev_profile/) { par=ppid[p]; c=cmd[par]; sub(/^ +/,"",c); roots=roots " [" p "<-" substr(c,1,70) "]" }
    printf "%s personal_r=%d personal_cpu=%.1f auto_r=%d auto_cpu=%.1f roots:%s\n", ts, pr, pcpu, ar, acpu, roots
  }' /tmp/ps.$$ >> $out
  sleep 5
done
rm -f /tmp/ps.$$
