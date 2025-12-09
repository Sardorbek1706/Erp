import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'nestjs-cloudinary';

@Injectable()
export class BranchService {
  constructor(private readonly prisma: PrismaService, 
      private readonly cloudinaryService: CloudinaryService
  ) {}
  async create(createBranchDto: CreateBranchDto, logo: Express.Multer.File ) {
    try {
      const checkDuplicate = await this.prisma.branch.findUnique({
        where: { name: createBranchDto.name },
      });
      if (checkDuplicate) {
        throw new ConflictException(
          `THIS BRANCH ALREADY EXISTS IN THE DATABASE!`,
        );
      }
      let imageUrl = null
      if(logo){
        const uploaded = await this.cloudinaryService.uploadFile(logo)
        imageUrl = uploaded.url
      }
      const newBranch = await this.prisma.branch.create({
        data: {...createBranchDto, logo: imageUrl},
      });
      return {
        success: true,
        message: `SUCCESSFULLY CREATED A NEW BRANCH!`,
        data: newBranch,
      };
    } catch (error) {
      return { message: error.message };
    }
  }

  async findAll() {
    try {
      const branches = await this.prisma.branch.findMany({include: { rooms: true, groups: true, courses: true }});
      return {
        success: true,
        message: `SUCCESSFULLY RETRIEVED ALL THE BRANCHES!`,
        data: branches,
      };
    } catch (error) {
      return { message: error.message };
    }
  }

  async findOne(id: string) {
    try {
        const checkId = await this.prisma.branch.findUnique({where: {id}})
        if(!checkId) throw new NotFoundException(`NOT FOUND SUCH A BRANCH ID!`)
      const branch = await this.prisma.branch.findUnique({
        where: { id },
        include: { rooms: true, groups: true, courses: true },
      });
      return {
        success: true,
        message: `SUCCESSFULLY RETRIEVED THE SEARCHED BRANCH!`,
        data: branch,
      };
    } catch (error) {
      return { message: error.message };
    }
  }

  async update(id: string, updateBranchDto: UpdateBranchDto, logo: Express.Multer.File) {
    try {
        const checkId = await this.prisma.branch.findUnique({where: {id}})
        if(!checkId) throw new NotFoundException(`NOT FOUND SUCH A BRANCH ID!`)
        const name = updateBranchDto.name
        if(name && name !== checkId.name){
          const checkDuplicate = await this.prisma.branch.findUnique({where: {name}})
          if(checkDuplicate){
            throw new ConflictException(`THIS BRANCH NAME ALREADY EXISTS IN THE DATABASE`)
          }}
          if(logo){
            const {url} = await this.cloudinaryService.uploadFile(logo)
            updateBranchDto.logo = url
          } 
          const updatedBranch = await this.prisma.branch.update({where: {id}, data: {...updateBranchDto}, include: {rooms: true, groups: true, courses: true}})
          return {
            success: true,
            message: `SUCCESSFULLY UPDATED THE BRANCH`,
            data: updatedBranch
          }
        }
     catch (error) {
         return {message: error.message};
    }
  }

  async remove(id: string, force: boolean) {
    try {
        const checkId = await this.prisma.branch.findUnique({where: {id}})
        if(!checkId) throw new NotFoundException(`NOT FOUND SUCH A BRANCH ID!`)
        const checkGroups = await this.prisma.group.findMany({where: {branchId: id}})
        const checkCourses = await this.prisma.course.findMany({where: {branchId: id}})
        const checkRooms = await this.prisma.room.findMany({where: {branchId: id}})
        if(!checkRooms || !checkCourses || !checkGroups) {
          await this.prisma.branch.delete({where: {id}})
          return {
            success: true,
            message: `SUCCESSFULLY DELETED THE BRANCH ID: ${id}`
          }
        }else{
          if(force){
            await this.prisma.group.deleteMany({where: {branchId: id}})
            await this.prisma.course.deleteMany({where: {branchId: id}})
            await this.prisma.room.deleteMany({where: {branchId: id}})
            await this.prisma.branch.delete({where: {id}})
            return {
              success: true,
              message: `SUCCESSFULLY DELETED THE BRANCH ALONG WITH ITS ROOMS, COURSES, GROUPS`
            }
          }
          throw new BadRequestException(`THIS BRANCH HAVE GROUPS, ROOMS OR COURSES, ARE YOU SURE TO DELETE ALL OF THEM ALONG WITH THE BRANCH?`)
        }
    } catch (error) {
      return {message: error.message};
    }
  }
}
