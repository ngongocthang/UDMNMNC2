const multer = require('multer');
const cloudinary = require("cloudinary").v2;

// Cấu hình với thông tin môi trường
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Sử dụng Memory Storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Hàm upload lên Cloudinary
const uploadMediaToCloudinary = async (file) => {
  try {
    // Upload tệp từ buffer
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.log(error);
          throw new Error("Error uploading to Cloudinary");
        }
        return result;
      }
    );

    // Ghi buffer vào stream
    file.stream.pipe(result);
  } catch (error) {
    console.log(error);
    throw new Error("Error uploading to Cloudinary");
  }
};

// Hàm xóa media từ Cloudinary
const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete asset from Cloudinary");
  }
};

module.exports = { upload, uploadMediaToCloudinary, deleteMediaFromCloudinary };
