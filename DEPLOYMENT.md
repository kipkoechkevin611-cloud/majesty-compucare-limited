# Deployment Guide - Majesty Compucare Limited

## Overview
This guide provides comprehensive instructions for deploying the Majesty Compucare Limited website to production using Render.

## Architecture
- **Platform**: Render (Free Tier)
- **Frontend**: Next.js 16.2.7 with App Router
- **Backend**: Next.js API Routes (integrated)
- **Database**: MongoDB (cloud-hosted via MongoDB Atlas recommended)
- **File Storage**: Cloudinary
- **Payment**: M-Pesa
- **Authentication**: NextAuth.js

## Prerequisites
1. GitHub repository with the project code
2. Render account (https://render.com)
3. MongoDB Atlas account (https://www.mongodb.com/atlas)
4. Cloudinary account (https://cloudinary.com)
5. Domain name: www.majestycompucarelimited.com

## Environment Variables

### Required Environment Variables

#### Database
```env
DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```
- **Purpose**: MongoDB connection string
- **Source**: MongoDB Atlas
- **Security**: Secret (never commit to git)

#### Application Configuration
```env
NEXT_PUBLIC_APP_URL=https://www.majestycompucarelimited.com
```
- **Purpose**: Base URL for the application (used in CORS, emails, etc.)
- **Source**: Your domain
- **Security**: Public (can be exposed)

#### Email/SMTP Configuration
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@majestycompucarelimited.com
```
- **Purpose**: Email sending for password resets, notifications
- **Source**: Gmail or other SMTP provider
- **Security**: Secret (especially SMTP_USER and SMTP_PASS)

#### NextAuth Configuration
```env
NEXTAUTH_URL=https://www.majestycompucarelimited.com
NEXTAUTH_SECRET=your-random-secret-string
```
- **Purpose**: Authentication configuration
- **Source**: Generate a random string for NEXTAUTH_SECRET
- **Security**: Secret (NEXTAUTH_SECRET must be random and secure)

#### Cloudinary Configuration
```env
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```
- **Purpose**: Image storage and optimization
- **Source**: Cloudinary dashboard
- **Security**: Secret (all values)

#### M-Pesa Payment Gateway
```env
MPESA_CONSUMER_KEY=your-mpesa-consumer-key
MPESA_CONSUMER_SECRET=your-mpesa-consumer-secret
MPESA_PASSKEY=your-mpesa-passkey
MPESA_SHORTCODE=your-mpesa-shortcode
MPESA_CALLBACK_URL=https://www.majestycompucarelimited.com/api/mpesa/callback
```
- **Purpose**: Mobile payment processing
- **Source**: Safaricom Developer Portal
- **Security**: Secret (all values except CALLBACK_URL)

#### Google Search Console
```env
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-verification-code
```
- **Purpose**: Google Search Console verification
- **Source**: Google Search Console
- **Security**: Public

## Deployment Steps

### 1. Prepare MongoDB Atlas Database

1. Create a free MongoDB Atlas account
2. Create a new cluster (free tier M0)
3. Create a database user with read/write permissions
4. Whitelist IP addresses (0.0.0.0/0 for Render)
5. Get the connection string from Atlas
6. Replace the connection string in your environment variables

### 2. Set Up Cloudinary

1. Create a Cloudinary account
2. Navigate to Dashboard > Account Details
3. Copy Cloud Name, API Key, and API Secret
4. Add these to your environment variables

### 3. Configure M-Pesa (Optional)

1. Register at Safaricom Developer Portal
2. Create a new app to get Consumer Key and Secret
3. Configure your shortcode and passkey
4. Set the callback URL to your production domain
5. Add credentials to environment variables

### 4. Deploy to Render

#### Option A: Using render.yaml (Recommended)
1. Push your code to GitHub
2. Log in to Render
3. Click "New +" > "Web Service"
4. Connect your GitHub repository
5. Render will automatically detect the render.yaml file
6. Configure environment variables in the Render dashboard
7. Click "Deploy Web Service"

#### Option B: Manual Configuration
1. Log in to Render
2. Click "New +" > "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: majesty-compucare-limited
   - **Region**: Oregon (or closest to your users)
   - **Branch**: main
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
5. Add all environment variables from the list above
6. Click "Deploy Web Service"

### 5. Configure Custom Domain

1. In Render dashboard, go to your web service
2. Navigate to "Custom Domains"
3. Add: www.majestycompucarelimited.com
4. Render will provide DNS records
5. Update your domain's DNS settings:
   - Add CNAME record pointing to Render's provided domain
6. Wait for SSL certificate to be automatically provisioned

### 6. Update Environment Variables for Production

After deployment, update these variables with production values:

```env
NEXT_PUBLIC_APP_URL=https://www.majestycompucarelimited.com
NEXTAUTH_URL=https://www.majestycompucarelimited.com
MPESA_CALLBACK_URL=https://www.majestycompucarelimited.com/api/mpesa/callback
```

## Security Best Practices

### Environment Variables
- Never commit `.env` file to git
- Use strong, random passwords for all secrets
- Rotate secrets periodically
- Use Render's secret type for sensitive data

### Security Headers (Already Configured)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

### CORS Configuration
- API routes configured with proper CORS headers
- Uses NEXT_PUBLIC_APP_URL for origin validation

## Performance Optimization

### Image Optimization
- Next.js Image component configured
- Cloudinary integration for image optimization
- Remote patterns configured for allowed domains

### Caching
- Static assets cached by Next.js
- API responses can be cached as needed
- Database queries optimized with Prisma

## SEO Configuration (Already Implemented)

### Meta Tags
- Dynamic titles and descriptions
- Open Graph tags for social sharing
- Twitter Card tags

### Structured Data
- Organization schema
- LocalBusiness schema
- Website schema
- Product schema (dynamic)

### Sitemap & Robots
- Dynamic sitemap at `/sitemap.xml`
- Robots.txt at `/robots.txt`
- Proper canonical URLs

## Monitoring and Maintenance

### Health Checks
- Render automatically checks `/` endpoint
- Configure additional monitoring as needed

### Logs
- Access logs in Render dashboard
- Application logs for debugging
- Error tracking recommended (e.g., Sentry)

### Backups
- MongoDB Atlas provides automated backups
- Consider database export for additional safety
- Keep local backups of important data

## Troubleshooting

### Build Failures
- Check build logs in Render dashboard
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

### Runtime Errors
- Check environment variables are set correctly
- Verify database connection string
- Check API credentials (Cloudinary, M-Pesa)

### Database Connection Issues
- Verify MongoDB Atlas IP whitelist
- Check database user permissions
- Ensure connection string format is correct

### Payment Gateway Issues
- Verify M-Pesa credentials
- Check callback URL is accessible
- Test in sandbox environment first

## Continuous Deployment

Render automatically deploys when you push to GitHub:
1. Make changes locally
2. Commit and push to main branch
3. Render automatically triggers a new deployment
4. Monitor deployment in Render dashboard

## Cost Summary

### Free Tier Usage
- Render: Free tier (limited hours, spins down when inactive)
- MongoDB Atlas: M0 free tier (512MB storage)
- Cloudinary: Free tier (25GB storage, 25GB bandwidth/month)

### Potential Upgrade Costs
- Render Standard: $7/month (no spin-down)
- MongoDB Atlas M10: $57/month (2GB storage)
- Cloudinary: Pay as you go for higher usage

## Support and Resources

- Render Documentation: https://render.com/docs
- Next.js Documentation: https://nextjs.org/docs
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com
- Cloudinary Documentation: https://cloudinary.com/documentation

## Post-Deployment Checklist

- [ ] Verify website loads correctly
- [ ] Test user registration and login
- [ ] Test product browsing and search
- [ ] Test contact form submission
- [ ] Test M-Pesa payment integration (if applicable)
- [ ] Verify SSL certificate is active
- [ ] Check Google Search Console verification
- [ ] Test email functionality (password reset)
- [ ] Verify image uploads work correctly
- [ ] Check mobile responsiveness
- [ ] Test admin panel functionality
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategy
- [ ] Document any custom configurations

## Contact Information

For deployment issues or questions:
- Email: sales.compucare111@gmail.com
- Phone (Nakuru): +254716000367
- Phone (Kisumu): +254111543714
