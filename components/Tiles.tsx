"use client";

import { useEffect, useRef, useState } from "react";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Each tile loops until the visitor touches it, then stays under their control. */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setSeen(true); return; }
    const io = new IntersectionObserver(
      (es) => { if (es.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect(); } },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, seen };
}

/* ================= 1 · offline outbox ================= */
function OfflineTile({ start }: { start: boolean }) {
  const SLOTS = 7;
  const [queued, setQueued] = useState(0);
  const [states, setStates] = useState<string[]>(Array(SLOTS).fill(""));
  const [online, setOnline] = useState(false);
  const [chip, setChip] = useState({ cls: "", label: "Offline" });
  const [note, setNote] = useState("Line is down. Billing continues.");
  const [syncing, setSyncing] = useState(false);
  const auto = useRef(true);

  const drain = async (n: number) => {
    setSyncing(true);
    setChip({ cls: "is-sync", label: "Syncing" });
    for (let i = 0; i < n; i++) {
      setStates((s) => s.map((v, k) => (k === i ? "sending" : v)));
      await wait(140);
      setStates((s) => s.map((v, k) => (k === i ? "done" : v)));
      setNote(`Backing up · ${n - i - 1} left`);
      await wait(230);
    }
    setSyncing(false);
    setChip({ cls: "is-ok", label: "Up to date" });
    setNote("Every bill safely off the machine.");
  };

  const cut = () => {
    setOnline(false); setQueued(0); setSyncing(false);
    setStates(Array(SLOTS).fill(""));
    setChip({ cls: "", label: "Offline" });
    setNote("Line is down. Billing continues.");
  };

  useEffect(() => {
    if (!start || reduced()) {
      if (reduced()) { setQueued(4); setStates(Array(SLOTS).fill("").map((_, i) => (i < 4 ? "filled" : ""))); }
      return;
    }
    let cancelled = false;
    (async () => {
      while (!cancelled && auto.current) {
        cut();
        for (let i = 1; i <= SLOTS; i++) {
          if (cancelled || !auto.current) return;
          setQueued(i);
          setStates((s) => s.map((v, k) => (k < i ? "filled" : v)));
          setNote(`${i} bill${i > 1 ? "s" : ""} held on this machine`);
          await wait(620);
        }
        await wait(700);
        if (cancelled || !auto.current) return;
        setOnline(true);
        await drain(SLOTS);
        await wait(2600);
      }
    })();
    return () => { cancelled = true; };
  }, [start]);

  return (
    <div className="tile">
      <div className="stage">
        <div className="stage-head">
          <span className={"chip " + chip.cls}><i /> {chip.label}</span>
          <button className="mini" type="button" onClick={() => {
            auto.current = false;
            if (online) cut();
            else { setOnline(true); drain(queued || 4); }
          }}>
            {online ? "Pull the cable" : "Reconnect"}
          </button>
        </div>
        <div className="queue">
          {states.map((s, i) => <span key={i} className={s} />)}
        </div>
        <div className={"wire" + (syncing ? " live" : "")} />
        <div className="stage-note">{note}</div>
      </div>
      <h2>Offline is not an outage</h2>
    </div>
  );
}

/* ================= 2 · four keystrokes ================= */
function KeysTile({ start }: { start: boolean }) {
  const [step, setStep] = useState(0);
  const auto = useRef(true);

  useEffect(() => {
    if (!start || reduced()) { if (reduced()) setStep(3); return; }
    let cancelled = false;
    (async () => {
      while (!cancelled && auto.current) {
        for (let s = 0; s <= 4; s++) {
          if (cancelled || !auto.current) return;
          setStep(s);
          await wait(s === 0 ? 800 : s === 4 ? 1900 : 950);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [start]);

  const notes = ["\u00A0", "Search", "Next match", "Added · batch PT4407", "Paid ₹118.75 · printing"];
  return (
    <div className="tile">
      <div className="stage">
        <div className="kb">
          <div className="kb-q">
            {step === 0 ? "\u00A0"
              : step >= 3 ? "1 × PANTOP 40 TAB"
              : <>/ pan 4<span className="c" /></>}
          </div>
          <div className={"kb-row" + (step >= 1 ? " show" : "") +
            (step === 1 ? " sel" : "") + (step === 3 ? " sel" : "") + (step === 4 ? " paid" : "")}>
            {step >= 3
              ? <><span>{step === 4 ? "CASH RECEIVED" : "PANTOP 40 TAB × 1"}</span><span>118.75</span></>
              : <><span>PAN 40 TAB</span><span>126.00</span></>}
          </div>
          <div className={"kb-row" + (step >= 1 && step < 3 ? " show" : "") + (step === 2 ? " sel" : "")}>
            <span>PANTOP 40 TAB</span><span>118.75</span>
          </div>
        </div>
        <div className="caps">
          {["/", "↓", "⏎", "F5"].map((c, i) => (
            <button key={c} type="button"
              className={"cap" + (step === i + 1 ? " hit" : "")}
              onClick={() => { auto.current = false; setStep(step === 4 ? 0 : i + 1); }}>
              {c}
            </button>
          ))}
        </div>
        <div className="stage-note">{notes[step]}</div>
      </div>
      <h2>A bill in four keystrokes</h2>
    </div>
  );
}

/* ================= 3 · expiry ================= */
function ExpiryTile({ start }: { start: boolean }) {
  const ROWS = [
    { b: "DK1130", e: "03/26" },
    { b: "PN0912", e: "11/26" },
    { b: "MX7721", e: "07/28" },
  ];
  const [cls, setCls] = useState(["", "", ""]);
  const [tags, setTags] = useState(["", "", ""]);
  const [note, setNote] = useState("\u00A0");
  const [count, setCount] = useState("3 batches");
  const auto = useRef(true);

  const pick = (i: number) => {
    if (i === 0) {
      setCls(["seen bad shake", "seen pick", "seen"]);
      setTags(["EXPIRED", "USED INSTEAD", ""]);
      setNote("Expired batch — blocked from sale");
      setTimeout(() => setCls(["seen bad", "seen pick", "seen"]), 300);
    } else if (i === 1) {
      setCls(["seen", "seen pick", "seen"]);
      setTags(["", "SELECTED", ""]);
      setNote("Nearest expiry moves first · 42 days left");
    } else {
      setCls(["seen", "seen pick", "seen"]);
      setTags(["", "SELECTED", "HELD BACK"]);
      setNote("Nearer expiry goes out before this one.");
    }
    setCount("2 usable");
  };

  useEffect(() => {
    if (!start || reduced()) { if (reduced()) pick(1); return; }
    let cancelled = false;
    (async () => {
      while (!cancelled && auto.current) {
        setCls(["", "", ""]); setTags(["", "", ""]); setNote("\u00A0"); setCount("3 batches");
        await wait(700); if (cancelled || !auto.current) return;
        for (let i = 0; i < 3; i++) {
          setCls((c) => c.map((v, k) => (k <= i ? "seen" : v)));
          await wait(220);
        }
        await wait(300); if (cancelled || !auto.current) return;
        setCls(["seen scan", "seen", "seen"]); setNote("Checking oldest first…");
        await wait(700); if (cancelled || !auto.current) return;
        setCls(["seen bad", "seen", "seen"]); setTags(["EXPIRED", "", ""]);
        setNote("Expired batch blocked from sale");
        await wait(1300); if (cancelled || !auto.current) return;
        setCls(["seen bad", "seen scan", "seen"]);
        await wait(600); if (cancelled || !auto.current) return;
        setCls(["seen bad", "seen pick", "seen"]); setTags(["EXPIRED", "SELECTED", ""]);
        setNote("Nearest expiry moves first · 42 days left");
        await wait(1500); if (cancelled || !auto.current) return;
        setTags(["EXPIRED", "SELECTED", "IN RESERVE"]); setCount("2 usable");
        await wait(2000);
      }
    })();
    return () => { cancelled = true; };
  }, [start]);

  return (
    <div className="tile">
      <div className="stage">
        <div className="stage-head"><span>MOX 500 CAP</span><span>{count}</span></div>
        <div className="fefo">
          {ROWS.map((r, i) => (
            <div key={r.b} className={"fefo-row " + cls[i]} tabIndex={0} role="button"
              onClick={() => { auto.current = false; pick(i); }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); auto.current = false; pick(i); }
              }}>
              <span>{r.b}</span><span>{r.e}</span><span className="t">{tags[i]}</span>
            </div>
          ))}
        </div>
        <div className="stage-note">{note}</div>
      </div>
      <h2>Expiry decided for you</h2>
    </div>
  );
}

/* ================= 4 · backup and restore ================= */
function BackupTile({ start }: { start: boolean }) {
  const SCHED = [
    { label: "Hourly", next: "Next backup 15:00" },
    { label: "Every 2 h", next: "Next backup 16:00" },
    { label: "Nightly", next: "Next backup 02:00" },
  ];
  const PTS = 8;
  const [ix, setIx] = useState(1);
  const [points, setPoints] = useState(4);
  const [chosen, setChosen] = useState(-1);
  const [pct, setPct] = useState(0);
  const [restoring, setRestoring] = useState(false);
  const [chip, setChip] = useState({ cls: "", label: "Scheduled" });
  const [note, setNote] = useState("Next backup 16:00 · 4 restore points kept");
  const auto = useRef(true);
  const ixRef = useRef(1);
  useEffect(() => { ixRef.current = ix; }, [ix]);

  const idle = (p: number) => {
    setChip({ cls: "", label: "Scheduled" });
    setNote(`${SCHED[ixRef.current].next} · ${p} restore points kept`);
  };

  const backup = async () => {
    setChip({ cls: "is-sync", label: "Backing up" });
    setRestoring(false);
    for (let p = 0; p <= 100; p += 10) { setPct(p); await wait(70); }
    const next = Math.min(points + 1, PTS);
    setPoints(next);
    setChip({ cls: "is-ok", label: "Backed up 14:00" });
    setNote(`Encrypted copy off the machine · ${next} restore points kept`);
    await wait(900);
    setPct(0); idle(next);
  };

  const restore = async () => {
    const have = points || 5;
    if (!points) setPoints(have);
    setChip({ cls: "is-sync", label: "Restoring" });
    setRestoring(true);
    setNote("1 · Pick a point");
    setChosen(have - 2);
    await wait(800);
    setNote("2 · Confirm — yesterday 22:00");
    for (let p = 0; p <= 100; p += 12) { setPct(p); await wait(60); }
    setNote("3 · Restored · back on the counter");
    setChip({ cls: "is-ok", label: "Restored" });
    setChosen(-1);
    await wait(1800);
    setPct(0); setRestoring(false); idle(have);
  };

  useEffect(() => {
    if (!start || reduced()) return;
    let cancelled = false;
    (async () => {
      while (!cancelled && auto.current) {
        await wait(1400); if (cancelled || !auto.current) return;
        await backup(); if (cancelled || !auto.current) return;
        await wait(1800); if (cancelled || !auto.current) return;
        await restore(); if (cancelled || !auto.current) return;
        await wait(2200);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  return (
    <div className="tile">
      <div className="stage">
        <div className="stage-head">
          <span className={"chip " + chip.cls}><i /> {chip.label}</span>
          <button className="mini" type="button"
            onClick={() => { auto.current = false; restore(); }}>Restore</button>
        </div>
        <div className="sched">
          {SCHED.map((s, i) => (
            <button key={s.label} type="button" className={"sc" + (i === ix ? " on" : "")}
              onClick={() => {
                auto.current = false; setIx(i); ixRef.current = i;
                setNote(`${s.next} · ${points} restore points kept`);
              }}>
              {s.label}
            </button>
          ))}
        </div>
        <div className={"bar" + (restoring ? " restoring" : "")}>
          <i style={{ width: pct + "%" }} />
        </div>
        <div className="rpts">
          {Array.from({ length: PTS }, (_, i) => (
            <span key={i} className={i === chosen ? "chosen" : i < points ? "kept" : ""} />
          ))}
        </div>
        <div className="stage-note">{note}</div>
      </div>
      <h2>Backups you can walk back</h2>
    </div>
  );
}

export default function Tiles() {
  const { ref, seen } = useInView<HTMLDivElement>();
  return (
    <div className="wrap tile-grid" ref={ref}>
      <OfflineTile start={seen} />
      <KeysTile start={seen} />
      <ExpiryTile start={seen} />
      <BackupTile start={seen} />
    </div>
  );
}
