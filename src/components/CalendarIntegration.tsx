
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Calendar, Clock, Users, Globe } from 'lucide-react';
import { getTimeInZone } from '../utils/timeUtils';

interface Location {
  name: string;
  timeZone: string;
}

interface CalendarIntegrationProps {
  locations: Location[];
  isDarkMode: boolean;
}

const CalendarIntegration: React.FC<CalendarIntegrationProps> = ({ locations, isDarkMode }) => {
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [selectedTimeZone, setSelectedTimeZone] = useState(locations[0]?.timeZone || 'UTC');
  const [attendees, setAttendees] = useState('');

  const generateCalendarEvent = () => {
    if (!meetingTitle || !meetingDate || !meetingTime) return;

    const eventDate = new Date(`${meetingDate}T${meetingTime}`);
    const endDate = new Date(eventDate.getTime() + 60 * 60 * 1000); // 1 hour later

    // Generate time zone breakdown
    const timeZoneBreakdown = locations.map(location => {
      const timeInZone = getTimeInZone(eventDate, location.timeZone);
      return `${location.name}: ${timeInZone}`;
    }).join('\n');

    const eventDetails = {
      title: meetingTitle,
      startTime: eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      endTime: endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      description: `Meeting across time zones:\n\n${timeZoneBreakdown}\n\nAttendees: ${attendees}`,
      location: 'Virtual Meeting'
    };

    return eventDetails;
  };

  const exportToGoogleCalendar = () => {
    const event = generateCalendarEvent();
    if (!event) return;

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.startTime}/${event.endTime}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleUrl, '_blank');
  };

  const exportToOutlook = () => {
    const event = generateCalendarEvent();
    if (!event) return;

    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&startdt=${event.startTime}&enddt=${event.endTime}&body=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(outlookUrl, '_blank');
  };

  const downloadICS = () => {
    const event = generateCalendarEvent();
    if (!event) return;

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//World Time Windows//EN
BEGIN:VEVENT
UID:${Date.now()}@worldtimewindows.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${event.startTime}
DTEND:${event.endTime}
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className={`w-full max-w-2xl mx-auto mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <Calendar className="h-5 w-5" />
          Schedule Meeting Across Time Zones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="meeting-title">Meeting Title</Label>
            <Input
              id="meeting-title"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              placeholder="Weekly Team Sync"
            />
          </div>
          <div>
            <Label htmlFor="attendees">Attendees (emails)</Label>
            <Input
              id="attendees"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              placeholder="john@example.com, jane@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="meeting-date">Date</Label>
            <Input
              id="meeting-date"
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="meeting-time">Time</Label>
            <Input
              id="meeting-time"
              type="time"
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="timezone">Reference Time Zone</Label>
            <select
              id="timezone"
              value={selectedTimeZone}
              onChange={(e) => setSelectedTimeZone(e.target.value)}
              className={`w-full px-3 py-2 rounded-md border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            >
              {locations.map((location) => (
                <option key={location.timeZone} value={location.timeZone}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {meetingDate && meetingTime && (
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h4 className={`font-medium mb-2 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Globe className="h-4 w-4" />
              Meeting Times Across Zones
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {locations.map((location) => {
                const eventDate = new Date(`${meetingDate}T${meetingTime}`);
                const timeInZone = getTimeInZone(eventDate, location.timeZone);
                return (
                  <div key={location.timeZone} className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Clock className="h-3 w-3" />
                    <span className="font-medium">{location.name}:</span>
                    <span>{timeInZone}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={exportToGoogleCalendar}
            disabled={!meetingTitle || !meetingDate || !meetingTime}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Users className="h-4 w-4 mr-2" />
            Add to Google Calendar
          </Button>
          <Button
            onClick={exportToOutlook}
            disabled={!meetingTitle || !meetingDate || !meetingTime}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Users className="h-4 w-4 mr-2" />
            Add to Outlook
          </Button>
          <Button
            onClick={downloadICS}
            disabled={!meetingTitle || !meetingDate || !meetingTime}
            variant="outline"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Download .ics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarIntegration;
