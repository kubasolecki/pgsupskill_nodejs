import { IsString, IsEmail } from 'class-validator';

export default class CreateUserDto {
  @IsString()
  name = ''

  @IsEmail()
  email = '';
}