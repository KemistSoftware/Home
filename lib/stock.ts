/**
 * Shop stock. One entry per product; batches nested underneath.
 *
 * This is demo data for the public site. The shipped product reads the
 * same shape from the local database, so the UI needs no changes when
 * the real catalogue replaces it.
 */

export type Batch = {
  b: string;   // batch number
  e: string;   // expiry, YYYY-MM
  q: number;   // quantity on hand
  r: number;   // selling rate
  p: number;   // MRP
};

export type Product = {
  n: string;    // brand name
  s: string;    // molecule / salt
  d: string;    // dose
  f: string;    // dosage form
  m: string;    // manufacturer
  u: string;    // units per pack
  pk: string;   // pack type
  box?: string; // outer pack
  rack: string; // shelf location
  bat: Batch[];
  // derived below
  stock?: number;
  live?: Batch[];
  hay?: string;
};

export type Line = {
  n: string; s: string; d: string; f: string; u: string; pk: string;
  b: string; e: string; r: number; p: number; q: number;
};

export type ExpiryInfo = {
  label: string;
  life: string;
  cls: "" | "exp-soon" | "exp-bad";
  dead: boolean;
};

export const STOCK: Product[] = [
  {n:"DOLO 650", s:"paracetamol", d:"650 mg", f:"TAB", m:"Micro Labs", u:"15 tab", pk:"strip", box:"10 strips / box", rack:"A2-14",
   bat:[{b:"DL1902",e:"2026-05",q:8,r:31.50,p:32.00},{b:"DL2208",e:"2026-11",q:42,r:31.50,p:34.00},{b:"DL2411",e:"2027-03",q:148,r:31.50,p:34.00}]},
  {n:"DOLO 500", s:"paracetamol", d:"500 mg", f:"TAB", m:"Micro Labs", u:"15 tab", pk:"strip", box:"10 strips / box", rack:"A2-15",
   bat:[{b:"DK1130",e:"2026-09",q:36,r:22.40,p:24.00},{b:"DK1409",e:"2027-05",q:90,r:22.40,p:24.00}]},
  {n:"CROCIN ADVANCE", s:"paracetamol", d:"500 mg", f:"TAB", m:"GSK", u:"15 tab", pk:"strip", box:"10 strips / box", rack:"A2-11",
   bat:[{b:"CR8802",e:"2028-01",q:64,r:30.10,p:32.00}]},
  {n:"CALPOL 650", s:"paracetamol", d:"650 mg", f:"TAB", m:"GSK", u:"15 tab", pk:"strip", box:"10 strips / box", rack:"A2-12",
   bat:[{b:"CP5521",e:"2027-06",q:22,r:29.80,p:31.50}]},
  {n:"CALPOL 250", s:"paracetamol", d:"250 mg / 5 ml", f:"SYRUP", m:"GSK", u:"60 ml", pk:"bottle", box:"carton", rack:"S1-04",
   bat:[{b:"CS2214",e:"2027-02",q:12,r:86.50,p:92.00}]},
  {n:"PAN 40", s:"pantoprazole", d:"40 mg", f:"TAB", m:"Alkem", u:"15 tab", pk:"strip", box:"10 strips / box", rack:"B1-02",
   bat:[{b:"PN0912",e:"2026-11",q:54,r:126.00,p:135.00},{b:"PN1177",e:"2027-09",q:30,r:126.00,p:138.00}]},
  {n:"PANTOP 40", s:"pantoprazole", d:"40 mg", f:"TAB", m:"Aristo", u:"10 tab", pk:"strip", box:"15 strips / box", rack:"B1-03",
   bat:[{b:"PT4407",e:"2028-05",q:90,r:118.75,p:128.00}]},
  {n:"PAN D", s:"pantoprazole + domperidone", d:"40 + 30 mg", f:"CAP", m:"Alkem", u:"10 cap", pk:"strip", box:"10 strips / box", rack:"B1-05",
   bat:[{b:"PD7719",e:"2028-02",q:41,r:196.00,p:210.00}]},
  {n:"OMEZ 20", s:"omeprazole", d:"20 mg", f:"CAP", m:"Dr Reddy's", u:"10 cap", pk:"strip", box:"20 strips / box", rack:"B1-08",
   bat:[{b:"OM3140",e:"2027-08",q:76,r:58.60,p:62.00}]},
  {n:"RANTAC 150", s:"ranitidine", d:"150 mg", f:"TAB", m:"JB Chemicals", u:"10 tab", pk:"strip", box:"20 strips / box", rack:"B1-10",
   bat:[{b:"RT2205",e:"2027-04",q:28,r:34.20,p:36.50}]},
  {n:"MOX 500", s:"amoxycillin", d:"500 mg", f:"CAP", m:"Cipla", u:"10 cap", pk:"strip", box:"10 strips / box", rack:"C3-01",
   bat:[{b:"MX5510",e:"2026-06",q:5,r:92.30,p:96.00},{b:"MX7721",e:"2027-07",q:60,r:92.30,p:98.00}]},
  {n:"NOVAMOX 500", s:"amoxycillin", d:"500 mg", f:"CAP", m:"Cipla", u:"10 cap", pk:"strip", box:"10 strips / box", rack:"C3-02",
   bat:[{b:"NV3318",e:"2028-02",q:45,r:88.00,p:94.00}]},
  {n:"AUGMENTIN 625", s:"amoxycillin + clavulanic acid", d:"500 + 125 mg", f:"TAB", m:"GSK", u:"10 tab", pk:"strip", box:"5 strips / box", rack:"C3-05",
   bat:[{b:"AG9004",e:"2027-12",q:18,r:206.50,p:223.00}]},
  {n:"AZITHRAL 500", s:"azithromycin", d:"500 mg", f:"TAB", m:"Alembic", u:"5 tab", pk:"strip", box:"10 strips / box", rack:"C3-08",
   bat:[{b:"AZ1177",e:"2027-10",q:33,r:112.00,p:120.00}]},
  {n:"TAXIM-O 200", s:"cefixime", d:"200 mg", f:"TAB", m:"Alkem", u:"10 tab", pk:"strip", box:"10 strips / box", rack:"C3-09",
   bat:[{b:"TX6650",e:"2028-03",q:26,r:148.00,p:158.00}]},
  {n:"MONOCEF 1G", s:"ceftriaxone", d:"1 g", f:"INJ", m:"Aristo", u:"1 vial", pk:"vial", box:"vial + water", rack:"F1-02",
   bat:[{b:"MC2091",e:"2027-05",q:6,r:64.00,p:68.00}]},
  {n:"COMBIFLAM", s:"ibuprofen + paracetamol", d:"400 + 325 mg", f:"TAB", m:"Sanofi", u:"20 tab", pk:"strip", box:"15 strips / box", rack:"A3-01",
   bat:[{b:"CB4432",e:"2027-09",q:112,r:44.60,p:47.50}]},
  {n:"ZERODOL SP", s:"aceclofenac + paracetamol", d:"100 + 325 mg", f:"TAB", m:"Ipca", u:"10 tab", pk:"strip", box:"10 strips / box", rack:"A3-04",
   bat:[{b:"ZR8813",e:"2027-11",q:58,r:98.20,p:105.00}]},
  {n:"VOLINI GEL", s:"diclofenac diethylamine", d:"1.16%", f:"GEL", m:"Sun Pharma", u:"30 g", pk:"tube", box:"carton", rack:"E2-06",
   bat:[{b:"VG5567",e:"2028-06",q:20,r:135.00,p:145.00}]},
  {n:"MONTAIR LC", s:"montelukast + levocetirizine", d:"10 + 5 mg", f:"TAB", m:"Cipla", u:"10 tab", pk:"strip", box:"10 strips / box", rack:"D1-03",
   bat:[{b:"ML3302",e:"2028-01",q:37,r:186.00,p:198.00}]},
  {n:"ALLEGRA 120", s:"fexofenadine", d:"120 mg", f:"TAB", m:"Sanofi", u:"10 tab", pk:"strip", box:"10 strips / box", rack:"D1-05",
   bat:[{b:"AL7745",e:"2028-04",q:24,r:172.00,p:185.00}]},
  {n:"CETZINE", s:"cetirizine", d:"10 mg", f:"TAB", m:"GSK", u:"10 tab", pk:"strip", box:"20 strips / box", rack:"D1-07",
   bat:[{b:"CZ1120",e:"2027-10",q:88,r:28.90,p:31.00}]},
  {n:"ASTHALIN", s:"salbutamol", d:"100 mcg", f:"INHALER", m:"Cipla", u:"200 doses", pk:"inhaler", box:"carton", rack:"E1-01",
   bat:[{b:"AS9931",e:"2027-08",q:14,r:124.00,p:132.00}]},
  {n:"GLYCOMET 500", s:"metformin", d:"500 mg", f:"TAB", m:"USV", u:"20 tab", pk:"strip", box:"10 strips / box", rack:"G1-02",
   bat:[{b:"GM2244",e:"2028-02",q:96,r:38.70,p:41.00}]},
  {n:"JANUMET 50/500", s:"sitagliptin + metformin", d:"50 + 500 mg", f:"TAB", m:"MSD", u:"15 tab", pk:"strip", box:"4 strips / box", rack:"G1-04",
   bat:[{b:"JM6618",e:"2027-07",q:30,r:214.50,p:229.00}]},
  {n:"TELMA 40", s:"telmisartan", d:"40 mg", f:"TAB", m:"Glenmark", u:"15 tab", pk:"strip", box:"10 strips / box", rack:"H1-01",
   bat:[{b:"TM4409",e:"2027-12",q:52,r:96.40,p:103.00}]},
  {n:"AMLONG 5", s:"amlodipine", d:"5 mg", f:"TAB", m:"Micro Labs", u:"15 tab", pk:"strip", box:"20 strips / box", rack:"H1-03",
   bat:[{b:"AM7752",e:"2028-03",q:74,r:42.30,p:45.00}]},
  {n:"ATORVA 10", s:"atorvastatin", d:"10 mg", f:"TAB", m:"Zydus", u:"15 tab", pk:"strip", box:"10 strips / box", rack:"H1-06",
   bat:[{b:"AT1163",e:"2027-09",q:61,r:78.00,p:83.00}]},
  {n:"ROSUVAS 10", s:"rosuvastatin", d:"10 mg", f:"TAB", m:"Sun Pharma", u:"10 tab", pk:"strip", box:"10 strips / box", rack:"H1-08",
   bat:[{b:"RS8890",e:"2028-05",q:29,r:142.00,p:152.00}]},
  {n:"ECOSPRIN 75", s:"aspirin", d:"75 mg", f:"TAB", m:"USV", u:"14 tab", pk:"strip", box:"20 strips / box", rack:"H1-10",
   bat:[{b:"EC3307",e:"2027-11",q:130,r:14.60,p:15.50}]},
  {n:"CLOPITAB 75", s:"clopidogrel", d:"75 mg", f:"TAB", m:"Ipca", u:"10 tab", pk:"strip", box:"10 strips / box", rack:"H1-12",
   bat:[{b:"CT5528",e:"2027-06",q:43,r:88.90,p:95.00}]},
  {n:"THYRONORM 50", s:"thyroxine", d:"50 mcg", f:"TAB", m:"Abbott", u:"120 tab", pk:"bottle", box:"carton", rack:"G2-01",
   bat:[{b:"TN2216",e:"2028-01",q:47,r:158.00,p:168.00}]},
  {n:"SHELCAL 500", s:"calcium carbonate + vitamin D3", d:"500 mg + 250 IU", f:"TAB", m:"Torrent", u:"15 tab", pk:"strip", box:"10 strips / box", rack:"J1-02",
   bat:[{b:"SC4471",e:"2028-04",q:39,r:126.00,p:135.00}]},
  {n:"ZINCOVIT", s:"multivitamin + zinc", d:"zinc 22 mg", f:"TAB", m:"Apex", u:"15 tab", pk:"strip", box:"10 strips / box", rack:"J1-04",
   bat:[{b:"ZV9903",e:"2027-10",q:55,r:105.00,p:112.00}]},
  {n:"BECOSULES", s:"vitamin B complex + C", d:"with 75 mg C", f:"CAP", m:"Pfizer", u:"20 cap", pk:"strip", box:"10 strips / box", rack:"J1-06",
   bat:[{b:"BC1194",e:"2028-02",q:68,r:47.20,p:50.00}]},
  {n:"BETADINE", s:"povidone iodine", d:"5%", f:"SOLN", m:"Win-Medicare", u:"15 ml", pk:"bottle", box:"carton", rack:"E2-01",
   bat:[{b:"BD2287",e:"2028-03",q:17,r:52.00,p:56.00}]},
  {n:"ORS ORANGE", s:"oral rehydration salts", d:"21.8 g", f:"SACHET", m:"FDC", u:"1 sachet", pk:"sachet", box:"50 sachets / box", rack:"K1-01",
   bat:[{b:"OR4412",e:"2027-01",q:210,r:22.00,p:24.00}]}
];

const NOW_M = new Date().getFullYear() * 12 + new Date().getMonth();

/** Expiry label, remaining shelf life in brackets, and state. */
export function expiry(ym: string): ExpiryInfo {
  const y = +ym.slice(0, 4);
  const m = +ym.slice(5, 7);
  const left = y * 12 + (m - 1) - NOW_M;
  const label = ("0" + m).slice(-2) + "/" + String(y).slice(2);

  if (left < 0) return { label, life: "(expired)", cls: "exp-bad", dead: true };
  if (left === 0) return { label, life: "(this month)", cls: "exp-bad", dead: false };

  let life: string;
  if (left < 12) {
    life = "(" + left + " mo)";
  } else {
    const yy = Math.floor(left / 12);
    const mm = left % 12;
    life = "(" + yy + " y" + (mm ? " " + mm + " m" : "") + ")";
  }
  return { label, life, cls: left <= 6 ? "exp-soon" : "", dead: false };
}

/**
 * Batches are held oldest-expiry-first: the order stock should leave the
 * shelf. Sellable stock excludes expired batches, so the figure on screen
 * is what can actually be billed.
 */
for (const pr of STOCK) {
  pr.bat.sort((a, b) => a.e.localeCompare(b.e));
  pr.stock = pr.bat.reduce((t, x) => t + (expiry(x.e).dead ? 0 : x.q), 0);
  pr.live = pr.bat.filter((x) => !expiry(x.e).dead);
  pr.hay = [
    pr.n, pr.s, pr.d, pr.f, pr.m, pr.u, pr.pk, pr.box ?? "", pr.rack,
    pr.bat.map((x) => x.b).join(" "),
  ].join(" ").toLowerCase();
}

export const packOf = (pr: Product) => pr.u + " / " + pr.pk;
export const money = (n: number) => n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
export const rupee = (n: number) => "\u20B9" + money(n);

export type SearchResult = { hits: Product[]; total: number; ms: number };

/**
 * Every token must appear somewhere in the product's indexed text, so
 * adding words narrows rather than widens. Exact prefix matches on the
 * brand name rank first.
 */
export function searchStock(raw: string, limit = 5): SearchResult {
  const q = raw.trim().toLowerCase();
  if (!q) return { hits: [], total: 0, ms: 0 };

  const t0 = performance.now();
  const toks = q.split(/\s+/);
  const out: { pr: Product; k: number }[] = [];

  for (const pr of STOCK) {
    if (toks.every((t) => pr.hay!.includes(t))) {
      const name = pr.n.toLowerCase();
      out.push({ pr, k: name.startsWith(q) ? 0 : name.includes(q) ? 1 : 2 });
    }
  }
  out.sort((a, b) => a.k - b.k || a.pr.n.localeCompare(b.pr.n));

  return {
    hits: out.slice(0, limit).map((x) => x.pr),
    total: out.length,
    ms: performance.now() - t0,
  };
}
