import { PrismaClient } from "../../../infra/generated/user-client";
import { publishUserUpdated } from "./user.kafkaClient";

const userClient = new PrismaClient();

export const getUserById = async (userId: string) => {
  return userClient.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, phone: true, createdAt: true },
  });
};

export const updateUser = async (
  userId: string,
  updateData: { name?: string; phone?: string; email?: string }
) => {
  const updatedUser = await userClient.user.update({
    where: { id: userId },
    data: updateData,
  });

  // Publish update event to Kafka
  await publishUserUpdated({
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
  });

  return updatedUser;
};
