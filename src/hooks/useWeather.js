import { useEffect } from "react";
import { useApp } from "../context/AppContext";

export function useWeather() {
  const { updateWeather } = useApp();

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude: lat, longitude: lon } = coords;
        try {
          const url =
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
            `&current=temperature_2m,cloud_cover,wind_speed_10m,weather_code&wind_speed_unit=kmh`;
          const r   = await fetch(url);
          const j   = await r.json();
          const c   = j.current;

          const cloud   = c.cloud_cover   ?? 0;
          const temp    = c.temperature_2m ?? 22;
          const wind    = c.wind_speed_10m ?? 0;
          const code    = c.weather_code  ?? 0;
          const irr     = Math.max(0, Math.min(1.05, 1 - (cloud / 100) * 0.92 + 0.05));

          const { label, icon } = wxLabelIcon(code, cloud);

          // Reverse-geocode city name
          let city = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
          try {
            const geo = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );
            const gj  = await geo.json();
            city = gj.address?.city || gj.address?.town || gj.address?.village || city;
          } catch { /* best-effort */ }

          await updateWeather({
            lat, lon, city,
            temp_c:       temp,
            cloud_pct:    cloud,
            wind_kmh:     wind,
            weather_code: code,
            irr_factor:   irr,
            wx_label:     label,
            wx_icon:      icon,
          });
        } catch { /* GPS/network failed — use defaults */ }
      },
      () => { /* permission denied — silent */ }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function wxLabelIcon(code, cloud) {
  if (code >= 95)                return { label: "Thunderstorm",   icon: "⛈️" };
  if (code >= 80)                return { label: "Rain showers",   icon: "🌦️" };
  if (code >= 61)                return { label: "Rainy",          icon: "🌧️" };
  if (code >= 51)                return { label: "Drizzle",        icon: "🌦️" };
  if (code >= 71)                return { label: "Snow",           icon: "🌨️" };
  if (code === 45 || code === 48)return { label: "Foggy",          icon: "🌫️" };
  if (cloud > 80)                return { label: "Overcast",       icon: "☁️" };
  if (cloud > 50)                return { label: "Mostly cloudy",  icon: "🌥️" };
  if (cloud > 20)                return { label: "Partly cloudy",  icon: "🌤️" };
  return                                { label: "Sunny",          icon: "☀️" };
}
