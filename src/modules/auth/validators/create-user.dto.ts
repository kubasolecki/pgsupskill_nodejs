import { IsString, IsEmail } from 'class-validator';

export default class CreateUserDto {
  @IsEmail()
  email = '';

  @IsString()
  password = '';
}