import { IsNotEmpty } from 'class-validator';

export class DistrictDto {
  @IsNotEmpty()
  nameEn: string;

  @IsNotEmpty()
  nameVn: string;

  @IsNotEmpty()
  code: number;

  @IsNotEmpty()
  cityCode: number;
}
