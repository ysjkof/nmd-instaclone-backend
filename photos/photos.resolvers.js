import client from "../client";

export default {
  Photo: {
    user: ({ userId }) => client.user.findUnique({ where: { id: userId } }),
    hashtags: ({ id }) =>
      client.hashtag.findMany({
        where: {
          photos: {
            some: {
              id,
            },
          },
        },
      }),
    likes: ({ id }) => client.like.count({ where: { photoId: id } }),
    commentNumber: ({ id }) => client.comment.count({ where: { photoId: id } }),
    comments: ({ id }) =>
      client.comment.findMany({
        where: {
          photoId: id,
        },
        include: { user: true },
      }),
    // isMine에서는 로그인유저를 알아야 하고 로그인유저가 없을 수도 있으니 체크한다.
    // isMine: ({userId}, _, {loggedInUser}) => userId === loggedInUser?.id 이렇게 옵셔널 체이닝 가능.
    isMine: ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return userId === loggedInUser.id;
    },
    // photoId가 필요하고 지금 photo안이라 그냥 id하면 됨.
    isLiked: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      const ok = await client.like.findUnique({
        where: {
          photoId_userId: {
            photoId: id,
            userId: loggedInUser.id,
          },
        },
        // id만 셀렉한다. 왜냐면 존재하는지만 체크하면 되서.
        select: {
          id: true,
        },
      });
      if (ok) {
        return true;
      }
      return false;
    },
  },
  Hashtag: {
    photos: ({ id }, { page }, { loggedInUser }) => {
      return client.hashtag.findUnique({ where: { id } }).photos();
    },
    totalPhotos: ({ id }) => client.photo.count({ where: { hashtags: { some: { id } } } }),
  },
};
