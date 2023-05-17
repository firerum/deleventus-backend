import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PgService } from 'src/pg/pg.service';

let token = '';
let id = '';

afterAll(async () => {
  const pg = new PgService();

  await pg.pool.query('DELETE FROM user_entity WHERE email = $1', [
    'kaindoe@example.com',
  ]);

  await pg.pool.query('DELETE FROM event_entity WHERE user_id = $1', [id]);

  pg.pool.end();
});

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: request.SuperTest<request.Test>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();

    server = request(app.getHttpServer());
  });

  describe('User Controller', () => {
    it('should sign up new user (POST)', async () => {
      const response = await server.post('/api/auth/signup').send({
        first_name: 'kain',
        last_name: 'Doe',
        email: 'kaindoe@example.com',
        password: '123456',
      });
      token = response.body.token;
      id = response.body.id;

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.first_name).toBe('kain');
      expect(response.body.email).toBe('kaindoe@example.com');
    });

    it('should get all users (GET)', async () => {
      const response = await server
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    it('should get single user (GET)', async () => {
      // Assuming a user with ID 1 exists
      const response = await server
        .get(`/api/users/${id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('first_name');
      expect(response.body).toHaveProperty('email');
    });

    it('should update the user (PUT)', async () => {
      // Assuming a user with ID 1 exists
      const response = await server
        .put(`/api/users/${id}`)
        .send({
          first_name: 'Updated Name',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.first_name).toBe('updated name');
      expect(response.body).toHaveProperty('email');
    });

    it('should delete the user (DELETE)', async () => {
      const response = await server
        .delete(`/api/users/${id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });

  // Events Tests
  describe('Event Controller', () => {
    it('should create new event (POST)', async () => {
      const response = await server
        .post('/api/events')
        .send({
          name: 'Test Event',
          category: 'wedding',
          venue: 'ilasamoja, Lagos',
          date_of_event: '2023-05-08 17:36:48.031+01',
          description: 'This is a test event.',
          visibility: 'private',
          user_id: id,
        })
        .set('Authorization', `Bearer ${token}`);
      console.log(response.body);
      console.log(id);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test Event');
      expect(response.body.description).toBe('This is a test event.');
    });

    it('should get all events (GET)', async () => {
      const response = await server
        .get('/api/events')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    it('/events/:id (GET)', async () => {
      // Assuming an event with ID 1 exists
      const response = await server.get('/events/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('description');
    });

    it('/events/:id (PUT)', async () => {
      // Assuming an event with ID 1 exists
      const response = await server.put('/events/1').send({
        title: 'Updated Event',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Updated Event');
      expect(response.body).toHaveProperty('description');
    });

    it('/events/:id (DELETE)', async () => {
      // Assuming an event with ID 1 exists
      const response = await server.delete('/events/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'Event deleted successfully',
      );
    });
  });
});
