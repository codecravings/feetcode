# 🚀 FeetCode Deployment Guide

## **BACKEND DEPLOYMENT (Railway - RECOMMENDED)**

### **Step 1: Create Railway Account**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub account
3. Connect your repository: `codecravings/feetcode`

### **Step 2: Deploy Backend**
1. Click "New Project" → "Deploy from GitHub repo"
2. Select `codecravings/feetcode`
3. Set root directory to `server`
4. Add environment variables:

```env
PORT=5000
NODE_ENV=production
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key  
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=https://feetcode.vercel.app
```

5. Deploy! You'll get a URL like: `https://feetcode-production.up.railway.app`

---

## **FRONTEND DEPLOYMENT (Vercel)**

### **Step 1: Update Backend URL**
1. Copy your Railway backend URL
2. Update `next.config.js` line 8 with your URL
3. Commit changes to GitHub

### **Step 2: Deploy to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub project: `codecravings/feetcode`
3. Set Framework: Next.js
4. Root Directory: Leave empty (uses root)
5. Add environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

6. Deploy! You'll get: `https://feetcode.vercel.app`

---

## **CUSTOM DOMAIN (OPTIONAL)**

### **For Vercel:**
1. Buy domain (feetcode.dev, feetcode.io, etc.)
2. Add to Vercel project settings
3. Update DNS records as instructed

### **For Railway:**
1. Add custom domain in Railway dashboard
2. Point your domain's CNAME to Railway

---

## **POST-DEPLOYMENT CHECKLIST** ✅

### **Test Everything:**
- [ ] Frontend loads at your domain
- [ ] Backend API responds (check /api/health)
- [ ] Problems page shows all 47 problems
- [ ] Code execution works (run test)
- [ ] Category filtering works
- [ ] Authentication flow works
- [ ] All viral features load (achievements, leaderboard, etc.)

### **Update Links:**
- [ ] Update Instagram bio link
- [ ] Update GitHub repo description
- [ ] Update all marketing materials

---

## **LAUNCH DAY CHECKLIST** 🎬

### **Technical:**
- [ ] Both servers deployed and stable
- [ ] All features tested in production
- [ ] Analytics setup (Google Analytics)
- [ ] Error monitoring setup (Sentry)

### **Marketing:**
- [ ] Instagram business account created
- [ ] First week of content prepared
- [ ] Launch reel filmed and edited
- [ ] Hashtag strategy finalized
- [ ] Influencer outreach list ready

### **Community:**
- [ ] Discord server created (optional)
- [ ] Social media accounts claimed
- [ ] Email list setup (for updates)
- [ ] Feedback collection method ready

---

## **EMERGENCY CONTACTS** 🚨

If anything breaks during launch:
- Railway support: [railway.app/help](https://railway.app/help)
- Vercel support: [vercel.com/support](https://vercel.com/support)
- Supabase support: [supabase.com/support](https://supabase.com/support)

---

**Ready to make coding practice ICONIC? Let's launch! 🔥✨**