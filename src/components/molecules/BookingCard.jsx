import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const BookingCard = ({ booking, onCancel, onModify }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <Badge variant="confirmed">Confirmed</Badge>;
      case "pending":
        return <Badge variant="pending">Pending</Badge>;
      case "cancelled":
        return <Badge variant="cancelled">Cancelled</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const handleViewDetails = () => {
    navigate(`/booking/${booking.Id}`);
  };

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      setLoading(true);
      try {
        await onCancel?.(booking.Id);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleModify = () => {
    onModify?.(booking.Id);
  };

  const isUpcoming = new Date(booking.checkInDate) > new Date();
  const canCancel = booking.bookingStatus === "confirmed" && isUpcoming;
  const canModify = booking.bookingStatus === "confirmed" && isUpcoming;

  return (
    <Card className="hover:shadow-medium transition-all duration-200" padding="lg">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Hotel Image */}
        <div className="w-full lg:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&q=80"
            alt="Hotel"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Booking Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-display font-semibold text-lg text-gray-900">
                  Hotel Booking
                </h3>
                {getStatusBadge(booking.bookingStatus)}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Calendar" className="w-4 h-4 text-gray-400" />
                  <span>
                    {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <ApperIcon name="Users" className="w-4 h-4 text-gray-400" />
                  <span>{booking.guestCount} {booking.guestCount === 1 ? "Guest" : "Guests"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <ApperIcon name="CreditCard" className="w-4 h-4 text-gray-400" />
                  <span>Total: ${booking.totalAmount.toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <ApperIcon name="Hash" className="w-4 h-4 text-gray-400" />
                  <span>{booking.confirmationNumber}</span>
                </div>
              </div>

              {booking.specialRequests && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <ApperIcon name="MessageSquare" className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Special Requests:</p>
                      <p className="text-sm text-gray-600">{booking.specialRequests}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 lg:w-48">
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewDetails}
                className="w-full"
              >
                <ApperIcon name="Eye" className="w-4 h-4" />
                View Details
              </Button>

              {canModify && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleModify}
                  className="w-full"
                >
                  <ApperIcon name="Edit" className="w-4 h-4" />
                  Modify Booking
                </Button>
              )}

              {canCancel && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  loading={loading}
                  className="w-full text-error hover:bg-error/10"
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BookingCard;