import { configureStore } from "@reduxjs/toolkit";
// import { createNewUser } from "./AuthSlice/SignUpSlice.js";
import { loginUser } from "./AuthSlice/LoginSlice.js";
import { checkAuthState } from "./AuthSlice/authMiddleware.js";
import   userReducer from "./AuthSlice/userSlice.js";
import billReducer from "./AuthSlice/billingSlice.js"
import appointmentReducer from "./AuthSlice/appointmentSlice.js"


const store = configureStore({
    reducer: {
        // userReg: createNewUser.reducer,
        userLogin: loginUser.reducer,
        user: userReducer,
        bill: billReducer, 
        appointment: appointmentReducer,

    },
    devTools: process.env.NODE_ENV !== 'production',
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(checkAuthState),
});

export default store;
