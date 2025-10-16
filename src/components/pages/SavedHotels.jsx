import { useState, useEffect } from "react";
import HotelCard from "@/components/molecules/HotelCard";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import hotelService from "@/services/api/hotelService";

const SavedHotels = () => {
  const [savedHotels, setSavedHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");

  // Mock saved hotel IDs - in real app, this would come from user profile
  const savedHotelIds = [1, 3, 4, 5];

  useEffect(() => {
    loadSavedHotels();
  }, []);

  useEffect(() => {
    filterAndSortHotels();
  }, [savedHotels, searchQuery, sortBy]);

  const loadSavedHotels = async () => {
    setLoading(true);
    setError("");
    
    try {
      const allHotels = await hotelService.getAllHotels();
      const saved = allHotels.filter(hotel => savedHotelIds.includes(hotel.Id));
      setSavedHotels(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortHotels = () => {
    let filtered = [...savedHotels];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(hotel =>
        hotel.name.toLowerCase().includes(query) ||
        hotel.city.toLowerCase().includes(query) ||
        hotel.country.toLowerCase().includes(query)
      );
    }

    // Sort hotels
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "rating":
        filtered.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case "price":
        filtered.sort((a, b) => (a.starRating * 100) - (b.starRating * 100));
        break;
      case "location":
        filtered.sort((a, b) => a.city.localeCompare(b.city));
        break;
      default: // date
        filtered.sort((a, b) => b.Id - a.Id);
    }

    setFilteredHotels(filtered);
  };

  const handleRemoveFromSaved = (hotelId) => {
    // In a real app, this would update user preferences
    setSavedHotels(prev => prev.filter(hotel => hotel.Id !== hotelId));
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to remove all saved hotels?")) {
      setSavedHotels([]);
    }
  };

  if (loading) {
    return <Loading variant="skeleton" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadSavedHotels} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Saved Hotels
        </h1>
        <p className="text-gray-600">
          Your favorite hotels for future bookings
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search saved hotels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon="Search"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ApperIcon name="ArrowUpDown" className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              >
                <option value="date">Recently Saved</option>
                <option value="name">Hotel Name</option>
                <option value="rating">Rating</option>
                <option value="price">Price</option>
                <option value="location">Location</option>
              </select>
            </div>

            {/* Clear All */}
            {savedHotels.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="text-error hover:text-error/80 border-error/20"
              >
                <ApperIcon name="X" className="w-4 h-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Hotels Grid */}
      {filteredHotels.length === 0 ? (
        <Empty
          title={searchQuery ? "No hotels found" : "No saved hotels yet"}
          description={
            searchQuery
              ? "Try adjusting your search criteria"
              : "Start saving hotels you're interested in for easy access later"
          }
          action={() => window.location.href = "/"}
          actionText="Browse Hotels"
          icon="Heart"
        />
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold text-gray-900">
              {filteredHotels.length} Saved Hotel{filteredHotels.length !== 1 ? 's' : ''}
            </h2>
            
            <div className="text-sm text-gray-600">
              Showing {filteredHotels.length} of {savedHotels.length} hotels
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => (
              <div key={hotel.Id} className="relative group">
                <HotelCard hotel={hotel} />
                
                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFromSaved(hotel.Id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
                  title="Remove from saved"
                >
                  <ApperIcon name="Heart" className="w-4 h-4 text-error fill-current" />
                </button>
              </div>
            ))}
          </div>

          {/* Load More */}
          {filteredHotels.length >= 6 && (
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg">
                Load More Hotels
                <ApperIcon name="ChevronDown" className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Tips Section */}
      <div className="mt-12 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-8">
        <div className="max-w-3xl mx-auto text-center">
          <ApperIcon name="Lightbulb" className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-display font-semibold text-gray-900 mb-4">
            Pro Tips for Saved Hotels
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                <ApperIcon name="Bell" className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Price Alerts</h4>
                <p className="text-sm text-gray-600">
                  Get notified when prices drop on your saved hotels
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center mt-1">
                <ApperIcon name="Calendar" className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Compare Dates</h4>
                <p className="text-sm text-gray-600">
                  Check prices across different dates to find the best deals
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mt-1">
                <ApperIcon name="Share" className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Share Lists</h4>
                <p className="text-sm text-gray-600">
                  Share your saved hotels with travel companions
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button size="lg">
              <ApperIcon name="Settings" className="w-4 h-4" />
              Manage Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedHotels;