import { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const RoomCard = ({ room, nights, onSelect, selected = false }) => {
  const [imageLoading, setImageLoading] = useState(true);

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      "Ocean View": "Eye",
      "City View": "Building",
      "Mountain View": "Mountain",
      "Garden View": "Trees",
      "Balcony": "Home",
      "Mini Bar": "Wine",
      "Coffee Machine": "Coffee",
      "Bathtub": "Bath",
      "Work Desk": "Laptop",
      "High-Speed WiFi": "Wifi",
      "Executive Lounge Access": "Crown",
      "Premium Bedding": "Bed",
      "Fireplace": "Flame",
      "Kitchenette": "ChefHat",
      "Private Deck": "Home",
      "Ski Storage": "Mountain",
      "Art Supplies": "Palette",
      "Rooftop Terrace Access": "Building",
      "Work Space": "Briefcase",
      "Unique Design": "Sparkles",
      "Private Beach": "Sun",
      "Butler Service": "Bell",
      "Private Pool": "Waves",
      "Kitchen": "ChefHat",
      "Multiple Bathrooms": "Bath",
      "Terrace": "Home",
      "Room Service": "Bell",
      "Historic Character": "Castle",
      "Antique Furnishing": "Crown",
      "Historic Tours": "Map",
      "Original Architecture": "Building",
      "Modern Amenities": "Zap",
      "Garden Access": "Trees"
    };
    
    return iconMap[amenity] || "Check";
  };

  const totalPrice = room.pricePerNight * nights;

  return (
    <Card 
      className={`room-card transition-all duration-200 ${selected ? "ring-2 ring-primary ring-opacity-50 bg-primary/5" : ""}`}
      padding="none"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Room Image */}
        <div className="w-full lg:w-80 h-48 lg:h-auto bg-gray-200 overflow-hidden lg:rounded-l-lg lg:rounded-r-none rounded-t-lg lg:rounded-t-lg">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 shimmer"></div>
          )}
          <img
            src={room.photos[0]}
            alt={room.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
        </div>

        {/* Room Details */}
        <div className="flex-1 p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-display font-semibold text-gray-900">
                  {room.name}
                </h3>
                <span className="text-sm px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                  {room.type}
                </span>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Users" className="w-4 h-4" />
                  <span>Up to {room.capacity} guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Bed" className="w-4 h-4" />
                  <span>{room.bedConfiguration}</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Room Amenities</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {room.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <ApperIcon 
                        name={getAmenityIcon(amenity)} 
                        className="w-4 h-4 text-primary" 
                      />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <ApperIcon name="CheckCircle" className="w-4 h-4 text-success" />
                  <span>Free cancellation</span>
                </div>
                <div className="flex items-center gap-1">
                  <ApperIcon name="Clock" className="w-4 h-4 text-info" />
                  <span>Instant confirmation</span>
                </div>
              </div>
            </div>

            {/* Price and Action */}
            <div className="flex flex-col items-end gap-3 lg:w-48">
              <div className="text-right">
                <div className="text-2xl font-bold text-accent">
                  ${room.pricePerNight}
                </div>
                <div className="text-sm text-gray-500">per night</div>
                
                {nights > 1 && (
                  <div className="mt-1 pt-1 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      {nights} nights total:
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      ${totalPrice.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              <Button
                variant={selected ? "secondary" : "primary"}
                size="md"
                onClick={() => onSelect(room)}
                className="w-full"
              >
                {selected ? (
                  <>
                    <ApperIcon name="Check" className="w-4 h-4" />
                    Selected
                  </>
                ) : (
                  <>
                    <ApperIcon name="Plus" className="w-4 h-4" />
                    Select Room
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RoomCard;