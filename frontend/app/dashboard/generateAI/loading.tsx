export default function GenerateAILoading() {
  return (
    <div className="min-h-screen p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="flex flex-col justify-center items-center text-center mb-6 sm:mb-8">
          <div className="h-8 sm:h-10 md:h-12 bg-gray-200 rounded animate-pulse mb-2 w-48 sm:w-56 md:w-64"></div>
          <div className="h-4 sm:h-5 md:h-6 bg-gray-200 rounded animate-pulse w-64 sm:w-72 md:w-80"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Input Section Skeleton */}
          <div className="space-y-4 sm:space-y-6">
            {/* Upload Card Skeleton */}
            <div className="border-2 border-orange-200 rounded-lg p-4 sm:p-6">
              <div className="mb-3 sm:mb-4">
                <div className="h-5 sm:h-6 bg-gray-200 rounded animate-pulse mb-2 w-28 sm:w-32"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-40 sm:w-48"></div>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 md:p-8">
                <div className="space-y-3 sm:space-y-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded animate-pulse mx-auto"></div>
                  <div>
                    <div className="h-4 sm:h-5 bg-gray-200 rounded animate-pulse mb-2 w-40 sm:w-48"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-28 sm:w-32"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt Card Skeleton */}
            <div className="border-2 border-orange-200 rounded-lg p-4 sm:p-6">
              <div className="mb-3 sm:mb-4">
                <div className="h-5 sm:h-6 bg-gray-200 rounded animate-pulse mb-2 w-32 sm:w-36"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-44 sm:w-56"></div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse mb-2 w-12 sm:w-16"></div>
                  <div className="h-20 sm:h-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse mb-2 w-16 sm:w-20"></div>
                    <div className="h-8 sm:h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse mb-2 w-12 sm:w-16"></div>
                    <div className="h-8 sm:h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-10 sm:h-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Output Section Skeleton */}
          <div className="space-y-4 sm:space-y-6">
            {/* Result Card Skeleton */}
            <div className="border-2 border-orange-200 rounded-lg p-4 sm:p-6">
              <div className="mb-3 sm:mb-4">
                <div className="h-5 sm:h-6 bg-gray-200 rounded animate-pulse mb-2 w-16 sm:w-20"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-32 sm:w-40"></div>
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-3 sm:space-y-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded animate-pulse mx-auto"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-24 sm:w-32"></div>
                </div>
              </div>
            </div>

            {/* Suggestions Card Skeleton */}
            <div className="border-2 border-orange-200 rounded-lg p-4 sm:p-6">
              <div className="mb-3 sm:mb-4">
                <div className="h-4 sm:h-5 bg-gray-200 rounded animate-pulse w-20 sm:w-24"></div>
              </div>
              <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-5 sm:h-6 bg-gray-200 rounded animate-pulse w-24 sm:w-32"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  