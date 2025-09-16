# 😊 Smiley Food App

> Delicious Softy, Juicy Patties, Refreshing Shakes - Order fresh ice creams, snacks and beverages online!

A modern food delivery application built with React, TypeScript, and Express.js, featuring a beautiful UI for ordering ice cream, soft serves, patties, and refreshing beverages.

## 🚀 Features

- **Modern Web App**: Built with React 18, TypeScript, and Vite
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Full-Stack Solution**: Express.js backend with PostgreSQL database
- **Admin Dashboard**: Complete management system for inventory, orders, and analytics
- **Real-time Updates**: Live order tracking and notifications
- **Secure Authentication**: JWT-based user authentication
- **Payment Integration**: Ready for payment gateway integration

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **Radix UI** - Accessible component primitives

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **Sequelize** - Object-Relational Mapping (ORM)
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload handling
- **Twilio** - SMS notifications (optional)

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)
- **Git**

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Diwakar-odds/Smiley.git
cd Smiley
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install --legacy-peer-deps

# Install server dependencies
cd server
npm install
cd ..
```

### 3. Environment Setup
Create `.env` files for both client and server:

#### Client `.env` (root directory)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Smiley Food
```

#### Server `.env` (server directory)
```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
DATABASE_URL=postgresql://username:password@localhost:5432/smiley_food

# Optional: Twilio for SMS
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-phone
```

### 4. Database Setup
```bash
# Create database
createdb smiley_food

# Run migrations (if available)
cd server
npx sequelize-cli db:migrate
cd ..
```

### 5. Start Development Servers
```bash
# Start both client and server in development mode
npm run dev

# Or start them separately:
# Terminal 1 - Client (runs on port 3000)
npm run client:dev

# Terminal 2 - Server (runs on port 5000)
npm run server:dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
Smiley/
├── public/                 # Static assets
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   ├── api/               # API service functions
│   └── assets/            # Images, fonts, etc.
├── server/                # Backend source code
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── config/           # Configuration files
│   └── services/         # Business logic services
├── dist/                 # Production build output
└── docs/                 # Documentation (if any)
```

## 🔧 Available Scripts

### Root Package Scripts
```bash
npm run dev          # Start both client and server in development
npm run build        # Build the client for production
npm run preview      # Preview the production build
npm run lint         # Run ESLint on the codebase
npm start            # Start the production server
```

### Server Scripts
```bash
cd server
npm start            # Start production server
npm run dev          # Start development server with nodemon
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

### Areas for Contributions
- 🐛 **Bug Fixes**: Help us squash bugs
- ✨ **New Features**: Add new functionality
- 📚 **Documentation**: Improve docs and comments
- 🎨 **UI/UX**: Enhance the user interface
- 🧪 **Testing**: Add or improve tests
- ⚡ **Performance**: Optimize code and assets
- 🔒 **Security**: Improve security measures

## 🧪 Testing

Currently setting up testing infrastructure. Planned testing stack:
- **Unit Tests**: Jest/Vitest
- **Integration Tests**: Supertest for API
- **E2E Tests**: Playwright or Cypress

## 📊 Roadmap

- [ ] Add comprehensive testing suite
- [ ] Implement payment gateway integration
- [ ] Add real-time order tracking
- [ ] Mobile app development (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Progressive Web App (PWA) features

## 🐛 Known Issues

- Dependency conflicts with React Native packages (being resolved)
- ESLint configuration needs updating
- Some security vulnerabilities in dependencies

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Authors

- **Diwakar** - Initial work - [@Diwakar-odds](https://github.com/Diwakar-odds)

## 🙏 Acknowledgments

- Thanks to all contributors who help make this project better
- Built with love for the open source community
- Special thanks to the React and Node.js communities

## 📞 Support

If you have any questions or need help getting started:

1. Check the [Issues](https://github.com/Diwakar-odds/Smiley/issues) page
2. Create a new issue if your question isn't answered
3. Join our community discussions

---

**Happy Coding! 😊🍦**