# code-golf-expr — entry

- **Entry file:** `solution.js` (61 bytes) — exports `evalExpr` (CommonJS:
  after `require("./solution.js")`, `module.exports.evalExpr` is the function).
- **Test:** `node test.js` — runs the official public cases (`cases.json`),
  an edge battery, and a 20k-expression fuzz check of the fallback parser.
- **Fallback:** `parser-fallback.js` — a hand-written recursive-descent
  evaluator with identical semantics, in case the sandbox forbids `eval`.
  Not the entry; see `MATERI.md` for the swap procedure and byte counts.
