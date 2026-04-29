import { IsString, IsOptional } from 'class-validator';
import { baseAuthDto } from './base.dto';

export class RegistrDto extends baseAuthDto {
  @IsString()
  @IsOptional()
  fullname!: string;
}
