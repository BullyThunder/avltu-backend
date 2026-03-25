import {
  IsString,
  IsNumber,
  MinLength,
  Min,
  IsNotEmpty,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'Name mustn`t be empty' })
  @MinLength(3, { message: 'Mame is too short' })
  title!: string;
  @IsNumber()
  @Min(1, { message: 'The weight must be at least 1 kg' })
  weight!: number;
  @IsString()
  @IsNotEmpty()
  origin!: string;
  @IsString()
  @IsNotEmpty()
  destination!: string;
}
