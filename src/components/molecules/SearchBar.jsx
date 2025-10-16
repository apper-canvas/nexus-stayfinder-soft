import { useState, useRef, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import hotelService from "@/services/api/hotelService";

const SearchBar = ({ onSearch, initialValues = {}, className }) => {
  const [destination, setDestination] = useState(initialValues.destination || "");
  const [checkInDate, setCheckInDate] = useState(initialValues.checkInDate || "");
  const [checkOutDate, setCheckOutDate] = useState(initialValues.checkOutDate || "");
  const [guestCount, setGuestCount] = useState(initialValues.guestCount || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const suggestionRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDestinationChange = async (e) => {
    const value = e.target.value;
    setDestination(value);

    if (value.length >= 2) {
      try {
        const results = await hotelService.getDestinationSuggestions(value);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setDestination(suggestion.value);
    setShowSuggestions(false);
  };

  const handleSearch = async () => {
    if (!destination || !checkInDate || !checkOutDate) return;
    
    setLoading(true);
    try {
      await onSearch({
        destination,
        checkInDate,
        checkOutDate,
        guestCount
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = destination && checkInDate && checkOutDate && new Date(checkInDate) < new Date(checkOutDate);

  return (
    <div className={cn("bg-white rounded-lg shadow-medium p-6", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Destination Input */}
        <div className="relative" ref={suggestionRef}>
          <Input
            label="Destination"
            placeholder="Where are you going?"
            value={destination}
            onChange={handleDestinationChange}
            icon="MapPin"
          />
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-medium max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2 border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <ApperIcon name="MapPin" className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{suggestion.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Check-in Date */}
        <Input
          type="date"
          label="Check-in"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          icon="Calendar"
        />

        {/* Check-out Date */}
        <Input
          type="date"
          label="Check-out"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
          min={checkInDate || new Date().toISOString().split("T")[0]}
          icon="Calendar"
        />

        {/* Guest Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Guests
          </label>
          <div className="relative">
            <select
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value))}
              className="block w-full px-3 py-2 pl-10 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 appearance-none bg-white"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Guest" : "Guests"}
                </option>
              ))}
            </select>
            <ApperIcon name="Users" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <ApperIcon name="ChevronDown" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          size="lg"
          onClick={handleSearch}
          loading={loading}
          disabled={!isFormValid || loading}
          className="px-12 py-3 text-base font-semibold"
        >
          <ApperIcon name="Search" className="w-5 h-5" />
          Search Hotels
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;