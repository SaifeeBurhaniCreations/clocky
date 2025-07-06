import React, { useState, useEffect } from 'react';
import TimeZoneSearch from '../components/TimeZoneSearch';
import TimeZoneCard from '../components/TimeZoneCard';
import TimeZoneConverter from '../components/TimeZoneConverter';
import SettingsPanel from '../components/SettingsPanel';
import WorldMap from '../components/WorldMap';
import { TIMEZONE_SUGGESTIONS } from '../data/timezones';
import TimeTravelSlider from '../components/TimeTravelSlider';
import NotificationManager from '../components/NotificationManager';
import InteractiveGlobe from '../components/InteractiveGlobe';
import { useOfflineSupport } from '../hooks/useOfflineSupport';

interface Location {
  name: string;
  timeZone: string;
  customName?: string;
  isFavorite?: boolean;
}

const Index = () => {
  const [locations, setLocations] = useState<Location[]>([
    { name: 'Mumbai', timeZone: 'Asia/Kolkata' },
    { name: 'New York', timeZone: 'America/New_York' },
    { name: 'London', timeZone: 'Europe/London' },
    { name: 'Tokyo', timeZone: 'Asia/Tokyo' },
  ]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showWeather, setShowWeather] = useState(true);
  const [showConverter, setShowConverter] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showTimeTravel, setShowTimeTravel] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showGlobe, setShowGlobe] = useState(false);
  
  const { isOnline, cacheTimes, getCachedTime } = useOfflineSupport();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Cache times when online
  useEffect(() => {
    if (isOnline) {
      cacheTimes(locations);
    }
  }, [locations, isOnline, cacheTimes]);

  const handleAddLocation = (location: string) => {
    const cityData = TIMEZONE_SUGGESTIONS.find(item => item.city === location);
    if (cityData) {
      setLocations([...locations, { 
        name: location, 
        timeZone: cityData.timezone 
      }]);
    }
  };

  const handleDeleteLocation = (index: number) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newLocations = [...locations];
      [newLocations[index - 1], newLocations[index]] = [newLocations[index], newLocations[index - 1]];
      setLocations(newLocations);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < locations.length - 1) {
      const newLocations = [...locations];
      [newLocations[index], newLocations[index + 1]] = [newLocations[index + 1], newLocations[index]];
      setLocations(newLocations);
    }
  };

  const handleRenameLocation = (index: number, newName: string) => {
    const newLocations = [...locations];
    newLocations[index].customName = newName;
    setLocations(newLocations);
  };

  const handleToggleFavorite = (index: number) => {
    const newLocations = [...locations];
    newLocations[index].isFavorite = !newLocations[index].isFavorite;
    setLocations(newLocations);
  };

  return (
    <div className={`min-h-screen p-8 pt-12 transition-colors ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white'}`}>
      <div className="mx-auto">
        <h1 className="text-2xl font-medium text-center mb-1">WORLD TIME WINDOWS</h1>
        <p className="text-sm text-gray-600 text-center mb-8">made by <a href="https://x.com/sb_creations" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">@sb_creations</a></p>
        
        {/* Offline indicator */}
        {!isOnline && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg text-center">
            📱 You're offline. Showing cached times.
          </div>
        )}
        
        <SettingsPanel
          is24Hour={is24Hour}
          onToggle24Hour={setIs24Hour}
          isDarkMode={isDarkMode}  
          onToggleDarkMode={setIsDarkMode}
          showWeather={showWeather}
          onToggleWeather={setShowWeather}
          className="max-w-4xl mx-auto"
        />

        <div className="flex justify-center gap-2 mb-6 flex-wrap ">
          <button
            onClick={() => setShowConverter(!showConverter)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {showConverter ? 'Hide' : 'Show'} Time Converter
          </button>
          
          {/* <button
            onClick={() => setShowMap(!showMap)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            {showMap ? 'Hide' : 'Show'} World Map
          </button> */}

          <button
            onClick={() => setShowGlobe(!showGlobe)}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
          >
            {showGlobe ? 'Hide' : 'Show'} Interactive Globe
          </button>

          <button
            onClick={() => setShowTimeTravel(!showTimeTravel)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            {showTimeTravel ? 'Hide' : 'Show'} Time Travel
          </button>

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
          >
            {showNotifications ? 'Hide' : 'Show'} Notifications
          </button>
        </div>

        {showConverter && (
          <TimeZoneConverter currentTime={currentTime} />
        )}

        {showMap && (
          <WorldMap 
            locations={locations}
            currentTime={currentTime}
            is24Hour={is24Hour}
            isDarkMode={isDarkMode}
          />
        )}

        {showGlobe && (
          <InteractiveGlobe
            locations={locations}
            currentTime={currentTime}
            is24Hour={is24Hour}
            isDarkMode={isDarkMode}
            onAddLocation={handleAddLocation}
          />
        )}

        {showTimeTravel && (
          <TimeTravelSlider
            locations={locations}
            is24Hour={is24Hour}
            isDarkMode={isDarkMode}
          />
        )}

        {showNotifications && (
          <NotificationManager
            locations={locations}
            isDarkMode={isDarkMode}
          />
        )}
        
        <TimeZoneSearch onAddLocation={handleAddLocation} />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {locations.map((location, index) => (
            <TimeZoneCard
              key={`${location.name}-${index}`}
              location={location.customName || location.name}
              originalLocation={location.name}
              timeZone={location.timeZone}
              currentTime={isOnline ? currentTime : getCachedTime(location.name)}
              is24Hour={is24Hour}
              isDarkMode={isDarkMode}
              showWeather={showWeather}
              isFavorite={location.isFavorite}
              onDelete={() => handleDeleteLocation(index)}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
              onRename={(newName) => handleRenameLocation(index, newName)}
              onToggleFavorite={() => handleToggleFavorite(index)}
              isFirst={index === 0}
              isLast={index === locations.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
