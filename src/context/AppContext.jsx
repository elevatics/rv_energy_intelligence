import React, { createContext, useContext, useState, useCallback } from "react";
import { runSimulation, fetchAppliances, logWeather } from "../api";

const AppContext = createContext(null);

export const DEFAULT_SIM = {
  battery_capacity_kwh: 45,
  starting_soc: 0.87,
  solar_output_kwh: 2.0,
  weather: "sunny",
  scenario: "expected",
  occupants: 2,
  experience: "normal",
  load_factor: 1.0,
  temperature_c: 22.0,
  irradiance_factor: 1.0,
};

export function AppProvider({ children }) {
  const [simData, setSimData] = useState(null);
  const [appliances, setAppliances] = useState([]);
  const [simConfig, setSimConfig] = useState(DEFAULT_SIM);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [weather, setWeather] = useState(null);
  const [activePage, setActivePage] = useState("dash");

  const showToast = useCallback((msg, type = "default") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const loadAppliances = useCallback(async () => {
    try {
      const data = await fetchAppliances();
      setAppliances(data);
      return data;
    } catch {
      showToast("Failed to load appliances", "error");
      return [];
    }
  }, [showToast]);

  const simulate = useCallback(async (overrides = {}, apps = null) => {
    setLoading(true);
    try {
      const cfg = { ...simConfig, ...overrides };
      const result = await runSimulation(cfg);
      setSimData(result);
      setSimConfig(cfg);
      if (apps !== null) setAppliances(apps);
      return result;
    } catch (e) {
      showToast("Simulation failed: " + e.message, "error");
    } finally {
      setLoading(false);
    }
  }, [simConfig, showToast]);

  const updateWeather = useCallback(async (wx) => {
    setWeather(wx);
    try { await logWeather(wx); } catch { /* best-effort */ }
    const irr = wx.irr_factor ?? 1.0;
    const temp = wx.temp_c ?? simConfig.temperature_c;
    let w = "sunny";
    if ((wx.cloud_pct ?? 0) > 80) w = "overcast";
    else if ((wx.cloud_pct ?? 0) > 50) w = "partly";
    await simulate({ irradiance_factor: irr, temperature_c: temp, weather: w });
  }, [simConfig, simulate]);

  return (
    <AppContext.Provider value={{
      simData, setSimData,
      appliances, setAppliances,
      simConfig, setSimConfig,
      loading, setLoading,
      toast, showToast,
      weather, setWeather, updateWeather,
      activePage, setActivePage,
      loadAppliances, simulate,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
