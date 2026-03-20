import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Filler, Tooltip, Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Filler, Tooltip, Legend,
);

const HOURS = Array.from({ length: 24 }, (_, i) => `${i}:00`);

const baseOpts = (yLabel = "") => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 600 },
  plugins: { legend: { display: false }, tooltip: {
    backgroundColor: "rgba(28,28,30,.95)",
    titleColor: "rgba(235,235,245,.6)",
    bodyColor: "#fff",
    borderColor: "rgba(255,255,255,.1)",
    borderWidth: 1,
    padding: 10,
    cornerRadius: 10,
  }},
  scales: {
    x: {
      ticks: { color: "rgba(235,235,245,.3)", font: { size: 9, family: "SF Mono,Menlo,monospace" }, maxRotation: 0, maxTicksLimit: 8 },
      grid: { color: "rgba(255,255,255,.04)" },
    },
    y: {
      ticks: { color: "rgba(235,235,245,.3)", font: { size: 9, family: "SF Mono,Menlo,monospace" } },
      grid: { color: "rgba(255,255,255,.04)" },
      title: yLabel ? { display: true, text: yLabel, color: "rgba(235,235,245,.3)", font: { size: 9 } } : undefined,
    },
  },
});

export function PowerChart({ solHourly = [], loadHourly = [], height = 165 }) {
  const data = {
    labels: HOURS,
    datasets: [
      {
        label: "Solar kW",
        data: solHourly,
        borderColor: "#FF9F0A",
        backgroundColor: "rgba(255,159,10,.12)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: "Load kW",
        data: loadHourly,
        borderColor: "#0A84FF",
        backgroundColor: "rgba(10,132,255,.08)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  };
  return (
    <div style={{ height }}>
      <Line data={data} options={baseOpts("kW")} />
    </div>
  );
}

export function SocChart({ socHourly = [], height = 115 }) {
  const data = {
    labels: HOURS,
    datasets: [{
      label: "SOC %",
      data: socHourly,
      borderColor: "#30D158",
      backgroundColor: "rgba(48,209,88,.1)",
      fill: true,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 0,
    }],
  };
  return (
    <div style={{ height }}>
      <Line data={data} options={{ ...baseOpts("%"), scales: { ...baseOpts("%").scales, y: { ...baseOpts("%").scales.y, min: 0, max: 100 } } }} />
    </div>
  );
}

export function NetChart({ netHourly = [], height = 95 }) {
  const data = {
    labels: HOURS,
    datasets: [{
      label: "Net kW",
      data: netHourly,
      backgroundColor: netHourly.map(v => v >= 0 ? "rgba(48,209,88,.5)" : "rgba(255,69,58,.5)"),
      borderColor:     netHourly.map(v => v >= 0 ? "#30D158" : "#FF453A"),
      borderWidth: 1,
    }],
  };
  return (
    <div style={{ height }}>
      <Bar data={data} options={baseOpts("kW")} />
    </div>
  );
}
