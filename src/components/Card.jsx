export function Card({ children, className = "", padding = "p-5", style = {} }) {
  return (
    <div
      className={`rounded-[22px] border backdrop-blur-[40px] shadow-[0_8px_32px_rgba(0,0,0,.6),0_1px_0_rgba(255,255,255,.08)_inset] ${padding} ${className}`}
      style={{ background: "var(--glass)", borderColor: "var(--gb)", boxShadow: "0 8px 32px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.08)", ...style }}
    >
      {children}
    </div>
  );
}

export function CardLabel({ children }) {
  return (
    <div className="text-[12px] font-medium tracking-[1.5px] uppercase mb-3.5"
      style={{ color: "var(--l3)" }}>
      {children}
    </div>
  );
}
