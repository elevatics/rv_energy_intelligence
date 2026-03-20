export function Card({ children, className = "", padding = "p-5", style = {} }) {
  return (
    <div
      className={`rounded-2xl border backdrop-blur-xl shadow-lg min-w-0 overflow-hidden ${padding} ${className}`}
      style={{ background: "var(--glass)", borderColor: "var(--gb)", ...style }}
    >
      {children}
    </div>
  );
}

export function CardLabel({ children }) {
  return (
    <div className="text-[11px] font-medium tracking-widest uppercase mb-4"
      style={{ color: "var(--l3)" }}>
      {children}
    </div>
  );
}
