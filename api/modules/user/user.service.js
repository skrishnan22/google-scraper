import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
import prisma from '../../utils/prismaClient.js';

const SALT_ROUNDS = 10;

class UserService {
  validateCreateUser(userDetails = {}) {
    const emailRegex = new RegExp(
      "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
    );

    const requiredFields = ['name', 'email', 'password'];
    for (const field of requiredFields) {
      if (!userDetails[field]) {
        throw new Error(`${field} is required for creating user`);
      }
    }
    if (userDetails?.password?.length < 6) {
      throw new Error('Password should have atleast 6 characters');
    }
    const isValidEmail = emailRegex.test(userDetails?.email?.toLowerCase());
    if (!isValidEmail) {
      throw new Error(`${userDetails.email} is not a valid email address`);
    }
  }

  async create(userDetails) {
    this.validateCreateUser(userDetails);
    const existingUser = await prisma.user.findFirst({
      where: {
        email: userDetails.email
      }
    });
    if (existingUser) {
      throw new Error(`User with email ${userDetails.email} already exists`);
    }
    const hashedPassword = await this.generatePasswordHash(userDetails.password);
    userDetails.password = hashedPassword;

    return prisma.user.create({ data: userDetails });
  }

  async generatePasswordHash(password) {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  }

  async login(email, password) {
    const existingUser = await prisma.user.findFirst({
      where: {
        email
      }
    });

    if (!existingUser) {
      throw new Error(`User with email ${email} does not exist`);
    }

    const passwordFromDB = existingUser.password;
    const isCorrectPassword = await bcrypt.compare(password, passwordFromDB);
    if (!isCorrectPassword) {
      throw new Error('Incorrect password');
    }
    delete existingUser.password;
    return existingUser;
  }

  getJWTToken(user) {
    return jwt.sign({ userId: user.id }, config?.jwt?.secret, { expiresIn: '1d' });
  }
}

export default new UserService();
