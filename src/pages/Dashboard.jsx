import { useApp } from "../context/AppContext";
import { Card, CardLabel } from "../components/Card";
import StabilityGauge, { PillarBars } from "../components/StabilityGauge";
import { PowerChart, SocChart, NetChart } from "../components/Charts";

export default function Dashboard() {
  const { simData } = useApp();
  const d = simData;
  if (!d) return <div className="p-10 text-center" style={{ color: "var(--l3)" }}>Loading…</div>;

  const socColor = d.soc_pct > 50 ? "#30D158" : d.soc_pct > 20 ? "#FF9F0A" : "#FF453A";
  const daysColor = d.days_off_grid > 3 ? "#30D158" : d.days_off_grid > 1 ? "#FF9F0A" : "#FF453A";
  const netColor  = d.net_now >= 0 ? "#30D158" : "#FF453A";

  return (
    <div>
      {/* ── Hero row: Battery | Gauge | Autonomy ── */}
      <div className="grid gap-4 sm:gap-5 mb-5 items-stretch grid-cols-1 lg:grid-cols-3">

        {/* Left: Battery + Real-time — stretch to fill row height */}
        <div className="flex flex-col gap-3 h-full">
          <Card className="flex-1">
            <CardLabel>State of Charge</CardLabel>
            <div className="text-[11px] tracking-[.5px] mb-1" style={{ color: "var(--l3)" }}>kWh remaining</div>
            <div className="font-mono text-[28px] font-bold leading-none mb-2" style={{ color: socColor }}>{d.soc_kwh}</div>
            <div className="h-[7px] rounded-full overflow-hidden my-2" style={{ background: "rgba(255,255,255,.06)" }}>
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${d.soc_pct}%`, background: socColor }} />
            </div>
            <div className="flex justify-between text-[12px]" style={{ color: "var(--l3)" }}>
              <span>0 kWh</span>
              <span>{d.soc_pct}%</span>
              <span>{d.bat_cap} kWh</span>
            </div>
            <div className="mt-2.5 text-[13px]" style={{ color: "var(--l2)" }}>⏱ {d.tte}</div>
          </Card>

          <Card className="flex-1">
            <CardLabel>Real-time Power</CardLabel>
            <div className="text-[11px] mb-1" style={{ color: "var(--l3)" }}>solar generation</div>
            <div className="font-mono text-[30px] font-bold leading-none mb-2.5" style={{ color: "#FF9F0A" }}>{d.sol_now} kW</div>
            <div className="pt-2.5 border-t flex flex-col gap-1.5" style={{ borderColor: "var(--sep)" }}>
              <div className="flex justify-between text-[15px]">
                <span style={{ color: "var(--l3)" }}>Load</span>
                <span className="font-mono font-semibold" style={{ color: "#0A84FF" }}>{d.ld_now} kW</span>
              </div>
              <div className="flex justify-between text-[15px]">
                <span style={{ color: "var(--l3)" }}>Net</span>
                <span className="font-mono font-semibold" style={{ color: netColor }}>
                  {d.net_now >= 0 ? "+" : ""}{d.net_now} kW
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Center: Stability Gauge — full height */}
        <div className="flex flex-col h-full">
          <div className="flex flex-col items-center rounded-[22px] border px-5 pt-6 pb-5 h-full shadow-[0_4px_24px_rgba(0,0,0,.55)]"
            style={{ background: "var(--glass)", borderColor: "var(--gb)" }}>
            <CardLabel>Stability Score (0 – 10)</CardLabel>
            <StabilityGauge score={d.si_score} grade={d.si_grade} label={d.si_label} color={d.si_color} scoreColor={d.si_color} />
            <PillarBars pillars={d.si_pillars} />
            {d.si_grade === "F" && (
              <div className="mt-3 px-3.5 py-2.5 rounded-[12px] text-[15px] text-center leading-relaxed"
                style={{ background: "rgba(255,69,58,.1)", border: "1px solid rgba(255,69,58,.3)", color: "#FF453A" }}>
                <strong>⚠ Grade F — System cannot sustain itself.</strong><br />
                Connect shore power or shed load immediately.
              </div>
            )}
          </div>
        </div>

        {/* Right: Autonomy + Analytics — stretch to fill row height */}
        <div className="flex flex-col gap-3 h-full">
          <Card className="flex-1">
            <CardLabel>Off-Grid Autonomy</CardLabel>
            <div className="text-[13px] mb-1" style={{ color: "var(--l3)" }}>days remaining</div>
            <div className="font-mono text-[30px] font-bold leading-none mb-3" style={{ color: daysColor }}>
              {d.days_off_grid > 99 ? "∞" : d.days_off_grid}
            </div>
            <div className="flex justify-between mt-3">
              {[
                { v: d.total_sol_kwh,          l: "SOLAR kWh", c: "#FF9F0A" },
                { v: d.total_load_kwh,         l: "LOAD kWh",  c: "#0A84FF" },
                { v: `${d.sol_coverage_pct}%`, l: "COVERED",   c: "#5AC8F5" },
              ].map((item, i) => (
                <div key={i} className="flex-1 text-center" style={{ borderLeft: i > 0 ? "1px solid var(--sep)" : "none" }}>
                  <div className="font-mono text-[18px] font-bold" style={{ color: item.c }}>{item.v}</div>
                  <div className="text-[13px] mt-0.5" style={{ color: "var(--l3)" }}>{item.l}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="flex-1">
            <CardLabel>Battery Analytics</CardLabel>
            <div className="flex flex-col gap-2">
              {[
                { l: "Temp capacity factor",        v: `${Math.round(d.bat_temp_factor * 100)}%`, c: "#5AC8F5"    },
                { l: `Min SOC (@ ${d.min_soc_h}:00)`, v: `${d.min_soc}%`,                        c: "var(--l2)"  },
                { l: "Peak load",                   v: `${d.peak_load_kw} kW`,                    c: "var(--l2)"  },
                { l: "Net battery draw",            v: `${d.bat_draw_kwh} kWh`,                   c: "var(--l2)"  },
                { l: "Ambient temperature",         v: `${d.temperature_c}°C`,                    c: "var(--l2)"  },
              ].map(item => (
                <div key={item.l} className="flex justify-between gap-2 text-[14px]">
                  <span className="truncate" style={{ color: "var(--l3)" }}>{item.l}</span>
                  <span className="font-mono font-semibold flex-shrink-0" style={{ color: item.c }}>{item.v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Weather Strip ── */}
      <WeatherStrip />

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5">
        {[
          { u: "kW", v: d.sol_now, l: "Solar now", c: "#FF9F0A" },
          { u: "kW", v: d.ld_now, l: "Load now", c: "#0A84FF" },
          { u: "net kW", v: `${d.net_now >= 0 ? "+" : ""}${d.net_now}`, l: d.net_now >= 0 ? "Charging" : "Drawing", c: netColor },
          { u: "/ 10", v: d.si_score, l: "Stability Score", c: d.si_color },
        ].map(m => (
          <div key={m.l} className="relative overflow-hidden text-center rounded-[16px] border py-4 shadow-[0_2px_8px_rgba(0,0,0,.4)]"
            style={{ background: "var(--glass)", borderColor: "var(--gb)" }}>
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,.1),transparent)" }} />
            <div className="text-[13px] tracking-[.4px] mb-0.5" style={{ color: "var(--l3)" }}>{m.u}</div>
            <div className="font-mono text-[28px] font-bold leading-none mb-0.5" style={{ color: m.c }}>{m.v}</div>
            <div className="text-[13px] tracking-[.8px] uppercase" style={{ color: "var(--l3)" }}>{m.l}</div>
          </div>
        ))}
      </div>

      {/* ── Charts + Sidebar ── */}
      <div className="grid gap-4 sm:gap-5 items-stretch lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-3 min-w-0">
          <Card>
            <CardLabel>24-Hour Power Profile</CardLabel>
            <div className="flex gap-4 mb-2.5">
              <Legend color="#FF9F0A" label="Solar" />
              <Legend color="#0A84FF" label="Load" />
            </div>
            <PowerChart solHourly={d.sol_hourly} loadHourly={d.load_hourly} height={165} />
          </Card>
          <Card>
            <CardLabel>Battery SOC Prediction (24h)</CardLabel>
            <SocChart socHourly={d.soc_hourly} height={195} />
          </Card>
          <Card>
            <CardLabel>Net Power Balance · Solar − Load</CardLabel>
            <NetChart netHourly={d.net_hourly} height={195} />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-3 min-w-0" style={{ alignSelf: "stretch" }}>
          <Card padding="p-4">
            <CardLabel>System Alerts</CardLabel>
            {d.alerts.map((a, i) => (
              <AlertItem key={i} sev={a.sev} msg={a.msg} />
            ))}
          </Card>
          <Card padding="p-4">
            <CardLabel>Optimization Recommendations</CardLabel>
            {d.tips.map((t, i) => (
              <div key={i} className="flex items-center gap-2 py-2 border-b last:border-b-0"
                style={{ borderColor: "rgba(255,255,255,.05)" }}>
                <span className="font-mono text-[14px] font-semibold min-w-[52px]" style={{ color: "#30D158" }}>{t.gain}</span>
                <span className="text-[15px]" style={{ color: "var(--l2)" }}>{t.msg}</span>
              </div>
            ))}
          </Card>
          <Card padding="p-3" className="flex-1" style={{ flex: 1 }}>
            <CardLabel>Active Config</CardLabel>
            <div className="flex flex-col gap-1.5 text-[15px]">
              {[
                { l: "Scenario",   v: d.scenario },
                { l: "Weather",    v: d.weather },
                { l: "Occupants",  v: d.occupants },
                { l: "Experience", v: d.experience },
                { l: "Sim timing", v: `${d.ms}ms` },
              ].map(item => (
                <div key={item.l} className="flex justify-between gap-2 text-[14px]">
                  <span style={{ color: "var(--l3)" }}>{item.l}</span>
                  <span className="font-mono capitalize flex-shrink-0">{item.v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function WeatherStrip() {
  const { weather } = useApp();

  const stats = [
    { ico: "🌡", v: weather ? `${weather.temp_c?.toFixed(1)}°C`     : "—°C",    l: "Temperature" },
    { ico: "☁️", v: weather ? `${weather.cloud_pct?.toFixed(0)}%`   : "—%",     l: "Cloud Cover" },
    { ico: "💨", v: weather ? `${weather.wind_kmh?.toFixed(0)} km/h` : "— km/h", l: "Wind Speed"  },
    { ico: "☀️", v: weather ? `${weather.irr_factor?.toFixed(2)}×`  : "—×",     l: "Irr. Factor" },
  ];

  return (
    <div
      className="relative overflow-hidden rounded-[20px] border mb-5 shadow-[0_4px_24px_rgba(0,0,0,.5)]"
      style={{ background: "var(--glass)", borderColor: "var(--gb)" }}
    >
      {/* subtle top-edge glow */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(255,159,10,.25),rgba(90,200,245,.2),transparent)" }} />

      <div className="flex flex-col lg:flex-row items-stretch">

        {/* ── Left: condition hero ── */}
        <div className="flex items-center gap-5 px-6 py-5 lg:min-w-[280px]">
          <div className="relative flex-shrink-0">
            <span className="text-[72px] leading-none drop-shadow-[0_0_18px_rgba(255,159,10,.35)]">
              {weather?.wx_icon || "🌤️"}
            </span>
            {weather && (
              <span className="absolute -bottom-0.5 -right-1 w-3.5 h-3.5 rounded-full bg-[#30D158] border-2 border-[#0A0C10]" />
            )}
          </div>
          <div>
            <div className="text-[22px] font-semibold leading-tight">
              {weather ? (weather.wx || weather.wx_label || "—") : "Locating…"}
            </div>
            <div className="flex items-center gap-1 mt-1" style={{ color: "var(--l3)" }}>
              <span className="text-[13px]">📍</span>
              <span className="text-[14px] font-medium">{weather?.city || "Waiting for location"}</span>
            </div>
            {weather && (
              <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium tracking-wide"
                style={{ background: "rgba(48,209,88,.12)", color: "#30D158", border: "1px solid rgba(48,209,88,.2)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#30D158] animate-pulse inline-block" />
                LIVE
              </div>
            )}
          </div>
        </div>

        {/* ── Vertical divider ── */}
        <div className="hidden lg:block w-px self-stretch my-4"
          style={{ background: "var(--sep)" }} />
        <div className="block lg:hidden h-px mx-6"
          style={{ background: "var(--sep)" }} />

        {/* ── Right: stats grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px flex-1"
          style={{ background: "var(--sep)" }}>
          {stats.map((s, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-4"
              style={{ background: "var(--glass)" }}>
              <span className="text-[28px] flex-shrink-0 leading-none">{s.ico}</span>
              <div>
                <div className="font-mono text-[20px] font-bold leading-none">{s.v}</div>
                <div className="text-[11px] tracking-[.8px] uppercase mt-1" style={{ color: "var(--l3)" }}>{s.l}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AlertItem({ sev, msg }) {
  const styles = {
    info:     { bg: "rgba(10,132,255,.08)", border: "rgba(10,132,255,.2)", color: "#5AC8F5", dot: "#0A84FF" },
    warning:  { bg: "rgba(255,159,10,.08)", border: "rgba(255,159,10,.25)", color: "#FF9F0A", dot: "#FF9F0A" },
    critical: { bg: "rgba(255,69,58,.08)",  border: "rgba(255,69,58,.25)",  color: "#FF453A", dot: "#FF453A" },
  };
  const s = styles[sev] || styles.info;
  return (
    <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-[12px] mb-2 text-[14px] leading-relaxed border min-w-0"
      style={{ background: s.bg, borderColor: s.border, color: s.color }}>
      <span className="break-words min-w-0">{msg}</span>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-[2px]" style={{ background: color }} />
      <span className="text-[14px]" style={{ color: "var(--l2)" }}>{label}</span>
    </div>
  );
}
