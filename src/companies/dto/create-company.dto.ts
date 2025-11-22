import { IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  domain?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
