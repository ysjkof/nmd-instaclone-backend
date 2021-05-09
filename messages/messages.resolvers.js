import client from "../client";

export default {
  Room: {
    // 2~5명 있는 대화방은 아래처럼 해도 상관없음.
    // 만약 3000명 있는 대화방이라면 .users() 이런 식으로하면 DB폭파됨. 대화방 안에 유저를 찾아서 스킵 테이크 커서 등을 해야함?
    users: ({ id }) => client.room.findUnique({ where: { id } }).users(),
    messages: ({ id }) =>
      client.message.findMany({
        where: {
          roomId: id,
        },
      }),
    unreadTotal: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return 0;
      }
      return client.message.count({
        where: {
          read: false,
          roomId: id,
          user: {
            id: {
              not: loggedInUser.id,
            },
          },
        },
      });
    },
  },
  Message: {
    user: ({ id }) => client.message.findUnique({ where: { id } }).user(),
  },
};
