import express from "express";
import { forgotPassword, login, register } from "./auth.controllers";
import { authRateLimiter } from "./auth.middlewares";


const router = express.Router();

// router.post("/register",authRateLimiter, register);
// router.post("/login",authRateLimiter, login);

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);
router.post("/forgot-password", authRateLimiter, forgotPassword);

export default router;
