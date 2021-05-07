import client from "../../client";

export default {
  Query: {
    seePhotoLikes: async (_, { id }) => {
      const likes = await client.like.findMany({
        where: {
          photoId: id,
        },
        // 셀렉트하면 user만 불러온다.
        select: {
          user: true,
        },
        // include하면 user는 물론 like의 데이터도 모두 받아온다.
        // include: {
        //   user,
        // }
      });
      // seePhotoLikes가 [User]를 리턴한다고 typeDefs에 설정했기 때문에 배열로 만들기 위해 map 씀.
      return likes.map((like) => like.user);
    },
  },
};
