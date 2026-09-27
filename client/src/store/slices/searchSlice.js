import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  specialty: 'All',
  maxDistance: 20, // 20 km default
  maxFees: 5000,
  sortBy: 'recommended', // recommended, distance, fees_low_high, rating
  searchQuery: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetFilters: () => initialState,
  },
});

export const { setFilters, resetFilters } = searchSlice.actions;

export const selectFilters = (state) => state.search;

export default searchSlice.reducer;
