import { Status } from "@prisma/client"
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID } from "class-validator"

export class CreateStudentDto {

  @IsString()
  @IsNotEmpty()
  fullName: string

  @IsOptional()
  photo: string

  @IsEmail()
  @IsNotEmpty()
  email: string
  
  @IsPhoneNumber("UZ")
  @IsNotEmpty()
  phone : string  
  
  
  @IsString()
  @IsNotEmpty()
  password : string

  @IsUUID()
  @IsNotEmpty()
  branchId: string

  @IsEnum(Status)
  @IsOptional()
  status: Status
}
