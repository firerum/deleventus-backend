import { Injectable } from '@nestjs/common';

@Injectable()
export class PhotosService {
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
