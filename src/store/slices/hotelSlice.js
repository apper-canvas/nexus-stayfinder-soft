import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hotels: [],
  filteredHotels: [],
  selectedHotel: null,
  savedHotels: [],
  filters: {
    location: '',
    checkIn: null,
    checkOut: null,
    guests: 2,
    priceRange: [0, 1000],
    rating: 0,
    amenities: []
  },
  loading: false,
  error: null
};

const hotelSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    setHotels: (state, action) => {
      state.hotels = action.payload;
      state.filteredHotels = action.payload;
    },
    setFilteredHotels: (state, action) => {
      state.filteredHotels = action.payload;
    },
    setSelectedHotel: (state, action) => {
      state.selectedHotel = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    toggleSavedHotel: (state, action) => {
      const hotelId = action.payload;
      const index = state.savedHotels.indexOf(hotelId);
      if (index > -1) {
        state.savedHotels.splice(index, 1);
      } else {
        state.savedHotels.push(hotelId);
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const {
  setHotels,
  setFilteredHotels,
  setSelectedHotel,
  setFilters,
  toggleSavedHotel,
  setLoading,
  setError
} = hotelSlice.actions;

export default hotelSlice.reducer;