import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import * as multer from 'multer';
import type { Express } from 'express';

@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  @UseInterceptors(FileInterceptor('logo', { storage: multer.memoryStorage(),  fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);}}))
  create(@UploadedFile() logo: Express.Multer.File, @Body() createBranchDto: CreateBranchDto) {
    return this.branchService.create(createBranchDto, logo);
  }

  @Get()
  findAll() {
    return this.branchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.branchService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('logo'))
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto, logo: Express.Multer.File) {
    return this.branchService.update(id, updateBranchDto, logo);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('force') force?: string) {
    return this.branchService.remove(id, force === 'true');
  }
}
