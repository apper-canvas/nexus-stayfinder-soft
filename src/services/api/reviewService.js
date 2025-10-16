import reviewsData from "@/services/mockData/reviews.json";

class ReviewService {
  constructor() {
    this.reviews = [...reviewsData];
  }

  async getAllReviews() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.reviews];
  }

  async getReviewById(id) {
    await new Promise(resolve => setTimeout(resolve, 150));
    const review = this.reviews.find(r => r.Id === parseInt(id));
    if (!review) {
      throw new Error("Review not found");
    }
    return { ...review };
  }

  async getHotelReviews(hotelId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.reviews.filter(review => review.hotelId === hotelId.toString());
  }

  async getUserReviews(userId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.reviews.filter(review => review.userId === userId);
  }

  async createReview(reviewData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newId = Math.max(...this.reviews.map(r => r.Id)) + 1;
    
    const newReview = {
      Id: newId,
      ...reviewData,
      createdAt: new Date().toISOString(),
      helpfulVotes: 0
    };
    
    this.reviews.push(newReview);
    return { ...newReview };
  }

  async updateReview(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const reviewIndex = this.reviews.findIndex(r => r.Id === parseInt(id));
    if (reviewIndex === -1) {
      throw new Error("Review not found");
    }
    
    this.reviews[reviewIndex] = {
      ...this.reviews[reviewIndex],
      ...updateData
    };
    
    return { ...this.reviews[reviewIndex] };
  }

  async deleteReview(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const reviewIndex = this.reviews.findIndex(r => r.Id === parseInt(id));
    if (reviewIndex === -1) {
      throw new Error("Review not found");
    }
    
    const deletedReview = { ...this.reviews[reviewIndex] };
    this.reviews.splice(reviewIndex, 1);
    return deletedReview;
  }

  async getReviewStats(hotelId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const hotelReviews = this.reviews.filter(review => review.hotelId === hotelId.toString());
    
    if (hotelReviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        categoryAverages: {
          cleanliness: 0,
          comfort: 0,
          location: 0,
          value: 0
        }
      };
    }
    
    const totalReviews = hotelReviews.length;
    const averageRating = hotelReviews.reduce((sum, r) => sum + r.overallRating, 0) / totalReviews;
    
    const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    hotelReviews.forEach(review => {
      ratingBreakdown[review.overallRating]++;
    });
    
    const categoryAverages = {
      cleanliness: hotelReviews.reduce((sum, r) => sum + r.cleanlinessRating, 0) / totalReviews,
      comfort: hotelReviews.reduce((sum, r) => sum + r.comfortRating, 0) / totalReviews,
      location: hotelReviews.reduce((sum, r) => sum + r.locationRating, 0) / totalReviews,
      value: hotelReviews.reduce((sum, r) => sum + r.valueRating, 0) / totalReviews
    };
    
    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingBreakdown,
      categoryAverages
    };
  }
}

const reviewService = new ReviewService();
export default reviewService;