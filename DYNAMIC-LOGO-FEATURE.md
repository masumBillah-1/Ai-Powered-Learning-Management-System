# Dynamic Logo Customization Feature

## Overview
Admin dashboard থেকে platform এর logo, brand name, এবং tagline dynamically change করার feature implement করা হয়েছে।

## Features Implemented

### 1. Logo Component (src/components/layout/Logo.tsx)
- ✅ Database থেকে logo settings fetch করে
- ✅ localStorage এ cache করে instant loading এর জন্য
- ✅ Real-time update support (storage event listener)
- ✅ Loading skeleton state
- ✅ Error handling with fallback to default logo
- ✅ Responsive design (sm এবং default size support)

### 2. Admin Settings Page (src/app/dashboard/settings/page.tsx)
**System Tab এ নতুন "Brand Identity" section যোগ করা হয়েছে:**

#### Logo Customization Options:
- **Logo Image Upload**: Cloudinary এ upload করে URL save করে
  - File type validation (শুধু image files)
  - Size validation (max 2MB)
  - Recommended: 512x512px, PNG or SVG
  
- **Brand Name (Part 1)**: প্রথম অংশ (default: "Career")
- **Brand Name (Part 2)**: দ্বিতীয় অংশ gradient color সহ (default: "Canvas")
- **Tagline 1**: প্রথম tagline (default: "ELEVATE")
- **Tagline 2**: দ্বিতীয় tagline (default: "SKILLS")

#### Features:
- ✅ Live preview of logo changes
- ✅ Upload progress indicator
- ✅ Save all settings at once
- ✅ Reset to default button
- ✅ Auto-refresh logo across all pages after update

### 3. Database Schema (src/models/SystemSettings.ts)
SystemSettings model এ নতুন keys যোগ করা হয়েছে:
- `logoImage`: Logo image URL (Cloudinary)
- `logoName`: Brand name first part
- `logoNameSecondary`: Brand name second part
- `tagline1`: First tagline
- `tagline2`: Second tagline

### 4. API Route (src/app/api/admin/settings/route.ts)
- ✅ GET: সব settings fetch করে
- ✅ PUT: Individual setting update করে (admin only)
- ✅ Authentication & authorization check
- ✅ Audit trail (updatedBy field)

## How It Works

### Flow:
1. **Page Load**: Logo component localStorage cache check করে → instant display
2. **API Call**: Background এ API থেকে latest settings fetch করে
3. **Update**: Settings পেলে state ও cache update করে
4. **Admin Update**: Admin settings change করলে:
   - Database এ save হয়
   - localStorage cache clear হয়
   - Storage event trigger হয়
   - সব Logo components automatically refresh হয়

### Caching Strategy:
- **First Load**: localStorage cache থেকে instant load
- **Background Sync**: API call করে latest data fetch
- **Update**: Settings change হলে cache clear + re-fetch
- **Performance**: Unnecessary API calls কমায়

## Usage

### Admin:
1. Dashboard → Settings → System tab এ যান
2. "Brand Identity" section এ:
   - Logo image upload করুন
   - Brand name customize করুন
   - Taglines customize করুন
3. "Save Logo Settings" button click করুন
4. সব pages এ automatically logo update হবে

### Default Values:
```typescript
{
  logoImage: "/mortarboard.png",
  logoName: "Career",
  logoNameSecondary: "Canvas",
  tagline1: "ELEVATE",
  tagline2: "SKILLS"
}
```

## Technical Details

### Components Updated:
- ✅ `src/components/layout/Logo.tsx` - Dynamic logo component
- ✅ `src/app/dashboard/settings/page.tsx` - Admin settings UI
- ✅ `src/models/SystemSettings.ts` - Database model
- ✅ `src/app/api/admin/settings/route.ts` - API endpoints

### Dependencies:
- Cloudinary (image upload)
- MongoDB (settings storage)
- localStorage (client-side caching)
- React hooks (useState, useEffect)

### Security:
- ✅ Admin-only access for updates
- ✅ JWT authentication
- ✅ File type validation
- ✅ File size validation
- ✅ Error handling

## Benefits

1. **No Code Changes**: Logo change করতে code deploy করার দরকার নেই
2. **Instant Updates**: সব pages এ real-time update
3. **Performance**: localStorage caching দিয়ে fast loading
4. **User Friendly**: Simple UI দিয়ে admin easily change করতে পারবে
5. **Scalable**: Future এ আরো branding options যোগ করা সহজ

## Future Enhancements

- [ ] Favicon customization
- [ ] Color scheme customization
- [ ] Multiple logo variants (light/dark mode)
- [ ] Logo history/versioning
- [ ] Bulk branding settings import/export
