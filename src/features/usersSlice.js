// src/slices/usersSlice.js
import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from '../utils/axiosInstance';

// Create an entity adapter for users
const usersAdapter = createEntityAdapter();

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get('/users');
  return response.data;
});

export const addUser = createAsyncThunk('users/addUser', async (newUser) => {
  const response = await axios.post('/users', newUser);
  return response.data;
});

export const updateUser = createAsyncThunk('users/updateUser', async (updatedUser) => {
  const response = await axios.put(`/users/${updatedUser.id}`, updatedUser);
  return response.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (userId) => {
  await axios.delete(`/users/${userId}`);
  return userId;
});

// Slice using entity adapter
const usersSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState({
    loading: false,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        usersAdapter.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        usersAdapter.addOne(state, action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        usersAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload,
        });
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        usersAdapter.removeOne(state, action.payload);
      });
  },
});

export const { selectAll: selectAllUsers, selectById: selectUserById } = usersAdapter.getSelectors(
  (state) => state.users
);

export default usersSlice.reducer;
