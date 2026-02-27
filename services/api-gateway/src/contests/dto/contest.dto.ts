import { IsString, IsOptional, IsEnum, IsDateString, IsNumber, IsBoolean, IsUrl } from 'class-validator';
import { ContestCategory } from '@prisma/client';

export class CreateContestDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsUrl()
  coverImage: string;

  @IsEnum(ContestCategory)
  category: ContestCategory;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  prize?: string;

  @IsOptional()
  @IsString()
  rules?: string;

  @IsOptional()
  @IsNumber()
  maxContestants?: number;

  @IsOptional()
  @IsNumber()
  votesPerUser?: number;

  @IsOptional()
  @IsBoolean()
  isPublicResults?: boolean;

  @IsOptional()
  @IsString()
  organizerId?: string;
}

export class UpdateContestDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsUrl()
  coverImage?: string;

  @IsOptional()
  @IsEnum(ContestCategory)
  category?: ContestCategory;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  prize?: string;

  @IsOptional()
  @IsString()
  rules?: string;

  @IsOptional()
  @IsNumber()
  maxContestants?: number;

  @IsOptional()
  @IsNumber()
  votesPerUser?: number;

  @IsOptional()
  @IsBoolean()
  isPublicResults?: boolean;
}

export class ContestQueryDto {
  @IsOptional()
  @IsEnum(ContestCategory)
  category?: ContestCategory;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}

