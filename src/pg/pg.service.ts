import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class PgService {
  readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USERNAME,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
  }
}
