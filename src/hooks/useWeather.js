import { useEffect } from "react";
import { useApp } from "../context/AppContext";
import { fetchWeather } from "../api";

export function useWeather() {
  const { updateWeather } = useApp();

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude: lat, longitude: lon } = coords;
        try {
          const data = await fetchWeather(lat, lon);
          await updateWeather({
            lat,
            lon,
            temp_c:       data.temp_c,
            cloud_pct:    data.cloud_pct,
            wind_kmh:     data.wind_kmh,
            weather_code: data.weather_code,
            wx:           data.wx,
            wx_icon:      data.icon,
            wx_label:     data.lbl,
            irr_factor:   data.irr_factor,
            city:         data.city,
          });
        } catch { /* GPS/network failed — use defaults */ }
      },
      () => { /* permission denied — silent */ }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
