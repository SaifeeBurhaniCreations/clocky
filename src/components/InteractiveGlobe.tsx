
import React, { useState, useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { Globe, MapPin, Star } from 'lucide-react';
import { getTimeInZone } from '../utils/timeUtils';
import { TIMEZONE_SUGGESTIONS } from '../data/timezones';

interface Location {
  name: string;
  timeZone: string;
  customName?: string;
  isFavorite?: boolean;
}

interface InteractiveGlobeProps {
  locations: Location[];
  currentTime: Date;
  is24Hour: boolean;
  isDarkMode: boolean;
  onAddLocation: (location: string) => void;
}

// More comprehensive city coordinates with lat/lng
const cityCoordinates: Record<string, { lat: number; lng: number; country: string }> = {
  // Major capitals and cities
  'London': { lat: 51.5074, lng: -0.1278, country: 'UK' },
  'Paris': { lat: 48.8566, lng: 2.3522, country: 'France' },
  'Berlin': { lat: 52.5200, lng: 13.4050, country: 'Germany' },
  'Madrid': { lat: 40.4168, lng: -3.7038, country: 'Spain' },
  'Rome': { lat: 41.9028, lng: 12.4964, country: 'Italy' },
  'Moscow': { lat: 55.7558, lng: 37.6176, country: 'Russia' },
  'New York': { lat: 40.7128, lng: -74.0060, country: 'USA' },
  'Los Angeles': { lat: 34.0522, lng: -118.2437, country: 'USA' },
  'Chicago': { lat: 41.8781, lng: -87.6298, country: 'USA' },
  'Toronto': { lat: 43.6532, lng: -79.3832, country: 'Canada' },
  'Mexico City': { lat: 19.4326, lng: -99.1332, country: 'Mexico' },
  'Tokyo': { lat: 35.6762, lng: 139.6503, country: 'Japan' },
  'Seoul': { lat: 37.5665, lng: 126.9780, country: 'South Korea' },
  'Beijing': { lat: 39.9042, lng: 116.4074, country: 'China' },
  'Shanghai': { lat: 31.2304, lng: 121.4737, country: 'China' },
  'Hong Kong': { lat: 22.3193, lng: 114.1694, country: 'Hong Kong' },
  'Singapore': { lat: 1.3521, lng: 103.8198, country: 'Singapore' },
  'Bangkok': { lat: 13.7563, lng: 100.5018, country: 'Thailand' },
  'Mumbai': { lat: 19.0760, lng: 72.8777, country: 'India' },
  'Delhi': { lat: 28.7041, lng: 77.1025, country: 'India' },
  'Dubai': { lat: 25.2048, lng: 55.2708, country: 'UAE' },
  'Sydney': { lat: -33.8688, lng: 151.2093, country: 'Australia' },
  'Melbourne': { lat: -37.8136, lng: 144.9631, country: 'Australia' },
  'Auckland': { lat: -36.8485, lng: 174.7633, country: 'New Zealand' },
  'São Paulo': { lat: -23.5505, lng: -46.6333, country: 'Brazil' },
  'Buenos Aires': { lat: -34.6118, lng: -58.3960, country: 'Argentina' },
  'Cairo': { lat: 30.0444, lng: 31.2357, country: 'Egypt' },
  'Cape Town': { lat: -33.9249, lng: 18.4241, country: 'South Africa' },
  'Lagos': { lat: 6.5244, lng: 3.3792, country: 'Nigeria' }
};

const InteractiveGlobe: React.FC<InteractiveGlobeProps> = ({
  locations,
  currentTime,
  is24Hour,
  isDarkMode,
  onAddLocation
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const globeRef = useRef<HTMLDivElement>(null);

  // Auto-rotation effect
  useEffect(() => {
    if (!isDragging) {
      const interval = setInterval(() => {
        setRotation(prev => ({ ...prev, y: prev.y + 0.5 }));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setRotation(prev => ({
      x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Convert lat/lng to 3D position on sphere
  const getCityPosition = (lat: number, lng: number, radius: number = 180) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    return { x, y, z };
  };

  // Check if city is visible (front-facing)
  const isCityVisible = (lat: number, lng: number) => {
    const adjustedLng = lng - rotation.y;
    const normalizedLng = ((adjustedLng + 180) % 360) - 180;
    return Math.abs(normalizedLng) < 90;
  };

  const availableCities = TIMEZONE_SUGGESTIONS.filter(city => 
    cityCoordinates[city.city] && !locations.find(loc => loc.name === city.city)
  );

  return (
    <Card className={`p-6 mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center gap-2 mb-4">
        <Globe className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Interactive Globe</h3>
      </div>

      <div className="relative">
        {/* Globe Container */}
        <div 
          ref={globeRef}
          className="relative mx-auto w-96 h-96 cursor-grab active:cursor-grabbing"
          style={{ perspective: '1000px' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Globe */}
          <div
            className={`absolute inset-0 rounded-full border-2 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 border-blue-600' 
                : 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 border-blue-400'
            } shadow-2xl`}
            style={{
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transformStyle: 'preserve-3d',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            {/* Grid lines for globe effect */}
            <div className="absolute inset-0 rounded-full opacity-20">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={`meridian-${i}`}
                  className="absolute border-l border-white/30"
                  style={{
                    left: '50%',
                    top: '10%',
                    height: '80%',
                    transform: `rotateY(${i * 45}deg) translateZ(190px)`
                  }}
                />
              ))}
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={`parallel-${i}`}
                  className="absolute border border-white/30 rounded-full"
                  style={{
                    left: '50%',
                    top: `${20 + i * 12}%`,
                    width: `${Math.sin((i + 1) * Math.PI / 7) * 100}%`,
                    height: '2px',
                    transform: `translateX(-50%) rotateX(90deg) translateZ(${Math.cos((i + 1) * Math.PI / 7) * 190}px)`
                  }}
                />
              ))}
            </div>
          </div>

          {/* City Pins */}
          {Object.entries(cityCoordinates).map(([cityName, coords]) => {
            const position = getCityPosition(coords.lat, coords.lng);
            const isVisible = isCityVisible(coords.lat, coords.lng);
            const isSelected = locations.find(loc => loc.name === cityName);
            const isFav = isSelected?.isFavorite;
            
            if (!isVisible) return null;

            return (
              <div
                key={cityName}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `
                    translate(-50%, -50%) 
                    rotateX(${rotation.x}deg) 
                    rotateY(${rotation.y}deg)
                    translateZ(190px)
                    translateX(${position.x}px)
                    translateY(${-position.y}px)
                  `
                }}
              >
                <div className="relative">
                  <MapPin
                    className={`h-4 w-4 cursor-pointer transition-all duration-200 hover:scale-150 ${
                      isSelected
                        ? isFav 
                          ? 'text-yellow-500 fill-yellow-400' 
                          : 'text-red-500 fill-red-400'
                        : 'text-green-500 fill-green-400 hover:text-green-600'
                    }`}
                    onClick={() => {
                      if (!isSelected) {
                        onAddLocation(cityName);
                      }
                      setSelectedCity(selectedCity === cityName ? null : cityName);
                    }}
                  />
                  
                  {/* City tooltip */}
                  {selectedCity === cityName && (
                    <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-20 ${
                      isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 border'
                    }`}>
                      <div className="text-sm font-medium">{cityName}</div>
                      <div className="text-xs text-gray-500">{coords.country}</div>
                      {isSelected && (
                        <div className="text-sm font-bold">
                          {getTimeInZone(currentTime, isSelected.timeZone, is24Hour)}
                        </div>
                      )}
                      {!isSelected && (
                        <div className="text-xs text-blue-500 cursor-pointer">
                          Click to add
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Available Cities List */}
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">Available Cities to Add:</h4>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {availableCities.slice(0, 20).map((city) => (
              <button
                key={city.city}
                onClick={() => onAddLocation(city.city)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-white' 
                    : 'bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-900'
                }`}
              >
                {city.city}, {city.country}
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className={`mt-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>🌍 Click and drag to rotate the globe</p>
          <p>📍 Click green pins to add cities, red/yellow pins show your current cities</p>
        </div>
      </div>
    </Card>
  );
};

export default InteractiveGlobe;
