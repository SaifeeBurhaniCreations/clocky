
import React from 'react';
import { Card } from './ui/card';
import { MapPin, Globe } from 'lucide-react';
import { getTimeInZone } from '../utils/timeUtils';

interface Location {
  name: string;
  timeZone: string;
  customName?: string;
  isFavorite?: boolean;
}

interface WorldMapProps {
  locations: Location[];
  currentTime: Date;
  is24Hour: boolean;
  isDarkMode: boolean;
}

// Approximate coordinates for major cities (for positioning pins)
const cityCoordinates: Record<string, { x: number; y: number }> = {
  'New York': { x: 25, y: 40 },
  'London': { x: 50, y: 35 },
  'Tokyo': { x: 85, y: 42 },
  'New Zealand': { x: 92, y: 75 },
  'Sydney': { x: 90, y: 70 },
  'Paris': { x: 52, y: 35 },
  'Berlin': { x: 55, y: 32 },
  'Moscow': { x: 65, y: 28 },
  'Dubai': { x: 68, y: 45 },
  'Singapore': { x: 78, y: 58 },
  'Los Angeles': { x: 18, y: 45 },
  'Chicago': { x: 28, y: 38 },
  'Toronto': { x: 30, y: 36 },
  'Mexico City': { x: 22, y: 52 },
  'São Paulo': { x: 38, y: 72 },
  'Buenos Aires': { x: 40, y: 78 },
  'Cairo': { x: 60, y: 48 },
  'Mumbai': { x: 72, y: 52 },
  'Bangkok': { x: 78, y: 55 },
  'Seoul': { x: 84, y: 38 },
  'Beijing': { x: 82, y: 35 },
  'Jakarta': { x: 78, y: 62 },
  'Manila': { x: 82, y: 55 },
  'Ho Chi Minh City': { x: 78, y: 58 },
  'Kuala Lumpur': { x: 78, y: 58 },
  'Hong Kong': { x: 82, y: 48 }
};

const WorldMap: React.FC<WorldMapProps> = ({ 
  locations, 
  currentTime, 
  is24Hour, 
  isDarkMode 
}) => {
  return (
    <Card className={`p-6 mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center gap-2 mb-4">
        <Globe className="h-5 w-5" />
        <h3 className="text-lg font-semibold">World Map View</h3>
      </div>
      
      <div className="relative w-full h-96 bg-gradient-to-b from-blue-200 to-green-200 rounded-lg overflow-hidden">
        {/* Simple world map background */}
        <svg 
          viewBox="0 0 100 60" 
          className="absolute inset-0 w-full h-full opacity-30"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Simplified continent shapes */}
          <path 
            d="M15 20 L35 15 L45 25 L40 35 L20 40 Z" 
            fill="currentColor" 
            opacity="0.3"
          />
          <path 
            d="M45 15 L70 12 L75 30 L65 40 L50 35 Z" 
            fill="currentColor" 
            opacity="0.3"
          />
          <path 
            d="M75 35 L95 30 L90 50 L80 55 L75 45 Z" 
            fill="currentColor" 
            opacity="0.3"
          />
          <path 
            d="M30 45 L45 50 L40 65 L25 60 Z" 
            fill="currentColor" 
            opacity="0.3"
          />
        </svg>
        
        {/* City pins */}
        {locations.map((location, index) => {
          const coords = cityCoordinates[location.name];
          if (!coords) return null;
          
          const timeString = getTimeInZone(currentTime, location.timeZone, is24Hour);
          
          return (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{
                left: `${coords.x}%`,
                top: `${coords.y}%`,
              }}
            >
              <div className="relative">
                <MapPin 
                  className={`h-6 w-6 cursor-pointer transition-all duration-200 hover:scale-110 ${
                    location.isFavorite 
                      ? 'text-yellow-500 fill-yellow-400' 
                      : 'text-red-500 fill-red-400'
                  }`} 
                />
                
                {/* Tooltip */}
                <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 ${
                  isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 border'
                }`}>
                  <div className="text-sm font-medium">
                    {location.customName || location.name}
                  </div>
                  <div className="text-lg font-bold">
                    {timeString}
                  </div>
                  {/* Arrow pointing down */}
                  <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                    isDarkMode ? 'border-t-gray-700' : 'border-t-white'
                  }`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-sm text-gray-600 flex items-center gap-4">
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4 text-red-500 fill-red-400" />
          <span>Regular Cities</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4 text-yellow-500 fill-yellow-400" />
          <span>Favorite Cities</span>
        </div>
      </div>
    </Card>
  );
};

export default WorldMap;
