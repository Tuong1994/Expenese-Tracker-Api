import { IsNotEmpty } from 'class-validator';

export class WardDto {
  @IsNotEmpty()
  nameEn: string;

  @IsNotEmpty()
  nameVn: string

  @IsNotEmpty()
  code: number;

  @IsNotEmpty()
  districtCode: number;
}
