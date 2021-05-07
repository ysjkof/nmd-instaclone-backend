import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    deletePhoto: protectedResolver(async (_, { id }, { loggedInUser }) => {
      const photo = await client.photo.findUnique({
        where: {
          id,
        },
        select: {
          userId: true,
        },
      });
      // 포토 못 찾으면 에러
      if (!photo) {
        return {
          ok: false,
          error: "Photo not found.",
        };
        // 포토 찾았는데 로그인 유저와 포토 유저 아이디가 불일치하면 에러
      } else if (photo.userId !== loggedInUser.id) {
        return {
          ok: false,
          error: "Not authorized.",
        };
        // 포토의 유저아이디와 로그인 유저 아이디가 동일하면 삭제해
      } else {
        await client.photo.delete({
          where: {
            id,
          },
        });
        return {
          ok: true,
        };
      }
    }),
  },
};
