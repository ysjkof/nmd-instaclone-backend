import client from "../../client";

// offset pagination
export default {
  Query: {
    seeFollowers: async (_, { username, page }) => {
      // user id가 있는지 검색. select하면 id만 찾는다. 하지 않으면 user의 모든 정보를 가져오기 때문에 낭비.
      const ok = await client.user.findUnique({
        where: { username },
        select: { id: true },
      });
      if (!ok) {
        return {
          ok: false,
          error: "User not found",
        };
      }
      const followers = await client.user
        .findUnique({ where: { username } })
        .followers({
          take: 5,
          skip: (page - 1) * 5,
        });
      const totalFollowers = await client.user.count({
        where: { following: { some: { username } } },
      });
      return {
        ok: true,
        followers,
        totalPages: Math.ceil(totalFollowers / 5),
      };
    },
  },
};
