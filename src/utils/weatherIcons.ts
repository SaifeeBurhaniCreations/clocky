import { Sun, CloudSun, CloudRain, CloudFog, Snowflake, LucideIcon } from "lucide-react";

type WeatherIconResult = {
  Icon: LucideIcon;
  color: string;
};

export const getWeatherIcons = (desc: string): WeatherIconResult => {
  const d = desc?.toLowerCase();

  if (d?.includes("clear")) return { Icon: Sun, color: "#facc15" };         // yellow
  if (d?.includes("cloudy")) return { Icon: CloudSun, color: "#60a5fa" };   // blue
  if (d?.includes("rain")) return { Icon: CloudRain, color: "#3b82f6" };    // darker blue
  if (d?.includes("mist") || d?.includes("fog")) return { Icon: CloudFog, color: "#9ca3af" }; // gray
  if (d?.includes("snow")) return { Icon: Snowflake, color: "#bae6fd" };    // light blue

  return { Icon: CloudSun, color: "#60a5fa" }; // fallback
};
