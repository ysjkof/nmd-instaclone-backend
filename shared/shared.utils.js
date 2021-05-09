import AWS from "aws-sdk";

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});
// Body는 파일을 뜻함 file자체는 아니고 stream이다.

export const uploadToS3 = async (file, userId, folderName) => {
  const { filename, createReadStream } = await file;
  const readStream = createReadStream();
  const objectName = `${folderName}/${userId}-${Date.now()}-${filename}`;
  try {
    const { Location } = await new AWS.S3()
      .upload({
        Bucket: "instaclone-uploads-seongjin",
        Key: objectName,
        ACL: "public-read",
        Body: readStream,
      })
      .promise();
    return Location;
  } catch (e) {
    console.log(e);
  }
};
