
import React, { useState, useEffect } from 'react';
import TimeZoneSearch from '../components/TimeZoneSearch';
import TimeZoneCard from '../components/TimeZoneCard';
import TimeZoneConverter from '../components/TimeZoneConverter';
import SettingsPanel from '../components/SettingsPanel';
import { TIMEZONE_SUGGESTIONS } from '../data/timezones';

interface Location {
  name: string;
  timeZone: string;
  customName?: string;
  isFavorite?: boolean;
}

const Index = () => {
  const [locations, setLocations] = useState<Location[]>([
    { name: 'New York', timeZone: 'America/New_York' },
    { name: 'London', timeZone: 'Europe/London' },
    { name: 'Tokyo', timeZone: 'Asia/Tokyo' },
    { name: 'New Zealand', timeZone: 'Pacific/Auckland' }
  ]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showWeather, setShowWeather] = useState(true);
  const [showConverter, setShowConverter] = useState(false);

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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-medium text-center mb-1">WORLD TIME WINDOWS</h1>
        <p className="text-sm text-gray-600 text-center mb-8">made by <a href="https://x.com/pau_wee_" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">@pau_wee_</a></p>
        
        <SettingsPanel
          is24Hour={is24Hour}
          onToggle24Hour={setIs24Hour}
          isDarkMode={isDarkMode}  
          onToggleDarkMode={setIsDarkMode}
          showWeather={showWeather}
          onToggleWeather={setShowWeather}
        />

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowConverter(!showConverter)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {showConverter ? 'Hide' : 'Show'} Time Converter
          </button>
        </div>

        {showConverter && (
          <TimeZoneConverter currentTime={currentTime} />
        )}
        
        <TimeZoneSearch onAddLocation={handleAddLocation} />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {locations.map((location, index) => (
            <TimeZoneCard
              key={`${location.name}-${index}`}
              location={location.customName || location.name}
              originalLocation={location.name}
              timeZone={location.timeZone}
              currentTime={currentTime}
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
