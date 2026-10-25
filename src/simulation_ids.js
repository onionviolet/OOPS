// Stable simulation IDs, shared by definitions and causal history validation.
export function stableId(v) {return typeof v === "string" && /^[a-z][a-z0-9_.:-]*$/i.test(v) && !["__proto__", "constructor", "prototype"].includes(v);}
