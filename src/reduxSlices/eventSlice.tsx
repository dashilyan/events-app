import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie'
import {api} from '../api'
const defaultImageUrl = '/events-app/mock_img/8.png';
import axios from 'axios';

const mockEvents = [
  {
    pk: 1,
    event_name: 'Выставка робототехники',
    event_type: 'Выставка',
    duration: '2 часа',
    description: 'Описание выставки',
    img_url: null,
  },
  {
    pk: 2,
    event_name: 'Лекция по искусственному интеллекту',
    event_type: 'Лекция',
    duration: '1.5 часа',
    description: 'Описание лекция',
    img_url: null,
  },
  {
    pk: 3,
    event_name: 'Мастер-класс по программированию',
    event_type: 'Мастер-класс',
    duration: '3 часа',
    description: 'Описание мастер-класса',
    img_url: null,
  },
];

export const fetchEvents = createAsyncThunk(
    'events/fetchEvents',
    async (inputValue, { dispatch, rejectWithValue }) => {
      try {
        let response;
        let eventsData;
        let result;
        if (inputValue === '' || inputValue === undefined) {
          response = await fetch('/api/events/');
          result = await response.json();
          eventsData= result.filter(item => item.pk !== undefined);
        } else {
          response = await fetch(`/api/events/?event_type=${inputValue}`);
          result = await response.json();
          eventsData = result.filter(item => item.pk !== undefined);
        }
        const visitData = result.find(item => item.visit);

        let currentCount;
        let currentVisitId;

        if (visitData?.visit?.pk) {
          currentVisitId = visitData.visit.pk;
          currentCount = visitData.visit.events_count;
        } else {
          currentVisitId = null;
          currentCount = 0;
        }

        return { eventsData, currentVisitId, currentCount };

      } catch (error) {
        console.error('Ошибка при загрузке данных мероприятий:', error);
         if (inputValue === '') {
            return rejectWithValue({ eventsData: mockEvents, currentVisitId: null, currentCount: 0});
         } else{
          const filtered = mockEvents.filter(event =>
              event.event_type.toLowerCase().includes(inputValue.toLowerCase())
            );
            return rejectWithValue({ eventsData: filtered, currentVisitId: null, currentCount: 0});
         }
      }
    }
  );
export const fetchEvent = createAsyncThunk(
    'events/fetchEvent',
    async (eventId, { dispatch, rejectWithValue }) => {
      let eventData;
      try {
        const response = await fetch(`/api/events/${eventId}/`);
        if (!response.ok) {
          throw new Error('Ошибка при загрузке данных мероприятия');
        }
        eventData = await response.json();
      } catch (err) {
        // Используем мок-данные, если произошла ошибка
        eventData = mockEvents.find(item => item.pk === parseInt(eventId, 10));
      }
        if (eventData) {
          return { eventData }
        } 
        else {
          return rejectWithValue({ eventData: null });
        }
    }
);
const initialState = {
  inputValue: '',

  events: [],
  filteredEvents: [],

  currentVisitId: null,
  currentCount: 0,

  currentEvent: null,
  event: {
    pk:null,
    event_name: '',
    event_type: '',
    duration: '',
    description: '',
    img_url: '',
  },
  imageFile: null,
  imageUrl:null,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setFilteredEvents: (state, action) => {
      state.filteredEvents = action.payload;
    },
    setInputValue: (state, action) => {
      state.inputValue = action.payload;
    },
    setCurrentCount: (state, action) => {
      state.currentCount = action.payload;
    },
    setCurrentVisitId: (state, action) => {
      state.currentVisitId = action.payload;
    },
    setEvent: (state,action) =>{
      state.event = action.payload;
    },
    setImageFile: (state,action) =>{
      state.imageFile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.eventsData;
        state.filteredEvents = action.payload.eventsData;
        state.currentVisitId = action.payload.currentVisitId;
        state.currentCount = action.payload.currentCount;
      })
       .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.events = action.payload.eventsData;
        state.filteredEvents = action.payload.eventsData;
        state.currentVisitId = action.payload.currentVisitId;
        state.currentCount = action.payload.currentCount;
      })

      .addCase(addEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.loading = false;

        state.events = action.payload.eventsData;
        state.filteredEvents = action.payload.eventsData;

        state.currentVisitId = action.payload?.currentVisitId;
        state.currentCount=action.payload?.currentCount;
      })
      .addCase(addEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload.eventData;
      })
       .addCase(fetchEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        // state.img_url = action.payload.eventData;
      })
       .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(editEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload.eventData;
      })
       .addCase(editEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
      })
       .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});
export const addEvent = createAsyncThunk(
  'events/addEvent',
  async (eventId: number, { dispatch, rejectWithValue }) => {
    console.log(eventId);
    try {
      const csrfToken = Cookies.get('csrftoken');

      await api.events.signupCreate(eventId,{}, {
          headers: {
            'X-CSRFToken': csrfToken,
          },
        });

      const response = await api.events.eventsList();
      const eventsData = response.data.filter((item) => item.pk !== undefined);

      // Проверяем наличие заявки
      let currentCount;
      let currentVisitId;
      const visitData = response.data.find(item => item.visit);
      currentVisitId=visitData?.visit?.pk || null;
      currentCount=visitData?.visit?.events_count || 0;
      return { eventsData, currentVisitId, currentCount };
    } catch (err: any) {
        console.error('Ошибка при добавлении события:', err);
        return rejectWithValue({ eventsData: filtered, currentVisitId: null, currentCount: 0});
      }
  }
);
export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (eventId, { dispatch, rejectWithValue }) => {
    try {
      await api.events.eventDelete(eventId, {
        headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
      });
      return;
    } catch (error) {
      return rejectWithValue('Ошибка при удалении мероприятия');
    }
  }
);
export const uploadImage = createAsyncThunk(
  'events/uploadImage',
  async ({eventId, imageFile}, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData();
      console.log(imageFile)
      formData.append('event_id', eventId);
      formData.append('pic', imageFile);

      const response = await axios.post('/api/events/image/',formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
      });

      if (response.status === 201) {
        return `http://192.168.56.101:9000/static/${imageFile.name}`;
      } else {
        return rejectWithValue('Ошибка при загрузке изображения')
      }
    } catch (err) {
      return rejectWithValue('Не удалось загрузить изображение.')
    }
  }
);
export const editEvent = createAsyncThunk(
  'events/editEvent',
  async ({eventId, event, imageFile}, { dispatch, rejectWithValue }) => {
    try {
      let curr_id;
      let eventData;
      const newEvent = { ...event, img_url: defaultImageUrl};
      if (eventId) {
        await api.events.eventUpdate(eventId, newEvent, {
          headers: { 'X-CSRFToken': Cookies.get('csrftoken')},
        });
        eventData=newEvent;
        curr_id = newEvent.pk;
      } else {
        const response=await axios.post('/api/events/create/', newEvent, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
      });
      console.log(response);
      eventData = await response.json();
      curr_id = eventData.pk;
      }
      let imageUrl = event.img_url;
      if (imageFile) {
        // Сначала загружаем изображение
        imageUrl = await uploadImage(curr_id,imageFile);
      }
      return {eventData}
      } catch (error) {
      // console.error('Ошибка при сохранении мероприятия:', err);
      return rejectWithValue(`Ошибка при сохранении мероприятия: ${error.message}`);
    }
  }
);
export const {
  setFilteredEvents,
  setInputValue,setCurrentCount, setCurrentVisitId, setEvent, setImageFile
} = eventsSlice.actions;

export default eventsSlice.reducer;