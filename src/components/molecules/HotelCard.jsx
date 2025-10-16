import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const HotelCard = ({ hotel, className }) => {
  const navigate = useNavigate();
  const [imageLoading, setImageLoading] = useState(true);

  const handleViewDetails = () => {
    navigate(`/hotel/${hotel.Id}`);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <ApperIcon
        key={i}
        name="Star"
        className={cn(
          "w-4 h-4",
          i < rating ? "text-yellow-400 fill-current" : "text-gray-200"
        )}
      />
    ));
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

  return (
    <Card className={cn("hotel-card cursor-pointer overflow-hidden", className)} padding="none">
      <div onClick={handleViewDetails}>
        {/* Hotel Image */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 shimmer"></div>
          )}
          <img
            src={hotel.photos[0]}
            alt={hotel.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
          
          {/* Star Rating Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="default" className="bg-white/90 backdrop-blur-sm">
              <div className="flex items-center gap-1">
                {renderStars(hotel.starRating)}
              </div>
            </Badge>
          </div>

          {/* Distance Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant="primary" className="bg-primary/90 text-white backdrop-blur-sm">
              {hotel.distanceFromCenter}km from center
            </Badge>
          </div>
        </div>

        {/* Hotel Info */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-display font-semibold text-lg text-gray-900 line-clamp-1">
              {hotel.name}
            </h3>
            <div className="text-right ml-4 flex-shrink-0">
              <div className="text-lg font-bold text-accent">
                ${hotel.starRating * 100}
              </div>
              <div className="text-xs text-gray-500">per night</div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <ApperIcon name="Star" className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-900">
                {hotel.averageRating}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              ({hotel.reviewCount} reviews)
            </span>
            <ApperIcon name="MapPin" className="w-3 h-3 text-gray-400 ml-2" />
            <span className="text-sm text-gray-600">{hotel.city}</span>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-4">
            {hotel.amenities.slice(0, 4).map((amenity) => (
              <div
                key={amenity}
                className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded text-xs text-gray-600"
              >
                <ApperIcon 
                  name={getAmenityIcon(amenity)} 
                  className="w-3 h-3" 
                />
                <span>{amenity}</span>
              </div>
            ))}
            {hotel.amenities.length > 4 && (
              <div className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-500">
                +{hotel.amenities.length - 4} more
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-4 pb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewDetails}
          className="w-full"
        >
          View Details
          <ApperIcon name="ArrowRight" className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default HotelCard;