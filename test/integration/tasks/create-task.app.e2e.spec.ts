import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication, ValidationPipe} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from "../../../src/app.module";
import {User} from "../../../src/users/entity/user.entity";
import {
  UserRepositoryORM
} from "../../../src/users/repository/user.repository.orm";
import {Role} from "../../../src/users/entity/role.enum";

describe('TaskController (e2e) [POST] /task', () => {
  let app: INestApplication;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      validateCustomDecorators: true,
    }));

    await app.init();
  });

  it('Should fail - no authentication', async function () {
    await request(app.getHttpServer())
        .post('/task')
        .expect(401);

  });

  it('Should fail - no authorization', async function () {
    const user = new User(
        'foo',[Role.Manager],'bar', 'apiKey', Promise.resolve([])
    );
    await moduleRef.get<UserRepositoryORM>(UserRepositoryORM).persist(user);

    await request(app.getHttpServer())
        .post('/task')
        .set({Authorization: 'apiKey'})
        .expect(403);
  });

  it('Should fail - bad request - missing field {summary}', async function () {
    const user = new User(
        'foo',[Role.Technician],'bar', 'apiKey', Promise.resolve([])
    );
    await moduleRef.get<UserRepositoryORM>(UserRepositoryORM).persist(user);

    await request(app.getHttpServer())
        .post('/task')
        .send({ not_summary: 123 })
        .set({Authorization: 'apiKey'})
        .expect(400)
        .then((response) => {
          expect(response.body.message).toStrictEqual(
              [
                'summary must be longer than or equal to 1 characters',
                'summary must be a string',
                'summary should not be empty'
              ]);
        })
  });

  it('Should fail - bad request - empty field {summary}', async function () {
    const user = new User(
        'foo',[Role.Technician],'bar', 'apiKey', Promise.resolve([])
    );
    await moduleRef.get<UserRepositoryORM>(UserRepositoryORM).persist(user);

    await request(app.getHttpServer())
        .post('/task')
        .send({ summary: '' })
        .set({Authorization: 'apiKey'})
        .expect(400)
        .then((response) => {
          expect(response.body.message).toStrictEqual(
              [
                  'summary must be longer than or equal to 1 characters',
                  'summary should not be empty'
              ]);
        })
  });

  it('Success - created a new task', async function () {
    const user = new User(
        'foo',[Role.Technician],'bar', 'apiKey', Promise.resolve([])
    );
    await moduleRef.get<UserRepositoryORM>(UserRepositoryORM).persist(user);

    await request(app.getHttpServer())
        .post('/task')
        .send({ summary: 'this is a demo task' })
        .set({Authorization: 'apiKey'})
        .then((response) => {
          expect(response.body.id).toBe(1);
          expect(response.body.summary).toBe('this is a demo task');
          expect(response.body.userId).toBeDefined();
          expect(response.body.createdAt).toBeDefined();
          expect(response.body.updatedAt).toBeDefined();
        });
  });
});