import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { apiError } from "../../services/api";

export const fetchAdminStats = createAsyncThunk("admin/stats", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/admin/stats");
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const fetchUsers = createAsyncThunk("admin/users", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/admin/users");
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const fetchAdminDoctors = createAsyncThunk("admin/doctors", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/admin/doctors");
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const fetchAllAppointments = createAsyncThunk("admin/appointments", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/admin/appointments");
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const toggleDoctorApproval = createAsyncThunk(
  "admin/toggleApproval",
  async ({ id, isApproved }, thunkAPI) => {
    try {
      const { data } = await api.patch(`/admin/doctors/${id}/approve`, { isApproved });
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(apiError(error));
    }
  }
);

export const fetchPendingPayments = createAsyncThunk("admin/pendingPayments", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/admin/payments/pending");
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const verifyAdminPayment = createAsyncThunk(
  "admin/verifyPayment",
  async ({ id, isApproved, adminNote }, thunkAPI) => {
    try {
      const { data } = await api.patch(`/admin/payments/${id}/verify`, { isApproved, adminNote });
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(apiError(error));
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    stats: null,
    users: [],
    doctors: [],
    appointments: [],
    payments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchAdminDoctors.fulfilled, (state, action) => {
        state.doctors = action.payload;
      })
      .addCase(fetchAllAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload;
      })
      .addCase(toggleDoctorApproval.fulfilled, (state, action) => {
        state.doctors = state.doctors.map((doctor) =>
          doctor._id === action.payload._id ? action.payload : doctor
        );
      })
      .addCase(fetchPendingPayments.fulfilled, (state, action) => {
        state.payments = action.payload;
      })
      .addCase(verifyAdminPayment.fulfilled, (state, action) => {
        state.payments = state.payments.filter((p) => p._id !== action.payload._id);
      });
  },
});

export default adminSlice.reducer;
