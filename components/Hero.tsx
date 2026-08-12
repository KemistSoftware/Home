"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  STOCK, expiry, packOf, money, rupee, searchStock,
  type Product, type Batch, type Line,
} from "@/lib/stock";

const CONTACT = "admin@kemist.in";
const finePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover:hover) and (pointer:fine)").matches;

type Mode = "search" | "batch";
type Phase = "demo" | "invite" | "live";

export default function Hero() {
  /* ---------------- counter state ---------------- */
  const [phase, setPhase] = useState<Phase>("demo");
  const [mode, setMode] = useState<Mode>("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [sel, setSel] = useState(0);
  const [note, setNote] = useState("");
  const [prod, setProd] = useState<Product | null>(null);
  const [bi, setBi] = useState(0);
  const [qty, setQty] = useState(1);
  const [bill, setBill] = useState<Line[]>([]);
  const [paid, setPaid] = useState(false);
  const [steps, setSteps] = useState([false, false, false, false]);
  const [litKey, setLitKey] = useState<string | null>(null);

  /* ---------------- signup state ---------------- */
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ text: "First 50 shops join the beta free.", kind: "" });

  const qRef = useRef<HTMLInputElement>(null);
  const qtyRef = useRef<HTMLInputElement>(null);
  /* Refs shadow the state the demo loop reads, so the loop always sees
     current values without being torn down and restarted on every keystroke. */
  const taken = useRef(false);
  const modeRef = useRef<Mode>("search");
  const prodRef = useRef<Product | null>(null);
  const resRef = useRef<Product[]>([]);
  const biRef = useRef(0);
  const qtyRefVal = useRef(1);

  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { prodRef.current = prod; }, [prod]);
  useEffect(() => { resRef.current = results; }, [results]);
  useEffect(() => { biRef.current = bi; }, [bi]);
  useEffect(() => { qtyRefVal.current = qty; }, [qty]);

  const live = phase === "live";

  const markStep = useCallback((i: number) => {
    if (!taken.current) return;
    setSteps((s) => (s[i] ? s : s.map((v, n) => (n === i ? true : v))));
  }, []);

  const takeOver = useCallback(() => {
    if (taken.current) return;
    taken.current = true;
    setPhase("live");
  }, []);

  const runSearch = useCallback((raw: string) => {
    const { hits, total, ms } = searchStock(raw);
    setResults(hits);
    setSel(0);
    setNote(
      !raw.trim() ? ""
      : total ? `${total} ${total === 1 ? "match" : "matches"} \u00B7 ${ms.toFixed(2)} ms`
      : `no match \u00B7 ${ms.toFixed(2)} ms`
    );
    return hits;
  }, []);

  const openBatches = useCallback((pr: Product | undefined) => {
    if (!pr) return;
    const first = pr.bat.findIndex((z) => !expiry(z.e).dead);
    setProd(pr);
    setMode("batch");
    setBi(first < 0 ? 0 : first);
    setQty(1);
    setNote(`${pr.bat.length} ${pr.bat.length === 1 ? "batch" : "batches"} \u00B7 oldest first`);
    markStep(1);
    if (finePointer()) requestAnimationFrame(() => qtyRef.current?.focus({ preventScroll: true }));
  }, [markStep]);

  const closeBatches = useCallback(() => {
    setMode("search");
    setProd(null);
    if (finePointer()) qRef.current?.focus({ preventScroll: true });
  }, []);

  const addLine = useCallback(() => {
    const pr = prodRef.current;
    if (!pr) return;
    const bt = pr.bat[biRef.current];
    const n = qtyRefVal.current;
    if (expiry(bt.e).dead) { setNote("expired batch \u00B7 cannot be billed"); return; }
    if (n > bt.q) { setQty(bt.q); setNote(`only ${bt.q} on hand`); return; }

    setBill((b) => {
      const found = b.find((l) => l.b === bt.b);
      if (found) return b.map((l) => (l.b === bt.b ? { ...l, q: l.q + n } : l));
      return [...b, {
        n: pr.n, s: pr.s, d: pr.d, f: pr.f, u: pr.u, pk: pr.pk,
        b: bt.b, e: bt.e, r: bt.r, p: bt.p, q: n,
      }];
    });
    markStep(2);
    setQuery(""); setResults([]); setNote(""); setPaid(false);
    closeBatches();
  }, [closeBatches, markStep]);

  const flash = (k: string) => { setLitKey(k); setTimeout(() => setLitKey(null), 130); };

  const pay = useCallback((label: string) => {
    setBill((b) => {
      if (!b.length) return b;
      const amt = rupee(b.reduce((s, l) => s + l.r * l.q, 0));
      setPaid(true);
      setNote(`${label} ${amt} \u00B7 printing`);
      markStep(3);
      setTimeout(() => { setBill([]); setPaid(false); setNote(""); }, 1600);
      return b;
    });
    setResults([]); setQuery("");
    if (modeRef.current === "batch") closeBatches();
  }, [closeBatches, markStep]);

  const clearBill = useCallback(() => {
    setBill([]); setResults([]); setQuery(""); setNote(""); setPaid(false);
    if (modeRef.current === "batch") closeBatches();
  }, [closeBatches]);

  /* ---------------- attract loop: runs once, then hands over ---------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("invite");
      return;
    }
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const stop = () => cancelled || taken.current;

    const type = async (text: string) => {
      for (let c = 1; c <= text.length; c++) {
        if (stop()) return;
        setQuery(text.slice(0, c));
        runSearch(text.slice(0, c));
        await wait(75);
      }
    };

    (async () => {
      await wait(600);
      await type("dolo 650");        if (stop()) return; await wait(1200);
      openBatches(resRef.current[0]); if (stop()) return; await wait(1500);
      setBi(1);                      if (stop()) return; await wait(900);
      setQty(2);                     if (stop()) return; await wait(800);
      addLine();                     if (stop()) return; await wait(900);
      await type("pantop");          if (stop()) return; await wait(900);
      openBatches(resRef.current[0]); if (stop()) return; await wait(1000);
      addLine();                     if (stop()) return; await wait(900);
      flash("k5"); pay("Cash");      if (stop()) return; await wait(2400);
      if (stop()) return;
      setBill([]); setResults([]); setQuery(""); setNote(""); setPaid(false);
      setPhase("invite");
      if (finePointer()) qRef.current?.focus({ preventScroll: true });
    })();

    return () => { cancelled = true; };
    // Intentionally runs once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- keyboard ---------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const inPanel = el === qRef.current || el === qtyRef.current;

      if (e.key === "/" && !inPanel && (el as HTMLElement)?.tagName !== "INPUT") {
        e.preventDefault(); takeOver();
        if (modeRef.current === "batch") closeBatches();
        else qRef.current?.focus({ preventScroll: true });
        return;
      }
      if (!inPanel) return;

      const fn = (k: string, label: string) => {
        e.preventDefault(); flash(k); label === "clear" ? clearBill() : pay(label);
      };

      if (modeRef.current === "batch") {
        const pr = prodRef.current;
        if (!pr) return;
        if (e.key === "ArrowDown") { e.preventDefault(); setBi((i) => (i + 1) % pr.bat.length); }
        else if (e.key === "ArrowUp") { e.preventDefault(); setBi((i) => (i - 1 + pr.bat.length) % pr.bat.length); }
        else if (e.key === "ArrowRight" || e.key === "+") { e.preventDefault(); setQty((q) => q + 1); markStep(2); }
        else if (e.key === "ArrowLeft" || e.key === "-") { e.preventDefault(); setQty((q) => Math.max(1, q - 1)); markStep(2); }
        else if (e.key === "Enter") { e.preventDefault(); addLine(); }
        else if (e.key === "Escape") { e.preventDefault(); closeBatches(); }
        else if (e.key === "F5") fn("k5", "Cash");
        else if (e.key === "F6") fn("k6", "UPI");
        else if (e.key === "F9") fn("k9", "clear");
        return;
      }

      const hits = resRef.current;
      if (e.key === "ArrowDown") { e.preventDefault(); if (hits.length) setSel((s) => (s + 1) % hits.length); }
      else if (e.key === "ArrowUp") { e.preventDefault(); if (hits.length) setSel((s) => (s - 1 + hits.length) % hits.length); }
      else if (e.key === "Enter") { e.preventDefault(); if (hits.length) openBatches(hits[sel]); }
      else if (e.key === "Escape") { setQuery(""); runSearch(""); }
      else if (e.key === "F5") fn("k5", "Cash");
      else if (e.key === "F6") fn("k6", "UPI");
      else if (e.key === "F9") fn("k9", "clear");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [addLine, clearBill, closeBatches, openBatches, pay, runSearch, sel, takeOver, markStep]);

  /* ---------------- sign-up ---------------- */
  const mailtoFallback = () => {
    window.location.href =
      `mailto:${CONTACT}?subject=${encodeURIComponent("Kemist early access")}` +
      `&body=${encodeURIComponent(`Shop name:\nTown:\nPhone:\nEmail: ${email}\n`)}`;
    setMsg({ text: "Opening your mail app — send it and you're on the list.", kind: "" });
  };

  const join = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMsg({ text: "Enter an email address we can reach you on.", kind: "err" });
      return;
    }
    setBusy(true);
    setMsg({ text: "Adding you\u2026", kind: "" });
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), company: hp }),
      });
      if (res.ok) {
        setEmail("");
        setMsg({ text: "You're on the list.", kind: "ok" });
      } else {
        // Nothing configured server-side, or the store failed: never
        // pretend the address was kept.
        mailtoFallback();
      }
    } catch {
      mailtoFallback();
    } finally {
      setBusy(false);
    }
  };

  /* ---------------- derived ---------------- */
  const net = bill.reduce((s, l) => s + l.r * l.q, 0);
  const mrp = bill.reduce((s, l) => s + l.p * l.q, 0);
  const allDone = steps.every(Boolean);
  const bt: Batch | null = prod ? prod.bat[bi] : null;
  const firstLive = prod ? prod.bat.findIndex((z) => !expiry(z.e).dead) : -1;

  const heads: [string, string, string, string] =
    mode === "batch" && prod ? ["Batch \u00B7 Expiry", "Pack \u00B7 Rack", "On hand", "Rate"]
    : results.length ? ["Item", "Rack \u00B7 First expiry", "Stock", "Rate"]
    : bill.length ? ["Item", "Batch \u00B7 Expiry", "Qty", "Amount"]
    : ["Item", "Pack \u00B7 Rack", "Stock", "Rate"];

  const stepLabels = ["Search", "Pick batch", "Set qty", "Take payment"];
  const nextStep = steps.indexOf(false);

  const onStep = (i: number) => {
    takeOver();
    if (i === 0) {
      if (mode === "batch") closeBatches();
      setQuery("paracetamol"); runSearch("paracetamol"); markStep(0);
      qRef.current?.focus({ preventScroll: true });
    } else if (i === 1) {
      let hits = results;
      if (!hits.length) { setQuery("dolo 650"); hits = runSearch("dolo 650"); markStep(0); }
      openBatches(hits[sel] ?? hits[0]);
    } else if (i === 2) {
      if (mode !== "batch") {
        let hits = results;
        if (!hits.length) { setQuery("dolo 650"); hits = runSearch("dolo 650"); markStep(0); }
        openBatches(hits[0]);
      }
      setQty((q) => q + 1); markStep(2);
    } else {
      if (!bill.length) {
        if (mode !== "batch") {
          let hits = results;
          if (!hits.length) { setQuery("dolo 650"); hits = runSearch("dolo 650"); }
          openBatches(hits[0]);
        }
        addLine();
      }
      flash("k5"); pay("Cash");
    }
  };

  return (
    <>
      <div className="hero-cta">
        <div className="signup">
          <div className="field">
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email" type="email" inputMode="email" autoComplete="email"
              placeholder="you@yourshop.in" value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") join(); }}
            />
            {/* Honeypot: hidden from people, irresistible to bots. */}
            <input
              type="text" name="company" tabIndex={-1} autoComplete="off"
              aria-hidden="true" className="hp" value={hp}
              onChange={(e) => setHp(e.target.value)}
            />
            <button
              className={"btn" + (allDone ? " nudge" : "")}
              type="button" onClick={join} disabled={busy}
            >
              Join the list
            </button>
          </div>
          <p className={"sub " + msg.kind}>{msg.text}</p>
        </div>
      </div>

      <div className="hero-demo">
        <div
          className={"counter" + (live ? " live" : "")}
          id="panel"
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") {
              takeOver();
              if (modeRef.current !== "batch" && finePointer())
                qRef.current?.focus({ preventScroll: true });
            }
          }}
          onClick={takeOver}
        >
          <div className="counter-top">
            <span className="ct-left">
              <span className="counter-title">New bill</span>
              <span className={"mode" + (live ? " on" : "")}>
                {live ? "You're driving" : phase === "invite" ? "Your turn" : "Demo"}
              </span>
            </span>
            <span className="chip"><i /> Offline · billing normally</span>
          </div>

          <div className={
            "search" + (mode === "batch" ? " picking" : "") +
            (phase === "invite" ? " invite" : "")
          }>
            <span className="slash">/</span>
            <label htmlFor="q" className="sr-only">Search medicines</label>
            <input
              id="q" ref={qRef} type="text" autoComplete="off" spellCheck={false}
              placeholder={
                phase === "invite"
                  ? "Type a medicine — try paracetamol"
                  : "Brand, molecule, strength, pack, rack, maker or batch…"
              }
              value={query}
              onFocus={takeOver}
              onChange={(e) => {
                takeOver();
                setQuery(e.target.value);
                runSearch(e.target.value);
                if (e.target.value.trim()) markStep(0);
              }}
            />
            {mode === "batch" && prod && (
              <span className="crumb">
                <button
                  className="back" type="button"
                  onClick={(e) => { e.stopPropagation(); closeBatches(); }}
                >Esc</button>
                <span className="cn">{prod.n} {prod.f}</span>
                <span className="cr">{packOf(prod)} · rack {prod.rack}</span>
              </span>
            )}
            <span className="ms">{note}</span>
          </div>

          <table>
            <thead>
              <tr>
                <th>{heads[0]}</th>
                <th className="c-batch">{heads[1]}</th>
                <th className="c-qty num">{heads[2]}</th>
                <th className="c-rate num">{heads[3]}</th>
              </tr>
            </thead>
            <tbody className="rows">
              {mode === "batch" && prod ? (
                prod.bat.map((b, i) => {
                  const x = expiry(b.e);
                  const off = ((b.p - b.r) / b.p) * 100;
                  return (
                    <tr
                      key={b.b}
                      className={(i === bi ? "focus " : "") + (x.dead ? "dead " : "") + "anim"}
                      onClick={() => setBi(i)}
                    >
                      <td>
                        <div className="ln1">
                          {b.b}{i === firstLive && <span className="fifo">FIFO</span>}
                        </div>
                        <div className={"ln2 " + x.cls}>{x.label} {x.life}</div>
                      </td>
                      <td className="c-batch">
                        <div className="ln1">{packOf(prod)}</div>
                        <div className="ln2">{prod.rack}</div>
                      </td>
                      <td className="c-qty num">
                        <div className="ln1">{b.q}</div><div className="ln2">on hand</div>
                      </td>
                      <td className="c-rate num">
                        <div className="ln1">{money(b.r)}</div>
                        <div className="ln2">
                          <span className="mrp">{money(b.p)}</span>{" "}
                          <span className="off">{off.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : results.length ? (
                results.map((pr, i) => {
                  const first = pr.live![0] ?? pr.bat[0];
                  const x = expiry(first.e);
                  const off = ((first.p - first.r) / first.p) * 100;
                  const low = pr.stock! <= 10;
                  return (
                    <tr
                      key={pr.n} className={(i === sel ? "focus " : "") + "anim"}
                      onClick={() => { setSel(i); openBatches(pr); }}
                    >
                      <td>
                        <div className="ln1">
                          {pr.n}<span className="form">{pr.f}</span>
                          {pr.bat.length > 1 && <span className="batches">{pr.bat.length} BATCHES</span>}
                        </div>
                        <div className="ln2">{pr.s} · {pr.d} · {pr.m}</div>
                        <div className="ln3">{packOf(pr)}{pr.box ? ` · ${pr.box}` : ""}</div>
                      </td>
                      <td className="c-batch">
                        <div className="ln1">{pr.rack}</div>
                        <div className={"ln2 " + x.cls}>{x.label} {x.life}</div>
                      </td>
                      <td className="c-qty num">
                        <div className={"ln1" + (low ? " qty-low" : "")}>{pr.stock}</div>
                        <div className="ln2">{low ? "low" : pr.pk + "s"}</div>
                      </td>
                      <td className="c-rate num">
                        <div className="ln1">{money(first.r)}</div>
                        <div className="ln2">
                          <span className="mrp">{money(first.p)}</span>{" "}
                          <span className="off">{off.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : bill.length ? (
                bill.map((l) => {
                  const x = expiry(l.e);
                  return (
                    <tr key={l.b} className={"line" + (paid ? " paidrow" : "") + " anim"}>
                      <td>
                        <div className="ln1">{l.n}<span className="form">{l.f}</span></div>
                        <div className="ln2">{l.s} · {l.d}</div>
                        <div className="ln3">{l.u} / {l.pk}</div>
                      </td>
                      <td className="c-batch">
                        <div className="ln1">{l.b}</div>
                        <div className={"ln2 " + x.cls}>{x.label} {x.life}</div>
                      </td>
                      <td className="c-qty num">
                        <div className="ln1">{l.q}</div>
                        <div className="ln2">{l.pk}{l.q > 1 ? "s" : ""}</div>
                      </td>
                      <td className="c-rate num">
                        <div className="ln1">{money(l.r * l.q)}</div>
                        <div className="ln2">{money(l.r)} each</div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="empty" colSpan={4}>
                    {query.trim() ? "Nothing by that name."
                      : phase === "invite" ? "Your turn — search above."
                      : "No items yet. Search above."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {mode === "batch" && prod && bt && (
            <div className="qtybar">
              <span className="qlabel">Qty</span>
              <div className="stepper">
                <button className="qbtn" type="button" aria-label="Fewer"
                  onClick={() => { setQty((q) => Math.max(1, q - 1)); markStep(2); }}>−</button>
                <input
                  className="qin" ref={qtyRef} type="text" inputMode="numeric"
                  aria-label="Quantity" value={qty}
                  onChange={(e) => {
                    const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
                    if (!isNaN(n)) { setQty(Math.max(1, Math.min(n, Math.max(1, bt.q)))); markStep(2); }
                    else if (e.target.value === "") setQty(1);
                  }}
                />
                <button className="qbtn" type="button" aria-label="More"
                  onClick={() => { setQty((q) => Math.min(q + 1, Math.max(1, bt.q))); markStep(2); }}>+</button>
              </div>
              <span className="qmeta">
                {bt.b} · {bt.q} on hand · {rupee(bt.r)} each · <b>{rupee(bt.r * qty)}</b>
                {expiry(bt.e).dead ? " · expired" : ""}
              </span>
              <button className="addbtn" type="button" onClick={addLine}>Add ⏎</button>
            </div>
          )}

          <div className="counter-foot">
            <div className="keys">
              <button className={"key" + (litKey === "k5" ? " hit" : "")} type="button"
                onClick={() => { takeOver(); flash("k5"); pay("Cash"); }}>F5 Cash</button>
              <button className={"key" + (litKey === "k6" ? " hit" : "")} type="button"
                onClick={() => { takeOver(); flash("k6"); pay("UPI"); }}>F6 UPI</button>
              <button className={"key" + (litKey === "k9" ? " hit" : "")} type="button"
                onClick={() => { takeOver(); flash("k9"); clearBill(); }}>F9 Clear</button>
            </div>
            <div className="totals">
              <div className="t1">Total <b>{rupee(net)}</b></div>
              <div className="t2">{net && mrp > net ? `saved ₹${money(mrp - net)} on MRP` : ""}</div>
            </div>
          </div>
        </div>

        <div className="steps">
          {stepLabels.map((label, i) => (
            <button
              key={label} type="button"
              className={"step" + (steps[i] ? " done" : "") + (live && i === nextStep ? " now" : "")}
              onClick={() => onStep(i)}
            >
              <b>{i + 1}</b>
              {i === 3 ? <><span className="wide">Take&nbsp;</span>payment</> : label}
            </button>
          ))}
        </div>

        <div className="tryrow">
          <span className="trylabel">Try</span>
          {["paracetamol", "650", "syrup", "cipla", "MX7721", "B1"].map((t) => (
            <button key={t} className="try" type="button"
              onClick={() => {
                takeOver();
                if (mode === "batch") closeBatches();
                setQuery(t); runSearch(t); markStep(0);
                if (finePointer()) qRef.current?.focus({ preventScroll: true });
              }}>
              {t === "B1" ? "rack B1" : t}
            </button>
          ))}
        </div>

        <p className="hint">
          {allDone ? "That's the counter loop — and all of it just ran on this machine."
            : live ? <><b>↑ ↓</b> choose · <b>Enter</b> open batches · <b>Enter</b> add · <b>F5</b> cash.</>
            : phase === "invite" ? <><b>Your turn.</b> Search by name, salt, pack, rack, maker or batch number.</>
            : <>A demo is running — <b>tap</b> or <b>hover</b> the panel to take it over.</>}
        </p>
      </div>
    </>
  );
}
