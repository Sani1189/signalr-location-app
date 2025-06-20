# LiveLocation Share

A real-time location sharing application built with modern web technologies, featuring WebSocket communication and interactive maps.

## 🚀 Features

### Location Sharing Methods
- **Current Location**: Send your exact GPS coordinates once
- **Live Tracking**: Continuous location updates every 5 seconds
- **Simulated Location**: Interactive map selection for testing

### Real-time Communication
- **WebSocket Integration**: SignalR for instant location updates
- **Mock Mode**: Fallback for testing without server connection
- **Auto-reconnection**: Automatic connection recovery

### Interactive Maps
- **Leaflet Integration**: High-quality interactive maps
- **Multiple Layers**: Street view and satellite imagery
- **Animated Markers**: Smooth location transitions
- **Place Detection**: Automatic city/country identification

### User Experience
- **Responsive Design**: Works on desktop and mobile
- **Dark Theme**: Modern black and white interface
- **Real-time Status**: Connection and tracking indicators
- **Error Handling**: Graceful fallbacks and user feedback

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling

### UI Components
- **shadcn/ui**: Modern component library
- **Lucide React**: Icon system
- **Custom Components**: Specialized location components

### Real-time Communication
- **SignalR**: Microsoft's real-time web framework
- **@microsoft/signalr**: JavaScript client library
- **WebSocket**: Primary transport protocol
- **Long Polling**: Fallback transport method

### Maps & Location
- **Leaflet**: Open-source mapping library
- **OpenStreetMap**: Map tile provider
- **Geolocation API**: Browser location services
- **Custom Place Detection**: Geographic region identification

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser with geolocation support

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd livelocation-share
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open in browser**
   \`\`\`
   http://localhost:3000
   \`\`\`

## 🔧 Configuration

### SignalR Hub URL
The application connects to a SignalR hub. Update the URL in:
- `components/user-a-sender.tsx`
- `components/user-b-receiver.tsx`

\`\`\`typescript
const SIGNALR_HUB_URL = "https://your-signalr-hub.com/Hub"
\`\`\`

### Environment Variables
No environment variables required for basic functionality.

## 📱 Usage

### Sending Locations

1. **Navigate to Sender Page**
   - Click "Start Sending" on home page
   - Enter your email address

2. **Choose Location Method**
   - **Current**: Get and send your GPS location
   - **Live**: Continuous tracking every 5 seconds  
   - **Simulated**: Select location on interactive map

3. **Send Location**
   - Click respective send button
   - Monitor connection status

### Receiving Locations

1. **Navigate to Receiver Page**
   - Click "Start Receiving" on home page
   - Wait for connection establishment

2. **View Location Updates**
   - Real-time map updates
   - Detailed location information
   - User tracking status

## 🔍 Features in Detail

### SignalR Integration
- Automatic connection management
- Reconnection on network issues
- Mock mode for offline testing
- Real-time bidirectional communication

### Location Services
- High-accuracy GPS positioning
- Coordinate validation
- Place name detection for 50+ countries
- Distance and movement tracking

### Map Features
- Interactive location selection
- Multiple map layers
- Smooth animations
- Custom markers and popups
- Zoom and pan controls

### Error Handling
- Connection failure recovery
- Geolocation permission handling
- Invalid coordinate validation
- User-friendly error messages


## 📈 Performance

- Lazy-loaded map components
- Optimized re-renders
- Efficient WebSocket usage
- Minimal bundle size

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request


