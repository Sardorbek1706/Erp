import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}
    async create(createCourseDto: CreateCourseDto) {
      try {
        const checkDuplicate = await this.prisma.course.findUnique({
          where: { name_branchId: {name: createCourseDto.name, branchId: createCourseDto.branchId} },
        });
        if (checkDuplicate) {
          throw new ConflictException(
            `THIS COURSE ALREADY EXISTS IN THE DATABASE!`,
          );
        }
        const checkBranchId = await this.prisma.branch.findUnique({
          where: { id: createCourseDto.branchId },
        });
        if (!checkBranchId) throw new NotFoundException(`NOT FOUND SUCH A BRANCH ID!`);
        const newCourse = await this.prisma.course.create({
          data: createCourseDto,
        });
        return {
          success: true,
          message: `SUCCESSFULLY CREATED A NEW COURSE!`,
          data: newCourse,
        };
      } catch (error) {
        return { message: error.message };
      }
    }
  
    async findAll() {
      try {
        const courses = await this.prisma.course.findMany({
          include: { branch: true },
        });
        return {
          success: true,
          message: `SUCCESSFULLY RETRIEVED ALL THE COURSES!`,
          data: courses,
        };
      } catch (error) {
        return { message: error.message };
      }
    }
  
    async findOne(id: string) {
      try {
        const checkId = await this.prisma.course.findUnique({ where: { id } });
        if (!checkId) throw new NotFoundException(`NOT FOUND SUCH A COURSE ID!`);
        const course = await this.prisma.course.findUnique({
          where: { id },
          include: { branch: true },
        });
        return {
          success: true,
          message: `SUCCESSFULLY RETRIEVED THE SEARCHED COURSE!`,
          data: course,
        };
      } catch (error) {
        return { message: error.message };
      }
    }
  
    async update(id: string, updateCourseDto: UpdateCourseDto) {
      try {
        const checkId = await this.prisma.course.findUnique({ where: { id } });
        if (!checkId) throw new NotFoundException(`NOT FOUND SUCH A COURSE ID!`);
        const name = updateCourseDto.name;
        if (name) {
          const checkDuplicate = await this.prisma.course.findUnique({
            where: { name_branchId: {name, branchId: checkId.branchId}},
          });
          if (checkDuplicate) {
            throw new ConflictException(
              `THIS COURSE NAME ALREADY EXISTS IN THE DATABASE`,
            );
          }}
          const branchId = updateCourseDto.branchId;
          if (branchId) {
            const checkId = await this.prisma.branch.findUnique({
              where: { id: branchId },
            });
            if (!checkId) throw new NotFoundException(`NOT FOUND SUCH A BRANCH ID!`);
          }
          const updatedCourse = await this.prisma.course.update({
            where: { id },
            data: { ...updateCourseDto },
            include: { branch: true },
          });
          return {
            success: true,
            message: `SUCCESSFULLY UPDATED THE COURSE`,
            data: updatedCourse,
          };
        }
       catch (error) {
        return { message: error.message };
      }
    }
  
    async remove(id: string) {
      try {
        const checkId = await this.prisma.course.findUnique({ where: { id } });
        if (!checkId) throw new NotFoundException(`NOT FOUND SUCH A COURSE ID!`);
        await this.prisma.course.delete({ where: { id } });
        return {
          success: true,
          message: `SUCCESSFULLY DELETED THE COURSE ID: ${id}`,
        };
      } catch (error) {
        return { message: error.message };
      }
    }
}
