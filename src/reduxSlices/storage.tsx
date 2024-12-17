import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './eventSlice';
import authReducer from './authSlice';
import visitsReducer from './visitSlice'

const storage = configureStore({
  reducer: {
    events: eventsReducer,
    auth: authReducer,
    visits: visitsReducer,
  },
});

export default storage;