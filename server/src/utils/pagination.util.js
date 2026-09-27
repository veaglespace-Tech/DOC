// src/utils/pagination.util.js

/**
 * Parse pagination query params
 * @param {object} query - req.query
 * @returns {{ page, limit, skip }}
 */
const parsePagination = (query) => {
  const page  = Math.max(1, parseInt(query.page)  || 1);
  const limit = Math.min(100, parseInt(query.limit) || 10);
  const skip  = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Build pagination meta
 */
const buildPaginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
  hasNext: page * limit < total,
  hasPrev: page > 1,
});

module.exports = { parsePagination, buildPaginationMeta };
