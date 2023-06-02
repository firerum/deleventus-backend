import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PgService } from 'src/pg/pg.service';

let token = '';
let userId = '';
let eventId = '';

afterAll(async () => {
  const pg = new PgService();

  await pg.pool.query('DELETE FROM user_entity WHERE email = $1', [
    'kaindoe@example.com',
  ]);

  await pg.pool.query('DELETE FROM event_entity WHERE owner_id = $1', [userId]);

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

  describe('Auth controller', () => {
    it('should sign up new user (POST)', async () => {
      const response = await server.post('/api/auth/signup').send({
        first_name: 'kain',
        last_name: 'Doe',
        email: 'kaindoe@example.com',
        password: '123456',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.first_name).toBe('kain');
      expect(response.body.email).toBe('kaindoe@example.com');
    });

    it('should login new user (POST)', async () => {
      const response = await server.post('/api/auth/signin').send({
        email: 'kaindoe@example.com',
        password: '123456',
      });

      token = response.body.token;
      userId = response.body.id;

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.first_name).toBe('kain');
      expect(response.body.email).toBe('kaindoe@example.com');
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
          date_of_event: '2',
          description: 'this is a test event.',
          visibility: 'private',
          owner_id: userId,
        })
        .set('Authorization', `Bearer ${token}`);
      eventId = response.body.id;

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('test event');
      expect(response.body.description).toBe('this is a test event.');
    });

    it('should get all events (GET)', async () => {
      const response = await server
        .get('/api/events')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    it('should get a single event (GET)', async () => {
      // Assuming an event with ID 1 exists
      const response = await server
        .get(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('description');
      expect(response.body.comments).toBeInstanceOf(Array);
    });

    it('should update an event (PUT)', async () => {
      // Assuming an event with ID 1 exists
      const response = await server
        .put(`/api/events/${eventId}`)
        .send({
          name: 'Updated Event',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('updated event');
      expect(response.body).toHaveProperty('description');
    });

    it('should delete event (DELETE)', async () => {
      // Assuming an event with ID 1 exists
      const response = await server
        .delete(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);
    });
  });

  describe('User Controller', () => {
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
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('first_name');
      expect(response.body).toHaveProperty('email');
      expect(response.body.events).toBeInstanceOf(Array);
    });

    it('should update the user (PUT)', async () => {
      // Assuming a user with ID 1 exists
      const response = await server
        .put(`/api/users/${userId}`)
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
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });
});
