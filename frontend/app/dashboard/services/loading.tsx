export default function ServicesLoading() {
  return (
    <div className="p-2 sm:p-4 md:p-6">
      <div className="mb-6">
        {/* Header skeleton */}
        <div className="p-2">
          <div className="h-8 bg-gray-200 rounded animate-pulse mb-2 w-48"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-64"></div>
        </div>

        {/* Filter skeleton */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly chart skeleton */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-48"></div>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Pie charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-32"></div>
              <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Bottom pie charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-40"></div>
              <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Stat cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-20"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-2 w-16"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-12"></div>
            </div>
          ))}
        </div>

        {/* Store chart skeleton */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-48"></div>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Region data skeleton */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-40"></div>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Table skeleton */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-32"></div>
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
  