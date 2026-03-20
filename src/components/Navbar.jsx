import { useApp } from "../context/AppContext";

const PAGES = [
  { id: "dash", label: "Dashboard" },
  { id: "apps", label: "Appliances" },
  { id: "sim",  label: "Simulate" },
  { id: "docs", label: "How It Works" },
  { id: "set",  label: "Settings" },
];

export default function Navbar() {
  const { activePage, setActivePage, simData, weather } = useApp();

  return (
    <nav
      className="sticky top-0 z-[200] h-[52px] border-b"
      style={{ background: "rgba(0,0,0,.8)", backdropFilter: "blur(30px) saturate(180%)", borderColor: "var(--sep)" }}
    >
      <div className="max-w-[1440px] mx-auto h-full px-5 flex items-center justify-between gap-5">
        {/* Brand */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center"
            style={{ background: "linear-gradient(150deg,#FF9F0A 0%,#30D158 100%)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <div>
            <div className="text-[15px] font-semibold tracking-[.5px]">Elevatics</div>
            <div className="text-[11px] tracking-[1px]" style={{ color: "var(--l3)" }}>RV ENERGY INTELLIGENCE</div>
          </div>
        </div>

        {/* Nav pills */}
        <div className="flex gap-0.5 rounded-full p-[3px]" style={{ background: "rgba(255,255,255,.05)" }}>
          {PAGES.map(p => (
            <button
              key={p.id}
              onClick={() => setActivePage(p.id)}
              className="px-4 py-[5px] rounded-full text-[14px] font-medium cursor-pointer border-none transition-all duration-200 whitespace-nowrap"
              style={{
                fontFamily: "inherit",
                background: activePage === p.id ? "rgba(255,255,255,.12)" : "transparent",
                color: activePage === p.id ? "#fff" : "var(--l2)",
                fontWeight: activePage === p.id ? 600 : 500,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Right: weather + battery */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
            style={{ background: "var(--glass)", borderColor: "var(--gb)" }}>
            <span className="text-sm">{weather?.wx_icon || "—"}</span>
            <div>
              <div className="font-mono text-[12px] font-bold">{weather ? `${weather.temp_c?.toFixed(1)}°` : "—°"}</div>
              <div className="text-[9px] max-w-[80px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: "var(--l3)" }}>
                {weather?.city || "Locating…"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
            style={{ background: "var(--glass)", borderColor: "var(--gb)" }}>
            <div>
              <div className="font-mono text-[13px] font-bold">{simData ? `${simData.soc_pct}%` : "—"}</div>
              <div className="text-[9px]" style={{ color: "var(--l3)" }}>BATTERY</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
