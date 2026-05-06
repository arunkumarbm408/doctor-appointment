import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { apiError } from "../../services/api";

export const bookAppointment = createAsyncThunk("appointments/book", async (payload, thunkAPI) => {
  try {
    const { data } = await api.post("/appointments", payload);
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const fetchMyAppointments = createAsyncThunk("appointments/list", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/appointments/me");
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const cancelAppointment = createAsyncThunk("appointments/cancel", async (id, thunkAPI) => {
  try {
    const { data } = await api.patch(`/appointments/${id}/cancel`);
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const submitPayment = createAsyncThunk("appointments/payment", async (formData, thunkAPI) => {
  try {
    const { data } = await api.post("/payments", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState: {
    appointments: [],
    loading: false,
    bookingLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchMyAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(bookAppointment.pending, (state) => {
        state.bookingLoading = true;
        state.error = null;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.appointments.unshift(action.payload);
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.bookingLoading = false;
        state.error = action.payload;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.appointments = state.appointments.map((appointment) =>
          appointment._id === action.payload._id ? action.payload : appointment
        );
      })
      .addCase(submitPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitPayment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default appointmentsSlice.reducer;
