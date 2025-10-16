import { configureStore } from '@reduxjs/toolkit';
import hotelReducer from '@/store/slices/hotelSlice';
import bookingReducer from '@/store/slices/bookingSlice';
import userReducer from '@/store/slices/userSlice';

const store = configureStore({
  reducer: {
    hotels: hotelReducer,
    bookings: bookingReducer,
    user: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['hotels/setFilters'],
        ignoredPaths: ['hotels.filters.checkIn', 'hotels.filters.checkOut']
      }
    })
});

export default store;