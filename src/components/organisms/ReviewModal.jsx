import { useState } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ReviewModal = ({ isOpen, onClose, hotelId, hotelName, onReviewSubmitted }) => {
  const [formData, setFormData] = useState({
    cleanlinessRating: 0,
    comfortRating: 0,
    locationRating: 0,
    valueRating: 0,
    overallRating: 0,
    reviewText: "",
    travelerType: "",
    photos: []
  });
  const [hoveredRating, setHoveredRating] = useState({});
  const [photoUrls, setPhotoUrls] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleRatingClick = (category, rating) => {
    setFormData(prev => ({ ...prev, [category]: rating }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotoUrls = files.map(file => URL.createObjectURL(file));
    setPhotoUrls(prev => [...prev, ...newPhotoUrls]);
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotoUrls]
    }));
  };

  const handleRemovePhoto = (index) => {
    setPhotoUrls(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.reviewText.length < 500) {
      toast.error("Review text must be at least 500 characters");
      return;
    }

    if (!formData.travelerType) {
      toast.error("Please select a traveler type");
      return;
    }

    const missingRatings = [];
    if (!formData.cleanlinessRating) missingRatings.push("Cleanliness");
    if (!formData.comfortRating) missingRatings.push("Comfort");
    if (!formData.locationRating) missingRatings.push("Location");
    if (!formData.valueRating) missingRatings.push("Value");
    if (!formData.overallRating) missingRatings.push("Overall");

    if (missingRatings.length > 0) {
      toast.error(`Please rate: ${missingRatings.join(", ")}`);
      return;
    }

    setSubmitting(true);

    try {
      const reviewData = {
        hotelId: hotelId.toString(),
        userId: `user_${Date.now()}`,
        cleanlinessRating: formData.cleanlinessRating,
        comfortRating: formData.comfortRating,
        locationRating: formData.locationRating,
        valueRating: formData.valueRating,
        overallRating: formData.overallRating,
        reviewText: formData.reviewText,
        travelerType: formData.travelerType,
        photos: formData.photos,
        bookingId: null
      };

      await onReviewSubmitted(reviewData);
      
      toast.success("Review submitted successfully!");
      
      setFormData({
        cleanlinessRating: 0,
        comfortRating: 0,
        locationRating: 0,
        valueRating: 0,
        overallRating: 0,
        reviewText: "",
        travelerType: "",
        photos: []
      });
      setPhotoUrls([]);
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarInput = (category, label) => {
    const currentRating = formData[category];
    const displayRating = hoveredRating[category] || currentRating;

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => handleRatingClick(category, rating)}
              onMouseEnter={() => setHoveredRating(prev => ({ ...prev, [category]: rating }))}
              onMouseLeave={() => setHoveredRating(prev => ({ ...prev, [category]: 0 }))}
              className="transition-transform hover:scale-110"
            >
              <ApperIcon
                name="Star"
                className={cn(
                  "w-6 h-6 transition-colors",
                  rating <= displayRating
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                )}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-gray-900">
                Write a Review
              </h2>
              <p className="text-sm text-gray-600 mt-1">{hotelName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Ratings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderStarInput("cleanlinessRating", "Cleanliness")}
              {renderStarInput("comfortRating", "Comfort")}
              {renderStarInput("locationRating", "Location")}
              {renderStarInput("valueRating", "Value for Money")}
            </div>

            {/* Overall Rating */}
            <div className="pt-4 border-t border-gray-200">
              {renderStarInput("overallRating", "Overall Rating")}
            </div>

            {/* Traveler Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Traveler Type
              </label>
              <select
                value={formData.travelerType}
                onChange={(e) => setFormData(prev => ({ ...prev, travelerType: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select type</option>
                <option value="Business">Business</option>
                <option value="Leisure">Leisure</option>
                <option value="Family">Family</option>
                <option value="Solo">Solo Traveler</option>
                <option value="Couples">Couples</option>
              </select>
            </div>

            {/* Review Text */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Your Review (minimum 500 characters)
              </label>
              <textarea
                value={formData.reviewText}
                onChange={(e) => setFormData(prev => ({ ...prev, reviewText: e.target.value }))}
                placeholder="Share your experience at this hotel..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
              <div className="text-xs text-gray-500 text-right">
                {formData.reviewText.length} / 500 characters
              </div>
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Add Photos (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <ApperIcon name="Upload" className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Click to upload photos
                  </span>
                </label>
              </div>

              {photoUrls.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {photoUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ApperIcon name="X" className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={submitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ReviewModal;