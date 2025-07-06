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

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    if (!enabled || !cityName) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
            cityName
          )}&days=1`
        );

        const data = await response.json();

        if (!response.ok || data.error) {
          setError(data.error?.message || 'Failed to fetch weather data');
          setLoading(false);
          return;
        }

        const weatherData: WeatherData = {
          temperature: data.current.temp_c,
          description: data.current.condition.text,
          icon: `https:${data.current.condition.icon}`, 
          sunrise: data.forecast.forecastday[0].astro.sunrise,
          sunset: data.forecast.forecastday[0].astro.sunset,
        };

        setWeather(weatherData);
      } catch (err) {
        setError('Network error while fetching weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [cityName, enabled]);

  return { weather, loading, error };
};
