import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Card, CardLabel } from "../components/Card";
import { PowerChart, SocChart } from "../components/Charts";

const SCENARIOS = [
  { id: "expected", label: "Expected" },
  { id: "best",     label: "Best case" },
  { id: "worst",    label: "Worst case" },
];

export default function Simulate() {
  const { simData, simConfig, simulate } = useApp();
  const d = simData;

  const [scenario,       setScenario]       = useState(simConfig.scenario);
  const [solarIntensity, setSolarIntensity]  = useState(100);
  const [loadFactor,     setLoadFactor]     = useState(100);
  const [batCap,         setBatCap]         = useState(simConfig.battery_capacity_kwh);
  const [startSoc,       setStartSoc]       = useState(Math.round(simConfig.starting_soc * 100));
  const [solarKwh,       setSolarKwh]       = useState(simConfig.solar_output_kwh);
  const [tempC,          setTempC]          = useState(simConfig.temperature_c);

  function simSc(sc) {
    setScenario(sc);
    simulate({ scenario: sc });
  }

  function wiUpd(overrides) {
    simulate({
      scenario:             scenario,
      solar_output_kwh:     (overrides.solarKwh   ?? solarKwh)   * ((overrides.solarIntensity ?? solarIntensity) / 100),
      load_factor:          (overrides.loadFactor  ?? loadFactor)  / 100,
      battery_capacity_kwh: overrides.batCap       ?? batCap,
      starting_soc:         (overrides.startSoc    ?? startSoc)    / 100,
      temperature_c:        overrides.tempC         ?? tempC,
    });
  }

  if (!d) return <div className="p-10 text-center" style={{ color: "var(--l3)" }}>Loading…</div>;

  return (
    <div>
      {/* Scenario tabs */}
      <div className="flex gap-1.5 mb-3.5">
        {SCENARIOS.map(s => (
          <button key={s.id} onClick={() => simSc(s.id)}
            className="flex-1 py-2.5 rounded-[12px] text-[13px] font-medium text-center border transition-all"
            style={{
              background: scenario === s.id ? "rgba(10,132,255,.15)" : "transparent",
              borderColor: scenario === s.id ? "rgba(10,132,255,.4)" : "var(--sep)",
              color: scenario === s.id ? "#0A84FF" : "var(--l2)",
              cursor: "pointer", fontFamily: "inherit",
            }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Metric strip */}
      <div className="grid grid-cols-6 gap-2.5 mb-3.5">
        {[
          { v: d.total_load_kwh,                              l: "Load kWh/day",  c: "#0A84FF" },
          { v: d.total_sol_kwh,                               l: "Solar kWh",     c: "#FF9F0A" },
          { v: d.bat_draw_kwh,                                l: "Battery draw",  c: "#5AC8F5" },
          { v: d.days_off_grid > 99 ? "∞" : d.days_off_grid, l: "Days off-grid", c: "#fff"    },
          { v: d.si_score,                                    l: "Stability / 10",c: d.si_color },
          { v: `${d.sol_coverage_pct}%`,                      l: "Solar coverage",c: "#FF9F0A" },
        ].map(m => (
          <div key={m.l} className="rounded-[16px] border text-center py-3 px-2"
            style={{ background: "var(--glass)", borderColor: "var(--gb)" }}>
            <div className="font-mono text-[24px] font-bold leading-none mb-1" style={{ color: m.c }}>{m.v}</div>
            <div className="text-[11px] tracking-[.8px] uppercase" style={{ color: "var(--l3)" }}>{m.l}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Card>
          <CardLabel>24-Hour Power Profile</CardLabel>
          <div className="flex gap-4 mb-2">
            <Legend color="#FF9F0A" label="Solar" />
            <Legend color="#0A84FF" label="Load" />
          </div>
          <PowerChart solHourly={d.sol_hourly} loadHourly={d.load_hourly} height={175} />
        </Card>
        <Card>
          <CardLabel>Battery SOC Curve</CardLabel>
          <SocChart socHourly={d.soc_hourly} height={175} />
        </Card>
      </div>

      {/* What-If sliders + Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardLabel>What-If Simulator</CardLabel>

          <WiSlider label="Solar intensity"         display={`${solarIntensity}%`}
            min={0}   max={100} step={1}  value={solarIntensity}
            onChange={v => { setSolarIntensity(v); wiUpd({ solarIntensity: v }); }} />

          <WiSlider label="Load factor"            display={`${loadFactor}%`}
            min={40}  max={200} step={1}  value={loadFactor}
            onChange={v => { setLoadFactor(v);     wiUpd({ loadFactor: v }); }} />

          <WiSlider label="Solar output (kWh/day)" display={`${solarKwh.toFixed(1)} kWh`}
            min={0}   max={20}  step={0.5} value={solarKwh}
            onChange={v => { setSolarKwh(v);       wiUpd({ solarKwh: v }); }} />

          <WiSlider label="Battery capacity (kWh)" display={`${batCap} kWh`}
            min={5}   max={200} step={5}  value={batCap}
            onChange={v => { setBatCap(v);         wiUpd({ batCap: v }); }} />

          <WiSlider label="Starting SOC"           display={`${startSoc}%`}
            min={10}  max={100} step={1}  value={startSoc}
            onChange={v => { setStartSoc(v);       wiUpd({ startSoc: v }); }} />

          <WiSlider label="Temperature (°C)"       display={`${tempC}°C`}
            min={-30} max={55}  step={1}  value={tempC}
            onChange={v => { setTempC(v);          wiUpd({ tempC: v }); }} last />
        </Card>

        {/* Breakdown */}
        <Card>
          <CardLabel>Appliance Breakdown (Top 8)</CardLabel>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {[
                  { h: "Appliance", align: "left"  },
                  { h: "Eff W",     align: "right" },
                  { h: "kWh/d",     align: "right" },
                  { h: "Share",     align: "left"  },
                ].map(col => (
                  <th key={col.h}
                    className="text-[11px] tracking-[1.2px] uppercase font-medium border-b"
                    style={{ borderColor: "var(--sep)", color: "var(--l3)", textAlign: col.align, padding: "8px 10px" }}>
                    {col.h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.breakdown.slice(0, 8).map((a, i) => (
                <tr key={i} className="border-b" style={{ borderColor: "rgba(255,255,255,.04)" }}>
                  <td className="py-2 px-2.5 text-[14px]">{a.icon} {a.name}</td>
                  <td className="font-mono text-[13px] text-right px-2.5" style={{ color: a.clr }}>{Math.round(a.effective_watts)}</td>
                  <td className="font-mono text-[13px] text-right px-2.5">{a.daily_kwh}</td>
                  <td className="px-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,.06)" }}>
                        <div className="h-full rounded-full" style={{ width: `${Math.min(a.share_pct, 100)}%`, background: a.clr }} />
                      </div>
                      <span className="font-mono text-[11px] min-w-[28px] text-right" style={{ color: "var(--l3)" }}>{a.share_pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

function WiSlider({ label, display, min, max, step, value, onChange, last }) {
  return (
    <div className={last ? "" : "mb-3.5"}>
      <div className="flex justify-between text-[13px] mb-1">
        <span style={{ color: "var(--l2)" }}>{label}</span>
        <span className="font-mono font-semibold" style={{ color: "#0A84FF" }}>{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(step % 1 !== 0 ? parseFloat(e.target.value) : parseInt(e.target.value))}
      />
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-[2px]" style={{ background: color }} />
      <span className="text-[12px]" style={{ color: "var(--l2)" }}>{label}</span>
    </div>
  );
}
