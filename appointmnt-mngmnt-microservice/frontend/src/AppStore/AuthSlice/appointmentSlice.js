import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import SummaryApi from "../../common/index";

// 🔹 Schedule an Appointment
export const scheduleAppointment = createAsyncThunk(
  "appointment/scheduleAppointment",
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await fetch(SummaryApi.Appointment.schedule.url, {
        method: SummaryApi.Appointment.schedule.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });
      if (!response.ok) {
        throw new Error("Failed to schedule appointment");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// 🔹 Complete an Appointment
export const completeAppointment = createAsyncThunk(
  "appointment/completeAppointment",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const url = SummaryApi.Appointment.complete.url.replace(":id", id);
      console.log("url:",url);
      
      const response = await fetch(url, {
        method: SummaryApi.Appointment.complete.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error("Failed to complete appointment");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// 🔹 Get All Appointments
export const getAllAppointments = createAsyncThunk(
  "appointment/getAllAppointments",
  async (_, { rejectWithValue }) => {
    try {
      console.log("link:",SummaryApi.Appointment.getAll.url);
      
      const response = await fetch(SummaryApi.Appointment.getAll.url, {
        method: SummaryApi.Appointment.getAll.method,
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// 🔹 Get Appointments by User ID
export const getAppointmentsByUser = createAsyncThunk(
  "appointment/getAppointmentsByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const url = SummaryApi.Appointment.getByUser.url.replace(":userId", userId);
      const response = await fetch(url, {
        method: SummaryApi.Appointment.getByUser.method,
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user appointments");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

const appointmentSlice = createSlice({
  name: "appointment",
  initialState: {
    appointments: [],
    userAppointments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(scheduleAppointment.pending, (state) => {
        state.loading = true;
      })
      .addCase(scheduleAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.push(action.payload);
      })
      .addCase(scheduleAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(completeAppointment.pending, (state) => {
        state.loading = true;
      })
      .addCase(completeAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = state.appointments.map((appointment) =>
          appointment.id === action.payload.id ? action.payload : appointment
        );
      })
      .addCase(completeAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(getAllAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAppointmentsByUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAppointmentsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userAppointments = action.payload;
      })
      .addCase(getAppointmentsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default appointmentSlice.reducer;
