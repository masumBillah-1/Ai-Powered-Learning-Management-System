export default function BanglaTest() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center space-y-8">
        <h1 className="text-5xl font-bold text-gray-800 dark:text-white">
          স্মার্ট এলএমএস প্রো
        </h1>
        
        <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
          CareerCanvas - স্মার্ট অনলাইন শিক্ষা প্ল্যাটফর্ম
        </h2>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          আধুনিক প্রযুক্তি ব্যবহার করে তৈরি একটি সম্পূর্ণ বাংলা ভাষা সমর্থিত লার্নিং ম্যানেজমেন্ট সিস্টেম। 
          শিক্ষার্থী, শিক্ষক এবং প্রশাসকদের জন্য বিশেষভাবে ডিজাইন করা হয়েছে।
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-3 text-purple-600 dark:text-purple-400">
              শিক্ষার্থীদের জন্য
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              কোর্সে ভর্তি হন, অগ্রগতি ট্র্যাক করুন এবং সার্টিফিকেট অর্জন করুন
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-3 text-blue-600 dark:text-blue-400">
              শিক্ষকদের জন্য
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              কোর্স তৈরি করুন, শিক্ষার্থীদের পরিচালনা করুন এবং অ্যানালিটিক্স দেখুন
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-3 text-pink-600 dark:text-pink-400">
              প্রশাসকদের জন্য
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              সম্পূর্ণ সিস্টেম পরিচালনা করুন এবং রিপোর্ট তৈরি করুন
            </p>
          </div>
        </div>

        <div className="mt-12 space-y-4">
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-xl shadow-lg hover:scale-105 transition-transform">
            এখনই শুরু করুন
          </button>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Font: Hind Siliguri (Google Fonts)
          </div>
        </div>

        <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl">
          <h3 className="text-2xl font-bold mb-4">বাংলা ফন্ট টেস্ট</h3>
          <div className="space-y-3 text-left max-w-2xl mx-auto">
            <p className="text-lg">✅ বাংলা অক্ষর: অ আ ই ঈ উ ঊ ঋ এ ঐ ও ঔ</p>
            <p className="text-lg">✅ ব্যঞ্জনবর্ণ: ক খ গ ঘ ঙ চ ছ জ ঝ ঞ ট ঠ ড ঢ ণ</p>
            <p className="text-lg">✅ যুক্তাক্ষর: ক্ষ জ্ঞ ঞ্চ ঞ্জ ষ্ট ষ্ঠ ষ্ণ</p>
            <p className="text-lg">✅ সংখ্যা: ০ ১ ২ ৩ ৪ ৫ ৬ ৭ ৮ ৯</p>
            <p className="text-lg">✅ English: The quick brown fox jumps over the lazy dog</p>
            <p className="text-lg">✅ Mixed: আমার সোনার বাংলা, I love you!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
