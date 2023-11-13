export default function errorMiddleware(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const message = err.message || 'An unknown internal server error occurred.';
  const data = err.data || {};
  const httpStatusCode = err.httpStatusCode || 500;

  const errResponse = {
    message,
    data
  };

  res.status(httpStatusCode).json(errResponse);
}
