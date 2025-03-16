import { Request, Response } from "express";
import { getUserById, updateUser } from "./user.services";
import { publishUserUpdated } from "./user.kafkaClient";
import { AuthRequest } from "./user.middlewares";

// Use extended request type
// interface AuthRequest extends Request {
//   user?: { id: string };
// }


export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const user = await getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get User Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const { name, bio } = req.body;

    const updatedUser = await updateUser(userId, { name, phone , email });

    // Publish event for updated user
    await publishUserUpdated(updatedUser);

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
