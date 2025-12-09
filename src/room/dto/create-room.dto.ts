import { Status } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  capacity: number;

  @IsUUID()
  @IsNotEmpty()
  branchId: string;

    @IsOptional()
    @IsEnum(Status)
    status: Status
}
