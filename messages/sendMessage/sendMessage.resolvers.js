import client from "../../client";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    // roomId나 userId로 메시지를 전송.
    sendMessage: protectedResolver(async (_, { payload, roomId, userId }, { loggedInUser }) => {
      let room = null;
      if (userId) {
        const user = await client.user.findUnique({
          where: { id: userId },
          select: { id: true },
        });
        if (!user) {
          return {
            ok: false,
            error: "This user does not exist.",
          };
        }
        // 룸이 있는지 확인하고 있으면 안만듬. 수강생이 리플에 남긴 거 추가함. 테스트 안함.
        const existRoom = await client.room.findFirst({
          where: {
            users: {
              some: {
                id: userId,
              },
            },
          },
          select: {
            id: true,
          },
        });
        if (existRoom) {
          return {
            ok: false,
            error: "The Room already exist!",
          };
        }
        //
        room = await client.room.create({
          data: {
            users: {
              connect: [{ id: userId }, { id: loggedInUser.id }],
            },
          },
        });
      } else if (roomId) {
        room = await client.room.findUnique({
          where: { id: roomId },
          select: { id: true },
        });
        if (!room) {
          return {
            ok: false,
            error: "Room not found.",
          };
        }
      }
      const message = await client.message.create({
        data: {
          payload,
          room: { connect: { id: room.id } },
          user: { connect: { id: loggedInUser.id } },
        },
      });
      // { roomUpdates: { ...message } } 이게 payload다.
      pubsub.publish(NEW_MESSAGE, { roomUpdates: { ...message } });
      return {
        ok: true,
      };
    }),
  },
};
