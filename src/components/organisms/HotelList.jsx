import { useState, useEffect } from "react";
import HotelCard from "@/components/molecules/HotelCard";
import FilterSidebar from "@/components/molecules/FilterSidebar";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import hotelService from "@/services/api/hotelService";

const HotelList = ({ searchParams, onFiltersChange }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 1000 },
    starRatings: [],
    amenities: [],
    sortBy: "rating"
  });
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    if (searchParams) {
      searchHotels();
    }
  }, [searchParams, filters]);

  const searchHotels = async () => {
    if (!searchParams) return;
    
    setLoading(true);
    setError("");
    
    try {
      const combinedParams = { ...searchParams, ...filters };
      const results = await hotelService.searchHotels(combinedParams);
      setHotels(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  if (loading) {
    return <Loading variant="skeleton" />;
  }

  if (error) {
    return <Error message={error} onRetry={searchHotels} />;
  }

  if (!searchParams) {
    return (
      <Empty
        title="Start Your Hotel Search"
        description="Enter your destination and travel dates to find the perfect accommodation."
        icon="Search"
      />
    );
  }

  if (hotels.length === 0 && !loading) {
    return (
      <Empty
        title="No Hotels Found"
        description="Try adjusting your search criteria or filters to find more options."
        action={() => handleFiltersChange({ priceRange: { min: 0, max: 1000 }, starRatings: [], amenities: [] })}
        actionText="Clear Filters"
        icon="MapPin"
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </aside>

        {/* Mobile Filter Overlay */}
        {showMobileFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
            <div className="absolute inset-y-0 right-0 w-80 max-w-full">
              <div className="bg-white h-full overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-display font-semibold">Filters</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowMobileFilters(false)}
                      icon="X"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <FilterSidebar
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-gray-900">
                {hotels.length} Hotels Found
              </h2>
              {searchParams.destination && (
                <p className="text-gray-600 mt-1">
                  in {searchParams.destination} • {searchParams.checkInDate} - {searchParams.checkOutDate}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden"
                icon="Filter"
              >
                Filters
              </Button>

              {/* View Toggle */}
              <div className="hidden sm:flex items-center border border-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-primary text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <ApperIcon name="Grid3X3" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list"
                      ? "bg-primary text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <ApperIcon name="List" className="w-4 h-4" />
                </button>
              </div>

              {/* Map Toggle */}
              <Button variant="outline" size="sm" icon="Map">
                Map View
              </Button>
            </div>
          </div>

          {/* Hotels Grid */}
          <div className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
              : "grid-cols-1"
          }`}>
            {hotels.map((hotel) => (
              <HotelCard
                key={hotel.Id}
                hotel={hotel}
                className={viewMode === "list" ? "lg:flex-row" : ""}
              />
            ))}
          </div>

          {/* Load More */}
          {hotels.length > 0 && (
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg">
                Load More Hotels
                <ApperIcon name="ChevronDown" className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelList;