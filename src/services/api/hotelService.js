import hotelsData from "@/services/mockData/hotels.json";

class HotelService {
  constructor() {
    this.hotels = [...hotelsData];
  }

  async getAllHotels() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.hotels];
  }

  async getHotelById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const hotel = this.hotels.find(h => h.Id === parseInt(id));
    if (!hotel) {
      throw new Error("Hotel not found");
    }
    return { ...hotel };
  }

  async searchHotels(searchParams) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let filteredHotels = [...this.hotels];
    
    // Filter by destination
    if (searchParams.destination) {
      const searchTerm = searchParams.destination.toLowerCase();
      filteredHotels = filteredHotels.filter(hotel =>
        hotel.city.toLowerCase().includes(searchTerm) ||
        hotel.country.toLowerCase().includes(searchTerm) ||
        hotel.name.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by price range
    if (searchParams.priceRange) {
      // For simplicity, we'll use the average room price from rooms service
      // In real app, this would be more complex
      const { min, max } = searchParams.priceRange;
      filteredHotels = filteredHotels.filter(hotel => {
        // Simulate price filtering (this would need room data integration)
        const estimatedPrice = hotel.starRating * 100;
        return estimatedPrice >= min && estimatedPrice <= max;
      });
    }
    
    // Filter by star ratings
    if (searchParams.starRatings && searchParams.starRatings.length > 0) {
      filteredHotels = filteredHotels.filter(hotel =>
        searchParams.starRatings.includes(hotel.starRating)
      );
    }
    
    // Filter by amenities
    if (searchParams.amenities && searchParams.amenities.length > 0) {
      filteredHotels = filteredHotels.filter(hotel =>
        searchParams.amenities.every(amenity =>
          hotel.amenities.includes(amenity)
        )
      );
    }
    
    // Sort results
    if (searchParams.sortBy) {
      switch (searchParams.sortBy) {
        case "price":
          filteredHotels.sort((a, b) => a.starRating * 100 - b.starRating * 100);
          break;
        case "rating":
          filteredHotels.sort((a, b) => b.averageRating - a.averageRating);
          break;
        case "distance":
          filteredHotels.sort((a, b) => a.distanceFromCenter - b.distanceFromCenter);
          break;
        default:
          // Default sorting by rating
          filteredHotels.sort((a, b) => b.averageRating - a.averageRating);
      }
    }
    
    return filteredHotels;
  }

  async getDestinationSuggestions(query) {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    if (!query || query.length < 2) {
      return [];
    }
    
    const searchTerm = query.toLowerCase();
    const suggestions = [];
    
    this.hotels.forEach(hotel => {
      const cityMatch = `${hotel.city}, ${hotel.country}`;
      if (hotel.city.toLowerCase().includes(searchTerm) ||
          hotel.country.toLowerCase().includes(searchTerm)) {
        if (!suggestions.find(s => s.value === cityMatch)) {
          suggestions.push({
            value: cityMatch,
            label: cityMatch,
            type: "city"
          });
        }
      }
    });
    
    return suggestions.slice(0, 5);
  }

  async getFeaturedHotels() {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    // Return highest rated hotels
    const featured = [...this.hotels]
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 3);
    
    return featured;
  }
}

const hotelService = new HotelService();
export default hotelService;