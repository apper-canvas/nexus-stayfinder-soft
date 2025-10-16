import roomsData from "@/services/mockData/rooms.json";

class RoomService {
  constructor() {
    this.rooms = [...roomsData];
  }

  async getAllRooms() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.rooms];
  }

  async getRoomById(id) {
    await new Promise(resolve => setTimeout(resolve, 150));
    const room = this.rooms.find(r => r.Id === parseInt(id));
    if (!room) {
      throw new Error("Room not found");
    }
    return { ...room };
  }

  async getRoomsByHotelId(hotelId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.rooms.filter(room => room.hotelId === hotelId.toString());
  }

  async checkRoomAvailability(roomId, checkInDate, checkOutDate, guestCount) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const room = this.rooms.find(r => r.Id === parseInt(roomId));
    if (!room) {
      throw new Error("Room not found");
    }
    
    // Simulate availability check
    // In real app, this would check against booking database
    const isAvailable = room.available && guestCount <= room.maxOccupancy;
    
    return {
      available: isAvailable,
      room: { ...room },
      pricePerNight: room.pricePerNight,
      totalNights: this.calculateNights(checkInDate, checkOutDate),
      totalPrice: room.pricePerNight * this.calculateNights(checkInDate, checkOutDate)
    };
  }

  calculateNights(checkInDate, checkOutDate) {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  async getAvailableRooms(hotelId, checkInDate, checkOutDate, guestCount) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const hotelRooms = this.rooms.filter(room => room.hotelId === hotelId.toString());
    const availableRooms = hotelRooms.filter(room => 
      room.available && guestCount <= room.maxOccupancy
    );
    
    const nights = this.calculateNights(checkInDate, checkOutDate);
    
    return availableRooms.map(room => ({
      ...room,
      totalNights: nights,
      totalPrice: room.pricePerNight * nights
    }));
  }
}

const roomService = new RoomService();
export default roomService;