import bookingsData from "@/services/mockData/bookings.json";

class BookingService {
  constructor() {
    this.bookings = [...bookingsData];
  }

  async getAllBookings() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.bookings];
  }

  async getBookingById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const booking = this.bookings.find(b => b.Id === parseInt(id));
    if (!booking) {
      throw new Error("Booking not found");
    }
    return { ...booking };
  }

  async getBookingByConfirmation(confirmationNumber) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const booking = this.bookings.find(b => b.confirmationNumber === confirmationNumber);
    if (!booking) {
      throw new Error("Booking not found");
    }
    return { ...booking };
  }

  async getUserBookings(userId) {
    await new Promise(resolve => setTimeout(resolve, 350));
    return this.bookings.filter(booking => booking.userId === userId);
  }

  async createBooking(bookingData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newId = Math.max(...this.bookings.map(b => b.Id)) + 1;
    const confirmationNumber = `SF-${new Date().getFullYear()}-${String(newId).padStart(6, "0")}`;
    
    const newBooking = {
      Id: newId,
      confirmationNumber,
      ...bookingData,
      paymentStatus: "paid",
      bookingStatus: "confirmed",
      createdAt: new Date().toISOString()
    };
    
    this.bookings.push(newBooking);
    return { ...newBooking };
  }

  async updateBooking(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const bookingIndex = this.bookings.findIndex(b => b.Id === parseInt(id));
    if (bookingIndex === -1) {
      throw new Error("Booking not found");
    }
    
    this.bookings[bookingIndex] = {
      ...this.bookings[bookingIndex],
      ...updateData
    };
    
    return { ...this.bookings[bookingIndex] };
  }

  async cancelBooking(id, reason) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const bookingIndex = this.bookings.findIndex(b => b.Id === parseInt(id));
    if (bookingIndex === -1) {
      throw new Error("Booking not found");
    }
    
    this.bookings[bookingIndex] = {
      ...this.bookings[bookingIndex],
      bookingStatus: "cancelled",
      cancellationReason: reason,
      cancelledAt: new Date().toISOString()
    };
    
    return { ...this.bookings[bookingIndex] };
  }

  async validatePromoCode(code) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const promoCodes = {
      "SPRING20": { discount: 0.2, description: "20% off spring promotion" },
      "SAVE15": { discount: 0.15, description: "Save 15% on your booking" },
      "WELCOME10": { discount: 0.1, description: "Welcome discount 10%" }
    };
    
    const promo = promoCodes[code.toUpperCase()];
    if (!promo) {
      throw new Error("Invalid promo code");
    }
    
    return promo;
  }

  calculateBookingTotal(subtotal, taxes, discount = 0) {
    return subtotal + taxes - discount;
  }

  calculateTaxes(subtotal, taxRate = 0.12) {
    return subtotal * taxRate;
  }

  calculateDiscount(subtotal, discountRate) {
    return subtotal * discountRate;
  }
}

const bookingService = new BookingService();
export default bookingService;