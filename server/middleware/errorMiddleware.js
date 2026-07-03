const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  if (err.code === 11000) {
    return res.status(409).json({ message: "Duplicate resource conflict" });
  }

  return res.status(statusCode).json({
    message: err.message || "Server error",
  });
};

export { errorHandler, notFound };
