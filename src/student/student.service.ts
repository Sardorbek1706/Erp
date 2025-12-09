import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { MailerService } from "src/common/mailer/mailer.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CloudinaryService } from "nestjs-cloudinary";

@Injectable()
export class StudentService {
  constructor(
    private mailerService: MailerService,
    private prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) {}
  async create(createStudentDto: CreateStudentDto, photo: Express.Multer.File) {
    try {
      const checkDuplicate = await this.prisma.student.findUnique({
        where: {
          email_branchId: {
            email: createStudentDto.email,
            branchId: createStudentDto.branchId
          }
        }
      });
      if (checkDuplicate)
        throw new ConflictException(
          `THIS STUDENT EMAIL HAS ALREADY BEEN ADDED TO THIS BRANCH!`
        );
      const checkPhone = await this.prisma.student.findFirst({
        where: { phone: createStudentDto.phone }
      });
      if (checkPhone)
        throw new ConflictException(
          `THIS PHONE NUMBER ALREADY EXISTS IN THE DATABASE!`
        );
      const checkBranch = await this.prisma.branch.findUnique({where: {id: createStudentDto.branchId}})
      if(!checkBranch) throw new BadRequestException(`NOT FOUND SUCH A BRANCH ID!`)
      let imageUrl = null;
      if (photo) {
        const uploaded = await this.cloudinaryService.uploadFile(photo);
        imageUrl = uploaded.url;
      }
      const code = Math.floor(Math.random() * 1000000);
      await this.mailerService.sendEmail(
        createStudentDto.email,
        "THE VERIFICATION CODE HAS BEEN SENT TO THE EMAIL! ",
        code
      );
      const newStudent = await this.prisma.student.create({
        data: { ...createStudentDto, photo: imageUrl }
      });
      return {
        success: true,
        message: `THE STUDENT IS SUCCESSFULLY CREATED!`,
        data: newStudent
      };
    } catch (error) {
      console.log(error.message);
        throw error;
    }
  }

  async findAll() {
    try {
      const allStudents = await this.prisma.student.findMany();
      return {
        success: true,
        message: `SUCCESSFULLY RETRIEVED ALL STUDENTS FROM THE DATABASE!`,
        data: allStudents
      };
    } catch (error) {
      console.log(error.message);
        throw error;
    }
  }

  async findOne(id: string) {
    try {
      const student = await this.prisma.student.findUnique({ where: { id } });
      if (!student) throw new NotFoundException(`NOT FOUND SUCH A STUDENT ID!`);
      return {
        success: true,
        message: `SUCCESSFULLY RETRIEVED THE STUDENT FROM THE DATABASE`,
        data: student
      };
    } catch (error) {
      console.log(error.message);
        throw error;
    }
  }

  async update(id: string, updateStudentDto: UpdateStudentDto, photo: Express.Multer.File) {
    try {
      const student = await this.prisma.student.findUnique({ where: { id } });
      if (!student) {
        throw new NotFoundException(`NOT FOUND SUCH A STUDENT ID!`)
      };
      const branchId = updateStudentDto.branchId
      if(branchId){
         const checkBranch = await this.prisma.branch.findUnique({where: {id: branchId}})
         if(!checkBranch) {
          throw new NotFoundException(`NOT FOUND SUCH A BRANCH ID!`)
        }
      }
     if(photo){
        const {url} = await this.cloudinaryService.uploadFile(photo)
            updateStudentDto.photo = url
     }
     const updatedStudent = await this.prisma.student.update({where: {id}, data: {...updateStudentDto}})
     return {
      success: true,
      message: `SUCCESSFULLY UPDATED THE STUDENT!`,
      data: updatedStudent
     }
    } catch (error) {
       console.log(error.message);
         throw error;
    }
  }

  async remove(id: string) {
    try {
      const student = await this.prisma.student.findUnique({ where: { id } });
      if (!student) throw new NotFoundException(`NOT FOUND SUCH A STUDENT ID!`);
      await this.prisma.student.delete({where: {id}})
      return {
        success: true,
        message: `SUCCESSFULLY DELETED THE STUDENT`
      }
    } catch (error) {
     console.log(error.message);
     throw error;
    }
  }
}
