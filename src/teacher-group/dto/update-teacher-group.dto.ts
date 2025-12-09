import { PartialType } from '@nestjs/mapped-types';
import { CreateTeacherGroupDto } from './create-teacher-group.dto';

export class UpdateTeacherGroupDto extends PartialType(CreateTeacherGroupDto) {}
