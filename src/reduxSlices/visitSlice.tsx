import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {api} from '../api'
import Cookies from 'js-cookie'
import { useSelector } from 'react-redux';
import axios from 'axios'


const initialState = {
  cart_count: 0,
  pk: null,
  loading: true,
  error: null,
  visits: [],
  allowChanges: true,
  status:'',
  group: '',
  events: [],
};

const visitsSlice = createSlice({
  name: 'visits',
  initialState,
  reducers: {
    setCartCount: (state, action) => {
      state.cart_count = action.payload; 
    },
    setVisitPk: (state, action) => {
      state.pk = action.payload;
    },
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    setGroup: (state, action) => {
      state.group = action.payload;
    },
    },
  extraReducers: (builder) => {
      builder
        // fetch Visits
        .addCase(fetchVisits.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchVisits.fulfilled, (state, action) => {
          state.loading = false;
          state.visits = action.payload.visitsData;
        })
         .addCase(fetchVisits.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        // fetch Visit
        .addCase(fetchVisit.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchVisit.fulfilled, (state, action) => {
          state.loading = false;
          state.events = action.payload.currentEvents;
          state.status = action.payload.currentStatus;
          state.group =action.payload.currentGroup;
          state.allowChanges=action.payload.allowChanges;
        })
         .addCase(fetchVisit.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        //form visit
        .addCase(formVisit.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(formVisit.fulfilled, (state, action) => {
          state.loading = false;
          state.events = action.payload.eventsData;
          state.cart_count = action.payload.currentCount;
          state.pk =action.payload?.currentVisitId;
        })
         .addCase(formVisit.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(deleteVisit.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(deleteVisit.fulfilled, (state, action) => {
          state.loading = false;
          state.events = action.payload.eventsData;
          state.cart_count = action.payload.currentCount;
          state.pk =action.payload?.currentVisitId;
        })
         .addCase(deleteVisit.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      }
});
export const fetchVisits = createAsyncThunk(
  'visits/fetchVisits',
  async ({startDate,endDate,status_input}, { dispatch, rejectWithValue }) => {
    let visitsData;
    try {
        const params = {};
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
        if (status_input) params.status = status_input;

      const response = await axios.get('/api/list-visits/', { params });
      visitsData = response.data;
      return {visitsData};
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      return rejectWithValue({visitsData: null});
    }
  }
);

export const fetchVisit = createAsyncThunk(
  'visits/fetchVisit',
  async (visitId, { dispatch, rejectWithValue }) => {
    let visitData;
    let allowChanges;
    try {
      const response = await api.visit.getVisitById(visitId);
      visitData = await response.data;
      const currentEvents = visitData.events;
      const currentStatus = visitData.status;
      const currentGroup = visitData.group;

      if (visitData.status!=='draft'){
        allowChanges = false;
      } else {
        allowChanges = true;
      }
      console.log(allowChanges, currentStatus);
      return {visitData, currentEvents, currentStatus, currentGroup, allowChanges};
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      return rejectWithValue({visitData: null});
    }
  }
);
export const formVisit = createAsyncThunk(
  'visits/formVisit',
  async (visitId, { dispatch, rejectWithValue }) => {
    if (!visitId) return;
    try {
      const response = await api.formVisit.formVisitById(visitId);
      console.log(response.status);
      if (response.status === 200) {
        const eventsData = [];
        const currentVisitId = null;
        const currentCount = 0;
        return {eventsData, currentVisitId, currentCount};
      } else {
        return rejectWithValue({eventsData:null, currentVisitId:null, currentCount:0});
      }
    } catch (error) {
      return rejectWithValue({eventsData:null, currentVisitId:null, currentCount:0});
    }
  }
);
export const deleteVisit = createAsyncThunk(
  'events/formVisit',
  async (visitId, { dispatch, rejectWithValue }) => {
  if (!visitId) return; 

  try {
    let csrfToken = Cookies.get('csrftoken');
    const response = await fetch(`/api/moderate-visit/${visitId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      }
    });

    if (response.ok) {
      const eventsData = [];
      const currentVisitId = null;
      const currentCount = 0;
      return {eventsData, currentVisitId, currentCount};
    } else {
      return rejectWithValue({eventsData:null, currentVisitId:null, currentCount:0});
    }
  } catch (error) {
    return rejectWithValue({eventsData:null, currentVisitId:null, currentCount:0});
  }
  }
);
export const { setCartCount, setVisitPk, setEvents, setGroup } = visitsSlice.actions;

export default visitsSlice.reducer;