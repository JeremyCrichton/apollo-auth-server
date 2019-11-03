import jwt from 'jsonwebtoken';

export const APP_SECRET = 'change-this-soon';

// Retrieve Authorization header, verify JWT, retrieve User's ID from JWT
// Protect resolvers that require auth - if process is not successful, throw an exception
export const getUserId = context => {
  const authorization = context.request.get('Authorization');
  if (authorization) {
    const token = authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, APP_SECRET);
    return userId;
  }

  throw new Error('Not authenticated');
};
