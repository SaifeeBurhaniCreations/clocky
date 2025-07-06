
import React from 'react';
import { Button } from './ui/button';
import { Trash, ArrowUp, ArrowDown, Edit, Check, X, Star, StarIcon, ThermometerIcon } from 'lucide-react';
import { getProgressBarColor } from '../utils/timeUtils';
import { getWeatherIcons } from '@/utils/weatherIcons';
interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  sunrise: string;
  sunset: string;
}

interface TimeDisplayProps {
  timeString: string;
  timeZone: string;
  currentTime: Date;
  dateString: string;
  location: string;
  originalLocation: string;
  dayProgress: number;
  weather?: WeatherData | null;
  weatherLoading?: boolean;
  isFavorite?: boolean;
  isEditing: boolean;
  editName: string;
  onEditNameChange: (name: string) => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onToggleFavorite: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  isDarkMode?: boolean;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({
  timeString,
  dateString,
  timeZone,
  currentTime,
  location,
  originalLocation,
  dayProgress,
  weather,
  weatherLoading,
  isFavorite,
  isEditing,
  editName,
  onEditNameChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onToggleFavorite,
  isFirst,
  isLast,
  isDarkMode
}) => {
  const { Icon, color } = getWeatherIcons(weather?.description);
  return (
    <div className={`p-4 space-y-3 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h2 className="text-2xl font-medium">{timeString}</h2>
          
          {isEditing ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                value={editName}
                onChange={(e) => onEditNameChange(e.target.value)}
                className={`text-lg px-2 py-1 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && onSaveEdit()}
              />
              <Button variant="ghost" size="sm" onClick={onSaveEdit}>
                <Check className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onCancelEdit}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className={`text-lg uppercase flex items-center gap-1 ${isDarkMode ? 'text-gray-300' : 'text-warmblack'}`}>
                {location}
                {isFavorite && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
              </div>
              <Button variant="ghost" size="sm" onClick={onStartEdit}>
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleFavorite}
            className="h-8 w-8"
          >
            {isFavorite ? 
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> : 
              <StarIcon className="h-4 w-4" />
            }
          </Button>
          
          {!isFirst && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onMoveUp}
              className="h-8 w-8"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          )}
          {!isLast && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onMoveDown}
              className="h-8 w-8"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onDelete}
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{dateString}</div>
      
      {weather && (
        <div className={`flex items-center justify-between text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <div className="flex items-center gap-2">
            <span> <ThermometerIcon size={16} color="#ef4444" strokeWidth={1.5} /> </span>
            <span>{weather.temperature}°C</span>
          </div>
          <div className="text-xs">
            ☀️ {weather.sunrise} | 🌙 {weather.sunset}
          </div>
        </div>
      )}
      {weather && (
        <div className={`flex items-center justify-between text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
           <div className="flex items-center gap-2">
            <span> <Icon size={18} color={color} strokeWidth={1.5} /> </span>
            <span className="capitalize">{weather.description}</span>
          </div>
        </div>
      )}
      
      {weatherLoading && (
        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Loading weather...
        </div>
      )}
      
      <div className={`w-full h-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <div 
          className={`h-full transition-all duration-1000 ${getProgressBarColor(currentTime, timeZone, isDarkMode)}`}
          style={{ width: `${dayProgress}%` }}
        />
      </div>
    </div>
  );
};

export default TimeDisplay;
