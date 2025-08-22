export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="ml-4 flex-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}