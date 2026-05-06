import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { apiError } from "../../services/api";

export const fetchDoctors = createAsyncThunk("doctors/list", async (params = {}, thunkAPI) => {
  try {
    const { data } = await api.get("/doctors", { params });
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const fetchDoctorDetails = createAsyncThunk("doctors/details", async (id, thunkAPI) => {
  try {
    const { data } = await api.get(`/doctors/${id}`);
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const saveDoctorProfile = createAsyncThunk("doctors/saveProfile", async (formData, thunkAPI) => {
  try {
    const { data } = await api.put("/doctors/me/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const fetchDoctorAppointments = createAsyncThunk("doctors/appointments", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/doctors/me/appointments");
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(apiError(error));
  }
});

export const updateAppointmentStatus = createAsyncThunk(
  "doctors/updateStatus",
  async ({ id, status }, thunkAPI) => {
    try {
      const { data } = await api.patch(`/doctors/appointments/${id}/status`, { status });
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(apiError(error));
    }
  }
);

const doctorsSlice = createSlice({
  name: "doctors",
  initialState: {
    doctors: [],
    doctor: null,
    bookedSlots: [],
    pagination: null,
    doctorAppointments: [],
    loading: false,
    actionLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDoctorDetails.fulfilled, (state, action) => {
        state.doctor = action.payload.doctor;
        state.bookedSlots = action.payload.bookedSlots;
      })
      .addCase(fetchDoctorAppointments.fulfilled, (state, action) => {
        state.doctorAppointments = action.payload;
      })
      .addCase(saveDoctorProfile.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(saveDoctorProfile.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.doctor = action.payload;
      })
      .addCase(saveDoctorProfile.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        state.doctorAppointments = state.doctorAppointments.map((appointment) =>
          appointment._id === action.payload._id ? action.payload : appointment
        );
      });
  },
});

export default doctorsSlice.reducer;
