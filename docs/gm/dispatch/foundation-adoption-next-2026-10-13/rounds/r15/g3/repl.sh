#!/bin/sh
# Send one JS body (stdin) to the harness REPL.
curl -s --max-time 600 -X POST --data-binary @- http://127.0.0.1:19131/
