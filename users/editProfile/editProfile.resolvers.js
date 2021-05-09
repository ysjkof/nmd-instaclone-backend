import { createWriteStream } from "fs";
import bcrypt from "bcrypt";
import client from "../../client";
import { protectedResolver } from "../users.utils";
import { uploadToS3 } from "../../shared/shared.utils";

const resolverFn = async (_, { firstName, lastName, username, email, password: newPassword, bio, avatar }, { loggedInUser }) => {
  // const verifiedToken = await jwt.verify(token, process.env.SECRET_KEY); 아래는 ES6문법으로 verifiedToken 안에 id를 풀었다. updateUser의 where에 쓰려고
  // const { id } = await jwt.verify(token, process.env.SECRET_KEY);
  // console.log(loggedInUser);
  let avatarUrl = null;
  if (avatar) {
    avatarUrl = await uploadToS3(avatar, loggedInUser.id);
    // 여기는 cloud에 연동할때 필요 없고 local server에 파일을 저장할때만 쓴다.
    // const { filename, createReadStream } = await avatar;
    // const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
    // const readStream = createReadStream();
    // const writeStream = createWriteStream(process.cwd() + "/uploads/" + newFilename);
    // readStream.pipe(writeStream);
    // avatarUrl = `http://localhost:4000/static/${newFilename}`;
  }
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
      bio,
      // uglyPassword가 true면 password:uglyPassword가 된다.
      ...(uglyPassword && { password: uglyPassword }),
      ...(avatarUrl && { avatar: avatarUrl }),
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
};

export default {
  Mutation: {
    editProfile: protectedResolver(resolverFn),
  },
};
