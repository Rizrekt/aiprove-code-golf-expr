// Non-eval fallback: recursive-descent parser for + - * /, decimals, parens,
// precedence, unary +/-, whitespace. Use only if the sandbox forbids eval.
module.exports={evalExpr:s=>{s=s.replace(/\s/g,"");let i=0;
const E=()=>{let v=T();while(s[i]=="+"||s[i]=="-"){let o=s[i++],w=T();v=o=="+"?v+w:v-w}return v},
T=()=>{let v=F();while(s[i]=="*"||s[i]=="/"){let o=s[i++],w=F();v=o=="*"?v*w:v/w}return v},
F=()=>{let c=s[i];if(c=="("){i++;let v=E();i++;return v}if(c=="-"){i++;return-F()}if(c=="+"){i++;return F()}let j=i;while(i<s.length&&((s[i]>="0"&&s[i]<="9")||s[i]=="."))i++;return parseFloat(s.slice(j,i))};
return E()}}
