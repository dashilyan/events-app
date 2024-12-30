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
  inputDate: null,
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
    setInputDate: (state, action) => {
      state.inputDate = action.payload;
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
          state.visits = action.payload.filtered;
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

        .addCase(endVisit.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(endVisit.fulfilled, (state, action) => {
          state.loading = false;
          
        })
         .addCase(endVisit.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(updateEventDate.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateEventDate.fulfilled, (state, action) => {
          state.loading = false;
        })
        .addCase(updateEventDate.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(deleteEventVisit.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(deleteEventVisit.fulfilled, (state, action) => {
          state.loading = false;
          state.events=action.payload.filtered;
        })
        .addCase(deleteEventVisit.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
      }
});
export const fetchVisits = createAsyncThunk(
  'visits/fetchVisits',
  async ({startDate,endDate,status_input,creator_input}, { dispatch, rejectWithValue }) => {
    let visitsData;
    try {
        const params = {};
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
        if (status_input) params.status = status_input;

      const response = await axios.get('/api/list-visits/', { params });
      visitsData = response.data;
      const filtered = visitsData.filter((visit) =>
        creator_input ? visit.user.toLowerCase().includes(creator_input.toLowerCase()) : true
      );

      return {filtered};
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
      console.log('visitDate.events: ',visitData.events);
      const currentEvents = visitData.events;
      const currentStatus = visitData.status;
      const currentGroup = visitData.group;

      if (visitData.status!=='draft'){
        allowChanges = false;
      } else {
        allowChanges = true;
      }
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
    if (!(events.every(event => event.date != null)) || group===null) return ; 
    try {
      const response = await api.formVisit.formVisitById(visitId);
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
export const endVisit = createAsyncThunk(
  'visits/endVisit',
  async ({visitId, accept_value}, { dispatch, rejectWithValue }) => {
    if (!visitId) return;
    try {
      let csrfToken = Cookies.get('csrftoken');
      const response = await fetch(`/api/moderate-visit/${visitId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({ accept:accept_value }),
      });
            
    } catch (error) {
      console.error('Ошибка при отклонении заявки:', error);
      // setError('Ошибка при отклонении заявки');
    }
  }
);
export const updateEventDate = createAsyncThunk(
  'visit/updateEventDate',
  async ({ visitId, eventId, inputDate }, { dispatch, rejectWithValue }) => {
    if (!visitId || !eventId || inputDate === '') {
      return rejectWithValue('Не все данные для обновления даты заполнены');
    }
    try {
      const csrfToken = Cookies.get('csrftoken');

      const response = await api.editEventVisit.editEventInVisit(visitId,{event_id: eventId, date: inputDate });

      if (response.status === 200) {
        return ; // Возвращаем данные, если все прошло хорошо
      } else {
        return rejectWithValue('Ошибка при обновлении даты события');
      }
    } catch (error) {
      console.error('Ошибка:', error);
       return rejectWithValue(error.message); // Возвращаем ошибку
    }
  }
);
export const updateGroup = createAsyncThunk(
  'visit/updateGroup',
  async ({ visitId, group }, { dispatch, rejectWithValue }) => {
    if (!visitId) return;

    try {
      let csrfToken = Cookies.get('csrftoken');
      const response = await api.visit.putVisitById(visitId, {group:group}, {
        headers: {
          'X-CSRFToken': csrfToken,
        }
      });
      if (response.status !== 200) {
        return rejectWithValue('Ошибка при удалении запроса');
    }} catch (error) {
      console.error('Ошибка:', error);
      return rejectWithValue('Ошибка при удалении запроса');
    }
    return;
  }
);
export const deleteEventVisit = createAsyncThunk(
  'visit/deleteEventVisit',
  async ({ visitId, eventId, events }, { dispatch, rejectWithValue }) => {
    if (!visitId || !eventId) return;
    // let filtered_events;
    try {
      let csrfToken = Cookies.get('csrftoken');
      const response = await fetch(`/api/edit-event-visit/${visitId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({ event_id:eventId }),
      });
      if (response.ok) {
        // Успешно удалено
        const filtered = events.filter((event) => event.pk!== eventId);        
        console.log('filtered: ',filtered);
        return {filtered};
      } else {
        return rejectWithValue('Ошибка при удалении мероприятия')
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const { setCartCount, setVisitPk, setEvents, setGroup, setInputDate } = visitsSlice.actions;

export default visitsSlice.reducer;