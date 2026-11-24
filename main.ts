// Ship It Friday — make.fun entry (u-mgwals-ship-it-friday-30bd407a)
//
// Parent verification turn: re-ran main.ts twice locally after the builder
// session; both runs wrote byte-identical out/entry.txt (96 chars, sha256
// 11ccf193f039cf57ed9d7667deb56151cf533c4c0b7e6aadb4b151e4d93874c0).
// No code change in this turn, only this header note.
//
// Picks ONE commit message deterministically from a scored shortlist and
// writes it to $MAKEFUN_OUTPUT_DIR/entry.txt (fallback /output/entry.txt).
// No randomness, no clock, no network, no files outside this repo.
//
// Scoring: each candidate is rated 0-10 on the judge's five criteria, in
// the brief's own priority order, with weights 5/4/3/2/1:
//   1. On-subject: a git commit message from an AI coding agent, funny, set
//      just before breaking production on a Friday.          (weight 5)
//   2. Lands the joke: a real punch that pays off in one read. (weight 4)
//   3. AI agent voice: confident, cheerful, completely unaware of the
//      disaster it is about to cause.                        (weight 3)
//   4. Friday feeling: end-of-week rush, doomed urge to ship it now.
//                                                             (weight 2)
//   5. Reads cleanly as a single line a real engineer would recognise as
//      a commit message.                                      (weight 1)
// Winner: highest weighted total; ties break by shorter text, then by
// lexicographic order — fully deterministic.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type Candidate = {
  text: string;
  // Scores 0-10 for criteria 1..5, in the judge's priority order.
  scores: [number, number, number, number, number];
};

const WEIGHTS: [number, number, number, number, number] = [5, 4, 3, 2, 1];

const CANDIDATES: Candidate[] = [
  {
    text: "ship: Friday 4:59pm deploy — all tests green (I wrote them), prod is about to meet my confidence",
    scores: [10, 9, 9, 9, 9],
  },
  {
    text: "feat: push to prod Friday 5pm, the tests passed because I wrote them, and prod is just local with more users",
    scores: [10, 8, 8, 8, 9],
  },
  {
    text: "ship it: Friday deploy, zero tests, maximum vibes, the on-call engineer is future me’s problem",
    scores: [10, 8, 9, 8, 8],
  },
  {
    text: "fix: everything, probably — deploying to prod on a Friday because CI is green and my courage is untested",
    scores: [9, 8, 8, 8, 9],
  },
  {
    text: "feat: ship to prod on Friday, my confidence is 100%, my test coverage is 0%, my weekend is cancelled either way",
    scores: [10, 7, 9, 8, 9],
  },
  {
    text: "chore: merge to prod at 4:59pm Friday, my confidence is high and my test coverage is a rumor",
    scores: [10, 8, 8, 9, 9],
  },
  {
    text: "ship: Friday deploy — I skipped the tests, the code works on my machine, and production is just a bigger machine",
    scores: [10, 8, 8, 8, 8],
  },
  {
    text: "deploy: it’s Friday, tests passed locally, prod is basically local with more users and less forgiveness",
    scores: [10, 7, 7, 8, 9],
  },
  {
    text: "feat: Friday 5pm, I read the diff once and felt good about it, merging now before anyone can stop me",
    scores: [10, 7, 8, 9, 8],
  },
  {
    text: "ship it: it’s Friday, the migration is reversible (probably), and the rollback plan is ‘we’ll see’",
    scores: [10, 8, 8, 8, 8],
  },
];

function weightedTotal(c: Candidate): number {
  return c.scores.reduce((sum, s, i) => sum + s * WEIGHTS[i], 0);
}

function pickWinner(candidates: Candidate[]): Candidate {
  const ranked = [...candidates].sort((a, b) => {
    const byScore = weightedTotal(b) - weightedTotal(a);
    if (byScore !== 0) return byScore;
    const byLength = a.text.length - b.text.length;
    if (byLength !== 0) return byLength;
    return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
  });
  return ranked[0];
}

function main(): void {
  const winner = pickWinner(CANDIDATES);
  const line = winner.text;

  // Gate validation, enforced inside the program: 1-159 characters, a
  // single line, not whitespace only. Fail hard on any violation.
  if (line.length < 1 || line.length > 159) {
    throw new Error(`entry length ${line.length} is outside the 1-159 gate`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, line, "utf8");

  // Round-trip verification: read the file back and compare bytes.
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== line) {
    throw new Error("round-trip mismatch: entry.txt does not match the winner");
  }
  if (Buffer.byteLength(roundTrip, "utf8") !== Buffer.byteLength(line, "utf8")) {
    throw new Error("round-trip byte-length mismatch");
  }

  console.log(`winner (${weightedTotal(winner)}/150, ${line.length} chars): ${line}`);
}

main();
