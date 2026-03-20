import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { toggleAppliance } from "../api";
import ApplianceModal from "../components/ApplianceModal";
import { Card, CardLabel } from "../components/Card";

const CAT_FILTERS = [
  { id: "all",    label: "All" },
  { id: "high",   label: "⚡ High power" },
  { id: "medium", label: "🔶 Medium" },
  { id: "low",    label: "🔵 Always on" },
  { id: "custom", label: "✨ Custom" },
];

export default function Appliances() {
  const { appliances, setAppliances, simulate, showToast } = useApp();
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState(null); // null | "new" | appliance object
  const [togglingId, setTogglingId] = useState(null);

  const filtered = appliances.filter(a => {
    if (filter === "all")    return true;
    if (filter === "custom") return a.is_custom;
    return a.cat === filter;
  });

  const totalKwh   = appliances.filter(a => a.on).reduce((s, a) => s + (a.effective_watts / 1000) * (a.duty_cycle_pct / 100) * a.hrs, 0);
  const critCount  = appliances.filter(a => a.on && a.effective_watts > 1500).length;
  const onCount    = appliances.filter(a => a.on).length;
  const peakKw     = appliances.filter(a => a.on).reduce((s, a) => s + a.effective_watts / 1000, 0);

  async function handleToggle(a) {
    setTogglingId(a.id);
    try {
      const result = await toggleAppliance(a.id);
      setAppliances(prev => prev.map(x => x.id === a.id ? { ...x, on: result.on } : x));
      await simulate();
    } catch (e) {
      showToast(e.message, "error");
    } finally { setTogglingId(null); }
  }

  function handleSaved(updated) {
    setAppliances(prev => {
      const idx = prev.findIndex(x => x.id === updated.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updated;
        return next;
      }
      return [...prev, updated];
    });
    simulate();
  }

  function handleDeleted(id) {
    setAppliances(prev => prev.filter(x => x.id !== id));
    simulate();
  }

  const catColor = { high: "#FF453A", medium: "#FF9F0A", low: "#30D158" };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5 gap-2.5 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          {CAT_FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className="px-3.5 py-1.5 rounded-full text-[13px] border transition-all duration-150"
              style={{
                background: filter === f.id ? "rgba(255,255,255,.1)" : "transparent",
                borderColor: filter === f.id ? "rgba(255,255,255,.2)" : "var(--sep)",
                color: filter === f.id ? "#fff" : "var(--l2)",
                cursor: "pointer", fontFamily: "inherit",
              }}>
              {f.label}
            </button>
          ))}
        </div>
        <button onClick={() => setModal("new")}
          className="flex items-center gap-1.5 px-5 py-2 rounded-full text-[14px] font-semibold transition-opacity"
          style={{ background: "#0A84FF", border: "none", color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
          ＋ Add Appliance
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-2.5 mb-3.5">
        {[
          { v: totalKwh.toFixed(2), l: "Daily load kWh", c: "#0A84FF" },
          { v: critCount, l: "Critical loads", c: "#FF453A" },
          { v: onCount, l: "Active devices", c: "#30D158" },
          { v: peakKw.toFixed(2), l: "Peak draw kW", c: "#FF9F0A" },
        ].map(s => (
          <div key={s.l} className="rounded-[16px] border text-center py-3.5 px-3 shadow-[0_2px_8px_rgba(0,0,0,.4)]"
            style={{ background: "var(--glass)", borderColor: "var(--gb)" }}>
            <div className="font-mono text-[22px] font-bold leading-none mb-1" style={{ color: s.c }}>{s.v}</div>
            <div className="text-[11px] tracking-[.8px] uppercase" style={{ color: "var(--l3)" }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-[22px] border overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,.55)]"
        style={{ background: "var(--glass)", borderColor: "var(--gb)" }}>
        {/* Header */}
        <div className="grid gap-0.5 px-4 py-2.5 border-b text-[11px] tracking-[1.4px] uppercase"
          style={{ gridTemplateColumns: "2.2fr 68px 66px 62px 66px 66px 68px 74px 84px 64px", background: "rgba(255,255,255,.03)", borderColor: "var(--sep)", color: "var(--l3)" }}>
          <span>Appliance</span>
          <span className="text-right">Volt V</span>
          <span className="text-right">Curr A</span>
          <span className="text-right">PF</span>
          <span className="text-right">Eff %</span>
          <span className="text-right">Duty %</span>
          <span className="text-right">Real W</span>
          <span>kWh/day</span>
          <span>Status</span>
          <span className="text-center">Actions</span>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-[15px]" style={{ color: "var(--l3)" }}>No appliances in this category.</div>
        )}

        {filtered.map(a => {
          const dailyKwh = ((a.effective_watts / 1000) * (a.duty_cycle_pct / 100) * a.hrs).toFixed(3);
          const maxKwh   = Math.max(...appliances.filter(x => x.on).map(x => (x.effective_watts / 1000) * (x.duty_cycle_pct / 100) * x.hrs), 1);
          const share    = parseFloat(dailyKwh) / maxKwh;
          const isCrit   = a.effective_watts > 1500;

          return (
            <div key={a.id}
              className="grid gap-0.5 px-4 py-2.5 items-center transition-colors border-t"
              style={{
                gridTemplateColumns: "2.2fr 68px 66px 62px 66px 66px 68px 74px 84px 64px",
                borderColor: "rgba(255,255,255,.04)",
                borderLeft: a.on ? "2px solid rgba(10,132,255,.4)" : "2px solid transparent",
                opacity: a.on ? 1 : 0.5,
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.03)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              {/* Name */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center text-[13px] flex-shrink-0"
                  style={{ background: `${a.clr}22` }}>
                  {a.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-[14px] font-medium truncate">{a.name}</div>
                  <div className="text-[11px] mt-0.5 capitalize" style={{ color: "var(--l3)" }}>{a.cat}</div>
                </div>
              </div>

              {/* Electrical values */}
              {[a.voltage_v, a.current_a, a.power_factor, a.efficiency_pct, a.duty_cycle_pct].map((v, i) => (
                <div key={i} className="font-mono text-[13px] font-semibold text-right" style={{ color: "var(--l2)" }}>
                  {typeof v === "number" ? v.toFixed(i === 2 ? 2 : 0) : v}
                </div>
              ))}

              {/* Real W */}
              <div className="font-mono text-[13px] font-semibold text-right" style={{ color: a.clr }}>
                {Math.round(a.effective_watts)}
              </div>

              {/* kWh/day bar */}
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-[3px] rounded-[2px] overflow-hidden" style={{ background: "rgba(255,255,255,.06)" }}>
                  <div className="h-full rounded-[2px]" style={{ width: `${Math.min(share * 100, 100)}%`, background: a.clr }} />
                </div>
                <span className="font-mono text-[11px] min-w-[26px] text-right" style={{ color: "var(--l3)" }}>{dailyKwh}</span>
              </div>

              {/* Status chip */}
              <div>
                {isCrit && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: "rgba(255,69,58,.12)", color: "#FF453A", border: "1px solid rgba(255,69,58,.25)" }}>
                    ⚡ High
                  </span>
                )}
                {!isCrit && a.is_custom && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: "rgba(191,90,242,.12)", color: "#BF5AF2", border: "1px solid rgba(191,90,242,.2)" }}>
                    Custom
                  </span>
                )}
                {!isCrit && !a.is_custom && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: "rgba(48,209,88,.1)", color: "#30D158", border: "1px solid rgba(48,209,88,.2)" }}>
                    Default
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 justify-center">
                {/* Toggle */}
                <label className="relative w-[38px] h-5 flex-shrink-0 cursor-pointer">
                  <input type="checkbox" checked={a.on} disabled={togglingId === a.id}
                    onChange={() => handleToggle(a)} className="opacity-0 w-0 h-0 absolute" />
                  <span className="absolute inset-0 rounded-full border transition-all"
                    style={{ background: a.on ? "rgba(10,132,255,.3)" : "rgba(255,255,255,.1)", borderColor: a.on ? "#0A84FF" : "rgba(255,255,255,.15)" }}>
                    <span className="absolute w-3.5 h-3.5 rounded-full top-[2px] transition-all"
                      style={{ left: a.on ? "20px" : "2px", background: a.on ? "#0A84FF" : "rgba(255,255,255,.5)" }} />
                  </span>
                </label>
                {/* Edit */}
                <button onClick={() => setModal(a)}
                  className="w-[26px] h-[26px] rounded-[6px] flex items-center justify-center text-[14px] transition-all border"
                  style={{ border: "1px solid rgba(255,255,255,.1)", background: "transparent", color: "var(--l2)", cursor: "pointer" }}
                  title="Edit">✏️</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modal && (
        <ApplianceModal
          appliance={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
