import { IsString, IsEmail } from 'class-validator';

export default class RegisterUserDto {
  @IsEmail()
  email = '';

  @IsString()
  password = '';
}