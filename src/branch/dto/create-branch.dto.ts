import { Status } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBranchDto {
  @IsString()
  @IsNotEmpty()
  name: string;

 
  @IsOptional()
  logo: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  
    @IsOptional()
    @IsEnum(Status)
    status: Status
}
