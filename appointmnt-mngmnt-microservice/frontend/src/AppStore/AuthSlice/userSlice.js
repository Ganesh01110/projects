import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import SummaryApi from "../../common/index";

// 🔹 Login API call
export const loginUser1 = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(SummaryApi.User.login.url, {
        method: SummaryApi.User.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token); // Save token
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// 🔹 Register API call
export const registerUser = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(SummaryApi.User.register.url, {
        method: SummaryApi.User.register.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Registration failed");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// 🔹 Get All Users
export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(SummaryApi.User.getAllUsers.url, {
        method: SummaryApi.User.getAllUsers.method,
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// 🔹 Get User By ID
export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (id, { rejectWithValue }) => {
    try {
      const url = SummaryApi.User.getUserById.url.replace(":id", id);
      const response = await fetch(url, {
        method: SummaryApi.User.getUserById.method,
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("User not found");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// 🔹 User Slice
const userSlice = createSlice({
  name: "user",
  initialState: { user: null, users: [], loading: false, error: null },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser1.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser1.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser1.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
