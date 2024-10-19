import 'dotenv/config';
import {v2 as cloudinary} from 'cloudinary';
import User from '@models/user.model';
import {BadRequest} from '@utils/error';

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
  if (!file) throw new BadRequest('No file provided');

  const mimetype = file.mimetype.split('/')[0];
  if (type === 'picture' && mimetype !== 'image') {
    throw new BadRequest('File must be an image');
  }

  const path = `${user.id}.${file.mimetype.split('/')[1]}`;
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

  const optimizeUrl = cloudinary.url(user.id, {
    fetch_format: 'auto',
    quality: 'auto',
    crop: 'auto',
    gravity: 'auto',
    width: 500,
    height: 500,
  });

  if (type === 'picture') {
    await User.update({picture: optimizeUrl}, {where: {id: user.id}});
  }
  return {url: optimizeUrl};
};

const del = async (user: User, type?, fileName?: string) => {
  if (!fileName && type !== 'picture')
    throw new BadRequest('No file name provided');
  if (!type) throw new BadRequest('No type provided');

  const {picture} = user;
  const path = `${type}/${user.id}.${type === 'picture' ? picture?.split('.')[1] : fileName?.split('.')[1]}`;
  await cloudinary.uploader.destroy(user.id, {
    resource_type: type,
  });

  if (type === 'picture') {
    await User.update({picture: null}, {where: {id: user.id}});
  }
};

export {upload, del};
