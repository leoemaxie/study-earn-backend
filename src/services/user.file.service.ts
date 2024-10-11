import supabase from "../supabase/supabase";
import { BadRequest } from "../utils/error";
import { Express } from "express";

const upload = async (file: Express.Multer.File | undefined, userId: string) => {
  if (!file) {
    throw new BadRequest('No file provided');
  }

  const {data, error} = await supabase.storage
    .from('files')
    .upload(`${userId}/${file.originalname}`, file.buffer);

  if (error) {
    throw error;
  }

  return data;
};

const download = async (userId: string, fileName: string) => {
  const {data, error} = await supabase.storage
    .from('files')
    .download(`${userId}/${fileName}`);

  if (error) {
    throw error;
  }

  return data;
}

const del = async (userId: string, fileName: string) => {
  const {data, error} = await supabase.storage
    .from('files')
    .remove([`${userId}/${fileName}`]);

  if (error) {
    throw error;
  }

  return data;
}

const update = async (userId: string, fileName: string, file: Express.Multer.File | undefined) => {
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
}

export {upload, download, del, update};