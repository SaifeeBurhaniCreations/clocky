
import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select } from './ui/select';
import { ArrowLeftRight, Clock } from 'lucide-react';
import { TIMEZONE_SUGGESTIONS } from '../data/timezones';
import { getTimeInZone, getDateInZone } from '../utils/timeUtils';

interface ConverterProps {
  currentTime: Date;
}

const TimeZoneConverter: React.FC<ConverterProps> = ({ currentTime }) => {
  const [fromCity, setFromCity] = useState('New York');
  const [toCity, setToCity] = useState('London');
  const [customTime, setCustomTime] = useState('');

  const fromTimezone = TIMEZONE_SUGGESTIONS.find(city => city.city === fromCity)?.timezone || 'America/New_York';
  const toTimezone = TIMEZONE_SUGGESTIONS.find(city => city.city === toCity)?.timezone || 'Europe/London';

  const timeToConvert = customTime ? 
    new Date(`${currentTime.toDateString()} ${customTime}`) : 
    currentTime;

  const fromTime = getTimeInZone(timeToConvert, fromTimezone);
  const toTime = getTimeInZone(timeToConvert, toTimezone);
  const fromDate = getDateInZone(timeToConvert, fromTimezone);
  const toDate = getDateInZone(timeToConvert, toTimezone);

  const getTimeDifference = () => {
    const fromOffset = new Date().toLocaleString('en', { timeZone: fromTimezone, timeZoneName: 'longOffset' }).split('GMT')[1] || '+0';
    const toOffset = new Date().toLocaleString('en', { timeZone: toTimezone, timeZoneName: 'longOffset' }).split('GMT')[1] || '+0';
    
    const fromHours = parseInt(fromOffset.substring(1, 3)) * (fromOffset[0] === '+' ? 1 : -1);
    const toHours = parseInt(toOffset.substring(1, 3)) * (toOffset[0] === '+' ? 1 : -1);
    const diff = toHours - fromHours;
    
    return diff > 0 ? `+${diff}h` : `${diff}h`;
  };

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Time Zone Converter</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="space-y-2">
          <label className="text-sm font-medium">From</label>
          <select 
            value={fromCity} 
            onChange={(e) => setFromCity(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            {TIMEZONE_SUGGESTIONS.map(city => (
              <option key={`from-${city.city}`} value={city.city}>
                {city.city}, {city.country}
              </option>
            ))}
          </select>
          <div className="text-center p-3 bg-blue-50 rounded-md">
            <div className="text-2xl font-bold">{fromTime}</div>
            <div className="text-sm text-gray-600">{fromDate}</div>
            <div className="text-xs text-gray-500">{fromCity}</div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-2">
            <ArrowLeftRight className="h-4 w-4" />
            <span className="text-sm font-medium">{getTimeDifference()}</span>
          </div>
          <input
            type="time"
            value={customTime}
            onChange={(e) => setCustomTime(e.target.value)}
            className="p-2 border rounded-md text-sm"
            placeholder="Custom time"
          />
          <div className="text-xs text-gray-500 mt-1">Set custom time</div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">To</label>
          <select 
            value={toCity} 
            onChange={(e) => setToCity(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            {TIMEZONE_SUGGESTIONS.map(city => (
              <option key={`to-${city.city}`} value={city.city}>
                {city.city}, {city.country}
              </option>
            ))}
          </select>
          <div className="text-center p-3 bg-green-50 rounded-md">
            <div className="text-2xl font-bold">{toTime}</div>
            <div className="text-sm text-gray-600">{toDate}</div>
            <div className="text-xs text-gray-500">{toCity}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TimeZoneConverter;
