import { useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  function navigate(id) {
    setActivePage(id);
    setMenuOpen(false);
  }

  return (
    <>
      <nav
        className="sticky top-0 z-[200] h-14 border-b"
        style={{ background: "rgba(10,12,16,.92)", backdropFilter: "blur(20px)", borderColor: "var(--sep)" }}
      >
        <div className="max-w-[1440px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center"
              style={{ background: "linear-gradient(150deg,#FF9F0A 0%,#30D158 100%)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <div>
              <div className="text-[15px] font-semibold tracking-tight">Elevatics</div>
              <div className="text-[11px] tracking-wider opacity-75 hidden sm:block">RV ENERGY INTELLIGENCE</div>
            </div>
          </div>

          {/* Nav pills — hidden on mobile */}
          <div className="hidden md:flex gap-0.5 rounded-full p-1 overflow-x-auto" style={{ background: "rgba(255,255,255,.04)" }}>
            {PAGES.map(p => (
              <button
                key={p.id}
                onClick={() => navigate(p.id)}
                className="px-4 py-2 rounded-full text-[13px] font-medium cursor-pointer border-none transition-all duration-200 whitespace-nowrap"
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

          {/* Right: weather + battery (hidden on mobile) + hamburger */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
              style={{ background: "var(--glass)", borderColor: "var(--gb)" }}>
              <span className="text-sm">{weather?.wx_icon || "—"}</span>
              <div>
                <div className="font-mono text-[12px] font-bold">{weather ? `${weather.temp_c?.toFixed(1)}°` : "—°"}</div>
                <div className="text-[9px] max-w-[80px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: "var(--l3)" }}>
                  {weather?.city || "Locating…"}
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border"
              style={{ background: "var(--glass)", borderColor: "var(--gb)" }}>
              <div>
                <div className="font-mono text-[13px] font-bold">{simData ? `${simData.soc_pct}%` : "—"}</div>
                <div className="text-[9px]" style={{ color: "var(--l3)" }}>BATTERY</div>
              </div>
            </div>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-[10px] gap-[5px] border-none"
              style={{ background: "rgba(255,255,255,.08)", cursor: "pointer" }}
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
            >
              <span className="block w-4 h-[2px] rounded-full transition-all" style={{ background: menuOpen ? "#0A84FF" : "var(--l2)", transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none" }} />
              <span className="block w-4 h-[2px] rounded-full transition-all" style={{ background: menuOpen ? "#0A84FF" : "var(--l2)", opacity: menuOpen ? 0 : 1 }} />
              <span className="block w-4 h-[2px] rounded-full transition-all" style={{ background: menuOpen ? "#0A84FF" : "var(--l2)", transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none" }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-[190]"
          style={{ background: "rgba(0,0,0,.5)" }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute top-14 left-0 right-0 border-b py-2"
            style={{ background: "rgba(10,12,16,.97)", borderColor: "var(--sep)" }}
            onClick={e => e.stopPropagation()}
          >
            {PAGES.map(p => (
              <button
                key={p.id}
                onClick={() => navigate(p.id)}
                className="w-full text-left px-5 py-3.5 text-[15px] border-none transition-colors"
                style={{
                  fontFamily: "inherit",
                  background: activePage === p.id ? "rgba(10,132,255,.1)" : "transparent",
                  color: activePage === p.id ? "#0A84FF" : "var(--l1)",
                  fontWeight: activePage === p.id ? 600 : 400,
                  cursor: "pointer",
                  borderLeft: activePage === p.id ? "3px solid #0A84FF" : "3px solid transparent",
                }}
              >
                {p.label}
              </button>
            ))}
            {/* Mini weather/battery strip in drawer */}
            <div className="flex items-center gap-3 px-5 py-3 border-t mt-1" style={{ borderColor: "var(--sep)" }}>
              <span className="text-sm">{weather?.wx_icon || "—"}</span>
              <span className="font-mono text-[13px]">{weather ? `${weather.temp_c?.toFixed(1)}°C` : "—°C"}</span>
              <span className="text-[12px]" style={{ color: "var(--l3)" }}>{weather?.city || "Locating…"}</span>
              <div className="ml-auto font-mono text-[13px] font-bold">{simData ? `${simData.soc_pct}%` : "—"} <span className="text-[10px] font-normal" style={{ color: "var(--l3)" }}>BAT</span></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
