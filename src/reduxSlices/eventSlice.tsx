import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  inputValue: '',
  events: [],
  filteredEvents: [],
  currentVisitId: null,
  currentCount: 0,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload;
      state.filteredEvents = action.payload;
    },
    setFilteredEvents: (state, action) => {
      state.filteredEvents = action.payload;
    },
    setInputValue: (state, action) => {
      state.inputValue = action.payload;
    },

    setCurrentVisitId: (state, action) => {
      state.currentVisitId = action.payload;
    },
    setCurrentCount: (state, action) => {
      state.currentCount = action.payload;
    },
  },
});

export const {
  setEvents,
  setFilteredEvents,
  setInputValue,
  setCurrentVisitId,
  setCurrentCount,
} = eventsSlice.actions;

export default eventsSlice.reducer;