import {v2 as cloudinary} from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
cloudinary.config({
    cloud_name: "dcdl1u6fi",
    api_key: "855234766213314",
    api_secret: "wNydUNz3TjaQDCqPTqdUuHdsazg",
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'social-media',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov'],
        resource_type: 'auto'
    }
});
export const uploadCloudinary = multer({ storage: storage });
export { cloudinary};