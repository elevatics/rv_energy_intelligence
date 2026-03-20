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
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[900] px-4 py-3 rounded-xl text-[13px] font-medium shadow-xl backdrop-blur-xl border transition-all duration-300"
      style={{ background: "rgba(44,44,46,.95)", borderColor: c.border, color: c.color }}
    >
      {toast.msg}
    </div>
  );
}
