# Smiley Food - Complete Technology Stack

## 🚀 Overview

Smiley Food is a modern full-stack web application built with React and Node.js, featuring a vibrant design and smooth animations for ordering ice cream, patties, and shakes.

## 📋 Prerequisites

Before running the application locally, ensure you have:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Git**: For version control (optional)

## 🛠️ Technology Stack

### Frontend Technologies

| Technology        | Version  | Purpose                                                |
| ----------------- | -------- | ------------------------------------------------------ |
| **React**         | ^18.3.1  | Core UI framework with hooks and functional components |
| **TypeScript**    | ^5.5.3   | Type safety and better development experience          |
| **Vite**          | ^5.4.2   | Fast build tool and development server                 |
| **Tailwind CSS**  | ^3.4.1   | Utility-first CSS framework for styling                |
| **Framer Motion** | ^11.0.0  | Animation library for smooth transitions               |
| **Lucide React**  | ^0.344.0 | Modern icon library                                    |
| **PostCSS**       | ^8.4.35  | CSS processing tool                                    |
| **Autoprefixer**  | ^10.4.18 | CSS vendor prefixing                                   |

### Backend Technologies

| Technology     | Version    | Purpose                                  |
| -------------- | ---------- | ---------------------------------------- |
| **Node.js**    | Latest LTS | JavaScript runtime environment           |
| **Express.js** | ^4.18.2    | Web application framework                |
| **CORS**       | ^2.8.5     | Cross-Origin Resource Sharing middleware |
| **Nodemon**    | ^3.0.2     | Development server auto-restart          |

### Development Tools

| Tool                  | Version | Purpose                                 |
| --------------------- | ------- | --------------------------------------- |
| **ESLint**            | ^9.9.1  | Code linting and quality                |
| **TypeScript ESLint** | ^8.3.0  | TypeScript-specific linting rules       |
| **Concurrently**      | ^8.2.2  | Run multiple npm scripts simultaneously |

## 📁 Project Structure

```
smiley-food/
├── 📁 server/                    # Backend application
│   ├── 📄 package.json          # Backend dependencies
│   ├── 📄 package-lock.json     # Backend dependency lock
│   └── 📄 server.js             # Express server with API routes
├── 📁 src/                      # Frontend source code
│   ├── 📄 App.tsx               # Main React component
│   ├── 📄 main.tsx              # React entry point
│   ├── 📄 index.css             # Global styles and Tailwind imports
│   └── 📄 vite-env.d.ts         # Vite type definitions
├── 📄 index.html                # HTML template
├── 📄 package.json              # Frontend dependencies and scripts
├── 📄 package-lock.json         # Frontend dependency lock
├── 📄 vite.config.ts            # Vite configuration
├── 📄 tailwind.config.js        # Tailwind CSS configuration
├── 📄 postcss.config.js         # PostCSS configuration
├── 📄 tsconfig.json             # TypeScript configuration
├── 📄 tsconfig.app.json         # App-specific TypeScript config
├── 📄 tsconfig.node.json        # Node-specific TypeScript config
├── 📄 eslint.config.js          # ESLint configuration
├── 📄 README.md                 # Project documentation
└── 📄 TECH_STACK.md             # This file
```

## 🔧 Local Setup Instructions

### Step 1: Clone or Download the Project

```bash
# If using Git
git clone <repository-url>
cd smiley-food

# Or download and extract the project files
```

### Step 2: Install Frontend Dependencies

```bash
# Install main project dependencies
npm install
```

### Step 3: Install Backend Dependencies

```bash
# Navigate to server directory and install dependencies
cd server
npm install
cd ..
```

### Step 4: Start Development Servers

You have three options to start the application:

#### Option A: Start Both Servers Concurrently (Recommended)

```bash
npm run dev
```

#### Option B: Start Servers Separately

```bash
# Terminal 1: Start backend server
npm run server:dev

# Terminal 2: Start frontend (in a new terminal)
npm run client:dev
```

#### Option C: Manual Start

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend (in a new terminal)
npm run client:dev
```

### Step 5: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Endpoints**:
  - GET http://localhost:5000/api/menu
  - POST http://localhost:5000/api/orders

## 📦 Detailed Dependencies

### Frontend Dependencies (`package.json`)

```json
{
  "dependencies": {
    "lucide-react": "^0.344.0", // Modern icon library
    "react": "^18.3.1", // Core React library
    "react-dom": "^18.3.1", // React DOM rendering
    "framer-motion": "^11.0.0" // Animation library
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1", // ESLint core
    "@types/react": "^18.3.5", // React TypeScript types
    "@types/react-dom": "^18.3.0", // React DOM TypeScript types
    "@vitejs/plugin-react": "^4.3.1", // Vite React plugin
    "autoprefixer": "^10.4.18", // CSS autoprefixer
    "eslint": "^9.9.1", // Code linting
    "eslint-plugin-react-hooks": "^5.1.0-rc.0", // React hooks linting
    "eslint-plugin-react-refresh": "^0.4.11", // React refresh linting
    "globals": "^15.9.0", // Global variables for ESLint
    "postcss": "^8.4.35", // CSS processing
    "tailwindcss": "^3.4.1", // Utility-first CSS framework
    "typescript": "^5.5.3", // TypeScript compiler
    "typescript-eslint": "^8.3.0", // TypeScript ESLint rules
    "vite": "^5.4.2", // Build tool and dev server
    "concurrently": "^8.2.2" // Run multiple scripts
  }
}
```

### Backend Dependencies (`server/package.json`)

```json
{
  "dependencies": {
    "express": "^4.18.2", // Web application framework
    "cors": "^2.8.5" // Cross-Origin Resource Sharing
  },
  "devDependencies": {
    "nodemon": "^3.0.2" // Auto-restart development server
  }
}
```

## 🎨 Design System

### Color Palette

```css
Primary Colors:
- Orange: #f97316 (main brand color)
- Pink: #ec4899 (secondary brand color)
- Yellow: #fbbf24 (accent color)

Gradients:
- Hero: from-orange-400 via-pink-400 to-yellow-400
- Buttons: from-orange-500 to-pink-500
- Text: from-orange-500 to-pink-500

Neutral Colors:
- White: #ffffff (backgrounds, cards)
- Gray-50: #f9fafb (light backgrounds)
- Gray-600: #4b5563 (body text)
- Gray-800: #1f2937 (headings)
```

### Typography

```css
Headings:
- Font: Poppins (400, 500, 600, 700, 800)
- Sizes: text-4xl to text-7xl

Body Text:
- Font: Inter (300, 400, 500, 600, 700)
- Sizes: text-sm to text-xl

Line Heights:
- Headings: 120% (tight)
- Body: 150% (relaxed)
```

### Spacing System

```css
Consistent 8px spacing system:
- p-2 (8px), p-4 (16px), p-6 (24px), p-8 (32px)
- m-2 (8px), m-4 (16px), m-6 (24px), m-8 (32px)
- gap-4 (16px), gap-6 (24px), gap-8 (32px)
```

## 🔌 API Endpoints

### GET /api/menu

**Purpose**: Retrieve all menu items
**Response**:

```json
{
  "success": true,
  "data": {
    "all": [...],
    "categories": {
      "softy": [...],
      "patties": [...],
      "shakes": [...]
    }
  }
}
```

### POST /api/orders

**Purpose**: Submit a new order
**Request Body**:

```json
{
  "name": "Customer Name",
  "phone": "+1234567890",
  "items": [
    {
      "id": 1,
      "name": "Product Name",
      "price": 4.99,
      "quantity": 2
    }
  ],
  "specialRequests": "Optional instructions"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Order received successfully!",
  "orderId": 1,
  "data": { ... }
}
```

### GET /api/orders

**Purpose**: Retrieve all orders (admin endpoint)

## 🎯 Key Features

### Frontend Features

- **Responsive Design**: Mobile-first with breakpoints at 768px and 1024px
- **Smooth Animations**: Framer Motion for page transitions and micro-interactions
- **Interactive Menu**: Category filtering with add-to-cart functionality
- **Shopping Cart**: Real-time cart updates with quantity management
- **Form Validation**: Client-side validation for order form
- **Loading States**: Beautiful loading animation with bouncing smiley
- **Scroll Navigation**: Smooth scrolling between sections
- **Hover Effects**: Interactive cards and buttons with scale animations

### Backend Features

- **RESTful API**: Clean API structure with proper HTTP methods
- **CORS Support**: Cross-origin requests enabled for frontend
- **Order Management**: In-memory storage for demonstration
- **Menu Management**: Categorized menu items with detailed information
- **Error Handling**: Proper error responses and validation

## 🚀 Available Scripts

### Frontend Scripts

```bash
npm run dev          # Start both frontend and backend
npm run client:dev   # Start frontend only (port 5173)
npm run server:dev   # Start backend only (port 5000)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Backend Scripts

```bash
cd server
npm start            # Start production server
npm run dev          # Start development server with nodemon
```

## 🌐 Environment Configuration

### Development URLs

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **API Base**: http://localhost:5000/api

### Vite Proxy Configuration

The frontend is configured to proxy API requests to the backend during development:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
}
```

## 🎨 Animation Details

### Framer Motion Animations

- **Page Load**: Staggered animations for menu items
- **Scroll Animations**: Elements animate in when they come into view
- **Hover Effects**: Scale and shadow animations on interactive elements
- **Loading**: Bouncing and rotating smiley icon
- **Form Submission**: Success state animations

### CSS Transitions

- **Navbar**: Background blur and shadow on scroll
- **Cards**: Transform and shadow changes on hover
- **Buttons**: Scale animations on click and hover

## 🔧 Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```bash
   # Kill processes on ports 5000 and 5173
   npx kill-port 5000 5173
   ```

2. **Dependencies Not Installing**

   ```bash
   # Clear npm cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Backend Not Responding**

   ```bash
   # Check if backend is running
   curl http://localhost:5000/api/menu
   ```

4. **Frontend Build Issues**
   ```bash
   # Clear Vite cache
   rm -rf node_modules/.vite
   npm run dev
   ```

## 📱 Responsive Breakpoints

```css
Mobile: < 768px
- Single column layout
- Stacked navigation menu
- Full-width cards

Tablet: 768px - 1024px
- Two-column grid for menu
- Horizontal navigation
- Optimized spacing

Desktop: > 1024px
- Three-column grid for menu
- Full navigation bar
- Maximum content width: 1280px
```

## 🎯 Performance Optimizations

- **Image Optimization**: Pexels images with compression and proper sizing
- **Lazy Loading**: Images load as they come into viewport
- **Code Splitting**: Vite handles automatic code splitting
- **CSS Purging**: Tailwind removes unused styles in production
- **Font Loading**: Preconnect to Google Fonts for faster loading

## 🔐 Security Features

- **CORS Configuration**: Properly configured for development
- **Input Validation**: Form validation on both client and server
- **XSS Protection**: React's built-in XSS protection
- **Content Security**: Proper meta tags and security headers

## 🚀 Production Deployment

### Frontend Deployment

```bash
npm run build
# Deploy the 'dist' folder to any static hosting service
```

### Backend Deployment

```bash
cd server
# Deploy the server folder to any Node.js hosting platform
```

### Environment Variables for Production

```env
# Backend
PORT=5000
NODE_ENV=production

# Frontend (if needed)
VITE_API_URL=https://your-backend-url.com
```

## 📊 Bundle Analysis

### Frontend Bundle Size (approximate)

- **React + React DOM**: ~45KB gzipped
- **Framer Motion**: ~35KB gzipped
- **Lucide React**: ~15KB gzipped (tree-shaken)
- **Total JS Bundle**: ~95KB gzipped

### Backend Dependencies

- **Express**: Lightweight web framework
- **CORS**: Minimal middleware for cross-origin requests
- **Total**: Very lightweight backend footprint

## 🎨 Design Tokens

### Spacing Scale (8px base)

```css
xs: 4px   (0.5)
sm: 8px   (1)
md: 16px  (2)
lg: 24px  (3)
xl: 32px  (4)
2xl: 48px (6)
3xl: 64px (8)
```

### Border Radius

```css
sm: 4px
md: 8px
lg: 16px
xl: 24px
2xl: 32px
```

### Shadow System

```css
sm: 0 1px 2px rgba(0,0,0,0.05)
md: 0 4px 6px rgba(0,0,0,0.07)
lg: 0 10px 15px rgba(0,0,0,0.1)
xl: 0 20px 25px rgba(0,0,0,0.15)
```

## 🔄 Development Workflow

1. **Start Development**

   ```bash
   npm run dev
   ```

2. **Make Changes**

   - Frontend changes auto-reload via Vite HMR
   - Backend changes auto-restart via Nodemon

3. **Test Features**

   - Browse menu categories
   - Add items to cart
   - Submit orders via contact form
   - Check responsive design

4. **Build for Production**
   ```bash
   npm run build
   ```

## 📋 Feature Checklist

### ✅ Completed Features

- [x] Responsive one-page design
- [x] Hero section with animated logo
- [x] Interactive menu with categories
- [x] Shopping cart functionality
- [x] Order form with validation
- [x] About section with statistics
- [x] Customer testimonials
- [x] Contact information
- [x] Smooth scroll navigation
- [x] Loading animations
- [x] Hover effects and micro-interactions
- [x] Mobile-optimized design
- [x] Backend API with menu and orders
- [x] CORS configuration
- [x] Error handling

### 🔮 Potential Enhancements

- [ ] Payment integration (Stripe)
- [ ] Real database (PostgreSQL/MongoDB)
- [ ] User authentication
- [ ] Order tracking
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Push notifications
- [ ] Inventory management
- [ ] Analytics dashboard
- [ ] Multi-language support

## 🐛 Known Limitations

1. **Data Persistence**: Orders are stored in memory and reset on server restart
2. **Authentication**: No user authentication system implemented
3. **Payment**: No payment processing integration
4. **Real-time Updates**: No WebSocket or real-time order updates
5. **Image Storage**: Uses external Pexels URLs (not local storage)

## 📞 Support

If you encounter any issues:

1. Check that Node.js version is 18+ (`node --version`)
2. Ensure all dependencies are installed (`npm install` in both root and server directories)
3. Verify ports 5000 and 5173 are available
4. Check browser console for any JavaScript errors
5. Verify backend is responding at http://localhost:5000/api/menu

## 🎉 Success Indicators

When everything is working correctly, you should see:

- ✅ Beautiful loading animation with bouncing smiley
- ✅ Vibrant hero section with gradient background
- ✅ Interactive menu with smooth category switching
- ✅ Working add-to-cart functionality
- ✅ Responsive design on all screen sizes
- ✅ Smooth animations throughout the app
- ✅ Successful order submission with backend integration
