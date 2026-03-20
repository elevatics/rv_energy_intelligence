import { useState } from "react";
import { Card } from "../components/Card";

const NAV = [
  { id: "si",     label: "⚡ Stability Score", badge: "0–10",   badgeColor: "rgba(255,69,58,.15)",    badgeText: "#FF453A" },
  { id: "elec",   label: "🔌 Electrical Model", badge: "V·A·PF", badgeColor: "rgba(10,132,255,.15)",   badgeText: "#0A84FF" },
  { id: "solar",  label: "☀️ Solar Engine",    badge: "kWh",    badgeColor: "rgba(255,159,10,.15)",   badgeText: "#FF9F0A" },
  { id: "bat",    label: "🔋 Battery Model",   badge: "LiFePO4",badgeColor: "rgba(48,209,88,.15)",    badgeText: "#30D158" },
  { id: "sched",  label: "🕐 Schedules",       badge: "9 types",badgeColor: "rgba(90,200,245,.15)",   badgeText: "#5AC8F5" },
  { id: "wx",     label: "🌤 Weather",         badge: "Live",   badgeColor: "rgba(191,90,242,.15)",   badgeText: "#BF5AF2" },
  { id: "grades", label: "🏅 Grade Reference", badge: "",       badgeColor: "",                       badgeText: "" },
];

export default function Docs() {
  const [active, setActive] = useState("si");

  return (
    <div>
      {/* Hero */}
      <div className="rounded-2xl border p-6 sm:p-7 mb-6"
        style={{ background: "linear-gradient(135deg,rgba(10,132,255,.12),rgba(48,209,88,.08))", borderColor: "rgba(10,132,255,.2)" }}>
        <div className="text-xl sm:text-2xl font-bold mb-3">
          📖 How RV Energy Intelligence Works
        </div>
        <div className="text-[16px] leading-relaxed max-w-[680px]" style={{ color: "var(--l2)" }}>
          Every number on the dashboard is calculated from first principles — electrical engineering, battery chemistry,
          and solar physics. This page explains every formula, every constant, and what each score means for your trip.
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr] items-start">
        {/* Left nav — dropdown on mobile, sticky sidebar on desktop */}
        <div>
          {/* Mobile: select dropdown */}
          <div className="lg:hidden mb-1">
            <select
              value={active}
              onChange={e => setActive(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-[12px] text-[14px] outline-none"
              style={{ background: "var(--glass)", border: "1px solid var(--gb)", color: "var(--l1)", fontFamily: "inherit", cursor: "pointer" }}
            >
              {NAV.map(n => (
                <option key={n.id} value={n.id}>{n.label}{n.badge ? ` · ${n.badge}` : ""}</option>
              ))}
            </select>
          </div>
          {/* Desktop: sidebar */}
          <div className="hidden lg:block rounded-xl border p-2 lg:sticky lg:top-[72px]"
            style={{ background: "var(--glass)", borderColor: "var(--gb)", boxShadow: "0 2px 8px rgba(0,0,0,.4)" }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => setActive(n.id)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-[12px] text-[14px] text-left border-none transition-all"
                style={{
                  background: active === n.id ? "rgba(10,132,255,.12)" : "transparent",
                  color: active === n.id ? "#0A84FF" : "var(--l2)",
                  fontWeight: active === n.id ? 500 : 400,
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                {n.label}
                {n.badge && (
                  <span className="ml-auto text-[11px] px-1.5 py-0.5 rounded-full font-mono"
                    style={{ background: n.badgeColor, color: n.badgeText }}>
                    {n.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 min-w-0">
          {active === "si"     && <StabilitySection />}
          {active === "elec"   && <ElecSection />}
          {active === "solar"  && <SolarSection />}
          {active === "bat"    && <BatterySection />}
          {active === "sched"  && <SchedSection />}
          {active === "wx"     && <WeatherSection />}
          {active === "grades" && <GradesSection />}
        </div>
      </div>
    </div>
  );
}

/* ── Shared helpers ── */
function DocSection({ children }) {
  return (
    <div className="rounded-[22px] border p-4 sm:p-6 min-w-0 overflow-hidden" style={{ background: "var(--glass)", borderColor: "var(--gb)", boxShadow: "0 2px 8px rgba(0,0,0,.4)" }}>
      {children}
    </div>
  );
}
function SecTitle({ children }) {
  return <div className="text-[19px] font-semibold mb-1.5 flex items-center gap-2.5">{children}</div>;
}
function SecSub({ children }) {
  return <div className="text-[14px] leading-relaxed mb-4" style={{ color: "var(--l2)" }}>{children}</div>;
}
function FormulaBox({ children }) {
  return (
    <div className="rounded-[12px] border my-3 overflow-x-auto"
      style={{ background: "rgba(255,255,255,.04)", borderColor: "rgba(255,255,255,.08)", color: "#5AC8F5" }}>
      <pre className="font-mono text-[13px] leading-loose p-4" style={{ margin: 0, whiteSpace: "pre", minWidth: "max-content" }}>{children}</pre>
    </div>
  );
}
function PillarCard({ cls, color, bg, children }) {
  return (
    <div className="rounded-[16px] p-4 mb-2.5" style={{ background: bg, borderLeft: `3px solid ${color}` }}>
      {children}
    </div>
  );
}
function PTitle({ children }) {
  return <div className="text-[15px] font-semibold mb-1 flex items-center gap-2">{children}</div>;
}
function PBody({ children }) {
  return <div className="text-[14px] leading-relaxed" style={{ color: "var(--l2)" }}>{children}</div>;
}
function ElecRow({ label, desc }) {
  return (
    <div className="flex flex-col sm:grid mb-2" style={{ gridTemplateColumns: "clamp(120px,32%,180px) 1fr" }}>
      <div className="font-mono text-[13px] px-3 py-2 sm:rounded-l-[8px] sm:rounded-r-none rounded-t-[8px] border sm:border-r-0"
        style={{ color: "#5AC8F5", background: "rgba(255,255,255,.03)", borderColor: "var(--sep)" }}>
        {label}
      </div>
      <div className="text-[13px] px-3 py-2 sm:rounded-r-[8px] sm:rounded-l-none rounded-b-[8px] border sm:border-t border-t-0 leading-relaxed"
        style={{ color: "var(--l2)", background: "rgba(255,255,255,.02)", borderColor: "var(--sep)" }}>
        {desc}
      </div>
    </div>
  );
}

/* ── Section components ── */
function StabilitySection() {
  return (
    <DocSection>
      <SecTitle>⚡ Stability Score — 0 to 10</SecTitle>
      <SecSub>A single composite number that answers "How healthy is my energy system right now?" Higher is always better. 0 = system failure. 10 = fully self-sufficient off-grid paradise.</SecSub>
      <FormulaBox>{`Stability Score = Pillar₁ + Pillar₂ + Pillar₃ + Pillar₄

  Pillar₁  Energy Autonomy        0 – 3.5 pts   weight 35%
  Pillar₂  Solar Self-Sufficiency  0 – 3.0 pts   weight 30%
  Pillar₃  Peak Safety Margin     0 – 2.0 pts   weight 20%
  Pillar₄  Battery Reserve Floor   0 – 1.5 pts   weight 15%
  ──────────────────────────────────────────────────────────
  Total                            0 – 10.0 pts`}</FormulaBox>

      <PillarCard color="#0A84FF" bg="rgba(10,132,255,.07)">
        <PTitle><span className="font-mono text-[#0A84FF]">[P1]</span> Energy Autonomy — max 3.5 pts</PTitle>
        <PBody>
          <strong>Question:</strong> How many days can you survive without any external power?<br /><br />
          <code className="font-mono text-[13px]" style={{ color: "#5AC8F5" }}>P1 = min(3.5, (days_off_grid / 14) × 3.5)</code><br /><br />
          The reference benchmark is <strong>14 days</strong> — the gold standard for serious boondocking (BLM land, US Southwest).
          At 14 days you earn the full 3.5 points. At 7 days you earn 1.75. At 2 days you earn 0.5.
        </PBody>
      </PillarCard>

      <PillarCard color="#FF9F0A" bg="rgba(255,159,10,.07)">
        <PTitle><span className="font-mono text-[#FF9F0A]">[P2]</span> Solar Self-Sufficiency — max 3.0 pts</PTitle>
        <PBody>
          <strong>Question:</strong> Is the sun covering your daily energy needs?<br /><br />
          <code className="font-mono text-[13px]" style={{ color: "#5AC8F5" }}>P2 = min(3.0, solar_coverage_ratio × 3.0)</code><br /><br />
          100% solar means zero net battery drain. At 60% you earn 1.8 pts. At 20% you earn 0.6 pts.
          Real-time cloud cover from Open-Meteo reduces this score.
        </PBody>
      </PillarCard>

      <PillarCard color="#30D158" bg="rgba(48,209,88,.07)">
        <PTitle><span className="font-mono text-[#30D158]">[P3]</span> Peak Safety Margin — max 2.0 pts</PTitle>
        <PBody>
          <strong>Question:</strong> Am I about to trip my inverter?<br /><br />
          <code className="font-mono text-[13px]" style={{ color: "#5AC8F5" }}>P3 = min(2.0, max(0, (1 − peak_kW / 5.0)) × 2.0)</code><br /><br />
          Reference inverter limit is <strong>5 kW</strong> (Victron/Renogy/Giandel class). At 2.5 kW peak you earn 1.0 pt.
          Running stove + AC + water heater simultaneously is a common cause of P3 = 0.
        </PBody>
      </PillarCard>

      <PillarCard color="#5AC8F5" bg="rgba(90,200,245,.07)">
        <PTitle><span className="font-mono text-[#5AC8F5]">[P4]</span> Battery Reserve Floor — max 1.5 pts</PTitle>
        <PBody>
          <strong>Question:</strong> Does the battery stay above the safe minimum all day?<br /><br />
          <code className="font-mono text-[13px]" style={{ color: "#5AC8F5" }}>P4 = min(1.5, max(0, (min_SOC% − 20%) / 80%) × 1.5)</code><br /><br />
          LiFePO4 cells suffer irreversible damage below <strong>20% SOC</strong>. The simulation tracks SOC at every 30-second step to find the true minimum.
        </PBody>
      </PillarCard>

      <PillarCard color="#FF453A" bg="rgba(255,69,58,.07)">
        <PTitle><span className="font-mono text-[#FF453A]">⚠ GRADE F — What does it mean?</span></PTitle>
        <PBody>
          Grade F (Score &lt; 5.0) means <strong>the system cannot sustain itself</strong>. At least one catastrophic condition exists:<br /><br />
          <strong>1.</strong> Imminent battery depletion — days &lt; ~2.4 → P1 &lt; 0.6<br />
          <strong>2.</strong> Solar blackout — coverage &lt; ~33% → P2 &lt; 1.0<br />
          <strong>3.</strong> Inverter overload risk — peak_kW &gt; ~2.5 → P3 &lt; 1.0<br />
          <strong>4.</strong> Reserve violation — min_SOC &lt; ~53% → P4 &lt; 0.49
        </PBody>
      </PillarCard>
    </DocSection>
  );
}

function ElecSection() {
  return (
    <DocSection>
      <SecTitle>🔌 Electrical Model</SecTitle>
      <SecSub>Every appliance draws power through a three-stage chain: apparent → real → effective (battery load). Each stage has a real-world loss.</SecSub>
      <FormulaBox>{`Stage 1 — Apparent power (what flows through the wire)
apparent_VA = voltage_V × current_A

Stage 2 — Real power (actual work done, after reactive losses)
real_W = apparent_VA × power_factor

Stage 3 — Effective power (what the battery must supply)
effective_W = real_W / (efficiency_pct / 100)

Stage 4 — Daily energy (duty cycle + active hours)
daily_kWh = (effective_W / 1000) × (duty_cycle_pct / 100) × hrs`}</FormulaBox>
      <ElecRow label="voltage_V" desc="Supply voltage. Common RV values: 12V (DC accessories), 48V (Starlink), 120V (standard AC), 240V (large appliances)." />
      <ElecRow label="current_A" desc="Rated current draw in amperes from the appliance nameplate." />
      <ElecRow label="power_factor" desc="Ratio of real to apparent power (cos φ). Resistive loads = 1.0. Motors = 0.85–0.95. Switching PSUs = 0.90–0.97." />
      <ElecRow label="efficiency_pct" desc="Combined inverter + device efficiency. A 90% efficient device at 1100W actually draws 1222W from the battery." />
      <ElecRow label="duty_cycle_pct" desc="Fraction of time the heating element or motor is ON within its active window. Refrigerator compressor ≈ 25%. AC eco ≈ 70%." />
      <ElecRow label="hrs_per_day" desc="Total daily window during which the appliance can be active. Combined with duty cycle, defines total energy consumed." />
    </DocSection>
  );
}

function SolarSection() {
  return (
    <DocSection>
      <SecTitle>☀️ Solar Generation Engine</SecTitle>
      <SecSub>Solar power follows a sine-arch curve during daylight hours. The engine scales this curve so its integral exactly matches your target daily kWh, then applies real-time weather corrections.</SecSub>
      <FormulaBox>{`1. Irradiance shape (normalised 0–1)
solar_curve(h) = sin(π × (h − 6) / 14)   for 6 ≤ h ≤ 20, else 0

Peak at h = 13:00 (solar noon). 14-hour window = typical mid-latitude day.

2. Normalisation integral (energy accuracy guarantee)
integral = Σ solar_curve(s × DT_H) × DT_H   [for s in 0..2879]
≈ 4.46 h  (independent of step resolution)

3. Per-step solar power (kW)
solar_kW(step) = daily_target_kWh × solar_curve(h) / integral

4. Daily target with corrections
daily_target = panel_kWh × weather_factor × scenario_factor × irr_factor
irr_factor   = 1 − (cloud_pct / 100) × 0.92 + 0.05  (from Open-Meteo)`}</FormulaBox>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
        {[
          { w: "sunny", f: "1.00", c: "#FFD60A" },
          { w: "partly", f: "0.60", c: "#FF9F0A" },
          { w: "overcast", f: "0.25", c: "#636366" },
          { w: "rainy", f: "0.05", c: "#5E9EFF" },
        ].map(r => (
          <div key={r.w} className="text-center p-3 rounded-[12px] border" style={{ background: "rgba(255,255,255,.03)", borderColor: "var(--sep)" }}>
            <div className="font-mono text-[20px] font-bold mb-1" style={{ color: r.c }}>{r.f}×</div>
            <div className="text-[12px] capitalize" style={{ color: "var(--l2)" }}>{r.w}</div>
          </div>
        ))}
      </div>
    </DocSection>
  );
}

function BatterySection() {
  return (
    <DocSection>
      <SecTitle>🔋 Battery Model (LiFePO4)</SecTitle>
      <SecSub>LiFePO4 (lithium iron phosphate) chemistry is the dominant RV battery technology. Its capacity decreases at low temperatures and must not be discharged below 20%.</SecSub>
      <FormulaBox>{`Temperature derating bands:
  temp < 0°C   → × 0.70   (30% loss — severe cold)
  temp < 10°C  → × 0.85   (15% loss — cold)
  temp < 20°C  → × 0.95   ( 5% loss — cool)
  temp ≥ 20°C  → × 1.00   (no loss  — nominal)

Usable capacity:
  max_kWh = nominal_kWh × 0.95 × temp_factor
  (0.95 = LiFePO4 safe operating range — protects cells at both ends)

Per-step state update:
  kwh_new = clamp(kwh + (solar_kW − load_kW) × DT_H, 0, max_kWh)

Days off-grid:
  days = (start_SOC × usable_kWh) / net_battery_draw_per_day`}</FormulaBox>
    </DocSection>
  );
}

function SchedSection() {
  const scheds = [
    { name: "24h",     desc: "Always 1.0 — constant background loads (router, Starlink, cameras)" },
    { name: "cycle",   desc: "Compressor cycling: 3.5× for 22/90 steps, then 0.06 standby. Models refrigerator startup spike." },
    { name: "meal",    desc: "1.0 at three windows: 07:15, 12:30, 18:30 (8-min each). Models stove and microwave." },
    { name: "burst",   desc: "1.0 for 10 steps (~5 min) every 300 steps (2.5 h). Models water heater maintenance cycle." },
    { name: "morning", desc: "0.6 from 06:00–09:00. Models coffee machine and morning routine." },
    { name: "evening", desc: "0.92 from 18:00–23:00. Models TV, music system." },
    { name: "lights",  desc: "0.9 from 18:00–23:00, 0.08 rest of day (pilot light / indicator LEDs)." },
    { name: "day",     desc: "0.70 × occupancy_factor from 10:00–20:00, 0.08 idle. Models AC with occupancy scaling." },
    { name: "once",    desc: "Single run starting at 03:00 local time; duration = hrs × 120 steps. Models washer, dryer, air fryer." },
  ];
  return (
    <DocSection>
      <SecTitle>🕐 Load Schedules — 9 Types</SecTitle>
      <SecSub>The simulation runs 2880 steps at 30-second resolution. Each appliance has a schedule that determines when it draws power. This catches sub-hour events invisible to hourly models.</SecSub>
      {/* Mobile cards */}
      <div className="sm:hidden flex flex-col gap-2 mt-3">
        {scheds.map(s => (
          <div key={s.name} className="rounded-[12px] border px-3.5 py-3" style={{ background: "rgba(255,255,255,.03)", borderColor: "var(--sep)" }}>
            <div className="font-mono text-[13px] font-semibold mb-1" style={{ color: "#0A84FF" }}>{s.name}</div>
            <div className="text-[13px] leading-relaxed" style={{ color: "var(--l2)" }}>{s.desc}</div>
          </div>
        ))}
      </div>
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
        <thead>
          <tr>
            {["Schedule", "Description"].map(h => (
              <th key={h} className="text-left pb-2 text-[11px] tracking-[1.5px] uppercase font-medium border-b px-3"
                style={{ borderColor: "var(--sep)", color: "var(--l3)", padding: "8px 12px" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {scheds.map(s => (
            <tr key={s.name} className="border-b" style={{ borderColor: "rgba(255,255,255,.04)" }}>
              <td className="font-mono text-[13px] px-3 py-2" style={{ color: "#0A84FF", whiteSpace: "nowrap" }}>{s.name}</td>
              <td className="text-[14px] px-3 py-2" style={{ color: "var(--l2)" }}>{s.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </DocSection>
  );
}

function WeatherSection() {
  return (
    <DocSection>
      <SecTitle>🌤 Weather Integration — Open-Meteo</SecTitle>
      <SecSub>The dashboard fetches live weather from Open-Meteo (free, no API key needed) using your browser's GPS. Weather adjusts the irradiance factor, which scales solar output in real-time.</SecSub>
      <FormulaBox>{`Data flow:
  1. Browser requests GPS location (navigator.geolocation)
  2. Fetch Open-Meteo API → temperature, cloud_cover, wind_speed, weather_code
  3. Compute irradiance factor:
       irr_factor = 1 − (cloud_pct / 100) × 0.92 + 0.05
       (range: 0.05 at 100% cloud → 1.05 at clear sky)
  4. POST /api/weather  → logged to weather_readings table
  5. Re-run simulation with new irr_factor + temperature_c
  
Open-Meteo endpoint:
  https://api.open-meteo.com/v1/forecast?
    latitude={lat}&longitude={lon}
    &current=temperature_2m,cloud_cover,wind_speed_10m,weather_code
    &wind_speed_unit=kmh`}</FormulaBox>
    </DocSection>
  );
}

function GradesSection() {
  const grades = [
    { g: "S", score: "9.0 – 10.0", label: "Exceptional", desc: "Fully solar. 14+ days. Zero concerns.", c: "#30D158" },
    { g: "A", score: "8.0 – 8.9",  label: "Excellent",   desc: "Strong solar. 10+ days. Very healthy.", c: "#34C759" },
    { g: "B", score: "7.0 – 7.9",  label: "Good",        desc: "Moderate solar. 7+ days. Safe.", c: "#5AC8F5" },
    { g: "C", score: "6.0 – 6.9",  label: "Fair",        desc: "Partial solar. 4–7 days. Monitor.", c: "#0A84FF" },
    { g: "D", score: "5.0 – 5.9",  label: "Poor",        desc: "<40% solar. 2–4 days. Act soon.", c: "#FF9F0A" },
    { g: "F", score: "< 5.0",      label: "Critical",    desc: "System cannot sustain itself. Immediate action.", c: "#FF453A" },
  ];
  return (
    <DocSection>
      <SecTitle>🏅 Grade Reference</SecTitle>
      <SecSub>The stability score maps to a letter grade. Each grade represents a distinct operational state with specific recommendations.</SecSub>
      {/* Mobile cards */}
      <div className="sm:hidden flex flex-col gap-2 mt-3">
        {grades.map(r => (
          <div key={r.g} className="flex items-start gap-3 rounded-[14px] border px-4 py-3" style={{ background: "rgba(255,255,255,.03)", borderColor: "var(--sep)", borderLeft: `3px solid ${r.c}` }}>
            <div className="font-mono text-[16px] font-bold w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0"
              style={{ color: r.c, background: `${r.c}22` }}>{r.g}</div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-[14px]" style={{ color: r.c }}>{r.label}</span>
                <span className="font-mono text-[12px]" style={{ color: "var(--l3)" }}>{r.score}</span>
              </div>
              <div className="text-[13px] mt-0.5" style={{ color: "var(--l2)" }}>{r.desc}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
        <thead>
          <tr>
            {["Grade", "Score", "Label", "What it means"].map(h => (
              <th key={h} className="text-left text-[11px] tracking-[1.5px] uppercase font-medium border-b px-3"
                style={{ borderColor: "var(--sep)", color: "var(--l3)", padding: "8px 12px" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grades.map(r => (
            <tr key={r.g} className="border-b" style={{ borderColor: "rgba(255,255,255,.04)" }}>
              <td style={{ padding: "10px 12px" }}>
                <div className="font-mono text-[16px] font-bold w-8 h-8 rounded-[8px] flex items-center justify-center"
                  style={{ color: r.c, background: `${r.c}22` }}>{r.g}</div>
              </td>
              <td className="font-mono text-[14px] px-3" style={{ padding: "10px 12px", color: "var(--l2)", whiteSpace: "nowrap" }}>{r.score}</td>
              <td className="text-[14px] font-semibold px-3" style={{ padding: "10px 12px", color: r.c, whiteSpace: "nowrap" }}>{r.label}</td>
              <td className="text-[14px] px-3" style={{ padding: "10px 12px", color: "var(--l2)" }}>{r.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </DocSection>
  );
}
