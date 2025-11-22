import { IsOptional, IsString, IsEmail, IsArray, IsInt } from 'class-validator';

export class CreateContactDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;
  
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  companyIds?: number[];
}
