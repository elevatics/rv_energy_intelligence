import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";

export default function StatusBar() {
  const { simData, weather } = useApp();
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(d.toTimeString().slice(0, 8));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="h-10 flex items-center gap-3 px-4 sm:px-6 text-[12px] font-mono border-b overflow-hidden"
      style={{ background: "var(--card)", borderColor: "var(--sep)", color: "var(--l3)" }}
    >
      <span className="hidden sm:inline truncate">ELEVATICS RV ENERGY INTELLIGENCE</span>
      <div className="hidden sm:block w-px h-3 flex-shrink-0" style={{ background: "var(--sep)" }} />
      <span className="hidden sm:inline flex-shrink-0">Sim:{simData ? `${simData.ms}ms` : "v2.1 ready"}</span>
      <div className="hidden sm:block w-px h-3 flex-shrink-0" style={{ background: "var(--sep)" }} />
      <span className="flex-shrink-0">{clock}</span>
      <div className="w-px h-3 flex-shrink-0" style={{ background: "var(--sep)" }} />
      <span
        className="px-2 py-0.5 rounded-full text-[11px] tracking-[.5px] border flex-shrink-0"
        style={
          weather
            ? { borderColor: "rgba(48,209,88,.35)", color: "#30D158" }
            : { borderColor: "var(--sep)", color: "var(--l3)" }
        }
      >
        {weather ? `● ${weather.wx_label || "LIVE"}` : "● LOCATING"}
      </span>
    </div>
  );
}
