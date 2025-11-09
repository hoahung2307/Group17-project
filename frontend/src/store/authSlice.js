import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    // Chuẩn endpoint theo backend: /auth/login
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, thunkAPI) => {
  try {
    // Chuẩn endpoint theo backend: /user/profile
    const response = await api.get('/user/profile');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    token: null, // Thêm trường token
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      console.log('[authSlice] Logout, xóa user và token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('[authSlice] Đang đăng nhập...');
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.token = action.payload.refreshToken;
        console.log('[authSlice] Đăng nhập thành công:', action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('[authSlice] Đăng nhập thất bại:', action.payload);
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('[authSlice] Đang lấy profile...');
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        console.log('[authSlice] Lấy profile thành công:', action.payload);
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('[authSlice] Lấy profile thất bại:', action.payload);
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
