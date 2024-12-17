import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

// Типы состояния
interface VisitsState {
  cart_count: number;
  pk: number | null;
}

const initialState: VisitsState = {
  cart_count: 0,
  pk: null
};

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    setCartCount: (state, action) => {
      state.cart_count = action.payload; 
    },
    setVisitPk: (state, action) => {
      state.pk = action.payload;
    }
  },
});

export const { setCartCount, setVisitPk } = requestsSlice.actions;

export default requestsSlice.reducer;