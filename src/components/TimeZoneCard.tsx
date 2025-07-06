
import React, { useState } from 'react';
import SkyBackground from './SkyBackground';
import TimeDisplay from './TimeDisplay';
import { useWeather } from '../hooks/useWeather';
import { 
  getTimeInZone, 
  getDateInZone, 
  getDayProgress 
} from '../utils/timeUtils';

interface TimeZoneCardProps {
  location: string;
  originalLocation: string;
  timeZone: string;
  currentTime: Date;
  is24Hour: boolean;
  isDarkMode: boolean;
  showWeather: boolean;
  isFavorite?: boolean;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRename: (newName: string) => void;
  onToggleFavorite: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const TimeZoneCard: React.FC<TimeZoneCardProps> = ({ 
  location, 
  originalLocation,
  timeZone,
  currentTime,
  is24Hour,
  isDarkMode,
  showWeather,
  isFavorite,
  onDelete,
  onMoveUp,
  onMoveDown,
  onRename,
  onToggleFavorite,
  isFirst,
  isLast
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(location);
  
  const timeString = getTimeInZone(currentTime, timeZone, is24Hour);
  const dateString = getDateInZone(currentTime, timeZone);
  const progress = getDayProgress(currentTime, timeZone);
  const { weather, loading: weatherLoading } = useWeather(originalLocation, showWeather);

  const handleSaveEdit = () => {
    onRename(editName);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(location);
    setIsEditing(false);
  };

  return (
    <div className={`w-full max-w-xs ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-lg`}>
      <SkyBackground currentTime={new Date()} timeZone={timeZone} isDarkMode={isDarkMode} />
      <TimeDisplay
        timeString={timeString}
        currentTime={currentTime}
        timeZone={timeZone}
        dateString={dateString}
        location={location}
        originalLocation={originalLocation}
        dayProgress={progress}
        weather={showWeather ? weather : null}
        weatherLoading={showWeather ? weatherLoading : false}
        isFavorite={isFavorite}
        isEditing={isEditing}
        editName={editName}
        onEditNameChange={setEditName}
        onStartEdit={() => setIsEditing(true)}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={handleCancelEdit}
        onDelete={onDelete}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onToggleFavorite={onToggleFavorite}
        isFirst={isFirst}
        isLast={isLast}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default TimeZoneCard;
