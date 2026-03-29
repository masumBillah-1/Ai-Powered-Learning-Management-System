# Cloudinary File Upload - Setup Complete ✅

LiveChat এ image এবং file upload এখন **backend API** দিয়ে কাজ করবে। কোনো Cloudinary dashboard setup লাগবে না!

## কিভাবে কাজ করে:

1. User file select করে (📎 button)
2. File আপনার Next.js API route এ যায় (`/api/upload`)
3. Backend Cloudinary এ signed upload করে
4. URL return করে এবং message save হয়

## Environment Variables (Already Configured ✅):

```env
CLOUDINARY_CLOUD_NAME=depl0t7rt
CLOUDINARY_API_KEY=747931786921992
CLOUDINARY_API_SECRET=ZrnUH4O6NaIWjoBuCEVRK_oh2sw
```

## Features:

- ✅ Image upload (jpg, png, gif, webp)
- ✅ File upload (pdf, doc, docx, txt, zip)
- ✅ Max file size: 10MB
- ✅ Automatic file type detection
- ✅ Secure signed uploads
- ✅ Files organized in `chat_files` folder

## Test করুন:

1. Application restart করুন: `npm run dev`
2. LiveChat খুলুন
3. 📎 button এ ক্লিক করুন
4. একটি image বা file select করুন
5. Upload হবে এবং message হিসেবে পাঠানো হবে

## Troubleshooting:

যদি upload fail হয়:
- Browser console এ error দেখুন
- Terminal এ API logs check করুন
- Cloudinary credentials verify করুন
- File size 10MB এর কম কিনা check করুন

