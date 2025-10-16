import { useState } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const FilterSidebar = ({ filters, onFiltersChange, className }) => {
  const [priceRange, setPriceRange] = useState(filters.priceRange || { min: 0, max: 1000 });
  const [selectedStars, setSelectedStars] = useState(filters.starRatings || []);
  const [selectedAmenities, setSelectedAmenities] = useState(filters.amenities || []);

  const amenitiesList = [
    { id: "WiFi", label: "Free WiFi", icon: "Wifi" },
    { id: "Pool", label: "Swimming Pool", icon: "Waves" },
    { id: "Spa", label: "Spa & Wellness", icon: "Sparkles" },
    { id: "Gym", label: "Fitness Center", icon: "Dumbbell" },
    { id: "Restaurant", label: "Restaurant", icon: "UtensilsCrossed" },
    { id: "Parking", label: "Parking", icon: "Car" },
    { id: "Room Service", label: "Room Service", icon: "Bell" },
    { id: "Beach Access", label: "Beach Access", icon: "Sun" }
  ];

  const handleStarChange = (star) => {
    const newStars = selectedStars.includes(star)
      ? selectedStars.filter(s => s !== star)
      : [...selectedStars, star];
    
    setSelectedStars(newStars);
    onFiltersChange({ ...filters, starRatings: newStars });
  };

  const handleAmenityChange = (amenity) => {
    const newAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];
    
    setSelectedAmenities(newAmenities);
    onFiltersChange({ ...filters, amenities: newAmenities });
  };

  const handlePriceChange = (key, value) => {
    const newRange = { ...priceRange, [key]: parseInt(value) };
    setPriceRange(newRange);
    onFiltersChange({ ...filters, priceRange: newRange });
  };

  const clearAllFilters = () => {
    setPriceRange({ min: 0, max: 1000 });
    setSelectedStars([]);
    setSelectedAmenities([]);
    onFiltersChange({ priceRange: { min: 0, max: 1000 }, starRatings: [], amenities: [] });
  };

  const hasActiveFilters = selectedStars.length > 0 || selectedAmenities.length > 0 || 
    priceRange.min > 0 || priceRange.max < 1000;

  return (
    <div className={cn("bg-white rounded-lg shadow-soft p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display font-semibold text-gray-900">
          Filters
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-error hover:text-error/80"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Price Range (per night)
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange.min}
                onChange={(e) => handlePriceChange("min", e.target.value)}
                className="flex-1 accent-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange.max}
                onChange={(e) => handlePriceChange("max", e.target.value)}
                className="flex-1 accent-primary"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>${priceRange.min}</span>
              <span>${priceRange.max}</span>
            </div>
          </div>
        </div>

        {/* Star Rating */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Star Rating
          </h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <label
                key={star}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedStars.includes(star)}
                  onChange={() => handleStarChange(star)}
                  className="rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                />
                <div className="flex items-center gap-1">
                  {Array.from({ length: star }, (_, i) => (
                    <ApperIcon
                      key={i}
                      name="Star"
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    {star} {star === 1 ? "Star" : "Stars"}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Amenities
          </h4>
          <div className="space-y-2">
            {amenitiesList.map((amenity) => (
              <label
                key={amenity.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity.id)}
                  onChange={() => handleAmenityChange(amenity.id)}
                  className="rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                />
                <ApperIcon name={amenity.icon} className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">{amenity.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Sort By
          </h4>
          <select
            value={filters.sortBy || "rating"}
            onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="rating">Highest Rating</option>
            <option value="price">Lowest Price</option>
            <option value="distance">Distance</option>
          </select>
        </div>
      </div>

      {/* Active Filters Count */}
      {hasActiveFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-primary">
            <ApperIcon name="Filter" className="w-4 h-4" />
            <span>
              {selectedStars.length + selectedAmenities.length} active filter
              {selectedStars.length + selectedAmenities.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;