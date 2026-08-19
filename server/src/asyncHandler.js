// Express 4 doesn't catch rejected promises from async route handlers —
// without this, a DB error crashes the whole process instead of returning 500.
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
