# Deployment Guide

This guide will help you deploy the Smiley Food App to production.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Set up a PostgreSQL database (Neon, Supabase, Railway, etc.)
- [ ] Created accounts for required services:
  - [ ] Twilio (SMS/OTP)
  - [ ] VAPID keys for push notifications
- [ ] Configured all environment variables
- [ ] Tested the application locally
- [ ] Run `npm audit` to check for vulnerabilities
- [ ] Updated sensitive default values

## 🗄️ Database Setup

### Option 1: Neon (Recommended)

1. Sign up at [Neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Set `POSTGRES_URI` in your environment variables

### Option 2: Supabase

1. Sign up at [Supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings > Database
4. Copy the connection string (Pooler recommended for serverless)
5. Set `POSTGRES_URI` in your environment variables

### Option 3: Railway

1. Sign up at [Railway.app](https://railway.app)
2. Create new project > Add PostgreSQL
3. Copy connection details
4. Set individual `POSTGRES_*` variables

### Initialize Database

After setting up your database:

```bash
# Run migrations (if you have any)
cd server
npm run migrate

# Or manually run SQL to create tables
psql $POSTGRES_URI < schema.sql
```

## 🚀 Deployment Options

### Option A: Vercel (Frontend) + Railway (Backend)

#### Deploy Backend to Railway

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Create new project**
   ```bash
   cd server
   railway init
   ```

3. **Set environment variables**
   ```bash
   railway variables set JWT_SECRET="your_secure_secret"
   railway variables set POSTGRES_URI="your_database_uri"
   railway variables set TWILIO_ACCOUNT_SID="your_sid"
   # ... set all other variables from .env.example
   ```

4. **Deploy**
   ```bash
   railway up
   ```

5. **Note the deployment URL** (e.g., `https://your-app.railway.app`)

#### Deploy Frontend to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Set environment variable**
   Create `vercel.json` in root:
   ```json
   {
     "env": {
       "VITE_API_BASE_URL": "https://your-backend.railway.app"
     }
   }
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Option B: Render (Full Stack)

1. **Create Render account** at [Render.com](https://render.com)

2. **Deploy Backend:**
   - New > Web Service
   - Connect your GitHub repo
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add all environment variables

3. **Deploy Frontend:**
   - New > Static Site
   - Connect your GitHub repo
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Add environment variable: `VITE_API_BASE_URL=https://your-backend.onrender.com`

### Option C: Heroku

#### Deploy Backend

1. **Create Heroku app**
   ```bash
   heroku create smiley-food-api
   cd server
   ```

2. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

3. **Set environment variables**
   ```bash
   heroku config:set JWT_SECRET="your_secret"
   heroku config:set TWILIO_ACCOUNT_SID="your_sid"
   # ... set all other variables
   ```

4. **Create Procfile** in server directory:
   ```
   web: node server.js
   ```

5. **Deploy**
   ```bash
   git subtree push --prefix server heroku main
   ```

#### Deploy Frontend

Use Vercel or Netlify for frontend (see respective sections).

### Option D: VPS (DigitalOcean, Linode, AWS EC2)

1. **Set up server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib
   
   # Install Nginx
   sudo apt install nginx
   ```

2. **Clone and setup application**
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/smiley-food-app.git
   cd smiley-food-app
   
   # Install dependencies
   npm install
   cd server && npm install && cd ..
   
   # Copy and configure environment
   cp .env.example .env
   nano .env  # Edit with your values
   
   # Build frontend
   npm run build
   ```

3. **Set up PM2 for backend**
   ```bash
   sudo npm install -g pm2
   cd server
   pm2 start server.js --name smiley-api
   pm2 startup
   pm2 save
   ```

4. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/smiley-food
   ```
   
   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
   
       # Frontend
       location / {
           root /var/www/smiley-food-app/dist;
           try_files $uri $uri/ /index.html;
       }
   
       # Backend API
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/smiley-food /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **Set up SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## 🔐 Environment Variables Setup

### Backend (.env)
```bash
NODE_ENV=production
PORT=5000
POSTGRES_URI=your_production_database_uri
JWT_SECRET=your_very_secure_random_secret_minimum_32_chars
TWILIO_ACCOUNT_SID=your_production_sid
TWILIO_AUTH_TOKEN=your_production_token
TWILIO_PHONE_NUMBER=your_twilio_number
TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
ADMIN_PHONE_1=+1234567890
```

### Frontend
```bash
VITE_API_BASE_URL=https://your-backend-domain.com
```

## 🔧 Post-Deployment Steps

1. **Test all functionality:**
   - [ ] User registration/login
   - [ ] Menu browsing
   - [ ] Add to cart
   - [ ] Place order
   - [ ] Admin login
   - [ ] Admin dashboard
   - [ ] Push notifications

2. **Set up monitoring:**
   - Configure logging service (e.g., LogRocket, Sentry)
   - Set up uptime monitoring (e.g., UptimeRobot)
   - Configure error tracking

3. **Configure backups:**
   - Set up automated database backups
   - Store backups in secure location
   - Test backup restoration process

4. **Security:**
   - Enable HTTPS (use Let's Encrypt for free SSL)
   - Configure CORS for your domain only
   - Set up rate limiting
   - Enable security headers
   - Regular security audits

5. **Performance:**
   - Enable gzip compression
   - Set up CDN for static assets
   - Configure caching headers
   - Monitor performance metrics

## 📊 Monitoring & Maintenance

### Health Checks

Create a health check endpoint in your backend:

```javascript
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Log Management

- Use a logging service (Winston, Bunyan)
- Centralize logs (Papertrail, LogDNA)
- Set up alerts for errors
- Regularly review logs

### Database Maintenance

```bash
# Backup database (PostgreSQL)
pg_dump $POSTGRES_URI > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
psql $POSTGRES_URI < backup_file.sql
```

## 🔄 CI/CD Setup

### GitHub Actions (Already configured)

The project includes a CI workflow that:
- Runs linting
- Builds the application
- Runs security audit

To add deployment:

1. Add deployment secrets to GitHub:
   - Go to repo Settings > Secrets and variables > Actions
   - Add required secrets (API keys, tokens, etc.)

2. Extend `.github/workflows/ci.yml` with deployment steps

### GitLab CI/CD

Create `.gitlab-ci.yml`:

```yaml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist/

deploy:
  stage: deploy
  script:
    - # Add deployment commands
  only:
    - main
```

## 🚨 Troubleshooting

### Database Connection Issues
- Verify connection string format
- Check if database allows connections from your IP
- Ensure SSL is configured correctly

### Build Failures
- Check Node.js version compatibility
- Ensure all environment variables are set
- Review build logs for specific errors

### API Not Responding
- Check if server is running
- Verify firewall rules
- Check CORS configuration
- Review server logs

## 📞 Support

For deployment issues:
- Check deployment platform documentation
- Review application logs
- Open an issue on GitHub
- Contact maintainers

---

**Important:** Always test thoroughly in a staging environment before deploying to production!
