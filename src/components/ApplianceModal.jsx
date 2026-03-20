import { useState, useEffect } from "react";
import { createAppliance, updateAppliance, deleteAppliance } from "../api";
import { useApp } from "../context/AppContext";

const ICONS = ["🔥","❄️","🫧","💨","🚿","🛁","🌬️","📡","🍟","☕","🗑","📺","🎵","🛰️","📶","📷","📱","💡","🌀","⚡","🔌","🔧","🏠","🖥️","💻","🎮","📻","🔦"];
const COLORS = ["#FF6B6B","#5E9EFF","#BF5AF2","#FF9F0A","#30D158","#5AC8F5","#FFD60A","#FF453A","#0A84FF","#34C759","#AC8E68","#636366","#FF375F"];
const SCHEDS = ["24h","cycle","meal","burst","morning","evening","lights","day","once"];

const DEFAULTS = {
  name: "", cat: "medium", voltage_v: 120, current_a: 1.0,
  power_factor: 0.95, efficiency_pct: 90, duty_cycle_pct: 100,
  hrs: 4, sched: "24h", on: true, icon: "🔌", clr: "#0A84FF",
};

export default function ApplianceModal({ appliance, onClose, onSaved, onDeleted }) {
  const { showToast } = useApp();
  const [form, setForm] = useState(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const isEdit = !!appliance;

  useEffect(() => {
    if (appliance) setForm({ ...DEFAULTS, ...appliance });
    else setForm(DEFAULTS);
  }, [appliance]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const computedWatts = (form.voltage_v * form.current_a * form.power_factor).toFixed(1);
  const computedEff   = (computedWatts / (form.efficiency_pct / 100)).toFixed(1);
  const dailyKwh      = ((computedEff / 1000) * (form.duty_cycle_pct / 100) * form.hrs).toFixed(3);

  async function handleSave() {
    if (!form.name.trim()) return showToast("Name is required", "error");
    setSaving(true);
    try {
      let result;
      if (isEdit) result = await updateAppliance(appliance.id, form);
      else result = await createAppliance(form);
      showToast(isEdit ? "Appliance updated" : "Appliance added", "success");
      onSaved(result);
      onClose();
    } catch (e) {
      showToast(e.message, "error");
    } finally { setSaving(false); }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      await deleteAppliance(appliance.id);
      showToast("Appliance deleted", "success");
      onDeleted(appliance.id);
      onClose();
    } catch (e) {
      showToast(e.message, "error");
    } finally { setSaving(false); }
  }

  const inp = "w-full px-3 py-2.5 rounded-[12px] text-[13px] outline-none transition-colors";
  const inpStyle = { background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", color: "#fff", fontFamily: "inherit" };
  const lbl = "text-[10px] tracking-[1px] uppercase mb-1.5 flex items-center gap-1.5";

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center transition-opacity duration-200"
      style={{ background: "rgba(0,0,0,.75)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-[min(740px,96vw)] max-h-[92vh] overflow-y-auto rounded-[22px] p-7"
        style={{ background: "#1c1c1e", border: "1px solid rgba(255,255,255,.1)", boxShadow: "0 24px 80px rgba(0,0,0,.7)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="text-[15px] font-semibold tracking-[.3px]">{isEdit ? "Edit Appliance" : "Add Appliance"}</div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-[8px] flex items-center justify-center text-sm transition-all"
            style={{ background: "rgba(255,255,255,.08)", border: "none", color: "var(--l2)", cursor: "pointer" }}>✕</button>
        </div>

        {/* Computed preview */}
        <div className="grid grid-cols-4 gap-2 mb-5 p-3.5 rounded-[16px] border" style={{ background: "rgba(255,255,255,.03)", borderColor: "var(--sep)" }}>
          {[
            { v: `${computedWatts} W`, l: "Real watts" },
            { v: `${computedEff} W`, l: "Eff watts" },
            { v: `${dailyKwh} kWh`, l: "Daily kWh" },
            { v: form.on ? "ON" : "OFF", l: "State", c: form.on ? "#30D158" : "#FF453A" },
          ].map(i => (
            <div key={i.l} className="text-center">
              <div className="font-mono text-[17px] font-bold mb-0.5" style={{ color: i.c || "#fff" }}>{i.v}</div>
              <div className="text-[8px] tracking-[.8px] uppercase" style={{ color: "var(--l3)" }}>{i.l}</div>
            </div>
          ))}
        </div>

        {/* Form sections */}
        <div className="text-[9px] tracking-[2px] uppercase font-medium pb-2.5 border-b mb-3.5" style={{ color: "var(--l3)", borderColor: "var(--sep)" }}>
          Identity
        </div>

        <div className="grid grid-cols-2 gap-3.5 mb-3.5">
          <div>
            <div className={lbl} style={{ color: "var(--l3)" }}>Name</div>
            <input className={inp} style={inpStyle} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Appliance name" />
          </div>
          <div>
            <div className={lbl} style={{ color: "var(--l3)" }}>Category</div>
            <select className={inp} style={inpStyle} value={form.cat} onChange={e => set("cat", e.target.value)}>
              <option value="high">⚡ High power</option>
              <option value="medium">🔶 Medium</option>
              <option value="low">🔵 Low / Always on</option>
            </select>
          </div>
        </div>

        {/* Icon picker */}
        <div className="mb-3.5">
          <div className={lbl} style={{ color: "var(--l3)" }}>Icon <span className="text-[8px] normal-case" style={{ color: "var(--l4)" }}>selected: {form.icon}</span></div>
          <div className="flex gap-1.5 flex-wrap mt-1.5">
            {ICONS.map(ic => (
              <button key={ic} onClick={() => set("icon", ic)}
                className="w-[34px] h-[34px] rounded-[8px] flex items-center justify-center text-[15px] transition-all border"
                style={{ border: form.icon === ic ? "1px solid #0A84FF" : "1px solid rgba(255,255,255,.1)", background: form.icon === ic ? "rgba(10,132,255,.15)" : "transparent", cursor: "pointer" }}>
                {ic}
              </button>
            ))}
          </div>
        </div>

        {/* Color picker */}
        <div className="mb-3.5">
          <div className={lbl} style={{ color: "var(--l3)" }}>Color</div>
          <div className="flex gap-1.5 flex-wrap mt-1.5">
            {COLORS.map(c => (
              <button key={c} onClick={() => set("clr", c)}
                className="w-6 h-6 rounded-[6px] transition-all"
                style={{ background: c, border: form.clr === c ? "2px solid white" : "2px solid transparent", transform: form.clr === c ? "scale(1.2)" : "scale(1)", cursor: "pointer" }} />
            ))}
          </div>
        </div>

        <div className="text-[9px] tracking-[2px] uppercase font-medium pb-2.5 border-b mb-3.5 mt-5" style={{ color: "var(--l3)", borderColor: "var(--sep)" }}>
          Electrical Parameters
        </div>

        <div className="grid grid-cols-3 gap-3.5 mb-3.5">
          {[
            { k: "voltage_v", l: "Voltage (V)", step: 1, min: 1, max: 480 },
            { k: "current_a", l: "Current (A)", step: 0.01, min: 0.01, max: 200 },
            { k: "power_factor", l: "Power Factor", step: 0.01, min: 0.1, max: 1.0 },
          ].map(f => (
            <div key={f.k}>
              <div className={lbl} style={{ color: "var(--l3)" }}>{f.l}</div>
              <input type="number" className={inp} style={inpStyle}
                value={form[f.k]} step={f.step} min={f.min} max={f.max}
                onChange={e => set(f.k, parseFloat(e.target.value) || 0)} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3.5 mb-3.5">
          {[
            { k: "efficiency_pct", l: "Efficiency %", step: 1, min: 1, max: 100 },
            { k: "duty_cycle_pct", l: "Duty Cycle %", step: 1, min: 1, max: 100 },
            { k: "hrs", l: "Hours/day", step: 0.25, min: 0.1, max: 24 },
          ].map(f => (
            <div key={f.k}>
              <div className={lbl} style={{ color: "var(--l3)" }}>{f.l}</div>
              <input type="number" className={inp} style={inpStyle}
                value={form[f.k]} step={f.step} min={f.min} max={f.max}
                onChange={e => set(f.k, parseFloat(e.target.value) || 0)} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3.5 mb-3.5">
          <div>
            <div className={lbl} style={{ color: "var(--l3)" }}>Schedule</div>
            <select className={inp} style={inpStyle} value={form.sched} onChange={e => set("sched", e.target.value)}>
              {SCHEDS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-between pt-5">
            <div>
              <div className="text-[13px]">Enabled</div>
              <div className="text-[10px] mt-0.5" style={{ color: "var(--l3)" }}>Include in simulation</div>
            </div>
            <button onClick={() => set("on", !form.on)}
              className="relative w-[38px] h-5 rounded-full border transition-all"
              style={{
                background: form.on ? "rgba(10,132,255,.3)" : "rgba(255,255,255,.1)",
                borderColor: form.on ? "#0A84FF" : "rgba(255,255,255,.15)",
                cursor: "pointer",
              }}>
              <span className="absolute w-3.5 h-3.5 rounded-full top-[2px] transition-all"
                style={{ left: form.on ? "20px" : "2px", background: form.on ? "#0A84FF" : "rgba(255,255,255,.5)" }} />
            </button>
          </div>
        </div>

        {/* Delete confirm */}
        {showDelete && (
          <div className="mt-2.5 p-3 rounded-[12px] text-[12px]" style={{ background: "rgba(255,69,58,.07)", border: "1px solid rgba(255,69,58,.25)", color: "#FF453A" }}>
            Are you sure? This will permanently delete "{form.name}".
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-2 mt-5 pt-4 border-t" style={{ borderColor: "var(--sep)" }}>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 rounded-[12px] text-[13px] font-semibold transition-opacity"
            style={{ background: "linear-gradient(135deg,#0A84FF,#0055D4)", border: "none", color: "#fff", cursor: "pointer", opacity: saving ? .6 : 1 }}>
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Appliance"}
          </button>
          <button onClick={onClose}
            className="px-4 py-3 rounded-[12px] text-[13px] transition-all"
            style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.1)", color: "#fff", cursor: "pointer" }}>
            Cancel
          </button>
          {isEdit && !showDelete && (
            <button onClick={() => setShowDelete(true)}
              className="px-4 py-3 rounded-[12px] text-[13px] transition-all"
              style={{ background: "rgba(255,69,58,.1)", border: "1px solid rgba(255,69,58,.25)", color: "#FF453A", cursor: "pointer" }}>
              Delete
            </button>
          )}
          {isEdit && showDelete && (
            <button onClick={handleDelete} disabled={saving}
              className="px-4 py-3 rounded-[12px] text-[13px] transition-all"
              style={{ background: "rgba(255,69,58,.2)", border: "1px solid rgba(255,69,58,.4)", color: "#FF453A", cursor: "pointer" }}>
              Confirm Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
