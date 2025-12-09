import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TeacherGroupService } from './teacher-group.service';
import { CreateTeacherGroupDto } from './dto/create-teacher-group.dto';
import { UpdateTeacherGroupDto } from './dto/update-teacher-group.dto';

@Controller('teacher-group')
export class TeacherGroupController {
  constructor(private readonly teacherGroupService: TeacherGroupService) {}

  @Post()
  create(@Body() createTeacherGroupDto: CreateTeacherGroupDto) {
    return this.teacherGroupService.create(createTeacherGroupDto);
  }

  @Get()
  findAll() {
    return this.teacherGroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teacherGroupService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeacherGroupDto: UpdateTeacherGroupDto) {
    return this.teacherGroupService.update(+id, updateTeacherGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teacherGroupService.remove(+id);
  }
}
