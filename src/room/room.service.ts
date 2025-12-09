import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createRoomDto: CreateRoomDto) {
    try {
      const checkDuplicate = await this.prisma.room.findUnique({
        where: { name_branchId: {name: createRoomDto.name, branchId: createRoomDto.branchId }},
      });
      if (checkDuplicate) {
        throw new ConflictException(
          `THIS ROOM ALREADY EXISTS IN THE DATABASE!`,
        );
      }
      const checkBranchId = await this.prisma.branch.findUnique({
        where: { id: createRoomDto.branchId },
      });
      if (!checkBranchId)
        throw new NotFoundException(`NOT FOUND SUCH A BRANCH ID!`);
      const newRoom = await this.prisma.room.create({
        data: createRoomDto,
      });
      return {
        success: true,
        message: `SUCCESSFULLY CREATED A NEW ROOM!`,
        data: newRoom,
      };
    } catch (error) {
      return { message: error.message };
    }
  }

  async findAll() {
    try {
      const rooms = await this.prisma.room.findMany({
        include: { branch: true },
      });
      return {
        success: true,
        message: `SUCCESSFULLY RETRIEVED ALL THE ROOMS!`,
        data: rooms,
      };
    } catch (error) {
      return { message: error.message };
    }
  }

  async findOne(id: string) {
    try {
      const checkId = await this.prisma.room.findUnique({ where: { id } });
      if (!checkId) throw new NotFoundException(`NOT FOUND SUCH A ROOM ID!`);
      const room = await this.prisma.room.findUnique({
        where: { id },
        include: { branch: true },
      });
      return {
        success: true,
        message: `SUCCESSFULLY RETRIEVED THE SEARCHED ROOM!`,
        data: room,
      };
    } catch (error) {
      return { message: error.message };
    }
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    try {
      const checkId = await this.prisma.room.findUnique({ where: { id } });
      if (!checkId) throw new NotFoundException(`NOT FOUND SUCH A ROOM ID!`);
      const name = updateRoomDto.name;
      if (name) {
        const checkDuplicate = await this.prisma.room.findUnique({
          where: { name_branchId: {name, branchId: checkId.branchId} },
        });
        if (checkDuplicate) {
          throw new ConflictException(
            `THIS ROOM NAME ALREADY EXISTS IN THE DATABASE`,
          );
        }}
        const branchId = updateRoomDto.branchId;
        if (branchId) {
          const checkId = await this.prisma.branch.findUnique({
            where: { id: branchId },
          });
          if (!checkId)
            throw new NotFoundException(`NOT FOUND SUCH A BRANCH ID!`);
        }
        const updatedRoom = await this.prisma.room.update({
          where: { id },
          data: { ...updateRoomDto },
          include: { branch: true },
        });
        return {
          success: true,
          message: `SUCCESSFULLY UPDATED THE ROOM`,
          data: updatedRoom,
        };
      }
    catch (error) {
      return { message: error.message };
    }
  }

  async remove(id: string) {
    try {
      const checkId = await this.prisma.room.findUnique({ where: { id } });
      if (!checkId) throw new NotFoundException(`NOT FOUND SUCH A ROOM ID!`);
      await this.prisma.room.delete({ where: { id } });
      return {
        success: true,
        message: `SUCCESSFULLY DELETED THE ROOM ID: ${id}`,
      };
    } catch (error) {
      return { message: error.message };
    }
  }
}
