
import { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  sunrise: string;
  sunset: string;
}

export const useWeather = (cityName: string, enabled: boolean = true) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Note: You'll need to add your OpenWeatherMap API key to environment variables
  // For now, we'll return mock data
  useEffect(() => {
    if (!enabled || !cityName) return;

    setLoading(true);
    setError(null);

    // Mock weather data - replace with actual API call
    setTimeout(() => {
      const mockWeatherData: WeatherData = {
        temperature: Math.floor(Math.random() * 30) + 5, // Random temp between 5-35°C
        description: ['Clear', 'Cloudy', 'Rainy', 'Sunny'][Math.floor(Math.random() * 4)],
        icon: '01d', // You can map this to actual weather icons
        sunrise: '06:30',
        sunset: '18:45'
      };
      
      setWeather(mockWeatherData);
      setLoading(false);
    }, 1000);

    // Real API implementation would look like this:
    /*
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        
        if (response.ok) {
          setWeather({
            temperature: Math.round(data.main.temp),
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })
          });
        } else {
          setError('Weather data not found');
        }
      } catch (err) {
        setError('Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    */
  }, [cityName, enabled]);

  return { weather, loading, error };
};
