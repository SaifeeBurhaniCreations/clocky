
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Code, Copy, Eye, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Location {
  name: string;
  timeZone: string;
  customName?: string;
  isFavorite?: boolean;
}

interface WidgetEmbedProps {
  locations: Location[];
  isDarkMode: boolean;
}

const WidgetEmbed: React.FC<WidgetEmbedProps> = ({ locations, isDarkMode }) => {
  const [widgetTheme, setWidgetTheme] = useState<'light' | 'dark'>('light');
  const [showWeather, setShowWeather] = useState(false);
  const [is24Hour, setIs24Hour] = useState(true);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    locations.slice(0, 4).map(l => l.timeZone)
  );
  const { toast } = useToast();

  const generateWidgetCode = () => {
    const widgetParams = new URLSearchParams({
      theme: widgetTheme,
      weather: showWeather.toString(),
      format: is24Hour ? '24' : '12',
      zones: selectedLocations.join(','),
    });

    const widgetUrl = `${window.location.origin}/widget?${widgetParams.toString()}`;
    
    return {
      iframe: `<iframe 
  src="${widgetUrl}" 
  width="400" 
  height="300" 
  frameborder="0" 
  style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
</iframe>`,
      url: widgetUrl,
      embed: `<!-- World Time Widget -->
<div id="world-time-widget"></div>
<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = '${widgetUrl}';
    iframe.width = '400';
    iframe.height = '300';
    iframe.frameBorder = '0';
    iframe.style.borderRadius = '8px';
    iframe.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    document.getElementById('world-time-widget').appendChild(iframe);
  })();
</script>`
    };
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${type} code copied to clipboard`,
      });
    });
  };

  const toggleLocation = (timeZone: string) => {
    setSelectedLocations(prev => 
      prev.includes(timeZone) 
        ? prev.filter(tz => tz !== timeZone)
        : [...prev, timeZone]
    );
  };

  const widgetCode = generateWidgetCode();

  return (
    <Card className={`w-full max-w-4xl mx-auto mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <Code className="h-5 w-5" />
          Widget & Embed Code Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Theme
            </Label>
            <select
              value={widgetTheme}
              onChange={(e) => setWidgetTheme(e.target.value as 'light' | 'dark')}
              className={`w-full px-3 py-2 rounded-md border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Show Weather</Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={showWeather}
                onCheckedChange={setShowWeather}
              />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {showWeather ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Time Format</Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={is24Hour}
                onCheckedChange={setIs24Hour}
              />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {is24Hour ? '24-hour' : '12-hour'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preview</Label>
            <Button
              onClick={() => window.open(widgetCode.url, '_blank')}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Eye className="h-4 w-4 mr-2" />
              Open Preview
            </Button>
          </div>
        </div>

        {/* Location Selection */}
        <div>
          <Label className="block mb-3">Select Time Zones (max 6)</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {locations.map((location) => (
              <label
                key={location.timeZone}
                className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
                  selectedLocations.includes(location.timeZone)
                    ? (isDarkMode ? 'bg-blue-600' : 'bg-blue-100')
                    : (isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100')
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedLocations.includes(location.timeZone)}
                  onChange={() => toggleLocation(location.timeZone)}
                  disabled={!selectedLocations.includes(location.timeZone) && selectedLocations.length >= 6}
                  className="rounded"
                />
                <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {location.customName || location.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Generated Code */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Simple iframe Code</Label>
              <Button
                onClick={() => copyToClipboard(widgetCode.iframe, 'iframe')}
                variant="outline"
                size="sm"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <Textarea
              value={widgetCode.iframe}
              readOnly
              className={`font-mono text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
              rows={5}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>JavaScript Embed Code</Label>
              <Button
                onClick={() => copyToClipboard(widgetCode.embed, 'JavaScript')}
                variant="outline"
                size="sm"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <Textarea
              value={widgetCode.embed}
              readOnly
              className={`font-mono text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
              rows={8}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Direct Widget URL</Label>
              <Button
                onClick={() => copyToClipboard(widgetCode.url, 'URL')}
                variant="outline"
                size="sm"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <Textarea
              value={widgetCode.url}
              readOnly
              className={`font-mono text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
              rows={2}
            />
          </div>
        </div>

        {selectedLocations.length === 0 && (
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Select at least one time zone to generate widget code.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default WidgetEmbed;
