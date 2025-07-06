import React, { useEffect, useState, useCallback } from 'react';
import { Cloud, Sun, Moon } from 'lucide-react';
import { isNightTime, getSkyGradient, getSunMoonPosition } from '../utils/timeUtils';

interface SkyBackgroundProps {
  currentTime: Date;
  timeZone: string;
  isDarkMode?: boolean;
}

interface CloudPosition {
  left: number;
  top: number;
  speed: number;
  direction: number;
}

const SkyBackground: React.FC<SkyBackgroundProps> = ({ currentTime, timeZone, isDarkMode = false }) => {
  const [cloudPositions, setCloudPositions] = useState<CloudPosition[]>(() => {
    const numClouds = Math.floor(Math.random() * 3) + 2;
    return Array(numClouds).fill(null).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 40 + 20,
      speed: (Math.random() * 0.05) + 0.02,
      direction: -1
    }));
  });

  const updateCloudPositions = useCallback(() => {
    setCloudPositions(prev =>
      prev.map(cloud => {
        let newLeft = cloud.left + (cloud.speed * cloud.direction);
        let newDirection = cloud.direction;

        if (newLeft <= -20) {
          newLeft = -20;
          newDirection = 1;
        } else if (newLeft >= 120) {
          newLeft = 120;
          newDirection = -1;
        }

        return { ...cloud, left: newLeft, direction: newDirection };
      })
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(updateCloudPositions, 16);
    return () => clearInterval(interval);
  }, [updateCloudPositions]);

  const skyGradient = getSkyGradient(currentTime, timeZone, isDarkMode);
  const sunMoonTop = getSunMoonPosition(currentTime, timeZone);
  const isNight = isNightTime(currentTime, timeZone);

  return (
    <div className={`relative w-full aspect-square ${skyGradient} overflow-hidden`}>
      {cloudPositions.map((cloud, i) => (
        <div
          key={i}
          className="absolute transition-all duration-[3000ms] ease-linear opacity-50"
          style={{ left: `${cloud.left}%`, top: `${cloud.top}%` }}
        >
          <Cloud className={`w-16 h-16 ${isDarkMode ? 'text-gray-300' : 'text-white'} fill-current`} />
        </div>
      ))}

      <div
        className="absolute transform -translate-x-1/2"
        style={{
          left: '50%',
          top: sunMoonTop
        }}
      >
        {isNight ? (
          <Moon className={`w-12 h-12 ${isDarkMode ? 'text-gray-200' : 'text-white'} fill-current`} />
        ) : (
          <Sun className="w-12 h-12 text-yellow-300 fill-yellow-300" />
        )}
      </div>
    </div>
  );
};

export default SkyBackground;