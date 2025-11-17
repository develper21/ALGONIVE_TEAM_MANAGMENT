# Deployment Guide - Algonive Task Management System

This guide covers deploying the Algonive Task Management System for small teams. The application consists of a Node.js/Express backend with MongoDB and a React/Vite frontend.

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** database (MongoDB Atlas recommended for production)
- **Git** repository
- Domain name (optional but recommended)

## 🗂️ Project Structure

```
Algonive-Task-Management/
├── backend/                 # Node.js/Express API
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   ├── .env                # Environment variables
│   └── routes/             # API routes
├── frontend/               # React/Vite application
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.js      # Vite configuration
│   └── .env                # Frontend environment variables
└── docs/                   # Documentation
    └── deployment.md       # This file
```

## 🔧 Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/taskmanager

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.com

# Email Configuration (Optional - for notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Frontend (.env)

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=https://your-backend-domain.com
```

## 🚀 Deployment Options

### Option 1: Render (Recommended for Beginners)

#### Backend Deployment

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `algonive-backend`
     - **Root Directory**: `backend`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free (for testing) or Starter ($7/month)

3. **Add Environment Variables**
   - Go to "Environment" tab
   - Add all variables from backend `.env` file

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (usually 2-3 minutes)
   - Note your backend URL: `https://your-service.onrender.com`

#### Frontend Deployment (Netlify)

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Create New Site**
   - Click "Add new site" → "Import an existing project"
   - Select your repository
   - Configure:
     - **Build command**: `cd frontend && npm run build`
     - **Publish directory**: `frontend/dist`

3. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add: `VITE_API_URL` = your Render backend URL

4. **Deploy**
   - Click "Deploy site"
   - Your site will be live at `https://your-site.netlify.app`

---

### Option 2: Railway (Alternative to Render)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Go to "Settings" → "General"
   - Set **Root Directory** to `backend`
   - Add environment variables in "Variables" tab
   - Railway will auto-detect and deploy

3. **Deploy Frontend**
   - Go back to project settings
   - Click "New Service" → "Deploy from GitHub repo"
   - Select same repository
   - Set **Root Directory** to `frontend`
   - Add `VITE_API_URL` variable
   - Deploy

---

### Option 3: VPS Deployment (Advanced)

#### Server Setup (Ubuntu)

1. **Connect to Server**
   ```bash
   ssh root@your-server-ip
   ```

2. **Install Dependencies**
   ```bash
   apt update && apt upgrade -y
   apt install -y nodejs npm git nginx certbot python3-certbot-nginx
   ```

3. **Install PM2**
   ```bash
   npm install -g pm2
   ```

4. **Clone Repository**
   ```bash
   cd /var/www
   git clone <your-repo-url> algonive
   cd algonive
   ```

5. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   nano .env  # Add your environment variables
   ```

6. **Start Backend with PM2**
   ```bash
   pm2 start server.js --name algonive-backend
   pm2 save
   pm2 startup
   ```

7. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run build
   ```

8. **Configure Nginx**
   ```bash
   nano /etc/nginx/sites-available/algonive
   ```
   
   Add this configuration:
   ```nginx
   server {
       server_name your-domain.com;
       
       location / {
           root /var/www/algonive/frontend/dist;
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

9. **Enable Site and SSL**
   ```bash
   ln -s /etc/nginx/sites-available/algonive /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   certbot --nginx -d your-domain.com
   ```

---

## 🔍 Health Check

After deployment, verify everything is working:

1. **Backend Health Check**
   - Visit: `https://your-backend-url.com/api/health`
   - Should return: `{"success": true, "message": "Task Manager API is running"}`

2. **Frontend Loading**
   - Visit your frontend URL
   - Should load the login page

3. **API Connection**
   - Try to register/login
   - Should successfully connect to backend

## 📧 Email Configuration (Optional)

For email notifications:

1. **Gmail Setup**
   - Enable 2-factor authentication
   - Generate App Password
   - Use App Password in `EMAIL_PASS`

2. **Other Email Providers**
   - Update SMTP settings in `backend/utils/emailService.js`

## 🛠️ Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `FRONTEND_URL` matches your deployed frontend URL
   - Check that CORS origin is properly set in `server.js`

2. **Database Connection**
   - Verify MongoDB connection string
   - Ensure IP whitelist includes your deployment server

3. **Build Failures**
   - Check build logs for missing dependencies
   - Ensure all environment variables are set

4. **Email Not Working**
   - Verify email credentials
   - Check if App Password is used for Gmail

### Logs and Monitoring

- **Render**: Dashboard → Logs
- **Railway**: Service → Logs
- **VPS**: `pm2 logs algonive-backend`

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Backend to Render
        uses: johnbeynon/render-deploy-action@v0.0.8
        with:
          service-id: ${{ secrets.RENDER_BACKEND_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Frontend to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=frontend/dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 📊 Scaling Considerations

### When to Upgrade

- **Backend**: More than 100 concurrent users
- **Database**: More than 1GB data
- **Frontend**: High traffic needs CDN

### Recommended Upgrades

1. **Backend**
   - Upgrade to paid Render/Railway plan
   - Add Redis for session storage
   - Implement database indexing

2. **Database**
   - MongoDB Atlas M30+ cluster
   - Enable backup automation
   - Consider read replicas

3. **Frontend**
   - Netlify Pro for better performance
   - Add CDN for static assets
   - Implement service workers

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong JWT secrets
   - Rotate secrets regularly

2. **API Security**
   - Enable rate limiting
   - Validate all inputs
   - Use HTTPS everywhere

3. **Database Security**
   - Use MongoDB Atlas network rules
   - Enable authentication
   - Regular backups

## 📞 Support

For deployment issues:

1. Check logs first
2. Verify environment variables
3. Test API endpoints individually
4. Check network connectivity

---

**Deployment Status Checklist**

- [ ] Backend deployed and healthy
- [ ] Frontend deployed and accessible
- [ ] Environment variables configured
- [ ] Database connected
- [ ] CORS properly configured
- [ ] Email working (if configured)
- [ ] SSL certificates active
- [ ] Monitoring/logging enabled

🎉 **Your Algonive Task Management System is now live!**
