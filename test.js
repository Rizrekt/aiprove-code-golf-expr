// Runs the official public cases + edge cases + a fuzz comparison (parser vs eval entry).
const cases = require("./cases.json");
const entry = require("./solution.js").evalExpr;
const parser = require("./parser-fallback.js").evalExpr;
let fail = 0;
for (const [name, fn] of [["solution(eval)", entry], ["parser-fallback", parser]]) {
  let ok = 0;
  for (const c of cases) { const v = fn(c.in); if (Math.abs(v - c.out) < 1e-9) ok++; else { console.log(name, "PUBLIC FAIL", c.in, v, c.out); fail++; } }
  console.log(name, "public cases:", ok + "/" + cases.length);
  const edge = [["010+1",11],["077",77],["10.05",10.05],["(007)+1",8],["0.5",0.5],["0",0],["100",100],["2*-3",-6],["1 + 2 * 3",7],[".5*4",2],["00.5",0.5],["-3+2",-1],["5/-2",-2.5],["2*(3+(4-1))",12],["1/3",1/3],["9-4*2+1",2]];
  let eok = 0;
  for (const [inp, want] of edge) { let v; try { v = fn(inp); } catch (e) { v = "THREW"; } if (typeof v === "number" && Math.abs(v - want) < 1e-9) eok++; else { console.log(name, "EDGE FAIL", inp, "->", v, "want", want); fail++; } }
  console.log(name, "edge cases:", eok + "/" + edge.length);
}
// Fuzz: random expressions from the documented grammar; parser must match eval exactly-ish.
function rndExpr(d) {
  if (d <= 0 || Math.random() < 0.35) {
    const n = Math.random() < 0.5 ? String(Math.floor(Math.random() * 100)) : (Math.random() * 20).toFixed(Math.floor(Math.random() * 3) + 1);
    return Math.random() < 0.15 ? "-" + n : n;
  }
  const op = "+-*/"[Math.floor(Math.random() * 4)];
  let e = rndExpr(d - 1) + op + rndExpr(d - 1);
  if (Math.random() < 0.4) e = "(" + e + ")";
  return e;
}
let fz = 0, fzOk = 0;
for (let k = 0; k < 20000; k++) {
  const e = rndExpr(3); let a, b;
  try { a = entry(e); } catch { continue; }
  try { b = parser(e); } catch { b = "THREW"; }
  if (typeof a !== "number" || !isFinite(a)) continue;
  fz++; if (typeof b === "number" && Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a))) fzOk++; else { if (fz - fzOk < 4) console.log("FUZZ DIFF", e, a, b); }
}
console.log("fuzz parser-vs-eval agreement:", fzOk + "/" + fz);
if (fail) { console.log("FAILURES:", fail); process.exit(1); }
console.log("ALL CHECKS DONE");
