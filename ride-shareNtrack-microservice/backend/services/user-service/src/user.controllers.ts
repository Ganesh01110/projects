import { Request, Response } from "express";
import { getUserById, updateUser } from "./user.services";
import { publishUserUpdated } from "./user.kafkaClient";
import { AuthRequest } from "./user.middlewares";
import { logger} from "./user.logger";
import { cacheUserProfile, getCachedUserProfile, invalidateCachedUserProfile } from "./user.redis";

// Use extended request type
// interface AuthRequest extends Request {
//   user?: { id: string };
// }


export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      logger.warn("Unauthorized access attempt to user profile.");
     res.status(401).json({ message: "Unauthorized" });
     return;
    }

    const userId = req.user.id;
    // const user = await getUserById(userId);
    
    // if (!user) {
    //   logger.warn(`User not found for ID: ${userId}`);
    //  res.status(404).json({ message: "User not found" });
    //  return;
    // }

    // Check Redis cache for user profile
    let user = await getCachedUserProfile(userId);

    if (!user) {
      logger.info(`Cache miss for user ID: ${userId}`);
      user = await getUserById(userId);

      if (!user) {
        logger.warn(`User not found for ID: ${userId}`);
        res.status(404).json({ message: "User not found" });
        return;
      }

    // Cache the user profile
    await cacheUserProfile(userId, user);
  } else {
    logger.info(`Cache hit for user ID: ${userId}`);
  }

    res.status(200).json(user);
  } catch (error:any) {
    // console.error("Get User Profile Error:", error);
    // res.status(500).json({ message: "Server error" });
    if (error instanceof Error) {
      logger.error("Get User Profile Error:", error.message);
      res.status(400).json({ error: error.message });
    } else {
      logger.error("Get User Profile Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      logger.warn("Unauthorized access attempt to update user profile.");
       res.status(401).json({ message: "Unauthorized" });
      return ;
    }

    const userId = req.user.id;
    const { name, bio , phone , email } = req.body;

    const updatedUser = await updateUser(userId, { name, phone , email });

    // Invalidate the cached user profile
    await invalidateCachedUserProfile(userId);

    // Publish event for updated user
    await publishUserUpdated(updatedUser);

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (error:any) {
    // console.error("Update Profile Error:", error);
    // res.status(500).json({ message: "Server error" });
    if (error instanceof Error) {
      logger.error("Update Profile Error:", error.message);
      res.status(400).json({ error: error.message });
    } else {
      logger.error("Update Profile Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
};
