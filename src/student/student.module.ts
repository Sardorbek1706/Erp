import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { MailerModule } from 'src/common/mailer/mailer.module';

@Module({
  imports: [MailerModule],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
