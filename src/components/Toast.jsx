import { useApp } from "../context/AppContext";

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  const colors = {
    success: { border: "rgba(48,209,88,.3)", color: "#30D158" },
    error:   { border: "rgba(255,69,58,.3)",  color: "#FF453A" },
    default: { border: "rgba(255,255,255,.12)", color: "#fff" },
  };
  const c = colors[toast.type] || colors.default;
  return (
    <div
      className="fixed bottom-6 right-6 z-[900] px-5 py-3 rounded-[12px] text-[12px] font-medium shadow-[0_4px_24px_rgba(0,0,0,.55)] backdrop-blur-[20px] border transition-all duration-300"
      style={{ background: "rgba(44,44,46,.95)", borderColor: c.border, color: c.color }}
    >
      {toast.msg}
    </div>
  );
}
