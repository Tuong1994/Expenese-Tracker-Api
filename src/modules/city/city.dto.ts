import { IsNotEmpty } from 'class-validator';

export class CityDto {
  @IsNotEmpty()
  nameEn: string;

  @IsNotEmpty()
  nameVn: string;

  @IsNotEmpty()
  code: number;
}
