# Smiley Food - Full-Stack Food Ordering App
[![Netlify Status](https://api.netlify.com/api/v1/badges/f718aa0c-9340-4e67-996c-83d35a318bd8/deploy-status)](https://app.netlify.com/projects/smileyfood/deploys)

A modern, responsive one-page web application for Smiley Food, featuring delicious soft serves, crispy patties, and refreshing shakes.

## Features

- **Modern React Frontend**: Built with React 18, TypeScript, and Tailwind CSS
- **Express.js Backend**: RESTful API for menu management and order processing
- **Responsive Design**: Mobile-first approach with smooth animations
- **Interactive Menu**: Category-based filtering with add-to-cart functionality
- **Order Management**: Complete ordering system with form validation
- **Framer Motion Animations**: Smooth transitions and micro-interactions
- **Loading States**: Beautiful loading animation with smiley icon

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for icons
- Vite for build tooling

### Backend
- Node.js with Express.js
- CORS for cross-origin requests
- In-memory storage for orders (demo purposes)

## Project Structure

```
smiley-food/
├── server/
│   ├── package.json
│   └── server.js
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smiley-food
   ```

2. **Install dependencies**
   ```bash
   # Install main dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   cd ..
   ```

3. **Start the development servers**
   ```bash
   # Start both frontend and backend concurrently
   npm run dev
   ```

   Or run them separately:
   ```bash
   # Terminal 1: Start backend server
   npm run server:dev
   
   # Terminal 2: Start frontend
   npm run client:dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## API Endpoints

### GET /api/menu
Returns all menu items categorized by type (softy, patties, shakes).

**Response:**
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
Creates a new order.

**Request Body:**
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
  "specialRequests": "Optional special instructions"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order received successfully!",
  "orderId": 1,
  "data": { ... }
}
```

### GET /api/orders
Returns all orders (admin endpoint for demonstration).

## Design Features

### Color Palette
- Primary: Orange gradient (#f97316 to #ea580c)
- Secondary: Pink gradient (#ec4899 to #db2777)
- Accent: Yellow (#fbbf24)
- Background: Warm gradients and soft pastels

### Typography
- **Headings**: Poppins (400-800 weight)
- **Body Text**: Inter (300-700 weight)

### Animations
- Loading spinner with bouncing smiley
- Smooth scroll navigation
- Hover effects on cards and buttons
- Staggered animations for menu items
- Micro-interactions throughout

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Development

### Scripts
- `npm run dev` - Start both frontend and backend
- `npm run client:dev` - Start frontend only
- `npm run server:dev` - Start backend only
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

### Environment Variables
No environment variables required for basic setup. The frontend is configured to proxy API requests to the backend during development.

## Production Deployment

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Deploy the backend**
   - Deploy the `server/` directory to your preferred hosting platform
   - Ensure Node.js runtime is available

3. **Deploy the frontend**
   - Deploy the `dist/` directory to a static hosting service
   - Update API endpoints to point to your production backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
