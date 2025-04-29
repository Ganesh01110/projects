import { Request, Response } from "express";
// import { authClient } from "../config/db";
import { publishFriendAdded, publishFriendRemoved } from "./user.kafkaClient";
import { PrismaClient } from "../../../infra/generated/user-client";

const userClient = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      user?: { id: string }; // Add any other properties you need
    }
  }
}

// interface Request {
//   user?: { id: string; email: string; role: string };
// }

export const sendFriendRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    
    if (!req.user) {
       res.status(401).json({ message: "Unauthorized" });
       return;
    }

    const userId = req.user?.id;
    const { friendId } = req.body;

    if (!friendId) {
       res.status(400).json({ message: "Friend ID is required" });
      return;
    }

    if (userId === friendId) {
       res.status(400).json({ message: "You cannot add yourself as a friend" });
       return;
    }

    // const newFriendship = await userClient.friendship.create({
    //   data: {
    //     userId,
    //     friendId,
    //   },
    // });
     // Check if a friendship already exists
     const existingFriendship = await userClient.friend.findUnique({
      where: {
        userId_friendId: { userId, friendId },
      },
    });

    if (existingFriendship) {
      res.status(400).json({ message: "Friend request already sent" });
      return;
    }

    // Create a new friendship
    const newFriendship = await userClient.friend.create({
      data: {
        userId,
        friendId,
        status: "PENDING",
      },
    });

    await publishFriendAdded(userId, friendId);

    res.status(201).json({ message: "Friend request sent", friendship: newFriendship });
  } catch (error) {
    console.error("Send Friend Request Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFriendRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    
    const { friendId } = req.body;

    if (!friendId) {
       res.status(400).json({ message: "Friend ID is required" });
      return;
    }

    await userClient.friend.deleteMany({
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

export const getFriendList = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // const userId = req.user?.id;
    // const friends = await userClient.friend.findMany({
    //   where: { userId },
    //   select: { friendId: true },
    // });

    // res.status(200).json({ friends });
    const userId = req.user.id;

    // Fetch friends where the user is either the requester or the recipient
    const friends = await userClient.friend.findMany({
      where: {
        OR: [
          { userId },
          { friendId: userId },
        ],
        status: "ACCEPTED", // Only fetch accepted friendships
      },
      select: {
        userId: true, // Include userId for comparison
        friendId: true, // Include friendId for comparison
        user: { select: { id: true, name: true, email: true } },
        friend: { select: { id: true, name: true, email: true } },
      },
    });

    // Format the response to show the friend details
    const formattedFriends = friends.map((friendship) =>
      friendship.userId === userId ? friendship.friend : friendship.user
    );

    res.status(200).json({ friends: formattedFriends });

  } catch (error) {
    console.error("Get Friend List Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
