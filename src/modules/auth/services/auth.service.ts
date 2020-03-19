import { Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { AuthTypes } from '../auth';
import config from '../../../../env';
import WrongCredentialsException from '../exceptions/wrong-credentials.exception';
import env from '../../../../env';
import { RepositoryService } from '../../../common/repository.service';
import UserModel from '../models/user-auth.model';
import RegisterUserDto from '../validators/register-user.dto';

interface IAuthService {
  findByEmail(email: string): Promise<RegisterUserDto>;
  checkCredentials(user: AuthTypes.LoginUser): Promise<RegisterUserDto>;
}

export class AuthService extends RepositoryService <
  AuthTypes.User,
  RegisterUserDto
> implements IAuthService{
  private readonly SALT_OR_ROUNDS = 10;

  constructor() {
    super(UserModel);
  }

  protected mapModelToDto({ email }: AuthTypes.User): RegisterUserDto {
    return {
      email,
    };
  }

  protected mapDtoToModel(dto: RegisterUserDto): Partial<AuthTypes.User> {
    return dto;
  }

  async findByEmail(email: string) {
    const foundUser = await UserModel.findOne({ email });
    if (!foundUser) {
      throw new WrongCredentialsException();
    }
    return this.mapModelToDto(foundUser);
  }

  authorizeUser(user: AuthTypes.User, response: Response) {
    const tokenData = this.createToken(user);
    response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
  }

  logout(response: Response) {
    response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
  }

  async checkCredentials(user: AuthTypes.LoginUser) {
    const foundUser = await this.findByEmail(user.email);

    if (!foundUser) {
      throw new WrongCredentialsException();
    }

    if (!(await this.isPasswordMatching(user.password, foundUser.password))) {
      throw new WrongCredentialsException();
    }

    return foundUser;
  }

  hashPassword(password: string) {
    return bcrypt.hash(password, this.SALT_OR_ROUNDS);
  }

  private async isPasswordMatching(
    password: string,
    compareToPassword: string
  ) {
    return await bcrypt.compare(password, compareToPassword);
  }

  private createToken(user: AuthTypes.User): AuthTypes.TokenData {
    const expiresIn = env.TOKEN_EXPIRES_IN;
    const secret = config.JWT_SECRET;
    const dataStoredInToken: AuthTypes.DataStoredInToken = {
      _id: user._id,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  private createCookie(tokenData: AuthTypes.TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }
}
