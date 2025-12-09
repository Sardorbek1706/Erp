import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';


@Injectable()
export class AppService {
  constructor(private  prisma: PrismaService){}
  async getHello(): Promise<object> {
    const branches = await this.prisma.branch.findMany()
    return branches;
  }
}
