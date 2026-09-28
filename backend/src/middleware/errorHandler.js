export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const notFoundHandler = (req, res) => {
  res.status(404).json({ error: 'Not found' });
};

// Centralized error handler — never leaks stack traces or internal details
// to the client, only logs them server-side.
export const errorHandler = (err, req, res, _next) => {
  const status = err.status || 500;
  if (status >= 500) {
    console.error(err);
  }
  let message = err.message || 'Request failed';
  if (status >= 500 && !(err instanceof ApiError && process.env.NODE_ENV !== 'production')) {
    message = 'Internal server error';
  }
  if (
    status >= 500 &&
    process.env.NODE_ENV !== 'production' &&
    err.name === 'PrismaClientInitializationError'
  ) {
    message =
      'Database connection failed. Set DATABASE_URL in backend/.env (Supabase → Project Settings → Database → URI). Use your database password, not the API secret key.';
  }

  res.status(status).json({ error: message });
};
