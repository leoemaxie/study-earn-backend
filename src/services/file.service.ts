import supabase from '../supabase/supabase';
import {BadRequest} from '@utils/error';

const upload = async (
  file: Express.Multer.File,
  name: string,
  type: string
) => {
  if (!file) throw new BadRequest('No file provided');

  const {data, error} = await supabase.storage
    .from(type)
    .upload(`${name}/${file.originalname}`, file.buffer);

  if (error) throw error;

  return data;
};

const download = async (name: string, fileName: string, type: string) => {
  const {data, error} = await supabase.storage
    .from(type)
    .download(`${name}/${fileName}`);

  if (error) {
    throw error;
  }

  return data;
};

const del = async (name: string, fileName: string, type: string) => {
  const {data, error} = await supabase.storage
    .from(type)
    .remove([`${name}/${fileName}`]);

  if (error) {
    throw error;
  }

  return data;
};

export {upload, download, del};
