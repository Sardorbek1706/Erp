import { Status } from '@prisma/client';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @IsNotEmpty()
  courseId: string;

  @IsNotEmpty()
  @IsDate()
  @Type(()=> Date)
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(()=> Date)
  endDate: Date;

  @IsUUID()
  @IsNotEmpty()
  branchId: string;

  @IsUUID()
  @IsNotEmpty()
  roomId: string;

  @IsOptional()
  @IsEnum(Status)
  status: Status
}
