
import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Settings, Sun, Moon, Clock } from 'lucide-react';

interface SettingsPanelProps {
  className: string;
  is24Hour: boolean;
  onToggle24Hour: (value: boolean) => void;
  isDarkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
  showWeather: boolean;
  onToggleWeather: (value: boolean) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  className,
  is24Hour,
  onToggle24Hour,
  isDarkMode,
  onToggleDarkMode,
  showWeather,
  onToggleWeather
}) => {
  return (
    <Card className={`p-4 mb-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Settings className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Settings</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>24-hour format</span>
          </div>
          <Switch checked={is24Hour} onCheckedChange={onToggle24Hour} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span>Dark mode</span>
          </div>
          <Switch checked={isDarkMode} onCheckedChange={onToggleDarkMode} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>🌤️</span>
            <span>Show weather</span>
          </div>
          <Switch checked={showWeather} onCheckedChange={onToggleWeather} />
        </div>
      </div>
    </Card>
  );
};

export default SettingsPanel;
