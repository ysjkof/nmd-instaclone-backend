import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../../client";

export default {
  Mutation: {
    editProfile: async (_, { firstName, lastName, username, email, password: newPassword }, { loggedInUser }) => {
      // const verifiedToken = await jwt.verify(token, process.env.SECRET_KEY); 아래는 ES6문법으로 verifiedToken 안에 id를 풀었다. updateUser의 where에 쓰려고
      // const { id } = await jwt.verify(token, process.env.SECRET_KEY);
      console.log(loggedInUser);
      let uglyPassword = null;
      if (newPassword) {
        uglyPassword = await bcrypt.hash(newPassword, 10);
      }
      const updatedUser = await client.user.update({
        where: {
          id: loggedInUser.id,
        },
        data: {
          firstName,
          lastName,
          username,
          email,
          // uglyPassword가 true면 password:uglyPassword가 된다.
          ...(uglyPassword && { password: uglyPassword }),
        },
      });
      if (updatedUser.id) {
        return {
          ok: true,
        };
      } else {
        return {
          ok: false,
          error: "Could not update profile.",
        };
      }
    },
  },
};
