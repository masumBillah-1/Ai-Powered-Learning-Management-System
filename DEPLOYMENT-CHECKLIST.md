# 🚀 MongoDB Fix Deployment Checklist

## ✅ Pre-Deployment Checks

- [x] `src/db/connect.ts` — Pool size বাড়ানো (50)
- [x] `src/server/socket-server.ts` — Shared connection ব্যবহার
- [x] `src/db/monitor.ts` — Monitoring utility তৈরি
- [x] `src/app/api/admin/db-status/route.ts` — Status endpoint তৈরি
- [x] `tsconfig.json` — `@/*` alias configured

## 📋 Deployment Steps

### 1. Local Testing

```bash
# Terminal 1: Main app
npm run dev

# Terminal 2: Socket server
npm run socket-server

# Terminal 3: Test API
curl http://localhost:3000/api/admin/db-status
```

**Expected:** Connection status দেখাবে

### 2. Git Commit & Push

```bash
git add .
git commit -m "fix: MongoDB connection pooling optimization

- Shared connection pool between main app and socket server
- Increased maxPoolSize from 10 to 50
- Added connection monitoring utilities
- Auto-cleanup of idle connections after 60s"

git push origin main
```

### 3. Environment Variables Check

নিশ্চিত করো এই variables সব জায়গায় আছে:

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
SOCKET_PORT=4000
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 4. Deploy to Production

#### Vercel:
- Auto-deploy হবে push করার পরে
- Dashboard → Deployments → Check logs

#### Railway/Render:
- Dashboard → Deploy → Manual deploy
- Logs check করো

#### VPS:
```bash
ssh your-server
cd your-project
git pull
npm install
pm2 restart all
```

### 5. Post-Deployment Verification

#### A. Check MongoDB Atlas

1. Atlas Dashboard খোলো
2. Clusters → Metrics
3. "Connections" graph দেখো
4. Connection count 30-40% এ আছে কিনা check করো

#### B. Test API Endpoints

```bash
# Health check
curl https://your-domain.com/api/admin/db-status

# Expected response:
{
  "success": true,
  "connection": {
    "status": "connected",
    "poolSize": 12,
    "availableConnections": 8
  },
  "health": {
    "poolUsagePercent": 33,
    "warning": null
  }
}
```

#### C. Test Socket Server

1. Browser console খোলো
2. Messages page যাও
3. Network tab → WS (WebSocket) check করো
4. Connection established দেখাচ্ছে কিনা

#### D. Monitor Logs

```bash
# Vercel
vercel logs

# Railway
railway logs

# VPS
pm2 logs
```

**Look for:**
- ✅ "MongoDB connected"
- ✅ "Socket.io server running"
- ❌ No "connection limit" errors

### 6. Performance Testing

#### A. Load Test (Optional)

```bash
# Install artillery
npm install -g artillery

# Create test.yml
artillery quick --count 50 --num 10 https://your-domain.com/api/courses
```

#### B. Monitor Connection Usage

```bash
# Check every 5 minutes
watch -n 300 'curl -s https://your-domain.com/api/admin/db-status | jq'
```

## 🎯 Success Criteria

- [ ] Connection limit < 50%
- [ ] No "connection limit" warnings in Atlas
- [ ] Socket server connected successfully
- [ ] API responses < 500ms
- [ ] No connection errors in logs
- [ ] Idle connections closing after 60s

## 🔧 Rollback Plan (যদি সমস্যা হয়)

### Option 1: Quick Rollback

```bash
git revert HEAD
git push
```

### Option 2: Previous Deployment

- Vercel: Dashboard → Deployments → Previous → Promote
- Railway: Dashboard → Deployments → Rollback

### Option 3: Manual Fix

```typescript
// src/db/connect.ts
maxPoolSize: 10,  // Revert to old value
```

## 📊 Monitoring (First 24 Hours)

### Hour 1:
- [ ] Check Atlas connection graph
- [ ] Test all API endpoints
- [ ] Verify socket connections

### Hour 6:
- [ ] Connection usage still < 50%?
- [ ] Any errors in logs?
- [ ] User reports any issues?

### Hour 24:
- [ ] Connection stable?
- [ ] Performance improved?
- [ ] No warnings in Atlas?

## 🎉 Post-Deployment

### If Successful:
1. Update team in Slack/Discord
2. Document the fix in wiki
3. Close related tickets
4. Monitor for next 7 days

### If Issues:
1. Check logs immediately
2. Rollback if critical
3. Debug and fix
4. Re-deploy with fix

## 📝 Notes

- Connection pool changes take 2-3 minutes to reflect
- Old connections will close gradually
- Monitor Atlas dashboard for first hour
- Keep rollback plan ready

---

**Deployed by:** [Your Name]  
**Date:** [Date]  
**Status:** [ ] Success / [ ] Failed / [ ] Rolled Back
