
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Clock, MapPin, Thermometer } from "lucide-react";
import { getTimeInZone, getDateInZone, getDayProgress, getSkyGradient, getProgressBarColor } from "../utils/timeUtils";

interface TimeZoneData {
  zone: string;
  time: string;
  date: string;
  progress: number;
}

const WidgetPage = () => {
  const [params] = useSearchParams();
  const theme = params.get("theme") || "light";
  const format = params.get("format") || "12";
  const zones = params.get("zones")?.split(",").filter(Boolean) || [];
  const weather = params.get("weather") === "true";
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeZoneData, setTimeZoneData] = useState<TimeZoneData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isDarkMode = theme === "dark";
  const is24Hour = format === "24";

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate time zone data
  useEffect(() => {
    if (zones.length === 0) {
      setIsLoading(false);
      return;
    }

    // Simulate loading delay for shimmer effect
    setTimeout(() => {
      const data = zones.map(zone => ({
        zone,
        time: getTimeInZone(currentTime, zone, is24Hour),
        date: getDateInZone(currentTime, zone),
        progress: getDayProgress(currentTime, zone)
      }));
      
      setTimeZoneData(data);
      setIsLoading(false);
    }, 1000);
  }, [currentTime, zones, is24Hour]);

  const formatZoneName = (zone: string) => {
    return zone.replace(/_/g, ' ').split('/').pop() || zone;
  };

  if (zones.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
        <div className="text-center">
          <Clock className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
          <h1 className="text-2xl font-semibold mb-2">No Time Zones Selected</h1>
          <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Please specify time zones in the URL parameters to display the widget.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 md:p-6 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className={`h-8 w-8 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
            <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              World Time Widget
            </h1>
          </div>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Displaying {zones.length} time zone{zones.length !== 1 ? 's' : ''} • {is24Hour ? '24' : '12'}-hour format
          </p>
        </div>

        {/* Time Zone Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            // Loading Shimmer
            zones.map((zone, index) => (
              <div key={index} className={`rounded-xl overflow-hidden shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                {/* Sky Background Shimmer */}
                <div className="h-20 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse" />
                
                {/* Content Shimmer */}
                <div className="p-4 space-y-3">
                  <div className={`h-8 rounded animate-pulse ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                  <div className={`h-5 w-3/4 rounded animate-pulse ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                  <div className={`h-4 w-1/2 rounded animate-pulse ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                  <div className={`h-2 rounded animate-pulse ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                </div>
              </div>
            ))
          ) : (
            // Actual Time Zone Cards
            timeZoneData.map((data, index) => (
              <div key={data.zone} className={`rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                {/* Sky Background */}
                <div className={`h-20 relative ${getSkyGradient(currentTime, data.zone, isDarkMode)}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white/80" />
                  </div>
                </div>
                
                {/* Time Content */}
                <div className="p-4 space-y-3">
                  {/* Time Display */}
                  <div>
                    <div className={`text-2xl font-bold font-mono ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      {data.time}
                    </div>
                    <div className={`text-lg font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {formatZoneName(data.zone)}
                    </div>
                  </div>

                  {/* Date */}
                  <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {data.date}
                  </div>

                  {/* Weather Placeholder */}
                  {weather && (
                    <div className={`flex items-center gap-2 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <Thermometer className="h-4 w-4" />
                      <span>Weather info coming soon</span>
                    </div>
                  )}

                  {/* Day Progress Bar */}
                  <div className="space-y-1">
                    <div className={`flex justify-between text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                      <span>Day Progress</span>
                      <span>{Math.round(data.progress)}%</span>
                    </div>
                    <div className={`w-full h-2 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${getProgressBarColor(currentTime, data.zone, isDarkMode)}`}
                        style={{ width: `${data.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pb-6">
          <p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
            Last updated: {currentTime.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WidgetPage;
