import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Calendar, Clock, RotateCcw, Star, MoonStar } from 'lucide-react';
import { getTimeInZone } from '../utils/timeUtils';

interface Location {
  name: string;
  timeZone: string;
  customName?: string;
  isFavorite?: boolean;
}

interface TimeTravelSliderProps {
  locations: Location[];
  is24Hour?: boolean;
  isDarkMode: boolean;
}

const TimeTravelSlider: React.FC<TimeTravelSliderProps> = ({
  locations,
  is24Hour: initialIs24Hour = true,
  isDarkMode,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(() =>
    selectedDate.toTimeString().slice(0, 5)
  );
  const [is24Hour, setIs24Hour] = useState(initialIs24Hour);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    const [hours, minutes] = selectedTime.split(':');
    newDate.setHours(parseInt(hours), parseInt(minutes));
    setSelectedDate(newDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setSelectedTime(newTime);
    const newDate = new Date(selectedDate);
    const [hours, minutes] = newTime.split(':');
    newDate.setHours(parseInt(hours), parseInt(minutes));
    setSelectedDate(newDate);
  };

  const resetToNow = () => {
    const now = new Date();
    setSelectedDate(now);
    setSelectedTime(now.toTimeString().slice(0, 5));
  };

  const formatDateForInput = (date: Date) => date.toISOString().split('T')[0];

  return (
    <Card className={`p-6 mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Time Travel</h3>
        <Button variant="ghost" size="sm" onClick={resetToNow}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Now
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIs24Hour((prev) => !prev)}
        >
          <MoonStar className="h-4 w-4 mr-1" />
          {is24Hour ? '12h' : '24h'}
        </Button>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <input
            type="date"
            value={formatDateForInput(selectedDate)}
            onChange={handleDateChange}
            className={`px-3 py-2 rounded border text-sm ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300'
            }`}
          />
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <input
            type="time"
            value={selectedTime}
            onChange={handleTimeChange}
            className={`px-3 py-2 rounded border text-sm ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300'
            }`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {locations.map((location, index) => {
          const timeString = getTimeInZone(
            selectedDate,
            location.timeZone,
            is24Hour
          );
          const dateString = selectedDate.toLocaleDateString('en-US', {
            timeZone: location.timeZone,
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          });

          return (
            <div
              key={index}
              className={`p-4 rounded-lg border relative ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="text-sm font-medium flex items-center gap-1">
                {location.customName || location.name}
                {location.isFavorite && (
                  <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
                )}
              </div>
              <div className="text-lg font-bold">{timeString}</div>
              <div
                className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {dateString}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default TimeTravelSlider;