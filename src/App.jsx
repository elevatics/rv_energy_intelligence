import { useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import StatusBar from "./components/StatusBar";
import Navbar    from "./components/Navbar";
import Toast     from "./components/Toast";
import Dashboard  from "./pages/Dashboard";
import Appliances from "./pages/Appliances";
import Simulate   from "./pages/Simulate";
import Docs       from "./pages/Docs";
import Settings   from "./pages/Settings";
import { useWeather } from "./hooks/useWeather";

function Inner() {
  const { activePage, simulate, loadAppliances } = useApp();
  useWeather();

  useEffect(() => {
    (async () => {
      const apps = await loadAppliances();
      await simulate({}, apps);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <StatusBar />
      <Navbar />
      <main className="max-w-[1440px] mx-auto px-5 py-5">
        {activePage === "dash" && <Dashboard />}
        {activePage === "apps" && <Appliances />}
        {activePage === "sim"  && <Simulate />}
        {activePage === "docs" && <Docs />}
        {activePage === "set"  && <Settings />}
      </main>
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Inner />
    </AppProvider>
  );
}
