# Web Deployment Guide

## Customer App (cafe/)
```bash
cd cafe
npm run build:web
vercel --prod
```

## Admin Panel (cafe_admin/)
```bash
cd cafe_admin
npm run build:web
vercel --prod
```

## Quick Deploy (Windows)
- Customer: Run `deploy-web-customer.bat`
- Admin: Run `deploy-web-admin.bat`

## Environment Setup
Make sure your backend is deployed and update API URLs in both apps before deployment.

## Live URLs
- Customer App: [Your Vercel URL]
- Admin Panel: [Your Vercel URL]
- Backend API: [Your Backend URL]