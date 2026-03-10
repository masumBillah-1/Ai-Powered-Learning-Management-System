# 📁 Required Files to Add - Complete List

## 🗄️ Database Models (src/models/)

### ✅ বিদ্যমান Files:
```
src/models/
├── Course.ts        ✅ আছে (update করতে হবে)
├── User.ts          ✅ আছে (update করতে হবে)
└── index.ts         ✅ আছে (update করতে হবে)
```

### ❌ নতুন যোগ করতে হবে:
```
src/models/
├── Enrollment.ts    ❌ নতুন তৈরি করতে হবে
├── Transaction.ts   ❌ নতুন তৈরি করতে হবে
├── Notification.ts  ❌ নতুন তৈরি করতে হবে
└── Message.ts       ❌ নতুন তৈরি করতে হবে
```

---

## 🔗 API Routes (src/app/api/)

### ✅ বিদ্যমান API Routes:
```
src/app/api/
├── auth/
│   ├── become-instructor/route.ts  ✅
│   ├── login/route.ts              ✅
│   ├── logout/route.ts             ✅
│   ├── register/route.ts           ✅
│   ├── verify-otp/route.ts         ✅
│   └── [action]/route.ts           ✅
├── chat/route.ts                   ✅
├── courses/
│   ├── route.ts                    ✅
│   └── [id]/route.ts              ✅
├── profile/route.ts                ✅
└── test-db/                        ✅
```

### ❌ নতুন API Routes যোগ করতে হবে:

#### 1. Enrollments API:
```
src/app/api/enrollments/
├── route.ts                        ❌ নতুন
└── [id]/
    ├── route.ts                    ❌ নতুন
    └── progress/
        └── route.ts                ❌ নতুন
```

#### 2. Transactions API:
```
src/app/api/transactions/
├── route.ts                        ❌ নতুন
└── [id]/
    └── route.ts                    ❌ নতুন
```

#### 3. Notifications API:
```
src/app/api/notifications/
├── route.ts                        ❌ নতুন
└── [id]/
    └── route.ts                    ❌ নতুন
```

#### 4. Messages API:
```
src/app/api/messages/
├── route.ts                        ❌ নতুন
└── [id]/
    └── route.ts                    ❌ নতুন
```

#### 5. Analytics API (Dashboard এর জন্য):
```
src/app/api/analytics/
├── dashboard/
│   ├── student/route.ts            ❌ নতুন
│   ├── instructor/route.ts         ❌ নতুন
│   └── admin/route.ts              ❌ নতুন
└── stats/
    └── route.ts                    ❌ নতুন
```

---

## 📊 Complete File Structure যা হবে:

```
src/
├── app/
│   ├── api/
│   │   ├── auth/                   ✅ আছে
│   │   ├── chat/                   ✅ আছে
│   │   ├── courses/                ✅ আছে
│   │   ├── profile/                ✅ আছে
│   │   ├── enrollments/            ❌ নতুন folder
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── progress/route.ts
│   │   ├── transactions/           ❌ নতুন folder
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── notifications/          ❌ নতুন folder
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── messages/               ❌ নতুন folder
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   └── analytics/              ❌ নতুন folder
│   │       ├── dashboard/
│   │       │   ├── student/route.ts
│   │       │   ├── instructor/route.ts
│   │       │   └── admin/route.ts
│   │       └── stats/route.ts
│   └── (other existing folders)    ✅ আছে
├── models/
│   ├── User.ts                     ✅ আছে (update)
│   ├── Course.ts                   ✅ আছে (update)
│   ├── Enrollment.ts               ❌ নতুন
│   ├── Transaction.ts              ❌ নতুন
│   ├── Notification.ts             ❌ নতুন
│   ├── Message.ts                  ❌ নতুন
│   └── index.ts                    ✅ আছে (update)
├── lib/                            ✅ আছে
├── components/                     ✅ আছে
├── db/                             ✅ আছে
├── firebase/                       ✅ আছে
└── server/                         ✅ আছে
```

---

## 🔢 Summary - মোট যা করতে হবে:

### Models (src/models/):
- ❌ **4টি নতুন files:** Enrollment.ts, Transaction.ts, Notification.ts, Message.ts
- ✅ **3টি update:** User.ts, Course.ts, index.ts

### API Routes (src/app/api/):
- ❌ **5টি নতুন folders:** enrollments, transactions, notifications, messages, analytics
- ❌ **12টি নতুন route files:** 
  - enrollments (3 files)
  - transactions (2 files)
  - notifications (2 files)
  - messages (2 files)
  - analytics (3 files)

### Total New Files to Create:
- **4 Model files**
- **5 API folders**
- **12 Route files**
- **3 Files to update**

**Grand Total: 16 নতুন files + 3 updates = 19 files কাজ করতে হবে**

---

## 🚀 Priority Order:

### Phase 1 (Most Important):
1. `src/models/Enrollment.ts`
2. `src/models/Transaction.ts`
3. `src/app/api/enrollments/route.ts`
4. `src/app/api/transactions/route.ts`

### Phase 2 (Supporting):
5. `src/models/Notification.ts`
6. `src/models/Message.ts`
7. `src/app/api/notifications/route.ts`
8. `src/app/api/messages/route.ts`

### Phase 3 (Analytics):
9. `src/app/api/analytics/dashboard/student/route.ts`
10. `src/app/api/analytics/dashboard/instructor/route.ts`
11. `src/app/api/analytics/dashboard/admin/route.ts`

এই files গুলো তৈরি করলে আপনার dashboard pages functional হবে এবং loading issues solve হবে।