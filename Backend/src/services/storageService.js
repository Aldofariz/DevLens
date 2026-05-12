const { v2: cloudinary } = require("cloudinary");

const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY || process.env.STORAGE_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET || process.env.STORAGE_API_SECRET,
    secure: true,
  });
};

const uploadFile = (file) => {
  configureCloudinary();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "devlens/sources",
        resource_type: "auto",
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          storageUrl: result.secure_url,
          resourceType: result.resource_type,
        });
      }
    );

    uploadStream.end(file.buffer);
  });
};

const getCloudinaryPublicId = (storageUrl) => {
  const marker = "/upload/";
  const uploadIndex = storageUrl.indexOf(marker);
  if (uploadIndex === -1) {
    return null;
  }

  const path = storageUrl.slice(uploadIndex + marker.length).replace(/^v\d+\//, "");
  const lastDot = path.lastIndexOf(".");
  return lastDot === -1 ? path : path.slice(0, lastDot);
};

const deleteFile = async (storageUrl) => {
  if (!storageUrl || !storageUrl.includes("cloudinary.com")) {
    return;
  }

  configureCloudinary();
  const publicId = getCloudinaryPublicId(storageUrl);
  if (!publicId) {
    return;
  }

  await Promise.allSettled(
    ["image", "raw", "video"].map((resourceType) =>
      cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
    )
  );
};

module.exports = {
  uploadFile,
  deleteFile,
  getCloudinaryPublicId,
};
