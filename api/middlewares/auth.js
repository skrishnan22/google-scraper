import config from 'config';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prismaClient.js';

const authBypassRoutes = ['/health', '/user/sign-up', '/user/login'];

/**
 * Middleware to authenticate requests by token
 * 1. Token should be added in headers
 * 2. Token should be valid and not expired
 * 3. User with Id extracted from token should be available in database
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const verifyToken = async (req, res, next) => {
  const jwtSecret = config?.jwt?.secret;
  const token = req.headers['authorization'];

  //Routes like signup and login should not be authenticated anyways
  if (authBypassRoutes.includes(req.path)) {
    return next();
  }
  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (!decoded.userId) {
      throw new Error('No userId in token');
    }
    const existingUser = await prisma.user.findFirst({
      where: {
        id: decoded.userId
      }
    });
    if (!existingUser) {
      throw new Error('Invalid User');
    }
    req.user = existingUser;
  } catch (err) {
    console.log(err);
    return res.status(401).send('Invalid Token');
  }
  return next();
};

export default verifyToken;
