import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { BranchModule } from "./branch/branch.module";
import { RoomModule } from "./room/room.module";
import { CourseModule } from "./course/course.module";
import { GroupModule } from "./group/group.module";
import { FileUploadModule } from "./file-upload/file-upload.module";
import { CloudinaryModule } from "nestjs-cloudinary";
import { ConfigService } from "@nestjs/config";
import { ConfigModule } from "@nestjs/config";
import { TeacherModule } from './teacher/teacher.module';
import { StudentModule } from './student/student.module';
import { StaffModule } from './staff/staff.module';
import { StudentGroupModule } from './student-group/student-group.module';
import { TeacherGroupModule } from './teacher-group/teacher-group.module';

@Module({
  imports: [
    PrismaModule,
    BranchModule,
    RoomModule,
    CourseModule,
    GroupModule,
    FileUploadModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CloudinaryModule.forRootAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        cloud_name: configService.get("CLOUD_NAME"),
        api_key: configService.get("API_KEY"),
        api_secret: configService.get("API_SECRET")
      })
    }),
    TeacherModule,
    StudentModule,
    StaffModule,
    StudentGroupModule,
    TeacherGroupModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
