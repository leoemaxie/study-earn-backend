import supabase from '../supabase/supabase';
import User from '@models/user.model';
import {BadRequest} from '@utils/error';

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
  const {data, error} = await supabase.storage
    .from(type)
    .upload(path, file.buffer, {
      upsert: true,
    });

  if (error) throw error;

  const publicUrl = supabase.storage.from(type).getPublicUrl(path)
    .data.publicUrl;
  if (type === 'picture') {
    await User.update({picture: publicUrl}, {where: {id: user.id}});
  }

  return {data};
};

const download = async (userId: string, fileName: string) => {
  const {data, error} = await supabase.storage
    .from('files')
    .download(`${userId}/${fileName}`);

  if (error) {
    throw error;
  }

  return data;
};

const del = async (user: User, path: string) => {
  const {data, error} = await supabase.storage.from('files').remove([path]);

  if (error) {
    throw error;
  }

  return data;
};

const update = async (
  userId: string,
  fileName: string,
  file: Express.Multer.File | undefined
) => {
  if (!file) {
    throw new BadRequest('No file provided');
  }
  const {data, error} = await supabase.storage
    .from('files')
    .update(`${userId}/${fileName}`, file.buffer);

  if (error) {
    throw error;
  }

  return data;
};

export {upload, download, del, update};
