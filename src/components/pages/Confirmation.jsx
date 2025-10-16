import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import bookingService from "@/services/api/bookingService";
import hotelService from "@/services/api/hotelService";
import roomService from "@/services/api/roomService";
import { toast } from "react-toastify";

const Confirmation = () => {
  const { confirmationNumber } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (confirmationNumber) {
      loadBookingDetails();
    }
  }, [confirmationNumber]);

  const loadBookingDetails = async () => {
    setLoading(true);
    setError("");
    
    try {
      const bookingData = await bookingService.getBookingByConfirmation(confirmationNumber);
      const [hotelData, roomData] = await Promise.all([
        hotelService.getHotelById(bookingData.hotelId),
        roomService.getRoomById(bookingData.roomId)
      ]);

      setBooking(bookingData);
      setHotel(hotelData);
      setRoom(roomData);
    } catch (err) {
      setError("Booking not found or failed to load details");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    // In a real app, this would generate and download a PDF invoice
    toast.success("Invoice download started");
  };

  const handleShareBooking = () => {
    if (navigator.share) {
      navigator.share({
        title: "Hotel Booking Confirmation",
        text: `Booking confirmed at ${hotel?.name}`,
        url: window.location.href
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Booking link copied to clipboard");
    }
  };

  const calculateNights = () => {
    if (!booking) return 0;
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !booking || !hotel || !room) {
    return (
      <Error
        message={error || "Booking confirmation not found"}
        onRetry={() => navigate("/")}
        actionText="Go Home"
      />
    );
  }

  const nights = calculateNights();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="CheckCircle" className="w-12 h-12 text-success" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Your reservation has been successfully confirmed. You'll receive a confirmation email shortly.
          </p>
          
          <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-lg text-white mb-8">
            <div className="text-sm font-medium mb-2">Confirmation Number</div>
            <div className="text-2xl md:text-3xl font-bold font-mono">
              {booking.confirmationNumber}
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <Card className="p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Hotel Image */}
            <div className="lg:col-span-1">
              <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
                <img
                  src={hotel.photos[0]}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: hotel.starRating }, (_, i) => (
                  <ApperIcon
                    key={i}
                    name="Star"
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  ({hotel.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Booking Information */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
                    {hotel.name}
                  </h2>
                  <p className="text-gray-600">{hotel.address}, {hotel.city}</p>
                  <Badge variant="confirmed" className="mt-2">
                    {booking.bookingStatus}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Guest Information</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{booking.guestName}</p>
                      <p>{booking.guestEmail}</p>
                      <p>{booking.guestPhone}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Room Details</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-medium">{room.name}</p>
                      <p>{room.bedConfiguration}</p>
                      <p>Up to {room.capacity} guests</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Stay Information</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Check-in:</span>
                        <span className="font-medium">
                          {new Date(booking.checkInDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-out:</span>
                        <span className="font-medium">
                          {new Date(booking.checkOutDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-medium">
                          {nights} night{nights !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Guests:</span>
                        <span className="font-medium">{booking.guestCount}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Payment Summary</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Room charges:</span>
                        <span>${booking.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxes & fees:</span>
                        <span>${booking.taxes.toFixed(2)}</span>
                      </div>
                      {booking.discount > 0 && (
                        <div className="flex justify-between text-success">
                          <span>Discount:</span>
                          <span>-${booking.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <hr className="border-gray-200" />
                      <div className="flex justify-between font-medium text-base">
                        <span>Total Paid:</span>
                        <span className="text-accent font-semibold">
                          ${booking.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {booking.specialRequests && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Special Requests</h3>
                  <p className="text-sm text-gray-600">{booking.specialRequests}</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            size="lg"
            onClick={handleDownloadInvoice}
            icon="Download"
            variant="outline"
          >
            Download Invoice
          </Button>
          
          <Button
            size="lg"
            onClick={handleShareBooking}
            icon="Share"
            variant="outline"
          >
            Share Booking
          </Button>

          <Button
            size="lg"
            onClick={() => navigate("/bookings")}
            icon="Calendar"
          >
            View All Bookings
          </Button>
        </div>

        {/* Important Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-info/5 border-info/20">
            <div className="flex items-start gap-3">
              <ApperIcon name="Info" className="w-6 h-6 text-info mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Check-in Instructions
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Check-in time: {hotel.policies?.checkIn}</p>
                  <p>• Please bring a valid ID and credit card</p>
                  <p>• Early check-in subject to availability</p>
                  <p>• Contact hotel directly for special arrangements</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-success/5 border-success/20">
            <div className="flex items-start gap-3">
              <ApperIcon name="Shield" className="w-6 h-6 text-success mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Cancellation Policy
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{booking.cancellationPolicy}</p>
                  <p>• No-show charges may apply</p>
                  <p>• Refunds processed within 5-7 business days</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">
            Need help with your booking? Our support team is here 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="sm" icon="Phone">
              Call Support
            </Button>
            <Button variant="outline" size="sm" icon="Mail">
              Email Support
            </Button>
            <Button variant="outline" size="sm" icon="MessageCircle">
              Live Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;