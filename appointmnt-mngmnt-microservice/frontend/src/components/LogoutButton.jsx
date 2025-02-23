import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../AppStore/AuthSlice/LoginSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LogoutButton = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await dispatch(logoutUser());
            if (response.meta.requestStatus === "fulfilled") {
                toast.success("Logged out successfully!");
                navigate("/login");
            } else {
                throw new Error("Logout failed.");
            }
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("An error occurred during logout.");
        }
    };

    return (
        <button
            className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
            onClick={handleLogout}
        >
            Logout
        </button>
    );
};

export default LogoutButton;
