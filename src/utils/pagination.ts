export function getMetadata(
  url: string,
  total: number,
  limit: number,
  currentPage: number,
  totalPages: number
) {
  return {
    totalItems: total,
    totalPages,
    currentPage,
    itemsPerPage: Number(limit),
    links: {
      self: `${url}?page=${currentPage}&limit=${limit}`,
      first: `${url}?page=1&limit=${limit}`,
      last: `${url}?page=${totalPages}&limit=${limit}`,
      ...(currentPage > 1 && {
        prev: `${url}?page=${currentPage - 1}&limit=${limit}`,
      }),
      ...(currentPage < totalPages && {
        next: `${url}?page=${currentPage + 1}&limit=${limit}`,
      }),
    },
  };
}
