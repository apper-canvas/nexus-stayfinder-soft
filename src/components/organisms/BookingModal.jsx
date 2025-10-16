import { useState } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import bookingService from "@/services/api/bookingService";
import { cn } from "@/utils/cn";

function BookingModal({ isOpen, onClose, hotel, searchParams, nights, onBookingComplete }) {
  const [loading, setLoading] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [specialRequests, setSpecialRequests] = useState("");
  const [errors, setErrors] = useState({});

  if (!isOpen || !hotel) return null;

  const pricePerNight = hotel.starRating * 100;
  const subtotal = pricePerNight * nights;
  const taxes = subtotal * 0.15;
  const total = subtotal + taxes;

  const validateForm = () => {
    const newErrors = {};
    
    if (!guestInfo.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!guestInfo.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!guestInfo.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const booking = await bookingService.createBooking({
        userId: "user1",
        hotelId: hotel.Id,
        roomId: null, // Quick booking without specific room
        checkInDate: searchParams.checkInDate,
        checkOutDate: searchParams.checkOutDate,
        guestCount: searchParams.guestCount,
        guestName: guestInfo.name,
        guestEmail: guestInfo.email,
        guestPhone: guestInfo.phone,
        specialRequests,
        promoCode: "",
        subtotal,
        taxes,
        discount: 0,
        totalAmount: total,
        paymentMethod: "credit-card"
      });

      onBookingComplete(booking.confirmationNumber);
    } catch (err) {
      toast.error("Failed to complete booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setGuestInfo({ name: "", email: "", phone: "" });
      setSpecialRequests("");
      setErrors({});
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-gray-900">
                Complete Your Booking
              </h2>
              <p className="text-sm text-gray-600 mt-1">{hotel.name}</p>
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          {/* Booking Summary */}
          <Card className="p-4 mb-6 bg-gray-50">
            <div className="space-y-2 text-sm">
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
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between text-base">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="font-bold text-accent">${total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Guest Information Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-error">*</span>
              </label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={guestInfo.name}
                onChange={(e) => {
                  setGuestInfo({ ...guestInfo, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                className={cn(errors.name && "border-error")}
                disabled={loading}
              />
              {errors.name && (
                <p className="text-xs text-error mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-error">*</span>
              </label>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={guestInfo.email}
                onChange={(e) => {
                  setGuestInfo({ ...guestInfo, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                className={cn(errors.email && "border-error")}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-xs text-error mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-error">*</span>
              </label>
              <Input
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={guestInfo.phone}
                onChange={(e) => {
                  setGuestInfo({ ...guestInfo, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
                className={cn(errors.phone && "border-error")}
                disabled={loading}
              />
              {errors.phone && (
                <p className="text-xs text-error mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests (Optional)
              </label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g., Early check-in, late check-out, room preferences..."
                rows={4}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Special requests are subject to availability and may incur additional charges.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm Booking
                    <ApperIcon name="Check" className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Trust Indicators */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <ApperIcon name="CheckCircle" className="w-4 h-4 text-success" />
                <span>Free cancellation</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Zap" className="w-4 h-4 text-info" />
                <span>Instant confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Lock" className="w-4 h-4 text-primary" />
                <span>Secure payment</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default BookingModal;