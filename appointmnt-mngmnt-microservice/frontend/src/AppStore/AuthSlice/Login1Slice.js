import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import SummaryApi from "../../common/index";



// Mock user data for localStorage-based authentication
const mockUsers = [
    { username: "admin", password: "admin123", role: "admin", token: "admin-token" },
    { username: "receptionist", password: "rec123", role: "receptionist", token: "rec-token" },
    { username: "doctor", password: "doc123", role: "doctor", token: "doc-token" },
];

//   export const loginApiCallSlice = createAsyncThunk("user/login", async (data) => {
//     try {
//         const response = await axios.post(SummaryApi.Adminlogin.url, data);
//         console.log("data from frontend is posted..")
//         console.log("data from login slice::", response.data);
//         console.log("Action payload in slice:", action.payload);

//         return response.data.data;
//     } catch (error) {
//         console.log(error);
//         throw error;
//     }
// });

// Mock login API call using localStorage
//   export const loginApiCallSlice = createAsyncThunk("user/login", async (data) => {
//     const { UserInfo, Password } = data;

//     // Simulate backend validation using mock user data
//     const user = mockUsers.find(
//       (user) => user.username === UserInfo && user.password === Password
//     );

//     if (user) {
//       // Mock successful login
//       localStorage.setItem("token", user.token);
//       localStorage.setItem("role", user.role);
//       return { token: user.token, role: user.role };
//     } else {
//       // Simulate login failure
//       throw new Error("Invalid credentials");
//     }
//   });

// Thunk for API call to handle login
// export const loginApiCallSlice = createAsyncThunk("user/login", async (data, { rejectWithValue }) => {
//     console.log("Thunk ==>" , data);
    
//     try {
//         // API call to the backend
//         const response = await axios.post(SummaryApi.Adminlogin.url, data);
//         console.log("Data posted to backend successfully.");
//         console.log("api Response from backend:", response.data);
//         console.log("api Response from backend2:", response.data.data);
//         console.log("api Response from backend3:", response.data.data.role);
//         // Returning the data object (assumes `data` contains token and role)
//         return response.data.data;
//     } catch (error) {
//         console.error("Error in login API call:",  error.response?.data || error.message);
//         return rejectWithValue(error.response ? error.response.data : error.message);
//     }
// });


export const loginApiCallSlice = createAsyncThunk(
    "user/login",
    async ({ Role,UserInfo, Password }, { rejectWithValue }) => {
        try {
            console.log("Making API call with:", {Role, UserInfo, Password });

            const response = await fetch(SummaryApi.Adminlogin.url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({role:Role, 
                                     username: UserInfo, 
                                     password: Password 
                                    }),
            });

            if (!response.ok) {
                // If the API responds with an error, reject the action
                const errorData = await response.json();
                console.error("Backend error:", errorData);
                return rejectWithValue(
                    errorData.message || "Login failed"
                );
            }

            const data = await response.json();
            console.log("API response received:", data);

            // Validate required keys in the response
            if (!data.data.token || !data.data.role) {
                console.log("Invalid API response: Token or Role missing");
                throw new Error("Invalid API response: Token or Role missing");
            }

            return data; // Payload for the fulfilled case
        } catch (error) {
            console.error("API call failed:", error);
            return rejectWithValue(
                error.message || "Something went wrong"
            );
        }
    }
);


export const logoutUser = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
    try {
        // Clear localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        return { success: true };
    } catch (error) {
        console.error("Error during logout:", error);
        return rejectWithValue("Logout failed.");
    }
});

const initialState = {
    isUserLogin: false,
    userInfo: null,
    loginErr: false,
    loginErrMessage: "", // To store detailed error messages
};

export const loginUser = createSlice({ 
    name: "loginUser",
    initialState,
    reducers:  {},
    extraReducers: (builder) => {
        builder
         .addCase(loginApiCallSlice.pending, (state) => {
            console.log("Pending action triggered: loginApiCallSlice");
            state.isUserLogin = false;
            state.userInfo = null;
            state.loginErr = false;
            state.loginErrMessage = "";
        })
         .addCase(loginApiCallSlice.fulfilled, (state, action) => {
            console.log("Fulfilled action triggered: loginApiCallSlice");
            console.log("line134::login slice::actiom:",action);
            console.log("payload from actiom:",action.payload);

           
            

            // Extract token and role from the payload
            const { token, role } = action.payload.data || {};


            if (!token || !role) {
                console.error("Invalid payload structure. Token or Role missing.");
                state.loginErr = true;
                state.loginErrMessage = "Invalid login response structure.";
                return;
            }
            
           // Update state to reflect a successful login
           state.isUserLogin = true;
           state.userInfo = action.payload.data;
           state.loginErr = false;
           
            // Verify destructured values
            console.log("Extracted token:", token);
            console.log("Extracted role:", role);

            try {
                // Store token and role in localStorage
                localStorage.setItem("role", role);
                localStorage.setItem("token", token);
                console.log("get it,token,role...");

            } catch (error) {
                console.error("Error writing to localStorage:", error);
                state.loginErr = true;
                state.loginErrMessage = "Failed to store credentials locally.";
            } finally {

                // Log token and role to verify storage
                console.log("Token stored:", localStorage.getItem("token"));
                console.log("Role stored:", localStorage.getItem("role"));
            }
        })
        .addCase(loginApiCallSlice.rejected, (state,action) => {
            console.error("Rejected action triggered: loginApiCallSlice");
            console.error("Error payload:", action.error || action.payload);

            // Update state to reflect a failed login
            state.isUserLogin = false;
            state.userInfo = null;
            state.loginErr = true;

             // Extract a meaningful error message
             state.loginErrMessage =
             action.payload || action.error?.message || "Login failed due to an unknown error.";
         console.error("Login failed:", state.loginErrMessage);
        })
        .addCase(logoutUser.fulfilled, (state) => {
            console.log("User logged out successfully.");
        
            // Reset state to initial values
            state.isUserLogin = false;
            state.userInfo = null;
            state.loginErr = false;
            state.loginErrMessage = "";
        });
    },
});


