export const checkAuthState = (store) => (next) => (action) => {
    if (action.type === "@@redux/INIT") {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (token && isTokenValid(token)) {
            store.dispatch({
                type: "auth/setAuthState",
                payload: { isAuthenticated: true, role, token },
            });
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
        }
    }
    return next(action);
};
