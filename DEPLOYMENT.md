# Deployment Guide

This guide will help you deploy the Smiley Food App to production using **Netlify** (frontend) and **Render** (backend).

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] GitHub/GitLab repository with your code
- [ ] Accounts created:
  - [ ] [Netlify](https://netlify.com) for frontend
  - [ ] [Render](https://render.com) for backend and database
  - [ ] [Twilio](https://twilio.com) for SMS/OTP
- [ ] Generated VAPID keys for push notifications (`npx web-push generate-vapid-keys`)
- [ ] Generated secure JWT secret (min 32 characters)
- [ ] Tested the application locally
- [ ] Run `npm audit` to check for vulnerabilities
- [ ] Reviewed and updated all configuration files

## � Deployment Steps

### Step 1: Deploy Backend to Render

#### Option A: Using Blueprint (Recommended)

1. **Push your code to GitHub/GitLab**
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

2. **Deploy via Render Dashboard**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your repository
   - Render will automatically detect `render.yaml` and create:
     - PostgreSQL database
     - Web service (backend)
   - Click "Apply" to start deployment

3. **Set sensitive environment variables**
   After deployment, go to your web service and set:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`
   - `TWILIO_VERIFY_SERVICE_SID`
   - `VAPID_PUBLIC_KEY`
   - `VAPID_PRIVATE_KEY`
   - `FRONTEND_URL` (your Netlify URL - update after frontend deployment)

4. **Note your backend URL**
   - Example: `https://smiley-food-backend.onrender.com`

#### Option B: Manual Deployment

1. **Create PostgreSQL Database**
   - Go to Render Dashboard → "New" → "PostgreSQL"
   - Name: `smiley-food-db`
   - Plan: Free (or choose paid plan)
   - Click "Create Database"
   - Copy the "Internal Database URL"

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your repository
   - Configure:
     - **Name**: `smiley-food-backend`
     - **Region**: Choose closest to your users
     - **Branch**: `main`
     - **Root Directory**: Leave empty (or `.` if monorepo)
     - **Runtime**: Node
     - **Build Command**: `cd server && npm install`
     - **Start Command**: `cd server && npm start`
     - **Plan**: Free (or choose paid plan)

3. **Set environment variables** (in "Environment" tab):
   ```
   NODE_ENV=production
   PORT=10000
   HOST=0.0.0.0
   POSTGRES_URI=<paste-internal-database-url>
   JWT_SECRET=<generate-secure-random-string>
   TWILIO_ACCOUNT_SID=<your-twilio-sid>
   TWILIO_AUTH_TOKEN=<your-twilio-token>
   TWILIO_PHONE_NUMBER=<your-twilio-number>
   TWILIO_VERIFY_SERVICE_SID=<your-verify-sid>
   VAPID_PUBLIC_KEY=<your-vapid-public-key>
   VAPID_PRIVATE_KEY=<your-vapid-private-key>
   FRONTEND_URL=https://your-site.netlify.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL

### Step 2: Deploy Frontend to Netlify

#### Deploy via Netlify Dashboard

1. **Go to [Netlify](https://app.netlify.com)**
   - Click "Add new site" → "Import an existing project"

2. **Connect your repository**
   - Choose GitHub/GitLab/Bitbucket
   - Select your repository
   - Authorize Netlify

3. **Configure build settings**
   - Netlify should auto-detect settings from `netlify.toml`:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
     - **Base directory**: Leave empty

4. **Set environment variables**
   - Go to "Site settings" → "Environment variables"
   - Add variable:
     - **Key**: `VITE_API_BASE_URL`
     - **Value**: `https://your-backend.onrender.com` (your Render backend URL)

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Note your Netlify URL (e.g., `https://your-site.netlify.app`)

6. **Update backend CORS**
   - Go back to Render dashboard
   - Update `FRONTEND_URL` environment variable with your Netlify URL
   - Trigger a manual deploy to apply changes

#### Deploy via Netlify CLI (Alternative)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy from project root
netlify deploy --prod

# Follow prompts:
# - Create & configure new site: Yes
# - Build command: npm run build
# - Publish directory: dist
```

### Step 3: Verify Deployment

1. **Test backend health**
   ```bash
   curl https://your-backend.onrender.com/api/store/settings
   ```

2. **Test frontend**
   - Visit your Netlify URL
   - Check browser console for errors
   - Test API connections

3. **Check CORS**
   - Open browser DevTools
   - Look for CORS errors
   - Ensure `FRONTEND_URL` is correctly set on backend

## 🗄️ Database Management

### Initialize Database

After deploying, your database will be empty. You need to initialize it:

1. **Connect to Render Shell**
   - Go to Render Dashboard → Your Web Service
   - Click "Shell" tab
   - Run initialization commands:
   ```bash
   cd server
   node scripts/resetDatabase.js  # If you have this script
   # Or run migrations manually
   ```

2. **Access via psql (Alternative)**
   - Get connection string from Render Dashboard → Database
   - Run locally:
   ```bash
   psql <your-external-database-url>
   # Database tables will be auto-created by Sequelize on first server start
   ```

3. **Run seed scripts (if available)**
   ```bash
   # In Render Shell
   cd server
   node scripts/seedMenuItems.js  # If you have seed data
   ```

### Database Backups

Render automatically backs up your database (even on free tier):
- Go to Database → Backups tab
- Manual backups available on paid plans
- Automatic daily backups on paid plans

## 🔐 Environment Variables Reference

### Required for Netlify (Frontend)
| Variable | Example | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `https://your-app.onrender.com` | Your Render backend URL |

### Required for Render (Backend)
| Variable | Example | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `10000` | Server port (Render default) |
| `HOST` | `0.0.0.0` | Server host |
| `POSTGRES_URI` | `postgresql://user:pass@host/db` | Database connection string |
| `JWT_SECRET` | `<32+ char random string>` | JWT signing key |
| `TWILIO_ACCOUNT_SID` | `ACxxxxxxxx` | From Twilio Console |
| `TWILIO_AUTH_TOKEN` | `xxxxxxxx` | From Twilio Console |
| `TWILIO_PHONE_NUMBER` | `+1234567890` | Your Twilio number |
| `TWILIO_VERIFY_SERVICE_SID` | `VAxxxxxxxx` | Twilio Verify Service |
| `VAPID_PUBLIC_KEY` | `<base64 string>` | From `npx web-push generate-vapid-keys` |
| `VAPID_PRIVATE_KEY` | `<base64 string>` | From `npx web-push generate-vapid-keys` |
| `FRONTEND_URL` | `https://your-site.netlify.app` | Your Netlify URL for CORS |

### Generating Secure Values

**JWT Secret** (32+ characters):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**VAPID Keys** (for push notifications):
```bash
npx web-push generate-vapid-keys
```

## 🔧 Post-Deployment Checklist

### Testing
- [ ] Test backend API health endpoint
- [ ] Test frontend loads correctly
- [ ] User registration and login works
- [ ] Menu items display correctly
- [ ] Add to cart functionality
- [ ] Order placement works
- [ ] Admin login and dashboard access
- [ ] Push notifications (if enabled)
- [ ] SMS/OTP verification (if using Twilio)
- [ ] Payment processing (if integrated)

### Monitoring & Logging
- [ ] Set up error tracking (Sentry, Rollbar, etc.)
- [ ] Configure uptime monitoring (UptimeRobot, Pingdom)
- [ ] Enable Render metrics dashboard
- [ ] Set up email alerts for service downtime
- [ ] Review application logs regularly

### Security
- [ ] HTTPS enabled (automatic on Netlify & Render)
- [ ] CORS configured for production domains only
- [ ] All secrets are in environment variables (not code)
- [ ] JWT secret is secure and random
- [ ] Database credentials are secure
- [ ] No sensitive data in logs
- [ ] Rate limiting configured on API routes
- [ ] SQL injection prevention (using Sequelize ORM)

### Performance
- [ ] Frontend assets are minified and cached
- [ ] Images are optimized
- [ ] Database indexes are in place
- [ ] API response times are acceptable
- [ ] Consider CDN for static assets (Cloudflare, etc.)

### Backups
- [ ] Database backups enabled on Render
- [ ] Test database restoration process
- [ ] Consider offsite backup storage for critical data

## � Continuous Deployment

Both Netlify and Render support automatic deployments from Git:

### Netlify Auto-Deploy
- Automatically deploys when you push to your main branch
- Create a `develop` branch for staging deployments
- Configure deploy previews for pull requests
- Branch deploys: Create `staging` branch for testing

### Render Auto-Deploy
- Automatically redeploys backend when you push to main
- Configure in Render Dashboard → Settings → Build & Deploy
- Enable "Auto-Deploy" from your main branch
- Set up deploy hooks for manual triggers

### Deployment Workflow
1. Develop locally and test
2. Push to feature branch
3. Create pull request
4. Review deploy preview on Netlify
5. Merge to main branch
6. Automatic deployment to production

## 🐛 Troubleshooting

### Common Issues

**Frontend can't connect to backend**
- Check `VITE_API_BASE_URL` is set correctly on Netlify
- Verify backend is running (visit backend URL in browser)
- Check CORS errors in browser console
- Ensure `FRONTEND_URL` is set correctly on Render

**Database connection fails**
- Verify `POSTGRES_URI` is set correctly
- Check Render database is running
- Ensure IP allowlist includes Render services
- Test connection from Render Shell

**Build fails on Netlify**
- Check build logs for errors
- Ensure `npm run build` works locally
- Verify Node version matches (set in `netlify.toml`)
- Check for missing dependencies

**Server crashes on Render**
- Check Render logs for error messages
- Verify all required environment variables are set
- Ensure database is accessible
- Check for memory/resource limits on free tier

**CORS errors**
- Verify `FRONTEND_URL` matches your Netlify domain
- Check browser console for specific CORS error
- Ensure backend CORS is configured correctly
- Test with curl: `curl -H "Origin: https://your-site.netlify.app" https://your-backend.onrender.com/api/store/settings`

### Getting Help
- Render Community: https://community.render.com
- Netlify Support: https://answers.netlify.com
- Check application logs in respective dashboards
- Review this deployment guide

## 📊 Monitoring & Maintenance

### Render Metrics
- Go to your web service → Metrics tab
- Monitor CPU, memory, and request metrics
- Set up alerts for high resource usage
- Track response times and error rates

### Netlify Analytics (Optional Paid Feature)
- Server-side analytics without JavaScript
- Page views, unique visitors, bandwidth
- Top pages and traffic sources

### Free Monitoring Tools
- **UptimeRobot**: Monitor uptime and get alerts
- **Google Analytics**: Track user behavior
- **Sentry**: Error tracking and performance monitoring
- **LogRocket**: Session replay and error tracking

### Database Maintenance

```bash
# Backup via psql (use external connection URL from Render)
pg_dump <EXTERNAL_DATABASE_URL> > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
psql <EXTERNAL_DATABASE_URL> < backup_file.sql

# Or use Render Dashboard → Database → Backups tab
```

## 🚀 Scaling & Performance

### Render Scaling Options
- **Free Tier**: Spins down after 15 min of inactivity (cold starts ~30s)
- **Starter**: $7/month, always on, faster startup
- **Standard/Pro**: More CPU/RAM, autoscaling, zero-downtime deploys

### Database Scaling
- Free tier: 1GB storage, shared CPU
- Paid plans: More storage, dedicated CPU, read replicas
- Monitor slow queries in Render Dashboard
- Add indexes for frequently queried fields
- Use connection pooling (PgBouncer) for better performance

### Frontend Optimization
Netlify automatically provides:
- Global CDN distribution
- Asset optimization and compression
- Smart caching with instant invalidation
- Automatic HTTPS

Additional optimizations:
- Lazy load images and components
- Code splitting for large apps
- Optimize images before upload

## 🔒 Security Best Practices

- [ ] Never commit `.env` files to version control
- [ ] Use strong, random secrets (32+ characters minimum)
- [ ] Enable Render's DDoS protection
- [ ] Configure rate limiting on API endpoints
- [ ] Use HTTPS only (enforced by default on both platforms)
- [ ] Regularly update dependencies: `npm audit fix`
- [ ] Monitor security alerts on GitHub/Render dashboards
- [ ] Implement proper authentication and authorization
- [ ] Validate and sanitize all user inputs
- [ ] Use parameterized queries (Sequelize ORM handles this)
- [ ] Set up Web Application Firewall if needed (Cloudflare)

## 📞 Support & Resources

### Documentation
- [Netlify Documentation](https://docs.netlify.com/)
- [Render Documentation](https://render.com/docs)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
- [Express Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

### Community Support
- [Render Community Forum](https://community.render.com)
- [Netlify Support Forums](https://answers.netlify.com)
- [Project GitHub Issues](https://github.com/yourusername/smiley-food-app/issues)

### Optional Monitoring Services
- **Sentry**: Error tracking and performance monitoring
- **LogRocket**: Session replay and debugging
- **UptimeRobot**: Free uptime monitoring (99.9% SLA)
- **Google Analytics**: User behavior tracking
- **Hotjar**: User experience insights and heatmaps

---

## 🎉 Quick Reference

### Essential URLs After Deployment
```
Frontend:  https://your-site.netlify.app
Backend:   https://your-backend.onrender.com
Database:  Render Dashboard → Database → Connection Details
```

### View Logs
- **Netlify**: Site Settings → Deploys → [Select Deploy] → Deploy log
- **Render Backend**: Your Service → Logs tab (live tail)
- **Render Database**: Database → Logs tab

### Trigger Redeployment
```bash
# Frontend (Netlify) - just push to main branch
git push origin main

# Or use Netlify CLI
netlify deploy --prod

# Backend (Render) - push to main branch
git push origin main

# Or use Render Dashboard
# Go to: Your Service → Manual Deploy → "Deploy latest commit"
```

### Performance Testing
```bash
# Test backend response time
curl -w "\nTime: %{time_total}s\n" https://your-backend.onrender.com/api/store/settings

# Test frontend load time
curl -w "\nTime: %{time_total}s\n" https://your-site.netlify.app
```

---

**🎯 You're all set!** Your Smiley Food App is now ready for production deployment. Follow the steps above and you'll have a fully functional application running on Netlify and Render.

**Questions?** Check the troubleshooting section above or reach out via the support channels listed.
