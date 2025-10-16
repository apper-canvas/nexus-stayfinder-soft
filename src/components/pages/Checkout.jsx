import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookingFlow from "@/components/organisms/BookingFlow";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const Checkout = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookingData();
  }, []);

  const loadBookingData = () => {
    try {
      const stored = localStorage.getItem("currentBooking");
      if (!stored) {
        navigate("/");
        return;
      }

      const data = JSON.parse(stored);
      setBookingData(data);
    } catch (error) {
      console.error("Failed to load booking data:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!bookingData) {
    return (
      <Error
        message="No booking data found"
        onRetry={() => navigate("/")}
        actionText="Start New Search"
      />
    );
  }

  return <BookingFlow bookingData={bookingData} />;
};

export default Checkout;