
# World Time Windows 🌍

A beautiful, feature-rich world time application built with React and TypeScript. Track multiple time zones, get weather updates, receive notifications, and explore time zones with an interactive globe - all with offline support and cross-tab synchronization.

## ✨ Features

### 🕒 Core Time Zone Management
- **Multiple Time Zone Display**: Track unlimited cities worldwide with real-time updates
- **Customizable Cards**: Rename locations, mark favorites, and reorder with drag controls
- **Time Format Toggle**: Switch between 12-hour and 24-hour formats
- **Sky Background Animation**: Dynamic sky gradients and animated clouds based on local time

### 🌤️ Weather Integration
- **Real-time Weather**: Current conditions and temperature for each location
- **Weather Icons**: Visual indicators for different weather conditions
- **Toggle Control**: Enable/disable weather display globally

### 🔄 Time Zone Tools
- **Time Zone Converter**: Convert times between different zones instantly
- **Time Travel Slider**: Visualize time differences across zones at any point in time
- **Interactive Globe**: 3D globe with clickable cities and time zone exploration

### 🔔 Advanced Notification System
- **In-App Notifications**: Bell icon with unread count badge
- **Browser Notifications**: Native OS notifications with permission handling
- **Cross-Tab Sync**: Notifications sync across all open browser tabs
- **Persistent Storage**: Notifications saved to localStorage and IndexedDB
- **Smart Grouping**: Notifications grouped by Today, Yesterday, and Older
- **Management Controls**: Mark as read, mark all as read, dismiss, clear all

### 📱 Offline Support
- **Connection Detection**: Automatic online/offline status monitoring
- **Data Caching**: Times and search results cached using IndexedDB
- **Offline Indicators**: Visual feedback when using cached data
- **Background Sync**: Automatic cache updates when back online

### 🎨 User Experience
- **Dark/Light Mode**: Toggle between themes with system preference detection
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Keyboard Navigation**: Full keyboard accessibility for dropdowns and controls
- **Search Enhancement**: Real-time filtering with debounced input and text highlighting
- **Visual Feedback**: Smooth animations and transitions throughout

## 🛠️ Tech Stack

### Frontend Framework
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing

### UI & Styling
- **Tailwind CSS** for utility-first styling
- **Shadcn/UI** for accessible, customizable components
- **Lucide React** for consistent iconography
- **CSS Custom Properties** for dynamic theming

### State Management
- **React Context API** for global state (notifications, settings)
- **LocalStorage & IndexedDB** for data persistence
- **BroadcastChannel API** for cross-tab communication

### APIs & Data
- **Web Notifications API** for browser notifications
- **Weather API Integration** for current conditions
- **Geolocation API** for location-based features
- **IndexedDB** for offline data storage

### Development Tools
- **TypeScript** for static type checking
- **ESLint** for code quality
- **Class Variance Authority** for component variants
- **Clsx & Tailwind Merge** for conditional styling

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   ├── ui/                    # Shadcn UI components
│   ├── NotificationBell.tsx   # Notification system UI
│   ├── TimeZoneCard.tsx       # Individual time zone display
│   ├── TimeZoneSearch.tsx     # Enhanced search with filtering
│   ├── InteractiveGlobe.tsx   # 3D globe component
│   └── ...
├── contexts/
│   └── NotificationContext.tsx # Global notification state
├── hooks/
│   ├── useOfflineSupport.ts   # Offline detection & caching
│   ├── useDebounce.ts         # Input debouncing
│   └── useWeather.ts          # Weather data fetching
├── utils/
│   ├── timeUtils.ts           # Time zone calculations
│   └── weatherIcons.ts        # Weather icon mappings
└── pages/
    └── Index.tsx              # Main application page
```

### Data Flow
1. **Time Updates**: Central timer updates all components every second
2. **Notifications**: Context provider manages state, localStorage persists data
3. **Cross-Tab Sync**: BroadcastChannel syncs notification state
4. **Offline Handling**: Service detects connection status, manages cache
5. **Search**: Debounced input filters timezone data with highlighting

### Storage Strategy
- **Settings**: localStorage for user preferences (theme, format, locations)
- **Notifications**: Dual storage (localStorage + IndexedDB) with fallback
- **Cache**: IndexedDB for offline time/weather data with timestamps
- **Cross-Tab**: BroadcastChannel API with localStorage fallback

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern browser with ES2020+ support

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd world-time-windows

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

### Environment Variables
No environment variables required for basic functionality. Weather API keys can be added for enhanced weather features.

### Browser Permissions
- **Notifications**: Requested automatically for browser notifications
- **Location**: Optional for automatic timezone detection

## 📊 Features Deep Dive

### Notification System Architecture
```typescript
// Context-based state management
const NotificationContext = {
  // State
  notifications: Notification[]
  unreadCount: number
  
  // Actions
  addNotification: (notification) => void
  markAsRead: (id) => void
  markAllAsRead: () => void
  dismissNotification: (id) => void
  clearAll: () => void
}

// Cross-tab synchronization
BroadcastChannel -> localStorage -> Context update
```

### Offline Support Implementation
```typescript
// Connection monitoring
navigator.onLine + online/offline events

// Storage hierarchy
IndexedDB (primary) -> localStorage (fallback) -> Memory cache

// Data freshness
Timestamp-based cache invalidation with background updates
```

### Search Enhancement Features
- **Debounced Input**: 300ms delay prevents excessive filtering
- **Fuzzy Matching**: Case-insensitive partial matches on city/country
- **Keyboard Navigation**: Arrow keys + Enter for accessibility
- **Text Highlighting**: Matched text emphasized in results
- **Smart Sorting**: Alphabetical with relevance scoring

## 🎯 Performance Optimizations

### React Optimizations
- Memoized components for expensive renders
- Debounced search to prevent excessive filtering
- Efficient state updates with functional updates
- Code splitting for optional features

### Storage Optimizations
- IndexedDB for large datasets with better performance
- Batched localStorage updates to prevent blocking
- Automatic cleanup of old cached data
- Compressed notification storage

### Network Optimizations
- Service worker ready for future PWA features
- Efficient API calls with request deduplication
- Background sync when connection restored
- Lazy loading of optional components

## 🧪 Testing Strategy

### Component Testing
```bash
npm run test        # Run all tests
npm run test:watch  # Watch mode for development
npm run test:coverage # Coverage report
```

### Browser Testing
- Chrome, Firefox, Safari, Edge support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Notification API compatibility testing
- Offline functionality verification

## 🚀 Deployment

### Static Hosting
Compatible with any static hosting service:
- Vercel, Netlify, Firebase Hosting
- GitHub Pages, AWS S3 + CloudFront
- Traditional web servers with SPA routing

### PWA Ready
Architecture supports Progressive Web App features:
- Service worker integration ready
- Manifest file can be added
- Offline-first approach implemented

## 🔮 Future Enhancements

### Planned Features
- [ ] PWA with service worker for true offline support
- [ ] Push notifications via service worker
- [ ] Calendar integration for meeting scheduling
- [ ] Custom timezone aliases and grouping
- [ ] Export timezone data (CSV, JSON)
- [ ] Widget/embed mode for other websites

### Technical Improvements
- [ ] React Server Components migration
- [ ] Advanced caching strategies
- [ ] Performance monitoring integration
- [ ] Automated accessibility testing
- [ ] E2E testing with Playwright

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- TypeScript strict mode enabled
- ESLint configuration enforced
- Prettier for consistent formatting
- Conventional commits preferred

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Shadcn/UI** for the beautiful component library
- **Lucide** for the comprehensive icon set
- **Tailwind CSS** for the utility-first approach
- **React Team** for the excellent framework
- **Vite Team** for the blazing-fast build tool

---

**Made with ❤️ by [@sb_creations](https://x.com/sb_creations)**

*World Time Windows - Making global time tracking beautiful and accessible.*
