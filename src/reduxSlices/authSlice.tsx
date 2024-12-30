import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Cookie from 'js-cookie';
import Cookies from 'js-cookie';
import { setInputValue } from '../reduxSlices/eventSlice';
import axios from 'axios';
// Типы состояния
const initialState = {
  isAuthenticated: false,
  username: null,
  is_staff: false,
  password:null,
  email:'',
  first_name:'',
  last_name:'',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ username: string; is_staff: boolean }>) => {
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.is_staff = action.payload.is_staff;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = null;
      state.is_staff = false;
    },
    setUsername: (state,action) => {
      state.username = action.payload;
    },
    setPassword: (state,action) => {
      state.password = action.payload;
    },
    setEmail: (state,action) => {
      state.email = action.payload;
    },
    setFirstName: (state,action) => {
      state.first_name = action.payload;
    },
    setLastName: (state,action) => {
      state.last_name = action.payload;
    },
  },
  extraReducers: (builder) => {
        builder
          // fetch Visits
          .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
          })
           .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          .addCase(logoutUser.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(logoutUser.fulfilled, (state, action) => {
            state.loading = false;
            state.password= null;
          })
           .addCase(logoutUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          .addCase(regUser.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(regUser.fulfilled, (state, action) => {
            state.loading = false;
          })
           .addCase(regUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          .addCase(updateUser.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(updateUser.fulfilled, (state, action) => {
            state.loading = false;
          })
           .addCase(updateUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          .addCase(fetchUser.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchUser.fulfilled, (state, action) => {
            state.loading = false;
            state.email = action.payload.email || '';
            state.first_name = action.payload.first_name || '';
            state.last_name = action.payload.last_name || '';
          })
           .addCase(fetchUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
        }
});

export const loginUser = createAsyncThunk(
  'events/loginUser',
  async ({username,password}, { dispatch, rejectWithValue }) => {
    console.log(username,password);
    try {
      console.log(username,password);
      Cookie.remove('csrftoken');
      Cookie.remove('sessionid');
      const response = await fetch('/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }), // Отправляем username вместо email
      });
      console.log(response);
      if (response.ok) {
        const data = await response.json()
        let is_staff = false;
        console.log(data);
        if(data.is_staff == true) {
          is_staff = true;
        }
        dispatch(login({ username, is_staff })); // Авторизуем пользователя
      } else {
        return rejectWithValue('Неверное имя пользователя или пароль');
      }
    } catch (error) {
      return rejectWithValue('Ошибка при входе. Пожалуйста, попробуйте позже.');
    }
  }
);
export const logoutUser = createAsyncThunk(
  'events/logoutUser',
  async (_, { dispatch, rejectWithValue }) => {
        try {
          const csrfToken = Cookies.get('csrftoken'); // Получаем CSRF токен из cookies
    
          const response = await axios.post('/api/logout/', {}, {
            headers: {
              'X-CSRFToken': csrfToken, // Подставляем CSRF токен в заголовок запроса
              'Content-Type': 'application/json',
            }
          });
    
          if (response.status === 204) {
            dispatch(setInputValue(''));
            dispatch(logout());
            return ;
          }
        } catch (error) {
          return rejectWithValue('Ошибка при выходе. Пожалуйста, попробуйте позже.');
        }
  }
);
export const regUser = createAsyncThunk(
  'events/regUser',
  async ({email,username,password}, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(login({ username: data.username })); // Авторизуем пользователя после регистрации
      } else {
        alert('Ошибка регистрации. Пожалуйста, проверьте введенные данные.');
      }
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      alert('Ошибка при регистрации. Пожалуйста, попробуйте позже.');
    }    try {
          const response = await fetch('/api/auth/register/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password }),
          });
    
          if (response.ok) {
            const data = await response.json();
            dispatch(login({ username: data.username })); // Авторизуем пользователя после регистрации
          } else {
            return rejectWithValue('Ошибка регистрации. Пожалуйста, проверьте введенные данные.');
          }
        } catch (error) {
          return rejectWithValue('Ошибка при регистрации. Пожалуйста, попробуйте позже.');
        }
  }
);
export const updateUser = createAsyncThunk(
  'events/updateUser',
  async ({email,first_name,last_name}, { dispatch, rejectWithValue }) => {
    try {
      const csrfToken = Cookies.get('csrftoken'); // Получаем CSRF токен из cookies
      const data = {};

      // Добавляем только те параметры, которые не пустые
      if (email) data.email = email;
      if (first_name) data.first_name = first_name;
      if (last_name) data.last_name = last_name;

      // Проверяем, есть ли данные для отправки
      if (Object.keys(data).length === 0) {
        console.error('Необходимо ввести хотя бы один параметр для обновления.');
        return;
      }

      const response = await axios.put('/api/profile/', data, {
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        return;
       }
    } catch (error) {
      return rejectWithValue('Ошибка при обновлении данных профиля');
    }
  }
);
export const fetchUser = createAsyncThunk(
  'events/fetchUser',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const csrfToken = Cookies.get('csrftoken');
      const response = await axios.put('/api/profile/', {}, {
         headers: {
           'X-CSRFToken': csrfToken,
           'Content-Type': 'application/json',
         }
       });
      if (response.status === 200) {
        const { email, first_name, last_name } = response.data;
        setEmail(email || '');
        setFirstName(first_name || '');
        setLastName(last_name || '');
        return {email,first_name,last_name};
      }
    } catch (error) {
      console.error('Ошибка при получении данных профиля:', error);
    }
  }
);
export const { login, logout, setEmail, setFirstName, setLastName, setPassword, setUsername } = authSlice.actions;

export default authSlice.reducer;