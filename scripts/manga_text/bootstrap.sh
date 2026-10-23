#!/bin/sh
# Rebuild manga_text on a fresh Mac (Apple silicon, macOS with Xcode command line tools: `xcode-select --install`).
# Creates the isolated venv (about 1 GB, outside the repo), installs pinned requirements, downloads the pinned detector
# revision and verifies its sha256 against models.json, compiles the Swift Vision helper, runs doctor and the unit tests.
# No LaunchAgent or other persistent service is installed; start the watcher yourself (see README).
set -eu
HOME_DIR="${MANGA_TEXT_HOME:-$HOME/.local/share/manga-text}"
HERE="$(cd "$(dirname "$0")" && pwd)"
command -v uv >/dev/null || { echo "install uv first: https://docs.astral.sh/uv/"; exit 1; }
command -v swiftc >/dev/null || { echo "install the Xcode command line tools first"; exit 1; }
uv venv -p 3.13 "$HOME_DIR/venv"
uv pip install -p "$HOME_DIR/venv/bin/python" -r "$HERE/requirements.txt"
"$HOME_DIR/venv/bin/python" "$HERE/manga_text.py" fetch-models
"$HOME_DIR/venv/bin/python" "$HERE/manga_text.py" doctor
"$HOME_DIR/venv/bin/python" -m unittest discover -s "$HERE/tests"
