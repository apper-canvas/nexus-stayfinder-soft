import { useState, useEffect } from "react";
import SearchBar from "@/components/molecules/SearchBar";
import HotelCard from "@/components/molecules/HotelCard";
import HotelList from "@/components/organisms/HotelList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import hotelService from "@/services/api/hotelService";

const Home = () => {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useState(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadFeaturedHotels();
  }, []);

  const loadFeaturedHotels = async () => {
    try {
      const hotels = await hotelService.getFeaturedHotels();
      setFeaturedHotels(hotels);
    } catch (err) {
      setError("Failed to load featured hotels");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (params) => {
    setSearchParams(params);
    setShowResults(true);
  };

  const handleFiltersChange = (filters) => {
    // Filters are handled by HotelList component
    console.log("Filters updated:", filters);
  };

  if (showResults) {
    return (
      <HotelList 
        searchParams={searchParams} 
        onFiltersChange={handleFiltersChange}
      />
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary via-secondary to-accent overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                Hotel Stay
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Discover amazing accommodations around the world with exclusive deals and instant booking
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-5xl mx-auto">
            <SearchBar 
              onSearch={handleSearch}
              className="glass border-white/20"
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16 text-center">
            {[
              { icon: "Hotel", number: "2M+", label: "Hotels Worldwide" },
              { icon: "Users", number: "15M+", label: "Happy Customers" },
              { icon: "MapPin", number: "200+", label: "Countries" },
              { icon: "Star", number: "4.8", label: "Average Rating" }
            ].map((stat, index) => (
              <div key={index} className="text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name={stat.icon} className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.number}</div>
                <div className="text-white/80 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Hotels Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Featured Hotels
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hand-picked accommodations that offer exceptional experiences and outstanding value
          </p>
        </div>

        {loading ? (
          <Loading variant="skeleton" />
        ) : error ? (
          <Error message={error} onRetry={loadFeaturedHotels} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredHotels.map((hotel) => (
              <HotelCard key={hotel.Id} hotel={hotel} />
            ))}
          </div>
        )}
      </div>

      {/* Popular Destinations */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-xl text-gray-600">
              Explore the world's most sought-after travel destinations
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "New York", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80", hotels: "2,543 hotels" },
              { name: "Paris", image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&q=80", hotels: "1,876 hotels" },
              { name: "Tokyo", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80", hotels: "3,201 hotels" },
              { name: "London", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80", hotels: "2,187 hotels" },
              { name: "Miami", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", hotels: "892 hotels" },
              { name: "Dubai", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80", hotels: "1,432 hotels" },
              { name: "Sydney", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", hotels: "1,054 hotels" },
              { name: "Barcelona", image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&q=80", hotels: "1,623 hotels" }
            ].map((destination, index) => (
              <div
                key={index}
                className="relative h-48 rounded-lg overflow-hidden cursor-pointer group hotel-card"
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-display font-semibold mb-1">
                    {destination.name}
                  </h3>
                  <p className="text-sm text-white/80">{destination.hotels}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Why Choose StayFinder?
          </h2>
          <p className="text-xl text-gray-600">
            We make hotel booking simple, secure, and rewarding
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: "Shield",
              title: "Best Price Guarantee",
              description: "Find a lower price elsewhere? We'll match it and give you an extra 10% off."
            },
            {
              icon: "Clock",
              title: "Instant Confirmation",
              description: "Get immediate booking confirmation and detailed reservation information."
            },
            {
              icon: "Award",
              title: "Quality Assured",
              description: "All hotels are carefully selected and verified for quality and authenticity."
            },
            {
              icon: "Headphones",
              title: "24/7 Support",
              description: "Our customer support team is available round the clock to assist you."
            },
            {
              icon: "CreditCard",
              title: "Secure Payments",
              description: "Your payment information is protected with bank-level security encryption."
            },
            {
              icon: "RotateCcw",
              title: "Free Cancellation",
              description: "Most bookings can be cancelled free of charge up to 24 hours before check-in."
            }
          ].map((feature, index) => (
            <div key={index} className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <ApperIcon name={feature.icon} className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;