const notFound = (req, res, next) => {
  res.status(404);

  const error = new Error(
    `Route not found: ${req.originalUrl}`
  );

  next(error);
};

const errorHandler = (
  err,
  req,
  res,
  next
) => {
  console.error(err);

  const statusCode =
    res.statusCode !== 200
      ? res.statusCode
      : 500;

  res.status(statusCode).json({
    success: false,
    message:
      err.message ||
      "Internal server error",
  });
};

module.exports = {
  notFound,
  errorHandler,
};