export function Card({ children, className = "", padding = "p-5", style = {} }) {
  return (
    <div
      className={`rounded-[22px] border backdrop-blur-[20px] shadow-[0_4px_24px_rgba(0,0,0,.55),0_1px_3px_rgba(0,0,0,.4)] ${padding} ${className}`}
      style={{ background: "var(--glass)", borderColor: "var(--gb)", ...style }}
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
