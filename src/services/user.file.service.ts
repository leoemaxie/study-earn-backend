import 'dotenv/config';
import {v2 as cloudinary} from 'cloudinary';
import {BadRequest} from '@utils/error';
import User from '@models/user.model';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const upload = async (
  file: Express.Multer.File | undefined,
  user: User,
  type = 'files'
) => {
  const mimetype = file?.mimetype.split('/')[0];

  if (!file) throw new BadRequest('No file provided');
  if (type === 'picture' && mimetype !== 'image') {
    throw new BadRequest('File must be an image');
  }

  const uploadStream = () => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: type,
          public_id: user.id,
          unique_filename: false,
          overwrite: true,
        },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
      stream.end(file.buffer);
    });
  };

  await uploadStream();

  const optimizeUrl = cloudinary.url(`${type}/${user.id}`, {
    fetch_format: 'auto',
    quality: 'auto',
    crop: 'auto',
    gravity: 'auto',
    width: 200,
    height: 200,
  });

  if (type === 'picture') {
    await User.update({picture: optimizeUrl}, {where: {id: user.id}});
  }
  return {url: optimizeUrl};
};

const del = async (user: User, type?: string, fileName?: string) => {
  if (!fileName && type !== 'picture')
    throw new BadRequest('No file name provided');
  if (!type) throw new BadRequest('No type provided');

  await cloudinary.uploader.destroy(`${type}/${user.id}`, {
    resource_type: type,
  });

  if (type === 'picture') {
    await User.update({picture: null}, {where: {id: user.id}});
  }
};

export {upload, del};
