import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ReviewModal from "@/components/organisms/ReviewModal";
import ReviewFilters from "@/components/molecules/ReviewFilters";
import hotelService from "@/services/api/hotelService";
import roomService from "@/services/api/roomService";
import reviewService from "@/services/api/reviewService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [filterRating, setFilterRating] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Search params from localStorage or URL
  const [searchParams, setSearchParams] = useState(() => {
    const stored = localStorage.getItem("hotelSearchParams");
    return stored ? JSON.parse(stored) : {
      checkInDate: new Date().toISOString().split("T")[0],
      checkOutDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      guestCount: 2
    };
  });

const loadHotelData = useCallback(async () => {
    setLoading(true);
    setError("");
    
    try {
      const [hotelData, roomsData, reviewsData, statsData] = await Promise.all([
        hotelService.getHotelById(id),
        roomService.getRoomsByHotelId(id),
        reviewService.getHotelReviews(id),
        reviewService.getReviewStats(id)
      ]);

      setHotel(hotelData);
      setRooms(roomsData);
      setReviews(reviewsData);
      setReviewStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadHotelData();
  }, [loadHotelData]);

const handleReviewSubmitted = async (reviewData) => {
    try {
      await reviewService.createReview(reviewData);
      await loadHotelData();
    } catch (error) {
      throw error;
    }
  };

  const handleFilterChange = (filters) => {
    setFilterRating(filters.rating);
    setSortBy(filters.sort);
  };

  const getFilteredAndSortedReviews = () => {
    let filtered = [...reviews];

    if (filterRating !== "all") {
      filtered = filtered.filter(r => r.overallRating === parseInt(filterRating));
    }

    filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === "highest") {
        return b.overallRating - a.overallRating;
      }
      return 0;
    });

    return filtered;
  };

  const handleBookRoom = (room) => {
    const bookingData = {
      hotelId: hotel.Id,
      roomId: room.Id,
      checkInDate: searchParams.checkInDate,
      checkOutDate: searchParams.checkOutDate,
      guestCount: searchParams.guestCount
    };
    
    // Store booking data and navigate to checkout
    localStorage.setItem("currentBooking", JSON.stringify(bookingData));
    navigate("/checkout");
  };

  const calculateNights = () => {
    const checkIn = new Date(searchParams.checkInDate);
    const checkOut = new Date(searchParams.checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      "WiFi": "Wifi",
      "Pool": "Waves",
      "Spa": "Sparkles",
      "Gym": "Dumbbell",
      "Restaurant": "UtensilsCrossed",
      "Room Service": "Bell",
      "Parking": "Car",
      "Beach Access": "Sun",
      "Concierge": "Users",
      "Business Center": "Briefcase",
      "Conference Rooms": "Users",
      "Fireplace": "Flame",
      "Hiking Trails": "Mountain",
      "Ski Storage": "Mountain",
      "Bar": "GlassWater",
      "Rooftop Terrace": "Building",
      "Water Sports": "Waves",
      "Kids Club": "Baby",
      "Tennis Court": "CircleDot"
    };
    
    return iconMap[amenity] || "Check";
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <ApperIcon
        key={i}
        name="Star"
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-200"
        }`}
      />
    ));
  };

const tabs = [
    { id: "overview", label: "Overview", icon: "Info" },
    { id: "rooms", label: "Rooms", icon: "Bed" },
    { id: "amenities", label: "Amenities", icon: "Star" },
    { id: "location", label: "Location", icon: "MapPin" },
    { 
      id: "reviews", 
      label: "Reviews", 
      icon: "MessageSquare",
      badge: reviewStats?.totalReviews 
    }
  ];

  const renderCategoryRating = (label, rating) => {
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{label}</span>
        <div className="flex items-center gap-2">
          <div className="flex">
            {Array.from({ length: 5 }, (_, i) => (
              <ApperIcon
                key={i}
                name="Star"
                className={`w-3 h-3 ${
                  i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-900">
            {rating.toFixed(1)}
          </span>
        </div>
      </div>
    );
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadHotelData} />;
  }

  if (!hotel) {
    return <Error message="Hotel not found" />;
  }

  const nights = calculateNights();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <button onClick={() => navigate(-1)} className="hover:text-primary">
              <ApperIcon name="ArrowLeft" className="w-4 h-4" />
            </button>
            <span>Back to search results</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-display font-bold text-gray-900">
                  {hotel.name}
                </h1>
                <div className="flex">
                  {renderStars(hotel.starRating)}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <ApperIcon name="MapPin" className="w-4 h-4" />
                  <span>{hotel.address}, {hotel.city}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ApperIcon name="Navigation" className="w-4 h-4" />
                  <span>{hotel.distanceFromCenter}km from center</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Star" className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-semibold text-gray-900">
                      {hotel.averageRating}
                    </span>
                  </div>
                  <span className="text-gray-600">
                    ({hotel.reviewCount} reviews)
                  </span>
                </div>
                <Badge variant="success" className="text-success">
                  Excellent
                </Badge>
              </div>
            </div>

            <div className="lg:w-80">
              <Card className="p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-accent mb-1">
                    ${(hotel.starRating * 100).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">per night</div>
                  {nights > 1 && (
                    <div className="text-lg font-semibold text-gray-900 mt-2">
                      ${(hotel.starRating * 100 * nights).toLocaleString()} total
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-medium">{new Date(searchParams.checkInDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-medium">{new Date(searchParams.checkOutDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests:</span>
                    <span className="font-medium">{searchParams.guestCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nights:</span>
                    <span className="font-medium">{nights}</span>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={() => setActiveTab("rooms")}
                >
                  View Rooms & Book
                  <ApperIcon name="ArrowRight" className="w-4 h-4" />
                </Button>

                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <ApperIcon name="CheckCircle" className="w-3 h-3 text-success" />
                    <span>Free cancellation</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Zap" className="w-3 h-3 text-info" />
                    <span>Instant confirmation</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-4 gap-4 h-96">
          <div className="col-span-4 lg:col-span-2 relative rounded-lg overflow-hidden">
            <img
              src={hotel.photos[selectedImageIndex]}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
            <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-medium hover:bg-white transition-colors">
              <ApperIcon name="Maximize" className="w-4 h-4 inline mr-1" />
              View All Photos
            </button>
          </div>
          <div className="col-span-4 lg:col-span-2 grid grid-cols-2 gap-4">
            {hotel.photos.slice(1, 5).map((photo, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setSelectedImageIndex(index + 1)}
              >
                <img
                  src={photo}
                  alt={`${hotel.name} ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                {tab.label}
                {tab.badge && (
                  <Badge variant="primary" size="sm" className="ml-1">
                    {tab.badge}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="prose max-w-4xl">
            <p className="text-lg text-gray-700 leading-relaxed">
              {hotel.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 not-prose">
              <Card className="p-6">
                <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
                  Check-in Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in time:</span>
                    <span className="font-medium">{hotel.policies.checkIn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out time:</span>
                    <span className="font-medium">{hotel.policies.checkOut}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cancellation:</span>
                    <span className="font-medium">{hotel.policies.cancellation}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Mail" className="w-4 h-4 text-gray-400" />
                    <span>{hotel.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Phone" className="w-4 h-4 text-gray-400" />
                    <span>{hotel.contactPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="MapPin" className="w-4 h-4 text-gray-400" />
                    <span>{hotel.address}, {hotel.city}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Rooms Tab */}
        {activeTab === "rooms" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold text-gray-900">
                Available Rooms
              </h2>
              <p className="text-gray-600">
                {nights} night{nights !== 1 ? "s" : ""} • {searchParams.guestCount} guest{searchParams.guestCount !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="space-y-6">
              {rooms.map((room) => (
                <Card key={room.Id} className="overflow-hidden" padding="none">
                  <div className="flex flex-col lg:flex-row">
                    <div className="w-full lg:w-80 h-48 lg:h-auto">
                      <img
                        src={room.photos[0]}
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 p-6">
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-display font-semibold text-gray-900">
                              {room.name}
                            </h3>
                            <Badge variant="primary">{room.type}</Badge>
                          </div>

                          <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-1">
                              <ApperIcon name="Users" className="w-4 h-4" />
                              <span>Up to {room.capacity} guests</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ApperIcon name="Bed" className="w-4 h-4" />
                              <span>{room.bedConfiguration}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mb-4">
                            {room.amenities.slice(0, 6).map((amenity) => (
                              <div
                                key={amenity}
                                className="flex items-center gap-2 text-sm text-gray-600"
                              >
                                <ApperIcon 
                                  name={getAmenityIcon(amenity)} 
                                  className="w-3 h-3 text-primary" 
                                />
                                <span>{amenity}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <ApperIcon name="CheckCircle" className="w-3 h-3 text-success" />
                              <span>Free cancellation</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ApperIcon name="Zap" className="w-3 h-3 text-info" />
                              <span>Instant confirmation</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right lg:w-48">
                          <div className="text-2xl font-bold text-accent mb-1">
                            ${room.pricePerNight}
                          </div>
                          <div className="text-sm text-gray-500 mb-2">per night</div>
                          
                          {nights > 1 && (
                            <div className="text-lg font-semibold text-gray-900 mb-4">
                              ${(room.pricePerNight * nights).toLocaleString()} total
                            </div>
                          )}

                          <Button
                            size="lg"
                            onClick={() => handleBookRoom(room)}
                            className="w-full"
                          >
                            Book This Room
                            <ApperIcon name="ArrowRight" className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Amenities Tab */}
        {activeTab === "amenities" && (
          <div>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-8">
              Hotel Amenities
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotel.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <ApperIcon 
                      name={getAmenityIcon(amenity)} 
                      className="w-5 h-5 text-primary" 
                    />
                  </div>
                  <span className="font-medium text-gray-900">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location Tab */}
        {activeTab === "location" && (
          <div>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-8">
              Location & Nearby
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
                  Address
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p>{hotel.address}</p>
                  <p>{hotel.city}, {hotel.country}</p>
                  <p className="flex items-center gap-2 mt-4">
                    <ApperIcon name="Navigation" className="w-4 h-4 text-primary" />
                    {hotel.distanceFromCenter}km from city center
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
                  What's Nearby
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Airport", distance: "15 min drive", icon: "Plane" },
                    { name: "Train Station", distance: "8 min walk", icon: "Train" },
                    { name: "Shopping Mall", distance: "5 min walk", icon: "ShoppingBag" },
                    { name: "Restaurant District", distance: "3 min walk", icon: "UtensilsCrossed" }
                  ].map((nearby, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ApperIcon name={nearby.icon} className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{nearby.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{nearby.distance}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="mt-8 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <ApperIcon name="Map" className="w-12 h-12 mx-auto mb-2" />
                <p>Interactive map would be displayed here</p>
              </div>
            </div>
          </div>
        )}

{/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-gray-900">
                Guest Reviews
              </h2>
              <div className="flex items-center gap-4">
                {reviewStats && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                      {reviewStats.averageRating}
                    </div>
                    <div className="flex justify-center gap-1 mb-1">
                      {renderStars(Math.round(reviewStats.averageRating))}
                    </div>
                    <div className="text-sm text-gray-600">
                      {reviewStats.totalReviews} reviews
                    </div>
                  </div>
                )}
<Button
                  onClick={() => setReviewModalOpen(true)}
                  className="ml-4"
                >
                  <ApperIcon name="Plus" className="w-4 h-4" />
                  Write a Review
                </Button>
              </div>
            </div>
            <ReviewFilters
              onFilterChange={handleFilterChange}
              activeFilters={{ rating: filterRating, sort: sortBy }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                {reviewStats && (
                  <>
                    <Card className="p-6">
                      <h3 className="font-medium text-gray-900 mb-4">
                        Rating Breakdown
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(reviewStats.ratingBreakdown)
                          .reverse()
                          .map(([rating, count]) => (
                            <div key={rating} className="flex items-center gap-3">
                              <span className="text-sm w-8">{rating} ★</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all"
                                  style={{
                                    width: `${reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0}%`
                                  }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 w-8">
                                {count}
                              </span>
                            </div>
                          ))}
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h3 className="font-medium text-gray-900 mb-4">
                        Category Ratings
                      </h3>
                      <div className="space-y-3">
                        {renderCategoryRating("Cleanliness", reviewStats.categoryAverages.cleanliness)}
                        {renderCategoryRating("Comfort", reviewStats.categoryAverages.comfort)}
                        {renderCategoryRating("Location", reviewStats.categoryAverages.location)}
                        {renderCategoryRating("Value", reviewStats.categoryAverages.value)}
                      </div>
</Card>
                  </>
                )}
              </div>

              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {getFilteredAndSortedReviews().map((review) => (
                    <Card key={review.Id} className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                          {review.userId.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h4 className="font-medium text-gray-900">Anonymous User</h4>
                            <Badge variant="outline" size="sm">{review.travelerType}</Badge>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex">
                              {renderStars(review.overallRating)}
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                            {renderCategoryRating("Cleanliness", review.cleanlinessRating)}
                            {renderCategoryRating("Comfort", review.comfortRating)}
                            {renderCategoryRating("Location", review.locationRating)}
                            {renderCategoryRating("Value", review.valueRating)}
                          </div>

                          <p className="text-gray-700 leading-relaxed mb-4">
                            {review.reviewText}
                          </p>

                          {review.photos && review.photos.length > 0 && (
                            <div className="flex gap-2 mb-4 flex-wrap">
                              {review.photos.map((photo, index) => (
                                <img
                                  key={index}
                                  src={photo}
                                  alt={`Review photo ${index + 1}`}
                                  className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                />
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <button className="flex items-center gap-1 hover:text-primary transition-colors">
                              <ApperIcon name="ThumbsUp" className="w-4 h-4" />
                              <span>Helpful ({review.helpfulVotes})</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {getFilteredAndSortedReviews().length === 0 && (
                    <Card className="p-12 text-center">
                      <ApperIcon name="MessageSquare" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">No reviews match your filters</p>
                    </Card>
                  )}
</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        hotelId={id}
        hotelName={hotel?.name}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
};

export default HotelDetail;