import client from "../../client";

export default {
  Query: {
    searchUsers: async (_, { keyword }) =>
      client.user.findMany({
        where: {
          username: {
            // keyword의 길이 제한을 넣을 수 있다. 2자 이상 입력하세요.
            startsWith: keyword.toLowerCase(),
          },
        },
      }),
  },
};
