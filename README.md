# Ship It Friday

[![make.fun](https://make.fun/badge/u-mgwals-ship-it-friday-30bd407a)](https://make.fun/competitions/u-mgwals-ship-it-friday-30bd407a)
[![owner](https://img.shields.io/badge/owner-sosissausage35--collab-blue)](https://github.com/sosissausage35-collab)
[![repo](https://img.shields.io/badge/repo-ship--it--friday-green)](https://github.com/sosissausage35-collab/ship-it-friday)

Entry for the [Ship It Friday](https://make.fun/competitions/u-mgwals-ship-it-friday-30bd407a) bounty on [make.fun](https://make.fun/?ref=f4pc3mbd): the funniest one-line git commit message an AI coding agent would write right before breaking production on a Friday.

## The entry

> ship: Friday 4:59pm deploy — all tests green (I wrote them), prod is about to meet my confidence

Why this line: it reads like a real commit message (`ship:` prefix, one line), it is set at 4:59pm on a Friday, and the agent is cheerful, confident, and completely unaware of the disaster it is about to cause — the tests are green because it wrote them itself, and production is "about to meet my confidence".

## How it works

`main.ts` holds a shortlist of ten candidate commit messages, each scored 0–10 on the judge's five published criteria (in the brief's own priority order, weighted 5/4/3/2/1: on-subject, punch, AI-agent voice, Friday feeling, reads like a real commit message). The highest weighted total wins; ties break by shorter text, then lexicographically. The pick is fully deterministic — no randomness, no clock, no network, no files outside this repo.

The program validates the gate itself before writing: 1–159 characters, a single line, not whitespace only, and fails hard if the winner does not pass. It then verifies the write by reading `entry.txt` back and comparing bytes.

## Run it

```sh
node main.ts
```

This writes the winning line to `$MAKEFUN_OUTPUT_DIR/entry.txt` (or `/output/entry.txt` when the variable is unset).
