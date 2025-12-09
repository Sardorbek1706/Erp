import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { CreateGroupDto } from "./dto/create-group.dto";
import { UpdateGroupDto } from "./dto/update-group.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createGroupDto: CreateGroupDto) {
    try {
      const checkDuplicate = await this.prisma.group.findUnique({
        where: {
          name_branchId: {
            name: createGroupDto.name,
            branchId: createGroupDto.branchId
          }
        }
      });
      if (checkDuplicate) {
        throw new ConflictException(
          `THIS GROUP ALREADY EXISTS IN THE DATABASE!`
        );
      }
      const checkBranchId = await this.prisma.branch.findUnique({
        where: { id: createGroupDto.branchId }
      });
      if (!checkBranchId)
        throw new NotFoundException(`NOT FOUND SUCH A BRANCH ID!`);
      const checkCourseId = await this.prisma.course.findUnique({
        where: { id: createGroupDto.courseId }
      });
      if (!checkCourseId)
        throw new NotFoundException(`NOT FOUND SUCH A COURSE ID!`);
      const newGroup = await this.prisma.group.create({
        data: {
          name: createGroupDto.name,
          startDate: new Date(createGroupDto.startDate),
          endDate: new Date(createGroupDto.endDate),
          courseId: createGroupDto.courseId,
          roomId: createGroupDto.roomId,
          branchId: createGroupDto.branchId
        }
      });
      return {
        success: true,
        message: `SUCCESSFULLY CREATED A NEW GROUP!`,
        data: newGroup
      };
    } catch (error) {
      return { message: error.message };
    }
  }

  async findAll() {
    try {
      const groups = await this.prisma.group.findMany({
        include: { branch: true, course: true }
      });
      return {
        success: true,
        message: `SUCCESSFULLY RETRIEVED ALL THE GROUPS!`,
        data: groups
      };
    } catch (error) {
      return { message: error.message };
    }
  }

  async findOne(id: string) {
    try {
      const checkId = await this.prisma.group.findUnique({ where: { id } });
      if (!checkId) throw new NotFoundException(`NOT FOUND SUCH A GROUP ID!`);
      const group = await this.prisma.group.findUnique({
        where: { id },
        include: { branch: true, course: true }
      });
      return {
        success: true,
        message: `SUCCESSFULLY RETRIEVED THE SEARCHED GROUP!`,
        data: group
      };
    } catch (error) {
      return { message: error.message };
    }
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    try {
      const checkId = await this.prisma.group.findUnique({ where: { id } });
      if (!checkId) throw new NotFoundException(`NOT FOUND SUCH A GROUP ID!`);
      const name = updateGroupDto.name;
      if (name) {
        const checkDuplicate = await this.prisma.group.findUnique({
          where: { name_branchId: { name: name, branchId: checkId.branchId } }
        });
        if (checkDuplicate) {
          throw new ConflictException(
            `THIS GROUP NAME ALREADY EXISTS IN THE DATABASE`
          );
        }
      }
      const branchId = updateGroupDto.branchId;
      if (branchId) {
        const checkId = await this.prisma.branch.findUnique({
          where: { id: branchId }
        });
        if (!checkId)
          throw new NotFoundException(`NOT FOUND SUCH A BRANCH ID!`);
      }
      const courseId = updateGroupDto.courseId;
      if (courseId) {
        const checkCourseId = await this.prisma.course.findUnique({
          where: { id: courseId }
        });
        if (!checkCourseId)
          throw new NotFoundException(`NOT FOUND SUCH A COURSE ID!`);
      }
      const roomId = updateGroupDto.roomId;
      if (roomId) {
        const checkRoomId = await this.prisma.room.findUnique({
          where: { id: roomId }
        });
        if (!checkRoomId)
          throw new NotFoundException(`NOT FOUND SUCH A ROOM ID!`);
      }
      const updatedGroup = await this.prisma.group.update({
        where: { id },
        data: { ...updateGroupDto },
        include: { branch: true, course: true }
      });
      return {
        success: true,
        message: `SUCCESSFULLY UPDATED THE GROUP`,
        data: updatedGroup
      };
    } catch (error) {
      return { message: error.message };
    }
  }

  async remove(id: string, force: boolean) {
    try {
      const checkId = await this.prisma.group.findUnique({ where: { id } });
      if (!checkId) throw new NotFoundException(`NOT FOUND SUCH A GR0UP ID!`);
      const checkCourses = await this.prisma.course.findMany({
        where: { id: checkId.courseId }
      });
      if (checkCourses.length === 0) {
        await this.prisma.group.delete({ where: { id } });
        return {
          success: true,
          message: `SUCCESSFULLY DELETED THE GROUP ID: ${id}`
        };
      } else {
        if (force) {
          await this.prisma.course.deleteMany({
            where: { id: checkId.courseId }
          });
          return {
            success: true,
            message: `SUCCESSFULLY DELETED THE GROUP ALONG WITH ITS COURSES`
          };
        } else {
          throw new BadRequestException(
            `THIS GROUP HAVE COURSES, ARE YOU SURE TO DELETE ALL OF THEM ALONG WITH THE GROUP?`
          );
        }
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
