export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center">
        {/* Spinner */}
        <div className="relative mb-8">
          <div className="w-24 h-24 border-8 border-purple-200 dark:border-purple-900 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 blur-2xl opacity-30 bg-gradient-to-r from-purple-600 to-pink-600"></div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2 animate-pulse">
          লোড হচ্ছে...
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400">
          Loading...
        </p>

        {/* Dots Animation */}
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
