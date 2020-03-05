import { hashPassword } from './../../auth/services/auth.service';
import UserModel from '../models/user.model';
import { UserTypes } from '../user';

export const findByEmail = async (email?: string) =>
  await UserModel.findOne({ email });

export const createUser = async (user: UserTypes.CreateUser) => {
  const hashedPassword = await hashPassword(user.password);

  return await UserModel.create({
    ...user,
    password: hashedPassword,
  });
};
