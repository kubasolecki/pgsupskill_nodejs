import { IsString, IsEmail } from 'class-validator';

export default class RegisterUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  password?: string;

  @IsString()
  confirmPassword?: string;
}