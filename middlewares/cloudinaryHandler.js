import { v2 as cloudinary } from "cloudinary";



export const cloudinary_Handler = async (photo_Array, folder_Name) => {
  return await Promise.all(
    photo_Array.map((photo) => {
      return cloudinary.uploader.upload(photo, {
        folder: folder_Name,
      });
    })
  ).then((uploadResults) =>{
    const upload_Info = uploadResults.map(({public_id, secure_url}) => ({
        public_id,
        url: secure_url
    }))

    return upload_Info
  });
};


