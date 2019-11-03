import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../utils';

const Mutation = {
  async signup(parent, args, context, info) {
    // Encrypt user's password
    const password = await bcrypt.hash(args.password, 10);
    // Use prisma client instance to store new user in the db
    const user = await context.prisma.createUser({ ...args, password });
    // Generate a JWT
    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    // Return an object adhering to the shape of AuthPayload per our GraphQL schema
    return {
      token,
      user
    };
  },

  async login(parent, args, context, info) {
    // Use prisma client instance to retrieve existing user by email or throw error if no such email in db
    const user = await context.prisma.user({ email: args.email });
    if (!user) {
      throw new Error('No such user found');
    }

    // Compare provided pw w/ that stored in the db. If no match, throw error
    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
      token,
      user
    };
  }
};

export default Mutation;
