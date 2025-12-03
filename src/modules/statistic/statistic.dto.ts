import { IsOptional } from 'class-validator';

export class StatisticDto {
  @IsOptional()
  startDate?: string;

  @IsOptional()
  endDate?: string;
}
