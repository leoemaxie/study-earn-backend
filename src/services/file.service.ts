import supabase from '../supabase/supabase';

const download = async (
  type: string,
  name?: string,
  options: {
    semester?: string;
    session?: string;
    markdown?: boolean;
    list?: boolean;
  } = {}
) => {
  const storage = supabase.storage.from(
    `files${type}${options.markdown ? '/markdown' : '/pdf'}`
  );

  if (options.list) {
    const {data, error} = await storage.list(`${name}/`);
    if (error) throw error;
    return data;
  }

  const file = [
    name && options.semester ? `${name}-` : '',
    options.session
      ? `${options.session}${type === 'calendar' ? `-${Number(options.session) + 1}` : ''}`
      : '',
    options.markdown ? '.md' : '.pdf',
  ].join('');

  const {data: publicUrlData} = storage.getPublicUrl(file);
  return publicUrlData.publicUrl;
};

const del = async (name: string, fileName: string, type: string) => {
  const {data, error} = await supabase.storage
    .from(type)
    .remove([`${name}/${fileName}`]);

  if (error) throw error;
  return data;
};

export {download, del};
