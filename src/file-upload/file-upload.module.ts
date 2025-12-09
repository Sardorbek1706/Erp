import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { CloudinaryModule } from 'nestjs-cloudinary';

@Module({
    controllers: [FileUploadController],
})
export class FileUploadModule { }
