// src/pages/WidgetPage.tsx
import React from "react";
import { useSearchParams } from "react-router-dom";

const WidgetPage = () => {
  const [params] = useSearchParams();
  const theme = params.get("theme") || "light";
  const format = params.get("format") || "12";
  const zones = params.get("zones")?.split(",") || [];
  const weather = params.get("weather") === "true";

  return (
    <div className={`min-h-screen p-6 ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
      <h1 className="text-xl font-bold mb-4">World Time Widget</h1>
      {zones.length === 0 ? (
        <p>No time zones selected.</p>
      ) : (
        <ul className="space-y-2">
          {zones.map((zone) => (
            <li key={zone}>
              Time in <strong>{zone}</strong>: {/* Insert time logic */}
            </li>
          ))}
        </ul>
      )}
      {weather && <p className="mt-4 italic">Weather feature enabled (not implemented).</p>}
    </div>
  );
};

export default WidgetPage;
