import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { apiError } from "../../services/api";

const storedUser = localStorage.getItem("doctor-book-user");

export const loginUser = createAsyncThunk("auth/login", async (payload, thunkAPI) => {
  try {
    const { data } = await api.post("/auth/login", payload);
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const registerUser = createAsyncThunk("auth/register", async (payload, thunkAPI) => {
  try {
    const { data } = await api.post("/auth/register", payload);
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const fetchCurrentUser = createAsyncThunk("auth/me", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/auth/me");
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    doctorProfile: null,
    token: localStorage.getItem("doctor-book-token"),
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.doctorProfile = null;
      state.token = null;
      localStorage.removeItem("doctor-book-token");
      localStorage.removeItem("doctor-book-user");
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("doctor-book-token", action.payload.token);
        localStorage.setItem("doctor-book-user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("doctor-book-token", action.payload.token);
        localStorage.setItem("doctor-book-user", JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.doctorProfile = action.payload.doctorProfile;
        if (action.payload.user) {
          localStorage.setItem("doctor-book-user", JSON.stringify(action.payload.user));
        }
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.doctorProfile = null;
        localStorage.removeItem("doctor-book-token");
        localStorage.removeItem("doctor-book-user");
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
