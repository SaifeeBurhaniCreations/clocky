
import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Download, FileText } from 'lucide-react';
import { getTimeInZone, getDateInZone } from '../utils/timeUtils';

interface Location {
  name: string;
  timeZone: string;
  customName?: string;
  isFavorite?: boolean;
}

interface DataExportProps {
  locations: Location[];
  currentTime: Date;
  is24Hour: boolean;
  isDarkMode: boolean;
}

const DataExport: React.FC<DataExportProps> = ({ locations, currentTime, is24Hour, isDarkMode }) => {
  const generateExportData = () => {
    return locations.map(location => {
      const currentTimeInZone = getTimeInZone(currentTime, location.timeZone, is24Hour);
      const dateInZone = getDateInZone(currentTime, location.timeZone);
      const localOffset = currentTime.getTimezoneOffset();
      const zoneDate = new Date(currentTime.toLocaleString('en-US', { timeZone: location.timeZone }));
      const zoneOffset = (currentTime.getTime() - zoneDate.getTime()) / (1000 * 60);
      const timeDifference = Math.round((zoneOffset - localOffset) / 60);
      
      return {
        cityName: location.customName || location.name,
        originalName: location.name,
        timeZone: location.timeZone,
        currentTime: currentTimeInZone,
        currentDate: dateInZone,
        timeDifferenceFromLocal: timeDifference,
        isFavorite: location.isFavorite || false,
        exportedAt: currentTime.toISOString(),
      };
    });
  };

  const exportAsCSV = () => {
    const data = generateExportData();
    const headers = [
      'City Name',
      'Original Name', 
      'Time Zone',
      'Current Time',
      'Current Date',
      'Time Difference (hours)',
      'Is Favorite',
      'Exported At'
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        `"${row.cityName}"`,
        `"${row.originalName}"`,
        `"${row.timeZone}"`,
        `"${row.currentTime}"`,
        `"${row.currentDate}"`,
        row.timeDifferenceFromLocal,
        row.isFavorite,
        `"${row.exportedAt}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `world-time-zones-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsJSON = () => {
    const data = generateExportData();
    const jsonContent = JSON.stringify({
      exportInfo: {
        exportedAt: currentTime.toISOString(),
        totalZones: data.length,
        format: is24Hour ? '24-hour' : '12-hour'
      },
      timeZones: data
    }, null, 2);

    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `world-time-zones-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className={`w-full max-w-2xl mx-auto mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <Download className="h-5 w-5" />
          Export Time Zone Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`mb-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Export your selected time zones with current times, dates, and time differences.
            Data includes: {locations.length} cities, current time format ({is24Hour ? '24-hour' : '12-hour'}), 
            and export timestamp.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={exportAsCSV}
            disabled={locations.length === 0}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export as CSV
          </Button>
          <Button
            onClick={exportAsJSON}
            disabled={locations.length === 0}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export as JSON
          </Button>
        </div>

        {locations.length === 0 && (
          <p className={`text-sm mt-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Add some time zones to enable export functionality.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DataExport;
