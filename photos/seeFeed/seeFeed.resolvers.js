import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Query: {
    seeFeed: protectedResolver((_, __, { loggedInUser }) =>
      client.photo.findMany({
        where: {
          OR: [
            {
              user: {
                followers: {
                  some: {
                    // user의 followers에 내 id(loggedInUser.id)를 가진 사람을 찾아. == 나를 팔로잉 한 사람(팔로워)를 찾아
                    id: loggedInUser.id,
                  },
                },
              },
            },
            {
              // 로그인한 유저의 피드를 찾기 위함. 위에거랑 이거랑 다 찾아온다.
              userId: loggedInUser.id,
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    ),
  },
};
