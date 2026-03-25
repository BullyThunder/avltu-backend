import { IsEmail, IsString, MinLength } from 'class-validator';

export class baseAuthDto {
  @IsEmail({}, { message: 'Incorrent format email' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password is too short' })
  password!: string;
}
