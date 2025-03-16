import express from "express";
import { getUserProfile, updateUserProfile } from "./user.controllers";
import { validateUserUpdate, authMiddleware } from "./user.middlewares";
import { getFriendList, removeFriendRequest, sendFriendRequest } from "./friends.controllers";

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, validateUserUpdate, updateUserProfile);

router.post("/add-friend", authMiddleware, sendFriendRequest);
router.post("/remove-friend", authMiddleware, removeFriendRequest);
router.get("/list-friend", authMiddleware, getFriendList);

export default router;
