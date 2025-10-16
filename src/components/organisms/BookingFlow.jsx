import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import bookingService from "@/services/api/bookingService";
import hotelService from "@/services/api/hotelService";
import roomService from "@/services/api/roomService";
import { toast } from "react-toastify";

const BookingFlow = ({ bookingData }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form data
  const [guestInfo, setGuestInfo] = useState({
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567"
  });
  const [specialRequests, setSpecialRequests] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  
  // Booking details
  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [pricing, setPricing] = useState({
    subtotal: 0,
    taxes: 0,
    discount: 0,
    total: 0
  });

  useEffect(() => {
    if (bookingData) {
      loadBookingData();
    }
  }, [bookingData]);

  const loadBookingData = async () => {
    setLoading(true);
    try {
      const [hotelData, roomData] = await Promise.all([
        hotelService.getHotelById(bookingData.hotelId),
        roomService.getRoomById(bookingData.roomId)
      ]);

      setHotel(hotelData);
      setRoom(roomData);

      // Calculate pricing
      const nights = calculateNights(bookingData.checkInDate, bookingData.checkOutDate);
      const subtotal = roomData.pricePerNight * nights;
      const taxes = bookingService.calculateTaxes(subtotal);
      const total = subtotal + taxes;

      setPricing({
        subtotal,
        taxes,
        discount: 0,
        total
      });
    } catch (err) {
      setError("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = (checkIn, checkOut) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const handlePromoCodeApply = async () => {
    if (!promoCode.trim()) return;

    setLoading(true);
    try {
      const discount = await bookingService.validatePromoCode(promoCode);
      const discountAmount = bookingService.calculateDiscount(pricing.subtotal, discount.discount);
      
      setPromoDiscount(discount);
      setPricing(prev => ({
        ...prev,
        discount: discountAmount,
        total: prev.subtotal + prev.taxes - discountAmount
      }));

      toast.success(`Promo code applied! ${discount.description}`);
    } catch (err) {
      toast.error("Invalid promo code");
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async () => {
    setLoading(true);
    try {
      const booking = await bookingService.createBooking({
        userId: "user1", // In real app, get from auth context
        hotelId: bookingData.hotelId,
        roomId: bookingData.roomId,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        guestCount: bookingData.guestCount,
        guestName: guestInfo.name,
        guestEmail: guestInfo.email,
        guestPhone: guestInfo.phone,
        specialRequests,
        promoCode,
        subtotal: pricing.subtotal,
        taxes: pricing.taxes,
        discount: pricing.discount,
        totalAmount: pricing.total,
        paymentMethod
      });

      toast.success("Booking confirmed successfully!");
      navigate(`/confirmation/${booking.confirmationNumber}`);
    } catch (err) {
      setError("Failed to complete booking");
      toast.error("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: "Guest Information", icon: "User" },
    { id: 2, title: "Special Requests", icon: "MessageSquare" },
    { id: 3, title: "Payment", icon: "CreditCard" },
    { id: 4, title: "Confirmation", icon: "CheckCircle" }
  ];

  if (loading && !hotel) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadBookingData} />;
  }

  if (!bookingData || !hotel || !room) {
    return (
      <Error 
        message="Booking data not found"
        onRetry={() => navigate("/")}
        actionText="Start New Search"
      />
    );
  }

  const nights = calculateNights(bookingData.checkInDate, bookingData.checkOutDate);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Complete Your Booking
        </h1>
        <p className="text-gray-600">Just a few more steps to confirm your reservation</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                currentStep >= step.id
                  ? "bg-primary border-primary text-white"
                  : "border-gray-300 text-gray-400"
              }`}>
                <ApperIcon name={step.icon} className="w-5 h-5" />
              </div>
              <div className="ml-2 mr-8">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? "text-primary" : "text-gray-500"
                }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step.id ? "bg-primary" : "bg-gray-300"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            {/* Step 1: Guest Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-display font-semibold text-gray-900">
                  Guest Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={guestInfo.name}
                    onChange={(e) => setGuestInfo({...guestInfo, name: e.target.value})}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={guestInfo.email}
                    onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
                    required
                  />
                </div>
                
                <Input
                  label="Phone Number"
                  type="tel"
                  value={guestInfo.phone}
                  onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})}
                  required
                />

                <div className="flex justify-end">
                  <Button onClick={() => setCurrentStep(2)}>
                    Continue
                    <ApperIcon name="ChevronRight" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Special Requests */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-display font-semibold text-gray-900">
                  Special Requests
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Any special requests or preferences?
                  </label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g., Early check-in, late check-out, room preferences..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Special requests are subject to availability and may incur additional charges.
                  </p>
                </div>

                {/* Promo Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={handlePromoCodeApply}
                      disabled={!promoCode.trim() || loading}
                    >
                      Apply
                    </Button>
                  </div>
                  {promoDiscount && (
                    <p className="text-sm text-success mt-1">
                      ✓ {promoDiscount.description}
                    </p>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    <ApperIcon name="ChevronLeft" className="w-4 h-4" />
                    Back
                  </Button>
                  <Button onClick={() => setCurrentStep(3)}>
                    Continue
                    <ApperIcon name="ChevronRight" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-display font-semibold text-gray-900">
                  Payment Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Method
                  </label>
                  <div className="space-y-3">
                    {[
                      { id: "credit-card", label: "Credit Card", icon: "CreditCard" },
                      { id: "paypal", label: "PayPal", icon: "Wallet" },
                      { id: "apple-pay", label: "Apple Pay", icon: "Smartphone" }
                    ].map((method) => (
                      <label
                        key={method.id}
                        className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-3 accent-primary"
                        />
                        <ApperIcon name={method.icon} className="w-5 h-5 text-gray-600 mr-3" />
                        <span className="font-medium text-gray-900">{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ApperIcon name="Shield" className="w-5 h-5 text-success" />
                    <span className="font-medium text-gray-900">Secure Payment</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Your payment information is encrypted and secure. We use industry-standard SSL encryption.
                  </p>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    <ApperIcon name="ChevronLeft" className="w-4 h-4" />
                    Back
                  </Button>
                  <Button 
                    onClick={handleBookingSubmit}
                    loading={loading}
                    className="bg-gradient-to-r from-accent to-accent/80"
                  >
                    Complete Booking - ${pricing.total.toFixed(2)}
                    <ApperIcon name="Lock" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
              Booking Summary
            </h3>

            {/* Hotel & Room Info */}
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="font-medium text-gray-900">{hotel.name}</h4>
                <p className="text-sm text-gray-600">{hotel.address}</p>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: hotel.starRating }, (_, i) => (
                    <ApperIcon key={i} name="Star" className="w-3 h-3 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">
                    ({hotel.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">{room.name}</h5>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Check-in:</span>
                    <span>{new Date(bookingData.checkInDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out:</span>
                    <span>{new Date(bookingData.checkOutDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests:</span>
                    <span>{bookingData.guestCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nights:</span>
                    <span>{nights}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Price Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    ${room.pricePerNight} × {nights} nights
                  </span>
                  <span className="text-gray-900">${pricing.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & fees</span>
                  <span className="text-gray-900">${pricing.taxes.toFixed(2)}</span>
                </div>
                {pricing.discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Promo discount</span>
                    <span>-${pricing.discount.toFixed(2)}</span>
                  </div>
                )}
                <hr className="border-gray-200" />
                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-gray-900">Total</span>
                  <span className="text-accent">${pricing.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-success/10 rounded-lg">
              <div className="flex items-center gap-2">
                <ApperIcon name="CheckCircle" className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">Free Cancellation</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Cancel up to 24 hours before check-in for a full refund
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;