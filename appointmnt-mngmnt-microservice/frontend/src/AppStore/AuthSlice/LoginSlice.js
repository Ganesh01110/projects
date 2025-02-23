import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import SummaryApi from "../../common/index";
// import { isTokenValid } from "../AuthSlice/AuthUtils";

// Thunk for API call to handle login
export const loginApiCallSlice = createAsyncThunk(
    "user/login",
    async ({ Role, UserInfo, Password }, { rejectWithValue }) => {
        try {
            console.log("Making API call with:", { Role, UserInfo, Password });

            const response = await fetch(SummaryApi.Adminlogin.url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    role: Role,
                    username: UserInfo,
                    password: Password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Backend error:", errorData);
                return rejectWithValue(errorData.message || "Login failed");
            }

            const data = await response.json();
            console.log("API response received:", data);

            // Validate required keys in the response
            if (!data.data.token || !data.data.role) {
                throw new Error("Invalid API response: Token or Role missing");
            }

            // Save token and role in localStorage
            localStorage.setItem("token", data.data.token);
            localStorage.setItem("role", data.data.role);

            return data.data; // Return token and role
        } catch (error) {
            console.error("API call failed:", error);
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Thunk for logout
export const logoutUser = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
    try {
        // Clear localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        return true;
    } catch (error) {
        console.error("Error during logout:", error);
        return rejectWithValue("Logout failed.");
    }
});

const initialState = {
    isUserLogin: false,
    userInfo: null,
    loginErr: false,
    loginErrMessage: "",
};

export const loginUser = createSlice({
    name: "loginUser",
    initialState,
    reducers: {
        setAuthState: (state, action) => {
            state.isUserLogin = action.payload.isUserLogin;
            state.userInfo = action.payload.userInfo;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginApiCallSlice.pending, (state) => {
                state.isUserLogin = false;
                state.userInfo = null;
                state.loginErr = false;
                state.loginErrMessage = "";
            })
            .addCase(loginApiCallSlice.fulfilled, (state, action) => {
                const { token, role } = action.payload;

                state.isUserLogin = true;
                state.userInfo = { token, role };
                state.loginErr = false;

                console.log("Login successful:", { token, role });
            })
            .addCase(loginApiCallSlice.rejected, (state, action) => {
                state.isUserLogin = false;
                state.userInfo = null;
                state.loginErr = true;
                state.loginErrMessage = action.payload || "Login failed.";
                console.error("Login error:", state.loginErrMessage);
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isUserLogin = false;
                state.userInfo = null;
                state.loginErr = false;
                state.loginErrMessage = "";
                console.log("User logged out.");
            });
    },
});

export const { setAuthState } = loginUser.actions;
export default loginUser.reducer;
