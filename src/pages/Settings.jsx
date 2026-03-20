import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Card, CardLabel } from "../components/Card";

const WEATHER_OPTS = [
  { id: "sunny",    icon: "☀️",  label: "Sunny",    pct: "100%" },
  { id: "partly",   icon: "⛅",  label: "Partly",   pct: "60%"  },
  { id: "overcast", icon: "🌥",  label: "Overcast", pct: "25%"  },
  { id: "rainy",    icon: "🌧",  label: "Rainy",    pct: "5%"   },
];

const PERSONAS = [
  { id: "solo",     icon: "🧑",      label: "Solo Traveler",    desc: "Minimal load, max range",   cfg: { occupants: 1, experience: "expert" } },
  { id: "family",   icon: "👨‍👩‍👧", label: "Family Trip",       desc: "High load, all appliances", cfg: { occupants: 4, experience: "normal" } },
  { id: "remote",   icon: "💻",      label: "Remote Worker",    desc: "Electronics priority",       cfg: { occupants: 1, experience: "expert" } },
  { id: "fulltime", icon: "🏡",      label: "Full-Time Living", desc: "All systems active",         cfg: { occupants: 2, experience: "normal" } },
];

export default function Settings() {
  const { simConfig, setSimConfig, simulate, setActivePage } = useApp();

  const [panelKwh,    setPanelKwh]    = useState(simConfig.solar_output_kwh);
  const [startingSoc, setStartingSoc] = useState(Math.round(simConfig.starting_soc * 100));
  const [activePersona, setActivePersona] = useState(null);

  function sv(key, delta) {
    if (key === "occ") {
      setSimConfig(c => ({ ...c, occupants: Math.max(1, Math.min(8, c.occupants + delta)) }));
    }
    if (key === "bat") {
      setSimConfig(c => ({ ...c, battery_capacity_kwh: Math.max(10, Math.min(200, c.battery_capacity_kwh + delta)) }));
    }
  }

  function applySet() {
    simulate({
      ...simConfig,
      solar_output_kwh: panelKwh,
      starting_soc:     startingSoc / 100,
    });
    setActivePage("dash");
  }

  function loadPersona(p) {
    setActivePersona(p.id);
    setSimConfig(c => ({ ...c, ...p.cfg }));
  }

  const rowStyle = { borderColor: "rgba(255,255,255,.07)" };

  const Row = ({ label, sub, children }) => (
    <div className="flex items-center justify-between py-3.5 border-b" style={rowStyle}>
      <div>
        <div className="text-[13px]">{label}</div>
        {sub && <div className="text-[10px] mt-0.5" style={{ color: "var(--l3)" }}>{sub}</div>}
      </div>
      {children}
    </div>
  );

  const Stepper = ({ value, onDec, onInc }) => (
    <div className="flex items-center gap-2.5">
      <button onClick={onDec}
        className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[18px] font-light border-none"
        style={{ background: "rgba(255,255,255,.08)", color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>−</button>
      <span className="font-mono text-[16px] font-semibold min-w-[28px] text-center">{value}</span>
      <button onClick={onInc}
        className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[18px] font-light border-none"
        style={{ background: "rgba(255,255,255,.08)", color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>+</button>
    </div>
  );

  const Seg = ({ options, value, onChange }) => (
    <div className="flex rounded-[8px] p-0.5" style={{ background: "rgba(255,255,255,.08)" }}>
      {options.map(o => (
        <button key={o.id} onClick={() => onChange(o.id)}
          className="flex-1 px-3 py-[5px] rounded-[6px] text-[11px] border-none transition-all whitespace-nowrap"
          style={{
            background: value === o.id ? "rgba(255,255,255,.15)" : "transparent",
            color: value === o.id ? "#fff" : "var(--l2)",
            cursor: "pointer", fontFamily: "inherit",
            fontWeight: value === o.id ? 600 : 400,
          }}>
          {o.label}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <div className="grid grid-cols-2 gap-3.5">

        {/* ── Card 1: Occupancy & Experience ── */}
        <Card>
          <CardLabel>Occupancy &amp; Experience</CardLabel>

          <Row label="Occupants" sub="Scales AC, water, lighting load">
            <Stepper
              value={simConfig.occupants}
              onDec={() => sv("occ", -1)}
              onInc={() => sv("occ",  1)}
            />
          </Row>

          <Row label="Experience" sub="Expert=15% efficient, New=20% wasteful">
            <Seg
              options={[
                { id: "expert", label: "Expert" },
                { id: "normal", label: "Normal" },
                { id: "new",    label: "New"    },
              ]}
              value={simConfig.experience}
              onChange={v => setSimConfig(c => ({ ...c, experience: v }))}
            />
          </Row>

          <div className="flex items-center justify-between pt-3.5" style={{ borderTop: "1px solid rgba(255,255,255,.07)" }}>
            <div>
              <div className="text-[13px]">Battery capacity</div>
              <div className="text-[10px] mt-0.5" style={{ color: "var(--l3)" }}>
                {simConfig.battery_capacity_kwh} kWh LiFePO4
              </div>
            </div>
            <Stepper
              value={simConfig.battery_capacity_kwh}
              onDec={() => sv("bat", -5)}
              onInc={() => sv("bat",  5)}
            />
          </div>
        </Card>

        {/* ── Card 2: Solar & Weather Override ── */}
        <Card>
          <CardLabel>Solar &amp; Weather Override</CardLabel>

          {/* Weather cards grid */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {WEATHER_OPTS.map(w => (
              <button key={w.id}
                onClick={() => setSimConfig(c => ({ ...c, weather: w.id }))}
                className="flex flex-col items-center py-3.5 px-2 rounded-[14px] border transition-all text-center"
                style={{
                  background: simConfig.weather === w.id ? "rgba(255,159,10,.1)" : "rgba(255,255,255,.03)",
                  borderColor: simConfig.weather === w.id ? "rgba(255,159,10,.5)" : "var(--sep)",
                  cursor: "pointer",
                }}>
                <span className="text-[22px] mb-1.5">{w.icon}</span>
                <div className="text-[11px] font-semibold mb-0.5" style={{ color: "var(--l2)" }}>{w.label}</div>
                <div className="text-[10px]" style={{ color: "var(--l3)" }}>{w.pct}</div>
              </button>
            ))}
          </div>

          {/* Panel output slider */}
          <div className="mb-3">
            <div className="flex justify-between text-[11px] mb-1">
              <span style={{ color: "var(--l2)" }}>Panel output</span>
              <span className="font-mono" style={{ color: "#0A84FF" }}>{panelKwh.toFixed(1)} kWh/day</span>
            </div>
            <input type="range" min="0.5" max="12" step="0.5" value={panelKwh}
              onChange={e => setPanelKwh(parseFloat(e.target.value))} />
          </div>

          {/* Starting SOC slider */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span style={{ color: "var(--l2)" }}>Starting SOC</span>
              <span className="font-mono" style={{ color: "#0A84FF" }}>{startingSoc}%</span>
            </div>
            <input type="range" min="10" max="100" step="1" value={startingSoc}
              onChange={e => setStartingSoc(parseInt(e.target.value))} />
          </div>
        </Card>

        {/* ── Card 3: Quick Persona (full width) ── */}
        <div className="col-span-2">
          <Card>
            <CardLabel>Quick Persona</CardLabel>
            <div className="grid grid-cols-4 gap-3 mb-5">
              {PERSONAS.map(p => (
                <button key={p.id}
                  onClick={() => loadPersona(p)}
                  className="flex flex-col items-center py-5 px-3 rounded-[18px] border transition-all text-center"
                  style={{
                    background: activePersona === p.id ? "rgba(10,132,255,.1)" : "rgba(255,255,255,.03)",
                    borderColor: activePersona === p.id ? "rgba(10,132,255,.4)" : "var(--sep)",
                    cursor: "pointer",
                  }}>
                  <span className="text-[32px] mb-2.5">{p.icon}</span>
                  <div className="text-[13px] font-semibold mb-1">{p.label}</div>
                  <div className="text-[11px]" style={{ color: "var(--l3)" }}>{p.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={applySet}
              className="w-full py-3.5 rounded-[16px] text-[13px] font-semibold tracking-[.3px] transition-opacity"
              style={{
                background: "linear-gradient(135deg,#0A84FF,#0055D4)",
                border: "none", color: "#fff", cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 4px 20px rgba(10,132,255,.3)",
              }}>
              ▶ &nbsp;Run Simulation with These Settings
            </button>
          </Card>
        </div>

      </div>
    </div>
  );
}
