import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  constructor(private readonly configService: ConfigService) {}

  async uploadUserAvatar() {
    return 'avatar uploaded succesfully';
  }

  async findAll(event_id: string) {
    return `all photos`;
  }
  async create(event_id: string, files: any) {
    return `photos created`;
  }
  async delete(id: string): Promise<void> {
    'photos deleted successfully';
  }
}
