export default function MenuSkeleton() {
  return (
    <div className="w-full">
      {/* Filtres skeleton */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-10 bg-gray-200 rounded-full animate-pulse"
              style={{ width: Math.random() * 60 + 80 + 'px' }}
            />
          ))}
        </div>
      </div>

      {/* Menu items skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
          >
            {/* Image skeleton */}
            <div className="h-48 bg-gray-200 animate-pulse" />

            {/* Content skeleton */}
            <div className="p-6">
              {/* Title and price */}
              <div className="flex justify-between items-start mb-2">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
              </div>

              {/* Description */}
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
              </div>

              {/* Badge */}
              <div className="mb-4">
                <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20" />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                </div>
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}