# 🍕 Smiley Food App

A modern, full-stack food ordering application built with React, Node.js, Express, and PostgreSQL. Features real-time order tracking, admin dashboard, payment integration, and push notifications.

## ✨ Features

### Customer Features
- 🔐 **Secure Authentication** - OTP-based login via Twilio SMS
- 🍽️ **Browse Menu** - View and search food items with detailed descriptions
- 🛒 **Shopping Cart** - Add, remove, and manage items in cart
- 💳 **Multiple Payment Options** - Support for various payment methods
- 📍 **Address Management** - Save and manage multiple delivery addresses
- 📱 **Push Notifications** - Real-time order status updates
- ⭐ **Reviews & Ratings** - Rate and review your orders
- 🎁 **Offers & Discounts** - View and apply promotional offers
- 📊 **Order History** - Track current and past orders

### Admin Features
- 📈 **Analytics Dashboard** - Real-time business metrics and charts
- 📦 **Order Management** - View and update order statuses
- 🍕 **Menu Management** - Add, edit, and manage menu items
- 👥 **User Management** - View and manage customer accounts
- 🎟️ **Offer Management** - Create and manage promotional offers
- 📊 **Inventory Tracking** - Monitor stock levels
- 🔔 **Admin Notifications** - SMS alerts for new orders and critical events
- 💰 **Payment Tracking** - Monitor payments and transactions

### Technical Features
- 🎨 **Modern UI** - Built with React, Tailwind CSS, and Framer Motion
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🔒 **Secure API** - JWT-based authentication and authorization
- 📡 **Real-time Updates** - WebSocket integration for live notifications
- 🗄️ **Database** - PostgreSQL with Sequelize ORM
- 🚀 **Performance** - Optimized with Vite for fast development and builds
- 🔔 **Service Workers** - PWA capabilities for offline support
- 📧 **Email Integration** - Nodemailer for email notifications

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18.3
- **Routing:** React Router DOM 7.8
- **Styling:** Tailwind CSS, Radix UI components
- **Animation:** Framer Motion
- **Charts:** Chart.js, React-ChartJS-2
- **Icons:** Lucide React, React Icons
- **Build Tool:** Vite
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Authentication:** JWT (jsonwebtoken), bcryptjs
- **SMS:** Twilio
- **Push Notifications:** web-push
- **File Upload:** Multer
- **Email:** Nodemailer

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/smiley-food-app.git
cd smiley-food-app
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration (see [Environment Variables](#environment-variables) section below).

### 4. Database Setup

```bash
# Create the database
createdb smiley

# Run migrations (if you have any)
cd server
npm run migrate
```

### 5. Start the Application

#### Development Mode (Full Stack)
```bash
npm run dev
```

This runs both the client (on `http://localhost:3000`) and server (on `http://localhost:5000`) concurrently.

#### Production Mode
```bash
# Build the client
npm run build

# Start the server
npm start
```

## 🔐 Environment Variables

### Required Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
HOST=0.0.0.0

# Frontend API URL
VITE_API_BASE_URL=http://localhost:5000

# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=smiley
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

# OR use connection URI (for cloud databases like Neon)
# POSTGRES_URI=postgresql://user:password@host:port/database

# JWT Authentication
JWT_SECRET=your_secure_jwt_secret_minimum_32_characters

# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid

# Push Notifications (VAPID Keys)
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key

# Admin Notifications
ADMIN_PHONE_1=+1234567890
ADMIN_PHONE_2=+1234567890

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### Generating VAPID Keys

For push notifications, generate VAPID keys:

```bash
npx web-push generate-vapid-keys
```

## 📁 Project Structure

```
smiley-food-app/
├── public/                  # Static files
│   ├── service-worker.js   # Service worker for PWA
│   └── images/             # Public images
├── server/                  # Backend application
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # Sequelize models
│   ├── routes/             # API routes
│   ├── services/           # Business logic services
│   ├── utils/              # Utility functions
│   └── server.js           # Server entry point
├── src/                     # Frontend application
│   ├── api/                # API client
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── routes/             # Route definitions
│   ├── services/           # Frontend services
│   ├── types/              # TypeScript types
│   └── main.tsx            # Frontend entry point
├── .env.example            # Example environment variables
├── .gitignore              # Git ignore rules
├── package.json            # Root dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── vite.config.ts          # Vite configuration
└── README.md               # This file
```

## 🔧 Available Scripts

### Root Directory

- `npm run dev` - Start both client and server in development mode
- `npm run client:dev` - Start only the client (Vite dev server)
- `npm run server:dev` - Start only the server (with nodemon)
- `npm run build` - Build the client for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm start` - Start the server in production mode

### Server Directory

- `npm start` - Start server (production)
- `npm run dev` - Start server with nodemon (development)

## 🔒 Security Best Practices

This project implements several security measures:

1. **Environment Variables** - All sensitive data stored in `.env` (never committed)
2. **JWT Authentication** - Secure token-based authentication
3. **Password Hashing** - bcryptjs for password encryption
4. **SQL Injection Prevention** - Sequelize ORM with parameterized queries
5. **CORS Protection** - Configured CORS policies
6. **Input Validation** - Server-side validation on all inputs
7. **Rate Limiting** - Implemented on authentication endpoints
8. **HTTPS** - Recommended for production deployments

## 📱 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP and login
- `GET /api/auth/me` - Get current user (requires auth)

### Menu Endpoints
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get single menu item
- `POST /api/menu` - Create menu item (admin)
- `PUT /api/menu/:id` - Update menu item (admin)
- `DELETE /api/menu/:id` - Delete menu item (admin)

### Order Endpoints
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status (admin)

For complete API documentation, see [API.md](./API.md).

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📦 Deployment

### Database Setup
1. Create a PostgreSQL database on your hosting platform (e.g., Neon, Supabase, Railway)
2. Update `POSTGRES_URI` or individual database environment variables
3. Run migrations if applicable

## 🚀 Production Deployment

This project is configured for deployment on:
- **Frontend**: Netlify (with `netlify.toml`)
- **Backend**: Render (with `render.yaml` blueprint)
- **Database**: Render PostgreSQL

### Quick Deploy

**📖 For complete step-by-step instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Deploy Backend on Render**
   - Connect repository and use Blueprint
   - Render will auto-create database and web service
   - Set sensitive environment variables

3. **Deploy Frontend on Netlify**
   - Connect repository (auto-detects `netlify.toml`)
   - Set `VITE_API_BASE_URL` to your Render backend URL
   - Deploy!

4. **Update CORS**
   - Set `FRONTEND_URL` on Render to your Netlify URL
   - Redeploy backend

### Production Checklist
- [ ] All environment variables configured on Netlify and Render
- [ ] JWT_SECRET is a secure random string (32+ characters)
- [ ] Database backups enabled on Render
- [ ] CORS configured with your actual Netlify domain
- [ ] Test authentication, orders, and payments
- [ ] Monitor logs for errors
- [ ] Set up uptime monitoring (UptimeRobot, etc.)

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Twilio](https://www.twilio.com/)
- All other open-source libraries used in this project

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

## 🐛 Known Issues

- Service worker may need manual update in some browsers
- Push notifications require HTTPS in production

## 🗺️ Roadmap

- [ ] Add unit and integration tests
- [ ] Implement payment gateway integration
- [ ] Add multi-language support
- [ ] Create mobile app versions (React Native)
- [ ] Add real-time chat support
- [ ] Implement loyalty program
- [ ] Add social media authentication

---

**Made with ❤️ using React and Node.js**
