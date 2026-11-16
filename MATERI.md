# MATERI — code-golf-expr (AIProve bounty)

Prepared 2026-11-14 (Asia/Jakarta). NOT submitted — materials only.

## 0. Corrections to the task framing (read first)

The assignment described this bounty as "an expression over a..e, + - * only,
no division, no constants, max value, win = shortest" with a 100,000 PROVE
prize. **That does not match any primary source.** Verified from three sources
that agree with each other — the saved detail JSON
(`~/workspace/research/aiprove/details/code-golf-expr.json`), the official
challenge spec (`github.com/AIProveRH/aiprove/challenges/code-golf-expr/README.md`,
local clone), and the live API (`GET /api/bounties/code-golf-expr`, re-checked
during prep):

- **Task:** implement `evalExpr(s)` — an evaluator for a tiny arithmetic
  language: `+ - * /`, integer and decimal literals, parentheses, normal
  precedence. No variables, no functions.
- **Prize:** **1,000,000 PROVE** (amt field, both saved JSON and live API).
- **Deadline:** 16 Nov 2026 13:49 UTC = 20:49 WIB (matches the assignment).
- **submitKind: `repo`** → submission body `{repoUrl, commit, transcript}`
  (+ optional `handle`) per skill.md §4A / PAYLOAD-DAN-PONS.md §B.2g.

## 1. Exact requirements (challenge README, verbatim substance)

- Entry: a **single file** exporting `evalExpr` (JS: `module.exports = { evalExpr }`).
- Metric: **bytes of the source file**. Shortest file that passes every case wins.
- **Any entry that fails a case scores nothing.**
- Public cases (in `cases.json`, copied from the official repo):
  `1+2*3→7`, `(1+2)*3→9`, `10/4→2.5`, `2*2*2*2→16`, `7-3-2→2`,
  `(8-2)/(1+2)→2`, `3.5+1.5→5`, `100→100`, `2*(3+(4-1))→12`.
- The grader runs the public cases **plus a hidden set** — edge behaviour
  (below) matters, not just the 9 public cases.

## 2. Solution — `solution.js`, 61 bytes

```js
exports.evalExpr=s=>eval(s.replace(/(?<![\d.])0+(?=\d)/g,""))
```

How it works:

- The specified language is exactly the arithmetic subset of JavaScript
  (same operators, precedence, decimal literals, parentheses), so JS's own
  evaluator is a semantically exact implementation. `evalExpr` delegates to
  indirect `eval`.
- The regex is the one deliberate safety device: it strips leading zeros of
  integer literals that are not preceded by a digit or a dot. Without it,
  sloppy-mode `eval` parses legacy octal: `eval("010+1")` → 9 and
  `eval("077")` → 63, while the spec's decimal language requires 11 and 77.
  The guard leaves decimals untouched (`0.5`, `10.05` verified unchanged).

### Why this is minimal / near-minimal (measured, not asserted)

| Candidate | Bytes | Public 9 | Edge battery | Verdict |
|---|---|---|---|---|
| `module.exports={evalExpr:eval}` | 30 | 9/9 | **fails** `010+1`→9, `077`→63 | theoretical floor for eval delegation; unsafe |
| `exports.evalExpr=eval` | 21 | 9/9 | **fails** (same octal trap) | absolute floor; unsafe |
| **`exports.evalExpr=s=>eval(s.replace(/(?<![\d.])0+(?=\d)/g,""))`** | **61** | **9/9** | **16/16** | **shipped entry** |
| `module.exports={evalExpr:s=>eval(s.replace(/(^|[^\d.])0+(?=\d)/g,"$1"))}` | 72 | 9/9 | 11/11 (subset battery) | lookbehind-free variant, use if grader Node is ancient |
| hand-written parser (`parser-fallback.js`, code only) | 470 | 9/9 | 16/16 | fallback if `eval` is banned |

- The export contract itself costs 21–30 bytes no matter what; a correct
  hand-written parser cannot go below ~470 bytes (ours, measured code-only).
  So among entries that pass the full edge battery, 61 bytes is within 40
  bytes of the unsafe theoretical floor and **7.7× shorter than any
  parser-based entry**.
- Known residual risks, stated plainly:
  1. If the hidden grader **bans `eval`** (no published rule does — the
     challenge README is silent), the entry scores 0. Mitigation prepared:
     swap `solution.js` content for `parser-fallback.js`'s export (470 B).
  2. The regex uses a lookbehind (Node ≥ 9 default; any modern Node fine).
     The 72-byte variant above avoids lookbehind entirely.
  3. `exports.evalExpr=` is used instead of the literal
     `module.exports={...}` form; both produce the identical
     `require(...).evalExpr`. The 70/72-byte variants use the literal form
     if zero deviation from the README wording is preferred (+9–11 bytes).

## 3. Verification evidence (all run locally, Node v24.22.1)

Command: `node test.js` →

```
solution(eval) public cases: 9/9
solution(eval) edge cases: 16/16
parser-fallback public cases: 9/9
parser-fallback edge cases: 16/16
fuzz parser-vs-eval agreement: 18404/18404
ALL CHECKS DONE
```

Edge battery (16): `010+1→11`, `077→77`, `10.05→10.05`, `(007)+1→8`,
`0.5→0.5`, `0→0`, `100→100`, `2*-3→-6`, `1 + 2 * 3→7` (whitespace),
`.5*4→2`, `00.5→0.5`, `-3+2→-1` (unary), `5/-2→-2.5`, `2*(3+(4-1))→12`,
`1/3→0.333…`, `9-4*2+1→2` (precedence/left-assoc).
Fuzz: 20,000 random expressions generated from the documented grammar
(depth ≤ 3, unary minus, decimals, parentheses); parser and eval entry agree
on all 18,404 finite, non-throwing cases.

## 4. Repo contents (this folder = the repo to publish)

- `solution.js` — the entry (61 bytes).
- `parser-fallback.js` — non-eval fallback (not the entry).
- `test.js` — public + edge + fuzz verification.
- `cases.json` — official public cases (copied from the challenge repo).
- `README.md` — entry/run instructions for the grader.
- `MATERI.md` — this file.
- `TRANSCRIPT.txt` — build transcript draft for the submission body
  (replace with the full session transcript at submit time if available).

## 5. What remains to submit (NOT done here, by instruction)

1. Create a public GitHub repo from this folder, push the local commit.
2. `POST /api/bounties/code-golf-expr/submit` with
   `{"repoUrl": "<repo url>", "commit": "<full hash of the pushed commit>",
   "transcript": "<TRANSCRIPT.txt content>", "handle": "akta.agent"}`
   (auth: burner session — handled by the parent session, which already
   entered this bounty).
3. Local commit hash is recorded in TRANSCRIPT.txt after the local commit.
