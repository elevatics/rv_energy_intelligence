export default function PowerFlowSVG({ solNow = 0, ldNow = 0, netNow = 0, socPct = 0 }) {
  const charging = netNow >= 0;
  const batColor = socPct > 50 ? "#30D158" : socPct > 20 ? "#FF9F0A" : "#FF453A";

  return (
    <svg viewBox="0 0 340 160" width="100%" className="block overflow-visible">
      {/* Solar → Center */}
      <circle cx="50" cy="80" r="28" fill="rgba(255,159,10,.12)" stroke="#FF9F0A" strokeWidth="1.5" className="halo" />
      <text x="50" y="75" textAnchor="middle" fontSize="18">☀️</text>
      <text x="50" y="100" textAnchor="middle" fontSize="9" fill="#FF9F0A" fontFamily="SF Mono,Menlo,monospace" fontWeight="700">{solNow.toFixed(2)}kW</text>

      {/* Load */}
      <circle cx="290" cy="80" r="28" fill="rgba(10,132,255,.12)" stroke="#0A84FF" strokeWidth="1.5" className="halo" />
      <text x="290" y="75" textAnchor="middle" fontSize="18">🔌</text>
      <text x="290" y="100" textAnchor="middle" fontSize="9" fill="#0A84FF" fontFamily="SF Mono,Menlo,monospace" fontWeight="700">{ldNow.toFixed(2)}kW</text>

      {/* Battery */}
      <circle cx="170" cy="80" r="34" fill="rgba(48,209,88,.08)" stroke={batColor} strokeWidth="2" className="halo" />
      <text x="170" y="73" textAnchor="middle" fontSize="20">🔋</text>
      <text x="170" y="98" textAnchor="middle" fontSize="11" fill={batColor} fontFamily="SF Mono,Menlo,monospace" fontWeight="700">{socPct}%</text>

      {/* Solar → Battery line */}
      {solNow > 0 && (
        <line x1="78" y1="80" x2="136" y2="80" stroke="#FF9F0A" strokeWidth="2" className="flow" />
      )}
      {solNow <= 0 && (
        <line x1="78" y1="80" x2="136" y2="80" stroke="rgba(255,255,255,.1)" strokeWidth="1.5" strokeDasharray="4 4" />
      )}

      {/* Battery → Load line */}
      {ldNow > 0 ? (
        <line x1="204" y1="80" x2="262" y2="80" stroke="#0A84FF" strokeWidth="2" className="flow" />
      ) : (
        <line x1="204" y1="80" x2="262" y2="80" stroke="rgba(255,255,255,.1)" strokeWidth="1.5" strokeDasharray="4 4" />
      )}

      {/* Net label */}
      <rect x="130" y="120" width="80" height="24" rx="12" fill={charging ? "rgba(48,209,88,.12)" : "rgba(255,69,58,.12)"} stroke={charging ? "rgba(48,209,88,.3)" : "rgba(255,69,58,.3)"} strokeWidth="1" />
      <text x="170" y="136" textAnchor="middle" fontSize="10" fill={charging ? "#30D158" : "#FF453A"} fontFamily="SF Mono,Menlo,monospace" fontWeight="600">
        {charging ? "+" : ""}{netNow.toFixed(2)} kW
      </text>
    </svg>
  );
}
