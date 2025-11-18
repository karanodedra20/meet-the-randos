# Meet the Randos 🎭 

A high-performance Angular application for browsing and managing large user datasets (5000+ users) with advanced features like virtual scrolling, Web Worker-based grouping, real-time search, filtering, and dark mode.

Built with Angular 18, TypeScript, and modern web technologies to demonstrate performance optimization techniques for handling large datasets in the browser.

Live: https://meet-the-randos.netlify.app/

## ✨ Key Features

- 🚀 **Virtual Scrolling** - Smooth rendering of 5000+ users (only ~50 DOM nodes)
- ⚡ **Web Workers** - Non-blocking grouping operations
- 🔍 **Real-Time Search** - Instant filtering across multiple fields
- 📊 **Multiple Grouping** - Alphabetical, Age Ranges, Nationality
- 🎨 **Dark Mode** - System preference detection with persistence
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔄 **Pagination Mode** - Toggle between virtual scroll and traditional pages
- ✨ **Expandable Cards** - Click to reveal detailed user information

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Navigate to `http://localhost:4200/` - the app will automatically reload on file changes.

### Available Commands

| Command                 | Description                               |
| ----------------------- | ----------------------------------------- |
| `npm start`             | Start dev server at http://localhost:4200 |
| `npm run build`         | Build for production (outputs to `dist/`) |
| `npm test`              | Run unit tests with Jest                  |
| `npm run test:watch`    | Run tests in watch mode                   |
| `npm run test:coverage` | Generate test coverage report             |

## 🏗️ Tech Stack

- **Angular 18** - Signals, Standalone Components, OnPush Change Detection
- **TypeScript** - Full type safety
- **Angular CDK** - Virtual scrolling
- **Web Workers** - Parallel computation
- **RxJS** - HTTP and async operations
- **SCSS** - Theming and styling

### Project Structure

```
src/app/
├── components/         # UI components
├── services/          # Business logic (users, grouping, stats, toast)
├── workers/           # Web Worker for grouping
├── models/            # TypeScript interfaces
└── styles/            # Global styles and theme
```

## 📖 Usage

### Grouping

Click the grouping buttons in the header to organize users by:

- **Alphabetical** (A-Z)
- **Age Ranges** (18-25, 26-35, 36-45, 46-55, 56-65, 66+)
- **Nationality** (by country)

### Searching & Filtering

- **Search bar** - Filter by name, email, or username
- **Gender dropdown** - Filter by gender
- **Nationality dropdown** - Filter by country
- All filters work together in real-time

### Other Features

- **Expandable Cards** - Click any user card to see full details
- **Dark Mode** - Toggle theme with the switch in header (auto-detects system preference)
- **Pagination Toggle** - Switch between virtual scroll and traditional pagination

## 🧪 Testing

```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Generate coverage report
```

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers

---

**Built with Angular 18 and modern web performance techniques** 🚀
