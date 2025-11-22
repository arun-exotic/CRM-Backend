import {
    IsString,
    IsNumber,
    IsInt,
    IsArray,
    IsOptional,
  } from 'class-validator';
  
  export class CreateDealDto {
    @IsString()
    title: string;
  
    @IsString()
    @IsOptional()
    stage?: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  
    @IsNumber()
    amount: number;
  
    @IsInt()
    companyId: number;
  
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    contactIds?: number[];
  }
  