
import React, { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { TIMEZONE_SUGGESTIONS } from '../data/timezones';
import { TimeZoneCity } from '../types/timezone';
import { useDebounce } from '../hooks/useDebounce';
import { useNotifications } from '../contexts/NotificationContext';

interface TimeZoneSearchProps {
  onAddLocation: (location: string) => void;
}

const TimeZoneSearch: React.FC<TimeZoneSearchProps> = ({ onAddLocation }) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [filteredResults, setFilteredResults] = useState<TimeZoneCity[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { addNotification } = useNotifications();
  
  const debouncedSearch = useDebounce(search, 300);

  // Filter and sort results
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setFilteredResults([]);
      setIsOpen(false);
      return;
    }

    const searchLower = debouncedSearch.toLowerCase();
    const filtered = TIMEZONE_SUGGESTIONS.filter(item =>
      item.city.toLowerCase().includes(searchLower) ||
      item.country.toLowerCase().includes(searchLower) ||
      item.timezone.toLowerCase().includes(searchLower)
    ).sort((a, b) => {
      // Prioritize exact matches first
      const aExact = a.city.toLowerCase() === searchLower || a.country.toLowerCase() === searchLower;
      const bExact = b.city.toLowerCase() === searchLower || b.country.toLowerCase() === searchLower;
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      // Then alphabetical by city
      return a.city.localeCompare(b.city);
    });

    setFilteredResults(filtered);
    setIsOpen(filtered.length > 0);
    setSelectedIndex(-1);
  }, [debouncedSearch]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(filteredResults[selectedIndex].city);
        } else if (filteredResults.length > 0) {
          handleSelect(filteredResults[0].city);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle selection
  const handleSelect = (city: string) => {
    onAddLocation(city);
    setSearch('');
    setIsOpen(false);
    setSelectedIndex(-1);
    
    addNotification({
      title: 'Location Added',
      description: `${city} has been added to your time zones`,
      type: 'success',
      icon: '🌍'
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Highlight matched text
  const highlightMatch = (text: string, search: string) => {
    if (!search.trim()) return text;
    
    const regex = new RegExp(`(${search})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-0 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="relative max-w-md mx-auto mb-8" ref={dropdownRef}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for a city, country, or timezone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (debouncedSearch.trim()) {
                setIsOpen(true);
              }
            }}
            className="font-mono"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            role="combobox"
          />
          
          {isOpen && filteredResults.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
              <ul role="listbox" className="py-1">
                {filteredResults.map((item, index) => (
                  <li
                    key={`${item.city}-${item.country}`}
                    role="option"
                    aria-selected={index === selectedIndex}
                    className={`px-3 py-2 cursor-pointer flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      index === selectedIndex ? 'bg-blue-50 dark:bg-blue-900' : ''
                    }`}
                    onClick={() => handleSelect(item.city)}
                  >
                    <div>
                      <div className="font-medium">
                        {highlightMatch(item.city, debouncedSearch)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {highlightMatch(item.country, debouncedSearch)}
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm ml-2">
                      {new Date().toLocaleTimeString('en-US', { 
                        timeZone: item.timezone, 
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <Button type="submit" variant="outline" size="icon" aria-label="Search">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      {search.trim() && filteredResults.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg p-3">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            No results found for "{search}"
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeZoneSearch;
