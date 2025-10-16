import { useState, useEffect } from "react";
import BookingCard from "@/components/molecules/BookingCard";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import bookingService from "@/services/api/bookingService";
import { toast } from "react-toastify";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, activeTab, searchQuery]);

  const loadBookings = async () => {
    setLoading(true);
    setError("");
    
    try {
      // In a real app, this would get the current user's bookings
      const userBookings = await bookingService.getUserBookings("user1");
      setBookings(userBookings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Filter by tab
    if (activeTab !== "all") {
      const now = new Date();
      switch (activeTab) {
        case "upcoming":
          filtered = filtered.filter(booking => 
            new Date(booking.checkInDate) > now && 
            booking.bookingStatus === "confirmed"
          );
          break;
        case "past":
          filtered = filtered.filter(booking => 
            new Date(booking.checkOutDate) < now || 
            booking.bookingStatus === "completed"
          );
          break;
        case "cancelled":
          filtered = filtered.filter(booking => 
            booking.bookingStatus === "cancelled"
          );
          break;
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.confirmationNumber.toLowerCase().includes(query) ||
        booking.guestName.toLowerCase().includes(query)
      );
    }

    // Sort by check-in date (newest first)
    filtered.sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate));

    setFilteredBookings(filtered);
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingService.cancelBooking(bookingId, "Cancelled by user");
      toast.success("Booking cancelled successfully");
      loadBookings(); // Refresh the list
    } catch (err) {
      toast.error("Failed to cancel booking");
    }
  };

  const handleModifyBooking = (bookingId) => {
    // In a real app, this would navigate to modification flow
    toast.info("Booking modification feature coming soon");
  };

  const tabs = [
    { id: "all", label: "All Bookings", count: bookings.length },
    { 
      id: "upcoming", 
      label: "Upcoming", 
      count: bookings.filter(b => 
        new Date(b.checkInDate) > new Date() && b.bookingStatus === "confirmed"
      ).length 
    },
    { 
      id: "past", 
      label: "Past", 
      count: bookings.filter(b => 
        new Date(b.checkOutDate) < new Date() || b.bookingStatus === "completed"
      ).length 
    },
    { 
      id: "cancelled", 
      label: "Cancelled", 
      count: bookings.filter(b => b.bookingStatus === "cancelled").length 
    }
  ];

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadBookings} />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          My Bookings
        </h1>
        <p className="text-gray-600">
          Manage your hotel reservations and travel plans
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search by confirmation number or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon="Search"
            />
          </div>

          {/* Export Options */}
          <div className="flex gap-3">
            <Button variant="outline" size="sm" icon="Download">
              Export PDF
            </Button>
            <Button variant="outline" size="sm" icon="Mail">
              Email Summary
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Empty
          title={searchQuery ? "No bookings found" : "No bookings yet"}
          description={
            searchQuery 
              ? "Try adjusting your search criteria"
              : "Start planning your next adventure by searching for hotels"
          }
          action={() => window.location.href = "/"}
          actionText="Search Hotels"
          icon="Calendar"
        />
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.Id}
              booking={booking}
              onCancel={handleCancelBooking}
              onModify={handleModifyBooking}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {filteredBookings.length > 0 && (
        <div className="mt-8 text-center">
          <Button variant="outline" size="lg">
            Load More Bookings
            <ApperIcon name="ChevronDown" className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <ApperIcon name="HelpCircle" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
            Need Help with Your Booking?
          </h3>
          <p className="text-gray-600 mb-6">
            Our customer support team is available 24/7 to assist you with any questions or changes to your reservations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" icon="Phone">
              Call Support
            </Button>
            <Button variant="outline" icon="MessageCircle">
              Live Chat
            </Button>
            <Button variant="outline" icon="Mail">
              Email Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;