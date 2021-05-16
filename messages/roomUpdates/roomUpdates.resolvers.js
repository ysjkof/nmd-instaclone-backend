import { withFilter } from "graphql-subscriptions";
import client from "../../client";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";

export default {
  Subscription: {
    roomUpdates: {
      subscribe: async (root, args, context, info) => {
        const room = await client.room.findFirst({
          where: {
            // room id가 args.id를 찾아
            id: args.id,
            // 찾은 room의 user id가 로그인한 id인 걸 찾아.
            users: {
              some: {
                id: context.loggedInUser.id,
              },
            },
          },
          select: {
            id: true,
          },
        });
        if (!room) {
          throw new Error("You shall not see this.");
        }
        return withFilter(
          () => pubsub.asyncIterator(NEW_MESSAGE),
          ({ roomUpdates }, { id }) => {
            // roomId는 sendMessage의 pubsub.publish(NEW_MESSAGE, { roomUpdates: { ...message } });에서 온다.
            return roomUpdates.roomId === id;
          }
        )(root, args, context, info);
      },
    },
  },
};
