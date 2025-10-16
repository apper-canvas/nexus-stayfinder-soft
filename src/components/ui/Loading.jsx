import { cn } from "@/utils/cn";

const Loading = ({ className, variant = "default" }) => {
  if (variant === "skeleton") {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Hero search skeleton */}
        <div className="bg-white rounded-lg p-6 shadow-soft">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded shimmer"></div>
              <div className="h-10 bg-gray-200 rounded shimmer"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded shimmer"></div>
              <div className="h-10 bg-gray-200 rounded shimmer"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded shimmer"></div>
              <div className="h-10 bg-gray-200 rounded shimmer"></div>
            </div>
            <div className="flex items-end">
              <div className="h-10 w-full bg-accent/20 rounded shimmer"></div>
            </div>
          </div>
        </div>

        {/* Hotel cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-soft overflow-hidden">
              <div className="h-48 bg-gray-200 shimmer"></div>
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded shimmer w-3/4"></div>
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-gray-200 rounded shimmer w-16"></div>
                  <div className="h-4 bg-gray-200 rounded shimmer w-12"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded shimmer w-1/2"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded shimmer w-20"></div>
                  <div className="h-6 bg-accent/20 rounded shimmer w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
      </div>
      <div className="mt-6 text-center">
        <h3 className="text-lg font-display font-medium text-gray-900">
          Finding your perfect stay...
        </h3>
        <p className="text-sm text-gray-500 mt-2">
          This will just take a moment
        </p>
      </div>
    </div>
  );
};

export default Loading;