import { Request, Response } from "express";
import { authClient } from "../config/db";
import { publishFriendAdded, publishFriendRemoved } from "../config/kafkaClient";

export const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user?.id;
    const { friendId } = req.body;

    if (!friendId) {
      return res.status(400).json({ message: "Friend ID is required" });
    }

    if (userId === friendId) {
      return res.status(400).json({ message: "You cannot add yourself as a friend" });
    }

    const newFriendship = await authClient.friendship.create({
      data: {
        userId,
        friendId,
      },
    });

    await publishFriendAdded(userId, friendId);

    res.status(201).json({ message: "Friend request sent", friendship: newFriendship });
  } catch (error) {
    console.error("Send Friend Request Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFriendRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { friendId } = req.body;

    if (!friendId) {
      return res.status(400).json({ message: "Friend ID is required" });
    }

    await authClient.friendship.deleteMany({
      where: {
        OR: [
          { userId, friendId },
          { userId: friendId, friendId: userId }, // Ensure mutual removal
        ],
      },
    });

    await publishFriendRemoved(userId, friendId);

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error("Remove Friend Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getFriendList = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const friends = await authClient.friendship.findMany({
      where: { userId },
      select: { friendId: true },
    });

    res.status(200).json({ friends });
  } catch (error) {
    console.error("Get Friend List Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
