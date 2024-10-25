import {Request} from 'express';

export function computeMetadata(
  req: Request,
  total: number,
  limit: number,
  offset: number
) {
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);
  return {
    currentPage,
    totalPages,
    itemsPerPage: limit,
    totalItems: total,
    links: {
      self: `${url}?page=${currentPage}&limit=${limit}`,
      first: `${url}?page=1&limit=${limit}`,
      ...(currentPage > 1 && {
        prev: `${url}?page=${currentPage - 1}&limit=${limit}`,
      }),
      ...(currentPage < totalPages && {
        next: `${url}?page=${currentPage + 1}&limit=${limit}`,
      }),
      last: `${url}?page=${totalPages}&limit=${limit}`,
    },
  };
}
