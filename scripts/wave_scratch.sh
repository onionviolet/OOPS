#!/usr/bin/env bash
# Run disposable wave checks. Write receipts and logs outside this runner's scratch.
set -euo pipefail

usage() {
  echo "Usage: bash scripts/wave_scratch.sh [--ref COMMIT] -- COMMAND [ARG ...]" >&2
  exit 2
}

repo="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
commit=
if [[ ${1:-} == --ref ]]; then
  [[ $# -ge 3 ]] || usage
  commit="$(git -C "$repo" rev-parse --verify --end-of-options "${2}^{commit}")"
  shift 2
fi
[[ ${1:-} == -- && $# -ge 2 ]] || usage
shift

scratch="$(mktemp -d "${TMPDIR:-/tmp}/yair-wave.XXXXXXXX")"
scratch="$(cd "$scratch" && pwd -P)"
worktree=

cleanup() {
  status=$?
  if [[ -n "$worktree" ]] && ! git -C "$repo" worktree remove --force "$worktree"; then
    echo "Could not retire the scratch worktree at $worktree" >&2
    [[ $status -ne 0 ]] || status=1
  elif ! rm -rf -- "$scratch"; then
    echo "Could not remove scratch at $scratch" >&2
    [[ $status -ne 0 ]] || status=1
  fi
  exit "$status"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

export YAIR_WAVE_SOURCE="$repo"
export YAIR_WAVE_SCRATCH="$scratch"
export TMPDIR="$scratch/tmp"
mkdir "$TMPDIR"

cd "$repo"
if [[ -n "$commit" ]]; then
  git worktree add --quiet --detach "$scratch/worktree" "$commit"
  worktree="$scratch/worktree"
  cd "$worktree"
fi
"$@"
