import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './eventSlice';

const storage = configureStore({
  reducer: {
    events: eventsReducer,
  },
});

export default storage;