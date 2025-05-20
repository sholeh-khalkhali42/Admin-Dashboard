// src/features/users/usersSlice.js
import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

const usersAdapter = createEntityAdapter();
const initialState = usersAdapter.getInitialState({ status: 'idle' });

// GET all users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const res = await axios.get('https://dummyjson.com/users');
  return res.data.users;
});

// DELETE user
export const deleteUser = createAsyncThunk('users/deleteUser', async (id) => {
  await axios.delete(`https://dummyjson.com/users/${id}`);
  return id;
});

// ADD user
export const addUser = createAsyncThunk('users/addUser', async (newUser) => {
  const res = await axios.post('https://dummyjson.com/users/add', newUser);
  return res.data;
});

// UPDATE user
export const updateUser = createAsyncThunk('users/updateUser', async ({ id, changes }) => {
  const res = await axios.put(`https://dummyjson.com/users/${id}`, changes);
  return res.data;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        usersAdapter.setAll(state, action.payload);
        state.status = 'succeeded';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        usersAdapter.removeOne(state, action.payload);
      })
      .addCase(addUser.fulfilled, (state, action) => {
        usersAdapter.addOne(state, action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        usersAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload,
        });
      });
  },
});

export default usersSlice.reducer;
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
} = usersAdapter.getSelectors((state) => state.users);
