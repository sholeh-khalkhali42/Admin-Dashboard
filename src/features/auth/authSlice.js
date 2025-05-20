// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
export const loginUser = createAsyncThunk('auth/loginUser', async (data, thunkAPI) => {
  try {
  
    const res = await axios.post('https://dummyjson.com/auth/login', {
      username: data.username,
      password: data.password,
    });
    console.log('API Response:', res.data); 

    localStorage.setItem('token', res.data.accessToken);
    localStorage.setItem('user', JSON.stringify(res.data));
    return res.data;

  } catch (err) {
   
      console.error('Login Error:', err); 
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
   
    
  }
});



  const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    status: 'idle',
    error: null,
    
  };
  

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      
      .addCase(loginUser .fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.token =action.payload.accessToken;  
        console.log('Token:',  action.payload.accessToken); 
        localStorage.setItem('token',  action.payload.accessToken);
        localStorage.setItem('user', JSON.stringify(action.payload));
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'ورود ناموفق بود';
        
      })
     
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
