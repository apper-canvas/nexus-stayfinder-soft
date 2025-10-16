import { useState } from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const ReviewFilters = ({ onFilterChange, activeFilters }) => {
  const [ratingFilter, setRatingFilter] = useState(activeFilters?.rating || "all");
  const [sortBy, setSortBy] = useState(activeFilters?.sort || "newest");

  const handleRatingChange = (value) => {
    setRatingFilter(value);
    onFilterChange({ rating: value, sort: sortBy });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    onFilterChange({ rating: ratingFilter, sort: value });
  };

  const handleReset = () => {
    setRatingFilter("all");
    setSortBy("newest");
    onFilterChange({ rating: "all", sort: "newest" });
  };

  const activeFilterCount = [
    ratingFilter !== "all" ? 1 : 0,
    sortBy !== "newest" ? 1 : 0
  ].reduce((sum, val) => sum + val, 0);

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center gap-2">
        <ApperIcon name="Filter" className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Filters:</span>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Rating:</label>
        <select
          value={ratingFilter}
          onChange={(e) => handleRatingChange(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Rated</option>
        </select>
      </div>

      {activeFilterCount > 0 && (
        <>
          <Badge variant="primary" size="sm">
            {activeFilterCount} active
          </Badge>
          <button
            onClick={handleReset}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            Reset Filters
          </button>
        </>
      )}
    </div>
  );
};

export default ReviewFilters;