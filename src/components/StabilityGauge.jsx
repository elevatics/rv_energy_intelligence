import { useEffect, useRef } from "react";

const R = 100, CX = 130, CY = 130;
const START_ANGLE = Math.PI * 0.75;
const END_ANGLE   = Math.PI * 2.25;
const ARC_LEN     = END_ANGLE - START_ANGLE;

function polarToXY(angle, r = R) {
  return {
    x: CX + r * Math.cos(angle),
    y: CY + r * Math.sin(angle),
  };
}

function arcPath(startA, endA, r = R) {
  const s = polarToXY(startA, r);
  const e = polarToXY(endA, r);
  const large = endA - startA > Math.PI ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

export default function StabilityGauge({ score = 0, grade = "F", label = "Critical", color = "#FF453A", scoreColor }) {
  const fillRef  = useRef(null);
  const numRef   = useRef(null);
  const gradeRef = useRef(null);

  useEffect(() => {
    if (!fillRef.current) return;
    const ratio = Math.min(score / 10, 1);
    const endA  = START_ANGLE + ARC_LEN * ratio;
    fillRef.current.setAttribute("d", arcPath(START_ANGLE, endA));
    fillRef.current.setAttribute("stroke", color);
    if (numRef.current) {
      numRef.current.textContent = score;
      numRef.current.setAttribute("fill", scoreColor || color);
    }
    if (gradeRef.current) gradeRef.current.textContent = `Grade ${grade} — ${label}`;
  }, [score, grade, label, color, scoreColor]);

  const bgPath = arcPath(START_ANGLE, END_ANGLE);

  const pillars = [
    { key: "p1", label: "Autonomy / 3.5", color: "#0A84FF" },
    { key: "p2", label: "Solar / 3.0",    color: "#FF9F0A" },
    { key: "p3", label: "Safety / 2.0",   color: "#30D158" },
    { key: "p4", label: "Reserve / 1.5",  color: "#5AC8F5" },
  ];

  return (
    <div
      className="flex flex-col items-center rounded-[22px] border px-5 py-6 shadow-[0_4px_24px_rgba(0,0,0,.55)] min-w-[280px]"
      style={{ background: "var(--glass)", borderColor: "var(--gb)" }}
    >
      <div className="text-[12px] font-medium tracking-[1.5px] uppercase mb-2.5" style={{ color: "var(--l3)" }}>
        Stability Score (0 – 10)
      </div>
      <svg viewBox="0 0 260 220" width="260" height="220" style={{ overflow: "visible" }}>
        {/* Background track */}
        <path d={bgPath} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="14" strokeLinecap="round" />
        {/* Fill arc */}
        <path ref={fillRef} d={arcPath(START_ANGLE, START_ANGLE)} fill="none" strokeWidth="14" strokeLinecap="round"
          style={{ transition: "d 1s cubic-bezier(.34,1.56,.64,1)" }} />
        {/* Score number */}
        <text ref={numRef} x="130" y="128" textAnchor="middle" dominantBaseline="middle"
          fontFamily="Plus Jakarta Sans,sans-serif" fontSize="50" fontWeight="700" fill="#fff">
          {score}
        </text>
        {/* Grade label */}
        <text ref={gradeRef} x="130" y="158" textAnchor="middle" dominantBaseline="middle"
          fontFamily="Plus Jakarta Sans,sans-serif" fontSize="15" fontWeight="500" fill="rgba(235,235,245,.55)">
          Grade {grade} — {label}
        </text>
        {/* 0 / 10 labels */}
        <text x="32"  y="196" textAnchor="middle" fill="rgba(235,235,245,.3)" fontFamily="JetBrains Mono,monospace" fontSize="12">0</text>
        <text x="228" y="196" textAnchor="middle" fill="rgba(235,235,245,.3)" fontFamily="JetBrains Mono,monospace" fontSize="12">10</text>
      </svg>
    </div>
  );
}

export function PillarBars({ pillars }) {
  if (!pillars) return null;
  const items = [
    { key: "p1", label: "Autonomy / 3.5", max: 3.5, color: "#0A84FF" },
    { key: "p2", label: "Solar / 3.0",    max: 3.0, color: "#FF9F0A" },
    { key: "p3", label: "Safety / 2.0",   max: 2.0, color: "#30D158" },
    { key: "p4", label: "Reserve / 1.5",  max: 1.5, color: "#5AC8F5" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 mt-3.5 w-full">
      {items.map(item => (
        <div key={item.key} className="rounded-[10px] p-2.5 text-center" style={{ background: "rgba(255,255,255,.04)" }}>
          <div className="font-mono text-[17px] font-bold leading-none mb-0.5" style={{ color: item.color }}>
            {pillars[item.key]}
          </div>
          <div className="text-[10px] tracking-[.8px] uppercase mb-1.5" style={{ color: "var(--l3)" }}>{item.label}</div>
          <div className="h-[3px] rounded-[2px] overflow-hidden" style={{ background: "rgba(255,255,255,.06)" }}>
            <div
              className="h-full rounded-[2px] transition-all duration-1000"
              style={{ width: `${Math.min((pillars[item.key] / item.max) * 100, 100)}%`, background: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
