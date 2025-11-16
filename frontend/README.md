# 🎓 Math Kingdom - Frontend

An interactive educational math game for elementary students, built with Vue 3, TypeScript, and Pinia state management.

## 🎮 Features

- **Interactive Math Quests**: Learn counting, basic arithmetic, and problem-solving through guided activities
- **Avatar Customization**: Personalize your character with unlockable clothing, accessories, and pets
- **Room Decoration**: Customize your space with furniture rewards earned from completing quests
- **Progress Tracking**: Monitor your learning journey with detailed statistics, gems, and stars
- **Badge System**: Earn achievements as you master new mathematical concepts
- **Multi-User Support**: Switch between different learner profiles with individual progress tracking
- **Vocabulary Learning**: Build math-specific vocabulary with English-Bulgarian translations
- **Gamified Experience**: Level up system with rewards and visual feedback

### Educational Content

**Number Village Quests:**
1. **Cookie Counting Adventure** (Practice) - Learn to count 1-10 with tap-to-select interaction
2. **Zero Hero Quest** (Discovery) - Understand the concept of zero and empty sets

**Vocabulary Terms:**
- number, quantity, count
- zero, none, empty
- And more mathematical concepts

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+
- Modern web browser with localStorage support

### Installation

```bash
# Clone the repository
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build for production (TypeScript + Vite)
npm run preview      # Preview production build
npm test             # Run unit tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate test coverage report
```

### Building for Production

```bash
cd frontend
npm run build
# Output: dist/
```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── assets/          # Images and resources
│   ├── components/      # Vue components
│   │   ├── auth/        # Login and user switching
│   │   ├── quests/      # Quest-specific components
│   │   ├── rewards/     # Badges and rewards display
│   │   └── shared/      # Reusable UI components
│   ├── data/            # Static JSON data (quests, items, badges)
│   ├── router/          # Vue Router configuration
│   ├── services/        # LocalStorage service
│   ├── stores/          # Pinia state management
│   ├── types/           # TypeScript interfaces
│   ├── views/           # Page-level components
│   ├── App.vue          # Root component
│   └── main.ts          # Application entry point
├── tests/               # Unit tests
├── public/              # Static assets
├── .github/workflows/   # GitHub Actions CI/CD
└── package.json         # Dependencies and scripts
```

## 🎮 How to Use

### Creating an Account

1. Open the application
2. Click "Create New Account"
3. Enter a username and password (minimum 4 characters)
4. Start your adventure!

### Playing Quests

1. From the Dashboard, click on "Number Village"
2. Select a quest to begin
3. Follow Count Cat's instructions
4. Complete activities by tapping objects to select, then tapping the target, or selecting multiple-choice answers
5. Earn gems and stars upon completion

### Customizing Your Avatar

1. Click "Customize Avatar" from the Dashboard
2. Browse available items in the shop
3. Purchase items with your earned gems
4. Equip items to personalize your avatar

### Decorating Your Room

1. Click "Decorate Room" from the Dashboard
2. Purchase furniture with gems
3. Your owned furniture will appear in your room preview

## 💾 Data Storage

All data is stored locally in your browser using localStorage:

- **Users**: Multiple user accounts with hashed passwords
- **Progress**: Quest completion status and statistics
- **Rewards**: Earned badges and owned items
- **Stats**: Gems, stars, and level information

⚠️ **Note**: This is a demo application. Data is stored in your browser only and will be lost if you clear browser data.

## 🛠️ Technology Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **Language**: TypeScript (strict mode)
- **State Management**: Pinia
- **Routing**: Vue Router
- **Build Tool**: Vite
- **Testing**: Vitest
- **Storage**: Browser localStorage with caching layer
- **Styling**: Scoped CSS with responsive design
- **Deployment**: GitHub Pages (automated via GitHub Actions)

## 🧪 Testing

- **24 Unit Tests** covering storage, authentication, and state management
- **Test Coverage**: Services, stores, and business logic
- **Framework**: Vitest with in-source testing

```bash
npm test              # Run all tests
npm run test:coverage # View coverage report
```

Tests cover:
- Store functionality (auth, progress, rewards, userStats)
- LocalStorage service operations with caching
- Component behavior

## 🌐 Deployment

The application is automatically deployed to GitHub Pages when changes are pushed to the `master` branch via GitHub Actions.

### Manual Deployment

```bash
npm run build
# Deploy contents of dist/ folder to your hosting service
```

## 📱 Browser Compatibility

- Chrome/Edge: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported
- Mobile browsers: ✅ Mobile-first tap-to-select interaction (optimized for touch)

## 🔒 Security Note

⚠️ **Important**: This application uses client-side password hashing and localStorage for demo purposes only. For production use, implement proper backend authentication with secure credential storage.

- Passwords are hashed with SHA-256 (NOT production-grade security)
- All data is stored in localStorage (accessible via browser console)
- Not suitable for storing real user data
- For demo and educational purposes only

## ✨ Recent Improvements

- ✅ Refactored to mobile-first tap-to-select interaction pattern
- ✅ All touch targets meet 44x44px accessibility standards
- ✅ Replaced drag-and-drop with intuitive two-tap workflow
- ✅ Implemented localStorage caching layer for performance
- ✅ Added proper cleanup for timers and watchers
- ✅ Enhanced error handling across async operations
- ✅ Fixed TypeScript strict mode compliance
- ✅ Improved test isolation and coverage

## 🤝 Contributing

To add new content:

1. **New Quests**: Add to `src/data/quests.json`
2. **New Items**: Add to `src/data/items.json`
3. **New Badges**: Add to `src/data/badges.json`
4. **New Vocabulary**: Add to `src/data/vocabulary.json`

## 🎯 Roadmap

Future enhancements:
- More realms and quests (Operation Castle, Fraction Forest, etc.)
- Backend API integration
- Real authentication system
- Multiplayer features
- Advanced analytics and progress reports
- Mobile app

---

Built with ❤️ for young math learners
