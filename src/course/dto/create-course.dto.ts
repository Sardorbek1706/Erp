import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';
import { CourseLevel } from '@prisma/client';
import { Status } from '@prisma/client';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price: number;

  @IsEnum(CourseLevel)
  @IsNotEmpty()
  level: CourseLevel;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  durationMonth: number;

  @IsUUID()
  @IsNotEmpty()
  branchId: string;

  @IsOptional()
  @IsEnum(Status)
  status: Status
}

