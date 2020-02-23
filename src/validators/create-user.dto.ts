import { IsString, IsEmail } from 'class-validator';

export default class CreateUserDto {
  @IsEmail()
  email: string | undefined;

  @IsString()
  password: string | undefined;
}