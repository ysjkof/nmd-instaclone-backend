import client from "../../client";

export default {
  Query: {
    seeProfile: (_, { username, id }) =>
      client.user.findUnique({
        where: {
          username,
          id,
        },
        // include가 없으면 팔로워는 자동으로 보여주지 않는다.
        // 팔로워가 너무 많을 때 DB 연결이 많아지니까 디폴트를 꺼놧음.
        include: {
          following: true,
          followers: true,
        },
      }),
  },
};
