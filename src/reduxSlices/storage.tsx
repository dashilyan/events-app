import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './eventSlice';
import authReducer from './authSlice';
import visitsReducer from './visitSlice'
import loggingMiddleware from './loggingMiddleware';
const storage = configureStore({
  reducer: {
    events: eventsReducer,
    auth: authReducer,
    visits: visitsReducer,
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(loggingMiddleware)
});

export default storage;