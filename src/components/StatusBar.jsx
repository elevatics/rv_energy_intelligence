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
      className="h-10 flex items-center gap-4 px-4 sm:px-6 text-[12px] font-mono border-b"
      style={{ background: "var(--card)", borderColor: "var(--sep)", color: "var(--l3)" }}
    >
      {/* <div className="w-[5px] h-[5px] rounded-full bg-green breathe flex-shrink-0" /> */}
      <span>ELEVATICS RV ENERGY INTELLIGENCE</span>
      <div className="w-px h-3 flex-shrink-0" style={{ background: "var(--sep)" }} />
      <span>Sim:{simData ? `${simData.ms}ms` : "v2.1 ready"}</span>
      <div className="w-px h-3 flex-shrink-0" style={{ background: "var(--sep)" }} />
      <span>{clock}</span>
      <div className="w-px h-3 flex-shrink-0" style={{ background: "var(--sep)" }} />
      <span
        className="px-2 py-0.5 rounded-full text-[11px] tracking-[.5px] border"
        style={
          weather
            ? { borderColor: "rgba(48,209,88,.35)", color: "#30D158" }
            : { borderColor: "var(--sep)", color: "var(--l3)" }
        }
      >
        {weather ? `● ${weather.wx_label || "LIVE"}` : "● ACQUIRING LOCATION"}
      </span>
    </div>
  );
}
