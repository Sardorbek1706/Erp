import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'nestjs-cloudinary';
import type { Express } from 'express';
import * as multer from 'multer';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.memoryStorage(),
     fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      return cb(new BadRequestException('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, 
  }))
  async create(@UploadedFile() file: Express.Multer.File) {
    const { url } = await this.cloudinaryService.uploadFile(file);
    return { url };
  };
}
